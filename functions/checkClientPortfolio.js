// checkClientPortfolio.js

const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

/**
 * Checks the client's portfolio by scraping their website for marketing-related information.
 * @param {string} clientName - The name of the client.
 * @param {string} email - The client's email address for potential future communications.
 * @returns {Promise<Object>} - An object containing the success status and portfolio information.
 */
const checkClientPortfolio = async (clientName, email) => {
  try {
    // Assuming clientName might be part of the domain name or can be used to construct a URL
    const domain = `${clientName.replace(/\s+/g, '').toLowerCase()}.com`; // Simplistic domain construction, adjust as needed
    const url = `https://${domain}`;

    // Fetch the website content
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Here you would parse the HTML for marketing-related information
    // This is a very basic example, you'll need to adjust based on what you're looking for
    const portfolio = {
      website: url,
      hasSEO: $('meta[name="description"]').length > 0,
      socialMediaLinks: $('a[href*="facebook.com"], a[href*="twitter.com"], a[href*="instagram.com"]').length,
      // Add more checks as needed, e.g., for PPC ads, content marketing, etc.
    };

    return {
      success: true,
      portfolio: portfolio
    };
  } catch (error) {
    console.error(`Failed to check portfolio for ${clientName}:`, error.message);
    return {
      success: false,
      portfolio: null,
      error: `Failed to retrieve portfolio information. ${error.message}`
    };
  }
};

module.exports = { checkClientPortfolio };