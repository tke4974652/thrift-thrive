<template>
  <div>
    <button class="btn btn-primary floating-bot" type="button" data-bs-toggle="offcanvas" data-bs-target="#fashionBotOffcanvas" aria-controls="fashionBotOffcanvas">
      🤖
    </button>

    <div class="offcanvas offcanvas-start" data-bs-backdrop="false" tabindex="-1" id="fashionBotOffcanvas" aria-labelledby="fashionBotOffcanvasLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="fashionBotOffcanvasLabel">FashionBot</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div class="fashion-bot">
          <div class="messages" v-for="(message, index) in messages" :key="index">
            <div :class="{'bot-message': message.from === 'bot', 'user-message': message.from === 'user'}">
              <p style="color:black;">{{ message.text }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="input-group">
          <input v-model="userInput" @keydown.enter="sendMessage" placeholder="Type your message..." />
          <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { openai } from '../lib/openAi'; // Ensure you have the OpenAI package

const userInput = ref('');
const messages = ref<any[]>([]); // Adjust the type as needed

// Load messages from localStorage
const loadMessages = () => {
  const storedMessages = localStorage.getItem('messages');
  if (storedMessages) {
    messages.value = JSON.parse(storedMessages);
  }
};

// Save messages to localStorage
const saveMessages = () => {
  localStorage.setItem('messages', JSON.stringify(messages.value));
};

// Send message function
const sendMessage = async () => {
  if (userInput.value.trim() === '') return;

  const userMessage = { from: 'user', text: userInput.value };
  messages.value.push(userMessage);
  saveMessages(); // Save to localStorage
  userInput.value = "";

  // Create prompt by combining previous messages
  const promptMessages = messages.value.map(message => ({
    role: message.from === 'user' ? 'user' : 'assistant',
    content: message.text
  }));

  // Send message to OpenAI with improved instructions
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: "You are a fashion bot. Respond directly to the user's input without asking them to repeat themselves. If the user provides details about their clothing choice, use that information to give tailored suggestions."
      },
      ...promptMessages
    ]
  });

  const botMessage = { from: 'bot', text: response.choices[0].message.content };
  messages.value.push(botMessage);
  saveMessages(); // Save to localStorage
};

onMounted(loadMessages);
</script>

<style scoped>
.fashion-bot {
  max-height: 300px; /* Limit height to fit in the offcanvas */
  padding: 10px;
}

.messages {
  max-height: 200px; /* Limit height for messages */
  overflow-y: auto;
  margin-bottom: 10px;
}

.bot-message {
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0;
  max-width: 80%;
  border: 1px solid #ccc;
}

.user-message {
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0px;
  margin-left: auto;
  max-width: 80%;
  border: 1px solid #ccc;
}

.input-group {
  display: flex;
  align-items: center;
  padding: 10px; /* Add padding around input group */
  background-color: lightgrey; /* Ensure the input group stands out */
  border-top: 1px solid black; /* Optional: border on top for separation */
  border-radius: 5px;
}

input {
  flex-grow: 1; /* Allow input to grow */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  margin-left: 15px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Floating bot styles */
.floating-bot {
  position: fixed; /* Fixed position to float over the content */
  bottom: 5%; /* Distance from the bottom as a percentage of the viewport height */
  right: 5%; /* Distance from the right as a percentage of the viewport width */
  width: 30%; /* Width relative to viewport width */
  max-width: 60px; /* Maximum width to ensure it doesn't get too large */
  height: auto; /* Auto height to maintain aspect ratio */
  aspect-ratio: 1; /* Ensure it stays circular */
  background-color: #4CAF50; /* Change as needed */
  color: white;
  border-radius: 50%; /* Makes it circular */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow for depth */
  transition: background-color 0.3s; /* Smooth transition */
}

.floating-bot:hover {
  background-color: #45a049; /* Darker green on hover */
}

.offcanvas {
  background-color: white;
  border-radius: 10px;
  border: 1px solid black;
}

.offcanvas-header {
  background-color: #4CAF50;
  border-bottom: 1px solid black;
  border-radius: 5px;
}

.offcanvas-body{
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: white;
}
</style>

