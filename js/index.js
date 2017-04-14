/*function init(){
	var hash = location.hash || "#a";
	var dom = $(hash);
	dom.show();
	dom.siblings().hide();
}
init();
window.onhashchange = init;*/


 // 创建module映射
var hashModuleMap = {
	'addr' : addrModule,
	'detail' : detailModule,
	'rlist' : rlistModule,
	'search' : searchModule
}

var prevModule, currentModule;
var catchModule = {};
var moduleCtrl = function(){
	var hash = location.hash.slice(1) || 'rlist'; // 获取hash
		
	var module = null;

	if (hashModuleMap[hash]) {
		module = hashModuleMap[hash]; // 获取module
	} else {
		// 获取传送的坐标
		var arr = hash.split("-");
		var moduleName = arr[0];
		module = hashModuleMap[moduleName];
		var info = arr[1]; // geohash / shopId
	}
	// 记录module
	prevModule = currentModule;
	currentModule = module;

	if (prevModule) {
		prevModule.leave();  // 前一个leave
	}

	module.enter(); // 当前enter

	if (!catchModule[moduleName]) {  // 进行判断只绑定一次事件
		module.init(); // 初始化
		catchModule[moduleName] = true;
	}
	if (module.nearbyRes) {
		module.nearbyRes(info);
	}
	if (module.shopInfo) {
		module.shopInfo(info);
	}
}

moduleCtrl(); // 初始化

window.onhashchange = moduleCtrl; // 监听hash变化

