<template>
    <div style="bottom:0;">

        <div class="returnNum" style="height: auto;">
            <p>退货数量:</p>
            <Computing style="margin:10px auto" :restNum="parseInt(return_goods_num)" @addGet="add" @remGet="rem">

            </Computing>
        </div>

        <div class="returnBecaus">
            <p>退货原因:</p>
            <div class="content">
                <textarea v-model="becouse" v-limit="140" class="thText" spellcheck="false"
                          placeholder="请输入退货原因"></textarea>
                <span class="thSize">140</span>
            </div>
        </div>

        <div class="addPic">
            <p>添加图片<span>（最多三张）</span></p>
            <ul id="view">
                <li v-for="(item,index) in list" :id="item.id">
                    <input :name="'file'+(index+1)" type="file" class="loadViewBtn" @change="uploadViews(item,index)">
                    <div class="loadViewContent" style="width:2.22rem;height:2.22rem;" v-setloadStyle>
                        <img :src="item.src" class="loadViewImg">
                    </div>
                </li>
            </ul>
        </div>

        <div class="applyReBtn">
            <a class="applyQx" @click="$router.go('-1')">取消</a>
            <a class="applyKuan" @click="applyReturn">申请退款</a>
        </div>

    </div>
</template>
<script>
    import uploader from '../components/upload2/uploader.vue'
    import Computing from "../components/Computing.vue";
    export default{
        //申请退货
        name: "orderApplyReGoods",
        components: {
            Computing,
            uploader
        },
        data(){
            return {
                shopping: {
                    count: 1
                },
                order_id: this.$route.query.order_id,
                order_detail_id: this.$route.query.order_detail_id,
                return_goods_num: this.$route.query.return_goods_num,
                trace_no: this.$route.query.trace_no,
                becouse: '',
                flag:false,
                url: this.baseUrl + '/api/uploadFileId',
                list: [{}, {}, {}],
                token: window.localStorage.getItem('userInfoObj') ? JSON.parse(window.localStorage.getItem('userInfoObj')).token : '',
            }
        },
        methods: {
            applyReturn(){
                console.log(this.flag)
                if (this.becouse === "") {
                    this.$toast("请输入退货原因");
                    return false;
                } else if (this.becouse.length >= 140) {
                    this.$toast("输入内容太长");
                    return false;
                }else if(!this.flag){
                    this.$toast("请至少选择一张图片");
                    return false;
                }else{
                    this.api.post(this.baseUrl+'/api/order/refund/post?token='+this.token,{
                        order_id:this.order_id,//订单id
                        order_detail_id:this.order_detail_id,//订单详情id
                        return_goods_num:this.return_goods_num,//退货数量
                        trace_no:this.trace_no,//订单号
                        reason:this.becouse,//退货原因
                        img_id:this.list[0].id+','+this.list[1].id+','+this.list[2].id//图片
                    }).then(d=>{
                        console.log(d)
                        if(d.data.code===0){
                            this.$router.push({
                                path:'/orderDetail',
                                query:{
                                    id:this.order_id
                                }
                            })
                        }else{
                            this.$toast('退货失败');
                            this.$router.push({
                                path:'/orderReGoodsDetail',
                                query:{
                                    id:this.order_id,
                                    order_detail_id:this.order_detail_id
                                }
                            });
                        }
                    });
                }
            },
            add(count){
                this.shopping.count = count;
            },
            rem(count){
                this.shopping.count = count;
            },
            //预览
            uploadViews(item, index){
                let file = event.target;//当前点击的元素
                let fileVal = file.value;//上传图片的地址
                let fileList = file.files; //上传图片的列表
                if (!/\.(jpg|jpeg|png|JPG|PNG|JPEG)$/.test(fileVal)) {
                    this.$toast('必须是图片类型的文件');
                    return false;
                } else {
                    let url = URL.createObjectURL(fileList[0]);//处理第一张上传文件
                    if (!item.src) {
                        this.$set(item, 'src', url)
                    } else {
                        this.$set(item, 'src', '')
                    }

                    var img=new Image();
                    img.src=url;//展示
                    var data=this.compass(img);//压缩后的
                    var blob=this.blob(data,file.type);//处理数据
                    this.sendAjaxUpload(this,item,blob);
                }
            },
            //压缩
            compass(img){
                //用于压缩图片的canvas
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext('2d');
                //瓦片canvas
                let tCanvas = document.createElement("canvas");
                let tctx = tCanvas.getContext("2d");
                let maxsize = 100 * 1024;


                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;

                //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
                let ratio;
                if ((ratio = width * height / 4000000)>1) {
                    ratio = Math.sqrt(ratio);
                    width /= ratio;
                    height /= ratio;
                }else {
                    ratio = 1;
                }

                canvas.width = width;
                canvas.height = height;

                //铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //如果图片像素大于100万则使用瓦片绘制
                let count;
                if ((count = width * height / 1000000) > 1) {
                    count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

                    //计算每块瓦片的宽和高
                    let nw = ~~(width / count);
                    let nh = ~~(height / count);

                    tCanvas.width = nw;
                    tCanvas.height = nh;

                    for (let i = 0; i < count; i++) {
                        for (let j = 0; j < count; j++) {
                            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                        }
                    }
                } else {
                    ctx.drawImage(img, 0, 0, width, height);
                }

                //进行最小压缩
                let ndata = canvas.toDataURL("image/jpeg", 0.1);

                console.log("压缩前：" + initSize);
                console.log("压缩后：" + ndata.length);
                console.log("压缩率：" + ~~(100 * (initSize - ndata.length) / initSize) + "%");
                tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

                return ndata;
            },
            //处理blob
            blob(comimg,type){
                //处理blob
                let text = window.atob(comimg.split(",")[1]);
                let buffer = new ArrayBuffer(text.length);
                let ubuffer = new Uint8Array(buffer);
                let pecent = 0 ,
                    loop = null;
                for (let i = 0; i < text.length; i++) {
                    ubuffer[i] = text.charCodeAt(i);
                }
                let Builder = window.WebKitBlobBuilder;
                let blob;
                if (Builder) {
                    let builder = new Builder();
                    builder.append(buffer);
                    blob = builder.getBlob(type);
                } else {
                    blob = new window.Blob([buffer], {type: type});
                }

                return blob;
            },
            //一张图片一次请求
            sendAjaxUpload(that, item, blob){
                //发生ajax
                let formData = new FormData();
                formData.append('file', blob);//第一张图片
                $.ajax({
                    url: this.baseUrl + '/api/uploadFileId',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (d) {
                        if (!item.id) {
                            that.$set(item, 'id', d);
                        } else {
                            that.$set(item, 'id');
                        }
                        that.flag=true;
                        console.log(that.flag)
                    }
                })
            }
        },
        mounted(){
            this.$store.dispatch('changeFooter');
        }
    }
</script>
<style>

</style>
