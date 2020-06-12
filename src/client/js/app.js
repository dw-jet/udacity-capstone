import { getDataFromAPI } from './getDataFromAPI'
import { postDataToAPI } from './postDataToAPI'
import { noInputError } from './noInputError'

// Helper functions
function constructGeonamesURL(rawSearchTerm) {
    const encodedSearchTerm = encodeURI(rawSearchTerm)
    const fetchURL = `http://api.geonames.org/searchJSON?q=${encodedSearchTerm}&maxRows=10&featureCode=PPL&featureCode=PPLA&featureCode=PPLA2&username=dw_jet`;
    return fetchURL;
}

const getDateDiff = (target) => {
    const currentDate = new Date();
    const targetDate = new Date(target);
    const msPerDay = 1000*60*60*24;
    return Math.round((targetDate-currentDate)/msPerDay)
}

// Get a location from geonames
const getGeonamesData = async (location) => {
    if (!location) { return; }
    let ui_data = {};
    const gnData = await getDataFromAPI(constructGeonamesURL(location));
    postDataToAPI('http://localhost:3030/geonames', gnData.geonames[0]);
    const allData = await getDataFromAPI('http://localhost:3030/all');
    return allData;
}

// Build the HTML for the result and attach to the DOM
const buildResults = (data) => {
    const pixabayData = data.pixabay;
    const geonamesData = data.geonames;
    const weatherData = data.weather[0];
    console.log(weatherData);
    const rootNode = document.getElementById('results');
    const imgTag = document.createElement("img");
    const status = document.createElement("p");
    const contain = document.createElement("div");
    contain.classList.add("result-container");
    contain.appendChild(imgTag);
    contain.appendChild(status);
    imgTag.src = pixabayData.previewURL;
    status.innerHTML = `<span class="head">${geonamesData.name}, ${geonamesData.state_region}</span><br>${weatherData.temp} - ${weatherData.weather.description}`
    rootNode.appendChild(contain);
}

// Main function

async function handleSubmit() {
    const errorLast = document.getElementById('errorMessage');
    if (errorLast) { errorLast.remove(); }
    
    const locationInput = document.getElementById('location');
    const dateNode = document.getElementById('targetDate');

    if (locationInput.value == "" || dateNode.value == "") {
        noInputError();
    }

    const locationText = locationInput.value;
    const targetDateValue = dateNode.value;
    
    const targetDate = new Date(targetDateValue);
    const diff = getDateDiff(targetDate);
    locationInput.value = "";
    dateNode.value = "";
    
    let ui_data = await getGeonamesData(locationText);
    ui_data.countdown = diff;
    buildResults(ui_data);
}
export { handleSubmit }