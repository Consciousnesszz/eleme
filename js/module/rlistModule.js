var rlistModule = Object.create(addrModule);

rlistModule = $.extend(rlistModule, {
	name : '商家列表页',
	dom : $('#rlist'),
	lat : "",
	lnt : "",
	swipe : null,
	bindEvent : function(){
		//调用轮播图的初始化方法
		var li_list = $("#position li");
		this.swipe = Swipe(document.getElementById('mySwipe'), {
		  auto: false,
		  callback: function(pos) { 
		  	//pos当前滑动板块的索引值
		  	//当滑动结束后 所需要执行的方法
		  	li_list.eq(pos).addClass('cur');
		  	li_list.eq(pos).siblings().removeClass('cur');
		  }
		});

	},
	nearbyRes : function(geohash){
		var that = this;
		// 如果传递了定位
		if (geohash) {
			/*--------获取定位---------*/
			$.ajax({
				url : "https://mainsite-restapi.ele.me/v2/pois/" + geohash,
				type : "get",
				async : false,
				success : function (response){
					$(".loca-word").text(response.name);
					that.lat = response.latitude;
					that.lnt = response.longitude;
				}
			})

			/*--------获取轮播内容---------*/
			$.ajax({
				url : 'https://mainsite-restapi.ele.me/v2/index_entry?geohash=' + geohash,
				type : "get",
				success : function(response){
					for(var i = 0; i < response.length; i++) {
						var img_path = 'https://fuss10.elemecdn.com'+ response[i].image_url +'?imageMogr/format/webp/';
						var str = 
							'<div class="lump">'+
								'<img src="'+ img_path +'">'+
								'<p>'+ response[i].title +'</p>'+
							'</div>'
						if (i <= 7) {
							$(".page_1").append($(str));
						} else {
							$(".page_2").append($(str));
						}
					}
				}
			})
			/*--------获取热词---------*/ 
			$(".rl-header .bottom ul").empty();
			$.ajax({
				url : "https://mainsite-restapi.ele.me/shopping/v3/hot_search_words",
				// url : "shopping/v3/hot_search_words",
				data : {
					latitude : that.lat,
					longitude : that.lnt
				},
				success : function(response){
					var html = "";
					for (var i = 0; i < response.length; i++) {
						html += "<li><a href='#'>" + response[i].word + "</a></li>"
					}
					$(".rl-header .bottom ul").html(html);
				}
			})

			/*--------获取天气---------*/
			$(".temp").empty();
			$(".dis").empty();
			$.ajax({
				url : "https://mainsite-restapi.ele.me/bgs/weather/current",
				// url : "/bgs/weather/current",
				data : {
					latitude : that.lat,
					longitude : that.lnt
				},
				success : function(response){
					$(".temp").text(response.temperature + "°");
					$(".dis").text(response.description);
				}
			})

			/*--------获取商家---------*/
			$.ajax({
				url : "https://mainsite-restapi.ele.me/shopping/restaurants",
				// url : "/shopping/restaurants",
				data : {
					latitude : that.lat,
					longitude : that.lnt,
					offset : 0,
					limit : 20,
					extras : ['activities'],
					terminal : 'h5'
				},
				success : function(response){
					var str = "<h3 class='rec-r'>推荐商家</h3>";
					for (var i = 0; i < response.length; i++){
						str += that.loadContent(response[i]);
					}
					$(".res-wrap").html(str);
				},
				error : function(){
					$(".loading").text('服务器给你提了一个问题');
				}
			})

			/*--------按需加载---------*/
			var count = 0,
				offTimer = null,
				str = "";
			$(".rl-wrap").on("scroll", function(e){
				e = e || event;
				var _height = $(".main-rl").height() - $(".rl-wrap").height() + $(".rl-header").height() + $(".main-section").height();
				if ($(".rl-wrap").scrollTop() > _height) {
					// 提示信息
					$(".rl-main").addClass("more");
					clearTimeout(offTimer);
					offTimer = setTimeout(function(){
						// 计算 offset 值
						count++;
						// 动态加载
						$.ajax({
							url : "https://mainsite-restapi.ele.me/shopping/restaurants",
							// url : "/shopping/restaurants",
							data : {
								latitude : that.lat,
								longitude : that.lnt,
								offset : 20 * count,
								limit : 20,
								extras : ['activities'],
								terminal : 'h5'
							},
							success : function(response){
								if (response.length === 0) {
									// 提示信息
									$(".rl-main").removeClass("more");
									$(".rl-main").addClass("no-more");
								} else {
									var str = "";
									for (var i = 0; i < response.length; i++){
										str += that.loadContent(response[i]);
									}
									$('.res-wrap').append($(str));
								}
							}
						})
					},500);
					
				}
				
			})
		} else {
			$(".loading").text("请先定位哟");
		}
	},
	loadContent : function (response){
		var str = "";
		// 获取图片
		var img_path = this.getImg(response);
		/*  拼接html结构  */
		str += '<a href="#detail-' + response.id + '"><dl class="restaurant">'+
			'<dt class="res-img">'+
				'<img src="'+ img_path +'">'+
			'</dt>'+
			'<dd class="res-dis">'+
				'<div class="dis-top">';

				// 店名  是否是品牌
				if (!response.is_premium) {
					str += '<h4 class="res-title no-brand">'+ response.name +'</h4>'; 
				} else {
					str += '<h4 class="res-title">'+ response.name +'</h4>';
				}
				
				// 保 票 准
				str +=	'<div class="top-tag">';
				if (response.supports) {
					for (var j = 0; j < response.supports.length; j++){
						if (response.supports[j].icon_name === "保") {
							str += '<i class="tags sure">保</i>'
						} else if (response.supports[j].icon_name === "票") {
							str += '<i class="tags ticket">票</i>'
						} else if (response.supports[j].icon_name === "准") {
							str += '<i class="tags exact">准</i>'
						}
					}
				}
				// 评分 月售
				str = str + '</div>'+
				'</div>'+
				'<div class="dis-center">'+
					'<p class="res-info"><span>' + response.rating + '</span>月售'+response.recent_order_num+'单</p>';
				// 蜂鸟专送
				if (response.delivery_mode) {
					str += '<div class="center-tag">'+
						'<span class="ontime">准时达</span>'+
						'<span class="feeder">蜂鸟专送</span>'+
					'</div>'
				}
				
				// 距离 价格
				str += '</div>'+
				'<div class="dis-bottom">'+
					'<p class="res-price">￥<span class="r-begin">'+response.float_minimum_order_amount+'</span>起送 / 配送费￥<span class="r-add">'+response.float_delivery_fee+'</span></p>'+
					'<div class="bottom-tag"><span class="r-distance">'+(response.distance / 1000).toFixed(2)+'km</span> / <span class="r-time">'+response.order_lead_time+'分钟</span></div>'+
				'</div>'+
			'</dd>'+
		'</dl></a>';
		return str;
	},
	unbindEvent : function (){
		$(this).unbind();
		this.swipe = null;
	}
})