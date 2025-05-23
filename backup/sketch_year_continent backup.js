let table;
let continentTotals = {};
let years = [];
let maxTotalScore = 0;


let checkboxes = {};
let selectedContinents = {};


let continentColors = {
    "Africa": [255, 61, 64],
    "America": [255, 229, 0],
    "Asia": [0, 255, 153],
    "Europe": [255, 106, 226],
    "Oceania": [37, 53, 255],
    "Unknown": [204, 204, 204]
};

function preload() {
    table = loadTable('BLIBLA.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont("Arial", 10);
    noStroke();
    colorMode(RGB);

    for (let row of table.rows) {
        let year = int(row.get("Year"));
        let continent = row.get("Continent");
        let score = float(row.get("FreedomScore"));

        if (!continentTotals[year]) {
            continentTotals[year] = {};
        }
        if (!continentTotals[year][continent]) {
            continentTotals[year][continent] = 0;
        }
        continentTotals[year][continent] += score;
    }

    years = Object.keys(continentTotals).map(y => int(y)).sort((a, b) => a - b);
    for (let year of years) {
        for (let continent in continentTotals[year]) {
            maxTotalScore = max(maxTotalScore, continentTotals[year][continent]);
        }
    }

    // button
    // let x = 30;
    // let y = 200;
    // for (let continent in continentColors) {
    //     let checkbox = createCheckbox(continent, true);
    //     checkbox.position(x, y);
    //     checkbox.style('color', 'white'); 
    //     checkbox.style('font-size', '12px'); 
    //     checkbox.style('border', `2px solid rgb(${continentColors[continent].join(",")})`); // 设置边框颜色
    //     checkbox.style('background-color', 'transparent'); // 背景透明
    //     checkbox.changed(() => {
    //         selectedContinents[continent] = checkbox.checked();
    //         redraw();
    //     });
    //     checkboxes[continent] = checkbox;
    //     selectedContinents[continent] = true;
    //     y += 25;
    // }

    noLoop();

}

function draw() {
    background(0);

    let timelineY = height / 2;
    let timelineXStart = 100;
    let timelineXEnd = width - 100;

    stroke(255);
    strokeWeight(0.8);
    line(timelineXStart, timelineY, timelineXEnd, timelineY);

    textSize(4);
    textAlign(CENTER, CENTER);
    noStroke();
    fill(255);
    for (let year of years) {
        if (year % 10 === 0) { 
            let x = map(year, years[0], years[years.length - 1], timelineXStart, timelineXEnd);
            noStroke();
            text(year, x, timelineY + 20);
            stroke(255);
            line(x, timelineY - 5, x, timelineY + 5);
        }
    }

    let continents = Object.keys(continentColors);
    let spacing = 50;

    for (let year of years) {
        let x = map(year, years[0], years[years.length - 1], timelineXStart, timelineXEnd);
        
        // position
        let totalHeight = 0;
        for (let continent of continents) {
            let totalScore = (continentTotals[year] && continentTotals[year][continent]) ? continentTotals[year][continent] : 0;
            totalHeight += map(totalScore, 0, maxTotalScore, 1, 45);
        }
        let currentY = timelineY + totalHeight / 2;

        //start
        // let currentY = timelineY;

        for (let i = 0; i < continents.length; i++) {
            let continent = continents[i];

            let totalScore = (continentTotals[year] && continentTotals[year][continent]) ? continentTotals[year][continent] : 0;
            if (totalScore === 0) continue;

            let radius = map(totalScore, 0, maxTotalScore, 1, 100);
            
            let y = timelineY - spacing * 4.5 + spacing * i * 2.5;

            let col = continentColors[continent];

            stroke(col[0], col[1], col[2]);
            strokeWeight(0.8);
            fill(col[0], col[1], col[2], 100);            
            ellipse(x, y, radius * 2);
            // rect(x, y, 1, radius * 2);
            // rect(x, currentY - radius, 1, radius);
            // currentY -= radius; 

        }
    }
}