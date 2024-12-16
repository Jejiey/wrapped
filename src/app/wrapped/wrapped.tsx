import fs from "fs";

export type WrappedData = {
  numSongs: number;
  uniqueSongs: number;
  msPlayed: number;
  topSongs: topSongs;
  totalSkips: number;
  numOffline: number;
  sortedDevices: Array<string>;
  sortedSongs: Array<string>;
  skipped: songStat;
};

type topSongs = {
  mostListened: [string, number];
  mostPlayed: [string, number];
  mostSkipped: [string, number, string];
};

type YearData = Array<song>;

type song = {
  ts: string;
  platform: string;
  ms_played: number;
  conn_country: string;
  ip_addr: string;
  master_metadata_track_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_album_album_name: string;
  spotify_track_uri: string;
  episode_name: null | string;
  episode_show_name: null | string;
  spotify_episode_uri: null | string;
  reason_start: string;
  reason_end: string;
  shuffle: boolean;
  skipped: boolean;
  offline: boolean;
  offline_timestamp: null | number;
  incognito_mode: boolean;
};

type statMap<type> = {
  [key: string]: type;
};

type songStat = {
  artist_name: string;
  num_listens: number;
  time_listens: number;
  num_skips: number;
};

enum reasonStarting {
  "trackdone",
  "fwdbtn",
  "appload", // app loaded
  "clickrow", //skipping by clicking on items from a list
  "backbtn",
  "playbtn",
  "trackerror",
  "popup",
  "remote",
  "switched-to-audio",
  "unknown",
}

enum reasonEnding {
  "trackdone",
  "fwdbtn",
  "appload", // app loaded
  "clickrow", //skipping by clicking on items from a list
  "endplay",
  "backbtn",
  "unexpected-exit-while-paused",
  "popup",
  "remote",
  "unexpected-exit",
  "logout",
  "trackerror",
  "unknown",
}

function getJsonSync(filePath: string): YearData {
  const data = fs.readFileSync(filePath, "utf-8"); // Ensure proper encoding
  try {
    return JSON.parse(data); // Attempt to parse JSON
  } catch (err) {
    console.error(`Error reading or parsing file ${filePath}:`, err);
    return []; // Return an empty array in case of an error
  }
}

function getYear(song: song): number {
  return Number(song.ts.slice(0, 4));
}

for (let i = 2018; i < 2025; i++) {
  getWrapped(i);
}

async function writeToFile(
  data: number[][],
  totalStarting: number[],
  year: number
) {
  const reasonStartingKeys = Object.keys(reasonStarting).filter((key) =>
    isNaN(Number(key))
  );
  const reasonEndingKeys = Object.keys(reasonEnding).filter((key) =>
    isNaN(Number(key))
  );
  let csvContent =
    "Reason Starting, " + "any," + reasonEndingKeys.join(", ") + "\n"; // Header row

  data.forEach((row, i) => {
    const rowLabel = reasonStartingKeys[i];
    const rowData = [totalStarting[i]].concat(row).join(", ");
    csvContent += `${rowLabel}, ${rowData}\n`; // Adding each row
  });

  // Write CSV content to a new file using Deno
  const filePath = `./data/reasons_${year}.csv`; // The path to save the CSV file
  await fs.writeFileSync(filePath, csvContent);

  console.log(`CSV file has been written to ${filePath}`);
}

export async function getWrapped(year: number): Promise<WrappedData> {
  let data: YearData = [];

  const files = [
    "./history/Streaming_History_Audio_2018-2019_0.json",
    "./history/Streaming_History_Audio_2019-2020_1.json",
    "./history/Streaming_History_Audio_2020-2021_2.json",
    "./history/Streaming_History_Audio_2021-2022_3.json",
    "./history/Streaming_History_Audio_2022-2023_4.json",
    "./history/Streaming_History_Audio_2023-2024_5.json",
  ];

  files.forEach((file) => {
    const fileData = getJsonSync(file);
    if (Array.isArray(fileData)) {
      data.push(...fileData); // Only spread if it's an array
    } else {
      console.error(`File ${file} did not return an array of data.`);
    }
  });

  let numSongs = 0;
  let numOffline = 0;
  const devices: statMap<number> = {};
  const songStats: statMap<songStat> = {};

  let msPlayed = 0;
  const reasonTable = Array.from(
    { length: Object.keys(reasonStarting).length / 2 },
    () => Array.from({ length: Object.keys(reasonEnding).length / 2 }, () => 0)
  );

  data.forEach((song) => {
    if (getYear(song) === year) {
      numSongs++;
      numOffline += song.offline ? 1 : 0;
      if (!devices[song.platform]) {
        devices[song.platform] = 0;
      }
      devices[song.platform]++;
      msPlayed += song.ms_played;
      if (!songStats[song.master_metadata_track_name]) {
        songStats[song.master_metadata_track_name] = {
          artist_name: song.master_metadata_album_artist_name,
          num_listens: 0,
          num_skips: 0,
          time_listens: 0,
        };
      }
      songStats[song.master_metadata_track_name].num_listens++;
      songStats[song.master_metadata_track_name].num_skips += song.skipped
        ? 1
        : 0;

      songStats[song.master_metadata_track_name].time_listens += song.ms_played;

      const reasonStartIndex = Number(
        Object.keys(reasonStarting).indexOf(song.reason_start) -
          Object.keys(reasonStarting).length / 2
      );
      const reasonEndIndex = Number(
        Object.keys(reasonEnding).indexOf(song.reason_end) -
          Object.keys(reasonEnding).length / 2
      );

      if (
        reasonStartIndex !== -1 &&
        reasonEndIndex >= 0 &&
        reasonEndIndex < reasonTable[0].length
      ) {
        try {
          reasonTable[reasonStartIndex][reasonEndIndex]++;
        } catch {
          console.error(`Error with song:`);
          console.error(song);
        }
      } else {
        console.error("Invalid song data or indices:", {
          song,
          reasonStartIndex,
          reasonEndIndex,
        });
      }
    }
  });

  const topSongs: topSongs = {
    mostListened: ["", 0],
    mostPlayed: ["", 0],
    mostSkipped: ["", 0, ""],
  };
  let totalSkips = 0;
  for (const trackName in songStats) {
    const stats = songStats[trackName];
    totalSkips += stats.num_skips;
    if (stats.num_listens > topSongs.mostListened[1]) {
      topSongs.mostListened = [
        `${trackName} by ${stats.artist_name}`,
        stats.num_listens,
      ];
    }
    if (stats.time_listens > topSongs.mostPlayed[1]) {
      topSongs.mostPlayed = [
        `${trackName} by ${stats.artist_name}`,
        stats.time_listens,
      ];
    }
    if (stats.num_skips > topSongs.mostSkipped[1]) {
      topSongs.mostSkipped = [
        `${trackName} by ${stats.artist_name}`,
        stats.num_skips,
        trackName,
      ];
    }
  }
  const skipped = songStats[topSongs.mostSkipped[2]];
  const sortedDevices = Object.keys(devices).sort(
    (a, b) => devices[b] - devices[a]
  );

  const amountDevices = sortedDevices.map(
    (device) =>
      `${device} - ${((devices[device] / numSongs) * 100).toFixed(0)}%`
  );

  const sortedSongs = Object.keys(songStats).slice();
  sortedSongs.sort(
    (a, b) => songStats[b].time_listens - songStats[a].time_listens
  );

  const totalStarting = Array.from(
    {
      length: Object.keys(reasonStarting).length / 2,
    },
    () => 0
  );
  const probReasonTable = reasonTable.map((starting, i) => {
    starting.forEach((ending) => {
      totalStarting[i] += ending;
    });

    const probabilities = starting.map((ending) =>
      Number((ending / totalStarting[i]).toFixed(2))
    );

    totalStarting[i] = Number((totalStarting[i] / numSongs).toFixed(2));
    return probabilities;
  });
  await writeToFile(probReasonTable, totalStarting, year);

  return {
    numSongs,
    numOffline,
    uniqueSongs: Object.keys(songStats).length,
    topSongs,
    sortedDevices: amountDevices,
    sortedSongs,
    totalSkips,
    msPlayed,
    skipped,
  };
}
