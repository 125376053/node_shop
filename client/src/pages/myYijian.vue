<template>
    <div>
        <div class="beizhu">
            <div class="zitip">
                <p class="ptitle">请输入您的反馈意见：</p>
                <textarea class="resetTa" v-model="areaText">{{areaText}}</textarea>
            </div>
        </div>
        <a class='recivBtn bottom' @click="fanKui">提交反馈</a>
    </div>
</template>
<script>
export default{
    name:'yijian',
    data(){
        return{
            areaText:'',
            //token:this.$root.token //全局token终究是不能很好响应
            token:window.localStorage.getItem('userInfoObj')?JSON.parse(window.localStorage.getItem('userInfoObj')).token:''
        }
    },
    methods:{
        fanKui(){
            if(this.areaText==''){
                this.$toast('请输入反馈信息');
                return false;
            }else{
                this.api.post(this.baseUrl+'/api/post/feeback/add?token='+this.token,{
                    content:this.areaText,
                    images:'1'
                }).then((d)=>{
                    this.$router.push('/my');
                })
            }
        }
    },
    mounted(){
        //不显示底部
        this.$store.dispatch('changeFooter');
    }
}
</script>
<style>

</style>
