/**
 * 클라이언트들에게 강의실 개수만큼 소켓연결
 * 각 소켓들이 웹서버에 {ip, 내용 } 형태로 요청을 보내오면
 * 라즈베리파이들에 연결된 소켓객체를 사전에 만들어둔 배열에서 찾아가지고
 * {ip,내용}을 전달함
 * 
 * 
 */

var express = require('express');
var router = express.Router();
/* Service module
*  process에 관한 리턴값은 {STATE:" " , DETAIL : " "} 
*  형식을 유지함 */
var service = require('../../extend_modules/service/security_web/service');

const webName = "security_web";
const viewPath = "security_web/page";
const templatePath = "security_web/template";



router.get('/', function(req, res, next) {
  res.redirect("/security/login");
});


router.get('/login', function(req, res, next) {
  res.render(viewPath+'/login', { 
    webName : webName, 
    pageName: 'login' 
  });
});
router.get('/logout', function(req,res,next){
  req.session.destroy(function(){
    req.session;
  });
  res.redirect("/security/login");
})

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

router.get('/main', function(req, res, next) {
  console.log("---------------------------");
  console.log("/main 작동");
  console.log("---------------------------");
  
  service.getMainInfo(req.session.user , (result)=>{
    res.render(templatePath+'/template', { 
      webName : webName, 
      pageName: 'main',
      user : req.session.user,
      roomInfo : result.data
    });
  });

  
});


module.exports = router;


