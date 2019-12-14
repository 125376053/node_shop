var order_id=getSearchString('id'); //订单id;

(function(){
	$.ajax({
		url: contextPath.dataPath+'/api/order/info',
		type:'get',
		data:{
			token:userInfoObj.token,
			id:order_id
		},
		success:function(d){
			console.log(d);
			var data= d.data;
			//用户信息渲染
			bindAdress(data);
			//订单列表
			adShopList(data);
		}
	});
})();

function bindAdress(data){
	console.log(data);
	var audit=data.need_create;//"need_create": 0,//0不需要填写 1 需要填写
	var store_data=data.store_data;
	
	/*<span class="cityBtn" area_id="'+store_data.area.id+'">'+store_data.area.name+'</span>\*/
	
	var adressStr='';
	var shrName='';
	var shrTel='';
	var shrAdress='';
	var beizhu="";
	!audit?shrName='<span>'+store_data.contacts+'</span>':shrName='<input type="text" placeholder="请输入收货人姓名">';
	!audit?shrTel='<span>'+store_data.mobile+'</span>':shrTel='<input type="text" placeholder="请输入联系电话">';
	!audit?shrAdress='<span class="adressInfor">'+store_data.address+'</span>':shrAdress='<input type="text" placeholder="请输入详细地址" class="adressInfor">';
	!audit?beizhu='<p style="color:#666;">'+data.order_data.remark+'</p>':beizhu='<textarea placeholder="请输入备注信息"></textarea>';
	!audit?shrCityName='':shrCityName='<span class="cityBtn" area_id="'+store_data.area.id+'">'+store_data.area.name+'</span>';
	adressStr='<p class="p1">收货地址</p>\
			   <p class="p2">\
					<span class="tubiao"><img src="images/pepol_ico.jpg"></span>\
					<span>收货人：</span>\
					'+shrName+'\
				</p>\
				<p class="p2">\
					<span class="tubiao"><img src="images/tel_ico.jpg"></span>\
					<span>电话：</span>\
					'+shrTel+'\
				</p>\
				<p class="p2 noneBottomborder">\
					<span class="tubiao"><img src="images/map_ico.jpg"></span>\
					<span>收货地址：</span>\
					'+shrCityName+'\
					'+shrAdress+'\
				</p>\
				<div class="beizhu">\
					<div class="zitip">\
						<p class="ptitle">备注信息：</p>\
						'+beizhu+'\
					</div>\
				</div>';
	//渲染没有地址的页面
	$('.adress').html(adressStr);
}

function adShopList(data){
	var order_data=data.order_data;
	var str='';
	//测试数据
	//order_data.status='PAY';
	//order_data.seller_confirm='0';
	//order_data.canrefund='T';
	//测试数据

	var qxOrder=0; //是否可以取消订单
	var dfkQxStr='';
	var dshStr1='';
	var yshStr='';
	var yshFooter='';
	var statusText=''; //几种状态下的文字

	var qrshFlag=1;//是否显示确认收货

	var goToWhrer=''; //跳转的链接
	
	var shifu='';
	

	//待付款 -- 待付款   "can_cancel": 能否取消订单  1可以取消 0不可取消
	if(order_data.status=='WAIT_PAY'){
		if(order_data.can_cancel==1){
			//可以取消订单------取消订单按钮显示
			qxOrder=1;
			statusText='去支付';
		}else{
			qxOrder=0; //不可取消订单 订单按钮不显示
			dfkQxStr='<div class="heji_num2 cancleTime">\
							<span>取消时间:</span>\
							<span>'+order_data.cancel_time+'</span>\
					</div>'
		}
	}
	//待付款 -- 已取消
	if(order_data.status=='CANCEL_BEFORE_PAY' || order_data.status=='EXPIRED'){
		qxOrder=0;
		dfkQxStr='<div class="heji_num2 cancleTime">\
						<span>取消时间:</span>\
						<span>'+order_data.cancel_time+'</span>\
				</div>'
	}


	//待收货2种状态  -------待收货( 2种状态 可取消订单 不可取消订单 )"
	// "seller_confirm": 0,是否确认收货 0未确认收货 1已确认收货
	if(order_data.status=='PAY' && order_data.seller_confirm=='0'){
		//"can_cancel": 1,  //能否取消订单  1可以取消 0不可取消
		//order_data.can_cancel=1;
		if(order_data.can_cancel==1){
			//可以取消订单------取消订单按钮显示
			qxOrder=0;
			dshStr1='<div class="heji_num2">\
						<span>付款方式:</span>\
						<span>'+ order_data.pay_way+'</span>\
					</div>\
					<div class="heji_num2">\
						<span>付款时间:</span>\
						<span>'+ order_data.pay_time+'</span>\
					</div>\
					<div style="display: -webkit-box;">';
						if(order_data.can_confirm!=0) {
							dshStr1 += '<a style="display:block;width:50%;height: 0.99rem;font-size: 0.28rem;color: #333;text-align: center;line-height: 0.99rem;margin-top:.2rem;border-top:1px solid #dedede;background:#d4d4d4;color:#fff;" class="quxiaoOrder">取消订单</a><a style="display:block;width:50%;" id="' + order_data.id + '" class="recivBtn">确认收货</a>';
						}else{
							dshStr1 += '<a style="display:block;width:100%;height: 0.99rem;font-size: 0.28rem;color: #333;text-align: center;line-height: 0.99rem;margin-top:.2rem;border-top:1px solid #dedede;background:#d4d4d4;color:#fff;" class="quxiaoOrder">取消订单</a>'
						}

			dshStr1+='</div>';
		}else {
			//不可取消订单
			qxOrder = 0;
			dshStr1 = '<div class="heji_num2">\
							<span>付款方式:</span>\
							<span>' + order_data.pay_way + '</span>\
						</div>\
						<div class="heji_num2">\
							<span>付款时间:</span>\
							<span>' + order_data.pay_time + '</span>\
						</div>';
				if(order_data.can_confirm!=0) {
					dshStr1 += '<a id="' + order_data.id + '" class="recivBtn">确认收货</a>';
				}
		}
		

		statusText='确认收货';
		
		shifu='<div class="heji_num2">\
					<span>实际金额:</span>\
					<span class="newPrice"></span>\
				</div>'
	}
	//待收货已取消
	if(order_data.status=='CANCEL' || order_data.status=='CANCEL_REFUND'){
		qxOrder=0;
		dshStr1='<div class="heji_num2">\
							<span>付款方式:</span>\
							<span>'+ order_data.pay_way+'</span>\
						</div>\
						<div class="heji_num2">\
							<span>付款时间:</span>\
							<span>'+ order_data.pay_time+'</span>\
						</div>\
						<div class="heji_num2">\
							<span>取消时间:</span>\
							<span>'+ order_data.cancel_time+'</span>\
						</div>'
	}
	//已收货页面 "is_all_comment": "F",//是否已评论过  F未全部评论  T已全部评论
	if(order_data.status=='REFUND' || order_data.status=='REFUNING' || order_data.status=='REFUNDED' || order_data.status=='REJECTRETURNS' || order_data.status=='REMAIN' || order_data.status=='COMPLETE' || (order_data.status=='PAY' && order_data.seller_confirm=='1')){
		var pjStr=''
		if(order_data.is_all_comment=='F'){
			pjStr='评价'
		}else{
			pjStr='查看评价'
		}

		yshFooter='<div class="heji_num2">\
						<span>付款方式:</span>\
						<span>'+ order_data.pay_way+'</span>\
					</div>\
					<div class="heji_num2">\
						<span>付款时间:</span>\
						<span>'+ order_data.pay_time+'</span>\
					</div>\
					<div class="heji_num2">\
						<span>收货时间:</span>\
						<span>'+ order_data.seller_confirm_time+'</span>\
					</div>\
					<a href="orderEvaluate.html?order_id='+order_data.id+'" class="recivBtn">'+pjStr+'</a>'
		shifu='<div class="heji_num2">\
				<span>实际金额:</span>\
				<span class="newPrice"></span>\
			</div>'
	
	}

	//能否申请退货
	$.each(order_data.detail,function(i,d){

		//测试假数据
		//order_data.canrefund='T'
		//d.status='NORMAL'

		var gotoWhere='';
		if(order_data.canrefund=='T'){
			//能申请退货

			//NORMAL：正常(可以申请退款),
			// REFUNDED：已完成退货(已退货),
			// RETURN：退货中,
			// REFUNDFAIL:退货失败，
			// REMAIN：已部分退货(已退货)'
			var thStr='';
			if(d.status=='NORMAL'){
				console.log('退货');
				//可以退货 当前订单当前商品
				thStr='退货';

				gotoWhere='orderApplyReGoods.html?order_id='+order_id+'&order_detail_id='+ d.id+'&return_goods_num='+ d.hidden_num+'&trace_no='+order_data.trade_no;


			}
			if(d.status=='REFUNDED'){
				console.log('已退货');
				thStr='已退货';
				gotoWhere='orderReGoods.html?order_id='+order_data.id+'&order_detail_id='+ d.id+'';
			}
			if(d.status=='RETURN'){
				console.log('退货中');
				thStr='退货中';
				gotoWhere='orderReGoods.html?order_id='+order_data.id+'&order_detail_id='+ d.id+'';
			}
			if(d.status=='REFUNDFAIL'){
				console.log('退货失败');
				thStr='退货失败';
				gotoWhere='orderReGoods.html?order_id='+order_data.id+'&order_detail_id='+ d.id+'';
			}
			if(d.status=='REMAIN'){
				console.log('已部分退货');
				thStr='已部分退货';
				gotoWhere='orderReGoods.html?order_id='+order_data.id+'&order_detail_id='+ d.id+'';
			}
			
			if(parseFloat(d.price).toFixed(2)<=0.00){
				gotoWhere='';
				yshStr="";
			}else{
				yshStr='<a id="'+ d.id+'" href="'+gotoWhere+'" class="returnGoodsBtn">'+thStr+'</a>';
			}
			
			
		}

		str+='<li class="orderPadding colorF">\
				<a href="goodsDetails.html?area_id='+window.localStorage.getItem('area_id')+'&rels_id='+d.rels_id+'">\
					<p class="shopName">'+ d.product.product_name+'</p>\
					'+yshStr+'\
					<div class="orderPic orderPicAdress">\
						<div class="left">\
							<img src="'+ d.product.images+'">\
							<div class="imgRight imgRight2">\
								<p class="p2">品牌：<span>'+ d.product.brand.name+'</span></p>\
								<p class="p3">规格：<span>'+ d.product_specs.spec_name+'</span></p>\
								<p class="p4">价格：<span class="enOrPrice">'+ d.price+'</span>元</p>\
							</div>\
						</div>\
						<div class="right right2">\
							<span>数量:</span>\
							<span class="enOrNum">'+ d.quantity+'</span>\
						</div>\
					</div>\
				</a>\
			</li>'
	});
	$(".order-content").html(str);
	
	
	


//是否为赠品--------------------------------------------------------------------------------
	var zengpin="<img style='width:.79rem;height:.61rem;float:right;margin-top:.15rem;' src='images/zengpin.png'>"
	$(".shopName").each(function(){
		var price=$(this).parents('li').find('.enOrPrice').html();
		console.log(price)
		if(parseFloat(price).toFixed('2')==0.00){
			$(this).append(zengpin);	
		}
	})
//--------------------------------------------------------------------------------------

	var footerStr='<div class="jiesuan jiesuan2" qxOrder="'+qxOrder+'">\
						<div class="heji_num2">\
							<span class="marginRight">共计'+order_data.sum_goods_num+'件</span>\
							<span>合计金额:<i class="oldPrice">'+order_data.price+'</i></span>\
						</div>\
						<div class="heji_num2">\
							<span>获得积分:</span>\
							<span>'+order_data.score+'</span>\
						</div>\
						<div class="enter-quan" style=" display:block; height:.45rem;border:0;">\
					        <span style="display:inline-block;">优惠券:</span>\
					        <p style="display:inline-block;">\
					        	<span class="hasQuan">无可用优惠券</span>\
					        	<img class="show-hook" src="images/returnRight.png" style="width: 0.15rem;height: .28rem;">\
					        </p>\
					    </div>\
					    '+shifu+'\
						<div class="heji_num2">\
							<span>订单编号:</span>\
							<span>'+order_data.trade_no+'</span>\
						</div>\
						<div class="heji_num2">\
							<span>订单时间:</span>\
							<span>'+order_data.created_at+'</span>\
						</div>\
						<div>'+dfkQxStr+'</div>\
						<div>'+dshStr1+'</div>\
						<div>'+yshFooter+'</div>\
						<div class="jiesuanBtn2">\
							<a class="quxiaoOrder">取消订单</a>\
							<a href="'+goToWhrer+'" class="jiesuanZhifu zhifuOrder">'+statusText+'</a>\
						</div>\
					</div>';
	$(".orderDetailFooter").html(footerStr);
	
	
	//优惠券
	var coupon_data=data.coupon_data;
	
	/*coupon_data={
        "use_price": "38.00",
        "count_price": "94.00"
    }*/
	
	var youhuiText='';
	var maxPriceJian=(coupon_data.use_price);
	var maxPrice=(coupon_data.count_price);
	if(coupon_data.length==0){
		youhuiText="无可用优惠券";
		$(".show-hook").hide();
		$('.newPrice').html( parseFloat($(".oldPrice").html()).toFixed(2));
	}else{
		var str='满<i class="chaoguoPrice">'+maxPriceJian+'</i>减<i class="jieshengPrice">'+maxPrice+'</i>';
    	$(".hasQuan").html(str);
    	$(".show-hook").hide();
    	
    	$(".newPrice").html(( $(".oldPrice").html()-$(".jieshengPrice").html() ).toFixed(2))
	}

	//取消订单
	thisQxTan($('.quxiaoOrder'));
	//去支付
	thisZfTan($('.zhifuOrder'));
	//确认收货
	thisQrSh($('.recivBtn'));

	if($('.jiesuan').attr('qxOrder')==0){
		$('.jiesuanBtn2').hide();
	}else{
		$('.jiesuanBtn2').show();
	}
	
	
	//详情页 页脚固定
	$(".order-content").css({
		marginBottom:$(".orderDetailFooter").height()
	})
	
}

//取消弹出层
function thisQxTan(obj){
	obj.click(function(){
		$(".borderRight").unbind('click');
		event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
		$.lockScreen({
			begin:"quxiaoTan", //弹出层内容id
			closed:"closed",  //关闭class
			opacity:'0.7'	//遮罩层透明度
		});
		$(".borderRight").click(function(){
			$.ajax({
				url: contextPath.dataPath+'/api/order/cancel/get',
				type:'get',
				data:{
					token:userInfoObj.token,
					id:getSearchString('id')
				},
				success:function(d){
					console.log(d);
					//code=0 表示当前订单是取消的状态 后台就标记此订单为取消
					$('.jiesuan').find('.jiesuanBtn2').hide();
					$('.cancleTime').show();

					window.location.reload();
				}
			});
		});
		return false;
	});
}

//支付弹出层
function thisZfTan(obj){
	console.log(JSON.stringify(obj));
	console.log(obj.attr('id'))
	obj.click(function(event){
		event.preventDefault();
		
		var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				$.ajax({
				url:contextPath.dataPath+"/api/justpay?token="+userInfoObj.token,
				type: 'post',
				data: {
					id:getSearchString('id'),
					pay_way:'wechat_h5'
				},
				success: function (d) {
					var data=JSON.parse(d);
					WeixinJSBridge.invoke(
						'getBrandWCPayRequest',data,function(res){
							if(res.err_msg == "get_brand_wcpay_request:ok" ) {
								window.location.href='orderSuccess.html?status=success';
							}else{
								window.location.href='orderSuccess.html?status=error';
							}
						}
					);
				},
				error: function(e){
					jalert('服务器出错');
					this.attr('href','###')
				}
			});	
		}else{
			event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
			$.lockScreen({
				begin:"zhifuTan", //弹出层内容id
				closed:"clok",  //关闭class
				opacity:'0.7',	//遮罩层透明度
				mtop:'0',
				top:'none',
				bottom:'0'
			});
			
			$(".zhifuTan .wx").click(function(){
				wxH5(obj,'wx');
			});
			$(".zhifuTan .zfb").click(function(){
				wxH5(obj,'ali')
			});
		}
		


	});
	
	return false;
}

//确认收货----第2个tab里面的当前进行点击
function thisQrSh(obj){
	obj.click(function(event){
		$.ajax({
			url: contextPath.dataPath+'/api/seller/order/confirm',
			type:'get',
			data:{
				token:userInfoObj.token,
				id:getSearchString('id') //注意这个id问题
			},
			success:function(d){
				console.log(d);
				window.location.href='order.html';
			}
		});
	});
}

var wxChannel = null; // 微信支付
var aliChannel = null; // 支付宝支付
var channel = null; //接收
//app端支付
document.addEventListener('plusready',function(){
	 // 获取支付通道
    plus.payment.getChannels(function(channels){
        aliChannel=channels[0];
        wxChannel=channels[1];
        //alert('wx通道'+JSON.stringify(wxChannel))
    },function(e){
        alert("获取支付通道失败："+e.message);
    });
},false);

//var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';
//var WXPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';

function wxH5(obj,hu){
	var WXPAYSERVER="http://123.56.75.123:10009/api/justpay?token="+userInfoObj.token;
	var ALIPAYSERVER="http://123.56.75.123:10009/api/justpay?token="+userInfoObj.token;
	
	var zhifu=null;
	
	var ad='';
	if($('.adressInfor').val()){
		ad=$('.adressInfor').val()+','+$(".beizhu1").val()
	}else{
		ad=$('.adressInfor').html()+','+$(".beizhu1").val()
	}
	
	if(hu=="wx"){
		pay('wxpay');	
	}else if(hu=="ali"){
		pay('alipay');
	}
	
	// 2. 发起支付请求
	function pay(id){

	    // 从服务器请求支付订单
	    var PAYSERVER='';
	    if(id=='alipay'){
	        PAYSERVER=ALIPAYSERVER;
	        channel = aliChannel;
	        zhifu='alipay'
	    }else if(id=='wxpay'){
	        PAYSERVER=WXPAYSERVER;
	        channel = wxChannel;
	        zhifu='wechat'
	    }else{
	        plus.nativeUI.alert("不支持此支付通道！",null,"捐赠");
	        return;
	    }

	    $.ajax({
	   		url:PAYSERVER,
	   		type:'post',
			beforeSend:function(){
			   loading.show();
			},
	   		data:{
			    id:getSearchString('id'),
				pay_way:zhifu
	   		},
	   		success:function(d){

	   			//alert(JSON.stringify(channel))
	   			//alert(JSON.stringify(d))
	   			//alert(JSON.stringify(PAYSERVER))
	   			plus.payment.request(channel,d,function(result){
				    loading.hide();
	                plus.nativeUI.alert("支付成功！",function(){
	                    //back();
		                window.location.href = 'orderSuccess.html?status=success';
	                });
	            },function(error){
				    loading.hide();
	                plus.nativeUI.alert("支付失败!",function(){
		                window.location.href = 'orderSuccess.html?status=error';
	                });

	            });	
	   		},
	   		error:function(msg){
	   			//alert(msg)
	   			//console.log(msg)
	   			//alert(JSON.stringify(msg))
			    loading.hide();
	   		},
	   		complete:function(){
				//jalert('服务器超时');
				loading.hide();
			}
	   })
	}
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


