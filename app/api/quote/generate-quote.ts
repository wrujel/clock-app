import { quotes } from "./quotes-data";

export interface Quote {
  quote: string;
  author: string;
}

/** Pick a random quote from the bundled collection. */
export const generateQuote = (): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};
