/* *
 * Created by winack on 2018/1/6 
 */
var animation=require('./animation');

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