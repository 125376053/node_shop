

//恢复分类
/*if($('#huan_fltext').val()){
    $(".flText").html($('#huan_fltext').val());
    $(".goodsHead li:first").addClass('highlight');
    $(".goodsHead li:first i").addClass('sort_focus');
}*/
if(window.sessionStorage.getItem('huan_fltext')){
    $(".flText").html(window.sessionStorage.getItem('huan_fltext'));
    $(".goodsHead li:first").addClass('highlight');
    $(".goodsHead li:first i").addClass('sort_focus');
}

//恢复品牌
/*if($("#huan_pptext").val()){
    $(".ppText").html($("#huan_pptext").val());
    $(".goodsHead li:eq(1)").addClass('highlight');
    $(".goodsHead li:eq(1) i").addClass('brand_focus');
}*/
if(window.sessionStorage.getItem('huan_pptext')){
    $(".ppText").html(window.sessionStorage.getItem('huan_pptext'));
    $(".goodsHead li:eq(1)").addClass('highlight');
    $(".goodsHead li:eq(1) i").addClass('brand_focus');
}

if($(".goodsHead li:eq(1)").hasClass('highlight')){
    $(".goodsContent1").removeClass('showAllShop');
    $(".goodsContent2").addClass('showAllShop');
}


var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;  
  
function loaded() {  
    //动画部分  
    pullDownEl = document.getElementById('pullDown');  
    pullDownOffset = pullDownEl.offsetHeight;  
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        //useTransition: true,
        topOffset: pullDownOffset,
        hideScrollbar:false,
        //bounce:false,
        onRefresh: function () {  
            if (pullDownEl.className.match('loading')) {  
                pullDownEl.className = '';  
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新';  
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';  
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';  
            }
        },  
        onScrollMove: function () {  
          
            if (this.y > 5 && !pullDownEl.className.match('flip')) {  
                pullDownEl.className = 'flip';  
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '释放刷新';  
                this.minScrollY = 0;  
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {  
                pullDownEl.className = '';  
                pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';  
                this.minScrollY = -pullDownOffset;  
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';  
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';  
                this.maxScrollY = this.maxScrollY;  
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {  
                pullUpEl.className = '';  
                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';  
                this.maxScrollY = pullUpOffset;  
            }

        },  
        onScrollEnd: function () {

            if (pullDownEl.className.match('flip')) {  
                pullDownEl.className = 'loading';  
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中';                 
                pullDownAction();   // Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';  
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';                 
                pullUpAction(); // Execute custom function (ajax call?)  
            }
            //$("#scrollTop").val(this.y);
            window.sessionStorage.setItem('huan_scroll',this.y);
        }  
    });  
      
    loadAction();  
}  
document.addEventListener('touchmove', function (e) { 
	e.preventDefault(); 
}, false);//阻止冒泡
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function(){
        loaded();
    }, 0);
}, false);


//初始状态，加载数据  
function loadAction(){

    tryCode(function(){

        if($(".goodsContent1").hasClass('showAllShop')){

            if(($(".goodsBox li:first span").html()=='分类' || $(".goodsBox li:first span").html()=='全部') && !getSearchString('category_id')){
                if(window.sessionStorage.getItem('huan_data')){
                    //alert('读缓存');
                    //缓存恢复值
                    savePositionAndData();
                }else{
                    //alert('不缓存');
                    //发起ajax请求
                    allGoodsBind();
                }
            }else{

                if(category_id){
                    if(window.sessionStorage.getItem('huan_data')){
                        savePositionAndData()
                    }else{
                        //alert('123')
                        fenLeiSearch(category_id);
                    }
                }else{
                    //alert('根本没有这个的分类商品')
                    savePositionAndData()
                }
            }
        }else{
            //alert('zzzzzzzzzzzzzzzzzzzzz')
            if($(".goodsBox li:eq(1) span").html()=='品牌' || $(".goodsBox li:eq(1) span").html()=='全部'){
                if(window.sessionStorage.getItem('huan_data')){
                    savePositionAndData2();
                }else{
                    allGoodsBind();
                }
            }else{
                //alert('品牌')
                savePositionAndData2();
            }
        }
    });

    tryCode(function(){
        //搜索
        homeSearch();
    });

    tryCode(function(){
        //超低折扣
        disCount();
    });

    tryCode(function(){
        //限量特惠
        preferen();
    });

    tryCode(function(){
        //限时抢购
        timeOver();
    });

    myScroll.refresh();  
}


//上拉加载更多数据
function pullUpAction () {

    setTimeout(function () {

        tryCode(function(){


            if($(".goodsContent1").hasClass('showAllShop')){
                if( ($(".goodsBox li:first span").html()=='分类' || $(".goodsBox li:first span").html()=='全部') && !getSearchString('category_id')){
                    //所有商品
                    if(window.sessionStorage.getItem('huan_data')){
                        pageIndex=parseInt(window.sessionStorage.getItem('huan_page'))+1;
                        window.sessionStorage.setItem('huan_page',pageIndex);
                        allGoodsBind();
                    }else{
                        //所有商品未缓存之前的分页计算
                        pageIndex++;
                        //分页写入记录
                        //$("#huan_page").val(pageIndex);
                        window.sessionStorage.setItem('huan_page',pageIndex);
                        allGoodsBind();
                    }
                }else{
                    //alert('分类商品');
                    if(getSearchString('category_id')){
                        category_id=getSearchString('category_id');
                        window.sessionStorage.setItem('huan_flid',category_id);
                        pageIndex=parseInt(window.sessionStorage.getItem('huan_page'))+1;
                        window.sessionStorage.setItem('huan_page',pageIndex);
                        fenLeiSearch(category_id);

                    }else{
                        flid=window.sessionStorage.getItem('huan_flid');
                        pageIndex=parseInt(parseInt(window.sessionStorage.getItem('huan_page')))+1;
                        window.sessionStorage.setItem('huan_page',pageIndex);
                        fenLeiSearch(flid);
                    }
                }
            }else{
                if($(".goodsBox li:eq(1) span").html()=='品牌' || $(".goodsBox li:eq(1) span").html()=='全部'){
                    //所有商品
                    if(window.sessionStorage.getItem('huan_data')){
                        pageIndex=parseInt(window.sessionStorage.getItem('huan_page'))+1;
                        window.sessionStorage.setItem('huan_page',pageIndex);
                        //alert(pageIndex)
                        allGoodsBind();
                    }else{
                        //所有商品未缓存之前的分页计算
                        pageIndex++;
                        //分页写入记录
                        //$("#huan_page").val(pageIndex);
                        window.sessionStorage.setItem('huan_page',pageIndex);
                        allGoodsBind();
                    }

                }else{
                    ppid=window.sessionStorage.getItem('huan_ppid');
                    pageIndex=parseInt(window.sessionStorage.getItem('huan_page'))+1;
                    window.sessionStorage.getItem('huan_page',pageIndex);
                    pinPaiSearch(ppid);
                }
            }
        });

        tryCode(function(){
            searchIndex++;
            homeSearch();
        });

        tryCode(function(){
            //超低折扣
            disIndex++;
            disCount();
        });

        tryCode(function(){
        	if($(".contentBox").attr('data')=='noData'){
                $("#pullUp").hide();
            }else{
                //限量特惠
	            preIndex++;
	            preferen();
            }
            
        });

        tryCode(function(){
            //限时抢购
            if($("#container").attr('data')=='noData'){
                //$.Prompt('已经没有更多数据了');
            }else{
                timeIndex++;
                timeOver();
            }
            /*timeIndex++;
            timeOver();*/
        });

        myScroll.refresh();

    }, 0);
}
  
//下拉刷新当前数据  
function pullDownAction () {
    setTimeout(function () {  
        //这里执行刷新操作
        myScroll.refresh();   
    }, 0);
}


//保存数据和位置
function savePositionAndData(){
    //恢复数据
    $(".goodsContent1").html(window.sessionStorage.getItem('huan_data'));
    myScroll.refresh();
    //恢复滚动条
    myScroll.scrollTo(0,parseInt(window.sessionStorage.getItem('huan_scroll')));

    //缓存数据的跳转链接
    $(".goodsContent1>li>a").each(function(){
        $(this).click(function(){
            //缓存
            //window.sessionStorage.setItem('huan_page',pageIndex);
            window.sessionStorage.setItem('huan_data',$(".goodsContent1").html());
            myScroll.refresh();
            window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
            //跳页
            var rels_id=$(this).attr('rels_id');
            var count_type=$(this).attr('count_type');
            var url="goodsDetails.html?rels_id="+rels_id+'&count_type='+count_type;
            window.location.href=url
        })
    })
}


function savePositionAndData2(){
    //恢复数据
    $(".goodsContent2").html(window.sessionStorage.getItem('huan_data'));
    myScroll.refresh();
    //恢复滚动条
    myScroll.scrollTo(0,parseInt(window.sessionStorage.getItem('huan_scroll')));

    $(".goodsContent2>li>a").each(function(){
        $(this).click(function(){
            //缓存
            //window.sessionStorage.setItem('huan_page',pageIndex);
            window.sessionStorage.setItem('huan_data',$(".goodsContent2").html());
            myScroll.refresh();
            window.sessionStorage.setItem('huan_scroll',window.sessionStorage.getItem('huan_scroll'));
            //跳页
            var rels_id=$(this).attr('rels_id');
            var count_type=$(this).attr('count_type');
            var url="goodsDetails.html?rels_id="+rels_id+'&count_type='+count_type;
            $(this).attr('href',url);
        })
    })
}
