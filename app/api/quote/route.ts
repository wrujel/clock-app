import { NextRequest, NextResponse } from "next/server";
import { quotes } from "./quotes-data";

export async function GET(request: NextRequest) {
  const quote = generateQuote();
  const body = { content: quote.quote, author: quote.author };
  const status = 200;
  const headers = {
    "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
  };
  return NextResponse.json(body, { status, headers });
}

export const generateQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
