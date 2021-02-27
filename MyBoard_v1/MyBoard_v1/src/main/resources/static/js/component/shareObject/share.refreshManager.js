/*
외부에서 register(func, arg1, arg2) 이런식으로 등록하게되면
func(arg1, arg2) 이런식으로 동작하는 것과 같은 동작을 한다.

ex) shareObject.refreshManager.register(this.refreshBoard); << 이경우는 매개변수가 없음
 */

export default {
    methods:[],
    refresh(){
        for(let i=0; i<this.methods.length; i++){
            const method = this.methods[i].method;
            const params = this.methods[i].params;
            method.apply(method,params);

        }
    },
    register(func){
        this.methods.push({
            method : func,
            params : Array.prototype.slice.call(arguments, 1)
        });
    }

}