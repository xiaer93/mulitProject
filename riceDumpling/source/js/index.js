/* *
 * Created by winack on 2018/1/7 
 */
var animation=require('./animation');
var transition=require('./transition');

function $(selectorText,contentText) {
    if(!(this instanceof $)){
        return new $(selectorText,contentText);
    }

    contentText=contentText || document;
    this.query=contentText.querySelectorAll(selectorText);
    this.query=Array.prototype.slice.apply(this.query);
}

$.prototype={
    consotructor:$,
    add:function (className) {
        this.query.forEach(function (t, number, ts) {
            t.classList.add(className);
        });
        return this;
    },
    remove:function (className) {
        this.query.forEach(function (t, number, ts) {
            t.classList.remove(className);
        });
        return this;
    },
    toggle:function (className) {
        this.query.forEach(function (t, number, ts) {
            t.classList.toggle(className);
        });
        return this;
    }
};


//主体程序
//场景1
var scene_1=function () {
    return {
        start:function () {
            $('.c_zongzi_inner').add('c_shake');
        },
        stop:function () {
            $('.c_zongzi_inner').remove('c_shake');
        }
    }
};

var scene_2=function (s1,s3) {
    var stringImgs=['line_1.png','line_2.png','line_3.png','line_4.png'];
    var stringPos=[110,140,190,260];
    stringImgs.forEach(function (t, number, ts) {
        ts[number]='../source/img/'+t;
    });
    //绳子动画
    var cString=document.getElementsByClassName('c_string')[0];
    var demo=animation().loadImages(stringImgs).enterFrame(function (success,time) {
        var index=Math.min(time/demo.interval | 0,stringImgs.length);
        cString.src=stringImgs[index-1];
        cString.style.top=stringPos[index-1]+'px';
        if(index===stringImgs.length){
            success();
        }
    }).repeat(1).wait(500).then(function () {
        //修改棕肉叶子的opacity属性值？
        $('.c_zongzirou_old').add('hide');
        $('.c_zongzirou_new').remove('hide');
        $('.leaf').remove('hide');
        $('.c_string').add('hide');

        //左侧文字动画
        $('.c_text>img').add('img_in');
        $('.c_text>p').add('p_in');
    }).wait(1500).then(function () {
        $('.c_right_leaf').add('right_leaf');
        $('.c_left_leaf').add('left_leaf');
    }).wait(1500).then(function () {
        $('.leaf').add('hide');
        $('.c_expand_leaf').remove('hide');
    }).wait(1000).then(function () {
        demo.dispose();
        //暂停前一个
        s1.stop();
        //启动后一个
        s3.start();
    });

    return{
        start:function () {
            demo.start(500);
        }
    }
};



//场景3
var scene_3=function () {
    var zongziImgs=['zzr_2.png','zzr_3.png','zzr_4.png','zzr_1.png'];
    zongziImgs.forEach(function (t, number, ts) {
        ts[number]='../source/img/'+t;
    });
    var zongziText=['t_jixiang.png','t_ruyi.png','t_xingfu.png'];
    zongziText.forEach(function (t,number,ts) {
        ts[number]='../source/img/'+t;
    });

    //文字帧动画，对应的class！
    var zongziText1=['c_text_step_2','c_text_step_3','c_text_step_4','c_text_step_0'];
    var zongziText2=['c_text_step_5','c_text_step_6','c_text_step_7','c_text_step_8'];

    var cz=document.getElementsByClassName('c_zongzirou_new')[0];
    var cz_t1=document.getElementById('c_text_1');
    var cz_t2=document.getElementById('c_text_2');
    var zongziLen=zongziImgs.length;
    var delay=4;
    var repeat=0;
    var count=0;
    var demo=animation().loadImages(zongziImgs).loadImages(zongziText).enterFrame(function (success,time) {
        var index=Math.min(time/demo.interval | 0,zongziLen);
        cz.src=zongziImgs[index-1];

        if(repeat%2){
            cz_t1.className=zongziText1[index-1]+' c_zongzi_text';
            cz_t2.className=zongziText2[index-1]+' c_zongzi_text';
        }else{
            cz_t1.className=zongziText2[index-1]+' c_zongzi_text';
            cz_t2.className=zongziText1[index-1]+' c_zongzi_text';
        }

        if(index===zongziLen){
            //暂停3帧，即动画暂停！
            count+=1;
            if(count===delay){
                if(repeat%2)
                    cz_t1.src=zongziText[repeat % 3];
                else
                    cz_t2.src=zongziText[repeat % 3];
                success();
                count=0;
                repeat=repeat+1;
            }
        }
    }).repeatForver();

    //棕情端午抖动
    $('.c_text_img').add('c_shake');

    return {
        start:function () {
            demo.start(2000/8);
        },
        stop:function () {
            demo.stop();
        },
        restart:function () {
            demo.restart();
        }
    }
};

debugger;
window.onload=function () {
    var s1=scene_1();
    var s3=scene_3();
    //过度动画！
    var s2=scene_2(s1,s3);
    //启动动画
    s1.start();

    var zold=document.getElementsByClassName('c_zongzirou_old')[0];
    var zstring=document.getElementsByClassName('c_string')[0];
    zold.onclick=zstring.onclick=function () {
        console.log('click');
        s2.start();
    };
};

/*;*/


