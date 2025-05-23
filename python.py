import pandas as pd

# CSV-Datei laden
df = pd.read_csv("freedom.csv")
df.columns = ['Country', 'Code', 'Year', 'FreedomScore']  # Spaltennamen anpassen

# Länder-Kontinent-Zuordnung (vereinfachte Liste)
country_to_continent = {
    "Afghanistan": "Asia", "Albania": "Europe", "Algeria": "Africa", "Andorra": "Europe",
    "Angola": "Africa", "Argentina": "South America", "Armenia": "Asia", "Australia": "Oceania",
    "Austria": "Europe", "Azerbaijan": "Asia", "Bahamas": "North America", "Bahrain": "Asia",
    "Bangladesh": "Asia", "Barbados": "North America", "Belarus": "Europe", "Belgium": "Europe",
    "Belize": "North America", "Benin": "Africa", "Bhutan": "Asia", "Bolivia": "South America",
    "Bosnia and Herzegovina": "Europe", "Botswana": "Africa", "Brazil": "South America",
    "Brunei": "Asia", "Bulgaria": "Europe", "Burkina Faso": "Africa", "Burundi": "Africa",
    "Cambodia": "Asia", "Cameroon": "Africa", "Canada": "North America", "Central African Republic": "Africa",
    "Chad": "Africa", "Chile": "South America", "China": "Asia", "Colombia": "South America",
    "Comoros": "Africa", "Congo (Brazzaville)": "Africa", "Congo (Kinshasa)": "Africa",
    "Costa Rica": "North America", "Croatia": "Europe", "Cuba": "North America", "Cyprus": "Asia",
    "Czechia": "Europe", "Denmark": "Europe", "Djibouti": "Africa", "Dominican Republic": "North America",
    "Ecuador": "South America", "Egypt": "Africa", "El Salvador": "North America", "Equatorial Guinea": "Africa",
    "Eritrea": "Africa", "Estonia": "Europe", "Eswatini": "Africa", "Ethiopia": "Africa",
    "Fiji": "Oceania", "Finland": "Europe", "France": "Europe", "Gabon": "Africa", "Gambia": "Africa",
    "Georgia": "Asia", "Germany": "Europe", "Ghana": "Africa", "Greece": "Europe", "Grenada": "North America",
    "Guatemala": "North America", "Guinea": "Africa", "Guinea-Bissau": "Africa", "Guyana": "South America",
    "Haiti": "North America", "Honduras": "North America", "Hungary": "Europe", "Iceland": "Europe",
    "India": "Asia", "Indonesia": "Asia", "Iran": "Asia", "Iraq": "Asia", "Ireland": "Europe",
    "Israel": "Asia", "Italy": "Europe", "Jamaica": "North America", "Japan": "Asia", "Jordan": "Asia",
    "Kazakhstan": "Asia", "Kenya": "Africa", "Kiribati": "Oceania", "Korea, North": "Asia",
    "Korea, South": "Asia", "Kosovo": "Europe", "Kuwait": "Asia", "Kyrgyzstan": "Asia", "Laos": "Asia",
    "Latvia": "Europe", "Lebanon": "Asia", "Lesotho": "Africa", "Liberia": "Africa", "Libya": "Africa",
    "Liechtenstein": "Europe", "Lithuania": "Europe", "Luxembourg": "Europe", "Madagascar": "Africa",
    "Malawi": "Africa", "Malaysia": "Asia", "Maldives": "Asia", "Mali": "Africa", "Malta": "Europe",
    "Marshall Islands": "Oceania", "Mauritania": "Africa", "Mauritius": "Africa", "Mexico": "North America",
    "Micronesia": "Oceania", "Moldova": "Europe", "Monaco": "Europe", "Mongolia": "Asia", "Montenegro": "Europe",
    "Morocco": "Africa", "Mozambique": "Africa", "Myanmar": "Asia", "Namibia": "Africa", "Nauru": "Oceania",
    "Nepal": "Asia", "Netherlands": "Europe", "New Zealand": "Oceania", "Nicaragua": "North America",
    "Niger": "Africa", "Nigeria": "Africa", "North Macedonia": "Europe", "Norway": "Europe", "Oman": "Asia",
    "Pakistan": "Asia", "Palau": "Oceania", "Panama": "North America", "Papua New Guinea": "Oceania",
    "Paraguay": "South America", "Peru": "South America", "Philippines": "Asia", "Poland": "Europe",
    "Portugal": "Europe", "Qatar": "Asia", "Romania": "Europe", "Russia": "Europe", "Rwanda": "Africa",
    "Saint Kitts and Nevis": "North America", "Saint Lucia": "North America",
    "Saint Vincent and the Grenadines": "North America", "Samoa": "Oceania", "San Marino": "Europe",
    "Sao Tome and Principe": "Africa", "Saudi Arabia": "Asia", "Senegal": "Africa", "Serbia": "Europe",
    "Seychelles": "Africa", "Sierra Leone": "Africa", "Singapore": "Asia", "Slovakia": "Europe",
    "Slovenia": "Europe", "Solomon Islands": "Oceania", "Somalia": "Africa", "South Africa": "Africa",
    "South Sudan": "Africa", "Spain": "Europe", "Sri Lanka": "Asia", "Sudan": "Africa", "Suriname": "South America",
    "Sweden": "Europe", "Switzerland": "Europe", "Syria": "Asia", "Taiwan": "Asia", "Tajikistan": "Asia",
    "Tanzania": "Africa", "Thailand": "Asia", "Timor-Leste": "Asia", "Togo": "Africa", "Tonga": "Oceania",
    "Trinidad and Tobago": "North America", "Tunisia": "Africa", "Turkey": "Asia", "Turkmenistan": "Asia",
    "Tuvalu": "Oceania", "Uganda": "Africa", "Ukraine": "Europe", "United Arab Emirates": "Asia",
    "United Kingdom": "Europe", "United States": "North America", "Uruguay": "South America",
    "Uzbekistan": "Asia", "Vanuatu": "Oceania", "Venezuela": "South America", "Vietnam": "Asia",
    "Yemen": "Asia", "Zambia": "Africa", "Zimbabwe": "Africa"
}

# Kontinente zuweisen
df["Continent"] = df["Country"].map(country_to_continent).fillna("Unknown")
df = df[['Country', 'Year', 'FreedomScore', 'Continent']]
missing = df[df["Continent"] == "Unknown"]
print(missing["Country"].unique())
df.to_csv("freedom_with_continent.csv", index=False)