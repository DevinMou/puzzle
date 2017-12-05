"use strict";
/*
 1.样式选择增亮与dom选择增亮冲突
 2.颜色选择数值拖选时位移
 3.margin移动和position移动未数值转换
 4.颜色选择输出值与输入值未一致
 5.颜色选择#fff时的细节问题
*/
(function(win){
    var _tool = {
        extend:function(obj,method){
            var t,i,_ta,_tb,_tbi,_tai,_this=this;
            if(!arguments.length){
                return null
            }
            else if(arguments.length === 1){
                method = arguments[0];
                obj = method&&method.constructor?new method.constructor:method;
            }
            if((t = typeof obj)!=='object'&&t!=='function'){return obj}
            function copy(a,b){
                _tb = _this.type(b);
                _ta = _this.type(a);
                if(_tb==='Object'||_tb==='Array'){
                    _ta = _ta === 'Function'?'Object':_ta;
                    _ta !== _tb&&(a = new b.constructor);
                    // _ta!=='Object'&&_ta!=='Function'&&_ta!=='Array'&&(a = _tb==='Object'?{}:[]);
                    for(i in b){
                        if(b.hasOwnProperty(i)){
                            _tbi = _this.type(b[i]);
                            a[i]&&(_tai = _this.type(a[i]));
                            if(_tbi==='Object'||_tbi==='Array'){
                                _tai !== _tbi&&(a[i] = new b[i].constructor);
                                // _tbi==='Object'&&_tai!=='Object'&&(a[i]={});
                                // _tbi==='Array'&&_tai!=='Array'&&(a[i]=[]);
                                a[i] = copy(a[i],b[i])
                            }
                            else {
                                a[i] = b[i]
                            }
                        }
                    }
                }else {
                    a = b
                }
                return a
            }
            obj = copy(obj,method);
            return obj
        },
        type:function(a){
            return /\[\w+\s+(\w+)]/.exec(({}).toString.call(a))[1]||'undefined'
        },
        rdm:function(){
            var _a = arguments,_k,_l;
            if(_a.length){
                var _t = _tool.type(_a[0]);
                if(_t === 'String'){
                    _k = _a[0];
                    _a[1]&&_tool.type(_a[1])==='Number'&&(_l = _a[1])
                }else if(_t === 'Number'){
                    _l = _a[0];
                    _a[1]&&_tool.type(_a[1])==='String'&&(_k = _a[1])
                }
            }
            _l = _l||8;
            var _u = Number('1e'+(_l-1)).toString().replace(/\S/g,function () {
                return (Math.random()*36|0).toString(36)
            });
            if(!_k||!this[_k]){return _u}
            if(this[_k].hasOwnProperty(_u)){
                _tool.rdm.apply(this,arguments)
            }else {
                return _u
            }
            },
        merge:function(a,b,c){
            var _m = function(x,y){
                if(!x&&!y){return false}
                var _tx,_ty,_z,i,_i;
                _tx = this.type(x);
                _ty = this.type(y);
                if(_tx === _ty){
                    _z = c?this.extend(y):null;
                    if(_tx === 'Object'){
                        _z = _z||{};
                        for(i in x){
                            if(x.hasOwnProperty(i)){
                                if(y.hasOwnProperty(i)){
                                    if(c&&!x[i]){
                                        delete _z[i]
                                    }else {
                                        _z[i] = _m(x[i],y[i])
                                    }
                                }else {
                                    _z[i] = this.extend(x[i])
                                }
                            }
                        }
                    }else if(_tx === 'Array'){
                        _z = _z||[];
                        for(i=0;i<x.length;i++){
                            _i = y.indexOf(x[i]);
                            if(_i>-1&&c){
                                _z[_i] = x[i]
                            }else {
                                _z.push(x[i])
                            }
                        }
                    }else {
                        _z = x
                    }
                }else {
                    _z = c?this.extend(y):this.extend(x)
                }
                return _z
            }.bind(this);
            return _m(a,b)
        },
        bindData:function(o,k,v,f){
            var _o = _tool.extend(o);
            if(!o.hasOwnProperty('_value')){
                Object.defineProperty(o,'_value',{
                    value:_o,
                    enumerable:false,
                    configurable:true
                });
            }
            if(!o.hasOwnProperty('_address')){
                Object.defineProperty(o,'_address',{
                    value:[],
                    enumerable:false,
                    configurable:true
                });
            }
            if(_tool.type(v)==='Object'){
                var _a = _tool.extend(o._address||[]);
                _a.push(k);
                o._value[k] = _tool.dataBind(_tool.extend(v), f,_a);
            }else {
                o._value[k] = v
            }
            (function (_k) {
                Object.defineProperty(o,_k,{
                    enumerable:true,
                    configurable:true,
                    get:function () {
                        return this._value[_k];
                    },
                    set:function (v) {
                        f.bind(this)(v,this._address);
                        var _a = _tool.extend(this._address||[]);
                        _a.push(_k);
                        if(_tool.type(v)==='Object'){
                            this._value[_k] = _tool.dataBind(v,f,_a)
                        }
                        else {
                            this._value[_k] = v;
                        }
                    }
                });
            })(k);
        },
        dataBind:function (o,fn,a) {
            if(_tool.type(o)==='Object'){
                var _o = _tool.extend(o);
                Object.defineProperty(o,'_value',{
                    value:_o,
                    enumerable:false,
                    configurable:true
                });
                Object.defineProperty(o,'_address',{
                    value:a?a:[],
                    enumerable:false,
                    configurable:true
                });
                for(var k in o){
                    var _t = _tool.type(o[k]);
                    if(o.hasOwnProperty(k)){

                        if(_t === 'Object') {
                            var _a = _tool.extend(a||[]);
                            _a.push(k);
                            o._value[k] = _tool.dataBind(_tool.extend(_o[k]), fn,_a);
                        }
                        else{
                            o._value[k] = _o[k]
                        }
                        (function (_k) {
                            Object.defineProperty(o,_k,{
                                enumerable:true,
                                configurable:true,
                                get:function () {
                                    return this._value[_k];
                                },
                                set:function (v) {
                                    fn.bind(this)(v,this._address);
                                    var _a = _tool.extend(this._address||[]);
                                    _a.push(_k);
                                    if(_tool.type(v)==='Object'){
                                        this._value[_k] = _tool.dataBind(v,fn,_a)
                                    }
                                    else {
                                        this._value[_k] = v;
                                    }
                                }
                            });
                          })(k);


                    }

                }
            }
            return o
        }
    };
    Array.prototype.remove = function (k) {
        var _al = arguments.length;
        return (function fn(k) {
        if(_al){
            var _i = this.indexOf(k);
            if(_i>-1){
                this.splice(_i,1);
                return fn.bind(this)(k)
            }else {
                return this
            }
        }else {
            return this.filter(function (a, b, c) {
                return c.indexOf(a) === b
            })
        }

          }).bind(this)(k)
    };
    win._tool = _tool;
    var document = win.document;
    var domChangePool = function () {
        return new domChangePool.init()
    };
    domChangePool.init = function () {
        var _this = this;
        this.domObserver = new MutationObserver(function(){
            _this.renderComplete = true;
            _this.dealCallback();
            _this.render();
        });
        this.domObserver.observe(document.body, {childList: true, attributes: true, characterData: true, subtree: true})
    };

    domChangePool.init.prototype = {
        /*
          {
            uuid:'...',
            element:$(...),
            // clone:true|false,
            action:'append|remove|replace|before',
            relative:{parent:$(...),site:$(...)},
            style:{...},
            event:{...},
            callback:[...]
          }
        */
        pool:[],
        callback:[],
        renderComplete:true,
        dealCallback:function(){
            if(this.callback.length){
                var _this=this,_c = _this.callback.splice(0,_this.callback.length),
                    promise = new Promise(function(resolve){
                        for(var i=0;i<_c.length;i++){
                            _c[i]()
                        }
                        resolve()
                });
                promise.then(function(){
                    _this.dealCallback()
                });
                return true
            }else {
                return false
            }

        },
        add:function(data,flag){
            if(data.uuid&&data.element){
                this.pool.push(data);
                data.callback&&data.callback.length>0&&(this.callback=this.callback.concat(data.callback));
                flag!==false&&this.render()
            }
        },
        domObserver:null,
        render:function(){
            if(!this.renderComplete){return false}
            if(this.pool.length<=0){return false}
            this.renderComplete = false;
            var _A = this.pool.splice(0,this.pool.length),i=0,im,_temp,_tm,_ac=false,
                _pageHub={},_merge={};
            for(i;i<_A.length;i++){
                _temp = _A[i];
                if(!_pageHub[_temp.pageUid]){
                    _pageHub[_temp.pageUid] = {}
                }
                _merge = _pageHub[_temp.pageUid];
                if(i!==0&&_temp.uuid in _merge){
                    _tm = _merge[_temp.uuid];
                    _tm.action = _temp.action;
                    _tm.relative = _temp.relative;
                    _tm.attributes = _tool.merge(_temp.attributes,_tm.attributes);
                    _tm.style = _tool.merge(_temp.style,_tm.style,true);
                    _tm.event = _tool.merge(_temp.event,_tm.event,true)
                }else {
                    _merge[_temp.uuid] = _temp
                }
            }
            _temp = null;
            for(var merge in _pageHub) {
                if(_pageHub.hasOwnProperty(merge)) {
                    for (i in _pageHub[merge]) {
                        if (_pageHub[merge].hasOwnProperty(i)) {
                            _temp = _pageHub[merge][i];
                            // _tm = vD.hub[i]||vD.deskTopHub[i]||null;
                            _tm = Page.pidHub[merge].hub[i] || Page.pidHub[merge].deskTopHub[i];
                            // _tm = _tm ? _tm.renderData : null;
                            if (_tm === null) {
                                return true
                            }
                            else {
                                _temp.attributes = _tool.merge(_temp.attributes, _tm.attributes);
                                _temp.style = _tool.merge(_temp.style, _tm.style);
                                _temp.event = _tool.merge(_temp.event, _tm.event);
                                _tm.attributes = _tool.merge(_temp.attributes, _tm.attributes, true);
                                _tm.style = _tool.merge(_temp.style, _tm.style, true);
                                _tm.event = _tool.merge(_temp.event, _tm.event, true);
                            }
                            switch (_temp.action) {

                                case 'append':
                                    _temp.relative.parent.appendChild(_temp.element);
                                    break;
                                case 'remove':
                                    _temp.relative.parent.removeChild(_temp.element);
                                    break;
                                case 'replace':
                                    _temp.relative.parent.replaceChild(_temp.element, _temp.relative.site);
                                    break;
                                case 'before':
                                    _temp.relative.parent.insertBefore(_temp.element, _temp.relative.site);
                                    break;
                            }
                            for (im in _temp.attributes) {
                                if (_temp.attributes.hasOwnProperty(im)) {
                                    _temp.element.setAttribute(im, _temp.attributes[im])
                                }
                            }
                            for (im in _temp.style) {
                                if (_temp.style.hasOwnProperty(im)) {
                                    _temp.element.style[im.replace(/(-\w)/, function (m) {
                                        return m[1].toUpperCase()
                                    })] = _temp.style[im]
                                }
                            }
                            for (im in _temp.event) {
                                if (_temp.event.hasOwnProperty(im)&&!_tm.functionHandle[im].captureHandle) {
                                        _tm.functionHandle[im].captureHandle = Page.pidHub[merge].eventHandle(true,im, _temp.uuid, this);
                                        _temp.element.addEventListener(im,_temp.functionHandle[im].captureHandle,true);
                                        _tm.functionHandle[im].unCaptureHandle = Page.pidHub[merge].eventHandle(false,im, _temp.uuid, this);
                                        _temp.element.addEventListener(im,_temp.functionHandle[im].unCaptureHandle,false);
                                    // if (!_temp.element[im]) {
                                    //     _temp.element[im] = function (event) {
                                    //         return Page.pidHub[merge].eventHandle(im, _temp.uuid, event, this)
                                    //     }
                                    // }

                                }
                            }
                            _temp.relative.actual&&(_ac=true)
                        }
                    }
                }
            }
            !_ac&&(this.renderComplete = true)
        }
    };
    var dcp = domChangePool();
    var jQ = function (select) {
        return new jQ.fn.init(select)
    };
    jQ.fn = jQ.prototype = {
        each:function(a,b){
            var i = 0,el,fn;
            if(typeof a === 'function'){
                el = this;
                fn = a
            }else if(Object.keys(a).length && typeof b === 'function'){
                el = a;
                fn = b
            }else {
                return false
            }
            if(el.length){for(;i<el.length;i++){
                fn.call(el[i],i,el[i],el)
            }}else {
                for(i in el){
                    el.hasOwnProperty(i)&&fn.call(el[i],i,el[i],el)
                }
            }
            return el
        },
        data:function (a,b) {

        },
        indexOf:function (j) {
          var _o;
          if(j instanceof jQ.fn.init&&j[0]){
              _o = j[0]
          }else if(j instanceof Element){
              _o = j
          }  else {
              return false
          }
          /*
          for (var i=0;i<this.length;i++){
              var _r = (function (_i) {
                  if(this[_i]===_o){
                      return _i
                  }else {
                      return false
                  }
              }).bind(this)(i);
              if(_r!==false){
                  return _r
              }
          }
          return -1
            */
        return [].indexOf.call(this,_o)

        },
        after:function (e) {
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            var _f=document.createDocumentFragment();
            [].filter.call(e,function (x) {
                _f.appendChild(x)
            });
            this.each(function () {
                this.parentNode.insertBefore(_f,this.nextElementSibling||null)
            })
        },
        next:function () {
          if(!this instanceof jQ.fn.init||!this.length){return jQ()}
          return jQ(this[0].nextElementSibling)
        },
        prev:function () {
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            return jQ(this[0].previousElementSibling)
        },
        parent:function () {
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            return jQ(this[0].parentNode)
        },
        children:function () {
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            return jQ([].slice.call(this[0].children,0))
        },
        siblings:function (s) {
            var _this=this;
            return jQ([].filter.call(this[0].parentElement.children,function () {
                return _this.is.bind(arguments[0])(s)
            }))
        },
        is:function(s){
            return jQ(s).indexOf(this)>-1
        },
        attrs:function(){
            var el = this[0],atts=el&&el.attributes,i,_atts;
            for(i=0;i<atts.length;i++){
              _atts[atts[i].name] = atts[i].value
            }
            return _atts
        },
        on:function(a,b,c){
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            this.each(function () {
                var dataVd=this.dataset['vd'],vd;
                if(dataVd){
                    vd = vD.hub[dataVd];
                    vd&&vd.defaultEvents[a]&&(vd.defaultEvents['on'+a].push(b))
                }else {
                    this.addEventListener(a,b,c||false)
                }
            });

            return this
        },
        removeOn:function (a, b) {
            this.each(function () {
                var dataVd=this.dataset['vd'],vd;
                if(dataVd){
                    vd = vD.hub[dataVd];
                    vd&&vd.defaultEvents[a]&&(vd.defaultEvents['on'+a].remove(b))
                }else {
                    this.removeEventListener(a,b)
                }
            });

            return this
        },
        css:function(){
            var _args = arguments,_tuc = function (s) {
                return s.replace(/(-\w)/, function (m) {
                    return m[1].toUpperCase()
                });
            },_err = function (s) {
                throw new Error(s||'')
            };
            if(_args.length===0){
                _err('arguments\'length can\'t be 0')
            }
            else if(_args.length===1){
                if(typeof _args[0] ==='string'){
                    return this[0].style[_tuc(_args[0])]||document.defaultView.getComputedStyle(this[0],null).getPropertyValue(_args[0])
                }else if(_tool.type(_args[0])==='Object'){
                    this.each(function () {
                        var _this = this;
                        jQ.each(_args[0],function (k,v) {
                            _this.style[_tuc(k)] = v
                        })
                    });
                }else {
                    _err()
                }
            }
            else if(_args.length===2){
                if(typeof _args[0] !=='string'){_err()}
                this.each(function () {
                    this.style[_tuc(_args[0])] = _args[1]
                });
            }
            return this
        },
        closest:function (selector) {
            var el=this[0],
                matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
            while (el) {
                if (matchesSelector.call(el, selector)) {
                    break;
                }
                if(el.tagName==='BODY'){el=null;break;}
                el = el.parentElement;
            }
            return jQ(el);
        },
        hasClass:function (c) {
            var e;
            if(this instanceof jQ.fn.init&&this.length){
                e = this[0]
            }else if(this instanceof Element){
                e = this
            }else {return false}
            var _c = e.className.match(/\S+/g)||[];
            return _c.indexOf(c)>-1
        },
        addClass:function (c) {
            var r = new RegExp(/\S+/g),_c=c.match(r),_this;
            if(this instanceof jQ.fn.init&&this.length){
                _this = this
            }else if(this instanceof Element){
                _this = [this]
            }else {return false}
            jQ.each(_this,function () {
                var oc = this.className.match(r)||[];
                oc = oc.concat(_c).remove();
                this.className = oc.join(' ')
            });
            return this
        },
        removeClass:function (c) {
            var r = new RegExp(/\S+/g),_c = c.match(r),_this;
            if(this instanceof jQ.fn.init&&this.length){
                _this = this
            }else if(this instanceof Element){
                _this = [this]
            }else {return false}
            jQ.each(_this,function () {
                var oc = this.className?this.className.match(r):null;
                if(oc){
                    _c.filter(function (a, b, c) {
                        if(c.indexOf(a)===b){
                            oc.remove(a)
                        }
                    });
                    oc = oc.remove()
                }else {
                    oc = []
                }
                this.className = oc.join(' ')
            });
            return this
        },
        empty:function () {
            for(var a,b=0;null!=(a=this[b]);b++){
                while (a.firstChild)
                    a.removeChild(a.firstChild);
            }
            return this
        },
        append:function (j) {
            if(!this instanceof jQ.fn.init||!this.length){return false}
            if(!j instanceof jQ.fn.init||!j.length){return false}
            this.each(function () {
                var _this = this;
                j.each(function () {
                    _this.appendChild(this)
                })
            })
        },
        find:function (s) {
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            var _d=[];
            this.each(function () {
                if([1,11].indexOf(this.nodeType)<0){return}
                var _n=this.querySelectorAll(s);
                _n&&(_d=_d.concat([].slice.call(_n,0)));
                _n=null
            });
            return jQ(_d)
        },
        eq:function (n) {
            if(!this instanceof jQ.fn.init||!this.length){return jQ()}
            n = n%this.length;
            n = n<0?(this.length+n): n;
            return jQ(this[n])
        },
        remove:function () {
            if(!this instanceof jQ.fn.init||!this.length){return false}
            this.each(function (k,v,t) {
                this.parentNode.removeChild(this);
                delete t[k]
            });
            this.length = 0
        }
    };
    _tool.extend(jQ,jQ.fn);
    var _jq_init=jQ.fn.init = function(select,p){
        var d=null,_this = this,_l=1;
        p = p||document;
        this.length = 0;
        if(!select){}
        else if(typeof select === 'string'){
            if(/<\w+>/.test(select)){
                var _d = document.createElement('div');
                _d.innerHTML = select;
                d = _d.childNodes;
                _d = null
            }else {
                d = p.querySelectorAll(select)
            }
        }
        else if(select.nodeType&&(select.nodeType===1||select.nodeType===11)){
            d = select
        }
        else if(select instanceof Array&&select.length){
            d = select;
            _l = 0
        }
        if(d){
            if(d.length){
                if(_l){
                    jQ.fn.each(d,function(i,e){
                        _this[i] = e
                    });
                    this.length = d.length
                }else {
                    jQ.fn.each(d,function (i, e) {
                        if(e instanceof Element){
                            _this[_l] = e;
                            _l+=1
                        }
                    });
                    this.length = _l
                }
            }else if(d.length===0){
                return null
            }
            else {
                this[0] = d;
                this.length = 1;
            }
        }
        return this
    };
    _jq_init.prototype = jQ.fn;
    win.jQ = jQ;
    win.$ = jQ;
    var Page = function () {
        return new Page.init()
    };
    Page.init = function(){
        this.pid = _tool.rdm.bind(this)(4,'pidHub');
        _tool.extend(this,{
            deskTopHub:{

            },
            hub:{},
            tree:[],
            path:null,
            originalData:{
                'DIV':{css:{'width':'400px','height':'300px','background':'rgba(239, 239, 239, 0.9)'}},
                'SPAN':{css:{'width':'200px','height':'100px','background':'rgba(230, 147, 44, 0.9)','display':'inline-block'}},
                'P':{css:{'height':'30px'}}
            },
            isDeskEvent:false
        });
        this.pidHub[this.pid] = this;
        /*_tool.bindData(this,'isDeskEvent',false,function(v){
            if(v===true){

            }else if(v===false){

            }
        });*/
        return this
    };
    Page.fn = {};
    Page.pidHub = {};
    Page.init.prototype = {
        pidHub:Page.pidHub,
        create:function (select) {
            function _f() {
                _tool.extend(this,Page.fn._prototype)
            }
            _f.prototype = this;
            Page.fn.init.prototype = new _f();
            return new Page.fn.init(select)
        },
        createUuid:function(l){
            /*l = l||8;
            var _u = Number('1e'+(l-1)).toString().replace(/\S/g,function () {
                return (Math.random()*36|0).toString(36)
            });
            if(this.tree.hasOwnProperty(_u)){
                this.createUuid(l)
            }else {
                return _u
            }*/
            return _tool.rdm.bind(this)(l,'hub')
        },
        arrange:function(){
            var _tree=this.tree,_type,i,_path={},toPath = function (obj,path) {
                _type = _tool.type(obj);
                if(_type === 'Array'){
                    for (i=0;i<obj.length;i++){
                        this.arrange(obj[i],path+'/'+i)
                    }
                }
                else if(_type === 'Object'){
                    obj.uuid&&(_path[obj.uuid] = path);
                    if(obj.child&&obj.child.length){
                        this.arrange(obj.child,path)
                    }
                }
                else {
                    return false
                }
            };
            toPath(_tree,'');
            return (this.path=_path, _path)
        },
        find:function (uuid) {
            return $('[data-vd=\''+uuid+'\']')
        },
        eventHandle:function (capture,eventName, uuid,_this) {
            var _h = capture?'captureEvents':'unCaptureEvents';
            return function (event) {
                var _evens,i=0,_target = this.hub[uuid]||this.deskTopHub[uuid]||null;
                if(!_target) return;
                if(this.isDeskEvent) {
                    if(capture){return}
                    _evens = _target.defaultEvents[eventName];
                }else {
                    if(event.target===event.currentTarget){
                        if(capture||!_target.events[eventName]){return}
                        _evens = _target.events[eventName].map(function (x) {
                            return x[0]
                        });
                    }else {
                        _target[_h].hasOwnProperty(eventName)&&(_evens = _target[_h][eventName])
                    }
                }
                if(!_evens||!_evens.length){return}
                for(i;i<_evens.length;i++){
                    _evens[i](event,_this)
                }
            }.bind(this);
        }

    };
    Page.fn.init = function () {
        var _arg,_tag;
        _arg=arguments;
        _tag = _arg.length?_arg[0].toUpperCase():null;
        this.tagName =  _tag;
        this.attributes = {
        };
        this.functionHandle = {
            click:{
                captureHandle:null,
                unCaptureHandle:null
            }
        };
        this.events = {
            click:[[function (x) {
                return x
            },false]]
        };
        this.captureEvents = {

        };
        this.unCaptureEvents = {

        };
        this.style = _tag&&this.originalData[_tag]&&this.originalData[_tag]['css'];
        // this.renderData = _tool.extend({},this);
        this.defaultEvents = {
            mousedown:[_mouseEvents.md('pz',this)],
            dblclick:[_mouseEvents.dc()]
        };
        this.uuid = this.createUuid();
        this.hub[this.uuid] = this;
        return this
    };
    Page.fn._prototype = {
        addClass:function(n){
            if(!n||(typeof n!=='string'&&typeof n!=='number')) return false;
            var _this = this,_n = n.match(/\S+/g),_c = this.attributes.class,_c = _c?_c.match(/\S+/g):[];
            if(_c.length){
                for(var i =0;i<_n.length;i++){
                    if(_c.indexOf(_n[i])<0){
                        _c.push(_n[i])
                    }
                }
            }else {
                _c = _c.concat(_n)
            }
            _c = _c.join(' ');
            this.dcpAdd({attributes:{class:_c}});
            this.attributes.class = _c;
            return this
        },
        removeClass:function (n) {
            if(n!==undefined&&typeof n!=='string'&&typeof n!=='number'){return false}
            var _this = this,_c = this.attributes.class,_c = _c?_c.match(/\S+/g):[],
                _n = n?n.match(/\S+/g):null;
            if(_n){
                _c = _c.filter(function(x){ return _n.indexOf(x)<0 })
            }else {
                _c = []
            }
            _c = _c.join(' ');
            this.dcpAdd({attributes:{class:_c}});
            this.attributes.class = _c;
            return this
        },
        clone:function () {},
        css:function (style,f) {
            // this.style = _tool.merge(this.style,style,true);
            this.dcpAdd({style:style});
            f=f||false;
            !f&&this.uuid===styleControl.uuid&&styleControl.modify(style);
            return this
        },
        addEvent:function(n,f,c){
            c = c||false;
            this.events[n] = this.events[n]||[];
            this.captureEvents[n] = this.captureEvents[n]||[];
            this.unCaptureEvents[n] = this.unCaptureEvents[n]||[];
            this.events[n].push([f,c]);
            c?this.captureEvents[n].push(f):this.unCaptureEvents[n].push(f);
            var o={};
            o[n] = this.events[n];
            this.dcpAdd({
                event:o
            })
        },
        modifyEvent:function (n,i,f,c) {
            var _e=this.events[n][i][1]?'captureEvents':'unCaptureEvents';
            if(f&&c!==undefined){
                this[_e][n].filter(function (a, b, c) {
                    if(a[0]===this.events[n][i][0]){
                        c[b] = [f,c]
                    }
                    return true
                },this);
                this.events[n].splice(i,1,[f,c])
            }{
                this[_e][n].filter(function (a, b, c) {
                    if(a[0]===this.events[n][i][0]){
                        c.splice(b,1)
                    }
                    return true
                },this);
                this.events[n].splice(i,1);
                if(!this.events[n].length&&!this.defaultEvents[n].length){
                    var _h=this.functionHandle[n];
                    _h.captureHandle&&(this.dom.removeEventListener(n,_h.captureHandle,true), _h.captureHandle=null);
                    _h.unCaptureHandle&&(this.dom.removeEventListener(n,_h.unCaptureHandle,false),_h.unCaptureHandle=null);
                }
            }
        },
        dcpAdd:function(data,fn){
            /*
             data:{action:...,parent:...,site:...,style:...,event:...}
             */
            if(_tool.type(data)!=='Object'){return false}
            var n = data.action,p = data.parent,s = data.site,style = data.style,ac,
                attributes = data.attributes,
                e = data.event;
            function toElement(a) {
                var _a = true;
                if(!a){return false}
                else if(a instanceof Page.init){
                    a = a.render(true);
                    _a = a.actual;
                    a = a.element;
                }
                else if(typeof a === 'string'){
                    var _vm = this.hub[a]||this.deskTopHub[a]||null;
                    if(_vm===null){return false}
                    a = _vm.return(true);
                    _a = a.actual;
                    a = a.element;
                }else if(a instanceof Element){
                }else if(a instanceof jQ.fn.init){
                    if(a[0]){
                        a = a[0]
                    }else{
                        return false
                    }
                }
                else {
                    return false
                }
                return [a,_a]
            }
            p = toElement(p);
            p&&(ac = p[1],p = p[0]);
            s = toElement(s);
            s&&(s = s[0]);
            if((n&&['append','remove','replace','before'].indexOf(n)>-1&&!p)
                ||((n==='replace'||n==='before')&&!s)){
                return false
            }
            dcp.add({
                pageUid:this.pid,
                uuid:this.uuid,
                element:this.render(),
                action:n,
                relative:{parent:p,site:s,actual:ac},
                style:style,
                attributes:attributes,
                callback:_tool.type(fn)==='Array'?fn:null,
                event:e
            });
            // a.appendChild(this.render());//domChangeHandle
            return true
        },
        appendTo:function (a) {
            return this.dcpAdd({action:'append',parent:a});
        },
        replaceTo:function(){

        },
        beforeTo:function(){},
        render:function(t){
            if(!this.uuid&&!this.tagName){return false}
            var _d=document.querySelector('[data-vd=\''+this.uuid+'\']'),s=this.style,_s,i,
                e;
            if(this.dom||_d){
                if(t===true){
                    return { element:this.dom||_d,actual:!!_d }
                }else {
                    return this.dom || _d
                }
            }
            _d = document.createElement(this.tagName);
            _d.dataset['vd'] = this.uuid;
            _s = _d.style;
            for(i in s){
                if(s.hasOwnProperty(i)){
                    _s[i.replace(/(-\w)/,function (m) {
                        return m[1].toUpperCase()
                    })]=s[i]
                }
            }
            e = _tool.merge(this.events,this.defaultEvents,true);
            for (i in e){
                /*
                 e = {
                 onclick:[f1,f2,...],
                 onmouseup:[f1,f2,...]
                 }
                 */
                if(e.hasOwnProperty(i)&&(!this.functionHandle[i]||!this.functionHandle[i].captureHandle)){
                    var _this = this;
                    (function(_i){
                        this.functionHandle[_i] = this.functionHandle[_i]||{captureHandle:null,unCaptureHandle:null};
                        this.functionHandle[_i].captureHandle = this.eventHandle(true,_i, this.uuid, this);
                        _d.addEventListener(_i,this.functionHandle[_i].captureHandle,true);
                        this.functionHandle[_i].unCaptureHandle = this.eventHandle(false,_i, this.uuid, this);
                        _d.addEventListener(_i,this.functionHandle[_i].unCaptureHandle,false);
                        // return this.eventHandle(_i,this.uuid,event,this)
                    }
                    ).bind(this)(i)
                }
            }
            this.dom = _d;
            return t?{ element:_d,actual:false }:_d
        }
    };
    win.Page = Page;
    var $tools = jQ('#tools'),$body = jQ('body'),$bModule = jQ('#blank-module'),$editor=$('#editor-board');
    var $ebcs=$('#ebc-style'),
        $ebce=$('#ebc-event');
    var _mouseEvents={
        lock:false,
        preMode:'',
        preTarget:'',
        bubble:true,
        mode:'desk',
        downLock:false,
        moveLock:true,
        upLock:true,
        isMoved:false,
        site:{},
        dom:document.documentElement,
        scroll:{},
        target:null,
        overEl:null,
        overTarget:null,
        moduleName:'',
        fn:{
            pM:function (e,scroll) {//position-move
                this.target.css({
                    'left':e.pageX-scroll.left-this.site.x+(parseFloat(this.target.css('left'))||0)+'px',
                    'top':e.pageY-scroll.top-this.site.y+(parseFloat(this.target.css('top'))||0)+'px'
                });
            },
            eM:function (e,scroll) {
                if($.hasClass.call(e.target.parentNode,'eb-title')){
                    this.target.css({
                        'left':e.pageX-scroll.left-this.site.x+(parseFloat(this.target.css('left'))||0)+'px',
                        'top':e.pageY-scroll.top-this.site.y+(parseFloat(this.target.css('top'))||0)+'px'
                    });
                }
            },
            csM:function (e, scroll) {
                var l=e.pageX-this.scroll.left-scroll.left-this.target[0].parentNode.parentNode.parentNode.parentNode.offsetLeft-this.target[0].parentNode.parentNode.offsetLeft;
                l = l<0?0:l>192?192:l;
                var _a=[[[255,  0,  0],2, 1],
                        [[255,  0,255],0,-1],
                        [[  0,  0,255],1, 1],
                        [[  0,255,255],2,-1],
                        [[  0,255,  0],0, 1],
                        [[255,255,  0],1,-1],
                        [[255,  0,  0],1, 0]];
                var x=l/32,i=x|0,r=x-i,a=_a[i];
                a[0][a[1]]+=a[2]*((256*r)|0);
                this.target.css({
                    'transform':'translateX('+l+'px)'
                });
                canvas_color.draw.call(canvas_color,a[0],true);
            },
            ctsM:function (e, scroll) {
                var l=e.pageX-this.scroll.left-scroll.left-this.target[0].parentNode.parentNode.parentNode.parentNode.offsetLeft-this.target[0].parentNode.parentNode.offsetLeft;
                l = l<0?0:l>192?192:l;
                canvas_color.transparent(l/192);
                this.target.css({
                    'transform':'translateX('+l+'px)'
                });
            },
            cdsM:function (e, scroll) {
                var l=256-e.pageX+this.scroll.left+scroll.left+this.target[0].parentNode.parentNode.offsetLeft,
                    t=e.pageY-this.scroll.top-scroll.top-this.target[0].parentNode.parentNode.offsetTop;
                l = l<0?0:l>256?256:l;
                t = t<0?0:t>150?150:t;
                canvas_color.x = l/256;
                canvas_color.y = t/150;
                this.target.css({
                    transform:'translateX(-'+l+'px) translateY('+t+'px)'
                });
                canvas_color.read();
            },
            pvM:function (e, scroll) {//pv-move
                if(this.target.moveMode==='position'){
                    this.target.css({
                        'left':e.pageX-scroll.left-this.site.x+(parseFloat(this.target.style['left'])||0)+'px',
                        'top':e.pageY-scroll.top-this.site.y+(parseFloat(this.target.style['top'])||0)+'px'
                    })
                }else {
                    this.target.css({
                        'margin-left':e.pageX-scroll.left-this.site.x+(parseFloat(this.target.style['margin-left'])||0)+'px',
                        'margin-top':e.pageY-scroll.top-this.site.y+(parseFloat(this.target.style['margin-top'])||0)+'px'
                    })
                }
            },
            tcU:function (e) {//tools-click-up
                if(e.target.dataset.hasOwnProperty('type')){
                    if($bModule[0].innerText!==e.target.innerText){
                        $bModule[0].innerText = e.target.innerText;
                        $bModule.css({
                            'visibility':'visible',
                            'top':e.pageY-this.dom.scrollTop-$bModule[0].clientHeight/2+'px',
                            'left':e.pageX-this.dom.scrollLeft-$bModule[0].clientWidth/2+'px',
                        });
                        this.target = $bModule;
                        this.moduleName = e.target.innerText;
                        this.mode = 'module';
                        this.downLock = true;
                    }
                    else {
                        this.fn.removeModule();
                    }
                }else {
                    this.target = null;
                    this.downLock = false;
                    this.moveLock = true;
                    this.upLock = true;
                    this.moduleName = '';
                    this.mode = 'desk'
                }
                return true
            },
            mcU:function (e) {
                if(this.overEl){
                    Page.pidHub[Page.currentPid].create(this.moduleName).appendTo(this.overEl);
                    this.fn.removeOver();
                    this.fn.removeModule();
                }else {
                    this.fn.tcU.bind(this)(e)
                }
                return true
            },
            gU:function () {//general-up
                this.downLock = false;
                this.moveLock = true;
                this.upLock = true;
            },
            pzD:function (e) {
                    var _p = this.preTarget.style.position;
                    this.preTarget.moveMode = _p&&_p!=='none'?'position':'margin';
            },
            eD:function (e) {
              if(jQ.hasClass.call(e.target,'color-c')){
                  e.stopPropagation();
                  e.preventDefault();
              }
            },
            ccD:function (e) {
              if(e.target.id==='color-switch'||e.target.tagName==='A'){
                  return false
              }
            },
            cbD:function () {
              canvas_color.exitSign = false;
              this.isMoved = false;
              this.upLock = false;
              return true
            },
            eU:function (e) {
                if(!this.downLock){
                    this.downLock = false;
                    this.moveLock = true;
                    this.upLock = true;
                }
                if(jQ.hasClass.call(e.target,'style-create')){
                    (function () {
                        if(this.createLock) return;
                        e.preventDefault();
                        var $this = $(e.target),_t;
                        if(e.target.dataset['hasCreate']==='f'){
                            e.target.dataset['hasCreate']='t';
                            _t = $(this.obj2string());
                            this.styleEvents(_t);
                            $this.parent().after(_t);
                            _t[0].firstChild.focus();
                        }else {
                            e.target.dataset['hasCreate']='f';
                        }
                    }.bind(styleControl))()
                }
                else if(jQ.hasClass.call(e.target.parentNode,'eb-title')){
                        $('.eb-title>span').removeClass('active');
                        $(e.target).addClass('active');
                        if('ebc-'+e.target.dataset.type===$ebc.find('.active')[0].id){
                            return
                        }
                        $ebc.children().removeClass('active');
                        switch (e.target.dataset.type){
                            case 'style':
                                $ebs.addClass('active');
                                break;
                            case 'attribute':
                                $eba.addClass('active');
                                break;
                            case 'event':
                                var EventsList =function (data) {
                                    var s='';
                                    $.each(data,function (k, v) {
                                        if(v&&v.length){
                                            s+=
                        ' <div class="drawer">'+
                        '     <input type="checkbox">'+
                        '     <p class="drawer-name">'+k+'<span class="drawer-right"><span class="drawer-number">'+v.length+'</span><span class="drawer-add">✚</span></span></p>'+
                        '     <div class="drawer-box">'+
                        '         <div>'+
                        v.map(function(x,i){
                        return '<p class="event-editor" data-key="'+k+'"><span class="function-name">'+(x[0].name||'fn')+'</span><span class="event-more"><span class="e-eli">···</span><span class="e-remove">remove</span><span class="e-index">index</span><span class="e-index-editor" contenteditable="true"></span><span class="e-arrow">➭</span></span><span class="right">'+x[1]+'</span></p>'
                            }).join('')+
                        '         </div>'+
                        '     </div>'+
                        ' </div>'
                                        }
                                    });
                                    if(s){
                                      s = $(s);
                                      // s.find('.event-editor').on('click',function(e){
                                      //     console.log(e.target.dataset)
                                      // });
                                      $ebe[0].innerHTML = '';
                                      $ebe.append(s)
                                    }
                                };
                                if($ebe.uuid!==styleControl.uuid){
                                    EventsList(styleControl.pz.events);
                                    $ebe.uuid = styleControl.uuid
                                }
                                $ebe.addClass('active');
                                break;
                        }
                }
                else if(jQ.hasClass.call(e.target,'color-c')){
                    if($cb.hasClass('hide')){
                        canvas_color.currentTarget = e.target;
                        var _dw=this.dom.clientWidth,_dh=this.dom.clientWidth,
                            _x=e.pageX,_y=e.pageY,_ew = $cb[0].clientWidth,_eh=$cb[0].clientHeight,l,t;
                        l = _dw-_x<_ew?(_x-_ew):_x+30;
                        t = _dh-_y<_eh?(_y-_eh):_y+20;
                        $cb.css({left:l+'px',top:t+'px'});
                        canvas_color.init(e.target.nextSibling.nodeValue);
                        this.moveLock = true;
                        $cb.removeClass('hide');
                        $(e.target).addClass('high-light');
                        // this.exitHandle.look = false;
                        this.checkHandle.pool.unshift(['colorBoard']);
                        canvas_color.exitSign = true
                    }
                    else {
                        // $(e.target).removeClass('high-light');
                        // $cb.addClass('hide')
                    }
                }
                else if(jQ.hasClass.call(e.target,'e-index')){
                    var _t=e.target.parentNode.parentNode;
                    e.target.nextElementSibling.innerText = [].indexOf.call(_t.parentNode.children,_t);
                    jQ.addClass.call(e.target,'active');
                    jQ.addClass.call(e.target.nextElementSibling,'active');
                    jQ.addClass.call(e.target.nextElementSibling.nextElementSibling,'active');
                }
                else if(jQ.hasClass.call(e.target,'e-arrow')){
                    var _t=e.target.parentNode.parentNode,_p=_t.parentNode,_n=_p.childNodes.length,x,
                        _d=_t.dataset,_di = [].indexOf.call(_p.children,_t),
                        _i=+e.target.innerText;
                    if(!_i||_di===_i||_i>_p.children.length-1||_i<0){
                    }else
                    {
                        _p.insertBefore(_t,_p.childNodes[_i<_di?_i:(_i+1)])
                    }
                    jQ.removeClass.call(e.target,'active');
                    jQ.removeClass.call(e.target.previousElementSibling,'active');
                    jQ.removeClass.call(e.target.previousElementSibling.previousElementSibling,'active');
                }
                return true
            },
            cbU:function (e) {
                var scroll=function () {
                    var _l = this.dom.scrollLeft - this.scroll.left,
                        _t = this.dom.scrollTop - this.scroll.top;
                    _l!==0&&(this.scroll.left+=_l);
                    _t!==0&&(this.scroll.top+=_t);
                    return {left:_l,top:_t}
                }.bind(this);

                switch (e.target.id){
                    case 'backgroundColor':
                        this.target = $cas2;
                        this.fn.cdsM.bind(this)(e,scroll());
                        break;
                    case 'color-area':
                        this.target = $cas;
                        this.fn.csM.bind(this)(e,scroll());
                        break;
                    case 'color-transparent':
                        this.target = $cts;
                        this.fn.ctsM.bind(this)(e,scroll());
                        break;

                }
                console.log('cbU')
            },
            removeModule:function () {
                (function () {
                $bModule.css('visibility','hidden');
                this.target = null;
                this.downLock = false;
                this.moveLock = true;
                this.upLock = true;
                this.moduleName = '';
                this.mode = 'desk'
                }.bind(_mouseEvents))();
            },
            removeOver:function () {
                (function () {
                    if(this.overEl){
                        this.overEl.removeClass('high-light');
                        this.overEl = null;
                        this.overTarget = null;
                    }
                }.bind(_mouseEvents))();
            }
        },
        downBeforeEvents:{
            pz:'pzD',
            editor:'eD',
            colorControl:'ccD',
            colorBoard:'cbD'
        },
        downAfterEvents:{},
        moveEvents:{
            tools:'pM',
            module:'pM',
            pz:'pvM',
            editor:'pM',
            colorSlider:'csM',
            colorTransparentSlider:'ctsM',
            colorDetailSlider:'cdsM',
            colorControl:'pM'
        },
        upDragEvents:{
            tools:'gU',
            pz:'gU',
            editor:'gU',
            colorSlider:'gU',
            colorTransparentSlider:'gU',
            colorDetailSlider:'gU',
            colorControl:'gU'
        },
        upCLickEvents:{
            tools:'tcU',
            module:'mcU',
            pz:'gU',
            editor:'eU',
            colorBoard:'cbU'
        },
        checkHandle:{
            lock:false,
            fn:{
                colorBoard:function (e) {
                    if(['colorSlider','colorTransparentSlider','colorDetailSlider',
                            'colorControl','colorBoard'].indexOf(this.preMode)<0){
                        if(!$cb.hasClass('hide')){
                            $cb.addClass('hide');
                            $(canvas_color.currentTarget).removeClass('high-light');
                        }
                        if(e.target===canvas_color.currentTarget){
                            return true
                        }
                    }else {
                        return false
                    }
                }
            },
            pool:[]
        },
        md:function (mode,el) {//body-mouse-down
            return function (e) {
                this.preMode = mode||'';
                this.preTarget = el||null;
                this.bubble = false;
                if(this.lock){return}
                this.isMoved = false;
                var _check = this.checkHandle;
                if(!_check.lock&&_check.pool.length){
                    var _a = _check.pool.splice(0,1),_this = this,_f=false,r=[];
                    $.each(_a[0],function () {
                        var _r=_check.fn[this].bind(_this)(e);
                        if(_r===true){
                            _f = true
                        }else if(_r===false){
                            r.push(this)
                        }
                    });
                    if(r.length){
                        _check.pool.unshift(r)
                    }
                    if(_f){
                        this.downLock = false;
                        this.moveLock = true;
                        this.upLock = true;
                        return false
                    }
                }
                if(this.preMode){
                    if(this.downBeforeEvents.hasOwnProperty(this.preMode)){
                        this.fn[this.downBeforeEvents[this.preMode]].bind(this)(e)
                    }
                    if(this.downLock){return false}
                    this.mode = this.preMode;
                    this.target = this.preTarget;
                    !this.bubble&&e.stopPropagation();
                    this.site.x = e.pageX;
                    this.site.y = e.pageY;
                    this.scroll.left = this.dom.scrollLeft;
                    this.scroll.top = this.dom.scrollTop;
                    this.moveLock = false;
                    this.upLock = false;
                    if(this.downAfterEvents.hasOwnProperty(this.preMode)){
                        this.fn[this.downAfterEvents[this.preMode]].bind(this)(e)
                    }
                }
            }.bind(_mouseEvents)
        },
        mm:function () {
            return function (e) {
                if(this.lock){return}
                if(this.moveLock){return}
                !this.bubble&&e.stopPropagation();
                var _l = this.dom.scrollLeft - this.scroll.left,
                    _t = this.dom.scrollTop - this.scroll.top;
                _l!==0&&(this.scroll.left+=_l);
                _t!==0&&(this.scroll.top+=_t);
                this.isMoved = true;
                if(this.moveEvents.hasOwnProperty(this.mode)){
                    this.fn[this.moveEvents[this.mode]].bind(this)(e,{left:_l,top:_t})
                }
                this.site.x = e.pageX;
                this.site.y = e.pageY;
            }.bind(_mouseEvents)
        },
        mu:function () {
            return function (e) {
                if(this.lock){return false}
                if(this.mode){
                    if(this.upLock){return false}
                    !this.bubble&&e.stopPropagation();
                    if(this.isMoved){
                        if(this.upDragEvents.hasOwnProperty(this.mode)){
                            if(this.fn[this.upDragEvents[this.mode]].bind(this)(e)){
                                return
                            }
                        }
                    }else {
                        if(this.upCLickEvents.hasOwnProperty(this.mode)){
                            if(this.fn[this.upCLickEvents[this.mode]].bind(this)(e)){
                                return
                            }
                        }

                    }
                    this.downLock = false;
                    this.moveLock = true;
                    this.upLock = true;
                    this.preMode = '';
                    this.preTarget = null;
                }
            }.bind(_mouseEvents)
        },
        mo:function () {
            return function (e) {
                e.stopPropagation();
                if(this.mode!=='module'){return false}
                if(this.overTarget===e.target){return false}
                var vd = $(e.target).closest('[data-vd]'),mb;
                if(vd&&vd.length){
                    vd = vd[0].dataset['vd'];
                    mb = Page.pidHub[Page.currentPid].hub[vd];
                }else {
                    mb = $(e.target).closest('#board')
                }
                this.fn.removeOver();
                if(mb&&mb.length!==0){
                    this.overTarget = e.target;
                    this.overEl = mb;
                    mb.addClass('high-light')
                }
            }.bind(_mouseEvents)
        },
        dc:function () {
            return function (e) {
                e.stopPropagation();
                var $eb=$('#editor-board'),
                    _this = Page.pidHub[Page.currentPid].hub[e.target.dataset['vd']];
                if(styleControl.uuid !== e.target.dataset['vd']){
                    styleControl.uuid&&Page.pidHub[Page.currentPid].hub[styleControl.uuid].removeClass('high-light');
                    styleControl.uuid = e.target.dataset['vd'];
                    styleControl.pz = Page.pidHub[Page.currentPid].hub[styleControl.uuid];
                    styleControl.ebcStyle(_this.style)
                }else {
                    if(!$eb.hasClass('hide')){
                        $eb.addClass('hide');
                        _this.removeClass('high-light');
                        return
                    }
                }
                var _dw=document.documentElement.clientWidth,
                    _dh=document.documentElement.clientHeight,
                    _x = e.pageX,_y = e.pageY,
                    _ew=$eb[0].clientWidth,_eh=$eb[0].clientHeight,l,t;
                l = _dw-_x<_ew?(_x-_ew):_x+30;
                t = _dh-_y<_eh?(_y-_eh):_y+20;
                $eb.css({left:l+'px',top:t+'px'});
                $eb.removeClass('hide');
                _this.addClass('high-light');
            }.bind(_mouseEvents)
        }
    };
    $tools.on('mousedown',_mouseEvents.md('tools',$tools));
    $body.on('mousedown',_mouseEvents.md());
    $body.on('mousemove',_mouseEvents.mm());
    $body.on('mouseup',_mouseEvents.mu());
    $body.on('mouseover',_mouseEvents.mo());
    var p1 = Page();
    Page.currentPid = p1.pid;
    p1.isDeskEvent = true;
    $('#compile').on('click',function(e){
        if(e.target.innerText==='CP'){
            p1.isDeskEvent = true;
            e.target.innerText = 'SL'
        }else {
            e.target.innerText = 'CP';
            p1.isDeskEvent = false;
        }
    });
    var styleControl={
        uuid:'',
        pz:null,
        focus:false,
        hub:{},
        target:$('#ebc-style'),
        createLock:false,
        obj2string:function (k, v) {
            var _v= v;
            if(['background','background-color','background-image','color','border','border-color']
                    .indexOf(k)>-1||
                /(#[a-f0-9]{3}|#[a-f0-9]{6}|rgba?\(|hsla?\()/gi.test(_v)){
                canvas_color.currentTarget = null;
                var r = new RegExp(/#([a-f0-9]{6}|[a-f0-9]{3})|rgba\((\s*\d{1,3},){3}\s*(0|1|0?\.\d+)\)|rgb\((\s*\d{1,3},){2}\s*\d{1,3}\)|hsl\(\s*\d{1,3},\s*1?\d{0,2}%,\s*1?\d{0,2}%\)|hsla\(\s*\d{1,3},\s*(1?\d{0,2}%,){2}\s*(0|1|0?\.\d+)\)/gi);
                _v = _v.replace(r,function (match) {
                    return '<i class="color-c" style="background: '+match+'"></i>'+match
                });
            }
            return '<p><span class="style-key" data-value="'+(k||'')+'" contenteditable="true">'+(k||'')+'</span><b>:</b>'+
                '<span class="style-value" data-value="'+(v||'')+'" contenteditable="true">'+(_v||'')+'</span>'+
                '<a class="style-create">;</a>'+
                '</p>'
        },
        styleValueBlur:function (e) {
            _mouseEvents.downLock&&(_mouseEvents.downLock=false,_mouseEvents.moveLock=true);
            var $this = $(e.target),_t=$this.parent().next().find('.style-key'),
                _enter = e.target.dataset['enter'],_nv=e.target.innerText,
                _dv=e.target.dataset['value'],_k=$this.siblings('.style-key')[0].dataset['value'],
                _pz=Page.pidHub[Page.currentPid].hub[this.uuid],_o={};
            if(_nv){
                if(_nv!==_dv){
                    //modify
                    _o[_k] = _nv;
                    _pz.css(_o,true);
                    this.hub[_k].value = _nv;
                    e.target.dataset['value'] = _nv;
                    // e.target.normalize();
                    if(['background','background-color','background-image','color','border','border-color']
                            .indexOf(_k)>-1||
                    /(#[a-f0-9]{3}|#[a-f0-9]{6}|rgba?\(|hsla?\()/gi.test(e.target.innerText)){
                        if(!canvas_color.currentTarget||!e.analog){
                            var r = new RegExp(/#([a-f0-9]{6}|[a-f0-9]{3})|rgba\((\s*\d{1,3},){3}\s*(0|1|0?\.\d+)\)|rgb\((\s*\d{1,3},){2}\s*\d{1,3}\)|hsl\(\s*\d{1,3},\s*1?\d{0,2}%,\s*1?\d{0,2}%\)|hsla\(\s*\d{1,3},\s*(1?\d{0,2}%,){2}\s*(0|1|0?\.\d+)\)/gi);
                            var s = e.target.innerText;
                            s = s.replace(r,function (match) {
                                return '<i class="color-c" style="background: '+match+'"></i>'+match
                            });
                            e.target.innerHTML = s;
                        }
                    }
                }else {
                    var _i=$this.find('i');
                    _i.length&&$this.find('i').css('display','inline-block')
                }
            }else {
                //remove
                _o[_k]=null;
                _pz.css(_o);
                delete this.hub[_k];
                $this.parent().remove()
            }
            if(_enter==='t'){
                if(_t.length){
                    _t[0].focus()
                }else{
                    _t = $(this.obj2string());
                    this.styleEvents(_t);
                    $this.closest('#ebc-style').append(_t);
                    _t[0].firstChild.focus()
                }
            }
            e.target.dataset['enter'] = 'f'
        },
        styleEvents:function(j) {
        j.find('.style-key').on('keydown',function(e){
            var $this = $(e.target),_t=$this.parent().next().find('.style-key');
            if(e.key==='Enter'){
                // e.cancelBubble = true;
                e.preventDefault();
                e.target.dataset['enter'] = 't';
                e.target.blur();
            }
        }.bind(styleControl)).
        on('focus',function (e) {
            !_mouseEvents.downLock&&(_mouseEvents.downLock=true,_mouseEvents.moveLock=true);
        }).
        on('blur',function (e) {
            _mouseEvents.downLock&&(_mouseEvents.downLock=false,_mouseEvents.moveLock=true);
            var $this = $(e.target),_t,_nv=e.target.innerText,_dv=e.target.dataset['value'],
                _pz=Page.pidHub[Page.currentPid].hub[this.uuid],_o={};

            this.createLock&&(this.createLock = false);
            if(!_nv){
                _t=$this.parent().next().find('.style-key');
                $this.parent().remove();
                if(_dv){
                    delete this.hub[_dv];
                    //remove
                    _o[_dv]=null;
                    _pz.css(_o);
                }
                if(_t.length&&e.target.dataset['enter']==='t'){
                    _t[0].focus();
                }
            }else {
                if(_nv!==_dv){
                    if(_nv in this.hub){
                        e.target.focus();
                        this.createLock = true;
                        console.log('重复');
                        return
                    }else {
                        if(_dv){
                            //modify
                            if(this.hub[_dv].value){
                                _o[_nv] = this.hub[_dv].value
                            }
                            this.hub[_nv] = this.hub[_dv];
                            delete this.hub[_dv];
                            _o[_dv] = null;
                            _pz.css(_o)
                        }else {
                            this.hub[_nv] = {
                                value:'',dom:e.target.parentNode
                            }
                            //add?
                        }
                        e.target.dataset['value'] = _nv;
                    }
                }
                if(e.target.dataset['enter']==='t'){
                    $this.siblings('.style-value')[0].focus();
                }
            }
            e.target.dataset['enter']='f'
        }.bind(styleControl));
        j.find('.style-value').on('keydown',function (e) {
            if(e.key==='Enter'){
                e.preventDefault();
                e.target.dataset['enter'] = 't';
                e.target.blur()
            }
        }.bind(styleControl)).
        on('focus',function (e) {
            var $this = $(e.target),_k=$this.siblings('.style-key')[0].dataset['value'];
            !_mouseEvents.downLock&&(_mouseEvents.downLock=true,_mouseEvents.moveLock=true);
            if(['background','background-color','background-image','color','border','border-color']
                    .indexOf(_k)>-1){
                var _i=$this.find('i');
                _i.length&&_i.css('display','none')
            }
        }).
        on('blur',styleControl.styleValueBlur
        .bind(styleControl));
        j.find('.style-create').
        /*on('click',function (e) {
            if(this.createLock) return;
            e.preventDefault();
            var $this = $(e.target),_t;
            if(e.target.dataset['hasCreate']==='f'){
                e.target.dataset['hasCreate']='t';
                _t = $(this.obj2string());
                this.styleEvents(_t);
                $this.parent().after(_t);
                _t[0].firstChild.focus();
            }else {
                e.target.dataset['hasCreate']='f';
            }
        }.bind(styleControl)).*/
        on('mousedown',function(e){
            var $this=$(e.target),_t=$this.parent().next().find('.style-key');
            if($(document.activeElement).is('#ebc-style span')){
                e.target.dataset['hasCreate'] = 't';
                return
            }
            if(!_t.length||!!_t[0].innerText){
                e.target.dataset['hasCreate'] = 'f'
            }else {
                e.target.dataset['hasCreate'] = 't'
            }
        })
    },
        modify:function (s) {
            var _this = this;
            jQ.each(s,function (k,v) {
                if(k in _this.hub){
                    if(_this.hub[k].value!==v){
                        _this.hub[k].value = v;
                        var _n=_this.hub[k].dom.childNodes[2];
                        _n.innerText=_n.dataset['value']=v;
                    }
                }else if(v!==null) {
                    var _s = $(_this.obj2string(k,v));
                    _this.styleEvents(_s);
                    _this.target.append(_s);
                    _this.hub[k]={value:v,dom:_s[0]}
                }
            })
        },
        ebcStyle:function (sl) {
            var $ebs = this.target,_s='',_m=this.obj2string;
            jQ.each(sl,function(k,v){
                _s+=_m(k,v);
            });
            var $s = $(_s),i=0,_this=this;
            this.hub={};
            jQ.each(sl,function (k,v) {
                _this.hub[k]={value:v,dom:$s[i]};
                i++
            });
            this.styleEvents($s);
            $ebs.empty().append($s);
        }
    };
    $editor.on('mousedown',_mouseEvents.md('editor',$editor));
    var $cas = $('#color-slider'),$cas2 = $('#color-detail-slider'),
        $cts = $('#color-transparent-slider'),
        $cctl=$('#color-control'),$cb=$('#color-board');
    var $ebc=$('.eb-content'),$ebs=$('#ebc-style'),$ebe=$('#ebc-event'),$eba=$('#ebc-attribute');
    $cas.on('mousedown',_mouseEvents.md('colorSlider',$cas));
    $cts.on('mousedown',_mouseEvents.md('colorTransparentSlider',$cts));
    $cas2.on('mousedown',_mouseEvents.md('colorDetailSlider',$cas2));
    $cctl.on('mousedown',_mouseEvents.md('colorControl',$cb));
    $cb.on('mousedown',_mouseEvents.md('colorBoard',null));
    var $cs=$('#color-switch'),$cv=$('#color-value');
    $cs.on('click',function (e) {
       canvas_color.switch()
    });
    var canvas_color={
        target:document.getElementById('backgroundColor').getContext('2d'),
        exitSign:false,
        currentTarget:null,
        currentType:'hex',
        cSlider:$('#color-slider'),
        dSlider:$('#color-detail-slider'),
        tSlider:$('#color-transparent-slider'),
        alpha:1,
        flag:true,
        rgba:[],
        _rgba:[],
        transformValue:null,
        x:0,
        y:0,
        cc:$('#color-circle'),
        ct:$('#color-transparent'),
        cr:document.getElementById('color-rgba'),
        ch:document.getElementById('color-hex'),
        chsla:document.getElementById('color-hsla'),
        init:function (s) {
            var a = 1;
            if(s.charAt(0)==='#'){
                this.currentType = 'hex';
                this.transform(s,'hex')
            }else{
                var _s = s.match(/[^\s(),]+/g);
                if(!_s){return false}
                switch (_s[0].toLowerCase()){
                    case 'rgb':case 'rgba':
                        this.currentType = 'rgb';
                        this.transform([_s[1],_s[2],_s[3]],'rgb');
                        a = _s[4]||1;
                        break;
                    case 'hsl':case 'hsla':
                        this.currentType = 'hsl';
                        this.transform([_s[1],_s[2],_s[3]],'hsl');
                        a = _s[4]||1;
                        break;
                    default:
                        return false
                }
            }
            var _r = this.transformValue.rgb;
            this.locate(_r[0],_r[1],_r[2],a);
        },
        draw:function (rgba,f) {
            var a=rgba[3]||this.alpha||1;
            this.rgba = rgba.slice(0,3);
            this.alpha = parseFloat(a);
            this.cbc(f||false);
        },
        cbcLocate:function (rgb) {
            var n={
                '25502':[0,1],
                '02550':[1,-1],
                '02551':[2,1],
                '02552':[3,-1],
                '25500':[4,1],
                '25501':[5,-1]
            },m={
                '25500':0,
                '2550255':1,
                '00255':2,
                '0255255':3,
                '02550':4,
                '2552550':5
            };
            var a=[],b=[],k,c,l=0;
            $.each(rgb.slice(0,3),function (_k) {
                var _t=parseInt(this);
                _t===255||_t===0?a.push(_t):(b.push(_k),c=_t)
            });
            k = a.concat(b).join('');
            if(c){
                var _a=n[k];
                if(_a[1]===1){
                    l = (c/255+_a[0])*32
                }else {
                    l = (1-c/255+_a[0])*32
                }
            }else {
                l=m[k]*32
            }
            this.cSlider.css({
                transform:'translateX('+l+'px)'
            })
        },
        cbc:function (f) {
            if(!this.flag||!this.rgba.length){
                return
            }
            if(this.rgba.join('')===this._rgba.join('')){
                this.read();
                return
            }
            this.flag = false;
            this._rgba = this.rgba.splice(0,4);
            var ctx=this.target,r=this._rgba[0],g=this._rgba[1],b=this._rgba[2],a=this._rgba[3];
            ctx.clearRect(0,0,256,150);
            var _r=(256-r)/256,_g=(256-g)/256,_b=(256-b)/256,n=0;
            while (n<256){
                var gl=ctx.createLinearGradient(0,0,0,150),
                    rgb='rgb('+(r+(n*_r+0.5)|0)+','+(g+(n*_g+0.5)|0)+','+(b+(n*_b+0.5)|0)+')';
                gl.addColorStop(0,rgb);
                gl.addColorStop(1,'rgb(0,0,0)');
                ctx.fillStyle = gl;
                ctx.fillRect(255-n,0,1,150);
                n++
            }
            this.flag = true;
            !f&&this.cbcLocate(this._rgba);
            this.read();
            if(this.rgba.length){
                this.cbc()
            }
        },
        read:function () {
            var f=function (n) {
                return ((((255-n)*this.x+n)*(1-this.y)+0.5)|0).toString()
            }.bind(this),
            cr=this.cr,
            chsla=this.chsla,
            ch=this.ch,
            cc=this.cc,r=f(this._rgba[0]),g=f(this._rgba[1]),b=f(this._rgba[2]),a=''+this.alpha||1,c;
            cr.children[0].children[0].innerText = r;
            cr.children[1].children[0].innerText = g;
            cr.children[2].children[0].innerText = b;
            cr.children[3].children[0].innerText = a;
            cc.css('background','rgba('+r+','+g+','+b+','+a+')');
            this.ct.css('background','linear-gradient(90deg,rgba('+r+','+g+','+b+',0),rgba('+r+','+g+','+b+',1))');
            if(this.transformValue&&this.transformValue.rgb.join('')===[r,g,b].join('')){
                c = this.transformValue
            }else {
                c = this.transform([r,g,b],'rgb');
            }
            chsla.children[0].children[0].innerText = c.hsl[0];
            chsla.children[1].children[0].innerText = c.hsl[1];
            chsla.children[2].children[0].innerText = c.hsl[2];
            chsla.children[3].children[0].innerText = a;
            ch.children[0].children[0].innerText = c.hex;
            this.switch(this.currentType);
            if(this.currentTarget){
                this.currentTarget.style.background = 'rgba('+r+','+g+','+b+','+a+')';
                styleControl.styleValueBlur.bind(styleControl)({analog:true,target:this.currentTarget.parentElement});
            }
        },
        locate:function (r,g,b,a) {
            r = parseInt(r);
            g = parseInt(g);
            b = parseInt(b);
            var s=[r,g,b].sort(function (a,b){return a>b}),x=s[0]/s[2],y=(1-s[2]/255),n=(255*(s[1]-s[0])/(s[2]-s[0])+0.5)|0,
            _s=[r,g,b].map(function (t) {
                var _t=t/s[1];
                return _t<1?0:_t>1?255:n
            });
            this.x = x;
            this.y = y;
            this.draw([_s[0],_s[1],_s[2],a]);
            this.dSlider.css({
                transform:'translateX(-'+x*256+'px) translateY('+y*150+'px)'
            });
            this.tSlider.css({
                transform:'translateX('+(parseFloat(a)*19200|0)/100+'px)'
            })
        },
        transform:function (x,t) {
            var hex,rgb,hsl;
            function h2r(x) {
                var r,g,b;
                if(x.length===4){
                    r='0x'+x[1]+x[1];
                    g='0x'+x[2]+x[2];
                    b='0x'+x[3]+x[3];
                }else if(x.length===7){
                    r='0x'+x[1]+x[2];
                    g='0x'+x[3]+x[4];
                    b='0x'+x[5]+x[6];
                }else {return false}
               return [parseInt(r),parseInt(g),parseInt(b)];
            }
            function r2h(rgb) {
                var r,g,b;
                r=('0'+parseInt(rgb[0]).toString(16)).slice(-2);
                g=('0'+parseInt(rgb[1]).toString(16)).slice(-2);
                b=('0'+parseInt(rgb[2]).toString(16)).slice(-2);
                if(r[0]===r[1]&&g[0]===g[1]&&b[0]===b[1]){
                    return '#'+r[0]+g[0]+b[0]
                }else {
                    return '#'+r[0]+r[1]+g[0]+g[1]+b[0]+b[1]
                }
            }
            function hslToRgb(h, s, l) {
                var r, g, b;
                h = parseInt(h)/360;
                s = parseInt(s)/100;
                l = parseInt(l)/100;
                if(s == 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = function hue2rgb(p, q, t) {
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    };

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }

                return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
            }
            function rgbToHsl(r, g, b) {
                r /= 255;
                g /= 255;
                b /= 255;
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, l = (max + min) / 2;

                if (max == min){
                    h = s = 0; // achromatic
                } else {
                    var d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                    switch(max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }
                h=((h*360+0.5)|0).toString();
                s=((s*100+0.5)|0).toString()+'%';
                l=((l*100+0.5)|0).toString()+'%';
                return [h, s, l];
            }
            switch (t){
                case 'hex':
                    hex = x;
                    rgb = h2r(hex);
                    hsl = rgbToHsl.apply(null,rgb);
                    break;
                case 'rgb':
                    rgb = x;
                    hex = r2h(rgb);
                    hsl = rgbToHsl.apply(null,rgb);
                    break;
                case 'hsl':
                    hsl = x;
                    rgb = hslToRgb.apply(null,hsl);
                    hex = r2h(rgb);
            }
            this.transformValue = {hex:hex,rgb:rgb,hsl:hsl};
            return this.transformValue
        },
        switch:function (n) {
            var $a=$cv.find('.active'),_i=[].indexOf.call($cv[0].children,$a[0]),i=_i,c=this.transformValue;
            if(n){
                if(n===$a[0].dataset['type']){

                }else {
                    switch (n){
                        case 'hex':
                            _i = 0;
                            break;
                        case 'rgb':
                            _i = 1;
                            break;
                        case 'hsl':
                            _i = 2;
                            break;
                        default:
                            return
                    }
                }
            }else {
                _i++;
            }
            if(this.alpha<1&&(_i===0||_i===3)){
                _i = 1;
            }
            if(_i!==i){
                $a.removeClass('active');
                var _n = $cv.children().eq(_i);
                _n.addClass('active');
            }else {
                _n = $a
            }
            this.currentType=_n[0].dataset['type'];
            if(this.currentTarget){
                var s;
                switch (this.currentType){
                    case 'hex':
                        s = c.hex;
                        break;
                    case 'rgb':
                        s = 'rgba('+c.rgb.join(',')+','+this.alpha+')';
                        break;
                    case 'hsl':
                        s = 'hsla('+c.hsl.join(',')+','+this.alpha+')';
                        break;
                    default:
                        return
                }
                this.currentTarget.nextSibling.nodeValue = s
            }
        },
        transparent:function (n) {
            n = parseFloat(n);
            if(n>1||n<0){return false}
            if(n<1&&this.currentType==='hex'){
                this.currentType = 'rgb'
            }

            n = ((n*100+0.5)|0)/100;
            this.alpha = n;
            this.read();
        }
    };

    var $te = $('#te-content'),$n=$('#number-c');
    $te.size = 1;
    var df = function () {
        var l=($te[0].offsetHeight/19)|0;
        if($te.size !==l){
            $te.size = l;
            $n[0].innerText = Array.from({length:l},function(v,k){return k+1}).join('\n')
        }
    };
    $te.on('DOMNodeInserted',function(e){
            // df(e);
            e.srcElement.nodeValue==='\n'&&(df(),e.srcElement.addEventListener('DOMNodeRemoved',df))
    }).on('paste',function(){
        var n=document.getSelection().focusNode,
        m=new MutationObserver(function () {
            var n=document.getSelection().focusNode,r=new RegExp(/[\n]/),
                f=function (t) {
                    if(!t.nodeValue){return}
                    var x = r.exec(t.nodeValue),a;
                    if(x){
                        t.splitText(x.index);
                        a = t.nextSibling;
                        a.splitText(1);
                        a.addEventListener('DOMNodeRemoved',df);
                        f(a.nextSibling)
                    }
                };
            f(n);
            df();
            this.disconnect()
        });
        m.observe(n,{characterData:true,childList:true})
    }).on('focus',function () {
        $te.focus = true
    }).on('blur',function () {
        $te.focus = false
    });
    document.execCommand('undo',false,function () {
        $te.focus&&df();
    });
    document.execCommand('redo',false,function () {
        $te.focus&&df();
    });
    $te.content = function (t) {
        var v=document.createDocumentFragment(),s=document.createTextNode(t),r=new RegExp(/[\n]/),
            f=function (t) {
                if(!t.nodeValue){return}
                var x = r.exec(t.nodeValue),a;
                if(x){
                    t.splitText(x.index);
                    a = t.nextSibling;
                    a.splitText(1);
                    a.addEventListener('DOMNodeRemoved',df);
                    f(a.nextSibling)
                }
            };
            v.appendChild(s);
            f(s);
            this[0].innerText= null;
            this[0].appendChild(v)
    };
    win.te = $te
})(window);

