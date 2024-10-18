<template>
    <h4>What are you looking for today?</h4>
    <div class="row">
        <button v-for="cat in categories" :key="cat" class="categories">{{ cat }}</button>
    </div>
</template>

<script lang="ts" setup>
const categories = ['shoes', 'accessories', 'belt', 't-shirt', 'jeans', 'outerwear'];
</script>

<style scoped>
.row {
    display: flex; /* Use flexbox to align items horizontally */
    justify-content: center; /* Center align the buttons */
    padding-top: 10px;
    flex-wrap: wrap; /* Allow wrapping to the next line if needed */
}

.categories {
    margin: 10px; /* Add margin between buttons */
    width: 200px;
    height: 200px;
    border-radius: 15px;
    background-color: lightgrey;
    border: none;
    margin: auto 10px;
}
.content {
  padding: 20px;
  text-align: center;
  color: white;
}
</style>

