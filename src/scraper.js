const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const { universalResolver } = require("../URLresolver");

const BASE_URL = process.env.SCRAPER_BASE_URL || "https://netmozi.com";

async function scrapeStreamLinks(imdbId, type, season, episode) {
  try {
    const dbPath = path.join(__dirname, "..", "database", "master_db.json");
    
    if (!fs.existsSync(dbPath)) {
      console.error("Adatbázis fájl nem található:", dbPath);
      return [];
    }

    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const movie = db.movies.find(m => m.imdbId === imdbId);
    
    if (!movie) {
      console.log(`Nincs rekord az MDBase-ben: ${imdbId}`);
      return [];
    }

    const streams = [];
    for (const link of movie.links) {
      const resolvedUrl = await universalResolver(link.url);
      if (resolvedUrl) {
        streams.push({
          url: resolvedUrl,
          name: `NetMozi | ${link.host}`,
          title: `🎬 ${link.language} ${link.type}\n💎 ${link.quality}`,
          language: link.language,
          quality: link.quality,
          host: link.host
        });
      }
    }
    return streams;
  } catch (error) {
    console.error(`Hiba az MDBase olvasásakor:`, error.message);
    return [];
  }
}

function formatStreamsForStremio(streams) {
  return streams.map((stream, index) => ({
    name: stream.name,
    title: stream.title,
    url: stream.url,
    behaviorHints: {
      bingeGroup: `scraper-${stream.host}-${stream.quality}`
    }
  }));
}

module.exports = {
  scrapeStreamLinks,
  formatStreamsForStremio,
  BASE_URL
};
