function resize(){
	var clientWidth = window.innerWidth || document.documentElement.clientWidth,
		html = document.getElementsByTagName('html')[0];
	html.style.fontSize = clientWidth / 3.75 + "px";
}
resize();
window.addEventListener("resize", resize);