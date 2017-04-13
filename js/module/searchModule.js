var searchModule = Object.create(addrModule);

searchModule = $.extend(searchModule, {
	name : '商家搜索页',
	dom : $('#search'),
	bindEvent : function(){
		var timer = null;
		$("#searchInp").on("input", function(){
			var keyword = $(this).val();
			if (keyword !== "") {
				// 清除按键显示
				$(".header span").show();
				// 防高频操作
				clearTimeout(timer);
				timer = setTimeout(function(){
					searchModule.search(keyword);
				},300);
			}
		});

		// 清除按键绑定事件
		$(".header span").click(function(){
			$("#searchInp").val("");
			$(".header span").hide();
			clearTimeout(timer);
		})
	},
	search : function(keyword){
		/* 利用反向代理实现跨域请求
		var infoAddr = '/mobile/waimai?qt=shopsearch&address=%E7%A7%91%E5%8D%8E%E5%8C%97%E8%B7%AF&lat=3562771.95&lng=11586619.01&wd=%E7%A7%91%E5%8D%8E&display=json'*/
		
		// 利用CORS实现跨域请求
		var infoAddr = "https://mainsite-restapi.ele.me/bgs/poi/search_poi_nearby?keyword=" + keyword;
		$.getJSON(infoAddr, function(response){
			/* 处理百度外卖返回信息
			var data = response.result.shop_info;
			var html = "";
			for (var i = 0; i < data.length; i++) {
				html += '<div class="searchInfo"><h4>' + data[i].shop_name + '</h4></div>';
			}*/
			var html = "";
			for(var i = 0, len = response.length; i < len; i++){
				html += '<div class="searchInfo"><a href="#rlist-' + response[i].geohash + '"><h4>' + response[i].name + '</h4><p>' + response[i].address + '</p></a></div>'
			}
			$(".search-info-wrap").html(html);
		})
	},
	enter : function(){
		// 初始化界面
		this.dom.show();
		$("#searchInp").val("");
		$(".header span").hide();

		// 滑动效果
		var width = this.dom.width();
		var that = this;
		var timer = setInterval(function(){
			var left = parseInt(that.dom.css("left"));
			if (left > 10) {
				left -= width / (300 / (1000/60));
				that.dom.css("left", left);
			}else {
				that.dom.css("left", 0);
				clearInterval(timer);
			}
		},1000/60);
	},
	leave : function(){
		// 滑动效果
		var width = this.dom.width();
		var that = this;
		var timer = setInterval(function(){
			var left = parseInt(that.dom.css("left"));
			if (left < width - 10) {
				left += width / (300 / (1000/60));
				that.dom.css("left", left);
			}else {
				that.dom.css("left", width + 10 + "px");
				clearInterval(timer);
				that.dom.hide();
			}
		},1000/60);
	}
})