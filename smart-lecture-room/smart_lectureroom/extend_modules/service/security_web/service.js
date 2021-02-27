
var mongoDB = require('../../dao/security_web/mongoDB');
// var rekognition = require('../../api/aws_rekognition/compareImg');
// var fcm = require('../../api/fcm/requestPush');
// var imgSource = require('./imgSource');
var atob = require('atob');
var fs = require('fs');

module.exports = {

    loginProcess : (userInfo, callback)=>{
        const id = userInfo.id;
        const pw = userInfo.pw;
        console.log("-----------------");
        console.log("loginProcess")
        console.log("id : " + id);
        console.log("pw : " + pw);
        console.log("-----------------");

        if(id==""){ //아이디를 입력하지 않음
            callback({STATE :"ERR" , DETAIL:"EMPTY_ID"});
            return;
        }
        if(pw==""){//비밀번호를 입력하지 않음
            callback({STATE :"ERR" , DETAIL:"EMPTY_PASSWORD"});
            return;
        }

        const queryObject = {"guard_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.findGuard(queryObject)
        .then((docsPack)=>{
            const docs = docsPack.docs;
            const amount = docs.length;
            let result={
                STATE : "SUCCESS",
                DETAIL : "SUCCESS_LOGIN"
            };
            if(amount===1){ //회원가입된 아이디
                const guard = docs[0];
                if(guard.guard_pw!==pw){ //비밀번호가 일치하지않음
                    result.STATE="ERR";
                    result.DETAIL="NOT_CORRECT_PASSWORD";
                }
                else{ //아이디와 비밀번호 모두 일치
                    result.data ={
                        id : guard.guard_id, //로그인 id 저장
                        name : guard.guard_name //로그인 성명 저장
                    }
                }
            }
            if(amount===0){ //회원가입되지 않은 아이디
                result.STATE="ERR";
                result.DETAIL="NOT_FOUND_MAIL"
            }


            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    getMainInfo : (userInfo, callback)=>{
        const queryObject = {}; //몽고디비 쿼리 내용 : 전부 다읽어옴
        mongoDB.getLectureRoomInfo(queryObject)
        .then((docsPack)=>{
            let lectureRoom = docsPack.docs;
            lectureRoom.sort(function(a,b){ //오름차순 정렬
                return a.building_name < b.building_name ? -1 : a.building_name > b.building_name ? 1 : 0;
            })
            let result = {
                data : [
                    // {
                    //     building_name : null,
                    //     roomList : []
                    // }                    
                ]
            }

            let temp = lectureRoom[0].building_name;
            let roomList =[];
            for(let i=0; i< lectureRoom.length; i++){
                if(temp == lectureRoom[i].building_name){
                    roomList.push({
                        lectureroom_id : lectureRoom[i].lectureroom_id,
                        lectureroom_num : lectureRoom[i].lectureroom_num,
                        camera_ip : lectureRoom[i].camera_ip,
                    })
                    if(lectureRoom.length-1 == i){
                        roomList.sort(function(a,b){ //방호수 오름차순 정렬
                            return a.lectureroom_num < b.lectureroom_num ? -1 : a.lectureroom_num > b.lectureroom_num ? 1 : 0;
                        });

                        result.data.push({
                            building_name : temp,
                            roomList : roomList
                        });
                        
                    }
                }
                else{
                    roomList.sort(function(a,b){ //방호수 오름차순 정렬
                        return a.lectureroom_num < b.lectureroom_num ? -1 : a.lectureroom_num > b.lectureroom_num ? 1 : 0;
                    });

                    result.data.push({
                        building_name : temp,
                        roomList : roomList
                    })
                    roomList = [];
                    temp = lectureRoom[i].building_name;
                    i--;
                }
            }
            
            /** 아래의 배열형태로 정제됨 
             [{
                 building_name : "실습관",
                 roomList : [
                     {
                         lectureroom_num : "411호",
                         camera_id : "DDIE123",
                         lectureroom_id : "1"
                     },
                     {
                         lectureroom_num : "412호",
                         camera_id : "DDIE123",
                         lectureroom_id : "2"
                     }
                 ]
             }]
             */
            callback(result);
        })

    }
};