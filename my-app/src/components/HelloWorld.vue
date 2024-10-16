<template>
  <div class="row">
    <div class="greetings col-lg-6 col-md-6 col-12">
      <h1 class="green">Thrift & Thrive</h1>
      <h3>A new way to shop sustainably</h3>
      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
    </div>
    
    <div class="col-lg-5 col-md-5 col-11">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { auth } from '../lib/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import Homepage from '@/views/Homepage.vue';

const isLoggedIn = ref(false)

// Check authentication status on component mount
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user // Set to true if user is logged in
  });
});
</script>

<style scoped>
.greetings {
  text-align: center; /* Center text for smaller screens */
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
  text-align: center;
}

nav {
  margin-top: 2rem;
  font-size: 1rem; /* Uniform font size */
  text-align: center; /* Center text for smaller screens */
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border-left: none; /* Remove left border for the first link */
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}
.row{
  display: flex; 
  align-items: center; 
  justify-content: center; 
  height: 100vh;
  margin: 0px;
}
</style>
