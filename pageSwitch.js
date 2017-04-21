(function($){
    /*说明:获取浏览器前缀*/
    /*实现：判断某个元素的css样式中是否存在transition属性*/
    /*参数：dom元素*/
    /*返回值：boolean，有则返回浏览器样式前缀，否则返回false*/
    var _prefix = (function(temp){
        var aProfix = ["webkit","Moz","o","ms"],
            props="";
        for(var i in aProfix){
            props = aProfix[i]+"Transition";
            if(temp.style[props] !== undefined){
                return "-"+aProfix[i].toLowerCase()+"-";
            }
        }
       return false;
    })(document.createElement('p'));

    // PageSwitch constructor
    var PageSwitch = (function(){
        function PageSwitch (element,options){
            this.settings = $.extend(true,$.fn.PageSwitch.default,options||{});
                 
            this.element = element;
            if( typeof options === "object"){
                this.init();
            }
        }
        PageSwitch.prototype={
            // 说明：初始化插件
            // 实现：初始化dom结构，布局，分页及绑定事件
            init:function(){
                var me = this;
                me.selectors = me.settings.selectors;//对象
                me.sections = me.element.find(me.selectors.sections);
                me.section = me.sections.find(me.selectors.section);
                me.direction = me.settings.direction == "vertical"?true:false;
                me.pagesCount = me._pagesCounts();
                me.index = (me.settings.index>=0&&me.settings.index < me.pagesCount)?me.settings.index:0;
                me.section.eq(me.index).addClass('active');
                me.canscroll = true;

                if(!me.direction || me.index){
                    me._initLayout();
                }

                if(me.settings.pagination){
                    me._initPaging();
                }

                me._initEvent();
            },
            // 说明：获取滑动页面数量
            _pagesCounts:function(){
                return this.section.length;
            },
            // 说明：获取滑动的宽度(横屏宽度)或高度(竖屏滑动)
            _switchLength:function(){
                return this.direction == 1 ? this.element.height():this.element.width();
            },
            // 说明：向前滑动即上一页面
            prev:function(){
                var me = this;
                if(me.index > 0){
                    me.index--;
                }else if(me.settings.loop){
                    me.index = me.pagesCount - 1;
                }
                me._scrollPage();
            },
            // 说明：向后滑动即下一页面
            next:function(){
                var me = this;
                if(me.index < me.pagesCount - 1){
                    me.index++;
                }else if(me.settings.loop){
                    me.index = 0;
                }
                me._scrollPage();
            },
            // 说明：主要针对横屏情况进行布局
            _initLayout:function(){
                var me = this;
                if(!me.direction){
                    var width = (me.pagesCount * 100) + "%",
                        cellWidth = (100 / me.pagesCount).toFixed(2) + "%";
                    me.sections.width(width);
                    me.section.width(cellWidth).css("float", "left");
                }
                if(me.index){
                    me._scrollPage(true);
                }
            },
            // 说明：实现分页的dom结构及css样式
            _initPaging:function(){
                var me = this,
                    pagesClass = me.selectors.page.substring(1);
                    me.activeClass = me.selectors.active.substring(1);
                var pageHtml = "<ul class="+pagesClass+">";
                for(var i=0;i<me.pagesCount;i++){
                    pageHtml+="<li></li>";
                }
                pageHtml+="</ul>";
                me.element.append(pageHtml);
                var pages = me.element.find(me.selectors.page);
                me.pageItem = pages.find("li");
                me.pageItem.eq(me.index).addClass(me.activeClass);

                if(me.direction){
                    pages.addClass('vertical');
                }else{
                    pages.addClass('horizontal');
                }

            },
            // 说明：初始化插件事件
            _initEvent:function(){
                var me = this;
                // 分页点击事件
                me.element.on('click',me.selectors.page+" li",function(){
                    me.index = $(this).index();
                    // console.log(me.index);
                    me._scrollPage();
                });
                // 鼠标滚轮事件
                me.element.on('mousewheel DOMMouseScroll',function(e){
                    e.preventDefault();
                    var delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
                    if(me.canscroll){
                        if(delta>0 && (me.index && !me.settings.loop || me.settings.loop)){
                            me.prev();
                        }else if(delta<0 && (me.index<(me.pagesCount - 1) && !me.settings.loop || me.settings.loop)){
                            me.next();
                        }
                    }
                });
                // 键盘事件
                if(me.settings.keyboard){
                    $(window).on('keydown',function(e){
                        var keyCode = e.keyCode;
                        if(keyCode == 37 || keyCode == 38){
                            me.prev();
                        }else if(keyCode == 39 || keyCode == 40){
                            me.next();
                        }
                    });
                }
                // 窗口改变事件
                var resizeId;
                $(window).resize(function(){
                    clearTimeout(resizeId);
                    resizeId = setTimeout(function(){
                        var currentLength = me._switchLength();
                        var offset = me.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
                        if(Math.abs(offset) > currentLength/2 && me.index < (me.pagesCount - 1)){
                            me.index ++;
                        }
                        if(me.index){
                            me._scrollPage();
                        }
                    },500);
                });
                // 动画结束后回调函数
                if(_prefix){
                    me.sections.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend",function(){
                        me.canscroll = true;
                        if(me.settings.callback && $.type(me.settings.callback) == "function"){
                            me.settings.callback(me.index);
                        }else{
                            // alert('语法错误')
                        }
                    })
                }

            },
            // 说明:滑动动画
            _scrollPage:function(init){
               var me = this;
               var dest = me.section.eq(me.index).position();
               if(!dest) return;
               me.canscroll = false;
               if(_prefix){
                var translate = me.direction ? "translateY(-"+dest.top+"px)" : "translateX(-"+dest.left+"px)";
                me.sections.css(_prefix+"transition", "all " + me.settings.duration + "ms " + me.settings.easing);
                me.sections.css(_prefix+"transform" , translate);
               }else{
                var animateCss = me.direction ? {top : -dest.top} : {left : -dest.left};
                me.sections.animate(animateCss, me.settings.duration, function(){
                    me.canscroll = true;
                    if(me.settings.callback && $.type(me.settings.callback) == "function"){
                        me.settings.callback(me.index);
                    }else{
                        // alert('语法错误')
                    }
                });
               }
               if(me.settings.pagination && !init){
                me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
               }
               // 当前section添加active
               me.section.eq(me.index).addClass('active').siblings('.section').removeClass('active');
            }
        }
        return PageSwitch;
    })();
    $.fn.PageSwitch=function(options){
        return this.each(function(){
            var me=$(this),
                instance=me.data("PageSwitch");
            if(!instance){
                instance=new PageSwitch(me,options);
                me.data("PageSwitch",instance);
            }
            if($.type(options) === "string") return instance[options]();
        });
    }
    $.fn.PageSwitch.default={
        selectors:{
            sections:".sections",
            section:".section",
            page:".pages",
            active:".active"
        },
        index:0,
        easing:"ease",
        duration:500,
        loop:false,
        pagination:true,
        keyboard:true,
        direction:"vertical",//horizontal
        callback:""
    }
    $(function(){
        $("[data-PageSwitch]").PageSwitch();
    })

})(jQuery)