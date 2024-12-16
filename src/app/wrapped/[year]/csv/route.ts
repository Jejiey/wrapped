import { NextRequest } from "next/server";

import fs from "fs";
type RouteParams = { params: Promise<{ year: string }> };

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { year } = await params;

  if (!year) {
    return Response.json("No year provided.");
  }
  let data: string;
  const filePath = `./data/reasons_${year}.csv`;
  try {
    data = fs.readFileSync(filePath, "utf-8"); // Ensure proper encoding
  } catch (error) {
    return Response.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
  return Response.json(data);
};
