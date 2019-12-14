//申请开票
if(userInfoObj.token){
	applyFapiao();
	serverFn();
	fapiaoHistore();
	fapiaoInfo();
}else{
	window.location.href='login.html';
}


//--------------------------提交申请开票页面--------------------------------------
var minPrice=getSearchString('minPrice');
var canPrice=getSearchString('canPrice');
$("#minPrice").attr('placeholder','最低开票金额'+minPrice);

//提交申请开票
function applyFapiao(){
	$('.recivBtn').click(function(){


		if($('#name').val()==''){
			$.Prompt('请输入公司名称');
			return false;
		}else if($("#server").html()=='请选择服务'){
			$.Prompt('请选择服务');
			return false;
		}else if($("#minPrice").val()==''){
			//金额规则 必填 纯数字 不能小于最低 不能大于最大
			$.Prompt('请输入开票金额');
			return false;
		}else if(parseInt($("#minPrice").val())<parseInt(minPrice)){
			//金额规则 必填 纯数字 不能小于最低 不能大于最大
			$.Prompt('不能小于最小开票金额');
			return false;
		}else if(parseInt($("#minPrice").val())>parseInt(canPrice)){
			//金额规则 必填 纯数字 不能小于最低 不能大于最大
			$.Prompt('不能大于可开票金额');
			return false;
		}else if($("#nashui").val()==''){
			$.Prompt('请输入纳税人识别号');
			return false;
		}else if($("#nashui").val().length<6 || $("#nashui").val().length>=30){
			$.Prompt('请输入6-30位纳税人识别号');
			return false;
		}else if($("#zhuceAd").val()==''){
			$.Prompt('请输入注册地址');
			return false;
		}else if($("#zhuceTel").val()==''){
			$.Prompt('请输入注册电话');
			return false;
		}else if(!/^1[34578]\d{9}$/.test($("#zhuceTel").val())){
			$.Prompt('请输入正确的注册电话');
		}else if($("#haha").val()==''){
			$.Prompt('请输入开户行');
			return false;
		}else if($("#bankNum").val()==''){
			$.Prompt('请输入开户行账号');
			return false;
		}else if($("#bankNum").val().length<6 || $("#bankNum").val().length>=30){
			$.Prompt('请输入正确的开户行账号');
			return false;
		}else{
			console.log($("#haha").val());
			$.ajax({
				url: contextPath.dataPath+'/api/invoice/create?token='+userInfoObj.token,
				type:'post',
				data:{
					token:userInfoObj.token,
					title:$('#name').val(),
					invoices_item_id:$("#server").attr('itemId'),
					taxpayer_no:$("#nashui").val(),
					registration_address:$("#zhuceAd").val(),
					registration_phone:$("#zhuceTel").val(),
					card:$("#haha").val(),
					bank_deposit:$("#bankNum").val(),
					amount:$("#minPrice").val()
				},
				success:function(d){
					console.log(d);
					if(d.code==0){
						$.Prompt('申请成功');
						setTimeout(function(){
							window.location.href='my.html';
						},1000)
					}else{
						$.Prompt(d.message);
					}
				}
			});
		}
	});
}
//--------------------------提交申请开票页面结束--------------------------------------


//-----------------------我的发票页面开始-----------------------------------
//服务列表
function serverFn(){
	$.ajax({
		url: contextPath.dataPath+'/api/invoice/item',
		type:'get',
		data:{
			token:userInfoObj.token
		},
		success:function(d){
			console.log(d);
			bindServer(d.data);
		}
	});
}
function bindServer(data){
	//渲染列表
	var str='';
	$.each(data,function(i,d){
		if(i==data.length){
			str+='<a class="clok clickme">'+ d.item+'</a>'
		}else{
			str+='<a id="'+ d.id+'" class="borderLine clok clickme">'+d.item+'</a>'
		}
	});
	$("#fuwuTan .fk").html(str);

	//服务费
	$(".fuwuClick").parents('li').click(function(event){
		event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
		$.lockScreen({
			begin:"fuwuTan", //弹出层内容id
			closed:"clok",  //关闭class
			opacity:'0.7',	//遮罩层透明度
			mtop:'0',
			top:'none',
			bottom:'0'
		});

		//服务费列表加事件 不能用事件代理
		$(".clickme").click(function(){
			var re=$(this).html();
			var id=$(this).attr('id');
			$(".fuwuClick b").html(re);
			$(".fuwuClick b").attr('itemId',id);
		})
	})
}

//我的发票信息----------我的发票可开票金额 最低开票金额
function fapiaoInfo(){
	$.ajax({
		url: contextPath.dataPath+'/api/invoice/info',
		type:'get',
		data:{
			token:userInfoObj.token
		},
		success:function(d){
			console.log(d);

			//可开票金额
			var kekaiPrice= d.data.can_invioce;
			var minKaiPrice= d.data.min_money;

			$(".keKaiPrice").html(kekaiPrice);
			$(".minKaiPrice").html(minKaiPrice);
			$("#zongKaipiao").html(d.data.invoice_money);

			//渲染是否可以申请开票
			var applyBtn='';
			if(kekaiPrice<minKaiPrice){
				applyBtn='<a class="recivBtn bottom weiColor">提示：最低开票金额:'+minKaiPrice+'</a>';
			}else{
				var hasTishi=' \
				<p class="p3">提示：最低开票金额：\
					<b class="minKaiPrice">'+minKaiPrice+'</b> \
				</p>';
				$(".fpCenter").append(hasTishi);
				applyBtn='<a href="myApplyPiao.html?canPrice='+kekaiPrice+'&minPrice='+minKaiPrice+'" class="recivBtn bottom">申请开票</a>';
			}
			$(".applyKpBtn").html(applyBtn);
		}
	});
}

//发票开具历史
var hisFapiao=1;
function fapiaoHistore(){
	$.ajax({
		url: contextPath.dataPath+'/api/invoice/list',
		type:'get',
		data:{
			token:userInfoObj.token,
			page:hisFapiao
		},
		success:function(d){
			console.log(d);
			bindHisTore(d.data.data);
		}
	});
}
function bindHisTore(data){
	var str='';
	$.each(data,function(i,d){
		//"is_mail": 0, //0 处理中  1 已开具
		//var is_mall='';
		if(is_mall==0){
			is_mall='处理中'
		}else if(is_mall==1){
			is_mall='已开具'
		}
		str+='<li class="goGoodes goGoodes2">\
				<p class="p1">\
					<span>申请时间：</span>\
					<span>'+ d.created_at+'</span>\
				</p>\
				<p class="p1">\
					<span>公司抬头：</span>\
					<span>'+ d.title.title+'</span>\
				</p>\
				<p class="p1">\
					<span>发票项目：</span>\
					<span>'+ d.title.item.item+'</span>\
				</p>\
				<p class="p1">\
					<span>发票金额：</span>\
					<span class="thisPrice">'+ d.amount+'</span>\
				</p>\
				<a class="kaipiaoZhuangTai">处理中</a>\
			</li>';
	});
	$(".goodsKaipiao").html(str);
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


