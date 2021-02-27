
// const url_ = window.location.href;
// const urlSplit_ = url_.split("/");


const create = $(".attendPage .create");
const createBtn = create.find(".createBtn"); // + 버튼, 출석리스트를 생성
const createUI = create.find(".createUI"); //해당 강좌의 학생 리스트 및 출석관리 UI
const controllBtn = createUI.find(".controllBtn"); //출석 관리 관련 버튼
const autoAttendence = create.find("input[name=autoAttendence]");//자동 출석 버튼
const saveBtn_StudentList = controllBtn.find("input[name=saveBtn_StudentList] "); //출석 저장 버튼
const attendList = $(".attendPage .attendList"); //출결 리스트
const attend = attendList.find(".attend"); //출결 항목들
const attendTitle = attend.find(".title"); //출결 항목의 제목들
const attendDelete = attend.find(".delete"); //출결 항목의 삭제버튼
const autoSaveCheckBox = controllBtn.find("input[name=autoSaveFlag]");

// let lectureID = urlSplit[urlSplit.length-3]; //url의 lectureID값
// let lectureName = decodeURI(urlSplit[urlSplit.length-4]);//한글이기 때문에 디코딩
let lectureID;
let lectureName;
let front_camera_ip;
let back_camera_ip;
let buildingName;
let lectureRoomNum;

let picture_name = "-1";

$(function(){
    lectureName = decodeURI(urlSplit[urlSplit.length-6]);
    lectureID = urlSplit[urlSplit.length-5];
    front_camera_ip = urlSplit[urlSplit.length-4];
    back_camera_ip = urlSplit[urlSplit.length-3];
    buildingName = decodeURI(urlSplit[urlSplit.length-2]);
    lectureRoomNum = urlSplit[urlSplit.length-1];
    
    allAttendTitleAddEvent(attendTitle);
    allAttendDeleteAddEvent(attendDelete);
    createBtnAddEvent(createBtn);
    saveBtnAddEvent(saveBtn_StudentList); 
    autoAttendenceAddEvent(autoAttendence);
    autoSaveCheckBoxAddEvent(autoSaveCheckBox);

    $("input[type=radio]").on("click",radioBtnEvent);
    setDefaultColor();
});
function radioBtnEvent(){
    const radio = $(this);
    const color = radio.parents(".student").find(".color");
    let value = radio.val();

    if(value=="A001")
        color.css("background-color",getColor(1));
    if(value=="A002")
        color.css("background-color",getColor(2));
    if(value=="A003")
        color.css("background-color",getColor(3));
}

function setDefaultColor(){
    const normalAttendence = createUI.find(".studentList .normalAttendence");
    normalAttendence.find(".student .color").css("background-color", getColor(0));
}

function autoSaveCheckBoxAddEvent(autoSaveCheckBox){
    autoSaveCheckBox.on("click", autoSaveCheckBoxEvent);
}
function autoSaveCheckBoxEvent(){
    const lateInput = controllBtn.find("span");
    if(lateInput.hasClass("display-none")){
        lateInput.removeClass("display-none");
    }
    else{
        lateInput.addClass("display-none");
    }
}

function autoAttendenceAddEvent(autoAttendence){
    autoAttendence.on("click",autoAttendenceEvent);
}
function autoAttendenceEvent(){
    // const lectureID = urlSplit[urlSplit.length-3];
    const issueAttendence = createUI.find(".studentList .issueAttendence");
    const normalAttendence = createUI.find(".studentList .normalAttendence");
    let studentList = [];
    if(issueAttendence.children().length>0){
        console.log("자식이 존재함");
        const students = issueAttendence.find(".student");

        students.each(function(index, item){
            const student = $(item);
            const id = student.find(".id").text().trim();
            studentList.push(id);
        });
    }
    else{
        console.log("자식이 없음");
        const normalAttendence = createUI.find(".studentList .normalAttendence");
        const students = normalAttendence.find(".student");

        students.each(function(index, item){
            const student = $(item);
            const id = student.find(".id").text().trim();
            studentList.push(id);
        });
    }
    
    
    console.log("자동출석을 실행할 학생리스트 : ");
    for(let i=0; i< studentList.length; i++){
        console.log(studentList[i]);
    }

    
    
    const obj={ //스트리밍서버에서 카메라촬영,사진저장을 위해 요구하는 값을 넣어줘야함
        front_camera_ip : front_camera_ip,
        back_camera_ip : back_camera_ip,
        // lecture_name : lectureName,
        // lecture_id : lectureID,
        // attend_id : 
    }
    ajax("post","/photoShootProcess",obj)
    .then((data)=>{

        const _data = {
            lecture_id : lectureID,
            studentList : studentList,
            lecture_img : data.lecture_img,
            // picture_name : data.picture_name 
        }
        console.log("테스트");
        console.log(_data.lecture_img);
        console.log(_data.picture_name);

        picture_name = data.picture_name;
        ajax("post","/autoAttendenceProcess",_data) 
        .then((data)=>{//자동의 출석의 결과에 따라 출석리스트의 UI를 적절히 변경
            return new Promise((resolve, rejects)=>{
                const studentList = data.data;
                const students = create.find(".studentList .student");
                students.each(function(index, item){
                    const student = $(item);
                    for(let i=0; i< studentList.length; i++){
                        const student_id = student.find(".id").text().trim();
                        
                        if(studentList[i].student_id === student_id){
                            const attend_state = studentList[i].attend_state;
        
                            if(attend_state === "A001"){
                                const radioBtn = student.find(".attend input[ value=A001]");
                                const radioBtn2 = student.find(".attend input[ value=A002]"); //체크해제할 라디오버튼
                                const radioBtn3 = student.find(".attend input[ value=A003]"); // 체크해제할 라디오버튼
                                
                                radioBtn2.prop("checked",false);
                                radioBtn3.prop("checked",false);
                                radioBtn.prop("checked",true);
                                
                                // student 안에 있는 attend번호  의 값을 알아낸다음에 
                                let name = student.find(".attend input:first").attr("name");
                                let index = name.substring(6); //attend1 , attend3 에서 번호만 자름
                                index = parseInt(index);
                                index++;

                                student.find(".color").css("background-color", getColor(1)); //색을 설정
                                const issueStudent = student.detach();                       
                                normalAttendence.append(issueStudent);
                                
                            } 
                            if(attend_state === "A002") {
                                const radioBtn = student.find(".attend input[ value=A002]");
                                const radioBtn2 = student.find(".attend input[ value=A003]");
                                const radioBtn3 = student.find(".attend input[ value=A001]");
                                
                                
                                radioBtn2.prop("checked",false);
                                radioBtn3.prop("checked",false);
                                radioBtn.prop("checked",true);
        
                            }
                            if(attend_state === "A003") {
        
                                const radioBtn = student.find(".attend input[ value=A003]");
                                const radioBtn2 = student.find(".attend input[ value=A001]"); //체크해제할 라디오버튼
                                const radioBtn3 = student.find(".attend input[ value=A002]"); // 체크해제할 라디오버튼
                                
                                radioBtn2.prop("checked",false);
                                radioBtn3.prop("checked",false);
                                radioBtn.prop("checked",true);

                                student.find(".color").css("background-color", getColor(3)); //색을 설정
                                const issueStudent = student.detach();                        
                                issueAttendence.append(issueStudent);
                            }
                        }
        
        
                    }
                });

                /* 자동출석이후 자동저장 */
                const autoSaveFlag = autoSaveCheckBox.is(":checked");
                if(autoSaveFlag){
                    saveBtn_StudentList.trigger("click");//attendHTML을 통해 생성한 dom을 트리거
                }
                resolve();
            })
            
        })
        .then(()=>{ //자동출석 이후 푸시알림을 보내기위한 코드
            // const lectureID = urlSplit[urlSplit.length-3];
            // const lectureName = decodeURI(urlSplit_[urlSplit_.length-4]);//한글이기 때문에 디코딩
            const lectureSession = controllBtn.find("select option:selected").val();;
    
            const issueAttendence = createUI.find(".studentList .issueAttendence");
            const issueStudents = issueAttendence.find(".student");
    
            let issueList =[];
            issueStudents.each(function(index,item){
                const student = $(item);
                const student_id = student.find(".id").text().trim();
                const student_name = student.find(".name").text().trim();
                const attend_state = student.find(".attend input[type=radio]:checked").val();
                const student_token = student.find(".token").text().trim();
    
                const temp ={
                    student_id : student_id,
                    student_name : student_name,
                    attend_state : attend_state,
                    student_token : student_token
                }
                issueList.push(temp);
            });
    
            const normalAttendence = createUI.find(".studentList .normalAttendence");
            const normalStudents = normalAttendence.find(".student");
    
            let normalList =[];
            normalStudents.each(function(index,item){
                const student = $(item);
                const student_id = student.find(".id").text().trim();
                const student_name = student.find(".name").text().trim();
                const attend_state = student.find(".attend input[type=radio]:checked").val();
                const student_token = student.find(".token").text().trim();
    
                const temp ={
                    student_id : student_id,
                    student_name : student_name,
                    attend_state : attend_state,
                    student_token : student_token
                }
                normalList.push(temp);
            });
    
            let topAttend = attendList.find(".attend:first .attendID").text().trim(); //가장 상위에 있는 리스트의 attend_id --> 방금 저장된 리스트의 attend_id 를 뜻함
            if(topAttend==""){
                console.log("오류....attend_id가 출결리스트가 아무것도 없을때를 고려하지 못함");
            }
            else{
                topAttend = String(parseInt(topAttend)+1);
            }
            let attendInfo = { //자동출석결과 (어던 학생이 결석이고 어떤 학생이 출석인지 등)
                lectureInfo : {
                    attend_id : topAttend,
                    lecture_id : lectureID,
                    lecture_name : lectureName,
                    lecture_session : lectureSession
                },

                issueList :issueList,
                normalList :normalList
            };

            /** 자동저장이 체크되어있다면 몇분부터 지각으로 처리하는지에 대한 정보를 객체에 담아야함 */
            
            const autoSaveFlag = autoSaveCheckBox.is(":checked");
            if(autoSaveFlag){
                const late = controllBtn.find("input[name=late]");
                attendInfo.lectureInfo.late = late.val().trim();
                attendInfo.lectureInfo.front_camera_ip = front_camera_ip;
                attendInfo.lectureInfo.back_camera_ip = back_camera_ip;
                // autoSaveCheckBox.prop("checked",false);
            }
    
            ajax("post","/pushRequestProcess",attendInfo);

            /**
             * 출석결과 푸시 통보를 위해 
             * ajax 이용해서 푸시서버로 전송하자
             * 안드로이드랑 협의 필요
             */
    
        });
    })

}



function allAttendDeleteAddEvent(attendDelete){
    attendDelete.each(function(index,item){
        const attendDelete = $(item);
        attendDeleteAddEvent(attendDelete);
    });
}

function attendDeleteAddEvent(attendDelete){
    attendDelete.on("click", attendDeleteEvent);
}
function attendDeleteEvent(){
    //Delete Process를 여기서부터 만들면됨
    // lectureID = urlSplit[urlSplit.length-3];
    const attendInfo = {
        attend_id : $(this).parent().find(".attendID").text().trim(),
        lecture_id : lectureID
    };

    const delTarget = $(this).parent(); //삭제한 attend
    ajax("post", "/deleteAttendProcess",attendInfo)
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

    const infoAll = $(".attendPage .attendList .attend .info"); //모든 info class를 숨김
    infoAll.each(function(index, item){ 
        const info = $(item);
        const controllBtn = info.parent().find(".controllBtn");
        info.empty();
        controllBtn.empty();
        
    })
}

function saveBtnAddEvent(saveBtn){
    saveBtn.on("click", saveBtnEvent);
}

function saveBtnEvent(){
    const saveBtn = $(this);
    const btnName = saveBtn.attr("name");

    // let lectureID ;
    let studentList;
    let student ;
    let session;
    let attendID = undefined;

    if(btnName ==="saveBtn_StudentList"){
        // lectureID = urlSplit[urlSplit.length-1];
        studentList = $(".attendPage .create .createUI .studentList");
        // student = studentList.find(".normalAttendence .student");
        student = studentList.find(".student");
        session = controllBtn.find("select option:selected").val();
    }
    if(btnName ==="saveBtnAttendList"){
        // lectureID = urlSplit[urlSplit.length-1];
        studentList = $(".attendPage .attendList .attend .info");
        student = studentList.find(".student");
        const attend = saveBtn.parent().parent();
        attendID = attend.find(".attendID");
        session = attend.find(".session").text().trim();
    }

    let attendence = [];
    student.each(function(index, item){
        const student = $(item);
        const id = student.find(".id").text().trim();
        // const name = student.find(".name").text().trim();
        // const attend = student.find(".attend input[name=attend"+index+"]:checked").val();
        const attend = student.find(".attend input[type=radio]:checked").val();
        
        
        /**
         * 자동출석의 경우 아래 객체에 
         * picture_path가 들어가야함
         */
        const attendenceInfo ={
            student_id : id,
            lecture_session : session,
            attend_state : attend,
        }
        if(picture_name !=="-1"){
            attendenceInfo.picture_name = picture_name;
        }

        console.log(id+"의 출결상태 : " + attend);
        attendence.push(attendenceInfo);
    });

    const attendInfo = {
        lecture_id : lectureID,
        attend_info : [{
            attend_date : new Date().format("yyyy-MM-dd hh:mm:ss"), //하지만 서버에서 입력하는 것이 이상적
            attendence: attendence
            
        }],
    };
    if(attendID !== undefined){
        attendInfo.attend_info[0].attend_id = attendID.text().trim();

    }
    /* 
    const attendInfo ={
        lecture_id : 3,
        attend_info : [{
            attend_date : 2018-09-12 .....
            attendence :[
                {
                    student_id : 2014335066,
                    lecture_session : 1,
                    attend_state : a001
                }
            ]
            (attend_id : 3)
        }]
    }

    */
    ajax("post", "/saveAttendProcess",attendInfo)
    .then((data)=>{
        buildAttendListUI_SAVE(data)
                
    })
    .catch((err)=>{console.log(err);});
}
function resetRadioButton(){
    const radioButtons = createUI.find("input[type=radio]");
    radioButtons.each(function(index, item){
        const radio = $(item);
        radio.attr("checked", false);
    });
}

function allAttendTitleAddEvent(attendTitle){
    attendTitle.each(function(index, item){
        const attendTitle = $(item);
        attendTitleAddEvent(attendTitle);
    });
}
function attendTitleAddEvent(attendTitle){
    attendTitle.on("click",attendTitleEvent);
}
function attendTitleEvent(){
    setDefaultColor();//createUI의 색을 디폴트로

    const attendTitle = $(this);
    const attend = attendTitle.parent();
    const attendID = attend.find(".attendID").text().trim();//attendID 태그가 아닌 값
    const info = attend.find(".info");    
    const infoAll = $(".attendPage .attendList .attend .info"); //모든 info class
    const controllBtn = attend.find(".controllBtn");
    // const lectureID = urlSplit[urlSplit.length-3];


    createUI.addClass("display-none");//다른항목을 클릭하면 createUI를 숨김
    if(info.html()!==""){ //제목을 한번더 클릭했을때 내용을 숨김
        info.empty();
        controllBtn.empty();
        return;
    }
    //모든 출결항목들의 내용을 숨기고, 로직을 실행
    //이후 로직에서 하나의 항목만이 내용이 보여짐
    infoAll.each(function(index, item){ 
        const info = $(item);
        const controllBtn = info.parent().find(".controllBtn");
        info.empty();
        controllBtn.empty();
        
    })

    const data ={
        lecture_id :lectureID,
        attend_id : attendID,
    }
    ajax("post", "/showAttendProcess", data )
    .then((data)=>{
        const studentInfo = data.data;
        buildAttendListUI_SHOW(studentInfo , info);
    })
    .catch((err)=>{console.log(err);});


}

function buildAttendListUI_SHOW(studentInfo , target){ //출석리스트 제목을 클릭했을때 보일 내용을 생성함
    const info = target;
    const controllBtn = info.parent().find(".controllBtn");
    let studentListHTML="";
    studentListHTML += "<table border ='1'>"
    studentListHTML += "<tr>"
        studentListHTML += "<td></td>"
        studentListHTML += "<td style='width:150px;' ></td>"
        studentListHTML += "<td >학번 이름</td>"
        studentListHTML += "<td style='width:400px;'></td>"
        studentListHTML += "<td>출석 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 지각 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 결석</td>"
    studentListHTML += "</tr>"
    for(let i =0 ; i< studentInfo.length; i++){
        const student = studentInfo[i];        
        studentListHTML +=    "<tr class='student'>"
        let color;
        if(student.attend_state === "A001")
             color = getColor(1);
        if(student.attend_state === "A002")
            color = getColor(2);
        if(student.attend_state === "A003")
            color = getColor(3);
        studentListHTML +=      "<td > <div class='color' style='background-color :"+color+" '> </div> </td>"
        studentListHTML +=       "<td class='picture'> <img src='/resources/images/student/"+student.student_picture+"'> </td>"
        studentListHTML +=       "<td class='id'>"+student.student_id+" </td>"
        studentListHTML +=       "<td class='name'>"+student.student_name+" </td>"
        studentListHTML +=       "<td class='attend'>"

        /* 라디오 버튼 체크 상태 정의 */
        if(student.attend_state ==="A001"){
            studentListHTML +=          "<span class='checks'> <input type='radio' class='a001' id='attend"+(i+100)+"_a' name='attend"+i+"' value='A001' checked='checked'>"
            studentListHTML +=          "<label for='attend"+(i+100)+"_a'></label> </span>"
        }
        else{
            studentListHTML +=          "<span class='checks'> <input type='radio' class='a001' id='attend"+(i+100)+"_a' name='attend"+i+"' value='A001'>"
            studentListHTML +=          "<label for='attend"+(i+100)+"_a'></label> </span>"
        }
        
        if(student.attend_state ==="A002"){
            studentListHTML +=          "<span class='checks'> <input type='radio' class='a002' id='attend"+(i+100)+"_b' name='attend"+i+"' value='A002' checked='checked'>"
            studentListHTML +=          "<label for='attend"+(i+100)+"_b'></label> </span>"
        }
        else{
            studentListHTML +=          "<span class='checks'> <input type='radio' class='a002' id='attend"+(i+100)+"_b' name='attend"+i+"' value='A002'>"
            studentListHTML +=          "<label for='attend"+(i+100)+"_b'></label> </span>"
        }
        
        if(student.attend_state ==="A003"){
            studentListHTML +=          "<span class='checks'> <input type='radio' class='a003' id='attend"+(i+100)+"_c' name='attend"+i+"' value='A003' checked='checked'>"
            studentListHTML +=          "<label for='attend"+(i+100)+"_c'></label> </span>"
        }
        else{
            studentListHTML +=          "<span class='checks'> <input type='radio' class='a003' id='attend"+(i+100)+"_c' name='attend"+i+"' value='A003'>"
            studentListHTML +=          "<label for='attend"+(i+100)+"_c'></label> </span>"
        }
        studentListHTML +=       "</td>"
        studentListHTML +=    "</tr>"
                
    }
    studentListHTML += "</table>"
    studentListHTML += "<div class='session display-none'>"+ studentInfo[0].lecture_session +"</div>"
    info.html(studentListHTML);
    controllBtnHTML = "<input type='button' name='saveBtnAttendList' value='저장'></input>"
    controllBtn.html(controllBtnHTML);
    saveBtnAddEvent(controllBtn.find("input[name=saveBtnAttendList]"));
    attendList.find("input[type=radio]").on("click",radioBtnEvent);

    
    
}
function buildAttendListUI_SAVE(data){ //출석항목을 생성하기 위해 저장버튼을 눌렀을때 일어나는 로직
    const attendInfo = data.data;
    const attend_id = attendInfo.attend_id;
    const attend_date = attendInfo.attend_date.substring(0,10).split('-');
    const lecture_session = attendInfo.attendence[0].lecture_session;
    // const lectureName = decodeURI(urlSplit_[urlSplit_.length-4]);//한글 URI에서 강의명을 가져오기 위해 필요
    
    let attendHTML="";
    attendHTML += "<div class='attend'>"
    attendHTML   += "<div class='attendID display-none'>" + attend_id + "</div>"
    attendHTML   += "<div class='title'> "+"<img src='/public/professor_web/img/꺽쇠.png'> </img> &nbsp; "+attend_date[0]+"년 "+attend_date[1]+"월 "+attend_date[2]+"일 "+ lecture_session +"차시 &nbsp;&nbsp;&nbsp;&nbsp; "+ lectureName 
    attendHTML   += "</div>"
    attendHTML   += "<div class='delete'> x </div>"
    attendHTML   += "<div class='info'></div>"
    attendHTML   += "<div class='controllBtn'>"
    attendHTML += "</div>"
    attendList.prepend(attendHTML);//얘한테만 이벤트 걸어줄수있어야함
    const attendTitle = attendList.find(".attend .title:first");
    const attendDelete = attendList.find(".attend .delete:first")
    attendTitleAddEvent(attendTitle);
    attendDeleteAddEvent(attendDelete);
    attend.trigger("click");//attendHTML을 통해 생성한 dom을 트리거
    createUI.addClass("display-none"); //리스트 생성 UI 숨김

    /**
     * createUI에서 작업한 출석리스트를 초기화하기 위한 로직
     * .studentList를 삭제하고
     * .createUi에 다시 defaultStudentList를 추가함
     */
    let studentList = createUI.find(".studentList");
    studentList.remove();
    createUI.prepend(defaultStudentList);
    
}

function getColor(index){
    const color = ["#bec1c9","#4f81c7", "#64c4ed","#efa35c"];//디폴트, 출석,지각,결석
    return color[index];
}