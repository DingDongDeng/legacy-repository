const AWS = require("aws-sdk");
const _ = require('lodash');
process.env.TZ = 'Asia/Seoul';//람다를 한국시간으로 작동....

function close(sessionAttributes, fulfillmentState, message) {

    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}
function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {

    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,

            //responseCard: whatResponseCard(slotToElicit)
        }
    };
}


function dynamodbPay_Twosomecode(sessionAttributes,paymentNum, callback){//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@일단 함수는 만들었는데....밑에다가 넣고 해보자......

  AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
  });



  var docClient = new AWS.DynamoDB.DocumentClient();

  //get으로 매장한번 읽고
  //get값에 근거해서 put하자....
  //넣는 알고리즘은 이전에쓰던대로...
  //--------------------------------------------------get 했는데 아무것도 없을때랑 있을때를 구분하여 코딩해주자

  var params_get = {
        TableName: "Twosome_Code",
        Key:{
            "placeId": sessionAttributes.placeId //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
        }
  };

  docClient.get(params_get, function(err, data){


      var orderInfo;
      var params_Twosome_Code;
      if(_.isEmpty(data)){

        orderInfo = [
          {
            "orderNum" : 1,
            "age" : sessionAttributes.age,
            "gender" : sessionAttributes.gender,
            "name" : sessionAttributes.name,
            "Mac_address" : sessionAttributes.uuid,
            "order" : JSON.parse(sessionAttributes.order),// 아오 이거 ㅁㅈ대ㅑ러맺ㄷ러ㅑㅁ잳ㄹ 헷갈려 뒤지겟네
            "paymentNum" : paymentNum,
            "state" : '1',
            "totPrice" : sessionAttributes.totprice

          }
        ];
        params_Twosome_Code = {
            TableName:"Twosome_Code",
            Item:{
                "placeId": sessionAttributes.placeId,
                "brandName" : sessionAttributes.brandName,
                "positionName" : sessionAttributes.positionName,
                "requiredTime" : "10",
                "orderInfo" : orderInfo,
                "recommendmenu": [
                    {
                      "female": [
                        {
                          "teens": {
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          },
                          "thirties": {
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          },
                          "twenties": {
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          },
                          "forties":{
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          }

                        }
                      ],
                      "male": [
                        {
                          "teens": {
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          },
                          "thirties": {
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          },
                          "twenties": {
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          },
                          "forties":{
                            "ename" : "icedcafeamericano",
                            "kname" : "아이스카페아메리카노",
                            "url" : "https://s3.amazonaws.com/twosome-db-url/181_big_img.jpg"
                          }
                        }
                      ]
                    }
                  ]


            }
        };
      }
      else{
        var db_orderInfo = data.Item.orderInfo;
        var recommendmenu = data.Item.recommendmenu;

        var content = {
            "orderNum" : db_orderInfo.length+1,
            "age" : sessionAttributes.age,
            "gender" : sessionAttributes.gender,
            "name" : sessionAttributes.name,
            "Mac_address" : sessionAttributes.uuid,
            "order" : JSON.parse(sessionAttributes.order),// 아오 이거 ㅁㅈ대ㅑ러맺ㄷ러ㅑㅁ잳ㄹ 헷갈려 뒤지겟네
            "paymentNum" : paymentNum,
            "state" : '1',
            "totPrice" : sessionAttributes.totprice
        };

        db_orderInfo.unshift(content);

        params_Twosome_Code = {
            TableName:"Twosome_Code",
            Item:{
                "placeId": sessionAttributes.placeId,
                "brandName" : sessionAttributes.brandName,
                "positionName" : sessionAttributes.positionName,
                "requiredTime" : "10",
                "orderInfo" : db_orderInfo, //db에서 get한 값에다가 unshift 해서 더해서 넣자
                "recommendmenu" : recommendmenu


            }
        };

      }


      docClient.put(params_Twosome_Code, function(err, data) {
          if (err) {
              console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
          } else {
              console.log("Added item:", JSON.stringify(data, null, 2));
          }
      });
  });




}
function dynamodbPay(sessionAttributes, callback){
      AWS.config.update({
        region: "us-east-1",
        endpoint: "https://dynamodb.us-east-1.amazonaws.com"
      });



      var docClient = new AWS.DynamoDB.DocumentClient();
      var table = "OrderList";
      //----------------------------------------------------------------
      var params_get = {
            TableName: table,
            Key:{
                "MAC": sessionAttributes.uuid //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
            }
      };

      console.log("Adding a new item...");
      //get 을 먼저하고 put 해야겠지?
      docClient.get(params_get, function(err, data){

          if(_.isEmpty(data)){
              var params_put = {
                  TableName:table,
                  Item:{
                      "MAC": sessionAttributes.uuid, //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
                      "orderInfo" : [
                          {
                            "paymentNum" : sessionAttributes.uuid+"0", //나중에 MAC을 받아서 유연하게 대체할수있도록해야돼
                            "order" : JSON.parse(sessionAttributes.order),
                            "state" : "1",
                            "totPrice" : sessionAttributes.totprice,

                            "placeId" : sessionAttributes.placeId,
                            "brandName" : sessionAttributes.brandName,
                            "positionName" : sessionAttributes.positionName
                          }

                      ]
                  }
              };
              var paymentNum = sessionAttributes.uuid+"0";
              docClient.put(params_put, function(err, data) {
                  if (err) {
                      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                  } else {
                      console.log("Added item:", JSON.stringify(data, null, 2));
                      dynamodbPay_Twosomecode(sessionAttributes,paymentNum, callback);
                      callback(null,close({}, 'Fulfilled',
                      {contentType: 'PlainText', content: `결제를 시작합니다. 잠시만 기다려주세요` }));
                  }
              });

          }
          else{
            var orderInfo = data.Item.orderInfo;
            var content = {
                "paymentNum" : sessionAttributes.uuid+orderInfo.length, //MAC주소 나중에 해줘야돼~~~
                "order" : JSON.parse(sessionAttributes.order),
                "state" : "1",
                "totPrice" : sessionAttributes.totprice,
                "placeId" : sessionAttributes.placeId,
                "brandName" : sessionAttributes.brandName,
                "positionName" : sessionAttributes.positionName
            };
            orderInfo.unshift(content);

            var params_put = {
                TableName:table,
                Item:{
                    "MAC": sessionAttributes.uuid, //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
                    "orderInfo" : orderInfo
                }
            };
            var paymentNum = sessionAttributes.uuid+orderInfo.length;
            docClient.put(params_put, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    dynamodbPay_Twosomecode(sessionAttributes,paymentNum, callback);
                    callback(null,close({}, 'Fulfilled',
                    {contentType: 'PlainText', content: `결제를 시작합니다. 잠시만 기다려주세요` }));
                }
            });
          }


          ////
      });


}
function parseLocalDate(date) {
    /**
     * Construct a date object in the local timezone by parsing the input date string, assuming a YYYY-MM-DD format.
     * Note that the Date(dateString) constructor is explicitly avoided as it may implicitly assume a UTC timezone.
     */
    const dateComponents = date.split(/\-/);
    return new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
}
function validateDate(date, time){
  //Date O, Time X
  //과거날짜이면 안돼
  //Date O, Time O
  //과거날짜이면 안돼
  //Time이 현재시간보다 뒤라면 오늘 날짜이면 안돼
    try {
        if((isNaN(parseLocalDate(date).getTime())) ){
            return false;
        }


        var today = new Date(); //오늘 날짜 생성
        today.setHours('0'); //자질구레한 값들 0으로 초기화
        today.setMinutes('0');
        today.setSeconds('0');
        today.setMilliseconds('0');

        if(time){
          if(parseLocalDate(date) < today ){

              return false;
          }
          if(parseLocalDate(date) == today){

            var now = new Date(); //현재시간 구할라고
            var now_hour = parseInt(now.getHours(),10);
            var now_min = parseInt(now.getMinutes(),10);

            const hour = parseInt(time.substring(0, 2), 10);//사용자가 입력한 시간
            const minute = parseInt(time.substring(3), 10);
            if(now_hour>hour){
                return false;
            }
            else if((now_hour == hour) &&( now_min>minute)){

                return false;

            }


          }
        }
        else{
          if(parseLocalDate(date) < today ){

              return false;
          }

        }


    } catch (err) {
      console.log("err 발생!!!");
        return false;
    }
    return true;

} //수정필요 @@@@ 우리나라 시간에 맞게
function validateTime(date, time){ //이부분이 잘 안되네 왜그러지
      //Date 값이 존재할 때
      //
      //Date 값이 없을 때
      //callback 이용해서 안에 어떻게돌아가는지좀 확인하자....어후.....
      if (time.length !== 5) { //13:30 이런식의 글자수가 아니면 false

          return false;
      }
      // if (isNaN(hour) || isNaN(minute)) {  이거 넣으면 오류가나더라@@@@
      //       // Not a valid time; use a prompt defined on the build-time model.
      //     return false;
      // }


      var today = new Date(); //오늘 날짜 생성
      today.setHours('0'); //자질구레한 값들 0으로 초기화
      today.setMinutes('0');
      today.setSeconds('0');
      today.setMilliseconds('0');
      if(date){

        if(parseLocalDate(date).getTime()==today.getTime()){
          var now = new Date(); //현재시간 구할라고
          var now_hour = now.getHours();//정수로 나오더라
          var now_min = now.getMinutes();//정수로나오더라

          const hour = parseInt(time.substring(0, 2), 10);//뒤에 10은 십진수
          const minute = parseInt(time.substring(3), 10);
          //callback(close({}, 'Fulfilled', {contentType: 'PlainText', content: `${now}, ${now_hour}, ${now_min} // ${hour}, ${minute} ` })); 확인용
          if(now_hour>hour){
            return false;
          }
          if(now_hour==hour){

            if(now_min>minute){
              return false;
            }
          }

        }
      }
      /*
      if (hour < 10 || hour > 16) { //영업시간 밖이면 이거쓰면됨
          // Outside of business hours
          return buildValidationResult(false, 'PickupTime', 'Our business hours are from ten a m. to five p m. Can you specify a time during this range?');
      }
      */
      return true;
}

function buildValidationResult(isValid, violatedSlot, messageContent) {
    if (messageContent == null) {
        return {
            isValid,
            violatedSlot
        };
    }
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent }
    };
}

function validateOrder(outputSessionAttributes,date,time) {//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

   if(date){
       if(!validateDate(date,time)){
          return buildValidationResult(false, 'date',`날짜를 다시 확인해주세요.`);
       }
   }

   if(time){
       if(!validateTime(date,time)){
         return buildValidationResult(false, 'time',`시간을 다시 확인해주세요.`);
       }

   }
    return buildValidationResult(true, null, null);
}


exports.handler = (event, context, callback) => {
    // TODO implement

    var date = event.currentIntent.slots.date;
    var time = event.currentIntent.slots.time;
    var slots = event.currentIntent.slots;

    var sessionAttributes = event.sessionAttributes;//sessionAttributes.order 안에 주문에 관한 내용 다들어있음 그리고 MAC주소같은것도 들어가있음
    var confirm = event.currentIntent.confirmationStatus;





    if(confirm ==='Denied'){
        var order = JSON.parse(sessionAttributes.order);
        var date = new Date();//현재 날짜, 시간 생성

        var hour = parseInt(date.getHours(),10);
        var min = parseInt(date.getMinutes(),10);
        var slots_time = hour+":"+min;

        var year = date.getFullYear();
        var month = date.getMonth()+1;
        if(date.getMonth()+1<10){
          month = "0"+(date.getMonth()+1);
        }
        var day = date.getDate();
        if(date.getDate()<10){
          day = "0"+(date.getDate());
        }
        var slots_date = year+"-"+month+"-"+day;


        for(var i=0; i<order.length; i++){
            order[i].date = slots_date;
            order[i].time = slots_time;
        }
        sessionAttributes.order = JSON.stringify(order);
        dynamodbPay(sessionAttributes,callback);
        return;
        //-----------------------------------------------------------------
    }
    if(confirm ==='Confirmed'){
        sessionAttributes.menu = null; //뭐가자꾸 잘 안되서 넣어봤음
        callback(null,elicitSlot(sessionAttributes,'Order', {menu : null , amount:null, type:null, size: null, shot:null, syrup:null, date:null,time:null}, 'menu',{contentType: 'PlainText', content: `어떤 메뉴를 원하시나요?` }));
        //function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
        return;
    }

    if(confirm==='None'){
      // callback(null,close(sessionAttributes, 'Fulfilled',
      // {contentType: 'PlainText', content: `${confirm}으로 표시` }));
      var validate = validateOrder(sessionAttributes,date,time);
      if(!validate.isValid){
        callback(null,elicitSlot(sessionAttributes, "Pay", slots, validate.violatedSlot,validate.message));//
        return;
      }
      if(!date){ //date에 값이 없다면

        callback(null,elicitSlot(sessionAttributes, "Pay", slots, "date",
        {contentType: 'PlainText', content: `몇월 며칠에 이용하시나요?` }));//
        return;
      }
      if(!time){//time에 값이 없다면

        callback(null,elicitSlot(sessionAttributes, "Pay", slots, "time",
        {contentType: 'PlainText', content: `몇시에 이용하시나요?` }));//
        return;
      }





      var order = JSON.parse(sessionAttributes.order);
      for(var i=0; i<order.length; i++){
          order[i].date = date;
          order[i].time = time;
      }
      sessionAttributes.order = JSON.stringify(order);
      dynamodbPay(sessionAttributes,callback);
      return;

    }

};
