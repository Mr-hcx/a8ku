/**
 +-------------------------------------------------------------------
 * jQuery FontScroll - 文字行向上滚动插件 - http://java2.sinaapp.com
 +-------------------------------------------------------------------
 * @version    1.0.0 beta
 * @since      2014.06.12
 * @author     kongzhim <kongzhim@163.com> <http://java2.sinaapp.com>
 * @github     http://git.oschina.net/kzm/FontScroll
 +-------------------------------------------------------------------
 */

(function($) {
    $.fn.FontScroll = function(options) {
        var d = { time: 3000, s: 'fontColor', num: 1 }
        var o = $.extend(d, options);


        this.children('ul').addClass('line');
        var _con = $('.line').eq(0);
        var _conH = _con.height(); //滚动总高度
        var _conChildH = _con.children().eq(0).height(); //一次滚动高度
        var _temp = _conChildH; //临时变量
        var _time = d.time; //滚动间隔
        var _s = d.s; //滚动间隔


        _con.clone().insertAfter(_con); //初始化克隆

        //样式控制
        var num = d.num;
        var _p = this.find('li');
        var allNum = _p.length;

        _p.eq(num).addClass(_s);


        var timeID = setInterval(Up, _time);
        this.hover(function() { clearInterval(timeID) }, function() { timeID = setInterval(Up, _time); });

        function Up() {
            _con.animate({ marginTop: '-' + _conChildH });
            //样式控制
            _p.removeClass(_s);
            num += 1;
            _p.eq(num).addClass(_s);

            if (_conH == _conChildH) {
                _con.animate({ marginTop: '-' + _conChildH }, "normal", over);
            } else {
                _conChildH += _temp;
            }
        }

        function over() {
            _con.attr("style", 'margin-top:0');
            _conChildH = _temp;
            num = 1;
            _p.removeClass(_s);
            _p.eq(num).addClass(_s);
        }
    }
})(jQuery);


$(function() {
    $('.announce-wrap').FontScroll({ time: 5000, num: 1 });
});

/**
 +-------------------------------------------------------------------
 * jQuery 
 +-------------------------------------------------------------------
 * @version    1.0.0 banner
 * @since      2020.01.12
 * @author     A8资源库www.a8ku.cn
 * @github     www.a8ku.cn
 +-------------------------------------------------------------------
 */
jQuery(document).ready(function () {
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'horizontal', // 垂直切换选项
    loop: true, // 循环模式选项
    autoplay: true,

    // 如果需要分页器
    pagination: {
      el: '.swiper-pagination',
    },

    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // 如果需要滚动条
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  })
})

/***
	@name:触屏事件
	@param {string} element dom元素
			 {function} fn 事件触发函数
***/
function v_on(obj,ev,fn) {
	if(obj.attachEvent) {
		obj.attachEvent("on" + ev,fn);
	} else {
		obj.addEventListener(ev,fn,false);
	}
}
var touchEvent={
	/*单次触摸事件*/
	tap:function(element,fn){
		var startTx, startTy;
		v_on(element,'touchstart',function(e){
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
		}, false );

		v_on(element,'touchend',function(e){
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY;
			// 在部分设备上 touch 事件比较灵敏，导致按下和松开手指时的事件坐标会出现一点点变化
			if( Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 ){
			fn();
			}
		}, false );
	},

	/*两次触摸事件*/
	doubleTap:function(element,fn){
		var isTouchEnd = false,
		lastTime = 0,
		lastTx = null,
		lastTy = null,
		firstTouchEnd = true,
		body = document.body,
		dTapTimer, startTx, startTy, startTime;
		v_on(element, 'touchstart', function(e){
			if( dTapTimer ){
			clearTimeout( dTapTimer );
			dTapTimer = null;
			}
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
		}, false );
		v_on(element, 'touchend',function(e){
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			now = Date.now(),
			duration = now - lastTime;
			// 首先要确保能触发单次的 tap 事件
			if( Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6 ){
			// 两次 tap 的间隔确保在 500 毫秒以内
			if(duration < 301 ){
				// 本次的 tap 位置和上一次的 tap 的位置允许一定范围内的误差
				if( lastTx !== null &&
				Math.abs(lastTx - endTx) < 45 &&
				Math.abs(lastTy - endTy) < 45 ){
					firstTouchEnd = true;
					lastTx = lastTy = null;
					fn();
				}
				}
				else{
				lastTx = endTx;
				lastTy = endTy;
				}
			}
			else{
				firstTouchEnd = true;
				lastTx = lastTy = null;
			}
			lastTime = now;
			}, false );
			// 在 iOS 的 safari 上手指敲击屏幕的速度过快，
			// 有一定的几率会导致第二次不会响应 touchstart 和 touchend 事件
			// 同时手指长时间的touch不会触发click
			if(~navigator.userAgent.toLowerCase().indexOf('iphone os')){
			v_on(body, 'touchstart', function(e){
				startTime = Date.now();
			}, true );
			v_on(body, 'touchend', function(e){
				var noLongTap = Date.now() - startTime < 501;
				if(firstTouchEnd ){
				firstTouchEnd = false;
				if( noLongTap && e.target === element ){
					dTapTimer = setTimeout(function(){
					firstTouchEnd = true;
					lastTx = lastTy = null;
					fn();
					},400);
				}
				}
				else{
				firstTouchEnd = true;
				}
			}, true );
			// iOS 上手指多次敲击屏幕时的速度过快不会触发 click 事件
			v_on(element, 'click', function( e ){
				if(dTapTimer ){
				clearTimeout( dTapTimer );
				dTapTimer = null;
				firstTouchEnd = true;
				}
			}, false );
		}
	},

	/*长按事件*/
	longTap:function(element,fn){
		var startTx, startTy, lTapTimer;
		v_on(element, 'touchstart', function( e ){
			if( lTapTimer ){
			clearTimeout( lTapTimer );
			lTapTimer = null;
			}
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
			lTapTimer = setTimeout(function(){
			fn();
			}, 1000 );
			//e.preventDefault();
		}, false );
		v_on(element, 'touchmove', function( e ){
			var touches = e.touches[0],
			endTx = touches.clientX,
			endTy = touches.clientY;
			if( lTapTimer && (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5) ){
			clearTimeout( lTapTimer );
			lTapTimer = null;
			}
		}, false );
		v_on(element, 'touchend', function( e ){
			if( lTapTimer ){
			clearTimeout( lTapTimer );
			lTapTimer = null;
			}
		}, false );
	},

	/*滑屏事件*/
	swipe:function(element,fn){
		var isTouchMove, startTx, startTy;
		v_on(element, 'touchstart', function( e ){
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
			isTouchMove = false;
		}, false );
		v_on(element, 'touchmove', function( e ){
			isTouchMove = true;
			e.preventDefault();
		}, false );
		v_on(element, 'touchend', function( e ){
			if( !isTouchMove ){
			return;
			}
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			distanceX = startTx - endTx
			distanceY = startTy - endTy,
			isSwipe = false;
			if( Math.abs(distanceX)>20||Math.abs(distanceY)>20 ){
			fn();
			}
		}, false );
	},

	/*向上滑动事件*/
	swipeUp:function(element,fn){
		var isTouchMove, startTx, startTy;
		v_on(element, 'touchstart', function( e ){
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
			isTouchMove = false;
		}, false );
		v_on(element, 'touchmove', function( e ){
			isTouchMove = true;
			e.preventDefault();
		}, false );
		v_on(element, 'touchend', function( e ){
			if( !isTouchMove ){
			return;
			}
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			distanceX = startTx - endTx
			distanceY = startTy - endTy,
			isSwipe = false;
			if( Math.abs(distanceX) < Math.abs(distanceY) ){
				if( distanceY > 20 ){
					fn();
					isSwipe = true;
				}
			}
		}, false );
	},

	/*向下滑动事件*/
	swipeDown:function(element,fn){
		var isTouchMove, startTx, startTy;
		v_on(element, 'touchstart', function( e ){
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
			isTouchMove = false;
		}, false );
		v_on(element, 'touchmove', function( e ){
			isTouchMove = true;
			//e.preventDefault();
		}, false );
		v_on(element, 'touchend', function( e ){
			if( !isTouchMove ){
			return;
			}
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			distanceX = startTx - endTx
			distanceY = startTy - endTy,
			isSwipe = false;
			if( Math.abs(distanceX) < Math.abs(distanceY) ){
				if( distanceY < -20  ){
					fn();
					isSwipe = true;
				}
			}
		}, false );
	},

	/*向左滑动事件*/
	swipeLeft:function(element,fn){
		var isTouchMove, startTx, startTy;
		v_on(element, 'touchstart', function( e ){
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
			isTouchMove = false;
		}, false );
		v_on(element, 'touchmove', function( e ){
			isTouchMove = true;
			e.preventDefault();
		}, false );
		v_on(element, 'touchend', function( e ){
			if( !isTouchMove ){
			return;
			}
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			distanceX = startTx - endTx
			distanceY = startTy - endTy,
			isSwipe = false;
			if( Math.abs(distanceX) >= Math.abs(distanceY) ){
				if( distanceX > 20  ){
					fn();
					isSwipe = true;
				}
			}
		}, false );
	},

	/*向右滑动事件*/
	swipeRight:function(element,fn){
		var isTouchMove, startTx, startTy;
		v_on(element, 'touchstart', function( e ){
			var touches = e.touches[0];
			startTx = touches.clientX;
			startTy = touches.clientY;
			isTouchMove = false;
		}, false );
		v_on(element, 'touchmove', function( e ){
			isTouchMove = true;
			e.preventDefault();
		}, false );
		v_on(element, 'touchend', function( e ){
			if( !isTouchMove ){
			return;
			}
			var touches = e.changedTouches[0],
			endTx = touches.clientX,
			endTy = touches.clientY,
			distanceX = startTx - endTx
			distanceY = startTy - endTy,
			isSwipe = false;
			if( Math.abs(distanceX) >= Math.abs(distanceY) ){
				if( distanceX < -20  ){
					fn();
					isSwipe = true;
				}
			}
		}, false );
	}
}

jQuery.fn.extend({
	tap:function (fn) {
		return touchEvent.tap(jQuery(this)[0],fn);
	},
	doubleTap:function (fn) {
		return touchEvent.doubleTap(jQuery(this)[0],fn);
	},
	longTap:function (fn) {
		return touchEvent.longTap(jQuery(this)[0],fn);
	},
	swipe:function (fn) {
		return touchEvent.swipe(jQuery(this)[0],fn);
	},
	swipeLeft:function (fn) {
		return touchEvent.swipeLeft(jQuery(this)[0],fn);
	},
	swipeRight:function (fn) {
		return touchEvent.swipeRight(jQuery(this)[0],fn);
	},
	swipeUp:function (fn) {
		return touchEvent.swipeUp(jQuery(this)[0],fn);
	},
	swipeDown:function (fn) {
		return touchEvent.swipeDown(jQuery(this)[0],fn);
	}
});

/***
	@name:点击滚动事件
			 {function} fn 事件触发函数
***/
!function(l) {
    l(".scroll-h").each(function() {
        var t = l(this),
        e = t.children("ul");
        if (! (e.length < 2)) {
            var n = 0,
            r = e.length,
            o = t.parent().siblings(".hf-widget-title").children(".pages"); !
            function c() {
                0 < o.length || (t.parent().siblings(".hf-widget-title").append('<div class="pages"><i class="prev"> <i class="icon-left"></i> </i><i class="next"> <i class="icon-right"></i> </i></div>'), o = t.parent().siblings(".hf-widget-title").children(".pages"))
            } ();
            var i = o.children(".prev"),
            a = o.children(".next");
            i.on("click",
            function() { !
                function t() {--n < 0 && (n = r - 1)
                } (),
                s()
            }),
            a.on("click",
            function() { !
                function t() {
                    r <= ++n && (n = 0)
                } (),
                s()
            }),
            touchEvent.swipeLeft(this,
            function() {
                a.trigger("click")
            }),
            touchEvent.swipeRight(this,
            function() {
                i.trigger("click")
            })
        }
        function s() {
            e.addClass("holdon"),
            e.removeClass("holdon-prev"),
            e.eq(n).removeClass("holdon"),
            e.eq(n - 1).addClass("holdon-prev")
        }
    })
} (jQuery);

/**首页最新TABS*/
jQuery(document).ready(function($){
$('.ct h3 span').click(function(){
$(this).addClass("selected").siblings().removeClass();

  $('.ct > ul').eq($(this).index()).addClass('show');
 $('.ct > ul').eq($(this).index()).siblings().removeClass('show');
 this.style.cursor = 'default';
});
 $("pre > code").addClass("language-php");
});



/*隐藏侧边JS代码*/
jQuery(document).ready(function($) {
        $('.close-sidebar').click(function() {
            $('.close-sidebar,.sidebar-column').hide();
            $('.show-sidebar').show();
            $('.article-content').animate({
                width: "1410px"
            },
            0);
        });
        $('.show-sidebar').click(function() {
            $('.show-sidebar').hide();
            $('.close-sidebar,.sidebar-column').show();
            $('.article-content').animate({
                width: "1016.8px"
            },
            0);
        });
    });	
    
    
/*-- 悬浮弹窗 -->*/
$(".qq").hover(function () {
	$(this).children(".float-qq-box").show()
},function() {
	$(this).children(".float-qq-box").hide()
});
$(".weixin").hover(function () {
	$(this).children(".float-weixin-box").show()
},function() {
	$(this).children(".float-weixin-box").hide()
});

//文章目录按钮
$('#article-index i').click(function(){
    $('#article-index').animate({'bottom':'0','opacity':'0'},600,function(){$(this).css('display','none')});
})
 
$('.wz-index').click(function(){
    $('#article-index').css('display','block').animate({'bottom':'56px','opacity':'1'},600);
})



//文章目录按钮
    $('#article-index i').click(function() {
        $('#article-index').animate({
            'bottom': '0',
            'opacity': '0'
        },
        600,
        function() {
            $(this).css('display', 'none')
        });
    })

    $('.wz-index').click(function() {
        $('#article-index').css('display', 'block').animate({
            'bottom': '56px',
            'opacity': '1'
        },
        600);
    })
//锚点滑动：在href上加上一个样式：smooth        
$(".smooth").click(function(){
var href = $(this).attr("href");
var pos = $(href).offset().top-100;
$("html,body").animate({scrollTop: pos}, 1000);
return false;
});


$('.h-screen li').click(function(){

$(this).addClass("on").siblings().removeClass();

  $('.ct > ul').eq($(this).index()).addClass('show');
 $('.ct > ul').eq($(this).index()).siblings().removeClass('show');
});

	$(".h-soup li i").click(function(){
		var soupBtn = $(this).parent();
		$(".h-soup li").removeClass("open");
		soupBtn.addClass("open");
	});


$(function(){
		//选项卡切换
		$('.home-cat-nav-wrap ul li').click(function(){
			indexC = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			$('.cont').eq(indexC).addClass('active').siblings().removeClass('active');
		})
		//按钮箭头
		var catew = $('.home-cat-nav-wrap').width()-450;
		var cateLiw = 0;
		$('.home-cat-nav-wrap ul li').each(function(){
			cateLiw +=$(this).outerWidth();
		})
		var i =0;
		$('.nextt').click(function(){
			$('.home-cat-nav-wrap ul').animate({
				"margin-left":-catew+'px'
			},500)
			i++;
			if((catew+150)*i+(catew+150)>=cateLiw){
				$('.prevv').show();
				$('.nextt').hide();
			}
		})
		$('.prevv').click(function(){
			$('.home-cat-nav-wrap ul').animate({
				"margin-left":0+'px'
			},500)
			$(this).hide();$('.nextt').show();
		})
	})
	
//小工具标签云
    len = $(".widget_ui_tags .items a").length - 1;
    $(".widget_ui_tags .items a").each(function(i) {
        var let = new Array( '27ea80','3366FF','ff5473','df27ea', '31ac76', 'ea4563', '31a6a0', '8e7daa', '4fad7b', 'f99f13', 'f85200', '666666');
        var random1 = Math.floor(Math.random() * 12) + 0;
        var num = Math.floor(Math.random() * 5 + 12);
        $(this).attr('style', 'background:#' + let[random1] + '; opacity: 0.6;'+'');
        if ($(this).next().length > 0) {
            last = $(this).next().position().left
        }
    });




//内容信息导航吸顶
	$(document).ready(function(){ 
	var navHeight= $("#navHeight").offset().top; 
	var navFix=$("#navHeight"); 
	$(window).scroll(function(){ 
		if($(this).scrollTop()>navHeight){ 
			navFix.addClass("navFix"); 
		} 
		else{ 
			navFix.removeClass("navFix"); 
		} 
		}) 
	})
///返回底部
$('.btn-triger').click(function () {
	    $(this).closest('.float-btn-group').toggleClass('open');
	});
	var scroller = $('.csdn-side-toolbar')

  $(window).scroll(function() {
      var h = document.documentElement.scrollTop + document.body.scrollTop
      h > 300 ? scroller.fadeIn() : scroller.fadeOut();
  })
 
 //复制
function jsCopyb(){
    var e=document.getElementById("copywp");//对象是code
         e.select(); //选择对象
          tag=document.execCommand("Copy"); //执行浏览器复制命令
        };	
        
function post_music() {
    //if (browser.versions.mobile) return ! 1;
    $(document).ready(function(){
    $(".audio").hover(function(){
      var id=$(this).attr('post-id');
      var src=$(this).attr('video-data');
      $(this).find('.play-icon').attr("src","/wp-content/themes/ripro-child/assets/video/pause.png");
      $(this).find('.play-pan').css({
        "-webkit-animation":"z 5s linear 0s infinite",
        "-moz-animation":"z 5s linear 0s infinite",
        "-ms-animation":"z 5s linear 0s infinite",
        "animation":"z 5s linear 0s infinite",
      })
      $(this).find('.play-zhen').css({"transform":"rotate(15deg)"})
      $(this).find('.audio-play').attr('src',src);
      myVid=document.getElementById('player-'+id);
      myVid.play();
    },
    function(){
      var id=$(this).attr('post-id');
      var src=$(this).attr('video-data');
      $(this).find('.play-icon').attr("src","/wp-content/themes/ripro-child/assets/video/play.png");
      $(this).find('.play-zhen').css({"transform":"rotate(-9deg)"})
      $(this).find('.play-pan').css({"animation":"none"})
      $(this).find('#player-'+id).attr('src','');
      $(this).find('.video_box_item').find('#player-'+id).stop()
    })
});
}

function post_a8ku_img(){
       //视频缩略图预览
 var myVideo=document.getElementById("player");
 $('#player').bind('contextmenu',function() { return false; });      
 $(document).ready(function(){
    $(".video").hover(function(){
      var id=$(this).attr('post-id');
      var src=$(this).attr('video-data');
      $(this).find('img').hide();
      $(this).find('.video_box_item').show();
      $(this).find('.video-play').attr('src',src);
      myVid=document.getElementById('player-'+id);
      myVid.play();
    },
    function(){
      var id=$(this).attr('post-id');
      var src=$(this).attr('video-data');
      $(this).find('img').show();
      $(this).find('.video_box_item').hide();
      $(this).find('#player-'+id).attr('src','');
      $(this).find('.video_box_item').find('#player-'+id).stop()
    }   
    )
});
}
function cms_float(){
  if (li[this.index].idName) {
    var top = document.getElementById(li[this.index].idName).offsetTop - _this.fixPx,
      b = _this.getScrollPos(),
      c = (top - _this.getScrollPos()),
      d = speed,
      t = 0;
    _this.animate(t, b, c, d);
    return false;
  }
}
jQuery(function() {
  post_music()
  post_a8ku_img()
});
        