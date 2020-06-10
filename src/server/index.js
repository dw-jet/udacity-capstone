// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Use fetch in node
const fetch = require('node-fetch');

if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}
// Setup dotenv
const dotenv = require('dotenv');
dotenv.config();

// Setup express
const express = require('express');
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));


// Setup Server
const port = 3030;
const server = app.listen(port, listening);

function listening() {
  console.log(`Server running on port ${port}`);
}

const constructWeatherAPILink = (lat, lng) => {
  const key = '&key=' + process.env.WEATHER_KEY;
  const url = 'http://api.weatherbit.io/v2.0/current?units=I'
  const lat_long = `&lat=${lat}&lon=${lng}`
  return url + lat_long + key;
}

async function getDataFromAPI(url='') {
  const request = await fetch(url);
  try {
      const data = request.json();
      return data
  }
  catch(error) {
      console.log("error", error);
  }
}

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

app.get('/all', async (req, res) => {
  lat = projectData.geonames.lat;
  long = projectData.geonames.lng;
  const weatherData = await getDataFromAPI(constructWeatherAPILink(lat, long));
  try {
    projectData.weatherData = weatherData;
    res.send(projectData);
  }
  catch (error) {
    console.log(error);
  }
});

app.post('/geonames', (req, res) => {
  const data = req.body;
  const relevantData = {name: data.toponymName, lat: data.lat, lng: data.lng, state_region: data.adminName1, country: data.countryCode};
  projectData.geonames = relevantData;
});