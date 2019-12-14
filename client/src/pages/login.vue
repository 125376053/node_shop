<template>

    <div id="login" style="top:0;bottom:0;">

        <div class="loginTop">
            <div class="logoWrap">
                <img src="../assets/images/logo.png">
            </div>
        </div>

        <div class="loginContent">

            <div class="tel" style="margin-top:1rem;">
                <img src="../assets/images/loginTel.png">
                <input type="tel" placeholder="请输入手机号码" class="telValue" v-model="username">
                <span class="telTishi"></span>
            </div>

            <div class="tel">
                <img src="../assets/images/loginSuo.png">
                <input autocomplete="off" :type="type" placeholder="请输入密码" class="passValue" v-model="password">
                <i class="biyan" @click="yanJing" :class="{zhengyan:yFlag}"></i>
                <span class="passTishi"></span>
            </div>

            <router-link :to="{
                path:'/resetPass',
                query:{
                    mobile:username
                }
            }" class="resetPass">
                忘记密码

            </router-link>
            <!--:style中可以写三元表达式-->
            <a class="loginBtn" @click="check" :style="success?'opacity:1':'0.5'">登录</a>
            <router-link class="registBtnLogin" :to="{path:'/regist',name:'注册'}">注册</router-link>

        </div>
    </div>


</template>
<script>

    import qs from 'qs'; //axios post 必须加这个才能使 跨域post问题
    export default{
        name:'login',
        mounted(){

            //alert('login')

            this.$store.dispatch('changeHideTop');
            this.$store.dispatch('changeFooter');

            if (this.getCookie('shoujihao1') !== '') {
                this.username = this.getCookie('shoujihao1');
            }
        },
        data(){
            return {
                yFlag: false,
                type: 'password',
                username: '',
                password: '',
                success: false
            }
        },
        methods: {
            yanJing(){
                this.yFlag = !this.yFlag;
                this.type = this.yFlag ? 'text' : 'password';
            },
            check(){

                //手机号输入了且输入正确 存入cookie
                this.setCookie('shoujihao1', this.username || '', 7);//设置手机号cookie 7天

                var telMoshi = /^1[34578]\d{9}$/; //手机号验证
                var passMoshi = /^[0-9a-zA-Z]{6,20}$/g; //密码验证

                if (this.username == "") {
                    this.$toast('手机号码不能为空');
                    return false;
                } else if (!telMoshi.test(this.username)) {
                    this.$toast('请输入正确的手机号码');
                    return false;
                } else if (this.password == '') {
                    this.$toast('密码不能为空');
                    return false;
                } else if (!passMoshi.test(this.password)) {
                    this.$toast('密码是6-20位字母和数字，且最少有一个字母和数字混合');
                    return false;
                } else {
                    //后台检测
                    this.checkUser();
                }

            },
            checkUser(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/sellerslogin', qs.stringify({
                    mobile: this.username,
                    password: this.password
                })).then((d) => {
                    this.$indicator.close();
                    if (d.code > 0) {
                        this.$toast(d.message);
                        this.success = false;
                        return false;
                    } else {
                        this.success = true;
                        //存储用户信息
                        var userInfoObj = {
                            "id": d.data.data.id,   //商户的id
                            "mobile": d.data.data.mobile,   //商户的手机号
                            "is_disable": d.data.data.is_disable,   //商户是否禁用 0为未禁用,1为已禁用
                            "audit": d.data.data.audit,  //0为未审核,1为已审核
                            "user_id": d.data.data.user_id,  //用户的user_id
                            "token": d.data.data.token //token
                        };
                        //userInfoObj = JSON.stringify(userInfoObj);
                        //window.localStorage.setItem('userInfoObj', userInfoObj);


                        //保存用户信息到Vuex
                        this.$store.dispatch('userInfoObj',userInfoObj);


                        //登录后修改城市id
                        window.localStorage.setItem('area_id', d.data.data.area_id);
                        window.localStorage.setItem('area_name', d.data.data.area_name);

                        //通知后台提交数据
                        //this.localSendServer(d.data.data.token);

                        //跳转到首页
                        this.$router.push({
                            path: '/home',
                            query:{
                                //fromPath:'/login'
                            }
                        })
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    console.log(e)
                })
            },

            //把本地商品数据清单发给后台
            localSendServer(token){
                var localArr = this.getLocalData();
                localArr = [
                    {
                        "area_id": 1,
                        "rels_id": 49,
                        "product_id": 98,
                        "spe_id": "136",
                        "order_num": 1,
                        "price": "92",
                        "kucun": "988",
                        "xiangou": ""
                    }
                ]
                if (localArr.length > 0) {
                    this.$indicator.open('加载中...');
                    localArr.forEach((d) => {
                        this.$http.post(this.baseUrl + '/api/shops/car/add?token='+token, qs.stringify({
                            area_id: d.area_id,
                            rels_id: d.rels_id,
                            product_id: d.product_id,
                            spe_id: d.spe_id,
                            order_num: d.order_num,
                            price: d.price,
                            is_edit: 0, //添加
                            //token:this.userInforObj.token //token必须传入到url后面
                        })).then(d => {
                            console.log(d);
                            this.$indicator.close();
                            var storage = window.localStorage;
                            for (var i = 0; i <= storage.length; i++) {
                                var key = storage.key(i);
                                if (key) {
                                    if (key.substring(0, 12) == 'addCartGoods') {
                                        storage.removeItem(key);
                                    }
                                }
                            }
                        })
                    })
                }
            },

            //获取本地缓存的商品数据
            getLocalData(){
                var localArr = [];
                var storage = window.localStorage;
                for (var i = 0; i <= storage.length; i++) {
                    var key = storage.key(i);
                    if (key) {
                        if (key.substring(0, 12) == 'addCartGoods') {
                            var value = storage.getItem(key);
                            var obj = JSON.parse(value);
                            localArr.push(obj);
                        }
                    }
                }
                return localArr;
            }
        }
    }
</script>
<style>

</style>
