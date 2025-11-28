import { electivesMap, auMap, wtMap, spMap, fundamentalCourses, capstonesMap, courseInfoMap, main } from './data.js';

let quartermap = new Map();
let mainRun = false;

let interestset = new Set();

const form = document.querySelector("#quarterSub");
form.disabled = true;
const interestform = document.querySelector("#interestform");
const yearform = document.querySelector ("#yearform")

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


function year() {
    if (!mainRun) {
        console.log("Data not loaded yet!");
        return; 
    }
    const selectedyear = document.getElementById("year").value;
    if (selectedyear === "1" || selectedyear === "2" || selectedyear === "3") {
        interestset.forEach((course) => {
            if (capstonesMap.has(course)) {
                interestset.delete(course)
            }
        });
    } else {
        interestset.forEach((course) => {
            if (fundamentalCourses.has(course)) {
                interestset.delete(course)
            }
        });
    }
    console.log("Selected year:", selectedyear);
    console.log("Year map:", interestset);
}

yearform.addEventListener("click", function(e) {
    e.preventDefault(); 
    year();
});

document.getElementById("yearform").addEventListener("click", () => {
    const div = document.getElementById("completedCourses");
    div.innerHTML = ""; 
    interestset.forEach(course => {
        const label = document.createElement("label");
        label.innerHTML = `
            <input type="checkbox" class="completedCourse" value="${course}">
            ${course}<br>
        `;
        div.appendChild(label);
    });
});

document.getElementById("completedForm").addEventListener("click", () => {
    const selected = [...document.querySelectorAll(".completedCourse:checked")]
                     .map(cb => cb.value);

    console.log("Courses already taken:", selected);
    const remaining = interestset.filter(c => !selected.includes(c));
    console.log("Remaining courses:", remaining);
});