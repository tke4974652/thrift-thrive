<template>
  <div class="row">
    <div class="greetings col-lg-6 col-md-6 col-12">
      <h1 class="green">ThriftThrive</h1>
      <h3>A new way to shop sustainably</h3>
      <nav>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
    </div>
    
    <div class="col-lg-5 col-md-5 col-11">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isClicked = ref(false)

function moveGreeting() {
  isClicked.value = true;
}

</script>

<style scoped>
.greetings {
  text-align: center; /* Center text */
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
}

h3 {
  font-size: 1.2rem;
  color: lightgray;
}

nav {
  margin-top: 2rem;
  font-size: 1rem; /* Uniform font size */
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border-left: none; /* Remove left border for the first link */
}
nav a.router-link-active {
  color: var(--color-text) !important; /* Using !important as a last resort */
}

nav a.router-link-active:hover {
  background-color: transparent !important; /* Ensure hover state is also applied */
}
.row {
  display: flex; 
  align-items: center; 
  justify-content: center; 
  height: 100vh; /* Full viewport height */
  margin: 0; /* Remove default margin */
}

@media (max-width: 768px) {
  .greetings {
    flex: 1; /* Allow the greetings to take up space on smaller screens */
  }
}
</style>
