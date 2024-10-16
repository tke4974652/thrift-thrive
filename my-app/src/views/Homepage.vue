<template>
  <div class="homepage">
      <Navbar />

      <section class="hero">
          <SearchBar @search="handleSearch" />
          <p>Searching for: {{ searchTerm }}</p>
      </section>

      <section class="content">
        <h2>Trending Kicks</h2>
        <div class="row">
            <div class="col-lg-3 col-md-4 col-sm-6" v-for="product in products" :key="product.id">
                <div class="card mb-4">
                    <img :src="product.image" class="card-img-top" alt="Product Image">
                    <div class="card-body">
                        <h5 class="card-title">{{ product.name }}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${{ product.price }}</h6>
                        <p class="card-text">{{ product.seller }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { db } from "@/lib/firebaseConfig"; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar.vue";
import SearchBar from '../components/SearchBar.vue';

const searchTerm = ref('');
const products = ref<any[]>([]); // Adjust the type as needed

function handleSearch(query: string) {
  searchTerm.value = query;
}

const fetchProducts = async () => {
  try {
      const querySnapshot = await getDocs(collection(db, 'shoes')); // Replace with your collection name
      querySnapshot.forEach((doc) => {
          products.value.push({ id: doc.id, ...doc.data() });
      });
  } catch (error) {
      console.error('Error fetching products:', error);
  }
};

onMounted(fetchProducts);
</script>

<style scoped>

.homepage {
  background-color: black;
}
.hero {
  text-align: center;
  padding: 50px 20px;
  background-color: black;
  color: white; /* Updated for visibility */
}

.content {
  padding: 20px;
  text-align: center;
  color: white;
}

.product {
  margin: 20px 0;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.card-img-top {
  width: 100%; /* Make the image responsive */
  height: 300px; /* Set a fixed height to maintain card size */
  object-fit: cover; /* Ensure the image covers the area without distortion */
}
</style>

  