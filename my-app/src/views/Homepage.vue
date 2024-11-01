<template>
  <div class="homepage">
    <div class="constant" @mouseenter="showSearchBar" @mouseleave="hideSearchBar">
      <Navbar @select="handleSelect" />

      <section class="hero">
        <div ref="searchBarContainer" class="search-bar-container">
          <SearchBar @search="handleSearch" />
        </div>
        <!-- <p>Searching for: {{ searchTerm }}</p> -->
      </section>

    </div>
    <div :class="['view', isHome ? 'home-view' : 'default-view']">
      <RouterView />
    </div>

    <div class="floating-bot" @click="toggleFashionBot">
      <FashionBot /> <!-- You can use an emoji or an icon here -->
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from 'vue-router';
import gsap from "gsap";
import Navbar from "../components/Navbar.vue";
import SearchBar from '../components/SearchBar.vue';
import FashionBot from '../components/FashionBot.vue';

const searchTerm = ref('');
const showProfile = ref(false);
const isFashionBotVisible = ref(false); // State for FashionBot visibility
const searchBarContainer = ref<HTMLElement | null>(null);

// Get the current route
const route = useRoute();

// Check if the current route is '/home'
const isHome = computed(() => route.path === '/home');

function handleSearch(query: string) {
  searchTerm.value = query;
}

// Function to handle navbar selection
function handleSelect(selected: string) {
  showProfile.value = !showProfile.value;
}

// Function to toggle FashionBot visibility
function toggleFashionBot() {
  isFashionBotVisible.value = !isFashionBotVisible.value;
}

// Function to show the search bar
function showSearchBar() {
  gsap.to(searchBarContainer.value, {
    duration: 0.5,
    y: 0,
    ease: "power1.out",
  });
}

// Function to hide the search bar
function hideSearchBar() {
  gsap.to(searchBarContainer.value, {
    duration: 0.5,
    y: "-100%",
    ease: "power1.in",
  });
}

onMounted(() => {
  const tl_header = gsap.timeline({ease: "power1.easeInOut"});

  tl_header.from(".constant", {
    delay: 4.5,
    duration: 0.75,
    y: -80
  });

  // Hide the search bar initially by positioning it off-screen
  gsap.set(searchBarContainer.value, { y: "-100%" });
});
</script>

<style scoped>
.homepage {
  background-color: black;
  position: relative; /* Set to relative for absolute positioning of floating bot */
  width: 100%;
}

.hero {
  text-align: center;
  background-color: white;
  color: white;
}

.view {
  width: 100%;
}

/* Style for '/home' route */
.home-view {
  padding: 0px;
}

/* Style for other routes */
.default-view {
  padding: 130px 50px 50px 50px;
}

.constant {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: black;
  width: 100%;
}

.search-bar-container {
  position: absolute;
  width: 100%;
  top: 1; /* Will slide down from the top */
  left: 0;
  right: 0;
  z-index: -1; /* Ensure it's above other content */
}

.constant:hover .search-bar-container {
  z-index: 999;
}
</style>
