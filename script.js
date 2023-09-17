const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const symbol='/[]}=-)(*&^%$#@!+_`~{/';

// by default starting values.....
let password="";
let passwordLength=10;
let checkCount=0;
setIndicator("#ccc");
handleSlider();   //function call
//role of handleslider is to show the length of password on ui 

function handleSlider(){
    inputSlider.value=passwordLength;   //password length =10
    lengthDisplay.innerText=passwordLength;          // to display
}

//indicator light
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

//function to create random numbers
function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)+ min);
    //max-min is multiplied because math.random generate number between 0-1 
}

function generateRndNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123))//97-123 is the ascii value of uppercase
    //string.gromCharCode is use to convert numeric value into ascii value so that is gives character
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbol.length);
    return symbol.charAt(randNum); //charAt function give character at that index
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if
    ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6)
    {
      setIndicator("#ff0");
    }
   else{
    setIndicator("#f00");
   }
}

//function for copy content
async function copyContent(){
try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    //await helps ----until the msg is not copied no further processing occur
}
catch(e){
    copyMsg.innerText="failed";
}

//to make copy span visible
copyMsg.classList.add("active");
setTimeout(  ()=>{
    copyMsg.classList.remove("active");
},2000); //after 2 sec copied msg disappear

}

function shufflePassword(array){
    //method fisher yates method 
    //we can apply on array to shuffle

for(let i= array.length -1 ;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    const temp =array[i];
    array[i]=array[j];
    array[j]=temp;
}
    let str="";
    array.forEach(el=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });

//special condition when we click all checkbox and you set password length 1
//in this case password length became 4 and password generate
if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider();
 }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);

});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;// here input means user slideing  and e.target.value is used to slide 
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
//if passwordDisplay has value then we can copy we can also use is password length is greater than 0
})

generateBtn.addEventListener('click',()=>{
    if(checkCount <= 0)
    return;
if(passwordLength < checkCount){
    passwordLength = checkCount;
    handleSlider();
}

//lets start the journey to find new password
//remove old password

  password="";


  //applying checkbox marked content
//   if(upperCaseCheck.checked){
//     password += generateUpperCase();
//   }

//   if(lowerCaseCheck.checked){
//     password += generateLowerCase();
//   }

//   if(numbersCheck.checked){
//     password += generateRndNumber();
//   }

//   if(symbolsCheck.checked){
//     password += generateSymbol();
//   }

let funcArr=[];

if(upperCaseCheck.checked)
  funcArr.push(generateUpperCase);

if(lowerCaseCheck.checked)
  funcArr.push(generateLowerCase);

if(numbersCheck.checked)
   funcArr.push(generateRndNumber);

if(symbolsCheck.checked)
  funcArr.push(generateSymbol);


  //compulsory addition 
  for(let i=0;i<funcArr.length; i++){
    password += funcArr[i]();
  }

 

  // remaining addition
  for(let i=0;i< passwordLength-funcArr.length;i++){
    let randIndex = getRndInteger(0,funcArr.length);
    password += funcArr[randIndex]();


// while (password.length < passwordLength) {
//     let randIndex = getRndInteger(0, funcArr.length);
//     password += funcArr[randIndex]();
  }


  //shuffle to mix the password otherwise it print in checkbox sequence
  password=shufflePassword(Array.from(password));
 

  //to show in ui
  passwordDisplay.value=password;

  //calculate strength
  calcStrength();
});
