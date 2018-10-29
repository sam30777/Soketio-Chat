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

//let unique = 'sakjslkahfilknalknfakfdlnsdklf';


let rooms = {};


io.on('connection',(socket)=>{
    console.log("connection is this---->");
    socket.emit('newMessage',utils.generateMessage('Admin','Welcome to chat app'));
    socket.on('join',(data,callback)=>{
        console.log("data is this",data)
        if(typeof data.name != 'string' || data.name.length <=0){
           return  callback("Data provided is invalid");
           }
            let user = users.getUserByUserName(data.name);
            if(user){
                return callback("UserName  already exist")
            }
               socket.join('EveryBody'); 
               users.removeUser(socket.id);
               users.addUser(socket.id,'',data.name);
               io.to('EveryBody').emit('updatedUsers',users.getUserListAll());
               socket.broadcast.to('EveryBody').emit('newMessage',utils.generateMessage('Admin',`${data.name} has joined`));
               return callback(null);
        })
        socket.on('createMessage',(message,callBack)=>{
            console.log("in create message",message);

            let user = users.getUser(socket.id);
            if(message.to === 'EveryBody'){
                io.to('EveryBody').emit('newMessage',utils.generateMessage(user.userName,message.message));
            }else{
                let targetUserSocketId = users.getUserByUserName(message.to);
            let messageObj = utils.generateMessage(user.userName,message.message);
            if(targetUserSocketId){
                console.log("target socket id isthis-->",targetUserSocketId.id);
                io.to(targetUserSocketId.id).emit('newMessage',messageObj);
                io.to(user.id).emit('newMessage',messageObj);
            
            }else{
                io.to(user.id).emit('newMessage',messageObj);
            }
            }
            
            callBack('message emited');  
      })

    //   socket.on('joinRoom',(data,callback)=>{c
    //     let user     = user.getUser(socket.id);   
    //     if(!data.room) {
    //        return  callback('No Group name is provided');
    //     }
       
    //     if(rooms.hasOwnProperty(data.room)){
    //         if(rooms[data.room]['users'].hasOwnProperty(user.userName)){
    //             rooms[data.room]['users'][user.userName] = user.id;
    //         }else{
    //             return  callback('User already added in group');
    //         }
    //     }
    //     else {
    //         rooms[data.room]['users'][user.userName] = user.id
    //     }
    //     socket.join(data.room);
    //     let currentRooms = Object.keys(rooms);
    //     socket.emit('newGroup',currentRooms)
        
    //   })

     

      socket.on('disconnect',()=>{
          console.log("user disconnected");
          var user = users.removeUser(socket.id);
          console.log("removed user is this...->",user);
          if(user){
            io.to(user.room).emit('updatedUsers',users.getUserListAll());
            io.to('EveryBody').emit('newMessage',utils.generateMessage('Admin',`${user.userName} has left`));
           // io.to(user.room).emit('newMessage',utils.generateMessage('Admin',`${user.userName} has left`));
          }  
      })
       
    })

    



server.listen(3000,()=>{
    console.log("Server is runnign ar port : 3000");
})