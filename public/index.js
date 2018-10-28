const allUsers = [];
const allTabs = {
    'TABhome': {
        name: 'home',
        close: false,
    },
};
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

function addTab(ID, name) {
    const nav = $('.chat__nav');
    let newTab = 
    `<div id="${ID}" class="chat__nav-tab">
        <span class="chat__nav-name" onClick="selectTab('${ID}')">${name}</span>
        <b class="chat__nav-close" onClick="closeTab('${ID}')">x</b>
    </div>`;
    nav.append(newTab);
}

function selectTab(ID) {
setTabActive(ID);
}

function closeTab(ID) {
    if($(`#${ID}`).hasClass('active')) {
        setTabActive('all');
    }
    const element = document.getElementById(ID);
    element.parentNode.removeChild(element);

    
}

function setTabActive(tabID) {
    if($('.chat__nav-tab.active')[0].id === tabID) return;
    $('.chat__nav-tab.active').removeClass('active');
    $(`#${tabID}`).addClass('active');
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
        
        jQuery('#createGroupId').on('click',function(e){
            console.log("create group is clicked-->");
            
        })

        socket.on('updatedUsers',function(usersList){
            console.log("users list is this.......>",usersList);

            var ol = jQuery('<ol></ol>')

            usersList.forEach(element => {
                ol.append(jQuery(`<li id="${element}" class="users__list-item"></li>`).text(element));
            });

            
            
            jQuery('#users').html(ol);

            jQuery('.users__list-item').on('click', function(e) {
                const ID = `TAB${e.target.id}`;
                const name = e.target.innerHTML;
                allTabs[ID] = {
                    name,
                };

                console.log(ID, name)

                addTab(ID, name);

            })
        })

        socket.on('newGroup',(groupList)=>{
            //  room to be added in list
            
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
                message : jQuery('[name=message]').val() , 
                to : jQuery('.chat__nav-tab.active span')[0].innerHTML
                
            },function(data){
               
            });

        })