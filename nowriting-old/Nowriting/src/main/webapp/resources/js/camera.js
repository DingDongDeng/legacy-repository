$("#logout").on("click", ()=>{
	window.location.href=contextPath+"/logout";
});

$("#camera").on("click",()=>{
	const e = jQuery.Event( "click");
	$("#take-picture").trigger(e);
});


$("#take-picture").on("change",()=>{
	var file = document.querySelector('#take-picture').files[0];
	$("#take-picture").val("");//input[type=file]의 내용 초기화
	getBase64(file)
	.then(requestGCV);
});

var socket = null;
$(document).ready(function(){
	connectWS();
});

const domain = "localhost:8181/nowriting";
function connectWS(){
	var ws = new WebSocket("ws://"+domain+"/requestText");//파라미터도 사용가능
	socket = ws;
	ws.onopen = function(){
		console.log('Info : connection opened.');
	};

	ws.onmessage = function(event){
		alert(event.data);
	};
	
	ws.onclose = function(event) {
		console.log('Info : connection closed.');
	}

	ws.onerror = function(err){ console.log('Error:', err);
	};
}

function requestGCV(file){
	const base64 = file.split(",");
	const img = {
			file: base64[1]
	};
	Ajax_loading("POST", "/contentCamera", img);
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

function alertResultContent(errName, errContent, data){	
	console.log(errName);
	switch (errName) {
		case "ERR_LOGIN":
			if(errContent=="NO_LOGIN") {
				alert("로그인 후 이용해주세요.");
				window.location.href=contextPath+"/login";
			}
			break;
		case "SUCCESS":
			if(errContent=="SUCCESS_CONTENT_CAMERA"){
				let content = data.content;
				if (socket) {
					let socketMsg = content; 
					console.log("소켓 요청 보낼준비");
					socket.send(socketMsg);
					console.log("소켓 요청을 보냈음");
				}
			
			}
			break;
		default:
			alert("정의되지 않은 DATA(STATE)");
			break;
	}
}


function Ajax_loading(type, url, data){
	$.ajax({
		  type: type,
		  url: contextPath+url,
		  data : JSON.stringify(data),
		  contentType : "application/json; charset=utf-8",
		  beforeSend:()=>{
			  $('.wrap-loading').removeClass('display-none');
		  },
		  success:(data)=>{
			  const errName = data.STATE; 
			  const errContent = data.DETAIL;
			  alertResultContent(errName,errContent,data);
		  },
		  error:(err)=>{
			  alert("fail : "+ JSON.stringify(err));
		  },
		  complete:()=>{
			  $('.wrap-loading').addClass('display-none');
		  }
	});
}


function Ajax(type, url, data){
	$.ajax({
		  type: type,
		  url: contextPath+url,
		  data : JSON.stringify(data),
		  contentType : "application/json; charset=utf-8",
		  success:(data)=>{
			  const errName = data.STATE; 
			  const errContent = data.DETAIL;
			  alertResultContent(errName,errContent,data);
		  },
		  error:(err)=>{
			  alert("fail : "+ JSON.stringify(err));
		  }
	});
}