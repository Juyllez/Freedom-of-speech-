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

function preload() {
    table = loadTable("BLIBLA.csv", "csv", "header");
}

function setup() {
    createCanvas(3000, 2500);
    textFont("Arial", 10);
    noStroke();
    colorMode(HSL);

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
        color(359, 100, 62),   // Africa
        color(54, 100, 50),  // America
        color(156, 100, 50),  // Asia
        color(312, 100, 71), // Europe
        color(236, 100, 57), // Oceania
        color(0, 0, 80)     // Unknown
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

    noLoop();
}

function draw() {
    background(0);

    // 👉 Offset für Beschriftungen und Grid
    let offsetX = 100;
    let offsetY = 100;

    let cellWidth = 15;
    let cellHeight = 10;

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
    fill(255);
    textAlign(RIGHT, CENTER);
    for (let j = 0; j < years.length; j++) {
        let y = offsetY + (years.length - 1 - j) * cellHeight;
        text(years[j], offsetX - 10, y);
    }

    // 🌍 Ländernamen oben (senkrecht)
    textAlign(LEFT, CENTER);
    for (let i = 0; i < countries.length; i++) {
        let x = offsetX + i * cellWidth + cellWidth / 2;
        let y = offsetY - 10;

        push();
        translate(x, y);
        rotate(-PI / 2);
        text(countries[i], 0, 0);
        pop();
    }
    // ⚪ Datenpunkte zeichnen
    for (let d of data) {
        let i = countries.indexOf(d.country);
        let j = years.indexOf(d.year);

        if (i === -1 || j === -1) continue;

        let x = offsetX + i * cellWidth;
        let y = offsetY + (years.length - 1 - j) * cellHeight;
        let sz = map(d.score, 0, maxScore, 2, cellWidth * 1.2);

        fill(continentColors[d.country]);
        ellipse(x + cellWidth / 2, y + cellHeight / 2, sz, sz);
    }
}