const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const tool =require('./tool');
const hostname = '127.0.0.1';
const port = 3001;
const server = http.createServer(function(req,res){
  let referer = req.headers['referer'];
  console.log('referer:',referer,'pathname:',url.parse(req.url).pathname);
  referer&&!url.parse(req.url).host?(referer = url.parse(referer).pathname):(referer='');
  let pathname = __dirname+url.parse(req.url).pathname;
  //let pathname = __dirname+url.parse(req.url).pathname;
  let agent = req.headers['user-agent'].toLowerCase();
  let isPhone = agent.match(/(phone|ipod|ipad|android)/);
  if(path.extname(pathname)===''&&pathname.charAt(pathname.length-1)!=='/'){
    pathname+='/'
  }
  if(pathname.charAt(pathname.length-1)==='/'){
    if(isPhone){
        try {
            fs.accessSync(pathname +'wrap.html');
            pathname +='wrap.html'
        }
        catch (err){
            pathname +='index.html'
        }
    }
    else {
        try {
            fs.accessSync(pathname +'index.html');
            pathname +='index.html'
        }
        catch (err){
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
            return
        }
    }
  }
  console.log(pathname);
  fs.readFile(pathname,(err,data)=>{
    if(err){
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h1>404 Not Found</h1>");
    }
    else {
        switch (path.extname(pathname)){
            case '.html':
                res.writeHead(200,{'Content-Type':'text/html'});
                break;
            case '.js':
                res.writeHead(200,{'Content-Type':'text/javascript'});
                break;
            case '.css':
                res.writeHead(200,{'Content-Type':'text/css'});
                break;
            case '.gif':
                res.writeHead(200,{'Content-Type':'image/gif'});
                break;
            case '.png':
                res.writeHead(200,{'Content-Type':'image/png'});
                break;
            case '.jpg':
                res.writeHead(200,{'Content-Type':'image/jpeg'});
                break;
            default:
                res.writeHead(200,{"Content-Type": "application/octet-stream"});
        }
        let arg = {
            isPhone:isPhone,
            data:[
                {name:'大耳朵图图',text:'设计借隔阂金丝合格能告诉科技列喝啊widow韩国风味',num:3},
                {name:'大耳朵图图',text:'设计借隔阂金丝合格能告诉科技列喝啊widow韩国风味',num:3},
                {name:'',text:'设计借隔阂金丝合格能告诉科技列喝啊widow韩国风味',num:0},
                {name:'大耳朵图图',text:'设计借隔阂金丝合格能告诉科技列喝啊widow韩国风味',num:3},
                {name:'大耳朵图图',text:'设计借隔阂金丝合格能告诉科技列喝啊widow韩国风味',num:3},
                {name:'大耳朵图图',text:'设计借隔阂金丝合格能告诉科技列喝啊widow韩国风味',num:3},
            ]
        };
        let tem = ['.html'].indexOf(path.extname(pathname))>-1? tool.template(data,arg):data;
        res.end(tem)
    }
  });
});
server.listen(port,hostname,()=>{
  console.log(`服务器运行在 http://${hostname}:${port}/`);
});
