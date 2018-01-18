/* *
 * Created by winack on 2018/1/9 
 */

var nav=document.getElementsByClassName('st-nav')[0];
var nowBox;

nav.addEventListener('click',function (event) {
    var id=event.target.id;
    switch (id){
        case 'st-nav-p1':
            changePosition(0,'st-pannel-1');
            break;
        case 'st-nav-p2':
            changePosition(1,'st-pannel-2');
            break;
        case 'st-nav-p3':
            changePosition(2,'st-pannel-3');
            break;
        case 'st-nav-p4':
            changePosition(3,'st-pannel-4');
            break;
        case 'st-nav-p5':
            changePosition(4,'st-pannel-5');
            break;
    }
},false);

function changePosition(index,target) {

    if(nowBox && nowBox!==target){
        var initBox=document.getElementById(nowBox);
        var initH=initBox.getElementsByTagName('h2')[0];
        initH.className='up';
        var initP=initBox.getElementsByTagName('p')[0];
        initP.className='down';
    }

    var height=document.getElementById('st-pannel-1').offsetHeight;
    var main=document.getElementsByClassName('st-main')[0];
    main.style.transform='translate3d(0,-' +index*height+ 'px,0)';

    var box=document.getElementById(target);
    var h=box.getElementsByTagName('h2')[0];
    h.className='';
    var p=box.getElementsByTagName('p')[0];
    p.className='';
    nowBox=target;
}

window.onload=function () {
    var box=document.getElementById('st-pannel-1');
    var h=box.getElementsByTagName('h2')[0];
    h.className='';
    var p=box.getElementsByTagName('p')[0];
    p.className='';
};