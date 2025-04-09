let table;
let continentColors = {};
let continents = ["Africa", "America", "Asia", "Europe", "Oceania"];
let scoreLevels = ["0-0.25", "0.25-0.5", "0.5-0.75", "0.75-1"];
let data = [];

let countries = [];
let years = [];
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
let groupedByContinent = {};
let groupedByLevel = {};


function preload() {
    table = loadTable("BLIBLA.csv", "csv", "header");
    console.log("Columns: ", table.columns);
    console.log("Rows: ", table.rows.length);
  }


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial", 10);
  noStroke();
  colorMode(RGB);
  data = data.filter(entry => entry.year === 2024);
  // 配置颜色
  let palette = [
    color(255, 61, 64),   // Africa
    color(255, 229, 0),   // America
    color(0, 255, 153),   // Asia
    color(255, 106, 226), // Europe
    color(37, 53, 255)    // Oceania
  ];
  for (let i = 0; i < continents.length; i++) {
    continentColors[continents[i]] = palette[i];
    groupedByContinent[continents[i]] = [];
  }

  for (let level of scoreLevels) {
    groupedByLevel[level] = [];
  }

  // 读取数据并分类
  for (let row of table.rows) {
    let country = row.get("Country");
    let continent = row.get("Continent");
    let score = float(row.get("FreedomScore"));
    let year = int(row.get("Year"));
    if (continents.includes(continent)) {
      let level = getScoreLevel(score);
      let entry = { country, continent, score, level, year };
      data.push(entry);
      groupedByContinent[continent].push(entry);
      groupedByLevel[level].push(entry);
    }
  }

  noLoop();
}

function draw() {
  background(0);

  let xLeft = 120;
  let xRight = width - 120;
  let barWidth = 5;
  let topMargin = 60;
  let continentYMap = {};
  let levelYMap = {};
  let gap = 4;

  // --- 绘制左侧 continent bars ---
  let totalHeight = height - 2 * topMargin;
  let continentBarHeight = totalHeight / continents.length;

  for (let i = 0; i < continents.length; i++) {
    let continent = continents[i];
    let entries = groupedByContinent[continent];
    let yTop = topMargin + i * (continentBarHeight+ gap);

    // 绘制 Bar
    fill(continentColors[continent]);
    rect(xLeft, yTop, barWidth, continentBarHeight);

    // 白色文字标签
    fill(255);
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(continent, xLeft - 10, yTop + continentBarHeight / 2);

    // 生成每条线的 y 坐标
    let spacing = continentBarHeight / (entries.length + 1);
    continentYMap[continent] = entries.map((_, idx) => yTop + (idx + 1) * spacing);
  }

  // --- 绘制右侧 score level bars ---
  let levelBarHeight = totalHeight / scoreLevels.length;

  for (let i = 0; i < scoreLevels.length; i++) {
    let level = scoreLevels[i];
    let entries = groupedByLevel[level];
    let yTop = topMargin + i * (levelBarHeight + gap);

    // 灰色 Bar
    fill(255, 255, 255, 180);
    rect(xRight - barWidth, yTop, barWidth, levelBarHeight);

    // 白色文字标签
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    text(level, xRight + 10, yTop + levelBarHeight / 2);

    // 生成每条线的 y 坐标
    let spacing = levelBarHeight / (entries.length + 1);
    levelYMap[level] = entries.map((_, idx) => yTop + (idx + 1) * spacing);
  }

  // --- 绘制连接线 ---
  let continentIndexMap = {};
  let levelIndexMap = {};

  for (let d of data) {
    let continent = d.continent;
    let level = d.level;

    if (!continentIndexMap[continent]) continentIndexMap[continent] = 0;
    if (!levelIndexMap[level]) levelIndexMap[level] = 0;

    let y1 = continentYMap[continent][continentIndexMap[continent]];
    let y2 = levelYMap[level][levelIndexMap[level]];

    continentIndexMap[continent]++;
    levelIndexMap[level]++;

    let x1 = xLeft + barWidth;
    let x2 = xRight - barWidth;

    let lineColor = continentColors[continent];
    stroke(red(lineColor), green(lineColor), blue(lineColor), 30);
    strokeWeight(0.1);
    noFill();
    bezier(x1, y1, (x1 + x2) / 2, y1, (x1 + x2) / 2, y2, x2, y2);
  }
}

function getScoreLevel(score) {
  if (score <= 0.25) return "0-0.25";
  else if (score <= 0.5) return "0.25-0.5";
  else if (score <= 0.75) return "0.5-0.75";
  else return "0.75-1";
}
