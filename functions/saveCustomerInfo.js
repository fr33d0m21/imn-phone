const fs = require('fs').promises;
const path = require('path');

async function saveCustomerInfo(functionArgs) {
  const { name, email, phone, interestedService } = functionArgs;
  console.log('Saving customer info:', { name, email, phone, interestedService });
  
  const customerData = {
    name,
    email,
    phone,
    interestedService,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, '..', 'customer_data.json');

  try {
    // Read existing data
    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, we'll start with an empty array
      console.log('No existing customer data found, starting new file');
    }

    // Add new customer data
    existingData.push(customerData);

    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    return JSON.stringify({
      success: true,
      message: 'Customer information saved successfully',
      customerId: existingData.length // Using array index as a simple ID
    });
  } catch (error) {
    console.error('Error saving customer information:', error);
    return JSON.stringify({
      success: false,
      message: 'Failed to save customer information'
    });
  }
}

module.exports = saveCustomerInfo;