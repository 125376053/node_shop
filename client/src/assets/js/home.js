

$(function () {
	
    /*//登录后area_id
    if (userInfoObj.token) {
    	
        console.log('登录后')
        $.ajax({
            url: contextPath.dataPath + '/api/index/picture?token=' + userInfoObj.token,
            type: 'get',
            data: {
                area_id: window.localStorage.getItem('area_id')
            },
            success: function (d) { 
            	
                var heshi = d.data.seller_is_audio;
                if (heshi > 0) {
                    console.log('核实')
                    var area_name = d.data.area_data.name;
                    var area_id = d.data.area_data.id;
                    //alert(area_id)
                    //alert(area_name)
                    window.localStorage.setItem('area_name', area_name);
                    window.localStorage.setItem('area_id', area_id);
                    $(".cityName").html(area_name);
                    $(".city").unbind('click');
                    swiperView(area_id);
                    homePic(area_id);
                    categoryList(area_id);
                    goodsList(area_id);
                    searchCityList(area_id);
                } else {
                	console.log('meiyou核实')
                	//alert(window.localStorage.getItem('area_id'))
					//alert(window.localStorage.getItem('area_name'))
                    $(".cityName").html(window.localStorage.getItem('area_name'));
                    swiperView(window.localStorage.getItem('area_id'));
                    homePic(window.localStorage.getItem('area_id'));
                    categoryList(window.localStorage.getItem('area_id'));
                    goodsList(window.localStorage.getItem('area_id'));
                    searchCityList(window.localStorage.getItem('area_id'));
                }
            }
        });
    }*/
    
    
	//有没有登录这个城市列表都可以执行
    cityListView();
	
	
    function cityListView() {
    	
        $.ajax({
            url: contextPath.dataPath + '/api/city/list',
            type: 'get',
            //async: false,
            data: {},
            success: function (d) {
                //渲染城市name
                var cityName = window.localStorage.getItem('area_name');
                if (cityName) {
                    $(".cityName").html(cityName);
                }

                //渲染弹出层城市列表
                var str = "";
                $.each(d.data, function (i, o) {
                    str += '<li area_id="' + o.id + '" area_name="' + o.name + '">' + o.name + '</li>';
                });
                $(".homeCityList").html(str);

                //首次登录选择城市 主动触发
                if (!window.localStorage.getItem('area_id') || window.localStorage.getItem('area_id')==0) {
                    //alert('没有城市弹出层')
                    $(".city").trigger('click');
                }else{
                	//alert('已经有城市了')
                	//alert(window.localStorage.getItem('area_id'))
					//alert(window.localStorage.getItem('area_name'))
        			swiperView(window.localStorage.getItem('area_id'));
				    homePic(window.localStorage.getItem('area_id'));
				    categoryList(window.localStorage.getItem('area_id'));
				    goodsList(window.localStorage.getItem('area_id'));
				    searchCityList(window.localStorage.getItem('area_id'));
                }
            }
        });

        //选择城市弹出层
        $(".city").click(function (event) {
            event.stopPropagation();
            $.lockScreen({
                begin: "selectCity", //弹出层内容id
                closed: "querenCity",  //关闭class
                opacity: '0.7'	//遮罩层透明度
            });
            var thisHtml = $(this).find('.cityName').html();
            if (thisHtml) {
                $(".homeCityList li").each(function (i, index) {
                    if ($(this).html() == thisHtml) {
                        $(this).addClass('currentCityName').siblings().removeClass('currentCityName');
                    }
                    if ($(this).hasClass('currentCityName')) {
                        var id = $(this).attr('area_id'); //默认渲染的城市id
                        var cityName = $(this).attr('area_name'); //默认渲染的城市name
                        //缓存城市area_id
                        window.localStorage.setItem('area_id', id);
                        //缓存城市area_name
                        window.localStorage.setItem('area_name', cityName);
                    }
                });
            } else {
                $(".homeCityList li").each(function (i, index) {
                    if ($(this).index() == 0) {
                        //这里添加样式不起作用 需等循环结束后才能确定哪一个是0
                        $(this).addClass('currentCityName');
                        console.log($(".homeCityList li").eq(0))
                        //如果不选中城市就点击确定
                        $(".homeCityList li").eq(0).addClass('currentCityName');
                        var id = $(".homeCityList li").eq(0).attr('area_id'); //默认渲染的城市id
                        var cityName = $(".homeCityList li").eq(0).attr('area_name'); //默认渲染的城市name
                        //缓存城市area_id
                        window.localStorage.setItem('area_id', id);
                        //缓存城市area_name
                        window.localStorage.setItem('area_name', cityName);

                        $(".cityName").html(cityName);
                        //如果不选中城市就点击确定
                    }
                })
            }

        });

        //点击高亮城市
        $(".homeCityList").on('click', 'li', function () {
            $(this).addClass('currentCityName').siblings().removeClass('currentCityName');
            var id = $(this).attr('area_id');
            var cityName = $(this).attr('area_name');
            //缓存城市area_id
            window.localStorage.setItem('area_id', id);
            //缓存城市area_name
            window.localStorage.setItem('area_name', cityName);
            //确认选择城市
            $(".cityName").html(window.localStorage.getItem('area_name'));
        });
    }

    //单击确定发起当前城市的请求
    $(".selectCity .querenCity").on('click', function () {
        var area_id = window.localStorage.getItem('area_id');
        swiperView(area_id);
        homePic(area_id);
        categoryList(area_id);
        goodsList(area_id);
        searchCityList(area_id);
    });

//大括号
});


//轮播图
function swiperView(id) {
    $.ajax({
        url: contextPath.dataPath + '/api/index/picture',
        type: 'get',
        dataType: 'json',
        async: false,
        data: {
            area_id: id
        },
        success: function (d) {

            var swiperData = d.data.mall_flash;
            var swiperStr = '';
            $.each(swiperData, function (i, k) {
                // 1品牌(ur的值表示品牌id)
                // 2品类(url表示分类id)
                // 3 商品(url表示商品的rels_id)
                // 4 链接(url表示跳转链接)
                console.log(d)
                var url = '';
                if (k.app_url == 1) {
                    url = 'allGoods.html?brand_id=' + k.url
                }
                if (k.app_url == 2) {
                    url = 'allGoods.html?category_id=' + k.url
                }
                if (k.app_url == 3) {
                    url = 'goodsDetails.html?area_id=1&rels_id=' + k.url
                }
                if (k.app_url == 4) {
                    url = k.url;
                }

                var imgID = k.picture.id;
                var imgURL = k.picture.url;
                swiperStr += '<div class="swiper-slide"> \
								<a class="swiperAs" data-href="' + url + '" app-url="' + k.app_url + '">\
									<img id="' + imgID + '" src="' + imgURL + '" style="width: 100%;" />\
								</a> \
							</div>'

            });
            $(".swiper-wrapper").html(swiperStr);

            var mySwiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                loop: true,
                grabCursor: true,
                paginationClickable: true,
                autoplay: 3000,
                autoplayDisableOnInteraction: false
            })


            //weixin轮播跳转
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                $(".swiperAs").each(function (i, d) {
                    $(this).click(function () {
                        var url = $(this).attr('data-href');
                        $(this).attr('href', url);
                    })
                })
            }
        }
    });
}


document.addEventListener('plusready', function () {
    $(".swiperAs").each(function (i, d) {
        $(this).click(function () {
            var url = $(this).attr('data-href');
            clicked('2.html?page=' + url);
        })
    })
}, false)

//home 限时 特惠 秒杀
function homePic(id) {
    $.ajax({
        url: contextPath.dataPath + '/api/index/picture',
        type: 'get',
        dataType: 'json',
        data: {
            area_id: id,
            block:1
        },
        success: function (d) {
            var indexPic = d.data.index_pic;//1
            $.each(indexPic, function (i, pic) {
                if (i == 0) {
                    //$(".homePic .p1 a").attr('href',pic.url);
                    $(".homePic .p1 a img").attr('title', pic.title);
                    $(".homePic .p1 a img").attr('src', pic.url);
                }

                if (i == 1) {
                    //$(".homePic .p2 a:eq(0)").attr('href',pic.url);
                    $(".homePic .p2 a:eq(0) img").attr('title', pic.title);
                    $(".homePic .p2 a:eq(0) img").attr('src', pic.url);
                }

                if (i == 2) {
                    //$(".homePic .p2 a:eq(1)").attr('href',pic.url);
                    $(".homePic .p2 a:eq(1) img").attr('title', pic.title);
                    $(".homePic .p2 a:eq(1) img").attr('src', pic.url);
                }
            });

        }
    })
    
    $.ajax({
        url: contextPath.dataPath + '/api/index/picture',
        type: 'get',
        dataType: 'json',
        data: {
            area_id: id,
            block:2
        },
        success: function (d) {
            var indexPic = d.data.index_pic;//1
            $.each(indexPic, function (i, pic) {
                if (i == 3) {
                    //$(".homePic .p1 a").attr('href',pic.url);
                    $(".homePic2 .p1 a img").attr('title', pic.title);
                    $(".homePic2 .p1 a img").attr('src', pic.url);
                }

                if (i == 4) {
                    //$(".homePic .p2 a:eq(0)").attr('href',pic.url);
                    $(".homePic2 .p2 a:eq(0) img").attr('title', pic.title);
                    $(".homePic2 .p2 a:eq(0) img").attr('src', pic.url);
                }

                if (i == 5) {
                    //$(".homePic .p2 a:eq(1)").attr('href',pic.url);
                    $(".homePic2 .p2 a:eq(1) img").attr('title', pic.title);
                    $(".homePic2 .p2 a:eq(1) img").attr('src', pic.url);
                }
            });

        }
    })
}

//分类数据
function categoryList(id) {
    $.ajax({
        url: contextPath.dataPath + '/api/index/picture',
        type: 'get',
        dataType: 'json',
        data: {
            area_id: id
        },
        success: function (d) {
            var category_list = d.data.category_list;
            var categoryStr = '';
            var allCategory = '';
            $.each(category_list, function (i, cad) {

                categoryStr += '<li> \
									<a href="allGoods.html?category_id=' + cad.id + '&category_name=' + cad.name + '"> \
										<img src="' + cad.logo + '"> \
										<p>' + cad.name + '</p> \
									</a> \
								</li>';
                allCategory = '<li>\
								<a href="allGoods.html">\
									<img src="images/home_8.png">\
									<p>所有</p>\
									</a>\
								</li>'
            });
            $(".indexNav ul").html(categoryStr + allCategory);
        }
    })
}

//商品列表
function goodsList(id) {
    $.ajax({
        url: contextPath.dataPath + '/api/index/picture',
        type: 'get',
        data: {
            area_id: id
        },
        success: function (d) {
            var goods_data = d.data.goods_data;

            var goodsStr = '';
            $.each(goods_data, function (i, d) {

                var url = 'goodsDetails.html?area_id=' + id + '&rels_id=' + d.info.rels_id;
                goodsStr += '<li class="orderPic" style="height:2.4rem; overflow: hidden;"> \
						<a href="' + url + '">\
							<div class="left" style="width: 100%;"> \
								<img src="' + d.images + '" style="width: 1.9rem;height:1.9rem;"> \
								<div class="imgRight" style="width: 4.7rem;"> \
									<p class="p1" style="width: 4.7rem;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">商品名称：<span>' + d.product_name + '</span></p> \
									<p class="p2">品牌：<span>' + d.brand.name + '</span></p> \
									<p class="p3">销量：<span>' + d.info.sale_num + '</span></p> \
									<p class="p4">价格：<span>' + d.info.price + '元</span></p> \
								</div> \
							</div> \
						</a>\
				     </li>'
            });
            $(".list_game").html(goodsStr);
            $(".lookAllBg").show();
        }
    })
}

//搜索商品列表传递id
function searchCityList(id) {
    $("#homeSearch a").click(function () {
        var val = $(this).parent().find('input').val();
        $(this).attr('href', 'homeSearch.html?area_id=' + id + '&keyword=' + val + '');
    });
}

//监听手机按钮搜索
$("#homeSearch input").keypress(function (e) {
    if (e.keyCode === 13) {
        // 处理相关逻辑
        var val = $('#homeSearch').find('input').val();
        var id = window.localStorage.getItem('area_id');
        var url = "homeSearch.html?area_id=" + id + "&keyword=" + val;
        window.location.href = url;
    }
});


mui.Back = function () {
    var parentView = plus.webview.currentWebview().parent();
    parentView.evalJS('mui.Back();');
}