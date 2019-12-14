var area_id=window.localStorage.getItem('area_id');
//alert('城市id:'+area_id);

var category_id=getSearchString('category_id');
var category_name=getSearchString('category_name');
if(category_id){
	$(".goodsHead li:eq(0) span").html(category_name);
	$(".goodsHead li:eq(0) i").addClass('sort_focus');
	$(".goodsHead li:eq(0)").addClass('highlight');
	//fenLeiSearch(category_id);
}


$(".fenleiDiv").css({
	height:$(window).height(),
	background:'#fff'
});
$(".pinPaiDiv").css({
	height:$(window).height(),
	background:'#fff'
});
var ua = navigator.userAgent.toLowerCase();
if(ua.match(/MicroMessenger/i)=="micromessenger") {
	$("#wrapper").css({
		top:'1rem'
	})
} else {
	$("#wrapper").css({
		top:'2rem'
	})
}

function setUrl(num){
    var state={
        page:num,
        title:'',
        url:'allGoods.html?tab='+num
    };
    window.history.pushState(state,state.title,state.url);
}


(function () {

	/*分类*/
	$(".goodsHead li:first").click(function () {


		//写一个历史记录
        //setUrl(1)

		//隐藏头
		$(".goodsHead").hide();
		//解绑事件 防止每次点击带着上一次的ajax请求
		$('.fenleiDiv').find(".yiji").off('click', 'li');
		$('.fenleiDiv .all1').unbind();


		//隐藏2级分类
		//$(".fenlei2").hide();

		pageIndex = 1//初始化分页计算

		//判断第2个选项是不是点了别的选项之后再点进来的
		//$(".goodsHead li:last").addClass('whereElse');
		$(".pinPaiDiv").hide();

		$(this).addClass('highlight');
		$(this).find('i').addClass('sort_focus');
		//$(this).siblings().removeClass('highlight');
		//$(this).siblings().find('i').addClass('brand').removeClass('brand_focus');

		//筛选
		//if ($(this).index() == 0 && !$(this).hasClass('whereElse')) {

			$('.fenleiDiv').show();
			$('.pinPaiDiv').hide();
			$(".goodsContent1").removeClass('showAllShop');
			$(".goodsContent2").removeClass('showAllShop');
			//分类取消和确定
			fenleiBind();
			//fenQuxiaoFn();
			//fenQuedingFn();
		//} else {
			//查看
			$(".goodsContent1").addClass('showAllShop');
			$(".goodsContent1").removeClass('showAllShop');
			$(".goodsContent2").removeClass('showAllShop');
			$(this).removeClass('whereElse');


			//重新渲染scroll
			//myScroll.scrollTo(0, 0);
			myScroll.refresh();

		//}



	});


	/*品牌页面*/
	$(".goodsHead li:last").click(function () {

        //写一个历史记录
        //setUrl(2)

		//隐藏头
		//$(".goodsHead").hide();
		//解绑事件 防止每次点击带着上一次的ajax请求
		$('.pinPaiDiv').find(".pp").off('click', 'li');
		$('.pinPaiDiv').find(".all1").unbind();

		pageIndex = 1;

        $(".paiQueding").unbind();//解绑事件 防止每次点击带着上一次的ajax请求
		$(".paiQuxiao").unbind();

		//判断第一个选项是不是点了别的选项之后再点进来的
		$(".goodsHead li:first").addClass('whereElse');
		$(".fenleiDiv").hide();


		$(this).addClass('highlight');
		$(this).find('i').addClass('brand_focus');
		//$(this).siblings().removeClass('highlight');
		//$(this).siblings().find('i').addClass('sort').removeClass('sort_focus');

		//筛选
		//if ($(this).index() == 1 && !$(this).hasClass('whereElse')) {
			$('.fenleiDiv').hide();
			$('.pinPaiDiv').show();
			$(".goodsContent2").removeClass('showAllShop');
			$(".goodsContent1").removeClass('showAllShop');
			//品牌取消和确定
			pinPaiBind();
			//paiQuxiaoFn();
			//paiQuedingFn();
		//} else {
			//查看
			$(".goodsContent2").addClass('showAllShop');
			$(".goodsContent2").removeClass('showAllShop');
			$(".goodsContent1").removeClass('showAllShop');
			$(this).removeClass('whereElse');

			//重新渲染scroll
			//myScroll.scrollTo(0, 0);
			myScroll.refresh();

		//}

		//第一次切换tab加载一次数据
		/*pIndex++;
		if (pIndex == 1) {
			loadAction();
		}*/
	});

})();
var pIndex = 0;


//分类列表数据
function fenleiBind() {
	if(ppid){
		console.log('渲染品牌下分类')

		$.ajax({
			url: contextPath.dataPath + '/api/category/with/brand',
			type: 'get',
			data: {
				type:'brand',//
				id: ppid.id||ppid, //分类的id
				area_id:area_id
			},
			success: function (d) {
				var fld = d.data;
				//分类一级渲染
				var str = "";
				$.each(fld, function (i, d) {
					str += '<li id="' + d.id + '">' + d.name + '</li>'
				});
				$('.fenleiDiv').find(".yiji").html(str);

				var flTitel='';
				var flTitel2='';
				//根据标题文字选中分类列表  一级的
				flTitel=$(".flText").html();
				flTitel2=flTitel;
				if(/\s/.test(flTitel)){
					flTitel=flTitel.split(' ');
					$(".fenleiDiv .yiji li").each(function(i,ele){
						if($(this).html()==flTitel[0]){
							$(this).addClass('fenleiCurrent')
							//chilidFenleiBind(fld[i], $(this),flTitel2);
						}
						if($(this).html()==flTitel[1]){
							$(this).addClass('fenleiCurrent')
							//chilidFenleiBind(fld[i], $(this),flTitel2);
						}
					})
				}else{

				}



				//分类一级全部
				//$('.fenleiDiv .yiji li:gt(7)').hide();
				$('.fenleiDiv .all1').click(function () {
					$(this).addClass('fenleiCurrent');
					$('.fenleiDiv .yiji li').removeClass('fenleiCurrent');
					//$('.fenleiDiv .yiji li:gt(7)').show();
					$('.fenleiDiv .fenlei2').hide();

					$(".flText").html($(this).html())
					fenQuedingFn();

				});
				
				
				$('.fenleiDiv').find(".yiji li").each(function(i){
					if($(this).hasClass('fenleiCurrent')){
						$('.fenleiDiv').find(".yiji2").off('click','li');
						$('.fenleiDiv').find(".all2").unbind('click');
						chilidFenleiBind(fld[i], $(this),flTitel2);
					}
				})
				

				//分类一级点击高亮
				
				$('.fenleiDiv').find(".yiji").on('click', 'li', function () {

					$('.fenleiDiv').find(".yiji2").off('click','li');
					$('.fenleiDiv').find(".all2").unbind('click');

					var index=$(this).index();
					$(this).addClass('fenleiCurrent').siblings().removeClass('fenleiCurrent');
					$('.fenleiDiv p').removeClass('fenleiCurrent');


					$(".flText").html($(this).html());


					if(ppid){
						chilidFenleiBind(fld[index], $(this),flTitel2);
					}
					flid=fld[index];
				});
			}
		})
	}else{
		console.log('渲染分类');
		$.ajax({
			url: contextPath.dataPath + '/api/category/list',
			type: 'get',
			data: {
				area_id: area_id
			},
			success: function (d) {
				var fld = d.data;
				//分类一级渲染
				var str = "";
				$.each(fld, function (i, d) {
					str += '<li id="' + d.id + '">' + d.name + '</li>'
				});
				$('.fenleiDiv').find(".yiji").html(str);

				var flTitel='';
				var flTitel2='';
				//根据标题文字选中分类列表  一级的
				flTitel=$(".flText").html();
				flTitel2=flTitel;
				if(/\s/.test(flTitel)){
					flTitel=flTitel.split(' ');
					$(".fenleiDiv .yiji li").each(function(i,ele){
						if($(this).html()==flTitel[0]){
							$(this).addClass('fenleiCurrent')
							//chilidFenleiBind(fld[i], $(this),flTitel2);
						}
						if($(this).html()==flTitel[1]){
							$(this).addClass('fenleiCurrent')
							//chilidFenleiBind(fld[i], $(this),flTitel2);
						}
					})
				}

				//分类一级全部
				//$('.fenleiDiv .yiji li:gt(7)').hide();
				$('.fenleiDiv p').click(function () {
					$(this).addClass('fenleiCurrent');
					$('.fenleiDiv .yiji li').removeClass('fenleiCurrent');
					//$('.fenleiDiv .yiji li:gt(7)').show();
					$('.fenleiDiv .fenlei2').hide();

					//筛选文字
					$(".flText").html($(this).html());
					fenQuedingFn();

				});
				
				
				
				$('.fenleiDiv').find(".yiji li").each(function(i){
					if($(this).hasClass('fenleiCurrent')){
						$('.fenleiDiv').find(".yiji2").off('click','li');
						$('.fenleiDiv').find(".all2").unbind('click');
						chilidFenleiBind(fld[i], $(this),flTitel2);
					}
				})
				
				//分类一级点击高亮
				$('.fenleiDiv').find(".yiji li").on('click',function () {
					$('.fenleiDiv').find(".yiji2").off('click','li');
					$('.fenleiDiv').find(".all2").unbind('click');

					var index=$(this).index();
					$(this).addClass('fenleiCurrent').siblings().removeClass('fenleiCurrent');
					$('.fenleiDiv p').removeClass('fenleiCurrent');


					$(".flText").html($(this).html())


					if(!ppid){
						chilidFenleiBind(fld[index], $(this),flTitel2);
					}
					flid=fld[index];
				});
				
			}
		});
	}


}

//分类2级
function chilidFenleiBind(fld, that,flTitel2) {
	$('.fenleiDiv .fenlei2').show();
	$(".fenlei2").children('p').html(that.html());

	//分类2级渲染
	//var id = that.attr('id');
	var str = '';
	console.log(fld)
	if(fld.child!=undefined) {
		//alert('有子集')
		var flChild = fld.child;
		$.each(flChild, function (i, child) {
			str += '<li id="' + child.id + '">' + child.name + '</li>'
		});
		$(".yiji2").html(str);
		
		
		
		var myScroll1 = new iScroll('wrapper1');
		myScroll1.refresh();
		
		//根据分类标题文字 让分类2级列表选中
		if(/\s/.test(flTitel2)){
			flTitel2=flTitel2.split(' ');
			$(".fenleiDiv .yiji2 li").each(function(i,ele){
				if($(this).html()==flTitel2[1]){
					$(this).addClass('fenleiCurrent')
				}
			})
		}else{
			$(".fenleiDiv .yiji2 li").each(function(i,ele){
				if($(this).html()==flTitel2){
					$(this).addClass('fenleiCurrent')
				}
			})
		}

		//分类2全部
		//$('.fenleiDiv .yiji2 li:gt(7)').hide();
		$('.fenleiDiv .all2').click(function () {
			$(this).addClass('fenleiCurrent');
			$('.fenleiDiv .yiji2 li').removeClass('fenleiCurrent');
			//$('.fenleiDiv .yiji2 li:gt(7)').show();
			//$('.fenleiDiv .fenlei2').hide();

			$(".flText").html($(this).html());
			flid=fld;
			//确定的功能
			fenQuedingFn()
		});

		//分类2级高亮
		$('.yiji2').on('click', 'li', function () {
			
			var index=$(this).index();
			$(this).addClass('fenleiCurrent').siblings().removeClass('fenleiCurrent');
			$('.fenleiDiv .all2').removeClass('fenleiCurrent');
			//alert(123)
			$(".flText").html(that.html()+' '+$(this).html());
			flid=flChild[index];

			//确定的功能
			fenQuedingFn()
			
			return false;
		});
	}else{
		//alert('没有子集')
		//$('.fenleiDiv .fenlei2').hide();
		return false;
	}
}
//分类确定
function fenQuedingFn() {
	//$(".fenQueding").click(function () {
		$(".goodsHead").show();

		$(".goodsContent1").html(''); //1每次点进来先清空

		var lis = $(".fenleiDiv").find('li');
		var clickName = '';


		$.each(lis, function (i, ele) {
			if ($(this).hasClass('fenleiCurrent')) {
				clickName += $(this).html() + ' ';
				flid = $(this).attr('id'); //字符串覆盖 有2个 用最后一个 +=是都用 如果只选最后一个 在循环外调用
                window.sessionStorage.setItem('huan_flid',flid);
			}
		});
		//console.log(flid);

		if ($('.fenlei p').hasClass('fenleiCurrent')) {
			clickName = '全部';
            window.sessionStorage.setItem('huan_flid','');
            window.sessionStorage.setItem('huan_fltext','全部');
		}
		if (clickName != '') {
			$(".goodsHead").find('li').eq(0).find('span').html(clickName);
		}


		$('.fenleiDiv').hide();
		$(".goodsContent1").addClass('showAllShop');
		$(".goodsContent2").removeClass('showAllShop');

		//重新渲染scroll
		//myScroll.scrollTo(0, 0);
		myScroll.refresh();

		//$(".fenlei2").hide();
		$(".fenleiWrap li").removeClass('fenleiCurrent');


		//按下确定搜索分类
		if ($(".goodsBox li:first span").html() == '分类' || $(".goodsBox li:first span").html() == '全部') {
			//alert('分类全部')
			flid='';
            allGoodsBind();
		} else {
			//alert('分类搜索')
			category_id=flid;
            fenLeiSearch(flid);

		}
	//});
}

//分类搜索
var flid = '';//分类搜索的id
function fenLeiSearch(flid) {
	$.ajax({
		url: contextPath.dataPath + '/api/production/list',
		type: 'get',
		data: {
			area_id: area_id,
			//当选择二级分类时,传二级分类的id; 当只选择一级分类时,传一级分类的id
            brand_id: ppid.id||ppid||window.sessionStorage.getItem('huan_ppid'),
            category_id: flid.id||flid||window.sessionStorage.getItem('huan_flid'),
			page: pageIndex  //估计这个得加个缓存
		},
		success: function (d) {
			var data1= d.data.data;
			console.log(d);

			var flStr = '';
			$.each(data1, function (i, d) {
				flStr += '<li class="goodsList"> \
									<a id="'+d.id+'" rels_id="'+d.info.rels_id+'" count_type="'+d.info.count_type+'">\
										<div class="goodsImg"> \
											<img src="' + d.images + '" alt=""> \
										</div> \
										<div class="goodsLabel"> \
											<p>'+ d.product_name+'</p>\
											<p>品牌：' + d.brand.name + '</p> \
											<p>销量：' + d.info.sale_num + '</p> \
											<p class="goodsPrice"><i></i>价格：' + d.info.price + '元</p> \
										</div>\
									</a>\
								</li>'
			});

//change-----------------------------------------------------------------------------
            if(data1.length==0){
                nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
                $(".contentBox").html(nullStr);
                $("#pullUp").hide();
                return false;
                //$(".pullUpLabel").html('没有更多数据了');
            }else{
                $(".goodsContent1").append(flStr);//追加
                myScroll.refresh();
            }
//change-----------------------------------------------------------------------------


			$(".goodsContent1 .goodsImg img").each(function(index,ele){
				setloadStyle(ele)
			})

			//缓存分类分页
			//$("#huan_page").val(pageIndex);
            //缓存分类id
			//$("#huan_flid").val(flid);
            //缓存分类文字
            //$("#huan_fltext").val($(".flText").html());

            window.sessionStorage.setItem('huan_page',pageIndex);
            window.sessionStorage.setItem('huan_fltext',$(".flText").html());
            window.sessionStorage.setItem('huan_flid',flid);
            window.sessionStorage.setItem('huan_data',$(".goodsContent1").html());
            myScroll.refresh();
            //window.sessionStorage.setItem('huan_scroll',parseInt($("#scrollTop").val()));
            window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
            $(".goodsContent1>li>a").each(function(){
				//$(this).unbind('click');
				$(this).click(function(){

                    window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
                    //window.sessionStorage.setItem('huan_data',$(".goodsContent1").html());
                    //myScroll.refresh();
                    //window.sessionStorage.setItem('huan_scroll',parseInt($("#scrollTop").val()));

					//跳转页面
                    var rels_id=$(this).attr('rels_id');
                    var count_type=$(this).attr('count_type');
                    var url="goodsDetails.html?tab=1&rels_id="+rels_id+'&count_type='+count_type;
                    window.location.href=url;
                })
            })


		}
	})
}

if(category_id){
	flid=category_id
}

//品牌渲染
function pinPaiBind() {



	if(flid){
		console.log('渲染分类下的品牌')
		$.ajax({
			url: contextPath.dataPath + '/api/category/with/brand',
			type: 'get',
			data: {
				type:'category',//
				id: flid.id||flid, //分类的id
				area_id:area_id
			},
			success: function (d) {
				var ppd = d.data;
				var str = "";
				$.each(ppd, function (i, d) {
					str += '<li id="' + d.id + '">' + d.name + '</li>'
				});
				$('.pinPaiDiv').find(".pp").html(str);
				
				var myScroll2 = new iScroll('wrapper2');
				myScroll2.refresh();


				var ppTitel=$(".ppText").html();
				if(/\s/.test(ppTitel)){
					ppTitel=ppTitel.split(' ');
					$(".pinPaiDiv .pp li").each(function(i,ele){

						if($(this).html()==ppTitel[0]){
							$(this).addClass('fenleiCurrent')
						}
						if($(this).html()==ppTitel[1]){
							$(this).addClass('fenleiCurrent')
						}
					})
				}

				//品牌全部
				//$('.pinPaiDiv .pp li:gt(7)').hide();
				$('.pinPaiDiv p').click(function () {
					$(this).addClass('fenleiCurrent');
					$('.pinPaiDiv .pp li').removeClass('fenleiCurrent');
					//$('.pinPaiDiv .pp li:gt(7)').show();

					$(".ppText").html($(this).html())
					paiQuedingFn();

				});

				$('.pinPaiDiv').find(".pp").on('click', 'li', function () {
					$(this).addClass('fenleiCurrent').siblings().removeClass('fenleiCurrent');
					$('.pinPaiDiv p').removeClass('fenleiCurrent');

					$(".ppText").html($(this).html())
					var index=$(this).index();
					ppid=ppd[index];
					paiQuedingFn();

				});
			}
		})
	}else{
		console.log('渲染品牌')
		$.ajax({
			url: contextPath.dataPath + '/api/brand/list',
			type: 'get',
			data:{
				area_id:area_id
			},
			success: function (d) {
				var ppd = d.data;
				var str = "";
				$.each(ppd, function (i, d) {
					str += '<li id="' + d.id + '">' + d.name + '</li>'
				});
				$('.pinPaiDiv').find(".pp").html(str);
				
				
				var myScroll2 = new iScroll('wrapper2');
				myScroll2.refresh();
				
				

				var ppTitel=$(".ppText").html();
				if(/\s/.test(ppTitel)){
					ppTitel=ppTitel.split(' ');
					$(".pinPaiDiv .pp li").each(function(i,ele){

						if($(this).html()==ppTitel[0]){
							$(this).addClass('fenleiCurrent')
						}
						if($(this).html()==ppTitel[1]){
							$(this).addClass('fenleiCurrent')
						}
					})
				}

				//品牌全部
				//$('.pinPaiDiv .pp li:gt(7)').hide();
				$('.pinPaiDiv p').click(function () {
					$(this).addClass('fenleiCurrent');
					$('.pinPaiDiv .pp li').removeClass('fenleiCurrent');
					//$('.pinPaiDiv .pp li:gt(7)').show();

					$(".ppText").html($(this).html())
					paiQuedingFn();
				});

				//品牌一级
				$('.pinPaiDiv').find(".pp").on('click', 'li', function () {
					$(this).addClass('fenleiCurrent').siblings().removeClass('fenleiCurrent');
					$('.pinPaiDiv p').removeClass('fenleiCurrent');

					$(".ppText").html($(this).html())
					var index=$(this).index();
					ppid=ppd[index];
					//console.log(ppid);
					paiQuedingFn();
				});
			}
		})
	}


}


//品牌确定
function paiQuedingFn() {
	//$(".paiQueding").click(function () {

		$(".goodsContent2").html(''); //1每次点进来先清空

		var lis = $(".pinPaiDiv").find('li');
		var clickName = '';

		$.each(lis, function (i, ele) {
			if ($(this).hasClass('fenleiCurrent') && $(this).html() != '全部') {
				clickName += $(this).html() + ' ';
				ppid = $(this).attr('id');
				window.sessionStorage.setItem('huan_ppid',ppid);
			}
		});

		if ($('.pinPai p').hasClass('fenleiCurrent')) {
			clickName = '全部';
            window.sessionStorage.setItem('huan_ppid','');
            window.sessionStorage.setItem('huan_pptext','全部');
		}

		if (clickName != '') {
			$(".goodsHead").find('li').eq(1).find('span').html(clickName);
		}

		$('.pinPaiDiv').hide();
		$(".goodsContent2").addClass('showAllShop');
		$(".goodsContent1").removeClass('showAllShop');


		$(".pinPaiWrap li").removeClass('fenleiCurrent');

		//按下确定搜索品牌
		if ($(".goodsBox li:eq(1) span").html() == '品牌' || $(".goodsBox li:eq(1) span").html() == '全部') {
			//alert('所有品牌')
			ppid='';
			allGoodsBind();
		} else {
            //alert('请求品牌')
			//alert(ppid);
			pinPaiSearch(ppid);
		}

	//})
}

//品牌搜索
var ppid = '';//品牌搜索的id
function pinPaiSearch(ppid) {
	//console.log(flid);
	$.ajax({
		url: contextPath.dataPath + '/api/production/list',
		type: 'get',
		data: {
			area_id: area_id,
			//当选择二级分类时,传二级分类的id; 当只选择一级分类时,传一级分类的id
            brand_id: ppid.id||ppid||window.sessionStorage.getItem('huan_ppid'),
            category_id: flid.id||flid||window.sessionStorage.getItem('huan_flid'),
			page: pageIndex
		},
		success: function (d) {
			var data1= d.data.data;
			var ppStr = '';
			$.each(data1, function (i, d) {
				//console.log(d);
				ppStr += '<li class="goodsList"> \
									<a id="'+d.id+'" rels_id="'+d.info.rels_id+'" count_type="'+d.info.count_type+'">\
										<div class="goodsImg"> \
											<img src="' + d.images + '" alt=""> \
										</div> \
										<div class="goodsLabel"> \
											<p>'+ d.product_name+'</p>\
											<p>品牌：' + d.brand.name + '</p> \
											<p>销量：' + d.info.sale_num+ '</p> \
											<p class="goodsPrice"><i></i>价格：' + d.info.price + '元</p> \
										</div>\
									</a>\
								</li>'
			});

//change-----------------------------------------------------------------------------
            if(data1.length==0){
                nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
                $(".contentBox").html(nullStr);
                $("#pullUp").hide();
                return false;
                //$(".pullUpLabel").html('没有更多数据了');
            }else{
                $(".goodsContent2").append(ppStr);//追加
                myScroll.refresh();
            }
//change-----------------------------------------------------------------------------


			$(".goodsContent2 .goodsImg img").each(function(index,ele){
				setloadStyle(ele)
			})

			//缓存品牌分页
			//$("#huan_page").val(pageIndex);
            //缓存品牌文字
            //$("#huan_pptext").val($(".ppText").html())
            //缓存品牌id
            //$("#huan_ppid").val(ppid);

            window.sessionStorage.setItem('huan_page',pageIndex);
            window.sessionStorage.setItem('huan_pptext',$(".ppText").html());
            window.sessionStorage.setItem('huan_ppid',ppid);
            window.sessionStorage.setItem('huan_data',$(".goodsContent2").html());
            myScroll.refresh();
            //window.sessionStorage.setItem('huan_scroll',parseInt($("#scrollTop").val()));
            window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll')||0);

            $(".goodsContent2>li>a").each(function(){
                $(this).click(function(){
					//缓存品牌滚动条
					//$("#huan_scroll").val(parseInt($("#scrollTop").val()))
					//缓存品牌数据
					//$("#huan_data").val($(".goodsContent2").html())
					//myScroll.refresh();

                    //window.sessionStorage.setItem('huan_data',$(".goodsContent2").html());
                    //myScroll.refresh();
                    //window.sessionStorage.setItem('huan_scroll',parseInt($("#scrollTop").val()));
                    window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll')||0);
					//页面跳转
                    var rels_id=$(this).attr('rels_id');
                    var count_type=$(this).attr('count_type');
                    var url="goodsDetails.html?tab=2&rels_id="+rels_id+'&count_type='+count_type;
                    window.location.href=url;
                })
            })

			//重新渲染scroll
			myScroll.refresh();
		}
	})
}



//所有商品列表渲染
var pageIndex = 1;
function allGoodsBind() {
	$.ajax({
		url: contextPath.dataPath + '/api/production/list',
		type:'get',
		data: {
			area_id: area_id,
			page: pageIndex,
			brand_id: ppid.id||ppid||window.sessionStorage.getItem('huan_ppid'),
			category_id: flid.id||flid||window.sessionStorage.getItem('huan_flid')

		},
		success: function (d) {
			var listd = d.data.data; //
			//console.log(listd);//如果没有数据了 就表示加载完毕了
			var allGoods = '';
			var allGoods2='';
			if ($(".goodsContent1").hasClass('showAllShop')) {

				$.each(listd, function (i, d) {
					//console.log(d.info.is_disable)
					allGoods += '<li class="goodsList" id="'+d.id+'"> \
									<a id="'+d.id+'" rels_id="'+d.info.rels_id+'" count_type="'+d.info.count_type+'">\
										<div class="goodsImg"> \
											<img src="' + d.images + '" alt=""> \
										</div> \
										<div class="goodsLabel"> \
											<p>'+ d.product_name+'</p>\
											<p>品牌：' + d.brand.name + '</p> \
											<p>销量：' + d.info.sale_num+ '</p> \
											<p class="goodsPrice"><i></i>价格：' + d.info.price + '元</p> \
										</div>\
									</a>\
								</li>'
				});


                //change-----------------------------------------------------------------------------
                if(listd.length==0){
                    nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
                    $(".contentBox").html(nullStr);
                    $("#pullUp").hide();
                    return false;
                    //$(".pullUpLabel").html('没有更多数据了');
                }else{
                    $(".goodsContent1").append(allGoods);//append追加 html替换
                    myScroll.refresh();
                }
//change-----------------------------------------------------------------------------

				$(".goodsContent1 .goodsImg img").each(function(index,ele){
					//console.log($(this))
					setloadStyle(ele)
				})

                //跳转页面前设置缓存 分页 数据 滚动条
                window.sessionStorage.setItem('huan_page',pageIndex);
                window.sessionStorage.setItem('huan_data',$(".goodsContent1").html());
                myScroll.refresh();
                window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));

				$(".goodsContent1>li>a").each(function(){
					$(this).click(function(){
						//跳转页面前设置缓存 分页 数据 滚动条
						//window.sessionStorage.setItem('huan_page',pageIndex);
                       //window.sessionStorage.setItem('huan_data',$(".goodsContent1").html());
                        //myScroll.refresh();
                        //window.sessionStorage.setItem('huan_scroll',$("#scrollTop").val());
                        window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
						//跳转页面
						var rels_id=$(this).attr('rels_id');
						var count_type=$(this).attr('count_type');
						var url="goodsDetails.html?rels_id="+rels_id+'&count_type='+count_type;
                        window.location.href=url
					})
				})


			} else if ($(".goodsContent2").hasClass('showAllShop')) {
				$.each(listd, function (i, d) {
					allGoods2 += '<li class="goodsList"> \
									<a id="'+d.id+'" rels_id="'+d.info.rels_id+'" count_type="'+d.info.count_type+'">\
										<div class="goodsImg"> \
											<img src="' + d.images + '" alt=""> \
										</div> \
										<div class="goodsLabel"> \
											<p>'+ d.product_name+'</p>\
											<p>品牌：' + d.brand.name + '</p> \
											<p>销量：' + d.info.sale_num+d.info.fake_sale_num + '</p> \
											<p class="goodsPrice"><i></i>价格：' + d.info.price + '元</p> \
										</div>\
									</a>\
								</li>'
				});


 //change-----------------------------------------------------------------------------
                if(listd.length==0){
                    nullStr='<div style="width:100%;border:0;text-align: center;padding-top:1rem;">\
								<img src="images/find.png" style="width:1.85rem;height:2.25rem;">\
								<p style="margin-top:.1rem;font-size:.28rem;color:#666;">未搜索到任何内容</p>\
							</div>';
                    $(".contentBox").html(nullStr);
                    $("#pullUp").hide();
                    return false;
                    //$(".pullUpLabel").html('没有更多数据了');
                }else{
                    $(".goodsContent2").append(allGoods2);
                    myScroll.refresh();
                }
//change-----------------------------------------------------------------------------

				$(".goodsContent2 .goodsImg img").each(function(index,ele){
					setloadStyle(ele)
				});

                //跳转页面前设置缓存 分页 数据 滚动条
                window.sessionStorage.setItem('huan_page',pageIndex);
                window.sessionStorage.setItem('huan_data',$(".goodsContent2").html());
                myScroll.refresh();
                //window.sessionStorage.setItem('huan_scroll',$("#scrollTop").val());
                window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
                $(".goodsContent2>li>a").each(function(){
                    $(this).click(function(){
                        //跳转页面前设置缓存 分页 数据 滚动条
                        //window.sessionStorage.setItem('huan_page',pageIndex);
                        //window.sessionStorage.setItem('huan_data',$(".goodsContent2").html());
                        //myScroll.refresh();
                        //window.sessionStorage.setItem('huan_scroll',$("#scrollTop").val());
                        window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
                        var rels_id=$(this).attr('rels_id');
                        var count_type=$(this).attr('count_type');
                        var url="goodsDetails.html?rels_id="+rels_id+'&count_type='+count_type;
                        window.location.href=url;
                    })
                })
			}
		}
	});
}

//预览后垂直居中与业务处理
function setloadStyle(img){
	//console.log($(img).parent().width())
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
		imgWrap:'wrapper',
		w:wrapWidth,
		h:wrapHeight
	});
}

//等比例缩放图片
function scaleIMG(json){
	var imgWrap=document.getElementById(json.imgWrap);
	var img=imgWrap.getElementsByTagName('img');
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


