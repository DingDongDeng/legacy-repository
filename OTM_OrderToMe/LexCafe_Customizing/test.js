var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://35.241.90.93:443/trans?alias='+encodeURIComponent('사과'),true);
xhr.responseType = 'text';
xhr.onreadystatechange = function(){ //https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/onreadystatechange
  console.log("readystate :" + xhr.readyState);
  // 0: request not initialized
  // 1: server connection established
  // 2: request received
  // 3: processing request
  // 4: request finished and response is ready
   if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        var data_varse = xhr.responseText;
        console.log("결과:" + data_varse);
        // close_customizing(sessionAttributes,e_alias,slots, callback);
      }
   }
};
xhr.send(null);
