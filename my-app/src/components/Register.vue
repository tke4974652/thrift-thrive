<template>
    <h1 class="header">Register</h1>
    <p class="description">Create a new account!</p>
    <form class="row flex-center flex" @submit.prevent="handleRegister">
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
        <div v-if="statusMessage" class="error">{{ statusMessage }}</div>
        <div>
          <input
            type="submit"
            class="buttonBlock"
            :value="loading ? 'Loading' : 'Register'"
            :disabled="loading"
          />
        </div>
      </div>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../lib/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const loading = ref(false)
const email = ref('')
const password = ref('')
const statusMessage = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    console.log(userCredential.user)
    errorMessage.value = "Registration is successful!"
    email.value = ''
    password.value = ''
  } catch (error) {
    errorMessage.value = error.message;
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
  float: ;
  width: 80px;
  height: 30px;
}

.error {
  color: red; /* Style for error message */
  margin-top: 10px;
}
h1, p {
  color: white;
}

</style>