
$("#signup").on("click",function (){
	
	const signup ={
			name:$("#name").val().trim(),
			mail:$("#mail").val().trim()+$("#mailForm option:selected").val().trim(),
			pw:$("#pw").val().trim(),
			pwCheck:$("#pwCheck").val().trim()			
	}
	Ajax_loading("POST", "/signup.check", signup);
});

$("#mailCheck").on("click",function(){
	const signup ={
			mail:$("#mail").val().trim()+$("#mailForm option:selected").val().trim()		
	}
	Ajax_loading("POST", "/signupMail.check", signup);
});

function alertResultSignUp(errName, errContent, data){	
	switch (errName) {
	case "ERR_NAME":
		if(errContent=="NULL") 
			alert("이름을 입력해주세요.");
		if(errContent=="NOT_CORRECT_FORM")
			alert("이름에는 한글 또는 영문만 가능합니다.");
		break;				
	case "ERR_MAIL":
		if(errContent=="NULL") 
			alert("메일을 입력해주세요.");
		if(errContent=="NOT_CORRECT_FORM")
			alert("메일 형식을 확인해주세요.");
		if(errContent=="OVERLAP")
			alert("이미 회원가입된 이메일입니다.")
		break;
	case "ERR_ID": //사용하지않음
		if(errContent=="NULL") 
			alert("아이디를 입력해주세요.");
		if(errContent=="OVERLAP")
			alert("아이디가 중복되었습니다.\n변경해주세요.");
		if(errContent=="NOT_CORRECT_FORM")
			alert("아이디는 4~12자리 영문,숫자 조합이어야 합니다.");
		break;
	case "ERR_PW":
		if(errContent=="NULL") 
			alert("비밀번호를 입력해주세요.");
		if(errContent=="NOT_SAME") 
			alert("비밀번호가 일치하지 않습니다.");
		if(errContent=="NOT_CORRECT_FORM")
			alert("비밀번호는 영문,숫자,특수문자 조합 8자리 이상이어야 합니다.");
		break;
	case "ERR_PWCHECK":
		if(errContent=="NULL") 
			alert("비밀번호 확인을 입력해주세요.");
		break;
	case "SUCCESS":
		if(errContent=="SUCCESS_MAIL_CHECK")
			alert("사용 가능한 메일입니다.");
		if(errContent=="SUCCESS_SIGN_UP") {
			const name = $("#name").val().trim();
			const mail = $("#mail").val().trim()+$("#mailForm option:selected").val().trim();
			const query = "?name="+name+
				   		  "&mail="+mail;
			window.location.href="/nowriting/signupSecond"+query ;
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
			  alertResultSignUp(errName,errContent, data);
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
			  alertResultSignUp(errName,errContent,data);
		  },
		  error:(err)=>{
			  alert("fail : "+ JSON.stringify(err));
		  },
		  complete:()=>{
			  $('.wrap-loading').addClass('display-none');
		  }
	});
}