var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var AWS = require("aws-sdk");
// var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  compareFacesByte : (imgByte1, imgByte2, callback)=>{//이미지 바이트로 전달하기
    AWS.config.update({
     region: "ap-northeast-2",
    });
    var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
    var params = {
      SourceImage: { /* required */
        Bytes : imgByte1
        // Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
        // S3Object: {
        //   Bucket: 'STRING_VALUE',
        //   Name: 'STRING_VALUE',
        //   Version: 'STRING_VALUE'
        // }
      },
      TargetImage: { /* required */
        Bytes : imgByte2
        // Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
        // S3Object: {
        //   Bucket: 'STRING_VALUE',
        //   Name: 'STRING_VALUE',
        //   Version: 'STRING_VALUE'
        // }
      },
      SimilarityThreshold: 0.0
    };
    // rekognition.compareFaces(params, function(err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log(data);           // successful response
    // });
    rekognition.compareFaces(params, callback);
  },


  compareFacesImg : () =>{
    AWS.config.update({
     region: "ap-northeast-2",
    });
    var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
    var params = {
     SimilarityThreshold: 90,
     SourceImage: {
      S3Object: {
       Bucket: "test-rekognition-190221",
       Name: "photo.jpg"
      }
     },
     TargetImage: {
      S3Object: {
       Bucket: "test-rekognition-190221",
       Name: "photo2.jpg"
      }
     }
    };

    rekognition.compareFaces(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(data);
    });

    app.listen(3000, function(){
      console.log("Express server has started on port 3000");
    });

  }
}

// module.exports = ()=>{ //S3버킷이용하여 이미지 전달하기
//   AWS.config.update({
//    region: "ap-northeast-2",
//   });
//   var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
//   var params = {
//    SimilarityThreshold: 90,
//    SourceImage: {
//     S3Object: {
//      Bucket: "test-rekognition-190221",
//      Name: "photo.jpg"
//     }
//    },
//    TargetImage: {
//     S3Object: {
//      Bucket: "test-rekognition-190221",
//      Name: "photo2.jpg"
//     }
//    }
//   };
//
//   rekognition.compareFaces(params, function(err, data) {
//     if (err) console.log(err, err.stack);
//     else     console.log(JSON.stringify(data));
//   });
//
//   app.listen(3000, function(){
//     console.log("Express server has started on port 3000");
//   });
//
// }
