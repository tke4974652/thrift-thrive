<template>
  <div class="homepage">
    <div class="constant">
      <Navbar @select="handleSelect" />

      <section class="hero">
        <SearchBar @search="handleSearch" />
        <!-- <p>Searching for: {{ searchTerm }}</p> -->
      </section>

    </div>

    <div class="home" v-if="!showMarketplace">
      <section class="content">
        <SuggestionPanel />
      </section>
      <section class="content">
        <DisplayItem />
      </section>
    </div>

    <div class="marketplace" v-if="showMarketplace">
      <section class="content">
        <MarketPlace />
      </section>
    </div>

    <!-- Floating FashionBot Button -->
    <div class="floating-bot" @click="toggleFashionBot">
      <FashionBot /> <!-- You can use an emoji or an icon here -->
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Navbar from "../components/Navbar.vue";
import SearchBar from '../components/SearchBar.vue';
import DisplayItem from '../components/DisplayItem.vue';
import SuggestionPanel from '../components/SuggestionPanel.vue';
import MarketPlace from '../components/Marketplace.vue';
import FashionBot from '../components/FashionBot.vue';

const searchTerm = ref('');
const showMarketplace = ref(false);
const isFashionBotVisible = ref(false); // State for FashionBot visibility

function handleSearch(query: string) {
  searchTerm.value = query;
}

// Function to handle navbar selection
function handleSelect(selected: string) {
  showMarketplace.value = selected === 'Marketplace';
}

// Function to toggle FashionBot visibility
function toggleFashionBot() {
  isFashionBotVisible.value = !isFashionBotVisible.value;
}
</script>

<style scoped>
.homepage {
  background-color: black;
  position: relative; /* Set to relative for absolute positioning of floating bot */
}
.hero {
  text-align: center;
  padding: 20px 20px 10px 20px; /* Increased padding to account for fixed navbar */
  background-color: black;
  color: white; /* Updated for visibility */
}

.home, .marketplace{
  padding: 180px 50px 50px 50px; /* Add padding to avoid overlap with fixed navbar */
}
.content {
  padding: 20px;
  text-align: center;
  color: white;
}
.constant {
  position: fixed;
  top: 0; /* Fixes it to the top */
  left: 0;
  right: 0; /* Stretches across the viewport */
  z-index: 1000; /* Ensure it's above other content */
  background-color: black; /* Match the background for aesthetics */
}
</style>