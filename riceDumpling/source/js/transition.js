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