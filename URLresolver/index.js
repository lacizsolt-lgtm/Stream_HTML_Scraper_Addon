const videa = require('./videa');

const universalResolver = {
    resolve: async (url) => {
        if (url && (url.includes('videa.hu') || url.includes('videakid.hu'))) {
            // A videa.js-ből importált objektum 'resolve' metódusát hívjuk
            return await videa.resolve(url);
        }
        return null;
    }
};

module.exports = { universalResolver };
