"use client";

import React, { useEffect, useState } from "react";
import { WrappedData } from "../wrapped/wrapped";

type RouteParams = { params: Promise<{ year: string }> };

export default function Home({ params }: RouteParams) {
  const [year, setYear] = useState<string | null>(null);
  const [wrapped, setWrapped] = useState<WrappedData>();

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
        const resp = await fetch(`/wrapped/${year}`);
        if (!resp.ok) {
          throw new Error("Failed to fetch wrapped data");
        }
        const wrappedData = await resp.json();
        setWrapped(wrappedData);
      } catch (error) {
        console.error("Error fetching wrapped data:", error);
      }
    };

    fetchWrappedData();
  }, [year]); // Run this useEffect when `year` changes

  if (!year) {
    return <div>Loading year...</div>;
  }

  if (!wrapped) {
    return <div>Loading wrapped data...</div>;
  }
  return (
    <main>
      <div
        onClick={() => (window.location.href = "/")}
        className="absolute top-0 left-0 bg-blue-500 text-white text-sm px-4 py-2 rounded-br-lg cursor-pointer hover:bg-blue-600 transition"
      >
        Return
      </div>
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8 font-nunito pt-10">
        Spotify Wrapped for {year}
      </h1>

      <div className="flex flex-col items-center">
        <div className="space-y-8 w-full max-w-4xl px-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Your Most Listened Song
            </h2>
            <p className="text-lg text-white font-nunito">
              {`Your most listened to song was `}
              <span className="font-bold">
                {wrapped.topSongs.mostListened[0]}
              </span>
              {` with ${wrapped.topSongs.mostListened[1]} plays`}
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Your Most Played Song
            </h2>
            <p className="text-lg text-white font-nunito">
              {`Your most played song was `}
              <span className="font-bold">
                {wrapped.topSongs.mostPlayed[0]}
              </span>
              {` with ${(wrapped.topSongs.mostPlayed[1] / 60000 / 60).toFixed(
                1
              )} hours played`}
            </p>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Your Most Skipped Song
            </h2>
            {wrapped.skipped ? (
              <p className="text-lg text-white font-nunito">
                {`Your most skipped song was `}
                <span className="font-bold">
                  {wrapped.topSongs.mostSkipped[0]}
                </span>
                {` with ${wrapped.skipped.num_skips} skips, ${(
                  wrapped.skipped.time_listens /
                  60000 /
                  60
                ).toFixed(1)} hours and ${wrapped.skipped.num_listens} plays`}
              </p>
            ) : (
              <p className="text-lg text-white font-nunito">
                You didn't skip a single song this year!
              </p>
            )}
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Skip Percentage
            </h2>
            <p className="text-lg text-white font-nunito">
              {`You skipped ${(
                (wrapped.totalSkips / wrapped.numSongs) *
                100
              ).toFixed(0)}% of the time`}
            </p>
          </div>

          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Offline Listening
            </h2>
            <p className="text-lg text-white font-nunito">
              {`${((wrapped.numOffline / wrapped.numSongs) * 100).toFixed(
                0
              )}% of the time you listened to songs offline`}
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Devices Used
            </h2>
            <ul className="text-lg text-white space-y-2 font-nunito">
              {wrapped.sortedDevices.map((device, idx) => (
                <li
                  key={idx}
                  className="hover:bg-white hover:text-gray-900 transition rounded-lg p-2"
                >
                  {device}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-4 font-nunito">
              Top 10 Songs
            </h2>
            <ul className="text-lg text-white space-y-2 font-nunito">
              {wrapped.sortedSongs.slice(0, 10).map((song, idx) => (
                <li
                  key={idx}
                  className="hover:bg-white hover:text-gray-900 transition rounded-lg p-2"
                >
                  {song}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
