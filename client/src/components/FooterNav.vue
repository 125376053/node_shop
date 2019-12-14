<template>
    <div class="orderFooter" ref="footer" v-if="hideFooter">
        <ul>
            <li v-for="(item,index) in bai" @click="change(index)">
                <router-link :to="{path:luyou[index].zhuan}">
                    <p>
                        <b :class="[[bai[index]],{active:currIndex==index}]"></b>
                        <span :class="{active2:currIndex2==index}">{{text[index]}}</span>
                    </p>
                </router-link>
            </li>
        </ul>
    </div>
</template>
<script>
    import {mapState,mapGetters} from 'vuex';
    export default{
        computed:{
            ...mapGetters([
                'hideFooter'
            ])
        },
        data(){
            return{
                currIndex:0,
                currIndex2:0,
                bai:["first1","sencond1","three1","four1"],
                bai2:["first1","sencond1","three1","four1"],
                hui:["first11","sencond11","three11","four11"],
                text:["主页","购物车","订单","我的"],
                luyou:[
                    {zhuan:'/'},
                    {zhuan:'/cart'},
                    {zhuan:'/order'},
                    {zhuan:'/my'}
                ]
            }
        },
        methods:{
            change(index){
                this.currIndex2=index;
                //this.bai[index]=this.hui[index] //这个不是响应式的改变模型不更新视图
                this.currIndex=-9999;
                this.bai.forEach((item,index)=>{
                    this.$set(this.bai,index,this.bai2[index])
                });
                this.$set(this.bai,index,this.hui[index])
            },
            init(){
                if(this.$route.path=="/"){
                    this.currIndex2=0;
                    this.change(this.currIndex2)
                }
                if(this.$route.path=="/cart"){
                    this.currIndex2=1;
                    this.change(this.currIndex2)
                }
                if(this.$route.path=="/order"){
                    this.currIndex2=2;
                    this.change(this.currIndex2)
                }
                if(this.$route.path=="/my"){
                    this.currIndex2=3;
                    this.change(this.currIndex2)
                }

                //这里匹配变红
                var path=this.$route.path;
                var flag=path.indexOf('my');
                console.log(flag)
                if(flag>0){
                    this.currIndex2=3;
                    this.change(this.currIndex2)
                }
            }
        },
        /*
        * Vue.js 提供了一个方法 watch，它用于观察Vue实例上的数据变动。
        * 对应一个对象，键是观察表达式，
        *       值是对应回调。
        *       值也可以是方法名，
        *       或者是对象，
        *       包含选项。
        *
        *
        * */
        watch:{
            "$route"(){
                //console.error('mounted不会每次执行 但是watch会每次执行，监控路由实时更新')
                this.init(); //watch才是每次都会执行 包括手动替换路由也触发
            }
        },

        mounted(){
            //只有刷新的时候才会执行这里
            //alert('从登录页跳转到首页footer到底弹不弹') //不执行
            //console.warn('刷新才执行,每次跳转页面不会执行')
            this.init();
        }
    }
</script>
<style scoped>
    li>p{ text-align: center;}
    b{ display:inline-block;}
    .first1{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_01@2x.png") no-repeat; background-size: 100% 100%;}
    .first11{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_1@2x.png") no-repeat; background-size: 100% 100%;}
    .sencond1{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_02@2x.png") no-repeat; background-size: 100% 100%;}
    .sencond11{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_2@2x.png") no-repeat; background-size: 100% 100%;}
    .three1{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_03@2x.png") no-repeat; background-size: 100% 100%;}
    .three11{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_3@2x.png") no-repeat; background-size: 100% 100%;}
    .four1{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_04@2x.png") no-repeat; background-size: 100% 100%;}
    .four11{ width:0.4rem;height:0.4rem; background: url("../assets/images/footer_4@2x.png") no-repeat; background-size: 100% 100%;}
    .active{width:0.4rem;height:0.4rem; background: url("../assets/images/footer_1@2x.png") no-repeat; background-size: 100% 100%;}
    .active2{color:red;}
</style>
