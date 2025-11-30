import { electivesMap, auMap, wtMap, spMap, fundamentalCourses, capstonesMap, courseInfoMap, main } from './data.js';

let quartermap = new Map();
let mainRun = false;

let interestSet = new Set();
let capstoneSet = new Set();
let finalSelection = new Set();

const form = document.querySelector("#searchbutton");
const scheduleForm = document.querySelector("#schedule-form");
const results = document.querySelector("#results");

async function run() {
    await main();
    mainRun = true;

    if (form) form.disabled = false;

    console.log("Data loaded!");
}

run();

function quarter() {
    if (!mainRun) return;

    // Quarter
    const selectedQuarter = document.getElementById("sender-quarter").value;

    if (selectedQuarter === "autumn") {
        quartermap = auMap;
        capstoneSet = capstonesMap.get("au");
    } else if (selectedQuarter === "winter") {
        quartermap = wtMap;
        capstoneSet = capstonesMap.get("wt");
    } else {
        quartermap = spMap;
        capstoneSet = capstonesMap.get("sp");
    }

    // Interest
    const selectedInterest = document.getElementById("interested-courses").value;

    if (selectedInterest === "cs_architecture") {
        interestSet = quartermap.get("sys");
    } else if (selectedInterest === "algorithms_theory") {
        interestSet = quartermap.get("alg");
    } else if (selectedInterest === "ai_ml") {
        interestSet = quartermap.get("ai");
    } else if (selectedInterest === "applications") {
        interestSet = quartermap.get("app");
    }

    // Year
    const selectedYear = document.getElementById("sender-year").value;

    if (selectedYear === "1" || selectedYear === "2" || selectedYear === "3") {
        fundamentalCourses.forEach(function(currCourse) {
            finalSelection.add(currCourse);
        });
        interestSet.forEach(function(currCourse) {
            finalSelection.add(currCourse);
        });

    } else {
        interestSet.forEach(function(currCourse) {
            finalSelection.add(currCourse);
        });
        capstoneSet.forEach(function(currCourse) {
            finalSelection.add(currCourse);
        });
    }

    console.log("course info:", courseInfoMap);
    console.log("capstone set:", capstoneSet);
    console.log("fund set:", fundamentalCourses);
    console.log("Filtered set:", finalSelection);
}

// --- CLICK HANDLERS ---

document.getElementById("searchbutton").addEventListener("click", (e) => {
    e.preventDefault();
    quarter();

    // Populate checkboxes
    const div = document.getElementById("completedCourses");
    div.innerHTML = "";

    finalSelection.forEach(course => {
        const label = document.createElement("label");
        label.innerHTML = `
            <input type="checkbox" class="completedCourse" value="${course}">
            ${course}<br>
        `;
        div.appendChild(label);
    });
});

document.getElementById("completedForm").addEventListener("click", (e) => {
    e.preventDefault();

    scheduleForm.style.display = "none";
    results.style.display = "block";


    const selected = [...document.querySelectorAll(".completedCourse:checked")]
        .map(cb => cb.value);

    //gets rid of checked boxes and stores into remaining array
    const remaining = [...finalSelection].filter(c => !selected.includes(c));
    const resultsBox = document.getElementById("results");
    resultsBox.style.display = "block";

    const quarterLabel = document.querySelector("#results span#sender-quarter");
    quarterLabel.textContent = document.getElementById("sender-quarter").value;
    const output = document.getElementById("available-courses");

    // create map with filtered course => course info
    const remainingMap = new Map();
    for (let i = 0; i < remaining.length; i++) {
        let courseName = remaining[i];
        let courseInfo = courseInfoMap.get(courseName);
        remainingMap.set(courseName, courseInfo);
    }

    console.log("remaining map:", remainingMap);

    const keysArray = [...remainingMap.keys()]; // get an array of all the keys

    if (keysArray.length > 0) {
        for (let i = 0; i < keysArray.length; i++) {
            const course = keysArray[i];
            const courseInfoArray = remainingMap.get(course);

            let credits = courseInfoArray[0]; 
            let description = courseInfoArray[1]; 
            let prereqs = courseInfoArray[2];
            
            output.innerHTML += "CSE " +course+ ": " +description + " " + credits;
            output.innerHTML +=
                '<span id="prereq-info">' + "prequisites: " +prereqs+ '</span></br>';
        }

    } else {
        output.innerHTML = "You have already taken all eligible courses!";
    }
});