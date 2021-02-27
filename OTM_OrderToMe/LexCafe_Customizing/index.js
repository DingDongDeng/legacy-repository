var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const AWS = require("aws-sdk");
const _ = require('lodash');//예제따라할려고추가했음
process.env.TZ = 'Asia/Seoul';//람다를 한국시간으로 작동....
var key_menuFirstCheck = false;//렉스가 1바퀴돌때 지금 menu슬롯값이 맞는 메뉴인지 매번 확인하면 비효율적이니깐(DB엑세스필요하니깐) 이걸통해서 방지
var key_aliasFirstCheck = false;

function dynamodbRead(outputSessionAttributes,menu,slots,callback){
    var session = outputSessionAttributes;
    AWS.config.update({
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    var table = "Twosome_Menu";

    var params = {
        TableName: table,
        ProjectionExpression: "#ename,#code,kname, price, #url", //
        FilterExpression: "contains(#ename, :ename) ",
        ExpressionAttributeNames: {
            "#ename": "ename",
            "#url" : "url",
            "#code" :"code"
        },
        ExpressionAttributeValues: {

             ":ename": menu
        }
    };
    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {

            console.log("Scan succeeded.");
            // data.Items.forEach(function(content) {
            //    console.log(
            //         content.ename + ": "+ content.price);
            // });

            var search=null;
            if(_.isEmpty(data.Items)){ //여기다가 나중에 추천메뉴를  elicitSlot_menu에서 보이도록수정하면됨
                console.log("@@@@ 0개 검색됨@@@");
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                slots.menu = null; //아래행에서 세션 편집할수 있어야함 이전의 유효함 것들은 남긴채로 넣어야겠지?(order : []).....
                session.menu = null;//세션값 두마리가
                session.url = null;// 오류났을때 가장 시각적으로 나타나는얘들이라 혹시몰라서 null처리해둠
                callback(null,elicitSlot_menu(session,"Customizing",slots,"menu",{ contentType: "PlainText", content: "어떤 것을 원하시는 건지 모르겠어요! 다시 말씀해주세요!" },search));
                return;
            }

            if(data.Items.length == 1){
              console.log("@@@@ 1개 검색됨@@@");
              console.log("GetItem succeeded:", JSON.stringify(data, null, 2));


              session.menu = data.Items[0].ename;
              session.price = data.Items[0].price;
              session.kmenu = data.Items[0].kname;
              session.url = data.Items[0].url;
              session.code = data.Items[0].code; //메뉴가 커피류인가 아닌가 구분
              slots.menu = data.Items[0].ename;

              session.recursionMenu = null;

              callback(null,delegate(session, slots ));
              return;
            }
            if(data.Items.length >=2){

              if(session.recursionMenu != null){ //carrotcake 와 carrotcakepiece가 가져다준 회귀문제 해결하는 코드
                var recursionMenu = JSON.parse(session.recursionMenu);
                for(var i=0; i<recursionMenu.length; i++){
                  if(slots.menu == recursionMenu[i].menu){
                    session.menu = slots.menu;
                    session.price = recursionMenu[i].price;
                    session.kmenu = recursionMenu[i].kmenu;
                    session.url = recursionMenu[i].url;
                    session.code = recursionMenu[i].code;

                    slots.menu = recursionMenu[i].menu; //이거는 어차피 그전 과정에서 검증된값이니깐 딱히 필요없겠지만 확실하게하자
                    session.recursionMenu = null;

                    callback(null,delegate(session, slots ));
                    return;
                  }
                }
              }
              console.log("@@@@ 2개이상 검색됨@@@");
              console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
              slots.menu = null; //아래행에서 세션 편집할수 있어야함 이전의 유효함 것들은 남긴채로 넣어야겠지?(order : []).....
              session.menu = null;

              search=[];
              for(var i=0; i<data.Items.length; i++){
                search.push(data.Items[i]);
                console.log(search[i]);
              }


              callback(null,elicitSlot_menu(session,"Customizing",slots,"menu",{ contentType: "PlainText", content: "이 메뉴들 중에 어떤 것을 원하시는 건가요?" },search));
              return;

            }



            if (typeof data.LastEvaluatedKey != "undefined") { //이거 어떤역할하는 거지?
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                docClient.scan(params, onScan);
            }
        }
     }
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
function customizing_transKE(sessionAttributes,slots, callback){ //한글입력을 영어로 번역후 back_input에 전달
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://35.241.90.93:443/trans?alias='+encodeURIComponent(slots.alias),true);
  xhr.responseType = 'text';
  xhr.onreadystatechange = function(){ //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
    console.log("readystate :" + xhr.readyState);
    // 0: request not initialized
    // 1: server connection established
    // 2: request received
    // 3: processing request
    // 4: request finished and response is ready
     if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          var e_alias = xhr.responseText.toLowerCase();
          console.log("별명 번역 결과:" + e_alias);
          close_customizing(sessionAttributes,e_alias,slots,callback);
          // close_customizing(sessionAttributes,e_alias,slots, callback);
        }
     }
  };
  xhr.send(null);


  // xhr.send(fd);
}

function close_customizing(sessionAttributes,e_alias, slots, callback) {
    AWS.config.update({
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "Customer_Mymenu";
    /*
      이후 다른 브랜드의 내용을 사용하기 위해서는
      Twosome 에서 다른 브랜드 이름으로 변경하면 됨
    */
    var params_get = {
          TableName: table,
          Key:{
              "UUID": sessionAttributes.uuid
          }
    };
    docClient.get(params_get, function(err, data){

        if(_.isEmpty(data)){//모든 브랜드 아울러 제일처음으로 마이메뉴 정할때
            var params_put = {
                TableName:table,
                Item:{
                    "UUID": sessionAttributes.uuid, //uuid는 고객을 구분하는 값
                    "Twosome" : [
                        {
                          "kalias" : slots.alias, //한글 별명
                          "alias" : e_alias, //영어 별명
                          "menu" : sessionAttributes.menu,
                          "price" : sessionAttributes.price,
                          "kmenu" : sessionAttributes.kmenu,
                          "url" : sessionAttributes.url,
                          "code" : sessionAttributes.code,
                          "slots" : slots
                        }

                    ]
                }
            };
            docClient.put(params_put, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    callback(null,close(sessionAttributes, 'Fulfilled',
                    {contentType: 'PlainText', content: `<div>제품명 : ${sessionAttributes.kmenu}</div> <div>가격: ${sessionAttributes.price}</div><div> 별명:${slots.alias}으로 등록되었습니다.</div>`}));
                }
            });

        }
        else{
          var obj = data;
          if(obj.Item.Twosome.length >= 10){ //메뉴등록을 최대 10개로 제한
            callback(null,close(sessionAttributes, 'Fulfilled',
            {contentType: 'PlainText', content: `Mymenu 등록은 10개가 최대입니다!`}));
            return;
          }

          if(typeof(obj.Item.Twosome)=="undefined"){//Twosome 관련 등록된 마이메뉴가 없음
            var params_put = {
                TableName:table,
                Item:{
                    "UUID": sessionAttributes.uuid, //uuid는 고객을 구분하는 값
                    "Twosome" : [
                        {
                          "kalias" : slots.alias,
                          "alias" : e_alias,
                          "menu" : sessionAttributes.menu,
                          "price" : sessionAttributes.price,
                          "kmenu" : sessionAttributes.kmenu,
                          "url" : sessionAttributes.url,
                          "code" : sessionAttributes.code,
                          "slots" : slots
                        }

                    ]
                }
            };
            docClient.put(params_put, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    callback(null,close(sessionAttributes, 'Fulfilled',
                    {contentType: 'PlainText', content: `<div>제품명 : ${sessionAttributes.kmenu}</div> <div>가격: ${sessionAttributes.price}</div><div> 별명:${slots.alias}으로 등록되었습니다.</div>`}));
                }
            });


          }
          else{
            var Twosome = data.Item.Twosome;
            var content = {
                "kalias" : slots.alias,
                "alias" : e_alias,
                "menu" : sessionAttributes.menu,
                "price" : sessionAttributes.price,
                "kmenu" : sessionAttributes.kmenu,
                "url" : sessionAttributes.url,
                "code" : sessionAttributes.code,
                "slots" : slots
            };
            Twosome.unshift(content);

            var params_put = {
                TableName:table,
                Item:{
                    "UUID": sessionAttributes.uuid, //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
                    "Twosome" : Twosome
                }
            };

            docClient.put(params_put, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    callback(null,close(sessionAttributes, 'Fulfilled',
                    {contentType: 'PlainText', content: `<div>제품명 : ${sessionAttributes.kmenu}</div> <div>가격: ${sessionAttributes.price}</div><div> 별명:${slots.alias}으로 등록되었습니다.</div>`}));
                }
            });
          }
        }
    });
}
function whatResponseCard(slotToElicit){

    var cardTitle;
    var cardSubTitle;
    var carImageUrl;
    var cardAttachmentLinkUrl;
    var cardButtons;

    if(slotToElicit==='amount'){  //이거 어차피 AMAZON.NUMBER에서 값 거르더라
        //DB에서 amount 관한거 뽑은다음에 responseCard만들때 사용
        //근데 숫자 나부랭이인데 구지 DB까지 안써도 될듯 ㅇㅇ
        cardTitle = `cardTitle`;
        cardSubTitle = `cardSubTitle`;
        carImageUrl = null;
        cardAttachmentLinkUrl =null;
        cardButtons =[
            {
                text : '1',
                value : 1
            },
            {
                text : '2',
                value : 2
            },
            {
                text : '3',
                value : 3
            },
            {
                text : '4',
                value : 4
            },
            {
                text : '5',
                value : 5
            }

        ];
    }
    else if(slotToElicit==='type'){

        cardTitle = `cardTitle`;
        cardSubTitle = `cardSubTitle`;
        carImageUrl = null;
        cardAttachmentLinkUrl =null;
        cardButtons =[
            {
                text : '포장',
                value : 'take away'
            },
            {
                text : '매장이용',
                value :'eat in'
            }

        ];
    }
    else if(slotToElicit==='size'){
        cardTitle = `cardTitle`;
        cardSubTitle = `cardSubTitle`;
        carImageUrl = null;
        cardAttachmentLinkUrl =null;
        cardButtons =[
            {
                text : '스몰',
                value : 'small'
            },
            {
                text : '라지',
                value :'large'
            }

        ];
    }
    else if(slotToElicit==='shot'){//어차피 AMAZON.NUMBER에서 값 거르겠지
        cardTitle = `cardTitle`;
        cardSubTitle = `cardSubTitle`;
        carImageUrl = null;
        cardAttachmentLinkUrl =null;
        cardButtons =[
            {
                text : '1',
                value : 1
            },
            {
                text : '2',
                value : 2
            },
            {
                text : '3',
                value : 3
            }

        ];
    }

    return responseCard(cardTitle, cardSubTitle,carImageUrl,cardAttachmentLinkUrl,cardButtons);
}
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
function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {

    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,

            responseCard: whatResponseCard(slotToElicit)
        }
    };
}
function elicitSlot_menu(sessionAttributes, intentName, slots, slotToElicit, message, search){

    if(search == null){
      return {
          sessionAttributes,
          dialogAction: {
              type: 'ElicitSlot',
              intentName,
              slots,
              slotToElicit,
              message,

          }
      };
    }
    var genericAttachments=[];
    var temp1;
    var temp2=[];
    sessionAttributes.recursionMenu = [];
    for(var i=0; i<search.length ; i++){
      if(i<10){
        temp = {
            title : search[i].kname,
            subTitle : search[i].price+"원",
            imageUrl : search[i].url,
            attachmentLinkUrl : null,
            buttons : [
                {
                    text :"선택",
                    value : search[i].ename
                }
            ]


        };
        genericAttachments.push(temp);
      }
      temp2.push({
        menu : search[i].ename,
        kmenu : search[i].kname,
        price : search[i].price,
        url : search[i].url,
        code : search[i].code
      });

    }
    sessionAttributes.recursionMenu = JSON.stringify(temp2);



    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,

            responseCard: {
                    version : 1,
                    contentType : 'application/vnd.amazonaws.card.generic',
                    genericAttachments : genericAttachments
            }
        }
    };

}
function elicitSlot_coffee(sessionAttributes, intentName, slots, slotToElicit, message) {

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
} //일단 잠가놨음
function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots
        },
    };
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
function validateMenu(outputSessionAttributes,menu,slots,callback){

    dynamodbRead(outputSessionAttributes,menu,slots,callback);
}
function validateSize(size){

    var count=0;
    var list = ['small',
                'large'
    ]
    for(var i=0; i<list.length ; i++ ){
        if(list[i]==size){
            count++;
        }
    }

    if(count>0) return true;
    else return false;

}
function validateShot(shot){
    if(shot<10) return true;
    else return false;
}
function validateSyrup(syrup){
    if(syrup<10) return true;
    else return false;
}
function validateAlias(outputSessionAttributes,alias,slots,callback){//사용자가 입력한 별명을 검증하는 함수 ex)이전에 입력한 별명으로 다시 마이메뉴를 생성하려 할때


    AWS.config.update({
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "Customer_Mymenu";
    var params_get = {
          TableName: table,
          Key:{
              "UUID": outputSessionAttributes.uuid
          }
    };
    docClient.get(params_get, function(err, data){
      if(_.isEmpty(data)){//애초에 처음 mymenu 등록하는 사람이면 신경쓸필요없지 delegate해
        outputSessionAttributes.alias = alias;
        callback(null,delegate(outputSessionAttributes, slots ));
        return;
      }
      else{ //예전에 뭔가 한적이 있는 사람이네? Twosome 브랜드 애트리뷰트가 있는지 확인하고 적절히 처리하자
        if(typeof(data.Item.Twosome)=="undefined"){ //Twosome 브랜드에 처음 mymenu등록하는사람이면 신경쓸게 없지 ㄱㄱ
          outputSessionAttributes.alias = alias;
          callback(null,delegate(outputSessionAttributes, slots ));
          return;
        }
        else{//예전에 Twosome에 mymenu등록한적이있네 중복되는 이름인지 확인하자
          for(var i=0; i<data.Item.Twosome.length; i++){
            if(data.Item.Twosome[i].alias == alias){
              slots.alias = null;//중복되는 값이니깐 null처리
              callback(null,elicitSlot(outputSessionAttributes, "Customizing", slots, "alias", {contentType: 'PlainText', content: "이미 존재하는 별명입니다! 다시입력해주세요!" }));
              return;
            }
          }
          outputSessionAttributes.alias = alias;
          callback(null,delegate(outputSessionAttributes, slots ));
          return;

        }
      }


    });
}
function validateOrder(outputSessionAttributes,slots, menu,alias, size, shot,syrup,callback) {//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

   //유효성을 검사하는 코드들
   //함수 하나 더만들어서 menu의 유효성을 검사하고 true false 반환하는거를 만들어야할듯 당연히 DB의 값들에 근거해야겠지
   //if문 조건안에 넣고쓰면 편할거같에
   if(menu){
       if(!(menu==outputSessionAttributes.menu)){
          key_menuFirstCheck = true;
          validateMenu(outputSessionAttributes,menu,slots,callback);
        }


   }
   if(alias){
      if(!(alias==outputSessionAttributes.alias)){
          key_aliasFirstCheck = true;
          validateAlias(outputSessionAttributes,alias,slots,callback);
          // return buildValidationResult(true, null, null);//어차피 if(key_aliasFirstCheck) 에서 적절하게 프로세스 중단시킬꺼임
      }
   }
   if(size){
       if(!validateSize(size)){
           return buildValidationResult(false, 'size',`잘 못알아들었습니다. 다시 말씀해주세요! `);
       }
   }
   if(shot){
       if(!validateShot(shot)){
           return buildValidationResult(false, 'shot',`샷 ${shot}은 준비하기 어렵습니다! 다시 말씀해주세요.`);
       }
   }
   if(syrup){
     if(!validateSyrup(syrup)){
       return buildValidationResult(false,'syrup',`시럽 ${syrup}은 준비하기 어렵습니다! 다시 말씀해주세요.`);
     }
   }
    return buildValidationResult(true, null, null);
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

            callback(null, confirmIntent_Customer(sessionAttributes, "Customer", {name : null, age : null, gender : null}, {contentType: 'PlainText', content: '고객님은 어떤 분이신가요?' }));
            return;
          }
          else{
            sessionAttributes.validate = true;
            /* 여기다가 고객의 이름, 성별 , 나이를 세션에다가 추가해주면됨*/
            callback(null, delegate(sessionAttributes, slots));//session 에다가 validate true로 만들어서 다시 리턴해줘
            return;

          }
      }
  });
}


exports.handler = (event, context, callback) => {
    // TODO implement

    var menu = event.currentIntent.slots.menu;
    var alias = event.currentIntent.slots.alias;
    // var e_alias = 영어로 바꾼 값을 넣어
    var shot = event.currentIntent.slots.shot;
    var size = event.currentIntent.slots.size;
    var syrup = event.currentIntent.slots.syrup;

    var source = event.invocationSource;
    var outputSessionAttributes = event.sessionAttributes||{};
    var slots = event.currentIntent.slots;

    if(outputSessionAttributes.validate==null||outputSessionAttributes.validate==false ){ //해당uuid 고객이 Lex통해서 고객정보 제공해줬는지

      checkFirstCustomer(outputSessionAttributes,outputSessionAttributes.uuid,slots, callback);
      return;
    }

    if(source ==='DialogCodeHook'){
      const validationResult = validateOrder(outputSessionAttributes,slots, menu,alias, size,shot,syrup, callback);//유효성을 검사하고 그 결과를 validationResult에 담음 반환 양식은 buildValidationResult() 함수를 따름
      if (!validationResult.isValid) {
          slots[`${validationResult.violatedSlot}`] = null;//방금 값이 들어온 슬롯의 유효성 탈락한거를 null로 다시 되돌림
          callback(null,elicitSlot(outputSessionAttributes, event.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));//값을 다시 입력해달라고 하기위해서 elicit쓴거고 responsecard 이용해서도 가능할듯함 굿굿서
          return;
      }

      if(key_menuFirstCheck){//menu이름이 렉스가 처음 검증해야하는 메뉴면 return시켜서 종료, dynamodbRead()에서 callback 시킬꺼거든
        key_menuFirstCheck = false;
        return;
      }
      if(key_aliasFirstCheck){//alias 이름이 처음 검증해야하는 메뉴면 return시켜서 종료
        key_aliasFirstCheck = false;
        return;
      }

      // if(outputSessionAttributes.code=="1"){//일단 여기에 배치하긴했는데 뭔가 더 좋은 위치가 있을거같에...
      //     if(!size){//
      //               //처음 질문은 responseCard 이용해서 추가안함 버튼을 제공하자
      //         //callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'size', validationResult.message));
      //         callback(null,elicitSlot_coffee(event.sessionAttributes, event.currentIntent.name, slots, 'size', { contentType: 'PlainText', content: "컵사이즈를 말씀해주세요!" }));
      //         return;
      //     }
      //     if(!shot){
      //         callback(null,elicitSlot_coffee(event.sessionAttributes, event.currentIntent.name, slots, 'shot', { contentType: 'PlainText', content: "샷은 몇번 추가할까요?" }));
      //         return;
      //     }
      //     if(!syrup){
      //         callback(null,elicitSlot_coffee(event.sessionAttributes, event.currentIntent.name, slots, 'syrup', { contentType: 'PlainText', content: "시럽은 몇번 추가할까요?" }));
      //         return;
      //     }
      // }


      callback(null,delegate(outputSessionAttributes, event.currentIntent.slots));
      return;
    }
    if(outputSessionAttributes.code=="1"){//일단 여기에 배치하긴했는데 뭔가 더 좋은 위치가 있을거같에...
        if(!size){//
                  //처음 질문은 responseCard 이용해서 추가안함 버튼을 제공하자
            //callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'size', validationResult.message));
            callback(null,elicitSlot_coffee(outputSessionAttributes, "Customizing", slots, 'size', { contentType: 'PlainText', content: "컵사이즈를 말씀해주세요!" }));
            return;
        }
        if(!shot){
            callback(null,elicitSlot_coffee(outputSessionAttributes, "Customizing", slots, 'shot', { contentType: 'PlainText', content: "샷은 몇번 추가할까요?" }));
            return;
        }
        if(!syrup){
            callback(null,elicitSlot_coffee(outputSessionAttributes, "Customizing", slots, 'syrup', { contentType: 'PlainText', content: "시럽은 몇번 추가할까요?" }));
            return;
        }
    }

    if(size!=null) outputSessionAttributes.price = parseInt(outputSessionAttributes.price)+500;
    if(shot!=null) outputSessionAttributes.price = parseInt(outputSessionAttributes.price)+parseInt(shot)*500;
    if(syrup!=null) outputSessionAttributes.price = parseInt(outputSessionAttributes.price)+parseInt(syrup)*500;
    //callback(null,close_customizing(outputSessionAttributes,slots, 'Fulfilled', {contentType: 'PlainText', content: `<div>제품명 : ${menu}</div> <div>가격: ${outputSessionAttributes.price}</div><div> 별명:${alias}으로 등록되었습니다.</div>` }));
    //<div> 같은거 넣어봤는데 안되네....왜지...될법한데....



    customizing_transKE(outputSessionAttributes,slots, callback);
    return;

};
