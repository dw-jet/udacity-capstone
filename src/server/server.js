import { getDataFromAPI } from '../client/js/getDataFromAPI'
import { constructWeatherAPILink } from './constructWeatherAPILink'
import { fetchPixabayData } from './fetchPixabayData'

const regeneratorRuntime = require('regenerator-runtime')

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

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

app.get('/', (req, res) => {
  res.sendFile('dist/index.html');
});

app.get('/all', async (req, res) => {
  const lat = projectData.geonames.lat;
  const long = projectData.geonames.lng;
  const name = encodeURI(`${projectData.geonames.name} ${projectData.geonames.state_region} landscape`);
  const type = projectData.countdown < 8 ? "current" : "forecast";
  wbData = await getDataFromAPI(constructWeatherAPILink(lat, long, type));
  projectData.weather = wbData.data;
  
  projectData.pixabay = await fetchPixabayData(name, projectData.geonames.country);
  res.send(projectData);
});

app.post('/geonames', (req, res) => {
  const data = req.body;
  projectData.countdown = data.countdown;
  projectData.geonames = {
    name: data.toponymName, 
    lat: data.lat, 
    lng: data.lng, 
    state_region: data.adminName1, 
    country: data.countryCode
  };
});

module.exports = app