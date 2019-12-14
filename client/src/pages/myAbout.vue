<template>
    <div class="aboutUs" style="overflow: auto;">
        <p v-html="infor"></p>
    </div>
</template>
<script>
    export default{
        name:'about',
        data(){
            return {
                infor:''
            }
        },
        //页面刷新每次都执行 从别的页面进来 执行  加keep-alive后不执行
        //页面进来后 都不会执行 其引用的 header footer组件 要想让组件执行 必须在组见内 watch 这才能每次都更新
        //加keep-alive也要让页面 mounted可以执行
        mounted(){
            this.api.get(this.baseUrl+'/api/aboutus/sellers').then((d)=>{
                this.infor=d.data.data.content;
            })
        }
    }
</script>
<style>

</style>
