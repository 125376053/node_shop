
if(userInfoObj.token){
	scFn()
}else{
	window.location.href='login.html';
}

var scPage=1;

function scFn(){
	$.ajax({
		url: contextPath.dataPath+'/api/collect/list',
		type:'get',
		data:{
			token:userInfoObj.token,
			area_id:area_id,
			page:scPage
		},
		success:function(d){
			var data= d.data.data;
			bindScList(data);
		}
	});
}

function bindScList(data){
	console.log(data);
	var scStr='';
	$.each(data,function(i,d){

		scStr+='<li is_disable="'+d.brand.is_disable+'">\
					<a href="goodsDetails.html?rels_id='+d.info.rels_id+'" >\
						<p class="shopName">'+ d.product_name+'</p>\
						<div class="orderPic orderPicXiajia">\
							<div class="left">\
								<img src="'+ d.images+'">\
								<div class="imgRight imgRight2">\
									<p class="p2">品牌：<span>'+ d.brand.name+'</span></p>\
									<p class="p4">价格：<span>'+ d.info.price+'元</span></p>\
									<div class="xiaoling">\
										<b class="xlImg"></b>\
										<span style="color:#666;">销量:<i>'+d.info.sale_num+'</i></span>\
									</div>\
								</div>\
							</div>\
						</div>\
					</a>\
				</li>';
	});
	$(".orderPadding").html(scStr);

	$('.orderPadding li').each(function(i,d){
		if($(this).attr('is_disable')!=0){
			console.log('下架');
			var str='<a class="xiajia"><img src="images/xiajia.png"></a>';
			$(this).children('a').append(str);
			var thisHref=$(this).children('a').attr('href');
			var hrefArr=thisHref.split('?');
			//$(this).children('a').attr('href','###?'+hrefArr[1]);
			$(this).children('a').attr('href','javascript:void(0)');
			//如果是下架的商品 放入下架列表
			$(".orderPadding2").append($(this));
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


