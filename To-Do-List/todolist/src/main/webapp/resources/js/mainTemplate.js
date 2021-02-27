$(".sideBar .content input[name=logout]").on("click",function(){//로그아웃
	window.location.href=contextPath + "/logout";
	
});
$(".sideBar .content input[name=setting]").on("click",()=>{
	alert("설정");
});
$(".sideBar .content input[name=alert]").on("click",()=>{//알람
	const bubble = $(".bubble");
	if(bubble.css("opacity")==0){
		bubble.css("display","");
		bubble.animate({opacity:"1"},1000);
	}
	else{
		
		bubble.animate({opacity:"0"},1000,function(){
			bubble.css("display","none");
		});
	}
});



function alertList(){
	$.ajax({
		  type: "post",
		  url: contextPath+"/alert",
		  success:(data)=>{
			  	let cnt=data.listDTOs.length;
			  	if(cnt!=0){
			  		$(".alert").text(cnt);
			  		$(".alert").removeClass("hidden");
			  	}
			  	else{
			  		$(".alert").addClass("hidden");
			  	}
			  	
				let listDTOs = data.listDTOs;
				let alert="";
				
				$(listDTOs).each(function(index,item){
					console.log(item.deadline);
					let _date__ = new Date(parseInt(item.deadline)-parseInt(1000*60*60*9)).format("yyyy-MM-dd a/p hh:mm");

					alert += "<hr>"
					alert += "<div class='alertList'>"
					alert += 		"<div>" 
					alert += 				_date__
					alert +=		"</div>"
					alert += 		"<div>" 
					alert += 				item.title 
					alert += 		"</div>"											
					alert += "</div>"
				});
				$(".bubble .alertForm").html(alert);
				firstDeadDate = setFirstDeadDate(); 
				setColor();
		  },
		  error:(err)=>{
			  alert("fail : "+ JSON.stringify(err));
		  },

	});
}




var sideBarFlag=0;
var mql = window.matchMedia("screen and (max-width: 1024px)");

jQuery(function($){
	$(window).scroll(function () {
		if(mql.matches){//화면의 너비가 1024 이하
			if($(window).scrollTop() == 0) {//스크롤이 제일 꼭대기일때 사이드바 노출
				
				var sideBar = $(".sideBar");

				sideBar.animate({height:"100",opacity:"1"},300);
				
				sideBarFlag=0;
				console.log("A");
			} 
			else{ //스크롤이 제일 꼭대기일때 사이드바 숨김
				var sideBar = $(".sideBar");
				if(sideBarFlag==0){
					sideBar.animate({height:"0",opacity:"0"},300,function(){
						console.log("event");
					});
				}
				sideBarFlag=1;
				console.log("B");
			}  
		}
		else{//화면의 너비가 1025이상, 사이드바를 pc버전으로 세팅
			var sideBar = $(".sideBar");
			sideBar.css("opacity","1");
			sideBar.css("height","");
		}
		
	});
});









