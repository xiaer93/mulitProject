/* *
 * Created by winack on 2018/1/16 
 */
//slide-one
(function () {
    var STATE_INITIAL=0;
    var STATE_START=1;
    var STATE_STOP=2;

    var DEFAULT_WIDTH=480;//幻灯片的宽度
    var index=1;//记录图片索引，编号从1开始！
    var duration=600;//动画的时间，匀速动画！
    var timeID;//动画函数的ID，用于停止动画！
    var autoID;//自动播放定时器！
    var state=STATE_INITIAL;

    var slide=document.querySelector('.m-slide');
    var imgBox=document.querySelector('.m-slide .imgs');
    var prev=document.querySelector('.m-slide .dir-prev');
    var next=document.querySelector('.m-slide .dir-next');
    var btns=document.querySelector('.m-slide .btns');
    var btnc=Array.prototype.slice.apply(btns.getElementsByTagName('span'));
    state=STATE_STOP;
    slide.onmouseover=function () {
        //暂停自动播放！
        clearTimeout(autoID);
    };
    slide.onmouseout=function () {
        autoRun();
    };
    prev.onclick=function () {
        if(state===STATE_INITIAL || state===STATE_START){
            return;
        }
        animate(index-1);
    };
    next.onclick=function () {
        if(state===STATE_INITIAL || state===STATE_START){
            return;
        }
        animate(index+1);
    };
    btns.addEventListener('click',function (event) {
        if(event.target.tagName.toLowerCase()==='span'){
            var target=parseInt(event.target.dataset.index);
            if(target){
                animate(target);
            }
        }
    },false);//冒泡事件
    function animate(target) {
        var offset=DEFAULT_WIDTH*(index-target);
        var left=imgBox.offsetLeft;//通过offsetLeft获取left的值！
        //var left=parseInt(imgBox.style.left);如果没有设置行内样式，则无法正确取值！

        //修改index即动画状态！
        index=target;
        state=STATE_START;

        /**
         * 动画函数，间隔时间被调用！
         * @param time 动画已经执行的时长！
         */
        function taskFn(time) {
            var step=offset>0?Math.min(time/duration*offset,offset):Math.max(time/duration*offset,offset);
            imgBox.style.left=left+step+'px';
            //console.log(time);
            if(step===offset){
                callback();
            }
        }
        /**
         * 动画执行完后的回调函数
         */
        function callback() {
            //如果滑动到极限处，则更正index值,并修改imgBox的位置！
            if(index===0){
                index=5;
                imgBox.style.left=-index*480+'px';
            }else if(index===6){
                index=1;
                imgBox.style.left=-index*480+'px';
            }
            //对应图片的小圆点点亮！
            btnc.forEach(function (t, number, ts) {
               if(parseInt(t.dataset.index)===index){
                   t.classList.add('z-choose');
               } else{
                   t.classList.remove('z-choose');
               }
            });
            state=STATE_STOP;
            cancelAnimationFrame(timeID);
        }
        startAnimation(taskFn);
    }
    /**
     * 创建动画，并向函数传入已经执行的时间！
     * @param taskFn 待执行的动画！
     */
    function startAnimation(taskFn) {
        var left=parseInt(imgBox.style.left);
        timeID=requestAnimationFrame(_go);
        var startTime=+new Date();
        function _go() {
            timeID=requestAnimationFrame(_go);
            var nowTime=+new Date();
            var time=nowTime-startTime;
            taskFn(time);//传入累计耗时！
        }
    }
    /**
     * 自动播放函数
     */
    function autoRun() {
        function _go() {
            autoID=setTimeout(function () {
                animate(index+1);
                _go();
            },3000);
        }
        autoID=setTimeout(_go,3000);
    }
    /* 调用函数 */
    var requestAnimationFrame=(function () {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback,1000/25);
            }
    })();
    var cancelAnimationFrame=(function () {
        return window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            function (timeID) {
                clearTimeout(timeID);
            }
    })();
    /* 自动播放 */
    autoRun();
})();

//slide-two
(function () {
    var data=[{
            img:'../source/imgNew/1.jpg',
            h3:'Hello',
            h4:'world'
        },{
            img:'../source/imgNew/2.jpg',
            h3:'Hello',
            h4:'world'
        },
        {
            img:'../source/imgNew/3.jpg',
            h3:'Hello',
            h4:'world'
        },
        {
            img:'../source/imgNew/4.jpg',
            h3:'Hello',
            h4:'world'
        },
        {
            img:'../source/imgNew/5.jpg',
            h3:'Hello',
            h4:'world'
        },
        {
            img:'../source/imgNew/6.jpg',
            h3:'Hello',
            h4:'world'
        },{
            img:'../source/imgNew/7.jpg',
            h3:'Hello',
            h4:'world'
        }
    ];

    /**
     * 页面加载完后，通过函数加载数据，重新生成页面！
     */
    function createHtml() {
        var main=document.querySelector('.m-slide-new .main');
        var ctrl=document.querySelector('.m-slide-new .ctrs');

        // language=JSRegexp
        var mainHtml=main.innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
        var ctrlHtml=ctrl.innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');

        var mainOut=[],
            ctrlOut=[];

        data.forEach(function (t, number) {
            var mainTmp=mainHtml,
                ctrlTmp=ctrlHtml;

            //图片的索引从 1 开始
            mainTmp=mainTmp.replace(/{{index}}/g,number+1).
                    replace(/{{img}}/g,t.img).
                    replace(/{{h3}}/g,t.h3).
                    replace(/{{h4}}/g,t.h4).
                    replace(/{{right}}/g,(number%2)?'':'main-item-right');//左右左右
            mainOut.push(mainTmp);

            ctrlTmp=ctrlTmp.replace(/{{index}}/g,number+1).
            replace(/{{img}}/g,t.img);
            ctrlOut.push(ctrlTmp);
        });
        //增加高亮显示块
        ctrlOut.push('<span class="ctrs-item-choose"></span>');
        //增加背景，避免过度时body背景被显现！
        mainOut.unshift('<div class="main-item main-item-bg"></div>');

        main.innerHTML=mainOut.join('');
        ctrl.innerHTML=ctrlOut.join('')

        setTimeout(function () {
            updateHtml();
        },50)
    }

    function updateHtml() {
        var main=document.querySelector('.m-slide-new .main .main-item');
        var mainItem=document.querySelectorAll('.m-slide-new .main .main-item img');
        mainItem=Array.prototype.slice.apply(mainItem);

        var heightParent=main.offsetHeight;

        mainItem.forEach(function (t, number) {
            var height=t.offsetHeight;
            var changes=(height-heightParent)/2;

            t.style.top=-changes+'px';

        })
    }

    function choose(index) {
        var mainItems=document.querySelectorAll('.m-slide-new .main .main-item');
        mainItems=Array.prototype.slice.apply(mainItems);
        var mainItemBg=document.querySelector('.m-slide-new .main .main-item-bg');
        mainItems.forEach(function (t) {
            if(t.classList.contains('main-item-active')){
                mainItemBg.innerHTML=t.innerHTML;
            }
            t.classList.remove('main-item-active')
        });


        var mainItem=document.querySelector('.m-slide-new .main .main-item-'+index);
        mainItem.classList.add('main-item-active');

        //控制按钮颜色
        var ctrlItem=document.querySelectorAll('.m-slide-new .ctrs .ctrs-item');
        ctrlItem=Array.prototype.slice.apply(ctrlItem);
        var slider=document.querySelector('.m-slide-new .ctrs .ctrs-item-choose');
        ctrlItem.forEach(function (t) {
            var tmp=t.dataset.index;
            if(tmp===index){
               slider.style.left= t.offsetLeft+'px';
               //退出函数！
               return;
            }
        });
    }

    window.onload=function () {
        createHtml();
        var ctrl=document.querySelector('.m-slide-new .ctrs');

        ctrl.addEventListener('click',function (event) {
            var target=null;
            if(event.target.tagName.toLowerCase()==='img'){
                target=event.target.parentNode;
            }else{
                target=event.target;
            }

            if(target.tagName.toLowerCase()==='a'){
                var index=target.dataset.index;
                choose(index);
            }
        },false);

        setTimeout(function () {
            choose("1");
        },50);
    };

    var resizeID;
    window.document.body.onresize=function () {
        clearTimeout(resizeID);
        resizeID=setTimeout(function () {
            updateHtml();
        },600)
    }
})();