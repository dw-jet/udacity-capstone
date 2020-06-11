import { intervalToDuration } from 'date-fns'
import { getDataFromAPI } from './getDataFromAPI'
import { postDataToAPI } from './postDataToAPI'

// Helper functions
function constructGeonamesURL(rawSearchTerm) {
    const encodedSearchTerm = encodeURI(rawSearchTerm)
    const fetchURL = `http://api.geonames.org/searchJSON?q=${encodedSearchTerm}&maxRows=10&featureCode=PPL&featureCode=PPLA&featureCode=PPLA2&username=dw_jet`;
    return fetchURL;
}

const getDateDiff = (target) => {
    const currentDate = new Date();
    const targetDate = new Date(target);
    return intervalToDuration({
        start: currentDate,
        end: targetDate
    })
}

// Individual API calls
const getGeonamesData = async (location) => {
    if (!location) { return; }
    let ui_data = {};
    const gnData = await getDataFromAPI(constructGeonamesURL(location));
    postDataToAPI('http://localhost:3030/geonames', gnData.geonames[0]);
    const allData = await getDataFromAPI('http://localhost:3030/all');
    return allData;
}

const buildResults = (data) => {
    const pixabayData = data.pixabay.hits[0];
    const geonamesData = data.geonames;
    const weatherData = data.weatherData.data[0];
    console.log(weatherData);
    const rootNode = document.getElementById('results');
    const imgTag = document.createElement("img");
    const status = document.createElement("p");
    const contain = document.createElement("div");
    contain.classList.add("result-container");
    contain.appendChild(imgTag);
    contain.appendChild(status);
    imgTag.src = pixabayData.previewURL;
    status.innerHTML = `<span class="head">${geonamesData.name}, ${geonamesData.state_region}</span><br>${weatherData.app_temp} - ${weatherData.weather.description}`
    rootNode.appendChild(contain);
}

// Main function

async function handleSubmit() {
    const locationInput = document.getElementById('location');
    const locationText = locationInput.value;
    const dateNode = document.getElementById('targetDate');
    const targetDateValue = dateNode.value;
    const targetDate = new Date(targetDateValue);
    const diff = getDateDiff(targetDate).days;
    locationInput.value = "";
    dateNode.value = "";
    
    const ui_data = await getGeonamesData(locationText);
    buildResults(ui_data);
}
export { handleSubmit }