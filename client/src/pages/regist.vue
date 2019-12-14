<template>
    <div class="loginContent repassContent" style="background:#fff; position: absolute;bottom:0;top:0;left:0;right:0;">

        <div class="tel">
            <img src="../assets/images/loginTel.png">
            <b>+86</b>
            <input @focus.stop="" v-model="username" type="tel" placeholder="请输入手机号码" class="telValue_zhuce">
        </div>

        <div class="tel yanzm">
            <img src="../assets/images/repa123.png">
            <b>验证码</b>
            <input @focus.stop="" v-model="imgma" type="text" placeholder="" class="yanValue" style="width:2.4rem;">
            <img alt="" class="ynmImg" id="ynmImg" :src="imgSrc" style="width:1.5rem;height:.6rem;"/>
            <img src="../assets/images/shuaxin.png" class="shuaxin" alt="" @click.stop="changeSwitchImg"/>
        </div>

        <div class="tel yanzm">
            <img src="../assets/images/repa123.png">
            <b>验证码</b>
            <input @focus.stop="" v-model="ma" type="number" placeholder="" class="yanValue" style="width:2.4rem;">
            <button :style="jinzhiFlag?'background:#ccc':'background:#ed5564'" :disabled="jinzhiFlag"
                    class="getYan_zhuce" @click.stop="getYan" ref="noResetTimeBtn">获取验证码
            </button>
        </div>

        <div class="tel">
            <img src="../assets/images/loginSuo.png">
            <b>密码</b>
            <input @focus.stop="" v-model="password" :type="type" placeholder="请输入6-10位字母或数字" class="passValue"
                   style="width:4rem;">
            <i class="biyan" @click.stop="yanJing" :class="{zhengyan:yFlag}"></i>
        </div>

        <div class="tel shopname">
            <input @focus.stop="" v-model="shopName" type="text" placeholder="请输入商铺名称" class="passValue">
        </div>

        <div class="tel cityAdd" style="width:45%;float:left;">
            <select @change="changeOneCity" v-model="cityObj">
                <option :value="d" :area_id="d.id" v-for="(d,index) in cityList">
                    {{d.name}}
                </option>
            </select>
        </div>

        <div class="tel adressAdd" style="width:45%;float:right;">
            <select @change="changeTwoCity" v-model="city2">
                <option :value="index" v-for="index in cityList2">
                    {{index}}
                </option>
            </select>
        </div>

        <div class="tel shopadress">
            <input @focus.stop="" v-model="shopAdress" type="text" placeholder="请输入商铺地址" class="passValue">
        </div>

        <div class="xieyi" style="margin-top:1rem;">
            <p class="checkbox11" :class="{checkbox22:selectFlag}" @click.stop="selectFlag=!selectFlag"></p>
            <p class="clickXieyi" style="margin-left:.1rem;color:dodgerblue;font-size:.28rem;" @click.stop="xieyiLayer">
                同意用户服务协议</p>
        </div>

        <a class="registBtn" style="margin-top:1rem;" @click="zhuceBtnYzWx">注册</a>

        <mt-popup v-model="popupVisible">
            <div class="xieyiTan" id="xieyiTan" style="overflow: auto;width:6rem;display: block;height:5rem;">
                <h1>{{title}}</h1>
                <div v-html="content"></div>
            </div>
        </mt-popup>

        <input id="token" type="hidden"/>
        <input id="cityName2" type="hidden"/>
        <input id="adress2" type="hidden"/>

    </div>
</template>
<script>
    import qs from 'qs';
    import {MessageBox} from 'mint-ui';
    export default{
        name:"regist",
        data(){
            return {
                cityList: [], //城市列表
                cityObj: {},//双向绑定对象的原因是想要城市id和Name2个值同步
                cityList2: [], //城市列表
                city2: '', //默认为空  通过拉取数据后 复制=来改变初始的默认值
                username: '',
                password: '',
                ma: '',
                imgma: '',
                shopName: '',
                shopAdress: '',
                selectFlag: true,
                popupVisible: false,
                title: '',
                content: '',
                yFlag: false,
                type: 'password',
                jinzhiFlag: false,
                imgSrc: this.baseUrl + '/api/mobilever/' //初始验证码图片
            }
        },
        methods: {
            //请求1级城市列表
            getCity(){
                this.$indicator.open('加载中');
                this.$http.get(this.baseUrl + '/api/city/list').then((d) => {
                    this.$indicator.close();
                    this.cityList = d.data.data;
                    //设置默认选择的1级城市
                    //this.cityObj.cityId=this.cityList[0].id; //这样写错误的 会导致默认没有任何选中
                    //this.cityObj.cityName=this.cityList[0].name;
                    this.cityObj = this.cityList[0];//这样写是正确的 是让obj这个对象直接复制了cityList这个对象 obj就有了name和id这些属性
                    //this.$set(this.cityObj,'cityId',this.cityObj.id) //动态添加不了值了
                    //this.$set(this.cityObj,'cityName',this.cityObj.name)
                    window.localStorage.setItem('area_id', this.cityObj.id);
                    window.localStorage.setItem('area_name', this.cityObj.name);
                    this.getCity2(this.cityObj.name);
                }).catch((e) => {
                    this.$indicator.close();
                    MessageBox('提示', '服务器出错');
                })
            },
            changeOneCity(){
                window.localStorage.setItem('area_id', this.cityObj.id);
                window.localStorage.setItem('area_name', this.cityObj.name);
                this.getCity2(this.cityObj.name);
            },
            getCity2(cityName){
                this.$indicator.open('加载中');
                this.$http.get(this.baseUrl + '/api/city/list', {
                    params: {
                        city_name: cityName
                    }
                }).then((d) => {
                    this.$indicator.close();
                    this.cityList2 = d.data;
                    this.city2 = this.cityList2[0];
                }).catch((e) => {
                    this.$indicator.close();
                    MessageBox('提示', '服务器出错');
                })
            },
            changeTwoCity(){
                //这个函数没必要了 因为是双向绑定 不需要在设置对值进行改变
                console.log(this.city2)
            },
            yanJing(){
                this.yFlag = !this.yFlag;
                this.type = this.yFlag ? 'text' : 'password';
            },
            xieyiLayer(){
                this.$indicator.open('加载中');
                this.$http.get(this.baseUrl + '/api/user/service').then((d) => {
                    this.$indicator.close();
                    this.title = d.data.data.title;
                    this.content = d.data.data.content;
                    this.popupVisible = !this.popupVisible;
                }).catch((e) => {
                    this.$indicator.close();
                    MessageBox('提示', '服务器出错');
                })
            },
            zhuceBtnYzWx(){

                //手机号输入了且输入正确 存入cookie
                this.setCookie('shoujihao2',this.username||'',7);//设置手机号cookie 7天

                var telMoshi = /^1[34578]\d{9}$/;
                var passMoshi = /^[0-9a-zA-Z]{6,20}$/g;
                if (this.username == '') {
                    this.$toast('手机号码不能为空');
                    return false;
                } else if (!telMoshi.test(this.username)) {
                    this.$toast('请输入正确的手机号码');
                    return false;
                } else if (this.imgma == '') {
                    this.$toast('图片验证码不能为空');
                    return false;
                } else if (this.ma == '') {
                    this.$toast('验证码不能为空');
                    return false;
                } else if (this.password == '') {
                    this.$toast('密码不能为空');
                    return false;
                } else if (!passMoshi.test(this.password)) {
                    this.$toast('密码是6-20位字母或数字，或字母数字的组合');
                    return false;
                } else if (this.shopName == '') {
                    this.$toast('商铺名称不能为空');
                    return false;
                } else if (this.shopAdress == '') {
                    this.$toast('商铺地址不能为空');
                    return false;
                } else if (!this.selectFlag) {
                    this.$toast('请选择同意服务协议');
                    return false;
                } else {
                    this.zhuceRes();
                }
            },
            zhuceRes(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/registerSellers',qs.stringify({
                    mobile:this.username,
                    password:this.password,
                    //mobile_code:this.ma,//验证码的值
                    area_id:window.localStorage.getItem('area_id'),
                    selller_reg_store_name:this.shopName,
                    selller_reg_store_addr:this.cityObj.name+''+this.city2+''+this.shopAdress
                })).then((d)=>{
                    this.$indicator.close();
                    if(d.data.data==='验证码错误'){
                        this.$toast('验证码错误');
                        return false;
                    }else if(d.code>0){
                        this.$toast('验证码错误');
                        return false;
                    }else{
                        //存储用户信息
                        var userInfoObj={
                            "id": d.data.data.id,   //商户的id
                            "mobile": d.data.data.mobile,   //商户的手机号
                            "is_disable":  d.data.data.is_disable,   //商户是否禁用 0为未禁用,1为已禁用
                            "audit": d.data.data.audit,  //0为未审核,1为已审核
                            "user_id": d.data.data.user_id,  //用户的user_id
                            "token": d.data.data.token //token
                        };
                        userInfoObj=JSON.stringify(userInfoObj);
                        window.localStorage.setItem('userInfoObj',userInfoObj);
                        //登录后修改城市id
                        window.localStorage.setItem('area_id', d.data.data.area_id);
                        window.localStorage.setItem('area_name', d.data.data.area_name);
                    }
                })
            },
            getYan(){

                //手机号输入了且输入正确 存入cookie
                this.setCookie('shoujihao2',this.username||'',7);//设置手机号cookie 7天

                var telMoshi = /^1[34578]\d{9}$/; //手机号验证   18688888888 123456
                if (this.username == '') {
                    this.$toast('手机号码不能为空');
                    return false;
                } else if (!telMoshi.test(this.username)) {
                    this.$toast('请输入正确的手机号码');
                    return false;
                } else if (this.imgma == "") {
                    this.$toast('图片验证码不能为空');
                    return false;
                } else {
                    this.jinzhiFlag = !this.jinzhiFlag;

                    //检测验证码
                    //this.sendYan();

                    //验证码倒计时
                    this.noResetTime('noResetTimeBtn','captchaRegist');
                }
            },
            //图片验证码
            changeSwitchImg(){
                var $url = this.baseUrl + "/api/mobilever?code=";
                $url = $url + Math.random();
                this.imgSrc = $url;
            },
            sendYan(){
                this.$indicator.open('加载中');
                this.$http.post(this.baseUrl + '/api/register/telCode', qs.stringify({
                    mobile: this.username,
                    imageCode: this.imgma
                })).then((d) => {
                    console.log(d)
                    this.$indicator.close();
                    if (d.data.data.status == '4040') {
                        this.$toast(d.data.data.msg);
                        return false;
                    } else if (d.data.data.data == '手机号码已注册') {
                        this.$toast('手机号码已注册');
                        return false;
                    } else if (d.data.data.code > 0) {
                        this.$toast(d.data.data.message);
                        return false;
                    } else {
                        console.log('开始发送验证码');
                    }
                }).catch((e) => {
                    this.$indicator.close();
                    MessageBox('提示', '服务器出错');
                })
            }
        },
        mounted(){
            this.getCity();
            this.$store.dispatch('changeFooter');

            if(this.getCookie('shoujihao2')!==''){
                this.username=this.getCookie('shoujihao2');
            }

            if(this.getCookie('captchaRegist')){
                this.noResetTime('noResetTimeBtn','captchaRegist');
            }
        }
    }
</script>
<style>
    select {
        width: 2.5rem;
        height: .9rem;
        border: 0;
        /*很关键：将默认的select选择框样式清除*/
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        /*在选择框的最右侧中间显示小箭头图片*/
        background: url("../assets/images/down222.png") no-repeat scroll right center transparent;
        /*为下拉小箭头留出一点位置，避免被文字覆盖*/
        padding-right: 14px;
        outline: 0;
    }

    /*清除ie的默认选择框样式清除，隐藏下拉箭头*/
    select::-ms-expand {
        display: none;
    }

    select option {
        border: 0;
        outline: 0;
        height: 1.2rem;
        display: block;
    }
</style>
