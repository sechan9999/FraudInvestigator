import { NextRequest, NextResponse } from "next/server";
import { computeStats } from "@/lib/csvParser";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const riskFilter = searchParams.get("risk") || "all";
  const search = searchParams.get("search") || "";

  const data = computeStats(page, limit, riskFilter, search);
  return NextResponse.json(data);
}
