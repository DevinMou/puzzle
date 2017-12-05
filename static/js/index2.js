"use strict";
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
        /*merge:function (a, b, k) {
            var c,index;
            if(this.type(a)===this.type(b)&&this.type(a)==='Object'){
                c = k?this.extend({},b):{};
                for(var i in a){
                    if(a.hasOwnProperty(i)){
                        if(i in b){
                            a[i]!==b[i]&&(c[i]=a[i])
                        }else {
                            c[i] = a[i]
                        }
                    }
                }
                return c
            }
            else if(this.type(a)===this.type(b)&&this.type(a)==='Array'){
                c = k?this.extend([],b):[];
                for(i in a){
                    if(index=b.indexOf(a[i]),index<0){
                        c.push(a[i])
                    }
                }
                return c
            }
            else {return null}
        },*/
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
                var _tx,_ty,_z,i,_i;
                _tx = this.type(x);
                _ty = this.type(y);
                if(_tx === _ty){
                    _z = c?this.extend(y):null;
                    if(_tx === 'Object'){
                        _z = _z||{};
                        for(i in x){
                            if(x.hasOwnProperty(i)){
                                _z[i] = y.hasOwnProperty(i)?_m(x[i],y[i]):this.extend(x[i])
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
                    _z = this.extend(x)
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
        this.domObserver.observe(document.body,{childList:true,attributes:true,characterData:true,subtree:true})
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
                            _tm = _tm ? _tm.renderData : null;
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
                                if (_temp.event.hasOwnProperty(im)) {
                                    if (!_temp.element[im]) {
                                        _temp.element[im] = function (event) {
                                            return Page.pidHub[merge].eventHandle(im, _temp.uuid, event, this)
                                        }
                                    }

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
            }else if(a.length && typeof b === 'function'){
                el = a;
                fn = b
            }else {
                return false
            }
            for(;i<el.length;i++){
                fn.call(el[i],i,el[i])
            }
            return el
        },
        attrs:function(){
            var el = this[0],atts=el&&el.attributes,i,_atts;
            for(i=0;i<atts.length;i++){
              _atts[atts[i].name] = atts[i].value
            }
            return _atts
        },
        on:function(a,b){
            var dataVd=this[0].dataset['vd'],vd;
            if(dataVd){
                vd = vD.hub[dataVd];
                vd&&vd.defaultEvents[a]&&(vd.defaultEvents['on'+a].push(b))
            }else {
                this[0].addEventListener(a,b)
            }
            return this
        }
    };
    _tool.extend(jQ,{

    });
    var _jq_init=jQ.fn.init = function(select){
        var d=null,_this = this;
        if(typeof select === 'string'){
            d = document.querySelectorAll(select)
        }
        else if(select.nodeType&&(select.nodeType===1||select.nodeType===11)){
            d = select
        }
        if(d){
            if(d&&d.length){
                jQ.fn.each(d,function(i,e){
                    _this[i] = e
                });
                this.length = d.length
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
        eventHandle:function (eventName, uuid, event,_this) {
            var _evens,i=0,_target = this.hub[uuid]||this.deskTopHub[uuid]||null;
            if(!_target) return;
            if(this.isDeskEvent) {
                _evens = _target.defaultEvents[eventName];
            }else {
                _evens = _target.events[eventName];
            }
            if(!_evens){return}
            for(i;i<_evens.length;i++){
                _evens[i](event,_this)
            }
        }

    };
    Page.fn.init = function () {
        var _arg,_tag;
        _arg=arguments;
        _tag = _arg.length?_arg[0].toUpperCase():null;
        this.tagName =  _tag;
        this.attributes = {
        };
        this.events = {
            onclick:[]
        };
        this.style = _tag&&this.originalData[_tag]&&this.originalData[_tag]['css'];
        this.renderData = _tool.extend({},this);
        this.defaultEvents = {

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
        css:function (style) {
            this.style = _tool.merge(this.style,style,true);
            this.dcpAdd({style:style})
        },
        event:function(n,e){

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
                }else {
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
                e=this.events;
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
            for (i in e){
                /*
                 e = {
                 onclick:[f1,f2,...],
                 onmouseup:[f1,f2,...]
                 }
                 */
                if(e.hasOwnProperty(i)&&!_d[i]){
                    var _this = this;
                    _d[i] = function (event) {
                        return this.eventHandle(i,this.uuid,event,this)
                    }.bind(this)
                }
            }
            this.dom = _d;
            return t?{ element:_d,actual:false }:_d
        }
    };

        var vD = function (select){
            return new vD.fn.init(select)
        };
        var structure = function(uuid){
            return new structure.init(uuid)
        };
        structure.init = function(uuid){
            this.uuid = uuid;

            return this
        };
        _tool.extend(vD,{
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
            isDeskEvent:false,
            uuid:function(l){
                l = l||8;
                var _u = Number('1e'+(l-1)).toString().replace(/\S/g,function () {
                    return (Math.random()*36|0).toString(36)
                });
                if(this.tree.hasOwnProperty(_u)){
                    this.uuid(l)
                }else {
                    return _u
                }
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
            eventHandle:function (eventName, uuid, event,_this) {
                var _evens,i=0,_target = vD.hub[uuid]||vD.deskTopHub[uuid]||null;
                if(!_target) return;
                if(vD.isDeskEvent) {
                    _evens = _target.defaultEvents[eventName];
                }else {
                    _evens = _target.events[eventName];
                }
                if(!_evens){return}
                for(i;i<_evens.length;i++){
                    _evens[i](event,_this)
                }
            }

        });
        vD.fn = vD.prototype = {
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
            css:function (style) {
                this.style = _tool.merge(this.style,style,true);
                this.dcpAdd({style:style})
            },
            event:function(n,e){

            },
            dcpAdd:function(data,fn){
                /*
                  data:{action:...,parent:...,site:...,style:...,event:...}
                 */
                if(_tool.type(data)!=='Object'){return false}
                var n = data.action,p = data.parent,s = data.site,style = data.style,
                    attributes = data.attributes,
                    e = data.event;
                function toElement(a) {
                    if(!a){return false}
                    else if(a instanceof vD){
                        a = a.render()
                    }
                    else if(typeof a === 'string'){
                        var _vm = vD.hub[a]||vD.deskTopHub[a]||null;
                        if(_vm===null){return false}
                        a = _vm.return()
                    }else if(a instanceof Element){
                    }else {
                        return false
                    }
                    return a
                }
                p = toElement(p);
                s = toElement(s);
                if((n&&['append','remove','replace','before'].indexOf(n)>-1&&!p)
                    ||((n==='replace'||n==='before')&&!s)){
                    return false
                }
                dcp.add({
                    uuid:this.uuid,
                    element:this.render(),
                    action:n,
                    relative:{parent:p,site:s},
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
            render:function(){
                if(!this.uuid&&!this.tagName){return false}
                var _d=document.querySelector('[data-vd=\''+this.uuid+'\']'),s=this.style,_s,i,
                    e=this.events;
                if(_d){ return _d }
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
                for (i in e){
                    /*
                    e = {
                        onclick:[f1,f2,...],
                        onmouseup:[f1,f2,...]
                    }
                     */
                    if(e.hasOwnProperty(i)&&!_d[i]){
                        var _this = this;
                        _d[i] = function (event) {
                            return vD.eventHandle(i,_this.uuid,event,this)
                        }
                    }
                }
                return _d
            }
        };
        var _vd_init = vD.fn.init = function(){
                var _arg,_tag;
                    _arg=arguments;
                    _tag = _arg.length?_arg[0].toUpperCase():null;
                this.tagName =  _tag;
                this.attributes = {
                };
                this.events = {
                    onclick:[]
                };
                this.style = _tag&&vD.originalData[_tag]&&vD.originalData[_tag]['css'];
                this.renderData = _tool.extend({},this);
                this.defaultEvents = {

                };
                this.uuid = vD.uuid();
                vD.hub[this.uuid] = this;
                return this
        };
        _vd_init.prototype = vD.fn;
        win.vD = vD;
        win.vd = vD;
    win.Page = Page;
    var $tools = jQ('#tools');
    var m={
        a:true,
        md:function (e) {
            console.log('md',this)
        },
        mm:function (e) {
            console.log('mm',this)
        },
        mu:function (e) {
            console.log('mu',this)
        }
    };
    // $tools.on('mousedown',m.md.bind(m)).on('mousemove',m.mm.bind(m)).on('mouseup',m.mu.bind(m))
})(window);

