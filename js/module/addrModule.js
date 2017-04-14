var addrModule = {
	name : '商家地址页',
	dom : $('#addr'),
	init : function(){
		this.bindEvent();
	},
	bindEvent : function(){

	},
	store : function (name, info){
		if (info) {
			localStorage.setItem(name, JSON.stringify(info));
			return;
		} else {
			var str = localStorage.getItem(name);
			return str;
		}
	},
	getImg : function(response){
		if (response.image_path) { // 判断是否有图片
			/*  获取图片地址  */
			var _path = response.image_path;
			var img_path = "https://fuss10.elemecdn.com/" + _path.substring(0, 1) + "/" + _path.substring(1, 3) + "/" + _path.substring(3);
			if (_path.indexOf('jpeg') > 0) {
				img_path += ".jpeg?imageMogr/format/webp/";
			} else {
				img_path += ".png?imageMogr/format/webp/"
			}
			return img_path;
		} else {
			return "";
		}
	},
	enter : function(){
		this.dom.show();
	},
	leave : function(){
		this.dom.hide();
	}
}