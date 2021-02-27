

(function checkBrowser(){
	var agent = navigator.userAgent.toLowerCase();

	if (!(agent.indexOf("chrome") != -1)) {
		if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
			$('.wrap-loading').removeClass('display-none');
		}
		else{
			const msg =" 이 웹페이지는 크롬(Chrome)에서 가장 이상적으로 작동합니다. \n"
				  +" 이외의 브라우저에서는 정상 작동하지 않을 수 있습니다. \n\n";
			alert(msg);
		}
	}
})()



$("#login").on("click", function(){
	
	const user ={
			mail: $("#mail").val().trim(),
			pw: $("#pw").val().trim(),
			task : $("input:radio[name=task]:checked").val().trim()
	}
	Ajax("POST", "/login.check", user);
});

$("#signup").on("click",function(){
	window.location.href="/nowriting/signupFirst";
});

$("#findInfo").on("click",function(){
	window.open(contextPath + "/findInfo", "비밀번호찾기", "width=400, height=300, left=100, top=50");
});

function alertResultLogIn(errName, errContent, data){	
	switch (errName) {
		case "ERR_MAIL":
			if(errContent=="NULL") 
				alert("메일을 입력해주세요.");
			if(errContent=="NO_SEARCH_MAIL")
				alert("존재하지 않는 메일입니다.");
			break;
		case "ERR_PW":
			if(errContent=="NULL") 
				alert("비밀번호를 입력해주세요.");
			if(errContent=="NOT_CORRECT_PW") 
				alert("비밀번호가 일치하지 않습니다.");
			break;
		case "ERR_AUTHSTATUS":
			if(errContent=="NOT_AUTHENTICATION") 
				alert("이메일 인증을 완료해주세요.");
			break;
		case "SUCCESS":
			if(errContent=="SUCCESS_LOGIN") {
				const task = data.task;
				if(task=="pc")
					window.location.href="/nowriting/project";
				if(task=="mobile")
					window.location.href="/nowriting/project";
				if(task=="camera")
					window.location.href="/nowriting/camera";
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
		  success:function(data){
			  const errName = data.STATE; 
			  const errContent = data.DETAIL;
			  alertResultLogIn(errName,errContent, data);
		  },
		  error:function(err){
			  alert("fail : "+ JSON.stringify(err));
		  }
	});
}