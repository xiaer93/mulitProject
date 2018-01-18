/* *
 * Created by winack on 2018/1/17 
 */

/*(function () {*/
    var DEFAULT_NAMESPACE="http://www.w3.org/2000/svg";
    var DEFAULT_SHAPE=['rect','circle','ellipse','line'];

    var SHAPE_OPTIONS={
        rect:{
           /* shape:'rect', */
            x:0,
            y:0,
            width:100,
            height:100
        },
        circle:{
            /* shape:'circle', */
            cx:50,
            cy:50,
            r:50
        },
        ellipse:{
            /* shape:'ellipse', */
            cx:50,
            cy:50,
            rx:50,
            ry:20
        },
        line:{
            /* shape:'line', */
            x1:20,
            y1:20,
            x2:50,
            y2:50
        }};
    var COMMON_OPTIONS={'stroke':"#000000",'stoke-width':2,'fill':"#000000"};

    var current=null;//指向选中的图形对象！
    var svg=document.getElementsByTagNameNS(DEFAULT_NAMESPACE,"svg")[0];
    var circle=svg.getElementsByTagName('circle')[0];

    function createShape(shapeName,options) {
        if(DEFAULT_SHAPE.indexOf(shapeName)===-1){
            return;
        }
        //var shape=document.createElement(shapeName);必须指定命名空间！与svg命名空间一致？
        var shape=document.createElementNS(DEFAULT_NAMESPACE,shapeName);
        updateShape(shape,options);
        svg.appendChild(shape);
        updateCtrl(options);
        current=shape;
    }

    /**
     * 给element设置options中定义的属性值！
     * @param element
     * @param options
     */
    function updateShape(element,options) {
        var own=options.own;
        var com=options.com;
        _us(com,'com');
        _us(own,'own');
        /* 影响重排重绘吗？ */
        function _us(op,tag) {
            var style='';
            for(var key in op){
                if(!op.hasOwnProperty(key)){
                    continue;
                }
                if(tag==='own'){
                    element.setAttribute(key,op[key]);
                }else{
                    style=style+key+':'+op[key]+';';
                }
            }
            if(tag==='com'){
                element.setAttribute('style',style);
            }
        }
    }

    /**
     * 刷新控制面板中的图形属性面板
     * @param options
     */
    function updateCtrl(options) {
        var com=options.com;
        var own=options.own;
        /* 刷新图形属性面板 */
        var max=svg.width.baseVal.value+'';
        /* 模版 */
        var p='<p class="u-ctrl u-ctrl-1">\n' +
            '<label for="svg-{{key}}">{{key}}</label><input id="svg-{{key}}" type="range" min="0" max='+max+' value='+'{{value}}'+'>\n' +
            '</p>';
        var tmpP='';
        var outP=[];
        for(var key in own){
            if(!own.hasOwnProperty(key)){
                continue;
            }
            tmpP=p.replace(/{{key}}/g,key).replace(/{{value}}/g,own[key]);
            outP.push(tmpP);
        }
        var fieldset=document.querySelector('.m-ctrl .ownProperty');
        var legend=fieldset.querySelector('legend');
        outP.unshift(legend.outerHTML);
        fieldset.innerHTML=outP.join('');

        /* 刷新公共属性面板 */
        var comP=document.querySelectorAll('.m-ctrl .comProperty input');
        comP=Array.prototype.slice.apply(comP);
        comP.forEach(function (t) {
            var key=t.id.slice(t.id.indexOf('-')+1);
            if(com[key]) t.value=com[key];
        })
    }

    /**
     * 读取element的相关属性
     * @param element
     * @returns {{}}
     */
    function getOptionsFromElement(element) {
        var options={};
        options.com={};
        options.own={};
        var key,tmp;
        for(key in COMMON_OPTIONS){
            tmp=element.getAttribute(key);
            options['com'][key]=tmp;
        }
        var op=SHAPE_OPTIONS[element.tagName.toLowerCase()];
        if(op){
            for(key in op){
                tmp=element.getAttribute(key);
                options['own'][key]=tmp;
            }
        }
        return options;
    }

    /**
     * 从面板读取options，元素目标指定？
     * @returns {{}}
     */
    function getOptionsFromPannel() {
        var ownP=document.querySelectorAll('.m-ctrl .ownProperty input');
        var comP=document.querySelectorAll('.m-ctrl .comProperty input');

        ownP=Array.prototype.slice.apply(ownP);
        comP=Array.prototype.slice.apply(comP);

        var options={};
        options.com={};
        options.own={};
        ownP.forEach(function (t) { _add(t,'own') });
        comP.forEach(function (t) { _add(t,'com') });

        function _add(ele,tag) {
            var key=ele.id.slice(ele.id.indexOf('-')+1);
            var value=ele.value;

            options[tag][key]=value;
        }
        return options;
    }


    /* 绑定事件 */
    //svg单击事件
    svg.addEventListener('click',function (e) {
        if(DEFAULT_SHAPE.indexOf(e.target.tagName.toLowerCase())===-1){
            return;
        }
        current=e.target;
        var op=getOptionsFromElement(current);
        updateCtrl(op);
    },false);

    //控件input事件，修改图形外观
    var fchangID=undefined;
    var ownFieldset=document.querySelector('.m-ctrl .ownProperty');
    var comFieldset=document.querySelector('.m-ctrl .comProperty');
    ownFieldset.addEventListener('input',fieldsetChange,false);
    comFieldset.addEventListener('input',fieldsetChange,false);
    function fieldsetChange() {
        //如果current没有指向值，则退出！
        if(!current){
            return;
        }
        clearTimeout(fchangID);
        fchangID=setTimeout(function () {
            var op=getOptionsFromPannel();
            updateShape(current,op);
        });
    }

    //控件click事件，创建新的形状
    var btn=document.querySelector('.m-ctrl .createShape');
    btn.addEventListener('click',function (e) {
        if(e.target.tagName.toLowerCase()!=='button'){
            return;
        }
        var options={};
        var name=e.target.name;
        options.own=SHAPE_OPTIONS[name];
        options.com={fill:'#000000',stroke:'#000000','stroke-width':5};
        createShape(name,options);
    },false);

    var frm=document.querySelector('.m-ctrl');
    frm.onsubmit=function (e) {
        e.stopPropagation();
        e.preventDefault();
    };

/*})();*/
