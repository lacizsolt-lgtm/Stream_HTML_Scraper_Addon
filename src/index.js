const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const manifest = require("./manifest");
const { scrapeStreamLinks, formatStreamsForStremio } = require("./scraper");

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  console.log(`Stream request received - Type: ${type}, ID: ${id}`);

  try {
    let imdbId, season, episode;

    if (type === "movie") {
      imdbId = id;
    } else if (type === "series") {
      const parts = id.split(":");
      imdbId = parts[0];
      season = parts[1] || "1";
      episode = parts[2] || "1";
    } else {
      return { streams: [] };
    }

    const rawStreams = await scrapeStreamLinks(imdbId, type, season, episode);
    const streams = formatStreamsForStremio(rawStreams);

    console.log(`Returning ${streams.length} streams for ${id}`);
    return { streams };

  } catch (error) {
    console.error(`Error in stream handler for ${id}:`, error.message);
    return { streams: [] };
  }
});

const PORT = process.env.PORT || 5000;

serveHTTP(builder.getInterface(), { port: PORT });

console.log(`Stremio Scraper Addon running at http://0.0.0.0:${PORT}`);
console.log(`Add to Stremio: http://0.0.0.0:${PORT}/manifest.json`);
