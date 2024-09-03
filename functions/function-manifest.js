// create metadata for all the available functions to pass to completions API
const tools = [
  {
    type: 'function',
    function: {
      name: 'checkClientPortfolio',
      say: 'I\'ll check your client portfolio for you.',
      description: 'Retrieve and check the client\'s portfolio of services and performance.',
      parameters: {
        type: 'object',
        properties: {
          clientName: {
            type: 'string',
            description: 'The name of the client',
          },
          email: {
            type: 'string',
            description: 'The client\'s email address',
          },
        },
        required: ['clientName', 'email'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the client portfolio was successfully retrieved'
          },
          portfolio: {
            type: 'object',
            description: 'The client\'s portfolio information'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'getServiceQuote',
      say: 'I\'ll get you a quote for that service right away.',
      description: 'Get a quote for an Instant Marketing Nerds service.',
      parameters: {
        type: 'object',
        properties: {
          service: {
            type: 'string',
            'enum': ['SEO', 'PPC', 'Social Media Marketing', 'Content Marketing', 'Email Marketing'],
            description: 'The type of marketing service to get a quote for',
          },
          businessSize: {
            type: 'string',
            'enum': ['Small', 'Medium', 'Large'],
            description: 'The size of the business requesting the quote',
          },
        },
        required: ['service', 'businessSize'],
      },
      returns: {
        type: 'object',
        properties: {
          price: {
            type: 'integer',
            description: 'The estimated price for the service'
          },
          duration: {
            type: 'string',
            description: 'The estimated duration or time frame for the service'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'placeOrder',
      say: 'I\'ll place the order for you right now.',
      description: 'Create a new customer and place an order in WooCommerce.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The customer\'s full name',
          },
          email: {
            type: 'string',
            description: 'The customer\'s email address',
          },
          service: {
            type: 'string',
            'enum': ['SEO', 'PPC', 'Social Media Marketing', 'Content Marketing', 'Email Marketing'],
            description: 'The service the customer wants to order',
          },
        },
        required: ['name', 'email', 'service'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the order was successfully placed'
          },
          orderId: {
            type: 'string',
            description: 'The unique identifier for the placed order'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'saveCustomerInfo',
      say: 'I\'ll save your information in our system.',
      description: 'Save customer information for follow-up or future reference.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The customer\'s full name',
          },
          email: {
            type: 'string',
            description: 'The customer\'s email address',
          },
          phone: {
            type: 'string',
            description: 'The customer\'s phone number',
          },
          interestedService: {
            type: 'string',
            'enum': ['SEO', 'PPC', 'Social Media Marketing', 'Content Marketing', 'Email Marketing'],
            description: 'The service the customer is interested in',
          },
        },
        required: ['name', 'email', 'interestedService'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the customer information was successfully saved'
          },
          customerId: {
            type: 'string',
            description: 'The unique identifier for the saved customer record'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'scheduleZoomCall',
      say: 'I\'ll schedule a Zoom call for you.',
      description: 'Schedule a Zoom call based on the customer\'s preferred date and time.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The customer\'s full name',
          },
          email: {
            type: 'string',
            description: 'The customer\'s email address',
          },
          preferredDate: {
            type: 'string',
            description: 'The customer\'s preferred date for the Zoom call (YYYY-MM-DD)',
          },
          preferredTime: {
            type: 'string',
            description: 'The customer\'s preferred time for the Zoom call (HH:MM)',
          },
        },
        required: ['name', 'email', 'preferredDate', 'preferredTime'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the Zoom call was successfully scheduled'
          },
          zoomLink: {
            type: 'string',
            description: 'The link to the scheduled Zoom meeting'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'sendTextMessage',
      say: 'I\'ll send a text message with more details.',
      description: 'Send a text message via Twilio.',
      parameters: {
        type: 'object',
        properties: {
          to: {
            type: 'string',
            description: 'The phone number to send the text message to',
          },
          message: {
            type: 'string',
            description: 'The content of the text message',
          },
        },
        required: ['to', 'message'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the text message was successfully sent'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'sendFollowUpEmail',
      say: 'I\'ll send a follow-up email with more information.',
      description: 'Send a follow-up email to the customer based on the conversation.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The customer\'s full name',
          },
          email: {
            type: 'string',
            description: 'The customer\'s email address',
          },
          service: {
            type: 'string',
            'enum': ['SEO', 'PPC', 'Social Media Marketing', 'Content Marketing', 'Email Marketing'],
            description: 'The service the customer is interested in',
          },
          notes: {
            type: 'string',
            description: 'Additional notes or information to include in the email',
          },
        },
        required: ['name', 'email', 'service'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the follow-up email was successfully sent'
          },
          message: {
            type: 'string',
            description: 'A message confirming the email was sent'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'storeCustomerInfo',
      say: 'I\'ll store the customer information locally.',
      description: 'Store customer information locally for short-term memory use.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The customer\'s full name',
          },
          email: {
            type: 'string',
            description: 'The customer\'s email address',
          },
          phone: {
            type: 'string',
            description: 'The customer\'s phone number',
          },
          service: {
            type: 'string',
            description: 'The service the customer is interested in',
          },
        },
        required: ['name', 'email', 'phone', 'service'],
      },
      returns: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the customer information was successfully stored'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'storeMeetingTranscript',
      say: 'I\'ll save the meeting transcript for you.',
      description: 'Store the meeting transcript locally, using the customer\'s phone number as the file name.',
      parameters: {
        type: 'object',
        properties: {
          phoneNumber: {
            type: 'string',
            description: 'The customer\'s phone number',
          },
          transcript: {
            type: 'string',
            description: 'The meeting transcript to save',
          },
