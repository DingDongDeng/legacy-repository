var fs = require('fs');


let test = fs.writeFile("./resources/video/lecture/mg.txt",'' ,'utf8',(err)=>{ //1.파일을 만든다.쓰기전용 './test.mpg'
    if(err){
        console.log(err);
    }
    console.log('done')
    // console.log("Recording Start")
})