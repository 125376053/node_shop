var part=''; //带渲染的内容选项

var status=getSearchString('status');

if(status=='success'){
	part='PAY';
}else{
	part='WAIT_PAY';
}

var loadIndex=0;
if(part=='WAIT_PAY'){
	loadIndex=0;
}else if(part=='PAY'){
	loadIndex=1;
}else if(part=='COMPLETE'){
	loadIndex=2;
}else if(part==''){
	loadIndex=3;
}

$(".order-content").show();
(function(){
	orderTab();
	$(".order-nav li").eq(loadIndex).trigger('click');
})();

var statusText='';//订单列表状态

//订单列表选项卡
function orderTab(){
	var navLength=$(".order-nav li").length;
	$(".order-nav").on('click','li',function(){

		$(".order-content").find('li').remove();

		var index=$(this).index()+1;
		//所有图片重置
		noColor();	
		//当前图片高亮
		$(this).find('img').attr('src','images/order_tab_'+index+'@2x.png');
		$(this).find('span').css({
			'color':'#ed5564'
		});	
		$(this).find('p').css({
			'border-bottom':'2px solid #ed5564'	
		});
		var part=$(this).attr('data-part');

		if(userInfoObj.token){
			orderList(part);
		}else{
			console.log('请登录');
		}

	});
	function noColor(){
		var a=0;
		$(".order-nav li img").each(function(){
			a++;
			if(a==navLength+1){
				a=1;	
			}
			$(this).attr('src','images/order_tab_0'+a+'@2x.png');
		});
		$(".order-nav li span").css({
			'color':'#333'
		});
		$(".order-nav li p").css({
			'border-bottom':'none'	
		});
		//$(".order-content").hide();
	}		
}

//订单列表
function orderList(part){
	var time=new Date().getTime();//加时间戳解决微信浏览器返回的缓存不刷新页面问题
	$.ajax({
		url: contextPath.dataPath+'/api/order/list?time='+time,
		type:'get',
		data:{
			token:userInfoObj.token,
			part:part
		},
		success:function(d){
			console.log(d)
			var listd= d.data.data;
			console.log(listd)
			bindOrderList(listd,part);
		}
	});
}

function bindOrderList(listd,part){

	listd=listd.reverse();
	$.each(listd,function(i,d){

		//假数据
		/*d.status='PAY'
		d.seller_confirm='0'*/
		//假数据

		//console.log(d);
		var cancelded=0; //已取消状态下不显示按钮组 默认显示
		var cancelBtn=0; //是否显示取消按钮  默认不显示

		var qrshFlag=1;

		var btnText='';//btnText 按钮文字
		// status  is_all_comment  seller_confirm 这三个字段可以判断出所有状态
		var statusText=''; //根据状态标题显示不同的字
		//待付款2种状态----待付款 已取消
		if(d.status=='WAIT_PAY'){
			//待付款 -- 待付款
			statusText='待付款';
			btnText='去支付';
			//"can_cancel": 1,  //能否取消订单  1可以取消 0不可取消
			if(d.can_cancel==1){
				//可以取消订单------取消订单按钮显示
				cancelBtn=1;
			}else{
				//不可取消订单
				cancelBtn=0; //不显示
			}
		}
		if(d.status=='CANCEL_BEFORE_PAY' || d.status=='EXPIRED'){
			//待付款 -- 已取消
			statusText='已取消';//订单删除
			cancelded=1;
			console.log(cancelded)
		}
		//待收货2种状态  -------待收货( 2种状态 可取消订单 不可取消订单 ) 已取消
		//"seller_confirm": 0, //是否点击过确认送达(点击过确认送达 订单就从待收货变为已完成)
		if(d.status=='PAY' && d.seller_confirm=='0'){
			//待收货 -- 待收货   can_cancel(判断是否能够取消)
			statusText='待收货';
			//d.can_cancel=1
			//"can_cancel": 1,  //能否取消订单  1可以取消 0不可取消
			if(d.can_cancel==1){
				//可以取消订单------取消订单按钮显示
				cancelBtn=1;
			}else{
				//不可取消订单
				cancelBtn=0;
			}

			if(d.can_confirm==0){
				qrshFlag=0;//不显示
			}

			btnText='确认收货';

			var qrClass='qrsh';
		}
		//待收货已取消
		if(d.status=='CANCEL' || d.status=='CANCEL_REFUND'){
			//待收货 -- 已取消
			statusText='已取消';
			cancelded=1;
		}
		//已收货页面-------没有已取消的状态
		if(d.status=='REFUND' || d.status=='REFUNING' || d.status=='REFUNDED' || d.status=='REJECTRETURNS' || d.status=='REMAIN' || d.status=='COMPLETE' || (d.status=='PAY' && d.seller_confirm=='1')){

			var pjClass='pingjia';

			//"is_all_comment": "F",//是否已评论过  F未全部评论  T已全部评论
			if(d.is_all_comment=='F'){
				console.log('未全部评论'); //评价
				statusText='已收货';
				btnText='评价';
			}else{
				console.log('已全部评论'); //查看评价
				statusText='已评价';
				btnText='查看评价';
			}
		}

		var li=$('<li class="orderPadding colorF" id="'+ d.id+'">');
		var orderStr='<div class="orderTitel">\
								<div class="left">\
									<span class="danhao">订单号:'+ d.trade_no+'</span>\
									<p class="date">\
										<span>'+ d.created_at+'</span>\
									</p>\
								</div>\
								<div class="right rightText">'+statusText+'</div>\
							</div>\
							<div class="shopList">\
								<a href="orderDetail.html?id='+ d.id+'"></a>\
							</div>\
							<div class="jiesuan">\
								<div class="heji_num">\
									<span>共'+ d.sum_goods_num+'件商品</span>\
									<span>合计金额:'+ d.price+'</span>\
								</div>\
								<div class="jiesuanBtn" cancelded="'+cancelded+'">\
									<a class="quxiaoOrder" cancelBtn="'+ cancelBtn+'">取消订单</a>\
									<a noShow="'+qrshFlag+'" class="jiesuanZhifu zhifuOrder '+qrClass+' '+pjClass+'">'+btnText+'</a>\
								</div>\
							</div>';
		li.append(orderStr);

		$.each(d.detail,function(i,d){
			if(i>0)return;
			var shopList='<div class="orderPic">\
							<div class="left">\
								<img src="'+d.product.images+'">\
								<div class="imgRight">\
									<p class="p1">商品名称：\
										<span>'+d.product.product_name+'</span>\
									</p>\
									<p class="p2">品牌：\
										<span>'+ d.product.brand.name+'</span>\
									</p>\
									<p class="p3">规格：\
										<span guige_id="'+ d.product_specs.id+'"> \
											'+ d.product_specs.spec_name+' \
										</span> \
									</p>\
									<p class="p4">价格：<span>'+ d.price+'元</span></p>\
								</div>\
							</div>\
							<div class="right">\
								<span>数量:</span>\
								<span>'+ d.quantity+'</span>\
							</div>\
						</div>';
			li.find('.shopList a').append(shopList);
		});

		$(".order-content").prepend(li);
	});

	//没有列表的时候----------------------

	if(!listd.length){
		var nullStr='';
		var partStr='';
		if(part=='WAIT_PAY'){
			partStr='待付款';
		}else if(part=='PAY'){
			partStr='待收货';
		}else if(part=='COMPLETE'){
			partStr='已收货';
		}else if(part==''){
			partStr='全部';
		}
		nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
						<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
						<p style="margin-top:.1rem;font-size:.28rem;color:#666;">没有'+partStr+'内容</p>\
					</div>';
		$(".order-content").html(nullStr);
	}else{
		$(".order-content").children('div').remove();
	}
	//没有列表的时候----------------------


	$(".order-content li").each(function(){
		console.log($(this).length)
		var that=$(this);

		//取消弹出层
		thisQxTan(that);
		//支付弹出层
		thisZfTan(that);
		//确认收货
		thisQrSh(that);
		//评价
		thisPingJia(that);


		//是否是取消状态 取消状态不显示按钮组
		if($(this).find('.jiesuanBtn').attr('cancelded')==1){
			$(this).find('.jiesuanBtn').hide();

			//左滑动删除已取消的订单
			dargLeft($(this)[0],function(d){
				console.log(d)
				$.ajax({
					url: contextPath.dataPath+'/api/order/del/get',
					type:'get',
					data:{
						token:userInfoObj.token,
						id:d
					},
					success:function(d){
						console.log(d);
						if(d.code==0){
							window.location.reload();
						}else{
							jalert('删除失败')
						}
					}
				});
			});

		}else{
			$(this).find('.jiesuanBtn').show();
		}

		//是否可取消订单
		if($(this).find('.quxiaoOrder').attr('cancelbtn')==1){
			$(this).find('.quxiaoOrder').show();
		}else{
			$(this).find('.quxiaoOrder').hide();
		}

		//是否显示确认收货
		if($(this).find('.jiesuanZhifu').attr('noShow')==0){
			$(this).find('.jiesuanZhifu').hide();
			$(".jiesuanBtn").width('1.58rem');
		}else{
			$(this).find('.jiesuanZhifu').show();
			$(".jiesuanBtn").width('3.42rem');

		}

		//已收货的所有订单也可以删除
		if($(this).find('.pingjia').length>0){
			//左滑动删除订单
			dargLeft($(this)[0],function(d){
				$.ajax({
					url: contextPath.dataPath+'/api/order/del/get',
					type:'get',
					data:{
						token:userInfoObj.token,
						id:d
					},
					success:function(d){
						console.log(d);
						window.location.reload();
					}
				});
			});
		}
	});
}


//订单列表支付
function orderListGoPay(obj){
	//alert(JSON.stringify(obj.attr('id')))
	$.ajax({
		url:contextPath.dataPath+"/api/justpay?token="+userInfoObj.token,
		type: 'post',
		data: {
			id:obj.attr('id'),
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
		}
	});
}


//取消弹出层
function thisQxTan(obj){
	obj.find('.quxiaoOrder').click(function(){
		$(".borderRight").unbind('click');
		event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
		$.lockScreen({
			begin:"quxiaoTan", //弹出层内容id
			closed:"closed",  //关闭class
			opacity:'0.7'	//遮罩层透明度
		});
		$(".borderRight").click(function(){
			$.ajax({
				url:contextPath.dataPath+'/api/order/cancel/get',
				type:'get',
				data:{
					token:userInfoObj.token,
					id:obj.attr('id')
				},
				success:function(d){
					console.log(d);
					//code=0 表示当前订单是取消的状态 后台就标记此订单为取消
					window.location.reload();
				}
			});
		});
		return false;
	});
}

//支付弹出层
function thisZfTan(obj){
	obj.find(".zhifuOrder").click(function(event){
		
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
			orderListGoPay(obj);	
		}else{
			//alert('app')
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
				//alert(JSON.stringify(obj.attr('id')))
				wxH5(obj,'wx')
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
	if(obj.find('.qrsh').length>0){
		obj.find(".zhifuOrder").unbind('click');
	}
	obj.find(".qrsh").click(function(event){
		$.ajax({
			url: contextPath.dataPath+'/api/seller/order/confirm',
			type:'get',
			data:{
				token:userInfoObj.token,
				id:obj.attr('id')
			},
			success:function(d){
				console.log(d);
				window.location.reload();
			}
		});
	});
}

//评价
function thisPingJia(obj){
	if(obj.find('.pingjia').length>0){
		obj.find(".zhifuOrder").unbind('click');
		obj.find('.pingjia').attr('href','orderEvaluate.html?order_id='+obj.attr('id')+'');
	}
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
    },function(e){
        alert("获取支付通道失败："+e.message);
    });
},false);

//var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';
//var WXPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';

function wxH5(obj,hu){
	//alert(JSON.stringify(obj.attr('id')))
	//alert(hu)
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
		//alert('支付id:'+id)
	    // 从服务器请求支付订单
	    var PAYSERVER='';
	    if(id=='alipay'){
	        PAYSERVER=ALIPAYSERVER;
	        channel = aliChannel;
	        zhifu='alipay';
	    }else if(id=='wxpay'){
	        PAYSERVER=WXPAYSERVER;
	        channel = wxChannel;
	        zhifu='wechat';
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
	   			id:obj.attr('id'),
				pay_way:zhifu	 //alipay wechat
	   		},
	   		success:function(d){

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


