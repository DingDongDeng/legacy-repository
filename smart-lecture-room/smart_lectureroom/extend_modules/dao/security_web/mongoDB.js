var baseDBFunction = require('../baseDBFunction'); //mongoDB 관련 커스텀함수 모듈

 module.exports = {
    findGuard : (queryObject)=>{
        
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryGuard(queryPack);
    },

    getLectureRoomInfo : (queryObject)=>{
        const queryPack = baseDBFunction.setQueryPack(queryObject,{});
        return baseDBFunction.queryLectureRoom(queryPack);
    },


}