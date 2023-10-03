const API_KEY = "7cd7217b312936869fc6165beaa61117";
const GEOCODING_ZIP_CODE_URL =
  "https://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}";
const GEOCODING_CITY_STATE_URL =
  "https://api.openweathermap.org/geo/1.0/direct?q={city name},{state code}, {country code}&appid={API key}";
const CURRENT_WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=imperial&appid={API key}";

function submitForm(event) {
  event.preventDefault();

  let locationField = document.getElementById("location_field");
  console.log(`The user entered ${locationField.value}`);

  let url;
  let comma = locationField.value.indexOf(",");
  if (comma >= 0) {
    let city = locationField.value.substring(0, comma);
    console.log(`City: ${city}`);

    let state = locationField.value.substring(comma + 1).trim();
    console.log(`State: ${state}`);

    url = GEOCODING_CITY_STATE_URL;
    url = url.replace("{city name}", city);
    url = url.replace("{state code}", state);
  } else {
    url = GEOCODING_ZIP_CODE_URL;
    url = url.replace("{zip code}", locationField.value);
  }
  url = url.replace("{country code}", "US");
  url = url.replace("{API key}", API_KEY);
  console.log(`URL: ${url}`);

  let geoCodeRequest = new XMLHttpRequest();
  geoCodeRequest.open("GET", url);
  geoCodeRequest.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      console.log(this.responseText);
      let data = JSON.parse(this.responseText);
      console.log(data);
      let locationName = `${data.name} (${data.country})`;

      url = CURRENT_WEATHER_URL;
      url = url.replace("{lat}", data.lat);
      url = url.replace("{lon}", data.lon);
      url = url.replace("{API key}", API_KEY);
      console.log(url);

      let currentWeatherRequest = new XMLHttpRequest();
      currentWeatherRequest.open("GET", url);
      currentWeatherRequest.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          console.log(this.responseText);
          data = JSON.parse(this.responseText);
          console.log(data);
          displayWeather(data, locationName);
        } else {
          console.warn(`Failed to process response: status=${this.status}`);
        }
      };
      currentWeatherRequest.send();
    } else {
      console.warn(`Failed to process response: status=${this.status}`);
    }
  };
  geoCodeRequest.send();
}

function setSubmitButtonState() {
  let button = document.getElementById("submit_button");
  let field = document.getElementById("location_field");
  if (field.value != "") {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

function displayWeather(weather, location) {
  document.getElementById("weather_location").textContent = location;
  document.getElementById("weather_description").textContent =
    weather.weather[0].description;
  document.getElementById("weather_temperature").textContent =
    weather.main.temp;
  document.getElementById("weather_feels_like").textContent =
    weather.main.feels_like;
  document.getElementById("weather_barometric_pressure").textContent =
    weather.main.pressure;
  document.getElementById("weather_humidity").textContent =
    weather.main.humidity;
  document.getElementById("weather_wind_speed").textContent =
    weather.wind_speed;
  document.getElementById("weather_wind_direction").textContent =
    weather.wind.deg;
  document.getElementById("weather_wind_gusts").textContent =
    weather.wind.gust || 0;
  document.getElementById("weather_clouds").textContent = weather.clouds.all;
  if (weather.rain) {
    document.getElementById("weather_rain_last_hour").textContent =
      weather.rain["1h"];
    document.getElementById("weather_rain_last_three_hours").textContent =
      weather.rain["3h"] || 0;
  } else {
    document.getElementById("weather_rain_last_hour").textContent = "None";
    document.getElementById("weather_rain_last_three_hours").textContent =
      "None";
  }
}
