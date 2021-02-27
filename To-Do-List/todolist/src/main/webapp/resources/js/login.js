
$("#signUp").on("click",()=>{
	window.location.href=contextPath+"/signUp";
});
$("#login").on("click",()=>{
	const data ={
			mail : $(".inputs input[name=mail]").val().trim(),
			password : $(".inputs input[name=password]").val().trim()
	};
	
	ajax("post","/loginProcess",data);
});

$("#findPW").on("click",()=>{
	appearFindPWForm();
});

$(".findPWForm input[name=cancel]").on("click",()=>{
	disappearFindPWForm();
});

$(".findPWForm input[name=send]").on("click",()=>{
	

	ajax("post","/findPW",$(".findPWForm input[name=mail]").val().trim());
});
function disappearFindPWForm(){
	$(".findPWForm").animate({opacity:"0"},400,function(){
		$(".whole").css("display","");
		$(".whole").animate({opacity:"1"},400,function(){
			
		});
		
	});
}


function appearFindPWForm(){
	$(".whole").animate({opacity:"0"},400,function(){
		$(this).css("display","none");
		$(".findPWForm").animate({opacity:"1"},400);
	});
}

