

	//---------------------------------定位到当前位置-------------------------------
	var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('container', {
        resizeEnable: false,
		scrollWheel: true,
		zoomEnable:true,
		zoom:12
    });

	map.setCity(window.localStorage.getItem('area_name'),function(){
		map.setZoom(12);
		map.setStatus({
			zoomEnable: true
		});
	});


	AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
		var positionPicker = new PositionPicker({
			mode: 'dragMap',
			map: map
		});

		positionPicker.on('success', function(positionResult) {

			inClientView(positionResult.address,positionResult.position);
		});
		
		var onModeChange = function(e) {
			positionPicker.setMode(e.target.value)
		}
		AMap.event.addDomListener(document,'change', onModeChange)

		positionPicker.start();
		map.panBy(0, 1);
		
		
		/*map.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: true,//是否使用高精度定位，默认:true
				timeout: 10000,          //超过10秒后停止定位，默认：无穷大
				buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
				buttonPosition:'RB'
			});
			map.addControl(geolocation);
			
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
			AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
		});
		//解析定位结果
		function onComplete(data) {
			positionPicker.start(data.position);
			var str=['定位成功'];
			str.push('经度：' + data.position.getLng());
			str.push('纬度：' + data.position.getLat());
			if(data.accuracy){
				 str.push('精度：' + data.accuracy + ' 米');
			}//如为IP精确定位结果则没有精度信息
			str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
			//document.getElementById('tip').innerHTML = str.join('<br>');
		}
		//解析定位错误信息
		function onError(data) {
			//document.getElementById('tip').innerHTML = '定位失败';
		}*/

	});
	
	
	//---------------------------------------------------------------------------------------------------

var aAreaDatas = [];
$.ajax({
	//url:'http://admin.cpm88.xyz/api/map/info',
	url:contextPath.dataPath+'/api/map/info',
	method:'get',
	async:false,
	data:{
		area_id:window.localStorage.getItem('area_id')
	},
	success:function(d){
		//console.log(d)
		aAreaDatas=d;
	}
});
//-----------------------------------------区域坐标和信息数据-------------------------------------------
    var aPolygon = [];

    //检测标记点是否在区域内
    function inClientView(info,point){
        for (var i = 0 ; i < aPolygon.length; i++){
			var bArea = false;
            if(aPolygon[i].contains(point)) {
				console.log(aPolygon[i].partners_id)
				$("#pickerInput").attr('placeholder',info).attr('x',point.lat).attr('y',point.lng);
				window.localStorage.setItem('mapAdress',info);
				window.localStorage.setItem('mapAdressPartners_Id',aPolygon[i].partners_id);
				window.localStorage.setItem('mapAdressId',aPolygon[i].id);
				window.localStorage.setItem('mapAdressX',point.lat);
				window.localStorage.setItem('mapAdressY',point.lng);
                //console.log('片区名称:'+aPolygon[i].name+'   派送员:'+aPolygon[i].sender);
                bArea = true;
                break;
            }
        }
		//console.log(bArea);
		if(!bArea){
			//jalert('该地址暂无派送员');
			$("#pickerInput").val('').removeAttr('x').removeAttr('y');
			$("#pickerInput").attr('placeholder','不在区域内，请将指针拖动到已开通服务区域');
			window.localStorage.removeItem('mapAdress');
			window.localStorage.removeItem('mapAdressPartners_Id');
			window.localStorage.removeItem('mapAdressId');
			window.localStorage.removeItem('mapAdressX');
			window.localStorage.removeItem('mapAdressY');
		}	
        
    }
	
	//随便一点检测是否在区域内
   /* map.on('click',function (e) {
        inClientView(e.lnglat);
    });*/


    //生成所有覆盖物
    for (var i in aAreaDatas) {


		//console.log(111111111111111111111111111111111111111111111)

        var polygonArr = [];

        for (var h = 0 ; h < aAreaDatas[i].paths.length; h++) {
            polygonArr.push([aAreaDatas[i].paths[h].lng, aAreaDatas[i].paths[h].lat]);
        }

        var myPolygon = new AMap.Polygon({ //通过json生成所有的覆盖物
            path: polygonArr,
            strokeColor:"black",
            fillColor:'red',
            fillOpacity:0.5,
            strokeWeight:1,
            strokeOpacity:0.5
        });



        myPolygon.id = aAreaDatas[i].id; //给每个覆盖物添加独立ID
        myPolygon.name = aAreaDatas[i].name; //给每个覆盖物添加片区名称
        myPolygon.sender = aAreaDatas[i].sender; ////给每个覆盖物添加派送员
        myPolygon.url = aAreaDatas[i].url; //给每个覆盖物添加网址
        myPolygon.tel = aAreaDatas[i].tel;//给每个覆盖物添加电话
		myPolygon.partners_id = aAreaDatas[i].partners_id;
        //加字段
        //-------------------------------------------------------

        var polygonEditor;
        var lastPolygon = myPolygon;
		
		//区域内检测
        myPolygon.on('click',function (e){
			
			//坐标点是否在区域内
            //inClientView(e.lnglat);

            if(lastPolygon!=this) {
                polygonEditor = new AMap.PolyEditor(map,this);
            }

            polygonEditor.close();

            lastPolygon = this;

            //inClientView(this,e.point);

        });

        myPolygon.on('dblclick',function (e){
            polygonEditor.open();
        });

        //hover tips
        myPolygon.on('mouseover',function (e) {

            var sName = this.name;
            var sSender = this.sender;
            var sUrl = this.url;
            var iTel = this.tel;
            //加字段
            //-------------------------------------------------------
            var iLeft = e.pixel.x;
            var iTop = e.pixel.y-$('#handtip').height()/2;
            $('#handtip').css({left:iLeft+'px',top:iTop+'px',fontSize:'12px'}).html('区域名称：'+sName+'  送件人：'+sSender+'  网址：<a href="'+sUrl+'" target="_blank">'+sUrl+'</a>   服务人电话：'+iTel).show();
        });
        //hover tips
        myPolygon.on('mouseout',function (e) {

            $('#handtip').hide();

        });

        aPolygon.push(myPolygon);
        myPolygon.setMap(map);//添加覆盖物到地图
    }
	
	//map.removeListen('moveend');
	map.on('moveend',function(){
		 $('#pickerInput').unbind('blur');
		 map.getCity(function(data){
			if (data['province'] && typeof data['province'] === 'string') {
				var city=data['city'] || data['province'];
				
				//通过地址检索片区
				//$('.adressInfor')  //#hehe
				//alert($('.adressInfor'))
				$('#pickerInput').blur(function () {
					var addrStr = city+$(this).val();
					var geocoder = new AMap.Geocoder();
					geocoder.getLocation(addrStr,function(status, result) {
						//console.log(result)
						if(isEmptyObject(result)){
							jalert('无法解析地址')
						}else{
							if (status === 'complete' && result.info === 'OK') {

								AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
									var positionPicker = new PositionPicker({
										mode: 'dragMap',
										map: map
									});
									positionPicker.on('success', function(positionResult) {
										//获取数据
										inClientView(positionResult.address,positionResult.position);
									});
									
									var onModeChange = function(e) {
										positionPicker.setMode(e.target.value)
									}
									AMap.event.addDomListener(document,'change', onModeChange)
									map.panBy(0, 1);
									positionPicker.start(result.geocodes[0].location);
									
								});
								
								
							}
						}
					});
				})
			}
		});	
	})

	function isEmptyObject(e) {  
		var t;  
		for (t in e)  
			return !1;  
		return !0  
	}  
	
	//------------------------计算大概位置------------------------------------------
	AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
	
		var poiPicker = new PoiPicker({
			//city:'北京',
			input: 'pickerInput'
		});
		//初始化poiPicker
		poiPickerReady(poiPicker);
	});
	
	
	
	function poiPickerReady(poiPicker) {
	
		window.poiPicker = poiPicker;
		
		//选取了某个POI
		//poiPicker.removeListener('poiPicked');
		poiPicker.on('poiPicked', function(poiResult) {
			
			var source = poiResult.source;
			var	poi = poiResult.item;
			var	info = {
				source: source,
				id: poi.id,
				name: poi.name,
				location: poi.location.toString(),
				address: poi.address
			};
			
			markerMy(poi.location);
			$("#pickerInput").val('');
		});
	}
	
	function markerMy(xy){
		AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
			var positionPicker = new PositionPicker({
				mode: 'dragMap',
				map: map
			});
			
			
			positionPicker.on('success', function(positionResult) {
				//console.log(positionResult.position)
				console.log(positionResult.address)
				//console.log('zhangchaojie')
				//获取数据
				inClientView(positionResult.address,positionResult.position);
			});
			
			var onModeChange = function(e) {
				positionPicker.setMode(e.target.value)
			}
			AMap.event.addDomListener(document,'change', onModeChange);
				
			positionPicker.start(xy);
			map.panBy(0, 1);
		});	
	}
	
	
	document.addEventListener("plusready", function() {
	    // 注册返回按键事件
	    plus.key.addEventListener('backbutton', function() {
	        // 事件处理
	        window.history.back();
	    }, false);
	});


