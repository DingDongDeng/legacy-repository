var ws = require('ws');
var fs = require('fs');
var variable = require('./variable');
var mongoState = require('../../extend_modules/dao/state/index');
var mongoDB = require('../../extend_modules/dao/professor_web/mongoDB');

var STREAM_SECRET = "temp123", //ffmpeg 연결시 필요한 비밀번호
    WEBSOCKET_PORT = 8084, // 클라이언트 - 스트리밍 연결 (ws 연결 포트)
    SOCKETSERVER = 3001 //Web && 소캣 포트

//# 포트 범위 10개 8000~8010 까지 생성 using_portArr = new Array(10);
// var using_portArr = new Array(10);
var using_portArr = variable.using_portArr;
var width = 1280;
var height = 960;




setUsing_portArr();
console.log(using_portArr)

 function setUsing_portArr(){
    if(mongoState.connect){
        mongoDB.getLectureRoomInfo({}).then((docsPack)=>{
            const lectureRoomList = docsPack.docs
            let i = 0
            lectureRoomList.forEach((lectureRoom)=>{
                console.log(using_portArr, typeof(using_portArr))
                if(typeof (using_portArr) === null){
                    using_portArr = []
                }
                // console.log('indexNumber', i, using_portArr)
                using_portArr.push({
                    port: 8000 + i,//포트
                    state: false,//사용유무
                    building: lectureRoom.building_name,//건물이름
                    Room: lectureRoom.lectureroom_num,//사용강의실
                    childprocess: {}, //사용중인 스트림서버 PID객체 processobj ->childprocess
                    processPID: 0, //사용중인 스트림서버 PID번호
                    member: [],//영상을 보기 원하는 connection 정보
                    record: false,//영상녹화 옵션
                    filename: "",//영상 파일이름
                    record_pause: false,//영상 일시정지 옵션
                    record_stop: false//영상 일시정지 옵션
                })
                i += 1
            })
            // console.log(using_portArr)
            
            // for(let i=0; i< lectureRoomList.length; i++){
            //     const lectureRoom = lectureRoomList[i];
            //     console.log("i: " + i);
            //     using_portArr[i] = new Object();
            //     using_portArr[i].port = 8000 + i; 
            //     using_portArr[i].state = false; 
                
            //     using_portArr[i].building = lectureRoom.building_name; 
            //     using_portArr[i].Room = lectureRoom.lectureroom_num; 
                
            //     using_portArr[i].childprocess = {};
            //     using_portArr[i].processPID = 0;
            //     using_portArr[i].member = [] 
            //     using_portArr[i].record = false; 
            //     using_portArr[i].filename = "" 
            //     using_portArr[i].record_pause = false; 
            //     using_portArr[i].record_stop = false; 
            // }
        });
    }
    else{
        setTimeout(setUsing_portArr,3*1000);
    }
}


var socketServer = new (ws.Server)({port: WEBSOCKET_PORT}); //websocket Server Create __ user_connection part

socketServer.broadcast = function(data, opts,connectGroup) {//stream2. 해당되는 
    connectGroup.forEach((data_)=> {
        if (data_.readyState) {
            data_.send(data, opts);
            return true
        }
        else {
            console.log( 'Error: Client ('+data_+') not connected.' );
            return false
        }
    })
};

//클라이언트 연결단
socketServer.on('connection', function(socket) {
    // Send magic bytes and video size to the newly connected socket //최초 1회 소캣 연결시 스트리밍 기본정보
    var streamHeader = new Buffer.alloc(8); //버퍼 할당
    streamHeader.write('jsmp'); //STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes
    streamHeader.writeUInt16BE(width, 4);
    streamHeader.writeUInt16BE(height, 6);
    // socket.id = Math.floor(Math.random()*(10-1+1)) + 1; //cli 사용자 아이디 설정
    // connectGroup.push(socket);// 해당 스트림과 연결될 cli 정보 connect to mpeg stream
    socket.send(streamHeader, {binary:true});

    console.log( 'New WebSocket Connection ('+socketServer.clients.size+' total)' );
    //console.log(socketServer.clients);
    socket.on('message',(data)=>{
        //여기서 해당되는 방에 소캣을 포함시킴
        //data --> JSON 객체 { //영상 연결 데이터
        //     flag : "JOIN"
        //     building : buildingName,
        //     Room :lectureRoomNum
        // }
        var parse = JSON.parse(data)
        console.log('hello socket Signal', parse)
        console.log('hello_data.id', parse.id)
        // 공유 배열 초기화시 데이터 값의 수대로 배열 선언되게 리펙토링 해야함
        if(parse.flag == "JOIN"){
            using_portArr.some((data) => {
                if(data.building == parse.building && data.Room == parse.Room){
                    console.log('JOIN parse data')
                    console.log('1check array :',data.member.length)
                    for(let j = 0; j < data.member.length; j++) {
                        if (data.member[j].id == parse.id ) {       
                            data.member.splice(j, 1)
                        }
                    }
                    console.log('2check array :',data.member.length)
                    socket.id = parse.id // key session 값
                    data.member.push(socket)
                    console.log('3check array :',data.member, data.member.length)
                    return true
                }
            })
            console.log('hello_socket.id', socket.id)
        }
        //data --> JSON 객체 { //영상 녹화 데이터
            //  flag : "RECORD"
            //  building : buildingName,
            //  Room :lectureRoomNum,
            //  record = false, //영상녹화 옵션
            //  record_pause = false,//일시정지 옵션
            //  record_stop = false; // 영상 녹화 중지 옵션
            // }
        if(parse.flag == "RECORD"){
            try{
                using_portArr.some((data)=> {
                    if(data.building == parse.building && 
                        data.Room == parse.Room && data.state == true){
                        var recordstate = {
                            flag : "Parent",
                            record : parse.record, // 녹화유무 갱신
                            record_pause : parse.record_pause, // 녹화유무 갱신
                            record_stop : parse.record_stop //녹화 중지
                        }
                        data.record = parse.record
                        data.record_pause = parse.record_pause
                        data.record_stop = parse.record_stop
                        data.childprocess.stdin.write(JSON.stringify(recordstate));
                        console.log("RECORD to Child: " + data.record+":"+data+ " : "+JSON.stringify(parse));
                       return true
                    }else{
                        console.log('Don"t have process')
                        return false
                    }
                })
            }
            catch(err){
                console.log('socketErr',err)
            }
            
        }

    })
    socket.on('close', function(code, message){ //해당 sokcet을 배열에서 뺴줘야한다. 클라이언트 해제될때마다 실행
        // connectGroup.splice(connectGroup.indexOf(socket.id),1); // socket.id에 해당되는 요소 빼줌
        using_portArr.forEach((masterObjcet)=>{
            masterObjcet.member.forEach((memberArray)=>{
                for(let j = 0; j < memberArray.length; j++) {
                    if (memberArray[j].id == socket.id ) {       
                        memberArray.splice(j, 1)
                    }
                }
            })
        })

        console.log( 'Disconnected WebSocket ('+socketServer.clients.size+' total)' );
    });
});

// console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');

module.exports = socketServer;