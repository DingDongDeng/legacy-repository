let needSave = false; //사용자가 텍스트를 변경해서 저장이 필요한경우를 판단
$("#back").on("click", ()=>{
	window.location.href=contextPath+"/project";
});

$("#save").on("click", saveContent);


$("#right").on("click",()=>{
	saveContent();
	const page = parseInt($("#nowPage").text())+1;
	moveContentPage(page);
});

$("#left").on("click",()=>{
	saveContent();
	const page = parseInt($("#nowPage").text())-1;
	moveContentPage(page);
});

$("#move").on("click" , ()=>{
	saveContent();
	const page = $("#page").val().trim();
	moveContentPage(page);
});

$("#content").on("change",()=>{
	needSave = true;
});

$("#delete").on("click",()=>{
	const page = $("#nowPage").text().trim();
	if(confirm("정말 삭제하시겠습니까?")){
		deleteContentPage(page);
	}
	
});
//pc작업기준
/*
 * 구현예정
 */

//모바일 작업 기준
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


function deleteContentPage(page){
	const content={
			pId:$("#pId").text().trim(),
			page:String(page),
		};
	Ajax("POST", "/contentPageDelete", content);
}


function moveContentPage(page){
	const content={
			pId:$("#pId").text().trim(),
			page:String(page),
		};
	Ajax("POST", "/contentPageMove", content);
}


function saveContent(){
	if($("#content").val()==" "){return;}
	if(!needSave){return ;}
	if(confirm("현재 작업내용을 저장하시겠습니까?")){
		const content={
				pId:$("#pId").text().trim(),
				page:$("#nowPage").text().trim(),
				content:$("#content").val().trim()
			};
		Ajax("POST", "/contentSave.check", content);
	}
	needSave=false;
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
	case "ERR_PID":
		if(errContent=="NOT_USERS_PID")
			alert("검증되지 않은 프로젝트 아이디입니다.");
	case "ERR_PAGE":
		if(errContent=="NOT_CORRECT_FORM")
			alert("페이지 입력은 양의 정수만 가능합니다.");
	case "SUCCESS":
		if(errContent=="SUCCESS_SAVE_CONTENT") {
			console.log("저장완료");
		}
		if(errContent=="SUCCESS_MOVE_CONTENT_PAGE"){
			const content = data.contentDTO;
			$("#nowPage").text(content.page);
			$("#content").val(content.content); //<textarea> 는 .val()를써야함
		}
		if(errContent=="SUCCESS_DELETE_CONTENT_PAGE"){
			const page = data.page;
			alert(page+ "page가 삭제되었습니다.");
			$("#content").val(" "); //<textarea> 는 .val()를써야함
		}
		if(errContent=="SUCCESS_CONTENT_CAMERA"){
			const content = data.content;
			$("#content").val(content);
//			const e = jQuery.Event( "change");
//			$("#content").trigger(e);
			needSave = true;

		}
		break;
	default:
		alert("정의되지 않은 DATA(STATE)");
		break;
	}
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
		console.log("ReceiveMessage:", event.data +'\n');
		$("#content").val(event.data);
		const e = jQuery.Event( "change");
		$("#content").trigger(e);
		
	};
	
	ws.onclose = function(event) {
		console.log('Info : connection closed.');
	}

	ws.onerror = function(err){ console.log('Error:', err);};
}