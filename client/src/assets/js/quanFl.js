

$(function(){
    var type='can_use';
    $(".tabBtn").on('click','li',function(){
        var index=$(this).index();
        if(index==0){
            type='can_use'
        }
        if(index==1){
            type='used'
        }
        if(index==2){
            type="expired"
        }
        $(this).addClass('current').siblings().removeClass('current');
        //$(".content").eq(index).addClass('currentShow').siblings().removeClass('currentShow');
        quan(type)
    });
    quan(type)
});


function quan(type){
    $.ajax({
        url: contextPath.dataPath +"/api/seller/coupons/list?token=" + userInfoObj.token,
        data:{
            token:userInfoObj.token,
            area_id:window.localStorage.getItem('area_id'),
            type:type,
            price:0
        },
        success:function(d){
            /*d.data=[
                {
                    "id": 19,
                    "coupon_id": 1,
                    "user_id": 1,
                    "is_used": 0,
                    "order_id": 0,
                    "created_at": null,
                    "updated_at": null,
                    "coupons_data": {
                        "id": 1,
                        "use_price": "38.00",
                        "count_price": "5.00",
                        "start_name": 1497024000,
                        "end_time": 1501516800
                    }
                },
                {
                    "id": 20,
                    "coupon_id": 1,
                    "user_id": 1,
                    "is_used": 0,
                    "order_id": 0,
                    "created_at": null,
                    "updated_at": null,
                    "coupons_data": {
                        "id": 1,
                        "use_price": "38.00",
                        "count_price": "10.00",
                        "start_name": 1497024000,
                        "end_time": 1501516800
                    }
                }
            ];*/

            var nullStr='';
            if(d.data.length==0){
                nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
                $(".content").html(nullStr);
            }else{
                //显示优惠券列表
                quanListFn(d.data,type);
            }
        }
    })
}


function quanListFn(data,type){
    var list="";
    var redOrBlueClass='';
    var typeStr='';
    var guoqitou='';
    var guoqijiao='';
    var guoqipic='';
    var guoqizi='';
    $.each(data,function(i,d){

        //判断是奇数还是偶数 显示蓝色和红色
        var odd=parseInt(d.coupons_data.count_price);
        if(odd%2){
            redOrBlueClass='redbg'
        }else{
            redOrBlueClass='bluebg'
        }

        //判断type是什么类型的优惠券
        if(type=='can_use'){
            typeStr='';
        }
        if(type=='used'){
            typeStr='<div class="shiyong"></div>'
        }
        if(type=='expired'){
            typeStr='<div class="guoqi"></div>'
            guoqitou='guoqitou';
            guoqijiao='guoqijiao';
            guoqipic='guoqipic';
            guoqizi='guoqizi';
        }

        list+='<li class="'+redOrBlueClass+'">\
                    '+typeStr+'\
                    <div class="top '+guoqitou+'">\
                        <span class="price">'+odd+'</span>\
                        <span class="yuan">元</span>\
                        <span class="quan">优惠券</span>\
                    </div>\
                    <div class="bot '+guoqijiao+'">\
                        <div class="left">\
                            <span class="icon '+guoqipic+'"></span>\
                            <span class="title '+guoqizi+'">订单满<i class="man">'+parseInt(d.coupons_data.use_price)+'</i>元即可使用</span>\
                        </div>\
                        <div class="right">\
                            <span class="icon"></span>\
                            <span class="title">'+d.coupons_data.end_time+'前使用</span>\
                        </div>\
                    </div>\
                </li>';
    });
    $(".content").html(list);
}

document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});