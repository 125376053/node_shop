<template>
    <div class="slider_delete" :style="{left:currentX + 'px'}"
         @touchstart.stop="touchStart($event)"
         @touchend.stop="touchEnd($event)"
         @touchmove.stop="touchMove($event)">
        <slot></slot>
    </div>
</template>
<script>
    /*
     * 滑动配置。distance 滑动距离
     */
    export default({
        data(){
            return {
                startPos:{x:0,y:0},
                endPos:{x:0,y:0},
                currentX:0,
            }
        },
        props:['sliderConf'],
        methods:{
            touchStart(e){
                this.startPos.x = e.pageX;
                this.startPos.y = e.pageY;
            },
            touchMove(e){
                var x = e.pageX,y=e.pageY;
                var distance =  this.sliderConf.distance * 75;
                //temp 将滑动速度变慢
                var temp = (x-this.startPos.x)*18/90;
                //查询当前位置值
                if(temp < 0 && this.currentX > -distance){
                    this.currentX = this.currentX + temp;
                }
            },
            touchEnd(e){
                var distance =  this.sliderConf.distance * 75;
                this.endPos.x = e.pageX;
                this.endPos.y = e.pageY;
                if(this.endPos.x - this.startPos.x < 0){
                    this.currentX = -distance;
                }else if(this.endPos.x - this.startPos.x > 0){
                    this.currentX = 0;
                }
                //最后判断，如果超出最阀值，就还原
                if(this.currentX < -distance || this.currentX > 0){
                    this.currentX = 0;
                }
            }
        }
    })
</script>
<style>
    .slider_delete{
        position: absolute;
        left: 0;
        z-index: 100;
    }
</style>
