//var status=getSearchString('status');//return退货中 refunded已退货 refundfail退货失败
var order_id=getSearchString('order_id');
var order_detail_id=getSearchString('order_detail_id');

thDetail();
function thDetail(){
	$.ajax({
		url: contextPath.dataPath+'/api/refund/detail/get',
		type:'get',
		data:{
			token:userInfoObj.token,
			order_detail_id:order_detail_id,
			order_id:order_id
		},
		success:function(d){
			console.log(d);
			var data= d.data;
			bindThDetail(data);
		}
	});
}


function bindThDetail(data){
	var elseStr='';
	var statusText='';

	if(data.status=='RETURN'){

	}
	if(data.status=='REFUNDFAIL'){
		statusText='拒绝取货';
		elseStr='<div class="goGoodes">\
					<p class="p1">\
						<span>取货时间：</span>\
						<span>'+data.updated_at+'</span>\
					</p>\
					<p class="p1">\
						<span>取货状态：</span>\
						<span>'+statusText+'</span>\
					</p>\
					<p class="p2">\
						<span>退货原因：</span>\
						<span class="wrapLine">'+data.returngoods.par_reason+'</span>\
					</p>	\
				</div>';
	}
	if(data.status=='REFUNDED'){
		statusText='取货成功';
		elseStr='<div class="goGoodes">\
					<p class="p1">\
						<span>取货时间：</span>\
						<span>'+data.updated_at+'</span>\
					</p>\
					<p class="p1">\
						<span>取货状态：</span>\
						<span>'+statusText+'</span>\
					</p>\
				</div>';
	}

	var str='<div>'+elseStr+'</div>\
			 <div class="goGoodes">\
				<p class="p1">\
					<span>退货时间：</span>\
					<span>'+ data.returngoods.created_at+'</span>\
				</p>\
				<p class="p1">\
					<span>退货数量：</span>\
					<span>'+data.returngoods.return_goods_num+'</span>\
				</p>\
				<p class="p2">\
					<span>退货原因：</span>\
					<span class="wrapLine">'+data.returngoods.reason+'</span>\
				</p>	\
				<ul class="returnGoodsPic"></ul>\
			 </div>';
	$('.goods').html(str);

	var strImg='';
	$.each(data.returngoods.img_id,function(i,d){
		strImg+='<li><img src="'+d+'"></li>'
	});
	$(".returnGoodsPic").html(strImg);

}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


