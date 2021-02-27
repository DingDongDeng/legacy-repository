(function checkBrowser(){
    let isChrome =  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome){
        const msg =" 이 웹페이지는 크롬(Chrome)에서 가장 이상적으로 작동합니다. \n"
            +"크롬설치를 권장합니다.\n" +
            "https://www.google.com/intl/ko/chrome/";
        alert(msg);
    }
})()