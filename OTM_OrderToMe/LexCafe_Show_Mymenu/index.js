const AWS = require("aws-sdk");
const _ = require('lodash');
function close_ShowMymenu(sessionAttributes,twosome, fulfillmentState, message) {
    var genericAttachments=[];
    var card;
    for(var i =0 ; i<twosome.length; i++){
        card = {
          title : twosome[i].kalias,
          subTitle : `${twosome[i].kmenu}  ${twosome[i].price}`,
          imageUrl : twosome[i].url,
          attachmentLinkUrl : null,
          buttons :[
            {
                text :"주문하기",
                value : "i want order " + twosome[i].alias //나중에 명규껄로 입력값 받으면 수정이 반드시 필요...★★★
            },
            {
                text :"삭제하기",
                value : "i want to remove " + twosome[i].alias//나중에 명규껄로 입력값 받으면 수정이 반드시 필요...★★★
            }
          ]

        }
        genericAttachments.push(card);
    }


    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
            responseCard: {

                    version : 1,
                    contentType : 'application/vnd.amazonaws.card.generic',
                    genericAttachments : genericAttachments


            }
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
            // responseCard: {
            //
            //         version : 1,
            //         contentType : 'application/vnd.amazonaws.card.generic',
            //         genericAttachments : genericAttachments
            //
            //
            // }
        },

    };
}
function showMymenu(sessionAttributes,callback){

    AWS.config.update({
      region: "us-east-1",
      endpoint: "https://dynamodb.us-east-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();
    var table = "Customer_Mymenu";

    //----------------------------------------------------------------나중에 다른 브랜드쓸려면 Twosome들 이름을 변경하면됨
    var params_get = {
          TableName: table,
          Key:{
              "UUID": sessionAttributes.uuid
          }
    };

    docClient.get(params_get, function(err, data){
        if(_.isEmpty(data)){
          callback(null,close(sessionAttributes, 'Fulfilled',
          {contentType: 'PlainText', content: `등록하신 Mymenu가 없습니다!`}));
        }
        else{
          if(typeof(data.Item.Twosome)=="undefined"||JSON.stringify(data.Item.Twosome)=='[]'){
            callback(null,close(sessionAttributes, 'Fulfilled',
            //{contentType: 'PlainText', content: `Twosome에 등록하신 Mymenu가 없습니다!`}));
            {contentType: 'PlainText', content: "<div><h1>Twosome에</h1> 등록하신 Mymenu가<br> 없습니다!</div>"}));
          }
          else{
            var twosome = data.Item.Twosome;
            callback(null,close_ShowMymenu(sessionAttributes,twosome, 'Fulfilled',
            {contentType: 'PlainText', content: `등록하신 Mymenu 리스트 입니다!`}));

          }
        }
    });

}

exports.handler = (event, context, callback) => {
    // TODO implement
    var outputSessionAttributes = event.sessionAttributes||{};

    showMymenu(outputSessionAttributes, callback);
    return;

};
