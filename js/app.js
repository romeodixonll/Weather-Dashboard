const apiKey = '17dd29823de90b01d8b6eac65fa8ed11'
const pkToken ='pk.eyJ1Ijoicm9tZW9kaXhvbmxsIiwiYSI6ImNreHcycmVzYTEwdDUyd3FmbmdpNHg0b3EifQ.6FFcd2PvR0BS_K_KeBe0AQ'
let city = 'austin'
let address 
let latitude
let longitude
let locationSaved = []
let span = document.querySelector('#heading')
let temp = document.querySelector('#temperature')
let hum = document.querySelector('#humidity')
let wind = document.querySelector('#wind-speed')
let UV = document.querySelector('#UV-index')
let dailyForcast = document.querySelectorAll('.forecast')
let currentInfo = document.querySelector('#currentInfo')
let fivedayHeader = document.querySelector('#fiveday-header')
let divCurrentInfo = document.querySelector('#divCurrentInfo')


let inputAddress = document.querySelector('#location-input')
inputAddress.addEventListener('submit', (e)=>{
   e.preventDefault()
   if(e.target.elements[0].value !==''){
   address = e.target.elements[0].value
   e.target.elements[0].value = ''
   geocode(address)
   createdLocation(address)
   renderLocations()
   
   }

 })


const geocode = async(address)=>{
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${pkToken}`)
    if(response.status === 200){
      const data = await response.json()
      longitude = data.features[0].center[0]
      latitude = data.features[0].center[1]
  
      getWeather()
    }
}


const getWeather = async()=>{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)

    if(response.status === 200){
        const data = await response.json()
        
        currentInfo.classList.remove('d-none')
        fivedayHeader.classList.remove('d-none')

        


        span.textContent=`${address.toUpperCase()}(${moment.unix(data.current.dt).format('L')})`

        let img = document.createElement('img')
        img.setAttribute('src', `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`)
        
        let divTemp = document.querySelector('#divTemp')
        let divRow = document.createElement('div')
        let divCol = document.createElement('div')
        let temp = document.createElement('p')
        let hum = document.createElement('p')
        let wind = document.createElement('p')
        let UV = document.createElement('p')
        let UVnums = document.createElement('span')

        span.append(img)

        divRow.setAttribute('class', 'row')
        divCol.setAttribute('class', 'col-12')
       
        divTemp.innerHTML = ''

        divTemp.appendChild(divRow)

        divRow.appendChild(divCol)
        divCol.appendChild(temp)
        temp.textContent = `Temp: ${data.current.temp}`

        divRow.appendChild(divCol)
        divCol.appendChild(hum)
        hum.textContent = `Humidity: ${data.current.wind_speed}`

        divRow.appendChild(divCol)
        divCol.appendChild(wind)
        wind.textContent = `Wind: ${data.current.humidity}`
        
        divRow.appendChild(divCol)
        divCol.appendChild(UV)
        UV.textContent = `UV Index: `

        if(data.current.uvi < 3){
          UVnums.setAttribute("class", "badge badge-success")
        }else if(data.current.uvi >= 3 && data.current.uvi <=5){
          UVnums.setAttribute("class", "badge badge-warning")
        }else if(data.current.uvi >5){
          UVnums.setAttribute("class", "badge badge-danger")
        }
        
        UVnums.textContent = `${data.current.uvi}`
        UV.append(UVnums)
        
        let count = 1

        dailyForcast.forEach((daily)=>{
          daily.innerHTML = ''
         
          let pDate = document.createElement('p')
          let pTemp = document.createElement('p')
          let pWind = document.createElement('p')
          let pHum = document.createElement('p')
          
          let img = document.createElement('img')
          img.setAttribute('src', `http://openweathermap.org/img/wn/${data.daily[count].weather[0].icon}.png`)
          
          pDate.textContent = `${moment.unix(data.daily[count].dt).format('L')}`
          pTemp.textContent = `Temp: ${data.daily[count].temp.max}`
          
          pWind.textContent = `Wind: ${data.daily[count].wind_speed}`
          pHum.textContent = `Humidity: ${data.daily[count].humidity}`

        
          daily.append(pDate, img, pTemp, pWind, pHum)

          count++

        })


    }
}



const createdLocation = (input)=>{
    if(!locationSaved.includes(input)){
      loadLocation()
      if(locationSaved.length === 10){
        locationSaved.shift()
      }
      locationSaved.push(input)
      saveLocation()
    } 
  }

  
  const saveLocation = ()=>{
    localStorage.setItem('locations', JSON.stringify(locationSaved))
  }

  
  const loadLocation = ()=>{
    const locationJSON = localStorage.getItem('locations')
    try{
      locationSaved = locationJSON ? JSON.parse(locationJSON) : []
    }catch (error){
      locationSaved = []
    }
  }

  const buttonLocations = document.querySelector('#saved-locations')

  const renderLocations = ()=>{
    loadLocation()

    buttonLocations.innerHTML = ''
    if(locationSaved.length > 0){
        locationSaved.forEach((location)=>{
        const locationEl = document.createElement('button')
        locationEl.classList.add('btn', 'btn-secondary', 'btn-lg', 'btn-block')
        locationEl.setAttribute('style', 'margin-top: 5px')
            
        locationEl.textContent = location

        locationEl.addEventListener('click',(e)=>{
            e.preventDefault()
            address = e.target.innerText
             e.target.innerText = ''
             geocode(address)
             createdLocation(address)
             renderLocations()

        })
        buttonLocations.appendChild(locationEl  )

        })
    }
  }
  renderLocations()