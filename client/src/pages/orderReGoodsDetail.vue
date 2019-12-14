<template>
    <div style="bottom:0;">
        <div class="addPic">

            <ul id="view">
                <li v-for="(item,index) in list" :id="item.id">
                    <input :name="'file'+(index+1)" type="file" class="loadViewBtn" @change="load(item,index)" capture="camera">
                    <div class="loadViewContent" style="width:2.22rem;height:2.22rem;" v-setloadStyle>
                        <img :src="item.src" class="loadViewImg">
                    </div>
                </li>
            </ul>

        </div>
    </div>
</template>
<script>

    // jquery localResizeImg npm i lrz   npm install lrz --save-dev
    require('lrz')
    export default{
        data(){
            return {
                list: [{}, {}, {}]
            }
        },
        methods: {
            load(item,index){
                var that=this;
                var file=event.target;
                var fileList=file.files[0];
                /* 压缩图片 */
                lrz(fileList, {
                    width:'200px',
                    quality :0.7
                }).then(function (rst) {
                    console.log(rst)
                    /* 处理成功后执行 */
                    rst.formData.append('base64img', rst.base64); // 添加额外参数
                    $.ajax({
                        url: "http://admin.cpm66.com/api/uploadFileId",
                        type: "POST",
                        data: rst.formData,
                        processData: false,
                        contentType: false,
                        success: function (data) {
                            that.$set(item,'src',rst.base64)
                        }
                    });
                }).catch(function (err) {
                    /* 处理失败后执行 */
                }).always(function () {
                    /* 必然执行 */
                })
            }
        },
    }
</script>
<style>

</style>
