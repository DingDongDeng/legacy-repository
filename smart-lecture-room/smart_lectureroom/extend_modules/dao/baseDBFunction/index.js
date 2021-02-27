var MongoClient = require('mongodb').MongoClient;
var state = require('../state/index');
var url = 'mongodb://localhost:27017';
var db;


MongoClient.connect(url, function (err, client) {
    if (err) {
       console.error('MongoDB 연결 실패', err);
       return;
    }
    db = client.db('SMART_LECTUREROOM');
    state.connect = true;
 });


function buildQueryPack(docsPack){
    const queryObject = docsPack.queryObject;
    let docsObject=docsPack.docsObject;

    return new Promise((resolve, reject)=>{
        let _queryObject =queryObject;
        const queryPack = setQueryPack(_queryObject, docsObject);
        resolve(queryPack);
     });
}

 function setQueryPack(queryObject, docsObject){ //어떤 내용으로 쿼리할지 정보를 담은 객체를 set
     return {
        queryObject : queryObject, //이번에 쿼리할 내용
        docsObject : docsObject //이전 쿼리들의 결과물(이전에 쿼리한 이력들)
    };
 }

 function setDocsPack(docs, docsObject){ //쿼리를 한 결과물을 담을 객체
     return {
         docs : docs, // 쿼리 결과물
         docsObject : docsObject, //이전 쿼리들의 결과물(이전에 쿼리한 이력들)
         queryObject : "" //다음에 쿼리할 내용
    };
 }
 function queryGuard(queryPack){
    const queryObject=queryPack.queryObject;
    let docsObject = queryPack.docsObject;
    //  var docsObject = _docsObject;

     return new Promise((resolve, reject)=>{
        const guard = db.collection('TB_GUARD');
        guard.find(queryObject).toArray(function(err,docs){

            console.log("------------------");
            console.log("queryGuardByID 쿼리한 내용");
            console.log(JSON.stringify(docs));
            console.log("사용한 쿼리문");
            console.log(JSON.stringify(queryObject));
            console.log("------------------");

            docsObject.queryGuardByID=docs;
            const docsPack = setDocsPack(docs, docsObject);
            resolve(docsPack);
        });
     });
 }

 function queryProfessor(queryPack){
    const queryObject=queryPack.queryObject;
    let docsObject = queryPack.docsObject;
    //  var docsObject = _docsObject;

     return new Promise((resolve, reject)=>{
        const professor = db.collection('TB_PROFESSOR');
        professor.find(queryObject).toArray(function(err,docs){

            console.log("------------------");
            console.log("queryProfessorByID 쿼리한 내용");
            console.log(JSON.stringify(docs));
            console.log("사용한 쿼리문");
            console.log(JSON.stringify(queryObject));
            console.log("------------------");

            docsObject.queryProfessorByID=docs;
            const docsPack = setDocsPack(docs, docsObject);
            resolve(docsPack);
        });
     });
 }
 function queryLecture(queryPack){
    const queryObject = queryPack.queryObject;
    let docsObject = queryPack.docsObject;

    return new Promise((resolve, reject)=>{
        const lecture = db.collection('TB_LECTURE');
        // lecture.find({ $or:queryObject}).toArray(function(err,docs ){
        lecture.find(queryObject).toArray(function(err,docs ){
            console.log("------------------");
            console.log("queryLectureByID 쿼리한 내용");
            console.log(JSON.stringify(docs));
            console.log("사용한 쿼리문");
            console.log(JSON.stringify(queryObject));
            console.log("------------------");

            docsObject.queryLectureByID = docs;
            const docsPack = setDocsPack(docs, docsObject);
            resolve(docsPack);
        });

    });
 }

 function queryLectureRoom(queryPack){
    const queryObject = queryPack.queryObject;
    let docsObject = queryPack.docsObject;

    return new Promise((resolve, reject)=>{
        const lectureRoom = db.collection('TB_LECTUREROOM');
        lectureRoom.find(queryObject).toArray(function(err,docs ){

            console.log("------------------");
            console.log("queryLectureRoomByID 쿼리한 내용");
            console.log(JSON.stringify(docs));
            console.log("사용한 쿼리문");
            console.log(JSON.stringify(queryObject));
            console.log("------------------");
            docsObject.queryLectureRoomByID = docs;
            const docsPack = setDocsPack(docs, docsObject);
            resolve(docsPack);
        });

    });

 }

 function queryStudent(queryPack){
     const queryObject = queryPack.queryObject;
     let docsObject = queryPack.docsObject;

     return new Promise((resolve, reject)=>{
        const student = db.collection('TB_STUDENT');
        student.find(queryObject).toArray(function(err, docs){
            console.log("------------------");
            console.log("queryStudentByID 쿼리한 내용");
            console.log(JSON.stringify(docs));
            console.log("사용한 쿼리문");
            console.log(JSON.stringify(queryObject));
            console.log("------------------");

            docsObject.queryStudentByID = docs;
            const docsPack = setDocsPack(docs, docsObject);
            resolve(docsPack);
        });
     });
 }

 function insertStudent(insertObject){
    return new Promise((resolve, reject)=>{
        const student = db.collection('TB_STUDENT');
        student.insertOne(insertObject, function(error, res){
            console.log("------------------");
            console.log("insertStudent 입력한 내용");
            console.log(JSON.stringify(insertObject));
            console.log("------------------");
            resolve();
        });
    });
 }

 function updateStudent(updateObject){
    return new Promise((resolve, reject)=>{
        const student = db.collection('TB_STUDENT');
        student.updateOne(updateObject.query, updateObject.update);
        //resolve 사용하지 않았음
    });
 }

 function queryLectureVideo(queryPack){
    const queryObject = queryPack.queryObject;
    let docsObject = queryPack.docsObject;

     return new Promise((resolve, reject)=>{
        const lectureVideo = db.collection('TB_LECTURE_VIDEO');
        lectureVideo.find(queryObject).toArray(function(err,docs){
            console.log("------------------");
            console.log("lectureVideo 쿼리한 내용");
            console.log(JSON.stringify(docs));
            console.log("사용한 쿼리문");
            console.log(JSON.stringify(queryObject));
            console.log("------------------");

            docsObject.queryLectureVideo = docs;
           const docsPack = setDocsPack(docs, docsObject);
           resolve(docsPack);
        })
     });
 }

 function updateLectureVideo(updateObject){
    return new Promise((resolve, reject)=>{
        const lectureVideo = db.collection('TB_LECTURE_VIDEO');
        lectureVideo.updateOne(updateObject.query, updateObject.update);
        resolve();
    });
 }

 function queryAttend(queryPack){
    const queryObject = queryPack.queryObject;
    let docsObject = queryPack.docsObject;

    return new Promise((resolve, reject)=>{
       const attend = db.collection('TB_ATTEND');
       attend.find(queryObject).toArray(function(err, docs){
           console.log("------------------");
           console.log("queryAttend 쿼리한 내용");
           console.log(JSON.stringify(docs));
           console.log("사용한 쿼리문");
           console.log(JSON.stringify(queryObject));
           console.log("------------------");

           docsObject.queryAttend = docs;
           const docsPack = setDocsPack(docs, docsObject);
           resolve(docsPack);
       });
    });
 }

 function insertAttend(insertObject){
     return new Promise((resolve, reject)=>{
        const attend = db.collection('TB_ATTEND');
        attend.insertOne(insertObject, function(error, res){
            console.log("------------------");
            console.log("insertAttendInfo 입력한 내용");
            console.log(JSON.stringify(insertObject));
            console.log("------------------");
            resolve();
        });
     });
 }

 function updateAttend(updateObject){
    return new Promise((resolve, reject)=>{
        const attend = db.collection('TB_ATTEND');
        attend.update(updateObject.query, updateObject.update,function(error,res){
            console.log("------------------");
            console.log("updateAttend 입력한 내용");
            console.log("쿼리 : " + JSON.stringify(updateObject.query));
            console.log("업데이트 : "+ JSON.stringify(updateObject.update));
            console.log("------------------");
            resolve();
        });
     });
 }

function updateAttendUsingArrayFilters(updateObject){
    return new Promise((resolve, reject)=>{
        const attend = db.collection('TB_ATTEND');
        attend.update(updateObject.query, updateObject.update,updateObject.arrayFilters, function(error,res){
            if(error){                
                console.log(error)
            }
            console.log("------------------");
            console.log("updateAttend 입력한 내용");
            console.log("쿼리 : " + JSON.stringify(updateObject.query));
            console.log("업데이트 : "+ JSON.stringify(updateObject.update));
            console.log("필터 : " + JSON.stringify(updateObject.arrayFilters ));
            console.log("------------------");
            resolve();
        });
     });
}

function deleteAttend(deleteObject){
    return new Promise((resolve, reject)=>{
        const attend = db.collection('TB_ATTEND');
        attend.deleteMany(deleteObject, function(error, res){
            console.log("------------------");
            console.log("deleteAttend 삭제할 내용");
            console.log("쿼리 : " + JSON.stringify(deleteObject));
            console.log("------------------");
            resolve();
        })
    });
}

function sequenceInc(name){ //시퀀스 증가 및 리턴 함수
    return new Promise((resolve, reject)=>{
        const counters = db.collection('TB_COUNTERS');
        counters.findOneAndUpdate({"name": name}, {"$inc":{"seq":1}},function(err,docs){
            const seq = docs.value.seq;
            resolve(seq);
        })

    });

}

 module.exports = {
    buildQueryPack : buildQueryPack,
    setQueryPack : setQueryPack,
    setDocsPack : setDocsPack,
    queryProfessor : queryProfessor,
    queryLecture : queryLecture,
    queryLectureRoom : queryLectureRoom,
    queryStudent : queryStudent,
    insertStudent : insertStudent,
    updateStudent : updateStudent,
    insertAttend : insertAttend,
    updateAttend : updateAttend,
    queryAttend : queryAttend,
    deleteAttend : deleteAttend,
    queryLectureVideo : queryLectureVideo,
    updateAttendUsingArrayFilters : updateAttendUsingArrayFilters,
    updateLectureVideo : updateLectureVideo,
    queryGuard : queryGuard,
    sequenceInc : sequenceInc
}
