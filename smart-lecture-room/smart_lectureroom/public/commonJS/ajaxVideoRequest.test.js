var id = scriptQuery().id;


async function joinRequest(data){    
    // Setup the WebSocket connection and start the player
    // let client = new WebSocket( 'ws://localhost:8084/' );  //<---------------- db의 back 부분에 값을 넣어두자 포트까지....
    let canvas = document.getElementById('videoCanvas');
    let player = new JSMpeg.Player("ws://ec2-13-124-54-7.ap-northeast-2.compute.amazonaws.com:8084/", {canvas:canvas, autoplay:true, videoBufferSize:102410248, audioBufferSize:102410248});
    

    let client;
    client = await asyncCreateClient(player,data);

    

    return client;
}
async function asyncCreateClient(player, data){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            let client = player.source.socket;
            console.log("joinRequest : " + JSON.stringify(data));
            ajaxVideoRequest(data,(state)=>{
                console.log("joinRequest State : " + state);
                if(state == "Ready_Stream"){ 
                    const _data = {
                        flag : "JOIN",
                        building : data.buildingName,
                        Room :data.lectureRoomNum,
                        id : id
                    }
                    client.send(JSON.stringify(_data));
                    resolve(client);
                }
                else{
                    console.log("err : joinRequest()의 state=" + state);
                }
            })
        },5000);        
    
    });
}

function recordRequest(client,data){    
    const _data = {
        flag : "RECORD",
        building : data.buildingName,
        Room :data.lectureRoomNum,
        record : true, //영상녹화 옵션
        record_pause : false,//일시정지 옵션
        record_stop : false ,// 영상 녹화 중지 옵션
        id : id
    }
    client.send(JSON.stringify(_data));
}

function pauseRequest(client,data){    
    const _data = {
        flag : "RECORD",
        building : data.buildingName,
        Room :data.lectureRoomNum,
        record : true, //영상녹화 옵션
        record_pause : true,//일시정지 옵션
        record_stop : false, // 영상 녹화 중지 옵션
        id : id
    }
    client.send(JSON.stringify(_data));
}


function stopRequest(client ,data){    
    const _data = {
        flag : "RECORD",
        building : data.buildingName,
        Room : data.lectureRoomNum,
        record : true, //영상녹화 옵션
        record_pause : false,//일시정지 옵션
        record_stop : true, // 영상 녹화 중지 옵션
        id : id
    }
    client.send(JSON.stringify(_data));
}

function ajaxVideoRequest(data, callback){
    
    $.ajax({
        type: "post",
        url: "/stream/stream", //webName 은 baseJS.ejs 에서 정의됨(사용자가 요청한 웹의 이름)
        data : JSON.stringify(data),
        contentType : "application/json; charset=utf-8",
        beforeSend:()=>{
            $('.wrap-loading').removeClass('display-none');
        },
        success: callback,
        error:(err)=>{
            alert("fail : "+ JSON.stringify(err));
        },
        complete:()=>{
            $('.wrap-loading').addClass('display-none');
        }
    });	
}



function scriptQuery() {
    var script = document.getElementsByTagName('script');   
    script = script[script.length-1].src  
       .replace(/^[^\?]+\?/, '')           
       .replace(/#.+$/, '')                      
       .split('&');                                   
     var queries = {}                             
       , query;
     while(script.length){                      
          query = script.shift().split('=');    
          queries[query[0]] = query[1];   
     }
     return queries;
}
