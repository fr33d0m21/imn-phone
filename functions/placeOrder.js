// placeOrder.js

const axios = require('axios');
require('dotenv').config();

/**
 * Places an order in WooCommerce for the specified service.
 * @param {string} name - The customer's full name.
 * @param {string} email - The customer's email address.
 * @param {string} service - The service to order (SEO, PPC, etc.).
 * @returns {Promise<Object>} - An object indicating the success of the order placement and the order ID.
 */
const placeOrder = async (name, email, service) => {
  try {
    // WooCommerce API endpoint for creating orders
    const orderUrl = `${process.env.WC_API_URL}orders`;

    // Prepare customer data
    const customerData = {
      email: email,
      first_name: name.split(' ')[0],
      last_name: name.split(' ').slice(1).join(' '),
    };

    // Create customer in WooCommerce if not exists
    const customerResponse = await axios.post(`${process.env.WC_API_URL}customers`, customerData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    const customerId = customerResponse.data.id;

    // Prepare order data
    const orderData = {
      status: 'pending',
      payment_method: 'cod', // Cash on delivery as an example, adjust as needed
      payment_method_title: 'Cash on Delivery',
      billing: {
        first_name: customerData.first_name,
        last_name: customerData.last_name,
        email: email
      },
      line_items: [{
        name: service,
        quantity: 1,
        // Price would ideally come from your service pricing logic
        price: getServicePrice(service) // Placeholder function
      }]
    };

    // Place the order
    const orderResponse = await axios.post(orderUrl, orderData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      orderId: orderResponse.data.id
    };
  } catch (error) {
    console.error('Error placing order:', error.message);
    return {
      success: false,
      orderId: null,
      error: `Failed to place order: ${error.message}`
    };
  }
};

// Placeholder function for getting service price, would need actual implementation
function getServicePrice(service) {
  // Logic to fetch or determine the price of the service
  // For now, let's assume a fixed price for demonstration
  return 500; // Example price
}

module.exports = { placeOrder };