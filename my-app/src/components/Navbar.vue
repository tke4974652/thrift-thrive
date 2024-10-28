<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand fw-bold fs-2" to="/">ThriftThrive</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav me-auto">
            <router-link class="nav-link" to="/marketplace">
              <i class="bi bi-shop"></i> Marketplace
            </router-link>
            <router-link class="nav-link" to="/thrift-stores">
              <i class="bi bi-bag"></i> Thrift Stores
            </router-link>
            <router-link class="nav-link" to="/editorial">
              <i class="bi bi-pencil"></i> Editorial
            </router-link>
          </div>
          <div class="navbar-nav">
            <router-link class="nav-link" to="/cart">
              <i class="bi bi-cart"></i> Cart
            </router-link>
            <router-link class="nav-link" to="/chat">
              <i class="bi bi-chat"></i> Chat
            </router-link>
            <a class="nav-link" href="#" @click.prevent="handleLogout">
              <i class="bi bi-box-arrow-right"></i> Log out
            </a>
            <router-link class="nav-link" to="/profile">
              <i class="bi bi-person-gear mx-2 custom-icon"></i>
            </router-link>
            <router-link class="nav-link" to="/sell">
              <button class="btn btn-success">Sell</button> 
            </router-link>
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
.custom-icon {
  font-size: 1.5rem; /* Adjust the size as needed */
  line-height: 1; /* Prevents shifting of other icons */
  vertical-align: middle; /* Aligns it with other icons */
}
.navbar-nav {
  display: flex;
  align-items: center; /* Vertically center items */
  height: 100%; /* Ensure the nav takes the full height */
}
</style>
  