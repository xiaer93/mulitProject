/* *
 * Created by winack on 2018/1/9 
 */

(function ($) {
    var front=$('.front');
    var back=$('.back');
    var img=$('.listImg');
    var box=$('.box');

    var open=$('.open');
    var close=$('.close');

    $.Velocity.RegisterEffect('xiaer.slideUpIn',{
       defaultDuration:500,
        calls:[
            [{opacity:[1,0],translateY:[0,100]}, {options:{}}]
        ]
    });
    $.Velocity.RegisterEffect('xiaer.slideDownOut',{
        defaultDuration:500,
        calls:[
            [{opacity:[0,1],translateY:[100,0]}, {options:{}}]
        ]
    });
    $.Velocity.RegisterEffect('xiaer.clickIn',{
       defaultDuration:500,
       calls:[
           [{opacity:[1,0],scale:[1,0.3]}]
       ]
    });
    $.Velocity.RegisterEffect('xiaer.clickOut',{
        defaultDuration:500,
        calls:[
            [{opacity:[0,1],scale:[0.3,1]}]
        ]
    });

    var seqInit=[{
        e:box,
        p:'xiaer.slideUpIn',
        o:{
            delay:300,
            sequenceQueue:false
        }
    },{
        e:front,
        p:'xiaer.slideUpIn',
        o:{
            sequenceQueue:false,
        }
    }];

    //click打开事件
    var seqOpen=[{
        e:box,
        p:'xiaer.slideDownOut',
        o:{

        }
    },{
        e:front,
        p:'xiaer.slideDownOut',
        o:{
            sequenceQueue:false
        }
    },{
        e:box,
        p:'xiaer.slideUpIn',
        o:{
            delay:60
        }
    },{
        e:back,
        p:'xiaer.slideUpIn',
        o:{
            sequenceQueue:false
        }
    },{
        e:img,
        p:'xiaer.clickIn',
        o:{

        }
    }];

    var seqClose=[{
        e:img,
        p:'xiaer.clickOut',
        o:{
            sequenceQueue:false
        }
    },{
        e:box,
        p:'xiaer.slideDownOut',
        o:{
            sequenceQueue:false,
            delay:100
        }
    },{
        e:back,
        p:'xiaer.slideDownOut',
        o:{
            sequenceQueue:false
        }
    },{
        e:box,
        p:'xiaer.slideUpIn',
        o:{
            delay:60
        }
    },{
        e:front,
        p:'xiaer.slideUpIn',
        o:{
            sequenceQueue:false
        }
    }];

    $.Velocity.RunSequence(seqInit);

    open.on('click',function (event) {
        //阻止a标签默认事件！
        event.preventDefault();
        $.Velocity.RunSequence(seqOpen);
    });
    close.on('click',function (event) {
        event.preventDefault();
        $.Velocity.RunSequence(seqClose)
    });

})(jQuery);