<template>
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" style="overflow: scroll;bottom:0;">
        <ul class="orderPadding">
            <li v-for="(d,index) in list" :is_disable="d.brand.is_disable" style="border-bottom:1px solid #ccc;height:3rem;">
                <router-link :to="{path:'/goodsDetails',params:{rels_id:d.info.rels_id}}">
                    <p class="shopName">{{d.product_name}}</p>
                    <div class="orderPic orderPicXiajia">
                        <div class="left">
                            <img :src="d.images">
                            <div class="imgRight imgRight2">
                                <p class="p2">品牌：<span>{{d.brand.name}}</span></p>
                                <p class="p4">价格：<span>{{d.info.price}}元</span></p>
                                <div class="xiaoling">
                                    <b class="xlImg"></b>
                                    <span style="color:#666;">销量:<i>{{d.info.sale_num}}</i></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </li>
        </ul>
        <!--没有一条数据的时候显示-->
        <div v-if="list.length==0" style="width:100%;border:0;text-align: center;padding-top:1rem;">
            <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
            <p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>
        </div>
    </mt-loadmore>

</template>
<script>
export default{
    name:'shouceng',
    data(){
        return{
            current_page:this.$route.query.current_page?this.$route.query.current_page:1,
            next_page_url:'',
            list:[],
            token:window.localStorage.getItem('userInfoObj')?JSON.parse(window.localStorage.getItem('userInfoObj')).token:'',
            allLoaded:false
        }
    },
    methods:{
        getData(page){
            this.api.get(this.baseUrl+'/api/collect/list?token='+this.token,{
                area_id:window.localStorage.getItem('area_id'),
                page:page
            }).then((d)=>{
                this.list=d.data.data.data;

                //没有数据 或者数据不够一页20条 隐藏加载更多提示
                if(this.list.length==0 || this.list.length<=19){
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
                });
                this.allLoaded = true;// 若数据已全部获取完毕
            }else{
                this.current_page++;
                //上啦加载数据
                this.getData(this.current_page);
                //插入分页
                this.$router.push({
                    path: '/myShouceng',
                    query: {
                        current_page:parseInt(this.$route.query.current_page)+1||this.current_page
                    }
                });
            }

            this.$refs.loadmore.onBottomLoaded();
        }
    },
    mounted(){
        //----------------打入一个路由 发现vuex隐藏页脚不能同步了---------------------
        this.$store.dispatch('changeFooter');
        /*if(!this.$route.query.current_page){
            this.$router.replace({
                path: '/myShouceng',
                query: {
                    current_page:1
                }
            })
        }*/
        //------------------------------------
        this.getData(this.current_page);
    }
}
</script>
<style>

</style>
