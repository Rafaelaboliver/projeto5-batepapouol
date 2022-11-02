
let user;
let chat;
let message;

function startChat(){
    user = prompt('Qual o seu nome?');
    console.log(user);

    userLogin();
    getMessages();

    setInterval(refreshChat, 5000);
    setInterval(getMessages, 3000);
};

startChat();

function userLogin(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name:user});
    promise.then(loginFinished);
    promise.catch(loginError);
    console.log(promise.catch);
};

function loginFinished(done){
    console.log('login done');
};

function loginError(promise){
    if(promise.response.status === 400){
        alert('Usuário já existe! Por favor, tente outro nome.');
        startChat();
    };
};

function getMessages(){
    //função responsável por buscar mensagens do servidor
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    console.log('sending requested');
    promise.then(showPublicMessage);
};


function addMessage(){
    const messageInformation = document.querySelector('.type-message').value;
    console.log(messageInformation);

    //estrutura do contém na mensagem
    const sendMessage = {from: user, to: 'Todos', text: messageInformation, type:'message'};
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', sendMessage);
    promise.then(messageDone);
    promise.catch(messageError);


};

function messageDone(sent){
    console.log('the message has been sent');
    console.log(sent);
};

function messageError(error){
    console.log('error to sent the message');
    console.log(error);
};


function showPublicMessage(awnser){
    //função para rederizar informações públicas na tela

    const messageChat = awnser.data;
    console.log(messageChat);

    const layoutMessage = document.querySelector('.messages-box');
    console.log(layoutMessage);
    
    layoutMessage.innerHTML ='';

    for(let i = 0; i < messageChat.length; i++){

        let publicBox = messageChat[i];

        
        let layoutPublicMessage;
        
        if (publicBox.type === 'message'){

            layoutPublicMessage = `
                <li class="public-message"> 
              
                    <p>
                        <time>${publicBox.time}</time><span class="sender">${publicBox.from} </span> <span class="action">para </span> <span class="receiver">${publicBox.to}: </span> <span class="message">${publicBox.text}</span>
                    </p>
        
                </li> 
             `;

        } if (publicBox.type === 'status'){

            layoutPublicMessage = `
                <li class="start-end-room"> 
              
                    <p>
                        <time>${publicBox.time}</time><span class="sender">${publicBox.from} </span><span class="action">${publicBox.text}</span> 
                    </p>
            
                </li>
            `;
        } if (publicBox.to !== 'Todos') {
            layoutPublicMessage = `
                <li class="private-message"> 
            
                    <p>
                        <time>${publicBox.time}</time><span class="sender">${publicBox.from} </span> <span class="action">reservadamente para </span> <span class="receiver">${publicBox.to}: </span> <span class="message">${publicBox.text}</span>
                    </p>
            
                </li>
            `;
        };
        
        layoutMessage.innerHTML += layoutPublicMessage;
    };
    
};

function refreshChat(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name:user});
    promise.then(refreshDone);
    promise.catch(refreshError);
};

function refreshDone(done){
    console.log('refresh done');
    console.log(done);
};

function refreshError (error){
    console.log('refresh error');
    console.log(error);
};