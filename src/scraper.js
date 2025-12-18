const { universalResolver } = require("../URLresolver"); // Beimportáljuk a kaput
const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = process.env.SCRAPER_BASE_URL || "https://example.com";

async function scrapeStreamLinks(imdbId, type, season, episode) {
  try {
    let url;
    if (type === "movie") {
      url = `${BASE_URL}/movie/${imdbId}`;
    } else if (type === "series") {
      url = `${BASE_URL}/series/${imdbId}/season/${season}/episode/${episode}`;
    } else {
      return [];
    }

    console.log(`Scraping URL: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const streams = [];

const elements = $("a.details_links_btn").toArray();

    for (const element of elements) {
      const streamUrl = $(element).attr("href");
      if (!streamUrl) continue;

      try {
        // Megpróbáljuk feloldani a linket (Videa, Mixdrop, stb.)
        const resolvedUrl = await universalResolver.resolve(streamUrl);
        
        if (resolvedUrl) {
          const hostName = streamUrl.split('/')[2] || "Stream";
          streams.push({
            url: resolvedUrl,
            name: `NetMozi | ${hostName}`,
            title: `Eredeti forrás: ${hostName} (Feloldva)`,
            behaviorHints: {
              notInterchangeable: true
            }
          });
        }
      } catch (err) {
        console.error(`Hiba a feloldáskor (${streamUrl}):`, err.message);
      }
    }

    console.log(`Found ${streams.length} streams`);
    return streams;

  } catch (error) {
    console.error(`Error scraping ${imdbId}:`, error.message);
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
