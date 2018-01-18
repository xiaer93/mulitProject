/* *
 * Created by winack on 2018/1/5 
 */

'use strict';

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