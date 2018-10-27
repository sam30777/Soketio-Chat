

class Users {
    constructor(){
        this.users = [];
    }

    addUser(id,room,userName){
        let user = {id,room,userName}
        this.users.push(user);
        return user;
    }

    getUserLIst(room){
        console.log("room is this--->",room);
        var users = this.users.filter((user)=>{
            return user.room === room
        })

        console.log("user for that room",users);
        var userNames = users.map((user)=>{
            return user.userName;
        })

        

        return userNames;
    }

    removeUser(id){
        console.log("in remove user --->",id);
        console.log('users before remove',this.users);
        let user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user)=>{
               return   user.id !== id 
            })
        }

        return user;
    }

    getUser(id){
        
        return this.users.filter((user)=>{
            return user.id == id 
        })[0]
    }
    
}


module.exports = {Users}