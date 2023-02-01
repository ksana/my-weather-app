//import axios from "axios";

let apiKey = "445905dadb3d2b0c6f1b916c9d0e3860";
let apiKeySheCodes = "12tea70a83o9aff430b33e548d";

// update current date and time
let currentDate = new Date();

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

let dateNow = document.querySelector("#current-date");
dateNow.innerHTML = formatDate(currentDate);

function showTemperatureAndData(response) {
  celciusTemperature = response.data.main.temp;
  document.querySelector("#currentTemperature").innerHTML =
    Math.round(celciusTemperature);
  document.querySelector("#currentCondition").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
  document
    .querySelector("#currentWeather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#currentWeather-icon")
    .setAttribute("alt", response.data.weather[0].deescription);
}

//make city name appear from search bar
function changeCity(event) {
  event.preventDefault();
  searchCity(document.querySelector("#cityName").value);
}

//window.searchCity =
function searchCity(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showCity);
}

function searchCityS(city) {
  let url = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKeySheCodes}&units=metric`;
  axios.get(url).then(showCity);
}

function showCity(response) {
  document.querySelector("#currentCity").innerHTML =
    response.data.name + ", " + response.data.sys.country;
  celciusLink.classList.add("active");
  fahrenhaitLink.classList.remove("active");
  showTemperatureAndData(response);
}

let searchForm = document.querySelector("#city-search-form");
searchForm.addEventListener("submit", changeCity);

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
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showCity);
}
function getCurrPosition() {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let currentIconLink = document.querySelector("#currentLocIcon");
currentIconLink.addEventListener("click", getCurrPosition);

//Default screen city is Krakow
searchCity("Krakow");
