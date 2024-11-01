<template>
    <div class="container-fluid vh-100 bg-black">
      <div class="row h-100">
        <!-- Left Column - Inbox -->
        <div class="col-md-4 col-lg-3 border-end border-secondary p-0">
          <div class="d-flex align-items-center p-3 border-bottom border-secondary">
            <h5 class="mb-0 text-white">Inbox</h5>
            <span class="text-secondary ms-2">({{ unreadCount }} unread)</span>
          </div>
          
          <div class="chat-list overflow-auto" style="height: calc(100vh - 60px);">
            <div v-for="chat in chats" :key="chat.id" 
                 @click="selectChat(chat)"
                 :class="['chat-item p-3 border-bottom border-secondary', 
                         selectedChatId === chat.id ? 'selected' : '']">
              <div class="d-flex">
                <img :src="chat.sellerAvatar" :alt="chat.sellerName" 
                     class="rounded-circle" style="width: 48px; height: 48px;">
                <div class="ms-3 flex-grow-1">
                  <div class="d-flex justify-content-between">
                    <h6 class="mb-1 text-white">{{ chat.sellerName }}</h6>
                    <small class="text-secondary">{{ formatDate(chat.lastMessageTime) }}</small>
                  </div>
                  <p class="mb-1 text-truncate text-white-50">{{ chat.lastMessage }}</p>
                  <div class="d-flex align-items-center">
                    <img :src="chat.itemImage" :alt="chat.itemName" 
                         class="rounded" style="width: 40px; height: 40px; object-fit: cover;">
                    <span class="ms-2 text-secondary small">{{ chat.itemName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Right Column - Chat -->
        <div class="col-md-8 col-lg-9 p-0 d-flex flex-column">
          <!-- Chat Header -->
          <div class="p-3 border-bottom border-secondary">
            <div class="d-flex align-items-center">
              <img :src="selectedChat?.sellerAvatar" alt="" 
                   class="rounded-circle" style="width: 40px; height: 40px;">
              <div class="ms-3">
                <h6 class="mb-0 text-white">{{ selectedChat?.sellerName || 'Select a chat' }}</h6>
                <small class="text-secondary">{{ selectedChat?.itemName }}</small>
              </div>
            </div>
          </div>
  
          <!-- Chat Messages -->
          <div class="flex-grow-1 overflow-auto p-3" ref="messageContainer">
            <div v-if="messages.length === 0" class="text-center text-secondary my-5">
              No messages yet. Start the conversation!
            </div>
            <div v-for="message in messages" :key="message.id" 
                 :class="['message mb-3 d-flex', 
                         message.senderId === userId ? 'justify-content-end' : 'justify-content-start']">
              <div :class="['message-content p-3 rounded', 
                           message.senderId === userId ? 'bg-primary' : 'bg-secondary']"
                   style="max-width: 70%;">
                <p class="mb-1 text-white">{{ message.content }}</p>
                <small class="text-white-50">{{ formatDate(message.timestamp) }}</small>
              </div>
            </div>
          </div>
  
          <!-- Message Input -->
          <div class="p-3 border-top border-secondary">
            <div class="input-group">
              <input type="text" class="form-control bg-dark text-white border-secondary" 
                     v-model="newMessage" 
                     @keyup.enter="sendMessage"
                     placeholder="Type a message...">
              <button class="btn btn-primary" @click="sendMessage" 
                      :disabled="!newMessage.trim()">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { db } from '@/lib/firebaseConfig';
  import { 
    collection, query, where, orderBy, onSnapshot,
    addDoc, serverTimestamp, doc, getDoc 
  } from 'firebase/firestore';
  
  const route = useRoute();
  const sellerId = route.params.sellerId as string;
  const itemId = route.params.itemId as string;
  const userId = 'current-user-id'; // Replace with actual user ID from your auth system
  
  const chats = ref<any[]>([]);
  const messages = ref<any[]>([]);
  const selectedChatId = ref<string | null>(null);
  const selectedChat = ref<any>(null);
  const newMessage = ref('');
  const unreadCount = ref(0);
  const messageContainer = ref<HTMLElement | null>(null);
  
  // Initialize chat when component mounts
  onMounted(async () => {
    // Set up real-time listeners for chats
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
  
    onSnapshot(chatsQuery, (snapshot) => {
      chats.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      unreadCount.value = chats.value.filter(chat => 
        chat.unreadCount && chat.lastMessageSenderId !== userId
      ).length;
    });
  
    // If we have sellerId and itemId, create or open that chat
    if (sellerId && itemId) {
      const chatId = await getOrCreateChat(sellerId, itemId);
      selectChat({ id: chatId });
    }
  });
  
  // Create or get existing chat
  async function getOrCreateChat(sellerId: string, itemId: string) {
    const chatQuery = query(
      collection(db, 'chats'),
      where('participants', '==', [userId, sellerId].sort()),
      where('itemId', '==', itemId)
    );
    
    const existingChat = await getDoc(chatQuery);
    
    if (!existingChat.empty) {
      return existingChat.docs[0].id;
    }
  
    // Get item details
    const itemDoc = await getDoc(doc(db, 'items', itemId));
    const itemData = itemDoc.data();
  
    // Create new chat
    const newChatRef = await addDoc(collection(db, 'chats'), {
      participants: [userId, sellerId].sort(),
      itemId,
      itemName: itemData?.name,
      itemImage: itemData?.images[0],
      created: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      lastMessage: '',
    });
  
    return newChatRef.id;
  }
  
  // Select a chat and load its messages
  async function selectChat(chat: any) {
    selectedChatId.value = chat.id;
    selectedChat.value = chat;
  
    // Set up real-time listener for messages
    const messagesQuery = query(
      collection(db, `chats/${chat.id}/messages`),
      orderBy('timestamp', 'asc')
    );
  
    onSnapshot(messagesQuery, (snapshot) => {
      messages.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      scrollToBottom();
    });
  }
  
  // Send a message
  async function sendMessage() {
    if (!newMessage.value.trim() || !selectedChatId.value) return;
  
    const messageData = {
      content: newMessage.value,
      senderId: userId,
      timestamp: serverTimestamp()
    };
  
    // Add message to messages subcollection
    await addDoc(collection(db, `chats/${selectedChatId.value}/messages`), messageData);
  
    // Update chat document
    await updateDoc(doc(db, 'chats', selectedChatId.value), {
      lastMessage: newMessage.value,
      lastMessageTime: serverTimestamp(),
      lastMessageSenderId: userId,
    });
  
    newMessage.value = '';
    scrollToBottom();
  }
  
  // Utility functions
  function formatDate(timestamp: any) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-SG', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric',
    }).format(date);
  }
  
  function scrollToBottom() {
    if (messageContainer.value) {
      setTimeout(() => {
        messageContainer.value!.scrollTop = messageContainer.value!.scrollHeight;
      }, 100);
    }
  }
  </script>
  
  <style scoped>
  .chat-list {
    background-color: #121212;
  }
  
  .chat-item {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .chat-item:hover {
    background-color: #1a1a1a;
  }
  
  .chat-item.selected {
    background-color: #1a1a1a;
  }
  
  .message-content {
    word-break: break-word;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #121212;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
  }
  
  /* Responsive styles */
  @media (max-width: 768px) {
    .col-md-4 {
      height: 40vh;
      border-bottom: 1px solid #333;
    }
    
    .col-md-8 {
      height: 60vh;
    }
  }
  </style>