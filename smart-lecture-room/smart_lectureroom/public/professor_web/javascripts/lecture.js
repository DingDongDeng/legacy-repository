
const create = $(".lecturePage .create");
const createBtn = create.find(".createBtn"); // + 버튼, 강의 리스트를 생성
const createUI = create.find(".createUI"); //강의 영상 목록 생성UI 
const title = createUI.find("input[name=title]");

const controllBtn = createUI.find(".controllBtn"); //강의 비디오 관리 관련 버튼
const recBtn = controllBtn.find("input[name=rec]");
const saveBtn = controllBtn.find("input[name=save]");

const lectureList = $(".lecturePage .lectureList"); //영상 리스트
const lecture = lectureList.find(".lecture"); //영상 항목들
const lectureTitle = lecture.find(".title"); //영상 항목의 제목들
const lectureDelete = lecture.find(".delete"); //영상 항목의 삭제버튼
// const autoSaveCheckBox = controllBtn.find("input[name=autoSaveFlag]");

let lectureName ;
let lectureID ;
let front_camera_ip;
let back_camera_ip;
let buildingName;
let lectureRoomNum;


var btnState="RECORD";
var filePath =""; //영상이 저장될 파일경로
var seq=""; //읽어온 비디오 시퀀스

var requestData ={}; //영상 요청에 사용할 데이터

$(function(){
    $(window).on("beforeunload", function(){
        if(client != null){
            client.then(client=>{
                stopRequest(client, requestData);//스트리밍 중지 요청
            })
        }
    });    

    lectureName = decodeURI(urlSplit[urlSplit.length-6]);
    lectureID = urlSplit[urlSplit.length-5];
    front_camera_ip = urlSplit[urlSplit.length-4];
    back_camera_ip = urlSplit[urlSplit.length-3];
    buildingName = decodeURI(urlSplit[urlSplit.length-2]);
    lectureRoomNum = decodeURI(urlSplit[urlSplit.length-1]);

    setRequestData();
    
    allLectureTitleAddEvent(lectureTitle);
    allLectureDeleteAddEvent(lectureDelete);
    createBtnAddEvent(createBtn);
    recBtn.on("click",recBtnEvent);

    saveBtn.on("click",saveBtnEvent);
});
function saveBtnEvent(){
    saveBtn.addClass("display-none");
    client.then(client_=>{
        stopRequest(client_, requestData);//스트리밍 중지 요청
        client = null;
    })

    
    setRecBtnState("RECORD"); //버튼상태를 RECORD로 변경(이후에 눌렸을때 실행한 프로세스)
    createBtn.trigger("click");//createUI닫아 (trigger사용)

    const data = {
        lecture_id : lectureID,
        video_info:[
            {
                lecture_video_id : seq,
                video_title : title.val().trim(),
                video_path : filePath
            }
        ]
    }
    ajax("post","/saveLectureVideoProcess",data).then(buildVideoListUI_SAVE); //영상항목생성    
    
}

function recBtnEvent(){
    if(btnState=="PAUSE"){
        console.log(btnState)
        client.then(client=>{
            pauseRequest(client,requestData);
            setRecBtnState("RECORD");//일시정지버튼을 누르면 재생버튼으로
        })    
        return;
    }

    // if(btnState=="RECORD") {
    //     saveBtn.removeClass("display-none");
    //     console.log(btnState)
    //     recordRequest(client, requestData);
    //     setRecBtnState("PAUSE"); //재생버튼을 누르면 일시정지버튼으로
    //     return;
    // }
    if(btnState=="RECORD") {
        saveBtn.removeClass("display-none");
        console.log(btnState)
        client.then(client=>{
            recordRequest(client, requestData);
        })
        setRecBtnState("PAUSE"); //재생버튼을 누르면 일시정지버튼으로
        return;
    }
    
}

function setRecBtnState(state){
    btnState = state;
    recBtn.val(state);//간단하게 일단 글씨만....이후에 글씨가 아닌 이미지로도 사용 가능하게 적용
}


function setRequestData(){//저장될 파일의 이름 설정
    ajax("post", "/getVideoSeqProcess", {}).then((data)=>{
        seq = data.seq;
        filePath = "/resources/video/lecture/"+parseLectureName(lectureName)+"/"+data.seq;
        console.log("저장될 파일명 : " + filePath);
        requestData ={
            lectureName :lectureName ,
            lectureID : lectureID ,
            // ip : front_camera_ip.split(":")[0] ,
            ip : front_camera_ip,
            buildingName :buildingName, //필수
            lectureRoomNum : lectureRoomNum,//필수
            filePath : filePath
        }
    });
    
}
function parseLectureName(lectureName){
    let name;
    if(lectureName =="자바스크립트")
        return "javascript";
    if(lectureName =="알고리즘")
        return "algorithm";
    if(lectureName =="자료구조")
        return "datastructure";
}



function allLectureDeleteAddEvent(lectureDelete){
    lectureDelete.each(function(index,item){
        const lectureDelete = $(item);
        lectureDeleteAddEvent(lectureDelete);
    });
}

function lectureDeleteAddEvent(lectureDelete){
    lectureDelete.on("click", lectureDeleteEvent);
}
function lectureDeleteEvent(){
    //Delete Process를 여기서부터 만들면됨
    // lectureID = urlSplit[urlSplit.length-3];
    const lectureInfo = {
        video_id : $(this).parent().find(".video_id").text().trim(),
        lecture_id : lectureID,
        lectureName : lectureName//한글 URI에서 강의명을 가져오기 위해 필요
    };

    const delTarget = $(this).parent(); //삭제할 비디오
    ajax("post", "/deleteLectureVideoProcess",lectureInfo)
    .then((data)=>{
        delTarget.remove();
    })
    .catch((err)=>{console.log(err);});
}

function createBtnAddEvent(createBtn){
    createBtn.on("click",createBtnEvent);
}


var client = null;
function createBtnEvent(){
    const state = createUI.hasClass("display-none");

    if(client==null){
        console.log("테스트 ___ "+ JSON.stringify(requestData));
        client = joinRequest(requestData);//라즈베리파이의 영상 연결
        console.log("client test!! :" + client);
    }
    else{
        client.then(client=>{
            stopRequest(client,requestData);
            client.close();
            client = null;
        })
    }

    if(state===true){
        createUI.removeClass("display-none");
        
        return;
    }

    createUI.addClass("display-none");

}


function allLectureTitleAddEvent(lectureTitle){
    lectureTitle.each(function(index, item){
        const lectureTitle = $(item);
        lectureTitleAddEvent(lectureTitle);
    });
}
function lectureTitleAddEvent(lectureTitle){
    lectureTitle.on("click",lectureTitleEvent);
}
function lectureTitleEvent(){
    const lectureTitle = $(this);
    const lecture = lectureTitle.parent();
    const video_id = lecture.find(".video_id").text().trim();//video_id 태그가 아닌 값
    const video = lecture.find(".video");    
    // const infoAll = $(".lecturePage .lectureList .attend .info"); //모든 info class
    const controllBtn = lecture.find(".controllBtn");
    // const lectureID = urlSplit[urlSplit.length-3];
    const data ={
        lecture_id :lectureID,
        lecture_video_id  : parseInt(video_id),
    }
    
    ajax("post", "/showLectureVideoProcess", data )
    .then((data)=>{
        console.log("테스트------------a");
        console.log(JSON.stringify(data));
        const lectureInfo = data.DATA.data;
        
        buildAttendListUI_SHOW(lectureInfo , lecture);
    })
    .catch((err)=>{console.log(err);});
}

function buildAttendListUI_SHOW(lectureInfo , target){ //출석리스트 제목을 클릭했을때 보일 내용을 생성함
    const video = target.find(".video");
    
    const video_id = lectureInfo.lecture_video_id;

    
    const video_title = lectureInfo.video_title;
    const video_path = lectureInfo.video_path;
    /**video에 무언가 들어있다면 */
    if(video.children().length>0){
        video.empty();

    }
    else{ //video가 비어있다면
        setTimeout(function(){
            let html ="";
            console.log(video_path);
            html += "<video src='"+video_path+".mp4' controls muted> </video> </br>"
            // html += "<input type='button' value='REC'>"
            // html += "<input type='button' value='저장'>"
            video.html(html);
        },1000);        
    }
    
}
function buildVideoListUI_SAVE(data){ //영상항목을 저장하기 위해 저장버튼을 눌렀을때 일어나는 로직
    console.log("테스트------------1");
    console.log(JSON.stringify(data));

    const lectureInfo = data.data;
    console.log("테스트------------2");
    console.log(JSON.stringify(lectureInfo));
    const videoInfo = lectureInfo.video_info[0];
    
    let lectureVideoHTML="";
    lectureVideoHTML += "<div class='lecture'>"
    lectureVideoHTML   += "<div class='video_id display-none'>" + videoInfo.lecture_video_id + "</div>"
    lectureVideoHTML   += "<div class='title'>"
    lectureVideoHTML   += "<img src='/public/professor_web/img/꺽쇠.png'>"
    lectureVideoHTML   += "&nbsp;"+ videoInfo.video_title+"</div>"
    lectureVideoHTML   += "<div class='delete'> x </div>"
    lectureVideoHTML   += "<div class='video'></div>"
    lectureVideoHTML   += "<div class='controllBtn'>"
    lectureVideoHTML += "</div>"
    lectureList.prepend(lectureVideoHTML);//얘한테만 이벤트 걸어줄수있어야함
    const lectureTitle = lectureList.find(".lecture .title:first");
    const lectureDelete = lectureList.find(".lecture .delete:first");
    lectureTitleAddEvent(lectureTitle);
    lectureDeleteAddEvent(lectureDelete);

    setRequestData();//setFilePath() 실행
    // lectureTitle.trigger("click");//lectureVideoHTML 통해 생성한 dom을 트리거



    // createUI.addClass("display-none"); //리스트 생성 UI 숨김
    /**
     * createUI에서 작업한 출석리스트를 초기화하기 위한 로직
     * .studentList를 삭제하고
     * .createUi에 다시 defaultStudentList를 추가함
     */
    // let studentList = createUI.find(".studentList");
    // studentList.remove();
    // createUI.prepend(defaultStudentList);
    
}








