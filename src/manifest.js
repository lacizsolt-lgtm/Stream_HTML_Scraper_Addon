const manifest = {
  id: "netmozi.scraper",
  version: "1.0.0",
  name: "Stream Scraper Addon",
  description: "Stremio addon that scrapes stream links from websites for movies and series",
  logo: "https://www.stremio.com/website/stremio-logo-small.png",
  resources: ["stream"],
  types: ["movie", "series"],
  idPrefixes: ["tt"],
  catalogs: [],
  behaviorHints: {
    configurable: false,
    configurationRequired: false
  }
};

module.exports = manifest;
