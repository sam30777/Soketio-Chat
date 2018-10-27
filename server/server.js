let path = require('path');

const indexPath = path.join(__dirname,'../public');

const express = require('express');

const http = require('http');

const socketIo = require('socket.io');

const {Users} = require('./user');


let users = new Users();
let app = new express();

let server = http.createServer(app);

let io = socketIo(server);

let fs = require('fs');

let utils = require('./../utils/utils');


app.use(express.static(indexPath));




io.on('connection',(socket)=>{
    console.log("connection is this---->");
    socket.emit('newMessage',utils.generateMessage('Admin','Welcome to chat app'));
    socket.on('join',(data,callback)=>{
        console.log("data is this",data)
        if(typeof data.name != 'string' || data.name.length <=0 ||
           typeof data.room != 'string' || data.room.length <=0 ){
           return  callback("Data provided is invalid");
           } else {
               socket.join(data.room); 
               users.removeUser(socket.id);
               users.addUser(socket.id,data.room,data.name);
               io.to(data.room).emit('updatedUsers',users.getUserLIst(data.room));
               socket.broadcast.to(data.room).emit('newMessage',utils.generateMessage('Admin',`${data.name} has joined`));
               return callback(null);
            }
     
        })

        socket.on('createMessage',(message,callBack)=>{
            console.log("in create message",message);
            let user = users.getUser(socket.id);
            let messageObj = utils.generateMessage(user.userName,message.message);
            io.to(user.room).emit('newMessage',messageObj);
            callBack('message emited');  
    })

      socket.on('disconnect',()=>{
          console.log("user disconnected");
          var user = users.removeUser(socket.id);
          console.log("removed user is this...->",user);
          if(user){
            io.to(user.room).emit('updatedUsers',users.getUserLIst(user.room));
            io.to(user.room).emit('newMessage',utils.generateMessage('Admin',`${user.userName} has left`));
          }
          
      })
       
    })

    



server.listen(3000,()=>{
    console.log("Server is runnign ar port : 3000");
})