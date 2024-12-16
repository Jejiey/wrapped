"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white">
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-5xl font-extrabold text-center mb-10">
          Choose Your Year for Spotify Wrapped!
        </h1>

        <div className="space-y-6 w-full max-w-4xl px-6">
          {/* Year Buttons */}
          {Array.from({ length: 7 }, (_, i) => 2018 + i).map((year) => (
            <Link key={year} href={`/${year}`} passHref>
              <div className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-4 m-6 rounded-2xl shadow-lg text-2xl font-bold text-white text-center hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all">
                {year}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
