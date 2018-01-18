# 通过js实现帧动画效果！

- 核心原理：
    - 关键帧

- 实现方法
    - gif
    - css3 animation
    - javascript
  
- gif和css3不足
    - 不能灵活的控制动画暂停播放！
    - 不能捕捉到事件完成！（gif）
    - 不能对帧动画做更加灵活扩展（gif和css3）
    
- js实现原理
    - 如果有多帧图片，通过img的src属性定时加载！（不推荐！）
    - 把关键帧放在一张图片中，通过background-position改变图片位置！（推荐！）
    
- 编程的思路：
    - 需求分析：
        - 支持图片预加载
        - 支持2中播放方式，背景定位和src属性
        - 支持自定义循环次数
        - 支持动画队列，一个执行完再执行另外一个
    - 编程接口
        - loadImage(imageList) 预加载图片
        - changePosition(ele,positions,imageUrl) 通过position属性的帧动画
        - changeSrc(ele,imageList) 通过src属性的帧动画
        - enterFrame(callback) 每一帧执行的函数
        - repeat(times) 动画循环次数
        - repeatForver() 永久循环
        - wait(duration) 动画执行完后的延时函数
        - then(callback) 动画执行完后的回调函数
        - start() 开始动画
        - pause() 暂停
        - restart() 接着暂停任务开始
        - dispose() 释放资源
    - 调用方式
        - var demo=animation().loadImage().changePosition().repeat().wait().then();
    - 代码设计
        - 链式调用，返回this！
        - 同步任务和异步任务链！
        
- 帧动画两种结束形式
    - 动画循环一次结束！（帧循环一次）
    - 位移达到目标值结束！（帧可能循环多次）
    
- 缓存机制》？？？
- 抽象，将共用代码抽象提炼出来！（将重复性劳动提炼出来！）
   