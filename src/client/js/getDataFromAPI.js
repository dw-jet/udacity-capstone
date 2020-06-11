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

export { getDataFromAPI }