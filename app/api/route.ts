export async function GET() {
  const response = { name: "Clock App API in nestjs", author: "wrujel" };
  return new Response(JSON.stringify(response), { status: 200 });
}
