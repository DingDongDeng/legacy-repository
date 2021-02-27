
export default {
    socket : {isEmpty:true},
    create(path){
        if (location.protocol !== 'https:') {
            this.socket = new WebSocket("ws://" + window.location.host + path);
        }
        else{
            this.socket = new WebSocket("wss://" + window.location.host+":8181" + path);
        }
    },
    send(obj){
        console.log('Info : connection opened.');
        this.socket.send(JSON.stringify(obj));
    },
    onmessage(callback){
        this.socket.onmessage=function(event){
            console.log("ReceiveMessage:", event.data +'\n');
            callback(JSON.parse(event.data));
        }
    },
    onclose(callback){
        this.socket.onclose=function(event){
            console.log('Info : connection closed.');
            callback(event);
        }
    },
    onerror(callback){
        this.socket.onerror=function(err){
            console.log('Error:', err);
            callback(err);
        }
    },
    close(){
        if(!this.socket.isEmpty){
            this.socket.close();
            this.socket = {isEmpty:true};
        }
    }
}

