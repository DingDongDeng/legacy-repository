var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var professorRouter = require('./routes/professor_web/index'); // 교수 웹 라우터
var securityRouter = require('./routes/security_web/index'); // 경비 웹 라우터
var studentRouter = require('./routes/student_web/index'); // 학생 웹 라우터(실시간 강의 시청, 이전 강의 신청 등)
var streamRouter = require('./routes/stream_web/index');
var test = require('./routes/test/index');

var app = express();




//세션설정 ,https://velopert.com/406
app.use(session({
  secret: '@#@$MYSIGN#@$#$', //쿠키를 임의로 변조하는것을 방지하기 위한 값
  resave: false, //세션을 언제나 저장할 지 (변경되지 않아도) 정하는 값, doc에서는 이값을 false로 권장
  saveUninitialized: false //세션이 저장되기 전에 uninitialized 상태로 미리 만들어서 저장
 })); 
//서버의 request 크기 제한 설정
//https://gist.github.com/Maqsim/857a14a4909607be13d6810540d1b04f
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json()); //body-parser 역할을 함
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


/* 정적 파일(public)들에 대한 경로를 설정 */
/*참고 https://expressjs.com/ko/starter/static-files.html */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/resources',express.static(path.join(__dirname, 'resources')));
// app.use('/professor',express.static(path.join(__dirname, 'public')));
// app.use('/security',express.static(path.join(__dirname, 'public')));
// app.use('/student',express.static(path.join(__dirname, 'public')));

//권한 확인을 위한 인터셉터 구현 , 정적 파일(public)미들웨어 아래에 위치해야 불필요한 인터셉터 방지됨
app.use(function(req, res, next){
  console.log("---푸시이슈-----")
  console.log("url : " + req.url);
  interceptor(req , res); //인터셉터를 담당하는 함수
  next();
});



// 해당 경로에 대해 라우터 설정
app.use('/professor', professorRouter); 
app.use('/security', securityRouter);
app.use('/student', studentRouter);
app.use('/stream',streamRouter);
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;




function interceptor(req, res){ //인터셉터 함수
  const url = req.url.split('/');
  const path_1 = url[1]; //요청 경로의 첫번째
  const path_2 = url[2];  //요청 경로의 두번째 


  console.log("------------------");
  console.log("인터셉터");
  console.log("session : " + req.session.user);
  console.log("path_1"+url[1]);
  console.log("path_2"+url[2]);

  if(req.session.user===undefined 
      && path_2 !=='login'
      && path_2 !=='process'
      && path_1 !== 'test'){ //로그인을 하지 않은 채 페이지진입시 차단
    
    console.log("!!!");
    console.log("interceptor execute");
    res.redirect('/'+path_1+'/login');
  }

  if(req.session.user !== undefined //로그인 한채로 로그인 페이지 진입시 차단
      && path_2 ==='login'){ //각 웹서버별로 임의의 페이지로 돌려보냄

    if(path_1 ==='professor'){
      console.log("!!!");
      console.log("redirect timeTable page");
      res.redirect("/professor/timeTable");
    }

    if(path_1 ==='security'){
      console.log("!!!");
      console.log("redirect timeTable page");
      console.log("nothing");
    }

    if(path_1 ==='student'){
      console.log("!!!");
      console.log("redirect timeTable page");
      res.redirect("/student/timeTable");
    }

    if(path_1 === "stream"){
      console.log("!!!");
      console.log("redirect stream lol");
    }
  }
}









