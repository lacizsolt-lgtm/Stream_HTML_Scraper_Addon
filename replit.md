# Stremio Scraper Addon

## Overview
A Stremio addon that scrapes stream links from websites instead of using torrent sources. The addon extracts stream URLs, language, quality, and host information from HTML pages.

## Project Structure
```
├── src/
│   ├── index.js      # Main entry point, Stremio addon server
│   ├── manifest.js   # Stremio addon manifest configuration
│   └── scraper.js    # HTML scraper module using axios + cheerio
├── package.json      # Node.js dependencies
└── .gitignore
```

## Key Components

### Manifest (src/manifest.js)
- Defines addon metadata for Stremio
- Supports both movies and series
- Uses IMDB ID prefix (tt) for content identification

### Scraper (src/scraper.js)
- Uses axios for HTTP requests
- Uses cheerio for HTML parsing
- Extracts stream links from `a.details_links_btn` elements
- Parses table.table-responsive for language, quality, and host data
- Returns formatted streams for Stremio

### Server (src/index.js)
- Uses stremio-addon-sdk for Stremio compatibility
- Handles stream requests for movies and series
- Runs on port 5000

## Configuration

### Environment Variables
- `SCRAPER_BASE_URL`: Base URL of the website to scrape (default: https://example.com)
- `PORT`: Server port (default: 5000)

## Running the Addon
```bash
npm start
```

The addon will be available at:
- Manifest: http://localhost:5000/manifest.json
- Add to Stremio using the manifest URL

## HTML Structure Expected
The scraper expects the following HTML structure on the target website:
- Stream links: `<a class="details_links_btn" href="stream-url">`
- Data table: `<table class="table-responsive">` containing language, quality, and host columns
