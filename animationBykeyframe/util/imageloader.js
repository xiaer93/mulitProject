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