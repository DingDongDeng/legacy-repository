$("#logout").on("click", ()=>{
	window.location.href=contextPath+"/logout";
});
$("#myInfo").on("click", ()=>{
	window.location.href= contextPath+"/myInfo";
});

jQuery(function($){
	$(window).scroll(function () {
		if($(window).scrollTop() == 0) {
			var title = $(".title");
			$(title[0]).css("display","block");
		} 
		else {
			var title = $(".title");
			$(title[0]).css("display","none");
		}  
	});
});