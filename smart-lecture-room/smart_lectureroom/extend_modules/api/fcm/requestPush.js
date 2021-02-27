var key = require('../../../private/key')
var FCM = require('fcm-node');
module.exports = {

    requestPush : (to,title,body,content,clickAction, callback)=>{
        console.log("clickAction : " + clickAction );

        const serverKey = key.fcm;
        const push_data = {
          to: to,             //topic
          priority: "high",                 //우선순위
          data: {                           //백그라운드에서 noti받으려면 notification:{} 없이 data로만
              title: title,                 //제목
              body : body,
              content : content,            // 컨텐트
              imageurl : "imgurllink",        //이미지url
              sound: "default",
              clickAction: clickAction //
              // clickAction: "MainActivity"
              // clickAction: "AttendRequestActivity"
          }
        };

        const fcm = new FCM(serverKey);
        fcm.send(push_data, callback);
    }
}
