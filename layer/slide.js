/**
 * Created by Administrator on 2015/6/12 0012.
 */
(function($){
    if(!$){ alert("-----请先引入jQuery----------");return;}
    var slider = jQuery(".slideBox");
    var vis =1;
    var slideH=0;
    var slideW=0;
    var selfW=0;
    var selfH=0;
    var effect = "fade";
    var conBox = $(".bd ul");//内容元素父层对象
    var conBoxSize = conBox.children().size();
    var rtnST=null;//returnDefault-setTimeout;
    var index=0;
    var navObj = $(conBox, slider);//导航子元素结合
    var navObjSize = navObj.size();
    var onIndex = navObj.index( slider.find( ".on") );
    var oldIndex = index = onIndex==-1?index:onIndex;
    var delayTime =500;
    var easing="swing";
    var titOn = "on";
    var pnLoop = autoPlay =true;
    var pageState = $(".pageState");
    console.log("conBoxSize=========="+conBoxSize +"  vis======="+ vis)
    if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
        conBox.children().each(function(){ //取最大值
            if( $(this).width()>selfW ){ selfW=$(this).width(); slideW=$(this).outerWidth(true);  }
            if( $(this).height()>selfH ){ selfH=$(this).height(); slideH=$(this).outerHeight(true);  }
        });

        var _chr = conBox.children();
        var cloneEle = function(){
            for( var i=0; i<vis ; i++ ){ _chr.eq(i).clone().addClass("clone").appendTo(conBox); }
            for( var i=0; i<cloneNum ; i++ ){ _chr.eq(conBoxSize-i-1).clone().addClass("clone").prependTo(conBox); }
        }
        switch(effect)
        {
            case "fold": conBox.css({"position":"relative","width":slideW,"height":slideH})
                .children().css( {"position":"absolute","width":selfW,"left":0,"top":0,"display":"none"} ); break;
            case "top": conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>')
                .css( { "top":-(index*scroll)*slideH, "position":"relative","padding":"0","margin":"0"}).children().css( {"height":selfH} ); break;
            case "left": conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>').
                css( { "width":conBoxSize*slideW,"left":-(index*scroll)*slideW,"position":"relative","overflow":"hidden","padding":"0","margin":"0"})
                .children().css( {"float":"left","width":selfW} ); break;
            case "leftLoop":
            case "leftMarquee":
                cloneEle();
                conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>')
                    .css( { "width":(conBoxSize+vis+cloneNum)*slideW,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-(cloneNum+index*scroll)*slideW})
                    .children().css( {"float":"left","width":selfW}  ); break;
            case "topLoop":
            case "topMarquee":
                cloneEle();
                conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>')
                    .css( { "height":(conBoxSize+vis+cloneNum)*slideH,"position":"relative","padding":"0","margin":"0","top":-(cloneNum+index*scroll)*slideH})
                    .children().css( {"height":selfH} ); break;

        }
    }

    var doStartFun=function(){
        //if ( $.isFunction( opts.startFun) ){
            opts.startFun( index,navObjSize,slider,$(opts.titCell, slider),conBox,tarObj,prevBtn,nextBtn ) } //}
    var doEndFun=function(){ if ( $.isFunction( null) ){ opts.endFun( index,navObjSize,slider,$(opts.titCell, slider),conBox,tarObj,prevBtn,nextBtn ) } }

    var defaultPlay = true,isMarq = false;
    //效果函数
    var doPlay=function(init){
        // 当前页状态不触发效果
        if( defaultPlay && oldIndex==index && !init && !isMarq ) return;

        //处理页码
        if( isMarq ){ if ( index>= 1) { index=1; } else if( index<=0) { index = 0; } }
        else{
            _ind=index; if ( index >= navObjSize) { index = 0; } else if( index < 0) { index = navObjSize-1; }
        }

        //处理切换加载
        //if( sLoad!=null ){ doSwitchLoad( conBox.children() ) }

        //处理targetCell
        //if(tarObj[0]){
        //    _tar = tarObj.eq(index);
        //    if( sLoad!=null ){ doSwitchLoad( tarObj ) }
        //    if( effect=="slideDown" ){
        //        tarObj.not(_tar).stop(true,true).slideUp(delayTime);
        //        _tar.slideDown( delayTime,easing,function(){ if(!conBox[0]) doEndFun() });
        //    }
        //    else{
        //        tarObj.not(_tar).stop(true,true).hide();
        //        _tar.animate({opacity:"show"},delayTime,function(){ if(!conBox[0]) doEndFun() });
        //    }
        //}
        if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
            switch (effect)
            {
                case "fade":conBox.children().stop(true,true).eq(index).animate({opacity:"show"},delayTime,easing,function(){doEndFun()}).siblings().hide(); break;
                case "fold":conBox.children().stop(true,true).eq(index).animate({opacity:"show"},delayTime,easing,function(){doEndFun()}).siblings().animate({opacity:"hide"},delayTime,easing);break;
                case "top":conBox.stop(true,false).animate({"top":-index*scroll*slideH},delayTime,easing,function(){doEndFun()});break;
                case "left":conBox.stop(true,false).animate({"left":-index*scroll*slideW},delayTime,easing,function(){doEndFun()});break;
                case "leftLoop":
                    var __ind = _ind;
                    conBox.stop(true,true).animate({"left":-(scrollNum(_ind)+cloneNum)*slideW},delayTime,easing,function(){
                        if( __ind<=-1 ){ conBox.css("left",-(cloneNum+(navObjSize-1)*scroll)*slideW);  }else if( __ind>=navObjSize ){ conBox.css("left",-cloneNum*slideW); }
                        doEndFun();
                    });
                    break;//leftLoop end

                case "topLoop":
                    var __ind = _ind;
                    conBox.stop(true,true).animate({"top":-(scrollNum(_ind)+cloneNum)*slideH},delayTime,easing,function(){
                        if( __ind<=-1 ){ conBox.css("top",-(cloneNum+(navObjSize-1)*scroll)*slideH);  }else if( __ind>=navObjSize ){ conBox.css("top",-cloneNum*slideH); }
                        doEndFun();
                    });
                    break;//topLoop end

                case "leftMarquee":
                    var tempLeft = conBox.css("left").replace("px","");
                    if(index==0 ){
                        conBox.animate({"left":++tempLeft},0,function(){
                            if( conBox.css("left").replace("px","")>= 0){ conBox.css("left",-conBoxSize*slideW) }
                        });
                    }
                    else{
                        conBox.animate({"left":--tempLeft},0,function(){
                            if(  conBox.css("left").replace("px","")<= -(conBoxSize+cloneNum)*slideW){ conBox.css("left",-cloneNum*slideW) }
                        });
                    }break;// leftMarquee end

                case "topMarquee":
                    var tempTop = conBox.css("top").replace("px","");
                    if(index==0 ){
                        conBox.animate({"top":++tempTop},0,function(){
                            if( conBox.css("top").replace("px","")>= 0){ conBox.css("top",-conBoxSize*slideH) }
                        });
                    }
                    else{
                        conBox.animate({"top":--tempTop},0,function(){
                            if(  conBox.css("top").replace("px","")<= -(conBoxSize+cloneNum)*slideH){ conBox.css("top",-cloneNum*slideH) }
                        });
                    }break;// topMarquee end

            }//switch end
        }

        navObj.removeClass(titOn).eq(index).addClass(titOn);
        oldIndex=index;
        if( !pnLoop ){ //pnLoop控制前后按钮是否继续循环
            nextBtn.removeClass("nextStop"); prevBtn.removeClass("prevStop");
            if (index==0 ){ prevBtn.addClass("prevStop"); }
            if (index==navObjSize-1 ){ nextBtn.addClass("nextStop"); }
        }

        pageState.html( "<span>"+(index+1)+"</span>/"+navObjSize);

    };// doPlay end
    doPlay(true);

    $(".slideBox").hover(function(){ clearTimeout(rtnST) },function(){
        rtnST = setTimeout( function(){
            index=defaultIndex;
            if(defaultPlay){ doPlay(); }
            else{
                if( effect=="slideDown" ){ _tar.slideUp( delayTime, resetOn ); }
                else{ _tar.animate({opacity:"hide"},delayTime,resetOn ); }
            }
            oldIndex=index;
        },300 );
    });
var opp = false,interTime = 2500,playState = $(".pageStat");
    ///自动播放函数
    var setInter = function(time){ inter=setInterval(function(){  opp?index--:index++; doPlay() }, !!time?time:interTime);  }
    var setMarInter = function(time){ inter = setInterval(doPlay, !!time?time:interTime);  }
    //处理playState
    var playStateFun = function(){ clearInterval(inter); isMarq?setMarInter():setInter(); playState.removeClass("pauseState") }
    var pauseStateFun = function(){ clearInterval(inter);playState.addClass("pauseState"); }
    autoPaly = true;
//自动播放
    if (autoPlay) {
        if( isMarq ){
            opp?index--:index++; setMarInter();
            if(mouseOverStop) conBox.hover(pauseStateFun,playStateFun);
        }else{
            setInter();
            var mouseOverStop = true;
            if(mouseOverStop) slider.hover( pauseStateFun,playStateFun );
        }
    }
}(jQuery))