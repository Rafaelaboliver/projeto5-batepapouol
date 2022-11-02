
let user;
let chat;
let message;

function startChat(){
    //perguntar nome do usuário:
    user = prompt('Qual o seu nome?');
    console.log(user);

    //executar funções:
    userLogin();
    getMessages();

    //atualizar as funções nos tempos que foram determinados:
    setInterval(refreshChat, 5000);
    setInterval(getMessages, 3000);
};

startChat();

//função responsável por cadastrar o usuário no servidor:
function userLogin(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name:user});
    promise.then(loginFinished);
    promise.catch(loginError);
    console.log(promise.catch);
};

function loginFinished(done){
    console.log('login done');
};

//caso o  nome de usuário já exista, informar e solicitar o nome novamente:
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
    
    //estrutura que deve compor a mensagem
    const sendMessage = {from: user, to: 'Todos', text: messageInformation, type:'message'};
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', sendMessage);
    promise.then(messageDone);
    promise.catch(messageError);


};

function messageDone(sent){
    console.log('the message has been sent');
};


//função para caso haja erro ao enviar, relogar a tela e iniciar o chat novamente
function messageError(error){
    console.log('error to sent the message');
    
    if(error.status !== 200){
        window.location.reload(startChat);  
    };
};

//função para rederizar as mensagens na tela
function showPublicMessage(awnser){

    const messageChat = awnser.data;
    console.log(messageChat);

    const layoutMessage = document.querySelector('.messages-box');
    console.log(layoutMessage);
    
    layoutMessage.innerHTML ='';

    for(let i = 0; i < messageChat.length; i++){

        let publicBox = messageChat[i];

        
        let layoutPublicMessage;
        //mensagem para todos
        if (publicBox.type === 'message'){

            layoutPublicMessage = `
                <li class="public-message"> 
              
                    <p>
                        <time>${publicBox.time}</time><span class="sender">${publicBox.from} </span> <span class="action">para </span> <span class="receiver">${publicBox.to}: </span> <span class="message">${publicBox.text}</span>
                    </p>
        
                </li> 
             `;
          //mensagem de entrada e saída da sala  
        } if (publicBox.type === 'status'){

            layoutPublicMessage = `
                <li class="start-end-room"> 
              
                    <p>
                        <time>${publicBox.time}</time><span class="sender">${publicBox.from} </span><span class="action">${publicBox.text}</span> 
                    </p>
            
                </li>
            `;
            //mensagem para alguém em específico
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

    //rolagem automática
    const lastMessageChat = document.querySelector('.messages-box li:last-child');
    lastMessageChat.scrollIntoView();
    
};

//função responsável por atualizar o usuário
function refreshChat(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name:user});
    promise.then(refreshDone);
    promise.catch(refreshError);
};

function refreshDone(done){
    console.log('refresh done');
};

function refreshError (error){
    console.log('refresh error');
};