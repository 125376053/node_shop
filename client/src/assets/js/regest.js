
var njump=getSearchString('njump');
var push_user_id=getSearchString('push_user_id');
//alert('njump:'+njump)
var openid=getSearchString('openid');
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {

	if(!njump){
		window.location.href="http://admin.cpm88.xyz/wechat/sellerinfo?push_user_id="+push_user_id;
	}else{
		//alert('不跳转 留在此页面')
	}
}



var area_id=localStorage.getItem('area_id');
var push_user_id=getSearchString('push_user_id');

/*if(userInfoObj.token){
	window.location.href="home.html";
}*/

(function(){
	//点击注册按钮注册
	$(".registBtn").click(function(){

		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
			zhuceBtnYzWx()
		}else{
			
			//push
			var info = plus.push.getClientInfo();
            var cid=info.clientid;
            zhuceBtnYzApp(cid)

			//zhuceBtnYzWx()

		}

	})
})();

function zhuceBtnYzWx(){
	
	setCookie('shoujihao2', $('.telValue_zhuce').val()||'',7);//设置手机号cookie 7天

	var telMoshi=/^1[34578]\d{9}$/;
	var sjVal=$('.telValue_zhuce').val();

	var passMoshi=/^[0-9a-zA-Z]{6,20}$/g;
	var passVal=$(".tel .passValue").val();

	if($(".telValue_zhuce").val()==''){
		jalert('手机号码不能为空');
		return false;
	}else if(!telMoshi.test(sjVal)){
		jalert('请输入正确的手机号码');
		return false;
	}else if($(".tel .yanValue").val()==''){
		jalert('验证码不能为空');
		return false;
	}else if($(".tel .passValue").val()==''){
		jalert('密码不能为空');
		return false;
	}else if(!passMoshi.test(passVal)){
		jalert('密码是6-20位字母或数字，或字母数字的组合');
		return false;
	}else if($(".shopname input").val()==''){
		jalert('商铺名称不能为空');
		return false;
	}else if($(".shopadress input").val()==''){
		jalert('商铺地址不能为空');
		return false;
	}else if(!$('.xieyi .checkbox11').hasClass('checkbox22')){
		jalert('请选择同意服务协议');
		return false;
	}else{
		//alert(openid)
		$.ajax({
			url: contextPath.dataPath+'/api/registerSellers',
			type:'post',
			async:false,
			//timeout:1000,
			data:{
				mobile:sjVal,
				password:passVal,
				mobile_code:$('.yanValue').val(),
				area_id:area_id,
				push_user_id:push_user_id||'',
				cid:'',
				openid:openid||'',
				push_user_id:getSearchString('push_user_id')||0,
				selller_reg_store_name:$(".shopname input").val(),
				selller_reg_store_addr:$(".shopadress input").val()+'++'+$("#cityName2").val()+'++'+$("#adress2").val()
			},
			beforeSend:function(){
				loading.show();
			},
			success:function(d){
				loading.hide();
				console.log(d);
				if(d.data=='验证码错误'){
					jalert('验证码错误');
					console.log(d.data);
					return false;
				}else if(d.code>0){
					jalert('验证码错误');
					return false;
				}else{
					
					
					$("#token").val(d.data.token);
					//alert(d.data.token)
					window.localStorage.setItem('token',d.data.token)
					
					//------------------------------------------------------------------------------------------
                    //存储用户信息
                    var userInfoObj={
                        "id": d.data.id,   //商户的id
                        "mobile": d.data.mobile,   //商户的手机号
                        "is_disable":  d.data.is_disable,   //商户是否禁用 0为未禁用,1为已禁用
                        "audit": d.data.audit,  //0为未审核,1为已审核
                        "user_id": d.data.user_id,  //用户的user_id
                        "token": d.data.token
                    };
                    userInfoObj=JSON.stringify(userInfoObj);
                    window.localStorage.setItem('userInfoObj',userInfoObj);
//------------------------------------------------------------------------------------------
					window.location.href = 'youhuiquan.html';		
				}

			},
			error:function(res,status,err){
				jalert('注册失败')
				loading.hide();
			}
		})
	}
}

function zhuceBtnYzApp(cid){
	//alert(123)
	setCookie('shoujihao2', $('.telValue_zhuce').val()||'',7);//设置手机号cookie 7天

	var telMoshi=/^1[34578]\d{9}$/;
	var sjVal=$('.telValue_zhuce').val();

	var passMoshi=/^[0-9a-zA-Z]{6,20}$/g;
	var passVal=$(".tel .passValue").val();

	if($(".telValue_zhuce").val()==''){
		jalert('手机号码不能为空');
		return false;
	}else if(!telMoshi.test(sjVal)){
		jalert('请输入正确的手机号码');
		return false;
	}else if($(".tel .yanValue").val()==''){
		jalert('验证码不能为空');
		return false;
	}else if($(".tel .passValue").val()==''){
		jalert('密码不能为空');
		return false;
	}else if(!passMoshi.test(passVal)){
		jalert('密码是6-20位字母或数字，或字母数字的组合');
		return false;
	}else if(!$('.xieyi .checkbox11').hasClass('checkbox22')){
		jalert('请选择同意服务协议');
		return false;
	}else{
		$.ajax({
			url: contextPath.dataPath+'/api/registerSellers',
			type:'post',
			async:false,
			//timeout:1000,
			data:{
				mobile:sjVal,
				password:passVal,
				mobile_code:$('.yanValue').val(),
				area_id:area_id,
				push_user_id:push_user_id||'',
				cid:cid
			},
			beforeSend:function(){
				loading.show();
			},
			success:function(d){
				loading.hide();
				console.log(d);
				if(d.data=='验证码错误'){
					jalert('验证码错误');
					console.log(d.data);
					return false;
				}else if(d.code>0){
					jalert('验证码错误');
					return false;
				}else{

					$("#token").val(d.data.token);
                    window.localStorage.setItem('token',d.data.token)
					

					//var info = plus.push.getClientInfo();
					//getui(info.clientid);	
					getui(cid);
					//window.location.href="youhuiquan.html";
		
				}

			},
			error:function(res,status,err){
				jalert(err)
				loading.hide();
			}
		})
	}
}


//验证码验证
$('.getYan_zhuce').click(function(){

	setCookie('shoujihao2', $('.telValue_zhuce').val()||'',7);//设置手机号cookie 7天

	var telMoshi=/^1[34578]\d{9}$/; //手机号验证   18688888888 123456
	var sjVal=$('.tel .telValue_zhuce').val();//输入手机号
	if($('.telValue_zhuce').val()==''){
		jalert('手机号码不能为空');
		return false;
	}else if(!telMoshi.test(sjVal)){
		jalert('请输入正确的手机号码');
		return false;
	}else{
		$('.getYan_zhuce').attr('disabled', true);
		console.log(1)
		sendYan(sjVal);
	}
});

//发送验证码
function sendYan(sjVal){
	$.ajax({
		url: contextPath.dataPath+'/api/register/code',
		type:'post',
		data:{
			mobile:sjVal
		},
		beforeSend:function(){
			loading.show();
		},
		success:function(d){
			console.log(d.data);
			loading.hide();
			if(d.data=='手机号码已注册'){
				jalert('手机号码已注册','',function(){
					window.location.href='login.html';
				});
				return false;
			}else if(d.code>0){
				jalert(d.message);
				return false;
			}else{
				console.log('验证码发送成功');
				getYanTime();
			}
		},
		error:function(res,status,err){
			jalert(err)
			loading.hide();
		}
	})
}

//倒计时
function getYanTime(){
	var count = 60;
	var resend = setInterval(function () {
		count--;
		if (count >0) {
			$('.getYan_zhuce').html(count + "s重新获取").attr('disabled', true).css('background', '#ccc');
			setCookie('captchaRegist', count, (1 / 86400) * count);
		} else {
			clearInterval(resend);
			$('.getYan_zhuce').html('发送验证码').css('background', '#ed5564').removeAttr('disabled');
			removeCookie('captchaRegist');
		}
	}, 1000);
}

//协议弹出层
var tanFlag=true;
$(".xieyi .clickXieyi").click(function(event){
	//协议弹出层
	event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
	$.lockScreen({
		begin:"xieyiTan", //弹出层内容id
		closed:"closed",  //关闭class
		opacity:'0.7'	//遮罩层透明度
	});

	$(document).click(function(){
		$("#dialog").remove();
		$("#lockScreen").remove();
		$(".xieyi .checkbox11").removeClass('checkbox22');
		tanFlag=true;
	});

	if(tanFlag) {
		tanFlag=false;
		$.ajax({
			url:  contextPath.dataPath+'/api/user/service',
			type: 'get',
			data: {},
			success: function (d) {
				$('.xieyiTan h1').html(d.data.title);
				$('.xieyiTan p').html(d.data.content);
			}
		})
	}
});

//选中与不选中
$(".xieyi .checkbox11").click(function(event){
	if($(this).hasClass('checkbox22')){
		$(this).removeClass('checkbox22');
	}else{
		$(this).addClass('checkbox22');
	}
	event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
});

//睁眼
zyFn();
function zyFn(){
	$(".biyan").click(function(){
		if($(this).hasClass('zhengyan')){
			$(this).removeClass('zhengyan');
			$(this).prev().attr('type','password');
		}else{
			$(this).addClass('zhengyan');
			$(this).prev().attr('type','text');
		}
	})
}


//推送
document.addEventListener("plusready", function() {

	var pushServer = "http://sdk.open.api.igexin.com/apiex.htm";
	var message = null;
	// 监听plusready事件
	//document.addEventListener( "plusready", function(){
	message = document.getElementById("message");

	//监听点击消息事件
	plus.push.addEventListener( "click", function( msg ) {
		//alert('msg click:'+JSON.stringify(msg))
		//alert('msg msg.payload'+msg.payload)
		// 判断是从本地创建还是离线推送的消息
		switch( msg.payload ) {
			case "LocalMSG":
				//outSet( "点击本地创建消息启动：" );
				//alert('click========='+111111111111111)
				break;
			default:
				//outSet( "点击离线推送消息启动：");
				//alert('click========='+222222222222222222)
				break;
		}

		var jaja;
		if(msg.content.indexOf('+')!=-1){
			jaja=msg.content.split('+');
		}

		if(msg.content=="go_index"){
			window.location.href="home.html";
		}
		if(msg.content=="go_my"){
			window.location.href="my.html";
		}
		if(msg.content=="go_mystore"){
			window.location.href="myShop.html";
		}
		if(msg.content=="go_order_info.html"+jaja[0]){
			window.location.href="orderDetail.html?id="+jaja[1];
		}
		if(msg.content=="go_invoice"){
			window.location.href="myFapiao.html";
		}

		// 处理其它数据
		logoutPushMsg( msg );

	}, false );

	// 监听在线消息事件
	plus.push.addEventListener( "receive", function( msg ) {
		//alert('msg receive:'+JSON.stringify(msg))
		//alert('msg-----'+msg.aps)
		if (msg.aps ) {  // Apple APNS message
			//outSet( "接收到在线APNS消息：" );
			//alert(111111111111111111111111)
		} else {
			//outSet( "接收到在线透传消息：" );
			//alert(2222222222222222222222222)
		}
		logoutPushMsg( msg );

		var jaja;
		if(msg.content.indexOf('+')!=-1){
			jaja=msg.content.split('+');
		}

		if(msg.content=="go_index"){
			window.location.href="home.html";
		}
		if(msg.content=="go_my"){
			window.location.href="my.html";
		}
		if(msg.content=="go_mystore"){
			window.location.href="myShop.html";
		}
		if(msg.content=="go_order_info.html"+jaja[0]){
			window.location.href="orderDetail.html?id="+jaja[1];
		}
		if(msg.content=="go_invoice"){
			window.location.href="myFapiao.html";
		}


	}, false );
	//}, false );

	function logoutPushMsg( msg ) {
		//alert( "title: "+msg.title );
		//alert( "content: "+msg.content );
		if ( msg.payload ) {
			if ( typeof(msg.payload)=="string" ) {
				//outLine( "payload(String): "+msg.payload );
				alert("payload(String): "+msg.payload )
			} else {
				//outLine( "payload(JSON): "+JSON.stringify(msg.payload) );
				alert( "payload(JSON): "+JSON.stringify(msg.payload) );
			}
		} else {
			//outLine( "payload: undefined" );
			//alert( "payload: undefined" );
		}
		if ( msg.aps ) {
			//outLine( "aps: "+JSON.stringify(msg.aps) );
			//alert( "aps: "+JSON.stringify(msg.aps) );
		}
		//alert('7'+msg.aps)
	}
	
	var info = plus.push.getClientInfo();
	getui(info.clientid);
	
},false);



function getui(cid){
	$.ajax({
		url:contextPath.dataPath+'/api/push_id/update?token='+$("#token").val(),
		type: 'get',
		dataType: 'json',
		data: {
			token:$("#token").val(),
			cid:cid,
			action:'login'
		},
		success:function(d){
			console.log(JSON.stringify(d))
            window.location.href = 'youhuiquan.html';
		}
	})
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});

