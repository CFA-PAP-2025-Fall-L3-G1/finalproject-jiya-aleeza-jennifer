import { electivesMap, auMap, wtMap, spMap, fundamentalCourses, capstonesMap, courseInfoMap, main } from './data.js';

let quartermap = new Map();
let mainRun = false;

let interestset = new Set();

const form = document.querySelector("#quarterSub");
form.disabled = true;
const interestform = document.querySelector("#interestform");

async function run() {
    await main();         
    mainRun = true;       
    form.disabled = false; 
    console.log("Data loaded!");
}

run();

function quarter() {
    if (!mainRun) {
        console.log("Data not loaded yet!");
        return; 
    }
    const selectedQuarter = document.getElementById("quarter").value;
    if (selectedQuarter === "autumn") {
        quartermap = auMap;
    } else if (selectedQuarter === "winter") {
        quartermap = wtMap;
    } else {
        quartermap = spMap;
    }
    console.log("Selected quarter:", selectedQuarter);
    console.log("Quarter map:", quartermap);
}

form.addEventListener("click", function(e) {
    e.preventDefault(); 
    quarter();
});


function interested() {
    console.log("here");
    if (!mainRun) {
        console.log("Data not loaded yet!");
        return; 
    }
    const selectedinterest = document.getElementById("interest").value;
    if (selectedinterest === "cs_architecture") {
        interestset = quartermap.get("sys");
    } else if (selectedinterest === "algorithms_theory") {
        interestset = quartermap.get("alg");
    } else if (selectedinterest === "ai_ml") {
        interestset = quartermap.get("ai");
    } else if (selectedinterest === "applications") {
        interestset = quartermap.get("app");
    }
    console.log("Selected quarter:", selectedinterest);
    console.log("Quarter map:", interestset);
}

interestform.addEventListener("click", function(e) {
    e.preventDefault(); 
    interested();
});