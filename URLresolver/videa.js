const axios = require('axios');

async function resolve(vUrl) {
    try {
        // Regex a mediaId kinyeréséhez (a videa.py mintája alapján)
        const idMatch = vUrl.match(/(?:v=|v\/|videok\/)(?:.*-|)([0-9a-zA-Z]+)/);
        if (!idMatch) return null;
        const mediaId = idMatch[1];
        const host = vUrl.includes('videakid.hu') ? 'videakid.hu' : 'videa.hu';

        // Közvetlenül az info oldalról kérjük le, ez stabilabb
        const response = await axios.get(`https://${host}/videok/${mediaId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        // 1. Próbálkozás: video_source kinyerése
        const linkMatch = response.data.match(/video_source\s*name="([^"]+)"[^>]+>([^<]+)/) || 
                          response.data.match(/<source\s+src="([^"]+)"/);
        
        if (linkMatch) {
            let streamUrl = linkMatch[2] || linkMatch[1];
            // Ha a link //-vel kezdődik, rakunk elé https:-t
            if (streamUrl.startsWith('//')) streamUrl = 'https:' + streamUrl;
            console.log("Sikeres feloldás:", streamUrl); // Ez meg fog jelenni a logban!
            return streamUrl;
        }

    } catch (e) {
        console.error(`Videa feloldási hiba (${vUrl}):`, e.message);
    }
    return null;
}

module.exports = { resolve };
