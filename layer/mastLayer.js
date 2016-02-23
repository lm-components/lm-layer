/**
 * Created by Administrator on 2015/5/16 0016.
 *
 * 遮盖层div
 */
if (window.console && window.console.log)console.log("-------loading mastLayer---------------");
define(function(){
    var bodyHight = document.documentElement.clientHeight //==> 可见区域的高
    var back = null;
//设置带有文字信息的遮盖层
    function havTextMastLayer(){
        back = mastLayer();
        var html = '<div style="width:200px;height:200px;margin:300px auto;">' +
            '<span style="color:white;font-size:14px;font-weight:bold;">正在加载请稍候......</span>' +
            '</div>';
        $(back).html(html);
    }
//设置弹框为图片信息的遮盖层
    function havImgMastLayer(wd,he,url){
        back = mastLayer();
        var height  = ((bodyHight - he)/2 - 100)+"px";
        var html = '<div style="width:'+wd+'px;height:'+he+'px;margin:'+height+' auto;">' +
            '<img src="'+ url +'"></div>';
        $(back).html(html);
    }
//设置屏蔽罩
    function mastLayer(){
        closeMastLayer();
        if (window.console && window.console.log)console.log(" --------------添加遮罩层------------");
        var bWidth = document.documentElement.scrollWidth;
        var bHeight = document.documentElement.scrollHeight;
        var styleStr="style='position:absolute;top:0px;left:0px;z-index:2000;background-color: rgb(0, 0, 0);width:"+bWidth+"px;height:"+bHeight+"px;" +
            "filter:alpha(opacity=50);opacity:0.5;'";
        back = $("<div id='mastLayer' "+styleStr+"></div>");
        $("body").append(back);
        return back;
    }
//关闭遮盖层
    function closeMastLayer(){
        var obj = back || $("#mastLayer:last");
        $(obj).remove();
        return obj;
    }
    return {
        mastLayer:mastLayer,
        havTextMastLayer :havTextMastLayer,
        havImgMastLayer : havImgMastLayer,
        closeMastLayer:closeMastLayer
    };
});
