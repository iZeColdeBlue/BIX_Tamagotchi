const loveButton = document.getElementById("loveB");
const hungerButton = document.getElementById("hungerB");
const hygieneButton = document.getElementById("hygieneB");

const socket = new WebSocket("wss://settled-closely-moccasin.ngrok-free.app/test");

const currentLove = 100.00;
const currentHunger = 100.00;
const currentHygiene = 100.00;

window.onload = () => {
    document.documentElement.style.setProperty('--loveGraphFill', currentLove);
    document.documentElement.style.setProperty('--hungerGraphFill', currentHunger);
    document.documentElement.style.setProperty('--hygieneGraphFill', currentHygiene);
}

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
