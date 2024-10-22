<template>
    <div class="info-card">
      <h5>{{ placeChosen }}</h5>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    placeChosen: string;
  }>();
  </script>
  
  <style scoped>
  .info-card {
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media screen and (max-width: 992px) {
    .info-card {
        width: 50%;
        margin: auto;
    }
}

  </style>
  