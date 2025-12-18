const axios = require('axios');

async function resolve(vUrl) {
    try {
        const idMatch = vUrl.match(/(?:v=|v\/|videok\/)(?:.*-|)([0-9a-zA-Z]+)/);
        if (!idMatch) return null;
        const mediaId = idMatch[1];
        
        // Közvetlenül a Videa belső API-ját célozzuk meg (vagy az embed oldalt)
        const response = await axios.get(`https://videa.hu/videok/${mediaId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        // Kikeressük az összes lehetséges forrást (több minőség is lehet benne)
        const sourceMatches = response.data.matchAll(/_source\s*:\s*["']([^"']+)["']/g);
        const sources = Array.from(sourceMatches, m => m[1]);

        // Ha van találat, kivesszük a legjobbat (vagy az elsőt)
        if (sources.length > 0) {
            let streamUrl = sources[sources.length - 1]; // Általában az utolsó a legjobb minőség
            if (streamUrl.startsWith('//')) streamUrl = 'https:' + streamUrl;
            
            console.log("!!! SIKERES FELOLDÁS !!! ->", streamUrl);
            return streamUrl;
        }

        // B terv: Ha az előző nem talált semmit, nézzük meg a meta tageket
        const metaMatch = response.data.match(/<source\s+src="([^"]+)"/i);
        if (metaMatch) {
            let streamUrl = metaMatch[1];
            if (streamUrl.startsWith('//')) streamUrl = 'https:' + streamUrl;
            console.log("!!! SIKERES FELOLDÁS (B terv) !!! ->", streamUrl);
            return streamUrl;
        }

    } catch (e) {
        console.error(`Videa feloldási hiba (${vUrl}):`, e.message);
    }
    console.log("Videa feloldás: Nem található forrás ezen az oldalon.");
    return null;
}

module.exports = { resolve };
