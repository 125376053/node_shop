
var order_id=getSearchString('order_id');//获取订单号

//渲染评价页面
bindPing();
function bindPing(){
	$.ajax({
		url: contextPath.dataPath+'/api/order/comment',
		type:'get',
		data:{
			token:userInfoObj.token,
			id:order_id
		},
		success:function(d){
			//"is_all_comment": "F",//是否已评论过 F未全部评论  T已全部评论
			var ord=d;
			console.log(ord);
			//ord.data.is_all_comment='F';
			//ord.data.server_start=4;
			var time_start=ord.data.time_start;
			var profession_start=ord.data.profession_start;
			var server_start=ord.data.server_start;
			var torf='';

			var data= d.data;
			$.each(data.detail,function(i,d){


				var areaOrp='';
				if(ord.data.is_all_comment=='T'){
					torf='<p class="fOrT">\
						<span>评价时间:</span>\
						<span class="pjTime">2016-12-29 11:30</span>\
					</p>';
					$(".pfStar a").unbind('click');//不能评分
					//渲染几颗星
					$("#score1 a").each(function(i,d){
						if(i<time_start){
							$(this).addClass('active');
						}
					});
					$("#score2 a").each(function(i,d){
						if(i<server_start){
							$(this).addClass('active');
						}
					});
					$("#score3 a").each(function(i,d){
						if(i<profession_start){
							$(this).addClass('active');
						}
					});
					areaOrp='<p>'+ d.comment.content+'</p>'
				}else{
					torf="<b class='recivBtn'>提交评价</b>";
					areaOrp='<textarea class="thText"></textarea><span class="thSize">140</span>'
				}


				var str='';
				str='<li class="orderPic orderPic2 colorF2">\
						<div class="left evaluateContent">\
							<img src="'+ d.product.images+'">\
							<div class="imgRight evalRight">\
								<p class="p1"><span>'+ d.product.product_name+'</span></p>\
								<p class="p3">规格：<span>'+ d.product_specs.spec_name+'</span></p>\
							</div>\
						</div>\
						<div class="message">\
							'+areaOrp+'\
						</div>\
					</li>';
				$(".lookjuliPingFen").append(str);
			});

			$(".pingfen").append(torf);//是查看评价页面还是提交评价页面
			$(".pjTime").html(dataNow());//查看评价的时间


			beizhuCheck()

			//提交评价
			$('.recivBtn').click(function(){
				//提交评论
				clickPing(data);
			});
		}
	});
}

//提交评论
function clickPing(data){
	console.log(data)
	var arr=[];//提交评论-----需要得到当前订单的信息

	var flag=false;
	$.each(data.detail,function(i,d){

		if($('.lookjuliPingFen li').eq(i).find('textarea').val()!=''){
			var obj={
				order_id:data.id,
				product_rels_id: d.rels_id,
				content:$('.lookjuliPingFen li').eq(i).find('textarea').val(),
				order_detail_id:d.id
			};
			arr.push(obj);
			console.log(arr)
			$.ajax({
				url: contextPath.dataPath+'/api/order/comment/post?token='+userInfoObj.token,
				type:'post',
				data:{
					token:userInfoObj.token,
					data:arr,
					order_id:data.id
				},
				success:function(d){
					console.log(d);
					if(d.code==0){
						console.log('提交评论成功');
						updataStart(data);
					}
				}
			});
			flag=true;
			//return false;
		}
	});

	if(!flag){
		jalert('至少输入一条评论')
	}
}

//提交评分 更新星星
function updataStart(data){
	var start1=$('#start1').val();
	var start2=$('#start2').val();
	var start3=$('#start3').val();
	if(start1 || start2 || start3){
		$.ajax({
			url: contextPath.dataPath+'/api/order/service/start?token='+userInfoObj.token,
			type:'post',
			data:{
				token:userInfoObj.token,
				order_id:data.id,
				server_start:start1||0,
				time_start:start2||0,
				profession_start:start3||0
			},
			success:function(d){
				console.log(d)
				if(d.code==0){
					console.log('星星评分成功');
					window.location.href='order.html';
				}
			}
		});
	}else{
		jalert('请选择评分');
		return false;
	}
}

//更新时间
function dataNow(){
	var timeStr='';
	var now= new Date();
	var years = now.getFullYear();
	var month = now.getMonth()+1;
	var dates = now.getDate();
	var hours = now.getHours();
	var Minutes = now.getMinutes();
	if (month<10)
		month="0"+month;
	if (hours<10)
		hours="0"+hours;
	if(Minutes<10)
		Minutes="0"+Minutes;
	timeStr += years + "-" + month + "-" + dates + " " +hours +":" + Minutes;
	return timeStr;
}

//评分组件
fnScore($("#score1"));
fnScore($("#score2"));
fnScore($("#score3"));
function fnScore(id){

	var aNav=id.find('a');
	aNav.click(function(){
		var index=$(this).index();
		aNav.each(function(i,ele){
			if(i<=index){
				$(aNav[i]).addClass('active')
			}
			else{
				$(aNav[i]).removeClass('active')
			}
			//console.log(arr[index]);

		});
		if(id.selector=='#score1'){
			$('#start1').val(index+1);
		}
		if(id.selector=='#score2'){
			$('#start2').val(index+1);
		}
		if(id.selector=='#score3'){
			$('#start3').val(index+1);
		}
	});

}


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

//备注信息
function beizhuCheck(){
	$(".thText").on('input',function(){
		//不允许输入空格 设置val为去除以后的值 输入结束提交时在去除空格
		var thisVal=$(this).val(trim($(this).val()));
		thisVal=$(this).val(utf16toEntities($(this).val()));//转码
		thisVal=$(this).val(entitiestoUtf16(utf16toEntities($(this).val())));//解码
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



document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


