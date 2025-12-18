const axios = require('axios');

async function resolve(vUrl) {
    try {
        // Regex a mediaId kinyeréséhez (a videa.py mintája alapján)
        const idMatch = vUrl.match(/(?:v=|v\/|videok\/)(?:.*-|)([0-9a-zA-Z]+)/);
        if (!idMatch) return null;
        const mediaId = idMatch[1];
        const host = vUrl.includes('videakid.hu') ? 'videakid.hu' : 'videa.hu';

        // Lekérjük a videó oldalát
        const response = await axios.get(`https://${host}/videok/${mediaId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        // Megkeressük a video_source-t (ahogy a python-ban volt)
        const linkMatch = response.data.match(/video_source\s*name="([^"]+)"[^>]+>([^<]+)/);
        if (linkMatch) {
            let streamUrl = linkMatch[2];
            // Ha a link //-vel kezdődik, rakunk elé https:-t
            return streamUrl.startsWith('//') ? 'https:' + streamUrl : streamUrl;
        }
    } catch (e) {
        console.error(`Videa feloldási hiba (${vUrl}):`, e.message);
    }
    return null;
}

module.exports = resolve;
