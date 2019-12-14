<template>
    <div class="loginContent repassContent" style="background:#fff; position: absolute;bottom:0;top:0;left:0;right:0;">

        <div class="tel">
            <img src="../assets/images/loginTel.png">
            <b>+86</b>
            <input v-model="username" type="tel" placeholder="" class="telValue_reset">
        </div>

        <div class="tel yanzm">
            <img src="../assets/images/repa123.png">
            <b>验证码</b>
            <input v-model="ma" type="number" placeholder="" class="yanValue" style="width: 2.6rem;">
            <button ref="noResetTimeBtn" class="getYan" @click="getYan">获取验证码</button>
        </div>

        <div class="tel">
            <img src="../assets/images/loginSuo.png">
            <b>新密码</b>
            <input v-model="password" :type="type" placeholder="请输入6-10位字母或数字" class="passValue" style="width:3.5rem;">
            <i class="biyan" @click.stop="yanJing" :class="{zhengyan:yFlag}"></i>
        </div>

        <a class="resetPassBtn" @click="resetFn">重置密码</a>

    </div>
</template>
<script>
    import qs from 'qs';
    export default{
        name:"resetPass",
        data(){
            return{
                yFlag:false,
                type:'password',
                username:this.$route.query.mobile||'',
                password:'',
                ma:''
            }
        },
        methods:{
            yanJing(){
                this.yFlag = !this.yFlag;
                this.type = this.yFlag ? 'text' : 'password';
            },
            resetFn(){
                this.setCookie('shoujihao', this.username||'',7);//设置手机号cookie 7天

                var telMoshi=/^1[34578]\d{9}$/;
                var passMoshi=/^[0-9a-zA-Z]{6,20}$/g;//验证密码  字母 数字 或者字母数字组合 6-20

                if(this.username==''){
                    this.$toast('手机号码不能为空');
                    return false;
                }else if(!telMoshi.test(this.username)){
                    this.$toast('请输入正确的手机号码');
                }else if(this.ma==''){
                    this.$toast('验证码不能为空');
                    return false;
                }else if(this.password==''){
                    this.$toast('密码不能为空');
                    return false;
                }else if(!passMoshi.test(this.password)){
                    this.$toast('密码是6-20位字母和数字，且最少有一个字母和数字混合');
                    return false;
                }else{
                    this.resetCheck();
                }
            },
            resetCheck(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/forgetSellersPwd',qs.stringify({
                    mobile:this.username,
                    password:this.password,
                    mobile_code:this.ma
                })).then((d)=>{
                    this.$indicator.close();
                    console.log(d)
                    if(d.data.data=='验证码错误'){
                        this.$toast('验证码输入错误');
                        return false;
                    }else if(d.data.code>0){
                        this.$toast(d.data.message);
                        return false;
                    }else{
                        this.$toast('重置密码成功');
                        this.$router.push({
                            path:'/login'
                        })
                    }
                }).catch((e)=>{
                    this.$indicator.close();
                    console.log(e)
                })
            },
            getYan(){
                this.setCookie('shoujihao', this.username||'',7);//设置手机号cookie 7天

                var telMoshi=/^1[34578]\d{9}$/; //手机号验证
                if(this.username==''){
                    this.$toast('手机号码不能为空');
                    return false;
                }else if(!telMoshi.test(this.username)){
                    this.$toast('请输入正确的手机号码');
                }else{
                    this.sendYan();
                }
            },
            sendYan(){
                this.$indicator.open('加载中...');
                this.$http.post(this.baseUrl + '/api/forgetPwdCode',qs.stringify({
                    mobile:this.username
                })).then((d)=>{
                    this.$indicator.close();
                    console.log(d)
                    if(d.data.data=='手机号码未注册'){
                        this.$toast('手机号码未注册');
                        return false;
                    }else if(d.data.code>0){
                        this.$toast(d.data.message);
                        return false;
                    }else{
                        console.log('验证码发送成功');
                        this.noResetTime('noResetTimeBtn','captcha');
                    }
                }).catch((e)=>{
                    this.$indicator.close();
                    console.log(e)
                })
            }

        },
        mounted(){
            this.$store.dispatch('changeFooter');

            if(this.getCookie('shoujihao')){
                this.username= this.getCookie('shoujihao');
            }

            if(this.getCookie('captcha')){
                this.noResetTime('noResetTimeBtn','captcha');
            }
        }
    }
</script>
<style>

</style>
