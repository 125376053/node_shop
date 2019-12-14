
//var pageIndex=1; //所有商品页 分页标志



var myScroll,pullDownEl, pullDownOffset,pullUpEl, pullUpOffset,generatedCount = 0;  
  
function loaded() {  
    //动画部分  
    pullDownEl = document.getElementById('pullDown');  
    pullDownOffset = pullDownEl.offsetHeight;  
    pullUpEl = document.getElementById('pullUp');     
    pullUpOffset = pullUpEl.offsetHeight;  
    myScroll = new iScroll('wrapper', {
        useTransition: true,  
        topOffset: pullDownOffset,  
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
        }  
    });  
      
    loadAction();  
}  
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);//阻止冒泡  
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
                allGoodsBind();
            }else{
                if(category_id){
                    fenLeiSearch(category_id);
                }else{
                    fenLeiSearch(flid);
                }
            }
        }else{
            if($(".goodsBox li:eq(1) span").html()=='品牌' || $(".goodsBox li:eq(1) span").html()=='全部'){
                allGoodsBind();
            }else{
                pinPaiSearch(ppid);
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
            pageIndex++;
            if($(".goodsContent1").hasClass('showAllShop')){
                if( ($(".goodsBox li:first span").html()=='分类' || $(".goodsBox li:first span").html()=='全部') && !getSearchString('category_id') ){
                    allGoodsBind();
                }else{
                    //fenLeiSearch(flid);
                    if(category_id){
                        fenLeiSearch(category_id);
                    }else{
                        fenLeiSearch(flid);
                    }
                }
            }else{
                if($(".goodsBox li:eq(1) span").html()=='品牌' || $(".goodsBox li:eq(1) span").html()=='全部'){
                    allGoodsBind();
                }else{
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
            //限量特惠
            preIndex++;
            preferen();
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
    }, 400);  
}
