
const fs = require('fs').promises;
const path = require('path');

async function store_customer_info({ name, email, phone, notes }) {
  const customerData = { name, email, phone, notes, createdAt: new Date().toISOString() };
  const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.json`;
  const filePath = path.join(__dirname, '..', 'customer_data', fileName);

  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(customerData, null, 2));
    return `Customer information for ${name} has been stored successfully.`;
  } catch (error) {
    console.error('Error storing customer information:', error);
    return 'There was an error storing the customer information. Please try again.';
  }
}

module.exports = store_customer_info;
