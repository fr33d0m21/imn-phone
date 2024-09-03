
const twilio = require('twilio');

async function send_text_message({ phoneNumber, message }) {
  // Initialize the Twilio client with your account SID and auth token
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    // Send the text message
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: phoneNumber
    });

    return {
      success: true,
      message: `Text message sent successfully. SID: ${result.sid}`
    };
  } catch (error) {
    console.error('Error sending text message:', error);
    return {
      success: false,
      message: 'There was an error sending the text message. Please try again.'
    };
  }
}

module.exports = send_text_message;
