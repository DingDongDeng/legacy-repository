const id = $(".loginPage .input input[name=id]"); //로그인 아이디
const pw = $(".loginPage .input input[name=pw]"); //로그인 패스워드
const login =$(".loginPage .buttons input[name=login]"); //로그인 버튼

login.on("click",()=>{
    const data = {
        id : id.val().trim(),
        pw: pw.val().trim()
    };

    ajax("post","/loginProcess",data);
});