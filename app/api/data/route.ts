import { generateQuote } from "../quote/route";

export async function POST(request: Request) {
  const body = await request.json();
  const ip = body.ip;

  //const time_api = await fetch("http://worldtimeapi.org/api/ip/" + ip);
  //const time_data = await time_api.json();

  const geo_api = await fetch("https://freegeoip.app/json/" + ip);
  const geo_data = await geo_api.json();

  const quote = generateQuote();

  const bodyResponse = {
    city_name: geo_data.city,
    country_name: geo_data.country_name,
    content: quote.quote,
    author: quote.author,
  };

  return new Response(JSON.stringify(bodyResponse), { status: 200 });
}
