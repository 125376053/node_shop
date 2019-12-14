<template>
    <div>
        <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
            <div class="timeContent">
                <ul class="contentBox">
                    <li v-for="(item,index) in dataObj" style="position: relative;width:3.4rem;height:5rem;margin-bottom:.5rem;margin-right:.2rem;" :key="index">
                        <div class="miaosha" :data-id="item.brand.id">
                            <router-link :to="{path:'/goodsDetail',name:'商品详情',params:{rels_id:item.info.rels_id}}">
                                <div style="width:3.2rem;height:2.4rem;padding:.1rem;">
                                    <!--<img class="shopImg" style="width:100%;height:100%;" :src="item.images" alt="">-->
                                    <img class="shopImg" style="width:100%;height:100%;" v-lazy="item.images" alt="">
                                </div>
                                <p style="font-size:.32rem;" class="p1">{{item.product_name}}</p>
                                <p class="font28">品牌:{{item.brand.name}}</p>
                                <p class="font32" style="text-decoration:none;">
                                    <span>¥</span>
                                    <b class="sizeBig">{{item.info.price}}/{{item.metrology}}</b>
                                </p>
                                <div class="xiaoling">
                                    <b class="xlImg"></b>
                                    <span>销量:<i>{{item.info.sale_num}}</i></span>
                                </div>
                            </router-link>
                        </div>
                    </li>
                </ul>

                <!--没有一条数据的时候显示-->
                <div v-if="dataObj.length==0" style="width:100%;border:0;text-align: center;padding-top:1rem;">
                    <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
                    <p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>
                </div>

            </div>
        </mt-loadmore>
    </div>
</template>
<script>
    export default{
        name:'list',
        data(){
            return{
                allLoaded:false,
                dataObj:[],
                current_page:this.$route.query.current_page?parseInt(this.$route.query.current_page):1,
                next_page_url:'',
                keyword:this.$route.query.keyword?this.$route.query.keyword:''
            }
        },
        methods:{
            timeObj(n,word){
                //加载中提示
                this.$indicator.open('加载中...');
                //发起请求
                this.$http.get(this.baseUrl + '/api/production/list',{
                    params: {
                        area_id: window.localStorage.getItem('area_id')||1,
                        page:n,
                        keyword:word
                    }
                }).then((d)=>{
                    //关闭提示
                    this.$indicator.close();

                    console.log(d.data.data.data)
                    this.dataObj = this.dataObj.concat(d.data.data.data)

                    //这个数据不是数组集合是对象集合 类似obj{obj1,obj2} 而非obj=[obj1,obj2]
                    var objCollecation=d.data.data.data;
                    console.log(objCollecation)

                    //处理这个对象集合为数组集合
                    for(var x in objCollecation){
                        this.dataObj.push(objCollecation[x])
                    }



                    //没有数据 或者数据不够一页20条 隐藏加载更多提示
                    if(this.dataObj.length==0 || this.dataObj.length<=19){
                        document.querySelector('.mint-loadmore-bottom').style.display="none";
                    }else{
                        document.querySelector('.mint-loadmore-bottom').style.display="block";
                    }

                    //记录还有没有下一页提示
                    this.next_page_url = d.data.data.next_page_url;

                })
            },
            loadBottom(){

                if (this.next_page_url == null) {
                    this.$toast({
                        message: '没有更多数据了',
                        position: 'bottom',
                        duration: 5000
                    })
                    this.allLoaded = true;// 若数据已全部获取完毕
                }else{
                    this.current_page++;

                    //上啦加载数据
                    this.timeObj(this.current_page,this.keyword);

                    //插入分页
                    this.$router.push({
                        path: '/homeSearch',
                        query: {
                            current_page:parseInt(this.$route.query.current_page)+1||this.current_page,
                            keyword:this.$route.query.keyword||this.keyword
                        }
                    });
                }

                this.$refs.loadmore.onBottomLoaded();
            }
        },
        mounted(){
            if(!this.$route.query.current_page){
                this.$router.push({
                    path: '/homeSearch',
                    query: {
                        current_page:1,
                        keyword:this.keyword
                    }
                })
            }
            this.timeObj(this.current_page,this.keyword);
        }
    }
</script>
<style>
    .mint-loadmore{
        padding-bottom:1.5rem;
        width:100%;
    }
    image[lazy=loading] {
        width: 40px;
        height: 300px;
        margin: auto;
    }
</style>
