export default async function handler(req, res) {
  const lat = req.query.lat;
  const lon = req.query.lon;

  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=${lat},${lon}&days=11`,
  );

  const data = await response.json();

  res.status(200).json(data);
}
