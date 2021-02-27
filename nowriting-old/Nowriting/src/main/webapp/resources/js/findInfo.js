
$("#button").on("click", ()=>{
	
	const mail = $("#mail").val().trim();
	Ajax_text("post", "/findInfoCheck", mail);
});


function alertResultContent(errName, errContent, data){	
	console.log(errName);
	switch (errName) {
		case "ERR_MAIL":
			if(errContent=="NULL") {
				alert("메일을 입력해주세요.");
			}
			if(errContent=="NOT_CORRECT_FORM"){
				alert("메일 형식을 확인해주세요.")
			}
			if(errContent=="NOT_EXIST_MAIL"){
				alert("가입되어 있지 않은 메일입니다. \n 다시 확인해주세요.");
			}
			break;
		case "SUCCESS":
			if(errContent=="SUCCESS_FIND_INFO"){
				alert("메일이 성공적으로 발송되었습니다.");
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