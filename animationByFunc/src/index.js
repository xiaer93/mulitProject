'use strict';

var Animation=function () {
    /*
    *   function    获取元素的属性值
    *   @param  elementNode ele
    *   @param  attr        atr
    *   @return
    * */
  var getStyle=function (ele,attr) {
      var ret;
      //获取绝对尺寸？
      if(getComputedStyle){
          ret=getComputedStyle(ele)[attr];
      }else{
          ret=ele.currentStyle(attr);
      }
      return parseFloat(ret);
  } ;

  /*
  *     function    开始动画
  * */
  var _startNormal=function (ele,attr,target,callback) {
      //清除对应的定时器
      clearInterval(ele.timer);
      var speed=10;
      var that=ele;

      ele.timer=setInterval(function () {
          //缓冲动画方法，通过计算目标值与当前值的差值，得出下一步变化的量！
          var curEle=getStyle(ele,attr);
          var tmp=(target - curEle)/speed;//渐慢型动画
          tmp=(attr==='opacity')?(tmp*100):tmp;
          //加速和减速对应于不同的方法
          var step=tmp>0?Math.ceil(tmp):Math.floor(tmp);

          if(curEle===target){
              clearInterval(ele.timer);
              if(callback){
                  callback(that);
              }
          }else{
              ele.style[attr]=curEle+((attr==='opacity')? (step/100):(step))+((attr==='opacity')?'':'px');
          }
      },30);

  };

  var _startAsc=function (ele,args,callback) {
      //清除对应的定时器
      clearInterval(ele.timer);
      var speed=10;
      var that=ele;

      ele.timer=setInterval(function () {
          //是否所有属性都到达目标值？
          var flag=true;
          Object.keys(args).forEach(function (t,index) {
              var attr=t;
              var target=args[t];
              var curEle=getStyle(ele,attr);
              var tmp=(target - curEle)/speed;//渐慢型动画
              tmp=(attr==='opacity')?(tmp*100):tmp;
              //加速和减速对应于不同的方法
              var step=tmp>0?Math.ceil(tmp):Math.floor(tmp);

              if(curEle!==target){
                  flag=false
              }
              ele.style[attr]=curEle+((attr==='opacity')? (step/100):(step))+((attr==='opacity')?'':'px');
          });
          //如果都完成则清除定时器
          if(flag){
              clearInterval(ele.timer);
              if(callback){
                  callback(that);
              }
          }
      },30);

  };

  var start=function () {
      //借助apply传递arguments作为参数！（奇妙的apply！！！）
      if(typeof arguments[1]==='object'){
          return _startAsc.apply(null,arguments);
      }else{
          return _startNormal.apply(null,arguments);
      }
  };

  return start;
};