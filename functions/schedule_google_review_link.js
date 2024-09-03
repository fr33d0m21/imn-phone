
const schedule = require('node-schedule');
const { send_text_message } = require('./send_text_message');

async function schedule_google_review_link({ phoneNumber, meetingEndTime, businessName }) {
  try {
    const reviewLink = 'https://g.page/r/YOUR_GOOGLE_REVIEW_LINK'; // Replace with actual Google review link
    const message = `Thank you for meeting with ${businessName}. We'd appreciate your feedback! Please leave a review: ${reviewLink}`;

    // Schedule the message to be sent 30 minutes after the meeting ends
    const sendTime = new Date(meetingEndTime.getTime() + 30 * 60000);

    schedule.scheduleJob(sendTime, async function() {
      await send_text_message({ phoneNumber, message });
    });

    return {
      success: true,
      message: `Google review link scheduled to be sent on ${sendTime.toLocaleString()}.`
    };
  } catch (error) {
    console.error('Error scheduling Google review link:', error);
    return {
      success: false,
      message: 'There was an error scheduling the Google review link. Please try again.'
    };
  }
}

module.exports = schedule_google_review_link;
