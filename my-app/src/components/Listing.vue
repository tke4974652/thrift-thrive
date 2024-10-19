<template>
    <div class="container-fluid">
        skibidi toilet
        <div class="row">
            <div v-for="product in products" :key="product.id" class="col-3">
            <div class="card mb-4">
                <img :src="product.itemPhotoURL" class="card-img-top" alt="Product Image">
                <div class="card-body">
                    <h4 class="card-title">{{ product.itemName }}</h4>
                    <h5 class="card-subtitle mb-2 text-muted">${{ product.itemPrice }}</h5>
                    <h6 class="card-subtitle">{{ product.seller }}</h6>
                    <p class="card-text">{{ product.description }}</p>
                    <button class="btn btn-danger float-end">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { db, auth } from "@/lib/firebaseConfig"; // Adjust the path as necessary
import { collection, getDocs, query, where } from "firebase/firestore";

const products = ref<any[]>([]); // Adjust the type as needed

const fetchProducts = async () => {
  // Check local storage first
  const uid = getUserUID();
  const cachedProducts = localStorage.getItem('listing');
  if (cachedProducts) {
    products.value = JSON.parse(cachedProducts);
    return;
  }
  // List of collections to check
  const collectionsToCheck = ['shoes', 'accessories', 'belt', 't-shirt', 'jeans', 'outerwear'];
  const fetchedProducts: any[] = [];

  try {
    for (const collectionName of collectionsToCheck) {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, where('userId', '==', uid)); // Query for userId
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() });
      });
    }

    products.value = fetchedProducts;
    // Cache products in local storage
    localStorage.setItem('listing', JSON.stringify(fetchedProducts));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

function getUserUID(){
    if (auth.currentUser){
        return auth.currentUser.uid;
    }
}
onMounted(fetchProducts);
</script>

<style scoped>
.container-fluid {
    color: white;
}
.card-subtitle, .card-text{
    color: black;
}
</style>