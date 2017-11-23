const http=require('http');
const fs=require('fs');
const mysql=require('mysql');
const socket=require('socket.io');
const regs=require('regs')
let db=mysql.createPool({host:'localhost',user:'root',password:'',database:'20171116test'})
let httpServer=http.createServer((req,res)=>{
  fs.readFile(`www${req.url}`,(err,data)=>{
    if(err){
      res.writeHeader(404);
      res.write('not found')
    }else{
      res.write(data)
    }
    res.end()
    })
})
httpServer.listen(555)

let aSock=[];
const wsServer=socket.listen(httpServer)
wsServer.on('connection',sock=>{
  aSock.push(sock)
  let current_name=''
  let current_userID=0
//注册
sock.on('reg',(user,password)=>{
  //1.校验数据
  if(!regs.username.test(user)){
    sock.emit('reg_ret',1,'用户名不符合规范')
  }else if(!regs.password.test(password)){
      sock.emit('reg_ret',1,'密码不符合规范')
  }else{//判断用户名是否存在
  db.query(`SELECT ID FROM user_table WHERE username='${user}'`,(err,data)=>{
    if(err){
      console.log(err)
      sock.emit('reg_ret',1,'数据库有错')
    }else if(data.length>0){
      sock.emit('reg_ret',1,'用户名已存在')
    }else{//插入
      db.query(`INSERT INTO user_table (username,password,online) VALUES('${user}','${password}',0)`,err=>{
        if(err){
          sock.emit('reg_ret',1,'数据库有错')
        }else{
          sock.emit('reg_ret',0,'注册成功')
        }
      })
    }
  })
  }
  //
})
//登录
sock.on('login',(user,password)=>{
  if(!regs.username.test(user)){
    sock.emit('login_ret',1,'用户名不符合规范')
  }else if(!regs.password.test(password)){
      sock.emit('login_ret',1,'密码不符合规范')
  }else{
    db.query(`SELECT ID,password FROM user_table WHERE username='${user}'`,(err,data)=>{
      console.log(data)
      if(err){
          sock.emit('login_ret',1,'数据库有错')
      }else if(data.length==0){
        sock.emit('login_ret',1,'用户名不存在')
      }else if (data[0].password!=password){
        sock.emit('login_ret',1,'用户名或密码错误')
      }else{
        db.query(`UPDATE user_table SET online=1 WHERE ID='${data[0].ID}'`,err=>{
          if(err){
            sock.emit('login_ret',1,'数据库有错')
          }else{
            sock.emit('login_ret',0,'登录成功')
            current_name=user;
            current_userID=data[0].ID

          }
        })

      }
    })
  }
})
//发言
sock.on('msg',txt=>{
  if(!txt){
    sock.emit('msg_ret',1,'消息不能为空')
  }else{
    //广播给所有人
    aSock.forEach(item=>{
      if(item==sock){return}
      item.emit('msg',current_name,txt)
    })
    sock.emit('msg_ret',0,'发送成功')
  }
})
//离线
sock.on('disconnect',function(){
  db.query(`UPDATE user_table SET online=0 WHERE ID=${current_userID}`,err=>{
    if(err){console.log('数据库有错'+err)}
    current_name='';
    current_userID='';
    aSock=aSock.fiter(item=>item!=sock)
  })
})
})
