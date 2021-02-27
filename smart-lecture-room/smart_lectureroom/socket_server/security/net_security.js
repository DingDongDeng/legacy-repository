// var net = require('net');
// var mongoDB = require('../../extend_modules/dao/security_web/mongoDB');
// var clientList = [];
// // function createClientList(){
// //     const queryObject ={};
// //     mongoDB.getLectureRoomInfo(queryObject)
// //     .then((docsPack)=>{
        
        
// //         return new Promise((resolve, reject)=>{
// //             let clientList = [];

// //             const lectureRoomList = docsPack.docs;
// //             for(let i=0; i< lectureRoomList.length; i++){
// //                 const lectureRoom = lectureRoomList[i];
// //                 const ip = lectureRoom.camera_ip.front.split(':')[0];//DB에 저장된 포트 제거
// //                 clientList.push(createClient(ip));
// //             }
// //             resolve(clientList);
// //         });
        
// //     })
// // }
// setTimeout(()=>{
//     mongoDB.getLectureRoomInfo({}).then((docsPack)=>{
//         const lectureRoomList = docsPack.docs;
//         for(let i=0; i< lectureRoomList.length; i++){
//             const lectureRoom = lectureRoomList[i];
//             const ip = lectureRoom.camera_ip.front.split(':')[0];//DB에 저장된 포트 제거
//             clientList.push({
//                 ip : ip,
//                 client : createClient(ip)
//             });
//         }
//     });
// },3000);


// function createClient(ip){
//     var client = net.connect({port:3001, host:ip}, function(){
//         console.log('Client connected');
//         client.write('Some Data \r\n');
//     });
//     client.on('data', function(data){
//         console.log(data.toString());
//         client.end();
//     });
//     client.on('end', function(){
//         console.log('Client disconnected');
//     });

//     return client;
// }


// //https://mylko72.gitbooks.io/node-js/content/chapter8/chapter8_2.html 참고

// module.exports = {
//     getClientList : clientList
// };

// // var server = net_server.createServer(function(client) {
  
// //     console.log('Client connection: ');
// //     console.log('   local = %s:%s', client.localAddress, client.localPort);
// //     console.log('   remote = %s:%s', client.remoteAddress, client.remotePort);
    
// //     client.setTimeout(500);
// //     client.setEncoding('utf8');
    
// //     client.on('data', function(data) {
// //         console.log('Received data from client on port %d: %s', client.remotePort, data.toString());
        
// //         writeData(client, 'Sending: ' + data.toString());
// //         console.log('  Bytes sent: ' + client.bytesWritten);
// //     });
    
// //     client.on('end', function() {
// //         console.log('Client disconnected');
// //     });
    
// //     client.on('error', function(err) {
// //         console.log('Socket Error: ', JSON.stringify(err));
// //     });
    
// //     client.on('timeout', function() {
// //         console.log('Socket Timed out');
// //     });
// // });
 
// // server.listen(3030, function() {
// //     console.log('Server listening: ' + JSON.stringify(server.address()));
// //     server.on('close', function(){
// //         console.log('Server Terminated');
// //     });
// //     server.on('error', function(err){
// //         console.log('Server Error: ', JSON.stringify(err));
// //     });
// // });
 
// // function writeData(socket, data){
// //   var success = socket.write(data);
// //   if (!success){
// //     console.log("Client Send Fail");
// //   }
// // }


// // module.exports = server;

