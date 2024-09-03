// processClientRequest.js

const { checkClientPortfolio } = require('./checkClientPortfolio');
const { getServiceQuote } = require('./get_service_quote');

/**
 * Processes a client's marketing request, checks their portfolio, and provides a quote.
 * @param {Object} client - An object containing client information like name, email, and requested service.
 * @returns {Promise<Object>} - An object with the processing results, including portfolio check and quote.
 */
const processClientRequest = async (client) => {
  try {
    // Step 1: Check the client's portfolio
    const portfolioCheck = await checkClientPortfolio(client.name, client.email);
    
    if (!portfolioCheck.success) {
      return {
        success: false,
        message: `Failed to check portfolio: ${portfolioCheck.error}`,
        quote: null
      };
    }

    // Step 2: Generate a quote based on the service and business size (assuming from portfolio check or client input)
    const businessSize = determineBusinessSize(portfolioCheck.portfolio); // This function would need to be implemented
    const quote = await getServiceQuote(client.service, businessSize);

    if (!quote.success) {
      return {
        success: false,
        message: `Failed to generate quote: ${quote.error}`,
        portfolio: portfolioCheck.portfolio,
        quote: null
      };
    }

    return {
      success: true,
      message: "Client request processed successfully",
      portfolio: portfolioCheck.portfolio,
      quote: {
        price: quote.price,
        duration: quote.duration
      }
    };
  } catch (error) {
    console.error('Error processing client request:', error);
    return {
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
      portfolio: null,
      quote: null
    };
  }
};

module.exports = { processClientRequest };

// Placeholder function for determining business size, would need actual implementation
function determineBusinessSize(portfolio) {
  // Logic to determine business size based on portfolio data
  // For now, let's assume it's always 'Medium'
  return 'Medium';
}