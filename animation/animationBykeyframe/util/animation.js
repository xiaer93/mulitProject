/* *
 * Created by winack on 2018/1/5 
 */

'use strict';

//版本号
var __VERSION__=1.0;

var loadImage=require('./imageloader');
var timeLine=require('./timeLiner');

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
