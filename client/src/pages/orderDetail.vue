<template>

    <div>
        <div class="adress">
            <p class="p1">收货地址</p>
            <p class="p2">
                <span class="tubiao"><img src="../assets/images/pepol_ico.jpg"></span>
                <span>收货人：</span>
                <span v-if="!audit">{{storeData.contacts}}</span>
                <input v-else type="text" placeholder="请输入收货人姓名">
            </p>
            <p class="p2">
                <span class="tubiao"><img src="../assets/images/tel_ico.jpg"></span>
                <span>电话：</span>
                <span v-if="!audit">{{storeData.mobile}}</span>
                <input v-else type="text" placeholder="请输入联系电话">
            </p>
            <p class="p2 noneBottomborder">
                <span class="tubiao"><img src="../assets/images/map_ico.jpg"></span>
                <span>收货地址：</span>
                <!--<span v-if="!audit" class="cityBtn" :area_id="storeData.area?storeData.area.id:''">
                    {{storeData.area?storeData.area.name:''}}
                </span>-->
                <!--数据没有及时更新进去获取数据失败的时候 判断下这个对象是不是存在 这在2层对象下面的属性才会有这问题-->
                <span v-if="!audit&&storeData.area" class="cityBtn" :area_id="storeData.area.id">
                    {{storeData.area.name}}
                </span>
                <span v-if="!audit" class="adressInfor">{{storeData.address}}</span>
                <input v-else type="text" placeholder="请输入详细地址" class="adressInfor">
            </p>
            <div class="beizhu">
                <div class="zitip">
                    <p class="ptitle">备注信息：</p>
                    <p v-if="!audit" style="color:#666;">{{orderData.remark}}</p>
                    <textarea v-else placeholder="请输入备注信息"></textarea>
                </div>
            </div>
        </div>

        <ul class="order-content orderDetail-content">
            <li class="orderPadding colorF" v-for="(d,index) in orderData.detail">

                <router-link :to="{path:'/goodsDetail',query:{rels_id:d.rels_id}}">
                    <p class="shopName">{{d.product.product_name}}</p>

                    <router-link class="returnGoodsBtn"
                                 v-if="parseFloat(d.price).toFixed(2)>=0.00 && orderData.canrefund==='F'"
                                 :id="d.id"
                                 :to="{
                            path:'/orderApplyReGoods',
                            query:{
                                order_id:orderData.id,
                                order_detail_id:d.id,
                                return_goods_num:d.hidden_num,
                                trace_no:orderData.trade_no
                            }
                        }">
                        {{changeStatus(orderData,d).thStr}}

                    </router-link>

                    <div class="orderPic orderPicAdress">
                        <div class="left">
                            <img :src="d.product.images">
                            <div class="imgRight imgRight2">
                                <p class="p2">品牌：<span>{{d.product.brand.name}}</span></p>
                                <p class="p3">规格：<span>{{d.product_specs.spec_name}}</span></p>
                                <p class="p4">价格：<span class="enOrPrice">{{d.price}}</span>元</p>
                            </div>
                        </div>
                        <div class="right right2">
                            <span>数量:</span>
                            <span class="enOrNum">{{d.quantity}}</span>
                        </div>
                    </div>
                </router-link>

            </li>
        </ul>

        <div class="detailFooter orderDetailFooter" style="position: static;margin-bottom:1.5rem;">
            <div class="jiesuan jiesuan2">
                <div class="heji_num2">
                    <span class="marginRight">共计{{orderData.sum_goods_num}}件</span>
                    <span>合计金额:<i class="oldPrice">{{orderData.price}}</i></span>
                </div>
                <div class="heji_num2">
                    <span>获得积分:</span>
                    <span>{{orderData.score}}</span>
                </div>
                <div v-if="orderData.status==='PAY' && orderData.seller_confirm==='0'" class="heji_num2">
					<span>实际金额:</span>
					<span class="newPrice"></span>
				</div>
                <div class="heji_num2">
                    <span>订单编号:</span>
                    <span>{{orderData.trade_no}}</span>
                </div>
                <div class="heji_num2">
                    <span>订单时间:</span>
                    <span>{{orderData.created_at}}</span>
                </div>
                <div v-if="orderData.can_cancel<1 || (orderData.status==='CANCEL' || orderData.status==='CANCEL_REFUND')" class="heji_num2 cancleTime">
                    <span>取消时间:</span>
                    <span>{{orderData.cancel_time}}</span>
                </div>

                <div v-if="orderData.can_cancel===1" class="heji_num2">
                    <span>付款方式:</span>
                    <span>{{orderData.pay_way}}</span>
                </div>
                <div v-if="orderData.can_cancel===1" class="heji_num2">
                    <span>付款时间:</span>
                    <span>{{orderData.pay_time}}</span>
                </div>
                <div style="display: -webkit-box;" v-if="orderData.can_cancel===1">
                    <a v-if="orderData.can_confirm!==0" class="quxiaoOrder">取消订单</a>
                    <a v-if="orderData.can_confirm!==0" :id="orderData.id" class="recivBtn">确认收货</a>
                    <a v-if="orderData.can_confirm===0" class="quxiaoOrder">取消订单</a>
                </div>
                <div class="heji_num2" v-if="changeStatus(orderData).pjShow">
                    <span>收货时间:</span>
                    <span>{{orderData.seller_confirm_time}}</span>
                </div>

                <router-link v-if="changeStatus(orderData).pjShow"
                    :to="{path:'/orderEvaluate',query:{order_id:orderData.id}}" class="recivBtn" style="background: none;">
                    {{changeStatus(orderData).pjStr}}
                </router-link>

                <div class="jiesuanBtn2" v-if="changeStatus(orderData).qxOrder">
                    <a class="quxiaoOrder">取消订单</a>
                    <router-link :to="{path:'/goodsDetail',query:{rels_id:d.rels_id}}" class="jiesuanZhifu zhifuOrder">
                        {{changeStatus(orderData).statusText}}
                    </router-link>
                </div>
            </div>
        </div>

    </div>

</template>
<script>
    export default{
        name: 'orderDetail',
        data(){
            return {
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : '',
                id: this.$route.query.id || '',
                orderData: [],
                storeData: {}, //用户信息
                audit: 0,//"need_create": 0,//0不需要填写 1 需要填写
            }
        },
        computed: {
            changeStatus(){
                return function (arr,d) {

                    let thStr = '';//退货文字
                    let qxOrder=0; //是否可以取消订单  1可以取消 0不可取消  控制按钮组是否显示
                    let statusText=''; //几种状态下的文字
                    let qrshFlag=1;//是否显示确认收货
                    let pjStr='';
                    let pjShow=false;

                    //待付款   "can_cancel": 能否取消订单  1可以取消 0不可取消
                    if(this.orderData.status==='WAIT_PAY'){
                        if(this.orderData.can_cancel===1){
                            qxOrder=1;//1可以取消订单------取消订单按钮显示
                            statusText='去支付';
                        }else{
                            qxOrder=0; //不可取消订单 订单按钮不显示
                        }
                    }

                    //待付款 -- 已取消
                    if(this.orderData.status==='CANCEL_BEFORE_PAY' || this.orderData.status==='EXPIRED'){
                        qxOrder=0;
                    }


                    //待收货2种状态  -------待收货( 2种状态 可取消订单 不可取消订单 )"
                    // "seller_confirm": 0,是否确认收货 0未确认收货 1已确认收货
                    if(this.orderData.status==='PAY' && this.orderData.seller_confirm==='0'){
                        //"can_cancel": 1,  //能否取消订单  1可以取消 0不可取消
                        //this.orderData.can_cancel=1;
                        if(this.orderData.can_cancel===1){
                            qxOrder=1;//可以取消订单------取消订单按钮显示
                        }else {
                            qxOrder =0;//不可取消订单
                        }
                        statusText='确认收货';
                    }


                    if(this.orderData.status==='CANCEL' || this.orderData.status==='CANCEL_REFUND'){
                        qxOrder=0;
                    }
                    //已收货页面 "is_all_comment": "F",//是否已评论过  F未全部评论  T已全部评论
                    if(this.orderData.status==='REFUND' || this.orderData.status==='REFUNING' || this.orderData.status==='REFUNDED' || this.orderData.status==='REJECTRETURNS' || this.orderData.status==='REMAIN' || this.orderData.status==='COMPLETE' || (this.orderData.status==='PAY' && this.orderData.seller_confirm==='1')){

                        pjShow=true;

                        if(orderData.is_all_comment==='F'){
                            pjStr='评价'
                        }else{
                            pjStr='查看评价'
                        }

                    }


                    if(d){
                        //能否申请退货 T标识能申请退货 F不能申请退货
                        //console.log(this.orderData.canrefund) //测试的时候改成F
                        //console.log(d.status)

                        d.status="NORMAL"; //测试退货 F也是 正确应该是T
                        if (this.orderData.canrefund === 'F') {
                            //NORMAL：正常(可以申请退款),REFUNDED：已完成退货(已退货),RETURN：退货中,REFUNDFAIL:退货失败，REMAIN：已部分退货(已退货)'
                            if (d.status === 'NORMAL') {
                                console.log('退货');
                                thStr = '退货';//可以退货 当前订单当前商品
                            }
                            if (d.status === 'REFUNDED') {
                                console.log('已退货');
                                thStr = '已退货';
                            }
                            if (d.status === 'RETURN') {
                                console.log('退货中');
                                thStr = '退货中';
                            }
                            if (d.status === 'REFUNDFAIL') {
                                console.log('退货失败');
                                thStr = '退货失败';
                            }
                            if (d.status === 'REMAIN') {
                                console.log('已部分退货');
                                thStr = '已部分退货';
                            }
                            if (d.status === 'CANCEL') {
                                console.log('已取消');
                                thStr = '已取消';
                            }
                        }
                    }

                    return {
                        thStr: thStr, //没有块级作用于 块级作用于是指在块内声明的变量 这个变量在if之上
                        qxOrder:qxOrder,
                        statusText:statusText,
                        pjStr:pjStr,
                        pjShow:pjShow
                    }
                }
            }
        },
        methods: {
            getData(){
                this.api.get(this.baseUrl + '/api/order/info?token=' + this.token, {
                    id: this.id
                }).then(d => {
                    console.log(d);
                    this.audit = d.data.data.need_create;
                    this.storeData = d.data.data.store_data;

                    this.orderData = d.data.data.order_data;
                    console.log(this.orderData.detail[0].price)
                });
            },
        },
        mounted(){
            this.getData();
        }
    }
</script>
<style>
    a.quxiaoOrder{display:block;width:50%;height: 0.99rem;font-size: 0.28rem;color: #333;text-align: center;line-height: 0.99rem;margin-top:.2rem;border-top:1px solid #dedede;background:#d4d4d4;color:#fff;}
</style>
