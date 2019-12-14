<template>
    <div class="fapiaoHaHa" style="overflow:auto;">

        <div class="fpBg">
            <div class="fpCenter">
                <p class="p1 keKaiPrice">{{keCaiPrice}}</p>
                <p class="p2">可开票金额</p>
            </div>
        </div>

        <div class="lishiKai">
            <p class="kaiPiaoTitel">历史开票</p>
            <p class="kaiPiaoJine">已开票金额:<b id="zongKaipiao">{{zongKai}}</b></p>
        </div>

        <ul class="goods goodsKaipiao">
            <li class="goGoodes goGoodes2" v-for="(d,index) in historyList">
				<p class="p1">
					<span>申请时间：</span>
					<span>{{d.created_at}}</span>
				</p>
				<p class="p1">
					<span>公司抬头：</span>
					<span>{{d.title.title}}</span>
				</p>
				<p class="p1">
					<span>发票项目：</span>
					<span>{{d.title.item.item}}</span>
				</p>
				<p class="p1">
					<span>发票金额：</span>
					<span class="thisPrice">{{d.amount}}</span>
				</p>
				<a class="kaipiaoZhuangTai">{{d.is_mall?'已开具':'处理中'}}</a>
			</li>
        </ul>

        <a class="recivBtn bottom weiColor" v-if="minKeCai>keCaiPrice">
            提示：最低开票金额:{{minKeCai}}
        </a>
        <router-link :to="{
            path:'/myApplyFapiao',
            query:{
                keCaiPrice:keCaiPrice,
                minKeCai:minKeCai
            }
        }" class="recivBtn bottom" v-else>
            申请开票
        </router-link>

    </div>
</template>

<script>
    let obj = null;
    export default{
        name: 'fapiao',
        data(){
            return {
                keCaiPrice:'',
                minKeCai:'',
                zongKai:'',
                historyList:[],
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : ''
            }
        },
        methods: {
            //可开票金额
            canKai(){
                this.api.get(this.baseUrl + '/api/invoice/info?token=' + this.token).then(d => {
                    if(d.data.data.can_invioce>0){
                        //可开票金额 0
                        this.keCaiPrice=d.data.data.can_invioce;
                        //最低可开票金额 100
                        this.minKeCai=d.data.data.min_money;
                        //开票金额
                        this.zongKai=d.data.data.invoice_money;
                    }else{
                        //假数据
                        //可开票金额 0
                        this.keCaiPrice=1000;
                        //最低可开票金额 100
                        this.minKeCai=100;
                        //开票金额
                        this.zongKai=450;
                    }
                })
            },
            history(){
                this.api.get(this.baseUrl + '/api/invoice/list?token=' + this.token).then(d => {
                    var data=d.data.data.data;
                    if(data.length>0){
                        this.historyList=data;
                    }else{
                        data=[
                            {
                                is_mall:0,//0 处理中  1 已开具
                                created_at:4564564512,
                                title:{
                                    title:'天猫',//公司抬头
                                    item:{
                                        item:'话费'//发票项目
                                    }
                                },
                                amount:100//发票金额
                            },
                            {
                                is_mall:1,//0 处理中  1 已开具
                                created_at:4564564512,
                                title:{
                                    title:'天猫1',//公司抬头
                                    item:{
                                        item:'话费2'//发票项目
                                    }
                                },
                                amount:50//发票金额
                            },
                            {
                                is_mall:0,//0 处理中  1 已开具
                                created_at:4564564512,
                                title:{
                                    title:'天猫',//公司抬头
                                    item:{
                                        item:'话费'//发票项目
                                    }
                                },
                                amount:100//发票金额
                            },
                            {
                                is_mall:1,//0 处理中  1 已开具
                                created_at:4564564512,
                                title:{
                                    title:'天猫1',//公司抬头
                                    item:{
                                        item:'话费2'//发票项目
                                    }
                                },
                                amount:50//发票金额
                            },
                            {
                                is_mall:0,//0 处理中  1 已开具
                                created_at:4564564512,
                                title:{
                                    title:'天猫',//公司抬头
                                    item:{
                                        item:'话费'//发票项目
                                    }
                                },
                                amount:100//发票金额
                            },
                            {
                                is_mall:1,//0 处理中  1 已开具
                                created_at:4564564512,
                                title:{
                                    title:'天猫1',//公司抬头
                                    item:{
                                        item:'话费2'//发票项目
                                    }
                                },
                                amount:50//发票金额
                            }
                        ];
                        this.historyList=data;
                    }
                })
            }
        },
        mounted(){
            this.$store.dispatch('changeFooter');
            this.canKai();
            this.history();
        }
    }
</script>
<style>

</style>
