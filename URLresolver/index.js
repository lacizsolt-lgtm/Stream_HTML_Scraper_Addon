const videaResolve = require('./videa');

async function universalResolver(url) {
    if (!url) return null;

    if (url.includes('videa.hu') || url.includes('videakid.hu')) {
        return await videaResolve(url);
    }
    
    // Ide jöhetnek majd a többiek:
    // if (url.includes('mixdrop.co')) return await mixdropResolve(url);

    return url; // Ha nem ismerjük, visszaadjuk az eredetit
}

module.exports = { universalResolver };
