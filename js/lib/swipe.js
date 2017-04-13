//移动端轮播图插件，支持所有机型
(function(){

    /*
     * Swipe 2.0
     *
     * Brad Birdsall
     * Copyright 2013, MIT License
     *
     */

    function Swipe(container, options) {

        "use strict";

        // utilities
        var noop = function() {}; // ç®€å•çš„æ— æ“ä½œåŠŸèƒ½
        var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // å¸è½½åŠŸèƒ½çš„æ‰§è¡Œ

        // æ£€æŸ¥æµè§ˆå™¨çš„åŠŸèƒ½
        var browser = {
            addEventListener: !!window.addEventListener,
            touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
            transitions: (function(temp) {
                var props = ['transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
                for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
                return false;
            })(document.createElement('swipe'))
        };

        // å¦‚æžœæ²¡æœ‰æ ¹å…ƒç´ é€€å‡º
        if (!container) return;
        var element = container.children[0];
        var slides, slidePos, width;
        options = options || {};
        var index = parseInt(options.startSlide, 10) || 0;
        var speed = options.speed || 300;
        var offset = 0;//åç§»é‡ï¼Œç™¾åˆ†æ¯”
        var zIndex = 1;
        options.continuous = options.continuous ? options.continuous : true;

        function setup() {
            // ç¼“å­˜çš„å¹»ç¯ç‰‡
            slides = element.children;

            //åˆ›å»ºä¸€ä¸ªæ•°ç»„æ¥å­˜å‚¨æ¯ä¸ªå¹»ç¯ç‰‡çš„å½“å‰ä½ç½®
            slidePos = new Array(slides.length);

            // ç¡®å®šæ¯ä¸ªå¹»ç¯ç‰‡çš„å®½åº¦
            width = container.getBoundingClientRect().width || container.offsetWidth;

            offset = width * offset;

            element.style.width = (slides.length * width) + 'px';

            // æ ˆå…ƒç´ 
            var pos = slides.length;
            while(pos--) {

                var slide = slides[pos];

                slide.style.width = width + 'px';
                slide.setAttribute('data-index', pos);

                if (browser.transitions) {
                    slide.style.left = (pos * -width) + 'px';
                    move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
                }

            }

            if (!browser.transitions) element.style.left = (index * -width) + 'px';

            container.style.visibility = 'visible';

            setTimeout(function(){
                events.end();
            },1000)

        }

        function prev() {

            if (index) slide(index-1);
            else if (options.continuous) slide(slides.length-1);

        }

        function next() {

            if (index < slides.length - 1) slide(index+1);
            else if (options.continuous) slide(0);

        }

        function slide(to, slideSpeed) {

            // å¦‚æžœå·²ç»æ»‘ä¸è¦æ±‚
            if (index == to) return;

            if (browser.transitions) {

                //console.log(to);
                var diff = Math.abs(index-to) - 1;
                var direction = Math.abs(index-to) / (index-to); // 1:right -1:left

                while (diff--) move((to > index ? to : index) - diff - 1, width * direction, 0);

                //console.log('slide',to);
                move(index, width * direction, slideSpeed || speed);
                move(to, 0, slideSpeed || speed);

            } else {

                animate(index * -width, to * -width, slideSpeed || speed);

            }

            index = to;

            offloadFn(options.callback && options.callback(index, slides[index]));

        }

        function move(index, dist, speed, zIndex) {

            translate(index, dist, speed, zIndex);
            slidePos[index] = dist;

        }

        function translate(index, dist, speed,zIndex) {


            var slide = slides[index];
            var style = slide && slide.style;

            if (!style) return;

            style.webkitTransitionDuration =
                style.MozTransitionDuration =
                    style.msTransitionDuration =
                        style.OTransitionDuration =
                            style.transitionDuration = speed + 'ms';
            style.zIndex= zIndex || 0;

            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform =
                style.MozTransform =
                    style.OTransform = 'translateX(' + dist + 'px)';

        }

        function animate(from, to, speed) {

            // å¦‚æžœä¸æ˜¯åŠ¨ç”»ï¼Œåªæ˜¯é‡æ–°å®šä½
            if (!speed) {

                element.style.left = to + 'px';
                return;

            }

            var start = +new Date;

            var timer = setInterval(function() {

                var timeElap = +new Date - start;

                if (timeElap > speed) {

                    element.style.left = to + 'px';

                    if (delay) begin();

                    options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                    clearInterval(timer);
                    return;

                }

                element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

            }, 4);

        }

        // å®‰è£…ç¨‹åºè‡ªåŠ¨å¹»ç¯ç‰‡
        var delay = options.auto || 0;
        var interval;

        function begin() {
            interval = setTimeout(next, delay);
        }

        function stop() {
            delay = 0;
            clearTimeout(interval);
        }


        // è®¾ç½®åˆå§‹å˜é‡
        var start = {};
        var delta = {};
        var isScrolling;

        // è®¾ç½®äº‹ä»¶æ•èŽ·
        var events = {

            handleEvent: function(event) {

                switch (event.type) {
                    case 'touchstart': this.start(event); break;
                    case 'touchmove': this.move(event); break;
                    case 'touchend': offloadFn(this.end(event)); break;
                    case 'webkitTransitionEnd':
                    case 'msTransitionEnd':
                    case 'oTransitionEnd':
                    case 'otransitionend':
                    case 'transitionend': offloadFn(this.transitionEnd(event)); break;
                    case 'resize': offloadFn(setup.call()); break;
                }

                if (options.stopPropagation) event.stopPropagation();

            },
            start: function(event) {

                var touches = event.touches[0];

                // æµ‹é‡çš„èµ·å§‹å€¼
                start = {

                    // å¾—åˆ°åˆå§‹çš„è§¦æ‘¸åæ ‡
                    x: touches.pageX,
                    y: touches.pageY,

                    // å­˜å‚¨æ—¶é—´ç¡®å®šæŽ¥è§¦æ—¶é—´
                    time: +new Date

                };

                // ç”¨äºŽæµ‹è¯•çš„ç¬¬ä¸€ç§»åŠ¨äº‹ä»¶
                isScrolling = undefined;

                // å¤ä½ä¸‰è§’æ´²å’Œæœ€åŽè®¡ç®—å€¼
                delta = {};

                // è®¾ç½®touchmoveå’Œtouchendç›‘å¬
                element.addEventListener('touchmove', this, false);
                element.addEventListener('touchend', this, false);

            },
            move: function(event) {

                // ç¡®ä¿ä¸€ä¸ªè§¦æ‘¸ä¸æåˆ·
                if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

                if (options.disableScroll) event.preventDefault();

                var touches = event.touches[0];

                // è®¡ç®—æ”¹å˜åŽçš„ x å’Œ y
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                }

                // ç¡®å®šæµ‹è¯•è¿è¡Œâ€”â€”ä¸€ä¸ªæ»šåŠ¨æ—¶é—´æµ‹è¯•
                if ( typeof isScrolling == 'undefined') {
                    isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
                }

                // å¦‚æžœç”¨æˆ·æ²¡æœ‰è¯•å›¾åž‚ç›´æ»šåŠ¨
                if (!isScrolling) {

                    // é˜²æ­¢æœ¬æœºæ»šåŠ¨
                    event.preventDefault();

                    // åœæ­¢å¹»ç¯ç‰‡æ˜¾ç¤º
                    stop();

                    // å¦‚æžœç¬¬ä¸€ä¸ªæˆ–æœ€åŽä¸€ä¸ªæ»‘åŠ¨é˜»åŠ›å¢žåŠ 
                    delta.x =
                        delta.x /
                        ( (!index && delta.x > 0               // if first slide and sliding left
                            || index == slides.length - 1        // or if last slide and sliding right
                            && delta.x < 0                       // and if sliding at all
                            ) ?
                            ( Math.abs(delta.x) / width + 1 )      // determine resistance level
                            : 1 );                                 // no resistance if false

                    // è½¬åŒ– 1:1
                    translate(index-1, delta.x + slidePos[index-1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index+1, delta.x + slidePos[index+1], 0);

                }

            },
            end: function(event) {

                // è®¡ç®—æŒç»­æ—¶é—´
                var duration = +new Date - start.time;

                // ç¡®å®šæ»‘åŠ¨å°è¯•è§¦å‘ä¸‹ä¸€ä¸ª/ä¸Šä¸€é¡µæ»‘åŠ¨
                var isValidSlide =
                    Number(duration) < 250               // if slide duration is less than 250ms
                    && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
                    || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

                // å¦‚æžœå°è¯•ç¡®å®šæ»‘è¿‡åŽ»çš„å¼€å§‹å’Œç»“æŸ
                var isPastBounds =
                    !index && delta.x > 0                            // å¦‚æžœç¬¬ä¸€ä¸ªå¹»ç¯ç‰‡å’Œå¹»ç¯ç‰‡AMTå¤§äºŽ0
                    || index == slides.length - 1 && delta.x < 0;    // æˆ–è€…å¦‚æžœæœ€åŽä¸€å¼ å¹»ç¯ç‰‡,å¹»ç¯ç‰‡amtå°äºŽ0

                // ç¡®å®šæ»‘åŠ¨æ–¹å‘(true:right, false:left)
                var direction = delta.x < 0;

                // å¦‚æžœä¸åž‚ç›´æ»šåŠ¨
                if (!isScrolling) {

                    if (isValidSlide && !isPastBounds) {

                        //console.log('index',index,slidePos,slidePos[index+1]-width,slides.length);
                        if (direction) {

                            move(index-1, -width, 0);
                            move(index, slidePos[index]-width + offset, speed, zIndex++);
                            //move(index+1, slidePos[index+1]-width, speed);
                            move(index+1, 0, speed);
                            if(index + 2 != slides.length){
                                move(index+2, width - offset, speed);
                            }
                            index += 1;

                        } else {

                            move(index+1, width, 0);
                            move(index, slidePos[index]+width - offset, speed,zIndex++);
                            //move(index-1, slidePos[index-1]+width, speed);
                            move(index-1, 0, speed);
                            move(index-2, - width + offset, speed,zIndex++);
                            index += -1;

                        }

                        options.callback && options.callback(index, slides[index]);

                    } else {

                        if(index == 0 ){
                            move(index+1, width - offset, speed);
                        }else if(index + 1 == slides.length){
                            move(index-1, -width + offset, speed,1);
                        }else{
                            move(index+1, width - offset, speed);
                            move(index-1, -width + offset, speed,1);
                        }

                        //move(index-1, -width, speed);
                        move(index, 0, speed);
                        //move(index+1, width, speed);

                    }

                }

                // å–æ¶ˆtouchmoveå’Œtouchendäº‹ä»¶ç›‘å¬å™¨,ç›´åˆ°touchstartå†æ¬¡è°ƒç”¨
                element.removeEventListener('touchmove', events, false)
                element.removeEventListener('touchend', events, false)

            },
            transitionEnd: function(event) {

                if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

                    if (delay) begin();

                    options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

                }

            }

        }

        // è§¦å‘è®¾ç½®
        setup();

        // å¦‚æžœé€‚ç”¨åˆ™å¼€å§‹è‡ªåŠ¨å¹»ç¯ç‰‡
        if (delay) begin();


        // æ·»åŠ äº‹ä»¶ç›‘å¬å™¨
        if (browser.addEventListener) {

            // è®¾ç½®touchstartäº‹ä»¶å…ƒç´ 
            if (browser.touch) element.addEventListener('touchstart', events, false);

            if (browser.transitions) {
                element.addEventListener('webkitTransitionEnd', events, false);
                element.addEventListener('msTransitionEnd', events, false);
                element.addEventListener('oTransitionEnd', events, false);
                element.addEventListener('otransitionend', events, false);
                element.addEventListener('transitionend', events, false);
            }

            //è®¾ç½®åœ¨çª—å£è°ƒæ•´å¤§å°äº‹ä»¶
            window.addEventListener('resize', events, false);

        } else {

            window.onresize = function () { setup() }; // to play nice with old IE

        }

        // å…¬å¼€Swipe API
        return {
            setup: function() {

                setup();

            },
            slide: function(to, speed) {

                slide(to, speed);

            },
            prev: function() {

                // cancel slideshow
                stop();

                prev();

            },
            next: function() {

                stop();

                next();

            },
            getPos: function() {

                // return current index position
                return index;

            },
            kill: function() {

                // å–æ¶ˆå¹»ç¯ç‰‡
                stop();

                // reset element
                element.style.width = 'auto';
                element.style.left = 0;

                // reset slides
                var pos = slides.length;
                while(pos--) {

                    var slide = slides[pos];
                    slide.style.width = '100%';
                    slide.style.left = 0;

                    if (browser.transitions) translate(pos, 0, 0);

                }

                // åˆ é™¤äº‹ä»¶ä¾¦å¬å™¨
                if (browser.addEventListener) {

                    // remove current event listeners
                    element.removeEventListener('touchstart', events, false);
                    element.removeEventListener('webkitTransitionEnd', events, false);
                    element.removeEventListener('msTransitionEnd', events, false);
                    element.removeEventListener('oTransitionEnd', events, false);
                    element.removeEventListener('otransitionend', events, false);
                    element.removeEventListener('transitionend', events, false);
                    window.removeEventListener('resize', events, false);

                }
                else {
                    window.onresize = null;

                }

            }
        }

    }
    window.Swipe = Swipe
})();


/*



var Event = {
  swipe : function(){
      Config.swipe && Config.swipe.kill && Config.swipe.kill();
      //得到对应小数点
      var bullets = document.getElementById('position').getElementsByTagName('li');
      Config.swipe = Swipe(document.getElementById('mySwipe'), {
          auto: 0,
          continuous: true,
          disableScroll:false,
          callback: function(pos) {
            console.log('滑动结束之后所执行回调函数');
              var i = bullets.length;
              while (i--) {
                  bullets[i].className = ' ';
              }
              bullets[pos].className = 'cur';
          }
      });

      setTimeout(function(){
        //控制小数点（轮播图下方的小数点）的改变
          var $position = document.querySelector('#position'),
              $swipeWrap = document.querySelector('.swipe-wrap'),
              screenHeight = window.innerHeight;
          $swipeWrap.style.height= '100%';
          $("#position").removeClass('hidden');
      },300)

  }
}
Event.swipe();  
<div class="swipe" id="mySwipe">
	<div class="swipe-wrap">
	    <div class="item" style="height:200px;background: blue">
	        第一个板块
	    </div>
	    <div class="item" style="height:200px;background: red">
	        第二个板块
	    </div>
	    <div class="item"  style="background: black;height: 200px">
	        <!-- 滑动的第三个版块 -->
	        
	    </div>
	</div>
	<ul id="position" class="hidden">
	    <li class="cur"></li>
	    <li style="margin-left:-5px"></li>
	    <li style="margin-left:-5px"></li>
	</ul>
</div>


.swipe{
    overflow: hidden;
    visibility: hidden;
    position:relative;
}
.swipe-wrap{
    overflow-x:hidden;
    position:relative;
}
.swipe-wrap > div {
    float: left;width: 100%;
    position:relative;
}
#position{
   position: absolute;
   bottom: 0rem;
   left: 0;
   .rem(margin-top, 20rem);
   .rem(margin-bottom, 10rem);
   margin: 0;
   opacity: 0.4;
   width: 100%;
   filter: alpha(opacity=50);
   text-align: center;
}
小数点布局 
#position li{
      width: 30px;
      height: 30px;
      margin: 0 8px;
      display: inline-block;
      -webkit-border-radius: 30px;
      border-radius: 5px;
      background-color: #CAC2C2;
}
#position li.cur{
    background-color: black;
}



<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>

ul.insertBefore(newdom, <li>2</li>)
*/