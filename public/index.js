
function scrollToBottom(){
    var mesages = jQuery('#messages');
    var newMessage = mesages.children('li:last-child');

    var clientHeight = mesages.prop('clientHeight');
    var scrollHeight = mesages.prop('scrollHeight');

    var scrollTop = mesages.prop('scrollTop');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        mesages.scrollTop(scrollHeight);
    }
}

let socket = io();
        socket.on('connect',function(){
            console.log("socket is connected");

            var params = jQuery.deparam(window.location.search);
            console.log("parmas are these",params);

            socket.emit('join',params,function(err){
                if(err){
                    alert(err);
                    window.location.href='/'
                } else {
                    console.log("room joined");
                }
            })
           
        })

        socket.on('updatedUsers',function(usersList){
            console.log("users list is this.......>",usersList);

            var ol = jQuery('<ol></ol>')

            usersList.forEach(element => {
                ol.append(jQuery('<li></li>').text(element));
            });

            jQuery('#users').html(ol);
        })
        
       
        socket.on('newMessage',function(newMessage){
            console.log(newMessage);
            let messageTime = moment(newMessage.createdAt).format('h:mm:a');
            var templateData = jQuery('#message-template').html();
            var html = Mustache.render(templateData,{
               time :   messageTime ,
               from :    newMessage.from , 
                message : newMessage.message
            });

            jQuery('#messages').append(html)
            scrollToBottom()
            
            // var li = jQuery('<li></li>');
            // 
            // li.text(`${newMessage.from}  ${messageTime} ${newMessage.message}`);
            // jQuery('#messages').append(li);

        })





        jQuery('#message-form').on('submit',function(e){
            console.log("in form submit")
            e.preventDefault()
            socket.emit('createMessage',{
                from : 'User',
                message : jQuery('[name=message]').val()

            },function(data){
               
                  
               
            });

        })