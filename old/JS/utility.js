export function getWeatherIcon(code) {
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

export const debounce = function (fn, d) {
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
