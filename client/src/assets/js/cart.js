
//强制刷新 解决微信缓存问题

var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {
	var needRefresh = window.sessionStorage.getItem("need-refresh-cart");
	if(needRefresh){
		window.sessionStorage.removeItem("need-refresh-cart");
		location.reload();
	}
}




var area_id=window.localStorage.getItem('area_id');

$('.cartXiajia').hide();

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


if(userInfoObj.token){
	bindUserCartList();
}else{
	if(getLocalData().length>0){
		bindNoUserCartList();
	}else{
		var nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
							<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
							<p style="margin-top:.1rem;font-size:.28rem;color:#666;">您还没有添加任何商品</p>\
						</div>';
		$(".cartNoXiajia").html(nullStr);
	}
}


var tr,inputd,inputdAll;
//购物车本地渲染 用户未登录 用于展示记录
function bindNoUserCartList(){
	$.ajax({
		url: contextPath.dataPath+'/api/validate/shopcar',
		type:'get',
		data:{
			dataArr:getLocalData()
		},
		success:function(d){
			var data= d.data;
			console.log(data);
			bindNoXiajia(data);//渲染未登陆列表
			startView(data);//列表逻辑
		}
	})
}

//购物车列表页的入口 data分别是用户登录后和未登录的数据
function startView(data){
	console.log(data)
	//结算--------------------------------------------------------------------
	tr=$(".cartNoXiajia li");
	inputd=$('.checkbox1').not('.cartXiajia .checkbox1');
	inputdAll=$('#checkAll');

	//单选
	checkLine();
	//全选
	checkAll();

	//点击编辑切换到编辑界面
	$(".cartNoXiajia").on('click','.edte',function(e){
		e.preventDefault();
		var index=$(this).parents('li').index();
		//事件代理的事件卸载 防止事件执行多次 出现的场景  事件---函数----事件
		$(".cartNoXiajia").off('click','.guigeEditor');
		for(var i=0;i<data.length;i++){
			if(data[i].status.status=='production_disable'){
				var newd=data.splice(i,1);//返回被删除的元素
			}
		}
		$.ajax({
			url: contextPath.dataPath+'/api/shops/car/edit/info',
			type:'get',
			data:{
				token:userInfoObj.token||'',
				area_id:area_id,
				rels_id:$(this).parents('li').attr('rels_id')
			},
			success:function(d){
				var data1= d.data;
				console.log(data1);//规格库存
				bindEditor(data,data1,index);
			}
		});
	});

	//点击完成切换到初始界面
	$(".cartNoXiajia").on('click','.wcl',function(e){
		e.preventDefault();
		var index=$(this).parents('li').index();
		for(var i=0;i<data.length;i++){
			if(data[i].status.status=='production_disable'){
				var newd=data.splice(i,1);//返回被删除的元素
			}
		}
		bindWc(data,index);
		if(userInfoObj.token){
			bjAddCartInfo(data,index);
		}
	});
}

//未登录绑定没有下架
function bindNoXiajia(cartData){
	console.log(cartData)
	var cartList1='';
	//cartData=cartData.reverse();
	$.each(cartData,function(i,d){
		var code='';
		var info=0;
		//成功
		if(d.status.status=='success'){
			code='success';
			info='';
		}
		//删除
		if(d.status.status=='production_not_found'){
			code='not_found'
			info='';
		}
		//下架
		if(d.status.status=='production_disable'){
			code='disable'
			info='';
		}
		//库存不足
		if(d.status.status=='not_enough'){
			code='not_enough';
			info= d.status.info;
		}
		console.log(d);
		
		
		
		//---------------测试限购----------------
		//d.limit_num=2;
		//------------------------------
		
		
		var url='goodsDetails.html?area_id='+ area_id+'&rels_id='+ d.id+'&product_id='+ d.product_id;
		cartList1+='<li class="orderPadding colorF" id="'+ d.id+'" rels_id="'+ d.id+'" info="'+info+' " code="'+code+'" limit_num="'+d.limit_num+'"   rest_num="'+ d.rest_num+'" addCartGoods="addCartGoods'+ d.id+'"> \
						<a href="'+url+'">\
							<div class="editeTitle"> \
								<p>'+d.production.product_name+'</p> \
								<p class="bjhPrice" style="display: none;">'+d.price+'</p> \
								<p class="bjhNum" style="display: none;">'+d.order_num+'</p> \
								<p class="bjhGuige" thisGeId="'+getLocalData()[i].spe_id+'" style="display: none;">'+d.specs_name+'</p> \
								<p class="bjhggcun" style="display: none;"></p> \
								<p class="wancheng edte"><i></i>编辑</p> \
							</div> \
							<div class="orderPic cartOrderPic"> \
								<div class="left left2"> \
									<span class="checkbox1"></span> \
									<div class="cartScale"><img src="'+ d.production.images+'"></div>\
								</div> \
								<div class="youce">\
									<div class="imgRight imgRight2"> \
										<p class="p2">品牌：<span>'+d.brand.name+'</span></p> \
										<p class="p3">规格：<span>'+d.specs_name+'</span></p> \
										<p class="p4">价格：<span>'+d.price+'</span>元</p> \
									</div> \
									<div class="cartKucun"> \
										<p class="f1"><span>库存:</span><span class="hasNumCun">'+ d.rest_num+'</span></p>\
										<p><span style="color:#666;">数量:</span><span class="numShopx">'+d.order_num+'</span></p> \
									</div> \
								</div>\
							</div> \
						</a>\
					</li>';
	});
	$(".cartNoXiajia").html(cartList1);


	$(".cartList .orderPic img").each(function(i,ele){
		setloadStyle(ele)
	});

	//未登录购物车为空
	if(cartData.length==0){
		var nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">您还没有添加任何商品</p>\
							</div>';
		$(".cartNoXiajia").append(nullStr);
	}

	//根据状态码不同返回不同状态
	codeView()
}

//根据状态码不同返回不同状态
function codeView(){
	//自定义每条商品的状态码 根据条件做出回应 然后带入html中 根据状态码遍历筛选
	$(".cartNoXiajia li").each(function(){

		/*if($(this).attr('code')=='success'){
			$(this).find('.f1').hide();
		}*/
		if($(this).attr('code')=='not_found'){
			console.log('商品删除')
		}
		if($(this).attr('code')=='not_enough'){
			$(this).find('.f1').show();
			if($(this).find('.hasNumCun').html()=='0'){
				//jalert('库存不足');
				$(this).attr('code','disable');
			}else{
				$(this).attr('code','not_enough');
			}
		}
		if($(this).attr('code')=='disable'){
			console.log('下架222222222222222222222222222');
			var str='<a class="xiajia"><img src="images/xiajia.png"></a>';
			$(this).children('a').append(str);
			var thisHref=$(this).children('a').attr('href');
			var hrefArr=thisHref.split('?');
			$(this).children('a').attr('href','###?'+hrefArr[1]);
			//如果是下架的商品 放入下架列表
			$(".cartyesXiajia").append($(this));
			//不显示编辑 数量 库存
			$(this).find('.cartKucun').remove();
			$(this).find('.wancheng').remove();
		}
	});

	//如果没有下架商品 下架列表不显示
	if($('.cartXiajia li').length>0){
		//$('.cartXiajia').show();
	}
}

//绑定编辑界面
function bindEditor(bigData,cartData,index){
	console.log(cartData)
	bianjiView(index);

	bianjiShuling(bigData,index);
	
	notEditorBtnSaveCun(index);
	
	yesEditorGuigeBtn(bigData,cartData,index)
	
}

//编辑渲染
function bianjiView(index){
	
	var priceValue=$(".cartNoXiajia").find('li').eq(index).find('.bjhPrice').html();
	var numValue=$(".cartNoXiajia").find('li').eq(index).find('.bjhNum').html();
	var guigeValue=$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').html();

	var edteStr='<div class="editeContentp2"> \
					<a class="jisuan"> \
						<p class="jian">-</p> \
						<input type="text" value="'+numValue+'" readonly class="guigeBianji" /> \
						<p class="adda">+</p> \
					</a> \
					<div class="guigeEditor"> \
						<span>规格:</span>\
						<input type="text" value="'+guigeValue+'" readonly> \
						<img src="images/editorText.jpg"> \
					</div> \
				</div> \
				<div class="editeContentp3">删除</div>'
	$(".cartNoXiajia").find('li').eq(index).find('.youce').html(edteStr);

	$(".cartNoXiajia").find('li').eq(index).find('.wancheng').html('完成');
	$(".cartNoXiajia").find('li').eq(index).find('.wancheng ').addClass('wcl').removeClass('edte');
	
}

//编辑数量更新价格
function bianjiShuling(bigData,index){
	//进行编辑数量
	var tr=$(".cartNoXiajia").find('li');
	for(var i=0;i<tr.length;i++){
		tr[i].onclick=function(e) {
			e.preventDefault();
			var e = event || window.event;
			var target = e.srcElement || e.target;
			var input = $(this).find('.guigeBianji')[0];
			if(!input){
				return;
			}
			var value = parseInt(input.value);
			if (e.target.className == "jian") {
				if (value <= 1) {
					value = 1;
				} else {
					input.value = value - 1;
				}
				if($(this).find('.bjhNum').html()=='1'){
					$(this).find('.bjhNum').html('1');
				}else{
					$(this).find('.bjhNum').html(value-1)
				}

				//未登录更新购物车数量
				var localObj=getLocalData()[$(this).index()];
				if(localObj){
					var newObj={
						area_id:getLocalData()[$(this).index()].area_id,
						rels_id:getLocalData()[$(this).index()].rels_id,
						product_id:getLocalData()[$(this).index()].product_id,
						spe_id:getLocalData()[$(this).index()].spe_id,
						order_num:value-1,
						price:getLocalData()[$(this).index()].price
					};
					newObj=JSON.stringify(newObj);
					var thisName=$(this).attr('id');
					window.localStorage.setItem('addCartGoods'+thisName,newObj);
				}

			} else if (e.target.className == 'adda') {
				//不要用 li ---index 去查找  index表示点击的索引
				//var chaoCun=$(this).attr('info');//从当前开始上查找 保证点击是自己的数量加减
				//chaoCun=='-1'?chaoCun=Infinity:chaoCun=chaoCun;
				
				var limit=$(this).attr('limit_num');
				//alert($(this).parent().html())
				//alert('限购数量'+limit)
				if(limit>0){
					//alert('商品数量'+value)
					//alert('限购数量'+limit)
					if(parseInt(value)>=parseInt(limit)){
						//alert('进入限购判断')
						value=limit-1;
						jalert('此商品限购'+limit)
					}else{
						input.value = value + 1;
					}	
				}else{
					var chaoCun=$(this).attr('rest_num');//从当前开始上查找 保证点击是自己的数量加减
					chaoCun=='-1'?chaoCun=Infinity:chaoCun=chaoCun;
					if(parseInt(value)>=parseInt(chaoCun)){
						value=chaoCun-1;
						jalert('商品库存不足')
					}else{
						input.value = value + 1;
					}	
				}

				$(this).find('.bjhNum').html(parseInt(value)+1);
				
				
				

				//未登录更新购物车数量
				var localObj=getLocalData()[$(this).index()];
				if(localObj){
					var newObj={
						area_id:getLocalData()[$(this).index()].area_id,
						rels_id:getLocalData()[$(this).index()].rels_id,
						product_id:getLocalData()[$(this).index()].product_id,
						spe_id:getLocalData()[$(this).index()].spe_id,
						order_num:value+1,
						price:getLocalData()[$(this).index()].price
					};
					newObj=JSON.stringify(newObj);
					var thisName=$(this).attr('id');
					window.localStorage.setItem('addCartGoods'+thisName,newObj);
				}


			} else if (e.target.className == 'editeContentp3' && e.target.tagName=='DIV') {

				var This=this;
				jalert('确定要删除吗','com',function(that){
					console.log(that)
					if(that.attr('id')=='closed1'){
                        var reNum=($(This).find('.bjhNum').html(0));
                        var rePrice=($(This).find('.bjhPrice').html(0));
                        addPrice();
						if(userInfoObj.token){
							//登陆 删除 走数据库
							cartReIndex(bigData,$(This).index())
						}else{
							//未登陆删除缓存
							var thisReName=$(This).attr('addCartGoods');
							//console.log(thisReName);
							window.localStorage.removeItem(thisReName);

							//删除元素
							This.parentNode.removeChild(This);
						}

						if($(".cartNoXiajia li").length==0){
							$("#checkAll").removeClass('checkbox2');
						}
					}

				});

				/*var conf = confirm("确定要删除吗");
				if (conf) {
					var reNum=$(this).find('.bjhNum').html(0);
					var rePrice=$(this).find('.bjhPrice').html(0);

					if(userInfoObj.token){
						//登陆 删除 走数据库
						cartReIndex(bigData,$(this).index())
					}else{
						//未登陆删除缓存
						var thisReName=$(this).attr('addCartGoods');
						//console.log(thisReName);
						window.localStorage.removeItem(thisReName);

						//删除元素
						this.parentNode.removeChild(this);
					}


					if($(".cartNoXiajia li").length==0){
						$("#checkAll").removeClass('checkbox2');
					}

				}*/
			}
			//更新总价
			addPrice();
			return false;
		}
	}	
}

//没有点击规格编辑按钮的时候的库存
function notEditorBtnSaveCun(index){
	var bjhggcun=$(".cartNoXiajia").find('li').eq(index).find('.bjhggcun');
	var thisInfo=$(".cartNoXiajia").find('li').eq(index).attr('info');
	bjhggcun.html(thisInfo);
	//-------------------------------------------------------------------
}

//选择规格界面渲染----走的api
function bindSelectGuige(bigData,cartData,index){
	console.log(cartData)
	var guigeName=$(".cartNoXiajia").find('li').eq(index).find('.editeTitle p:first').html();
	$("#selectGuigeTan").find('.titleName').html(guigeName);

	var guigeStr='';
	$.each(cartData,function(i,d){
		console.log(cartData)
		guigeStr+='<a thisGeId="'+ d.id+'" thisGePrice="'+ d.price+'" thisGeCun="'+ d.num+'" >'+ d.specs_name+'</a>'
	});
	$(".guige-list").html(guigeStr);
	
	//没有点击规格列表的初始规格---输入框中保存的规格值
	var morenGuige=$(".cartNoXiajia").find('li').eq(index).find(".guigeEditor input").val();
	
	//默认规格高亮
	$(".guige-list a").each(function(){
		if($(this).html()==morenGuige){
			$(this).addClass('selectGuige');
			
			//没执行点选规格时候的库存 状态是e-nothon
			var bjhggcun=$(".cartNoXiajia").find('li').eq(index).find('.bjhggcun');
			bjhggcun.html($(this).attr('thisgecun'));
			//修改info所保存的库存值
			$(".cartNoXiajia").find('li').eq(index).attr('info',$(this).attr('thisgecun'));
		}
	});	
}

//点击规格列表
function clickGuigeTab(index){
	console.log(index);
	$(".guige-list").on('click','a',function(){
			
		var that=$(this);

		console.log(that.attr('thisgeid'))


		//编辑数量重置---每次选择不同规格计算加减都从1开始
		var guigeBianji=$(".cartNoXiajia").find('li').eq(index).find(".guigeBianji");
		guigeBianji.val(1);
		
		//bjhNum也必须重置 同步数量
		var bjhNum=$(".cartNoXiajia").find('li').eq(index).find(".bjhNum");
		bjhNum.html(1);
		
		$(this).addClass('selectGuige').siblings().removeClass('selectGuige');//切换高亮
		
		var bjhGgName=$(this).html()||$(".guige-list a:first").html();//编辑输入框显示的选择的规格名称
		var bjhGgId=$(this).attr('thisgeid')||$(".guige-list a:first").attr('thisgeid');
		var bjhPrice=$(this).attr('thisgeprice')||$(".guige-list a:first").attr('thisgeprice');//规格价格

		//执行点选规格时候的库存 状态是e-nothon
		var bjhggcun=$(".cartNoXiajia").find('li').eq(index).find('.bjhggcun');
		bjhggcun.html($(this).attr('thisgecun'));
		//修改info所保存的库存值
		$(".cartNoXiajia").find('li').eq(index).attr('info',$(this).attr('thisgecun'));


		$(".cartNoXiajia").find('li').eq(index).find(".guigeEditor input").val(bjhGgName);
		$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').html(bjhGgName);
		$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').attr('thisgeid',bjhGgId);
		//更新规格的价格
		$(".cartNoXiajia").find('li').eq(index).find('.bjhPrice').html(bjhPrice);


		//未登录更新购物车规格
		var localObj=getLocalData()[index];
		if(localObj){
			var newObj={
				area_id:getLocalData()[index].area_id,
				rels_id:getLocalData()[index].rels_id,
				product_id:getLocalData()[index].product_id,
				spe_id:that.attr('thisgeid'),
				order_num:1,
				price:that.attr('thisgeprice')
			};
			newObj=JSON.stringify(newObj);
			var thisName=$(".cartNoXiajia").find('li').eq(index).attr('id');
			window.localStorage.setItem('addCartGoods'+thisName,newObj);
		}



		$(".bjQd").on('click',function(){
			/*$(".cartNoXiajia").find('li').eq(index).find(".guigeEditor input").val(bjhGgName);
			$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').html(bjhGgName);
			$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').attr('thisgeid',bjhGgId);
			//更新规格的价格
			$(".cartNoXiajia").find('li').eq(index).find('.bjhPrice').html(bjhPrice);*/

			//更新总价函数
			addPrice();
		});
	});	
}

//点击编辑规格按钮
function yesEditorGuigeBtn(bigData,cartData,index){
	$(".cartNoXiajia").on('click','.guigeEditor',function(event){
		
		$(".guige-list").off('click','a');
		$(".bjQd").off('click');//事件里面套事件 解绑一次
		
		var index=$(this).parents('li').index();
		console.log(cartData);
		bindSelectGuige(bigData,cartData,index);

		$.lockScreen({
			begin:"selectGuigeTan", //弹出层内容id
			closed:"clok",  //关闭class
			opacity:'0.7',	//遮罩层透明度
			mtop:'0',
			top:'none',
			bottom:'0'
		});
		
		clickGuigeTab(index);

		event.stopPropagation();
	});	
}


//完成界面渲染
function bindWcView(cartData,index){
	var edteStr='<div class="imgRight imgRight2"> \
				<p class="p2">品牌：<span>'+cartData[index].brand.name+'</span></p> \
				<p class="p3">规格：<span>'+cartData[index].specs_name+'</span></p> \
				<p class="p4">价格：<span>'+cartData[index].price+'</span>元</p> \
			</div> \
			<div class="cartKucun"> \
				<p class="f1"><span>库存:</span><span class="hasNumCun">'+cartData[index].rest_num+'</span></p>\
				<p><span style="color:#666;">数量:</span><span class="numShopx">'+cartData[index].order_num+'</span></p> \
			</div>'
	$(".cartNoXiajia").find('li').eq(index).find('.youce').html(edteStr);
}

//编辑完成界面逻辑
function bindWc(cartData,index){

	if(userInfoObj.token){
		bindWcView2(cartData,index)
	}else{
		bindWcView(cartData,index)
	}

	$(".cartNoXiajia").find('li').eq(index).find('.wancheng').html('<i></i>编辑');
	$(".cartNoXiajia").find('li').eq(index).find('.wancheng').removeClass('wcl').addClass('edte');



	//存储编辑数量
	var bjHnum=$(".cartNoXiajia").find('li').eq(index).find(".bjhNum").html();
	$(".cartNoXiajia li").eq(index).find('.numShopx').html(bjHnum);

	//存储编辑信息
	var bjHguige=$(".cartNoXiajia").find('li').eq(index).find(".bjhGuige").html();
	$(".cartNoXiajia li").eq(index).find('.p3 span').html(bjHguige);

	//存储规格价格
	var bjHprice=$(".cartNoXiajia").find('li').eq(index).find(".bjhPrice").html();
	$(".cartNoXiajia li").eq(index).find('.p4 span').html(bjHprice);

	//当前规格库存
	var bjHggcun=$(".cartNoXiajia").find('li').eq(index).find(".bjhggcun").html();
	//$(".cartNoXiajia li").eq(index).find('.hasNumCun').html(bjHggcun);


	$(".cartNoXiajia li").each(function(){

		/*if($(this).attr('code')=='success'){
			$(this).find('.f1').hide();
		}*/
		if($(this).attr('code')=='not_found'){
			console.log('商品删除')
		}
		if($(this).attr('code')=='not_enough'){
			$(this).find('.f1').show();
			if($(this).find('.hasNumCun').html()=='0'){
				jalert('库存不足');
				$(this).attr('code','disable');
			}else{
				$(this).attr('code','not_enough');
			}
		}
		if($(this).attr('code')=='disable'){
			console.log('下架');
			var str='<a class="xiajia"><img src="images/xiajia.png"></a>';
			$(this).children('a').append(str);
			var thisHref=$(this).children('a').attr('href');
			var hrefArr=thisHref.split('?');
			$(this).children('a').attr('href','###?'+hrefArr[1]);
			//如果是下架的商品 放入下架列表
			$(".cartyesXiajia").append($(this));
			//不显示编辑 数量 库存
			$(this).find('.cartKucun').remove();
			$(this).find('.wancheng').remove();
		}
	});


	//规格显示库存
	var thisCuna=$(".cartNoXiajia li").eq(index).find('.bjhggcun').html();
	if(parseInt(thisCuna)>0){
		//('显示库存')
		$(".cartNoXiajia li").eq(index).find('.cartKucun p.f1').show();
	}else{
		//alert('不显示库存')
		//$(".cartNoXiajia li").eq(index).find('.cartKucun p.f1').hide();
	}
}

//总价函数 用于状态下更新
function addPrice(){
	var price=0;//商品价格初始化

	for(var i=0;i<tr.length;i++){

		//如果每行单选框选中 才计算数量和价格
		if(tr.eq(i).find('.checkbox1').hasClass('checkbox2')){
			var jiage=tr.eq(i).find('.bjhPrice').html();
			var num = tr.eq(i).find('.bjhNum').html();
			price+=parseFloat(jiage).toFixed(2)*parseInt(num);

		}
	}

	//选中才发生改变
	$(".zongjia").html(price.toFixed(2));
	$("#zongjiaCheck").val($(".zongjia").html());
}

//单选
function checkLine(){
	$(".cartNoXiajia").on('click','.checkbox1',function(e){

		if($(this).hasClass('checkbox2')){
			$(this).removeClass('checkbox2');
			inputdAll.removeClass('checkbox2');

			$("#bjHcheck").val($(this).attr('class'));//单击到编辑界面的时候记录选中状态
		}else{
			$(this).addClass('checkbox2');
			$("#bjHcheck").val($(this).attr('class'));//记录选中状态
		}

		//单选加减选 控制全选高亮
		var n1=$(".cartNoXiajia").find('.checkbox1').length;
		var n2=$(".cartNoXiajia").find('.checkbox2').length;;
		if(n1==n2){
			inputdAll.addClass('checkbox2');
		}else{
			inputdAll.removeClass('checkbox2');
		}

		addPrice();

		return false;
	});
}

//多选
function checkAll(){
	inputdAll.click(function(){
		if($(this).hasClass('checkbox2')){
			$(this).removeClass('checkbox2');
			$(".cartNoXiajia .checkbox1").each(function(){
				$(this).removeClass('checkbox2');
			})
		}else{
			$(this).addClass('checkbox2');
			$(".cartNoXiajia .checkbox1").each(function(){
				$(this).addClass('checkbox2');
			})
		}
		addPrice()
	});
}


//----------------------------用户登录以后的-----------------------------------------
//购物车列表渲染
function bindUserCartList(){
	var time=new Date().getTime();//加时间戳解决微信浏览器返回的缓存不刷新页面问题
	$.ajax({
		url: contextPath.dataPath+"/api/shops/car?token="+userInfoObj.token+'&time='+time,
		type:'get',
		data:{
			area_id:area_id
		},
		success:function(d){
			var loginCartData= d.data;
			//loginCartData[0].status.status='production_disable';
			//loginCartData[1].status.status='production_disable';
			//登陆后列表渲染
			bindNoXiajia2(loginCartData);//渲染已登录列表
			startView(loginCartData);
		}
	});
}

//登录后商品列表渲染
function bindNoXiajia2(cartData){
	var cartList1='';
	console.log(cartData)
	if(cartData){
		cartData=cartData.reverse()
	}
	$.each(cartData,function(i,d){
		var code='';
		var info=0;

		//测试下架数据
		//d.status.status='production_disable'

		//成功
		if(d.status.status=='success'){
			code='success';
			info='';
		}
		//删除
		if(d.status.status=='production_not_found'){
			code='not_found'
			info='';
		}
		//下架
		if(d.status.status=='production_disable'){
			code='disable'
			info='';
		}
		//库存不足
		if(d.status.status=='not_enough'){
			code='not_enough';
			info= d.status.info;
		}
		console.log(d)

		var url='goodsDetails.html?area_id='+ area_id+'&rels_id='+ d.product_rels_id+'&product_id='+ d.product_id;
		cartList1+='<li class="orderPadding colorF" id="'+ d.id+'" info="'+info+'" rels_id="'+ d.product_rels_id+'" rest_num="'+ d.rest_num+'" limit_num="'+d.product_rels.limit_num+'" code="'+code+'" addCartGoods="addCartGoods'+ d.id+'" rels_id="'+ d.product_rele_id+'" product_id="'+ d.product_id+'"> \
						<a href="'+url+'">\
							<div class="editeTitle"> \
								<p>'+d.product.product_name+'</p> \
								<p class="bjhPrice" style="display: none;">'+d.price+'</p> \
								<p class="bjhNum" style="display: none;">'+d.order_num+'</p> \
								<p class="bjhGuige" thisGeId="'+ d.spec_id+'" style="display: none;">'+d.product_specs.spec_name+'</p> \
								<p class="bjhggcun" style="display: none;"></p> \
								<p class="wancheng edte"><i></i>编辑</p> \
							</div> \
							<div class="orderPic cartOrderPic"> \
								<div class="left left2"> \
									<span class="checkbox1"></span> \
									<div class="cartScale"><img src="'+ d.product.images+'"></div>\
								</div> \
								<div class="youce">\
									<div class="imgRight imgRight2"> \
										<p class="p2">品牌：<span>'+ d.product.brand.name+'</span></p> \
										<p class="p3">规格：<span>'+ d.product_specs.spec_name+'</span></p> \
										<p class="p4">价格：<span>'+d.price+'</span>元</p> \
									</div> \
									<div class="cartKucun"> \
										<p class="f1" style="display: block;"><span>库存:</span><span class="hasNumCun">'+ d.rest_num+'</span></p>\
										<p><span style="color:#666;">数量:</span><span class="numShopx">'+d.order_num+'</span></p> \
									</div> \
								</div>\
							</div> \
						</a>\
					</li>';
	});
	$(".cartNoXiajia").html(cartList1);

	$(".cartList .orderPic img").each(function(i,ele){
		setloadStyle(ele)
	});

	//登录后购物车为空
	if(cartData.length==0){
		var nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">您还没有添加任何商品</p>\
							</div>';
		$(".cartNoXiajia").append(nullStr);
	}

	//根据状态码不同返回不同状态
	codeView();
}

//完成界面渲染
function bindWcView2(cartData,index){
	console.log(cartData[index].rest_num)
	var edteStr='<div class="imgRight imgRight2"> \
				<p class="p2">品牌：<span>'+cartData[index].product.brand.name+'</span></p> \
				<p class="p3">规格：<span>'+cartData[index].product_specs.spec_name+'</span></p> \
				<p class="p4">价格：<span>'+cartData[index].price+'</span>元</p> \
			</div> \
			<div class="cartKucun"> \
				<p class="f1"><span>库存:</span><span class="hasNumCun">'+cartData[index].rest_num+'</span></p>\
				<p><span style="color:#666;">数量:</span><span class="numShopx">'+cartData[index].order_num+'</span></p> \
			</div>'
	$(".cartNoXiajia").find('li').eq(index).find('.youce').html(edteStr);
}


//登录后点击完成添加到购物车的api
function bjAddCartInfo(data,index){
	console.log(data,index);
	$.ajax({
		url: contextPath.dataPath+'/api/shops/car/add?token='+userInfoObj.token,
		type:'post',
		data:{
			area_id:area_id,
			rels_id:data[index].product_rels_id,
			product_id:data[index].product_id,
			spe_id:$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').attr('thisgeid'),
			order_num:$(".cartNoXiajia").find('li').eq(index).find('.bjhNum').html(),
			price:$(".cartNoXiajia").find('li').eq(index).find('.bjhPrice').html(),
			is_edit:1 //编辑
		},
		success:function(d){
			if(d.data.status=='production_disable'){
				jalert('商品已下架');
				return false;
			}else if(d.data.status=='not_enough'){
				jalert('商品库存不足');
				return false;
			}else{
				console.log(d.data);
			}
		}
	})
}

//登录后删除购物车商品
function cartReIndex(bigData,index){
	var index2=index;
	console.log('11111111111111111111111')
	console.log(bigData)
	$.ajax({
		url: contextPath.dataPath+'/api/shops/car/delete?token='+userInfoObj.token,
		tyep:'get',
		data:{
			token:userInfoObj.token,
			area_id:area_id,
			rels_id:bigData[index].product_rels_id,
			product_id:bigData[index].product_id,
			spe_id:$(".cartNoXiajia").find('li').eq(index).find('.bjhGuige').attr('thisgeid')
		},
		success:function(d){
			//删除元素
			$(".cartNoXiajia").find('li').eq(index).remove();
			bigData.splice(index,1);//删除元素后 数组的索引重置
			//window.location.reload();
		}
	})
}

//点击结算
jieSuan();
function jieSuan(){
	$(".enterCartPay").click(function(){
		if(userInfoObj.token){
			goUrlValid('orderEnter.html');
		}else{
			//没登录跳转到登录页面
			goUrlValid('login.html');
		}
	});
}

//结算的提示 登录和不登录2种
function goUrlValid(gotoWhere){
	$(".cartNoXiajia .wcl").trigger('click');//结算时编辑状态自动切换到完成状态
	var minp=parseFloat($('.minPrice').html());//订单最低金额
	//tofixed返回字符串*1 隐士转为数字 任何数乘以1等于任何数
	var curp=parseFloat($('#zongjiaCheck').val()).toFixed(2)*1||0;
	if(curp<minp){
		jalert("订单金额不足");
		return false;
	}else{
		$(".cartNoXiajia li").each(function(i,d){
			if($(this).find('.checkbox1').hasClass('checkbox2')){
				var num=parseInt($(this).find('.numShopx').html());
				var cun=parseInt($(this).find('.hasNumCun').html());
				if(num>cun){
					jalert("部分商品库存不足");
					return false;
				}else{
					clickSendData();
					window.location.href=gotoWhere;
					$("#zongjiaCheck").val('');
				}
			}
		});
	}
}

//结算时跳转到生成订单页面携带的数据
function clickSendData(){
	var shopArr=[];
	$(".cartNoXiajia li").each(function(){
		if($(this).find('.checkbox1').hasClass('checkbox2')){
			var jiesuanID=$(this).attr('id');
			shopArr.push(jiesuanID);
		}
	});
	console.log(shopArr);
	shopArr=JSON.stringify(shopArr);
	window.localStorage.setItem('jieSuanBtnClickGoOrder',shopArr);
}


//订单最低金额
minPrice();
function minPrice(){
	$.ajax({
		url: contextPath.dataPath+'/api/get/config',
		type:'get',
		data:{
			token:userInfoObj.token||'',
			field:'order_consume_amount'
		},
		success:function(d){
			//console.log(d);
			$('#minprice').val(d.data);
			$('.minPrice').html($('#minprice').val());
		}
	});
}

//清空下架商品
empty();
function empty(){
	//清空弹出层
	$("#emptyCart").click(function(event){
		$("#emptyXijiaTan .borderRight").unbind('click');
		event.stopPropagation();
		$.lockScreen({
			begin:"emptyXijiaTan", //弹出层内容id
			closed:"closed",  //关闭class
			opacity:'0.7'	//遮罩层透明度
		});

		$("#emptyXijiaTan .borderRight").click(function(){
			$.ajax({
				url: contextPath.dataPath+"/api/shops/car?token="+userInfoObj.token,
				type:'get',
				data:{
					area_id:area_id
				},
				success:function(d){
					var loginCartData= d.data;
					console.log(loginCartData)
					var xiaJiaArr=[];
					$.each(loginCartData,function(i,d){
						//d.status.status='production_disable'
						if(d.status.status=='production_disable'){
							xiaJiaArr.push(d);
							//console.log(xiaJiaArr)

							$.each(xiaJiaArr,function(i,data){
								console.log(data);
								$.ajax({
									url: contextPath.dataPath+'/api/shops/car/delete?token='+userInfoObj.token,
									tyep:'get',
									data:{
										token:userInfoObj.token,
										area_id:area_id,
										rels_id:xiaJiaArr[i].product_rels_id,
										product_id:xiaJiaArr[i].product_id,
										spe_id:xiaJiaArr[i].spec_id
									},
									success:function(d){
										//console.log(d)
										window.location.reload();
										//删除元素
										xiaJiaArr.splice(i,data);
										i--;
									}
								});
							})
						}
					});


				}
			});
		});
	});
}



//预览后垂直居中与业务处理
function setloadStyle(img){
	//不支持宽高设置rem 取实际px值
	var wrapWidth=$(img).parent().width();
	var wrapHeight=$(img).parent().height();
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
		imgWrap:'.cartListPage',
		w:wrapWidth,
		h:wrapHeight
	});
}

//等比例缩放图片
function scaleIMG(json){
	var imgWrap=document.querySelector(json.imgWrap);
	var img=$(".cartScale img");
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


