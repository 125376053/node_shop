<template>
    <div style="padding-bottom:1.5rem;">
        <div class="m-tab" style="height:.8rem;">
            <div v-for="(item,index) in buttonData" @click="tabShow(index)">
                <span :class="{ez:index===tabIndex2}">{{item}}</span>
            </div>
        </div>
        <!--内容区域-->
        <slot></slot>
    </div>
</template>
<script>
    export default{
        props:{
            buttonData:{
                type:Array, //Array/Object 默认值必须是一个函数返回所需的值
                //有默认值不传参也不会报错
                default(){
                    return [1,2,3]
                }
            },
            tabIndex:{
                type:Number,
                default:0
            },
            tabShowFlag:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return{
                tabIndex2:this.tabIndex,//用tabIndex2接手tabIndex父元素的传参 可以修改父元素数据而不报错
                tabShowFlag2:this.tabShowFlag
            }
        },
        methods:{
            tabShow(index){
                //1 子组件修改父组件数据 报错
                //2 通过对象带过来的props 修改对象下面的tabIndex解决
                //3 通过在组件内部data定义数据 修改data数据
                this.tabIndex2=index;
                //单一事件集中管理组件通信
                //现在点击的是谁？？？？
                this.busEvent.$emit('tabIndex',this.tabIndex2);

                this.tabShowFlag2=!this.tabShowFlag;
                this.busEvent.$emit('tabShowFlag',this.tabShowFlag2);
            }
        }
    }
</script>
<style>

</style>
