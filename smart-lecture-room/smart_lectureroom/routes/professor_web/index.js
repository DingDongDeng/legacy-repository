var express = require('express');
var router = express.Router();
/* Service module
*  process에 관한 리턴값은 {STATE:" " , DETAIL : " "} 
*  형식을 유지함 */
var service = require('../../extend_modules/service/professor_web/service');

const webName = "professor_web";
const viewPath = "professor_web/page";
const templatePath = "professor_web/template";



router.get('/', function(req, res, next) {
  res.redirect("/professor/login");
});


router.get('/login', function(req, res, next) {
  res.render(viewPath+'/login', { 
    webName : webName, 
    pageName: 'login' 
  });
});


router.post('/process/loginProcess',function(req,res,next){
  const userInfo = req.body;//로그인 id,pw를 가지고있음

  console.log("---------------------------");
  console.log("/loginProcess 작동");
  console.log("id : " + userInfo.id);
  console.log("pw : " + userInfo.pw);
  console.log("---------------------------");
  
  service.loginProcess(userInfo,(result)=>{
    if(result.STATE==="SUCCESS"){
      req.session.user = {
        id : result.data.id,
        name : result.data.name
      }
      console.log("세션생성 : " + req.session.user.id);
    }
    res.send(result); //로그인 프로세스의 결과를 전달
  });
  
});

router.get('/logout', function(req,res,next){
  req.session.destroy(function(){
    req.session;
  });
  res.redirect("/professor/login");
})

router.get('/timeTable', function(req, res, next) {
  console.log("---------------------------");
  console.log("/timeTable 작동");
  console.log("---------------------------");
  
  service.buildTimeTable(req.session.user , (result)=>{
    res.render(templatePath+'/template', { 
      webName : webName, 
      pageName: 'timeTable',
      user : req.session.user,
      timeTable : result.data //lecture_name,professor_id,lecture_info, student_list 의 정보를 전달 
    });
  });

  
});

router.get('/attend/:lectureName/:lectureID/:frontCameraIP/:backCameraIP/:buildingName/:lectureRoomNum', function(req, res, next) {
  const userInfo = req.session.user;//로그인 id,pw를 가지고있음
  const lectureInfo = {
    lectureName : req.params.lectureName,
    lectureID : req.params.lectureID,
    frontCameraIP : req.params.frontCameraIP,
    backCameraIP : req.params.backCameraIP,
    buildingName : req.params.buildingName,
    lectureRoomNum : req.params.lectureRoomNum
  }
  console.log("---------------------------");
  console.log("/attend 작동");
  console.log(req.params.lectureName);
  console.log(req.params.lectureID);
  console.log(req.params.frontCameraIP);
  console.log(req.params.backCameraIP);
  console.log("---------------------------");
  
  service.getAttendInfo(userInfo,lectureInfo, (result)=>{
    res.render(templatePath+'/template', { 
      webName : webName, 
      pageName: 'attend',
      user : req.session.user,
      lectureName : lectureInfo.lectureName,
      studentList : result.studentList,
      attendList : result.attendList
      // attendInfo : result.data //lecture_name,professor_id,lecture_info, student_list 의 정보를 전달 
    });    
  });


});

router.post('/process/saveAttendProcess', function(req, res, next) {
  const attendInfo = req.body;
  console.log("---------------------------");
  console.log("/saveAttendProcess 작동");
  console.log(JSON.stringify(attendInfo));
  console.log("---------------------------");
  
  service.saveAttendProcess(attendInfo,(result)=>{
    res.send(result); //로그인 프로세스의 결과를 전달
  });


});

router.post('/process/showAttendProcess',function(req, res, next){
  const attendInfo = req.body;
  console.log("---------------------------");
  console.log("/showAttendProcess 작동");
  console.log(JSON.stringify(attendInfo));
  console.log("---------------------------");
  service.showAttendProcess(attendInfo,(result)=>{
    res.send(result); //로그인 프로세스의 결과를 전달
  });
})


router.post('/process/deleteAttendProcess',function(req, res, next){
  const attendInfo = req.body;
  console.log("---------------------------");
  console.log("/deleteAttendProcess 작동");
  console.log(JSON.stringify(attendInfo));
  console.log("---------------------------");
  service.deleteAttendProcess(attendInfo,(result)=>{
    res.send({STATE : "SUCCESS", DETAIL:"SUCCESS_DELETE_ATTEND"}); //로그인 프로세스의 결과를 전달
  });
})



//스트리밍서버에 사진촬영을 요구할 라우터
router.post('/process/photoShootProcess',function(req, res, next){
  const lectureInfo = req.body;
  service.photoShootProcess(lectureInfo, (result)=>{
    res.send({
      STATE:result.STATE,
      DETAIL:result.DETAIL,
      lecture_img : result.lecture_img,
      picture_name : result.picture_name
    });
  });
})


/**
 * 참고자료 : Request.js , 및 사진 전송
 * https://medium.com/harrythegreat/node-js%EC%97%90%EC%84%9C-request-js-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-28744c52f68d
 */

router.post('/process/autoAttendenceProcess',function(req, res, next){
  const attendInfo = req.body;
  //attendInfo 안에 이제 Image Binary도 포함되서 올거임

  service.autoAttendenceProcess(attendInfo, (result)=>{ 
    res.send({
      STATE:result.STATE,
      DETAIL:result.DETAIL,
      data : result.data
    });
  });  
});

//학생들에게 자동출석의 결과를 통보할 라우터
/**
 * 고려해야할 푸시 타입 3가지
 0. 자동출석하는 경우 ----> 재요청, 요청 버튼이 필요
1. late , attendStartTime 이 없는 푸시 ---> 버튼제공해주지마(교수가 반자동으로 하는경우)
2. 출석재요청을 위한 푸시요청 ----> attendStartTime과 비교하여 임의의 시간(ex 3분) 안에 요청해야 허락
3. 출석요청을 위한 푸시요청 ----> 지각자를 구별하기 위해서니까 late값(지각허용시간)보다 작은경우 지각으로
 */
router.post('/process/pushRequestProcess', function(req, res, next){
  const attendInfo = req.body;
  service.pushRequestProcess(attendInfo,(result)=>{
    res.send({
      STATE:"SUCCESS",
      DETAIL:"SUCCESS_PUSH_REQUEST",
    })
  });
});

router.get('/lecture/:lectureName/:lectureID/:frontCameraIP/:backCameraIP/:buildingName/:lectureRoomNum', function(req, res, next) {
  const userInfo = req.session.user;//로그인 id,pw를 가지고있음
  const lectureInfo = {
    lectureName : req.params.lectureName,
    lectureID : req.params.lectureID,
    frontCameraIP : req.params.frontCameraIP, //현 경로에서는 사용하지는 않음
    backCameraIP : req.params.backCameraIP,//현 경로에서는 사용하지는 않음
    buildingName : req.params.buildingName,
    lectureRoomNum : req.params.lectureRoomNum
  }
  service.getLectureVideoInfo(userInfo, lectureInfo, (result)=>{
    res.render(templatePath+'/template', { 
      webName : webName, 
      pageName: 'lecture',
      user : req.session.user,
      lectureName : lectureInfo.lectureName,
      lectureID : lectureInfo.lectureID,
      lectureList : result.lectureList,
      // attendInfo : result.data //lecture_name,professor_id,lecture_info, student_list 의 정보를 전달 
    });    
  })
});

//강의관리페이지에서 제목을 클릭했을때
router.post('/process/showLectureVideoProcess', function(req, res, next){
  const lectureInfo = req.body;
  service.showLectureVideoProcess(lectureInfo,(result)=>{
    res.send({
      STATE:"SUCCESS",
      DETAIL:"SUCCESS_SHOW_LECTURE_VIDEO",
      DATA : result
    })
  });
});

//강의관리페이지에서 리스트 항목을 삭제할때
router.post('/process/deleteLectureVideoProcess', function(req, res){
  const lectureInfo = req.body;
  service.deleteLectureVideoProcess(lectureInfo,(result)=>{
    res.send({
      STATE:"SUCCESS",
      DETAIL:"SUCCESS_DELETE_LECTURE_VIDEO"
    })
  });
})

//영상저장을 위해 video seq을 요청할때
router.post('/process/getVideoSeqProcess',function(req, res){
  service.getVideoSeqProcess((seq)=>{
    res.send({
      STATE:"SUCCESS",
      DETAIL :"SUCCESS_GET_VIDEO_SEQ",
      seq: seq
    });
  })
})

//강의영상 저장
router.post('/process/saveLectureVideoProcess',function(req, res){
  const videoInfo = req.body;
  service.saveLectureVideoProcess(videoInfo, ()=>{
    res.send({
      STATE:"SUCCESS",
      DETAIL : "SUCCESS_SAVE_VIDEO",
      data : videoInfo
    })
  })
})

module.exports = router;
