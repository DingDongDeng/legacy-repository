let selectProject ={
		pName : "",
		pId : ""	
	};

$("#download").on("click",()=>{
	Ajax("post", "/contentDownLoad", selectProject);
	
});

$("#addButton").on("click", addButtonTransToInputUI);
$(".x").each((index,item)=>{
	item.addEventListener("click",function(){
		xButtonEvent($(this));
	});
});

projectAddEvent(); //클릭 및 더블클릭 이벤트 등록하는 함수



var addButton = "<div id='addButton' onclick='addButtonTransToInputUI()'><div></div></div>";

var inputUI = ""
	+"<div id='inputUI'>" 
	+	"<input type='text' placeholder='프로젝트명(책이름)'></br>"
	+	"<input type='button' value='확인' onclick='inputButton_yes()'>"
	+	"<input type='button' value='취소' onclick='inputButton_no()'>"
	+"</div>";
var xButton ="<div class='x' id='x' style='float:right'></div>";


function makeAddButton(){
	$("#projectList").append(addButton);
}
function deleteAddButton(){
	$("#addButton").remove();
}
function makeInputUI(){ 
	$("#projectList").append(inputUI);
}
/*
 * #projectList 안에 project 1,2,3,4.... 들이 있고 제일 마지막에 #addButton이 존재함
 * 
 */
function deleteInputUI(){ 
	$("#inputUI").remove();
}

function inputButton_yes(){
	addProject();
}
function inputButton_no(){
	deleteInputUI();
	makeAddButton();
}

function addButtonTransToInputUI(){
	deleteAddButton();
	makeInputUI();
}

function addProject(){
	const project ={
			projectName : $("#inputUI input[type=text]").val().trim()
	}
	Ajax("POST", "/projectAdd.check", project);

}
function refreshProjectList(){
	$.ajax({
		type:"POST",
		url:contextPath+"/projectListRefresh",
		success:(data)=>{
			const errName = data.STATE.trim();
			const errContent = data.DETAIL.trim();
			alertResultProject(errName,errContent);
			
			const projectList = data.projectList;
			$("#projectList").empty();
			
			projectList.forEach((item, index, array)=>{
				$("#projectList").append(""
						+"<div class = 'border project'>"
						+ 	"<div class='x' id='x' style='float:right'></div>" 
						+	"<h1 data-pid='"+item.pId+"' class='projectName'>" + item.pName+"</h1>" 
						+"</div>"  
				 );
				if((projectList.length-1) == index){ //요소들이 전부다 추가된뒤에
					makeAddButton();
					xButtonAddEvent();
					projectAddEvent();
				}
			});
		},
		error:(err)=>{
			alert("err : " + JSON.stringify(err));
		}
	});
	
}
function xButtonEvent(obj){
	
	if(confirm("정말 삭제하시겠습니까?")){
		
		const projectId = String(obj.parent().find(".projectName").data("pid"));
		console.log("pId :" + projectId);
		const projectName = obj.parent().find(".projectName").text();
		console.log("삭제할 프로젝트명 : " + projectName);
		deleteProject(projectId, projectName);
		
	}
	
}
function deleteProject(pId,_pName){
	const project ={
			pId:pId.trim(),
			pName:_pName.trim() 
	}
	Ajax("POST", "/projectDelete", project);

}

function xButtonAddEvent(){
	$(".x").each((index,item)=>{
		item.addEventListener("click",function(){
			xButtonEvent($(this));
		});
	});
	
}

function projectAddEvent(){
	$(".project").each((index,item)=>{
		
		$(item).on("click",function(){
			
			$(".project").each((index,item)=>{
				$(item).css("background","white");
				$(item).css("color","black");
			});
//			$(this).css("background","#A2D4A8");
			$(this).css("background","#738080");
			$(this).css("color","white");
			selectProject.pId = String($(this).find(".projectName").data("pid"));
			selectProject.pName = $(this).find(".projectName").text();
		});
		
		$(item).on('doubletap',function(){ //모바일의 더블탭
			const pId = String($(this).find(".projectName").data("pid"));
			const pName = $(this).find(".projectName").text();
			$("#form input[type=text][name=pId]").val(pId);
			$("#form input[type=text][name=pName]").val(pName);
			$("#form").submit();
		});
		$(item).dblclick(function(){ //데스크탑의 더블클릭
			const pId = String($(this).find(".projectName").data("pid"));
			const pName = $(this).find(".projectName").text();
			$("#form input[type=text][name=pId]").val(pId);
			$("#form input[type=text][name=pName]").val(pName);
			$("#form").submit();
			
		});
	});

	
	
}

			
		

function alertResultProject(errName, errContent, data){	
	switch (errName) {
	case "ERR_PROJECT_NAME":
		if(errContent=="NULL") 
			alert("프로젝트 이름을 입력해주세요.");
		break;			
	case "ERR_LOGIN": 
		if(errContent=="NO_LOGIN"){
			alert("로그인을 해주세요!");
			window.location.href= contextPath+"/login";				
		}
		break;
	case "ERR_PID":
		if(errContent=="NOT_USERS_PID"){
			alert("검증되지 않은 프로젝트 감지");
		}
		if(errContent=="NULL"){
			alert("pId 값 null 금지 : 프로젝트를 선택해주세요!");
		}
	case "SUCCESS":
		if(errContent=="SUCCESS_ADD_PROJECT"){
			refreshProjectList();
//			alert("프로젝트를 추가하였습니다.");
		}
		if(errContent=="SUCCESS_REFRESH_PROJECT_LIST"){
//			alert("프로젝트를 갱신하였습니다.")
		}
		if(errContent=="SUCCESS_DELETE_PROJECT"){
			refreshProjectList();
//			alert("프로젝트를 삭제하였습니다.")
		}
		if(errContent=="SUCCESS_CONTENT_DOWNLOAD"){
			const text = data.text;
			const fileName = selectProject.pName;
			saveToFile_Chrome(fileName, text);
		}
		break;
	default:
		alert("정의되지 않은 DATA(STATE)");
		break;
	}
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
			  alertResultProject(errName,errContent,data);
		  },
		  error:(err)=>{
			  alert("fail : "+ JSON.stringify(err));
		  }
	});
}


function saveToFile_Chrome(fileName, content) {//크롬에서 txt 다운받기
    var blob = new Blob([content], { type: 'text/plain' });
 
    objURL = window.URL.createObjectURL(blob);
            
    // 이전에 생성된 메모리 해제
    if (window.__Xr_objURL_forCreatingFile__) {
        window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
 
    var a = document.createElement('a');
 
    a.download = fileName;
    a.href = objURL;
    a.click();
}







