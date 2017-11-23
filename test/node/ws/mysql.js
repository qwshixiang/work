const mysql=require('mysql');

// let db=mysql.createConnection({host:'localhost',user:'root',password:'',database:'20171116test'})
//连接池 max:10
let db=mysql.createPool({host:'localhost',user:'root',password:'',database:'20171116test'})

db.query('SELECT * FROM user_table',(err,data)=>{
  if(err){
    console.log(err)

  }else{
      console.log(JSON.stringify(data))
  }
})
