let electivesMap = new Map(); // map of all CSE electives
let auMap = new Map(); // map of available electives autumn qt
let wtMap = new Map(); // map of available electives winter qt
let spMap = new Map(); // map of available electives spring qt

let fundamentalCourses = new Set();

/*
* Behavior: scanFile scans a file for course information and subcategorizes them into interest-based
            subcategories.
* Returns: returns an array of sets; each set is a subcategory.
* Parameters: a file "file" to be scanned for information.
*/
async function scanFile(file) {
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
            const line = lines[i];
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
    const auSets = await scanFile("courses/aucourses.txt");
    const wtSets = await scanFile("courses/wtcourses.txt");
    const spSets = await scanFile("courses/spcourses.txt");

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

    console.log(electivesMap);

    // populate fundamental courses set
    scanFundFile("courses/fundamental-courses.txt");

}

main();