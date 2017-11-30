;(function($){
    $.fn.jyswiper = function(options){

        var settings = $.extend({
            swiperCt : $(".J_play_ct"),             //滑动主元素
            winType : 0 ,                           //滑动子元素的宽度，0为屏幕宽度，1为子元素的实际宽度
            isNeedPoint : true ,                    //是否需要滑动导航点
            initIdx : 1,                            //初始态
            slideTime : .3,                        //滑动时间,单位是s
        },options);

        var widArr = [],
            slideNum = 0,
            statusIdx = 0;

        //改变状态
        function changeStatus(i,isMove){
            var swiperCt = settings.swiperCt,
                chg = widArr[i],
                lastIdx = slideNum,
                slideTime = !isMove ? settings.slideTime : 0,
                lf = chg;

            swiperCt.css({
                transform : "translateX(" + chg +"px)",
                transition : "transform " + slideTime + "s linear"
            })

            var _idx = i == 1 || i ==  lastIdx+1 ? 0 : (i == 0 || i == lastIdx ) ? (lastIdx - 1) : (i - 1);
            $(".J_dots span").removeClass("active").eq(_idx).addClass("active");
            setTimeout(function(){
                if(i == 0){
                    statusIdx = lastIdx;
                    _lf = widArr[lastIdx];
                    swiperCt.css({
                        transform : "translateX(" + _lf +"px)",
                        transition : ""
                    })
                }else if(i > lastIdx){
                    statusIdx = 1;
                     _lf = widArr[1]
                     swiperCt.css({
                        transform : "translateX(" + _lf +"px)",
                        transition : ""
                    })
                }
            },300)
        }

        //滑动事件
        function handlerTouch(){
            var swiperCt = settings.swiperCt,
                playWrapW = widArr[1]/3,
                startX;

            swiperCt.on('touchstart',function(e){
                startX = e.targetTouches[0].pageX;
                swiperCt.css({
                    transition : ""
                })
            })

            swiperCt.on('touchmove',function(e){
                var changeX = startX - e.targetTouches[0].pageX,
                    idx = statusIdx,
                    curLf = widArr[idx];

                swiperCt.css({
                    transform : "translateX(" + (-changeX+curLf) +"px)"
                })
            })

            swiperCt.on('touchend',function(e){
                var changeX = startX - e.changedTouches[0].pageX,
                    idx = statusIdx;

                //向左
                if(changeX > 0 && Math.abs(changeX) >= playWrapW){
                    statusIdx = idx+1;
                    
                //向右
                }else if(changeX < 0 && Math.abs(changeX) >= playWrapW){
                    statusIdx = idx-1;
                }
               changeStatus(statusIdx);
            })
        }

        return this.each(function(){
            var swiperCt = settings.swiperCt,
                item = swiperCt.children('div');

            var l = item.length,
                w = settings.winType == 0 ? $(window).width() : $(item[0])[0].getBoundingClientRect().width,
                _dots = '<div class="dots J_dots"><div class="dots_ct">',
                initIdx = settings.initIdx,
                firstHtml , endHtml , _left , _html;

                slideNum = l;
                firstHtml =  $('<div>').append($(item[0]).clone()).html();
                endHtml = $('<div>').append($(item[l-1]).clone()).html();

                for(var i = 0 ; i < l ; i++){
                    _dots += "<span></span>";
                    widArr.push(-w*i);
                }
                widArr.push(-w*l,-w*(l+1));
                _html = endHtml + swiperCt.html() + firstHtml;
                _dots += "</div></div>";

                swiperCt.html(_html).css({width : (l+2) * w + 'px'});

                //是否需要点点点
                if(settings.isNeedPoint){
                    $(this).append(_dots);
                }

                initIdx = initIdx == 0 ? 1 : initIdx == (l-1) ? l : (initIdx+1);
                statusIdx = initIdx;
                changeStatus(initIdx,true);
                handlerTouch();
        })
    }
})(Zepto);