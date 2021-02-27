const AWS = require("aws-sdk");
const _ = require('lodash');

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

exports.handler = (event, context, callback) => {
    // TODO implement
    var outputSessionAttributes = event.sessionAttributes||{};

    callback(null,close(outputSessionAttributes, 'Fulfilled',
    {contentType: 'PlainText',
    content:
    `
    개인정보 변경 : 내 정보 변경하고 싶어 ,<br>
    나만의 메뉴 추가 : 나만의 메뉴 만들고 싶어 ,<br>
    나만의 메뉴 삭제하기 : 나의 메뉴 삭제하고 싶어 ,<br>
    나만의 메뉴 보기 : 내 메뉴 보고 싶어 ,<br>
    도움말 보기 : 도와줘 ,<br>
    주문하기 : 주문하고 싶어 ,<br>
    메뉴 추천 받기 : 메뉴 추천해줘 ,<br>
     `
    }));
    return;
    //리스폰스 카드로 고를수 있게할까?

};
