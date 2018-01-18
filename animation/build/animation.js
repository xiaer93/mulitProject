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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* *
 * Created by winack on 2018/1/6 
 */
var animation=__webpack_require__(1);

//图片
var images = ['rabbit-big.png', 'rabbit-lose.png', 'rabbit-win.png'];
images.forEach(function (t, number, ts) {
    ts[number]='../source/'+t;
});

var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
var leftRunningMap = ["0 -373", "-175 -376", "-350 -377", "-524 -377", "-699 -377", "-873 -379"];
var rabbitWinMap = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];
var rabbitLoseMap = ["0 0", "-163 0", "-327 0", "-491 0", "-655 0", "-819 0", "0 -135", "-166 -135", "-333 -135", "-500 -135", "-668 -135", "-835 -135", "0 -262"];

//rabbit
function $(id) {
    return document.getElementById(id);
}
var rabbit1=$('rabbit1');
var rabbit2=$('rabbit2');
var rabbit3=$('rabbit3');
var rabbit4=$('rabbit4');

repeat();
run();
win();
lose();

//rabbit1
function repeat() {
    var demo=animation().loadImages(images).changePosition(rabbit1,rightRunningMap,images[0]).repeatForver();
    demo.start(80);
    
    var running=true;
    
    rabbit1.addEventListener('click',function () {
        if(running){
            demo.pause();
            running=false;
        }else {
            demo.restart();
            running=true;
        }
    })

}

//rabbit2
function run() {
    var speed=8;
    var interval=80;
    var frame=4;    //当前帧
    var frameLength=6; //帧动画总帧数
    var initLeft=50; //初始位置
    var finialLeft=300; //终点位置
    var right=true;

    rabbit2.style.backgroundRepeat='no-repeat';
    //循环播放帧，直到到达目的地！而changePosition是只播放一个循环就结束！
    var demo=animation().loadImages(images).enterFrame(
        function (success,time) {
            var ratio=time/interval,
                left,
                position;

            if(right){
                left=Math.min(initLeft+ratio*speed,finialLeft);
                position=rightRunningMap[frame].split(' ');
                if(left===finialLeft){
                    right=false;
                    success();
                    return;
                }
            }else{
                left=Math.max(finialLeft-speed*ratio,initLeft);
                position=leftRunningMap[frame].split(' ');
                if(left===initLeft){
                    right=true;
                    success();
                    return;
                }
            }
            //如果帧超过总帧数，则置位0！
            if(++frame===frameLength){
                frame=0;
            }
            rabbit2.style.backgroundImage='url('+images[0]+')';
            rabbit2.style.backgroundPosition=position[0]+'px '+position[1]+'px';
            rabbit2.style.left=left+'px';
        }
    ).repeat(2).wait(1000).changePosition(rabbit2, rabbitWinMap, images[2]).then(function () {
        console.log('Run animation finish');
    });
    demo.start(interval);

}

//rabbit3
function win() {
    var demo=animation().loadImages(images).changePosition(rabbit3,rabbitWinMap,images[2]).repeat(3).then(function () {
        console.log('Win repeat 3 times and finished');
        demo.dispose();
    });
    demo.start(200);
}

//rabbit4
function lose() {
    var demo=animation().loadImages(images).changePosition(rabbit4,rabbitLoseMap,images[1]).then(function () {
        console.log('Lose animation finished');
        demo.dispose();
    });
    demo.start(200);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* *
 * Created by winack on 2018/1/5 
 */



//版本号
var __VERSION__=1.0;

var loadImage=__webpack_require__(2);
var timeLine=__webpack_require__(3);

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
/* 2 */
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
/* 3 */
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

/***/ })
/******/ ]);