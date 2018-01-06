(function () {

    var COLS=2;
    var MAXP=26;

    //全局变量，存储每列的高度！
    var hArr=[];
    var oWidth=Math.floor(document.body.clientWidth/COLS);
    var flag=0;

    window.onload=function () {
        debugger;
      waterfall("main","img-box");
    };
    window.onscroll=function () {
        if(flag===0 && checkScroll("main","img-box")){
            var oParent=document.getElementById("main");
            var oBoxs=getEleByClass(oParent,"img-box");

            var index=oBoxs.length;
            var i,len,j,box,img;

            for(i=0,j=index;i<COLS && j<MAXP;++i){
                j+=1;
                flag+=1;
                box=oBoxs[0].cloneNode(true);
                box.classList.add('update');
                img=box.getElementsByTagName('img')[0];
                img.src='../source/img/'+j+'.jpg';/*直接替换产生了闪变*/
                oParent.appendChild(box);

                /*
                //box将只会指向最后被添加的对象！
                img.onload=function () {
                    updatePos(box);
                    img.onload=null;
                    flag-=1;
                }*/
            }
            /*图片尚未加载完成就执行waterfall，会造成排版错乱*/
            //waterfall("main","img-box");

            var oUpdate=getEleByClass(oParent,"update");
            for(i=0,len=oUpdate.length;i<len;i++){
                img=oUpdate[i].getElementsByTagName('img')[0];
                (function (index) {
                    img.onload=function (event) {
                        updatePos(oUpdate[index],function () {
                            flag-=1;
                        });
                    };
                    console.log(img.src);
                })(i);
            }

        }
    };

    /*
    *   @param  [id]    parent
    *   @param  [class] clsName
    * */
    var waterfall=function (parent,clsName) {
        var oParent=document.getElementById(parent);
        var oBoxs=getEleByClass(oParent,clsName);

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
    var updatePos=function (ele,callback) {
        var min=getMinIndex(hArr);
       // ele.style.cssText='width:'+oWidth+'px;left:'+oWidth*min+'px;top:'+hArr[min]+'px';
        ele.style.cssText='width:'+oWidth+'px;left:'+oWidth*min+'px;';
        transition(ele,hArr[min],callback);

        hArr[min]+=ele.offsetHeight;

    };
    var getEleByClass=function (oParent,clsName) {
        return oParent.querySelectorAll('.'+clsName);
    };
    var checkScroll=function (parent,clsName) {
        var oParent=document.getElementById(parent);
        var oBoxs=getEleByClass(oParent,clsName);
        //取最后一个box作为滚动判断条件，是否有误差？
        var oLastBox=oBoxs[oBoxs.length-1].offsetTop + oBoxs[oBoxs.length-1].offsetHeight - 20;
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
    var transition=function (ele,top,callback) {
        ele.style.top=top+20+'px';
        setTimeout(function () {
            ele.classList.add('on');
            ele.style.top=top+'px';
            setTimeout(function () {
                ele.classList.remove('on');
                callback();
            },1200)
        },20)
    }
})();