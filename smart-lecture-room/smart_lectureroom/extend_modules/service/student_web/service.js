var mongoDB = require('../../dao/student_web/mongoDB');
var rekognition = require('../../api/aws_rekognition/compareImg');
var fcm = require('../../api/fcm/requestPush');
var imgSource = require('./imgSource');
var atob = require('atob');
var fs = require('fs');
var request = require('request');

module.exports = {

    registerProcess : (userInfo, callback)=>{
        const student_id = userInfo.student_id;
        const student_pw = userInfo.student_password;
        const student_name = userInfo.student_name;
        const queryObject = {"student_id":{"$in":[student_id]}}; //몽고디비 쿼리 내용

        mongoDB
        .findStudent(queryObject)
        .then((docsPack)=>{
            const docs = docsPack.docs;
            const amount = docs.length;
            let result = {
                STATE : "SUCCESS",
                DETAIL : "SUCCESS_REGISTER"
            }

            if(amount===1){
                result.STATE = "ERR";
                result.DETAIL = "ALEADY_REGISTERED_ID";
            }

            if(result.STATE ==="SUCCESS"){
                let insertObject={
                    student_id :student_id,
                    student_pw :student_pw,
                    student_name : student_name
                }; //insert내용을 정의해주기

                mongoDB.insertStudent(insertObject)
                .then(()=>{
                    callback(result);
                });
            }
            else{
                callback(result);
            }


        })
    },

    loginProcess : (userInfo, callback)=>{
        const id = userInfo.student_id;
        const pw = userInfo.student_password;
        console.log("-----------------");
        console.log("loginProcess for Android(Student)")
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

        const queryObject = {"student_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.findStudent(queryObject)
        .then((docsPack)=>{
            const docs = docsPack.docs;
            const amount = docs.length;

            let result={
                STATE : "SUCCESS",
                DETAIL : "SUCCESS_LOGIN",
                // STUDENTNAME : docs[0].student_name
            };
            if(amount===1){ //회원가입된 아이디
                const student = docs[0];
                if(student.student_password!==pw){ //비밀번호가 일치하지않음
                    result.STATE="ERR";
                    result.DETAIL="NOT_CORRECT_PASSWORD";
                }
                else{ //아이디와 비밀번호 모두 일치
                    result.data ={
                        id : student.student_id, //로그인 id 저장
                        name : student.student_name //로그인 성명 저장
                    }

                    result.STUDENTNAME =docs[0].student_name;
                }
            }
            if(amount===0){ //회원가입되지 않은 아이디
                result.STATE="ERR";
                result.DETAIL="NOT_FOUND_ID";
            }


            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    changePasswordProcess : (userInfo, callback)=>{
        const id = userInfo.student_id;
        const pw = userInfo.student_password;

        console.log("-----------------");
        console.log("loginProcess for Android(Student)")
        console.log("id : " + id);
        console.log("pw : " + pw);
        console.log("-----------------");

        const queryObject = {"student_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.findStudent(queryObject)
        .then((docsPack)=>{
            const docs = docsPack.docs;
            const amount = docs.length;
            let result={
                STATE : "SUCCESS",
                DETAIL : "SUCCESS_LOGIN"
            };
            if(amount===1){ //회원가입된 아이디
                const student = docs[0];
                if(result.STATE ==="SUCCESS"){
                    let updateObject = {
                         query : {student_id: id},
                         update : { $set: { student_password:pw}}
                    }

                    result.data ={
                        id : student.student_id, //로그인 id 저장
                        name : student.student_name //로그인 성명 저장
                    }

                    mongoDB.updateStudent(updateObject)
                    .then(()=>{
                        callback(result);
                    });
                }
            }
            if(amount===0){ //회원가입되지 않은 아이디
                result.STATE="ERR";
                result.DETAIL="NOT_FOUND_ID";
            }else{
              callback(result);
            }
        })
        .catch((err)=>{console.log(err);});
    },

    getTokenProcess : (userInfo, callback)=>{
        const id = userInfo.student_id;
        const token = userInfo.student_token;

        console.log("-----------------");
        console.log("loginProcess for Android(Student)")
        console.log("id : " + id);
        console.log("토큰 : " + token);
        console.log("-----------------");

        const queryObject = {"student_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.findStudent(queryObject)
        .then((docsPack)=>{
            const docs = docsPack.docs;
            const amount = docs.length;
            let result={
                STATE : "SUCCESS",
                DETAIL : "SUCCESS_LOGIN"
            };
            if(amount===1){ //회원가입된 아이디
                const student = docs[0];
                if(result.STATE ==="SUCCESS"){
                    let updateObject = {
                         query : {student_id: id},
                         update : { $set: { student_token: token}}
                    }

                    result.data ={
                        id : student.student_id, //로그인 id 저장
                        name : student.student_name //로그인 성명 저장
                    }

                    mongoDB.updateStudent(updateObject)
                    .then(()=>{
                        callback(result);
                    });
                }
            }
            if(amount===0){ //회원가입되지 않은 아이디
                result.STATE="ERR";
                result.DETAIL="NOT_FOUND_ID";
            }else{
              callback(result);
            }
        })
        .catch((err)=>{console.log(err);});
    },

    buildTimeTable : (userInfo, callback)=>{
        const id = userInfo.id;
        const queryObject = {"student_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.getLectureInfo(queryObject)
        .then((content)=>{
            let result={}; //결과물을 담을 객체
            let timeTableHtml= ""; //시간표 html을 입력할 변수
            const lecture = content.lecture; //쿼리를 통해 얻어온 lecture테이블의 객체
            let dayOfWeek={ //각 요일의 시간표를 생성할 때, 연강을 표현하기 위해서 사용하는 요일별 변수
                mon : 0,
                tue : 0,
                wed : 0,
                thu : 0,
                fri : 0
            }
            let dayOfWeek_eng=["mon","tue","wed","thu","fri"];
            let dayOfWeek_kor=["월","화","수","목","금"];
            /**
             * 가장 바깥쪽의 for문이 한번 실행될때마다 시간표의 1줄씩 생성됨
             *  ex) 1교시, 2교시, ....
             */
            for(let n=0; n<10; n++){ //n+1 값이 교시를 뜻함

                timeTableHtml += "<tr>"
                timeTableHtml +=    "<td class='time'>"+ (n+1) +"</td>" //시간표에서  몇 교시인지를 표현

                for(let m=0; m<5; m++){ //m의 값은 요일을 뜻함 0:월, 1:화, 2:수 ......
                    let flag=0; //비어있는 <td> </td>를 입력해야하는지 구분하기 위한 플래그

                    /**
                     * 아래 2개의 for문은 lecture 변수안의 정보를 모두 순회하기 위해 사용
                     * 하나의 정보를 순회할때마다 관련 로직이 실행되고, 적절한 시간표 태그를 생성함
                     */
                    for(let j=0; j<lecture.length; j++){
                        for(let k=0; k<lecture[j].lecture_info.length; k++){
                            let lecture_id = lecture[j].lecture_id; //강의명
                            let lecture_name = lecture[j].lecture_name; //강의명
                            let lecture_info = lecture[j].lecture_info[k]; //강의정보
                            let lecture_room = lecture_info.lectureroom; //강의장소
                            // console.log(lecture_room.camera_id);

                            /**
                             * //lecture_time을 쪼개어 요일을 구함 ex) 월2 -> 월  , 2
                             */
                            let day= lecture_info.lecture_time.substr(0,1);
                            let time = lecture_info.lecture_time.substr(1,1);
                            let key;
                            /**
                             * 위에서 미리 선언한 dayOfWeek_kor, dayOfWeek_eng 배열을 통해
                             * day 안의 한글요일을 영어요일의 인덱스로dayOfWeek_eng[index]
                             * key를 영어 요일로 값을 변경함
                             */
                            for(let z=0; z<5; z++){
                                if(day===dayOfWeek_kor[z]){
                                    day=z;
                                    key=dayOfWeek_eng[z];
                                    break;
                                }
                            }

                            /**
                             * (n+1)==time :
                             * 시간표는 한 행씩 생성됨
                             * 따라서 해당 행에서 의미하는 교시와 lecture의 수업교시가 일치하는지 확인
                             *
                             * (m==day) :
                             * 한 행이 생성되기 전에 작업단위는 하나의 열, 즉 한 칸씩 생성됨(<td></td>)
                             * 하나의 열은 요일을 의미함으로, 현재 생성할 열(m)과 lecture의 요일이 일치하는지 확인
                             *
                             * dayOfWeek[key]==0 :
                             * 시간표에 표현할 과목이 연강이라면 한번에 여러열을 병합하여 표현하게 되는데,
                             * 병합된 칸을 고려하여, <td></td>를 생성하지 말아야 함
                             * dayOfWeek 의 속성들은 이를 위한 값들이며, 이 속성들이 0일때는 표현할 연강이 없음을 의미함
                             */
                            if((n+1)==time && (m==day) && dayOfWeek[key]==0 ){
                                let rowspan=1; //강의의 기본 연강은 1시간

                                day= lecture_info.lecture_time.substr(0,1); //요일
                                time = parseInt(lecture_info.lecture_time.substr(1,1))+1;//교시

                                for(let z =0 ; z< lecture[j].lecture_info.length; z++){
                                    if((day+time)== lecture[j].lecture_info[z].lecture_time){//만약 해당과목이 연강이라면...
                                        rowspan++;
                                        day= lecture[j].lecture_info[z].lecture_time.substr(0,1); //요일
                                        time = parseInt(lecture[j].lecture_info[z].lecture_time.substr(1,1))+1;//교시 , 교시를1 증가함으로써 if문에서 연강인지 확인
                                        z=0; //처음부터 다시 for문을 실행하도록 함

                                    }
                                }
                                /**
                                 * dayOfWeek의 속성값들은 시간표의 한행이 생성되면 -1씩 감소함(최소값은 0)
                                 * 결국 이 속성값들의 의미는 앞으로 몇개의 행을 해당요일에서 <td></td>를 생략할지 알려주는 변수임
                                 * (만약 생략하지않으면 시간표가 중복생성됨)
                                */
                                dayOfWeek[key]=rowspan; //해당요일의 연강이 몇시간인지 값을 할당함

                                //해당 교시, 해당 요일에 <td> </td>를 생성
                                timeTableHtml +=    "<td class='timeTableParts lecture'rowspan='"+rowspan+"'>"
                                timeTableHtml +=        "<div>"
                                timeTableHtml +=            "<div class='lectureName' name='lecture_name'>"+ lecture_name +"</div>"
                                timeTableHtml +=            "<div class='display-none' name='lecture_id'>"+ lecture_id +"</div>"
                                timeTableHtml +=            "<div class='lectureRoom' name='building_name'>"+ lecture_room.building_name +"</div>"
                                timeTableHtml +=            "<div class='lectureRoom' name='lectureroom_num'>"+ lecture_room.lectureroom_num +"</div>"
                                timeTableHtml +=            "<div class='display-none' name='front_camera_ip'>"+ lecture_room.camera_ip.front +"</div>"
                                timeTableHtml +=            "<div class='display-none' name='back_camera_ip'>"+ lecture_room.camera_ip.back +"</div>"
                                timeTableHtml +=        "</div>"
                                timeTableHtml +=    "</td>"
                                flag++; //비어있는 <td></td>를 생성하지 않도록 플래그 변수를 1증가

                            }
                        }
                    }

                    /**
                     * flag!==1 :
                     * 이미 시간표를 생성하였다면, 비어있는 <td></td>를 생성하지 않도록함
                     *
                     * dayOfWeek[key]==0 :
                     * 표현할 연강이 없으면 , 비어있는 <td></td>를 생성하도록 함
                     *
                     * m :
                     * m은 요일을 뜻함 0:월, 1:화 ......
                     */
                    let key = dayOfWeek_eng[m];
                    if(flag!==1 && dayOfWeek[key]==0){
                        timeTableHtml +=    "<td class='timeTableParts'> </td>"
                    }
                }
                timeTableHtml += "</tr>" ;

                /**
                 * 하나의 행을 모두 생성하였으니
                 * dayOfWeek의 속성들을 1씩 모두 감소(최소값 : 0)
                 * 하나의 행에 대하여, 이 속성값을 통해 <td></td>를 중복생성 방지하기때문
                 * 만약 dayOfWeek[mon]의 값이 3 이라면, 앞으로 3개의 행이 생성될떄까지 <td></td> 생성을 생략함(강의정보가 있는 <td> 포함)
                 */
                for(let key in dayOfWeek){
                    if(dayOfWeek[key]!=0){
                        dayOfWeek[key]--;
                    }
                }

            }

            result.data = timeTableHtml;//시간표 html을 result에 할당
            callback(result);
        })
        .catch((err)=>{console.log(err);});

    },


    getScheduleProcess : (userInfo, callback)=>{
        const id = userInfo.student_id;
        var info_temp=[];
        var testList = [] ;
        var data = new Object() ;

        const queryObject = {"student_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.getLectureInfo_student(queryObject)
        .then((content)=>{
          const lecture = content.lecture;
          for(let j=0; j<lecture.length; j++){
            for(let k=0; k<lecture[j].lecture_info.length; k++){
                let lecture_id = lecture[j].lecture_id; //강의id
                let lecture_name = lecture[j].lecture_name; //강의명

                let lecture_info = lecture[j].lecture_info[k]; //강의정보
                let day = lecture_info.lecture_time.substr(0,1); // ex) 월2 -> 월  , 2
                let time = lecture_info.lecture_time.substr(1,1);

                let lecture_room = lecture_info.lectureroom; //강의장소
                let building = lecture_room.building_name+" "+lecture_room.lectureroom_num;

                if(day=="월"){
                  day=1;
                }else if(day=="화"){
                  day=2;
                }else if(day=="수"){
                  day=3;
                }else if(day=="목"){
                  day=4;
                }else if(day=="금"){
                  day=5;
                }
                info_temp.push("a"+day+","+time+","+lecture_name+","+building+","+lecture_id+"a");
              }
            }
            // console.log(info_temp);

            // var jsonData = JSON.stringify(info_temp) ;
            // console.log(jsonData);

            let result={
                STATE : "SUCCESS",
                DETAIL : info_temp

                /*
                //DETAIL : content //쿼리내용 끌고갑니다아아
                {"lecture":
                  [
                    {"lecture_name":"알고리즘","lecture_id":"1",
                    "lecture_info":[
                        {"lectureroom_id":"1","lecture_time":"목8","lectureroom":{"building_name":"실습관","lectureroom_num":"411호","camera_id":"DDIE123"}},
                        {"lectureroom_id":"1","lecture_time":"목9","lectureroom":{"building_name":"실습관","lectureroom_num":"411호","camera_id":"DDIE123"}},
                        {"lectureroom_id":"2","lecture_time":"월2","lectureroom":{"building_name":"실습관","lectureroom_num":"410호","camera_id":"DDIE120"}}
                      ]
                    },

                    {"lecture_name":"자료구조","lecture_id":"2",
                    "lecture_info":[
                      {"lectureroom_id":"2","lecture_time":"화5","lectureroom":{"building_name":"실습관","lectureroom_num":"410호","camera_id":"DDIE120"}},
                      {"lectureroom_id":"2","lecture_time":"화6","lectureroom":{"building_name":"실습관","lectureroom_num":"410호","camera_id":"DDIE120"}},
                      {"lectureroom_id":"2","lecture_time":"화7","lectureroom":{"building_name":"실습관","lectureroom_num":"410호","camera_id":"DDIE120"}}
                    ]
                  },

                    {"lecture_name":"자바스크립트","lecture_id":"3",
                    "lecture_info":[
                      {"lectureroom_id":"1","lecture_time":"목1","lectureroom":{"building_name":"실습관","lectureroom_num":"411호","camera_id":"DDIE123"}},
                      {"lectureroom_id":"1","lecture_time":"목2","lectureroom":{"building_name":"실습관","lectureroom_num":"411호","camera_id":"DDIE123"}},
                      {"lectureroom_id":"1","lecture_time":"목3","lectureroom":{"building_name":"실습관","lectureroom_num":"411호","camera_id":"DDIE123"}}
                    ]
                  }
                ]

                */
            };

            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    getAttendStateProcess : (userInfo, callback)=>{
        const id = userInfo.student_id;
        var info_temp=[], idList=[], send_temp=[];
        const queryObject = {"student_id":{"$in":[id]}}; //몽고디비 쿼리 내용

        mongoDB.getAttendState(queryObject)
        .then((content)=>{
            const attend = content.attend;

            for(let i=0; i<attend.length; i++){
              let lecture_id = attend[i].lecture_id;
              let lecture_session = attend[i].lecture_session;
              let attend_state = attend[i].attend_state;
              let lecture_name = attend[i].lecture_name;
              let attend_date = attend[i].attend_date;
              for(let j=0; j<lecture_id.length; j++){
                // info_temp.push("a"+lecture_id[j]+","+lecture_session[j]+","+attend_state[j]+","+lecture_name[j]+","+attend_date[j]+"a");
                info_temp.push({ lecture_id : lecture_id[j], lecture_session : lecture_session[j], attend_state : attend_state[j],lecture_name : lecture_name[j], attend_date: attend_date[j]});
              }
            }
            info_temp.sort(function(a, b) { // 내림차순
                return a.attend_date > b.attend_date ? -1 : a.attend_date < b.attend_date ? 1 : 0;
            });

            for(let i=0; i<info_temp.length; i++){
              let lecture_id = info_temp[i].lecture_id;
              let lecture_session = info_temp[i].lecture_session;
              let attend_state = info_temp[i].attend_state;
              let lecture_name = info_temp[i].lecture_name;
              let attend_date = info_temp[i].attend_date;
              send_temp.push("a"+lecture_id + "," + lecture_session+","+attend_state+","+lecture_name+","+attend_date+"a")
            }

            console.log("안드로이드로 보내는 로그 데이터(home): "+JSON.stringify(send_temp))

            let result={
                STATE : "SUCCESS",
                DETAIL : send_temp
            };

            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    /*
     * let content = {
     *      requestType : 안드로이드에서 보내줘야함(attendRequest , attendReRequest)
     *      attend_id : attend_id,
            student_token : student_token,
            student_id : student_id,
            attend_state : attend_state,
            lecture_id : lecture_id,
            lecture_name : lecture_name,
            lecture_session : lecture_session,
            reRequestLimit : 3*60*1000 //timestamp값으로 3분

            late : lectureInfo.late //지각처리를 고려해야하는 경우에 쓰이는 값
            attendStartTime : lectureInfo.attendStartTime;
        }
     */

    pushResponseProcess : (attendInfo , callback)=>{

        //테스트를 위한 더미 값
        // attendInfo = {
        //     requestType : "attendReRequest", //attendRequest(출석요청), attendReRequest(출석재요청:이의신청)  두종류 존재
        //     attend_id : "53",
        //     student_token : "fHE0wfUUNfM:APA91bFMTxYeK1XcJVzFwy43miBXdD-q837nBqteKdP1n1_O5u73Nkl5vqn9pIjq3X7xRYlCm2YQHfjqxXGvKHxQ0adL63pCvOHyNOpuQ1uWiCiJOc6QErazZEijaJrKz_4Qz7bzHx7W",
        //     student_id : "2014335066",
        //     attend_state : "A003",
        //     lecture_id : "3",
        //     lecture_name : "자바스크립트",
        //     lecture_session : "1",
        //     reRequestLimit : new Date().getTime() + 3*60*1000, //timestamp값으로 3분

        // requestType에 따라 없을 수도 있는 값들
        //     front_camera_ip : ......,
        //     back_camera_ip : ......,
        //     late : "10", //지각처리를 고려해야하는 경우에 쓰이는 값
        //     attendStartTime : new Date().getTime()
        // }

        const late = attendInfo.late; //지각허용시간(분)
        const requestType = attendInfo.requestType;
        const student_id = String(attendInfo.student_id);
        const attendStartTime = attendInfo.attendStartTime; //출석시작시간
        const lateLimit = attendStartTime+late*1000*60; //late 변수와 출석시간시작을 고려해 지각제한 시간을 저장(밀리세컨즈)
        const nowTime = new Date().getTime(); //현재시간
        const attend_id = String(attendInfo.attend_id);
        const lecture_session = String(attendInfo.lecture_session);
        const lecture_id = String(attendInfo.lecture_id);
        const student_token = attendInfo.student_token;
        const lecture_name = attendInfo.lecture_name;
        const reRequestLimit = attendInfo.reRequestLimit;
        const front_camera_ip = attendInfo.front_camera_ip;
        const back_camera_ip = attendInfo.back_camera_ip;

        console.log("late : ",late);
        console.log("requestType : ",requestType);
        console.log("student_id : ",student_id);
        console.log("attendStartTime : ",attendStartTime);
        console.log("lateLimit : ", lateLimit);
        console.log("nowTime : ", nowTime);
        console.log("attend_id : ", attend_id);
        console.log("lecture_session : ", lecture_session);
        console.log("lecture_id : ", lecture_id);
        console.log("student_token : ", student_token);
        console.log("lecture_name : ", lecture_name);
        console.log("reRequestLimit : ", reRequestLimit);
        console.log("front_camera_ip : ", front_camera_ip);
        console.log("back_camera_ip : ", back_camera_ip);
        /**
         * 푸시요청에는 재요청과 요청 두가지 타입이 존재함 이에 따라 세부 로직이 변경되어야함
         *
         * 1. 사진을 찍고 다찍히면 callback() ---> 즉, 사진이 다찍혔으니깐 할꺼하라고 알리는 거임
         * 2. 찍힌 사진 이용해서 얼굴비교를 하고 결과를 리턴 (이 과정에서 )
         * 3. 결과를 DB에 반영
         * 4. 결과에 따라 다른 내용을 푸시로 보내야함
         *
         *
         */
        console.log("푸시요청 테스트 -----------------------------------------")
        console.log("테스트AAA:" + requestType);
        console.log("테스트BBB:" + JSON.stringify(attendInfo));
        if(requestType ==="attendRequest"){ //출석요청인경우

            if(late){//지각처리까지해야하는 자동출석


                console.log("requestType : " + requestType);
                console.log("late : " + late);
                console.log("student_id : " + student_id);
                console.log("attendStartTime : " + attendStartTime);
                console.log("lateLimit : " + lateLimit);
                console.log("nowTime : " + nowTime);

                //결과통보(푸시알람)

                console.log("테스트999999------")
                console.log(front_camera_ip);
                console.log(back_camera_ip);
                console.log("nowTime" + nowTime);
                console.log("lateLimit" + lateLimit);
                if(nowTime < lateLimit ){   //지각이라면

                    /**
                     * callback을 통해 사진촬영이 완료됬다는 것을 알려야함 , 안드로이드쪽이랑 협의 필요
                     */
                    // callback("사진촬영을 완료함");
                    requestPhotoShoot(front_camera_ip).then((result)=>{
                        // const img = imgSource.cameraImg; //태준,지우 없는 사진임 ,스트리밍서버에서 img 받았다는 가정....
                        // const img = imgSource.groupImage2; //전부다 있는 사진임

                        const picture_name = result.picture_name;

                        if(result.STATE =="ERR"){ //사진촬영에 문제가 있었다면, 프로세스를 종료
                            callback(result);//에러에 관한내용 전달
                            return;//프로세스 종료
                        }
                        else{
                            callback({
                                STATE:"SUCCESS",
                                DETAIL : "SUCCESS_PHOTO_SHOOT",
                            }); //사진촬영로직이 끝났으니 클라이언트에게 알림

                        }
                        
                        const img= result.lecture_img;
                        findStudentFace(student_id,img).then((state)=>{
                            if(state){ //학생을 발견했다면
                                //db에서 해당학생을 지각으로 바꿔야함

                                /**
                                 * 몽고DB 쿼리 내용 :
                                 * attend_info안에 있는 객체의 내용중 attend_id 값이 일치하고
                                 * 그 객체의 attendence 배열의 객체중 lecture_session, student_id 값이 일치하는 것을 찾아서
                                 * 값을 수정하는 내용
                                 */

                                 console.log("----------test 1117-----")
                                 console.log("attend_id : ", attend_id);

                                const updateObject ={
                                    query :  {
                                        $and:[
                                            {
                                                "attend_info":{
                                                    $elemMatch : {
                                                        "attend_id" : attend_id,
                                                        "attendence":{
                                                            $elemMatch : {
                                                                "lecture_session" :lecture_session,
                                                                "student_id" : student_id
                                                            }
                                                        }
                                                    }
                                                }

                                            },

                                            {
                                                "lecture_id" : lecture_id
                                            }
                                        ]
                                    },
                                    update :  {
                                        $set:{
                                            "attend_info.$[outer].attendence.$[inner]": {
                                                "student_id" : student_id,
                                                "attend_state":"A002", //지각상태로 변경
                                                "lecture_session" :lecture_session,
                                                // "picture_path" : picture_name
                                            }
                                        }
                                    },
                                    arrayFilters : {
                                        "arrayFilters" : [
                                            {"outer.attend_id" : attend_id} ,
                                            {
                                                "inner.student_id" : student_id,
                                                "inner.lecture_session":lecture_session
                                            }
                                        ]
                                    }

                                }
                                mongoDB.updateStudentAttend(updateObject).then(()=>{
                                    //결과 푸시를 보내자, 너 지각처리됬어 ^^
                                    const to = student_token;
                                    const title = lecture_name + " 수업" + " \"결석 -> 지각\" 처리 되었습니다.";
                                    const body = "";
                                    const content = attendInfo;
                                    const clickAction = "MainActivity";

                                    fcm.requestPush(to,title,body,content,clickAction,()=>{
                                        // callback("지각처리 푸시를 보냈음");
                                        console.log(student_id + " : 결석->지각 처리")
                                    });


                                });
                            }
                            else{ //학생을 찾지 못함
                                //"너 없어, 결석이야" 라는 내용의 푸시
                                const to = student_token;
                                const title = lecture_name + " 수업" + " \"결석 -> 결석\" 처리 되었습니다.";
                                const body = "사유 : 카메라가 대상 학생을 찾지 못하였습니다.";
                                const content = attendInfo;
                                const clickAction = "AttendRequestActivity";

                                fcm.requestPush(to,title,body, content,clickAction,()=>{
                                    // callback("지각처리 푸시를 보냈음");
                                    console.log(student_id + " : 결석->결석 처리A , 학생을 찾지못함")
                                });
                            }
                        });

                    });
                    
                }
                else{ //지각시간을 지난경우
                    const to = student_token;
                    const title = lecture_name + " 수업" + " \"결석 -> 결석\" 처리 되었습니다.";
                    const body = "사유 : 이미 지각허용 시간을 초과했습니다.";
                    const content = attendInfo;
                    const clickAction = "AttendRequestActivity";

                    fcm.requestPush(to,title,body,content,clickAction,()=>{
                        // callback("지각처리 푸시를 보냈음");
                        console.log(student_id + " : 결석->결석 처리 , 지각허용시간 초과")
                    });
                    // callback("지각허용시간을 지났음 푸시를 보냈음");
                }
            }
            else{
                console.log("------오류발생---------------------");
                console.log("내용 : 서버에 와서는 안되는 요청이 도달함");
                //교수님이 반자동으로 직접 출석하는 경우 -----> 이경우는 아예 버튼이 없는 푸시알람이 학생에게 전달되기때문에 분기할수 없는 경우임
                //여기가 읽힌다면 안드로이드쪽 코드를 봐야함, 푸시에 버튼이 없어야해
            }

        }
        else if(requestType==="attendReRequest"){ /* 출석 재요청(이의신청) */
            console.log("테스트------리미트 값들-----");
            console.log("reRequestLimit : " + reRequestLimit);
            console.log("nowTime : " + nowTime);
            if(reRequestLimit > nowTime){ //재요청 제한시간보다 빨리 보냈다면
                console.log("front_camera_ip : " + front_camera_ip);
                requestPhotoShoot(front_camera_ip).then((result)=>{
                    const picture_name = result.picture_name;
                    if(result.STATE =="ERR"){ //사진촬영에 문제가 있었다면, 프로세스를 종료
                        callback(result);//에러에 관한내용 전달
                        return;//프로세스 종료
                    }
                    else{
                        callback({
                            STATE:"SUCCESS",
                            DETAIL : "SUCCESS_PHOTO_SHOOT",
                        }); //사진촬영로직이 끝났으니 클라이언트에게 알림

                    }

                    // const img = imgSource.cameraImg; //태준,지우 없는 사진임 ,스트리밍서버에서 img 받았다는 가정....
                    // const img = imgSource.groupImage2; //전부다 있는 사진임
                    const img= result.lecture_img;
                    findStudentFace(student_id,img).then((state)=>{
                        if(state){ //학생을 발견했다면
                            //db에서 해당학생을 지각으로 바꿔야함
                            const updateObject ={ //
                                query :  {
                                    $and:[
                                        {
                                            "attend_info":{
                                                $elemMatch : {
                                                    "attend_id" : attend_id,
                                                    "attendence":{
                                                        $elemMatch : {
                                                            "lecture_session" :lecture_session,
                                                            "student_id" : student_id
                                                        }
                                                    }
                                                }
                                            }

                                        },

                                        {
                                            "lecture_id" : lecture_id
                                        }
                                    ]
                                },
                                update :  {
                                    $set:{
                                        "attend_info.$[outer].attendence.$[inner]": {
                                            "student_id" : student_id,
                                            "attend_state":"A001", //출석상태로 변경
                                            "lecture_session" :lecture_session,
                                            "picture_path" : picture_name
                                        }
                                    }
                                },
                                arrayFilters : {
                                    "arrayFilters" : [
                                        {"outer.attend_id" : attend_id} ,
                                        {
                                            "inner.student_id" : student_id,
                                            "inner.lecture_session":lecture_session
                                        }
                                    ]
                                }

                            }
                            mongoDB.updateStudentAttend(updateObject).then(()=>{
                                const to = student_token;
                                const title = lecture_name + " 수업" + " \"결석 -> 출석\" 처리 되었습니다.";
                                const body = "";
                                const content = attendInfo;
                                const clickAction = "MainActivity";

                                fcm.requestPush(to,title,body, content,clickAction,()=>{
                                    console.log(student_id + " : 결석->출석 처리 , 재요청");
                                });


                            });
                        }
                        else{ //학생을 찾지 못함
                            //"너 없어, 결석이야" 라는 내용의 푸시
                            const to = student_token;
                            const title = lecture_name + " 수업" + " \"결석 -> 결석\" 처리 되었습니다.";
                            const body = "사유 : 카메라가 대상 학생을 찾지 못하였습니다.";
                            const content = attendInfo;
                            const clickAction = "AttendRequestActivity";

                            fcm.requestPush(to,title,body,content,clickAction,()=>{
                                console.log(student_id + " : 결석->결석 처리 , 학생을 찾지 못함");
                            });
                        }
                    });

                });

            }
            else{ //재요청 이후에 보냈다면
                const to = student_token;
                const title = lecture_name + " 출석재요청(이의신청)이 거부되었습니다.";
                const body = "사유 : 재요청 허용시간 초과(출석시작 후 3분)";
                const content = attendInfo;
                const clickAction = "AttendRequestActivity";

                fcm.requestPush(to,title,body, content,clickAction,()=>{
                    // callback("재요청 거부함");
                    console.log(student_id + " : 결석->결석 처리 , 재요청(이의신청)허용시간을 초과함");
                });
                //callback("너 재요청 못함 ㅎ")
            }

        }
        else{ //requestType에 예상하지 못한 값이 저장되어있음
            console.log("----에러발생---------")
            console.log("requestType 값 오류!!")
            console.log("requestType : " + requestType);
        }

    },
    getLectureVideoInfo:(userInfo, lectureInfo, callback)=>{
        const lecture_id = lectureInfo.lectureID;
        const queryObject = {"lecture_id":{"$in":[lecture_id]}}; //몽고디비 쿼리 내용
        const result ={};

        mongoDB.getLectureVideoInfo(queryObject)
        .then((docsPack)=>{

            if(docsPack.docs.length == 0 ){
                result.lectureList = [];
                callback(result);
                return;
            }

            const video = docsPack.docs[0];
            let videoInfo = video.video_info;

            videoInfo.sort(function(a,b){ //내림차순 정렬
                return parseInt(a.lecture_video_id) > parseInt(b.lecture_video_id) ? -1 : parseInt(a.lecture_video_id) < parseInt(b.lecture_video_id) ? 1 : 0;
            });

            result.lectureList = videoInfo;

            callback(result);
        })
        .catch((err)=>{ console.log(err);});

    },
    showLectureVideoProcess:(lectureInfo, callback)=>{
        const lecture_id = lectureInfo.lecture_id;
        const video_id = lectureInfo.lecture_video_id;

        // query : {"$and":[ {"attend_info":{"$elemMatch" : {"attend_id" :attendInfo.attend_info[0].attend_id } }},{"lecture_id" : attendInfo.lecture_id} ]},
        // const queryObject = {"$and":[{"video_info":{"$eleMatch":{"lecture_video_id":video_id}}},{"lecture_id":lecture_id}]}; //몽고디비 쿼리 내용
        const queryObject = {"lecture_id" : lecture_id};
        const result ={};
        mongoDB.getLectureVideoInfo(queryObject)
        .then((docsPack)=>{
            // console.log("테스트@@@@@@@@@@@@@@@@@@@@@@");
            // console.log("lecture_id : " + lecture_id );
            // console.log("video_id : "+video_id );
            const doc = docsPack.docs[0];
            const videoInfo = doc.video_info;
            // console.log(JSON.stringify(docs));


            for(let i=0; i<videoInfo.length; i++){
                const videoId = videoInfo[i].lecture_video_id ;
                if(videoId === video_id){
                    result.data = videoInfo[i];
                }
            }
            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    deleteLectureVideoProcess:(lectureInfo, callback)=>{
        const video_id = lectureInfo.video_id;
        const lecture_id = lectureInfo.lecture_id;
        const lectureName = lectureInfo.lectureName;//한글 강의명

        const path = "./resources/video/lecture/"+lectureName+"/"+video_id+".mp4";

        const updateObject = {
            query : {"$and":[ {"video_info":{$elemMatch : {"lecture_video_id" : video_id} }},{"lecture_id" : lecture_id} ]},
            update :{"$pull":{"video_info":{"lecture_video_id" : video_id} }}
        }

        mongoDB.updateLectureVideoInfo(updateObject)
        .then(()=>{
            fs.unlink(path, function(err){
                if(err) throw err;
            })
            callback();
        })
        .catch((err)=>{ console.log(err);});
    }

}






function findStudentFace(student_id, img){
    return new Promise((resolve, reject)=>{
        fs.readFile('./resources/images/student/'+student_id+'.jpg' ,function(error, data) {
            console.log('err : ' + error);
            let img1 = getBinary(data);  //학생 한명의 이미지
            let img2 = getBinary(img);// 강의실 촬영 이미지
            // let img2 = getBinary(imgSource.groupImage2);// 강의실 촬영 이미지

            let state = false;//학생이 강의실에 있는지 없는지를 나타냄
            rekognition.compareFacesByte(img1, img2,function(err, data){
                if (err) console.log(err, err.stack); // an error occurred
                else     console.log(data);           // successful response
                const sourceImageFace = data;
                const faceMatches = sourceImageFace.FaceMatches;

                for(let i=0; i<faceMatches.length; i++){
                    if(faceMatches[i].Similarity > 85.0){ //유사도가 95% 이상이라면
                        state = true;
                    }
                }
                resolve(state);
            });
        });
    })


}

function getBinary(base64Image) {
    var binaryImg = atob(base64Image); //64바이너리로 디코딩하는 함수
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }

    return ab;
}


function requestPhotoShoot(ip_){
    console.log("a")
    var ip = ip_;
    return new Promise((resolve,reject)=>{
        console.log("b")
         // var url1 = "/video",
        // var ip = lectureInfo.front_camera_ip;
        let url2 = "/video_stop";     
        let options = {
            uri: "http://"+ip+url2,
            method: 'POST',
            body:{
                // Camera:"C" //C A C-학생쪽 A-칠판쪽
            },
            json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
        };           
        console.log("c")
        request.post(options, function(err,res_,body){
            console.log("d")
            
            if(err){
                console.log("e")
                console.log(err);
            }                
            else{
                // console.log(res_);
                // console.log(body)
                // res.send(getBinary(body));
                // res.send(body);
                console.log("카메라 서버에서의 응답")
                console.log(body);
                if(body=="NO_Process" || body=="video_stop_done"){
                    console.log("카메라 요청 성공")
                    resolve({
                        STATE:"SUCCESS",
                        DETAIL:"SUCCESS_REQEUST_VIDEO_STOP",                        
                    });
                }
                else{
                    console.log("카메라 요청 실패")
                    resolve({
                        STATE:"ERR",
                        DETAIL:"FAILED_PHOTO_SHOOT",
                    })
                }
            }
        })            
    }).then((state)=>{ //
        // var url1 = "/video",
        // url2 = "/video_stop",
        if(state.STATE=="ERR"){ //앞의 요청이 실패
            return new Promise((resolve, reject)=>{
                resolve(state);
            });
        }
        else{ //앞의 요청이 성공
            
            return new Promise((resolve, reject)=>{
                let url3 = "/pic"
                let options = {
                    uri: "http://"+ip+url3,
                    method: 'POST',
                    body:{
                            // Camera:"C" //C A C-학생쪽 A-칠판쪽
                    },
                    json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
                }; 

                request.post(options, function(err,res_,body){ 
                    if(err)
                        console.log(err);
                    else{
                        // console.log(res_);
                        // console.log(body)
                        // res.send(getBinary(body));
                        // res.send(body);

                        console.log("사진저장 시작");
                        mongoDB.getSequence("attend_picture_id")
                        .then((attend_picture_id)=>{
                            fs.writeFile("./resources/images/camera/"+attend_picture_id+".jpg", body, 'base64', function(err) {
                                if(err){
                                    console.log("사진저장 실패")
                                    console.log(err);
                                }
                                else{
                                    console.log("사진저장 완료")
                                    const result = {
                                        // lecture_img : imgSource.groupImage2 //스트리밍서버에서 받았다고 치자
                                        // lecture_img : imgSource.cameraImg
                                        STATE : "SUCCESS",
                                        DETAIL : "SUCCESS_PHOTO_SHOOT",
                                        lecture_img : body, //base64 이미지
                                        picture_name : attend_picture_id // 이미지의 이름
                                    }
                                    // callback(result); //사진촬영 후 저장까지 되었다면 클라이언트에 응답
                                    resolve(result);
                                }
                                    
                            });
                        })                        

                        // const result = {
                        //     // lecture_img : imgSource.groupImage2 //스트리밍서버에서 받았다고 치자
                        //     // lecture_img : imgSource.cameraImg
                        //     STATE : "SUCCESS",
                        //     DETAIL : "SUCCESS_PHOTO_SHOOT",
                        //     lecture_img : body
                        // }
                        // // callback(result);
                        // resolve(result);
                    }
                    
                    
                })

            });
        }
        // .catch((err)=>{ console.log(err);});     
    
    })



}