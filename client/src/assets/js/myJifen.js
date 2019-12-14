

if(userInfoObj.token){
	jifenFn()
}else{
	window.location.href='login.html';
}

var jfPage=1;
function jifenFn(){
	$.ajax({
		url: contextPath.dataPath+'/api/score/list',
		type:'get',
		data:{
			token:userInfoObj.token,
			page:jfPage
		},
		success:function(d){
			console.log(d);
			var data= d.data.data;
			bindJifen(data)
		}
	});
}

function bindJifen(data){
	var str='';
	$.each(data,function(i,d){

		var addOrRem='';
		var classFlag='';
		//1表示增加  0表示减少
		if(d.is_add){
			addOrRem='+';
			classFlag='';
		}else{
			addOrRem='-';
			classFlag='jian'
		}
		str+='<li class="'+classFlag+'">\
				<div class="left">\
					<p>'+ d.created_at+'</p>\
					<p>'+ d.desc+'</p>\
				</div>\
				<div class="right">\
					<span class="fuhao">'+addOrRem+'</span>\
					<span class="jine">'+ d.num+'</span>\
			   </div>\
			</li>';
	});
	$(".myJifen").find('ul').html(str);
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});

