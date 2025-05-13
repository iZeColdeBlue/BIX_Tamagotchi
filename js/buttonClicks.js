const loveButton = document.getElementById("loveB");
const hungerButton = document.getElementById("hungerB");
const hygieneButton = document.getElementById("hygieneB");

const blockTimer = document.getElementById('timer');
const UNLOCK_KEY = "uiUnlockTime";
const title = document.getElementById('pageTitle');

const alert = document.getElementById('warningAlert');
const alertText = document.getElementById('alertText');

const socket = new WebSocket("wss://settled-closely-moccasin.ngrok-free.app/test");
//start websocket connection: ngrok http --url=settled-closely-moccasin.ngrok-free.app 8025

let currentLove;
let currentHunger;
let currentHygiene;

let lockDurration;
let unlockTimestamp;

// update the graph with the current values - fetch data from the server
async function updateGraph() {
    socket.send("GET");

    // Wait for the WebSocket message
    const data = await new Promise((resolve) => {
        socket.onmessage = function(event) {
            resolve(JSON.parse(event.data));
        };
    });

    // Update the graph with the received data
    currentLove = data.love;
    currentHunger = data.hunger;
    currentHygiene = data.hygiene;

    document.documentElement.style.setProperty('--loveGraphFill', currentLove + '%');
    document.documentElement.style.setProperty('--hungerGraphFill', currentHunger + '%');
    document.documentElement.style.setProperty('--hygieneGraphFill', currentHygiene + '%');

    if(currentLove < 10 || currentHunger < 10 || currentHygiene < 10){
        alert.classList.remove('hidden');
        alertText.textContent = "The Alien needs:";
        if(currentLove < 10){
            alertText.textContent += " LOVE";
        }
        if(currentHunger < 10){;
            alertText.textContent += " FOOD";
        }
        if(currentHygiene < 10){
            alertText.textContent += " SOAP";
        }
    }   
}

//runs when the pages content is loaded
window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.setProperty('--loveGraphFill', currentLove + '%');
    document.documentElement.style.setProperty('--hungerGraphFill', currentHunger + '%');
    document.documentElement.style.setProperty('--hygieneGraphFill', currentHygiene + '%');

    const storedUnlockTimestamp = localStorage.getItem(UNLOCK_KEY);
    if(!storedUnlockTimestamp){
        unlockUI();
    }
    const remainingTime = storedUnlockTimestamp - Date.now();
    if (remainingTime > 0) {
        lockDurration = remainingTime;
        blockUI();
        updateTimer();
    } else {
        localStorage.removeItem(UNLOCK_KEY);
        unlockUI();
    }
    
});

// runs when the page is loaded
window.addEventListener('load', () => {
    setInterval(updateGraph, 1000); // Update 10 second
});

//socket connection
socket.onopen = function() {
    console.log('Connected to Processing server');
    alert.classList.add('hidden');
};

//if the connection is closed
socket.onerror = function() {
    alert.classList.remove('hidden');
    alertText.textContent = "Could not connect to the server.";
}

//send data to server - called when buttons are clicked
function loveClicked(){
    if(loveButton.classList.contains('button')){
        if(currentLove < 100){
            console.log("You sent LOVE to the alien!");
            socket.send("LOVE");
            //currentLove += 5;
            document.documentElement.style.setProperty('--loveGraphFill', currentLove + '%');
        }
    } 
}

function hungerClicked(){
    if(hungerButton.classList.contains('button')){
        if(currentHunger < 100){
            console.log("You sent FOOD to the alien!");
            socket.send("FOOD");
            //currentHunger += 5;
            document.documentElement.style.setProperty('--hungerGraphFill', currentHunger + '%');
        }
    }
}

function hygieneClicked(){
    if(hygieneButton.classList.contains('button')){
        if(currentHygiene < 100){
            console.log("You cleaned the alien!");
            socket.send("SOAP");
            //currentHygiene += 5;
            document.documentElement.style.setProperty('--hygieneGraphFill', currentHygiene + '%');
        }
    }
}

// Function to block the UI and show the timer - called when buttons are clicked
function blockUI(){
    hygieneButton.classList.remove('button');
    hungerButton.classList.remove('button');
    loveButton.classList.remove('button');

    hygieneButton.classList.add('blocked');
    hungerButton.classList.add('blocked');
    loveButton.classList.add('blocked');

    blockTimer.classList.remove('hidden');
    title.textContent = "Wait to send more love!";
}

// Function to unlock the UI after the timer ends
function unlockUI(){
    hygieneButton.classList.remove('blocked');
    hungerButton.classList.remove('blocked');
    loveButton.classList.remove('blocked');

    hygieneButton.classList.add('button');
    hungerButton.classList.add('button');
    loveButton.classList.add('button');
    title.textContent = "Take care of our friendly alien!";
}

// Function to update the timer - called when buttons are clicked
function updateTimer(){
    if(!lockDurration){
        lockDurration = 5 * 60 * 1000;  //<- change to block users for shorter time (5 min for real; 1 min for testing)
    }
    unlockTimestamp = Date.now() + lockDurration;
    localStorage.setItem(UNLOCK_KEY, unlockTimestamp);
    const timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeLeft = unlockTimestamp - currentTime;

        if(timeLeft <= 0){
            clearInterval(timerInterval);
            blockTimer.classList.add('hidden');
            unlockUI();
        } else {
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            blockTimer.textContent = `0${minutes}:${seconds}`;
        }
    }, 1000);
}

//called functions - if buttons are clicked
loveButton.addEventListener("click", () => {
    loveClicked();
    blockUI();
    updateTimer();
    updateGraph();
});

hungerButton.addEventListener("click", () => {
    hungerClicked();
    blockUI();
    updateTimer();
    updateGraph();
});

hygieneButton.addEventListener("click", () => {
    hygieneClicked();
    blockUI();
    updateTimer();
    updateGraph();
});
