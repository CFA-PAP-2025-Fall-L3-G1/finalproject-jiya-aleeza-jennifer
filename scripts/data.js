let electivesMap = new Map(); // map of all CSE electives
let auMap = new Map(); // map of available electives autumn qt
let wtMap = new Map(); // map of available electives winter qt
let spMap = new Map(); // map of available electives spring qt
let fundamentalCourses = new Set(); // a set of required fundamental courses

let prereqMap = new Map(); // maps all courses to a str of its prereq information

/*
* Behavior: scanElectivesFile scans a file for course information and subcategorizes them into interest-based
            subcategories.
* Returns: returns an array of sets; each set is a subcategory.
* Parameters: a file "file" to be scanned for information.
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

    } else {
        console.error(`Error Status: ${response.status}`);
    }
    // testing
    // colors refers to excel spreadsheet
    console.log(systems); // yellow
    console.log(algorithms); // green
    console.log(ai); // purple
    console.log(applications); // blue

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
        console.error("error");
    }
    console.log(fundamentalCourses);
}

/*
* Behavior: scans the prereq file to map every course to its prereq info.
* Parameters: file of the prereq info;
*/
async function scanPrereqFile(file) {
    const response = await fetch(file);

    if (response.ok) {
        const currFile = await response.text();
        let lines = currFile.split("\n");

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            let idxOfcolon = line.indexOf(":");
            let newLine = line.substring(idxOfcolon+2); // +2 to count for : and whitespace

            const tokens = line.split(" ");
            for (j = 0; j < tokens.length; j++) {
                let token = tokens[j];

                if (j == 0) { // only want course number as key
                    prereqMap.set(token, newLine);
                }
            }
        }

    } else {
        console.error("error");

    }
    // testing
    console.log(prereqMap);
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

async function main() {
    const auSets = await scanElectivesFile("courses/aucourses.txt");
    const wtSets = await scanElectivesFile("courses/wtcourses.txt");
    const spSets = await scanElectivesFile("courses/spcourses.txt");

    // populate the quarter maps
    populateQtMaps(auMap, auSets);
    populateQtMaps(wtMap, wtSets);
    populateQtMaps(spMap, spSets);

    // testing
    console.log(auMap);
    console.log(wtMap);
    console.log(spMap);

    // populate the final Electives map
    electivesMap.set("au", auMap);
    electivesMap.set("wt", wtMap);
    electivesMap.set("sp", spMap);
    // testing
    console.log(electivesMap);

    // populate fundamental courses set
    scanFundFile("courses/fundamental-courses.txt");

    // populate prereq map
    scanPrereqFile("courses/prerequisites.txt");
}

main();