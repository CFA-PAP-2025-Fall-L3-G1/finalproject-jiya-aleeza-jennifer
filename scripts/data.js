const electivesMap = new Map(); // map of all CSE electives
let auMap = new Map(); // map of available electives autumn qt
let wtMap = new Map(); // map of available electives winter qt
let spMap = new Map(); // map of available electives spring qt
const fundamentalCourses = new Set(); // a set of required fundamental courses
const capstonesMap = new Map(); // a map of available capstone courses for each qt

let courseInfoMap = new Map(); // maps all courses to an array of strings

/*
* Behavior: scanElectivesFile scans a file for course information and subcategorizes them into interest-based
            subcategories.
* Returns: returns an array of sets; each set is a subcategory.
* Parameters: a file to be scanned for course electives information.
*/
async function scanElectivesFile(file) {
    let systems = new Set(); // Computer Systems & Architecture subcategory
    let algorithms = new Set(); // Algorithms & Theory subcategory
    let ai = new Set(); // AI/Machine Learning subcategory
    let applications = new Set(); // Computer Applications subcategory

    const response = await fetch(file);
        
    if (response.ok) {
        const currFile = await response.text();
        const lines = currFile.split("\n"); 

        // use hybrid processing to read files 
        populateInterestCategories(lines, systems, algorithms, ai, applications);
        console.log(ai);

    } else {
        console.error(`Error Status: ${response.status}`);
    }

    return [systems, algorithms, ai, applications];
}

/*
* Behavior: scans the fundamental courses and adds them to a set.
* Parameters: file of the fundamental courses;
*/
async function scanFundFile(file) {
    const response = await fetch(file);

    if (response.ok) {
        const currFile = await response.text();
        const lines = currFile.split("\n");

        lines.forEach(function(line) {
            fundamentalCourses.add(line);
        });

    } else {
        console.error(`Error Status: ${response.status}`);
    }
    console.log(fundamentalCourses);
}

/*
* Behavior: scans the course-info file to map every course to an array of critical course info.
* Parameters: file of the course info;
*/
async function scanCourseInfoFile(file) {
    const response = await fetch(file);

    if (response.ok) {
        const currFile = await response.text();
        let lines = currFile.split("\n");

        for (let i = 0; i < lines.length; i++) {
            let courseInfo = [];
            let line = lines[i];

            let idxOfCredits = line.indexOf("(");
            let credits = line.substring(idxOfCredits, idxOfCredits+3);

            let description = line.substring(4, idxOfCredits-1); // -1 to rid of whitespace

            let idxOfcolon = line.indexOf(":");
            let prereqInfo = line.substring(idxOfcolon+2); // +2 to count for : and whitespace

            const tokens = line.split(" ");
            for (j = 0; j < tokens.length; j++) {
                let token = tokens[j];

                if (j == 0) { // only want course number as key
                    // ex array: [credits, course description, course prerequisites]
                    courseInfo.push(credits);
                    courseInfo.push(description);
                    courseInfo.push(prereqInfo);
                    courseInfoMap.set(token, courseInfo);
                }
            }
        }

    } else {
        console.error(`Error Status: ${response.status}`);

    }
}

/*
* Behavior: reads the capstone file and maps each quarter to its courses.
* Returns: array of sets containing the courses.
* Parameters: file of the capstone info;
*/
async function scanCapstoneFile(file) {
    const response = await fetch(file);
    let auCapstones = new Set();
    let wtCapstones = new Set();
    let spCapstones = new Set();

    if (response.ok) {
        const currFile = await response.text();
        let lines = currFile.split("\n");

        populateQtCapstones(lines, auCapstones, wtCapstones, spCapstones);

    } else {
        console.error(`Error Status: ${response.status}`);
    }

    return [auCapstones, wtCapstones, spCapstones];
}

function populateInterestCategories(lines, systems, ai, algorithms, applications) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const tokens = line.split(" ");
    
        for (let j in tokens) {
            if (i === 0 ) { //first line
            systems.add(tokens[j]);
            } else if (i === 1) { //second line
                algorithms.add(tokens[j]);
            } else if (i === 2) { //third line
                ai.add(tokens[j]);
            } else { //fourth line
                applications.add(tokens[j]);
            }
        }
    }
}

/*
* Behavior: populates each existing quarter map with a unique key-value pair.
* Parameters: qtMap is the map to be populated;
              arrayOfSets is each the array of sets of all the subcategories; it is also the
              values to the keys.
*/
function populateQtMaps(qtMap, arrayOfSets) {
    let setCategories = ["sys", "ai", "alg", "app"];

    for (let i = 0; i < setCategories.length; i++) {
        qtMap.set(setCategories[i], arrayOfSets[i]);
    }
}

function populateQtCapstones(lines, auCapstones, wtCapstones, spCapstones) {
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const tokens = line.split(" ");

        for (let j = 0; j < tokens.length; j++) {
            let token = tokens[j];
            
            if (i == 0) {
                auCapstones.add(token);
            } else if (i == 1) {
                wtCapstones.add(token);
            } else {
                spCapstones.add(token);
            }
        }
    }
}

function populateCapstonesMap(qtCapstonesArray) {
    const quarters = ["au", "wt", "sp"];

    for(let i = 0; i < quarters.length; i++) {
        capstonesMap.set(quarters[i], qtCapstonesArray[i]);
    }
}

async function main() {
    const auSets = await scanElectivesFile("courses/au-elective-courses.txt");
    const wtSets = await scanElectivesFile("courses/wt-elective-courses.txt");
    const spSets = await scanElectivesFile("courses/sp-elective-courses.txt");

    // populate the quarter maps
    populateQtMaps(auMap, auSets);
    populateQtMaps(wtMap, wtSets);
    populateQtMaps(spMap, spSets);

    // populate the final electives map
    electivesMap.set("au", auMap);
    electivesMap.set("wt", wtMap);
    electivesMap.set("sp", spMap);

    // populate fundamental courses set
    scanFundFile("courses/fundamental-courses.txt");

    // populate capstone courses map
    let qtCapstonesArray = await scanCapstoneFile("courses/capstone-courses.txt");
    populateCapstonesMap(qtCapstonesArray);

    // populate course info map
    scanCourseInfoFile("courses/course-info.txt");
}

main();