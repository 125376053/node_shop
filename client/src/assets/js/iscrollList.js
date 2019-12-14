

//恢复分类
if($('#huan_fltext').val()){
    $(".flText").html($('#huan_fltext').val());
    $(".goodsHead li:first").addClass('highlight');
    $(".goodsHead li:first i").addClass('sort_focus');
}

//恢复品牌
if($("#huan_pptext").val()){
    $(".ppText").html($("#huan_pptext").val());
    $(".goodsHead li:eq(1)").addClass('highlight');
    $(".goodsHead li:eq(1) i").addClass('brand_focus');
}

if($(".goodsHead li:eq(1)").hasClass('highlight')){
    $(".goodsContent1").removeClass('showAllShop');
    $(".goodsContent2").addClass('showAllShop');
}



//var pageIndex=1; //所有商品页 分页标志



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

            console.log(this.y)
            $("#scrollTop").val(this.y);

            //myScroll.refresh();

        }  
    });  
      
    loadAction();  
}  
document.addEventListener('touchmove', function (e) { 
	//e.preventDefault(); 
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

                if($("#huan_data").val()){
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
                    if($("#huan_data").val()){
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
                if($("#huan_data").val()){
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
                    if($("#huan_data").val()){
                        pageIndex=parseInt($("#huan_page").val())+1;
                        $("#huan_page").val(pageIndex);
                        //alert(pageIndex)
                        allGoodsBind();
                    }else{
                        pageIndex++;
                        //分页写入记录
                        $("#huan_page").val(pageIndex);
                        allGoodsBind();
                    }
                }else{
                    //alert('分类商品');
                    if(getSearchString('category_id')){
                        category_id=getSearchString('category_id');
                        $("#huan_flid").val(category_id);
                        //alert(category_id)
                        //alert('1111111111111111')
                        pageIndex=parseInt($("#huan_page").val())+1;
                        $("#huan_page").val(pageIndex);
                        //alert(pageIndex)
                        fenLeiSearch(category_id);
                    }else{
                        flid=$("#huan_flid").val();
                        //alert(flid)
                        pageIndex=parseInt($("#huan_page").val())+1;
                        $("#huan_page").val(pageIndex);
                        //alert(pageIndex)
                        fenLeiSearch(flid);
                    }
                }
            }else{
                if($(".goodsBox li:eq(1) span").html()=='品牌' || $(".goodsBox li:eq(1) span").html()=='全部'){
                    if($("#huan_data").val()){
                        pageIndex=parseInt($("#huan_page").val())+1;
                        $("#huan_page").val(pageIndex);
                        //alert(pageIndex)
                        allGoodsBind();
                    }else{
                        pageIndex++;
                        //分页写入记录
                        $("#huan_page").val(pageIndex);
                        allGoodsBind();
                    }
                }else{
                    ppid=$("#huan_ppid").val();
                    //alert(ppid)
                    pageIndex=parseInt($("#huan_page").val())+1;
                    $("#huan_page").val(pageIndex);
                    pinPaiSearch(ppid);
                }
            }
        });

        tryCode(function(){
            //搜索
            /*if($("#searchPage").attr('data')=='noData'){
                $.Prompt('已经没有更多数据了');
            }else{
                searchIndex++;
                homeSearch();
            }*/
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


//hash 保存数据和位置
function savePositionAndData(){

    //恢复数据
    var currentData=$("#huan_data").val();
    $(".goodsContent1").html(currentData);
    //滚动条初始化
    myScroll.refresh();
    //恢复滚动条一定要转换整数
    var zhangchaojie=parseInt($("#huan_scroll").val());
    myScroll.scrollTo(0,zhangchaojie);

    //缓存数据的跳转链接
    $(".goodsContent1>li>a").each(function(){

        $(this).click(function(){
            //缓存内容
            $("#huan_data").val($(".goodsContent1").html());
            //滚动条初始化
            myScroll.refresh();
            //缓存滚动条
            $("#huan_scroll").val($("#scrollTop").val());

            var rels_id=$(this).attr('rels_id');
            var count_type=$(this).attr('count_type');
            var url="goodsDetails.html?rels_id="+rels_id+'&count_type='+count_type;
            window.location.href=url;

        })
    })
}


function savePositionAndData2(){
    var currentData=$("#huan_data").val();
    $(".goodsContent2").html(currentData);
    myScroll.refresh();
    //恢复滚动条一定要转换整数
    var zhangchaojie=parseInt($("#huan_scroll").val());
    myScroll.scrollTo(0,zhangchaojie);

    $(".goodsContent2>li>a").each(function(){

        $(this).click(function(){

            //缓存内容
            $("#huan_data").val($(".goodsContent2").html())
            //滚动条初始化
            myScroll.refresh();
            //缓存滚动条
            $("#huan_scroll").val(parseInt($("#scrollTop").val()))

            var rels_id=$(this).attr('rels_id');
            var count_type=$(this).attr('count_type');
            var url="goodsDetails.html?rels_id="+rels_id+'&count_type='+count_type;
            $(this).attr('href',url);

        })
    })
}
