
// const url = window.location.href;
// const urlSplit = url.split("/");

const create = $(".lecturePage .create");
const createBtn = create.find(".createBtn"); // + 버튼, 강의 리스트를 생성
const createUI = create.find(".createUI"); //강의 영상 목록 생성UI 
const controllBtn = createUI.find(".controllBtn"); //강의 비디오 관리 관련 버튼

const lectureView = $(".lecturePage .lectureView");
const lectureViewTitle = lectureView.find(".title");
const view = lectureView.find(".view");
const lectureList = $(".lecturePage .lectureList"); //출결 리스트
const lecture = lectureList.find(".lecture"); //출결 항목들
const lectureTitle = lecture.find(".title"); //출결 항목의 제목들
const lectureDelete = lecture.find(".delete"); //출결 항목의 삭제버튼
// const autoSaveCheckBox = controllBtn.find("input[name=autoSaveFlag]");

let lectureID;
let lectureName ;
let buildingName;
let lectureRoomNum;


let front_camera_ip;
let back_camera_ip;

var requestData ={};

$(function(){  

    lectureName = decodeURI(urlSplit[urlSplit.length-6]);
    lectureID = urlSplit[urlSplit.length-5];
    front_camera_ip = urlSplit[urlSplit.length-4];
    back_camera_ip = urlSplit[urlSplit.length-3];
    buildingName = decodeURI(urlSplit[urlSplit.length-2]);
    lectureRoomNum = decodeURI(urlSplit[urlSplit.length-1]);
    
    requestData= {
        // lectureName :lectureName ,
        // lectureID : urlSplit[urlSplit.length-5] ,
        // ip : front_camera_ip.split(":")[0] ,
        buildingName :buildingName, //필수
        lectureRoomNum : lectureRoomNum,//필수
        // filePath : filePath
    }
    
    
    allLectureTitleAddEvent(lectureTitle);
    allLectureDeleteAddEvent(lectureDelete);
    createBtnAddEvent(createBtn);
    lectureViewTitle.on("click",()=>{
        lectureViewEvent();
    });
    // saveBtnAddEvent(saveBtn_StudentList); 
    // autoAttendenceAddEvent(autoAttendence);
    // autoSaveCheckBoxAddEvent(autoSaveCheckBox);
});
var client=null;

function lectureViewEvent(){
    if(view.hasClass("display-none")){
        view.removeClass("display-none");
        client=joinRequest(requestData);
    }
    else{
        view.addClass("display-none");
        console.log("테스트");
        console.log(JSON.stringify(requestData));
        client.then(client=>{
            stopRequest(client,requestData);
            client.close();
            client=null;
        })        
    }
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
        // lectureName : decodeURI(urlSplit[urlSplit.length-4])//한글 URI에서 강의명을 가져오기 위해 필요
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

function createBtnEvent(){
    const state = createUI.hasClass("display-none");
    if(state===true){
        createUI.removeClass("display-none");
    }
    else{
        createUI.addClass("display-none");
    }

    // const infoAll = $(".attendPage .attendList .attend .info"); //모든 info class를 숨김
    // infoAll.each(function(index, item){ 
    //     const info = $(item);
    //     const controllBtn = info.parent().find(".controllBtn");
    //     info.empty();
    //     controllBtn.empty();
        
    // })
}

// function saveBtnAddEvent(saveBtn){
//     saveBtn.on("click", saveBtnEvent);
// }

// function saveBtnEvent(){
//     const saveBtn = $(this);
//     const btnName = saveBtn.attr("name");

//     let lectureID ;
//     let studentList;
//     let student ;
//     let session;
//     let attendID = undefined;

//     if(btnName ==="saveBtn_StudentList"){
//         lectureID = urlSplit[urlSplit.length-1];
//         studentList = $(".attendPage .create .createUI .studentList");
//         // student = studentList.find(".normalAttendence .student");
//         student = studentList.find(".student");
//         session = controllBtn.find("select option:selected").val();
//     }
//     if(btnName ==="saveBtnAttendList"){
//         lectureID = urlSplit[urlSplit.length-1];
//         studentList = $(".attendPage .attendList .attend .info");
//         student = studentList.find(".student");
//         const attend = saveBtn.parent().parent();
//         attendID = attend.find(".attendID");
//         session = attend.find(".session").text().trim();
//     }

//     let attendence = [];
//     student.each(function(index, item){
//         const student = $(item);
//         const id = student.find(".id").text().trim();
//         // const name = student.find(".name").text().trim();
//         // const attend = student.find(".attend input[name=attend"+index+"]:checked").val();
//         const attend = student.find(".attend input[type=radio]:checked").val();
        
        
//         /**
//          * 자동출석의 경우 아래 객체에 
//          * picture_path가 들어가야함
//          */
//         const attendenceInfo ={
//             student_id : id,
//             lecture_session : session,
//             attend_state : attend,
//         }

//         console.log(id+"의 출결상태 : " + attend);
//         attendence.push(attendenceInfo);
//     });

//     const attendInfo = {
//         lecture_id : lectureID,
//         attend_info : [{
//             attend_date : new Date().format("yyyy-MM-dd"), //하지만 서버에서 입력하는 것이 이상적
//             attendence: attendence
            
//         }],
//     };
//     if(attendID !== undefined){
//         attendInfo.attend_info[0].attend_id = attendID.text().trim();

//     }
//     /* 
//     const attendInfo ={
//         lecture_id : 3,
//         attend_info : [{
//             attend_date : 2018-09-12 .....
//             attendence :[
//                 {
//                     student_id : 2014335066,
//                     lecture_session : 1,
//                     attend_state : a001
//                 }
//             ]
//             (attend_id : 3)
//         }]
//     }

//     */
//     ajax("post", "/saveAttendProcess",attendInfo)
//     .then((data)=>{
//         buildAttendListUI_SAVE(data)
                
//     })
//     .catch((err)=>{console.log(err);});
// }
// function resetRadioButton(){
//     const radioButtons = createUI.find("input[type=radio]");
//     radioButtons.each(function(index, item){
//         const radio = $(item);
//         radio.attr("checked", false);
//     });
// }

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


    // createUI.addClass("display-none");//다른항목을 클릭하면 createUI를 숨김
    // if(info.html()!==""){ //제목을 한번더 클릭했을때 내용을 숨김
    //     info.empty();
    //     controllBtn.empty();
    //     return;
    // }
    //모든 출결항목들의 내용을 숨기고, 로직을 실행
    //이후 로직에서 하나의 항목만이 내용이 보여짐
    // infoAll.each(function(index, item){ 
    //     const info = $(item);
    //     const controllBtn = info.parent().find(".controllBtn");
    //     info.empty();
    //     controllBtn.empty();
        
    // })

    const data ={
        lecture_id :lectureID,
        lecture_video_id  : parseInt(video_id),
    }
    
    ajax("post", "/showLectureVideoProcess", data )
    .then((data)=>{
        console.log(JSON.stringify(data));
        const lectureInfo = data.DATA.data;
        console.log("테스트@@@@@@@@@@@@###");
        console.log(JSON.stringify(lectureInfo));
        buildLectureListUI_SHOW(lectureInfo , lecture);
    })
    .catch((err)=>{console.log(err);});
}

function buildLectureListUI_SHOW(lectureInfo , target){ //출석리스트 제목을 클릭했을때 보일 내용을 생성함
    console.log("테스트@@@@@@@@@@@@");
    console.log(JSON.stringify(lectureInfo));
    const video = target.find(".video");
    const video_id = lectureInfo.lecture_video_id;
    const video_title = lectureInfo.video_title;
    const video_path = lectureInfo.video_path;
    /**video에 무언가 들어있다면 */
    if(video.children().length>0){
        video.empty();

    }
    else{ //video가 비어있다면
        let html ="";
        html += "<video src='"+video_path+".mp4' controls muted> </video> </br>"
        // html += "<input type='button' value='REC'>"
        // html += "<input type='button' value='저장'>"
        video.html(html);
    }
    
    
}
// function buildAttendListUI_SAVE(data){ //출석항목을 생성하기 위해 저장버튼을 눌렀을때 일어나는 로직
//     const attendInfo = data.data;
//     const attend_id = attendInfo.attend_id;
//     const attend_date = attendInfo.attend_date;
//     const lecture_session = attendInfo.attendence[0].lecture_session;
//     const lectureName = decodeURI(urlSplit[urlSplit.length-2]);//한글 URI에서 강의명을 가져오기 위해 필요
    
//     let attendHTML="";
//     attendHTML += "<div class='attend'>"
//     attendHTML   += "<div class='attendID display-none'>" + attend_id + "</div>"
//     attendHTML   += "<div class='title'> "+attend_date+" "+ lecture_session +"차시 "+ lectureName +"</div>"
//     attendHTML   += "<div class='delete'> x </div>"
//     attendHTML   += "<div class='info'></div>"
//     attendHTML   += "<div class='controllBtn'>"
//     attendHTML += "</div>"
//     attendList.prepend(attendHTML);//얘한테만 이벤트 걸어줄수있어야함
//     const attendTitle = attendList.find(".attend .title:first");
//     const attendDelete = attendList.find(".attend .delete:first")
//     attendTitleAddEvent(attendTitle);
//     attendDeleteAddEvent(attendDelete);
//     attend.trigger("click");//attendHTML을 통해 생성한 dom을 트리거
//     createUI.addClass("display-none"); //리스트 생성 UI 숨김

//     /**
//      * createUI에서 작업한 출석리스트를 초기화하기 위한 로직
//      * .studentList를 삭제하고
//      * .createUi에 다시 defaultStudentList를 추가함
//      */
//     let studentList = createUI.find(".studentList");
//     studentList.remove();
//     createUI.prepend(defaultStudentList);
    
// }