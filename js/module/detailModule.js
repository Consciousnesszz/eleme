var detailModule = Object.create(addrModule);

detailModule = $.extend(detailModule, {
	name : '食物详情页',
	dom : $('#detail'),
	bindEvent : function(){

	},
	foods : {
		// 用于缓存页面食物信息
	},
	CreateFood : function(that, obj){
		/*---------创建 food 实例--------*/
		function CreateFood (){
			this.name = obj.name;
			this.id = obj.item_id;
			this.shopId = obj.restaurant_id;
			this.num = obj.num || 0;
			this.price = obj.specfoods[0].price;
			this.description = obj.description;
			this.month_sales = obj.month_sales;
			this.satisfy_rate = obj.satisfy_rate;
			this.img_path = that.getImg(obj);
		};

		CreateFood.prototype.render = function() {
			var strFood = 
				'<dl class="food" data-foodId="'+ this.id +'">'+
					'<dt class="food-img"><img src="'+ this.img_path +'"></dt>'+
					'<dd class="food-dis">'+
						'<h5 class="food-name">' + this.name + '</h5>'+
						'<p class="food-title">' + this.description + '</p>'+
						'<p class="food-nearly">月售' + this.month_sales + ' 好评率'+ this.satisfy_rate +'%</p>'+
						'<div class="food-price">'+
							'<span class="price">￥'+ this.price +'</span>'+
							'<p>'+
								'<i class="foods-minus">-</i>'+
								'<span class="foods-num">'+ this.num +'</span>'+
								'<i class="foods-plus">+</i>'+
							'</p>'+
						'</div>'+
					'</dd>'+
				'</dl>'
			return strFood;
		};

		CreateFood.prototype.plus = function(){
			this.num++;
		};

		CreateFood.prototype.minus = function(){
			if (this.num > 0) {
				this.num--;
			}
		}

		return new CreateFood();
	},
	showCart : function(obj) {
		console.log(obj);
		var str = 
			'<li data-foodId="'+ obj.id +'">'+
				'<div class="cart-food-left">'+
					'<h5>'+ obj.name +'</h5>';
			if (obj.type) {
				str += '<p>'+ obj.type + '</p>';
			}
			str += 
				'</div>'+
				'<div class="cart-food-right">'+
					'<div>'+
						'<span class="count-all">￥' + obj.price * obj.num + '</span>'+
					'</div>'+
					'<div class="oprate">'+
						'<i class="foods-minus">-</i>'+
						'<span class="foods-num">' + obj.num + '</span>'+
						'<i class="foods-plus">+</i>'+
					'</div>'+
				'</div>'+
			'</li>';
		if ($(".show-content [data-foodId='"+ obj.id +"']").length > 0) {
			$(".show-content [data-foodId='"+ obj.id +"']").find(".foods-num").text(obj.num);
			$(".show-content [data-foodId='"+ obj.id +"']").find(".count-all").text("￥" + obj.num * obj.price);
		}else {
			console.log('b');
			$(".show-content ul").append($(str));
		}
	},
	shopInfo : function(shopId) {
		this.loadHeader(shopId);
		this.loadFood(shopId);
	},
	loadHeader : function(shopId){
		var that = this;
		$.ajax({
			url : "https://mainsite-restapi.ele.me/shopping/restaurant/" + shopId,
			type : "get",
			data : {
				extras: ['activities', 'album', 'license', 'identification', 'statistics']
			},
			success : function(response){
				
				//  获取图片地址 
				var img_path = that.getImg(response);
				str = 
						'<div class="s-t-top"><i class="icon-arrow" id="back"></i></div>'+
						'<div class="s-t-center">'+
							'<dl class="shop-name">'+
								'<dt class="shop-img"><img src="'+ img_path +'"></dt>'+
								'<dd class="shop-dis">'+
									'<ul>'+
										'<li><h3>'+ response.name +'</h3></li><li>';
										if (response.delivery_mode) {
											str += '蜂鸟专送 / '+ response.order_lead_time +'分钟送达 / '+ response.piecewise_agent_fee.tips;
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
				$("#back").click(function (){
					window.history.back();
				});
			},
			error : function (){
				console.log("fail")
			}
		})
	},
	loadFood : function (shopId){
		var that = this;
		$.ajax({
			url : "https://mainsite-restapi.ele.me/shopping/v2/menu?restaurant_id=" + shopId,
			type : "get",
			success : function(response){
				console.log(response);
				var strNav = '', strFood = '';
				for (var i = 0; i < response.length; i++) {
					strNav += "<li>"+ response[i].name +"</li>"
					strFood += '<div class="food-item">'+
								'<h4 data-title="'+ response[i].name +'">'+ response[i].name +'<span class="s-r-dis">'+ response[i].description +'</span></h4>';
					for (var j = 0; j < response[i].foods.length; j++) {
						var curObj = that.CreateFood(that, response[i].foods[j]);
						that.foods[curObj.id] = curObj;
						strFood += curObj.render();
					}
					strFood += '</div>'
				}
				$(".food-nav").html(strNav);
				$(".food-wrap").html(strFood);
				//如果Iscroll已经实例过了，让它直接毁灭
				if(typeof leftScroll !== 'undefined' || typeof rightSrcoll !== 'undefined') {
					leftScroll.destroy();
					rightSrcoll.destroy();
				}
				// 绑定滚动条
				window.leftScroll = new IScroll('.smain-left', {
							scrollbars : true
						});
				window.rightScroll = new IScroll('.smain-right', {
					scrollbars : true,
					probeType : 2  // 1, 2, 3
				});
				
				// left 点击交互
				$(".food-nav li").eq(0).addClass("active");
				$(".food-nav").click(function(e){
					e = e || event;
					if (e.target.tagName === "LI") {
						$(e.target).addClass("active");
						$(e.target).siblings().removeClass('active');
						var dom = $('[data-title="'+$(e.target).text()+'"]').get(0);
						rightScroll.scrollToElement(dom, 700);
					}
				})

				// right 滚动交互
				var foodItems =  $(".food-item"),
					sum = 0,
					heightCount = [];
				for (var i = 0; i < foodItems.length; i++) {
					sum += foodItems.eq(i).height();
					heightCount.push(sum);
				};
				var scrollTimer = null;
				rightScroll.on("scroll", function(){
					clearTimeout(scrollTimer);
					scrollTimer = setTimeout(function(){
						for (var i = 0; i < heightCount.length; i++){
							if (-rightScroll.y < heightCount[i]) {
								$('.food-nav li').eq(i).addClass("active");
								$('.food-nav li').eq(i).siblings().removeClass('active');
								break;
							}
						}
					}, 100)
				})

				// 购物车点击交互
				var isShow = false;
				$(".cart-img").click(function(){
					isShow ? $(".show-cart-foods").hide() : $(".show-cart-foods").show();
					isShow = !isShow;
				})
				/*$(".show-cart-foods").click(function(){
					$(".show-cart-foods").hide()
				});*/

				// 食物加减
				$('.foods-plus').click(function(){
					//通过事件代理 绑定加法事件;
					var dom = $(this).closest('.food');
					var foodId = dom.data('foodid');
					var curObj = that.foods[foodId]

					// 改变数量
					curObj.plus();
					$("[data-foodid='"+ foodId +"']").find(".foods-num").text(curObj.num);
					// 显示数量和减法按钮
					$("[data-foodid='"+ foodId +"']").find(".foods-num").css("visibility", "visible");
					$("[data-foodid='"+ foodId +"']").find(".foods-minus").css("visibility", "visible");
						
					// 创建购物车元素
					that.showCart(curObj);
				});
				$(".foods-minus").click(function(){
					
					var dom = $(this).closest('.food');
					var foodId = dom.data('foodid');
					var curObj = that.foods[foodId]

					// 改变数量
					curObj.minus();
					$("[data-foodid='"+ foodId +"']").find(".foods-num").text(curObj.num);
					// 数量为 0 隐藏 数量、减法按钮 移除购物车节点
					if (curObj.num == 0) {
						dom.find(".foods-num").css("visibility", "hidden");
						dom.find(".foods-minus").css("visibility", "hidden");
						$(".show-content [data-foodId='"+ curObj.id +"']").remove();
						return;
					}
					// 修改购物车元素
					that.showCart(curObj);
				})
			},
			error : function (){
				console.log("fail")
			}
		})
	}
})