
var status=getSearchString('status');//支付成功1 待收货 支付失败为0 待付款

//订单支付状态
orderZhiStatus();
function orderZhiStatus(){
	var str='';
	if(status=='success'){
		$(".succe").show();
	}else{
		$(".err").show();
	}	
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
       window.history.back();
    }, false);
});

