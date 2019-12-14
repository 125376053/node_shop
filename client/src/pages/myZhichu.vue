<template>
    <div ref="hehe">
        <div class="fpBg">
            <div class="fpCenter">
                <p class="p1"><i id="zongZhichu">{{zongPrice}}</i><span>元</span></p>
                <p class="p2">总消费支出:</p>
            </div>
        </div>

        <div class="chart">
            <div id="main"></div>
            <div class="tubiaoText">
                <p class="tb1" v-for="(item,index) in zhichuData">
                    <span class="img"><img :src="images[index]"></span>
                    <span class="text">{{item.name}}</span>
                    <span class="price">{{item.money}}元</span>
                </p>
            </div>
        </div>

        <div class="fenLeiZhichu">
            <ul>
                <!--展开收缩效果逻辑  给自己对象下面的flag设置为真假进行自己的切换-->
                <li v-for="(d1,index) in zhichuData" @click="changeFlag(d1)">
                    <a class="clickme">
                        <p>
                            <span class="redSe"></span>
                            <span class="text">{{d1.name}}<i>{{d1.money}}</i></span>
                        </p>
                        <b class="down"></b>
                    </a>
                    <div class="listZhichu" style="display:block;" v-if="d1.flag">
                        <div class="items" v-for="(d,indeex) in d1.child">
                            <p class="tText">
                                <span class="span1">{{d.name}}</span>
                                <span class="span2">消费金额<i>{{d.money}}</i></span>
                            </p>
                            <!--滑动块百分比=(现在的价格/总价)*100-->
                            <div class="tPic">
                                <span class="redSpan" :style="'width:'+(d.money/d1.money)*100+'%'"></span>
                            </div>
                        </div>

                    </div>
                </li>

            </ul>
        </div>


        <a class='recivBtn bottom hasBtn' id="allZhichu" @click="sheetVisible=true">所有支出</a>


        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>


    </div>
</template>
<script>
    //扯淡 这样刷新的时候数据获取才对  没办法做到实时更新检测token到底存不存在
    //var token=window.localStorage.getItem('userInfoObj')?JSON.parse(window.localStorage.getItem('userInfoObj')).token:'';
    //所以只能用vuex+localstore的方式获取token
    import {mapGetters} from "vuex";
    var obj=null; //全局定义一个空对象
    import api from '../api';
    import Vue from "vue";
    export default{
        name:"zhichu",
        mounted(){
            //初始化请求
            this.sendData(this.time);
            this.$store.dispatch('changeFooter');

            /*
            *  this.$refs.hehe 定义在组件标签上 访问的是子组件
            *                  定义在组件内部 访问的是元素节点
            *
            * */
            obj=this;

        },
        data(){
            return {
                time: 0,
                token:this.userInfor?this.userInfor.token:JSON.parse(window.localStorage.getItem('userInfoObj'))?JSON.parse(window.localStorage.getItem('userInfoObj')).token:'',
                zhichuData: [
                    {
                        name: '手机',
                        money: 5000,
                        child: [
                            {
                                name: '红米',
                                money: 2000,
                            },
                            {
                                name: '小米',
                                money: 3000,
                            }
                        ]
                    },
                    {
                        name: '路由器',
                        money: 1120,
                        child: [
                            {
                                name: '青春版',
                                money: 120,
                            },
                            {
                                name: '初级版',
                                money: 500,
                            },
                            {
                                name: '发烧版',
                                money: 500,
                            }
                        ]
                    },
                ],
                images: [
                    require('../assets/images/tbico1.jpg'),
                    require('../assets/images/tbico2.jpg'),
                    require('../assets/images/tbico3.jpg'),
                    require('../assets/images/tbico4.jpg')
                ],
                sheetVisible: false,
                actions:[
                    {
                        name: '所有支出',
                        method(){
                            obj.time=obj.$root.timeAgo(0);
                            obj.sendData(obj.time);
                        }
                    },
                    {
                        name: '一年前支出',
                        method(){
                            obj.time=new Vue().timeAgo(365);
                            obj.sendData(obj.time);
                        }
                    },
                    {
                        name: '半年前支出',
                        method(){
                            obj.time=new Vue().timeAgo(365/2);
                            obj.sendData(obj.time);
                        }
                    }
                ]
            }
        },
        computed: {
            zongPrice(){
                var price = 0;
                this.zhichuData.forEach((d) => {
                    price += parseFloat(d.money);
                })
                return price.toFixed(2);
            },
            ...mapGetters([
                'userInfor'//vuex的数据 刷新就会丢失
            ])
        },
        methods: {
            sendData(n){
                api.get(this.baseUrl + '/api/seller/myaccount?token='+this.token,{
                    time: n
                }).then(d => {
                    console.log(d);
                    if (d.data.length > 0) {
                        this.charts(d.data.data);
                    } else {
                        //用假数据
                        this.charts(this.zhichuData);
                    }
                })
            },
            charts(data){
                var color = ['#ff6691', '#ffe555', '#c689ff', '#649cf9']; //图表颜色
                const arr = [];
                data.forEach((d) => {
                    arr.push({
                        value: d.money
                    });
                });
                //基于准备好的dom，初始化echarts实例
                var main=document.getElementById('main');
                if(!main){
                    return false;
                }
                const myChart = echarts.init(main);
                myChart.setOption({
                    series: [
                        {
                            type: 'pie',
                            //radius : [10,50], //圆环范围 20-90之间 最大0-100
                            radius: ['15%', '85%'],
                            data: arr,
                            labelLine: {
                                normal: {
                                    show: false     //不需要设置引导线
                                }
                            },
                            color: color
                        }
                    ]
                })
            },
            changeFlag(d1){
                //d1.flag 一开始不存在
                //点击设置值
                if (d1.flag) {
                    d1.flag = false;
                } else {
                    //所有的设置为假
                    this.zhichuData.forEach((d, index) => {
                        this.$set(d, 'flag', false);
                    });
                    //当前设置为真
                    this.$set(d1, 'flag', true);
                }
            }
        }
    }
</script>
<style>

</style>
