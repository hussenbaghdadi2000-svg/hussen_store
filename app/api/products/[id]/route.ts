import { NextResponse } from "next/server";
import { products } from "../../../products";

// GET /api/products/3
export async function GET(
  request: Request,
  { params }: RouteContext<"/api/products/[id]">,
) {
  const { id } = await params;

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return NextResponse.json(
      { error: `No product with id ${id}` },
      { status: 404 },
    );
  }

  return NextResponse.json(product);
}
