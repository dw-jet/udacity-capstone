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
const getGeonamesData = (location) => {
    if (!location) { return; }
    let ui_data = {};
    getDataFromAPI(constructGeonamesURL(location))
    .then(async function(data){
        postDataToAPI('http://localhost:3030/geonames', data.geonames[0])
    })
    .then(async function(results){
        const ui_data = await getDataFromAPI('http://localhost:3030/all');
        try {
            return ui_data;
        }
        catch (error) {
            console.log('error', error);
        }
    })
}

// Main function

function handleSubmit() {
    const locationInput = document.getElementById('location');
    const locationText = locationInput.value;
    const targetDateValue = document.getElementById('targetDate').value;
    const targetDate = new Date(targetDateValue);
    const diff = getDateDiff(targetDate).days;
    locationInput.value = "";
    console.log(diff);
    const ui_data = getGeonamesData(locationText);
    console.log(ui_data);
}
export { handleSubmit }