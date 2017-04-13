var detailModule = Object.create(addrModule);

detailModule = $.extend(detailModule, {
	name : '食物详情页',
	dom : $('#detail'),
	shopInfo : function(shopId) {
		this.loadHeader(shopId);
		this.loadFood(shopId);
	},
	loadHeader : function(shopId){
		$.ajax({
			url : "https://mainsite-restapi.ele.me/shopping/restaurant/" + shopId,
			type : "get",
			data : {
				extras: ['activities', 'album', 'license', 'identification', 'statistics']
			},
			success : function(response){
				console.log(response);
				/*  获取图片地址  */
				var _path = response.image_path;
				var img_path = "https://fuss10.elemecdn.com/" + _path.substring(0, 1) + "/" + _path.substring(1, 3) + "/" + _path.substring(3);
				if (_path.indexOf('jpeg') > 0) {
					img_path += ".jpeg?imageMogr/format/webp/";
				} else {
					img_path += ".png?imageMogr/format/webp/"
				}
				str = 
						'<div class="s-t-top"><i class="icon-arrow"></i></div>'+
						'<div class="s-t-center">'+
							'<dl class="shop-name">'+
								'<dt class="shop-img"><img src="'+ img_path +'"></dt>'+
								'<dd class="shop-dis">'+
									'<ul>'+
										'<li><h3>'+ response.name +'</h3></li><li>';
										if (response.delivery_mode) {
											str += '蜂鸟转送 / '+ response.order_lead_time +'分钟送达 / '+ response.piecewise_agent_fee.tips;
										} else {
											str += '商家配送 / '+ response.order_lead_time +'分钟送达 / '+ response.piecewise_agent_fee.tips;
										}
										
										if (response.promotion_info) {
											str += '</li><li>公告：'+ response.promotion_info +'</li>';
										} else {
											str += '</li><li>公告：欢迎光临，用餐高峰期请提前下单，谢谢。</li>';
										}
										str += '<li class="go-shop-detail"></li>'+
									'</ul>'+
								'</dd>'+
							'</dl>'+
						'</div>'+
						'<div class="s-t-bottom">'+
							'<div>';
							if (response.activities[0].icon_name === '新') {
								str += '<i class="new">新</i>';
							} else {
								str += '<i class="cut">减</i>'
							}
							str += '<span>'+ response.activities[0].description +'</span>'+
							'</div>'+
							'<div>'+ response.activities.length +'个活动</div>'+
						'</div>';
				$(".shop-title").html(str);
			},
			error : function (){
				console.log("fail")
			}
		})
	},
	loadFood : function (shopId){
		$.ajax({
			url : "https://mainsite-restapi.ele.me/shopping/v2/menu?restaurant_id=" + shopId,
			type : "get",
			success : function(response){
				console.log(response);
			},
			error : function (){
				console.log("fail")
			}
		})
	}
})