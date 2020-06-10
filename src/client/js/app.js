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

// Individual API calls
const getGeonamesData = () => {
    const location = document.getElementById('location').value
    if (!location) { return; }
    getDataFromAPI(constructGeonamesURL(location))
    .then(function(data){
        postDataToAPI('http://localhost:3030/geonames', data.geonames[0]);
    })
}

export { getGeonamesData }