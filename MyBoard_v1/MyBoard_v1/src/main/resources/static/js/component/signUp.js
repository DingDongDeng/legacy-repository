import shareObject from "./shareObject/shareObject.js";

export default Vue.component('sign-up',{
    template:
        `<div class="cover-view">
            <div class="component-sign-up margin-auto-center">
                <div> <input type="button" value="x" @click="inputMethod.closeView(input, closedEvent)"
                             class="btn btn-outline-dark right"> </div>
                <div>
                    <span> {{i18n('index.signup.guide')}} </span>
                </div>
                <div class="margin-auto-center">
                    <div name="input-list">
                        <input v-model="input.nickname" class="display-block" type="text" :placeholder="i18n('index.signup.nickname.placeholder')">
                        <div class="warning-font">{{guide.nickname}}</div>                
                        <input v-model="input.email" class="display-block" type="text" :placeholder="i18n('index.signup.email.placeholder')">
                        <div class="warning-font">{{guide.email}}</div>
                        <input v-model="input.password" class="display-block" type="password" :placeholder="i18n('index.signup.password.placeholder')">
                        <div class="warning-font">{{guide.password}}</div>
                        <input v-model="input.passwordCheck" class="display-block" type="password" :placeholder="i18n('index.signup.passwordcheck.placeholder')">
                        <div class="warning-font">{{guide.passwordCheck}}</div>                    
                    </div>
                </div>
                <div>
                    <input class="btn btn-outline-dark" name="signup"type="button" :value="i18n('index.signup')" @click="signUp()">
                </div>
            </div>
        </div>`,
    components: {

    },
    data(){
        return {
            coverViewState:shareObject.coverView.state,
            coverViewMethod : shareObject.coverView.method,
            inputMethod : shareObject.input.method,
            failFunc : shareObject.failFunc,
            input :{
                nickname : '',
                email : '',
                password : '',
                passwordCheck : ''
            },
            guide :{
                nickname : '',
                email : '',
                password : '',
                passwordCheck : '',
            },
            i18n:i18n,
        }
    },
    async created(){

    },
    methods:{
        signUp(){
            const data = {
                nickname : this.input.nickname,
                email : this.input.email,
                password: this.input.password,
                passwordCheck: this.input.passwordCheck
            }
            axios.post('/api/account', data)
                .then(res=>{
                    console.log('/api/account : ', res);
                    alert(i18n('index.signup.complete'));
                    this.coverViewMethod.hideSignUpView();
                    this.inputMethod.resetInput(this.input);
                    this.inputMethod.resetInput(this.guide);
                })
                .catch(err=>{
                    const errorContent = err.data.errorContent;
                    const handleFieldError = this.handleFieldError;
                    const guide = this.guide;
                    this.resetGuideMessage();
                    errorContent.forEach(function(err, index, array){
                        if(err.field){
                            handleFieldError(err)
                        }
                        else{
                            guide.passwordCheck = err.message;
                        }
                    })
                    // this.failFunc.failFunc(err);
                })
        },
        handleFieldError(err){
            switch (err.field) {
                case "nickname" :
                    this.guide.nickname = err.message;
                    break;
                case "email" :
                    this.guide.email = err.message;
                    break;
                case "password" :
                    this.guide.password = err.message;
                    break;
                default :
                    break;
            }
        },
        resetGuideMessage(){
            for(let prop in this.guide){
                this.guide[prop] = '';
            }
        },
        closedEvent(){
            this.coverViewMethod.hideSignUpView();
            this.resetGuideMessage();
        }

    }

});