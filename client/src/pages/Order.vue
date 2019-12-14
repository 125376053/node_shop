<template>
    <div>
        <div class="order-nav">
            <ul>
                <li @click="changeBg(0,index)" v-for="(d,index) in tabButton" :part="d.part">
                    <p>
                        <img :src="d.img"/>
                        <span :style="index==curentIndex?'color:red':'color:#666'">{{d.name}}</span>
                    </p>
                    <div class="line"></div>
                </li>
            </ul>
        </div>

        <!--下拉加载更多-->
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">

            <ul class="order-content" style="display: block;padding:0 10px;margin-top:10px; background: #fff;">
                <li v-for="(d,index) in orderList" :key="index" :id="d.id">
                    <div class="orderTitel">
                        <div class="left">
                            <span class="danhao">订单号:{{d.trade_no}}</span>
                            <p class="date">
                                <span>{{d.created_at}}</span>
                            </p>
                        </div>
                        <div class="right rightText">{{statusLog(d).statusText}}</div>
                    </div>
                    <div class="shopList" v-for="(d1,index) in d.detail">


                        <router-link :id="d1.id" :to="{
                                path:'/orderDetail',
                                query:{id:d.id}
                        }" :class="{canRemove:statusLog(d).removeStyle}">
                            <div class="orderPic">
                                <div class="left">
                                    <img :src="d1.product.images">
                                    <div class="imgRight">
                                        <p class="p1">
                                            商品名称:<span>{{d1.product.product_name}}</span>
                                        </p>
                                        <p class="p2">
                                            品牌：<span>{{d1.product.brand.name}}</span>
                                        </p>
                                        <p class="p3">
                                            规格：<span :guige_id="d1.product_specs.id">{{d1.product_specs.spec_name}}</span>
                                        </p>
                                        <p class="p4">
                                            价格：<span>{{d1.price}}元</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="right">
                                    <span>数量:</span>
                                    <span>{{d1.quantity}}</span>
                                </div>
                            </div>
                        </router-link>



                    </div>
                    <div class="jiesuan">
                        <div class="heji_num">
                            <span>共{{d.sum_goods_num}}件商品</span>
                            <span>合计金额:{{d.price}}</span>
                        </div>
                        <div class="jiesuanBtn" v-if="statusLog(d).showOrhideButGroup">
                            <!--d.can_cancel==1 显示取消订单按钮 0不显示-->
                            <a class="quxiaoOrder" v-if="d.can_cancel" @click="flag=true;curOrder=d">取消订单</a>
                            <a :class="{
                                qrsh:statusLog(d).querenStyle,
                                pingjia:statusLog(d).pjStyle
                            }" class="jiesuanZhifu zhifuOrder"
                               v-if="statusLog(d).btnTextShow">{{statusLog(d).btnText}}</a>
                        </div>
                    </div>
                </li>
            </ul>
            <!--没有一条数据的时候显示-->
            <div v-if="orderList.length==0" style="width:100%;border:0;text-align: center;padding-top:1rem;">
                <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
                <p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>
            </div>
        </mt-loadmore>


        <!--订单取消弹出层-->
        <mt-popup v-model="flag">
            <div class="quxiaoTan" id="quxiaoTan" style="display: block;">
                <p class="p1">提示</p>
                <p class="p2">是否确认取消订单</p>
                <p class="p3">
                    <a class="borderRight closed" @click="quxiaoEnter">确定</a>
                    <a class="closed" @click="flag=false">取消</a>
                </p>
            </div>
        </mt-popup>

        <!--订单支付弹出层-->
        <div class="zhifuTan" id="zhifuTan">
            <div class="fk">
                <a class="wx">微信</a>
                <a class="zfb">支付宝</a>
            </div>
            <a class="clok">取消</a>
        </div>

    </div>
</template>
<script>
    export default{
        name: "order",
        data(){
            return {
                selected: 0,
                curentIndex: 0,
                status: this.$route.query.stauts || 'WAIT_PAY',//status存在就去查询参数 不存在就设置默认为第一个tab
                tabButton: [
                    {
                        part: 'WAIT_PAY',
                        img: require("../assets/images/order_tab_01@2x.png"),
                        name: '代付款'
                    },
                    {
                        part: 'PAY',
                        img: require("../assets/images/order_tab_02@2x.png"),
                        name: '待收货'
                    },
                    {
                        part: 'COMPLETE',
                        img: require("../assets/images/order_tab_03@2x.png"),
                        name: '已收货'
                    },
                    {
                        part: 'all',
                        img: require("../assets/images/order_tab_04@2x.png"),
                        name: '全部'
                    }
                ],
                allLoaded: false,
                orderList: [],
                current_page: this.$route.query.current_page ? this.$route.query.current_page : 1,
                next_page_url: '',
                flag:false,
                curOrder:null,
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : '',
            }
        },
        computed: {
            statusLog(){
                return function (d) {
                    let showOrhideButGroup = true;//是否显示按钮组
                    let btnTextShow = true; //是否显示确认按钮
                    let statusText = ''; //状态文字
                    let btnText = "";//按钮文字
                    let querenStyle = false; //确认样式
                    let pjStyle = false; //评价样式
                    let removeStyle=false; //已取消样式

                    // d.can_cancel //能否取消订单  1可以取消 0不可取
                    if (d.status === "WAIT_PAY") {
                        return {
                            statusText: '待付款',
                            btnText: '去支付',
                            removeStyle:false,
                            pjStyle:false,
                            querenStyle:false,
                            btnTextShow:true,
                            showOrhideButGroup:true
                        };
                    }

                    if (d.status === "CANCEL_BEFORE_PAY" || d.status === 'EXPIRED') {
                        return {
                            statusText: '已取消',
                            btnText: '去支付',
                            removeStyle:true,
                            showOrhideButGroup:false, //true test 应该是false
                            pjStyle:false,
                            querenStyle:false,
                            btnTextShow:false //true  test 应该是false
                        };
                    }

                    //"seller_confirm": 0, //是否点击过确认送达(点击过确认送达 订单就从待收货变为已完成)
                    if (d.status === 'PAY' && d.seller_confirm === '0') {
                        if (d.can_confirm === 0) {
                            btnTextShow = false;
                        }
                        return {
                            statusText: '待收货',
                            btnText: '确认收货',
                            btnTextShow: btnTextShow,//不显示 确认收货 d.can_confirm===0不显示
                            querenStyle: true,
                            showOrhideButGroup: true,
                            removeStyle:false,
                            pjStyle:false
                        };
                    }

                    //待收货已取消
                    if (d.status === 'CANCEL' || d.status === 'CANCEL_REFUND') {
                        return {
                            statusText: '已取消',
                            removeStyle:true,
                            btnText: '待支付',
                            showOrhideButGroup: false,
                            pjStyle:false,
                            querenStyle:false,
                            btnTextShow:false
                        };
                    }


                    if (d.status === 'REFUND' || d.status === 'REFUNING' || d.status === 'REFUNDED' || d.status === 'REJECTRETURNS' || d.status === 'REMAIN' || d.status === 'COMPLETE' || (d.status === 'PAY' && d.seller_confirm === '1')) {

                        //"is_all_comment": "F",//是否已评论过  F未全部评论  T已全部评论
                        if (d.is_all_comment === 'F') {
                            statusText = '已收货';
                            btnText = '评价';
                        } else {
                            statusText = '已评价';
                            btnText = '查看评价';
                        }

                        return {
                            statusText: statusText,
                            btnText: btnText,
                            pjStyle: true,
                            showOrhideButGroup: true,
                            removeStyle:false,
                            querenStyle:false,
                            btnTextShow:true
                        };
                    }
                }
            }
        },
        methods: {
            //背景图切换
            changeBg(flag,index){
                this.curentIndex = index;
                this.tabButton.forEach((item, orginIndex) => {
                    item.img = require('../assets/images/order_tab_0' + parseInt(orginIndex + 1) + '@2x.png');
                });
                this.tabButton[index].img = require('../assets/images/order_tab_' + parseInt(index + 1) + '@2x.png');
                this.status = this.tabButton[index].part;


                if(!flag){
                    this.current_page = 1; //点击的时候重置页码，
                }else{
                    //this.current_page = 1;//刷新的时候（路由发生改变的时候）不重置页码
                }

                //切换请求数据
                this.getData(this.current_page, this, this.curentIndex);
                //插入分页
                this.$router.push({
                    path: '/order',
                    query: {
                        current_page: this.current_page,
                        status: this.status
                    }
                });
            },
            routeChange(){
                //没有路由记录
                if (this.$route.query.status===undefined) {
                    this.curentIndex = 0;
                    this.changeBg(1,this.curentIndex)
                }
                //路由发生改变
                if (this.$route.query.status === "WAIT_PAY") {
                    this.curentIndex = 0;
                    this.changeBg(1,this.curentIndex)
                }
                if (this.$route.query.status === "PAY") {
                    this.curentIndex = 1;
                    this.changeBg(1,this.curentIndex)
                }
                if (this.$route.query.status === "COMPLETE") {
                    this.curentIndex = 2;
                    this.changeBg(1,this.curentIndex)
                }
                if (this.$route.query.status === "all") {
                    this.curentIndex = 3;
                    this.changeBg(1,this.curentIndex)
                }
            },
            //获取数据
            getData(n, that, index){
                this.api.get(this.baseUrl + '/api/order/list?token=' + that.token, {
                    part: this.tabButton[index].part,
                    page: n
                }).then(d => {
                    console.log(d.data)
                    this.orderList = d.data.data.data;

                    //没有数据 或者数据不够一页20条 隐藏加载更多提示
                    if (this.orderList.length === 0 || this.orderList.length <= 19) {
                        document.querySelector('.mint-loadmore-bottom').style.display = "none";
                    } else {
                        document.querySelector('.mint-loadmore-bottom').style.display = "block";
                    }

                    //记录还有没有下一页提示
                    this.next_page_url = d.data.data.next_page_url;

                    this.dargLeftinit();
                })
            },
            loadBottom(){
                if (this.next_page_url === null) {
                    this.$toast({
                        message: '没有更多数据了',
                        position: 'bottom',
                        duration: 5000
                    });
                    this.allLoaded = true;// 若数据已全部获取完毕
                } else {
                    this.current_page++;

                    //上啦加载数据
                    this.getData(this.current_page, this, this.curentIndex);

                    //插入分页
                    this.$router.push({
                        path: '/order',
                        query: {
                            current_page: parseInt(this.$route.query.current_page) + 1 || this.current_page,
                            status: this.status
                        }
                    });
                }

                this.$refs.loadmore.onBottomLoaded();
            },

            dargLeftinit(id){
                this.$nextTick(function(){
                    //获取所有可以取消的
                    var canRemove=document.querySelectorAll('.canRemove');
                    for(var i=0;i<canRemove.length;i++){
                        this.dargLeft(canRemove[i],function(id){
                            console.log(id)
                        });
                    }
                })
            },
            dargLeft(obj,fn){
                this.$nextTick(function(){
                    obj.addEventListener('touchstart',function(ev){
                        var oTouch = ev.targetTouches[0];
                        var disX1 = oTouch.pageX;
                        obj.addEventListener('touchmove',move,false);
                        obj.addEventListener('touchend',end,false);

                        function move(ev){
                            let oTouch = ev.targetTouches[0];
                            let disX2 = oTouch.pageX;
                            if(disX1-disX2>0){
                                if(disX1-disX2>100){
                                    setTimeout(function(){
                                        console.log('左滑动');
                                        if(obj.parentNode){
                                            if(obj.querySelectorAll('.leftRemove').length>0){
                                                return;
                                            }else{
                                                let orderPic=obj.querySelectorAll('.orderPic');
                                                let a=document.createElement('a');
                                                a.className="leftRemove";
                                                a.innerHTML="删除";
                                                for(let i=0;i<orderPic.length;i++){
                                                    orderPic[i].appendChild(a);
                                                }
                                            }
                                            let leftRemove=obj.querySelector('.leftRemove');
                                            leftRemove.onclick=function(){
                                                obj.parentNode.removeChild(obj);
                                                fn&&fn(obj.getAttribute('id'));
                                                return false;
                                            }
                                        }
                                    },200)
                                }
                            }else{
                                if(disX2-disX1>100){
                                    setTimeout(function(){
                                        let leftRemove=obj.querySelector('.leftRemove');
                                        if(leftRemove){
                                            leftRemove.parentNode.removeChild(leftRemove);
                                        }
                                    },200)
                                }
                            }
                        }

                        function end(){
                            document.removeEventListener('touchmove',move,false);
                            document.removeEventListener('touchend',end,false);
                        }
                    },false);
                })
            },

            //需要知道取消的是谁
            quxiaoEnter(){
                this.flag=false;
                let id=this.curOrder.id;
                this.api.get(this.baseUrl+'/api/order/cancel/get?token='+this.token,{
                    id:id
                }).then(d=>{
                    console.log(d)
                });
            }
        },
        mounted(){
            //路由发生改变
            this.routeChange()
        }
    }
</script>
<style>
    .order-nav mt-tab-item {
        width: 25%;
        height: 0.88rem;
    }

    .order-nav mt-tab-item img {
        display: block;
        width: 0.28rem;
        height: 0.2rem;
        margin-top: 0.15rem;
        margin-bottom: 0.05rem;
    }

    .order-nav mt-tab-item span {
        display: block;
        font-size: 0.28rem;
        color: #333;
    }

</style>
