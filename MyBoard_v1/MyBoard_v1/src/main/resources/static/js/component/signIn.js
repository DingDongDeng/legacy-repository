import shareObject from "./shareObject/shareObject.js";

function setLang(){
    let lang = getUrlParams().lang;
    if(lang == undefined)
        lang = 'ko';
    return lang;
}

function getUrlParams() {
    let params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(str, key, value) {
        params[key] = value;
    });
    return params;
}

export default Vue.component('sign-in',{
    template:
        `<div class="cover-view">
            <div class="component-sign-in margin-auto-center">
                <div> <input type="button" value="x" @click="inputMethod.closeView(input,coverViewMethod.hideSignInView)"
                             class="btn btn-outline-dark right"
                             name="x"> </div>
                <div>
                    <span class="title"> {{i18n('index.signin.title')}} </span>
                </div>
                <div class="margin-auto-center">
                    <div class="inline-block">
                        <input v-model="input.email" type="text" :placeholder="i18n('index.signin.email.placeholder')" @keyup.enter="signIn(input.email, input.password)"></br>
                        <input v-model="input.password" type="password" :placeholder="i18n('index.signin.password.placeholder')" @keyup.enter="signIn(input.email, input.password)">    
                    </div>
                </div>
                <div>
                    <input type="button" :value="i18n('index.signin')" @click="signIn(input.email, input.password)"
                           class="btn btn-outline-dark">
                    <input type="button" :value="i18n('index.signup')" @click="coverViewMethod.showSignUpView()"
                           class="btn btn-outline-dark">
                </div>
                <div class="social">
                    <div class="btn">
                        <a href="/oauth2/authorization/google"
                           name="google"
                           class="btn btn-secondary active" role="button"> Google {{i18n('index.signin')}}</a>
                    </div>      
                    <div class="btn">
                        <a href="/oauth2/authorization/naver"
                           name="naver"
                           class="btn btn-secondary active" role="button"> Naver {{i18n('index.signin')}}</a>
                    </div>
                    <div class="btn">
                        <a href="/oauth2/authorization/kakao"
                           name="kakao"
                           class="btn btn-secondary active" role="button"> Kakao {{i18n('index.signin')}}</a>
                    </div>
                    <div class="btn">
                        <div
                           name="test"
                           class="btn btn-secondary active" role="button"
                           @click="guideTest()"> TEST {{i18n('index.signin')}}</div>
                    </div>                                  
                </div>
            </div>
        </div>`,
    components: {

    },
    data(){
        return {
            coverViewMethod : shareObject.coverView.method,
            inputMethod : shareObject.input.method,
            loginMethod : shareObject.login.method,
            failFunc : shareObject.failFunc,
            input:{
                email : '',
                password : '',
            },
            i18n: i18n,

        }
    },
    async created(){

    },
    methods:{
        signIn(email, password){
            const data ={
                email : email,
                password : password
            }
            axios.post('/api/account/signIn'+'?lang='+setLang(),data)
                .then(this.successSignIn)
                .catch(this.failSignIn)
        },
        successSignIn(res){
            console.log(res);
            this.loginMethod.setLoginState();
            this.coverViewMethod.resetState();
            this.inputMethod.resetInput(this.input);
        },
        failSignIn(err){
            this.failFunc.failFunc(err);
            // alert(err.data.message);
            this.input.password='';
        },
        guideTest(){
            alert("id : test01~05\n pw : 1234")
        }

    }

});
