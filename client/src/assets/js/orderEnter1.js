$("#jianmian").val();
$("#youhui").val();


//强制刷新 解决微信缓存问题
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {
	var needRefresh = window.sessionStorage.getItem("need-refresh-order");
	if(needRefresh){
		window.sessionStorage.removeItem("need-refresh-order");
		location.reload();
	}
}
/*var needRefresh = window.sessionStorage.getItem("need-refresh-order");
if(needRefresh){
	window.sessionStorage.removeItem("need-refresh-order");
	location.reload();
}*/




var area_id=localStorage.getItem('area_id');
var jieSuanBtnClickGoOrder=localStorage.getItem('jieSuanBtnClickGoOrder');
jieSuanBtnClickGoOrder=JSON.parse(jieSuanBtnClickGoOrder);

enterOrder();
function enterOrder(){
	var time=new Date().getTime();//加时间戳解决微信浏览器返回的缓存不刷新页面问题
	$.ajax({
		url:contextPath.dataPath+"/api/order/previous?token="+userInfoObj.token+'&time='+time,
		type: 'get',
		data: {
			area_id:area_id,
			id:jieSuanBtnClickGoOrder,
		},
		success: function (d) {
			bindAdress(d.data);
			adShopList(d.data);
			gotoUrlPay(d.data);
		}
	});
}

function bindAdress(data){
	var audit=data.is_address;
	//audit=0;
	console.log(data)
	var store_data=data.store_data;
	var adressStr='';
	var shrName='';
	var shrTel='';
	var shrAdress='';
	var beizhu="";
	audit?cityName=store_data.area.name:cityName=store_data.area.name;
	audit?shrName='<span class="name1">'+store_data.contacts+'</span>':shrName='<input class="name1" type="text" placeholder="请输入收货人姓名">';
	audit?shrTel='<span class="tel1">'+store_data.mobile+'</span>':shrTel='<input class="tel2" type="text" placeholder="请输入联系电话">';
	audit?shrAdress='<span class="adressInfor">'+store_data.address.split(',')[0]+'</span>':shrAdress='<input type="text" readonly placeholder="请在地图上选择地址" class="adressInfor">';
	audit?beizhu='<span style="color:#666;width:100%;height:.5rem;" class="thText beizhu1">'+data.store_data.address.split(',')[1]+'</span>':beizhu='<textarea class="thText beizhu1" placeholder="请输入详细地址" spellcheck="false"></textarea>';

	beizhu='<div class="content adressInforHaha" style="height:1rem;">\
				'+beizhu+'\
			</div>';

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
					<span class="cityBtn" area_id="'+store_data.area.id+'">'+cityName+'</span>\
					'+shrAdress+'\
				</p>\
				<div class="beizhu">\
					<div class="zitip">\
						<p class="ptitle" style="color:#000;">请输入详细地址：</p>\
						'+beizhu+'\
					</div>\
				</div>\
				<div class="beizhu">\
					<div class="zitip">\
						<p class="ptitle" style="color:#000;">请输入备注信息：</p>\
						<div class="content">\
							<textarea class="thText2 beizhu2" placeholder="请输入备注信息" spellcheck="false"></textarea>\
							<span class="thSize2">140</span>\
						</div>\
					</div>\
				</div>';
	//渲染没有地址的页面
	$('.adress').html(adressStr);

	//假数据
	//data.is_address=0;
	//假数据
	if(data.is_address==0){
		console.log(1111111111111)
		var mapAdress=getSearchString('mapAdress');
		if(mapAdress){
			//证明是从地图页点击进来的
			if(localStorage.getItem('mapAdress')){
				console.log('1')
				//如果本地有记录地址 就不可编辑
				//$('.adressInfor').attr("disabled",true);
				$('.adressInfor').val(localStorage.getItem('mapAdress'));

				if(window.localStorage.getItem('saveName')){
					$(".name1").val(window.localStorage.getItem('saveName'))
				}

				if(window.localStorage.getItem('saveTel')){
					$(".tel2").val(window.localStorage.getItem('saveTel'))
				}

				if(window.localStorage.getItem('savebeizhu1')){
					$(".beizhu1").val(window.localStorage.getItem('savebeizhu1'))
				}

				if(window.localStorage.getItem('savebeizhu2')){
					$(".beizhu2").val(window.localStorage.getItem('savebeizhu2'))
				}

			}else{
				//本地无地址记录 就可以编辑
				$('.adressInfor').removeAttr("disabled");
				console.log('3')

				if(window.localStorage.getItem('saveName')){
					$(".name1").val(window.localStorage.getItem('saveName'))
				}

				if(window.localStorage.getItem('saveTel')){
					$(".tel2").val(window.localStorage.getItem('saveTel'))
				}

				if(window.localStorage.getItem('savebeizhu1')){
					$(".beizhu1").val(window.localStorage.getItem('savebeizhu1'))
				}

				if(window.localStorage.getItem('savebeizhu2')){
					$(".beizhu2").val(window.localStorage.getItem('savebeizhu2'))
				}
			}

		}else{
			//第一次进来 文本可编辑
			window.localStorage.removeItem('saveName');
			window.localStorage.removeItem('saveTel');
			window.localStorage.removeItem('savebeizhu1');
			window.localStorage.removeItem('savebeizhu2');
			window.localStorage.removeItem('mapAdress');


			console.log(2)
			/*window.localStorage.removeItem('saveName');
			window.localStorage.removeItem('saveTel');
			window.localStorage.removeItem('savebeizhu2');
			window.localStorage.removeItem('mapAdress');*/

			$('.adressInfor').removeAttr("disabled");
			console.log('2')

			$(".name1").on('input',function(){
				//if($(".name1").val()!=''){
					window.localStorage.setItem('saveName',$(".name1").val())
				//}
			})
			$(".tel2").on('input',function(){
				//if($(".tel2").val()!=''){
					window.localStorage.setItem('saveTel',$(".tel2").val())
				//}
			})

			$(".beizhu1").on('input',function(){
				//if($(".tel2").val()!=''){
				window.localStorage.setItem('savebeizhu1',$(".beizhu1").val())
				//}
			})

			$(".beizhu2").on('input',function(){
				//if($(".tel2").val()!=''){
				window.localStorage.setItem('savebeizhu2',$(".beizhu2").val())
				//}
			})


		}

		$('.adressInfor').click(function(){
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				window.location.href="orderEnterMap.html";
			}else{
				clicked('1.html');
			}
		})
	}else{
		$(".adressInforHaha").css('border','0')
	}

	beizhuCheck();
}

function adShopList(data){
	var order_data=data.product_list;
	var str='';
	$.each(order_data,function(i,d){
		str+='<li class="orderPadding colorF">\
				<p class="shopName">'+ d.product.product_name+'</p>\
				<div class="orderPic orderPicAdress">\
					<div class="left">\
						<img src="'+ d.product.images+'">\
						<div class="imgRight imgRight2">\
							<p class="p2">品牌：<span>'+d.product.brand.name+'</span></p>\
							<p class="p3">规格：<span>'+ d.product_specs.spec_name+'</span></p>\
							<p class="p4">价格：<span class="enOrPrice">'+ d.price+'</span>元</p>\
						</div>\
					</div>\
					<div class="right right2">\
						<span>数量:</span>\
						<span class="enOrNum">'+ d.order_num+'</span>\
					</div>\
				</div>\
			</li>'
	});
	$(".order-content").html(str);

	//多少件和多少钱
	enOrNumPrice(data);
}

function enOrNumPrice(data){
	$('.enterOrderNum').html(data.goods_num_count);
	$('.enterOrderPrice').html(data.count_money);
	$('.jifen').html(data.score);

	var dt=parseInt(data.order_pay_last_time);
	$('.longTime').html(dt);

    quan(data.count_money);
}

//优惠券
function quan(oop){
    $.ajax({
        url: "http://123.56.75.123:10003/api/seller/coupons/list?token=" + userInfoObj.token,
        data:{
            token:userInfoObj.token,
            area_id:window.localStorage.getItem('area_id'),
            type:'can_use',
            price:oop
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
			 "count_price": "0.2",
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
			 "count_price": "0.5",
			 "start_name": 1497024000,
			 "end_time": 1501516800
			 }
			 }
			 ];*/

            if(d.data.length==0){
                $(".hasQuan").html('无可用优惠券');
                $(".show-hook").hide();
                $('.newPrice').html( parseFloat($(".enterOrderPrice").html()).toFixed(2));
            }else{
            	//默认优惠
                morenYouhui(d.data);

                //显示优惠券列表
				quanListFn(d.data);
			}
        }
    })
}

function morenYouhui(data){
    var maxPrice=0;
    var maxPriceJian=0;
    var maxid=0;
    $.each(data,function(i,d){
        var ip=d.coupons_data.count_price
        if(ip>maxPrice){
            maxPrice=d.coupons_data.count_price;
            maxPriceJian=d.coupons_data.use_price;
            maxid=d.id;
        }
    });
    var str='满<i class="chaoguoPrice">'+maxPriceJian+'</i>减<i class="jieshengPrice">'+maxPrice+'</i>';
    $(".hasQuan").html(str);
    
    //优惠id
    $("#youhuiid").val(maxid);
    
    $(".show-hook").show();
    $(".newPrice").html(($('.enterOrderPrice').html()-maxPrice).toFixed(2));
}


function setUrl(num){
    var state={
        page:num,
        title:'',
        url:'orderEnter.html?tab='+num
    };
    window.history.pushState(state,state.title,state.url);
}

function quanListFn(data){
    $(".showSelectQuan").click(function(){
    	
    	
    	
        $(".page1").hide();
        $(".page2").show();

        var list='';
        var check='';

        var jieshengPrice=($(".jieshengPrice").html());
        
        $.each(data,function(i,d){
        	list+='<li youhuiId='+d.id+'>\
						<div class="redbg">\
							<div class="top">\
								<span class="price">'+(d.coupons_data.count_price)+'</span>\
								<span class="yuan">元</span>\
								<span class="quan">优惠券</span>\
							</div>\
							<div class="bot">\
								<div class="left">\
									<span class="icon"></span>\
									<span class="title">订单满<i class="man">'+(d.coupons_data.use_price)+'</i>元即可使用</span>\
								</div>\
								<div class="right">\
									<span class="icon"></span>\
									<span class="title">'+d.coupons_data.end_time+'前使用</span>\
								</div>\
							</div>\
						</div>\
						<div class="weizhi">\
							<span class="checkbox1"></span>\
						</div>\
					</li>';
		});
        $(".content1").html(list);
        
        $.each($(".content1 li"),function(i,d){
        	if(jieshengPrice==$(this).find('.price').html()){
        		$(this).find('.checkbox1').addClass('checkbox2');
        		
        		var price=$(this).find('.price');
            	var man=$(this).find('.man');

        		$("#jianmian").val(man.html());
            	$("#youhui").val(price.html());
        		return false;
        	}
        })


        //选择优惠券
        $('.checkbox1').click(function(){
            $(this).addClass('checkbox2').parents('li').siblings().find('.checkbox1').removeClass('checkbox2');

            var price=$(this).parents('li').find('.price');
            var man=$(this).parents('li').find('.man');
			var id=$(this).parents('li').attr('youhuiId');
            $("#jianmian").val(man.html());
            $("#youhui").val(price.html());
            $("#youhuiid").val(id);
        });
        
        setUrl(1)
        alert(window.location.href)

    });

    $(".leftJt2").click(function(){
        $(".page2").hide();
        $(".page1").show();
        var maxPriceJian=$("#jianmian").val();
        var maxPrice=$("#youhui").val();
        var str='满<i class="chaoguoPrice">'+maxPriceJian+'</i>减<i class="jieshengPrice">'+maxPrice+'</i>';
        $(".hasQuan").html(str);
        $(".show-hook").show();
        $(".newPrice").html(($('.enterOrderPrice').html()-maxPrice).toFixed(2));
    })
}


//跳转url
function gotoUrlPay(data){

	$('.enterOrderPay').click(function(){
		
		$('.zhifuTan .wx').unbind('click');
		$('.zhifuTan .zfb').unbind('click');
		
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
			zhifuDianji(data)
		}else{
			//支付弹出层
			event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
			$.lockScreen({
				begin:"enterOrderTan", //弹出层内容id
				closed:"clok",  //关闭class
				opacity:'0.7',	//遮罩层透明度
				mtop:'0',
				top:'none',
				bottom:'0'
			});
			
			//点击微信支付
			$('.zhifuTan .wx').click(function(){
				
				$("#dialog").remove();
				$("#lockScreen").remove();
				
				zhifuDianji(data,'wx')
			});
			
			//点击支付宝支付
			$('.zhifuTan .zfb').click(function(){
				
				$("#dialog").remove();
				$("#lockScreen").remove();
				
				zhifuDianji(data,'ali')
			});	
		}
		

		
	});
}


//微信支付  微信端 app端
function zhifuDianji(data,hu){
	//data.is_address=0;
	if(data.is_address==1){
		/*if($('.beizhu2').val()==''){
			jalert('请输入备注信息');
			
			return false;
		} */if($(".order-content").find('li').length==0){
			jalert('支付失败，请重新添加商品','',function(){
				window.location.href='home.html';
			});
			return false;
		}else{
			
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				tanAndAjax();	
			}else{
				//alert("app")
				wxH5(hu)
			}
			
		}
	}else{
		if($('.name1').val()==""){
			jalert('请输入您的姓名');
			return false;
		}else if($('.tel2').val()=='' || $('.tel1').val()==''){
			jalert('请输入您的电话');
			return false;
		}else if($('.adressInfor').val()==''){
			jalert('请输入您的地址');
			return false;
		}else if($('.beizhu1').val()==''){
			jalert('请输入详细地址');
			return false;
		}else /*if($('.beizhu2').val()==''){
			jalert('请输入备注信息');
			return false;
		}*/if($(".order-content").find('li').length==0){
			jalert('支付失败，请重新添加商品','',function(){
				window.location.href='home.html';
			});
			return false;
		}else{
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				tanAndAjax();	
			}else{
				//alert("app")
				wxH5(hu)
			}
		}	
	}
}


function tanAndAjax(){
	var ad='';
	if($('.adressInfor').val()){
		ad=$('.adressInfor').val()+','+$(".beizhu1").val()
	}else{
		ad=$('.adressInfor').html()+','+$(".beizhu1").val()
	}
	$.ajax({
		url:contextPath.dataPath+"/api/order/add?token="+userInfoObj.token,
		type: 'post',
		data: {
			area_id:area_id,
			id:jieSuanBtnClickGoOrder,
			remark:$('.beizhu2').val(),
			contacts:$('.name1').html()||$('.name1').val(),
			mobile:$('.tel1').html()||$('.tel2').val(),
			address:ad,
			pay_way:'wechat_h5',
			child_area_id:window.localStorage.getItem('mapAdressId'),
			partner_id:window.localStorage.getItem('mapAdressPartners_Id'),
			longitude:window.localStorage.getItem('mapAdressY'),
			latitude:window.localStorage.getItem('mapAdressX'),
			coupon_id:$("#youhuiid").val()
		},
		beforeSend:function(){
			loading.show();
		},
		success: function (d) {
			var data=JSON.parse(d);
			loading.hide();

			WeixinJSBridge.invoke(
				'getBrandWCPayRequest', data, function (res) {
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						window.location.href = 'orderSuccess.html?status=success';
					} else {
						window.location.href = 'orderSuccess.html?status=error';
					}
				}
			);

		},
		error: function(xhr, status, error){
			jalert('服务器出错');
			loading.hide();
		},
		complete:function(xhr,s,e){
			//jalert(xhr);
			loading.hide();
		}
	});
	
}

$(".zuhedi").css({
	'margin-bottom':$(".enterOrder").height()+'px'
});

//--------------------------------输入框字符限制-------------------------------------------
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

function beizhuCheck(){
	$(".thText").on('input',function(){
		//不允许输入空格 设置val为去除以后的值 输入结束提交时在去除空格
		var thisVal=$(this).val(trim($(this).val()));
		var size=140;
		var curSize=chekStrLen(trim($(this).val())); //检测字符长度+去除空格后的长度计算
		var reSize=size-curSize;
		if(curSize>size){
			$(".thSize").html('不允许输入太多字符').css('color','red').css('font-size','.2rem');
			$(this).val($(this).val().substring(0,size));
		}else{
			$(".thSize").html(reSize).css('color','green');
			$("#becouse").val(reSize);
		}
	});

	$(".thText2").on('input',function(){
		//不允许输入空格 设置val为去除以后的值 输入结束提交时在去除空格
		var thisVal=$(this).val(trim($(this).val()));
		var size=140;
		var curSize=chekStrLen(trim($(this).val())); //检测字符长度+去除空格后的长度计算
		var reSize=size-curSize;
		if(curSize>size){
			$(".thSize2").html('不允许输入太多字符').css('color','red').css('font-size','.2rem');
			$(this).val($(this).val().substring(0,size));
		}else{
			$(".thSize2").html(reSize).css('color','green');
			$("#becouse").val(reSize);
		}
	});
}


//表情转码
function utf16toEntities(str) {
	var patt=/[\ud800-\udbff][\udc00-\udfff]/g;
	// 检测utf16字符正则
	str = str.replace(patt, function(char){
		var H, L, code;
		if (char.length===2) {
			H = char.charCodeAt(0);
			// 取出高位
			L = char.charCodeAt(1);
			// 取出低位
			code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
			// 转换算法
			return "&#" + code + ";";
		} else {
			return char;
		}
	});
	return str;
}


//表情解码
function entitiestoUtf16(str){
	// 检测出形如&#12345;形式的字符串
	var strObj=utf16toEntities(str);
	var patt = /&#\d+;/g;
	var H,L,code;
	var arr = strObj.match(patt)||[];
	for (var i=0;i<arr.length;i++){
		code = arr[i];
		code=code.replace('&#','').replace(';','');
		// 高位
		H = Math.floor((code-0x10000) / 0x400)+0xD800;
		// 低位
		L = (code - 0x10000) % 0x400 + 0xDC00;
		code = "&#"+code+";";
		var s = String.fromCharCode(H,L);
		strObj=strObj.replace(code,s);
	}
	return strObj;
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

function wxH5(hu){
	//var WXPAYSERVER="http://123.56.75.123:1010/api/order/add?token="+userInfoObj.token;
	var WXPAYSERVER='http://123.56.75.123:10003/api/order/add?token='+userInfoObj.token;
	var ALIPAYSERVER='http://123.56.75.123:10003/api/order/add?token='+userInfoObj.token;
	
	
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
		//alert('支付id:'+id);
	    // 从服务器请求支付订单
	    var PAYSERVER='';
	    if(id=='alipay'){
	    	zhifu='alipay';
	        PAYSERVER=ALIPAYSERVER;
	        channel = aliChannel;
	    }else if(id=='wxpay'){
	        PAYSERVER=WXPAYSERVER;
	        channel = wxChannel;
	        zhifu='wechat';
	    }else{
	        plus.nativeUI.alert("不支持此支付通道！",null,"捐赠");
	        return;
	    }
	    //alert(PAYSERVER)
	    $.ajax({
	   		url:PAYSERVER,
	   		type:'get',
			cache:false,
			beforeSend:function(){
			   loading.show();
			},
	   		data:{
	   			area_id:area_id,
				id:jieSuanBtnClickGoOrder,
				remark:$('.beizhu2').val(),
				contacts:$('.name1').html()||$('.name1').val(),
				mobile:$('.tel1').html()||$('.tel2').val(),
				address:ad,
				pay_way:zhifu,//alipay wechat
				child_area_id:window.localStorage.getItem('mapAdressId'),
				partner_id:window.localStorage.getItem('mapAdressPartners_Id'),
				longitude:window.localStorage.getItem('mapAdressY'),
				latitude:window.localStorage.getItem('mapAdressX'),
				coupon_id:$("#youhuiid").val()
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
	   		error:function(err){
	   			//jalear('支付失败')
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
    	//alert(123)
    	$(".leftJt2").trigger('click');
        // 事件处理
        //window.history.back();
    }, false);
});




