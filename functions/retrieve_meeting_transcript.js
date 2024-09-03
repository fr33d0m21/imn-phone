
const fs = require('fs').promises;
const path = require('path');

async function retrieve_meeting_transcript({ callSid }) {
  const fileName = `${callSid}_transcript.txt`;
  const filePath = path.join(__dirname, '..', 'meeting_transcripts', fileName);

  try {
    const transcript = await fs.readFile(filePath, 'utf8');
    return {
      success: true,
      message: `Meeting transcript for call ${callSid} retrieved successfully.`,
      transcript: transcript
    };
  } catch (error) {
    console.error('Error retrieving meeting transcript:', error);
    return {
      success: false,
      message: 'There was an error retrieving the meeting transcript. The transcript may not exist or there might be a file system error.'
    };
  }
}

module.exports = retrieve_meeting_transcript;
