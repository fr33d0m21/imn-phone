require('dotenv').config();
require('colors');

const express = require('express');
const ExpressWs = require('express-ws');
const bodyParser = require('body-parser');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');
const { recordingService } = require('./services/recording-service');

const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
ExpressWs(app);

const PORT = process.env.PORT || 3000;

app.post('/incoming', (req, res) => {
  try {
    console.log('Incoming call received');
    console.log('Request body:', req.body);

    const response = new VoiceResponse();
    const connect = response.connect();
    connect.stream({ url: `wss://${req.headers.host}/connection` });
  
    console.log('TwiML response:', response.toString());
    res.type('text/xml');
    res.send(response.toString());
  } catch (err) {
    console.error('Error in /incoming route:', err);
    res.status(500).send('Error processing incoming call');
  }
});

app.ws('/connection', (ws, req) => {
  console.log('WebSocket connection established');
  try {
    ws.on('error', (error) => console.error('WebSocket error:', error));
    
    let streamSid;
    let callSid;

    const gptService = new GptService();
    const streamService = new StreamService(ws);
    const transcriptionService = new TranscriptionService();
    const ttsService = new TextToSpeechService({});
  
    let marks = [];
    let interactionCount = 0;
  
    ws.on('message', function message(data) {
      try {
        const msg = JSON.parse(data);
        console.log('Received WebSocket message:', msg.event);
        
        if (msg.event === 'start') {
          streamSid = msg.start.streamSid;
          callSid = msg.start.callSid;
          
          streamService.setStreamSid(streamSid);
          gptService.setCallSid(callSid);

          console.log(`Twilio -> Starting Media Stream for ${streamSid}`.underline.red);
          
          if (process.env.RECORDING_ENABLED === 'true') {
            recordingService(ttsService, callSid).then(() => {
              ttsService.generate({partialResponseIndex: null, partialResponse: 'Hello! I\'m Sandy from Instant Marketing Nerds. • How can I help you with your digital needs today? You can ask me any questions or place an order. If you have an existing account that you would like to make changes or get help with please let me know. Also, please feel free to interupt me at anytime. I am always listening.'}, 0);
            });
          } else {
            ttsService.generate({partialResponseIndex: null, partialResponse: 'Hello! I\'m Sandy from Instant Marketing Nerds. • How can I help you with your digital needs today? You can ask me any questions or place an order. If you have an existing account that you would like to make changes or get help with please let me know.  Also, please feel free to interupt me at anytime. I am always listening.'}, 0);
          }
        } else if (msg.event === 'media') {
          transcriptionService.send(msg.media.payload);
        } else if (msg.event === 'mark') {
          const label = msg.mark.name;
          console.log(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`.red);
          marks = marks.filter(m => m !== msg.mark.name);
        } else if (msg.event === 'stop') {
          console.log(`Twilio -> Media stream ${streamSid} ended.`.underline.red);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
  
    transcriptionService.on('utterance', async (text) => {
      if(marks.length > 0 && text?.length > 5) {
        console.log('Twilio -> Interruption, Clearing stream'.red);
        ws.send(JSON.stringify({ streamSid, event: 'clear' }));
      }
    });
  
    transcriptionService.on('transcription', async (text) => {
      if (!text) { return; }
      console.log(`Interaction ${interactionCount} – STT -> GPT: ${text}`.yellow);
      gptService.completion(text, interactionCount);
      interactionCount += 1;
    });
    
    gptService.on('gptreply', async (gptReply, icount) => {
      console.log(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`.green );
      ttsService.generate(gptReply, icount);
    });
  
    ttsService.on('speech', (responseIndex, audio, label, icount) => {
      console.log(`Interaction ${icount}: TTS -> TWILIO: ${label}`.blue);
      streamService.buffer(responseIndex, audio);
    });
  
    streamService.on('audiosent', (markLabel) => {
      marks.push(markLabel);
    });
  } catch (err) {
    console.error('Error in WebSocket connection:', err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});