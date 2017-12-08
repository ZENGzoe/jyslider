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
                    statusIdx = 0,
                    _this = this;

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
                    $(_this.find(".J_dots span")).removeClass("active").eq(_idx).addClass("active");
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
                        startX,startY;

                    swiperCt.on('touchstart',function(e){
                        startX = e.targetTouches[0].pageX;
                        startY = e.targetTouches[0].pageY;

                        swiperCt.css({
                            transition : ""
                        })
                    })

                    swiperCt.on('touchmove',function(e){
                    
                        var changeX = startX - e.targetTouches[0].pageX,
                            idx = statusIdx,
                            curLf = widArr[idx];

                        var angle = getDirection(startX,startY,e.changedTouches[0].pageX,e.changedTouches[0].pageY);
                        if(angle == 3 || angle == 4) {
                            e.preventDefault();
                            e.stopPropagation();
                            swiperCt.css({
                                transform : "translateX(" + (-changeX+curLf) +"px)"
                            })
                            
                        }

                    })

                    swiperCt.on('touchend',function(e){
                        var changeX = startX - e.changedTouches[0].pageX,
                            idx = statusIdx;
                        var angle = getDirection(startX,startY,e.changedTouches[0].pageX,e.changedTouches[0].pageY);
                       
                        if(angle == 3 || angle == 4) {
                            e.preventDefault();
                            e.stopPropagation();
                            //向左
                            if(changeX > 0 && Math.abs(changeX) >= playWrapW){
                                statusIdx = idx+1;
                                
                            //向右
                            }else if(changeX < 0 && Math.abs(changeX) >= playWrapW){
                                statusIdx = idx-1;
                            }
                           changeStatus(statusIdx);
                        }
                        
                    })

                }

                function handleBodyMove(){
                    $('body').on('touchmove',function(e){
                        var swiperCt = settings.swiperCt;
                        
                        swiperCt.off('touchmove').off('touchend');
                    })

                    $('body').on('touchend',function(e){
                        handlerTouch();
                    })
                }

                function calAngle(px,py){
                    return Math.atan2(py, px) * 180 / Math.PI;;
                }

                // 1向上 2向下 3向左 4向右 0未滑动
                function getDirection(startX,startY,endX,endY){
                    var offsetX = endX - startX,
                        offsetY = endY - startY,
                        result = 0;

                    if(Math.abs(offsetX) < 2 && Math.abs(offsetY) < 2){
                        result = 0;
                    }
                    var angle = calAngle(offsetX,offsetY);
                    
                    if (angle >= -135 && angle <= -45) {  
                        result = 1;  
                    } else if (angle > 45 && angle < 135) {  
                        result = 2;  
                    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {  
                        result = 3;  
                    } else if (angle >= -45 && angle <= 45) {  
                        result = 4;  
                    }  

                    return result;
                }

                return _this.each(function(){
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

                        swiperCt.html(_html).css({width : (l+2) * w + 1 + 'px'});

                        //是否需要点点点
                        if(settings.isNeedPoint){
                            $(this).append(_dots);
                        }

                        initIdx = initIdx == 0 ? 1 : initIdx == (l-1) ? l : (initIdx+1);
                        statusIdx = initIdx;
                        changeStatus(initIdx,true);
                        handlerTouch();
                        handleBodyMove();
                })
            }
        })(Zepto);