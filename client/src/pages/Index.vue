<template>
    <div ref="index">

        <!--首页轮播图-->
        <div class="new_banner">
            <mt-swipe :auto="0">
                <mt-swipe-item v-for="(item,index) in swiperList" :key="index">
                    <img :src="item.href" alt="" style="max-width: 100%; width: 100%;">
                </mt-swipe-item>
            </mt-swipe>
            <div class="city">
                <span class="cityName" @click="nameSelectCity">{{cityName}}</span>
                <span class="cityMap"></span>
            </div>
            <div class="search" id="homeSearch">
                <input type="text" placeholder="搜索商品" v-model="searchKey">
                <p class="searchBtn" @click="searchFn">
                    <img src="../assets/images/searchBtn.png">
                </p>
            </div>

        </div>

        <!--首页导航-->
        <div class="indexNav">
            <ul>
                <li v-for="(cad,index) in categoryList">
                    <router-link :to="{path:'/allGoods',query:{category_id:cad.id,category_name:cad.name,pageIndex:1}}">
                        <img :src='cad.logo'>
                        <p>{{cad.name=='全部分类'?'所有':cad.name}}</p>
                    </router-link>
                </li>
            </ul>
        </div>

        <!--首页商品列表-->
        <div class="homeList" style="background: #fff;">
            <ul class="list_game">
                <li class="orderPic" style="height:2.4rem; overflow: hidden;" v-for="(item,index) in goodsListData">
                    <router-link :to="{path:'/goodsDetail',name:'商品详情',params:{rels_id:item.info.rels_id}}">
                        <div class="left" style="width: 100%;">
                            <img :src="item.images" style="width: 1.9rem;height:1.9rem;">
                            <div class="imgRight" style="width: 4.7rem;">
                                <p class="p1" style="width: 4.7rem;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">商品名称：<span>{{item.product_name}}</span></p>
                                <p class="p2">品牌：<span>{{item.brand.name}}</span></p>
                                <p class="p3">销量：<span>{{item.info.sale_num}}</span></p>
                                <p class="p4">价格：<span>{{item.info.price}}元</span></p>
                            </div>
                        </div>
                    </router-link>
                 </li>
            </ul>
            <!--所有商品-->
            <div class="lookAllBg">
                <div class="lookAll" v-if="goodsListData.length">
                    <!--用编程式push实现导航-->
                    <p @click="gotoALLgoods">
                        <span>查看所有商品</span>
                    </p>
                </div>
            </div>
        </div>

        <!--城市弹出层-->
        <mt-popup :closeOnClickModal="false" v-model="popupVisible" style="background:none;">
            <div class="selectCity" id="selectCity" style="display:block;">
                <p class="cityTitle">请选择您的商铺所在城市</p>
                <ul class="homeCityList">
                    <li @click="selectCity(index,item.id,item.name)" v-for="(item,index) in cityList" :key="index"
                        :area_id="item.id"
                        :area_name="item.name"
                        :class="{currentCityName:cityIndex===index}">
                        {{item.name}}
                    </li>
                </ul>
                <p class="querenCity" @click="sendCity">确定</p>
            </div>
        </mt-popup>

    </div>
</template>
<script>
    import {mapState,mapGetters, mapActions} from 'vuex'
    export default{
        name:'index',
        data(){
            return {
                popupVisible: true, //是否显示弹出层
                cityList: [],//城市列表
                cityIndex: 0, //当前城市索引 标识颜色高亮的
                swiperList:[], //banner图数据
                cityName:'',//当前城市名字
                cityId:'',
                timeList:[],//限时区域
                categoryList:[], //分类导航数据
                //导航所有配置 模仿后台数据 进行拼接
                allList:{
                    logo:require('../assets/images/home_8.png'),
                    name:'全部分类',
                    id:''
                },
                goodsListData:[],
                searchKey:''
            }
        },
        methods: {
            // 获取城市列表
            getCity(){
                this.$http.get('/api/city/list').then((d) => {
                    this.$indicator.close();
                    this.cityList = d.data.cityList1;
                })
            },
            // 选择城市
            selectCity(index, id, name){
                this.cityIndex = index;
                window.localStorage.setItem('area_name', name);
                window.localStorage.setItem('area_id', id);
            },
            // 直接确定获取第一个城市
            sendCity(){
                var area_name=window.localStorage.getItem('area_name');
                var area_id=window.localStorage.getItem('area_id');
                if (area_name) {
                    area_name = window.localStorage.getItem('area_name');
                    area_id = window.localStorage.getItem('area_id');
                } else {
                    area_name = this.cityList[0].name;
                    area_id = this.cityList[0].id;
                    window.localStorage.setItem('area_name', area_name);
                    window.localStorage.setItem('area_id', area_id);
                }
                this.popupVisible = false;
                this.cityName=area_name;
                //根据城市id请求首页数据
                this.swiperView(area_id);
                //this.categoryListFn(area_name);
                //this.goodsList(area_name);
            },
            //点击轮播图城市名选择城市
            nameSelectCity(){
                this.popupVisible = true;//控制调用弹出层
                //遍历城市比对 当前城市名字 一样的 根据城市索引 高亮着色
                this.cityList.forEach((item,index)=>{
                    console.log(item.name,this.cityName,index)
                    if(item.name==this.cityName){
                        this.cityIndex=index;
                    }
                })
            },
            //图片数据
            swiperView(area_id){
                this.$http.get('/api/city/picture', {
                    params: {
                        area_id: area_id
                    }
                }).then((d) => {
                    console.log(d.data.ret);
                    this.$indicator.close();
                    this.swiperList = d.data.ret
                    console.log(this.swiperList);
                }).catch((e) => {
                    this.$indicator.close();
                })
            },

            //导航分类数据
            categoryListFn(area_id){
                this.$http.get('/api/city/picture', {
                    params: {
                        area_id: area_id
                    }
                }).then((d) => {
                    this.$indicator.close();
                    this.categoryList = d.data.data.category_list;
                    this.categoryList.push(this.allList)
                }).catch((e) => {
                    this.$indicator.close();
                })
            },

            //首页商品列表数据
            goodsList(area_id){
                this.$http.get('/api/city/picture', {
                    params: {
                        area_id: area_id
                    }
                }).then((d) => {
                    this.$indicator.close();
                    this.goodsListData = d.data.data.goods_data;
                }).catch((e) => {
                    this.$indicator.close();
                })
            },

            //搜索 用query传参数 解决参数为空的时候 prams不能使用的问题
            searchFn(){
                this.$router.push({
                    name:'商品搜索'+this.keyword?this.keyword:'',
                    path:'/homeSearch',
                    query:{
                        keyword:this.searchKey,
                        current_page:1
                    }
                });
            },

            //跳转到所有商品页
            // 1对于传空参数表示的数据 params不能使用 要使用query
            // 2使用query的时候 不需要指定name
            gotoALLgoods(){
                this.$router.push({
                    path:'/allGoods',
                    query:{
                        category_id:'',
                        category_name:''
                    }
                })
            }
        },
        mounted(){
            this.getCity();
            this.$store.dispatch('changeHideTop2');
            this.$store.dispatch('changeFooter2');
        }

    }
</script>
<style>
    .mint-swipe-indicators .mint-swipe-indicator {
        background: #ccc;
        opacity: 1;
    }

    .mint-swipe-indicators .is-active {
        background: #00A000;
    }
</style>
