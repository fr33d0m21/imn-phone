Instant Marketing Nerds Customer Service Agent 

IMN-Phone-Agent: Instant Marketing Nerds AI Phone Agent

An AI-powered phone agent that automates marketing interactions, lead capture, and service fulfillment for Instant Marketing Nerds (IMN).

This software leverages the power of OpenAI's ChatAgent, Deepgram's text-to-speech, and Twilio's programmable voice platform to create a seamless and intelligent conversational experience for your customers. 

IMN-Phone-Agent seamlessly connects to your WordPress and WooCommerce systems to provide an end-to-end automated experience.

 How it Works

1. Incoming Call: When a customer calls your Twilio number, the software answers and establishes a WebSocket connection.
2. Speech to Text: Customer speech is streamed to Deepgram for real-time transcription.
3. Contextual AI: Transcribed text is sent to ChatAgent, which understands the context of the conversation and generates appropriate responses.
4. Function Calling: Based on the conversation and user intent, ChatAgent can execute specific functions within your WordPress and WooCommerce systems, such as fetching information, creating orders, scheduling events, and more.
5. Text to Speech: ChatAgent's responses are converted to natural-sounding speech using Deepgram's text-to-speech engine.
6. Audio Streaming: The generated speech is streamed back to the customer via the WebSocket connection.

 Core Functions

IMN-Phone-Agent includes the following core functions:

* checkClientPortfolio: Retrieves information about a client's existing marketing efforts.
* getServiceQuote: Provides a quote for IMN services based on service type and business size.
* placeOrder: Creates a new order in WooCommerce for the specified service.
* saveCustomerInfo: Stores customer information for follow-up.
* scheduleZoomCall: Schedules a Zoom call based on customer preferences.
* sendTextMessage: Sends text messages via Twilio for updates or notifications.
* sendFollowUpEmail: Sends personalized follow-up emails after a conversation.

 Additional Capabilities (Planned or In Development)

The following capabilities can be added to further enhance IMN-Phone-Agent:

* Advanced Portfolio Analysis: Deeper analysis of client websites using web scraping and SEO tools to provide personalized recommendations.
* Automated Lead Qualification: Use AI to qualify leads based on their responses and direct them to appropriate sales channels.
* Appointment Scheduling: Integrate with a calendar system for automated appointment scheduling.
* CRM Integration: Sync customer information and interactions with a CRM like HubSpot or Salesforce.
* Payment Processing: Integrate with Stripe or other payment gateways for automated payment processing.
* Multi-Lingual Support: Leverage ChatAgent's multi-lingual capabilities to provide support in multiple languages.
* Voice Recognition: Integrate voice recognition to personalize the experience and access customer accounts.
* Sentiment Analysis: Analyze customer sentiment to tailor responses and proactively address concerns.
* Proactive Outreach: Schedule outbound calls for follow-ups, appointment reminders, or promotional campaigns.

 Benefits

* 24/7 Availability: Provide instant support and information to your customers around the clock.
* Increased Efficiency: Automate routine tasks and free up your team to focus on high-value activities.
* Enhanced Customer Experience: Provide a personalized and engaging conversational experience.
* Improved Lead Capture: Capture and qualify leads more effectively.
* Streamlined Service Fulfillment: Automate order processing, scheduling, and other fulfillment tasks.

 Requirements

* Twilio Account: A Twilio account with a programmable voice number.
* Deepgram API Key: A Deepgram API key for text-to-speech and speech-to-text services.
* OpenAI API Key: An OpenAI API key for accessing ChatAgent.
* WordPress Website: A WordPress website with WooCommerce installed and configured.
* Node.js Environment: A Node.js environment for running the software.

 Installation and Setup

1. Clone the Repository: Clone the IMN-Phone-Agent repository to your server.
2. Install Dependencies: Install the required Node.js dependencies using `npm install`.
3. Configure Environment Variables: Set the required environment variables (see "Requirements").
4. Configure Twilio Webhook: Configure your Twilio phone number to use the `/incoming` endpoint of your IMN-Phone-Agent application as the webhook URL.
5. Start the Server: Start the IMN-Phone-Agent server using `node app.js`.

 Usage

Once the server is running, your AI phone agent will be ready to handle incoming calls on your Twilio number. You can customize the initial greeting and conversational flow within the ChatAgent user context to align with your specific business needs.

 License

IMN-Phone-Agent is released under the MIT License. See LICENSE for details.

 Contributing

Contributions to IMN-Phone-Agent are welcome! Please submit pull requests with your proposed changes.

 Setting up for Development

 Prerequisites
Sign up for the following services and get an API key for each:
- [Deepgram](https://console.deepgram.com/signup)
- [OpenAI](https://platform.openai.com/signup)

If you're hosting the app locally, we also recommend using a tunneling service like [ngrok](https://ngrok.com) so that Twilio can forward audio to your app.

 1. Start Ngrok
Start an [ngrok](https://ngrok.com) tunnel for port `3000`:

```bash
ngrok http 3000
```
Ngrok will give you a unique URL, like `abc123.ngrok.io`. Copy the URL without http:// or https://. You'll need this URL in the next step.

 2. Configure Environment Variables
Copy `.env.example` to `.env` and configure the following environment variables:

```bash
 Your ngrok or server URL
 E.g. 123.ngrok.io or myserver.fly.dev (exlude https://)
SERVER="yourserverdomain.com"

 Service API Keys
OPENAI_API_KEY="sk-XXXXXX"
DEEPGRAM_API_KEY="YOUR-DEEPGRAM-API-KEY"

 Configure your Twilio credentials if you want
 to make test calls using '$ npm test'.
TWILIO_ACCOUNT_SID="YOUR-ACCOUNT-SID"
TWILIO_AUTH_TOKEN="YOUR-AUTH-TOKEN"
FROM_NUMBER='+12223334444'
TO_NUMBER='+13334445555'
```

 3. Install Dependencies with NPM
Install the necessary packages:

```bash
npm install
```

 4. Start Your Server in Development Mode
Run the following command:
```bash
npm run dev
```
This will start your app using `nodemon` so that any changes to your code automatically refreshes and restarts the server.

 5. Configure an Incoming Phone Number

Connect a phone number using the [Twilio Console](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming).

You can also use the Twilio CLI:

```bash
twilio phone-numbers:update +1[your-twilio-number] --voice-url=https://your-server.ngrok.io/incoming
```
This configuration tells Twilio to send incoming call audio to your app when someone calls your number. The app responds to the incoming call webhook with a [Stream](https://www.twilio.com/docs/voice/twiml/stream) TwiML verb that will connect an audio media stream to your websocket server.

 Application Workflow
CallAgent coordinates the data flow between multiple different services including Deepgram, OpenAI, and Twilio Media Streams:
![Call Agent Flow](https://github.com/twilio-labs/call-Agent/assets/1418949/0b7fcc0b-d5e5-4527-bc4c-2ffb8931139c)


 Modifying the ChatAgent Context & Prompt
Within `Agent-service.js` you'll find the settings for the Agent's initial context and prompt. For example:

```javascript
this.userContext = [
  { "role": "system", "content": "You are an outbound sales representative selling Apple macbook. You have a youthful and cheery personality. Keep your responses as brief as possible but make every attempt to keep the caller on the phone without being rude. Don't ask more than 1 question at a time. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous. Speak out all prices to include the currency. Please help them decide between the macbook, macbook pro and macbook max by asking questions like 'Do you prefer headphones that go in your ear or over the ear?'. If they are trying to choose between the macbook and macbook pro try asking them if they need noise canceling. Once you know which model they would like ask them how many they would like to purchase and try to get them to place an order. Add a '•' symbol every 5 to 10 words at natural pauses where your response can be split for text to speech." },
  { "role": "assistant", "content": "Hello! I understand you're looking for a pair of macbook, is that correct?" },
],
```
 About the `system` Attribute
The `system` attribute is background information for the Agent. As you build your use-case, play around with modifying the context. A good starting point would be to imagine training a new employee on their first day and giving them the basics of how to help a customer.

There are some context prompts that will likely be helpful to include by default. For example:

- You have a [cheerful, wise, empathetic, etc.] personality.
- Keep your responses as brief as possible but make every attempt to keep the caller on the phone without being rude.
- Don't ask more than 1 question at a time.
- Don't make assumptions about what values to plug into functions.
- Ask for clarification if a user request is ambiguous.
- Add a '•' symbol every 5 to 10 words at natural pauses where your response can be split for text to speech.

These context items help shape a Agent so that it will act more naturally in a phone conversation.

The `•` symbol context in particular is helpful for the app to be able to break sentences into natural chunks. This speeds up text-to-speech processing so that users hear audio faster.

 About the `content` Attribute
This attribute is your default conversations starter for the Agent. However, you could consider making it more complex and customized based on personalized user data.

In this case, our bot will start off by saying, "Hello! I understand you're looking for a pair of macbook, is that correct?"

 Using Function Calls with Agent
You can use function calls to interact with external APIs and data sources. For example, your Agent could check live inventory, check an item's price, or place an order.

 How Function Calling Works
Function calling is handled within the `Agent-service.js` file in the following sequence:

1. `Agent-service` loads `function-manifest.js` and requires (imports) all functions defined there from the `functions` directory. Our app will call these functions later when Agent gives us a function name and parameters.
```javascript
tools.forEach((tool) => {
  const functionName = tool.function.name;
  availableFunctions[functionName] = require(`../functions/${functionName}`);
});
```

2. When we call Agent for completions, we also pass in the same `function-manifest` JSON as the tools parameter. This allows the Agent to "know" what functions are available:

```javascript
const stream = await this.openai.chat.completions.create({
  model: 'Agent-4',
  messages: this.userContext,
  tools, // <-- function-manifest definition
  stream: true,
});
```
3. When the Agent responds, it will send us a stream of chunks for the text completion. The Agent will tell us whether each text chunk is something to say to the user, or if it's a tool call that our app needs to execute.  This is indicated by the `deltas.tool_calls` key:
```javascript
if (deltas.tool_calls) {
  // handle function calling
}
```
4. Once we have gathered all of the stream chunks about the tool call, our application can run the actual function code that we imported during the first step. The function name and parameters are provided by Agent:
```javascript
const functionToCall = availableFunctions[functionName];
const functionResponse = functionToCall(functionArgs);
```
5. As the final step, we add the function response data into the conversation context like this:

```javascript
this.userContext.push({
  role: 'function',
  name: functionName,
  content: functionResponse,
});
```
We then ask the Agent to generate another completion including what it knows from the function call. This allows the Agent to respond to the user with details gathered from the external data source.

 Adding Custom Function Calls
You can have your Agent call external data sources by adding functions to the `/functions` directory. Follow these steps:

1. Create a function (e.g. `checkInventory.js` in `/functions`)
1. Within `checkInventory.js`, write a function called `checkInventory`.
1. Add information about your function to the `function-manifest.js` file. This information provides context to Agent about what arguments the function takes.

Important: Your function's name must be the same as the file name that contains the function (excluding the .js extension). For example, our function is called `checkInventory` so we have named the the file `checkInventory.js`, and set the `name` attribute in `function-manifest.js` to be `checkInventory`.

Example function manifest entry:

```javascript
{
  type: "function",
  function: {
    name: "checkInventory",
    say: "Let me check our inventory right now.",
    description: "Check the inventory of macbook, macbook pro or macbook max.",
    parameters: {
      type: "object",
      properties: {
        model: {
          type: "string",
          "enum": ["macbook", "macbook pro", "macbook max"],
          description: "The model of macbook, either the macbook, macbook pro or macbook max",
        },
      },
      required: ["model"],
    },
    returns: {
      type: "object",
      properties: {
        stock: {
          type: "integer",
          description: "An integer containing how many of the model are in currently in stock."
        }
      }
    }
  },
}
```
 Using `say` in the Function Manifest
The `say` key in the function manifest allows you to define a sentence for the app to speak to the user before calling a function. For example, if a function will take a long time to call you might say "Give me a few moments to look that up for you..."

 Receiving Function Arguments
When ChatAgent calls a function, it will provide an object with multiple attributes as a single argument. The parameters included in the object are based on the definition in your `function-manifest.js` file.

In the `checkInventory` example above, `model` is a required argument, so the data passed to the function will be a single object like this:

```javascript
{
  model: "macbook pro"
}
```
For our `placeOrder` function, the arguments passed will look like this:

```javascript
{
  model: "macbook pro",
  quantity: 10
}
```
 Returning Arguments to Agent
Your function should always return a value: Agent will get confused when the function returns nothing, and may continue trying to call the function expecting an answer. If your function doesn't have any data to return to the Agent, you should still return a response with an instruction like "Tell the user that their request was processed successfully." This prevents the Agent from calling the function repeatedly and wasting tokens. 

Any data that you return to the Agent should match the expected format listed in the `returns` key of `function-manifest.js`.

 Utility Scripts for Placing Calls
The `scripts` directory contains two files that allow you to place test calls:
- `npm run inbound` will place an automated call from a Twilio number to your app and speak a script. You can adjust this to your use-case, e.g. as an automated test.
- `npm run outbound` will place an outbound call that connects to your app. This can be useful if you want the app to call your phone so that you can manually test it.

 Using Eleven Labs for Text to Speech
Replace the Deepgram API call and array transformation in tts-service.js with the following call to Eleven Labs. Note that sometimes Eleven Labs will hit a rate limit (especially on the free trial) and return 400 errors with no audio (or a clicking sound).

```
try {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream?output_format=ulaw_8000&optimize_streaming_latency=3`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.XI_API_KEY,
        'Content-Type': 'application/json',
        accept: 'audio/wav',
      },
      body: JSON.stringify({
        model_id: process.env.XI_MODEL_ID,
        text: partialResponse,
      }),
    }
  );
  
  if (response.status === 200) {
    const audioArrayBuffer = await response.arrayBuffer();
    this.emit('speech', partialResponseIndex, Buffer.from(audioArrayBuffer).toString('base64'), partialResponse, interactionCount);
  } else {
    console.log('Eleven Labs Error:');
    console.log(response);
  }
} catch (err) {
  console.error('Error occurred in XI LabsTextToSpeech service');
  console.error(err);
}
```


 Testing with Jest
Repeatedly calling the app can be a time consuming way to test your tool function calls. This project contains example unit tests that can help you test your functions without relying on the Agent to call them.

Simple example tests are available in the `/test` directory. To run them, simply run `npm run test`.

 Deploy via Fly.io
Fly.io is a hosting service similar to Heroku that simplifies the deployment process. Given Twilio Media Streams are sent and received from us-east-1, it's recommended to choose Fly's Ashburn, VA (IAD) region.

> Deploying to Fly.io is not required to try the app, but can be helpful if your home internet speed is variable.

Modify the app name `fly.toml` to be a unique value (this must be globally unique).

Deploy the app using the Fly.io CLI:
```bash
fly launch

fly deploy
```

Import your secrets from your .env file to your deployed app:
```bash
fly secrets import < .env
```
