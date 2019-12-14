
aboutUs();
function aboutUs(){
	$.ajax({
		url:contextPath.dataPath+'/api/aboutus/sellers',
		type:'get',
		data:{},
		success:function(d){
			console.log(d);
			var data= d.data;
			bindAbout(data);
		}
	});
}

function bindAbout(data){
	$(".aboutUs p").html(data.content);
}

document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});
