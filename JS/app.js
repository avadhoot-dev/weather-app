import { getWeatherIcon, debounce } from "./utility.js";

let tempDisplay = document.querySelector(".temp");
let windDisplay = document.querySelector("#wind");
let humidDisplay = document.querySelector("#humid");
let uv_index = document.querySelector("#UV");
let pressure = document.querySelector("#pressure");
let visibility = document.querySelector("#visibility");
let rain_chance = document.querySelector("#rain-chance");
let displayCity = document.querySelector(".cityName");
const input = document.getElementById("inp");
const btn = document.getElementById("search");
const weatherIcon = document.querySelector(".weather-icon");
const sugg = document.querySelector(".suggestion");
const last_update = document.querySelector("#last-update");
const timeStamp = document.querySelector(".timeStamp");
const disTime = document.querySelector(".time");
const conditionDisplay = document.querySelector(".condition");
const highTemp = document.querySelector(".high-temp");
const lowTemp = document.querySelector(".low-temp");
const unitBtn = document.getElementById("unit-btn");
const hourlyContainer = document.querySelector(".hourly-container");
let city = "";
let tempC;
let tempF;
let maxC;
let maxF;
let minC;
let minF;
let weatherData;
let unit = "C";
let marker;
// map sec
const map = L.map("map");

map.setView([19.076, 72.8777], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

map.on("click", function (e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;

  updateMapMarker(lat, lon);
  getWeather(lat, lon);
});
// map function

function updateMapMarker(lat, lon, zoom = 10) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([lat, lon]).addTo(map);
  map.setView([lat, lon], map.getZoom());
}

// err msg ani handle

function showMessage(message) {
  sugg.innerHTML = "";
  let list = document.createElement("li");
  list.textContent = message;
  list.classList.add("sugg-list");
  sugg.style.visibility = "visible";
  sugg.appendChild(list);
}

// date ani time

function getDateTime() {
  const d = new Date();
  const weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = weekDay[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];

  timeStamp.textContent = `${day}, ${date} ${month}`;

  let hrs = d.getHours();
  let min = d.getMinutes();

  if (hrs < 10) {
    hrs = `0${hrs}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  disTime.textContent = `${hrs}:${min}`;
}

getDateTime();

setInterval(getDateTime, 1000);

//hourly forecast function

async function hourlyForecast(tempData) {
  //hourly forecast
  hourlyContainer.innerHTML = "";
  const currentHour = new Date().getHours();
  for (
    let i = currentHour;
    i < tempData.forecast.forecastday[0].hour.length;
    i++
  ) {
    let hour = tempData.forecast.forecastday[0].hour[i];
    let card = document.createElement("div");
    card.classList.add("hr-card");
    let time = document.createElement("p");
    let icon = document.createElement("img");
    let temp = document.createElement("p");
    let rain = document.createElement("p");
    let time24 = hour.time.split(" ")[1];
    let hourOnly = parseInt(time24.split(":")[0]);
    if (i === currentHour) {
      hourOnly = "Now";

      card.classList.add("now-card");
      time.classList.add("now-text");
    } else {
      if (hourOnly == 0) {
        hourOnly = "12 am";
      }
      if (hourOnly >= 1 && hourOnly <= 11) {
        hourOnly = `${hourOnly} am`;
      }
      if (hourOnly == 12) {
        hourOnly = "12 pm";
      }
      if (hourOnly >= 13 && hourOnly <= 23) {
        hourOnly = `${hourOnly - 12} pm`;
      }
    }
    time.textContent = `${hourOnly}`;
    icon.src = `https:${hour.condition.icon}`;
    icon.classList.add("hourly-icon");
    time.classList.add("hourly-time-text");
    temp.classList.add("hourly-temp");
    rain.classList.add("hourly-rain");
    if (i === currentHour) {
    if (unit === "C") {
        temp.textContent = `${parseInt(tempData.current.temp_c)}°`;
      } else {
        temp.textContent = `${parseInt(tempData.current.temp_f)}°`;
      }
    } else {
      if (unit === "C") {
        temp.textContent = `${parseInt(hour.temp_c)}°`;
    } else {
      temp.textContent = `${parseInt(hour.temp_f)}°`;
    }
  }
    rain.textContent = `${hour.chance_of_rain}%`;
    card.appendChild(time);
    card.appendChild(icon);
    card.appendChild(temp);
    card.appendChild(rain);
    hourlyContainer.appendChild(card);
  }
}

// get weather func

async function getWeather(lat, lon) {
  const weaURL = `/api/weather?lat=${lat}&lon=${lon}`;
  try {
    let response = await fetch(weaURL);
    if (!response.ok) {
      throw new Error(`WeatherAPI HTTP ${response.status}`);
    }
    let tempData = await response.json();
    weatherData = tempData;
    console.log(tempData);
    console.log(tempData.forecast.forecastday[0].hour);
    if (tempData.error) {
      showMessage(`⚠️ ${tempData.error.message}`);
      return;
    }
    let conditionCode = tempData.current.condition.code;
    let iconFile = getWeatherIcon(conditionCode);
    tempC = tempData.current.temp_c;
    tempF = tempData.current.temp_f;
    maxC = tempData.forecast.forecastday[0].day.maxtemp_c;
    maxF = tempData.forecast.forecastday[0].day.maxtemp_f;

    minC = tempData.forecast.forecastday[0].day.mintemp_c;
    minF = tempData.forecast.forecastday[0].day.mintemp_f;
    tempDisplay.textContent = `${tempData.current.temp_c}°`;
    highTemp.textContent = `H: ${tempData.forecast.forecastday[0].day.maxtemp_c}°`;
    lowTemp.textContent = `L: ${tempData.forecast.forecastday[0].day.mintemp_c}°`;
    windDisplay.value = `${tempData.current.wind_kph}km/h`;
    humidDisplay.value = `${tempData.current.humidity}%`;
    uv_index.value = `${tempData.current.uv}`;
    pressure.value = `${tempData.current.pressure_mb} mb`;
    visibility.value = `${tempData.current.vis_km} km`;
    rain_chance.value = `${tempData.current.chance_of_rain}`;
    last_update.textContent = `Last updated: ${tempData.current.last_updated.split(" ")[1]}`;

    displayCity.textContent = `${tempData.location.name}, ${tempData.location.region}`;

    conditionDisplay.textContent = tempData.current.condition.text;
    hourlyForecast(tempData);
    weatherIcon.src = `images/${iconFile}`;
    sugg.innerHTML = "";
    sugg.style.visibility = "hidden";
  } catch (error) {
    showMessage(`⚠️ Error: ${error.message}`);
  }
}

// get curr loc data

async function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      updateMapMarker(lat, lon);
      getWeather(lat, lon);
    },
    function () {
      showMessage("⚠️ Unable to get location");
    },
  );
}

// search weather func

async function searchWeather() {
  city = input.value.trim();
  const geoCoding = `/api/geo?text=${encodeURIComponent(city)}`;
  // const isPincode = /^\d{6}$/.test(city);
  try {
    let res = await fetch(geoCoding);
    if (!res.ok) {
      const errorText = await res.text();

      throw new Error(`Geoapify HTTP ${res.status}`);
    }
    let geoData = await res.json();

    if (!geoData.features || geoData.features.length === 0) {
      showMessage("⚠️ Location not Found");
      return;
    }

    let feature = geoData.features[0];
    let lat = feature.geometry.coordinates[1];
    let lon = feature.geometry.coordinates[0];
    displayCity.textContent = feature.properties.formatted;
    updateMapMarker(lat, lon);
    await getWeather(lat, lon);
  } catch (error) {
    showMessage(`⚠️ ${error.message}`);
  }
}

// get loc func

const getloc = async () => {
  city = input.value.trim();
  if (city === "") {
    return;
  }
  const geoCoding = `/api/autocomplete?text=${encodeURIComponent(city)}`;
  let geoData;

  try {
    let res = await fetch(geoCoding);
    if (!res.ok) {
      const errorText = await res.text();

      throw new Error(`Geoapify HTTP ${res.status}`);
    }
    geoData = await res.json();
  } catch {
    showMessage("⚠️ Network Error");
    return;
  }

  if (!geoData.features) {
    showMessage("⚠️ Geoapify Error");
    return;
  }
  if (geoData.features.length > 0) {
    sugg.innerHTML = "";

    // sorting code :-
    geoData.features.sort((a, b) => {
      const searchTerm = city.toLowerCase();
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      if (nameA === searchTerm && nameB !== searchTerm) {
        return -1;
      }
      if (nameB === searchTerm && nameA !== searchTerm) {
        return 1;
      }
      if (nameA.startsWith(searchTerm) && !nameB.startsWith(searchTerm)) {
        return -1;
      }
      if (nameB.startsWith(searchTerm) && !nameA.startsWith(searchTerm)) {
        return 1;
      }
      return 0;
    });

    let suggestion = geoData.features.slice(0, 15);
    suggestion.forEach((feature, index) => {
      let list = document.createElement("li");
      let fullCityName =
        feature.properties.suburb ||
        feature.properties.city ||
        feature.properties.name ||
        "Unknown";
      let parts = fullCityName.split("-");
      let mainName = parts[0];
      let state = feature.properties.state || "";
      let district = feature.properties.state_district || "";
      let subText = fullCityName;
      if (district) {
        subText = subText + `, ${district}`;
      }
      if (state) {
        subText = subText + `, ${state}`;
      }
      list.innerHTML = `<strong>${mainName}</strong><br><small>${subText}</small>`;
      list.classList.add("sugg-list");
      sugg.style.visibility = "visible";
      sugg.appendChild(list);
      list.addEventListener("click", function () {
        sugg.innerHTML = "";
        sugg.style.visibility = "hidden";
        input.value = mainName;
        displayCity.textContent =
          feature.properties.suburb || feature.properties.formatted;
        let lat = feature.geometry.coordinates[1];
        let lon = feature.geometry.coordinates[0];
        updateMapMarker(lat, lon);
        getWeather(lat, lon);
      });
    });
  } else {
    showMessage("⚠️ Location not Found");
    return;
  }
};

// search button click

btn.addEventListener("click", function () {
  city = input.value.trim();
  if (city === "") {
    showMessage("⚠️ Empty Field");
    tempDisplay.value = "";
    windDisplay.value = "";
    humidDisplay.value = "";
    displayCity.textContent = "";
    return;
  } else {
    searchWeather();
    sugg.style.visibility = "hidden";
    sugg.innerHTML = "";
  }
});
unitBtn.addEventListener("click", function () {
  if (unit === "C") {
    tempDisplay.textContent = `${tempF}°`;

    highTemp.textContent = `H: ${maxF}°`;

    lowTemp.textContent = `L: ${minF}°`;

    unit = "F";
    hourlyForecast(weatherData)

    unitBtn.textContent = "°F";
  } else {
    tempDisplay.textContent = `${tempC}°`;

    highTemp.textContent = `H: ${maxC}°`;

    lowTemp.textContent = `L: ${minC}°`;

    unit = "C";
hourlyForecast(weatherData)
    unitBtn.textContent = "°C";
  }
});
const betterfunc = debounce(getloc, 300);
window.betterfunc = betterfunc;

// calling getcurrloc function for allowing access of curr position
getCurrentLocation();
