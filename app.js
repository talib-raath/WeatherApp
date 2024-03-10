function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}



function WeatherDetails() {
    const city = document.getElementById("search-city").value;
    if (city.length > 3) { // To avoid fetching too early
        const apiKey = "69fa95c453084c6862ae54f6a212636c";
        fetchCurrentWeather(city, apiKey);
      fetchForecast(city, apiKey);
      // After fetching and processing data in `fetchCurrentWeather` and `fetchForecast`
document.getElementById("weather-info").classList.add("visible");

    }                
}

const debouncedWeatherDetails = debounce(WeatherDetails, 800);

document.getElementById("search-city").addEventListener("input", debouncedWeatherDetails);


      function fetchCurrentWeather(city, apiKey) {
          const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
          
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.responseText);
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // Constructing the URL for the icon
            document.getElementById("weather-info").innerHTML = `
                <div class="current-weather mb-4 text-center">
                    <h1>${data.name}</h1>
                    <img src="${iconUrl}" alt="Weather icon" title="${data.weather[0].description}"> <!-- Weather icon -->
                    <h2>${data.main.temp}°C</h2>
                    <p>Description: ${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                </div>
            `;
          }
        };
        httpRequest.open("GET", url, true);
        httpRequest.send();
      }

      function fetchForecast(city, apiKey) {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            const data = JSON.parse(this.responseText);
            const hourlyHTML = data.list
              .slice(0, 5)
              .map(
                (forecast) => `
                <div class="forecast-item">
                    <p>${new Date(forecast.dt_txt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}: ${forecast.main.temp}°C, ${
                  forecast.weather[0].description
                }</p>
                </div>
            `
              )
              .join("");

            document.getElementById(
              "hourly-forecast"
            ).innerHTML = `<h4>Next Today</h4>${hourlyHTML}`;

            const dailyHTML = data.list
              .filter((_, index) => index % 8 === 0)
              .slice(0, 5)
              .map(
                (forecast) => `
                <div class="forecast-item">
                    <p>${new Date(forecast.dt_txt).toLocaleDateString()}: ${
                  forecast.main.temp
                }°C, ${forecast.weather[0].description}</p>
                </div>
            `
              )
              .join("");

            document.getElementById(
              "daily-forecast"
            ).innerHTML = `<h4>Next 5 Days</h4>${dailyHTML}`;
          }
        };
        httpRequest.open("GET", url, true);
        httpRequest.send();
      }


//current cooridinates weather
      
async function fetchWeather(lat, lon) {
        const apiKey = "69fa95c453084c6862ae54f6a212636c";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();
        fetchCurrentWeather(data.name, apiKey);
        fetchForecast(data.name, apiKey);
      }

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, null);
        }
      }

      function showPosition(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        fetchWeather(latitude, longitude);
      }