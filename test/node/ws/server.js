const http=require('http');
const ws=require('socket.io');

const server=http.createServer()
server.listen(666);
const wsServer=ws.listen(server);
wsServer.on('connection',sock=>{
  sock.on("a",(n1,n2,n3)=>{//a是消息名称
    console.log(n1,n2,n3)
  })
})
