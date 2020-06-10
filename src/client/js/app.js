import { intervalToDuration } from 'date-fns'

// Helper functions
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

async function postDataToAPI(url='', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }) 
}

function constructGeonamesURL(rawSearchTerm) {
    const encodedSearchTerm = encodeURI(rawSearchTerm)
    const fetchURL = `http://api.geonames.org/searchJSON?q=${encodedSearchTerm}&maxRows=10&featureCode=PPL&featureCode=PPLA&featureCode=PPLA2&username=dw_jet`;
    return fetchURL;
}

const getDate = (target) => {
    const currentDate = new Date();
    const targetDate = new Date(target);
    return intervalToDuration({
        start: currentDate,
        end: targetDate
    })
}

// Individual API calls
const getGeonamesData = (location) => {
    if (!location) { return; }
    getDataFromAPI(constructGeonamesURL(location))
    .then(function(data){
        postDataToAPI('http://localhost:3030/geonames', data.geonames[0]);
    })
}

// Main function

function handleSubmit() {
    const locationInput = document.getElementById('location');
    const locationText = locationInput.value;
    const targetDateValue = document.getElementById('targetDate').value;
    const targetDate = new Date(targetDateValue);
    const diff = getDate(targetDate).days;
    locationInput.value = "";
    console.log(diff);
    return getGeonamesData(locationText);
}
export { handleSubmit }