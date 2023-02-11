//import axios from "axios";

let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
let apiKeySheCodes = "5718f012tea70a83o9aff430b33e548d";

function formatDate(currentDate) {
  let year = currentDate.getFullYear();
  let date = currentDate.getDate();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[currentDate.getMonth()];

  let hours = currentDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${month} ${date}, ${year}, ${day}, ${hours}:${minutes}`;
}

function showYourCurrentDate() {
  let currentDate = new Date();
  let dateNow = document.querySelector("#current-date");
  dateNow.innerHTML = formatDate(currentDate);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function showTemperatureAndData(response) {
  showYourCurrentDate();
  celciusTemperature = response.data.temperature.current;
  document.querySelector("#currentTemperature").innerHTML =
    Math.round(celciusTemperature);
  document.querySelector("#currentCondition").innerHTML = capitalizeFirstLetter(
    response.data.condition.description
  );
  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#pressure").innerHTML =
    response.data.temperature.pressure;
  document
    .querySelector("#currentWeather-icon")
    .setAttribute("src", response.data.condition.icon_url);
  document
    .querySelector("#currentWeather-icon")
    .setAttribute("alt", response.data.condition.icon);
}

function showCityImage(city) {
  let imageUrl = `https://pixabay.com/api/?key=33273023-e823ab237982e9cd10b9697f2&q=${city}&category=places&image_type=photo&pretty=true&safesearch=true&orientation=horizontal`;
  axios.get(imageUrl).then(displayCityImage);
}

function displayCityImage(response) {
  let imageElement = document.querySelector("#city-image");
  let imgUrl =
    response?.data?.hits[0]?.webformatURL ??
    "https://cdn.pixabay.com/photo/2013/03/02/02/41/alley-89197_1280.jpg";

  imageElement.setAttribute("src", imgUrl);
}

//make city name appear from search bar
function changeCity(event) {
  event.preventDefault();
  searchCityS(document.querySelector("#cityName").value);
}

//window.searchCity =
function searchCityS(city) {
  let url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKeySheCodes}&units=metric`;
  axios.get(url).then(showCityS);
}

function showCityS(response) {
  if (response.data.status !== "not_found") {
    document.querySelector("#currentCity").innerHTML =
      response.data.city + ", " + response.data.country;

    celciusLink.classList.add("active");
    fahrenhaitLink.classList.remove("active");

    showTemperatureAndData(response);
    getForecast(response.data.coordinates);
    showCityImage(response.data.city);
  } else alert("City not found");
}

let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", changeCity);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function showChoosenCityTime(timestamp, city) {
  let date = new Date(timestamp * 1000);
  let dateInCity = document.querySelector("#current-city-date");
  dateInCity.innerHTML =
    `Current time in ${city}: <div>` + formatDate(date) + `</div>`;
}

//weather forecast
function showForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let timezone = response.data.timezone_offset - 3600;
  let timestampCurrent = response.data.current.dt + timezone;
  let city = document.querySelector("#currentCity").innerHTML;
  let cityName = city.substring(0, city.indexOf(","));

  showChoosenCityTime(timestampCurrent, cityName);

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2 card-weather">
                <div class="card weekday">
                  <img
                    src="https://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }.png"
                    class="card-img-top"
                    alt="..."
                  />
                  <h5 class="card-title dayName">${formatDay(
                    forecastDay.dt
                  )}</h5>
                  <div class="card-body">
                    <p class="card-text card-temp weather-forecast-temperatures">
                    <span class="weather-forecast-temperature-max"> ${Math.round(
                      forecastDay.temp.max
                    )}° </span>
                     <span class="weather-forecast-temperature-min"> ${Math.round(
                       forecastDay.temp.min
                     )}° </span>
                     </p>
                  </div>
                </div>
              </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.latitude}&lon=${coordinates.longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

//temperature conversion
function showCelcius(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fahrenhaitLink.classList.remove("active");
  let currentTemperature = document.querySelector("#currentTemperature");
  currentTemperature.innerHTML = Math.round(celciusTemperature);
}

function showFahrenheit(event) {
  event.preventDefault();
  fahrenhaitLink.classList.add("active");
  celciusLink.classList.remove("active");
  let currentTemperature = document.querySelector("#currentTemperature");
  let cityTempFahrenheit = Math.round(celciusTemperature * (9 / 5) + 32);
  currentTemperature.innerHTML = cityTempFahrenheit;
}

let celciusTemperature = null;

let celciusLink = document.querySelector("#celcius");
celciusLink.addEventListener("click", showCelcius);

let fahrenhaitLink = document.querySelector("#fahrenheit");
fahrenhaitLink.addEventListener("click", showFahrenheit);

//currentGeoLocation
function handlePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKeySheCodes}&units=metric`;
  axios.get(url).then(showCityS);
}

function getCurrPosition() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let currentIconLink = document.querySelector("#currentLocIcon");
currentIconLink.addEventListener("click", getCurrPosition);

//Default screen city is Krakow
searchCityS("Krakow");
