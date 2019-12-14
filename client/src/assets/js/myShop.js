;(function(){

	if(userInfoObj.token){
		shopRequest();
	}else{
		window.location.href='login.html';
	}
})();

function shopRequest(){
	$.ajax({
		url: contextPath.dataPath+'/api/seller/mystore',
		type:'get',
		data:{
			token:userInfoObj.token
		},
		success:function(d){
			console.log(d);
			var status= d.data.status;
			var store= d.data.store;

			bindShop(status,store);
		}
	});
}

function bindShop(status,store){
	console.log(status)
	//store.license=[1,2,3];
	var str='';
	//status为T表示有核实后的店铺   status为F表示没有核实后的店铺
	if(status=='F'){//-------------------------------------
		str+='<div class="suContent"> \
				<img src="images/dianpu.png"/> \
				<p>您还没有已核实的店铺</p> \
			</div>'
	}else{
		var imgs='';
		for(var i=0;i<store.license.length;i++){
			imgs+='<img style="margin-top:.2rem;" class="yingyePic" src="'+store.license[i]+'">'
		}
		str+='<div class="myInforList"> \
				<ul> \
					<li><span>商铺名称</span><span>'+ store.name+'</span></li> \
					<li><span>联系人姓名</span><span>'+store.contacts+'</span></li> \
					<li><span>联系人电话</span><span>'+store.mobile+'</span></li> \
					<li><span>店铺位置</span><span>'+ store.address+'</span></li> \
					<li><span>营业执照</span><span></span></li> \
				</ul> \
				'+imgs+' \
				<p class="yingyeText">为你服务的合伙人:'+store.partners.name+'</p> \
		</div>'
	}
	$(".myShopPage").html(str);
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


