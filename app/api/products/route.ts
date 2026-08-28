import { NextResponse } from "next/server";
import { products } from "../../products";

// GET /api/products
// GET /api/products?q=key
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const results = query
    ? products.filter((product) => product.name.toLowerCase().includes(query))
    : products;

  return NextResponse.json({
    count: results.length,
    products: results,
  });
}
