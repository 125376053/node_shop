
if(userInfoObj.token){
	jifenFn();
}
function jifenFn(){
	$.ajax({
		url:contextPath.dataPath+'/api/score/sum',
		type:'get',
		data:{
			token:userInfoObj.token
		},
		success:function(d){
			console.log(d);
			$("#jifenNum").html(d.data)
		}
	})
}


$(".logout").parents('li').click(function(event) {

	if(userInfoObj.token){
		$.lockScreen({
			begin: "tuichuTan", //弹出层内容id
			closed: "closed",  //关闭class
			opacity: '0.7'	//遮罩层透明度
		});
		$('.logoutAs .borderRight').click(function () {
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/MicroMessenger/i)=="micromessenger") {
				window.localStorage.removeItem('userInfoObj');
				window.location.href = 'login.html';
			}else{

				var info = plus.push.getClientInfo();
				getui(info.clientid);

			}
			
		})
		
	} else {
		jalert('您还没有登录','',function(){
			window.location.href="login.html";
		});
	}
});



//拨打电话
$(".kefuTel").parents('li').click(function(event){
	event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
	$.lockScreen({
		begin:"telTan", //弹出层内容id
		closed:"closed",  //关闭class
		opacity:'0.7'	//遮罩层透明度
	});
	var tel=$('.kefuTel').html();
	$('.quxiaoTel .p2').append(tel);
	$('.quxiaoTel .borderRight').attr('href','tel:'+tel);
});



//清理缓存
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {

}else{
	var mh=window.sessionStorage.getItem('huancun');
	$("#mmmm").html(parseFloat(mh/1000).toFixed(2)+'M');
	$(".qingliHuancun").show();
	//清理缓存
	$(".huancun").parents('li').click(function(event){
		event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
		$.lockScreen({
			begin:"huancunTan", //弹出层内容id
			closed:"closed",  //关闭class
			opacity:'0.7'	//遮罩层透明度
		});
		$('.qingliAs .borderRight').click(function () {
			$("#mmmm").html(0+'M');
			window.sessionStorage.removeItem('huancun')
		})
	});
}



//var plus='';
//传送cid
document.addEventListener("plusready", function() {
	
	var pushServer = "http://sdk.open.api.igexin.com/apiex.htm";
	var message = null;
	// 监听plusready事件
	//document.addEventListener( "plusready", function(){
		
		message = document.getElementById("message");
		// 监听点击消息事件
		plus.push.addEventListener( "click", function( msg ) {
			
			// 判断是从本地创建还是离线推送的消息
			switch( msg.payload ) {
				case "LocalMSG":
					outSet( "点击本地创建消息启动：" );
					break;
				default:
					outSet( "点击离线推送消息启动：");
					break;
			}
			// 提示点击的内容
			plus.nativeUI.alert( msg.content );
			// 处理其它数据
			logoutPushMsg( msg );
		}, false );
		// 监听在线消息事件
		plus.push.addEventListener( "receive", function( msg ) {
			if ( msg.aps ) {  // Apple APNS message
				outSet( "接收到在线APNS消息：" );
			} else {
				outSet( "接收到在线透传消息：" );
			}
			logoutPushMsg( msg );
		}, false );
	//}, false );

	function logoutPushMsg( msg ) {
		outLine( "title: "+msg.title );
		outLine( "content: "+msg.content );
		if ( msg.payload ) {
			if ( typeof(msg.payload)=="string" ) {
				outLine( "payload(String): "+msg.payload );
			} else {
				outLine( "payload(JSON): "+JSON.stringify(msg.payload) );
			}
		} else {
			outLine( "payload: undefined" );
		}
		if ( msg.aps ) {
			outLine( "aps: "+JSON.stringify(msg.aps) );
		}
	}

	
},false);


function getui(cid){
	$.ajax({
		url:contextPath.dataPath+'/api/push_id/update?token='+userInfoObj.token,
		type: 'get',
		dataType: 'json',
		data: {
			token:userInfoObj.token,
			cid:cid,
			action:'logout'
		},
		success:function(d){
			//alert(d);
			console.log(JSON.stringify(d))
			console.log(2222222222222222222222222)
			window.localStorage.removeItem('userInfoObj');
			window.location.href = 'login.html';
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


