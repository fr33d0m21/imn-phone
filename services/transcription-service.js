require('colors');
const OpenAI = require('openai').default;
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

class TranscriptionService extends EventEmitter {
  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.audioBuffer = Buffer.alloc(0);
    this.mainSpeaker = null;
  }

  async whisperTranscribe(audioBuffer) {
    const tempFilePath = path.join(os.tmpdir(), `audio_${Date.now()}.wav`);
    await fs.writeFile(tempFilePath, audioBuffer);
    
    try {
      const response = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-1",
        response_format: 'verbose_json'
      });
      
      return response;
    } catch (error) {
      console.error('Error in whisper transcription:', error);
      return null;
    } finally {
      await fs.unlink(tempFilePath).catch(console.error);
    }
  }

  async processAudio() {
    if (this.audioBuffer.length < 16000) {  // Minimum 1 second of audio at 16kHz
      return;
    }

    try {
      const transcription = await this.whisperTranscribe(this.audioBuffer);
      if (!transcription) return;

      if (!this.mainSpeaker) {
        this.mainSpeaker = this.identifyMainSpeaker(transcription.segments);
      }

      const processedText = this.processTranscription(transcription, this.mainSpeaker);
      if (processedText) {
        this.emit('transcription', processedText);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      this.emit('error', 'Error processing audio');
    } finally {
      this.audioBuffer = Buffer.alloc(0);  // Clear the buffer after processing
    }
  }

  identifyMainSpeaker(segments) {
    const speakerDurations = segments.reduce((acc, segment) => {
      acc[segment.speaker] = (acc[segment.speaker] || 0) + segment.end - segment.start;
      return acc;
    }, {});
    return Object.keys(speakerDurations).reduce((a, b) => speakerDurations[a] > speakerDurations[b] ? a : b);
  }

  processTranscription(transcription, mainSpeaker) {
    return transcription.segments
      .filter(segment => segment.speaker === mainSpeaker)
      .map(segment => segment.text)
      .join(' ');
  }

  send(payload) {
    const newAudio = Buffer.from(payload, 'base64');
    this.audioBuffer = Buffer.concat([this.audioBuffer, newAudio]);
    this.processAudio();
  }
}

module.exports = { TranscriptionService };