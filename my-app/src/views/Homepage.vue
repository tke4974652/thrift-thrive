<template>
    <div class="homepage">
      <Navbar />
  
      <section class="hero">
        <SearchBar @search="handleSearch" />
        <p>Searching for: {{ searchTerm }}</p>
      </section>
  
      <section class="content">
        <h2>Our Services</h2>
        <div class="service">
          <h3>Service 1</h3>
          <p>Description of service 1.</p>
        </div>
        <div class="service">
          <h3>Service 2</h3>
          <p>Description of service 2.</p>
        </div>
        <div class="service">
          <h3>Service 3</h3>
          <p>Description of service 3.</p>
        </div>
      </section>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from "vue";
  import Navbar from "../components/Navbar.vue"
  import SearchBar from '../components/SearchBar.vue';

  const searchTerm = ref('');

  function handleSearch(query) {
    searchTerm.value = query;
  }

  </script>
  
  <style scoped>  
  .hero {
    text-align: center;
    padding: 50px 20px;
    background-color: black;
    color: black !important;
  }
  
  .content {
    padding: 20px;
    text-align: center;
  }
  
  .service {
    margin: 20px 0;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }
  </style>
  