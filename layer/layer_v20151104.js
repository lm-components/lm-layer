/**
 * Created by Administrator on 2015/6/8 0008.
 *信息弹框用法说明：
 *
 *注意：不同的项目要改变layer.htm 的路径
 *      使用时必须先引用jQuery
 *
 *
 * 举例说明：
 * $(".dd").layer({
 *          width:200px;                     //内容的宽度，最好设置   默认180
 *          height:100px;                    //内容的高度，最好设置   默认50
 *          icon：1,2,3                      //弹框表情
 *          overflow:"hidden"                //隐藏滚动条
 *          closeCallback:function           //关闭按钮时调用的函数
 *          enter: true,                     //按enter键触按钮事件
 *          drag: { focuEle:null,            //点击哪个元素开始拖动,可为空。不为空时，需要为被拖动元素的子元素。默认为标题栏，无需手动设置
                    callback:null,           //拖动时触发的回调。
                    dragDirection:'all',    //拖动方向：['all','vertical','horizontal']
                    fixarea:null            //限制在哪个区域拖动,以数组形式提供{left:minX,right:maxX,top:minY,bottom:maxY}
                 },
 *          mastLayer：true,                 //设置蒙版
*           addEvent:"click",               //增加事件，可以不加
            title:"gerg",                   //设置弹框标题，可以不加
            content:div,                    //设置弹框内容，必选,尽量用div包装，并且设置width，否则ie7默认为200px
            confirms:[                      //设置确认取消按钮，可以不加
                {"bnt":"确认","fun":function(){//显示第一个按钮，bnt为按钮的名称，fun为点击按钮执行的函数,retainLayer:true关闭弹框吗，默认关闭，为true时不关闭
                        alert("确认");
                },retainLayer:true},
                {"bnt":"取消","fun":function(){
                    alert("取消");
                }}],
            callback:function (box,mast) {      //弹框成功的回调函数，可以不加
                //alert("弹出成功！！！" +obj);
            }
        });
 *
 * $.extend(target,prop1,propN) //用一个或多个其他对象来扩展一个对象，返回这个被扩展的对象。这是简化继承的主要工具。
 参数:
 target (Object): 要扩展的对象
 prop1 (Object): 要与第一个对象合并的对象
 propN (Object): (可选) 更多要与第一个对象合并的对象


 *
 */
(function($){
    var arrLayers = [];//保存弹框对象
    var clientHeight = document.documentElement.clientHeight //==> 可见区域的高
    var clientWidth = document.documentElement.clientWidth;
    /********************************************************************************************************************************************************************/
    //设置屏蔽罩
    function mastLayer(ovfw){
        $("body").css({"overflow":ovfw});
        var bWidth = $(document).width();
        var bHeight = $(document).height();
        var styleStr="style='position:absolute;top:0px;left:0px;z-index:19891014;background-color: rgb(0, 0, 0);width:"+bWidth+"px;height:"+bHeight+"px;" +
            "filter:alpha(opacity=50);opacity:0.5;'";
        var back = $("<div "+styleStr+"></div>");
        $("body").append(back);
        return back;
    }
    /*********************************************************************************************************************************************************************/

    function closeLayer(box,mast,obj){//关闭layer
        box.remove();
        mast&&mast.remove();
        $("body").css({"overflow":"auto"});
        arrLayers.pop(obj);
        $.type(obj.closeCallback) === "function" &&　obj.closeCallback(box,mast);
    }

    function resetStyle(box,icon,conWidth,conHeight){//设置内容，根据内容重设样式

        var
            contentLayer = $(".layer-content",box),
            width = (conWidth || contentLayer.children().outerWidth(true) || 180)+ 22,
            imgHeight = conHeight || contentLayer.children().height(),
            imgHeight = (imgHeight > 60 ? imgHeight : 60) - 30,
            height =  box.outerHeight(),
            diffHeight = clientHeight - height,
            top = diffHeight * (1 -0.618);//黄金比例
        if(diffHeight <= 0){
            top = 30;
            contentLayer.css({"overflow-x":"hidden","overflow-y":"auto","height":(clientHeight-150)+"px"});
        }
        if(width > clientWidth){
            contentLayer.css({"overflow-x":"auto"});
            width = clientWidth-40;
        }
        if(icon){
            contentLayer.addClass("icon"+icon);
            var imgUrl = contentLayer.css("backgroundImage").replace(/url\((.+)\)$/,"$1"),
                img = new Image();
                img.src = imgUrl;
            var imgOnload = function( ration, imgMaxHei){
                imgHeight = imgHeight > imgMaxHei ?imgMaxHei : imgHeight;
                var imgWidth = imgHeight * (ration || 1);
                width += imgWidth +10;
                contentLayer.css({"padding-left":(imgWidth +25)+"px","background-size":imgWidth+"px "+imgHeight+"px"});
                box.css({"width":width+"px","left":(clientWidth-width)/2+"px","top":top+"px"});
            }
            // 判断是否有缓存
            if(img.complete){
                imgOnload((img.width/ img.height),img.height)
            }else{
                img.onload = function(){ imgOnload( (img.width/ img.height),img.height);};// 加载完成执行
            }
            return ;
        }
        box.css({"width":width+"px","left":(clientWidth-width)/2+"px","top":top+"px"});
    }

    function addBnt (box,mast,obj){//添加按钮
        var confirms = obj.confirms,
            enter = obj.enter,
            layerBnt = $(".layer-btn",box);
        $.each(confirms,function(i,v){
            var aobj = $("<a href='javascript:void(0);'>"+ v.bnt+"</a>");
            layerBnt.append(aobj);
            aobj.on("click",function(){
                $.isFunction(v.fun) && v.fun(box,mast);
                !v.retainLayer &&　closeLayer(box,mast,obj);
            });
        });
        $("a:eq(0)",layerBnt).css("background","#0C8CCD");
        if( !enter )return;
        var location = 0;
        $(document).on("keydown",function(event){
            var which = event.which;
            if(which===13){
                $("a:eq("+location+")",layerBnt).trigger("click");
                return false;
            }
            if(confirms.length>1&&(which===37 || which === 39)){    //键盘左右键切换触发按钮
                location = location < confirms.length - 1 ? ++location : 0;
                layerBnt.find("a").css("background","#5FBFE7");
                $("a:eq("+location+")",layerBnt).css("background","#0C8CCD");
                return false;
            }
        });
    }
    var util = {
        isClass:function(stl ){return /^\./.test(stl)}
    }
    var createBoxs = {
        closeBnt:function(type,style){
            var closebnt = null;
            if (type === 1){
                closebnt = $('<a class="layer-close" href="javascript:void(0);">×</a>');
            }
            return closebnt;
        },
        titleBox:function(type,title){
            var titlebox = null;
            if (type === 1){
                titlebox = $('<div class="layer-title">'+title+'</div>');
            }
            return titlebox;
        },
        confirmBox:function(type,css){
            var confirmbnt = null;
            if (type === 1){
                confirmbnt = $('<div class="layer-btn" style="'+css+'"></div>');
            }
            return confirmbnt;
        },
        confirmBnt:function(type,css){
            var confirmbnt = null;
            if (type === 1){
                confirmbnt = $('<div class="layer-btn" style="'+css+'"></div>');
            }
            return confirmbnt;
        },
        contentBox:function(type,content,css){
            var contentbox = null;
            if (type === 1){
                contentbox = $('<div class="layer-content" style="'+css+'">'+content+'</div>');
            }
            return contentbox;
        },
        box:function(type,css){
            var boxb = null;
            if (type === 1){
                boxb = $('<div class="layer layer-border" style="'+css+'"></div>');
            }
            $("body").append(boxb);
            return box;
        }
    }
    function createBox(type){
        var box = null;
        switch (type){
            case 1:
                break;
            default :
                box = $('<div class="layer layer-border">'+
                    '<div class="layer-title"></div>'+
                    '<div class="layer-content"></div>'+
                    '<a class="layer-close" href="javascript:void(0);">×</a>'+
                    '<div class="layer-btn"></div></div>');
                $("body").append(box);
                return box;
        }
    }
    function layer(obj){
        if($.inArray(obj,arrLayers)>=0) return;
        arrLayers.push(obj);
        var mast = obj.mastLayer && mastLayer(obj.overflow);                //添加遮盖层
        var box = createBox( obj.type );
        $(".layer-title", box).text( obj.title);
        $(".layer-content", box).html( obj.content);
        resetStyle(box,obj.icon,obj.width,obj.height);                                                //设置内容和样式
        $(".layer-close",box).on("click",function(){                        //给关闭按钮添加点击事件
            closeLayer(box,mast,obj);
        });
        obj.confirms && addBnt(box,mast,obj);                     //添加点击按钮
        obj.drag && box.dragDrop($.extend(obj.drag,{focuEle:$('.layer-title',box)}))    //拖拽弹出框$(opts.focuEle,moveEle)
        $.type(obj.callback) === "function" && obj.callback.call(this,box,mast);        //回调函数
    }
    var defaultOpts = {
        type:0,
        title:"消息",
        drag:{type:2}
    }
    $.fn.layer = function(obj) {
        if(window.console && window.console.log)console.log(obj.content);
        if(!obj.content){alert("请添加内容对象！");return;}// 无内容不弹框
        $.extend(obj,defaultOpts);
        if(obj.addEvent){
            $(this).on(obj.addEvent,function(){
               layer.call(this,obj);
            });
        }else{
            layer.call(this,obj);
        };
    }

    if(window.console && window.console.log)console.log("--------------------loading alert/layer.js-----------------------");
}(jQuery))
