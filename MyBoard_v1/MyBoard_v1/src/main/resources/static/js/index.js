import shareObject from "./component/shareObject/shareObject.js"

import signIn from "./component/signIn.js"
import signUp from "./component/signUp.js"
import board from "./component/board.js"
import writePost from "./component/writePost.js"
import post from "./component/post.js"
import updatePost from "./component/updatePost.js"
import alarm from "./component/alarm.js";
import userInfo from "./component/userInfo.js";

new Vue({
    el : '#app',
    components:{
        signIn,
        signUp,
        board,
        writePost,
        post,
        updatePost,
        alarm,
        userInfo,

    },
    data(){
        return {
            coverViewState:shareObject.coverView.state,
            coverViewMethod : shareObject.coverView.method,

            loginInfo : shareObject.login.info,
            loginMethod: shareObject.login.method,
            lang : this.getParam('lang')||'ko',
            delivery:{
                post:{
                    boardId:''
                },
                updatePost:{
                    board:{}
                }
            },

            //for loading state
            refCount: 0,
            isLoading: false,
        }
    },
    async created(){
        this.loginMethod.checkLogin();
        document.querySelector("#app div[name=whole]").classList.remove( 'display-none' );
        document.querySelector(".page-loading").classList.add('display-none');

        const setLoading = this.setLoading;
        axios.interceptors.request.use((config) => {
            // trigger 'loading=true' event here
            setLoading(true);
            return config;
        }, (error) => {
            // trigger 'loading=false' event here
            setLoading(false);
            return Promise.reject(error);
        });

        axios.interceptors.response.use((response) => {
            // trigger 'loading=false' event here
            setLoading(false);
            return response;
        }, (error) => {
            // trigger 'loading=false' event here
            setLoading(false);
            return Promise.reject(error);
        });
    },
    methods:{
        post(data){
            this.delivery.post[data.name] = data.content;
        },
        updatePost(data){
            this.delivery.updatePost[data.name] = data.content;
        },
        setLanguage(lang){
            location.href = '?lang='+lang;
        },
        getParam(sname) {
            let params = location.search.substr(location.search.indexOf("?") + 1);
            let sval;
            params = params.split("&");
            for (let i = 0; i < params.length; i++) {
                let temp = params[i].split("=");
                if ([temp[0]] == sname) { sval = temp[1]; }}
            return sval;
        },
        setLoading(isLoading) {
            if (isLoading) {
                this.refCount++;
                this.isLoading = true;
            } else if (this.refCount > 0) {
                this.refCount--;
                this.isLoading = (this.refCount > 0);
            }
        }
    }
})
