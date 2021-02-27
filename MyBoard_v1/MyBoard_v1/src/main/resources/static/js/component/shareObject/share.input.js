
export default {
    method:{
        resetInput(obj){
            for(let prop in obj){
                if(Array.isArray(obj[prop])){
                    obj[prop]=[];
                }
                else if(typeof obj[prop] == 'object'){
                    this.resetInput(obj[prop]);
                }
                else if(typeof obj[prop] == 'string'){
                    obj[prop] = '';
                }

            }
        },
        closeView(obj, callback){
            this.resetInput(obj);
            callback();
        }
    }
}