import { quotes } from "./quotes-data";

export async function GET(request: Request) {
  const quote = generateQuote();
  const response = { content: quote.quote, author: quote.author };
  return new Response(JSON.stringify(response), { status: 200 });
}

export const generateQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
