<template>
    <div class="pageTitle" v-if="hideTop">
        <span class="leftJt">
            <img v-if="showLeftIcon" src="../assets/images/returnLeft.png" alt="" @click="returnPage">
        </span>
        <span class="titleName">{{searchPath}}{{fromPath}}</span>
        <span class="rightJt"></span>
    </div>
</template>
<script>
    import Vue from "vue";
    import Index from "../pages/Index.vue";
    import {mapState, mapGetters} from 'vuex';
    export default{
        computed: {
            //计算属性每次都执行
            searchPath(){
                if (this.$route.path == "/homeSearch") {
                    return '商品搜索' + this.$route.query.keyword
                } else {
                    console.log('每次都执行')
                    return this.$route.name;
                }
            },
            showLeftIcon(){
                if(this.$route.path == '/'){
                    return false;
                }else if(this.$route.path == '/my'){
                    return false;
                }else{
                    return true;
                }
            },
            ...mapGetters([
                'hideTop'
            ])
        },
        methods: {
            returnPage(){
                this.$router.go(-1)
            }
        },
        watch:{
            /*
            * 这样更新才能加上 实时更新
            * */
            /*"$route"(){
                this.fromPath=this.$route.query.fromPath;
            }*/
        },
        data(){
            return{
                fromPath:''
            }
        },
        mounted(){
            //alert('从登录页跳转到首页header到底弹不弹') //不执行
            //this.fromPath=this.$route.query.fromPath; //这样更新是加不上的 刷新才起作用
            //如何获取本路由组件？？？？？？？
            /*console.log(this)
            console.log(this.$root) //访问根实例
            console.log(this.$parent) //访问父组件
            console.log(new Vue()) //根实例
            console.log(new Vue().$root) //根实例
            console.log(new Vue()==this.$root) //false*/
            //console.log(this.$root.$children[0].$children)
            //console.log(this.$root.$children[0].$refs.topCom==this)
            //获取index组件
            //console.log(this.$route)//这是个路由对象
            //console.log(Index.methods.getCity)//Index返回值是对象不是组件  这样就可以调用其他组件的东西了
            //可以使用 内部refs找到元素后 __vue__访问对应的组件 来调用组件的东西  也可以直接将组件文件导入 用组件对象访问组件数据
            //console.log(this.$root.$children[0].$refs.pageCom.$refs.index.__vue__.getCity)
        }
    }
</script>
<style>

</style>
