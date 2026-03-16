

// date function
function today(){

let d = new Date();

return d.toLocaleDateString("en-GB", {
day: "numeric",
month: "short",
year: "numeric"
});

}



let targetReached = false

let data = JSON.parse(localStorage.getItem("trackerData")) || {};
let target = localStorage.getItem("dailyTarget") || 0;
let targetBase = parseInt(localStorage.getItem("targetBase")) || 0;

if(!data[today()]) data[today()] = 0;

let lastTotal = data[today()];



updateDisplay();
updateTotal();


document.getElementById("count").onclick = function(){

document.dispatchEvent(new KeyboardEvent("keydown", {code:"Space"}));

};

function updateTotal(){

let total = 0;
let days = 0;

for(let day in data){

total += data[day];
days++;

}

document.getElementById("totalCount").innerText = total;

/* calculate average */
let avg = 0;

if(days > 0){
avg = Math.round(total / days);
(total / days).toFixed(0);
}

document.getElementById("avgCount").innerText = avg;

}

function updateDisplay(){

let total = data[today()];

document.getElementById("count").innerText = total;

document.getElementById("targetDisplay").innerText =
"Target: " + target;

updateProgress();
updateTotal();

localStorage.setItem("trackerData",JSON.stringify(data));

}

function updateProgress(){

let solved = data[today()] - targetBase;

if(solved < 0) solved = 0;

let percent = 0;

if(target > 0){
percent = (solved / target) * 100;
if(percent > 100) percent = 100;
}

let bar = document.getElementById("progressBar");

bar.style.width = percent + "%";

/* progress numbers */

let text = document.getElementById("progressText");

if(target > 0 && percent > 0){
text.innerText = solved + " / " + target;
text.style.display = "block";
}else{
text.style.display = "none";
}


/* GOLD FLASH ONLY ONCE */

if(percent === 100 && !targetReached){

targetReached = true;

bar.style.background = "#d4af37";

setTimeout(function(){
bar.style.background = "#28a745";
},1000);

}


/* reset flash if progress goes below target */

if(percent < 100){
targetReached = false;
}

}

function setTarget(){

let val = parseInt(document.getElementById("targetInput").value);

if(isNaN(val)){
return;
}

if(val === 0){
alert("0 qs is not a target bro");
return;
}

if(val > 0){

target = val;

/* store baseline */
targetBase = data[today()];

localStorage.setItem("dailyTarget", target);
localStorage.setItem("targetBase", targetBase);

updateDisplay();

}

document.getElementById("targetInput").value = "";

}

function addOne(){

lastTotal = data[today()];

data[today()]++;

updateDisplay();
popCounter();

}

function undo(){

data[today()] = lastTotal;

updateDisplay();

}

function addBulk(){

let val = parseInt(document.getElementById("bulkInput").value);

if(!isNaN(val)){

lastTotal = data[today()];

data[today()] += val;

updateDisplay();

}

document.getElementById("bulkInput").value="";

}

function showCounter(){

hideAll();

document.getElementById("counterPage").style.display="block";

updateDisplay();

}

function showBulk(){

hideAll();

document.getElementById("bulkPage").style.display="block";

}


function showHistory(){

hideAll();

document.getElementById("historyPage").style.display="block";

let list = document.getElementById("historyList");

list.innerHTML="";

let days = Object.keys(data);

days.sort((a,b)=> new Date(b) - new Date(a));

for(let day of days){

let div = document.createElement("div");
div.className="history-entry";

let text = document.createElement("span");
text.innerHTML = day + " : <span class='historyNumber'>" + data[day] + "</span> questions";

div.appendChild(text);

/* only allow delete for TODAY */
if(day === today()){

let input = document.createElement("input");
input.type = "number";
input.placeholder = "delete";
input.style.width = "70px";

let btn = document.createElement("button");
btn.innerText = "Delete";

btn.onclick = function(){

let val = parseInt(input.value);

if(!isNaN(val)){

data[day] -= val;

if(data[day] < 0) data[day] = 0;

localStorage.setItem("trackerData", JSON.stringify(data));

updateTotal();
showHistory();

}

};

div.appendChild(input);
div.appendChild(btn);

}

list.appendChild(div);

}

}


function goHome(){

hideAll();

document.getElementById("home").style.display="block";

}

function hideAll(){

document.getElementById("home").style.display="none";
document.getElementById("counterPage").style.display="none";
document.getElementById("bulkPage").style.display="none";
document.getElementById("historyPage").style.display="none";

}

document.addEventListener("keydown",function(e){

if(e.code==="Space" && document.getElementById("counterPage").style.display==="block"){

e.preventDefault();

addOne();

}

});


function resetTarget(){

target = "";
targetBase = 0;

localStorage.removeItem("dailyTarget");
localStorage.removeItem("targetBase");

document.getElementById("targetDisplay").innerText = "";

document.getElementById("progressBar").style.width = "0%";

updateDisplay();

}

