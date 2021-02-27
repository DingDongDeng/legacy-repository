var baseDBFunction = require('../baseDBFunction'); //mongoDB 관련 커스텀함수 모듈

 module.exports = {
    findProfessor : (queryObject)=>{
        
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryProfessor(queryPack);
    },
    getLectureInfo : (queryObject) =>{
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryProfessor(queryPack)
                .then((docsPack)=>{
                    return new Promise((resolve, reject)=>{
                        const docs = docsPack.docs;
                        docsPack.queryObject = {"lecture_id":{"$in": docs[0].lecture_list}};
                        resolve(docsPack);
                    });
                })
                .then(baseDBFunction.buildQueryPack)
                .then(baseDBFunction.queryLecture)
                .then((docsPack)=>{
                    return new Promise((resolve,reject)=>{
                        let arrayForQuery = [];
                        const docs = docsPack.docs;
                        for(let i =0; i<docs.length; i++){
                            for(let k=0; k<docs[i].lecture_info.length; k++){
                                let lectureroom = docs[i].lecture_info[k].lectureroom_id;
                                arrayForQuery.push(lectureroom);
                            }
                        }
                        docsPack.queryObject ={"lectureroom_id":{"$in": arrayForQuery }};
                        resolve(docsPack);
                    });
                })
                .then(baseDBFunction.buildQueryPack)
                .then(baseDBFunction.queryLectureRoom)
                .then((docsPack)=>{ //앞서 쿼리한 데이터들을 유용한 형태로 리빌드

                    return new Promise((resolve, reject)=>{
                        let content={ //리빌드한 데이터를 담을 객체
                            professor_name : "",
                            lecture : []
                        };

                        const docs = docsPack.docs;
                        const docsObject = docsPack.docsObject;
            
                        const queryProfessorByID = docsObject.queryProfessorByID;
                        const queryLectureByID = docsObject.queryLectureByID;
                        const queryLectureRoomByID = docsObject.queryLectureRoomByID;
            
            
                        content.professor_name = queryProfessorByID[0].professor_name;
                        for(let i=0; i<queryLectureByID.length; i++){
                            let object = {
                                lecture_name: queryLectureByID[i].lecture_name,
                                lecture_id : queryLectureByID[i].lecture_id,
                                lecture_info : queryLectureByID[i].lecture_info
                            }
                            content.lecture.push(object);
                        }
            
                        for(let i=0; i<content.lecture.length; i++){ //lectureroom_id에 대해서 조인을 구현
                            for(let k=0; k< content.lecture[i].lecture_info.length; k++){
                                for(let j=0; j<queryLectureRoomByID.length; j++){
                                    if(content.lecture[i].lecture_info[k].lectureroom_id === queryLectureRoomByID[j].lectureroom_id ){
                                        content.lecture[i].lecture_info[k].lectureroom = {
                                            building_name:queryLectureRoomByID[j].building_name,
                                            lectureroom_num:queryLectureRoomByID[j].lectureroom_num,
                                            // camera_id:queryLectureRoomByID[j].camera_id,
                                            camera_ip:queryLectureRoomByID[j].camera_ip,
                                        }
                                    }
                                }
                            }
                        }
                        /*  for문 이후 결과물
                        {
                            "professor_name":"국중각",
                            "lecture":[
                                {
                                    "lecture_name":"알고리즘",
                                    "lecture_info":[
                                        {
                                            "lectureroom_id":"1",
                                            "lecture_time":"목8",
                                            "lectureroom":{
                                                "building_name":"실습관",
                                                "lectureroom_num":"411호",
                                                "camera_id":"DDIE123"
                                            }
                                        },
                                        
                                        {
                                            "lectureroom_id":"1",
                                            "lecture_time":"목9",
                                            "lectureroom":{
                                                "building_name":"실습관",
                                                "lectureroom_num":"411호",
                                                "camera_id":"DDIE123"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
            
                        */      
                        resolve(content);    
                    });
                    
                });
    },
    // getAttendInfo_studentInfo :(queryObject)=>{ //현재 출석의 학생정보를 포함한 목록을 쿼리
    //     const queryPack = baseDBFunction.setQueryPack(queryObject,{});
    //     return baseDBFunction.queryAttend(queryPack)
    //             .then((docsPack)=>{
    //                 return new Promise((resolve,reject)=>{

    //                     const arrayForQuery = docsPack.docs[0].student_list;
    //                     docsPack.queryObject ={"student_id":{"$in": arrayForQuery }};
    //                     resolve(docsPack);
    //                 });
    //             })

    // },
    getAttendInfo_studentList : (queryObject)=>{ //현재 출석의 학생목록을 쿼리
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryLecture(queryPack)
                .then((docsPack)=>{
                    return new Promise((resolve,reject)=>{

                        const arrayForQuery = docsPack.docs[0].student_list;
                        docsPack.queryObject ={"student_id":{"$in": arrayForQuery }};
                        resolve(docsPack);
                    });
                })
                .then(baseDBFunction.buildQueryPack)
                .then(baseDBFunction.queryStudent)
                .then((docsPack)=>{
                    return new Promise((resolve,reject)=>{
                        const docs = docsPack.docs; //queryStudentByID에 의한 결과물
                        const docsObject = docsPack.docsObject; // 그동안 쿼리한 결과물들
                        
                        const queryLectureByID = docsObject.queryLectureByID;
                        const queryStudentByID = docsObject.queryStudentByID;

                        let content ={
                            studentList:[]
                        }

                        const studentList = queryLectureByID[0].student_list;
                        const studentInfoList = queryStudentByID;

                        for(let n=0; n<studentList.length; n++){
                            for(let m=0; m<studentInfoList.length; m++){
                                if(studentList[n]===studentInfoList[m].student_id){
                                    const object={
                                        student_id : studentInfoList[m].student_id,
                                        // student_password : "1234",
                                        student_name : studentInfoList[m].student_name,
                                        student_picture : studentInfoList[m].student_picture,
                                        lecture_list : studentInfoList[m].lecture_list,
                                        student_token : studentInfoList[m].student_token
                                    }
                                    content.studentList.push(object);
                                    break;
                                }
                            }
                        }

                        resolve(content);

                    });
                })
    },
    getAttendInfo_attendList : (queryObject)=>{ //출석의 출결리스트를 쿼리
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryAttend(queryPack)
                .then((docsPack)=>{
                    return new Promise((resolve, reject)=>{
                        const docs = docsPack.docs;
                        const content = docs;//[] 로 비어있는 배열이 올수 있기때문에 docs[0] 사용하지않음
                        resolve(content);
                    });
                });
    },
    cntAttendInfo : (queryObject)=>{
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryAttend(queryPack)
                .then((docsPack)=>{
                    return new Promise((resolve,reject)=>{
                        // const attendInfo = docsPack.docs[0];
                        // let count=0;
                        // if(attendInfo !== undefined){
                        //     count = attendInfo.attend_info.length; 
                        // }

                        const attendInfo = docsPack.docs;
                        const count = attendInfo.length;
                        resolve(count);
                    });
                })
    },
    insertAttendInfo : (insertObject)=>{//내부로직은 update로 실행되기때문
        return baseDBFunction.insertAttend(insertObject);
    },
    updateAttendInfo : (updateObject)=>{
        return baseDBFunction.updateAttend(updateObject);
    },
    deleteAttendInfo : (deleteObject)=>{
        return baseDBFunction.deleteAttend(deleteObject);
    },
    getSequence : (name)=>{
        return baseDBFunction.sequenceInc(name);
    },
    getLectureVideoInfo : (queryObject)=>{
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryLectureVideo(queryPack);
    },

    updateLectureVideoInfo :(updateObject)=>{
        return baseDBFunction.updateLectureVideo(updateObject);
    },
    getLectureRoomInfo : (queryObject)=>{
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryLectureRoom(queryPack);
    },
 }

