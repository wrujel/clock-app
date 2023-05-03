export async function GET(request: Request) {
  const quote = await fetch("https://api.quotable.io/random");
  const data = await quote.json();
  const response = { content: data.content, author: data.author };
  return new Response(JSON.stringify(response), { status: 200 });
}
