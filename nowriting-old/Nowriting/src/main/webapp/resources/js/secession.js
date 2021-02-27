
$("#button").on("click", ()=>{
	const pw = $("#pw").val().trim();
	Ajax_text("post", "/secessionCheck", pw)
});


function alertResultContent(errName, errContent, data){	
	console.log(errName);
	switch (errName) {
		case "ERR_LOGIN":
			if(errContent=="NO_LOGIN") {
				alert("로그인 후 이용해주세요.");
				window.location.href=contextPath+"/login";
			}
			break;
		case "ERR_NOWPW":
			if(errContent =="NULL"){
				alert("비밀번호를 입력해주세요.");
			}
			if(errContent =="NOT_SAME"){
				alert("비밀번호가 일치하지 않습니다.");
			}
			break;
		case "SUCCESS":
			if(errContent=="SUCCESS_SECESSION"){
				alert("회원탈퇴 되었습니다. \n 그 동안 이용해주셔서 감사합니다.");
				opener.location.replace(contextPath+"/login");
				self.close();
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

function Ajax_text(type, url, data){
	$.ajax({
		  type: type,
		  url: contextPath+url,
		  data : "data=" + data,
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
