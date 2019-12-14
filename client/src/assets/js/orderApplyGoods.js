var order_id=getSearchString('order_id');
var order_detail_id=getSearchString('order_detail_id');
var return_goods_num=getSearchString('return_goods_num');
var trace_no=getSearchString('trace_no');


//addOrRem(return_goods_num);

//当前订单的当前商品退货
function applyReturn(){

	/*if(!$("#shuling").val() && !$("#shuling").val()>0){
		jalert('请选择退货数量');
		return false;
	}else */if($('.content textarea').val()==''){
		jalert('请输入退货原因');
		return false;
	}else if(!window.hasImg){ //都不存在才执行 有一个存在则不执行
		jalert('请选择一张图片');
		return false;
	}else{
		$.ajax({
			url:contextPath.dataPath+'/api/order/refund/post?token='+userInfoObj.token,
			type:'post',
			data:{
				token:userInfoObj.token,
				order_id:order_id,//订单id
				order_detail_id:order_detail_id,//订单详情id
				return_goods_num:return_goods_num,//退货数量
				trace_no:trace_no,//订单号
				reason:$(".thText").val(),//退货原因
				img_id:$("#pic0").val()+','+$("#pic1").val()+','+$("#pic2").val()//图片
			},
			success:function(d){
				console.log(d.code);
				if(d.code==0){
					jalert('退货成功','',function(){
						window.location.href='orderDetail.html?id='+order_id;
					});
				}else{
					jalert('退货失败');
					return false;
				}
			}
		});
	}
}


//退货数量限制
function addOrRem(rest_num){
	var cartNum=0;
	$(".jisuan").on('click','p',function(){
		if($(this).attr('class')=='rema'){
			if(cartNum<=0){
				cartNum=0
			}else{
				cartNum--;
			}
		}
		if($(this).attr('class')=='adda'){
			cartNum++;
		}
		$(".shopNum").val(cartNum);
		$("#shuling").val(cartNum);
		if(cartNum>parseInt(rest_num)){
			jalert('退出数量不允许大于购买数量');
			cartNum=rest_num;
			$(".shopNum").val(cartNum);
			$("#shuling").val(cartNum);
		}
	});
}

//检测字符长度
function chekStrLen(str){
	var strlen = 0;
	for(var i = 0;i < str.length; i++){
		if(str.charCodeAt(i) >= '0x4e00' && str.charCodeAt(i) <= '0X9fa5'){
			strlen += 3;
		}else{
			strlen++;
		}
	}
	return strlen;
}

//不允许输入空格
function trim(str){
	var re=/(^\s*)|(\s*$)/g;
	str=str.replace(re,"");
	return str;
}

$(".thText").on('input',function(){
	//不允许输入空格 设置val为去除以后的值 输入结束提交时在去除空格
	var thisVal=$(this).val(trim($(this).val()));
	var size=140;
	var curSize=chekStrLen(trim($(this).val())); //检测字符长度+去除空格后的长度计算
	var reSize=size-curSize;
	if(curSize>size){
		$(".thSize").html('不允许输入太多字符').css('color','red');
		$(this).val($(this).val().substring(0,size));
	}else{
		$(".thSize").html(reSize).css('color','green');

		$("#becouse").val(reSize);
	}
});

//申请退款
$(".applyKuan").click(function(){
	applyReturn();
});

//取消退货
$('.applyQx').click(function(){
	window.history.back();
});



document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});

