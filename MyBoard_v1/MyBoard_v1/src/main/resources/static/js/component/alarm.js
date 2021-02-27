import shareObject from "./shareObject/shareObject.js";

export default Vue.component('alarm',{
    props:['is_login'],
    template:
        `<div>
            <div class="component-alarm margin-auto-center">
                <div v-if="alarmListVisibleState" class="close"> 
                    <input type="button" value="x" @click="hideAlarmList()"class="btn btn-outline-dark right"> 
                </div> 
                <div class="alarm-list"v-if="alarmListVisibleState"> 
                    <div>                   
                        <div v-for="(alarm,index) in alarmList"
                             :class="{checkedAlarm:alarm.isChecked}"
                             class="alarm"
                             @click="checkAlarm(alarm)">
                            <div>
                                <div>
                                    <span>{{new Date(alarm.recieveDate).format('yy-MM-dd a/p hh:mm:ss')}}</span>
                                    <input type="button" value="x" @click.stop="deleteAlarm(alarm)"                                           
                                           class="btn btn-outline-dark right">
                                    <input type="button" value="go post" @click="showPost(alarm.eventContentId)"
                                           name="goPost"
                                           class="btn btn-outline-dark right">                                    
                                </div>
                                <div>
                                    <span>{{alarm.message}} </span>
                                </div>
                            </div>                            
                        </div>
                    </div>    
                </div>
                <div>
                    <div :class="{flag:isHasNew}"></div>
                    <img src="/static/img/alarm.png" @click="switchAlarmList()">
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
            loginInfo : shareObject.login.info,
            deliveryData : shareObject.deliveryData,
            socket : shareObject.socket,
            failFunc : shareObject.failFunc,

            alarmList:[],

            alarmListVisibleState:false,
            type:{
                WRITE_COMMENT:'WRITE_COMMENT'
            },
            isHasNew:false,

        }
    },
    async created(){
        if(this.is_login){
            this.setSocket();
            this.getAlarmList();
        }
    },
    watch:{
        is_login(isLogin, old){
            if(isLogin){
                this.setSocket();
                this.getAlarmList()
                return;
            }
            this.socket.close();
        }
    },
    methods:{
        getAlarmList(){
            axios.get('/api/alarm')
                .then(this.successGetAlarmList)
                .catch(this.fail)
        },
        successGetAlarmList(res){
            this.alarmList = res.data.alarmList;
            for(let i=0; i<this.alarmList.length; i++){
                const alarm =this.alarmList[i];
                this.setCheckedState(alarm);
                this.setNickname(alarm);
                this.setMessage(alarm);
            }
            this.setIsHasNew(this.alarmList);
        },
        setCheckedState(alarm){
            if(alarm.checkDate){
                alarm.isChecked = true;
                return;
            }
            alarm.isChecked = false;
        },
        setNickname(alarm){
            if(alarm.triggerAccount==null){
                alarm.triggerAccount ={};
                alarm.triggerAccount.nickname="unknown";
            }
        },
        setIsHasNew(alarmList){
            let state= false;
            for(let i=0; i<alarmList.length; i++){
                if(!alarmList[i].isChecked){
                    state = true;
                    break;
                }
            }
            this.isHasNew = state;
        },
        setMessage(alarm){
            if(alarm.eventType == "WRITE_COMMENT"){
                alarm.message = alarm.eventContentId +' 게시물에 '
                    + alarm.triggerAccount.nickname +'님이 '
                    + '댓글을 작성하였습니다.'
                return;
            }
            if(alarm.eventType == "REPLY_COMMENT"){
                alarm.message = alarm.eventContentId +' 게시물에 작성한 댓글에 '
                    + alarm.triggerAccount.nickname +'님이 '
                    + '대댓글을 작성하였습니다.'
            }
        },
        switchAlarmList(){
            this.alarmListVisibleState = !this.alarmListVisibleState;
        },
        hideAlarmList(){
            this.alarmListVisibleState = false;
        },
        fail(err){
            this.failFunc.failFunc(err);
        },
        checkAlarm(alarm){
            axios.put('/api/alarm/'+alarm.alarmId)
                .then(res=>{
                    this.getAlarmList();
                })
                .catch(this.fail)

        },
        deleteAlarm(alarm){
            axios.delete('/api/alarm/'+alarm.alarmId)
                .then(res=>{
                    this.getAlarmList();
                })
                .catch(this.fail)
        },
        setSocket(){
            this.socket.create('/ws/alarm');

            this.socket.onmessage((data)=>{
                this.getAlarmList();
            })
            this.socket.onclose((event)=>{

            })
            this.socket.onerror((event)=>{

            })
        },
        showPost(boardId){
            this.deliveryData('post','boardId',boardId)
            this.coverViewMethod.showPostView();
        }

    }

});