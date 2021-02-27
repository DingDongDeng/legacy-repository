var request = require('request');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var spawn = require("child-process-promise").spawn;
const hbjs = require('handbrake-js')

var using_portArr = require('../../socket_server/professor/variable').using_portArr;

var socketServer = require('../../socket_server/professor/ws_professor');

//1.교수가 실시간 스트리밍을 누름
//2.해당 강의실의 정보를 얻음(강의실) //쿼리__ 
//3.라즈베리파이의 상태(현제 스트리밍실행유무)--이름과 카메라 종류 req__
//4. 상태값에 따른 요청(req_post)--stream _true{스트림중일떄}, _false{스트림안할때}
//* 스트림안할때

// 초기화된 객체에 요청이 들어올때마다 갱신해야함 (요청에 따른 데이터 갱신 필요)
//5. 스트리밍중이 아니라면 연결할 mpeg서버 생성
//6. mpeg서버의 포트와 스트리밍 시작 요청
//7. 스트리밍 연결
//8. mpeg ws의 포트를 웹클라이언트에 전송
    
    //각 강의실에 대한 카메라 상태 체크 필요
    //상태에 따른 동작 작성
    //상태에 따른 데이터 시나리오 작성

//라즈베리파이와 연결할 스트림 포트 생성 요청 post stream/stream 
router.post("/stream",function(req,res){ //cl->1.스트리밍 요청
// 위에 유저가 접속했을 때 유저 정보 포트에 추가하는 코드 아직 추가 안함
//강의 이름, 강의 아이디, 라즈베리 아이피, 건물이름, 건물 호수
var checkport = 0;
let result = ''
try {
    console.log('index_using_portArr',using_portArr)
for(let i=0;i<3;i++){
    if(using_portArr[i].building == req.body.buildingName){ // 해당 건물 존재 유무 판단
        console.log(using_portArr[i].Room, req.body.lectureRoomNum)
        if(using_portArr[i].Room == req.body.lectureRoomNum){ // 해당강의실 존재 유무 판단.
            if(using_portArr[i].processPID == 0){// 해당 강의실에 스트리밍 유무 판단
                console.log("error_Don't have PID"); //스트리밍 안하고 있음
                // for(var j=0;j<3;j++){
                    if(using_portArr[i].state == false){
                        using_portArr[i].state = true;
                        //스트림 연결 생성
                        checkport = using_portArr[i].port;
                        try {
                        // 자식 프로세스 넘길 데이터 목록 : 포트이름 : 건물이름 : 강의실 호수 : 저장할 파일이름(경로+이름)[확장자는 명규가] : 공유인덱스 
                        console.log('make child!!')
                        var videostreaming = spawn('node',["./routes/stream_web/stream_fun.js",using_portArr[i].port,req.body.buildingName,req.body.lectureRoomNum,req.body.filePath,i]);
                        var childProcess = videostreaming.childProcess;
                        using_portArr[i].childprocess = childProcess;
                        using_portArr[i].processPID = childProcess.pid;
                        using_portArr[i].filename = req.body.filePath
                        childProcess.stdin.setEncoding('utf8'); //인코딩 처리
                        // 자식에게 보내는 데이터 정보
                        var child_obj = {
                            record : false, //영상녹화 시작 옵션
                            record_pause : false, //영상 일시정지 옵션
                            record_stop : false //영상 중지 옵션
                        }
                        //프로세스에 넘길 데이터 (최초 신호)
                        console.log(JSON.stringify(child_obj))
                        childProcess.stdin.write(JSON.stringify(child_obj)); 
                        //스트림 받을때마다 처리
                        childProcess.stdout.on('data', function(data) {
                            // console.log('what!data :',data)
                            if(typeof(data) == "object"){
                                for(var k=0;k<3;k++){
                                    // console.log('using_portArr[k] :',using_portArr[k].processPID )
                                    if(using_portArr[k].processPID == childProcess.pid  && using_portArr[k].state == true){
                                        // console.log('stdout: ' + data); //자식프로세서에서 데이터 넘어 올떄마다 클라이언트에 맞춰서 데이터 전송해야함
                                        socketServer.broadcast(data, {binary: true},using_portArr[k].member)
                                        break;
                                    }
                                }
                            }
                        });
                        childProcess.stderr.on('data', function(data) {

                            // console.log('stderr: ' + data);
                            // console.log(data)
                            if(data.toString() == "Stream Connected"){
                                //사용자에게 스트림을 받으라고 알려줌
                                console.log("Stream Connected");
                            }
                            if(data.toString() == "write Done"){
                                console.log("write Done");
                            }
                        });
                         
                        videostreaming.then((using_portArr)=>{
                            console.log("start streamserver");
                        },(data)=>{
                            var index = data.toString().split('\`')[1]
                            index = index.substring(index.length-1,index.length)
                            console.log('안녕..1', index.substring(index.length-1,index.length));
                            // var index = data.toString().split("/")[8].substring(3,4) //교수
                            // var index = data.toString().substring(74,75); //공유객체 인덱스 파싱
                            // console.log( '나는 공유인덱스', index)
                            // if (typeof(index) != 'number') {
                            //     index = data.toString().substring(106,107); //공유객체 인덱스 파싱
                            //     console.log( '나는 공유인덱스222', index)
                            // }
                             
                            console.log('check ending',index, data)
                            console.log(using_portArr[index].record_stop)
                            if(using_portArr[index].record_stop == true) {
                                // console.log('data :',data);
                            console.log("end stream : ",index, using_portArr[index].filename);
                            // 이하 mp4 만들기
                            hbjs.spawn({ input: '.'+using_portArr[index].filename+".mpg", output: '.'+using_portArr[index].filename+'.mp4', encoder: "x264" })
                            .on('error', err => {
                                ("err"+err);
                                // invalid user input, no video found etc
                            })
                            .on('progress', progress => {
                                console.log(
                                'Percent complete: %s, ETA: %s',
                                progress.percentComplete,
                                progress.eta
                                )
                            })
                            .on('end',()=>{
                                console.log(`video make Done :${using_portArr[index].filename}`);
                                using_portArr[index].filename = ""
                                
                                var ip ="http://"+ req.body.ip,
                                    port = ":"+ 3001,
                                    url = "/stop"
                                console.log('request stop', ip, req.body.ip)
                                var options = {
                                    uri: ip+port+url,
                                    method: 'POST',
                                    body:{},
                                    json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
                                };
                                request.post(options, function(err,res,body){ 
                                    if(err){
                                        console.log(err);
                                    }
                                    console.log("done to req_end")
                                    // console.log(res); // 라즈베리 파이 문제 생길시 여기에 res 뭐라고 오는지 확인하고 예외처리 해야함
                                    // console.log(body)
                                })
                            })
                            //이하  사용중인 데이터 초기화
                            using_portArr[index].state = false
                            using_portArr[index].childprocess.kill();
                            using_portArr[index].childprocess = {}; //사용중인 스트림서버 PID객체
                            using_portArr[index].processPID = 0; //사용중인 스트림서버 PID번호
                            using_portArr[index].member = [] //영상을 보기 원하는 connection 정보
                            using_portArr[index].record = false; //영상녹화 옵션
                            using_portArr[index].record_pause = false; //영상 일시정지 옵션
                            
                            console.log('using_portArr[index] :',using_portArr[index]);
                            }
                            else {
                                console.log('비디오 녹화상태', using_portArr[index].record_stop)
                                console.log('unhandled Error :',  data)
                            }
                        })
                    } catch (err) {
                        console.log(err);
                    }
                        //라즈베리파이에 접속해야할 포트 알려줌
                        //var ip ="http://"+req.body.ip,
                        var ip ="http://"+req.body.ip,
                            url = "/video"
                            // port = ":"+ 3001,
                    console.log('나는 라즈베리야 ', ip+url,using_portArr[i].port)
                        var options = {
                            uri: ip+url,
                            method: 'POST',
                            body:{
                                Camera: "C", //C A C-학생쪽 A-칠판쪽
                                Port : using_portArr[i].port
                            },
                            json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
                        };
                        request.post(options, function(err,res,body){ 
                            if(err){
                                console.log(err);
                            }
                            
                            console.log("done to req")
                            // console.log(res)
                            // console.log(res); // 라즈베리 파이 문제 생길시 여기에 res 뭐라고 오는지 확인하고 예외처리 해야함
                            // console.log(body)
                        })
                        res.writeHead(200, {"Content-Type": "text/html"});
                        res.write("Ready_Stream");
                        res.end();
                        break
                   
                    }
                // }
            }else{ //스트리밍 하고있음
                console.log("reconnect ws"); //스트리밍 중임
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write("Ready_Stream");
                res.end();
                break
                
            }
        }else{
            //잘못된 방이름
            result += 'undefined RoomName'
        }
    }else{
        result += 'undefined building Name'
        console.log("undefined building Name")
    }
}
console.log('totalError', result)

}catch(err) {
    console.log('helloerr', err)
}
})
module.exports = router;    


