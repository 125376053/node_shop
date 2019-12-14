<template>
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
        <!--康爹爹啊 mt-loadmorn必须放在最外层 不然直接无限执行下面的-->
        <div class="myJifen">
            <ul>
                <li v-for="(d,index) in scoreList" :class="{jian:d.is_add==false}">
                    <div class="left">
                        <p>{{d.created_at}}</p>
                        <p>{{d.desc}}</p>
                    </div>
                    <div class="right">
                        <span class="fuhao">{{d.is_add>0?'+':'-'}}</span>
                        <span class="jine">{{d.num}}</span>
                    </div>
                </li>
            </ul>
            <!--没有一条数据的时候显示-->
            <div v-show="scoreList.length==0" style="width:100%;border:0;text-align: center;padding-top:1rem; display: none; ">
                <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
                <p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>
            </div>
        </div>
    </mt-loadmore>
</template>
<script>
    export default{
        name:'jifen',
        mounted(){
            //如果没有分页参数 插入分页参数
            if(!this.$route.query.current_page){
                this.$router.replace({
                    path: '/myJifen',
                    query: {
                        current_page:1
                    }
                })
            }
            //初始请求数据
            this.getData(this.current_page);
        },
        data(){
            return{
                scoreList:[],
                allLoaded:false,
                current_page:this.$route.query.current_page?parseInt(this.$route.query.current_page):1,
                next_page_url:'',
                //token获取bug 1 全局写token有延迟 不能实时监测到 2vuex中存储刷新丢失 3写到data中去配置没发现问题，这样可以直接操作缓存而不必操作状态
                token:window.localStorage.getItem('userInfoObj')?JSON.parse(window.localStorage.getItem('userInfoObj')).token:''
            }
        },
        methods:{
            getData(n){
                //加载中提示
                this.$indicator.open('加载中...');

                //发起请求
                this.$http.get(this.baseUrl + '/api/score/list?token='+this.token,{
                    params: {
                        page:n,
                        token:this.$root.token
                    }
                }).then((d)=>{
                    //关闭提示
                    this.$indicator.close();
                    console.log(d)

                    if(!d.data.data){
                        if(this.scoreList.length==0 || this.scoreList.length<=19){
                            document.querySelector('.mint-loadmore-bottom').style.display="none";
                        }else{
                            document.querySelector('.mint-loadmore-bottom').style.display="block";
                        }
                        return;
                    }

                    this.scoreList=d.data.data.data;
                    //没有数据 或者数据不够一页20条 隐藏加载更多提示
                    if(this.scoreList.length==0 || this.scoreList.length<=19){
                        document.querySelector('.mint-loadmore-bottom').style.display="none";
                    }else{
                        document.querySelector('.mint-loadmore-bottom').style.display="block";
                    }

                    //记录还有没有下一页提示 有就有链接 没有就为null
                    this.next_page_url = d.data.data.next_page_url;

                }).catch((e)=>{
                    this.$indicator.close();
                    console.error(e)
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
                    this.getData(this.current_page);

                    //插入分页
                    this.$router.replace({
                        path: '/myJifen',
                        query: {
                            current_page:parseInt(this.$route.query.current_page)+1||this.current_page
                        }
                    });
                }

                this.$refs.loadmore.onBottomLoaded();

            }
        }
    }
</script>
<style>

</style>
