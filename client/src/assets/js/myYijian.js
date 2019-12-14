

if(userInfoObj.token){
	$(".recivBtn").click(function(){
		var content=$(".resetTa").val();
		if(content==''){
			$.Prompt('请输入反馈信息');
			return false;
		}else{
			yijian(content);
		}
	});
}else{
	window.location.href='login.html';
}

function yijian(content){
	$.ajax({
		url:contextPath.dataPath+'/api/post/feeback/add?token='+userInfoObj.token,
		type:'post',
		data:{
			token:userInfoObj.token,
			content:content,
			images:'1'
		},
		success:function(d){
			//console.log(d)
			window.location.href='my.html';
		}
	});
}


document.addEventListener("plusready", function() {
    // 注册返回按键事件
    plus.key.addEventListener('backbutton', function() {
        // 事件处理
        window.history.back();
    }, false);
});


