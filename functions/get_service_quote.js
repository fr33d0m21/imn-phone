// get_service_quote.js

/**
 * Generates a quote for marketing services based on the service type and business size.
 * @param {string} service - The type of marketing service (SEO, PPC, etc.).
 * @param {string} businessSize - The size of the business (Small, Medium, Large).
 * @returns {Promise<Object>} - An object containing the estimated price and duration for the service.
 */
const getServiceQuote = async (service, businessSize) => {
  try {
    // Define base prices and durations for services
    const servicePrices = {
      SEO: { Small: 500, Medium: 1000, Large: 2000 },
      PPC: { Small: 300, Medium: 600, Large: 1200 },
      'Social Media Marketing': { Small: 200, Medium: 400, Large: 800 },
      'Content Marketing': { Small: 400, Medium: 800, Large: 1600 },
      'Email Marketing': { Small: 150, Medium: 300, Large: 600 }
    };

    const serviceDurations = {
      SEO: { Small: '1-3 months', Medium: '3-6 months', Large: '6-12 months' },
      PPC: { Small: '1 month', Medium: '3 months', Large: '6 months' },
      'Social Media Marketing': { Small: '1 month', Medium: '3 months', Large: '6 months' },
      'Content Marketing': { Small: '2-4 months', Medium: '4-8 months', Large: '8-12 months' },
      'Email Marketing': { Small: '1 month', Medium: '3 months', Large: '6 months' }
    };

    // Validate inputs
    if (!servicePrices[service] || !servicePrices[service][businessSize]) {
      throw new Error('Invalid service or business size specified');
    }

    const price = servicePrices[service][businessSize];
    const duration = serviceDurations[service][businessSize];

    return {
      success: true,
      price: price,
      duration: duration
    };
  } catch (error) {
    console.error(`Failed to get quote for ${service} for ${businessSize}:`, error.message);
    return {
      success: false,
      price: null,
      duration: null,
      error: `Failed to generate quote. ${error.message}`
    };
  }
};

module.exports = { getServiceQuote };