var keyword=getSearchString('keyword')||'';
var searchIndex=1;

$(".titleName").html($(".titleName").html()+':'+keyword);
document.title=document.title+':'+keyword;

function homeSearch(){
	$.ajax({
		url: contextPath.dataPath+'/api/production/list',
		data:{
			area_id:area_id,
			keyword:keyword,
			page:searchIndex
		},
		type:'get',
		success:function(d){
			var data=d.data.data;
			var str='';

			if(data.length==0 && searchIndex==1){
				var nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
				$(".contentBox").html(nullStr);
				//$(".pullUpLabel").html('没有更多数据了');
				return false;
			}

			if(data.length==0){
				//$(".pullUpLabel").html('没有更多数据了')
				return false;
			}



			$.each(data,function(i,d){
				var aUrl='goodsDetails.html?count_type='+ d.info.count_type+'&rels_id='+ d.info.rels_id;
				//拼接
				str+='<div data-id="'+ d.brank_id+'" style="padding-bottom: .2rem;">\
						<a href="'+aUrl+'"> \
							<div style="width:3.2rem;height:2.4rem;padding:.1rem;"><img class="shopImg" src="'+ d.images+'" alt=""></div>\
							<p class="p1">'+ d.product_name+'</p> \
							<p class="font28">品牌:'+ d.brand.name+'</p> \
							<p class="font32" style="text-decoration:none;">\
								<span>¥</span>\
								<b class="sizeBig">'+d.info.price+'/'+d.metrology+'</b>\
							</p>\
							<div class="xiaoling">\
								<b class="xlImg"></b>\
								<span>销量:<i>'+d.info.sale_num+'</i></span>\
							</div>\
				        </a>\
				     </div>';
			});

			$(".contentBox").append(str);
			myScroll.refresh();

			//判断没有下一页就不请求
			/*var hasData=d.data.next_page_url;
			if(hasData==null){
			    $(".contentBox").attr('data','noData');
			}*/

			//处理图片
			$(".shopImg").each(function(i,ele){
				setloadStyle(ele)
			})
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

