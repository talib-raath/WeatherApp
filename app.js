      function WeatherDetails() {
        var city = document.getElementById("search-city").value;
        var apiKey = "69fa95c453084c6862ae54f6a212636c"; // Your actual OpenWeather API key
        var url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
          if (this.readyState === 4 && this.status === 200) {
            var response = JSON.parse(this.responseText);
            displayForecastDetails(response);
          } else if (this.readyState === 4) {
            console.error("Failed to fetch forecast details.");
            document.getElementById("forecast-details").textContent =
              "Failed to fetch forecast details. Please try again.";
          }
        };
        httpRequest.open("GET", url, true);
        httpRequest.send();
      }

      function displayForecastDetails(data) {
        var fiveDayForecastHTML = "<h2>5 Day Forecast</h2>";
        var fiveHourForecastHTML = "<h2>Next 5 Hours Forecast</h2>";

        // Logic to extract the next 5 days and 5 hourly forecasts
        var forecasts = data.list;
        for (var i = 0; i < forecasts.length; i++) {
          if (i < 5) {
            // Next 5 hours forecast
            fiveHourForecastHTML += `
              <div class="forecast-block">
                <strong>${new Date(
                  forecasts[i].dt * 1000
                ).toLocaleTimeString()}</strong>
                <img src="http://openweathermap.org/img/wn/${
                  forecasts[i].weather[0].icon
                }.png" alt="${forecasts[i].weather[0].description}" />
                ${forecasts[i].main.temp}°C
              </div>`;
          }
          if (i % 8 === 0) {
            // 5 day forecast, one per day
            fiveDayForecastHTML += `
              <div class="forecast-block">
                <strong>${new Date(
                  forecasts[i].dt * 1000
                ).toLocaleDateString()}</strong>
                <img src="http://openweathermap.org/img/wn/${
                  forecasts[i].weather[0].icon
                }.png" alt="${forecasts[i].weather[0].description}" />
                ${forecasts[i].main.temp}°C
              </div>`;
          }
        }

        document.getElementById("forecast-details").innerHTML =
          fiveDayForecastHTML + fiveHourForecastHTML;
      }