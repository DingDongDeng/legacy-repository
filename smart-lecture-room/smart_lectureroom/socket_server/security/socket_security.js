// var net_client = require("./net_security");



var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ port: 3030 });

var net = require('net');
var mongoDB = require('../../extend_modules/dao/security_web/mongoDB');
var mongoState = require('../../extend_modules/dao/state/index');

var ALL_LIGHTS_OFF = "ALL_LIGHTS_OFF";//일괄 소등
var ALL_LIGHTS_ON = "ALL_LIGHTS_ON";//일괄 점등
var ALL_DOORS_CLOSED = "ALL_DOORS_CLOSED";//일괄 폐쇄
var ALL_DOORS_OPENED = "ALL_DOORS_OPENED";//일괄 개방

var ALL_UPDATE = "ALL_UPDATE";//모든 강의실 상태 확인

var LIGHTS_OFF = "LIGHTS_OFF";//소등
var LIGHTS_ON = "LIGHTS_ON";//점등
var DOORS_CLOSED = "DOORS_CLOSED";//폐쇄
var DOORS_OPENED = "DOORS_OPENED";//개방




// const clientList = net_client.getClientList;
var netClientList = [];

function setNetClientList(ws){
  console.log("setNetClientList 작동");
  if(mongoState.connect){ //만약 이 코드가 작동하는 시점에서도 DB가 연결되어 있지않을때를 필터
    mongoDB.getLectureRoomInfo({}).then((docsPack)=>{
      const lectureRoomList = docsPack.docs;
      netClientList=[]; //초기화
      for(let i=0; i< lectureRoomList.length; i++){
        console.log("netClientList에 삽입")
          const lectureRoom = lectureRoomList[i];
          // const ip = lectureRoom.camera_ip.front.split(':')[0];//DB에 저장된 포트 제거\
          const temp = lectureRoom.camera_ip.back.split(':');
          const ip = temp[0];//DB에 저장된 포트 제거    
          const port = temp[1];
          console.log("ip : " + ip)      ;
          netClientList.push({
              ip : ip,
              client : createNetClient(ip,port,ws)
          });
      }
    });
  }
  else{
    setTimeout(setNetClientList,1*1000);
  }
  // mongoDB.getLectureRoomInfo({}).then((docsPack)=>{
  //   const lectureRoomList = docsPack.docs;
  //   netClientList=[]; //초기화
  //   for(let i=0; i< lectureRoomList.length; i++){
  //     console.log("netClientList에 삽입")
  //       const lectureRoom = lectureRoomList[i];
  //       const ip = lectureRoom.camera_ip.front.split(':')[0];//DB에 저장된 포트 제거
  //       netClientList.push({
  //           ip : ip,
  //           client : createNetClient(ip,ws)
  //       });
  //   }
  // });
  
}

wss.on("connection", function(ws) {
  setNetClientList(ws); // 라즈베리와 통신하는 클라이언트들의 set
  ws.on("message", function(request) {
    console.log("Received: %s", request); 
    // console.log("테스트");
    // for(let i=0; i< net_client.getClientList.length; i++){
    //   console.log(net_client.getClientList[i].ip);
    // }
    let reqObject = JSON.parse(request);
    let requestName = reqObject.requestName;
    console.log("테스트코드-------");
    console.log(JSON.stringify(reqObject));
    if( requestName == ALL_LIGHTS_OFF 
      ||requestName == ALL_LIGHTS_ON 
      ||requestName == ALL_DOORS_CLOSED 
      ||requestName == ALL_DOORS_OPENED 
      ||requestName == ALL_UPDATE ){
      requestName = requestName.substring(4); //ALL_을 제거한 requestName
      requestAllNetClients(requestName);
      return;
    }

    if( requestName == LIGHTS_OFF 
      ||requestName == LIGHTS_ON 
      ||requestName == DOORS_CLOSED 
      ||requestName == DOORS_OPENED){
      const ip = reqObject.ip.split(':')[0];//ip
      requestOneNetClient(ip, requestName);
      return;
    }

    // ws.send(JSON.stringify(reqObject));
  });
});



function findNetClient(){
  if(arguments.length==0){
    console.log("아규먼트 0")
    console.log(netClientList.length)
    console.log(netClientList[0].ip)
    return netClientList;
  }

  if(arguments.length==1){
    console.log("아규먼트 1")
    // console.log(JSON.stringify(netClientList))
    const ip = arguments[0];
    console.log(ip);
    console.log(JSON.stringify(netClientList));
    for(let i=0; i<netClientList.length; i++){
      if(ip==netClientList[i].ip){
        return netClientList[i];
      }
    }
  }
}


function requestAllNetClients(requestName){
  const target = findNetClient();
  
  for(let i =0; i<target.length; i++){
    const client = target[i].client;
    console.log("테스트")
    console.log(target[i].client);
    console.log(target[i].ip);
    // console.log(JSON.stringify(client));
    client.write(JSON.stringify({requestName : requestName}));
  }
}

function requestOneNetClient(ip,requestName){
  const target = findNetClient(ip);
  const client = target.client;
  client.write(JSON.stringify({requestName:requestName}));
}

function createNetClient(ip,port,ws){
    var client = net.connect({port:port, host:ip}, function(){
        console.log('Client connected');
        // client.write('Some Data \r\n');
    });
    client.on('data', function(data){
        console.log(data.toString());
        ws.send(data.toString());
        // client.end();
    });
    client.on('end', function(){
        console.log('Client disconnected');
    });

    return client;
}








module.exports = wss;