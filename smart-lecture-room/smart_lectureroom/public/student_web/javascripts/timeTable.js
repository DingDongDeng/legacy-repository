$(function(){
    timeTableAddEvent();
    setTimeTableColor();
});
function setTimeTableColor(){
    const colors = ["#64c4ed","#4f81c7","#4ab8b8","#1b3764","#efa35c"];
    const tableParts =$(".timeTablePage .timeTable .lecture >div"); //강의가 존재하는 시간표칸들

   
    tableParts.each(function(index,item){
        const color = colors[index%5];
        const tablePart = $(item);
        const id = tablePart.find("div[name=lecture_id]").text().trim();
        tablePart.css("background-color",color);
        console.log("ㅎㅎ");
        tableParts.each(function(index,item){
            if($(item).find("div[name=lecture_id]").text().trim() == id){
                $(item).css("background-color",color);
            }            
        })

        
    })
}
function timeTableAddEvent(){
    const lectureArray = $(".timeTablePage .timeTable .lecture");

    lectureArray.each(function(index, item){
        const lecture = $(item);
        lecture.on("click",function(){
            const lectureID=lecture.find("div[name=lecture_id]").text().trim();
            const lectureName=lecture.find("div[name=lecture_name]").text().trim();
            const buildingName=lecture.find("div[name=building_name]").text().trim();
            const lectureRoomNum=lecture.find("div[name=lectureroom_num]").text().trim();
            const front_camera_ip=lecture.find("div[name=front_camera_ip]").text().trim();
            const back_camera_ip=lecture.find("div[name=back_camera_ip]").text().trim();

            console.log(lectureID);
            console.log(lectureName);
            console.log(buildingName);
            console.log(lectureRoomNum);

            // const data ={
            //     lectureName : lectureName,
            //     buildingName : buildingName,
            //     lectureRoomNum : lectureRoomNum
            // }

            /**
             * var processType 변수를 참조해서
             * 강의관리에 대한 분기인지, 출석관리에 대한 분기인지 확인할 수 있도록하자
             * 
             * if(processType="강의관리")
             *   window.location.href="......."
             * if(processType="출석관리")
             *   window.location.href="......."
             */

            // if(processType==="attendManagement"){ //출석관리 버튼을 누른뒤 시간표의 수업을 선택
            //     window.location.href="/"+targetUser+"/attend/"+lectureName+"/"+lectureID;
            // }
            if(processType==="lectureVideoinquiry"){//강의관리 버튼을 누른뒤 시간표의 수업을 선택
                window.location.href="/"+targetUser+"/lecture/"+lectureName+"/"+lectureID+"/"+front_camera_ip+"/"+back_camera_ip+"/"+buildingName+"/"+lectureRoomNum;
            }
            
        });
    });
}
