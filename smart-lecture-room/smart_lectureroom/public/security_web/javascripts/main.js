var mainPage = $(".mainPage");

var roomSelector = mainPage.find(".room-selector");
var roomList = roomSelector.find(".room-list");
var room = roomList.find(".room");

var roomView = mainPage.find(".room-view");
var cctvList = roomView.find(".cctv-list");



var ip = roomView.find(".ip"); //원희꺼, 강의실 제어
var ip2 = roomView.find(".ip2"); //명규꺼, CCTV 출력
var buildingName = roomView.find(".building-name");
var roomNum = roomView.find(".room-num");

var controller = $("#controller");

var controllerLeft = controller.find(".controllerLeft");
var AllLightsOnBtn = controllerLeft.find("input[name=all-lights-on]");
var AllLightsOffBtn = controllerLeft.find("input[name=all-lights-off]");
var AllDoorsOpenedBtn = controllerLeft.find("input[name=all-doors-opened]");
var AllDoorsClosedBtn= controllerLeft.find("input[name=all-doors-closed]");

var controllerRight = controller.find(".controllerRight");
var lightOnBtn = controllerRight.find("input[name=light-on]");
var lightOffBtn = controllerRight.find("input[name=light-off]");
var doorOpenedBtn = controllerRight.find("input[name=door-opened]");
var doorClosedBtn = controllerRight.find("input[name=door-closed]");

/**
 * ws에 보낼 Requset의 이름
 */
var ALL_LIGHTS_OFF = "ALL_LIGHTS_OFF";//일괄 소등
var ALL_LIGHTS_ON = "ALL_LIGHTS_ON";//일괄 점등
var ALL_DOORS_CLOSED = "ALL_DOORS_CLOSED";//일괄 폐쇄
var ALL_DOORS_OPENED = "ALL_DOORS_OPENED";//일괄 개방

var LIGHTS_OFF = "LIGHTS_OFF";//소등
var LIGHTS_ON = "LIGHTS_ON";//점등
var DOORS_CLOSED = "DOORS_CLOSED";//폐쇄
var DOORS_OPENED = "DOORS_OPENED";//개방

var ALL_UPDATE = "ALL_UPDATE";

var ws = new WebSocket('ws://ec2-13-124-54-7.ap-northeast-2.compute.amazonaws.com:3030');



$(function(){
    

    //좌측 컨트롤 버튼 이벤트 등록
    AllLightsOffBtn.on("click",()=>{ wsRequest(ALL_LIGHTS_OFF);});
    AllLightsOnBtn.on("click",()=>{ wsRequest(ALL_LIGHTS_ON );});
    AllDoorsClosedBtn.on("click",()=>{ wsRequest(ALL_DOORS_CLOSED)});
    AllDoorsOpenedBtn.on("click",()=>{wsRequest(ALL_DOORS_OPENED)});

    //우측 컨트롤 버튼(임의 강의실) 이벤트 등록
    lightOnBtn.on("click",()=>{wsRequest(LIGHTS_ON, ip.text().trim())});
    lightOffBtn.on("click",()=>{wsRequest(LIGHTS_OFF,ip.text().trim())});
    doorOpenedBtn.on("click",()=>{wsRequest(DOORS_OPENED,ip.text().trim())});
    doorClosedBtn.on("click",()=>{wsRequest(DOORS_CLOSED,ip.text().trim())});

    //좌측 room-selector의 강의실 선택 이벤트 등록
    room.each(function(index,item){
        const room = $(item);
        room.on("click", ()=>{
            roomEvent(room);
            connectCCTV(ip2.text().trim(), 
                        ip.text().trim(),
                        buildingName.text().trim(), 
                        roomNum.text().trim());
        });
    });

    //좌측 room-selector의 건물타이틀에 대한 이벤트 등록
    roomSelector.find(".building-name").each(function(index, item){
        const buildingName = $(item);

        buildingName.on("click",function(){
            const roomList = $(this).parent().find(".room-list");
            if(roomList.hasClass("display-none")){
                roomList.removeClass("display-none");
            }
            else{
                roomList.addClass("display-none");
            }
        })
    })

     

});

function roomEvent(room){
    const roomGroup = room.parents("div[name=room-group]");

    const buildingNameText = roomGroup.find(".building-name").text().trim();
    const roomNumText = room.find(".room-num").text().trim();
    const ipText = room.find(".camera-id").text().trim();
    const ip2Text = room.find(".camera-id2").text().trim();

    //전역변수의 html태그들에 값 할당
    buildingName.text(buildingNameText);
    roomNum.text(roomNumText);
    ip.text(ipText);
    ip2.text(ip2Text)
    // $(".room-view .room-title").text(buildingNameText+" "+roomNumText);
}


// var client =null;
// function connectCCTV(){
//     const requestData ={
//         ip : ip,
//         buildingName :buildingName,
//         lectureRoomNum : roomNum,
//     }
    
//     if(client ==null){
//         client = new WebSocket( 'ws://localhost:8084/' );  //<---------------- db의 back 부분에 값을 넣어두자 포트까지....
//         var canvas = document.getElementById('videoCanvas');
//         var player = new jsmpeg(client, {canvas:canvas});

//         client= joinRequest(requestData);
//     }
//     if(client != null){// && 현재화면개수보다 적으면
//         //cctv화면개수가 늘어나
//     }
// }
let canvasID=0;
let clientList=[];

//페이지 이탈시 stopReqeust
$(window).on("beforeunload", function(){
    for(let i=0; i<clientList.length; i++){
        stopRequest(clientList[i].client, clientList[i].requestData);
    }
});   


function connectCCTV(ip,ip2, buildingName, roomNum){
    if(clientList.length>=4){
        alert("cctv는 최대 4개까지 동시제공됩니다.")
        return;
    }

    const requestData ={
        ip : ip,
        buildingName :buildingName,
        lectureRoomNum : roomNum,
    }
    
    // if(client ==null){
    //     client = new WebSocket( 'ws://localhost:8084/' );  //<---------------- db의 back 부분에 값을 넣어두자 포트까지....
    //     var canvas = document.getElementById('videoCanvas');
    //     var player = new jsmpeg(client, {canvas:canvas});

    //     client= joinRequest(requestData);
    // }
    // if(client != null){// && 현재화면개수보다 적으면
    //     //cctv화면개수가 늘어나
    // }

    appendCanvasHTML(createCanvasHTML(canvasID,buildingName, roomNum, ip)); //cctv영상을 볼 캔버스 생성 및 cctv-list에 어팬드

    //cctv클릭시 포커싱이 되어 제어요청을 보낼 수 있는 이벤트 등록
    cctvList.find(".cctv:last").on("click",function(){
        const anotherCctvList= $(".cctv .cctv");
        anotherCctvList.each(function(index,item){
            $(item).removeClass("focus-cctv");
        })
        const cctv = $(this);

        roomView.find(".building-name").text(buildingName);
        roomView.find(".room-num").text(roomNum);
        roomView.find(".ip").text(ip2);
        roomView.find(".ip2").text(ip);

        cctv.addClass("focus-cctv");  
    })

    joinRequestInMulti(requestData,canvasID).then(client=>{
        addClientList(canvasID,client,requestData);//clientList에 등록 및 canvas에 소켓연결
        canvasID++;
    })
    
}



function createCanvasHTML(id,buildingName,roomNum, ip){
    let canvasHTML = "";
    // canvasHTML +="<div style='width:640px; height:50px'> x </div>"
    canvasHTML +="<div class='cctv'>"
    canvasHTML +="  <div class='room-title'>"+ buildingName +" "+roomNum +"<span class='motion-state'> <span class='ip display-none'>"+ip+" </span></span></div>";
    canvasHTML +=   "<div class='info display-none'>"+id+" </div>"
    canvasHTML +=   "<div class='delete' onclick='disconnectCctvEvent(this)'> x </div>"
    canvasHTML +=   "<div class='buildingName display-none'>"+buildingName+" </div>"
    canvasHTML +=   "<div class='roomNum display-none'>"+roomNum+" </div>"
    canvasHTML +=   "<canvas class='cctv' id='canvas"+id+"' width='640' height='450'>";
    canvasHTML +=       "<p>";
    canvasHTML +=       "</p>";
    canvasHTML +=   "</canvas>";
    canvasHTML +="</div>";
    
    return canvasHTML;
}

function appendCanvasHTML(canvasHTML){
    cctvList.append(canvasHTML);
}
function disconnectCctvEvent(deleteBtn){
    const cctv = $(deleteBtn).parent();
    const id = cctv.find(".info").text().trim();
    const buildingName = cctv.find('.buildingName').text().trim();
    const roomNum = cctv.find('.roomNum').text().trim();
    cctv.remove();
    const client = findClient(id);

    const data = {
        buildingName : buildingName,
        lectureRoomNum :roomNum
    }


    stopRequest(client,data,id); //소켓 중지요청
    removeClient(id);//clientList에서 해당 cctv삭제
    client.close(); //소켓연결종료

    
    
    // var canvas = document.getElementById('canvas'+id);
    
}

function addClientList(id,client,requestData){
    clientList.push({
        id:id, 
        client : client,
        requestData: requestData
    });
}

function findClient(id){
    for(let i=0; i<clientList.length; i++){
        if(clientList[i].id == id){
            return clientList[i].client;
        }
    }
}
function removeClient(id){
    console.log("삭제할 id : " + id );

    for(let i=0; i<clientList.length; i++){
        console.log(clientList[i].id);
        if(clientList[i].id == id){
            
            clientList.splice(i,1);
        }
    }    
}

ws.onopen = (event) => {
    setTimeout(updateRoomState,5000);
    // updateRoomState(); //강의실 상태를 갱신
}


/**event.data
 * 
 * var ROOM_STATE = {
  IP : IP_NUM,
  LIGHTS : LIGHTS_OFF,
  DOORS : DOORS_CLOSED,
  MOTION : MOTION_CLOSED,
  MOTION_STATUS : MOTION_STATUS
}
 */

 
ws.onmessage = (event) => {
    console.log("응답도착 ");
    console.log(event.data);

    const roomState = JSON.parse(event.data);    
    const room = findRoom(roomState.IP);
    const room_state = room.find(".room-state");
    const door = room_state.find(".door");
    const light = room_state.find(".light");

    let doorColor = getStateColor("DOORS",roomState.DOORS);
    let lightColor = getStateColor("LIGHTS",roomState.LIGHTS);

    door.css('background-color', doorColor);
    light.css('background-color',lightColor);

    if(roomState.MOTION_STATUS){//모션이 감지됫다면
        setMotionColor(roomState.IP, "red");
        return;
    }
    setMotionColor(roomState.IP, "green");

}
function setMotionColor(IP, color){
    const ip = $(".cctv .motion-state .ip");
    for(let i=0; i< ip.length; i++){
        const ipText = $(ip[i]).text().trim().split(':')[0];
        if(ipText == IP){
            $(ip[i]).parent().css('background-color', color);
        }
    }
}
function getStateColor(stateName,state){
    if(stateName=="LIGHTS" && state =="LIGHTS_ON"){
        return "red";
    }
    if(stateName=="DOORS" && state =="DOORS_OPENED"){
        return "red";
    }

    return "green";
}

function findRoom(ip){

    let targetRoom;

    for(let i=0; i< room.length; i++){
        const room_ = $(room[i]);
        // const ipText = room_.find(".camera-id").text().trim().split(":")[0];
        const ipText = room_.find(".camera-id").text().trim();
        console.log("findRoom : ")
        console.log(ip)
        console.log(ipText)
        console.log(ip==ipText);
        if(ip == ipText){
            targetRoom = room_;
        }
    }
    // room.each(function(index, item){
    //     const room = $(item);
    //     const ipText = room.find(".camera-id").text().trim().split(":")[0];
    //     console.log("findRoom : ")
    //     console.log(ip)
    //     console.log(ipText)
    //     console.log(ip==ipText);
    //     if(ip == ipText){
    //         targetRoom = room;
    //     }
    // });


    return targetRoom;
}


// ws.send(JSON.stringify(sendData));

function updateRoomState(){
    wsRequest(ALL_UPDATE);
}

function wsRequest(requestName){
    // ws.send(JSON.stringify({event:"req",data:{requestName:requestName}}));
    if(arguments.length == 1)
        ws.send(JSON.stringify({requestName:requestName}));
    if(arguments.length ==2){
        let ip = arguments[1];
        ws.send(JSON.stringify({
            requestName:requestName,
            ip : ip
        }));
    }
    
}



