let startEndMessage = [
    {time:"(09:21:45)", sender:"João ", action:"entra na sala..."},
    {time:"(09:22:58)", sender:"Maria ", action:"sai da sala..."}
];


let publicMessage = [
    {time: "(09:22:28)", sender: "João ", action: "para ", receiver: "todos: ", message:"Bom dia"},
    {time: '(09:22:38)', sender: "Maria ", action: "para ", receiver: "João: ", message:"Oi João :)"}
];
console.log(publicMessage);

let privateMessage = [
    {time: "(09:22:48)", sender: "João ", action: "reservadamente para ", receiver: "Maria: ", message:"Oi gatinha quer tc?"}
];

let user;

function startChat(){
    user = prompt('Qual o seu nome?');
    console.log(user);

    userLogin();
    getMessages();
};
startChat();

function userLogin(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name:user});
    promise.then(loginFinished);
    promise.catch(loginError);
};

function loginFinished(done){
    console.log(done);
};

function loginError(error){
    console.log(error);
};

function getMessages(){
    //função responsável por buscar mensagens do servidor
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    console.log(promise);
    promise.then(showPublicMessage);
};


/*function addMessage(){
    //função que recebe a mensgaem escrita pelo user no input e envia para o servidor
    const timeInformation = document.querySelector('time');
    const senderInformation = document.querySelector('.sender');
    const actionInformation = document.querySelector('.action');
    const receiverInformation = document.querySelector('.receiver');
    const messageInformation = document.querySelector('.message');

    //estrutura do contém na mensagem
    const sendMessage = {time: timeInformation, sender: senderInformation, 
    action: actionInformation, receiver: receiverInformation, message: messageInformation};
    
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', sendMessage);
    promise.then(showMessages);
    //promise.catch(errorMessage);


}*/


function showPublicMessage(awnser){
    //função para rederizar informações públicas na tela

    const messageChat = awnser.data;
    console.log(messageChat);

    const layoutMessage = document.querySelector('.messages-box');
    console.log(layoutMessage);
    
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
