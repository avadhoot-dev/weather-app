export default async function handler(req, res) {
  const text = req.query.text;

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&filter=countrycode:in&limit=20&apiKey=${process.env.GEO_APIFY}`,
  );

  const data = await response.json();

  res.status(200).json(data);
}
