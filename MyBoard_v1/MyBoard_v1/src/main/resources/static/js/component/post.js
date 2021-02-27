import shareObject from "./shareObject/shareObject.js";

export default Vue.component('post',{
    props:['board_id'],
    template:
        `<div class="cover-view">
            <div class="component-post margin-auto-center">
                <div class="post">
                    <div> <input type="button" value="x"
                                 class="btn btn-outline-dark right" 
                                 @click="inputMethod.closeView(input,coverViewMethod.hidePostView)"> </div>
                    <div class="title"><span>{{post.title}}</span></div>                    
                    <span class="right">
                        <span v-if="post.account!=null" class="nickname">{{post.account.nickname}}</span>
                        <span v-else class="nickname"> {{i18n('index.unknown')}} </span>
                    </span>
                    <span class="right like">
                        <input :class="{focusLike:post.isLiked}"type="button" :value="i18n('index.board.like')"
                                     class="btn btn-outline-dark" 
                                     @click="likePost(board_id)">
                         {{post.like}}&nbsp;&nbsp;&nbsp;
                    </span>
                    <div class="content" v-html="post.content.replace(/(?:\\r\\n|\\r|\\n)/g, '<br/>')"></div>
                    <div v-if="post.account!=null" class="right edit">
                        <div v-if="post.account.email==loginInfo.email">
                            <input type="button" :value="i18n('index.post.modify')"
                                   class="btn btn-outline-dark" 
                                   @click="showUpdatePostView()">
                            <input type="button" :value="i18n('index.post.delete')"
                                   class="btn btn-outline-dark" 
                                   @click="deletePost(post.boardId)">
                        </div>                        
                    </div>
                    <div class="right detail">
                        <div>                        
                            <span class="detail-info"><span class="inline-block info-name">{{i18n('index.board.view')}}</span> <span class="inline-block  info-value"> {{post.view}} </span></span>                        
                        </div>
                        <div>
                            <span class="detail-info"><span class="inline-block info-name">{{i18n('index.board.regdate')}}</span> <span class="inline-block info-value">{{new Date(post.regDate).format('yy-MM-dd a/p hh:mm:ss')}}</span> </span>
                        </div>
                        <div>
                            <span class="detail-info"><span class="inline-block info-name">{{i18n('index.board.update')}}</span> <span class="inline-block info-value">{{new Date(post.upDate).format('yy-MM-dd a/p hh:mm:ss')}}</span> </span>
                        </div>
                    </div>                    
                    <div>
                        <div v-for="file in fileList">
                            <span class="file-name inline-block">
                                {{file.originName}}
                                <input type="button" :value="i18n('index.post.down')"
                                   class="btn btn-outline-dark right" 
                                   @click="download(file.fileId)">
                            </span>                            
                            <span> 
<!--                            cnt <span> {{file.down}} </span> -->
                            </span>
                        </div>
                    </div>
                    
                </div>
                <div class="comment">
                    <div>
                        <div>
                            <textarea v-model="input.inputComment" :placeholder="i18n('index.comment.placeholder')"></textarea>
                        </div>
                        <div class="inline-block wrapper-btn">
                            <input type="button" :value="i18n('index.comment.write')"
                                   class="btn btn-outline-dark right" 
                                   @click="writeComment(post.boardId,input.inputComment)">
                        </div>                    
                    </div>
                    
                    <div class="comment-list-item" v-for="(comment,index) in commentList">
                        <div v-for="index in comment.delParentCnt">
                            <div :class="{childComment: comment.hasDelTypeParent?(index!=1):true}">
                                <div class="delete-comment">
                                    <span>{{i18n('index.comment.removed')}}}</span>
                                </div>
                                <div class="reply-btn">
                                    <input v-if="loginInfo.isLogin&&!(comment.hasDelTypeParent?(index!=1):true)" 
                                           type="button" :value="i18n('index.comment.reply')"
                                           class="btn btn-outline-dark"
                                           @click="showReplyCommentView(index)">                            
                                </div>
                                <div v-if="index==visibleReplyCommentFormIndex">
                                    <div>
                                        <textarea :placeholder="i18n('index.comment.reply.placeholder')"></textarea>
                                    </div>
                                    <div>
                                        <input type="button" :value="i18n('index.comment.complete')" @click="writeReplyComment(comment.commentId,comment.board.boardId, input.replyComment.content)"
                                               class="btn btn-outline-dark">
                                        <input type="button" :value="i18n('index.comment.cancle')" @click="hideReplyComment()"
                                               class="btn btn-outline-dark">
                                    </div>
                                </div>                             
                            </div>                                                                                                               
                        </div>
                        <div :class="{childComment:comment.type=='CHILD'}">
                            <div v-if="index!=invisibleCommentIndex">                                                                
                                <div class="inline-block wrapper-like-nick">                                                                
                                    <span class="like"><input  type="button" :value="i18n('index.comment.like')"
                                                  :class="{focusLike:comment.isLiked}" 
                                                  class="btn btn-outline-dark"
                                                  @click="likeComment(index,comment.commentId)"> {{comment.like}}</span>
                                    <span class="nickname">
                                        <span v-if="comment.account!=null">{{comment.account.nickname}}</span>
                                        <span v-else>{{i18n('index.unknown')}}</span>
                                    </span>
                                </div>
                                <div class="content" v-html="comment.content.replace(/(?:\\r\\n|\\r|\\n)/g, '<br/>')"></div>
                                <div class="reply-btn">
                                    <input v-if="loginInfo.isLogin&&comment.type=='PARENT'" type="button" :value="i18n('index.comment.reply')"
                                           class="btn btn-outline-dark" 
                                           @click="showReplyCommentView(index)">
                                </div>
                                <div class="date">
                                    <div>
                                        <span>{{i18n('index.comment.regdate')}} : <span>{{new Date(comment.regDate).format('yy-MM-dd a/p hh:mm:ss')}}</span> </span> 
                                    </div>
                                    <div>
                                        <span>{{i18n('index.comment.update')}} &nbsp;: <span>{{new Date(comment.upDate).format('yy-MM-dd a/p hh:mm:ss')}}</span> </span> 
                                    </div>  
                                </div>
                                <div v-if="comment.account!=null">
                                    <div v-if="comment.account.email==loginInfo.email">
                                        <input type="button" :value="i18n('index.comment.modify')" @click="showModifyCommentView(index)"
                                               class="btn btn-outline-dark">
                                        <input type="button" :value="i18n('index.comment.delete')" @click="deleteComment(comment.board.boardId, comment.commentId)"
                                               class="btn btn-outline-dark">
                                    </div>                        
                                </div>                                                            
                                <div v-if="index==visibleReplyCommentFormIndex">
                                    <div>
                                        <textarea v-model="input.replyComment.content" :placeholder="i18n('index.comment.reply.placeholder')"></textarea>
                                    </div>
                                    <div>
                                        <input type="button" :value="i18n('index.comment.complete')" @click="writeReplyComment(comment.commentId,comment.board.boardId,input.replyComment.content)"
                                               class="btn btn-outline-dark">
                                        <input type="button" :value="i18n('index.comment.cancle')" @click="hideReplyComment()"
                                               class="btn btn-outline-dark">
                                    </div>
                                </div>                             
                            </div>
                            <div v-else>
                                <div>                            
                                    <span>
                                        {{i18n('index.comment.nickname')}} : 
                                        <span v-if="comment.account!=null">{{input.modifyComment.account.nickname}}</span>
                                        <span v-else>{{i18n('index.unknown')}}</span>
                                    </span>
                                    <span><input  type="button" :value="i18n('index.comment.like')" @click="likeComment(index, comment.commentId)"> {{input.modifyComment.like}}</span>
                                </div>
                                <div>
                                    <textarea v-model="input.modifyComment.content"></textarea>
                                </div>
                                <div>
                                    <div>
                                        <span>{{i18n('index.comment.regdate')}} : <span>{{new Date(input.modifyComment.regDate).format('yy-MM-dd a/p hh:mm:ss')}}</span> </span> 
                                    </div>
                                    <div>
                                        <span>{{i18n('index.comment.update')}} : <span>{{new Date(input.modifyComment.upDate).format('yy-MM-dd a/p hh:mm:ss')}}</span> </span> 
                                    </div>  
                                </div>                                
                                <div>
                                    <input type="button" :value="i18n('index.comment.complete')" @click="modifyComment(input.modifyComment)"
                                           class="btn btn-outline-dark">
                                    <input type="button" :value="i18n('index.comment.cancle')" @click="cancleModifyComment()"
                                           class="btn btn-outline-dark">
                                </div>                                
                            </div>                            
                        </div>                        
                    </div>
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
            loginMethod : shareObject.login.method,
            deliveryData : shareObject.deliveryData,
            failFunc : shareObject.failFunc,
            input:{
                inputComment:'',
                modifyComment: {
                    content:''
                },
                replyComment:{
                    content:''
                }
            },
            visibleModifyCommentFormIndex:-1,
            invisibleCommentIndex:-1,
            visibleReplyCommentFormIndex:-1,
            post:{
                content:'',
                like:'',
                isLiked:false,
            },
            fileList:[],
            commentList:[],
            i18n: i18n,
        }
    },
    async created(){
    },
    watch:{
        coverViewState:{
            deep:true,
            handler(state,oldState){
                if(state.post){
                    this.watchGetPost();
                }
            }
        }
    },
    methods:{
        watchGetPost(){
            this.getPost(this.board_id)
            this.getCommentList(this.board_id)
            // setTimeout(()=>{
            //     getPost(boardId)
            //     getCommentList(boardId)
            // },0)
        },
        getPost(boardId){
            axios.get('/api/board/post/'+boardId)
                .then(this.successGetPost)
                .catch(this.fail)
        },
        successGetPost(res){
            const data = res.data;

            this.post = data.post;
            this.post.isLiked = data.isLikedPost;
            this.fileList = data.fileList;

            this.inputMethod.resetInput(this.input);
            shareObject.refreshManager.refresh();
        },
        likePost(boardId){
            if(!this.loginMethod.isLogin()){
                alert(i18n('index.need.login'));
                return;
            }

            axios.post('/api/board/like',{boardId:boardId})
                .then(this.successLikePost)
                .catch(this.fail)

        },
        successLikePost(res){
            this.post.like = res.data.like;
            this.post.isLiked = !this.post.isLiked;
            shareObject.refreshManager.refresh();
        },
        fail(err){
            this.failFunc.failFunc(err);
            // this.coverViewMethod.resetState();
        },

        download(fileId){
            window.location.href = '/api/board/file/'+fileId;
        },

        deletePost(boardId){
            if(confirm(i18n("index.post.delete.alert"))){
                axios.delete('/api/board/'+boardId)
                    .then(this.successDeltePost)
                    .catch(this.fail)
            }
        },
        successDeltePost(res){
            this.coverViewMethod.hidePostView();
            shareObject.refreshManager.refresh();
        },
        showUpdatePostView(){
            this.deliveryData('update_post','board',{'post':this.post, 'fileList':this.fileList})
            this.coverViewMethod.showUpdatePostView();
        },
        changeBoardId(boardId){
            this.boardId= boardId;

        },

        getCommentList(boardId){
            axios.get('/api/comment/'+boardId)
                .then(this.successGetCommentList)
                .catch(this.fail)

        },
        successGetCommentList(res){
            const data = res.data;
            this.commentList = data.commentList;
            const likedCommentList = data.likedCommentList;

            for(let i=0; i<this.commentList.length; i++){
                this.commentList[i].isLiked = this.isLikedComment(this.commentList[i],likedCommentList);
            }
        },
        isLikedComment(comment, likedCommentList){
            for(let i=0; i<likedCommentList.length; i++){
                if(comment.commentId == likedCommentList[i].commentId){
                    return true;
                }
            }
            return false;
        },
        showModifyCommentView(index){
            this.invisibleCommentIndex = index;
            this.input.modifyComment = this.commentList[index];
        },
        cancleModifyComment(){
            this.invisibleCommentIndex = -1;
        },
        deleteComment(boardId, commentId){
            axios.delete('/api/comment/'+commentId)
                .then(this.successDeleteComment)
                .catch(this.fail)

        },
        successDeleteComment(res){
            const boardId = res.data.boardId;
            this.getCommentList(boardId);
        },
        modifyComment(comment){
            const data={
                content : this.input.modifyComment.content
            }
            axios.put('/api/comment/'+comment.commentId,data)
                .then(this.successModifyComment)
                .catch(this.fail)
        },
        successModifyComment(res){
            const boardId = res.data.boardId;
            this.getCommentList(boardId);
            this.cancleModifyComment();
        },
        writeComment(boardId, content){
            const data = {
                content : content
            }

            axios.post('/api/comment/'+ boardId,data)
                .then(this.successwriteComment)
                .catch(this.fail)
        },
        successwriteComment(res){
            const boardId = res.data.boardId;
            this.getCommentList(boardId);
            this.input.inputComment='';
        },
        writeReplyComment(commentId, boardId, content){
            const data = {
                boardId: boardId,
                commentId : commentId,
                content : content
            }
            axios.post('/api/comment/reply',data)
                .then(this.successReplyComment)
                .catch(this.fail)
        },
        showReplyCommentView(index){
            this.visibleReplyCommentFormIndex = index;
        },
        hideReplyComment(){
          this.visibleReplyCommentFormIndex = -1;
        },
        successReplyComment(res){
            this.getCommentList(res.data.boardId);
            this.input.replyComment.content='';
            this.visibleReplyCommentFormIndex = -1;
        },
        likeComment(index,commentId){
            axios.put('/api/comment/like/'+commentId)
                .then((res)=>{
                    const data = res.data;
                    this.commentList[index].like = data.like;
                    this.commentList[index].isLiked = !this.commentList[index].isLiked;
                })
                .catch(this.fail)
        },
    }

});
