var EditDateFlag=true; //date의 값 변경이 감지되면 시간,분을 자동으로 12:00 으로 설정

$(".listEditPage .inputUI .date input[name=date]").on("focus",function(){
	
	if(EditDateFlag){
		alert("마감기한을 입력시 시,분 까지 입력해주셔야 정상적으로 설정됩니다.");
	}
	EditDateFlag=false;
});



$(".listEditPage .inputUI .buttons input[name=check]").on("click",()=>{
	
	const deadline = $(".listEditPage .inputUI .date input[name=date]").val();
	let data;
	if(deadline==""){//기한이 없을때
		data = {
			title : $(".listEditPage .inputUI .title input[name=title]").val().trim(),
			content :$(".listEditPage .inputUI ._content textarea").val()			
		};	
	}
	else{//기한이 있을때

		time = new Date(deadline);
		time.setHours(time.getHours()+9);//
		time = time.getTime();
		
		data = {
				title : $(".listEditPage .inputUI .title input[name=title]").val().trim(),
				deadline : time,
				content :$(".listEditPage .inputUI ._content textarea").val() ,			
		};
		
	}
	if(process == "add"){
		
		ajax("post","/listEdit/add",data);
		EditDateFlag = true;
	}
	if(process == "modify"){
		data.priority = priority;
		ajax("post","/listEdit/modify",data);
		EditDateFlag = true;
	}
	
});

$(".listEditPage .inputUI .buttons input[name=cancel]").on("click",()=>{
		
	disappearEdit();//list.js에 선언되어있음
	EditDateFlag = true;
//	window.location.href=contextPath+"/list";
});

//textarea 글자 카운터기
//출처 : https://zinee-world.tistory.com/237
$(function() {
    $('#content').keyup(function (e){
        var content = $(this).val();
//        $(this).height(((content.split('\n').length + 1) * 1.5) + 'em');
        $('#counter').html(content.length + '/300');
    });
    $('#content').keyup();
});