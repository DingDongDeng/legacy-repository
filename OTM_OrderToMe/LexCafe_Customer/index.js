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
function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots
        },
    };
}
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
    //menu, amount, type
    var cardTitle;
    var cardSubTitle;
    var carImageUrl;
    var cardAttachmentLinkUrl;
    var cardButtons;


    if(slotToElicit==='name'){

        return {
            sessionAttributes,
            dialogAction: {
                type: 'ElicitSlot',
                intentName,
                slots,
                slotToElicit,
                message
            }
        };
    }
    else if(slotToElicit==='age'){
        return { //리스폰스카드쓰기 싫어서 이따구로해버림....
            sessionAttributes,
            dialogAction: {
                type: 'ElicitSlot',
                intentName,
                slots,
                slotToElicit,
                message
            }
        };
    }
    else if(slotToElicit==='gender'){

         cardTitle = `cardTitle`;
        cardSubTitle = `cardSubTitle`;
        carImageUrl = null;
        cardAttachmentLinkUrl =null;
        cardButtons =[
            {
                text : '남자',
                value : 'male'
            },
            {
                text : '여자',
                value :'female'
            }

        ];
    }

    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,

            responseCard:responseCard(cardTitle, cardSubTitle,carImageUrl,cardAttachmentLinkUrl,cardButtons)

        }
    };
}


function validateAge(age){
  /*
    생년월일이 미래면은 빠꾸먹여
    그리고 앞자리 8아래 수이면은 제끼자
  */
  var date = new Date();



  var year =parseInt(age.substring(0,4));
  var month = parseInt(age.substring(4,6)); // -1 해야됨
  var day = parseInt(age.substring(6));

  if(year>date.getFullYear() || year<1900){
    return false;
  }
  else{
    if(month>12 || month<1){
      return false;
    }
    else{
      if(day<1 || day>31){
        return false;
      }
    }
  }
  /*
  두자리씩 쪼개서
  년도는 90보다 커야하고,
  월은 01~12 사이여야하고
  일은 어떡하지 윤달같은것도 계산해야돼?
  */


  /*
  사용자 입력에 근거해서
  Date() 객체로 생성한 날짜랑

  사용자 입력이랑 비교해서 차이가나면 문제가 있는거고....
  같으면 OK

  */

  return true;
}
function validateInfo(sessionAttributes, slots, name,age,gender){
    var message;
    var validate;
    var slotToElicit;


    if(name){

      if(name =='오투미'){//만약에 오투미 이름이면
        validate = false;
        slotToElicit = 'name';
        message = '그건 제 이름입니다. 고객님의 이름을 알려주세요!';

        return {
          validate : validate,
          slotToElicit : slotToElicit,
          message : {contentType: 'PlainText', content: message }
        };
      }
    }
    if(age){
      if(age.length!=8){//생년월일이 아니라면
        validate = false;
        slotToElicit = 'age';
        message = '생년월일을 8자리로 입력해주세요!';

        return {
          validate : validate,
          slotToElicit : slotToElicit,
          message : {contentType: 'PlainText', content: message }
        };
      }
      if(!validateAge(age)){

         validate = false;
         slotToElicit = 'age';
         message = '생년월일 정확히 입력해주세요!';

         return {
           validate : validate,
           slotToElicit : slotToElicit,
           message : {contentType: 'PlainText', content: message }
         };

      }
    }
    if(gender){
      //gender가 man 이나 woman으로 들어오니깐


      if(gender!='male'&& gender!='female'&&
         gender!='man' && gender!='woman'){//남녀 성별이 아니라면
        validate = false;
        slotToElicit = 'gender';
        message = '남성/여성 인지 알려주세요!';

        return {
          validate : validate,
          slotToElicit : slotToElicit,
          message : {contentType: 'PlainText', content: message }
        };
      }
    }

    return {
      validate : true,
      slotToElicit : null,
      message : {contentType: 'PlainText', content: message }

    };

}

function inputInfo(sessionAttributes, slots, callback){
  var name = slots.name;
  var age = slots.age;
  var gender = slots.gender;
  if(gender == 'man') gender = 'male';
  if(gender =='woman') gender = 'female';
  AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
  });

  var docClient = new AWS.DynamoDB.DocumentClient();
  var table = "Customer_Info";

  //----------------------------------------------------------------
  var params_put = {
    TableName:table,
    Item:{
        "Mac_address": sessionAttributes.uuid, //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
        "customerInfo" : {
              "name" : name, //나중에 MAC을 받아서 유연하게 대체할수있도록해야돼
              "age" : age,
              "gender" : gender,
              "token" : sessionAttributes.token//푸시알람을 위한 토큰값

            }
    }
  };
  docClient.put(params_put, function(err, data) {
      if (err) {
          console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("Added item:", JSON.stringify(data, null, 2));

          callback(null,close(sessionAttributes, 'Fulfilled', {contentType: 'PlainText', content: '고객정보를 입력해주셔서 감사합니다!' }));
          return;

      }
  });
}

exports.handler = (event, context, callback) => {
    // TODO implement

    var sessionAttributes = event.sessionAttributes;//session에는 없는게 없지...
    //var mac = sessionAttributes.Mac; 으로 맥주소를 받아야겟지.....
    var name = event.currentIntent.slots.name;
    var age = event.currentIntent.slots.age;
    var gender = event.currentIntent.slots.gender;
    var slots = event.currentIntent.slots;
    var confirm = event.currentIntent.confirmationStatus;

    if(confirm ==="Denied"){
      callback(null,close(sessionAttributes, 'Fulfilled', {contentType: 'PlainText', content: '다음엔 고객님에 대해 꼭 알려주세요!' }));
      return;

    }


    const source = event.invocationSource;
    if (source === 'DialogCodeHook') {

      var validateResult = validateInfo(sessionAttributes, slots,name,age,gender);

      if(!validateResult.validate){//검증결과가 false라면

        callback(null,elicitSlot(sessionAttributes, event.currentIntent.name, slots, validateResult.slotToElicit, validateResult.message));//
        return;
      }

      callback(null,delegate(sessionAttributes, slots));
      return;
    }


    inputInfo(sessionAttributes,slots,callback);
    return;

};
