
var fs = require('fs');
var send = require('request');

var STREAM_SECRET = "temp123"; //ffmpeg 연결시 필요한 비밀번호
// var using_portArr = require('../../socket_server/professor/variable').using_portArr;


var stream_make_port = process.argv[2],//새로운 스트림 설정
    buildingName = process.argv[3], // 해당 건물이름
    lectureRoom = process.argv[4], // 해당 강의실 호수
    filename = `.${process.argv[5].toString()}`, //파일이름 //경로까지 설정해줘야함
    // filename = "./test", //파일이름 //경로까지 설정해줘야함
    bigInt = parseInt(process.argv[6]); //프로세스와 사용하는 using_portArr 배열-객체 인덱스 지정 번호

    const makeMP4 = async () => {
        hbjs.spawn({ input: filename+".mpg", output: filename+'.mp4' })
        .on('error', err => {
            ("err"+err);
            // invalid user input, no video found etc
        })
        .on('progress', progress => {
            process.stderr.write(
            'Percent complete: %s, ETA: %s',
            progress.percentComplete,
            progress.eta
            )
        })
        .on('end',()=>{
            process.stderr.write("video make Done");
            //라즈베리파이에 접속해야할 포트 알려줌
            process.stderr.write(`request.socket.remoteAddress${request.socket.remoteAddress}`)
        })
    }

// 공유변수 적용 로직
// 선언 및 초기화
//부모에게 넘어온 데이터 셋
var using_portArr = {};
process.stdin.on('readable', () => {
    process.stderr.write("child : start 자식")
    var parentData = JSON.parse(process.stdin.read());
        using_portArr.record = parentData.record //녹화 시작
        using_portArr.record_pause = parentData.record_pause //녹화 일시정지 
        using_portArr.record_stop = parentData.record_stop //녹화 정지
        // console.log("child : JSON.stringify(using_portArr)"+JSON.stringify(using_portArr))
    
  });
  //부모에게서 들어오는 객체 신호

var width = 1280,
    height = 960;

    console.log('Stream before');
    process.stderr.write('child : Stream before');
var streamServer =  require('http').createServer( function(request, response) {
        var params = request.url.substr(1).split('/');//접속경로 따져서 올바른 연결만 확인
        process.stderr.write("child : start 자식")
        //console.log("params[1] : "+params[0]+" : "+JSON.stringify(request))
        if( params[0] == STREAM_SECRET ) {
            process.stderr.write('Stream Connected');
            console.log('Stream Connected');

            // childProcess.stdout.on('data', function(data) { //모프로세스에게 받은 데이터
            //     record = data.record; // 모프로세스에게 받은 녹화 신호를 받영함
            //     stoprecord = data.stoprecord; //녹화 정지 유무
            // });
            fs.writeFile(filename+".mpg",'','utf8',(err)=>{ //1.파일을 만든다.쓰기전용 './test.mpg'
                if(err){
                    process.stderr.write('filemake err :',err);
                }
                process.stderr.write('filemake Done');
            })
            var writeStream = fs.createWriteStream(filename+".mpg"); //2.해당 파일을 쓰기전용 스트림과 연결    
                request.on('data', function(data) {
                    if(!(using_portArr.record == true)){ //녹화 x 스트리밍 o
                        process.stderr.write('child : stream Mode hello')
                        process.stdout.write(new Buffer.from(data,'binary')) //모 프로세스로 데이터 전송
                    //socketServer.broadcast(data, {binary: true},request.socket.remoteAddress); //stream1.해당되는 PI에서 데이터가 넘어옴
                    }else{ //녹화 중 스트리밍 o
                        process.stderr.write('child : record Mode hello')
                        if(using_portArr.record_pause == false){ //일시정지 x 스트리밍 o
                            process.stderr.write('child : pause Mode hello')
                            writeStream.write(data); //3. 데이터 흐름 연결
                            process.stdout.write(new Buffer.from(data,'binary')) //모 프로세스로 데이터 전송
                        }else{ // 녹화 일시정지 스트리밍 o
                            process.stderr.write('child : record pause Mode hello')
                            process.stdout.write(new Buffer.from(data,'binary')) //모 프로세스로 데이터 전송
                        }
                        if(using_portArr.record_stop == true) {  //녹화가 끝났을 때 기본값 false  
                            process.stderr.write('hello record stop')
                            writeStream.end()
                        } //녹화가 끝났을 때
                    }//녹화 o else
                });
                
                request.on('end',()=>{
                    // process.stderr.write('stream connection done')
                    console.log("rasstream_end")
                    process.stderr.write('rasstream_end',rasstream_end)
                })
        }else {
            console.log('Failed Stream Connection: '+ request.socket.remoteAddress + request.socket.remotePort + ' - wrong secret.');
            process.stderr.write('Failed Stream Connection: '+ request.socket.remoteAddress + request.socket.remotePort + ' - wrong secret.');
            response.end();
        }
    }).listen(stream_make_port,()=>{
        process.stderr.write('Listening for MPEG Stream on http://127.0.0.1:'+stream_make_port+'/<secret>/<width>/<height>')
        // console.log('Listening for MPEG Stream on http://127.0.0.1:'+stream_make_port+'/<secret>/<width>/<height>');
    });


//이하 녹화 기능
// fs.writeFile('./test.mpg','w',()=>{ //fs1.파일을 만든다.쓰기전용
//     console.log("open to file")
// })
// var writeStream = fs.createWriteStream('./test.mpg'); //fs2.해당 파일을 쓰기전용 스트림과 연결

// writeStream.end();//fs4.쓰기전용스트림 종료

// writeStream.end(()=>{
//     console.log("write Done")
    
//     hbjs.spawn({ input: 'test.mpg', output: 'test1.mp4' })//fs5.파일 정제 및 mp4 인코딩
//         .on('error', err => {
//             // invalid user input, no video found etc
//         })
//         .on('progress', progress => {
//             console.log(
//             'Percent complete: %s, ETA: %s',
//             progress.percentComplete,
//             progress.eta
//             )
//         })
//         .on('end',()=>{
//             console.log("convert mp4 file"); //fs6.끝
//         })
// })
