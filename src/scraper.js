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

    $("a.details_links_btn").each((index, element) => {
      const streamUrl = $(element).attr("href");
      
      if (streamUrl) {
        const row = $(element).closest("tr");
        const table = $(element).closest("table.table-responsive");
        
        let language = "";
        let quality = "";
        let host = "";
        
        if (row.length > 0) {
          const cells = row.find("td");
          cells.each((i, cell) => {
            const text = $(cell).text().trim();
            const cellClass = $(cell).attr("class") || "";
            
            if (cellClass.includes("language") || i === 0) {
              language = text;
            } else if (cellClass.includes("quality") || i === 1) {
              quality = text;
            } else if (cellClass.includes("host") || i === 2) {
              host = text;
            }
          });
        }

        if (table.length > 0 && !language && !quality && !host) {
          const headers = table.find("th");
          const headerMap = {};
          headers.each((i, header) => {
            const headerText = $(header).text().toLowerCase().trim();
            headerMap[i] = headerText;
          });
          
          const cells = row.find("td");
          cells.each((i, cell) => {
            const text = $(cell).text().trim();
            const headerType = headerMap[i];
            
            if (headerType && headerType.includes("lang")) {
              language = text;
            } else if (headerType && (headerType.includes("quality") || headerType.includes("qual"))) {
              quality = text;
            } else if (headerType && headerType.includes("host")) {
              host = text;
            }
          });
        }

        streams.push({
          url: streamUrl,
          name: `${host || "Stream"} ${quality || ""}`.trim(),
          title: `${language ? `[${language}] ` : ""}${quality || "Unknown Quality"} - ${host || "Unknown Host"}`,
          language: language || "Unknown",
          quality: quality || "Unknown",
          host: host || "Unknown"
        });
      }
    });

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
