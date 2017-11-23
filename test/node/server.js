const http=require("http");
const fs=require("fs");
let server=http.createServer(function(req,res){
  fs.readFile(`www${req.url}`,(err,data)=>{
    if(err){
      fs.readFile('./http_errors/404.html',(err,data)=>{
        console.log(err)
        if(err){
          res.writeHeader('404')
          res.write('no found')
        }else{
           res.writeHeader('404')
           res.write(data)
        }
        res.end()
      })

    }else{
       res.write('data')
       res.end()
    }

  })
  console.log(req.url)
  // if(req.url=="/aaa"){
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
