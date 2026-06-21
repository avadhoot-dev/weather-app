import { getWeatherIcon, debounce } from "./utility.js";
import { GEO_APIFY, WEATHER_API } from "./keys.js";
let tempDisplay = document.querySelector(".temp");
let windDisplay = document.querySelector("#wind");
let humidDisplay = document.querySelector("#humid");
let displayCity = document.querySelector(".cityName");
const input = document.getElementById("inp");
const btn = document.getElementById("search");
const weatherIcon = document.querySelector(".weather-icon");
const sugg = document.querySelector(".suggestion");
const bottomDay = document.querySelector(".bottom-Day");
const timeStamp = document.querySelector(".timeStamp");
const disTime = document.querySelector(".time");
let city = "";
let marker;
// map sec
const map = L.map("map");

map.setView([19.076, 72.8777], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

map.on("click", function (e) {
  const lat = e.latlng.lat;
  const lon = e.latlng.lng;
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker(e.latlng).addTo(map);
  getWeather(lat, lon);
});
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

  timeStamp.value = `${day}, ${date} ${month}`;
  bottomDay.value = `${day}`;

  let hrs = d.getHours();
  let min = d.getMinutes();

  if (hrs < 10) {
    hrs = `0${hrs}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  disTime.value = `${hrs}:${min}`;
}

getDateTime();

const loopDateTime = setInterval(getDateTime, 1000);

// get weather func

async function getWeather(lat, lon) {
  const weaURL = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API}&q=${lat},${lon}`;
  try {
    let response = await fetch(weaURL);
    if (!response.ok) {
      throw new Error(`WeatherAPI HTTP ${response.status}`);
    }
    let tempData = await response.json();
    // console.log(tempData);
    let conditionCode = tempData.current.condition.code;
    let iconFile = getWeatherIcon(conditionCode);
    if (tempData.error) {
      showMessage(`⚠️ ${tempData.error.message}`);
      return;
    }
    tempDisplay.value = `${tempData.current.temp_c}°`;
    windDisplay.value = `${tempData.current.wind_kph}km/h`;
    humidDisplay.value = `${tempData.current.humidity}%`;
    displayCity.value = tempData.location.name;
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
      map.setView([lat, lon], 10);
      marker = L.marker([lat, lon]).addTo(map);
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
  const geoCoding = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&filter=countrycode:in&limit=10&apiKey=${GEO_APIFY}`;
  const isPincode = /^\d{6}$/.test(city);
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
    displayCity.value = feature.properties.formatted;
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
  const geoCoding = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&filter=countrycode:in&limit=20&apiKey=${GEO_APIFY}`;
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
        displayCity.value =
          feature.properties.suburb || feature.properties.formatted;
        let lat = feature.geometry.coordinates[1];
        let lon = feature.geometry.coordinates[0];
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
    displayCity.value = "";
    return;
  } else {
    searchWeather();
    sugg.style.visibility = "hidden";
    sugg.innerHTML = "";
  }
});

const betterfunc = debounce(getloc, 300);
window.betterfunc = betterfunc;

// calling getcurrloc function for allowing access of curr position
getCurrentLocation();
