
var color=['#ff6691', '#ffe555','#c689ff','#649cf9']; //图表颜色
var time=0;

if(userInfoObj.token){
	sendData(time)
}else{
	window.location.href='login.html';
}

//请求数据
function sendData(time){
	$.ajax({
		url: contextPath.dataPath+'/api/seller/myaccount',
		type:'get',
		data:{
			token:userInfoObj.token,
			time:time
		},
		success:function(d){
			charts(d.data);
			zongZhichuFn(d.data);
			yijiZhichu(d.data);
			erjiZhichu(d.data);
		}
	});
}

//图表渲染
function charts(data){
	console.log(data);
	var arr=[];
	$.each(data,function(i,d){
		arr.push({
			value: d.money
		});
	});

	//基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('main'));
	myChart.setOption({
		series : [
			{
				type:'pie',
				//radius : [10,50], //圆环范围 20-90之间 最大0-100
				radius: ['15%','85%'],
				data:arr,
				labelLine: {
					normal: {
						show: false     //不需要设置引导线
					}
				},
				color:color
			}
		]
	})
}

//总支出
function zongZhichuFn(data){
	var zongPrice=0;
	$.each(data,function(i,d){
		zongPrice+= d.money
	});
	$("#zongZhichu").html(zongPrice)
}

//一级分类信息
function yijiZhichu(data){
	var str='';
	var imgAdd=0;
	$.each(data,function(i,d){
		if(imgAdd>=data.length){
			return;
		}else{
			imgAdd++;
		}
		str+='<p class="tb1">\
				<span class="img"><img src="images/tbico'+imgAdd+'.jpg"></span>\
				<span class="text">'+ d.name+'</span>\
				<span class="price">'+ d.money+'元</span>\
			  </p>'
	});
	$(".tubiaoText").html(str);
}

//2级分类展示
function erjiZhichu(data){
	$(".fenLeiZhichu").find('ul').html('');
	$.each(data,function(i,d){
		var yijiMoney= d.money;
		var title='';
		var li=$('<li>');
		title='<a class="clickme">\
					<p>\
						<span class="yanse" style="background:'+color[i%color.length]+'"></span>\
						<span class="text">'+ d.name+'<i style="margin-left:.2rem;">'+d.money+'元</i></span>\
					</p>\
					<b class="down"></b>\
				</a>\
				<div class="listZhichu"></div>';
		li.append(title);
		$.each(d.child,function(i,d){
			var content='';
			content='<div class="items">\
						<p class="tText">\
							<span class="span1">'+ d.name+'</span>\
							<span class="span2">消费金额<i>'+ d.money+'元</i></span>\
						</p>\
						<!--滑动块百分比=(现在的价格/总价)*100-->\
						<div class="tPic">\
							<span class="redSpan" style="width:'+ (d.money/yijiMoney)*100+'%;"></span>\
						</div>\
				</div>';
			li.find(".listZhichu").append(content);
		});
		$(".fenLeiZhichu").find('ul').append(li);
	});
}

//分类支出列表
(function(){
	$(".fenLeiZhichu").on('click','.clickme',function(){
		$(this).find('b').toggleClass('down up');
		$(this).next().stop().slideToggle('slow');
	})
})();

//分类支出周期
$("#allZhichu").click(function(event){
	$(".clickme").off('click');
	event.stopPropagation(); //文档关闭调用的时候 开启的时候要加上禁止冒泡
	$.lockScreen({
		begin:"zhichuTan", //弹出层内容id
		closed:"clok",  //关闭class
		opacity:'0.7',	//遮罩层透明度
		mtop:'0',
		top:'none',
		bottom:'0'
	});

	$(".clickme").on('click',function(){
		var timeLong=$(this).attr('data');
		var zhichuStr='所有支出';
		if(timeLong=='all'){
			time=0;
			zhichuStr='所有支出';
		}
		if(timeLong=='year'){
			time=timeAgo(365);
			zhichuStr='近一年支出';
		}
		if(timeLong=='byear'){
			time=timeAgo(365/2);
			zhichuStr='近半年支出';
		}
		if(timeLong=='syear'){
			time=timeAgo(365/2/2);
			zhichuStr='近三个月支出';
		}
		if(timeLong=='month'){
			time=timeAgo(365/2/3);
			zhichuStr='近一个月支出';
		}
		sendData(time);
		$('.recivBtn').html(zhichuStr);
	})
});

//时间
function timeAgo(ago){
	var curDate = (new Date()).getTime();// 先获取当前时间
	var halfYear = ago * 24 * 3600 * 1000;//将半年的时间单位换算成毫秒
	var pastResult = (curDate - halfYear)/1000;  // 半年前的时间（毫秒单位）
	/*console.log('1年前是：' + timeAgo(365));
	console.log('半年前是：' + timeAgo(365/2));
	console.log('三个月前：' + timeAgo(365/2/2));
	console.log('1个月前：' + timeAgo(365/2/2/3));
	console.log(new Date(parseInt(timeAgo(365))*1000).toLocaleDateString())*/
	return pastResult;
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});

