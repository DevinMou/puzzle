//模版渲染
exports.template = function(s,arg){
    s = (s||'').toString();
    arg = arg||{};
    let Reg1=new RegExp(/({%(((?!%}).)*)%})(((?!{%)(\s|\S))*)/g);
    let Reg2=new RegExp(/{{(((?!}}).)*)}}/g);
    let Reg3=new RegExp(/(^|\()(((?!{%if%}).)*)({%if%})(((?!{%else%}).)*)({%else%})/g);
    let str=(Object.keys(arg).length>0?`eval("let "+Object.keys(arg).join(",")+";");
        for(let a in arg){eval(a+"= arg['"+a+"']")};`:'')+
        `let string="";`,
        suffixArray=[];
    let dealDb=(s,f)=>{//未完成python三目运算转js三目
        f = f||false;
        let over = s.replace(Reg2,function(match,$1x){
            let splitA=$1x.split(/(['"])((?:(?!\1).)*?)(\1)/g);
            for(let i in splitA){
                if(splitA.hasOwnProperty(i)){
                    if(i%2===0){
                        splitA[i]=splitA[i].replace(/\s+or\s+/g,'||');
                        splitA[i]=splitA[i].replace(/\s+and\s+/g,'&&');
                        splitA[i]=splitA[i].replace(/\s+if\s+/g,' {%if%} ');
                        splitA[i]=splitA[i].replace(/\s+else\s+/g,' {%else%} ')
                    }                    }
            }
            return `\`+(`+splitA.join('')+`)+\``
        });
        over = over.replace(Reg3,function (match,a,b,c,d,e) {
            return a+e+'?'+b+':'
        });
        return over||s;
    };
    str+=`string+=\``+dealDb(s.split(Reg1,1)[0])+`\`;`;
    s.replace(Reg1,function (match,$1,$2,$3,$4) {
        let r1=/\S+/,prefix = r1.exec($2)[0],lave = $2.split(prefix,2)[1]||'';
        if(prefix){
            switch (prefix){
                case 'for':
                    let filterFor=/for\s+(\S+)\s+in\s+(\S+)/.exec($2);
                    if(filterFor){
                        str+='for(let '+lave+'){'+filterFor[1]+'='+filterFor[2]+'['+filterFor[1]+'];'
                    }
                    else {
                        str+='for( let '+lave+'){';
                    }
                    suffixArray.push('}');
                    break;
                case 'if':
                    str+='if('+lave+'){';
                    suffixArray.push('}');
                    break;
                case 'elif':
                    str+='}else if('+lave+'){';
                    break;
                case 'else':
                    str+='}else{';
                    break;
                case 'set':
                    str+='let '+lave+';';
                    break;
                case 'end':
                    let _pop=suffixArray.pop();
                    if(_pop){
                        str+=_pop
                    }
                    else {
                        //error
                    }
                    break;
                default:
                    str+=prefix+lave
            }
            if($4){
                str+=`string+=\``+dealDb($4)+`\`;`;
            }
        }
    });
    str+='return string';
    return new Function('arg',str)(arg)
};