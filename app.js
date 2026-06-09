let city = "";
let tempDisplay = document.querySelector(".temp");
let windDisplay = document.querySelector("#wind");
let humidDisplay = document.querySelector("#humid");
let displayCity = document.querySelector(".cityName");
const input = document.getElementById("inp");
const btn = document.getElementById("search");
const sugg = document.querySelector(".suggestion");
const weatherIcon = document.querySelector(".weather-icon");
function showMessage(message) {
  sugg.innerHTML = "";
  let list = document.createElement("li");
  list.textContent = message;
  list.classList.add("sugg-list");
  sugg.style.visibility = "visible";
  sugg.appendChild(list);
}
function getWeatherIcon(code) {
  if (code === 1000) {
    return "sunny.svg";
  }
  if (code === 1003 || code === 1006 || code === 1009) {
    return "cloudy.svg";
  }
  if (
    code === 1063 ||
    code === 1180 ||
    code === 1183 ||
    code === 1186 ||
    code === 1189 ||
    code === 1192 ||
    code === 1195 ||
    code === 1240 ||
    code === 1243 ||
    code === 1246 ||
    code === 1150 ||
    code === 1153
  ) {
    return "rainy.svg";
  }
  if (
    code === 1087 ||
    code === 1273 ||
    code === 1276 ||
    code === 1279 ||
    code === 1282
  ) {
    return "thunder.svg";
  }
  return "clearr.svg";
}
async function getWeather(lat, lon) {
  const weaURL = `https://api.weatherapi.com/v1/current.json?key=${KEYS.WEATHERAPI}&q=${lat},${lon}`;
  try {
    let response = await fetch(weaURL);
    if (!response.ok) {
      throw new Error(`WeatherAPI HTTP ${response.status}`);
    }
    let tempData = await response.json();
    let conditionCode = tempData.current.condition.code;
    let iconFile = getWeatherIcon(conditionCode);
    if (tempData.error) {
      showMessage(`⚠️ ${tempData.error.message}`);
      return;
    }
    tempDisplay.value = `${tempData.current.temp_c}°`;
    windDisplay.value = `${tempData.current.wind_kph}km/h`;
    humidDisplay.value = `${tempData.current.humidity}%`;
    weatherIcon.src = `images/${iconFile}`;
    sugg.innerHTML = "";
    sugg.style.visibility = "hidden";
  } catch (error) {
    showMessage(`⚠️ Error: ${error.message}`);
  }
}

async function searchWeather() {
  city = input.value.trim();
  const geoCoding = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&filter=countrycode:in&limit=10&apiKey=${KEYS.GEOAPIFY}`;

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
const getloc = async () => {
  city = input.value.trim();
  if (city === "") {
    return;
  }
  const geoCoding = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(city)}&filter=countrycode:in&limit=20&apiKey=${KEYS.GEOAPIFY}`;
  let geoData;

  try {
    let res = await fetch(geoCoding);
    if (!res.ok) {
      const errorText = await res.text();

      throw new Error(`Geoapify HTTP ${res.status}`);
    }
    geoData = await res.json();
    console.log(geoData.features[0].properties);
  } catch {
    //3 network error
    showMessage("⚠️ Network Error");
    return;
  }

  // console.log
  if (!geoData.features) {
    showMessage("⚠️ Geoapify Error");
    return;
  }
  if (geoData.features.length > 0) {
    sugg.innerHTML = "";
    console.log(geoData.features[0].properties);
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
    //for each loop

    let suggestion = geoData.features.slice(0, 15);
    suggestion.forEach((feature, index) => {
      if (
        feature.properties.result_type !== "city" &&
        feature.properties.result_type !== "town" &&
        feature.properties.result_type !== "village" &&
        feature.properties.result_type !== "suburb"
      ) {
        return;
      }
      let list = document.createElement("li");
      let fullCityName =
        feature.properties.city || feature.properties.name || "Unknown";
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
        displayCity.value = feature.properties.formatted;
        let lat = feature.geometry.coordinates[1];
        let lon = feature.geometry.coordinates[0];
        getWeather(lat, lon);
      });
    });
  } else {
    // location not found
    showMessage("⚠️ Location not Found");
    return;
  }
};

const proSearch = function (fn, d) {
  let timer;
  return function () {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, d);
  };
};

const betterfunc = proSearch(getloc, 300);

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

function day_date_month() {
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
  const display = document.querySelector(".timeStamp");
  display.value = `${day}, ${date} ${month}`;
  const bot_day = document.querySelector(".bottom-Day");
  bot_day.value = `${day}`;
}
day_date_month();

function time() {
  const disTime = document.querySelector(".time");
  const d = new Date();
  let hrs = d.getHours();
  let min = d.getMinutes();

  if (hrs < 10) {
    hrs = `0${hrs}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  if (hrs > 12) {
    disTime.value = `${hrs}:${min} pm`;
  }
  if (hrs < 12) {
    disTime.value = `${hrs}:${min} am`;
  }
}
time();
const loopTime = setInterval(time, 1000);
const loopDay = setInterval(day_date_month, 1000);
