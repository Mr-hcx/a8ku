(function($) {
    $.fn.FengTab = function(b) {
        b = $.extend({
            titCell: "",
            mainCell: "",
            defaultIndex: 0,
            trigger: "click",
            titOnClassName: "on",
            showtime: 200
        }, b);
        var c = $(this)
          , tabLi = c.find(b.titCell).children()
          , conDiv = c.find(b.mainCell).children();
        conDiv.each(function() {
            var a = $(this)
              , index = a.index();
            a.addClass("FengTabCon_" + index);
            if (index == b.defaultIndex) {
                a.show()
            } else {
                a.hide()
            }
        });
        tabLi.each(function() {
            var a = $(this)
              , index = a.index();
            if (index == b.defaultIndex) {
                a.addClass(b.titOnClassName)
            }
            ;a.on(b.trigger, function() {
                a.addClass(b.titOnClassName).siblings().removeClass(b.titOnClassName);
                boxItem = c.find(b.mainCell).children(".FengTabCon_" + index);
                boxItem.stop();
                boxItem.fadeIn(b.showtime).siblings().hide()
            })
        })
    }
}
)(jQuery);

$(".article-content").FengTab({
	titCell:".tabtst", 	//选项卡控制盒子
	mainCell:".container", 	//选项卡内容盒子
	defaultIndex:"0", 	//默认显示第几个选项卡，第一个是0，第二个是1，以此类推
	trigger:"click", 	//切换方式，click 为点击，mouseover 为移动切换
	titOnClassName:"on", 	//选中选项卡样式
	showtime: 0		//内容切换时间，一般写200即可（单位是毫秒）
});
