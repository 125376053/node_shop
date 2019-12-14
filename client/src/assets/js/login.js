
(function(){
	
	//睁眼闭眼
	zyFn();

	$(".tel input[type=tel],.tel input[type=password]").on('input',function(){
		if($(".tel input[type=tel]").val()!=''&& $(".tel input[type=password]").val()!=''){
			$(".loginBtn").css({
				opacity:1
			})
		}else{
			$(".loginBtn").css({
				opacity:.5
			})
		}
	});


	//登录按钮
	$(".loginBtn").click(function(){

		setCookie('username', $('.telValue').val()||'',7);//设置手机号cookie 7天

		var telMoshi=/^1[34578]\d{9}$/; //手机号验证    123456
		var sjVal=$('.tel .telValue').val();//输入手机号

		//验证密码
		var passMoshi=/^[0-9a-zA-Z]{6,20}$/g;
		var passVal=$(".tel .passValue").val();

		if($(".tel .telValue").val()==''){
			jalert('手机号码不能为空');
			return false;	
		}else if(!telMoshi.test(sjVal)){
			jalert('请输入正确的手机号码');
		}else if($(".tel .passValue").val()==''){
			jalert('密码不能为空');
			return false;	
		}else if(!passMoshi.test(passVal)){
			jalert('密码是6-20位字母和数字，且最少有一个字母和数字混合');
			return false;
		}else{
			$.ajax({
				url: contextPath.dataPath+'/api/sellerslogin',
				type:'post',
				data:{
					mobile:$(".tel .telValue").val(),
					password:$(".tel .passValue").val()
				},
				success:function(d){
					console.log(d)
					if(d.code==400050){
						jalert('用户名或密码不正确');
						return false;
					}else if(d.code==0){
						//jalert('登录成功');
						console.log(d)
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

						//登录后修改城市id
						window.localStorage.setItem('area_id', d.data.area_id);
						window.localStorage.setItem('area_name', d.data.area_name);

						//本地缓存发给后台
						localSendServer(d.data.token);


						//window.location.href='home.html';
						var ua = navigator.userAgent.toLowerCase();
						if(ua.match(/MicroMessenger/i)=="micromessenger"){
							window.location.href='http://admin.cpm88.xyz/wechat/userinfo?token='+d.data.token;	
						}else{
							window.location.href='home.html';
						}
						
					}
				}
			})
		}
	});

})();


//睁眼
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


//去忘记密码页面
urlGowj();
function urlGowj(){
	$(".resetPass").click(function(){
		window.localStorage.setItem('loginMobile',$(".tel .telValue").val());
		window.location.href='resetPass.html';
	})
}

//本地缓存发给后台
function localSendServer(token){
	var localArr=getLocalData();
	$.each(localArr,function(i,d){
		$.ajax({
			url: contextPath.dataPath+'/api/shops/car/add?token='+token,
			type:'post',
			data:{
				area_id: d.area_id,
				rels_id: d.rels_id,
				product_id:d.product_id,
				spe_id: d.spe_id,
				order_num: d.order_num,
				price: d.price,
				is_edit:0 //添加
			},
			success:function(d){
				/*if(d.data.status=='production_disable'){
					//alert('商品已下架');
					//return false;
				}else if(d.data.status=='not_enough'){
					//alert('商品库存不足');
					//return false;
				}else{
					console.log(d.data);
				}*/
				var storage = window.localStorage;
				for (var i=0;i<=storage.length;i++){
					var key = storage.key(i);
					if(key){
						if(key.substring(0,12)=='addCartGoods'){
							storage.removeItem(key);
						}
					}
				}
			}
		})
	});
}

//获取缓存数据
function getLocalData(){
	var localArr=[];
	var storage = window.localStorage;
	for (var i=0;i<=storage.length;i++){
		var key = storage.key(i);
		if(key){
			if(key.substring(0,12)=='addCartGoods'){
				var value = storage.getItem(key);
				var obj=JSON.parse(value);
				localArr.push(obj);
			}
		}
	}
	return localArr;
}

document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


