function ajax(type, url, data){
	
	return new Promise((resolve, reject)=>{
		$.ajax({
			type: type,
			url: "/"+targetUser+"/process"+url, //webName 은 baseJS.ejs 에서 정의됨(사용자가 요청한 웹의 이름)
			data : JSON.stringify(data),
			contentType : "application/json; charset=utf-8",
			beforeSend:()=>{
				$('.wrap-loading').removeClass('display-none');
			},
			success:(data)=>{
				const errName = data.STATE; 
				const errContent = data.DETAIL;
				alertResult(errName,errContent,data);
				if(errName ==="SUCCESS"){
					resolve(data);
				}
					
			},
			error:(err)=>{
				alert("fail : "+ JSON.stringify(err));
			},
			complete:()=>{
				$('.wrap-loading').addClass('display-none');
			}
	    });		
	})
	
}



