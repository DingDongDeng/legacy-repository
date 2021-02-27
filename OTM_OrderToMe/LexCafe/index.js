const AWS = require("aws-sdk");
const Promisify = require('es6-promisify');//예제따라할려고추가했음
const _ = require('lodash');//예제따라할려고추가했음
process.env.TZ = 'Asia/Seoul';//람다를 한국시간으로 작동....
var key_menuFirstCheck = false;//렉스가 1바퀴돌때 지금 menu슬롯값이 맞는 메뉴인지 매번 확인하면 비효율적이니깐(DB엑세스필요하니깐) 이걸통해서 방지
//---------------------------------------

//-------------------------------------------------------------------------
function sessionBuild(outputSessionAttributes, slots){
  var content;
  var session;
  if(outputSessionAttributes.order != null){ //첫번째 주문
      content = JSON.parse(outputSessionAttributes.order); //이전에 주문한 정보
      session={order:content};
      session.menu = outputSessionAttributes.menu;//주문한 메뉴
      session.code = outputSessionAttributes.code;//메뉴가 커피류인지 구분
      session.kmenu = outputSessionAttributes.kmenu; //주문메뉴의 한글이름
      session.price = outputSessionAttributes.price; //주문메뉴의 가격
      session.url = outputSessionAttributes.url; //주문메뉴의 이미지 url
      session.totprice = outputSessionAttributes.totprice; //현재까지 주문한 합
      session.uuid = outputSessionAttributes.uuid;//고객 식별을 위한 uuid
      session.placeId = outputSessionAttributes.placeId;//현재 이용중이 지점의 아이디값
      session.brandName = outputSessionAttributes.brandName;//이용중인 브랜드 이름
      session.positionName = outputSessionAttributes.positionName; //이용중인 지점의 한글이름
      session.validate = outputSessionAttributes.validate;//고객정보를 제공한 고객인지 확인하는 값
      session.order_cnt = outputSessionAttributes.order_cnt;//주문횟수 (최대 4회로 제한됨)

      session.name = outputSessionAttributes.name; //고객의 이름
      session.gender = outputSessionAttributes.gender; //고객의 성별
      session.age = outputSessionAttributes.age; //고객의 나이

      session.token = outputSessionAttributes.token;//특정고객에게 푸시알람을 보내기 위한 토큰값
  }
  else{ //연속된 주문(ex:앞에서 이미 커피같은걸 시킨상태)
      session={order:[]};
      session.menu = outputSessionAttributes.menu;//주문한 메뉴
      session.code = outputSessionAttributes.code;//메뉴가 커피류인지 구분
      session.kmenu = outputSessionAttributes.kmenu; //주문메뉴의 한글이름
      session.price = outputSessionAttributes.price; //주문메뉴의 가격
      session.url = outputSessionAttributes.url; //주문메뉴의 이미지 url
      session.totprice = outputSessionAttributes.totprice; //현재까지 주문한 합
      session.uuid = outputSessionAttributes.uuid;//고객 식별을 위한 uuid
      session.placeId = outputSessionAttributes.placeId;//현재 이용중이 지점의 아이디값
      session.brandName = outputSessionAttributes.brandName;//이용중인 브랜드 이름
      session.positionName = outputSessionAttributes.positionName; //이용중인 지점의 한글이름
      session.validate = outputSessionAttributes.validate;//고객정보를 제공한 고객인지 확인하는 값
      session.order_cnt = outputSessionAttributes.order_cnt;//주문횟수 (최대 4회로 제한됨)

      session.name = outputSessionAttributes.name; //고객의 이름
      session.gender = outputSessionAttributes.gender; //고객의 성별
      session.age = outputSessionAttributes.age; //고객의 나이

      session.token = outputSessionAttributes.token;//특정고객에게 푸시알람을 보내기 위한 토큰값
  }
  var orderContent={url: null, kmenu:null,menu:null, amount:null, shot:null, size:null,syrup:null, date:null, time:null, type:null, price:session.price}; //사용자의 주문을 구성할 값들
  orderContent.url = outputSessionAttributes.url; //주문할 메뉴의 이미지url
  orderContent.kmenu = outputSessionAttributes.kmenu; //주문할 메뉴의 한글이름
  orderContent.menu = slots.menu; //lex에게 알릴 menu 슬롯의 값
  orderContent.amount = slots.amount;//lex에게 알릴 amount 슬롯의 값
  orderContent.shot = slots.shot;//lex에게 알릴 shot 슬롯의 값
  orderContent.size = slots.size;//lex에게 알릴 size 슬롯의 값
  orderContent.syrup = slots.syrup;//lex에게 알릴 syrup 슬롯의 값
  orderContent.date = slots.date;//lex에게 알릴 date 슬롯의 값 //현재 사용하지는 않음
  orderContent.time = slots.time;//lex에게 알릴 time 슬롯의 값 //현재 사용하지는 않음
  orderContent.type = slots.type;//lex에게 알릴 type 슬롯의 값


  //session.order = [];
  session.order.push(orderContent); //주문건수들을 배열의 형태로 관리
  session.order = JSON.stringify(session.order); //lex session이 문자열만 인식하기때문에 stringify 사용


  return session;
}
function whatResponseCard(slotToElicit){
  /*리스폰스카드의 속성*/
    var cardTitle;  //제목
    var cardSubTitle;// 소제목
    var carImageUrl;//이미지 url
    var cardAttachmentLinkUrl;//첨부 링크
    var cardButtons; //버튼 구성


    if(slotToElicit==='amount'){  //amount 슬롯에 대한 리스폰스카드 속성 정의
        cardTitle = `수량을 알려주세요!`;
        cardSubTitle = `1,2,3,4....로 답해주세요!`;
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
    else if(slotToElicit==='type'){//type 슬롯에 대한 리스폰스카드 속성 정의

        cardTitle = `이용방식을 말씀해주세요!`;
        cardSubTitle = `"포장" 또는 "매장이용" 여부에 대해 알려주세요!`;
        carImageUrl = null;
        cardAttachmentLinkUrl =null;
        cardButtons =[
            {
                text : '포장',
                value : 'packing'
            },
            {
                text : '매장이용',
                value :'in-store use'
            }

        ];
    }
    else if(slotToElicit==='size'){//size 슬롯에 대한 리스폰스카드 속성 정의
        cardTitle = `사이즈를 알려주세요!`;
        cardSubTitle = `"스몰" / "라지" 가 있습니다.`;
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
    else if(slotToElicit==='shot'){//shot 슬롯에 대한 리스폰스카드 속성 정의
        cardTitle = `샷을 얼마나 넣을까요?`;
        cardSubTitle = `1,2,3,4....로 답해주세요!`;
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

    return {//리스폰스카드를 구성하여 retrun

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
    var genericAttachments=[];//리스폰스카드들을 담을 배열
    var temp1;
    var temp2=[];
    sessionAttributes.recursionMenu = []; //search에서 감지된 값이 있고, 이들메뉴가 루프에 빠지지않도록 만들기위해 선언
    for(var i=0; i<search.length ; i++){//search에는 복수로 검색된 메뉴들이 있음
      if(i<10){
        temp = {//search안의 메뉴별로 리스폰스카드 구현
            title : search[i].kname,
            subTitle : null,
            imageUrl : search[i].url,
            attachmentLinkUrl : null,
            buttons : [
                {
                    text :search[i].price+"원(주문)",
                    value : search[i].ename
                }
            ]


        };
        genericAttachments.push(temp); //생성한 리스폰스카드를 추가
      }
      temp2.push({//리스폰스 카드 리스트들을 lex session으로 관리하기위해 약식으로 구성
        menu : search[i].ename,
        kmenu : search[i].kname,
        price : search[i].price,
        url : search[i].url,
        code : search[i].code
      });

    }
    sessionAttributes.recursionMenu = JSON.stringify(temp2); //temp2값을 세션으로 정의



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
function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
    //사용자가 이번에 특정 slots과 관련된 값을 입력할것이라고 예상될때
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
function confirmIntent(sessionAttributes,intentName, slots, message){
  //렉스 응답 유형을 confirmIntent로 , 목적은 고객의 결제관련 의사를 확인하기 위해서

    if(parseInt(sessionAttributes.order_cnt) >=5){ //주문횟수가 최대 4회로 가정햇기때문
      return{
          sessionAttributes,
          dialogAction:{
              type :'ConfirmIntent',
              intentName,
              slots,
              message,
              responseCard:responseCard('결제', `${sessionAttributes.kmenu}`,
                                      sessionAttributes.url,
                                      null,[{text : '결제하기',value :'no'},{text : '결제하기(예약)',value :'i want reservation'}])

          }
      };
    }
    return{ //위 문장과 다르게 더 주문하기 버튼을 제거하였음
        sessionAttributes,
        dialogAction:{
            type :'ConfirmIntent',
            intentName,
            slots,
            message,
            responseCard:responseCard('결제', `${sessionAttributes.kmenu}`,
                                    sessionAttributes.url,
                                    null,[{ text : '더 주문하기',value : 'yes'},{text : '결제하기',value :'no'},{text : '결제하기(예약)',value :'i want reservation'}])

        }
    };
}
function confirmIntent_Customer(sessionAttributes, intentName, slots, message){
  //렉스 응답유형을 confirmIntent 로 , 그리고 목적은 고객의 정보 제공여부를 판단하기위해서
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
  //렉스 응답유형을 close로 , 더이상 사용자로부터 어떤 입력을 기대하지 않기 때문
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}
function delegate(sessionAttributes, slots) {
  //렉스 응답유형을 delegate로, Lex가 대화를 이끌어가도록 권한을 넘김
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots
        },
    };
}
//----------
function dynamodbRead(outputSessionAttributes,menu,slots,callback){
    //dynamodb에 액세스하는 함수
    // 액세스의 목적은 사용자가 입력한 메뉴를 확인하는 것이며
    //쿼리 결과에 따라 다른 로직이 실행
    //ex) 아메리카노 -> 아이스아메리카노 , 카페아메리카노 2개가 선택
    //ex) 캐롯케이크 -> 캐롯케이크 1개가 선택
    var session = outputSessionAttributes;
    AWS.config.update({
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();



    var params_scan = { //scan을 위한 파라미터 객체
        TableName: table,
        ProjectionExpression: "#ename,#code,kname, price, #url", //url은 예약어이기 때문에 #을 이용한 표현식을 활용하였음
        FilterExpression: "contains(#ename, :ename) ", //scan에서 쓸수있는 함수로 contains를 사용(특정 문자열이 포함되어있는지 확인)
        ExpressionAttributeNames: {
            "#ename": "ename",
            "#url" : "url",
            "#code" :"code"
        },
        ExpressionAttributeValues: {

             ":ename": menu
        }
    };

    var params_get = { //get을 위한 파라미터 객체
        TableName: "Customer_Mymenu",
        Key:{
            "UUID": session.uuid
        }
    };
    docClient.get(params_get, function(err, data) {//

        if(!_.isEmpty(data)){//마이메뉴에 등록된게 있다면
          if(typeof(data.Item.Twosome)=="object"&&JSON.stringify(data.Item.Twosome)!="[]"){//그리고 그것이 Twosome항목에 관련된것이라면
              var twosome = data.Item.Twosome;
              for(var i=0; i<twosome.length; i++){
                if(twosome[i].alias==menu){ //마이메뉴 이름이랑 사용자가 렉스에 입력한 값이 같으면
                  session.menu = twosome[i].menu;
                  session.price = twosome[i].price;
                  session.kmenu = twosome[i].kmenu;
                  session.url = twosome[i].url;
                  session.code = twosome[i].code; //메뉴가 커피류인가 아닌가 구분

                  slots.menu = twosome[i].slots.menu;

                  
                  if(twosome[i].code =='1'){//메뉴가 커피면은...
                    slots.size = twosome[i].slots.size;
                    slots.shot = twosome[i].slots.shot;
                    slots.syrup = twosome[i].slots.syrup;
                  }
                  callback(delegate(session,slots));
                  return;
                }
              }
          }
        }

        var params_scan = {
            TableName: "Twosome_Menu",
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
        docClient.scan(params_scan, onScan);
        function onScan(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("Scan succeeded.");

                var search=null;
                if(_.isEmpty(data.Items)){//만약 검색된 것이 없다면
                    console.log("@@@@ 0개 검색됨@@@");
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    slots.menu = null; //무의미한 세션값들을 null로 바꿈
                    session.menu = null;//이 값들이 나중에 영햐을 끼치지 않도록...
                    session.url = null;
                    callback(elicitSlot_menu(session,"Order",slots,"menu",{ contentType: "PlainText", content: "메뉴이름을 정확히 말씀해주세요!" },search));
                    return;//사용자에게 elicit 유형으로 응답하여 다른 값을 요구함
                }

                if(data.Items.length == 1){//1개의 메뉴가 검색됨
                  console.log("@@@@ 1개 검색됨@@@");
                  console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                  session.code = data.Items[0].code; //검색된 메뉴를 토대로 session값을 구성
                  session.menu = data.Items[0].ename;
                  session.price = data.Items[0].price;
                  session.kmenu = data.Items[0].kname;
                  session.url = data.Items[0].url;
                  slots.menu = data.Items[0].ename;
                  session.recursionMenu = null;
                  callback(delegate(session, slots ));//menu값을 특정하였으니 다른 슬롯값을 얻기위해서 렉스에게 권한을 넘김
                  return;
                }
                if(data.Items.length >=2){//2개 이상의 메뉴가 검색됨

                  if(session.recursionMenu != null){ //carrotcake 와 carrotcakepiece가 가져다준 회귀문제 해결하는 코드
                    //만약 위 조건이 참이라면, 리스폰스카드로 구성한 메뉴들이 서로 루프문제를 일으키고 있기때문에 관련 코드를 실행
                    var recursionMenu = JSON.parse(session.recursionMenu); //문제를 일으키는 메뉴리스트들을 recursionMenu에 할당
                    for(var i=0; i<recursionMenu.length; i++){
                      if(slots.menu == recursionMenu[i].menu){ //루프를 일으키는 메뉴가 연속으로 2번 선택되었다면, 사용자가 이 메뉴를 원하는 것으로 해석
                        session.menu = slots.menu;
                        session.price = recursionMenu[i].price;
                        session.kmenu = recursionMenu[i].kmenu;
                        session.url = recursionMenu[i].url;
                        session.code = recursionMenu[i].code;

                        slots.menu = recursionMenu[i].menu; //slots.menu에 값을 확실하게 할당하기 위해서
                        session.recursionMenu = null;//필요가 없어진 recursionMenu를 null로 만들어서 이후 알고리즘에서 영향을 끼치지않도록함

                        callback(delegate(session, slots ));
                        return;
                      }
                    }
                  }
                  console.log("@@@@ 2개이상 검색됨@@@");
                  console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                  slots.menu = null; //2개 이상 쿼리시키는 메뉴값을 null로 만들어서 제거함
                  session.menu = null; //로직에서 session.menu는 DB액세스 관련 조건문과 관련이있기때문에 null로 만들어 로직에 불필요한 영향을 안주도록함

                  search=[]; //2개이상 검색된 메뉴들을 search에 저장하여 이후 로직에서 적절히 처리할수있도록함
                  for(var i=0; i<data.Items.length; i++){
                    search.push(data.Items[i]);
                    console.log(search[i]);
                  }


                  callback(elicitSlot_menu(session,"Order",slots,"menu",{ contentType: "PlainText", content: "이 메뉴들 중에 어떤 것을 원하시는 건가요?" },search));
                  return;

                }



                if (typeof data.LastEvaluatedKey != "undefined") { //scan이 적절히 작동하지 않았을때 작동
                    console.log("Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    docClient.scan(params, onScan);
                }
            }
         }


    });



}
//----------------------
function buildValidationResult(isValid, violatedSlot, messageContent) { //elicit 관련 응답에서 매개변수에 따라 적절한 구성을 리턴하는 함수
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
function parseLocalDate(date) {//렉스가 slot을 통해 받아들이는 2018-08-12 같은 값을 Date()객체로 만드는 함수
    /**
     * Construct a date object in the local timezone by parsing the input date string, assuming a YYYY-MM-DD format.
     * Note that the Date(dateString) constructor is explicitly avoided as it may implicitly assume a UTC timezone.
     */
    const dateComponents = date.split(/\-/);
    return new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
}
function validateMenu(outputSessionAttributes,menu,slots,callback){ //메뉴의 타당성을 검증

    dynamodbRead(outputSessionAttributes,menu,slots,callback);
}
function validateAmount(amount){//수량의 타당성을 검증

    if(amount<10) return true;
    else return false;

}
function validateType(type){//포장유무의 타당성을 검증
    var count=0;
    var list = ['packing',
                'in-store use'
    ]
    for(var i=0; i<list.length ; i++ ){
        if(list[i]==type){
            count++;
        }
    }

    if(count>0) return true;
    else return false;

}
function validateSize(size){//사이즈의 타당성을 검증

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
function validateShot(shot){//샷의 타당성 검증
    if(shot<10) return true;
    else return false;
}
function validateSyrup(syrup){//시럽의 타당성 검증
    if(syrup<10) return true;
    else return false;
}
function validateDate(date, time){//날짜의 타당성 검증 , 알고리즘 수정으로 Order Intent에서는 쓰이지 않지만 Pay Intent에서는 쓰임
                                  //현재시간, 현재날짜보다 이전을 뜻하는 값이 입력되어있는지 확인하기 위해서
    try {
        if((isNaN(parseLocalDate(date).getTime())) ){
            return false;
        }


        var today = new Date(); //오늘 날짜 생성
        today.setHours('0'); //자질구레한 값들 0으로 초기화
        today.setMinutes('0');
        today.setSeconds('0');
        today.setMilliseconds('0');

        if(time){ //time값이 존재하는데
          if(parseLocalDate(date) < today ){ //오늘날짜보다 입력된날짜가 이전이라면 false

              return false;
          }
          if(parseLocalDate(date) == today){//오늘날짜와 입력된 날짜가 같다면

            var now = new Date(); //현재시간 구하기 위해 생성
            var now_hour = parseInt(now.getHours(),10);
            var now_min = parseInt(now.getMinutes(),10);

            const hour = parseInt(time.substring(0, 2), 10);//사용자가 입력한 시간
            const minute = parseInt(time.substring(3), 10);
            if(now_hour>hour){ //현재 시간이 입력된 시간보다 크면 false
                return false;
            }
            else if((now_hour == hour) &&( now_min>minute)){ //현재시간과 입력된 시간이 같고, 입력된 시간보다 현재시간이 크다면 false
                return false;
            }


          }
        }
        else{ //time 값이 아직 입력되지 않았다면
          if(parseLocalDate(date) < today ){ //현재날짜보다 입력된 날짜가 더 이전이라면

              return false;
          }

        }


    } catch (err) {
      console.log("err 발생!!!");
        return false;
    }
    return true;

}
function validateTime(date, time, callback){ //현재시간, 현재날짜보다 이전을 뜻하는 값이 입력되어있는지 확인하기 위해서
      if (time.length !== 5) { //time의 글자수 형식이 틀린지 확인
          return false;
      }

      var today = new Date(); //오늘 날짜 생성
      today.setHours('0'); //자질구레한 값들 0으로 초기화
      today.setMinutes('0');
      today.setSeconds('0');
      today.setMilliseconds('0');
      if(date){

        if(parseLocalDate(date).getTime()==today.getTime()){
          var now = new Date(); //현재시간 구하기 위해
          var now_hour = now.getHours();
          var now_min = now.getMinutes();

          const hour = parseInt(time.substring(0, 2), 10);//뒤에 10은 십진수
          const minute = parseInt(time.substring(3), 10);
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

      return true;
}
function validateOrder(outputSessionAttributes,slots, menu, amount, type, size, shot,syrup, date,time,callback) {
  //주문과 관련된 값들의 유효성을 검사하는 함수

   //유효성을 검사하는 코드들
   if(menu){
       if(!(menu==outputSessionAttributes.menu)){
          key_menuFirstCheck = true;
          validateMenu(outputSessionAttributes,menu,slots,callback);

        }
   }
   if(amount){
       if(!validateAmount(amount)){
           return buildValidationResult(false, 'amount',`${amount}개는 준비하기 어렵습니다! 다시 말씀해주세요.`);
       }
   }
   if(type){
       if(!validateType(type)){
           return buildValidationResult(false, 'type',`잘 못알아들었습니다. "매장이용" 또는 "포장" 으로 말씀해주세요! `);
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
   if(date){
       if(!validateDate(date,time)){
          return buildValidationResult(false, 'date',`날짜를 다시 확인해주세요.`);
       }
   }

   if(time){
       if(!validateTime(date,time,callback)){
         return buildValidationResult(false, 'time',`시간을 다시 확인해주세요.`);
       }

   }




    return buildValidationResult(true, null, null);
}
//--------------------
function checkFirstCustomer(sessionAttributes, uuid, slots, callback){ //현재 Intent를 이용하는 사용자가 개인정보를 제공한적이 있는지 확인하는 함수
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
          if(_.isEmpty(data)){ //고객이 정보를 제공한적이 없다면

            callback(confirmIntent_Customer(sessionAttributes, "Customer", {name : null, age : null, gender : null}, {contentType: 'PlainText', content: '고객님은 어떤 분이신가요?' }));
            return;//고객정보를 수집하는 intent로 변경
          }
          else{

            sessionAttributes.validate = true;
            /* 여기다가 고객의 이름, 성별 , 나이를 세션에다가 추가해주면됨*/
            sessionAttributes.name = data.Item.customerInfo.name;
            sessionAttributes.age = data.Item.customerInfo.age;
            sessionAttributes.gender = data.Item.customerInfo.gender;
            callback(delegate(sessionAttributes, slots));//session 에다가 validate true로 만들어서 다시 리턴하여 이 고객이 인증을 받았다는 것을 렉스에게 알림
            return;

          }
      }
  });
}

function order(intentRequest, callback) {


    var menu = intentRequest.currentIntent.slots.menu;
    if(menu != null){ menu = menu.replace(/(\s*)/g,"");}//띄어쓰기 된 값이 들어왔을때 제거하기 위해서, 그리고 null일때 replace 함수쓰면 오류남
    if(menu){
      if(menu.substr(menu.length-1)=='s') menu = menu.slice(0,-1); //복수형으로 들어온 단어의 s문자를제거하여 단수로만듬
            //전제가 메뉴중에 s로 끝나는게 없어야하는게 안전함....
    }
    /*각 슬롯들의 값을 변수에 할당*/
    const amount = intentRequest.currentIntent.slots.amount;
    var type = intentRequest.currentIntent.slots.type;

    const size =intentRequest.currentIntent.slots.size;
    const shot =intentRequest.currentIntent.slots.shot;
    const syrup = intentRequest.currentIntent.slots.syrup;
    const date =intentRequest.currentIntent.slots.date;
    const time = intentRequest.currentIntent.slots.time;

    const source = intentRequest.invocationSource; //현재 로직의 상태를 확인(검증,이행 을 구분함)
    const outputSessionAttributes = intentRequest.sessionAttributes || {}; //렉스의 세션값을 할당
    var slots = intentRequest.currentIntent.slots; //렉스의 슬롯값들을 할당
    if(type =='ㅇ') {type = 'packing';  slots.type = 'packing';} //예외적인 값들을 수용하기 위해 if문 사용
    if(type =='n') {type = 'in-store use'; slots.type = 'in-store use';}//예외적인 값들을 수용하기 위해 if문 사용
    if(outputSessionAttributes.order_cnt==null) outputSessionAttributes.order_cnt = 0; //최대주문횟수를 4회로 제한하기 위한 변수 선언
    if(outputSessionAttributes.validate==null||outputSessionAttributes.validate==false ){ //해당uuid 고객이 Lex통해서 고객정보 제공해줬는지
      checkFirstCustomer(outputSessionAttributes,outputSessionAttributes.uuid,slots, callback);//고객정보 관련 함수 호출
      return;
    }

    if (source === 'DialogCodeHook') {

        const validationResult = validateOrder(outputSessionAttributes,slots, menu, amount, type,size,shot,syrup, date,time,callback);//유효성을 검사하고 그 결과를 validationResult에 담음 반환 양식은 buildValidationResult() 함수를 따름
                                                                                                //callback도 추가했어 DB때문에
        if (!validationResult.isValid) {
            slots[`${validationResult.violatedSlot}`] = null;//값이 들어온 슬롯의 유효성 탈락한것을 null로 다시 되돌림
            callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));//값을 다시 입력해달라고 하기위해서 elicit유형 사용
            return;
        }

        if(key_menuFirstCheck){//dynamodbRead함수의 비동기적 실행을 안전하게 마치기위해서, 조건을 확인하여 종료시킴
          key_menuFirstCheck = false;//다음 호출에서도 조건을 적절히 확인하기 위해 추가
          return;
        }

        if(outputSessionAttributes.code=="1"&&menu){ //menu가 입력되었고, 그것이 커피 종류라면...
            if(!size){ //size가 입력되지 않았다면
                callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'size', { contentType: 'PlainText', content: "컵사이즈를 말씀해주세요!" }));
                return;
            }
            if(!shot){//shot가 입력되지 않았다면
                callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'shot', { contentType: 'PlainText', content: "샷은 몇번 추가할까요?" }));
                return;
            }
            if(!syrup){//syrup가 입력되지 않았다면
                callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'syrup', { contentType: 'PlainText', content: "시럽은 몇번 추가할까요?" }));
                return;
            }
        }

        callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
        return;

    }

    /*
    사용자가 값을 복수적으로 입력하였을 경우에 if (source === 'DialogCodeHook')를 벗어나는 경우가 발생
    가장 단순한 방법인 검증 코드를 다시한번 작성하였음
    구조개선의 여지가 굉장히 높음
    참고하세요....
    */
    const validationResult = validateOrder(outputSessionAttributes,slots, menu, amount, type,size,shot,syrup, date,time,callback);//유효성을 검사하고 그 결과를 validationResult에 담음 반환 양식은 buildValidationResult() 함수를 따름

    if (!validationResult.isValid) {
        slots[`${validationResult.violatedSlot}`] = null;//방금 값이 들어온 슬롯의 유효성 탈락한거를 null로 다시 되돌림
        callback(elicitSlot(outputSessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));//값을 다시 입력해달라고 하기위해서 elicit쓴거고 responsecard 이용해서도 가능할듯함 굿굿서
        return;
    }

    if(key_menuFirstCheck){
      key_menuFirstCheck = false;
      return;
    }


    if(outputSessionAttributes.code=="1"&&menu){
        if(!size){
            callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'size', { contentType: 'PlainText', content: "컵사이즈를 말씀해주세요!" }));
            return;
        }
        if(!shot){
            callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'shot', { contentType: 'PlainText', content: "샷은 몇번 추가할까요?" }));
            return;
        }
        if(!syrup){
            callback(elicitSlot_coffee(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, 'syrup', { contentType: 'PlainText', content: "시럽은 몇번 추가할까요?" }));
            return;
        }
    }

    //--------------------------------------------------여기부터는 가격, 출력문장에 관련된 것들-------------------------------
    if(size=='large') outputSessionAttributes.price = parseInt(outputSessionAttributes.price)+500; //가격 500원 더
    if(shot!=null) outputSessionAttributes.price = parseInt(outputSessionAttributes.price) + 500 * parseInt(shot); //shot*500
    if(syrup != null) outputSessionAttributes.price = parseInt(outputSessionAttributes.price) + 500 * parseInt(syrup);//syrup*500

    if(outputSessionAttributes.totprice==null){
      outputSessionAttributes.totprice =0;
    }
    var Totprice = parseInt(outputSessionAttributes.totprice) + outputSessionAttributes.price*amount;
    outputSessionAttributes.totprice = Totprice;


    var type_result;
    if(type =='in-store use') type_result = '매장이용';//마지막 주문내용 보여줄때 한글로 보여줄려고...
    if(type =='packing') type_result = '포장';//마지막 주문내용 보여줄때 한글로 보여줄려고...
    outputSessionAttributes.recursionMenu=null; //만약에 여기까지와서 이 값이 살아있으면 문제가될수있기때문에 확실하게하기위해서 null처리

    if(outputSessionAttributes.code=='1'){ //커피관련 메뉴의 출력 형식
      outputSessionAttributes.order_cnt = parseInt(outputSessionAttributes.order_cnt)+1;
      callback(confirmIntent(sessionBuild(outputSessionAttributes, intentRequest.currentIntent.slots), 'Pay',{date : null, time : null},
      {contentType: 'PlainText', content:
      `주문내용
      제품명 : ${outputSessionAttributes.kmenu}
      개수 : ${amount}
      사이즈 : ${size}
      샷 : ${shot}
      시럽 : ${syrup}

      이용방법 : ${type_result}

      가격 : ${outputSessionAttributes.price * amount}원

      더 주문하시겠습니까?
      (${Totprice}원)`  }));
    }
    else{//일반메뉴의 출력 형식
      outputSessionAttributes.order_cnt = parseInt(outputSessionAttributes.order_cnt)+1;
      callback(confirmIntent(sessionBuild(outputSessionAttributes, intentRequest.currentIntent.slots), 'Pay',{date : null, time : null},
      {contentType: 'PlainText', content:
      `주문내용
      제품명 : ${outputSessionAttributes.kmenu}
      개수 : ${amount}

      이용방법 : ${type_result}

      가격 : ${outputSessionAttributes.price * amount}원

      더 주문하시겠습니까?
      (${Totprice}원)`  }));
    }



}
function dispatch(intentRequest, callback) {


    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'Order') {
        return order(intentRequest, callback);
    }
    throw new Error(`Intent with name ${intentName} not supported`);


}
exports.handler = (event, context, callback) => {

    try {
        console.log(`event.bot.name=${event.bot.name}`);
        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }

};
