 

(function(){

	bindGoodsDetail();
 

})();


function bindGoodsDetail(url){
	$.ajax({
		url:contextPath.dataPath+'/addproduct/goods/view',
		type: 'post',
		data: {
			token:userInfoObj.token||'',
			id: $('#hidden_id').val()
		},
		success:function(d){
			console.log(d);

			var brand= d.data.brand;
			var production= d.data.production;

			var topImg='';
			$.each(production.images_list,function(i,d){
				topImg+='<div class="swiper-slide" style="text-align: center;"> \
								<a>\
									<img src="'+d+'" style="max-width: 100%;" />\
								</a> \
							</div>'
			});
			$('.swiper-wrapper').html(topImg);
			var mySwiper = new Swiper('.swiper-container',{
				pagination:'.swiper-pagination',
				loop:true,
				grabCursor:true,
				paginationClickable:true,
				autoplay:3000,
				autoplayDisableOnInteraction:false
			});

			$(".z-refer").html(production.product_name);

			$('.pinPaiName').html(brand.name);
			$('.pinPaiXL').html(d.data.sale_num);

			//总库存
			var kuCun=0;
			$.each(d.data.specs,function(index,item){
				kuCun+=parseInt(item.rest_num)
			});
			$('.pinPaiKc').html(kuCun);

			//优惠类型与普通商品
			//原价
			$(".curPrice").html(d.data.price+'元');

			//优惠类型 限时抢购 1
			var qgPrice='<p style="margin-right: .2rem;" class="font24 orginPrice">'+ d.data.org_price+'元</p>';
			if(d.data.count_type==1){
				$(".m-cost").append(qgPrice);
			}
			//优惠类型 限量特惠 2
			var thPrice='<p style="margin-right: .2rem;" class="font24 orginPrice">'+d.data.org_price+'元</p>';
			if(d.data.count_type==2){
				$(".m-cost").append(thPrice);
			}
			//优惠类型 超低折扣 3
			var zkPrice='<p style="margin-right: .2rem;" class="font24 orginPrice">'+d.data.org_price+'元</p>';
			if(d.data.count_type==3){
				$(".m-cost").append(zkPrice);
			}

			//规格存在
			if(d.data.specs){
				var guigeList='';
				$.each(d.data.specs,function(i,d){
					guigeList+='<span style="color:#666;">'+ d.name+'</span>'
				});
				$(".guigeList").html(guigeList);
			}

			//商品详情xxxx
			var detailList='';
			var filterStr=d.data.production.content;
			//console.log(filterStr)
			filterStr = filterStr.replace(/(\n)/g, "");
			filterStr = filterStr.replace(/(\t)/g, "");
			filterStr = filterStr.replace(/(\r)/g, "");
			filterStr = filterStr.replace(/<\/?[^{img,a,h1,h2,h3,h4,h5,h6,p}>]*>/g, "");
			filterStr=filterStr.replace(/&nbsp;/ig,"");
			filterStr=filterStr.replace(/\s(style=".[^<>]+")/ig,'');

			detailList='<li class="m-commodity"> \
							<div class="xqContent">'+filterStr+'</div> \
						</li>';
			$('#shopDetail').html(detailList);


			//添加或取消收藏  "is_collection"//T表示已收藏  F表示未收藏
			if(d.data.is_collection=='F'){
				$(".collect").find('.xinxin').removeClass('xinxin2');
			}else{
				$(".collect").find('.xinxin').addClass('xinxin2');
			}


			var scFlag=true;
			$(".collect").find('.xinxin').click(function(){
				if(scFlag){
					scFlag=false;
					if($(this).hasClass('xinxin2')){
						$(this).removeClass('xinxin2');
						arshouceng(0);
					}else{
						$(this).addClass('xinxin2');
						arshouceng(1);
					}
				}
			});

			function arshouceng(code){
				// if(userInfoObj.token){
				// 	$.ajax({
				// 		url: contextPath.dataPath+'/api/product/collection/change?token='+userInfoObj.token,
				// 		type:'get',
				// 		data:{
				// 			token:userInfoObj.token,
				// 			area_id: d.data.area_id,
				// 			product_id: d.data.product_id
				// 		},
				// 		beforeSend:function(){
				// 			loading.show();
				// 		},
				// 		success:function(d){
				// 			//可以屏蔽连续点击
				// 			setTimeout(function(){
				// 				loading.hide();
				// 			},1000);
				// 			if(code==0){
				// 				jalert('取消收藏');
				// 			}else{
				// 				jalert('收藏成功');
				// 			}
				// 			scFlag=true;
				// 		}
				// 	});
				// }else{
				// 	window.location.href='login.html';
				// }
			}

			//从商品详情进入购物车
			$(".collect2").click(function(){
				window.location.href='cart.html?area_id='+area_id;
			});


			//加入购物车弹出界面
			$("#addCart").click(function(event){
				$(".jiesuanZhifu").unbind('click');
				$(".jisuan").off('click','p');
				$("#shuling").val(1);
				$(".shopNum").val(1);

				bindAddCartTanChuang();

				//渲染完毕之后 在出现弹出层 解决高度问题
				event.stopPropagation();
				$.lockScreen({
					begin:"addCartTan", //弹出层内容id
					closed:"clok",  //关闭class
					opacity:'0.7',	//遮罩层透明度
					mtop:'0',
					top:'none',
					bottom:'0'
				});

				//购物车加减计算显示
				var rest_num=$(".guige-list a:first").attr('rest_num');
				//记录库存
				$("#kuncun").val(rest_num);
				addOrRem(rest_num);

				$(".jiesuanZhifu").click(function(){

					//获取库存
					var kucun=$("#kuncun").val();

					if(userInfoObj.token){
						if(kucun==0){
							jalert('此商品库存不足');
							return false;
						}else{
							//登录后购物车编辑提交给后台
							addCartEdit(d);
						}

					}else{
						//构建缓存对象---未登录购物车编辑提交
						var obj={
							area_id: d.data.area_id,
							rels_id: d.data.id,
							product_id: d.data.product_id,
							spe_id:$(".guigeId").val(),
							order_num:$("#shuling").val(),
							price:$("#guigePrice").val(),
							kucun:$("#kuncun").val()
						};
						var string=JSON.stringify(obj);

						if(obj.kucun==0){
							jalert('加入购物车失败，商品库存不足');
						}else{
							window.localStorage.setItem('addCartGoods'+rels_id,string);
							jalert('加入购物车成功');
						}
					}
				});
			});

			function bindAddCartTanChuang(){

				if($(".addCartTop").length>0){
					return;
				}

				//购物车规格选择 有显示 没有不显示
				if(d.data.specs){
					var str='';
					str+='<div class="addCartTop"> \
						<p>请选择商品规格</p> \
						<div class="guige-list"></div> \
					 </div>';
					$("#addCartTan").prepend(str);
					//规格渲染
					var guigeListStr='';
					$.each(d.data.specs,function(i,d){
						guigeListStr+='<a rest_num="'+ d.rest_num+'" price="'+ d.price+'" spe_id="'+ d.id+'">'+ d.name+'</a>';
					});
					$(".guige-list").html(guigeListStr);
					$(".guige-list a:first").addClass('selectGuige');
					//默认的规格
					$('.guigeId').val($(".guige-list a:first").attr('spe_id'));
					$("#guigePrice").val($(".guige-list a:first").attr('price'));


					//确定渲染
					var addCartBtn='' +
						'<a class="quxiaoOrder clok">取消</a>' +
						'<a class="jiesuanZhifu zhifuOrder clok">确定</a>';
					$(".jiesuanBtn2").html(addCartBtn);

					var selectGuige='';
					//规格点击高亮
					$(".guige-list").on('click','a',function(){
						$(this).addClass('selectGuige').siblings().removeClass('selectGuige');
						selectGuige=$(this).html();//记住规格
						$('.guigeId').val($(this).attr('spe_id'));

						$(".shopNum").val(1);
						$("#shuling").val(1);

						$("#guigePrice").val($(this).attr('price'));

						$(".jisuan").unbind('click');//事件-函数-事件 解绑
						//cartNum=1;
						var rest_num=$(this).attr('rest_num');
						//记录库存
						$("#kuncun").val(rest_num);
						addOrRem(rest_num);

					});
				}
			}

		}
	})
}

function pingLun(){

	return false;
	// $.ajax({
	// 	url:  contextPath.dataPath+'/api/production/comment',
	// 	type: 'get',
	// 	data: {
	// 		rels_id: rels_id
	// 	},
	// 	success:function(d){
	// 		//用户评价
	// 		var shopPingList='';
	// 		$.each(d.data.data,function(i,d){
	// 			shopPingList+='<li class="m-pl" id="'+d.id+'"> \
	// 								<div class="m-evaluate"> \
	// 									<div class="tel">'+d.user.mobile+'</div> \
	// 									<div class="time">'+d.created_at+'</div> \
	// 								</div>\
	// 								<div class="z-text">'+d.content+'</div>\
	// 							</li>'
	// 		});
	// 		$("#shopPing").html(shopPingList);
	// 		$("#shopPing").css('margin-bottom','1rem');
	// 	}
	// })
}


/*详情页选项卡*/
$(".m-tab div").click(function(){
	$(this).find('span').addClass('ez').parent().siblings().find('span').removeClass('ez');
	var index=$(this).index();//获取到索引
	$('.model'+index).show().siblings().hide();
});


function addOrRem(rest_num){
	return false;
	// var cartNum=1;

	// $(".jisuan").on('click','p',function(){
	// 	if($(this).attr('class')=='rema'){
	// 		if(cartNum<=1){
	// 			cartNum=1
	// 		}else{
	// 			cartNum--;
	// 		}
	// 	}
	// 	if($(this).attr('class')=='adda'){
	// 		cartNum++;
	// 	}
	// 	$(".shopNum").val(cartNum);
	// 	$("#shuling").val(cartNum);

	// 	if(cartNum>parseInt(rest_num) && parseInt(rest_num)!=-1){
	// 		jalert('此商品规格的库存不足');
	// 		cartNum=rest_num;
	// 		$(".shopNum").val(cartNum);
	// 		$("#shuling").val(cartNum);
	// 	}
	// });
}

//商品详情页登录后购物车编辑添加
function addCartEdit(d){
	return false;
	// if(userInfoObj.token){
	// 	$.ajax({
	// 		url: contextPath.dataPath+'/api/shops/car/add?token='+userInfoObj.token,
	// 		type:'post',
	// 		beforeSend:function(){
	// 			loading.show();
	// 		},
	// 		data:{
	// 			token:userInfoObj.token,
	// 			area_id: d.data.area_id,
	// 			rels_id: d.data.id,
	// 			product_id: d.data.product_id,
	// 			spe_id:$(".guigeId").val(),
	// 			order_num:parseInt($("#shuling").val()),
	// 			price:$("#guigePrice").val(),
	// 			is_edit:0 //0表示添加 1表示编辑
	// 		},
	// 		success:function(d){
	// 			jalert('购物车添加成功');
	// 			setTimeout(function(){
	// 				loading.hide();
	// 			},1000);

	// 		}
	// 	})
	// }
}

