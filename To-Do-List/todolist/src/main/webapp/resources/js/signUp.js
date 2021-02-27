$(".signUpPage .inputUI .buttons input[name=signUp]").on("click",function(){
	const data={
		mail : $(".userInfo input[name=mail]").val().trim(),
		password : $(".userInfo input[name=password]").val().trim(),
		passwordCheck : $(".userInfo input[name=passwordCheck]").val().trim()
	};
	ajax("post","/signUpProcess",data);
});

$(".signUpPage .inputUI .buttons input[name=back]").on("click",function(){
	window.location.href=contextPath+"/login";
});