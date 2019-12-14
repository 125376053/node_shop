<template>

    <div class="g-title" id="container">

        <!--图片比例缩放 给图片外框设置指令-->
        <div class="topImg">
            <swiper :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(item,index) in imgList" :key="index" style="width:7.5rem;height:7.5rem;" v-setloadStyle>
                    <img @click="showBigImg" :src="item" alt="" >
                </swiper-slide>
            </swiper>
        </div>

        <!--点击小图显示大图原理  就是弹出层+滚动图  -->
        <mt-popup v-model="popupVisibleM" style="width:100%;height:7.5rem;" v-if="popupVisibleM">
            <div class="topImg1">
                <swiper :options="swiperOption" ref="mySwiper">
                    <swiper-slide v-for="(item,index) in imgList" :key="index" style="width:7.5rem;height:7.5rem;" v-setloadStyle>
                        <img @click="showBigImg" :src="item" alt="" width="200" height="200" max-width="500">
                    </swiper-slide>
                </swiper>
            </div>
        </mt-popup>

        <div class="z-refer">{{product_name}}</div>

        <div style="position:relative;display:-webkit-box;-webkit-box-align:center;-webkit-box-pack:center;border-bottom:1px solid #e5e5e5;">
            <div class="m-cent">
                <div class="z-left txt">
                    品牌：<span class="pinPaiName">{{brand_name}}</span>
                </div>
                <div class="z-right txt"><span></span>
                    销量：<i class="pinPaiXL">{{scale_num}}</i>
                </div>
                <div class="z-right2 txt">
                    <span></span>
                    库存：<i class="pinPaiKc">{{kuCun}}</i>
                </div>
            </div>

            <div class="m-cost" style="border:0;margin-top:.4rem; text-align: right; padding-left: 0;">
                <!--有特惠和无特惠2中状态-->
                <span class="money"></span>
                <!--原价-->
                <i class="curPrice" style="margin-right:.2rem;">{{price}}元</i>
                <!--特惠价-->
                <p v-if="this.$route.query.count_type" style="margin-right:.2rem;" class="font24 orginPrice">{{yhPrice}}元</p>
            </div>

            <div class="maizeng" style="bottom:.3rem;">{{count_rule | changeHanZi}}</div>
        </div>

        <div class="m-spec m-spec2" style="background: #fff;">
            规格:
            <a class="guigeList">
                <span @click="changePriceAndKucun(item,index)" :class="{selectGuige2:index===selectGuige}" v-for="(item,index) in guigeList">
                    {{item.name}}
                </span>
            </a>
        </div>

        <TabCom :buttonData="buttonData" :tabIndex="tabIndex" :tabShowFlag="tabShowFlag" style="background: #fff;">
            <div>
                <!--详情-->
                <ul class="m-spxq model0" id="shopDetail" v-show="tabShowFlag">
                    <li class="m-commodity">
                        <div class="xqContent" v-html="detaiInfor"></div>
                    </li>
                </ul>
                <!--评价-->
                <ul class="m-eva model1" id="shopPing" v-show="!tabShowFlag">
                    <li v-if="pinglun.length>0" class="m-pl" id="d.id" v-for="(d,index) in pinglun">
                        <div class="m-evaluate">
                            <div class="tel">{{d.user.mobile}}</div>
                            <div class="time">{{d.created_at}}</div>
                        </div>
                        <div class="z-text">{{d.content}}</div>
                    </li>
                    <!--这里条件是小于等于0-->
                    <div v-if="pinglun.length<=0" style="width:100%;border:0;text-align: center;padding-top:1rem;">
                        <!--没有一条数据的时候显示-->
                        <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
                        <p style="margin-top:.1rem;font-size:.28rem;color:#666;">没有任何评论</p>
                    </div>
                </ul>
            </div>
        </TabCom>

        <div class="m-foot">
            <div class="collect">
                <span class="xinxin" :class="{xinxin2:shouCengFlag}"  @click="shouCeng"></span>
                <span class="scText" @click="shouCeng">收藏</span>
            </div>
            <div class="collect2">
                <router-link :to="{path:'/cart'}" style="color:#000;">
                    <span class="detailCart"></span>购物车
                </router-link>
            </div>
            <div class="shop" id="addCart" @click="addCart">加入购物车</div>
        </div>


        <!--加入购物车-->
        <mt-popup v-model="popupVisible" style="width:90%;height:6rem;">
            <div class="addCartTan" style="display: block; overflow: hidden;height:6rem;background:#fff;">
                <div class="addCartTop">
                    <p>请选择商品规格</p>
                    <div class="guige-list">
                        <a :class="{selectGuige:index===selectGuige1}" v-for="(d,index) in guigeList" :rest_num="d.rest_num" :limit_num="limit" :price="d.price" :spe_id="d.id" @click="changeCurrentGuige(index)">
                            {{d.name}}
                        </a>
                    </div>
                </div>
                <div class="addCartBottom" style="overflow: hidden;">
                    <p>请选择数量</p>
                    <Computing
                        :shopping="shopping"
                        :restNum="parseInt(rest_num)"
                        :limitNum="parseInt(limit_num)"
                        @addGet="addGet"
                        @remGet="remGet"
                        style="margin:.8rem auto;">

                    </Computing>
                </div>
                <div class="jiesuanBtn2 bgFff" style="position: absolute;bottom:0;">
                    <a class="quxiaoOrder clok" @click="popupVisible=false;">取消</a>
                    <a class='jiesuanZhifu zhifuOrder' @click="addSuccsee">确定</a>
                </div>
            </div>
        </mt-popup>

    </div>


</template>
<script>
    import Computing from "../components/Computing.vue";
    import TabCom from "../components/TabCom.vue";
    export default{
        name:'detail',
        data(){
            return {
                shopping:{
                    count:1//购买的数量
                },
                popupVisibleM:false,
                shopData:null,
                buttonData:['商品详情','用户评价'],
                imgList:'',
                product_name:'',
                brand_name:'',
                scale_num:'',
                kuCun:'',
                price:'',
                yhPrice:'',
                count_rule:'',//买赠
                swiperOption: {},
                popupVisible:false,
                guigeList:[],
                selectGuige:0,
                selected: '1',
                tabIndex:0,
                tabShowFlag:true,
                detaiInfor:'',
                shouCengFlag:false,
                token:window.localStorage.getItem('userInfoObj')?JSON.parse(window.localStorage.getItem('userInfoObj')).token:'',
                product_id:'',
                limit:'',
                rest_num:0, //当前选中的规格的库存数量
                limit_num:0, //当前选中的规格的限购数量
                spcId:0,
                pinglun:[],
                selectGuige1:0, //规格选中高亮
                id:'' //记录商品当前id
            }
        },
        components:{
            Computing,
            TabCom
        },
        methods:{
            addGet(count){
                console.log(count)
                this.shopping.count=count;
            },
            remGet(count){
                console.log(count)
                this.shopping.count=count;
            },
            changePriceAndKucun(item,index){
                console.log(item)
                this.price=parseFloat(item.price).toFixed(2);
                this.kuCun=item.rest_num;
                this.selectGuige=index;
            },
            getData(){
                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/production/info', {
                    params: {
                        token:this.token,//用户登录和不登录都能访问商品详情页
                        area_id:window.localStorage.getItem('area_id'),
                        rels_id:this.$route.params.rels_id
                    }
                }).then((d) => {
                    this.$indicator.close();
                    this.shopData=d.data.data;
                    this.imgList=d.data.data.production.images_list;
                    this.product_name=d.data.data.production.product_name;
                    this.brand_name=d.data.data.brand.name;
                    this.scale_num=d.data.data.sale_num;

                    d.data.data.specs.forEach((item)=>{
                        this.kuCun+=parseInt(item.rest_num)
                    });

                    this.price=d.data.data.price;
                    this.yhPrice=d.data.data.org_price;

                    //模拟
                    d.data.data.count_rule='1,1';
                    this.count_rule=d.data.data.count_rule;
                    this.guigeList=d.data.data.specs;

                    //商品详情
                    this.xqview(d);

                    //添加或取消收藏    "is_collection"//T表示已收藏  F表示未收藏
                    if(d.data.data.is_collection=="F"){
                        this.shouCengFlag=false;
                    }else{
                        this.shouCengFlag=true;
                    }

                    //产品id product_id
                    console.log(d)
                    this.product_id=d.data.data.product_id;

                    //limit
                    this.limit=d.data.data.limit_num;

                    //
                    this.id=d.data.data.id;

                })
            },
            //详情过滤样式 只要文本内容
            xqview(d){
                this.detaiInfor=d.data.data.production.content;
                this.detaiInfor = this.detaiInfor.replace(/(\n)/g, "");
                this.detaiInfor = this.detaiInfor.replace(/(\t)/g, "");
                this.detaiInfor = this.detaiInfor.replace(/(\r)/g, "");
                this.detaiInfor = this.detaiInfor.replace(/<\/?[^{img,a,h1,h2,h3,h4,h5,h6,p}>]*>/g, "");
                this.detaiInfor = this.detaiInfor.replace(/<\/?[^/?(div)|(a)|(p)|(img)|(h1)|(h2)|(h3)|(strong)>]*>/ig,"");
                this.detaiInfor=this.detaiInfor.replace(/&nbsp;/ig,"");
                this.detaiInfor=this.detaiInfor.replace(/\s(style=".[^<>]+")/ig,'');
            },
            showBigImg(){
                this.popupVisibleM=!this.popupVisibleM;
            },
            //添加或取消收藏
            shouCeng(){
                if(!this.token){
                    this.$router.push("/login");
                    return false;
                }

                this.shouCengFlag=!this.shouCengFlag; //只是样式上改变  并未通知服务器更新
                this.api.get(this.baseUrl+'/api/product/collection/change?token='+this.token,{
                    area_id:window.localStorage.getItem('area_id'),
                    product_id: this.product_id
                }).then(d=>{
                    console.log(d)
                    if(!this.shouCengFlag){
                        this.$toast('取消收藏')
                    }else{
                        this.$toast('收藏成功')
                    }
                })
            },
            //加入购物车
            addCart(){
                this.popupVisible=!this.popupVisible;
                this.shopping.count=1;
                //渲染规格
                if(this.guigeList.length>0){
                    //默认库存和默认限购
                    this.rest_num=this.guigeList[this.selectGuige1].rest_num;
                    this.limit_num=this.limit;
                    this.price=this.guigeList[this.selectGuige1].price;
                    this.spcId=this.guigeList[this.selectGuige1].id;
                }
            },
            //修改当前规格选中的库存和限购，高亮
            changeCurrentGuige(index){
                this.selectGuige1=index;
                this.shopping.count=1; //数量重置
                if(this.guigeList.length>0){
                    //选中的规格库存和选中的限购
                    this.rest_num=this.guigeList[this.selectGuige1].rest_num;
                    this.limit_num=this.limit;
                    this.price=this.guigeList[this.selectGuige1].price;
                    this.spcId=this.guigeList[this.selectGuige1].id;
                }
                if(!this.token){
                    var obj=this.localShopList();
                    obj.order_num=0;//本地缓存也要重置
                    window.localStorage.setItem('addCartGoods'+this.id,JSON.stringify(obj));
                }
            },
            //添加到购物车验证逻辑
            addSuccsee(){
                this.popupVisible=false;

                //用户已经登录
                if(this.token){
                    //判断库存
                    if(this.rest_num<0){
                        this.$toast('此商品规格库存不足');
                        return false;
                    }else{
                        this.addCartEdit()
                    }
                }else{
                    var obj=this.localShopList();
                    if(obj.kucun===0){
                        this.$toast('加入购物车失败，商品库存不足');
                    }else{
                        window.localStorage.setItem('addCartGoods'+this.id,JSON.stringify(obj));
                        this.$toast('加入购物车成功');
                    }
                }

            },
            //用户未登录构建本地购物车缓存清单
            localShopList(){
                //之前是否存在此商品记录
                let shop_num=0;
                let jiLuNum=0;
                let shopJilu=JSON.parse(window.localStorage.getItem('addCartGoods'+this.id));
                if(shopJilu){
                    jiLuNum=shopJilu.order_num;
                    shop_num=parseInt(jiLuNum)+parseInt(this.shopping.count);
                }else{
                    shop_num=parseInt(this.shopping.count);
                }

                //构建缓存对象---未登录购物车编辑提交
                let obj={
                    area_id: this.shopData.area_id,
                    rels_id: this.shopData.id,
                    product_id: this.shopData.product_id,
                    spe_id:this.spcId, //当前选中的规格id
                    order_num:shop_num,
                    price:this.price,
                    kucun:this.rest_num,
                    xiangou:this.limit_num
                };
                return obj;
            },
            //商品详情页登录后购物车编辑添加
            addCartEdit(){
                this.api.post(this.baseUrl+'/api/shops/car/add?token='+this.token,{
                    area_id: this.shopData.area_id,
                    rels_id: this.shopData.id,
                    product_id: this.shopData.product_id,
                    spe_id:this.spcId, //当前选中的规格id
                    order_num:this.shopping.count,
                    price:this.price,
                    is_edit:0 //0表示添加 1表示编辑
                }).then((d)=>{
                    this.$toast('购物车添加成功');
                })
            },
            //评论
            pingLun(){
                this.api.get(this.baseUrl+'/api/production/comment',{
                    rels_id: this.id
                }).then((d)=>{
                    this.pinglun=d.data.data.data;
                })
            }

        },
        mounted(){
            this.getData();
            this.pingLun();

            //单一事件集中管理组件通信
            this.busEvent.$on('tabIndex',function(index){
                this.tabIndex=index;
            }.bind(this))

            this.busEvent.$on('tabShowFlag',function(tabShowFlag){
                this.tabShowFlag=tabShowFlag;
            }.bind(this))

            //vuex管理 是否显示底部导航栏 默认显示  详情页不显示
            this.$store.dispatch('changeFooter'); //组件内发射一个动作到actions
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
