
var loginMobile=window.localStorage.getItem('loginMobile');


//点击重置密码按钮
$(".resetPassBtn").click(function(){
	setCookie('shoujihao', $('.telValue_reset').val()||'',7);//设置手机号cookie 7天

	var telMoshi=/^1[34578]\d{9}$/;
	var sjVal=$('.tel .telValue_reset').val();
	//验证密码  字母 数字 或者字母数字组合 6-20
	var passMoshi=/^[0-9a-zA-Z]{6,20}$/g;
	var passVal=$(".tel .passValue").val();

	if($(".tel .telValue_reset").val()==''){
		jalert('手机号码不能为空');
		return false;
	}else if(!telMoshi.test(sjVal)){
		jalert('请输入正确的手机号码');
	}else if($(".tel .yanValue").val()==''){
		jalert('验证码不能为空');
		return false;
	}else if($(".tel .passValue").val()==''){
		jalert('密码不能为空');
		return false;
	}else if(!passMoshi.test(passVal)){
		jalert('密码是6-20位字母和数字，且最少有一个字母和数字混合');
		return false;
	}else{
		$.ajax({
			url: contextPath.dataPath+'/api/forgetSellersPwd',
			type:'post',
			data:{
				mobile:sjVal,
				password:passVal,
				mobile_code:$('.yanValue').val()
			},
			success:function(d){
				console.log(d);
				if(d.data=='验证码错误'){
					jalert('验证码输入错误');
					return false;
				}else if(d.code>0){
					jalert(d.message);
					return false;
				}else{
					jalert('重置密码成功');
					window.location.href='login.html';
					removeCookie('captcha');
				}
			}
		})
	}
});

//验证码验证
$('.getYan').on('click',function(){
	//alert(111111111111)
	setCookie('shoujihao', $('.telValue_reset').val()||'',7);//设置手机号cookie 7天

	var telMoshi=/^1[34578]\d{9}$/; //手机号验证
	var sjVal=$('.tel .telValue_reset').val();//输入手机号
	if($('.telValue_reset').val()==''){
		jalert('手机号码不能为空');
		return false;
	}else if(!telMoshi.test(sjVal)){
		jalert('请输入正确的手机号码');
		return false;
	}else{
		$('.getYan').attr('disabled', true);
		console.log(1);
		sendYan(sjVal);
	}

});
//发送验证码
function sendYan(sjVal){
	$.ajax({
		url: contextPath.dataPath+'/api/forgetPwdCode',
		type:'post',
		data:{
			mobile:sjVal
		},
		beforeSend:function(){
			loading.show();
		},
		success:function(d){
			console.log(d);
			loading.hide();
			if(d.data=='手机号码未注册'){
				jalert('手机号码未注册','',function(){
					window.location.href='regist.html';
				});
				return false;
			}else if(d.code>0){
				jalert(d.message);
				return false;
			}else{
				console.log('验证码发送成功');
				getYanTime();
			}
		}
	})
}
//倒计时
function getYanTime(){
	var count = 60;
	var resend = setInterval(function () {
		count--;
		if (count >0) {
			$('.getYan').html(count + "s重新获取").attr('disabled', true).css('background', '#ccc');
			setCookie('captcha', count, (1 / 86400) * count);
		} else {
			clearInterval(resend);
			$('.getYan').html('获取验证码').css('background', '#ed5564').removeAttr('disabled');
			removeCookie('captcha');
		}
	}, 1000);
}

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

document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});

