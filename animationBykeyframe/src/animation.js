/* Created by winack on 2018/1/5 */

'use strict';

/*帧函数动画库*/
function Animation() {

    if(!(this instanceof Animation)){
        return new Animation();
    }

    //公有方法无法访问私有变量
    var _index=0,
        _repeates=0,
        _times=Infinity,
        _img=null,
        _imgLen=0,
        _durations=0,
        _positions=[],
        _element=null;

    //状态
    var _stoped=false;

    //回调函数
    var _frameCallback=null,
        _animationCallback=null,
        _waitDuration=0;

    var _task=new Chain();
    //console.log(this);此处为Animation
    var that=this;

    /*执行动画！*/
    var _run=function() {
        var _go=function () {
            //如果暂停，则返回！
            if(_stoped) return;

            var position=_positions[_index].split(' ');
            _element.style.backgroundPosition=position[0]+'px '+position[1]+'px';
            _index+=1;
            if(_index>=_imgLen){
                _repeates+=1;
                if(isFinite(_times) && _repeates>_times){
                    //运行指定次数后暂停动画！
                    _repeates=0;
                    _index=0;
                    that.stop();
                    //如果延时_waitDuration不为零，则添加延时
                    if(_waitDuration!==0){
                        _task.wait(_waitDuration);
                    }
                    //动画执行完后调用函数！(这些参数都存储在Animation类的全局中！推荐使用参数传递！)
                    if(_animationCallback){
                        _addTask(_animationCallback,[]);
                    }
                }else{
                    _index=0;
                }
            }

            //每一帧结束后调用回调函数
            if(_frameCallback) _frameCallback();

            //执行动画！_go的执行环境将为window
            setTimeout(_go,_durations);
        };
        _addTask(_go,arguments);
    };

    /*通过此函数加载到队列中，会自动执行*/
    var _addTask=function (fn,args) {
        //console.log(this);//此时的执行环境为window！???
        //console.log(this);
        _task.push(that,fn,args);
        _task.lode(50);
    };

    this.loadImage=function (imgUrl) {
        function _go(url) {
            /*图片异步加载！*/
            _img=new Image();
            _img.src=url;
            //图片需要加载完成再进行操作
            _img.onload=function () {
                console.log('图片加载完成！');
            };
        }
        _addTask(_go,arguments);
        return this;
    };

    this.changePosition=function (ele,positions) {
        _imgLen=positions.length;
        _positions=positions;
        _element=ele;

        function _go() {
            console.log('给元素设置背景图片！');
            _element.style.backgroundImage='url('+_img.src+')';
            _element.style.backgroundRepeat='no-repeat';
        }
        _addTask(_go,arguments);
        return this;
    };

    this.enterFrame=function (callback) {
        var _go=function (t) {
            _frameCallback=t;
        };
        _addTask(_go,arguments);
        return this;
    };

    this.repeate=function (times) {
        var _go=function (t) {
            _times=t;
        };
        _addTask(_go,arguments);
        return this;
    };

    this.wait=function (duration) {
        var _go=function (t) {
            _waitDuration=t;
        };
        _addTask(_go,arguments);
        return this;
    };

    this.then=function (callback) {
        var _go=function (t) {
            _animationCallback=t;
        };
        _addTask(_go,arguments);
        return this;
    };

    /*
    *   控制函数同样可以参与队列？
    *   动画使用过setTimeout实现的，属于异步事件，所以不会阻塞_tasks对象！
    * */
    this.start=function (duration) {
        _durations=duration/_imgLen;
        _stoped=false;
        _run();
        _task.start();
    };
    this.stop=function () {
        _stoped=true;
    };

    return this;
}

/*任务链*/
var Chain=function () {
    var _tasks=[];
    var _tasksLen=_tasks.length;
    var _next=null;
    var _stoped=false;

    var run=function (method,callback) {
        //stoped为true时暂定执行！同时_next储存着待执行的函数！
        if(_stoped) return;

        //如果为数值，则延时执行下一个函数！
        if(typeof method==='number'){
            if(callback){
                setTimeout(callback,method);
            }
            return ;
        }

        var obj=method['obj'],
            fn=method['fn'],
            args=method['args'] || [];

        //绑定函数！
        fn.apply(obj,args);

        //（同步任务执行完后就会报告完成！）
        console.log('执行完成：',fn);
        if(callback) callback();
    };
    var next=function () {
        //tasks任务队列为空时，退出递归！
        if(_tasks.length===0){
            _next=null;
            return;
        }
        _next=_tasks.shift();
        run(_next,next);
    };

    this.push=function(obj,fn,args){
        var method={
            'obj':obj,
            'fn':fn,
            'args':args
        };
        _tasks.push(method);
        _tasksLen=_tasks.length;
    };
    this.wait=function (duration) {
       if(typeof duration==='number'){
           _tasks.push(duration);
           _tasksLen=_tasks.length;
       }else{
           throw new Error('延时必须为数值！');
       }
    };
    this.start=function () {
        if(_tasks.length>0 || _next){
            _stoped=false;
            run(_next||_tasks.shift(),next);
        }
    };
    this.pause=function () {
        _stoped=true;
    };
    this.stop=function () {
        _stoped=true;
        _tasks.length=0;
        _next=null;
    };
    /*当规定时间内没有加载任何任务，则开始执行任务队列！*/
    this.lode=function (duration) {
        var that=this;
        setTimeout(function () {
            if(_tasksLen===_tasks.length){
                that.start();
            }
        },duration);
    }
};

/*打印模拟*/
var print=function () {
  var _msg='';
  var _task=new Chain();
  this.addMsg=function (msg) {
      var add=function (msg) {
          _msg=msg;
      };
      _task.push(this,add,arguments);
      return this;
  };
  this.printMsg=function () {
      var print=function () {
          alert(_msg);
      };
      _task.push(this,print);
      return this;
  };
  this.start=function () {
      _task.start();
  };

  return this;
};