var express = require('express');
var router = express.Router();
var mongoDB_professor = require('../../extend_modules/dao/professor_web/mongoDB');
var rekognition = require('../../extend_modules/api/aws_rekognition/compareImg');
var atob = require('atob');
var request = require('request');

/* GET home page. */
router.get('/test1', function(req, res, next) {
  const img1 = req.
  res.render('test/page/test1', { 
    pageName: 'test1'
  });
});

router.post('/process/test1', function(req, res, next) {
  try{
    let img1 = getBinary(req.body.img1);  
    let img2 = getBinary(req.body.img2);
    console.log("테스트@@@@@@@@@@@@@");
    // console.log(img1.substr(0,10));

    rekognition.compareFacesByte(img1, img2);
    res.send(
      {
        result : {STATE : "SUCCESS" , DETAIL : "TEST"},
      }
    );    
  }
  catch(err){
    console.log(err);
  };  
});

router.get('/test2', function(req, res, next) {
  mongoDB_professor.getSequence("attend_id")
  .then((results)=>{
    console.log("테스트----------------");
    console.log(JSON.stringify(results));
    res.send({result:results});    
  })
  .catch((err)=>{console.log(err)});
});
router.get('/test3',function(req,res){

    // var jsonDataObj = {camera:'C'};
    // request.post({
    //   headers:{'content-type':'application/json'},
    //   url : 'http://192.168.43.171:8080/video',
    //   body : jsonDataObj,
    //   json:true
    // }, function(error, response, body){
    //   res.json(body);
    // });

    
    var ip ="http://192.168.43.171",
        port = ":8080"

    var url1 = "/video",
        url2 = "/video_stop",
        url3 = "/pic"
    let options = {
        uri: ip+port+url1,
        method: 'POST',
        body:{
            Camera:"C" //C A C-학생쪽 A-칠판쪽
        },
        json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
    };

    request.post(options, function(err,res_,body){ 
        if(err)
            console.log(err);
        else{
          console.log(res_);
          console.log(body)
        }
        res.send(body);
    })
});

router.get('/test4',function(req,res){
  var ip ="http://192.168.43.171",
  port = ":8080"

  var url1 = "/video",
    url2 = "/video_stop",
    url3 = "/pic"
  let options = {
    uri: ip+port+url3,
    method: 'POST',
    body:{
        // Camera:"C" //C A C-학생쪽 A-칠판쪽
    },
    json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
  };

  request.post(options, function(err,res_,body){ 
    if(err)
        console.log(err);
    else{
      // console.log(res_);
      // console.log(body)
      // res.send(getBinary(body));
      res.send(body);
    }
    
  })  
});

router.get('/test5',function(req,res){

  var ip ="http://192.168.43.171",
  port = ":8080"

  var url1 = "/video",
    url2 = "/video_stop",
    url3 = "/pic"
  let options = {
    uri: ip+port+url2,
    method: 'POST',
    body:{
        // Camera:"C" //C A C-학생쪽 A-칠판쪽
    },
    json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
  };

  request.post(options, function(err,res_,body){ 
    if(err)
        console.log(err);
    else{
      // console.log(res_);
      // console.log(body)
      // res.send(getBinary(body));
      res.send(body);
    }
    
  })  
});



function getBinary(base64Image) {
  var binaryImg = atob(base64Image); //64바이너리로 디코딩하는 함수
  var length = binaryImg.length;
  var ab = new ArrayBuffer(length);
  var ua = new Uint8Array(ab);
  for (var i = 0; i < length; i++) {
    ua[i] = binaryImg.charCodeAt(i);
  }

  return ab;
}

module.exports = router;
