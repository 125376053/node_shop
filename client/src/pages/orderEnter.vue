<template>
    <div class="page1">

        <div class="adress"></div>

        <ul class="order-content enterOrder-content" style="margin-bottom:0;"></ul>

        <div class="zuhedi" style="background: #fff;">
            <div class="enter-quan">
                <span>积分</span>
                <span class="jifen"></span>
            </div>
            <div class="enter-quan">
                <span>合计</span>
                <span class="enterOrderPrice"></span>
            </div>
            <div class="enter-quan">
                <span>优惠券</span>
                <p class="showSelectQuan" style="display: -webkit-box;">
                    <span class="hasQuan"></span>
                    <img class="show-hook" src="../assets/images/returnRight.png" style="width: 0.15rem;height: .28rem;">
                </p>
            </div>
        </div>

        <div class="enterOrder">
            <div class="eob">
                <div>
                    <p>
                        <span>共计<i class="enterOrderNum"></i></span>
                        <span>待支付:<i class="newPrice"></i></span>
                    </p>
                    <p style="color:#666;">请在<span class="longTime"></span>小时内完成付款</p>
                </div>
                <a class="enterOrderPay weixin" id="weixin">支付</a>
            </div>
        </div>

        <!--订单支付弹出层-->
        <div class="zhifuTan" id="enterOrderTan">
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
        name:'orderEnter',
        data(){
            return{
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : '',
            }
        },
        methods:{
            getData(that){
                //接口报错
                $.ajax({
                    url: this.baseUrl + '/api/order/previous?token='+that.token,
                    type: 'get',
                    data: {
                        id:JSON.parse(localStorage.getItem('jieSuanBtnClickGoOrder'))
                    },
                    success: function (d) {
                        console.log(d)
                    }
                })
            }
        },
        mounted(){
            this.getData(this);
        }
    }
</script>
<style>

</style>
