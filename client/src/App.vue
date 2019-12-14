<template>
    <div id="app">

        <!--页头-->
        <Top ref="topCom"></Top>

        <!--keep-alive缓存数据 适合列表返回详情 记录数据和滚动条位置 刷新的时候失效-->
        <!--exclude="login,my" -->


        <!--如果组件没有写name keep-alive会缓存组件-->
        <!--即使 keep-alive声明 inclide对于没有name的组件 依然视为无效 仍会被缓存-->
        <!--所以必须每个组件都带上name 在使用keep-alive的时候 include标识需要被缓存 如果不在include内 就表示不缓存-->
        <!--<keep-alive include="list">
            <router-view ref="pageCom" class="wrapper"></router-view>
        </keep-alive>-->
        <keep-alive include="list">
            <router-view ref="pageCom" class="wrapper"></router-view>
        </keep-alive>

        <!--页脚-->
        <FooterNav ref="botCom"></FooterNav>

    </div>
</template>

<script>
    import Top from "./components/Header.vue";
    import Index from "./pages/Index.vue";
    import FooterNav from "./components/FooterNav.vue";
    import {mapState, mapGetters} from 'vuex';
    export default{
        name:'app',
        components: {
            Top,
            Index,
            FooterNav
        },
        watch: {
            //watch 和computed 能每次都执行 但是mounted等生命周期函数不行
            '$route'(to, from){
                this.$store.dispatch('changeFooter2'); //组件内发射一个动作到actions
            }
        },

        mounted(){

        }
        /*
        * 头和尾组件 里面 全部让头尾显示
        * 不需要头尾的页面在修改头尾状态 login页面隐藏头尾 跳转到首页 首页的头尾就不显示了 这是单一状态已经全部为假 要显示重新派发动作
        *
        * */
    }
</script>

<style>
.wrapper{position:absolute;left:0;right:0;top:.89rem;bottom:1.2rem;background:#fff;}
</style>
