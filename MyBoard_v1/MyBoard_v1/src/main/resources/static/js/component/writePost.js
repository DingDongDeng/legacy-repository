import shareObject from "./shareObject/shareObject.js";
import summernote from "./summernote.js";

export default Vue.component('write-Post',{
    template:
        `<div class="cover-view">
            <div class="component-write-post margin-auto-center">
                <div> <input type="button" value="x" 
                             class="btn btn-outline-dark right"
                             @click="inputMethod.closeView(input,coverViewMethod.hideWritePostView)"> </div>
                <div ><input class="title" v-model="input.title" type="text" :placeholder="i18n('index.post.title.placeholder')"></div>
                <div>
                    <summernote
                        class="editor"
                        name="editor"
                        :model="input.content"
                        :height="'300'"
                        :lang="'ko-KR'"
                        :placeholder="i18n('index.post.content.placeholder')"
                        @change="value => { input.content = value }"/>
                </div>
                <div>
                    <div v-for="(file,index) in input.fileList">
                        <span class="file-name"> name : {{file.name}}, size : {{file.size}}</span>
                        <input class="btn btn-outline-dark" type="button" value="x" @click="removeFile(index)">
                    </div>
                    <div><input type="file" ref="fileInput"@change="addFile()"></div>
                </div>
                <div>
                    <input type="button" :value="i18n('index.post')" @click="writePost(input.title, input.content, input.fileList)"
                           class="btn btn-outline-dark right">
                </div>
            </div>
        </div>`,
    components: {
        summernote,
    },
    data(){
        return {
            coverViewMethod : shareObject.coverView.method,
            inputMethod : shareObject.input.method,

            failFunc : shareObject.failFunc,
            input:{
                title : '',
                content : '',
                fileList : []
            },
            i18n : i18n,
        }
    },
    async created(){

    },
    mounted(){

    },
    methods:{
        writePost(title, content, fileList){
            const formData = new FormData();
            formData.append('title',title);
            formData.append('content', content);
            for(let i=0; i<fileList.length; i++){
                formData.append('fileList['+i+']', fileList[i]);
            }

            axios.post('/api/board',formData,{
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(this.successWritePost)
                .catch(this.failWritePost)
        },
        successWritePost(res){
            console.log(res);
            this.coverViewMethod.resetState();
            this.inputMethod.resetInput(this.input);
            this.resetEditor();
            shareObject.refreshManager.refresh();
        },
        failWritePost(err){
            this.failFunc.failFunc(err);
        },
        addFile(){
            this.input.fileList.push(this.$refs.fileInput.files[0]);
            this.$refs.fileInput.value='';
        },
        removeFile(index){
            this.input.fileList.splice(index,1);
        },
        resetEditor(){
            $(".component-write-post #summernote").summernote("reset");
        }

    }

});