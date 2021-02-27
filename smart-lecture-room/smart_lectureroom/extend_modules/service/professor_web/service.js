
var mongoDB = require('../../dao/professor_web/mongoDB');
var rekognition = require('../../api/aws_rekognition/compareImg');
var fcm = require('../../api/fcm/requestPush');
var imgSource = require('./imgSource');
var atob = require('atob');
var fs = require('fs');
var request = require('request');

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

        const queryObject = {"professor_id":{"$in":[id]}}; //몽고디비 쿼리 내용
        mongoDB.findProfessor(queryObject)
        .then((docsPack)=>{
            const docs = docsPack.docs;
            const amount = docs.length;
            let result={
                STATE : "SUCCESS",
                DETAIL : "SUCCESS_LOGIN"
            };
            if(amount===1){ //회원가입된 아이디
                const professor = docs[0];
                if(professor.professor_pw!==pw){ //비밀번호가 일치하지않음
                    result.STATE="ERR";
                    result.DETAIL="NOT_CORRECT_PASSWORD";
                }
                else{ //아이디와 비밀번호 모두 일치
                    result.data ={
                        id : professor.professor_id, //로그인 id 저장
                        name : professor.professor_name //로그인 성명 저장
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


    buildTimeTable : (userInfo, callback)=>{
        const id = userInfo.id;
        const queryObject = {"professor_id":{"$in":[id]}}; //몽고디비 쿼리 내용
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
                            // console.log("테스트입니다아아아아@@@@")
                            // console.log(JSON.stringify(lecture_room));
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

    getAttendInfo :(userInfo, lectureInfo, callback)=>{
        const lectureID = lectureInfo.lectureID;
        let queryObject = {"lecture_id":{"$in":[lectureID]}}; //몽고디비 쿼리 내용
        let result= {};

        mongoDB.getAttendInfo_studentList(queryObject)
        .then((content)=>{
            return new Promise((resolve, reject)=>{
                const studentList = content.studentList;
                studentList.sort(function(a,b){ //오름차순 정렬
                    return a.student_id < b.student_id ? -1 : a.student_id > b.student_id ? 1 : 0;
                })
                result.studentList = studentList;
                queryObject = {"lecture_id":lectureID};
                resolve(queryObject);//mongoDB.getAttendInfo_attendList()로 전달
            });
        })
        .then(mongoDB.getAttendInfo_attendList)
        .then((content)=>{
            result.attendList = [];
            if( content[0] !== undefined){

                let attend_info = content[0].attend_info
                attend_info.sort(function(a,b){ //내림차순 정렬
                    return parseInt(a.attend_id) > parseInt(b.attend_id) ? -1 : parseInt(a.attend_id) < parseInt(b.attend_id) ? 1 : 0;
                });
                result.attendList = attend_info;
            }
            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    saveAttendProcess : (attendInfo, callback)=>{
        let result = {};
        if(attendInfo.attend_info[0].attend_id === undefined){ //attend_id가 없는경우, 즉 출결 리스트를 생성하는 경우

            const queryObject = {"lecture_id":{"$in":[attendInfo.lecture_id]}}; //몽고디비 쿼리 내용
            const seqName = "attend_id";

            /**
             * 제일 위에 getCntAttend 이거 전에 쓰던거 오게하고서
             * 제일 위에 if문은 예전처럼 작동하게 만들고
             *
             * 그 아래 else 부문을 sequnce 함수를 이용해서 조작해야 로직이 완성되는듯
             */
            mongoDB.cntAttendInfo(queryObject)
            .then((count)=>{
                // const cntAttendInfo = String(count);
                // attendInfo.attend_info[0].attend_id =  cntAttendInfo;
                // attendInfo.attend_info[0].attend_id =  "0";
                if(count===0){ //첫 insert
                    mongoDB.getSequence("attend_id")
                    .then((attend_id)=>{
                        return new Promise((resolve,reject)=>{
                            attendInfo.attend_info[0].attend_id = String(attend_id);
                            resolve(attendInfo);
                        });
                    })
                    .then(mongoDB.insertAttendInfo)
                    .then(()=>{
                        result.STATE = "SUCCESS";
                        result.DETAIL = "SUCCESS_FIRST_SAVE_ATTENDINFO";
                        result.data = attendInfo.attend_info[0];
                        callback(result);
                    });

                }
                else{
                    console.log("기존꺼에 입력");
                    mongoDB.getSequence("attend_id")
                    .then((attend_id)=>{
                        attendInfo.attend_info[0].attend_id =  String(attend_id);
                        const updateObject = {
                            query : {"lecture_id" : attendInfo.lecture_id},
                            update :{"$push" :{"attend_info" : attendInfo.attend_info[0]}}
                        }

                        mongoDB.updateAttendInfo(updateObject)
                        .then(()=>{
                            result.STATE = "SUCCESS";
                            result.DETAIL = "SUCCESS_NEW_SAVE_ATTENDINFO";
                            result.data = attendInfo.attend_info[0];
                            callback(result);
                        })
                    })
                }
            })
            .catch((err)=>{console.log(err);});
        }

        else{ //기존의 리스트를 수정하는 경우(attend_id가 존재하는 경우)
            const updateObject = {
                query : {"$and":[ {"attend_info":{"$elemMatch" : {"attend_id" :attendInfo.attend_info[0].attend_id } }},{"lecture_id" : attendInfo.lecture_id} ]},
                update :{"$set":{"attend_info.$.attendence": attendInfo.attend_info[0].attendence  }}
            }

            mongoDB.updateAttendInfo(updateObject)
            .then(()=>{
                result.STATE = "SUCCESS";
                result.DETAIL = "SUCCESS_EXISTING_SAVE_ATTENDINFO";
                callback(result);
            })
        }

    },

    showAttendProcess : (attendInfo, callback)=>{
        let result = {};
        const lecture_id = attendInfo.lecture_id;
        const attend_id = attendInfo.attend_id;
        const queryObject = {"lecture_id" : lecture_id}
        mongoDB.getAttendInfo_attendList(queryObject)
        .then((content)=>{
            return new Promise((resolve,reject)=>{
                const attendInfo = content[0].attend_info;
                let attendence;
                for(let i=0; i<attendInfo.length ; i++){
                    if(attendInfo[i].attend_id == attend_id){
                        attendence = attendInfo[i].attendence;
                        break;
                    }
                }
                result.data = attendence;
                resolve(queryObject)
            });
        })
        .then(mongoDB.getAttendInfo_studentList)
        .then((content)=>{
            const studentList = content.studentList;
            let attendence = result.data;

            for(let n=0; n<studentList.length; n++){
                for(let m=0; m<attendence.length; m++){
                    if(studentList[n].student_id === attendence[m].student_id){
                        attendence[m].student_name = studentList[n].student_name;
                        attendence[m].student_picture = studentList[n].student_picture;
                    }
                }
            }

            attendence.sort(function(a,b){ //오름차순 정렬
                return a.student_id < b.student_id ? -1 : a.student_id > b.student_id ? 1 : 0;
            })

            result.STATE = "SUCCESS";
            result.DETAIL = "SUCCESS_SHOW_ATTENDINFO";
            result.data = attendence;
            callback(result);
        })
        .catch((err)=>{console.log(err);});
    },

    deleteAttendProcess : (attendInfo , callback)=>{
        const attend_id = attendInfo.attend_id;
        const lecture_id = attendInfo.lecture_id;
        // mongoDB.deleteAttendInfo({"attend_id" : attend_id})

        // mongoDB.deleteAttendInfo({
        //     "$and":[ {"attend_info":{$elemMatch : {"attend_id" : attend_id} }},{"lecture_id" : lecture_id} ]
        // })

        /**
         *
         * 삭제한 항목외의 다른 항목id값들을 모두 변경해줘야하고(아니지 꼭 그럴필요는 없지.....)
         * 원하는 항목만 삭제되도록 올바른 쿼리가 필요함 <====이게안되네
         */
        const updateObject = {
            query : {"$and":[ {"attend_info":{$elemMatch : {"attend_id" : attend_id} }},{"lecture_id" : lecture_id} ]},
            update :{"$pull":{"attend_info":{"attend_id" : attend_id} }}
        }


        mongoDB.updateAttendInfo(updateObject)
        .then(()=>{
            callback();
        })
        .catch((err)=>{ console.log(err);});


    },


    autoAttendenceProcess: (attendInfo, callback)=>{

        let queryObject = {"lecture_id":{"$in":[attendInfo.lecture_id]}}; //몽고디비 쿼리 내용
        mongoDB.getAttendInfo_studentList(queryObject)
        .then((content)=>{
            const studentList = content.studentList;  //db에서 읽어온 이 강의를 수강하는 모든 학생들의 정보
            const issueStudentList = attendInfo.studentList;//출석체크를 자동으로 해야하는 학생들의 리스트
            const lecture_img = attendInfo.lecture_img;
            let rekognitionStudentList = [];
            for(let i=0; i<studentList.length; i++ ){
                for(let j=0; j<issueStudentList.length; j++){
                    if(studentList[i].student_id === issueStudentList[j]){
                        rekognitionStudentList.push(studentList[i]);
                    }
                }
            }

            try{
                let results =[];
                recursiveRekognition(rekognitionStudentList, 0,lecture_img ,callback, results);
            }
            catch(e){
                console.log(e);
            }

        })
    },

    photoShootProcess :(lectureInfo, callback) =>{ //사진 촬영을 요청하는 프로세스
        //카메라의 아이피가 담겨있음 lectureInfo
        console.log("photoShootProcess 로그 ----");
        console.log(JSON.stringify(lectureInfo));
        //------------------------테스트용----------
        // try {
        //     const result = {
            
        //         STATE : "SUCCESS",
        //         DETAIL : "SUCCESS_PHOTO_SHOOT",
        //         // lecture_img : imgSource.groupImage2, //스트리밍서버에서 받았다고 치자
        //         // lecture_img : imgSource.cameraImg,
        //         lecture_img : imgSource.forTestImg,
        //         picture_name : "123" // 이미지의 이름
        //     }
        //     callback(result); //사진촬영 후 저장까지 되었다면 클라이언트에 응답
        // } catch (error) {
        //     console.log(error);
        // }
        

        //------------------------라즈베리와 상호작용----------------------
        // var url1 = "/video",
        var ip = lectureInfo.front_camera_ip;
        // var ip ="http://192.168.43.171";
        // var port = ":8080";
        new Promise((resolve,reject)=>{
            let url2 = "/video_stop";
            // url3 = "/pic"

            let options = {
                uri: "http://"+ip+url2,
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
                    console.log("카메라 서버에서의 응답")
                    console.log(body);
                    if(body=="NO_Process" || body=="video_stop_done"){
                        resolve();
                    }
                    else{
                        callback({
                            STATE:"ERR",
                            DETAIL:"FAILED_PHOTO_SHOOT",
                        })
                    }
                }
                
            })            
        }).then(()=>{ //
          

  
          // var url1 = "/video",
          // url2 = "/video_stop",
          var url3 = "/pic"
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
                                callback(result); //사진촬영 후 저장까지 되었다면 클라이언트에 응답
                            }
                                
                        });
                    })
                    
                }
            
              }) 
          })
          .catch((err)=>{ console.log(err);});
        
//------------------------------------
    },


    pushRequestProcess: (attendInfo, callback)=>{
        try{
/*
let attendInfo = { //자동출석결과 (어던 학생이 결석이고 어떤 학생이 출석인지 등)
                lectureInfo : {
                    attend_id : topAttend,
                    lecture_id : lectureID,
                    lecture_name : lectureName,
                    lecture_session : lectureSession
                },
                issueList :issueList,
                normalList :normalList
            };

            const temp ={
                    student_id : student_id,
                    student_name : student_name,
                    attend_state : attend_state,
                    student_token : student_token
                }

*/
            const issueList = attendInfo.issueList;
            const normalList = attendInfo.normalList;
            const lectureInfo = attendInfo.lectureInfo;

            if(lectureInfo.late){ //late속성이 존재한다면
                lectureInfo.attendStartTime = new Date().getTime();
                 //안드로이드에서 사용하기 쉽게 현재시간에 대한 Timestamp 값을 저장
                 //1000*late 값을 attendStartTime변수와 적절히 비교하여 지각자인지 결석자인지 확인
            }
            console.log("###############이슈리스트######");
            console.log(JSON.stringify(issueList));
            recursiveRequestPush(issueList,0,lectureInfo,()=>{
                console.log("이슈리스트 푸시요청 완료");
            });
            console.log("###############노멀리스트######");
            console.log(JSON.stringify(normalList));
            recursiveRequestPush(normalList,0,lectureInfo,()=>{
                console.log("노멀리스트 푸시요청 완료");
            });

            callback();
        }
        catch(e){
            console.log(e);
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
        const queryObject = {"lecture_id" : String(lecture_id)};
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

        const path = "./resources/video/lecture/"+parseLectureName(lectureName)+"/"+video_id+".mp4";
     
        const updateObject = {
            query : {"$and":[ {"video_info":{$elemMatch : {"lecture_video_id" : parseInt(video_id)} }},{"lecture_id" : String(lecture_id)} ]},
            update :{"$pull":{"video_info":{"lecture_video_id" : parseInt(video_id)} }}
        }

        console.log("TEST");
        console.log(updateObject);
        console.log(JSON.stringify(updateObject));

        mongoDB.updateLectureVideoInfo(updateObject)
        .then(()=>{
            fs.unlink(path, function(err){
                if(err) throw err;
            })
            callback();
        })
        .catch((err)=>{ console.log(err);});        
    },

    getVideoSeqProcess : (callback)=>{
        mongoDB.getSequence("lecture_video_id")
        .then((seq)=>{
            callback(seq);
        });
    },

    saveLectureVideoProcess : (videoInfo, callback)=>{
        const updateObject = {
            query : {"lecture_id" : videoInfo.lecture_id},
            update :{"$push" :{"video_info" : videoInfo.video_info[0]}}
        }
        console.log("테스트@@@@-------");
        console.log(JSON.stringify(updateObject));
        mongoDB.updateLectureVideoInfo(updateObject)
        .then(()=>{
            console.log("테스트###-------");
            callback();
        })
    }

}


function recursiveRequestPush(studentList, n, lectureInfo,callback){
    if(studentList.length > n){
        const student = studentList[n];
        const student_id = student.student_id;
        const student_token = student.student_token;
        const attend_state = student.attend_state;
        const lecture_id = lectureInfo.lecture_id;
        const lecture_name = lectureInfo.lecture_name;
        const lecture_session = lectureInfo.lecture_session;
        const attend_id = lectureInfo.attend_id;

        let clickAction = "MainActivity";

        const body ="";
        let content = {
            attend_id : attend_id,
            student_token : student_token,
            student_id : student_id,
            attend_state : attend_state,
            lecture_id : lecture_id,
            lecture_name : lecture_name,
            lecture_session : lecture_session,
            reRequestLimit : lectureInfo.attendStartTime + 3*60*1000 //timestamp값으로 요청시간 + 3분
        }
        if(lectureInfo.late){ //지각처리까지 고려해야하는 경우, late 값을 content에 저장
            content.late = lectureInfo.late;
            content.attendStartTime = lectureInfo.attendStartTime;
            content.front_camera_ip = lectureInfo.front_camera_ip;
            content.back_camera_ip = lectureInfo.back_camera_ip;
            clickAction = "AttendRequestActivity";
        }

        console.log("테스트@@@@!@#")
        console.log("attend_id : " + attend_id);
        console.log("late : " + content.late);
        console.log("attendStartTime: " + content.attendStartTime);
        let title=""; //모바일 푸시에 적힐 제목

        console.log(n+"번째 푸시 요청");
        console.log("token : " + student_token);
        console.log("lecture_name : " + lecture_name);
        if(attend_state ==="A001"){
            title = lecture_name + " 수업" + " \"출석\" 처리 되었습니다.";
            clickAction = "MainActivity";
        }
            
        if(attend_state ==="A002")
            title = lecture_name + " 수업" + " \"지각\" 처리 되었습니다.";
        if(attend_state ==="A003")
            title = lecture_name + " 수업" + " \"결석\" 처리 되었습니다.";

        if(student_token ==null || student_token==""){ //모바일 앱을 사용하지않음
            recursiveRequestPush(studentList, n+1, lectureInfo,callback);
        }
        else{ //모바일 앱을 사용중
            fcm.requestPush(student_token,title,body,content,clickAction,function(err, response){
                console.log("학번 : " + student_id);
                console.log("n : " + n);
                if (err) {
                    console.error('메시지 발송 실패');
                    console.error(err);
                    // return;
                }
                else{
                    console.log('메시지 발송 성공');
                    console.log(response);
                }            
                recursiveRequestPush(studentList, n+1, lectureInfo,callback);
            } );
        }
    }
    else{
        callback();
    }
}
function recursiveRekognition(studentList, n,lecture_img, callback, results){ //resources 폴더에서 사진을 읽어와 연속해서 비교하는 함수
    //studentList : 학생들의 정보가 담겨있는 배열(사진이름 포함)
    //n : 위 배열의 몇번째부터 연속 비교할 것인지
    //callback : 비교 로직이 모두 끝난후에 실행할 마지막 로직
    
    if(studentList.length > n){
        console.log("-------"+(n+1)+"회차 rekognition API 얼굴비교----------------------------")
        console.log("student_id :" + studentList[n].student_id);
        const student = studentList[n];
        const student_picture = student.student_picture;
        fs.readFile('./resources/images/student/'+student_picture ,function(error, data) {
            if(error) {
                console.log('err : ' + error);
            }
            else{
                let img1 = getBinary(data);  //학생 한명의 이미지
                let img2 = getBinary(lecture_img);// 강의실 촬영 이미지
                // let img2 = getBinary(imgSource.groupImage2);// 강의실 촬영 이미지
                rekognition.compareFacesByte(img1, img2,function(err, data){
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        console.log("rekognition 에러발생")
                        callback({
                            STATE : "ERR",
                            DETAIL :  "NOT_FOUND_ANY_FACE",
                            data : null
                        });
                        // console.log(lecture_img);
                    }
                    else     {
                        
                        const sourceImageFace = data;
                        const faceMatches = sourceImageFace.FaceMatches;
                        let attend_state;
                        for(let i=0; i<faceMatches.length; i++){
                            if(faceMatches[i].Similarity > 85.0){ //유사도가 95% 이상이라면
                                attend_state = "A001";                                                                
                                console.log("Confidence : " + data.SourceImageFace.Confidence )
                                console.log("Similarity : " + data.FaceMatches[i].Similarity)       
                                console.log("result : 출석" )
                            }
                        }
                        if(attend_state !== "A001"){
                            attend_state = "A003";                            
                            console.log("result : 결석" )
                            console.log("reason : " + "촬영사진에서 학생을 발견하지 못함")
                        }
                            
        
                        const result ={
                            student_id : student.student_id,
                            attend_state : attend_state
                        }
                        results.push(result);
                                         
                        // console.log(data);           // successful response
                        recursiveRekognition(studentList, n+1,lecture_img, callback, results)                        
                    }
                    //---
                    // { SourceImageFace:{ 
                    //         BoundingBox:{ 
                    //             Width: 0.4319300651550293,
                    //             Height: 0.3191428482532501,
                    //             Left: 0.012893791310489178,
                    //             Top: 0.12301681190729141 
                    //         },
                    //       Confidence: 100 
                    //     },
                    //    FaceMatches:
                    //     [ 
                    //         { Similarity: 99.08604431152344, Face: [Object] },
                    //         { Similarity: 25.963289260864258, Face: [Object] } 
                    //     ],
                    //    UnmatchedFaces: [] 
                    // }

//----
                });                
            }
            
        });
    }
    else{
        console.log("--------------------------------------")
        console.log(JSON.stringify(results));
        callback({
            STATE:"SUCCESS",
            DETAIL:"SUCCESS_AUTO_ATTENDENCE",
            data : results
        });
    }
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


function parseLectureName(lectureName){
    let name;
    if(lectureName =="자바스크립트")
        return "javascript";
    if(lectureName =="알고리즘")
        return "algorithm";
    if(lectureName =="자료구조")
        return "datastructure";
}