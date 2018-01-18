/*
*   帧动画
* */

var positions=['0 -854','-174 -852','-349 -852','-524 -852','-698 -852','-873 -848'];

function Animation(ele,pos,imgUrl) {
    ele.style.backgroundImage='url('+imgUrl+')';
    ele.style.backgroundRepeat='no-repeat';

    var index=0;
    function run() {
        var p=pos[index].split(' ');
        ele.style.backgroundPosition=p[0]+'px '+p[1]+'px';
        index++;

        if(index>=6)index=0;
        //定时调用！
        setTimeout(run,80);
    }
    run();
    //也可以通过setInterval实现！
    //setInterval(run,80);
}

debugger;
var rabit=document.getElementById('rabit');
Animation(rabit,positions,'../source/rabbit-big.png');