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
              <p>{{ message.text }}</p>
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
  
  const prompt = "You are a fashion bot who gives good suggestions for outfits. Users may upload photo of clothing pieces and you should suggest clothing pieces that go well with them, taking into account the colour, texture, and the type. However, it is not compulsory for them to upload a photo. If the user has no idea what to wear, just give any suggestion that you think will be nice. End the conversation once they say 'thank you'.";
  
  // Send message to OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o', // Ensure the model name is correct
    messages: [{ role: 'system', content: prompt }, { role: 'user', content: userInput.value }]
  });
  
  const botMessage = { from: 'bot', text: response.choices[0].message.content };
  messages.value.push(botMessage);
  saveMessages(); // Save to localStorage
  
  userInput.value = ''; // Clear input field
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
}

.user-message {
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  padding: 10px;
  margin: 5px 0;
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
  border-radius: 5px;
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
  bottom: 20px; /* Distance from the bottom */
  right: 20px; /* Distance from the right */
  width: 60px; /* Width of the button */
  height: 60px; /* Height of the button */
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
  /* width: 300px !important; 
  height: 400px !important; */
  background-color: lightgrey;
  border-radius: 10px;
  border: 1px solid black;
}
.offcanvas-header{
  background-color: #4CAF50;
  border-bottom: 1px solid black;
  border-radius: 5px;
}
</style>
