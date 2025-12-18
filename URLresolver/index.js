const videa = require('./videa');

const universalResolver = {
    resolve: async (url) => {
        if (!url) return null;

        // Ellenőrizzük, hogy Videa link-e
        if (url.includes('videa.hu') || url.includes('videakid.hu')) {
            // Itt a videa.js-ben lévő resolve függvényt hívjuk meg
            return await videa.resolve(url);
        }
        
    // Ide jöhetnek majd a többiek:
    // if (url.includes('mixdrop.co')) return await mixdropResolve(url);
        
        // Ha nem ismerjük, visszaadjuk az eredetit (vagy null-t)
        return url;
    }
};

module.exports = { resolve: scrapeVidea };
