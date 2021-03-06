
const API_KEY = 'FGydqx1tqutLSKo9P2Uy1b900aD9liDYPhmgkG43'
const API_URL = 'https://api.nasa.gov/insight_weather/?api_key=DEMO_KEY&feedtype=json&ver=1.0'

const previousWeatherToggle = document.querySelector('.show-prev-weather')
const previousWeather = document.querySelector('.previous-weather')

const currentSolElement = document.querySelector('[current-sol]')
const currentDateElement = document.querySelector('[current-date]')
const currentTempHighElement = document.querySelector('[current-temp-high]')
const currentTempLowElement = document.querySelector('[current-temp-low]')
const currentWindspeedElement = document.querySelector('[current-windspeed]')
const currentWindDirectionTextElement = document.querySelector('[wind-direction-text]')
const currentWindDirectionArrowElement = document.querySelector('[wind-direction-arrow]')

const previousSolTemplate = document.querySelector('[previous-sol-template]')
const previousSolContainer = document.querySelector('[previous-sols]')

const inputToggle = document.querySelector('[input-toggle]')
const celRadio = document.getElementById('celsius')
const fahRadio = document.getElementById('fahrenheit')

previousWeatherToggle.addEventListener('click', () => {
  previousWeather.classList.toggle('show-weather')
})

let SelectedSolIndex

const getWeather = async () => {
  const res = await fetch(API_URL)
  const data = await res.json()
  const {
    sol_keys,
    validity_checks,
    ...solData
  } = data
  return Object.entries(solData).map(([sol, data]) => {
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
}

const formatDate = (date) => {
  return date.toLocaleDateString(
    undefined, { day: 'numeric', month: 'long' }
  )
}

const formatTemp = (temp) => {
  let temperature = temp

  if (!isMetric()) {
    temperature = temp * (9 / 5) + 32
  }

  return Math.round(temperature)
}

const formatWindspeed = (windspeed) => {
  return Math.round(windspeed)
}

getWeather().then(sols => {
  SelectedSolIndex = sols.length - 1
  displaySelectedSol(sols)
  displayPreviousSols(sols)
  updateUnit()

  inputToggle.addEventListener('click', () => {
    let metric = !isMetric()
    celRadio.checked = metric
    fahRadio.checked = !metric
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnit()
  })

  celRadio.addEventListener('change', () => {
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnit()
  })
  fahRadio.addEventListener('change', () => {
    displaySelectedSol(sols)
    displayPreviousSols(sols)
    updateUnit()
  })
})

const displaySelectedSol = (sols) => {
  const selectedSol = sols[SelectedSolIndex]
  console.log(selectedSol)
  currentSolElement.innerText = selectedSol.sol
  currentDateElement.innerText = formatDate(selectedSol.date)
  currentTempHighElement.innerText = formatTemp(selectedSol.maxTemp)
  currentTempLowElement.innerText = formatTemp(selectedSol.minTemp)
  currentWindspeedElement.innerText = formatWindspeed(selectedSol.windSpeed)
  currentWindDirectionTextElement.innerText = selectedSol.windDir
  currentWindDirectionArrowElement.style.setProperty('--direction', `${selectedSol.windDirDegrees}deg`)
}

const displayPreviousSols = (sols) => {
  previousSolContainer.innerHTML = ''

  sols.forEach((sol, index) => {
    const solContainer = previousSolTemplate.content.cloneNode(true)
    solContainer.querySelector('[prev-sol]').innerText = sol.sol
    solContainer.querySelector('[prev-date]').innerText = formatDate(sol.date)
    solContainer.querySelector('[prev-high-temp]').innerText = formatTemp(sol.maxTemp)
    solContainer.querySelector('[prev-low-temp]').innerText = formatTemp(sol.minTemp)
    solContainer.querySelector('[select-button]').addEventListener('click', () => {
      SelectedSolIndex = index
      displaySelectedSol(sols)
    })
    previousSolContainer.appendChild(solContainer)
  })
}

const isMetric = () => {
  return celRadio.checked
}

const updateUnit = () => {
  const tempUnit = document.querySelectorAll('[temp-unit]')

  tempUnit.forEach(unit => {
    unit.innerText = isMetric() ? 'C' : 'F'
  })
}
