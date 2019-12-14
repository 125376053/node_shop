
var timeIndex=1;

function getDateFn(timeStamp) {
	function add0(m){
		return m<10?'0'+m:m
	}
	//shijianchuo是整数，否则要parseInt转换
	var time = new Date(timeStamp*1000);
	console.log(time)
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return add0(h)+':'+add0(mm);
}

var nullStr='';
function timeOver(){

	//时间段
	$.ajax({
		url: contextPath.dataPath+'/api/discount/time/list',
		type:'get',
		data:{
			area_id:area_id
		},
		success:function(d){
			console.log(d);
			var oneStr='';
			oneStr+='<div class="timeContent">\
						<div class="seckillTime font24">'+ getDateFn(d.data)+'</div>\
						<ul class="contentBox"></ul>\
					</div>'
			$("#container").html(oneStr);
			var contentBox=$(".contentBox");
			//是否在时间点内 待抢购
			if(d.data==0){
				var str='<div class="timeup"><img src="images/time_up@2x.png" alt=""></div>';
				$(this).next().find('a').append(str);
				$(this).next().find('a').attr('href','javascript:void(0);');
			}

			//限时秒杀
			$.ajax({
				url: contextPath.dataPath+'/api/production/list',
				data:{
					area_id:area_id,
					block:getSearchString('block'),
					count_type:1,
					page:timeIndex,
					starttime:'',
					endtime:''
				},
				type:'get',
				success:function(d){
					var data=d.data.data;
					console.log(d);
					
					var hasData=d.data.next_page_url;
					if(hasData==null){
						$("#container").attr('data','noData');
					}

					var str1='';
					$.each(data,function(i,d){
						var aUrl='goodsDetails.html?count_type='+ d.info.count_type+'&rels_id='+ d.info.rels_id;
						str1+='<div class="miaosha" data-id="'+ d.brank_id+'">\
						<a href="'+aUrl+'"> \
							<div style="width:3.2rem;height:2.4rem;padding:.1rem;"><img class="shopImg" src="'+ d.images+'" alt=""></div>\
							<p style="font-size:.32rem;" class="p1">'+ d.product_name+'</p> \
							<p class="font28">品牌:'+ d.brand.name+'</p> \
				            <p style="margin-top:.1rem;" class="font24">原价:'+ d.info.org_price+'元</p> \
				            <p class="nodiv" style="color:#666;font-size:.2rem;font-weight: normal;">限购:<span>'+ d.info.limit_num+'</span>个/每人</p>\
							<p class="font32"><span>¥</span>'+ d.info.price+'/'+d.metrology+'</p> \
							<p class="num">\
								<i class="shengyu">'+ d.info.sale_num+'</i>\
								<span>/</span>\
								<b class="zongling">'+d.info.count_num+'</b>\
							</p> \
				        </a>\
				     </div>';
					});



					if(data.length==0 && timeIndex==1){
						nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
						contentBox.html(nullStr);
						$("#pullUp").hide();
						$(".seckillTime").hide();
					}else{
						contentBox.append(str1);

						//重新渲染scroll
						//myScroll.scrollTo(0, 0);
						myScroll.refresh();
					}

					//是否卖完
					contentBox.find('.zongling').each(function(){
						if($(this).html()=='0'){
							var str='<div class="sell_out"><img src="images/sell_out@2x.png" alt=""></div>';
							$(this).parents('a').append(str);
							$(this).parents('a').attr('href','javascript:void(0);');
							$(this).parent().find('i').css('color','#666');
							$(this).parent().css({
								'background':'url(images/numPic2.png) no-repeat',
								'background-size':'.22rem .26rem'
							})
						}
					});


					//处理图片
					$(".shopImg").each(function(i,ele){
						setloadStyle(ele)
					})


					$('.nodiv').each(function(){
						if($(this).find('span').html()==0){
							$(this).hide()
						}
					})

				}


			});


		}
	});
}



//预览后垂直居中与业务处理
function setloadStyle(img){
	//不支持宽高设置rem 取实际px值
	var wrapWidth=$(img).parents().width();
	var wrapHeight=$(img).parents().height();
	//$(img).parent().show();
	$(img).parent().css({
		'line-height':wrapHeight+'px',
		'text-align': 'center',
		'font-size':0
	});
	$(img).css({
		'max-width':wrapWidth,
		'max-height':wrapHeight,
		'vertical-align':'middle'
	});
	scaleIMG({
		imgWrap:'contentBox',
		w:wrapWidth,
		h:wrapHeight
	});
}

//等比例缩放图片
function scaleIMG(json){
	//var imgWrap=document.querySelector(json.imgWrap);
	//var img=imgWrap.getElementsByTagName('img');
	var img=document.querySelectorAll('.shopImg')
	for(var i=0;i<img.length;i++){
		(function(i){
			var image=new Image();
			image.src=img[i].src;
			image.onload=function(){
				scaleImage(img[i],json.w,json.h);
			}
		})(i)
	}
	function scaleImage(o, w, h) {
		var img = new Image();
		img.src = o.src;
		if (img.width > 0 && img.height > 0) {
			if (img.width / img.height >= w / h) {
				if (img.width > w) {
					o.width = w;
					o.height = (img.height * w) / img.width;
				} else {
					o.width = img.width;
					o.height = img.height;
				}
				o.alt = img.width + "x" + img.height;
			} else {
				if (img.height > h) {
					o.height = h;
					o.width = (img.width * h) / img.height;
				} else {
					o.width = img.width;
					o.height = img.height;
				}
				o.alt = img.width + "x" + img.height;
			}
		}
	}
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


