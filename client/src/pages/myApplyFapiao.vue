<template>
    <div class="myApplyPiao" style="overflow:auto;">
        <ul>
            <li>
                <p class="infor">
                    <span>公司抬头:</span>
                    <input v-model="username" id="name" type="text" placeholder="请输入公司名称">
                </p>
            </li>
            <li>
                <p class="infor fuwuClick" @click="serverData">
                    <span>发票项目:</span>
                    <b id="server">{{server}}</b>
                </p>
                <p class="rightJt">
                    <img src="../assets/images/returnRight.png">
                </p>
                <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
            </li>
            <li>
                <p class="infor">
                    <span>发票金额:</span>
                    <input v-model="myPrice" id="minPrice" type="number" :placeholder="'最低开票金额'+minKeCai">
                </p>
            </li>
            <li>
                <p class="infor">
                    <span>纳税人识别号:</span>
                    <input v-model="nashui" id="nashui" type="number" placeholder="请输入纳税人识别号">
                </p>
            </li>
            <li>
                <p class="infor">
                    <span>注册地址:</span>
                    <input v-model="zhuceAd" id="zhuceAd" type="text" placeholder="请输入注册地址">
                </p>
            </li>
            <li>
                <p class="infor">
                    <span>注册电话:</span>
                    <input v-model="zhuceTel" id="zhuceTel" type="text" placeholder="请输入注册电话">
                </p>
            </li>
            <li>
                <p class="infor">
                    <span>开户行:</span>
                    <input v-model="bankText" id="haha" type="text" placeholder="请输入开户行">
                </p>
            </li>
            <li>
                <p class="infor">
                    <span>开户行账号:</span>
                    <input v-model="bankNum" id="bankNum" type="text" placeholder="请输入开户行账号">
                </p>
            </li>
        </ul>

        <a class='recivBtn bottom' style="left:0;right:0;" @click="applyFapiao">提交申请</a>

    </div>
</template>

<script>
    let obj = null;
    export default{
        name: 'fapiao',
        data(){
            return {
                username: '',
                server: '请选择服务',
                id: '',
                nashui: '',
                zhuceAd: '',
                zhuceTel: '',
                bankText: '',
                bankNum: '',
                minKeCai:this.$route.query.minKeCai||0,
                keCaiPrice:this.$route.query.keCaiPrice||0,
                sheetVisible: false,
                serverList: [],
                myPrice:'',
                actions: [],
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : ''
            }
        },
        methods: {
            //申请开票
            applyFapiao(){
                if (this.username === "") {
                    this.$toast('请输入公司名称');
                    return false;
                } else if (this.server === '请选择服务') {
                    this.$toast('请选择服务');
                    return false;
                } else if (this.minPrice === '') {
                    this.$toast('请输入开票金额');
                    return false;
                } else if (parseFloat(this.myPrice) < parseFloat(this.minKeCai)) {
                    this.$toast('不能小于最小开票金额');
                    return false;
                } else if (parseFloat(this.myPrice) > parseInt(this.keCaiPrice)) {
                    this.$toast('不能大于可开票金额');
                    return false;
                } else if (this.nashui == '') {
                    this.$toast('请输入纳税人识别号');
                    return false;
                } else if (this.nashui.length < 6 || this.nashui.length >= 30) {
                    this.$toast('请输入6-30位纳税人识别号');
                    return false;
                } else if (this.zhuceAd == '') {
                    this.$toast('请输入注册地址');
                    return false;
                } else if (this.zhuceTel == '') {
                    this.$toast('请输入注册电话');
                    return false;
                } else if (!/^1[34578]\d{9}$/.test(this.zhuceTel)) {
                    this.$toast('请输入正确的注册电话');
                } else if (this.bankText == '') {
                    this.$toast('请输入开户行');
                    return false;
                } else if (this.bankNum == '') {
                    this.$toast('请输入开户行账号');
                    return false;
                } else if (this.bankNum.length < 6 || this.bankNum.length >= 30) {
                    this.$toast('请输入正确的开户行账号');
                    return false;
                } else {
                    this.api.post(this.baseUrl + '/api/invoice/create?token=' + this.token, {
                        title: this.username,
                        invoices_item_id: this.id,
                        taxpayer_no: this.nashui,
                        registration_address: this.zhuceAd,
                        registration_phone: this.zhuceTel,
                        card: this.bankText,
                        bank_deposit: this.bankNum,
                        amount: this.myPrice
                    }).then(d => {
                        console.log(d)
                        if (d.data.code == 0) {
                            this.$router.push('/my')
                        } else {
                            this.$toast({
                                message: d.code.message,
                                position: 'bottom',
                                duration: 5000
                            });
                        }
                    })
                }
            },
            //渲染服务列表
            serverData(){
                this.sheetVisible = true;
                this.api.get(this.baseUrl + '/api/invoice/item?token=' + this.token).then(d => {
                    this.actions = [];
                    d.data.data.forEach(item => {
                        this.actions.push({
                            name: item.item,
                            method(){
                                obj.server = item.item;
                                obj.id = item.id;
                            }
                        });
                    });
                })
            }
        },
        mounted(){
            obj = this;
            this.$store.dispatch('changeFooter');
        }
    }
</script>
<style>

</style>
