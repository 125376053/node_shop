<template>
    <div class="goodsBox">

        <ul class="goodsHead" v-if="hideDiv" style="position: fixed;height:1rem;top:.89rem;left:0;right:0;z-index:9999; background:#fff;">
            <li v-for="index in 2" @click="fenLei(index)" :class="{
                highlight:index===1 && $route.query.category_name!=undefined,
                highlight2:index===2 && ($route.query.brand_name!=undefined&&$route.query.brand_name!='品牌')
            }">
                <i :class="{
                    'sort':index===1,
                    'brand':index===2,
                    'sort_focus':index===1 && $route.query.category_name!=undefined,
                    'brand_focus':index===2 && ($route.query.brand_name!=undefined&&$route.query.brand_name!='品牌')
                }"></i>
                <span :class="{'flText':index===1,'ppText':index===2}">{{index===1?flText1+' '+flText2:ppText}}</span>
            </li>
        </ul>

        <div>
            <mt-loadmore v-if="hideDiv" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore"
                         style="margin-top:1.4rem; background: #fff;"
            >
                <ul>
                    <li class="goodsList" :id="item.id" v-for="(item,index) in allData" :key="index">
                        <router-link :id="item.id"
                                     :to="{path:'/goodsDetail',name:'商品详情',params:{rels_id:item.info.rels_id}}">
                            <div class="goodsImg">
                                <img style="width:2.16rem;height:2.16rem;" v-lazy="item.images" alt="">
                            </div>
                            <div class="goodsLabel">
                                <p>{{item.product_name}}</p>
                                <p>品牌：{{item.brand.name}}</p>
                                <p>销量：{{item.info.sale_num}}</p>
                                <p class="goodsPrice"><i></i>价格：{{item.info.price}}元</p>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </mt-loadmore>
        </div>

        <!--注意  用v-show的时候 style class里面的显示隐藏权限太高 一定要删掉-->
        <div class="fenleiDiv" v-show="!hideDiv" style="top:-1rem;bottom:0rem; background: #fff;height:100%;">
            <div class="fenleiWrap" style="margin-bottom:0; overflow: scroll;">


                <div class="fenlei" v-if="clickMe" style="margin-top:.5rem;">
                    <p class="all1" style="float:none;height:30px;" @click="searchData('all1')">全部1</p>
                    <ul class="yiji">
                        <li :class="{fenleiCurrent:index===currentClassIndex}" @click="yijiClick(d,index)" :id="d.id" v-for="(d,index) in flList">
                            {{d.name}}{{d.id}}
                        </li>
                    </ul>
                </div>

                <div class="fenlei" v-if="!clickMe">
                    <p class="all1" style="float:none;height:30px;" @click="searchData('all2')">全部2</p>
                    <ul class="yiji">
                        <li :class="{fenleiCurrent:index===currentClassIndex}" @click="ppClick(d,index)" :id="d.id"
                            v-for="(d,index) in flList">
                            {{d.name}}
                        </li>
                    </ul>
                </div>

                <!--分类子列表-->
                <div class="fenlei2" v-show="hideDiv2&&clickMe" style="height:80%;">
                    <p></p>
                    <div class="all2" @click="searchData('all3')" style="float:none;height:30px;">全部3</div>
                    <ul class="yiji2">
                        <li :id="d.id" v-for="(d,index) in fl2List" :class="{fenleiCurrent:index===currentClassIndex2}"
                            @click="erjiClick(d,index)">
                            {{d.name}}
                        </li>
                    </ul>
                </div>

            </div>

        </div>

    </div>
</template>
<script>
    import {mapState, mapGetters, mapActions} from 'vuex';
    export default{
        name:'list',
        data(){
            return {
                hignIndex:0,
                allLoaded: false,
                allData: [],
                pageIndex: 1,
                next_page_url: '',
                hideDiv: true,
                hideDiv2: false,
                flList: [],
                fl2List: [],
                ppList:[],
                currentClassIndex: 0,
                currentClassIndex2: 0,
                flid:this.$route.query.category_id||'',
                ppid:this.$route.query.brand_id||'',
                flidYiji:'',
                flText1:this.$route.query.category_name?this.$route.query.category_name.split(' ')[0]:'分类',
                flText2:this.$route.query.category_name && this.$route.query.category_name.split(' ')[1]?this.$route.query.category_name.split(' ')[1]:'',
                ppText:this.$route.query.brand_name?this.$route.query.brand_name:'品牌',
                clickMe:true //点击的事哪个tab
            }
        },
        computed:{

        },
        watch:{
            flText1(oldValue,newValue){

            },
            flText2(oldValue,newValue){

            },
            ppText(oldValue,newValue){

            }
        },
        methods: {
            //分类 品牌
            getAll(obj){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/production/list', {
                    params: {
                        area_id:obj.area_id,
                        page: obj.page,//页码
                        brand_id: obj.brand_id, //品牌id
                        category_id: obj.category_id //分类id
                    }
                }).then((d) => {
                    //console.log(this.utils.getSearchString('pageIndex')) //这个取不到查询参数 因为这个不是a标签组织的跳转是路由查询参数
                    //console.log(this.$route.query.pageIndex)

                    if(d.data.data.data.length==0 || d.data.data.data.length<=19){
                        document.querySelector('.mint-loadmore-bottom').style.display="none";
                    }else{
                        document.querySelector('.mint-loadmore-bottom').style.display="block";
                    }

                    this.$indicator.close();
                    console.log(d.data.data.data)
                    //注意这里 每次添加进去都是 concat进去
                    this.allData = this.allData.concat(d.data.data.data)
                    this.next_page_url = d.data.data.next_page_url;
                })
            },

            loadBottom(){
                console.log(this.next_page_url)
                if (this.next_page_url == null) {
                    this.$toast({
                        message: '没有更多数据了',
                        position: 'bottom',
                        duration: 5000
                    })
                    this.allLoaded = true;// 若数据已全部获取完毕
                }else{
                    this.pageIndex++;

                    //上啦加载数据
                    this.getAll({
                        area_id:window.localStorage.getItem('area_id')||1,
                        page:parseInt(this.$route.query.pageIndex) + 1 || this.pageIndex,
                        brand_id:this.$route.query.brand_id||this.ppid||'',
                        category_id:this.$route.query.category_id||this.flid||''
                    });

                    //插入分页
                    this.$router.push({
                        path: '/allGoods',
                        query: {
                            category_id: this.$route.query.category_id || this.flid||this.flidYiji||'',
                            category_name: this.$route.query.category_name ||this.flText1+' '+this.flText2||'',
                            brand_id:this.$route.query.brand_id||this.ppid||'',
                            brand_name:this.$route.query.brand_name||this.ppText||'',
                            pageIndex:parseInt(this.$route.query.pageIndex)+1||this.pageIndex||''
                        }
                    });
                }
                this.$refs.loadmore.onBottomLoaded();
            },

            fenLei(index){

                //滚动条清零
                document.documentElement.scrollTop=0;
                document.body.scrollTop=0;

                //高亮tab
                this.hignIndex=index;

                this.$parent.$refs.pageCom.$el.style.bottom="0";

                //隐藏头和滚动区域
                this.hideDiv = false;
                //改变 header组件状态 组件内派发一个动作到仓库
                this.$store.dispatch('changeHideTop');
                this.$store.dispatch('changeFooter');
                //渲染筛选列表
                var api=index===2?'/api/brand/list':'/api/category/list';
                this.clickMe=index===2?false:true;

                if((this.flid || this.flidYiji) && this.ppid!=""){
                    this.flppSearch();
                }else{
                    this.filterData(api);
                }

            },
            filterData(api){
                this.flList=[];
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + api, {
                    params: {
                        area_id: window.localStorage.getItem('area_id') || 1
                    }
                }).then((d) => {
                    this.$indicator.close();
                    this.flList = d.data.data;
                })
            },
            ppClick(d,index){
                this.ppid=d.id;
                this.ppText=d.name;
                this.currentClassIndex = index;//一级高亮
                this.searchData();
            },
            yijiClick(d,index){
                this.flidYiji=d.id;//保存1级分类id
                this.flText1=d.name;
                this.currentClassIndex = index;//一级高亮
                if (d.child) {
                    this.fl2List = d.child;
                    this.hideDiv2 = true;//2级显示
                } else {
                    this.flid=this.flidYiji=d.id;
                    this.hideDiv2 = false;//没有2级
                    this.searchData();//没有2级搜索1级
                }
            },
            erjiClick(d, index){
                this.flid=d.id;
                this.flText2=d.name;
                this.currentClassIndex2 = index;
                this.searchData();
            },
            //交叉筛选
            flppSearch(){
                this.flList=[];
                this.$indicator.open('加载中...');
                if(this.flid || this.flidYiji){
                    this.$http.get(this.baseUrl+'/api/category/with/brand', {
                        params: {
                            area_id: window.localStorage.getItem('area_id') || 1,
                            type:'category',
                            id: this.flid||this.flidYiji,
                        }
                    }).then((d) => {
                        this.$indicator.close();
                        this.flList = d.data.data;
                    })
                }else if(this.ppid){
                    this.$http.get(this.baseUrl + '/api/category/with/brand', {
                        params: {
                            area_id: window.localStorage.getItem('area_id') || 1,
                            type:'brand',
                            id: this.ppid
                        }
                    }).then((d) => {
                        this.$indicator.close();
                        this.flList = d.data.data;
                    })
                }
            },
            searchData(n){

                if(n=="all1"){
                    this.flid='';
                    this.flText1="全部分类";
                    this.flText2="";
                    this.flidYiji="";
                }
                if(n=="all3"){
                    this.flid=this.flidYiji;
                    this.flText1=this.flText1;
                    this.flText2="";
                }
                if(n=="all2"){
                    this.ppid="";
                    this.ppText="全部品牌";
                }

                console.log(this.flText1+this.flText2)

                //搜索完毕 切换滚动条 头 显示
                this.hideDiv = true;
                this.$store.dispatch('changeHideTop2');
                //重置html
                this.allData=[];
                //重置页码
                this.pageIndex=1;
                //重置路由页码
                this.$route.query.pageIndex=1;
                //重置参数
                this.$route.query.category_id='';
                this.$route.query.category_name=''
                this.$route.query.brand_id='';
                this.$route.query.brand_name='';


                console.log('flid----------'+this.flid)
                console.log('ppid----------'+this.ppid)

                //搜索
                this.getAll({
                    area_id:window.localStorage.getItem('area_id')||1,
                    page:this.pageIndex,
                    brand_id:this.ppid||'',
                    category_id:this.flid||''
                });

                //切换点击路由重置插入分页
                this.$router.push({
                    path: '/allGoods',
                    query: {
                        category_id: this.$route.query.category_id || this.flid||this.flidYiji||'',
                        category_name: this.$route.query.category_name ||this.flText1+' '+this.flText2||'',
                        brand_id:this.$route.query.brand_id||this.ppid||'',
                        brand_name:this.$route.query.brand_name||this.ppText||'',
                        pageIndex:parseInt(this.$route.query.pageIndex)||this.pageIndex||''
                    }
                });
            }
        },

        mounted(){
            console.log(this.$route.query.category_name)
            console.log(this.$route.query.brand_name)
            //初始化-----------刷新的时候执行mounted钩子函数  keep-alive下不执行这个函数
            this.getAll({
                area_id:window.localStorage.getItem('area_id')||1,
                page:this.$route.query.pageIndex||this.pageIndex||'',
                brand_id:this.$route.query.brand_id||this.ppid||'',
                brand_name:this.$route.query.brand_name||this.ppText||'',
                category_id:this.$route.query.category_id||this.flid||this.flidYiji||'',
                category_name:this.$route.query.category_name||this.flText1+' '+this.flText2||'',
            });
        }

    }
</script>
<style>
    .mint-loadmore {
        padding-bottom: 1.5rem;
    }
</style>
