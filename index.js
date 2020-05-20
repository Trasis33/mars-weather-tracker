
const API_KEY = 'FGydqx1tqutLSKo9P2Uy1b900aD9liDYPhmgkG43'
const API_URL = 'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0'

const previousWeatherToggle = document.querySelector('.show-prev-weather')
const previousWeather = document.querySelector('.previous-weather')

previousWeatherToggle.addEventListener('click', () => {
  previousWeather.classList.toggle('show-weather')
})

const getWeather = async () => {
  const res = await fetch(API_URL)
  const data = await res.json()
  const {
    sol_keys,
    validity_checks,
    ...solData
  } = data
  // console.log(solData)
  const temp = Object.entries(solData).map(([sol, data]) => {
    return {
      sol: sol,
      date: new Date(data.First_UTC),
      maxTemp: data.AT.mx,
      minTemp: data.AT.mn,
      windSpeed: data.HWS.av,
      windDirDegrees: data.WD.most_common.compass_degrees,
      windDir: data.WD.most_common.compass_point
    }
  })
  console.log(temp)
}

getWeather()
