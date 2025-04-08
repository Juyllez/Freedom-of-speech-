let table;
let countries = [];
let years = [];
let data = [];
let maxScore = 1;
let includedCountries = [
    "Sweden", "Norway", "Finland", "Iceland", "Estonia", "Germany", "France",
  "Netherlands", "Switzerland", "Austria", "Ireland", "Portugal", "Spain", "Poland",
  "Hungary", "Czechia", "Greece", "Italy",

  "South Africa", "Ghana", "Namibia", "Senegal", "Botswana", "Cape Verde", "Tunisia",
  "Liberia", "Kenya", "Malawi", "Nigeria", "Sierra Leone", "Zambia", "Ethiopia",
  "Morocco", "Uganda", "Algeria", "Sudan", "Zimbabwe", "Rwanda",

  "Japan", "South Korea", "Taiwan", "India", "Philippines", "Indonesia", "Malaysia",
  "Mongolia", "Thailand", "Nepal", "Bangladesh", "Sri Lanka", "Kazakhstan", "Uzbekistan",
  "Vietnam", "Myanmar", "Pakistan", "Afghanistan", "Iran", "China",

  "Australia", "New Zealand", "Fiji", "Papua New Guinea", "Solomon Islands",
 "Vanuatu",
  "New Caledonia", "Timor",

  "Canada", "United States", "Mexico", "Cuba", "Haiti", "Dominican Republic", "Jamaica",
  "Colombia", "Venezuela", "Brazil", "Argentina", "Chile", "Peru", "Ecuador",
  "Bolivia", "Paraguay", "Uruguay", "Nicaragua", "El Salvador", "Honduras"
];

let continentColors = {};

let hoveredData = null; // To store the hovered data

let rowSpacing = 6;

function preload() {
    table = loadTable("BLIBLA.csv", "csv", "header");
}

function setup() {
    // createCanvas(3000, 2500);
    createCanvas(windowWidth, windowHeight);

    textFont("Arial", 10);
    noStroke();
    colorMode(RGB);

    // Länder & Jahre sammeln
    let countrySet = new Set();
    let yearSet = new Set();
    
    for (let row of table.rows) {
        countrySet.add(row.get("Country"));
        yearSet.add(int(row.get("Year"))); // sicherstellen, dass Jahr ein int ist
    }

    const continentOrder = ["America", "Europe", "Africa", "Asia", "Oceania"];
    let countryMap = {}; // { continent: Set of countries }

    for (let row of table.rows) {
        let country = row.get("Country");
        if (!includedCountries.includes(country)) continue;

        let continent = row.get("Continent");
        if (!countryMap[continent]) {
            countryMap[continent] = new Set();
        }
        countryMap[continent].add(country);

        data.push({
            country: country,
            year: int(row.get("Year")),
            score: float(row.get("FreedomScore")),
            continent: row.get("Continent")
        });
    }
    countries = [];
    for (let continent of continentOrder) {
        if (countryMap[continent]) {
            let sortedCountries = Array.from(countryMap[continent]).sort();
            countries.push(...sortedCountries);
        }
    }

    years = Array.from(yearSet).sort((a, b) => a - b);

    // Farben pro Kontinent
    let palette = [
        color(255, 61, 64),   // Africa
        color(255, 229, 0),  // America
        color(0, 255, 153),  // Asia
        color(255, 106, 226), // Europe
        color(37, 53, 255), // Oceania
        color(204, 204, 204)     // Unknown
    ];
    let usedContinents = {};
    let index = 0;

    for (let row of table.rows) {
        let continent = row.get("Continent");
        if (!usedContinents[continent]) {
            usedContinents[continent] = palette[index % palette.length];
            index++;
        }
        continentColors[row.get("Country")] = usedContinents[continent];
    }
    
    //summe
    let yearlyTotals = {};

    for (let year of years) {
        yearlyTotals[year] = data
            .filter(d => d.year === year)
            .reduce((sum, d) => sum + d.score, 0); // 计算该年的总和
    }
    window.yearlyTotals = yearlyTotals;

    noLoop();
}

function draw() {
    background(0);
    hoveredData = null;

    // 👉 Offset für Beschriftungen und Grid
    let offsetX = 100;
    let offsetY = 100;

    // let cellWidth = 15;
    // let cellHeight = 10;
    let availableWidth = windowWidth - offsetX - 50;
    let availableHeight = windowHeight - offsetY - 50;

    let cellWidth = availableWidth / countries.length;
    let cellHeight = availableHeight / years.length * 0.8;

    //grid
    stroke(0);
    fill(0);
    for (let i = 0; i < countries.length; i++) {
        for (let j = 0; j < years.length; j++) {
            let y = offsetY + (years.length - 1 - j) * cellHeight;
            let x = offsetX + i * cellWidth;
            rect(x, y, cellWidth, cellHeight);
        }
    }
    noStroke();

    // 📅 Jahreszahlen links
    textSize(cellWidth * 0.2);
    fill(255);
    textAlign(RIGHT, CENTER);
    for (let j = 0; j < years.length; j++) {
        let y = offsetY + (years.length - 1 - j) * (cellHeight + rowSpacing);
        text(years[j], offsetX - 10, y);
    }

    // 🌍 Ländernamen oben (senkrecht)
    // textSize(cellWidth * 0.4);
    // textAlign(LEFT, CENTER);
    // for (let i = 0; i < countries.length; i++) {
    //     let x = offsetX + i * cellWidth + cellWidth / 2;
    //     let y = offsetY - 10;

    //     push();
    //     translate(x, y);
    //     rotate(-PI / 2);
    //     text(countries[i], 0, 0);
    //     pop();
    // }
    //📏
    let maxTotalScore = Math.max(...Object.values(window.yearlyTotals));
    let axisXStart = offsetX;
    let axisXEnd = windowWidth - offsetX; 
    let axisY = offsetY - 20;
    let tickCount = 10;
    stroke(255);
    line(axisXStart, axisY, axisXEnd, axisY);
    textSize(cellWidth * 0.4);
    textAlign(CENTER, CENTER);
    for (let t = 0; t <= tickCount; t++) {
      let tickX = map(t, 0, tickCount, axisXStart, axisXEnd);
      let tickValue = (maxTotalScore * t / tickCount).toFixed(0);
      line(tickX, axisY - 5, tickX, axisY + 5);
      noStroke();
      fill(255);
      text(tickValue, tickX, axisY + 15);
    }

    // ⚪ Datenpunkte zeichnen
    // for (let d of data) {
    //     let i = countries.indexOf(d.country);
    //     let j = years.indexOf(d.year);

    //     if (i === -1 || j === -1) continue;

    //     let x = offsetX + i * cellWidth;
    //     let y = offsetY + (years.length - 1 - j) * cellHeight;
    //     let sz = map(d.score, 0, maxScore, 2, cellWidth * 0.9);

    //     // tranparenz
    //     let alpha = map(d.score, 0, maxScore, 50, 200);
    //     fill(continentColors[d.country]._getRed(), continentColors[d.country]._getGreen(), continentColors[d.country]._getBlue(), alpha); 
    //     // fill(continentColors[d.country], alpha);
        
    //      rect(x + cellWidth / 2, y + cellHeight / 2, sz * 0.5, cellHeight * 0.8);

    //     let dx = mouseX - (x + cellWidth / 2);
    //     let dy = mouseY - (y + cellHeight / 2);
    //     if (sqrt(dx * dx + dy * dy) < sz / 2) {
    //         hoveredData = {
    //             x: x + cellWidth / 2,
    //             y: y + cellHeight / 2,
    //             country: d.country,
    //             year: d.year,
    //             score: d.score
    //         };
    //     }

    //     if (hoveredData) {
    //         let { x, y, country, year, score } = hoveredData;
        
    //         let boxWidth = cellWidth * 10;
    //         let boxHeight = cellHeight * 10;

    //         fill(100, 100, 100, 3);             
    //         noStroke();
    //         rect(mouseX + 10, mouseY + 10, boxWidth, boxHeight);
        
    //         fill(255);
    //         textAlign(LEFT, TOP);
    //         textSize(cellWidth * 0.8);

    //         text(`Country: ${country}`, mouseX + cellWidth, mouseY + cellWidth);
    //         text(`Year: ${year}`, mouseX + cellWidth, mouseY + cellWidth * 2);
    //         text(`Score: ${score.toFixed(2)}`, mouseX + cellWidth, mouseY + cellWidth * 3);
    //     }
    // }
    for (let j = 0; j < years.length; j++) {
      let y = offsetY + (years.length - 1 - j) * (cellHeight + rowSpacing); //10 gap
      let xStart = offsetX; 

      for (let i = 0; i < countries.length; i++) {
          let country = countries[i];
          let dataPoint = data.find(d => d.country === country && d.year === years[j]);

          if (!dataPoint) continue; 

          let rectWidth = map(dataPoint.score, 0, maxScore, 2, cellWidth);
          let rectHeight = cellHeight;

      let alpha = map(dataPoint.score, 0, maxScore, 50, 200);
      fill(
          continentColors[country]._getRed(),
          continentColors[country]._getGreen(),
          continentColors[country]._getBlue(),
          alpha
      );

      rect(xStart, y + (cellHeight - rectHeight) / 2, rectWidth, rectHeight);

      xStart += rectWidth + 0.3; //gap 0.3px
      }
    }
      
    drawLegend(); 
}

//lesen Tipp
function drawLegend() {
    let legendX = width - 230;
    let legendY = 10;
    let barWidth = 30;
    let barHeight = 5;
    let spacing = 0;

    let continentNames = ["Africa", "America", "Asia", "Europe", "Oceania", "Unknown"];
    let continentColorPalette = [
        color(255, 61, 64),   // Africa
        color(255, 229, 0),  // America
        color(0, 255, 153),  // Asia
        color(255, 106, 226), // Europe
        color(37, 53, 255), // Oceania
        color(204, 204, 204)     // Unknown
    ];

    for (let i = 0; i < continentNames.length; i++) {
        fill(continentColorPalette[i]);
        rect(legendX  + i * (barWidth + spacing), legendY, barWidth, barHeight);

        fill(255);
        textSize(6);
        textAlign(LEFT, CENTER);
        text(continentNames[i], legendX + i * (barWidth + spacing), legendY + 10);
    }
}

function mouseMoved() {
    redraw();
}

