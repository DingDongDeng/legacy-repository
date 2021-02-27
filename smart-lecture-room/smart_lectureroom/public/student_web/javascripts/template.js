var processType="";
const url = window.location.href;
const urlSplit = url.split("/");
const pageName = urlSplit[urlSplit.length-1]

const topBar = $(".template .topBar");
const logout = topBar.find("input[name=logout]");
const process = topBar.find(".process");
const lectureVideoinquiry = process.find("input[name=lectureVideoinquiry]");
// const attendManagement = process.find("input[name=attendManagement]");
// const lectureManagement = process.find("input[name=lectureManagement]");

$(function(){
    
});



logout.on("click", ()=>{
    window.location.href="/"+targetUser+"/logout";
});
lectureVideoinquiry.on("click",function(){
    if(pageName !=="timeTable"){
        window.location.href="/"+targetUser+"/timeTable";
    }
    else{
        processType="lectureVideoinquiry";
        process.find("input[type=button]").each(function(index,item){
            $(this).css("background-color","white");
        });
        $(this).css("background-color","silver");
    }
})

// attendManagement.on("click",function(){ //출석관리 버튼
    // if(pageName !=="timeTable"){
    //     window.location.href="/"+targetUser+"/timeTable";
    // }
    // else{
    //     processType="attendManagement";
    //     process.find("input[type=button]").each(function(index,item){
    //         $(this).css("background-color","white");
    //     });
    //     $(this).css("background-color","silver");
    // }
    
// })

// lectureManagement.on("click",function(){//강의관리 버튼
//     if(pageName !=="timeTable"){
//         window.location.href="/"+targetUser+"/timeTable";
//     }
//     else{
//         processType="lectureManagement";
//         process.find("input[type=button]").each(function(index,item){
//             $(this).css("background-color","white");
//         });
//         $(this).css("background-color","silver");
//     }
    
// })