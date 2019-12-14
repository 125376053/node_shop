<template>
    <div class="computing">
        <b class="rema" @click.stop.prevent="rem">-</b>
        <input class="shopNum" type="text" readonly v-model="shopping.count" />
        <b class="adda" @click.stop.prevent="add">+</b>
    </div>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        props:{
            //传入一个对象的原因是 当子组件修改父组件数据时 不发生报错
            shopping:{
                type:Object,
                default:function(){
                    return {
                        count:1
                    }
                }
            },
            limitNum:{
                type:Number,
                default:0
            },
            restNum:{
                type:Number,
                default:1
            }
        },
        methods:{
            add(){
                if(this.shopping.count>=this.restNum){
                    this.shopping.count=this.restNum;
                    this.$toast({
                        message: '购买数量不能超过库存数量',
                        position: 'bottom',
                        duration: 5000
                    });
                    //toast层级问题
                    this.$nextTick(()=>{
                        document.querySelector(".mint-toast").style.zIndex="99999"
                    })
                }else{
                    this.shopping.count++;
                }
                this.$emit('addGet',this.shopping,this.shopping.count);
            },
            rem(){
                if(this.shopping.count<=0){
                    this.shopping.count=0;
                }else{
                    this.shopping.count--;
                }
                this.$emit('remGet',this.shopping,this.shopping.count);
            }
        },
        mounted(){

        }
    }
</script>
<style>
    *{margin:0;padding:0;}
    .computing {
        width: 3.52rem;
        height: .6rem;
        line-height: .6rem;
        border: 1px solid #b6b6b6;
    }
    .computing b {
        width: .6rem;
        height: .6rem;
        text-align:center;
        float: left;
        font-size: .6rem;
        color: #b6b6b6;
        box-sizing: border-box;
        background: #fff;
    }
    .computing input {
        float: left;
        width: 2.32rem;
        text-align: center;
        border-left: 1px solid #b6b6b6;
        border-right: 1px solid #b6b6b6;
        box-sizing: border-box;
        height: .6rem;
    }
</style>
