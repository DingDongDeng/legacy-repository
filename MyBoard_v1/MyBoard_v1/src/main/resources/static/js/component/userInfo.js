import shareObject from "./shareObject/shareObject.js";


export default Vue.component('user-info',{
    template:
        `<div class="cover-view">
            <div class="component-user-info margin-auto-center">
                <div> <input type="button" value="x" @click="inputMethod.closeView(input, closedEvent)"
                             class="btn btn-outline-dark right"> </div>
                 <div>
                    <span> {{i18n('index.userinfo.guide')}} </span>
                </div>
                <div class="margin-auto-center">
                    <div name="input-list">
                        <input v-model="input.nickname" class="display-block" type="text" :placeholder="i18n('index.signup.nickname.placeholder')">
                        <div class="warning-font">{{guide.nickname}}</div>                
                        <input class="display-block" type="text" :placeholder="i18n('index.signup.email.placeholder')" :value="loginInfo.email" disabled>
                        <div class="warning-font">{{guide.email}}</div>
                        <input v-show="!loginInfo.isSocial" type="button" :value="i18n('index.userinfo.password.modify')" @click="showPasswordForm()"><br>                        
                        <div v-show="!loginInfo.isSocial&&isShowPasswordForm">                          
                            <input v-model="input.password" class="display-block" type="password" :placeholder="i18n('index.signup.password.placeholder')">
                            <div class="warning-font">{{guide.password}}</div>
                            <input v-model="input.passwordCheck" class="display-block" type="password" :placeholder="i18n('index.signup.passwordcheck.placeholder')">
                            <div class="warning-font">{{guide.passwordCheck}}</div>       
                            <input v-model="input.nowPassword" class="display-block" type="password" :placeholder="i18n('index.userinfo.now-password')">
                            <div class="warning-font">{{guide.nowPassword}}</div>                                     
                        </div>
                    </div>
                </div>
                <div>
                    <input class="btn btn-outline-dark" name="delete-account" type="button" :value="i18n('index.userinfo.delete-account')" @click="deleteAccount()">
                    <input class="btn btn-outline-dark" name="update"type="button" :value="i18n('index.userinfo.modify')" @click="modifyUserInfo()">
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
            loginInfo : shareObject.login.info,
            loginMethod: shareObject.login.method,
            failFunc : shareObject.failFunc,
            input :{
                nickname : '',
                password : '',
                passwordCheck : '',
                nowPassword: ''
            },
            guide :{
                nickname : '',
                email : '',
                password : '',
                passwordCheck : '',
                nowPassword : '',
            },

            isShowPasswordForm:false,
            i18n:i18n,
        }
    },
    async created(){

    },
    watch:{
      coverViewState:{
          deep:true,
          handler(state,oldState){
              if(state.userInfo){
                  this.setUserInfo();
              }
          }
      }
    },
    methods: {
        modifyUserInfo() {
            if (this.isShowPasswordForm) {
                this.putAccount();
                return;
            }
            this.patchAccount();

        },
        putAccount() {
            const data = {
                nickname: this.input.nickname,
                password: this.input.password,
                passwordCheck: this.input.passwordCheck,
                nowPassword: this.input.nowPassword,
            }
            axios.put('/api/account', data)
                .then(this.successModify)
                .catch(this.fail);
        },
        patchAccount() {
            const data = {
                nickname: this.input.nickname,
            }
            axios.patch('/api/account', data)
                .then(this.successModify)
                .catch(this.fail);

        },
        successModify() {
            alert(i18n('index.userinfo.complete'))
            this.inputMethod.resetInput(this.input);
            this.inputMethod.resetInput(this.guide);
            this.coverViewMethod.hideUserInfoView();
            this.loginMethod.logout();
        },
        handleFieldError(err) {
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
                case "nowPassword" :
                    this.guide.nowPassword = err.message;
                    break;
                default :
                    break;
            }
        },
        resetGuideMessage() {
            for (let prop in this.guide) {
                this.guide[prop] = '';
            }
        },
        setUserInfo() {
            this.input.nickname = this.loginInfo.nickname;
            this.input.email = this.loginInfo.email;
        },
        closedEvent() {
            this.coverViewMethod.hideUserInfoView();
            this.resetGuideMessage();
        },
        showPasswordForm() {
            this.isShowPasswordForm = !this.isShowPasswordForm;
        },
        deleteAccount() {
            if (confirm(i18n('index.userinfo.delete-account.warning'))) {
                axios.delete("/api/account")
                    .then(res => {
                        this.coverViewMethod.resetState();
                        this.loginMethod.logout();
                    })
            }
        },
        fail(err) {
            const errorContent = err.data.errorContent;
            const handleFieldError = this.handleFieldError;
            const guide = this.guide;
            this.resetGuideMessage();
            errorContent.forEach(function (err, index, array) {
                if (err.field) {
                    handleFieldError(err)
                } else {
                    guide.passwordCheck = err.message;
                }
            })
            // this.failFunc.failFunc(err);
        }

    }

});