import { electivesMap, auMap, wtMap, spMap, fundamentalCourses, capstonesMap, courseInfoMap, main } from './data.js';

let quartermap = new Map();
let mainRun = false;

let interestset = new Set();

const form = document.querySelector("#filterform");
const yearform = document.querySelector("#yearform");

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
    } else if (selectedQuarter === "winter") {
        quartermap = wtMap;
    } else {
        quartermap = spMap;
    }

    // Interest
    const selectedinterest = document.getElementById("interested-courses").value;

    if (selectedinterest === "cs_architecture") {
        interestset = quartermap.get("sys");
    } else if (selectedinterest === "algorithms_theory") {
        interestset = quartermap.get("alg");
    } else if (selectedinterest === "ai_ml") {
        interestset = quartermap.get("ai");
    } else if (selectedinterest === "applications") {
        interestset = quartermap.get("app");
    }

    // Year
    const selectedyear = document.getElementById("sender-year").value;

    if (selectedyear === "1" || selectedyear === "2" || selectedyear === "3") {
        interestset.forEach(course => {
            if (capstonesMap.has(course)) interestset.delete(course);
        });
    } else {
        interestset.forEach(course => {
            if (fundamentalCourses.has(course)) interestset.delete(course);
        });
    }

    console.log("Filtered set:", interestset);
}

// --- CLICK HANDLERS ---

document.getElementById("filterform").addEventListener("click", (e) => {
    e.preventDefault();
    quarter();

    // Populate checkboxes
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

    const remaining = [...interestset].filter(c => !selected.includes(c));

    console.log("Remaining courses:", remaining);
});
