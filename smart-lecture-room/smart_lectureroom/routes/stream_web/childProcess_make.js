
var fs = require('fs');
var send = require('request');

var STREAM_SECRET = "temp123"; //ffmpeg 연결시 필요한 비밀번호
// var using_portArr = require('../../socket_server/professor/variable').using_portArr;


var stream_make_port = process.argv[2]//새로운 스트림 설정

var filename = `./helloworld` //파일이름 //경로까지 설정해줘야함
    // filename = "./test", //파일이름 //경로까지 설정해줘야함

    // const makeMP4 = async () => {
    //     hbjs.spawn({ input: filename+".mpg", output: filename+'.mp4' })
    //     .on('error', err => {
    //         ("err"+err);
    //         // invalid user input, no video found etc
    //     })
    //     .on('progress', progress => {
    //         process.stderr.write(
    //         'Percent complete: %s, ETA: %s',
    //         progress.percentComplete,
    //         progress.eta
    //         )
    //     })
    //     .on('end',()=>{
    //         process.stderr.write("video make Done");
    //         //라즈베리파이에 접속해야할 포트 알려줌
    //         process.stderr.write(`request.socket.remoteAddress${request.socket.remoteAddress}`)
    //     })
    // }

// 공유변수 적용 로직
// 선언 및 초기화
//부모에게 넘어온 데이터 셋

  //부모에게서 들어오는 객체 신호

const width = 1280
const height = 960

    console.log('Stream before');
var streamServer =  require('http').createServer( function(request, response) {
        console.log('helloworld')
        var params = request.url.substr(1).split('/');//접속경로 따져서 올바른 연결만 확인
        if( params[0] == STREAM_SECRET ) {
            console.log('Stream Connected');
            fs.writeFile(filename+".mpg",'','utf8',(err)=>{ //1.파일을 만든다.쓰기전용 './test.mpg'
                if(err){
                    process.stderr.write('filemake err :',err);
                }
                process.stderr.write('filemake Done');
            })
            var writeStream = fs.createWriteStream(filename+".mpg"); //2.해당 파일을 쓰기전용 스트림과 연결    
                request.on('data', function(data) {
                   console.log('hellocome audio',data)
                   writeStream.write(data)
                });
                request.on('end',()=>{
                })
        }else {
            writeStream.end()
            console.log('Failed Stream Connection: '+ request.socket.remoteAddress + request.socket.remotePort + ' - wrong secret.');
            process.stderr.write('Failed Stream Connection: '+ request.socket.remoteAddress + request.socket.remotePort + ' - wrong secret.');
            response.end();
        }
    }).listen(9000,()=>{
        process.stderr.write('Listening for MPEG Stream on http://127.0.0.1:'+9000+'/<secret>/<width>/<height>')
        // console.log('Listening for MPEG Stream on http://127.0.0.1:'+stream_make_port+'/<secret>/<width>/<height>');
    });

