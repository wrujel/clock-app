import { NextResponse } from "next/server";
import { generateQuote } from "./generate-quote";

export async function GET() {
  const quote = generateQuote();
  const body = { content: quote.quote, author: quote.author };
  const status = 200;
  const headers = {
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
  };
  return NextResponse.json(body, { status, headers });
}
