const songs = [
  "kesariya",
  "sitare",
  "pehli dafa",
  "tere hawale",
  "tum se hi",
  "channa mereya",
  "Tera hua",
  "Thame dilo ki baatain atif aslam",
  "sun saiyan",
  "tera ban jaunga",
  "Kya Sach Ho Tum",
  "saiyan dil me aana re"
];
const https = require('https');

async function fetchSong(query) {
  return new Promise((resolve, reject) => {
    const url = "https://itunes.apple.com/search?term=" + encodeURIComponent(query) + "&media=music&limit=1";
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            resolve({
              query,
              title: parsed.results[0].trackName,
              artist: parsed.results[0].artistName,
              previewUrl: parsed.results[0].previewUrl
            });
          } else {
            resolve({ query, title: query, artist: "Unknown", previewUrl: "" });
          }
        } catch (e) { resolve({ query, title: query, artist: "Unknown", previewUrl: "" }); }
      });
    }).on('error', e => resolve({ query, title: query, artist: "Unknown", previewUrl: "" }));
  });
}

async function main() {
  for (const song of songs) {
    const s = await fetchSong(song);
    console.log(JSON.stringify(s));
  }
}
main();
