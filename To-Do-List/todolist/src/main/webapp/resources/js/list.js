$(document).ready(function(){
	setColor();//리스트의 색을 결정
	appearItems();//아이템들의 애니메이션 효과를 동반한 배치
	firstDeadDate = setFirstDeadDate();
	$(".listPage").removeClass("hidden");
	coverAddEvent();//제목의 이벤트 등록(펼치기)
	setCheckBoxState();//체크박스 체크상태 설정
	checkBoxAddEvent();//체크박스 이벤트 등록(색변경, DB업데이트);
	deleteButtonAddEvent();
	modifyButtonAddEvent();
	updownButtonAddEvent();
	
//	$(".listEditPage").addClass("hidden");
});





function appearItems(){
	$(".listPage").removeClass("hidden");
	$(".listPage").animate({opacity:"1"},300,function(){
		$(".listPage .item").each(function(index,item){
			let time = 300 + index * 100;
			$(item).animate({right:"0"},time);
			$(".listEditPage").addClass("hidden");//아이템 목록이 나타나면 편집창이 사라져야됨
		});
	});
		
	
}
function disappearItemList(){
	const item = $(".item");
	
	if(item.length==0){
		$(".listPage").addClass("hidden");//아이템 목록이 사라지면 편집창이 나타나야됨
		appearEdit();
	}
	else{
		$(".item").each(function(index,item){
			let time = 300 + index * 100;
			$(item).animate({right:"-1000"},time);
			$(".listPage").animate({opacity:"0"},300,function(){//리스트페이지의 헤더를 포함하여 사라짐
				$(".listPage").addClass("hidden");//아이템 목록이 사라지면 편집창이 나타나야됨
				appearEdit();//편집창 나타나기
			})
		});
	}
	
}

function appearEdit(){
	$(".listEditPage").removeClass("hidden");
	$(".listEditPage").animate({opacity:"1"},500);
}
function disappearEdit(){
	$(".listEditPage").animate({opacity:"0"},500,function(){
		$(".listEditPage").addClass("hidden");
		appearItems();
		clearEditPage();
	});
}

function clearEditPage(){
	$("#title").val("");//
	$("#date").val("");//편집페이지의 기간입력창 초기화
	$("#content").val("");
	$("#counter").text("0/300");
	
}
//추가버튼
$(".listPage .header input[name=add]").on("click",()=>{

	process="add";//편집페이지에서 무엇을 하는지 알리는 변수
	disappearItemList();

});

//제목을 클릭했을 때의 이벤트 정의

function coverAddEvent(){
	$(".listPage .list .cover > div").each(function(index,item){
		$(item).on("click",coverEvent);
	}); //todolist 각 항목의 세부정보를 보이도록하는 이벤트
}
function coverEvent(){
	const detail = $(this).parent().parent().find(".detail");
	if(detail.css("opacity")==0){//리스트의 상세설명 펼치기
		detail.removeClass("hidden");
		detail.animate({height:"250"},300,function(){
			$(this).animate({opacity:"1"},300,function(){
				
			});
		});
	}
	else{
		detail.animate({opacity:"0"},300,function(){
			$(this).animate({height:"0"},300,function(){
				$(this).addClass("hidden");
			})
			
		});
	}
}




//삭제버튼
function deleteButtonAddEvent(){
	$(".listPage .list .item .detail .edit input[name=delete]").each(function(index,item){
		$(item).on("click",deleteButtonEvent);
	});
}
function deleteButtonEvent(){
	const info = $(this).parent().parent().parent().parent().find(".info");
	const priority = info.find(".priority").text().trim();//유저가 상호작용하는 항목의 우선순위
	const item = info.parent();
	
	const data={
			priority : parseInt(priority),
	}
	
	ajax("post","/listEdit/delete",data,item);
}



//수정버튼
function modifyButtonAddEvent(){
	$(".listPage .list .item .detail .edit input[name=modify]").each(function(index,item){
		$(item).on("click",modifyButtonEvent);
	});
}
function modifyButtonEvent(){
	process="modify";
	
	const info = $(this).parent().parent().parent().parent().find(".info");
	const cover = info.parent().find(".cover");
	const detail = info.parent().find(".detail");
	
	
	const title = cover.find(".title").text().trim();
	const date = cover.find(".date").text().trim();
	const content = detail.find("._content").html().trim();		
	const _priority = info.find(".priority").text().trim();//유저가 상호작용하는 항목의 우선순위
	const state = info.find(".state").text().trim();//유저가 상호작용하는 항목의 상태
	
	
	$("#title").val(title);
	if(date!=""){
		let _date = new Date(date);
		_date.setHours(_date.getHours()+9);//9시간 차이 보정 GMT+9 가 소실되서그런듯
		$("#date").val(_date.toISOString().slice(0, -1));	
	}
	let __content= content;
	__content = __content.replace(/<br>/gi,"\n"); //정규식을 통해 replace 를 replaceAll처럼 사용
	$("#content").val(__content);
	process = "modify";
	priority = parseInt(_priority);
	//process와 priority는 variableJS.jsp에 선언되어있음

	disappearItemList();
	
}




function setColor(){ //모든 요소들의 적절한 색으로 초기화함
	
	let cover_div = $(".listPage .list .item").find(".cover > div");
	let detail = $(".listPage .list .item").find(".detail");
	
	cover_div.each(function(index,item){
		const date = $(item).find(".date").text();
		
		let today = new Date().getTime();
		let deadline = new Date(date).getTime();
		
		let flag = deadline-today;
	
		if(flag<0){
			//빨간색 :기한이 지남
			//이전색을 없에는 코드가 필요
			$(item).removeClass("redBorder");
			$(item).removeClass("greenBorder");
			$(item).removeClass("grayBorder");
			$(item).addClass("redBorder");
			
			
			const detail = $(item).parent().parent().find(".detail >div");
			detail.removeClass("redBorder");
			detail.removeClass("greenBorder");
			detail.removeClass("grayBorder");
			detail.addClass("redBorder");
		}
		else{
			//녹색
			//이전색을 없에는 코드가 필요
			$(item).removeClass("redBorder");
			$(item).removeClass("greenBorder");
			$(item).removeClass("grayBorder");
			$(item).addClass("grayBorder");
			
			
			const detail = $(item).parent().parent().find(".detail >div");
			detail.removeClass("redBorder");
			detail.removeClass("greenBorder");
			detail.removeClass("grayBorder");
			detail.addClass("grayBorder");
			
		}
		
		const checkBox = $(item).parent().find("input[name=check]");
		
		if(checkBox.is(":checked")){
			
			$(item).removeClass("redBorder");
			$(item).removeClass("greenBorder");
			$(item).removeClass("grayBorder");
			$(item).addClass("greenBorder");
			
			
			const detail = $(item).parent().parent().find(".detail >div");
			detail.removeClass("redBorder");
			detail.removeClass("greenBorder");
			detail.removeClass("grayBorder");
			detail.addClass("greenBorder");
		}
		
		
	});
	
}
function setCheckBoxState(){
	$(".listPage .list .item .cover input[name=check]").each(function(index,item){
		const state = $(item).parent().parent().find(".info .state").text();
		if(state=="C")
			$(item).prop("checked",true);
		setColor();
	});
}
function checkBoxAddEvent(){
	$(".listPage .list .item .cover input[name=check]").each(function(index,item){
		
			
		$(item).on("click",checkBoxEvent);
	});
}

function checkBoxEvent(){
	const info = $(this).parent().parent().find(".info");
	const priority = info.find(".priority").text().trim();
	const state = info.find(".state").text().trim();
	if($(this).is(":checked")){

		if(!confirm("완료처리를 합니다. 목록에서 제거하시겠습니까?")){
			/*제거안하는 경우*/
			const data = {
					priority : parseInt(priority),
					state : state
			}
			
			ajax("post","/listEdit/complete",data,info.find(".state"));
			setColor();
		}
		else{
			/*제거하는 경우*/
			let data ={
				priority : parseInt(priority),
			};
			ajax("post","/listEdit/delete",data,info.parent());
		}
	}
	else{
		const data = {
				priority : parseInt(priority),
				state : state
		}
		ajax("post","/listEdit/complete",data,info.find(".state"));
		
		setColor();
	}
}


//
//
//
//
//
//function sendPost(action, params) {
//
//	var form = document.createElement('form');
//	form.setAttribute('method', 'post');
//	form.setAttribute('action', contextPath+action);
//	document.charset = "utf-8";
//	
//	for(var key in params){
//		var hiddenField = document.createElement('input');
//		hiddenField.setAttribute('type', 'hidden');
//		hiddenField.setAttribute('name', key);
//		hiddenField.setAttribute('value', params[key]);
////		alert(key + " "+params[key]);
//		form.appendChild(hiddenField);
//	}
//	
//
//	document.body.appendChild(form);
//	form.submit();
//
//}

//obj는 체크박스를 뜻함
function setRed(obj){
	let cover = $(obj).parent();
	let cover_div = cover.find(".target");
	let detail = cover.parent().find(".detail");
	
	cover_div.removeClass("greenBorder");
	cover_div.removeClass("grayBorder");
	cover_div.addClass("redBorder");
	
	detail.removeClass("redBorder");
	detail.removeClass("grayBorder");
	detail.addClass("greenBorder");
}
function setGreen(obj){
	let cover = $(obj).parent();
	let cover_div = cover.find(".target");
	let detail = cover.parent().find(".detail");
	
	cover_div.removeClass("redBorder");
	cover_div.removeClass("grayBorder");
	cover_div.addClass("greenBorder");
	
	detail.removeClass("redBorder");
	detail.removeClass("grayBorder");
	detail.addClass("greenBorder");
	
}
function setGray(obj){
	let cover = $(obj).parent();
	let cover_div = cover.find(".target");
	let detail = cover.parent().find(".detail");
	
	cover_div.removeClass("redBorder");
	cover_div.removeClass("greenBorder");
	cover_div.addClass("grayBorder");
	
	detail.removeClass("redBorder");
	detail.removeClass("greenBorder");
	detail.addClass("grayBorder");
}



//우선순위 up ,down 버튼
function updownButtonAddEvent(){
	$(".listPage .list .item .detail span").each(function(index, item){
		const up = $(item).find("input[name=up]");
		const down = $(item).find("input[name=down]");

		up.on("click",upButtonEvent);
		down.on("click",downButtonEvent);
	});
}
function upButtonEvent(){
	const _item = $(this).parent().parent().parent();
	const priority = _item.find(".info .priority").text().trim();
	let data={
			priority: priority
		};
	ajax("post","/listEdit/up",data,_item);
}

function downButtonEvent(){
	const _item = $(this).parent().parent().parent();
	const priority = _item.find(".info .priority").text().trim();
	let data={
			priority: priority
		};
	ajax("post","/listEdit/down",data,_item);
}





