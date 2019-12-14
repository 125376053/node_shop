

//window.localStorage.clear();
var contextPath = {
	dataPath : "http://admin.cpm66.com",//http://admin.cpm66.com/api/production/list
	//dataPath : "http://admin.cpm88.xyz",
	loginPath : ""
};

var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {
	var contextPath = {
		dataPath : "http://admin.cpm66.com",
		loginPath : ""
	};
}

//买赠
function changeHanZi(str){
	if(str){
		var num1=str.split(',')[0];
		var num2=str.split(',')[1];	
		console.log(num1,num2)
		
		var hanziArr=[
			'零','一','二','三','四','五','六','七','八','九',
		]
		
		return result='买'+hanziArr[num1]+'赠'+hanziArr[num2];
	}else{
		return '';
	}
}


//什么时候删除缓存数据
var list=window.location.href.search('allGoods.html');
var detail=window.location.href.search('goodsDetails.html');
if(list<0 && detail<0){
    window.sessionStorage.removeItem('huan_page');
    window.sessionStorage.removeItem('huan_data');
    window.sessionStorage.removeItem('huan_scroll');
    window.sessionStorage.removeItem('huan_fltext');
    window.sessionStorage.removeItem('huan_flid');
    window.sessionStorage.removeItem('huan_pptext');
    window.sessionStorage.removeItem('huan_ppid');
}


//cpmnjappleid@163.com
//CPMnj123456

/**
 * @description 窗口自适应事件
 *
 */
;(function(win,doc){
    function change(){
        doc.documentElement.style.fontSize=doc.documentElement.clientWidth/750*100+'px';
    }
    change();
    win.addEventListener('resize',change,false);
})(window,document);


/**
 * @description 验证字符串v是否符合邮箱格式
 * @author renhao
 * @param {string}
 *            v 需要被验证的字符串
 * @return {boolean} true 符合邮箱格式，false 不符合邮箱格式
 *         @example
 *         $.isEmail(v) //需要被验证的字符串
 */
jQuery.isEmail = function(v) {
	var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return reg.test(v);
};

/**
 * @description 验证字符串v是否符合手机格式
 * @author renhao
 * @param {string}
 *            v 需要被验证的字符串
 * @return {boolean} true 符合手机格式，false 不符合手机格式
 *         @example
 *         $.isPhone(v) //需要被验证的字符串
 */
jQuery.isPhone = function(v) {
	var reg = /^(12[0-9]|13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
	return reg.test(v);
};
/**
 * @description 固定电话验证
 * @author renhao
 * @param {} v
 * @return {}
 */
jQuery.isTelphone = function(v){
	var reg = /^0\d{2,3}-?\d{7,8}$/;
	return reg.test(v);
};

/**
 * @description 验证字符串v是否为空（null 或者 空字符串——""）
 * @author renhao
 * @param {string}
 *            v 需要被验证的字符串
 * @return {boolean} true 为空，false 不为空
 *         @example
 *         $.isEmpty(v) //需要被验证的字符串
 */
jQuery.isEmpty = function(v) {
	if (v == null || $.trim(v) == "") {
		return true;
	} else {
		return false;
	}
};

/**
 * @description 获取指定字符串v的长度，1个中文=2个字节
 * @author renhao
 * @param {string}
 *            v 字符串
 * @return {number} 字符串长度
 *         @example
 *         $.getLength(v)
 */
jQuery.getLength = function(v) {
	if ($.isEmpty(v)) {
		return 0;
	} else {
		return v.replace(/[^\x00-\xff]/ig, "**").length;
	}
};

/**
 * @description 验证字符串是否只有字母和数字组成
 * @author renhao
 * @param {string}
 *            v 需要被验证的字符串
 * @return {boolean} true 符合格式，false 不符合格式
 *         @example
 *         $.isPhone(v) //需要被验证的字符串
 */
jQuery.isLetterNumber = function(v) {
	var reg = /^[0-9a-zA-Z]+$/;
	return reg.test(v);
};


/**
 * 非负整数判断
 * @param {} v
 * @return {}
 */
jQuery.isZZNum = function(v){
	var reg = /^(([1-9])\d*|0{1})$/;
	return reg.test(v);
};

/**
 * 日期字符串格式验证 
 * @param {} str
 * @return {}
 */
jQuery.isDateStr=function(str){
	var reg = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
	return reg.test(str);
};

/**
 * 有效数字格式验证 
 * @param {} str
 * @return {}
 */
jQuery.isNumber = function(str){
	var reg = /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/;
	return reg.test(str+"");
};



/**
 * base64解码
 * 
 * @param {Object}
 *            str
 */
jQuery.ykbase64decode=function(str){var c1,c2,c3,c4;var i,len,out;len=str.length;i=0;out="";while(i<len){do{c1=base64DecodeChars[str.charCodeAt(i++)&0xff];}while(i<len&&c1==-1);if(c1==-1)
break;do{c2=base64DecodeChars[str.charCodeAt(i++)&0xff];}while(i<len&&c2==-1);if(c2==-1)
break;out+=String.fromCharCode((c1<<2)|((c2&0x30)>>4));do{c3=str.charCodeAt(i++)&0xff;if(c3==61)
return out;c3=base64DecodeChars[c3];}while(i<len&&c3==-1);if(c3==-1)
break;out+=String.fromCharCode(((c2&0XF)<<4)|((c3&0x3C)>>2));do{c4=str.charCodeAt(i++)&0xff;if(c4==61)
return out;c4=base64DecodeChars[c4];}while(i<len&&c4==-1);if(c4==-1)
break;out+=String.fromCharCode(((c3&0x03)<<6)|c4);}
return out;};

/**
 * url截取
 * 
 * @param {}
 *            str
 */
function getUrlParam(){
	var args = {};
	var match = null;
	var search = decodeURIComponent(location.search.substring(1));
	var reg = /(?:([^&]+)=([^&]+))/g;
	while((match = reg.exec(search))!==null){
		args[match[1]] = match[2];
	}
	return args;
}


//-----------------------------------------------------------------
//用户信息
var userInfoObj='';
if(window.localStorage.getItem('userInfoObj')){
	userInfoObj=JSON.parse(window.localStorage.getItem('userInfoObj'));
}else{
	userInfoObj=''
}

if(userInfoObj){
	var token=userInfoObj.token;
}

var area_id=window.localStorage.getItem('area_id');

//清空城市缓存---------------------------

//清空城市缓存---------------------------
//屏蔽错误
window.tryCode=function(callback){
	try{
		callback()
	}catch(e){
		console.warn(e) //屏蔽错误 给一个警告  提示的时候开启错误报告
		//throw e.message //依然报错 调试时候使用
	}
};
//弹出层组件
(function($){
	$.extend({
		lockScreen:function(json){
			window.addEventListener('touchmove',function(event){
				//event.preventDefault();
				window.event.returnValue = false;
			},false)
			var that=this;
			var dialog,lockScreen,loadCotent,closed;
			//$('#'+json.begin).show();
			var cloneId=$('#'+json.begin).clone(true); //append会追加删除 如何使元素追加后不删除 追加时追加元素副本
			//clone(true) true在克隆的时候保留之前元素的事件
			cloneId.show();
			//防止多次创建
			if(document.getElementById('dialog')){
				return false;
			}
			//创建元素和样式
			create()
			function create(){
				//动态创建元素骨架
				dialog=$("<div id='dialog'></div>");
				lockScreen=$("<div id='lockScreen'></div>");
				$("body").append(dialog,lockScreen);
				dialog.append(cloneId);

				//默认样式
				dialog.css({
					width:$('#'+json.begin).outerWidth(true),
					height:$('#'+json.begin).outerHeight(true),
					background:$('#'+json.begin).css('background'),
					position:"fixed",
					zIndex:"9999",
					left:json.left||'50%',
					top:json.top||'50%',
					bottom:json.bottom||'50%',
					marginLeft:function(){
						return -$('#'+json.begin).outerWidth(true)/2
					},
					marginTop:json.mtop||-$('#'+json.begin).outerHeight(true)/2,
					'border-radius':'10px'
				});
				lockScreen.css({
					width:"100%",
					height:'5000px',
					background:"#000",
					position:"absolute",
					zIndex:9998,
					left:0,
					top:0,
					opacity:json.opacity
				})
			}
			//调用弹出层
			xpqLogin();
			function xpqLogin(){
				lockScreen.height($(window).height()+$(window).scrollTop());
			}
			$(window).resize(function(){
				xpqLogin();
			})
			$(window).scroll(function(){
				xpqLogin();
			})
			$("."+json.closed).click(function(event){
				event.stopPropagation();
				lockScreen.remove();
				dialog.remove();
				$('#'+json.begin).hide();

				window.addEventListener('touchmove',function(event){
					//event.preventDefault();
					window.event.returnValue = true;
				},false)
			})
			
			/*$(document).click(function(){
				lockScreen.remove();
				dialog.remove();
				$('#'+json.begin).hide();
			})*/
			
			//在元素本身上点击不执行关闭 只要不冒泡到文档上就可以
			//操作元素本身 操作的是副本 因为追加进来的是副本 操作非副本事件无效
			cloneId.click(function(event){
				event.stopPropagation();
			})
		}
	})
})(jQuery);

//取地址栏参数
function getSearchString(key) {
	// 获取URL中?之后的字符
	var str = location.search;
	str = str.substring(1,str.length);

	// 以&分隔字符串，获得类似name=xiaoli这样的元素数组
	var arr = str.split("&");
	var obj = new Object();

	// 将每一个数组元素以=分隔并赋给obj对象
	for(var i = 0; i < arr.length; i++) {
		var tmp_arr = arr[i].split("=");
		obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
	}
	return obj[key];
}


//提示组件
(function($){
	$.extend({
		Prompt:function(strPrams,fn){
			if($('.tc').length>0){
				return;
			}else{
				Tanchuang();
			}
			function Tanchuang() {
				var str = '';
				str = strPrams;
				var bod = $('body');
				bod.append('<div class="tc" style="opacity:0;padding:0 .5rem;height:1rem;background:#000;color:#fff;position:fixed;bottom:0rem;left:0;border-radius:5px;line-height:1rem;text-align:center;font-size:0.38rem;z-index:9999;">' + str + '</div>');
				if ($('.tc')) {
					$('.tc').css({
						left:($(window).width()-$('.tc').innerWidth())/2
					});
					$('.tc').stop().animate({
						bottom: 1 + 'rem',
						opacity: 1
					}, 200);
				}
				setTimeout(function () {
					$('.tc').stop(true).animate({
						bottom: 0 + 'rem',
						opacity: 0
					}, 200, function () {
						$('.tc').remove();
						fn&&fn();
					})
				}, 1000)
			}
		}
	})
})(jQuery);

function dargLeft(obj,fn){
	obj.addEventListener('touchstart',function(ev){
		var oTouch = ev.targetTouches[0];
		var disX1 = oTouch.pageX;
		
		obj.addEventListener('touchmove',move,false);
		obj.addEventListener('touchend',end,false);
		
		function move(ev){
			var oTouch = ev.targetTouches[0];
			var disX2 = oTouch.pageX;
			if(disX1-disX2>0){
				if(disX1-disX2>200){
					console.log('左滑动')
					if(obj.parentNode){
						if($(obj).find('.orderPic a').length>0){
							return;
						}else{
							$(obj).find('.orderPic').append('<a class="leftRemove">删除</a>');
						}
						$(obj).find('.leftRemove').click(function(ev){
							obj.parentNode.removeChild(obj);
							fn&&fn($(obj).attr('id'));
							return false;
						});
					}
				}
			}else{
				if(disX2-disX1>200){
					console.log('右滑动');
					console.log(obj);
					$(obj).find('.leftRemove').remove();
				}
			}
		}
		function end(){
			document.removeEventListener('touchmove',move,false);
			document.removeEventListener('touchend',end,false);	
		}
		
	},false);
}

//路由返回上一页  手机底部按键返回 不触发这里
$('.leftJt').click(function(){
	/*if($(this).attr('id')=='leftJt'){
		window.location.href="cart.html";
	}else if($(this).attr('id')=='orderLeft'){
		window.location.href="home.html";
	}else if($(this).attr('id')=='sucLeft'){
		window.location.href="home.html";
	}else{
		history.go(-1)
	}*/
	history.go(-1)
});

//显示不显示路由
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {
	$(".pageTitle").hide();
	$("#wrapper").css('top',0);
} else {
	$(".pageTitle").show();
	$("#wrapper").css('top','1rem');
}

//cookie
function setCookie(name,value,day){
	var date=new Date();//获取时间对象
	date.setDate(date.getDate()+day);//设置过期时间
	//设置cookie
	document.cookie=name+"="+value+";expires="+date;
}
function getCookie(name){
	var arr=document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		var arr2=arr[i].split('=');
		if(arr2[0]==name){
			return arr2[1];
		}
	}
	return '';
}
function removeCookie(name){
	setCookie(name, '1', -1);
}


//----------------------重置面倒计时---------------------------
//如果倒计时存在
if(getCookie('captcha')){
	var count=getCookie('captcha');
	$('.getYan').html(count+"s重新获取").attr('disabled',true).css('background','#ccc');
	var resend = setInterval(function(){
		count--;
		console.log(count);
		if (count>0){
			$('.getYan').html(count+"s重新获取").attr('disabled',true).css('background','#ccc');
			setCookie('captcha',count,(1/86400)*count);
		}else {
			clearInterval(resend);
			$('.getYan').html('获取验证码').css('background','#ed5564').removeAttr('disabled');
			removeCookie('captcha');
		}
	}, 1000);
}

if(getCookie('shoujihao')!=''){
	$('.telValue_reset').val(getCookie('shoujihao'))
}

//------------------------注册界面倒计时-------------------
//如果倒计时存在
if(getCookie('captchaRegist')){
	var count=getCookie('captchaRegist');
	$('.getYan_zhuce').html(count+"s重新获取").attr('disabled',true).css('background','#ccc');
	var resend = setInterval(function(){
		count--;
		console.log(count);
		if (count>0){
			$('.getYan_zhuce').html(count+"s重新获取").attr('disabled',true).css('background','#ccc');
			setCookie('captchaRegist',count,(1/86400)*count);
		}else {
			clearInterval(resend);
			$('.getYan_zhuce').html('发送验证码').css('background','#ed5564').removeAttr('disabled');
			removeCookie('captchaRegist');
		}
	}, 1000);
}

if(getCookie('shoujihao2')!=''){
	$('.telValue_zhuce').val(getCookie('shoujihao2'))
}

//登录界面cookie
if(getCookie('username')){
	$('.telValue').val(getCookie('username'))
}

//ajaxLoading
var loading=ajaxLoading();
function ajaxLoading(){
	if($('#ajaxLoading').length>0){
		return;
	}
	var ajaxLoading=$('<div id="ajaxLoading"><p></p></div>');
	ajaxLoading.css({
		height:$(window).height(),
		width:$(window).width(),
		position:'fixed',
		top:0,
		left:0,
		opacity:.5,
		display:'none'
	});
	ajaxLoading.find('p').css({
		width:'1.24rem',
		height:'1.24rem',
		position:'absolute',
		top:'50%',
		left:'50%',
		marginLeft:'-.62rem',
		marginTop:'-.62rem',
		background:'url("images/loading.gif")',
		backgroundSize:'contain'
	});
	$('body').append(ajaxLoading);

	return ajaxLoading;
}

//alert
function jalert(str,code,fn){

	if($(".odiv").length>0){
		return;
	}

	var odiv=$('<div class="odiv"><p>提示</p><p>'+str+'</p><div class="jbtn"></div>');
	if(code){
		odiv.find(".jbtn").html('<a id="closed2">取消</a><a id="closed1">确定</a>')
	}else{
		odiv.find(".jbtn").html('<a id="closed1">确定</a>')
	}
	odiv.css({
		position:'fixed',
		zIndex:'9999',
		width:'80%',
		height:'3rem',
		background:'#fff',
		borderRadius:'5px',
		left:'50%',
		top:'50%',
		marginLeft:'-40%',
		marginTop:'-1.5rem'
	});

	console.log($(odiv).width());
	odiv.find('p').css({
		textAlign:'center',
		fontSize:'.32rem',
		marginTop:'.3rem'
	});
	odiv.find(".jbtn").css({
		position:'absolute',
		width:'100%',
		height:'1rem',
		bottom:'0rem',
		textAlign:'center',
		borderTop:'1px solid #dedede'
	});
	odiv.find(".jbtn").find('a').css({
		width:'2rem',
		heihgt:'1rem',
		textAlign:'center',
		lineHeight:'1rem',
		display:'inline-block',
		fontSize:'.32rem'
	});
	var zhezhao=$("<div class='zhezhao'>");
	zhezhao.css({
		position:'fixed',
		left:'0',
		top:'0',
		right:'0',
		bottom:'0',
		background:'#000',
		opacity:'0.1',
		zIndex:'9998'
	});

	odiv.appendTo($('body'));
	zhezhao.appendTo($('body'));

	odiv.find("#closed1").click(function(event){
		event.stopPropagation();
		$(this).parents('.odiv').next().remove();
		$(this).parents('.odiv').remove();
		fn&&fn($(this));
	});

	odiv.find("#closed2").click(function(){
		event.stopPropagation();
		$(this).parents('.odiv').next().remove();
		$(this).parents('.odiv').remove();
		fn&&fn($(this));
	});
}

//检测页面是刷新还是跳转
var saveUrl=window.sessionStorage.getItem('url');
if(saveUrl){
	var surl=window.sessionStorage.getItem('url');
	var curUrl=window.location.href;
	if(saveUrl==curUrl){
		//alert('刷新')
	}else{
		//alert('跳转')
		window.sessionStorage.setItem('url',window.location.href);
		huancunFn()
	}
}else{
	window.sessionStorage.setItem('url',window.location.href);
}

function huancunFn(){
	var radom=Math.floor(Math.random()*50+20);
	if(window.sessionStorage.getItem('huancun')){
		var huancun1=window.sessionStorage.getItem('huancun');
		window.sessionStorage.setItem('huancun',parseInt(huancun1)+radom);
	}else{
		window.sessionStorage.setItem('huancun',radom);
	}
}


//推送
if(window.localStorage.getItem('userInfoObj')){
	document.addEventListener("plusready", function() {
		//alert('推送开始')
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
				
				if(msg.content=="go_my"){
					window.location.href="my.html";	
				}
				
				// 处理其它数据
				//logoutPushMsg( msg );
				
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
				//logoutPushMsg( msg );
				
				if(msg.content=="go_my"){
					window.location.href="my.html";	
				}

			}, false );
		//}, false );
		

		function logoutPushMsg( msg ) {
			//alert( "title: "+msg.title );
			//alert( "content: "+msg.content );
			if ( msg.payload ) {
				if ( typeof(msg.payload)=="string" ) {
					//outLine( "payload(String): "+msg.payload );
					//alert("payload(String): "+msg.payload )
				} else {
					//outLine( "payload(JSON): "+JSON.stringify(msg.payload) );
					//alert( "payload(JSON): "+JSON.stringify(msg.payload) );
				}
			} else {
				//outLine( "payload: undefined" );
				//alert( "payload: undefined" );
			}
			if ( msg.aps ) {
				//outLine( "aps: "+JSON.stringify(msg.aps) );
				//alert( "aps: "+JSON.stringify(msg.aps) );
			}
			
		}
		

		var info = plus.push.getClientInfo();
		getui1(info.clientid);
	},false);
}

function getui1(cid){
	$.ajax({
		url:contextPath.dataPath+'/api/push_id/update?token='+window.localStorage.getItem('userInfoObj').token,
		type: 'get',
		dataType: 'json',
		data: {
			token:window.localStorage.getItem('userInfoObj').token,
			cid:cid,
			action:'login'
		},
		success:function(d){
			console.log(JSON.stringify(d))
		}
	})
}



