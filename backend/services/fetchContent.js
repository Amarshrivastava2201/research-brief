const axios = require("axios");
const cheerio = require("cheerio");

async function fetchCleanContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      timeout: 10000
    });

    const $ = cheerio.load(data);

    // Remove unwanted elements
    $("script, style, noscript, iframe").remove();

    // Extract body text
    let text = $("body").text();

    // Remove extra spaces
    text = text.replace(/\s+/g, " ").trim();

    // Limit size to prevent token overflow
    return text.slice(0, 8000);

  } catch (error) {
    console.error("Error fetching:", url);
    return `Failed to fetch content from ${url}`;
  }
}

module.exports = fetchCleanContent;
