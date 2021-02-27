//출처 :  https://github.com/StefanNeuser/vuejs2-summernote-component/blob/master/src/Summernote.js


export default {

    template: '<textarea id="summernote" :name="name"></textarea>',

    props: {
        model: {
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        height: {
            type: String,
            default: '150'
        },
        placeholder:{
            type: String,
        },
        lang:{
            type:String,
        }
    },

    mounted() {


        let config = {
            height: this.height,
            lang : this.lang,
            placeholder : this.placeholder,
        };

        let vm = this;

        config.callbacks = {

            onInit: function () {
                $(vm.$el).summernote("code", vm.model);
            },

            onChange: function () {
                vm.$emit('change', $(vm.$el).summernote('code'));
            },

            onBlur: function () {
                vm.$emit('change', $(vm.$el).summernote('code'));
            },
        };

        $(this.$el).summernote(config);

    },

}