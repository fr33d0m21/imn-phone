require('dotenv').config();

async function makeInboundCall() {
  try {
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    const client = require('twilio')(accountSid, authToken);
    
    let twiml = new VoiceResponse();
    twiml.pause({ length: 10 });
    twiml.say('Which models of airpods do you have available right now?');
    twiml.pause({ length: 30 });
    twiml.hangup();

    console.log(twiml.toString());
    
    const call = await client.calls.create({
      twiml: twiml.toString(),
      to: process.env.APP_NUMBER,
      from: process.env.FROM_NUMBER
    });
    
    console.log(`Call initiated successfully: ${call.sid}`);
  } catch (error) {
    console.error(`Error initiating inbound call: ${error.message}`);
  }
}  

makeInboundCall();
