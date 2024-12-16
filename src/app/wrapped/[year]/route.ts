import { NextRequest } from "next/server";
import { getWrapped, WrappedData } from "../wrapped";

type RouteParams = { params: Promise<{ year: string }> };

export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const { year } = await params;

  if (!year) {
    return Response.json("No year provided.");
  }
  let data: WrappedData;
  try {
    console.log(`Awaiting ${year}`);
    data = await getWrapped(Number(year));
  } catch (error) {
    return Response.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
  return Response.json(data);
};
