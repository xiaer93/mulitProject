/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* *
 * Created by winack on 2018/1/7 
 */
var animation=__webpack_require__(5);
var transition=__webpack_require__(8);

function $(selectorText,contentText) {
    if(!(this instanceof $)){
        return new $(selectorText,contentText);
    }

    contentText=contentText || document;
    this.query=contentText.querySelectorAll(selectorText);
    this.query=Array.prototype.slice.apply(this.query);
}

$.prototype={
    consotructor:$,
    add:function (className) {
        this.query.forEach(function (t, number, ts) {
            t.classList.add(className);
        });
        return this;
    },
    remove:function (className) {
        this.query.forEach(function (t, number, ts) {
            t.classList.remove(className);
        });
        return this;
    },
    toggle:function (className) {
        this.query.forEach(function (t, number, ts) {
            t.classList.toggle(className);
        });
        return this;
    }
};


//主体程序
//场景1
var scene_1=function () {
    return {
        start:function () {
            $('.c_zongzi_inner').add('c_shake');
        },
        stop:function () {
            $('.c_zongzi_inner').remove('c_shake');
        }
    }
};

var scene_2=function (s1,s3) {
    var stringImgs=['line_1.png','line_2.png','line_3.png','line_4.png'];
    var stringPos=[110,140,190,260];
    stringImgs.forEach(function (t, number, ts) {
        ts[number]='../source/img/'+t;
    });
    //绳子动画
    var cString=document.getElementsByClassName('c_string')[0];
    var demo=animation().loadImages(stringImgs).enterFrame(function (success,time) {
        var index=Math.min(time/demo.interval | 0,stringImgs.length);
        cString.src=stringImgs[index-1];
        cString.style.top=stringPos[index-1]+'px';
        if(index===stringImgs.length){
            success();
        }
    }).repeat(1).wait(500).then(function () {
        //修改棕肉叶子的opacity属性值？
        $('.c_zongzirou_old').add('hide');
        $('.c_zongzirou_new').remove('hide');
        $('.leaf').remove('hide');
        $('.c_string').add('hide');

        //左侧文字动画
        $('.c_text>img').add('img_in');
        $('.c_text>p').add('p_in');
    }).wait(1500).then(function () {
        $('.c_right_leaf').add('right_leaf');
        $('.c_left_leaf').add('left_leaf');
    }).wait(1500).then(function () {
        $('.leaf').add('hide');
        $('.c_expand_leaf').remove('hide');
    }).wait(1000).then(function () {
        demo.dispose();
        //暂停前一个
        s1.stop();
        //启动后一个
        s3.start();
    });

    return{
        start:function () {
            demo.start(500);
        }
    }
};



//场景3
var scene_3=function () {
    var zongziImgs=['zzr_2.png','zzr_3.png','zzr_4.png','zzr_1.png'];
    zongziImgs.forEach(function (t, number, ts) {
        ts[number]='../source/img/'+t;
    });
    var zongziText=['t_jixiang.png','t_ruyi.png','t_xingfu.png'];
    zongziText.forEach(function (t,number,ts) {
        ts[number]='../source/img/'+t;
    });

    //文字帧动画，对应的class！
    var zongziText1=['c_text_step_2','c_text_step_3','c_text_step_4','c_text_step_0'];
    var zongziText2=['c_text_step_5','c_text_step_6','c_text_step_7','c_text_step_8'];

    var cz=document.getElementsByClassName('c_zongzirou_new')[0];
    var cz_t1=document.getElementById('c_text_1');
    var cz_t2=document.getElementById('c_text_2');
    var zongziLen=zongziImgs.length;
    var delay=4;
    var repeat=0;
    var count=0;
    var demo=animation().loadImages(zongziImgs).loadImages(zongziText).enterFrame(function (success,time) {
        var index=Math.min(time/demo.interval | 0,zongziLen);
        cz.src=zongziImgs[index-1];

        if(repeat%2){
            cz_t1.className=zongziText1[index-1]+' c_zongzi_text';
            cz_t2.className=zongziText2[index-1]+' c_zongzi_text';
        }else{
            cz_t1.className=zongziText2[index-1]+' c_zongzi_text';
            cz_t2.className=zongziText1[index-1]+' c_zongzi_text';
        }

        if(index===zongziLen){
            //暂停3帧，即动画暂停！
            count+=1;
            if(count===delay){
                if(repeat%2)
                    cz_t1.src=zongziText[repeat % 3];
                else
                    cz_t2.src=zongziText[repeat % 3];
                success();
                count=0;
                repeat=repeat+1;
            }
        }
    }).repeatForver();

    //棕情端午抖动
    $('.c_text_img').add('c_shake');

    return {
        start:function () {
            demo.start(2000/8);
        },
        stop:function () {
            demo.stop();
        },
        restart:function () {
            demo.restart();
        }
    }
};

debugger;
window.onload=function () {
    var s1=scene_1();
    var s3=scene_3();
    //过度动画！
    var s2=scene_2(s1,s3);
    //启动动画
    s1.start();

    var zold=document.getElementsByClassName('c_zongzirou_old')[0];
    var zstring=document.getElementsByClassName('c_string')[0];
    zold.onclick=zstring.onclick=function () {
        console.log('click');
        s2.start();
    };
};

/*;*/




/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* *
 * Created by winack on 2018/1/5 
 */



//版本号
var __VERSION__=1.0;

var loadImage=__webpack_require__(6);
var timeLine=__webpack_require__(7);

//animation标志位
var STATE_INITIAL=0;

var STATE_START=1;

var STATE_STOP=2;

//任务标志位
var TASK_SYNC=1;
var TASK_ASYNC=2;

/*var callBack=function (next) {
    next && next();
};*/

var Animation=function () {
    //
    this.taskQueue=[];
    this.index=0;
    this.timeline=new timeLine();
    this.state=STATE_INITIAL;
    this.interval=0;
};

Animation.prototype={
    constructor:Animation,
    /**
     * 执行函数队列下一个函数！
     * 通过this.index指向对应的函数！
     * @private
     */
    _nextTask:function (task) {
        //获取当前任务的延时。
        //this.taskQueue的有效性放在runTask中判断！
        //var wait=this.taskQueue[this.index].wait;
        var wait=task.wait;
        //指向下一个任务！
        this.index+=1;
        if(wait){
            var me=this;
            setTimeout(function () {
                me._runTask();
            },wait);
        }else{
            this._runTask();
        }
    },
    /**
     * 添加任务进队列！
     * @param taskFn 任务
     * @param type 任务类型
     * @returns {Animation}
     * @private
     */
    _addTask:function (taskFn,type) {
        this.taskQueue.push({
            taskFn:taskFn,
            type:type
        });
        return this;//返回this,执行链式调用！
    },
    /**
     * 执行任务
     * @private
     */
    _runTask:function () {
        if(this.state!==STATE_START || !this.taskQueue){
            return;
        }
        //程序运行一次后即销毁释放空间！
        if(this.index===this.taskQueue.length){
            this.dispose();
            return;
        }
        var task=this.taskQueue[this.index];
        //console.log(task.taskFn);
        if(task.type===TASK_SYNC){
            this._sync(task);
        }else{
            this._async(task);
        }
    },
    _sync:function (task) {
        var me=this;
        var next=function () {
            me._nextTask(task);
        };
        var taskFn=task.taskFn;
        taskFn(next);//taskFn必须能执行回调函数！？？
    },
    _async:function (task) {
        var me=this;
        var enterFrame=function (time) {
            var taskFn=task.taskFn;
            var next=function () {
                //停止现有异步动画！
                me.timeline.stop();
                me._nextTask(task);
            };
            taskFn(next,time);
        };
        this.timeline.onenterFrame=enterFrame;
        //重新启动timeline！
        this.timeline.start(this.interval);
    },
    /**
     * 预加载
     * @param imageList 数组或对象，如[url,url]
     * @returns {*|Animation}
     */
    loadImages:function (imageList) {
        var taskFn=function (next) {
            //loadimage改变的数组的值，为什么要改变？
            loadImage(imageList.slice(),onload);

            //var onload=function (flag) 只声明，未定义！
            function onload(flag) {
                if(flag){
                    console.log('加载成功！');
                }else{
                    console.log('加载失败！');
                }
                //执行回调函数！
                next();
            }
        };
        var type = TASK_SYNC;
        return this._addTask(taskFn,type);
    },
    /**
     * 通过改变position实现帧动画
     * @param ele dom元素
     * @param positions 背景图片的定位,为数组！
     * @param imageUrl 背景图片的地址
     * @returns {*|Animation}
     */
    changePosition:function (ele,positions,imageUrl) {
        ele.style.backgroundRepeat='no-repeat';
        var len=positions.length;
        var taskFn=null;
        var type='';

        if(len){
            var me=this;
            /**
             * 通过改变position实现帧动画
             * @param next 动画执行完后的回调函数
             * @param time 动画当前执行了多长时间
             */
            taskFn=function (next,time) {
                //加载图片！
                if(imageUrl) ele.style.backgroundImage='url('+imageUrl+')';
                //console.log(time);
                //获得当前背景图片位置索引。总运行时间除以每帧间隔得到小数，与0去或运算得到实际帧数！（最大值为len，便于退出循环！）
                var index = Math.min(time / me.interval | 0, len);
                var position = positions[index - 1].split(' ');
                ele.style.backgroundPosition=position[0]+'px '+position[1]+'px';
                if(index===len){
                    next();//执行next回调函数！
                }
            };
            type=TASK_ASYNC;
        }else{
            //如果position为空则直接执行callback，从而执行队列中下一个函数！
            taskFn=me._nextTask;
            type=TASK_SYNC;
        }
        return this._addTask(taskFn,type);
    },
    /**
     * 通过改变src实现帧动画
     * @param ele dom元素（img对象！）
     * @param imageList 图片地址数组
     * @returns {*|Animation}
     */
    changeSrc:function (ele,imageList) {
        var taskFn=null;
        var type='';
        var len=imageList.length;
        if(len){
            var me=this;
            taskFn=function (next,time) {
                var index=Math.min(time/me.interval | 0,len);
                ele.src=imageList[index-1];
                if(index===len){
                    next();
                }
            };
            type=TASK_ASYNC;
        }else{
            taskFn=function (next) {
                next();
            };
            type=TASK_SYNC;
        }
        return this._addTask(taskFn,type);
    },
    /**
     * 添加一个异步任务，每一帧执行的任务函数！
     * @param taskFn
     * @returns {*|Animation}
     */
    enterFrame:function (taskFn) {
        return this._addTask(taskFn,TASK_ASYNC);
    },
    /**
     * 开始执行任务！
     * @param interval 异步定时任务的帧间隔？
     * @returns {Animation}
     */
    start:function (interval) {
        //过滤掉重复的start行为！
        if(this.state===STATE_START){
            return this;
        }
        if(!this.taskQueue || !this.taskQueue.length){
            return this;
        }

        this.state=STATE_START;
        this.interval=interval;
        
        this._runTask();
        return this;
    },
    /**
     * 暂停任务！
     * @returns {Animation}
     */
    pause:function () {
        if(this.state===STATE_START){
            this.timeline.stop();
            this.state=STATE_STOP;
        }
        return this;
    },
    /**
     * 完全停止任务！并释放资源
     */
    stop:function () {
        if(this.state!==STATE_INITIAL){
            this.dispose();
        }
    },
    /**
     * 接着暂停启动任务！
     * @returns {Animation}
     */
    restart:function () {
        if(this.state===STATE_STOP){
            this.timeline.restart();
            this.state=STATE_START;
        }
        return this;
    },
    dispose:function () {
        if(this.state!==STATE_INITIAL){
            this.state=STATE_INITIAL;
            this.taskQueue=null;
            this.timeline.stop();
            this.timeline=null;
        }
        return this;
    },
    /**
     *  定义动画重复次数！wait延时对他必须是无效的！
     * @param times 队列中上一个方法重复的次数！
     * @returns {*|Animation}
     */
    repeat:function (times) {
        var taskFn=null;
        var type='';
        var me=this;
        if(typeof times==='number'){
            taskFn=function (next) {
                if(--times){
                    //回退到上一个异步动画任务！
                    me.index-=1;
                    me._runTask();
                }
                else{
                    //次数重复完后，则执行队列中下一个函数！
                    next();
                }
            };
        }else{
            taskFn=function (next) {
                me.index-=1;
                me._runTask();
            };
        }
        type=TASK_SYNC;
        return this._addTask(taskFn,type);
    },
    repeatForver:function () {
        return this.repeat();
    },
    then:function (callback) {
        var taskFn=function (next) {
            callback();//需要传入什么进去？
            next();
        };
        var type=TASK_SYNC;
        return this._addTask(taskFn,type);
    },
    wait:function (duration) {
        if(this.taskQueue && this.taskQueue.length>0){
            //给任务绑定延时时间
            this.taskQueue[this.taskQueue.length-1].wait=duration;
        }
        return this;
    }
};

var createAnimation=function () {
    return new Animation();
};
createAnimation.version=__VERSION__;
module.exports=createAnimation;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/* Created by winack on 2018/1/5 */

/**
 * 获取独一无二的id值
 * @type {number}
 * @private
 */
var __id=0;
var getId=function () {
  return ++__id;
};

/**
 * 预加载图片的函数
 * @param imgList 加载图片的对象或者数组
 * @param callback 加载完后的回调函数
 * @param timeout 加载超时的时长
 */
function LoadImage(imgList,callback,timeout) {
    //超时标志
    var isTimeout=false;

    //照片计数
    var count=0;

    //超时定时器的ID
    var timerId=null;

    //加载状态
    var sucess=true;

    //遍历imglist
    for(var key in imgList){
        //过滤掉Prototype属性
        if(!imgList.hasOwnProperty(key)){
            continue;
        }
        var item=imgList[key];

        //期望获得的是{src:xxx}
        //为什么要修改imgList？
        if(typeof item==='string'){
            item=imgList[key]={
                src:item
            }
        }

        //如果item或src不存在，则继续循环！
        if(!item || !item.src){
            continue;
        }

        ++count;
        //创建Image对象
        item.id='_img_'+key+getId();
        //为什么要在window上注册item.id???
        item.img=window[item.id]=new Image();

        loadItem(item);
    }

    /**
     * 加载图片
     * @param item
     */
    function loadItem(item) {
        //记录item状态
        item.status='load';

        var img=item.img;
        img.src=item.src;

        img.onload=function () {
            sucess=sucess && true;
            item.status='loaded';
            done();
        };
        img.onerror=function () {
            sucess=false;
            item.status='error';
            done();
        };

        /**
         * 加载图片成功或失败调用done函数！
         * 定义在loadItem内，可以直接使用img！（定义作用域【可以使用外层对象】，和调用作用域【包括参数对象和this指针】）
         */
        function done() {
            img.onload=img.onerror=null;

            //删除注册在window上的对象
            try{
                delete window[item.id];
            }catch (e){
                ;
            }
            //全部都加载完成（包括成功失败），同时没有超时！
            if(!--count && !isTimeout){
                clearTimeout(timerId);
                callback(sucess);
            }
        }
    }

    //http加载img属于异步任务，不会阻塞程序的运行！
    //即是传入数组或对象为空，也传入success
    if(!count){
        callback(success);
    }else if(timeout){
        timerId=setTimeout(onTimeout,timeout);
    }

    /**
     * 超时函数
     */
    function onTimeout() {
        isTimeout=true;
        callback(false);
    }
}

//输出
module.exports=LoadImage;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* *
 * Created by winack on 2018/1/5 
 */



//定义标志位
var STATE_INITIAL=0,
    STATE_START=1,
    STATE_STOP=2;

//默认帧速
var DEFAULT_INTERVAL=1000/25;

var TimeLine=function () {

    this.animationHandler=0;
    this.state=STATE_INITIAL;
    this.interval=0;
};

TimeLine.prototype={
    constructor:TimeLine,
    start:function (interval) {
        if(this.state===STATE_START){
            return;
        }
        this.state=STATE_START;

        this.interval=interval || DEFAULT_INTERVAL;

        startAnimation(this,+new Date());
    },
    stop:function () {
        if(this.state!==STATE_START){
            return;
        }
        this.state=STATE_STOP;

        if(this.startTime){
            this.beUsed=+new Date()-this.startTime;
        }
        cancalAnimationFrame(this.animationHandler);
    },
    restart:function () {
        if(this.state===STATE_START){
            return;
        }
        if(!this.beUsed || !this.interval){
            return;
        }
        this.state=STATE_START;
        //将动画停止前的已经花费的时间计算上！无缝连接停止动画的状态！
        startAnimation(this,+new Date()-this.beUsed);
    },
    /**
     * 每一帧调用的函数！
     * @param time 动画从开始执行到现在的总时间！
     */
    onenterFrame:function (time) {
        
    }
};
/**
 * 创建动画
 * @param timeline
 * @param startTime
 */
var startAnimation=function (timeline,startTime) {
    var lastTime=+new Date();
    timeline.startTime=startTime;
    _nextTick.interval=timeline.interval;

    _nextTick();

    function _nextTick() {
        var now=+new Date();
        timeline.animationHandler=requestAnimationFrame(_nextTick);
        /**
         * 当大于timeLine所应以的时间，执行onenterFrame帧动画！
         */
        if((now-lastTime)>=timeline.interval){
            timeline.onenterFrame(now-startTime);
            lastTime=now;
        }
    }
};

/**
 * 获取requestAnimationFrame函数，添加函数！
 */
var requestAnimationFrame=(function () {
    return window.requestAnimationFrame||
        window.webkitRequestAnimationFrame||
        window.mozRequestAnimationFrame||
        window.oRequestAnimationFrame||
        function (callback) {
            window.setTimeout(callback,callback.interval || DEFAULT_INTERVAL);
        }
})();
/**
 *  获取cancalAnimationFrame函数，取消先前加入的动画帧函数！
 */
var cancalAnimationFrame=(function () {
    return window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        }
})();

module.exports=TimeLine;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

/* *
 * Created by winack on 2018/1/8 
 */

/**
 * 过渡动画库
 */
var STATE_INITIAL=0;
var STATE_START=1;
var STATE_STOP=2;

var TASK_SYNC=1;
var TASK_ASYNC=2;

function transition() {
    this.taskQueue=[];
    this.index=0;
    this.state=STATE_INITIAL;
}
transition.prototype={
    constructor:transition,
    _nextTask:function (task) {
        var me=this;
        this.index+=1;
        if(task.wait){
            setTimeout(me._runTask,task.wait);
        }else{
            me._runTask();
        }
    },
    _runTask:function () {
        //如果任务列表为空，或者执行完成，则复位退出！
        if(this.taskQueue.length===0 || this.index===this.taskQueue.length){
            //this.dispose();
            this.index=0;
            this.state=STATE_INITIAL;
            return;
        }

        var task=this.taskQueue[this.index];

        if(task.type===TASK_SYNC){
            this._sync(task);
        }else{
            this._async(task);
        }
    },
    /**
     * 执行同步任务，如wait等方法
     * @param task
     * @private
     */
    _sync:function (task) {
        var me=this;
        var taskFn=task.taskFn;
        var next=function () {
            me._nextTask(task);
        };
        //执行task任务,直接传入_nextTask，会由于this指向发生改变而错误！
        taskFn(next);
    },
    /**
     * 执行异步任务，为每个异步任务绑定一个requestAnimationFrame
     * @param task 待执行的异步任务
     * @private
     */
    _async:function (task) {
        var me=this;
        var next=function () {
            //停止当前任务的动画！
            cancalAnimationFrame(task.taskID);
            me._nextTask(task);
        };
        createTimeLine(task,next);
    },
    /**
     * 添加如任务队列
     * @param fn 任务的主体
     * @param type 任务的类型
     * @returns {transition}
     * @private
     */
    _addTask:function (fn,type) {
        this.taskQueue.push({
            taskFn:fn,
            type:type
        });
        return this;
    },
    /**
     * 单个属性变化
     * @param ele
     * @param propery
     * @param value
     * @param duration
     * @returns {*}
     * @private
     */
    _loadSingle:function (ele,propery,value,duration) {
        var currentValue,
            changes,
            flag=true;//正负标志，true为正！
        var taskFn=null;
        var type='';

        function update() {
            currentValue=parseInt(window.getComputedStyle(ele)[propery]);
            changes=value-currentValue;
            if(changes<0){
                flag=false;
                changes=-changes;
            }
        }
        var firstIn=true;
        taskFn=function (time, next) {
            if(firstIn){
                update();
                firstIn=false;
            }

            var step=Math.min(time/duration*changes,changes);
            //opacity属性不含单位，而宽高含有单位，因此需要对变化属性进行判断！
            if(propery==='opacity'){
                ele.style[propery]=currentValue+step*(flag?1:-1);
            }else{
                ele.style[propery]=currentValue+step*(flag?1:-1)+'px';
            }
            //变化完成
            if(step===changes){
                next();
            }
        };
        type=TASK_ASYNC;
        return this._addTask(taskFn,type);
    },
    /**
     * 多个属性同时变化！
     * @param ele dom元素
     * @param obj 属性对象，如{'width':300}
     * @param duration 动画时长！
     * @private
     */
    _loadMulit:function (ele,obj,duration) {
        //提取过渡属性及其值！
        var properysCount=0;
        var objProperys={};
        for(var key in obj){
            if(!obj.hasOwnProperty(key)){
                continue;
            }
            if(key && obj[key]){
                objProperys[key]=obj[key];
                properysCount+=1;
            }
        }
        //创建对象存储每个属性的特征值！
        var objCurrentPropery={},
            objChanges={},
            objFlag={};//正负标志，true为正！
        var taskFn=null;
        var type='';

        function update() {
            var style=window.getComputedStyle(ele);
            for(var key in objProperys){
                objCurrentPropery[key]=parseInt(style[key]);
                objChanges[key]=objProperys[key]-objCurrentPropery[key];
                if(objChanges[key]<0){
                    objFlag[key]=false;
                    objChanges[key]=-objChanges[key];
                }else{
                    objFlag[key]=true;
                }
            }
        }
        var firstIn=true;
        taskFn=function (time, next) {
            //首次执行该任务时，获取元素当前的状态！
            if(firstIn){
                update();
                firstIn=false;
            }
            //判断是否所有的属性都完成了动画！
            //有必要吗？
            var isFinish=properysCount;

            /**
             * propery变化的属性
             * value属性目标值
             * step变量的量（与时间正相关！）
             *
             * changes初始值和目标值的差值！
             * flag差值的正负！
             * currentValue初始值！
             */
            var propery,value,step;
            var changes,flag,currentValue;
            for(var key in objProperys){
                propery=key;
                currentValue=objCurrentPropery[propery];
                value=objProperys[propery];
                changes=objChanges[propery];
                flag=objFlag[propery];

                step=Math.min(time/duration*changes,changes);
                console.log(step);
                //opacity属性不含单位，而宽高含有单位，因此需要对变化属性进行判断！
                if(propery==='opacity'){
                    ele.style[propery]=currentValue+step*(flag?1:-1);
                }else{
                    console.log(currentValue+step*(flag?1:-1));
                    ele.style[propery]=currentValue+step*(flag?1:-1)+'px';
                }

                //变化完成
                if(step===changes){
                    isFinish-=1;
                }
            }
            //所有属性都完成，即执行下一个任务！
            if(!isFinish){
                next();
            }
        };
        type=TASK_ASYNC;

        return this._addTask(taskFn,type);
    },
    /**
     * 设置延时N秒再执行下一个任务！！
     * @param duration
     * @returns {transition}
     */
    wait:function (duration) {
        var len=this.taskQueue.length;
        if(len===0){
            return;
        }
        this.taskQueue[len-1].wait=duration;
        return this;
    },
    /**
     * 设置任务完成后调用函数！
     * @param callback
     */
    then:function (callback) {
        this.taskQueue.push(callback,TASK_SYNC);
    },
    /**
     * 设定过度动画
     * @returns {*}
     */
    load:function () {
        if(typeof arguments[1]==='object'){
            return this._loadMulit.apply(this,arguments);
        }else{
            return this._loadSingle.apply(this,arguments);
        }
    },
    start:function () {
        if(this.state===STATE_START){
            return;
        }
        this.state=STATE_START;
        this._runTask();
    },
    /**
     * 清空任务列表，释放资源！
     */
    dispose:function () {
        if(this.state!==STATE_INITIAL){
            //清除所有任务
            this.taskQueue.length=0;
            this.state=STATE_INITIAL;
        }
    }
};
/**
 * 绑定执行异步task任务！
 * @param task 待执行的异步任务
 * @param next 异步任务执行完后开启回调函数！
 */
var createTimeLine=function (task,next) {
    var startTime=+new Date();
    fn();

    function fn() {
        var now=+new Date();
        task.taskID=requestAnimationFrame(fn);
        //console.log(task.taskID);
        task.taskFn((now-startTime),next);//传入回调函数和运行时间！
    }
};
/**
 * 兼容获取定时函数，执行异步任务！
 * @returns {*|Function}
 */
var requestAnimationFrame=(function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (task) {
            return window.setTimeout(task,1000/60);
        }
})();
var cancalAnimationFrame=(function () {
    return window.cancalAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (taskId) {
            clearTimeout(taskId);
        }
})();

function createTransition() {
    return new transition();
}

module.exports=createTransition;

/***/ })
/******/ ]);