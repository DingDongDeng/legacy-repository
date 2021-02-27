
function ajax(type, url, data){
	var data2 = null;//특정값을 추가로 사용하고 싶을때 사용
	if(arguments[3]!=undefined){
		data2 = arguments[3];
	}


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
			  if(data2==null)
				  alertResult(errName,errContent,data);
			  else
				  alertResult(errName,errContent,data,data2);
		  },
		  error:(err)=>{
			  alert("fail : "+ JSON.stringify(err));
		  },
		  complete:()=>{
			  $('.wrap-loading').addClass('display-none');
		  }
	});
}


function alertResult(errName, errContent, data){
	var data2;//특정값을 추가로 사용하고 싶을때 사용
	if(arguments[3]!=undefined){
		data2 = arguments[3];
	}
	if(errName=="ERR"){
		switch(errContent){
			//login.jsp................................
			case "EMPTY_MAIL" :
				alert("메일을 입력해주세요!");
				break;
			case "EMPTY_PASSWORD" :
				alert("비밀번호를 입력해주세요!");
				break;
			case "NOT_FOUND_MAIL":
				alert("회원가입 된 메일이 아닙니다.");
				break;
			case "NOT_CORRECT_PASSWORD":
				alert("비밀번호가 일치하지 않습니다.");
				break;
			case "NOT_EXECUTE_MAIL_AUTH_CHECK":
				alert("메일인증을 마치지 않은 계정입니다!");
				break;
			//signUp.jsp.......................................
			case "ALREADY_EXIST_MAIL":
				alert("이미 회원가입된 메일입니다!");
				break;
			case "EMPTY_MAIL":
				alert("메일을 입력해주세요!");
				break;
			case "EMPTY_PASSWORD":
				alert("비밀번호를 입력해주세요!");
				break;
			case "EMPTY_PASSWORD_CHECK":
				alert("비밀번호확인을 입력해주세요!");
				break;
			case "NOT_ALLOW_FORMAT_MAIL":
				alert("메일형식을 확인해주세요!");
				break;
			case "NOT_ALLOW_FORMAT_PASSWORD":
				alert("비밀번호 형식을 확인해주세요!\n 영문,숫자,특수문자 포함 8글자 이상");
				break;
			case "NOT_SAME_PASSWORD_AND_PASSWORD_CHECK":
				alert("비밀번호를 정확히 입력해주세요!");
				break;
			//listEdit.jsp..............................
			case "EMPTY_TITLE":
				alert("제목을 입력해주세요.");
				break;
			case "EMPTY_CONTENT":
				alert("내용을 입력해주세요.");
				break;
			case "OVER_DEADLINE":
				alert("마감기한은 과거로 설정할 수 없습니다.");
				break;
			case "TOO_LONG_TITLE":
				alert("제목은 20글자 이하여야 합니다.");
				break;
			case "TOO_LONG_CONTENT":
				alert("내용은 300글자 이하여야합니다.");
				break;
			//list.jsp.....................................
			case "NOT_CORRECT_PRIORITY":
				alert("잘못된 우선순위를 사용하였습니다.")
				break;
			case "CANT_MOVE":
				alert("이동할수 없습니다!");
				break;
			default :
				alert("정의되지 않은 상태입니다.(ERR)");
				break;
		}
	}
	if(errName=="SUCCESS"){
		switch(errContent){
			case "SUCCESS_LOGIN" ://login.jsp
				window.location.href=contextPath+"/list";
				break;
			case "SUCCESS_SIGN_UP":
				alert("회원가입되었습니다!");
				$(".signUpPage .inputUI .userInfo").remove();
				$(".signUpPage .inputUI").html("<h3>회원가입하신 이메일로 메일인증을 완료해주세요!</h3>");
				break;
			case "SUCCESS_SEND_MAIL_FOR_FIND_PASSWORD":
				alert("메일이 발송되었습니다! \n 확인해주세요!");
				disappearFindPWForm();
				break;
			case "SUCCESS_ADD_LIST" ://listEdit.jsp {add}
				const listDTO = data.ListDTO;
				let resultDate="";
				if(listDTO.deadline!=undefined){
					let _date_ = new Date(listDTO.deadline);
					_date_.setHours(_date_.getHours()-9);
					resultDate = new Date(_date_).format("yyyy-MM-dd HH:mm");
					console.log(resultDate);
				}
				
				$(".listPage .list").append(""
						+"<div class='item' >"
							+"<div class='info hidden'>"
								+"<div class='priority'>"+listDTO.priority+"</div>"
								+"<div class='state'>"+listDTO.state+"</div>"
							+"</div>"
							+"<div class='cover'>"
								+"<div class='target shadow'>"
									+"<div class='title'>"
										+listDTO.title
									+"</div>"
									+"<div class='date'>"
										+resultDate
									+"</div>"
								+"</div>"
								+"<input  type='checkbox' name='check'>"
							+"</div>"
						+"<div class='detail hidden'>"
							+"<div class='shadow'>"
								+"<div class='_content selector'>"
									+listDTO.content
								+"</div>"
								+"<div class='edit'>"
									+"<input class='shadow' type='button' name='modify'>"
									+"<input class='shadow' type='button' name='delete'>"
								+"</div>"
							+"</div>"
							+"<span>"
								+"<input class='shadow' type='button' name='up'><br>"
								+"<input class='shadow' type='button' name='down'>"
							+"</span>"
						+"</div>"
					+"</div>"
						);
				const item___ = $(".listPage .list .item ").last();
				const cover_div = item___.find(".cover .target");
				const checkBox = item___.find(".cover input[type=checkbox]");
				const deleteButton = item___.find(".detail .edit input[name=delete]");
				const modifyButton = item___.find(".detail .edit input[name=modify]");
				const upButton = item___.find(".detail span input[name=up]");
				const downButton = item___.find(".detail span input[name=down]");
				
				setCheckBoxState();
				cover_div.last().on("click",coverEvent);
				checkBox.last().on("click",checkBoxEvent);
				deleteButton.last().on("click",deleteButtonEvent);
				modifyButton.last().on("click",modifyButtonEvent);
				upButton.last().on("click",upButtonEvent);
				downButton.on("click",downButtonEvent);
				
		
				setColor();//새로만든 항목의 색 지정
				disappearEdit();
				firstDeadDate = setFirstDeadDate()
				break;
			case "SUCCESS_MODIFY_LIST" ://listEdit.jsp {modify}, 수정이 성공적으로 적용되었을경우
				const listDTO_ = data.ListDTO;
				const item_ = $(".listPage .list .item");
				item_.each(function(index,item){
					if(index==priority){
						$(item).find(".priority").text(listDTO_.priority);
						$(item).find(".state").text(listDTO_.state);
						$(item).find(".title").text(listDTO_.title);
						let date = new Date(listDTO_.deadline);
						date = date.setHours(date.getHours());
						$(item).find(".date").text(new Date(date).format("yyyy-MM-dd HH:mm"));
						$(item).find("._content").html(listDTO_.content);

						alertList();//알람갱신
					}
						
				});
				
				
				disappearEdit();
				firstDeadDate = setFirstDeadDate();
				break;
			case "SUCCESS_DELETE_LIST":// list.jsp 
				const item = data2;
				const list = item.parent();
				
				item.animate({opacity:"0"},600,function(){
					$(this).animate({height:"0"},600,function(){
						$(this).remove();
						list.find(".item").each(function(index,item){
							$(item).find(".info .priority").text(index);
							firstDeadDate = setFirstDeadDate();
							alertList();
						});
					});
				});
				
				
				
				break;
			case "SUCCESS_UPDATE_STATE_LIST":// list.jsp 의 체크박스
				const state = data2; //이벤트가 일어난 item의 class=state div
				const stateVal = state.text();
				if(stateVal=="R") //진행중인경우 마감으로 상태변경
					state.text("C");
				if(stateVal=="C") //마감인경우 진행중으로 상태변경
					state.text("R");
				alertList();
				break;
			case "SUCCESS_UPDATE_PRIORITY_UP_LIST":// list.jsp 우선순위 업
				let height = "125"; //펼쳐지지 않은 리스트의 크기 (제목의크기 : 110 + 마진+15)
				const _item = data2;
				const prevItem = _item.prev();
				prevItem.animate({opacity:"0"},300,function(){
					$(this).animate({height:"0"},300,function(){
						
						const temp = $(this).detach();
						_item.after(temp);
						
						const detail= $(this).find(".detail");
						//----------------
						if(!detail.hasClass("hidden")){//펼쳐진 리스트의 크기 
							height ="370";
						}
						_item.next().animate({height:height},300,function(){
							$(this).animate({opacity:"1"},300,function(){
								$(this).css("height","");
															
								/*priority 초기화*/
								const _list = $(".list");
								_list.find(".item").each(function(index,item){
									$(item).find(".info .priority").text(index);
								});
							});
						});
						
					});
				});

				break;
			case "SUCCESS_UPDATE_PRIORITY_DOWN_LIST":// list.jsp 우선순위 다운
				let _height = "125"; //펼쳐지지 않은 리스트의 크기 (제목의크기 : 110 + 마진+15)
				const __item = data2;
				const nextItem = __item.next();
				nextItem.animate({opacity:"0"},300,function(){
					$(this).animate({height:"0"},300,function(){
						
						const temp = $(this).detach();
						__item.before(temp);
						
						const detail= $(this).find(".detail");
						//----------------
						if(!detail.hasClass("hidden")){//펼쳐진 리스트의 크기 
							_height ="370";
						}
						__item.prev().animate({height:_height},300,function(){
							$(this).animate({opacity:"1"},300,function(){
								$(this).css("height","");
															
								/*priority 초기화*/
								const _list = $(".list");
								_list.find(".item").each(function(index,item){
									$(item).find(".info .priority").text(index);
								});
							});
						});
						
					});
				});
				
				
//				const __item = data2;
//				const nextItem = __item.next();
//				const _temp = __item.detach();
//				nextItem.after(_temp);
//				
//				const __list = $(".list");
//				console.log("시작");
//				__list.find(".item").each(function(index,item){
//					$(item).find(".info .priority").text(index);
//				});
//				
//				break;
			case "SUCCESS_ALERT_LIST" :
				
				break;
			default :
				alert("정의되지 않은 상태입니다.(SUCCESS)");
				break;
		}
	}
}
