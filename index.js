//storing all the elements
const passwordDisplay = document.querySelector('#generated-password');
const copyBtn = document.querySelector('.copy-button');
const copyMsg = document.querySelector('[copied]');
const passwordLen = document.querySelector('[lengthVal]');
const slider = document.querySelector('#length-slider');
const allCheckbox = document.querySelectorAll('input[type="checkbox"]');
const upperCaseCheck = document.querySelector('#uppercase');
const lowerCaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[indicator]');
const generateBtn = document.querySelector('.generate-button');

//Storing initial Values
let password = "";
let passwordLength = 10;
let checkCount = 1;
const symbols = "!@#$%^&*-_+=";

//Setting initial values
function initSlider(){
    slider.value = passwordLength;
    passwordLen.textContent = passwordLength;
    //setting the color fill
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ((passwordLength - min) / (max - min))*100 + "% 100%";
}
initSlider(); //Setting Slider to initial values
setIndicator("whitesmoke"); //Setting initial color of the indicator

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0px 0px 5px 3px " + color;
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInt(0,9);
}

function generateRandomUpperCase(){
    return String.fromCharCode(getRandomInt(65,91));
}

function generateRandomLowerCase(){
    return String.fromCharCode(getRandomInt(97,123));
}

function generateRandomSymbol(){
    let ind = getRandomInt(0, symbols.length);
    return symbols.charAt(ind);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyPass(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    }, 1500);
}

slider.addEventListener('input', (e)=>{
    passwordLength = slider.value;
    initSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyPass();
    }
});

//adding eventListener to the checkboxes
allCheckbox.forEach(element => {
    element.addEventListener('change', countChecked);
});

function countChecked(){
    let count = 0;
    allCheckbox.forEach(element => {
        if(element.checked){
            count = count + 1;
        }
    });
    checkCount = count;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        initSlider();
    }
}

generateBtn.addEventListener('click', ()=>{
    if(checkCount==0){
        return ;
    }
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        initSlider();
    }

    //remove old password
    password = "";
    let list = [];

    if(upperCaseCheck.checked){
        password += generateRandomUpperCase();
        list.push(generateRandomUpperCase);
    }
    
    if(lowerCaseCheck.checked){
        password += generateRandomLowerCase();
        list.push(generateRandomLowerCase);
    }
    
    if(numbersCheck.checked){
        password += generateRandomNumber();
        list.push(generateRandomNumber);
    }
    
    if(symbolsCheck.checked){
        password += generateRandomSymbol();
        list.push(generateRandomSymbol);
    }
    
    let passLenRem = passwordLength - password.length;
    for(let i=0;i<passLenRem;i++){
        let ind = getRandomInt(0, list.length);
        password += list[ind]();
    }
    //Now shuffle the password
    console.log(password);
    password = shufflePassword(Array.from(password));
    calcStrength();
    passwordDisplay.value = password;
});

//Fisher Yates Method to Shuffle the password
function shufflePassword(arr){
    let len = arr.length;
    for(let i=len-1;i>0;i--){
        let rand = getRandomInt(0, i+1);
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr.join("");
}