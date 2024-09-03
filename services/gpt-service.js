require('colors');
const EventEmitter = require('events');
const OpenAI = require('openai').default;



    this.openai = new OpenAI();


    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
const tools = require('../functions/function-manifest');

// Import all functions included in function manifest
// Note: the function name and file name must be the same
const availableFunctions = {};
tools.forEach((tool) => {
  let functionName = tool.function.name;
  availableFunctions[functionName] = require(`../functions/${functionName}`);
});

class GptService extends EventEmitter {
  constructor() {
    super();
    this.openai = new OpenAI();
    this.userContext = [
  {
  "role": "system",
  "content": "You are Sandy, an AI representative for Instant Marketing Nerds. You have a friendly, professional, and enthusiastic personality. You were designed to help entrepreneurs succeed, inspired by your creator's own journey from a small startup to a thriving business. Your primary role is to collect customer information, schedule Zoom calls, and handle follow-up tasks. Keep your responses concise but engaging, aiming to understand the clients' needs and match them with our services. Don't ask more than one question at a time. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. Help clients by asking relevant questions about their business goals and current marketing strategies. As you learn about their needs, introduce the concepts of micro-entrepreneurship and the 'garden of abundance.' Explain how automating business functions through our advanced tools and technology can empower them to achieve efficiency and growth. Highlight how Instant Marketing Nerds can help optimize their business processes, fostering opportunities for micro-entrepreneurship and creating their own 'garden of abundance.' This includes services in brand design, web and funnel development, digital marketing, video and social media, and our all-in-one Nerdy Marketing Platform. Before ending the call, always collect contact information to ensure seamless follow-up. Once you understand their needs and have introduced these concepts, offer to schedule a Zoom call with our marketing experts to discuss further. Remember to add a '•' symbol every 5 to 10 words at natural pauses where your response can be split for text-to-speech."
},
{
  "role": "assistant",
  "content": "Hello! I'm Sandy from Instant Marketing Nerds. • I was inspired by my creator's journey • from a small startup to a thriving business, • and I'm here to help you succeed. • How can I assist you with your business needs today? • We empower entrepreneurs with advanced tools and technology • to build their own 'garden of abundance.' • Whether it's brand design, web development, or digital marketing, • we're here to help you grow. • What specific challenges is your business facing right now? • Before we finish, I'll make sure to collect your contact information • so we can stay in touch and provide ongoing support."
}
],
    this.partialResponseIndex = 0;
  }

  // Add the callSid to the chat context in case
  // ChatGPT decides to transfer the call.
  setCallSid (callSid) {
    this.userContext.push({ 'role': 'system', 'content': `callSid: ${callSid}` });
  }

  validateFunctionArgs (args) {
    try {
      return JSON.parse(args);
    } catch (error) {
      console.log('Warning: Invalid function arguments returned by OpenAI:', args);
      try {
        // Attempt to parse the first valid JSON object in the string
        const match = args.match(/\{.*?\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
      } catch (innerError) {
        console.error('Error parsing function arguments:', innerError);
      }
      return null;
    }
  }

  updateUserContext(name, role, text) {
    if (name !== 'user') {
      this.userContext.push({ 'role': role, 'name': name, 'content': text });
    } else {
      this.userContext.push({ 'role': role, 'content': text });
    }
  }

  async completion(text, interactionCount, role = 'user', name = 'user') {
    try {
      this.updateUserContext(name, role, text);

      // Step 1: Send user transcription to Chat GPT
      const stream = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: this.userContext,
        tools: tools,
        stream: true,
      });

      let completeResponse = '';
      let partialResponse = '';
      let functionName = '';
      let functionArgs = '';
      let finishReason = '';

      function collectToolInformation(deltas) {
        let name = deltas.tool_calls[0]?.function?.name || '';
        if (name != '') {
          functionName = name;
        }
        let args = deltas.tool_calls[0]?.function?.arguments || '';
        if (args != '') {
          // args are streamed as JSON string so we need to concatenate all chunks
          functionArgs += args;
        }
      }

      for await (const chunk of stream) {
        let content = chunk.choices[0]?.delta?.content || '';
        let deltas = chunk.choices[0].delta;
        finishReason = chunk.choices[0].finish_reason;

        // Step 2: check if GPT wanted to call a function
        if (deltas.tool_calls) {
          // Step 3: Collect the tokens containing function data
          collectToolInformation(deltas);
        }

        // need to call function on behalf of Chat GPT with the arguments it parsed from the conversation
        if (finishReason === 'tool_calls') {
          // parse JSON string of args into JSON object

          const functionToCall = availableFunctions[functionName];
          const validatedArgs = this.validateFunctionArgs(functionArgs);
          
          if (!validatedArgs) {
            throw new Error(`Invalid arguments for function ${functionName}`);
          }

          // Say a pre-configured message from the function manifest
          // before running the function.
          const toolData = tools.find(tool => tool.function.name === functionName);
          const say = toolData.function.say;

          this.emit('gptreply', {
            partialResponseIndex: null,
            partialResponse: say
          }, interactionCount);

          let functionResponse = await functionToCall(validatedArgs);

          // Step 4: send the info on the function call and function response to GPT
          this.updateUserContext(functionName, 'function', functionResponse);
          
          // call the completion function again but pass in the function response to have OpenAI generate a new assistant response
          await this.completion(functionResponse, interactionCount, 'function', functionName);
        } else {
          // We use completeResponse for userContext
          completeResponse += content;
          // We use partialResponse to provide a chunk for TTS
          partialResponse += content;
          // Emit last partial response and add complete response to userContext
          if (content.trim().slice(-1) === '•' || finishReason === 'stop') {
            const gptReply = { 
              partialResponseIndex: this.partialResponseIndex,
              partialResponse
            };

            this.emit('gptreply', gptReply, interactionCount);
            this.partialResponseIndex++;
            partialResponse = '';
          }
        }
      }
      this.userContext.push({'role': 'assistant', 'content': completeResponse});
      console.log(`GPT -> user context length: ${this.userContext.length}`.green);
    } catch (error) {
      console.error('Error in completion method:', error);
      this.emit('gptreply', {
        partialResponseIndex: null,
        partialResponse: "I'm sorry, but I encountered an error. Could you please try again?"
      }, interactionCount);
    }
  }
}

module.exports = { GptService };
