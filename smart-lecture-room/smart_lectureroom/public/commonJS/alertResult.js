

function alertResult(errName, errContent, data){
    if(targetUser == "professor"){ //targetUser는 baseJS.ejs에 정의되어있음, 현재 프로세스의 대상이 명시되어있음
        alertProfessor(errName, errContent, data);
    }
    if(targetUser =="security"){
        alertSecurity(errName, errContent, data);
    }
    if(targetUser =="student"){
        alertStudent(errName, errContent, data);
    }
    

}

function alertProfessor(errName, errContent, data){
    console.log("---------------------------");
    console.log("alertProfessor 작동");
    console.log("errName : " + errName);
    console.log("errContent : " + errContent);
    console.log("---------------------------");

    const path = "/professor";

    if(errName=="ERR"){
        switch (errContent) {
            case "EMPTY_ID" :
                alert("아이디를 입력해주세요!");
                break;
            case "EMPTY_PASSWORD" :
                alert("비밀번호를 입력해주세요!");
                break;
            case "NOT_FOUND_MAIL":
                alert("회원가입 된 메일이 아닙니다.");
                break;
            case "NOT_FOUND_ID":
                alert("회원가입 된 아이디가 아닙니다.");
                break;                
            case "NOT_CORRECT_PASSWORD":
                alert("비밀번호가 일치하지 않습니다.");
                break;
            case  "FAILED_PHOTO_SHOOT":
                alert("사진촬영에 실패하였습니다.");
                break;
            case "NOT_FOUND_ANY_FACE":
                alert("사진에서 학생을 아무도 찾지못했습니다.");
                break;
            case "TEST" :
                alert("테스트 실패");
                break;
            
            default:
                alert("정의되지 않은 상태입니다.(ERR)");
                break;
        }

    }
    if(errName=="SUCCESS"){
        switch (errContent) {
            case "SUCCESS_LOGIN":
                alert("로그인 성공!");
                window.location.href = path+"/timeTable";
                break;
            case "SUCCESS_EXISTING_SAVE_ATTENDINFO":
                break;
            case "SUCCESS_FIRST_SAVE_ATTENDINFO":
            case "SUCCESS_NEW_SAVE_ATTENDINFO" :
                break;
            case "SUCCESS_SHOW_ATTENDINFO":
                break;
            case "SUCCESS_DELETE_ATTEND":
                break;
            case "SUCCESS_PHOTO_SHOOT":
                alert("사진촬영이 완료되었습니다!");
                break;
            case "SUCCESS_SHOW_LECTURE_VIDEO":
                break;
            case "SUCCESS_PUSH_REQUEST":
                break;
            case "SUCCESS_DELETE_LECTURE_VIDEO":
                alert("삭제 완료!");
                break;
            case "SUCCESS_AUTO_ATTENDENCE":
                break;
            case "SUCCESS_GET_VIDEO_SEQ":
                break;
            case "SUCCESS_SAVE_VIDEO":
                break;
            case "TEST":
                alert("테스트 성공");
                break;
            default:
                alert("정의되지 않은 상태입니다.(SUCCESS)");
                break;
        }
    }
}

function alertSecurity(errName, errContent, data){

    const path ="/security";

    if(errName =="ERR"){
        switch (errContent) {
            case "EMPTY_ID" :
                alert("아이디를 입력해주세요!");
                break;
            case "EMPTY_PASSWORD" :
                alert("비밀번호를 입력해주세요!");
                break;
            case "NOT_FOUND_MAIL":
                alert("회원가입 된 메일이 아닙니다.");
                break;
            case "NOT_FOUND_ID":
                alert("회원가입 된 아이디가 아닙니다.");
                break;                
            case "NOT_CORRECT_PASSWORD":
                alert("비밀번호가 일치하지 않습니다.");
                break;
            case "TEST" :
                alert("테스트 실패");
                break;
            default:
                alert("정의되지 않은 상태입니다.(ERR)");
                break;
        }
    }
    if(errName =="SUCCESS"){
        switch (errContent) {
            case "SUCCESS_LOGIN":
                alert("로그인 성공!");
                window.location.href = path+"/main";
                break;
            case "TEST":
                alert("테스트 성공");
                break;
            default:
                alert("정의되지 않은 상태입니다.(SUCCESS)");
                break;
        }
    }
}

function alertStudent(errName, errContent, data){
    console.log("---------------------------");
    console.log("alertStudent 작동");
    console.log("errName : " + errName);
    console.log("errContent : " + errContent);
    console.log("---------------------------");

    const path = "/student";

    if(errName=="ERR"){
        switch (errContent) {
            case "EMPTY_ID" :
                alert("아이디를 입력해주세요!");
                break;
            case "EMPTY_PASSWORD" :
                alert("비밀번호를 입력해주세요!");
                break;
            case "NOT_FOUND_MAIL":
                alert("회원가입 된 메일이 아닙니다.");
                break;
            case "NOT_FOUND_ID":
                alert("회원가입 된 아이디가 아닙니다.");
                break;                
            case "NOT_CORRECT_PASSWORD":
                alert("비밀번호가 일치하지 않습니다.");
                break;
            case "TEST" :
                alert("테스트 실패");
                break;
            default:
                alert("정의되지 않은 상태입니다.(ERR)");
                break;
        }

    }
    if(errName=="SUCCESS"){
        switch (errContent) {
            case "SUCCESS_LOGIN":
                alert("로그인 성공!");
                window.location.href = path+"/timeTable";
                break;

            case "SUCCESS_SHOW_LECTURE_VIDEO":
                break;
            case "SUCCESS_DELETE_LECTURE_VIDEO":
                alert("삭제 완료!");
                break;            
            
            case "TEST":
                alert("테스트 성공");
                break;
            default:
                alert("정의되지 않은 상태입니다.(SUCCESS)");
                break;
        }
    }
}