<template>
    <div>
        <div class="myIndex">
            <div class="title">
                <img src="../assets/images/myphoto.png">
                <p>
                    <span>积分:</span>
                    <span id="jifenNum">{{score}}</span>
                </p>
            </div>
        </div>

        <ul class="myList" style="margin-bottom:1rem;">
            <li>
                <router-link :to="{path:'/myZhichu'}" class="zhuanUrl">
                    <p class="listName">
                        <img src="../assets/images/zhichu.png">
                        <span>我的支出</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>
            <li>
                <router-link :to="{path:'/myJifen'}" class="zhuanUrl">
                    <p class="listName">
                        <img src="../assets/images/jifen.png">
                        <span>我的积分</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>
            <li>
                <router-link class="zhuanUrl" :to="{path:'/myYouHuiQuan'}">
                    <p class="listName">
                        <img src="../assets/images/yue.png">
                        <span>我的优惠券</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>
            <li>
                <router-link class="zhuanUrl" :to="{path:'/myFapiao'}">
                    <p class="listName">
                        <img src="../assets/images/fapiao.png">
                        <span>我的发票</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>

            <li>
                <router-link class="zhuanUrl" :to="{path:'myShouceng'}">
                    <p class="listName">
                        <img src="../assets/images/shouceng.png">
                        <span>我的收藏</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>

            <li>
                <router-link class="zhuanUrl" :to="{path:'myYijian'}">
                    <p class="listName">
                        <img src="../assets/images/yijian.png">
                        <span>意见反馈</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>
            <li>
                <router-link class="zhuanUrl" :to="{path:'/myAbout'}">
                    <p class="listName">
                        <img src="../assets/images/aboutus.png">
                        <span>关于我们</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </router-link>
            </li>


            <li @click="popupVisible1=!popupVisible1">
                <a class="zhuanUrl">
                    <p class="listName">
                        <img src="../assets/images/kefu.png">
                        <span class="tel">我的客服</span>
                    </p>
                    <p class="rightJt">
                        <span class="kefuTel">{{tel}}</span>
                        <img src="../assets/images/returnRight.png">
                    </p>
                </a>
            </li>

            <li>
                <a class="zhuanUrl" @click="popupVisible2=!popupVisible2">
                    <p class="listName">
                        <img src="../assets/images/tuichu.png">
                        <span class="logout">退出登录</span>
                    </p>
                    <p class="rightJt">
                        <img src="../assets/images/returnRight.png">
                    </p>
                </a>
            </li>
        </ul>

        <!--拨打电话弹出-->
        <mt-popup v-model="popupVisible1">
            <div class="quxiaoTan quxiaoTel" id="telTan" style="display: block;">
                <p class="p1">提示</p>
                <p class="p2">是否拨打电话:
                    {{tel}}
                </p>
                <p class="p3">
                    <a class="borderRight closed" :href="'tel:'+tel" @click="popupVisible1=false">确定</a>
                    <a class="closed" @click="popupVisible1=false">取消</a>
                </p>
            </div>
        </mt-popup>

        <!--退出登录弹出层-->
        <mt-popup v-model="popupVisible2">
            <div class="quxiaoTan logoutAs" id="tuichuTan" style="display: block;">
                <p class="p1">提示</p>
                <p class="p2">是否确认退出登录</p>
                <p class="p3">
                    <a class="borderRight closed" @click="logout">确定</a>
                    <a class="closed" @click="popupVisible2=false">取消</a>
                </p>
            </div>
        </mt-popup>

    </div>
</template>
<script>
    import Vue from "vue";
    import {MessageBox} from 'mint-ui';
    export default{
        name:'my',
        data(){
            return {
                popupVisible1: false,
                popupVisible2: false,
                tel: '400-080-5177',
                score:0
            }
        },
        methods: {
            logout(){
                if (this.$root.token) {
                    window.localStorage.removeItem('userInfoObj');
                    this.$router.push({
                        path: '/login'
                    })
                } else {
                    MessageBox.alert('您还没有登录').then(action => {
                        this.$router.push({
                            path: '/login'
                        })
                    });
                }
            },
            getJifen(){

                this.$indicator.open('加载中...');
                this.$http.get(this.baseUrl + '/api/score/sum?token='+this.$root.token).then((d) => {
                    this.$indicator.close();
                    this.score=d.data.data;
                })
            }
        },
        mounted(){
            this.$store.dispatch("changeHideTop2")
        }
    }
</script>
<style>

</style>
