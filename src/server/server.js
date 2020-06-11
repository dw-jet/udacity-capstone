import { getDataFromAPI } from '../client/js/getDataFromAPI'

// Setup empty JS object to act as endpoint for all routes
let projectData = {};
const regeneratorRuntime = require('regenerator-runtime')

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


const constructWeatherAPILink = (lat, lng) => {
  const key = '&key=' + process.env.WEATHER_KEY;
  const url = 'http://api.weatherbit.io/v2.0/current?units=I'
  const lat_long = `&lat=${lat}&lon=${lng}`
  return url + lat_long + key;
}

const constructPixabayAPILink = (term) => {
  const key = "?key=" + process.env.PIXABAY_KEY;
  const url = "https://pixabay.com/api/";
  const query = "&image_type=photo&q=" + term;
  return url + key + query;
}

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

app.get('/all', async (req, res) => {
  const lat = projectData.geonames.lat;
  const long = projectData.geonames.lng;
  const name = encodeURI(`${projectData.geonames.name} ${projectData.geonames.state_region} landscape`);
  projectData.weatherData = await getDataFromAPI(constructWeatherAPILink(lat, long));
  projectData.pixabay = await getDataFromAPI(constructPixabayAPILink(name));
  res.send(projectData);
});

app.post('/geonames', (req, res) => {
  const data = req.body;
  projectData.geonames = {
    name: data.toponymName, 
    lat: data.lat, 
    lng: data.lng, 
    state_region: data.adminName1, 
    country: data.countryCode
  };
});

module.exports = app