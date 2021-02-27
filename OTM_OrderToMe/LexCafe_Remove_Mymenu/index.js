const AWS = require("aws-sdk");
const _ = require('lodash');


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

function close_RemoveMymenu(sessionAttributes,alias ,callback){
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
          if(typeof(data.Item.Twosome)=="undefined"){
            callback(null,close(sessionAttributes, 'Fulfilled',
            {contentType: 'PlainText', content: `Twosome에 등록하신 Mymenu가 없습니다!`}));
          }
          else{
              var count;
              count = 0; //람다 생명주기가 영 찜찜해서 이렇게 초기화했음
              var twosome = data.Item.Twosome;
              for(var i=0; i<twosome.length; i++){
                  if(twosome[i].alias == alias){
                      count++;
                      twosome.splice(i,1); //배열의 특정항목 삭제
                      var params_put = {
                          TableName:table,
                          Item:{
                              "UUID": sessionAttributes.uuid, //나중에 MAC이라는 변수로 대체해야됨 sessionAttributes 에서꺼내고
                              "Twosome" : twosome
                          }
                      };
                      docClient.put(params_put, function(err, data) {
                          if (err) {
                              console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                          } else {
                              console.log("Added item:", JSON.stringify(data, null, 2));
                              callback(null,close(sessionAttributes, 'Fulfilled',
                              {contentType: 'PlainText', content: `MyMenu : "${alias}"가 삭제되었습니다!`}));
                          }
                      });

                  }
              }
              if(count == 0){
                callback(null,close(sessionAttributes, 'Fulfilled',
                {contentType: 'PlainText', content: `MyMenu : "${alias}"는 존재하지 않습니다!`}));

              }

            }
        }

    });
}

exports.handler = (event, context, callback) => {
    // TODO implement
    var alias = event.currentIntent.slots.alias;

    var outputSessionAttributes = event.sessionAttributes||{};
    var slots = event.currentIntent.slots;
    var source = event.invocationSource;

    // if(source ==='DialogCodeHook'){
    //     callback(null,delegate(outputSessionAttributes, event.currentIntent.slots));
    //     return;
    // }

    close_RemoveMymenu(outputSessionAttributes,alias ,callback);
    return;






};
