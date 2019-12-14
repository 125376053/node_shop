<template>
    <div class="quan-tab">

        <TabCom :buttonData="['可用','已使用','已过期']" :tabIndex="0">
            <!--还有一种开发思路是使用路由写
                1 1个路由代表一个内容
                2 切换用的是router-link
            -->
            <!--我现在当做是tab选项卡使用 不需要做路由切换-->
            <!--content内容区域用一个来展示 可以避免写很多代码-->
            <ul class="content">

                <li :class="index%2?'redbg':'bluebg'"  v-for="(d,index) in dataList">
                    <!--过期-->
                    <div class="shiyong" v-if="type=='used'"></div>
                    <!--使用-->
                    <div class="guoqi" v-if="type=='expired'"></div>

                    <div class="top" :class="type=='expired'?'guoqitou':''">
                        <span class="price">{{parseInt(d.coupons_data.count_price)}}</span>
                        <span class="yuan">元</span>
                        <span class="quan">优惠券</span>
                    </div>
                    <div class="bot" :class="{guoqijiao:type=='expired'}">
                        <div class="left">
                            <span class="icon" :class="{guoqipic:type=='expired'}"></span>
                            <span class="title" :class="{guoqizi:type=='expired'}">订单满
                                <i>{{parseFloat(d.coupons_data.use_price).toFixed(2)}}</i>
                                可使用</span>
                        </div>
                        <div class="right">
                            <span class="icon"></span>
                            <!--<span class="title">{{ new Date().getTime()/1000 | getDateFn}}</span>-->
                            <span class="title">{{ d.coupons_data.end_time | getDateFn}}</span>
                        </div>
                    </div>
                </li>

            </ul>

        </TabCom>

        <div v-if="dataList.length<=0" style="width:100%;border:0;text-align: center;padding-top:1rem;">
            <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
            <p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import TabCom from "../components/TabCom.vue";
    export default{
        name: "youhuiquan",
        components:{
            TabCom
        },
        data(){
            return{
                type:'can_use',
                token:this.userInfor?this.userInfor.token:JSON.parse(window.localStorage.getItem('userInfoObj'))?JSON.parse(window.localStorage.getItem('userInfoObj')).token:'',
                dataList:[]
            }
        },
        computed:{
            ...mapGetters([
                'userInfor'//vuex的数据 刷新就会丢失
            ])
        },
        methods:{
            changeIndex(){
                this.busEvent.$on('tabIndex',index=>{
                    this.type=index===0?'can_use':index===1?'used':'expired';
                    this.sendData(this.type);
                    console.log(this.type)
                    this.$router.push({
                        path:'/myYouHuiQuan',
                        query:{
                            type:this.type
                        }
                    })
                })
            },
            sendData(type){
                this.api.get(this.baseUrl+"/api/seller/coupons/list?token="+this.token,{
                    area_id:window.localStorage.getItem('area_id'),
                    type:type,
                    price:0
                }).then(d=>{
                    console.log(d)
                    if(d.data.data.length>0){
                        //操作真实数据
                        this.dataList=d.data.data;
                    }else{
                        //假数据模拟
                        this.dataList=d.data.data=[
                            {
                                "id": 19,
                                "coupon_id": 1,
                                "user_id": 1,
                                "is_used": 0,
                                "order_id": 0,
                                "created_at": null,
                                "updated_at": null,
                                "coupons_data": {
                                    "id": 1,
                                    "use_price": "38.00",
                                    "count_price": "5.00",
                                    "start_name": 1497024000,
                                    "end_time": 1501516800
                                }
                            },
                            {
                                "id": 20,
                                "coupon_id": 1,
                                "user_id": 1,
                                "is_used": 0,
                                "order_id": 0,
                                "created_at": null,
                                "updated_at": null,
                                "coupons_data": {
                                    "id": 1,
                                    "use_price": "38.00",
                                    "count_price": "10.00",
                                    "start_name": 1497024000,
                                    "end_time": 1501516800
                                }
                            }
                        ];
                    }
                })
            }
        },
        mounted(){
            this.changeIndex();
            this.sendData(this.type);
            if(!this.$router.query){
                //第一次repalce 切换的时候push 可防止第一次点击从有query产生没有query的历史记录
                this.$router.replace({
                    path:'/myYouHuiQuan',
                    query:{
                        type:this.type
                    }
                })
            }
        }
    }
</script>
<style>
    .tabBtn {
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: Justify;
        height: .8rem;
        border-bottom: 1px solid #dedede;
    }

    .tabBtn li {
        width: 33.3%;
        height: .5rem;
        text-align: center;
        font-size: .28rem;
        color: #666;
        padding: .15rem auto;
        line-height: .5rem;
        border-right: 1px solid #dedede;
        box-sizing: border-box;
    }

    .tabBtn li:last-child {
        border: 0;
    }

    .tabBtn li.current {
        color: #ed5564;
    }

    .content {
        width: 6.38rem;
        overflow: hidden;
        margin: 0 auto;
    }

    .content li {
        width: 100%;
        height: 2.64rem;
        margin-top: .3rem;
        position: relative;
    }

    .redbg {
        background: url("../assets/images/quan5.png");
        background-size: contain;
    }

    .bluebg {
        background: url("../assets/images/quan10.png");
        background-size: contain;
    }

    .huibg {
        background: url("../assets/images/huibg.png");
        background-size: contain;
    }

    .content li .top {
        font-family: '微软雅黑';
        color: #fff;
    }

    .content li .top .price {
        font-size: 1.4rem;
        padding-left: .5rem;
        padding-right: 0rem;
        font-weight: bold;
    }

    .content li .top .yuan {
        font-size: .5rem;
    }

    .content li .top .quan {
        font-size: .7rem;
        padding-left: .3rem;
    }

    .bot {
        height: .65rem;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: Justify;
    }

    .bot .left {
        height: .65rem;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: center;
        width: 48%;
    }

    .bot .left span {
        display: block;
    }

    .bot .left .icon {
        width: .3rem;
        height: .23rem;
        background: url("../assets/images/tip.png");
        background-size: contain;
    }

    .bot .left .title {
        color: #f29c9f;
        font-size: .2rem;
        -webkit-text-size-adjust: none
    }

    .bot .right {
        height: .65rem;
        display: -webkit-box;
        -webkit-box-align: center;
        -webkit-box-pack: center;
        width: 52%;
    }

    .bot .right span {
        display: block;
    }

    .bot .right .icon {
        width: .3rem;
        height: .3rem;
        background: url("../assets/images/time.png");
        background-size: contain;
    }

    .bot .right .title {
        color: #959595;
        font-size: .2rem;
        -webkit-text-size-adjust: none
    }

    .shiyong {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5) url("../assets/images/shiyong.png") no-repeat center center;
        background-size: 1.86rem 1.63rem;
    }

    .guoqi {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .2) url("../assets/images/guoqi.png") no-repeat center center;
        background-size: 1.86rem 1.63rem;
    }

    .guoqitou {
        background: #cacaca;
    }

    .guoqijiao {
        background: #e0e0e0;
    }

    .bot .left .guoqizi {
        color: #959595;
    }

    .bot .left .guoqipic {
        width: .3rem;
        height: .23rem;
        background: url("../assets/images/guoqipic.png");
        background-size: contain;
    }

    /*.content{ display: block;}
    .currentShow{ display: block;}*/
</style>
