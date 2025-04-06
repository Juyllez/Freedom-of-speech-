let table;
let countries = [];
let years = [];
let data = [];
let maxScore = 1;
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
    let continent = row.get("Continent");
    if (!countryMap[continent]) {
      countryMap[continent] = new Set();
    }
    countryMap[continent].add(country);
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

  // Datenspeicherung
  for (let row of table.rows) {
    data.push({
      country: row.get("Country"),
      year: int(row.get("Year")),
      score: float(row.get("FreedomScore")),
      continent: row.get("Continent")
    });
  }

  noLoop();
}

function draw() {
  // Hintergrund: Schwarz
  background(0);

  // 👉 Offset für Beschriftungen und Grid
  let offsetX = 100;
  let offsetY = 100;

  let cellWidth = 15;
  let cellHeight = 10;

  // 🧱 GRID zeichnen
  // Farbe: Schwarz
  // Hintergrund: Schwarz
  stroke(0);
  fill(0);
  for (let i = 0; i < countries.length; i++) {
    for (let j = 0; j < years.length; j++) {
      let x = offsetX + i * cellWidth;
      let y = offsetY + j * cellHeight;
      rect(x, y, cellWidth, cellHeight);
    }
  }
  noStroke();

  // 📅 Jahreszahlen links
  // Farbe: Weiß
  fill(255);
  textAlign(RIGHT, CENTER);
  for (let j = 0; j < years.length; j++) {
    let y = offsetY + j * cellHeight;
    text(years[j], offsetX - 10, y);
  }

// 🌍 Ländernamen unten (senkrecht)
// Farbe: Weiß
fill(255);
textAlign(LEFT, CENTER);
for (let i = 0; i < countries.length; i++) {
  let x = offsetX + i * cellWidth + cellWidth / 2;
  let y = offsetY + years.length * cellHeight + 10;

  push();
  translate(x, y);
  rotate(PI / 2);
  text(countries[i], 0, 0);
  pop();
}
  // ⚪ Datenpunkte zeichnen
  for (let d of data) {
    let i = countries.indexOf(d.country);
    let j = years.indexOf(d.year);

    if (i === -1 || j === -1) continue;

    let x = offsetX + i * cellWidth;
    let y = offsetY + j * cellHeight;
    let sz = map(d.score, 0, maxScore, 2, cellWidth * 0.9);

    fill(continentColors[d.country]);
    ellipse(x + cellWidth / 2, y + cellHeight / 2, sz, sz);
  }
}