import { getDataFromAPI } from '../client/js/getDataFromAPI'

const constructPixabayAPILink = (term) => {
    const key = "?key=" + process.env.PIXABAY_KEY;
    const url = "https://pixabay.com/api/";
    const query = "&image_type=photo&q=" + term;
    return url + key + query;
  }
  
  const fetchPixabayData = async (name, country) => {
    let pixData = await getDataFromAPI(constructPixabayAPILink(name));
    if (pixData.hits[0]) {
      return pixData.hits[0]
    }
    else {
      const countryName = encodeURI(`${country} landscape`);
      pixData = await getDataFromAPI(constructPixabayAPILink())
      return pixData.hits[0]
    }
  }

  export { fetchPixabayData }