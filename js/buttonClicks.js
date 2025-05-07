const loveButton = document.getElementById("loveB");
const hungerButton = document.getElementById("hungerB");
const hygieneButton = document.getElementById("hygieneB");

const socket = new WebSocket("ws:https://5a93-2001-871-263-95f1-38b2-d270-e4be-1da6.ngrok-free.app");

socket.onopen = function() {
    console.log('Connected to Processing server');
};

//functions
function loveClicked(){
    console.log("You sent LOVE to the alien!");
    socket.send("LOVE")
}

function hungerClicked(){
    console.log("You sent FOOD to the alien!");
    socket.send("FOOD")
}

function hygieneClicked(){
    console.log("You cleaned the alien!");
    socket.send("SOAP")
}

//called functions 
loveButton.addEventListener("click", loveClicked);
hungerButton.addEventListener("click", hungerClicked);
hygieneButton.addEventListener("click", hygieneClicked);
