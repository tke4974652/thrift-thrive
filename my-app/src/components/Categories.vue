<template>
    <h4>What are you looking for today?</h4>
    <div class="row">
      <div v-if="isDropdown" class="dropdown">
        <select @change="handleCategoryChange">
          <option value="" disabled selected>Select a category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div v-else>
        <button v-for="cat in categories" :key="cat" class="categories" @click="handleChoice(cat)">{{ cat }}</button>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  
  const emit = defineEmits(['categorySelected']);
  const categories = ['Shoes', 'Accessories', 'Belt', 'T-shirt', 'Jeans', 'Outerwear'];
  const isDropdown = ref(false);
  
  // Function to handle category change
  const handleCategoryChange = (event: Event) => {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    emit('categorySelected', selectedCategory);
  };
  const handleChoice = (category: string) => {
    const selectedCategory = category;
    console.log('Selected category:', selectedCategory);
    emit('categorySelected', selectedCategory);
  };
  
  // Reactive property to check screen width
  const updateLayout = () => {
    isDropdown.value = window.innerWidth < 1180; // Adjust this breakpoint as needed
  };
  
  // Update layout on resize
  window.addEventListener('resize', updateLayout);
  updateLayout(); // Initial check on component mount
  </script>
  
  <style scoped>
  .row {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    flex-wrap: wrap;
  }
  
  .categories {
    margin: 10px;
    width: 150px;
    height: 150px;
    border-radius: 15px;
    background-color: lightgrey;
    border: none;
    margin: auto 10px;
  }
  
  .dropdown {
    margin: 10px;
  }
  
  select {
    padding: 10px;
    border-radius: 5px;
  }
  </style>