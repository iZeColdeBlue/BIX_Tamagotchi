const loveButton = document.getElementById("loveB");
const hungerButton = document.getElementById("hungerB");
const hygieneButton = document.getElementById("hygieneB");

const blockTimer = document.getElementById('timer');
const UNLOCK_KEY = "uiUnlockTime";
const title = document.getElementById('pageTitle');

const socket = new WebSocket("wss://settled-closely-moccasin.ngrok-free.app/test");

let currentLove = 50.00;
let currentHunger = 25.00;
let currentHygiene = 40.00;

let lockDurration;
let unlockTimestamp;

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

//socket connection
socket.onopen = function() {
    console.log('Connected to Processing server');
};


//functions
function loveClicked(){
    if(loveButton.classList.contains('button')){
        if(currentLove < 100){
            console.log("You sent LOVE to the alien!");
            socket.send("LOVE");
            currentLove += 5;
            document.documentElement.style.setProperty('--loveGraphFill', currentLove + '%');
        }
    } 
}

function hungerClicked(){
    if(hungerButton.classList.contains('button')){
        if(currentHunger < 100){
            console.log("You sent FOOD to the alien!");
            socket.send("FOOD");
            currentHunger += 5;
            document.documentElement.style.setProperty('--hungerGraphFill', currentHunger + '%');
        }
    }
}

function hygieneClicked(){
    if(hygieneButton.classList.contains('button')){
        if(currentHygiene < 100){
            console.log("You cleaned the alien!");
            socket.send("SOAP");
            currentHygiene += 5;
            document.documentElement.style.setProperty('--hygieneGraphFill', currentHygiene + '%');
        }
    }
}

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

function unlockUI(){
    hygieneButton.classList.remove('blocked');
    hungerButton.classList.remove('blocked');
    loveButton.classList.remove('blocked');

    hygieneButton.classList.add('button');
    hungerButton.classList.add('button');
    loveButton.classList.add('button');
    title.textContent = "Take care of our friendly alien!";
}

function updateTimer(){
    if(!lockDurration){
        lockDurration = 5 * 60 * 1000; 
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

//called functions
loveButton.addEventListener("click", () => {
    loveClicked();
    blockUI();
    updateTimer();
});
hungerButton.addEventListener("click", () => {
    hungerClicked();
    blockUI();
    updateTimer();
});
hygieneButton.addEventListener("click", () => {
    hygieneClicked();
    blockUI();
    updateTimer();
});
