<template>
    <div class="landing-page">
        <div v-if="isLoggedIn" class="col-12 home">
        <Homepage />
        </div>
        <div v-else-if="!isLoggedIn" class="intro">
        <HelloWorld />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
    import HelloWorld from '../components/HelloWorld.vue'
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
  .landing-page {
    /* display: flex; */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw; /* Full viewport width */
    height: 100vh; /* Full viewport height */
    margin: 0; /* Remove default margin */
    padding: 0; /* Remove default padding */
    background-color: #000000; /* Optional background color */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
  /* .intro{
    display: flex; 
    align-items: center; 
    justify-content: center; 
    height: 100vh;
  } */
  </style>
  
  