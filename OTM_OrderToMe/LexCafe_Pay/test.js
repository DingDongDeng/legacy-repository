var AWS = require("aws-sdk");
const _ = require('lodash');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
    TableName: "TwosomeTable",
    ProjectionExpression: "ename,price",
    FilterExpression: "contains(#ename, :ename) ",
    ExpressionAttributeNames: {
        "#ename": "ename",
    },
    ExpressionAttributeValues: {

         ":ename": "choco"
    }
};

console.log("Scanning TwosomeTable.");
docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        //console.log(_.isEmpty(data.Items));
        data.Items.forEach(function(content) {
           console.log(
                content.ename + ": "+ content.price);
        });

        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}
// var temp =[];
// console.log(temp==[]);
