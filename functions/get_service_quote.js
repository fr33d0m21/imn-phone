
const quoteDatabase = {
  website: {
    small: { minPrice: 5000, maxPrice: 10000, timeframe: '2-4 weeks' },
    medium: { minPrice: 10000, maxPrice: 25000, timeframe: '4-8 weeks' },
    large: { minPrice: 25000, maxPrice: 50000, timeframe: '8-16 weeks' }
  },
  'digital marketing': {
    small: { minPrice: 1000, maxPrice: 3000, timeframe: 'Monthly retainer' },
    medium: { minPrice: 3000, maxPrice: 7000, timeframe: 'Monthly retainer' },
    large: { minPrice: 7000, maxPrice: 15000, timeframe: 'Monthly retainer' }
  },
  software: {
    small: { minPrice: 10000, maxPrice: 25000, timeframe: '1-3 months' },
    medium: { minPrice: 25000, maxPrice: 75000, timeframe: '3-6 months' },
    large: { minPrice: 75000, maxPrice: 200000, timeframe: '6-12 months' }
  },
  AI: {
    small: { minPrice: 15000, maxPrice: 35000, timeframe: '1-2 months' },
    medium: { minPrice: 35000, maxPrice: 100000, timeframe: '2-4 months' },
    large: { minPrice: 100000, maxPrice: 300000, timeframe: '4-8 months' }
  }
};

function get_service_quote({ service_type, project_scope }) {
  if (!quoteDatabase[service_type] || !quoteDatabase[service_type][project_scope]) {
    return 'Invalid service type or project scope. Please try again with valid inputs.';
  }

  const quote = quoteDatabase[service_type][project_scope];
  return `For a ${project_scope} ${service_type} project, the estimated price range is $${quote.minPrice} - $${quote.maxPrice}, with an approximate timeframe of ${quote.timeframe}.`;
}

module.exports = get_service_quote;
