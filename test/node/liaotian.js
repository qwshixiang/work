const http=require('http')
const fs=require('fs')
const url=require('url')//解析地址
const mysql=require('mysql')
const io=require('socket.io')
let db=mysql.createPool({host:'localhost',user:'root',password:'',database:'20171116test'});
let serverHttp=http.createServer((req,res)=>{
  let {pathname,query}=url.parse(req.url,true)
  if(pathname=='/reg'){ //请求注册接口
    //console.log('请求了注册接口',query)
    let {user,password}=query;
    //校验数据
    if(!/^\w{6,32}$/.test(user)){
      res.write(JSON.stringify({code:1,msg:'用户名不符合规范'}))
      res.end()
    }else if(!/^.{6,32}$/.test(password)){
      res.write(JSON.stringify({code:1,msg:'密码不符合规范'}))
      res.end()
    }else{
      //检验用户名是否重复
      db.query(`SELECT * from user_table WHERE username="${user}"`,(err,data)=>{
        if(err){
          res.write(JSON.stringify({code:1,msg:'数据库有错'}))
          res.end()
        }else if(data.length>0){
          res.write(JSON.stringify({code:1,msg:'此用户名存在'}))
          res.end()
        }else{
            //插入
            db.query(`INSERT INTO user_table (username,password,online) VALUES('${user}','${password}',0)`,err=>{
              if(err){
                res.write(JSON.stringify({code:1,msg:'数据库有错'}))
                res.end()
              }else{
                res.write(JSON.stringify({code:0,msg:'注册成功'}))
                res.end()
              }
            })
        }
      })
    }



  }else if(req.url=='/login'){//请求登录接口
    //console.log('请求了登录接口')
  }else{//请求文件
   fs.readFile(`www${req.url}`,(err,data)=>{
     if(err){
       res.writeHeader(404);
       res.write('not found')
     }else{
       res.write(data)
     }
     res.end()
   })
 }

})

 serverHttp.listen(555)
