"use client";

import React, { useEffect, useState } from "react";

type RouteParams = { params: Promise<{ year: string }> };

export default function Home({ params }: RouteParams) {
  const [year, setYear] = useState<string | null>(null);
  const [csv, setCSV] = useState<string>();

  useEffect(() => {
    // Resolve year asynchronously from params
    const getYear = async () => {
      try {
        const resolvedYear = await params; // Resolve the promise for year
        setYear(resolvedYear.year); // Set the resolved year
      } catch (error) {
        console.error("Failed to resolve year:", error);
      }
    };

    getYear();
  }, [params]);

  useEffect(() => {
    if (!year) return; // Don't fetch if year is undefined

    // Fetch wrapped data after year is resolved
    const fetchWrappedData = async () => {
      try {
        const resp = await fetch(`/wrapped/${year}/csv`);
        if (!resp.ok) {
          throw new Error("Failed to fetch wrapped csv");
        }
        const csv = await resp.json();
        setCSV(csv);
      } catch (error) {
        console.error("Error fetching wrapped data:", error);
      }
    };

    fetchWrappedData();
  }, [year]); // Run this useEffect when `year` changes

  if (!year) {
    return <div>Loading year...</div>;
  }

  if (!csv) {
    return <div>Loading wrapped csv...</div>;
  }
  return (
    <main className="bg-gradient-0">
      <div
        onClick={() => (window.location.href = `/${year}`)}
        className="absolute top-0 left-0 bg-gray-300 text-white text-sm px-4 py-2 rounded-br-lg cursor-pointer hover:bg-gray-600 transition"
      >
        Return
      </div>
      <h1 className="text-2xl font-extrabold text-center mt-10">
        Probability table
      </h1>
      <div className="w-9/10 flex justify-center mt-6">
        <table className="table-auto border-collapse border border-gray-300 w-max">
          <thead className="bg-gray-100">
            <tr key={`row-0`}>
              {csv
                .split("\n")[0]
                .split(",")
                .map((cell, index) => (
                  <th
                    key={`header-${index}`}
                    className="border border-gray-300 px-4 py-2 text-left"
                  >
                    {cell}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {csv.split("\n").map((row, index) =>
              index !== 0 && index !== csv.split("\n").length - 1 ? (
                <tr key={`row-${index}`}>
                  {row.split(",").map((cell, cellIndex) => (
                    <td
                      key={`${index}-${cellIndex}`}
                      className={`border border-gray-300 px-4 py-2 text-left bg-gray-100 `}
                      style={{
                        backgroundColor:
                          cellIndex !== 0
                            ? !Number(cell) && Number(cell) !== 0
                              ? "white"
                              : `hsl(${cellIndex === 1 ? 0 : 210}, 70%, ${
                                  100 -
                                  Math.min(Math.max(Number(cell) * 50, 0), 100)
                                }%)`
                            : undefined,
                      }}
                    >
                      {Number(cell) || Number(cell) === 0
                        ? `${Math.round(Number(cell) * 100)}%`
                        : cell}
                    </td>
                  ))}
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
