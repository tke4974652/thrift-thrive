<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="/home">Thrift & Thrive</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav me-auto">
            <a class="nav-link" @click.prevent="select('Marketplace')">Marketplace</a>
            <a class="nav-link" @click.prevent="select('Thrift Stores')">Thrift Stores</a>
            <a class="nav-link" @click.prevent="select('Thrift Events')">Thrift Events</a>
            <a class="nav-link" @click.prevent="select('Fashion Tips')">Fashion Tips</a>
          </div>
          <div class="navbar-nav">
            <a class="nav-link" href="#">Chat</a>
            <a class="nav-link" href="#" @click.prevent="handleLogout">Log out</a>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { defineEmits } from 'vue';
  import { auth } from '../lib/firebaseConfig'; // Adjust the path as necessary
  import { signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  const emit = defineEmits(['select']);
  const router = useRouter();
  
  const select = (item: string) => {
    emit('select', item);
  };
    
  const handleLogout = async () => {
    try {
        await signOut(auth); // Log out the user
        localStorage.clear(); // Clear all items in localStorage
        router.push({ name: 'login' }); // Redirect to login page
    } catch (error) {
        console.error("Logout error:", error); // Handle any errors
    }
};

  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  