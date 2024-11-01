<template>
  <div>    
    <div v-if="!isLoggedIn">
      <h1 class="header">Login</h1>
      <p class="description">Sign in with your email and password</p>
      <form class="row flex-center flex" @submit.prevent="handleLogin">
        <div class="form-widget">
          <div>
            <input
              class="inputField"
              required
              type="email"
              placeholder="Your email"
              v-model="email"
            />
          </div>
          <div>
            <input
              class="inputField"
              required
              type="password"
              placeholder="Your password"
              v-model="password"
            />
          </div>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
          <div>
            <button
              v-if="!loading && !isLoggedIn"
              type="submit"
              class="buttonBlock"
            >
            Sign in!
            </button>
            <router-link
              v-else-if="isLoggedIn"
              class="buttonBlock"
              :to="{ name: 'home' }"
            >
              Go to Home
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '../lib/firebaseConfig'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const loading = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoggedIn = ref(false) // Track login state
const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user // Set to true if user is logged in
  });
});

const handleLogin = async () => {
  try {
    loading.value = true
    errorMessage.value = '' // Clear previous error messages
    await signInWithEmailAndPassword(auth, email.value, password.value)
    isLoggedIn.value = true // Set login state to true
    router.push({ name: 'home' }); // Redirect to home page after login
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message // Display error message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style>
.inputField {
  width: 100%;         
  padding: 12px;      
  font-size: 16px;    
  border: 1px solid #ccc; 
  border-radius: 4px; 
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 5px 0;
}

.buttonBlock {
  float: inline-end;
  width: 80px;
  height: 30px;
}

.error {
  color: red; /* Style for error message */
  margin-top: 10px;
}
.header, .description {
  color: white;
}


</style>
