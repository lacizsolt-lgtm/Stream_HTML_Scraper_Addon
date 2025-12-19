const { createClient } = require('@supabase/supabase-js');

// A Supabase URL és Key a környezeti változókból jön (Render.com-on állítsd be!)
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

async function scrapeStreamLinks(imdbId, type) {
  try {
    console.log(`MDBase lekérdezés indítása: ${imdbId}`);

    // Adatok lekérése a DB-ből: összekapcsoljuk a films és links táblát
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('film_id', imdbId)
      .eq('status', 'active');

    if (error) {
      console.error('Supabase hiba:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.log(`Nincs találat az MDBase-ben: ${imdbId}`);
      return [];
    }

    // A te eredeti stream formátumodra alakítjuk az eredményt
    return data.map(link => ({
      url: link.url, 
      name: `NetMozi | ${link.host || 'Ismeretlen'}`,
      title: `🎬 ${link.language === 'hu' ? 'Magyar' : link.language} | 💎 ${link.quality}\n🔗 Forrás: ${link.provider_id}`,
      behaviorHints: {
        bingeGroup: `mdbase-${link.provider_id}-${link.quality}`
      }
    }));

  } catch (error) {
    console.error('Váratlan hiba az MDBase olvasásakor:', error.message);
    return [];
  }
}

// A Stremio addonnak szüksége van a formázóra is
function formatStreamsForStremio(streams) {
  return streams; // A fenti map már a megfelelő formátumban adja vissza
}

module.exports = {
  scrapeStreamLinks,
  formatStreamsForStremio
};
