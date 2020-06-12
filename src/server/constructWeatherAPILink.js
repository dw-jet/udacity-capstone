const constructWeatherAPILink = (lat, lng, type) => {
  const key = '&key=' + process.env.WEATHER_KEY;
  const url = `http://api.weatherbit.io/v2.0/`
  
  const type = {
    current: "current?units=I", 
    forecast: "forecast/daily?units=I"
  }
  
  const lat_long = `&lat=${lat}&lon=${lng}`
  if (type == "current") {
    return url + type.current + lat_long + key
  } 
  else {
    return url + type.forecast + lat_long + key
  }
}

export { constructWeatherAPILink }