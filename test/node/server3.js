const http=require("http");
const fs=require("fs");
let server=http.createServer(function(req,res){
  res.setHeader('Access-Control-Allow-Origin','*')
    setTimeout(function(){
      res.write('211')
      res.end()
    },Math.floor(Math.random()*20000))
  //     res.write('aaaa')
  // }else if(req.url=="/bbb"){
  //     res.write('bbb')
  // }
  // else if(req.url=="/index.html"){
  //   res.write('index')
  // }else {
  //   res.write('404')
  // }
  // res.end()
});
server.listen(666);
console.log('监听成功')
