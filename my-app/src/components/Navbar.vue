<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Thrift & Thrive</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav me-auto">
            <a class="nav-link" href="#">Marketplace</a>
            <a class="nav-link" href="#">Thrift Stores</a>
            <a class="nav-link" href="#">Thrift Events</a>
            <a class="nav-link" href="#">Fashion Tips</a>
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
  import { auth } from '../lib/firebaseConfig' // Adjust the path as necessary
  import { signOut } from 'firebase/auth'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await signOut(auth) // Log out the user
      // Redirect to login page or any other page after logging out
      router.push({ name: 'login' }) // Adjust the name based on your router configuration
    } catch (error) {
      console.error("Logout error:", error) // Handle any errors that occur during logout
    }
  }
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  