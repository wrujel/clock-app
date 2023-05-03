export async function POST(request: Request) {
  const body = await request.json();
  const ip = body.ip;

  const time_api = await fetch("http://worldtimeapi.org/api/ip/" + ip);
  const time_data = await time_api.json();

  const geo_api = await fetch("https://freegeoip.app/json/" + ip);
  const geo_data = await geo_api.json();

  const quote_api = await fetch("https://api.quotable.io/random");
  const quote_data = await quote_api.json();

  const bodyResponse = {
    abbreviation: time_data.abbreviation,
    timezone: time_data.timezone,
    day_of_week: time_data.day_of_week,
    day_of_year: time_data.day_of_year,
    week_number: time_data.week_number,
    city_name: geo_data.city,
    country_name: geo_data.country_name,
    content: quote_data.content,
    author: quote_data.author,
  };

  return new Response(JSON.stringify(bodyResponse), { status: 200 });
}
