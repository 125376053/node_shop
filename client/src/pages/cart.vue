<template>
    <div>

        <div class="cartListPage">

            <ul class="cartList cartNoXiajia" v-if="localData.length>0">
                <li v-for="(d,index) in localData" class="orderPadding colorF" :id="d.id" :rels_id="d.id" :info="info"
                    :code="code" :limit_num="d.limit_num" :rest_num="d.rest_num" :addCartGoods="'addCartGoods'+d.id">
                    <router-link :to="{path:'/goodsDetail/'+d.id,query:{product_id:d.product_id}}">

                        <!--缓存各种值-->
                        <div class="editeTitle">
                            <p>{{d.production.product_name}}</p>

                            <!--<p class="bjhPrice" style="display: none;">{{d.price}}</p>
                            <p class="bjhNum" style="display: none;">{{d.order_num}}</p>
                            <p class="bjhGuige" style="display: none;">{{d.specs_name}}</p>
                            <p class="bjhggcun" style="display: none;">{{d.rest_num}}</p>-->

                            <p class="wancheng edte" @click.stop.prevent="editor(d,index)"><i></i>{{d.flag ? '完成' : '编辑'}}
                            </p>
                        </div>

                        <div class="orderPic cartOrderPic">
                            <div class="left left2">
                                <span class="checkbox1" :class="{checkbox2:d.selected===true}"
                                      @click.stop.prevent="dan(d)"></span>
                                <div class="cartScale" style="">
                                    <!--一定要清除图片本身加的样式-->
                                    <img v-setloadStyle="{
                                        el:'.cartScale',
                                        width:'1.51rem',
                                        height:'1.51rem'
                                    }" :src="d.production.images" style="width:64px;height:64px;">
                                </div>
                            </div>
                            <!--完成界面-->
                            <div class="youce" v-if="!d.flag">
                                <div class="imgRight imgRight2">
                                    <p class="p2">品牌：<span>{{d.brand.name}}</span></p>
                                    <p class="p3">规格：<span>{{d.specs_name}}</span></p>
                                    <p class="p4">价格：<span>{{d.price}}</span>元</p>
                                </div>
                                <div class="cartKucun">
                                    <p class="f1">
                                        <span>库存:</span>
                                        <span class="hasNumCun">{{d.rest_num}}</span>
                                    </p>
                                    <p>
                                        <span style="color:#666;">数量:</span>
                                        <span class="numShopx">{{d.order_num}}</span>
                                    </p>
                                </div>
                            </div>
                            <!--编辑界面-->
                            <div class="youce" v-if="d.flag">
                                <div class="editeContentp2">
                                    <Computing :shopping="d" :restNum="parseInt(d.rest_num)" @addGet="addGet"
                                               @remGet="remGet">

                                    </Computing>
                                    <div class="guigeEditor" @click.stop.prevent="selectGuige(d)">
                                        <span>规格:</span>
                                        <input type="text" :value="d.specs_name" readonly>
                                        <img src="../assets/images/editorText.jpg">
                                    </div>
                                </div>
                                <div class="editeContentp3" @click.stop.prevent="removed(d,index)">删除</div>
                            </div>
                        </div>

                    </router-link>
                </li>
            </ul>
            <div v-else style="width:100%;border:0;text-align: center;padding-top:1rem;">
                <img src="../assets/images/find.png" style="width:1.85rem;height:2.25rem;">
                <p style="margin-top:.1rem;font-size:.28rem;color:#666;">您还没有添加任何商品</p>
            </div>

        </div>

        <div class="cartJieSuan">
            <p class="eot" style="text-align: left; padding:0 0 0 10px; overflow: hidden;">
                订单金额满<span class="minPrice">99</span>元才可下单
                <span style="float:right;background:#ed5564;color:#fff;text-align: center;padding:0 10px;"
                      @click="allRemove">
                    全部删除
                </span>
            </p>
            <div class="eob">
                <div class="allCheck">
                    <p class="allCheckBtn">
                        <span class="checkbox1" :class="{checkbox2:allFlag&&localData.length>0}" id="checkAll"
                              @click.stop.prevent="checkAllFn"></span>
                        <span class="allCheck" @click.stop.prevent="checkAllFn">全选</span>
                    </p>
                    <p>
                        件:{{num}}
                    </p>
                    <p>
                        <span>合计金额：</span>
                        <span class="zongjia">{{totalMoney}}</span>
                    </p>
                </div>
                <a class="enterCartPay" @click="orderEnter">结算</a>
            </div>
        </div>

        <!--删除商品-->
        <mt-popup v-model="removeFlag">
            <div class="quxiaoTan" id="cartRemoveTan" style="display: block;">
                <p class="p1">提示</p>
                <p class="p2">是否确认删除商品</p>
                <p class="p3">
                    <a class="borderRight closed" @click="enterRemove">确定</a>
                    <a class="closed" @click="removeFlag=false">取消</a>
                </p>
            </div>
        </mt-popup>

        <!--编辑规格选择-->
        <mt-popup v-model="editorFlag" position="bottom" style="width: 100%;">
            <div class="addCartTop noPadding" id="selectGuigeTan" style="display: block;">
                <p class="titleName">{{currentShop ? currentShop.production.product_name : ''}}</p>
                <div class="guigeList">
                    <p class="title2">规格:</p>
                    <div class="guige-list">
                        <a @click="selectGuigeVal(d,index)" :thisGeId="d.id" :thisGePrice="d.price" :thisGeCun="d.num"
                           :class="{selectGuige:index===currentShop.selectIndex}"
                           v-for="(d,index) in currentGuigeList">
                            {{d.specs_name}}
                        </a>
                    </div>
                </div>
                <a class="bjQd clok">确定</a>
            </div>
        </mt-popup>

    </div>

</template>
<script>
    import {MessageBox} from "mint-ui"
    import Computing from "../components/Computing.vue";
    export default{
        name: 'cart',
        data(){
            return {
                removeFlag: false,
                editorFlag: false,
                nullFlag: false,
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : '',
                localData: [],
                code: '',//success成功 not_found删除 disable下架 not_enough库存不足
                info: '',
                currentShop: '',//当前点击的商品对象
                currentGuigeList: [],//当前商品对象的规格列表
                allFlag: false,
                totalMoney: 0,
                num: 0,
                currentItem: '',
                editorIndex: 0
            }
        },
        components: {
            Computing
        },
        methods: {
            localList(vueThis){
                /*
                 * dataArr[0][area_id]:1
                 dataArr[0][rels_id]:135
                 dataArr[0][product_id]:239
                 dataArr[0][spe_id]:406
                 dataArr[0][order_num]:1
                 dataArr[0][price]:55
                 dataArr[0][kucun]:98
                 dataArr[0][xiangou]:
                 **/
                if(this.getLocalData().length<=0){
                    return;
                }
                //axios不知怎么处理这种数据
                $.ajax({
                    url: this.baseUrl + '/api/validate/shopcar',
                    type: 'get',
                    data: {
                        dataArr: this.getLocalData()
                    },
                    success: function (d) {
                        let data = d.data;
                        //设置商品属性 确定商品现在的状态
                        data.forEach((item) => {
                            //成功
                            if (item.status.status === 'success') {
                                vueThis.code = 'success';
                                vueThis.info = '';
                                vueThis.localData.push(item);
                            }
                            //删除
                            if (item.status.status === 'production_not_found') {
                                vueThis.code = 'not_found'
                                vueThis.info = '';
                            }
                            //下架
                            if (item.status.status === 'production_disable') {
                                vueThis.code = 'disable'
                                vueThis.info = '';
                            }
                            //库存不足
                            if (item.status.status === 'not_enough') {
                                vueThis.code = 'not_enough';
                                vueThis.info = item.status.info;
                            }
                        })
                    }
                })
            },
            //编辑
            editor(d, index){
                //这里注意如何操作自己 不能给全局data对象设置变量 这样区别不了点击的是自己
                //应该 在点击的当前对象下面设置 变量 这样才不会影响别的
                //让当前点击的编辑进入编辑界面
                if (!d.flag) {
                    this.$set(d, 'flag', true)
                } else {
                    this.$set(d, 'flag', false)
                }
                //让当前点击的编辑的加减计算起作用
                if (!d.count) {
                    this.$set(d, 'count', d.order_num)//设置一个count计数器=数据的值 2个绑定起来
                    d.order_num = d.count;//count改变将导致数据改变 那么界面就改变了
                }

                this.editorIndex = index;
            },
            selectGuige(d){
                this.currentShop = d;
                this.editorFlag = true;
                //请求规格列表
                this.api.get(this.baseUrl + '/api/shops/car/edit/info?token=' + this.token || '', {
                    area_id: window.localStorage.getItem('area_id'),
                    rels_id: d.id
                }).then(d => {
                    this.currentGuigeList = d.data.data;

                    if (!this.selectIndex) {
                        this.$set(this.currentShop, 'selectIndex', 0);
                    }
                });
            },
            selectGuigeVal(d, index){
                //规格高亮要给自己设置 不是全局
                this.currentShop.selectIndex = index;
                //选择规格实时更新
                //规格名称-------change-------当前点击的商品对象的规格名称=新选择的规格名称
                this.currentShop.specs_name = this.currentGuigeList[index].specs_name;//规格名称
                this.currentShop.price = this.currentGuigeList[index].price;//价格
                this.currentShop.order_num = this.currentShop.count = 1;
                this.currentShop.rest_num = this.currentGuigeList[index].num;
                this.currentShop.specs_id = this.currentGuigeList[index].id;
                //修改count 而不是irder_num来改数量的原因是 count是传递给组件的原始数据 order_num是count的复制
            },

            //金额计算-----------------------------------------------------
            //加
            addGet(d, count){
                d.order_num = count;
                console.log(d.count)
                this.zongjia()
            },
            //减
            remGet(d, count){
                d.order_num = count;
                console.log(d.count)
                this.zongjia()
            },
            //删除
            removed(item, index){
                this.removeFlag = true;
                this.currentItem = item;//点击删除保存当前操作的删除的商品
            },
            //确认删除
            enterRemove(){
                let index = this.localData.indexOf(this.currentItem);//删除的是当前商品
                this.localData.splice(index, 1);
                this.zongjia();
                //数量
                this.num = this.localData.filter((item) => {
                    return item.selected;
                }).length;

                this.removeFlag = false;
            },
            //全部删除
            allRemove(){
                this.localData.forEach((item, index) => {
                    if (!item.selected) {
                        this.$toast("没有选择的");
                        return false;
                    }else{
                        MessageBox.confirm('确定要全部删除吗？').then((action, index) => {
                            this.localData = this.localData.filter((item, index) => {
                                return !item.selected //返回没有被选择的 也就是没有被删除的
                            });
                            this.zongjia();
                            this.num = this.localData.filter((item) => {
                                return item.selected;
                            }).length;
                        });
                    }
                });
                /*for(var i=0;i<this.localData.length;i++){
                 if(this.localData[i].selected){
                 this.localData.splice(i,1) //现在选择0,2 第一次删除0 第二次删除2
                 i--; //重置数组
                 }
                 }*/

            },
            //单选
            dan(item){
                var that = this;
                //检测对象的某个属性是否为空
                if (typeof item.selected == "undefined") {
                    //item对象不存在flag属性 就添加flag属性
                    //Vue.set
                    this.$set(item, 'selected', true)
                } else {
                    item.selected = !item.selected;
                }

                //单击计算总价
                this.zongjia();

                //加选-------从最后一个开始加有bug
                /*this.localData.forEach(d=>{
                 if(d.selected===true){
                 that.allFlag=true;
                 }else{
                 that.allFlag=false;
                 }
                 })*/

                //有几个是勾选的数量
                this.num = this.localData.filter((item) => {
                    return item.selected;
                }).length;

                if (this.localData.length === this.num) {
                    that.allFlag = true;
                } else {
                    that.allFlag = false;
                }
            },
            //全选反选
            checkAllFn(){
                let _this = this;
                this.allFlag = !this.allFlag;
                if (this.allFlag) {
                    this.localData.forEach(function (d, index) {
                        if (typeof d.selected === "undefined") {
                            _this.$set(d, 'selected', true)
                        } else {
                            d.selected = true;
                        }
                    })
                } else {
                    this.localData.forEach(function (d, index) {
                        if (typeof d.selected == "undefined") {
                            _this.$set(d, 'selected', false)
                        } else {
                            d.selected = false;
                        }
                    })
                }

                this.zongjia();

                //数量
                this.num = this.localData.filter((item) => {
                    return item.selected;
                }).length;
            },
            //总价
            zongjia(){
                let _this = this;
                _this.totalMoney = 0;
                this.localData.forEach(function (item, index) {
                    if (!item.count) {
                        _this.$set(item, 'count', item.order_num)//设置一个count计数器=数据的值 2个绑定起来
                        item.order_num = item.count;//count改变将导致数据改变 那么界面就改变了
                    }

                    if (item.selected) {
                        console.log(item.price, item.order_num, item.count)
                        _this.totalMoney += item.price * item.count;
                    }
                })
            },

            //结算
            orderEnter(){
                if(this.token){
                    this.$router.push("/orderEnter")
                }else{
                    //结算时编辑状态自动切换到完成状态

                    var minp=99;//订单最低金额
                    var curp=parseFloat(this.totalMoney).toFixed(2)*1||0;//tofixed返回字符串*1 隐士转为数字 任何数乘以1等于任何数
                    if(curp<minp){
                        this.$toast("订单金额不足");
                        return false;
                    }else{
                        this.localData.forEach(item=>{
                            if(item.selected){
                                let order_num=item.order_num;
                                let kucun=item.rest_num;
                                if(order_num>kucun){
                                    this.$toast("部分商品库存不足");
                                    return false;
                                }else{
                                    this.$router.push('/orderEnter');
                                    this.totalMoney='';
                                    this.clickSendData();
                                }
                            }
                        })
                    }
                }
            },
            //结算发送数据
            clickSendData(){
                let shopArr=[];
                this.localData.forEach(item=>{
                    if(item.selected){
                        shopArr.push(item.id);
                    }
                });
                console.log(shopArr);
                shopArr=JSON.stringify(shopArr);
                window.localStorage.setItem('jieSuanBtnClickGoOrder',shopArr);
            }
        },
        mounted(){
            this.localList(this);

            this.$store.dispatch('changeHideTop2');
        }
    }
</script>
<style>

</style>
