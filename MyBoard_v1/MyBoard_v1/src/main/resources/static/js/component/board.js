import shareObject from "./shareObject/shareObject.js";

export default Vue.component('board',{
    template:
        `<div class="board">
            <div class="board-table">
                <table class="table table-hover table-striped">
                    <thead>
                        <tr class="board-head">
                            <td name="number">{{i18n('index.board.number')}}</td>
                            <td name="title">{{i18n('index.board.title')}}</td>
                            <td name="like">{{i18n('index.board.like')}}</td>
                            <td name="view">{{i18n('index.board.view')}}</td>
                            <td name="regdate">{{i18n('index.board.regdate')}}</td>
                            <td name="update">{{i18n('index.board.update')}}</td>
                            <td name="nickname">{{i18n('index.board.nickname')}}</td>                        
                        </tr>
                    </thead>
                    <tbody >
                        <tr v-for="board in pagination.list" 
                            @click="coverViewMethod.showPostView();
                                    deliveryData('post','boardId',board.boardId);">
                            <td class="num">{{board.boardId}}</td>
                            <td class="title">{{board.title}}</td>
                            <td class="like">{{board.like}}</td>
                            <td class="view">{{board.view}}</td>
                            <td class="date regdate">{{new Date(board.regDate).format('yy-MM-dd a/p hh:mm:ss')}}</td>                            
                            <td class="date update">{{new Date(board.upDate).format('yy-MM-dd a/p hh:mm:ss')}}</td>
                            <td class="nickname"v-if="board.account">{{board.account.nickname}}</td>
                            <td v-else class="nickname">{{i18n('index.unknown')}}</td>
                        </tr>                    
                    </tbody>
                </table>
            </div>
            <div>
                <div>
                    <input v-if="pagination.prevPage!=-1"type="button" :value="i18n('index.board.prev')"
                           class="btn btn-outline-dark" 
                           @click="getBoardList(pagination.prevPage)">
                    <input v-for="page in (pagination.endPage-pagination.startPage+1)" 
                           type="button" 
                           :class="{focusPage:pagination.page==(page+pagination.startPage-1)}"
                           class="btn btn-outline-dark page-item"                           
                           :value="page+pagination.startPage-1" 
                           @click="getBoardList(page+pagination.startPage-1)">
                    <input v-if="pagination.nextPage!=-1"type="button" :value="i18n('index.board.next')"
                           class="btn btn-outline-dark" 
                           @click="getBoardList(pagination.nextPage)">
                </div>                
            </div>
            <div>
                <div>
                    <input v-if="loginInfo.isLogin" type="button" :value="i18n('index.board.write')"
                           class="btn btn-outline-dark" 
                           @click="coverViewMethod.showWritePostView()"
                           name="write">
                </div>
            </div>
            <div class="search">
                <select v-model="searchCondition">
                    <option value="?title=true">{{i18n('index.board.search.title')}}</option>
                    <option value="?content=true">{{i18n('index.board.search.content')}}</option>
                    <option value="?title=true&content=true">{{i18n('index.board.search.title_content')}}</option>
                    <option value="?nickname=true">{{i18n('index.board.search.nickname')}}</option>                    
                </select>
                <input v-model="input.search" type="text">
                <input type="button" :value="i18n('index.board.search')" 
                       @click="search(input.search,searchCondition)"
                       class="btn btn-outline-dark" >
                <input v-show="mode=='search'" type="button"
                       class="btn btn-outline-dark" 
                       :value="i18n('index.board.search.return')" 
                       @click="returnBoard()">
            </div>
        </div>`,
    components: {

    },
    data(){
        return {
            deliveryData : shareObject.deliveryData,
            coverViewMethod : shareObject.coverView.method,
            inputMethod : shareObject.input.method,
            loginInfo : shareObject.login.info,
            loginMethod : shareObject.login.method,
            failFunc : shareObject.failFunc,
            input:{
                search:''
            },
            mode:'normal',//'normal'or'search'
            pagination:{
                list:[],
                page:'',
                startPage:'',
                endPage:'',
                prevPage:'',
                nextPage:''
            },
            searchCondition:'?title=true',
            i18n: i18n,
        }
    },
    created(){
        shareObject.refreshManager.register(this.refreshBoard);
        this.getBoardList(1);

    },
    methods:{
        refreshBoard(){
            this.getBoardList(this.pagination.page);
        },
        returnBoard(){ //검색모드에서 일반모드로 변경
            this.mode = 'normal';
            this.input.search = '';
            this.getNormalBoardList(1);
        },
        getBoardList(page){
            if(this.mode=='normal'){
                this.getNormalBoardList(page);
            }
            if(this.mode=='search'){
                this.getSearchBoardList(page,this.input.search, this.searchCondition)
            }
        },
        getNormalBoardList(page){
            axios.get('/api/board/'+page)
                .then(this.success)
                .catch(this.fail)
        },
        getSearchBoardList(page,keyword, searchCondition){
            axios.get('/api/board/search/'+page+searchCondition+'&keyword='+this.input.search)
                .then(this.success)
                .catch(this.fail)
        },
        search(keyword,searchCondition){
            this.mode = 'search';
            this.getSearchBoardList(1,keyword,searchCondition);
        },
        success(res){
            console.log(res);
            this.pagination = res.data;
        },
        fail(err){
            this.failFunc.failFunc(err);
        },
    }
});