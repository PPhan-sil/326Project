const socket = io("http://localhost:9000");

let textInput = document.getElementById("text-input");
const username = localStorage.getItem("username");
const users = ["Alpha Shrek","Shrek FanBoy"];

function addChatElement(message){
    const chatElement = document.createElement("div");
    const innerChat = document.createElement("div");
    const chatBox = document.getElementById("chat-texts");
    chatElement.classList.add("text");
    
    innerChat.classList.add("blue-text");
    innerChat.innerHTML = message;
    chatElement.appendChild(innerChat);
    chatBox.appendChild(chatElement);
    autoScroll();
}
function autoScroll(){
    const texts_container = document.getElementById("chat-texts");
    texts_container.scrollTop = texts_container.scrollHeight - texts_container.clientHeight;
}

textInput.addEventListener("keypress",(event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const payload = {
            message: textInput.value,
            receiver: users[0] === username ? users[1] : users[0]
        }
        socket.emit("send-message",payload);
    }
})
socket.emit("login",username)

socket.on("inbox-message",(payload) => {
    const {sender,message} = payload;
    addChatElement(`From ${sender}: ` + message);
})

socket.on("response-message",(payload) => {
    const {sender,message} = payload;
    console.log(`From ${sender}: ` + message);
    addChatElement(`From ${sender}: ` + message);
})