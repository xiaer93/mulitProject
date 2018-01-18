(function () {

    var COLS=2;
    var MAXP=26;

    window.onload=function () {
        debugger;
      waterfall("main","img-box");
    };
    window.onscroll=function () {
        if(checkScroll("main","img-box")){
            var oParent=document.getElementById("main");
            var oBoxs=getEleByClass(oParent,"img-box");

            var index=oBoxs.length;

            for(var i=0;i<COLS && index<=MAXP;++i){
                index+=1;
                var box=oBoxs[0].cloneNode(true);
                var imgOld=box.getElementsByTagName('img')[0];
                var img=document.createElement('img');
                img.src='../source/img/'+index+'.jpg';/*直接替换产生了闪变*/
                box.firstElementChild.replaceChild(img,imgOld);
                oParent.appendChild(box);
            }
            /*图片尚未加载完成就执行waterfall，会造成排版错乱*/
            waterfall("main","img-box");
        }
    };

    /*
    *   @param  [id]    parent
    *   @param  [class] clsName
    * */
    var waterfall=function (parent,clsName) {
        var oParent=document.getElementById(parent);
        var oBoxs=getEleByClass(oParent,clsName);

        var oWidth=Math.floor(document.body.clientWidth/COLS);
        var hArr=[];

        for(var i=0,len=oBoxs.length;i<len;i++){
            if(i<COLS){
                oBoxs[i].style.cssText='width:'+oWidth+'px;left:'+oWidth*i+'px;top:0;';
                hArr.push(oBoxs[i].offsetHeight);
            }else{
                var min=getMinIndex(hArr);
                oBoxs[i].style.cssText='width:'+oWidth+'px;left:'+oWidth*min+'px;top:'+hArr[min]+'px';
                hArr[min]+=oBoxs[i].offsetHeight;
            }
        }

    };
    var getEleByClass=function (oParent,clsName) {
        return oParent.querySelectorAll('.'+clsName);
    };
    var checkScroll=function (parent,clsName) {
        var oParent=document.getElementById(parent);
        var oBoxs=getEleByClass(oParent,clsName);

        var oLastBox=oBoxs[oBoxs.length-1].offsetTop+Math.floor(oBoxs[oBoxs.length-1].offsetHeight/2);
        var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
        var height=document.documentElement.clientHeight || document.body.clientHeight;
        return (oLastBox<scrollTop+height);
    };
    var getMinIndex=function (arr) {
        var min=arr[0],
            index=0;
        arr.forEach(function (t, number) {
            if(t<min){
                min=t;
                index=number;
            }
        });
        return index;
    };
})();