// // function getQuerystring(paramName){
// //   var _tempUrl = window.location.search.substring(1); //url에서 처음부터 '?'까지 삭제
// //   var _tempArray = _tempUrl.split('&'); // '&'을 기준으로 분리하기
// //   for(var i = 0; _tempArray.length; i++) {
// //     var _keyValuePair = _tempArray[i].split('='); // '=' 을 기준으로 분리하기
// //     if(_keyValuePair[0] == paramName){ // _keyValuePair[0] : 파라미터 명
// //       // _keyValuePair[1] : 파라미터 값
// //       return _keyValuePair[1];
// //     }
// //   }
// // }
// //
// //
// // var info = {
// //   uuid : "abcdef",
// //   brandName : "투썸플레이스",
// //   positionName : "석계역점"
// //
// // }
// // var info = JSON.stringify(info);
// // console.log(info);
// // var info2 =JSON.parse(info);
// // console.log(info2.uuid);
// // console.log(info2.brandName);
// // console.log(info2.positionName);
// // console.log(info2);
// //------------------------------------------------------------------
// // var time = '13:17';
// //
// // var now = new Date(); //현재시간 구할라고
// // var now_hour = now.getHours();//정수로 나오더라
// // var now_min = now.getMinutes();//정수로나오더라
// //
// // const hour = parseInt(time.substring(0, 2), 10);//뒤에 10은 십진수
// // const minute = parseInt(time.substring(3), 10);
// // console.log(now_hour);
// // console.log(now_min);
// // console.log(hour);
// // console.log(minute);
// //------------------------------------------------------------------
//
//
//
// //
// //
// // var obj = '19950512'
// //
// // var year = obj.substring(0,4);
// // var month = obj.substring(4,6); // -1 해야됨
// // var day = obj.substring(6);
// // obj = new Date(year,month,day);
// // obj = obj.toString();
// //
// // const dateComponents = obj.split(/\-/);
// // // new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
// // // console.log(dateComponents[0]);
// // // console.log(year + month + day);
// //
// // var obj2 = new Date();
// // console.log(obj2.getMonth()+1);
// //------------------------------------------------------------------------------------------------------------------------
// const AWS = require("aws-sdk");
// const _ = require('lodash');//예제따라할려고추가했음
//
// AWS.config.update({
//   region: "us-east-1",
//   endpoint: "https://dynamodb.us-east-1.amazonaws.com"
// });
//
// var docClient = new AWS.DynamoDB.DocumentClient();
//
// var table = "Twosome_Menu";
//
// var params = {
//     TableName: table,
//     ProjectionExpression: "#ename,code,kname, price, #url", //url 추가하고싶은데 예약된 키워드라고 안되네?
//     FilterExpression: "contains(#ename, :ename) ",
//     ExpressionAttributeNames: {
//         "#ename": "ename",
//         "#url" : "url"
//
//     },
//     ExpressionAttributeValues: {
//
//          ":ename": "twgteaice"
//     }
// };
//
// docClient.scan(params, onScan);
//
// function onScan(err, data) {
//     if (err) {
//         console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//
//         console.log("Scan succeeded.");
//         console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
//         // data.Items.forEach(function(content) {
//         //    console.log(
//         //         content.ename + ": "+ content.price);
//         // });
//
//         var search=null;
//         if(_.isEmpty(data.Items)){ //여기다가 나중에 추천메뉴를  elicitSlot_menu에서 보이도록수정하면됨
//             console.log("@@@@ 0개 검색됨@@@");
//             console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
//
//
//
//
//         if (typeof data.LastEvaluatedKey != "undefined") { //이거 어떤역할하는 거지?
//             console.log("Scanning for more...");
//             params.ExclusiveStartKey = data.LastEvaluatedKey;
//             docClient.scan(params, onScan);
//         }
//     }
//  }
// }

//------------------------------------------------------------------------------------
// const AWS = require("aws-sdk");
// const _ = require('lodash');//예제따라할려고추가했음
//
//
// AWS.config.update({
//   region: "us-east-1",
//   endpoint: "https://dynamodb.us-east-1.amazonaws.com"
// });
//
// var docClient = new AWS.DynamoDB.DocumentClient();
// var table = "Customer_Mymenu";
//
// //----------------------------------------------------------------나중에 다른 브랜드쓸려면 Twosome들 이름을 변경하면됨
// var params_get = {
//       TableName: table,
//       Key:{
//           "UUID":"3f92321c-0086-4a7b-b665-db1cd81b4801"
//       }
// };
//
// docClient.get(params_get, function(err, data){
//     if(_.isEmpty(data)){
//       console.log("비었다");
//     }
//     else{
//
//       if(typeof(data.Item.Twosome)=="undefined"||JSON.stringify(data.Item.Twosome)=='[]'){
//         console.log(2);
//       }
//       else{
//         var twosome = data.Item.Twosome;
//         console.log(3);
//
//       }
//     }
// });
//------------------------------------------------------------------------------------


// var obj;
//
// var a = "0";
// var b = 2;
//
// console.log(a+b);

//--------------------------
// var uuid = "122f6c3a-574a-4e56-80ca-b4f6ea1b20e0"; //넘겨줄거면 이렇게 넘겨줘야하는것같슴다. 이 초이스인가뭐시긴가가 세션값인가요 밑 스크립트에서 테스트해봄
// var user_choice = {
//   brandName : "투썸플레이스",
//   positionName : "창동역점",  //브랜드명.length()를 이용해서 유연하게 쓰자
//   uuid : uuid,  //이거 이렇게써두되나요????????????????????????????????????????????????????????????????????????????????????????????????????????\
//   placeId : "ChIJ20ULhk-5fDUREsDLwzw1mxc"
//
// };
// console.log(user_choice.validate);
//








//------------------------------------------------------------------------------------
