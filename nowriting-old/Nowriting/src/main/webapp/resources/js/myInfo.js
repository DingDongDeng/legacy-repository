
var modifyFlag =0; 
/*
 * 사용자가 어떤 정보를 수정하려는 것을 표현하는 flag
 * 0 : 수정하지 않는 상태
 * 1 : 개인정보 수정
 * 2 : 비밀번호 수정
 */
$("#back").on("click", ()=>{
	window.location.href=contextPath+"/project";
});
$("#modifyBase").on("click", ()=>{ 
	modifyUI_Base();
});
$("#modifyPW").on("click", ()=>{
	modifyUI_PW();
});

$("#modifyFin").on("click", ()=>{
	execute();
});

$("#secession").on("click", ()=>{
	window.open(contextPath + "/secession", "회원탈퇴하기", "width=400, height=300, left=100, top=50"); 
});
function execute(){
	let info;
	switch(modifyFlag){
		case 0 :
			break;
		case 1 :
			info = {
			  header : 1,	
			  name : $("#name").val().trim()	
			}
			break;
		case 2 :
			info = {
				header : 2,
				pw : $("#pw").val().trim(),
				newPW : $("#newPW").val().trim(),
				newPwCheck : $("#newPwCheck").val().trim()
			}
			break;
		default : 
			break;
	}
	
	
	Ajax("post", "/changeMyInfo", info); 
}

function modifyUI_Base(){
//	$('.wrap-loading').removeClass('display-none');
	$("#name").removeAttr("readonly");
	buttonUI();
	modifyFlag = 1;
	
}

function modifyUI_PW(){
	$("#name").after(""+
			"<div id='pwUI'>" +
				"현재 비밀번호 : <input id='pw' type='password'><br>" +
				"새 비밀번호 : <input id='newPW' type='password'><br>" +
				"새 비밀번호 확인 : <input id='newPwCheck' type='password'><br>" +
			"</div>"
	);
	buttonUI();
	modifyFlag=2;
}
function buttonUI(){
	$(".button").each(function(){
		$(this).addClass('hidden');
	});
	
	$("#modifyFin").removeClass('hidden');
}
function resetButtonUI(){
	$(".button").each(function(){
		$(this).removeClass('hidden');
	});
	
	$("#modifyFin").addClass('hidden');
}
function removeModifyUI(){
	switch(modifyFlag){
		case 0 :
			
			break;
		case 1 :
			$("#name").attr("readonly",true);
			resetButtonUI();
			modifyFlag = 0;
			break;
			
		case 2 :
			$("#pwUI").remove();
			resetButtonUI();
			modifyFlag = 0;
			break;
		default :
			alert("정의되지않은 flag");
			break;
	
	}
}


function alertResultContent(errName, errContent, data){	
	switch (errName) {
		case "ERR_LOGIN" :
			if(errContent=="NO_LOGIN"){
				alert("로그인 후 이용해주세요.");
				window.location.href=contextPath+"/login";
			}
			break;
		case "ERR_NAME":
			if(errContent=="NULL") {
				alert("이름을 입력해주세요.");

			}
			if(errContent=="NOT_CORRECT_FORM"){
				alert("이름형식이 잘못되었습니다.");
			}
			break;
		case "ERR_NOWPW":
			if(errContent=="NULL"){
				alert("현재 비밀번호를 입력해주세요.");
			}
			if(errContent=="NOT_SAME"){
				alert("현재 비밀번호가 일치하지 않습니다.");
			}
			break;
		case "ERR_PW":
			if(errContent=="NULL"){
				alert("새 비밀번호를 입력해주세요.");
			}
			if(errContent=="NOT_CORRECT_FORM"){
				alert("새 비밀번호 형식은 영문,숫자,특수 문자 조합 8자리 이상입니다.");
			}
			if(errContent=="NOT_SAME"){
				alert("새 비밀번호가 일치하는지 확인해주세요.");
			}

			break;
		case "ERR_PWCHECK":
			if(errContent=="NULL"){
				alert("새 비밀번호 확인을 입력해주세요.");
			}
			break;
			
		case "SUCCESS":
			if(errContent=="SUCCESS_CHANGE_MYINFO"){
				removeModifyUI();
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