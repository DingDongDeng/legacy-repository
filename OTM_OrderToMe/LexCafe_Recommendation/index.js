const AWS = require("aws-sdk");
const _ = require('lodash');
process.env.TZ = 'Asia/Seoul';//람다를 한국시간으로 작동....

function responseCard(cardTitle, cardSubTitle,carImageUrl,cardAttachmentLinkUrl,cardButtons){

    return {

            version : 1,
            contentType : 'application/vnd.amazonaws.card.generic',
            genericAttachments : [
                {
                    title : cardTitle,
                    subTitle : cardSubTitle,
                    imageUrl : carImageUrl,
                    attachmentLinkUrl : cardAttachmentLinkUrl,
                    buttons : cardButtons
                }

            ]


    };

}

function confirmIntent_Customer(sessionAttributes, intentName, slots, message){
  return{
    sessionAttributes,
    dialogAction : {
      type : 'ConfirmIntent',
      intentName,
      slots,
      message,

      responseCard:responseCard('오투미에게 고객님에 대해 알려주세요!', '다양한 기능을 제공해드리기 위해 오투미와 간단한 대화를 통해 고객님의 간단한 정보들을 입력해주세요!',
                              null,//img url 자리
                              null,[{ text : '지금 입력하기',value : 'yes'},{text : '나중에 입력하기',value :'no'}])
    }
  };

}

function close(sessionAttributes, fulfillmentState, message) {

    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message
            // responseCard: {
            //
            //         version : 1,
            //         contentType : 'application/vnd.amazonaws.card.generic',
            //         genericAttachments : genericAttachments
            //
            //
            // }
        }

    };
}
function close_Recommendation(sessionAttributes,emenu,kmenu,url,fulfillmentState, message) {

    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
            responseCard: responseCard(`${kmenu}`,  `추천받은 메뉴가 마음에 드신다면 주문하기를 눌러주세요!`,
                                    url,//
                                    null,[{ text :'주문하기',value : `i want to have ${emenu}`}])
        }

    };
    // emenu = recommendmenu[0].male[0].teens.ename;
    // kmenu = recommendmenu[0].male[0].teens.kname;
}

function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots
        },
    };
}

function dynamodb_Recommendation(sessionAttributes,callback){


    AWS.config.update({
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var params_get = {
        TableName: "Twosome_Code",
        Key:{
            "placeId": sessionAttributes.placeId
        }
    };


    docClient.get(params_get, function(err, data) {

        if(_.isEmpty(data)){
          console.log("err발생 LexCafe_Recommendation");
          //아 여기에 callback으로 하나 더 놔줘야겠네.....추천메뉴가 없을때..(주문받은적이 없는 매장)
          callback(null,close(sessionAttributes, 'Fulfilled',
          {contentType: 'PlainText', content: `죄송합니다!
          추천드리기에 충분한 정보가 모이지 않았습니다.
          다음에 다시 이용해주세요!` }));
        }
        else{
          var recommendmenu =data.Item.recommendmenu;
          var age = parseInt((new Date().getFullYear())) - parseInt(sessionAttributes.age.substring(0,4));
          //var age = sessionAttributes.age;
          var customer = { //쓸려고 만들었는데 딱히쓸곳은 없네...
            name : sessionAttributes.name,
            gender : sessionAttributes.gender,
            age : age
          }
          var emenu;
          var kmenu;
          var url;

          if(customer.gender == 'male'){
            if(customer.age<20){//10대
              emenu = recommendmenu[0].male[0].teens.ename;
              kmenu = recommendmenu[0].male[0].teens.kname;
              url = recommendmenu[0].male[0].teens.url;
            }
            else if(customer.age<30){//20대
              emenu = recommendmenu[0].male[0].twenties.ename;
              kmenu = recommendmenu[0].male[0].twenties.kname;
              url = recommendmenu[0].male[0].twenties.url;
            }
            else if(customer.age<40){//30대
              emenu = recommendmenu[0].male[0].thirties.ename;
              kmenu = recommendmenu[0].male[0].thirties.kname;
              url = recommendmenu[0].male[0].thirties.url;
            }
            else{//나머지
              emenu = recommendmenu[0].male[0].forties.ename;
              kmenu = recommendmenu[0].male[0].forties.kname;
              url = recommendmenu[0].male[0].forties.url;
            }
          }
          else if(customer.gender == 'female'){
            if(customer.age<20){//10대
              emenu = recommendmenu[0].female[0].teens.ename;
              kmenu = recommendmenu[0].female[0].teens.kname;
              url = recommendmenu[0].female[0].teens.url;
            }
            else if(customer.age<30){//20대
              emenu = recommendmenu[0].female[0].twenties.ename;
              kmenu = recommendmenu[0].female[0].twenties.kname;
              url = recommendmenu[0].female[0].twenties.url;
            }
            else if(customer.age<40){//30대
              emenu = recommendmenu[0].female[0].thirties.ename;
              kmenu = recommendmenu[0].female[0].thirties.kname;
              url = recommendmenu[0].female[0].thirties.url;
            }
            else{//나머지
              emenu = recommendmenu[0].female[0].forties.ename;
              kmenu = recommendmenu[0].female[0].forties.kname;
              url = recommendmenu[0].female[0].forties.url;
            }
          }


          callback(null,close_Recommendation(sessionAttributes,emenu,kmenu, url,'Fulfilled',
          {contentType: 'PlainText', content: `10대
          남 : ${recommendmenu[0].male[0].teens.kname}
          여 : ${recommendmenu[0].female[0].teens.kname}

          20대
          남 : ${recommendmenu[0].male[0].twenties.kname}
          여 : ${recommendmenu[0].female[0].twenties.kname}

          30대
          남 : ${recommendmenu[0].male[0].thirties.kname}
          여 : ${recommendmenu[0].female[0].thirties.kname}

          40대
          남 : ${recommendmenu[0].male[0].forties.kname}
          여 : ${recommendmenu[0].female[0].forties.kname}

          ${customer.name}님에게는 ${kmenu} 를 추천합니다.` }));
          return;
          //있는거
          // callback(null,close(sessionAttributes, 'Fulfilled',
          // {contentType: 'PlainText', content: `${customer.name}님에게는 ${kmenu} 를 추천합니다.` }));
          // return;
          // 리스폰스카드 없는거

        }

        callback(null,close(sessionAttributes, 'Fulfilled',
        {contentType: 'PlainText', content: `Flag @@@@@@` }));
        return;
    });
}

function checkFirstCustomer(sessionAttributes, uuid, slots, callback){
  AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
  });

  var docClient = new AWS.DynamoDB.DocumentClient();

  var table = "Customer_Info";

  var Mac_address = uuid;

  var params = {
      TableName: table,
      Key:{
          "Mac_address": Mac_address
      }
  };

  docClient.get(params, function(err, data) {
      if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
          if(_.isEmpty(data)){

            callback(null,confirmIntent_Customer(sessionAttributes, "Customer", {name : null, age : null, gender : null}, {contentType: 'PlainText', content: '고객님은 어떤 분이신가요?' }));
            return;
          }
          else{
            sessionAttributes.validate = true;
            /* 여기다가 고객의 이름, 성별 , 나이를 세션에다가 추가해주면됨*/
            sessionAttributes.name = data.Item.customerInfo.name;
            sessionAttributes.age = data.Item.customerInfo.age;
            sessionAttributes.gender = data.Item.customerInfo.gender;


            dynamodb_Recommendation(sessionAttributes,callback);
            return;
            // callback(null,delegate(sessionAttributes, slots));//session 에다가 validate true로 만들어서 다시 리턴해줘
            // return;

          }
      }
  });
}


exports.handler = (event, context, callback) => {
    // TODO implement
    var outputSessionAttributes = event.sessionAttributes||{};
    var slots = event.currentIntent.slots;

    if(typeof outputSessionAttributes.validate =='undefined'||outputSessionAttributes.validate==null||outputSessionAttributes.validate==false ){ //해당uuid 고객이 Lex통해서 고객정보 제공해줬는지
      //null이 아니라 undefined 겟지 ㅉㅉ
      //typeof outputSessionAttributes.validate =='undefined'||
      checkFirstCustomer(outputSessionAttributes,outputSessionAttributes.uuid,slots, callback); //최종대답에서 delegate가 안되가지고 함수구조수정했음
      return;
    }



};
