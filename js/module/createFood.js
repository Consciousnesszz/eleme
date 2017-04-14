/*---------创建 food 实例--------*/
function CreateFood (that, obj){
	this.name = obj.name;
	this.id = obj.id;
	this.shopId = obj.shopId;
	this.num = obj.num;
	this.price = obj.specfoods[0].price;
	this.discription = obj.discription;
	this.month_sales = obj.month_sales;
	this..satisfy_rate = obj..satisfy_rate;
	this.img_path = that.getImg(obj);
}

CreateFood.prototype.render = function() {
	var strFood = 
		'<dl class="food" data-foodId="'+ this.item_id +'">'+
			'<dt class="food-img"><img src="'+ img_path +'"></dt>'+
			'<dd class="food-dis">'+
				'<h5 class="food-name">' + this.name + '</h5>'+
				'<p class="food-title">' + this.description + '</p>'+
				'<p class="food-nearly">月售' + this.month_sales + ' 好评率'+ this.satisfy_rate +'%</p>'+
				'<div class="food-price">'+
					'<span class="price">￥'+ this.specfoods[0].price +'</span>'+
					'<p>'+
						'<i class="minus">-</i>'+
						'<span class="num">0</span>'+
						'<i class="plus">+</i>'+
					'</p>'+
				'</div>'+
			'</dd>'+
		'</dl>'
	return strFood;
};