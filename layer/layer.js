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
 *          close:function//关闭按钮时调用的函数
 *          enter: true,按enter键触按钮事件
 *          drag: { focuEle:null,            //点击哪个元素开始拖动,可为空。不为空时，需要为被拖动元素的子元素。默认为标题栏，无需手动设置
                    callback:null,           //拖动时触发的回调。
                    dragDirection:'all',    //拖动方向：['all','vertical','horizontal']
                    fixarea:null            //限制在哪个区域拖动,以数组形式提供{left:minX,right:maxX,top:minY,bottom:maxY}
                 },
 *          mastLayer：true,//设置蒙版
 *          addEvent:"click",//增加事件，可以不加
            title:"gerg",//设置弹框标题，可以不加
            content:div, //设置弹框内容，必选,尽量用div包装，并且设置width，否则ie7默认为200px
            confirms:[ //设置确认取消按钮，可以不加
                {"bnt":"确认","fun":function(){//显示第一个按钮，bnt为按钮的名称，fun为点击按钮执行的函数
                        alert("确认");
                }},
                {"bnt":"取消","fun":function(){
                    alert("取消");
                }}],
            callback:function (obj) {//弹框成功的回调函数，可以不加
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

    var clientHeight = document.documentElement.clientHeight //==> 可见区域的高
    var clientWidth = document.documentElement.clientWidth;
    var back = null;
    /********************************************************************************************************************************************************************/
    //关闭遮盖层
    function closeMastLayer(){
        $("body").css({"overflow":"auto"});
        var obj = back || $("#mastLayer:last");
        $(obj).remove();
        return obj;
    }

    //设置屏蔽罩
    function mastLayer(){
        closeMastLayer();
        $("body").css({"overflow":"hidden"});
        if (window.console && window.console.log)console.log(" --------------添加遮罩层------------");
        var bWidth = $(document).width();
        var bHeight = $(document).height();
        var styleStr="style='position:absolute;top:0px;left:0px;z-index:19891014;background-color: rgb(0, 0, 0);width:"+bWidth+"px;height:"+bHeight+"px;" +
            "filter:alpha(opacity=50);opacity:0.5;'";
        back = $("<div id='mastLayer' "+styleStr+"></div>");
        $("body").append(back);
        return back;
    }
    /*********************************************************************************************************************************************************************/

    var alertObj = null;

    function closeAlert(obj){//关闭layer
        $(alertObj).remove();
        if(back){
            closeMastLayer();
        }
        alertObj = null;
    }

    function resetStyle(obj){//设置内容，根据内容重设样式
        obj.title ? $(".layer-title",alertObj).text(obj.title) : $(".layer-title",alertObj).text("消息");
        var cont = obj.content;
        if(obj.content)$(".layer-content",alertObj).append(obj.content);
        var
            width = $(".layer-content",alertObj).children().width()+ 20,
            height =  $(".layer",alertObj).height(),
            diffHeight = clientHeight - height,
            top = diffHeight * (1 -0.618);//黄金比例
        if(diffHeight <= 0){
            top = 30;
            $(".layer-content",alertObj).css({"overflow-x":"hidden","overflow-y":"auto","height":(clientHeight-150)+"px"});
        }
        if(width > clientWidth){
            $(".layer-content",alertObj).css({"overflow-x":"auto"});
            width = clientWidth-40;
        }
        $(".layer",alertObj).css({"width":width+"px","left":(clientWidth-width)/2+"px","top":top+"px","visibility":"visible"});
    }

    function addBnt (obj){//添加按钮
        if(obj.confirms){
            var layerBnt = $(".layer-btn",alertObj);
            $.each(obj.confirms,function(i,v){
                layerBnt.append("<a href='javascript:void(0);'>"+ v.bnt+"</a>");
                $("a:eq("+i+")",layerBnt).on("click",function(){
                    closeAlert(obj);
                    if($.isFunction(v.fun))v.fun();
                });
            });
            $("a:eq(0)",layerBnt).css("background","#0C8CCD");
            if(obj.enter){
                var location = 0;
                $(document).on("keydown",function(event){
                    var which = event.which;
                    if(which===13){
                        $("a:eq("+location+")",layerBnt).trigger("click");
                        return false;
                    }else if(obj.confirms.length>1&&(which===37 || which === 39)){
                        location = location < obj.confirms.length - 1 ? ++location : 0;
                        layerBnt.find("a").css("background","#5FBFE7");
                        $("a:eq("+location+")",layerBnt).css("background","#0C8CCD");
                        return false;
                    }
                });
            }
        }
    }

    function layer(obj){
        $.get('./layer.html', function(layerDiv) {
            if(window.console && window.console.log)console.log(obj.content);
            if(alertObj)closeAlert(obj);
            alertObj = document.createElement("div");
            if(obj.mastLayer){ mastLayer(); }//添加遮盖层
            $("body").append($(alertObj).html(layerDiv));
            resetStyle(obj);    //设置内容和样式
            addBnt (obj);       //添加点击按钮
            if(obj.drag){$('.layer',alertObj).dragDrop($.extend({},{focuEle:$('.layer-title',alertObj)},obj.drag))}//拖拽弹出框$(opts.focuEle,moveEle)
            if($.isFunction(obj.callback)){obj.callback($(".layer",alertObj ).attr("id"))};//回调函数
            $(".layer-close",alertObj).on("click",function(){//给关闭按钮添加点击事件
                closeAlert(obj);
                if(obj.closeCallback){obj.closeCallback();}
            });
        });
    }

    $.fn.layer = function(obj) {
        if(!obj){alert("请添加属性对象！");return;}
        if(obj.addEvent){
            $(this).on(obj.addEvent,function(){
                layer(obj);
            });
        }else{
            layer(obj)
        };
    }

    if(window.console && window.console.log)console.log("--------------------loading alert/layer.js-----------------------");
}(jQuery|| {}))
