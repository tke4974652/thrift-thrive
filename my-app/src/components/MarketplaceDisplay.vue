<template>
    <div class="container-fluid">
      <h3 class="category-title">{{ categoryChosen }}</h3>
      <Loading :isLoading="isLoading" message="Fetching products..." />
      <div v-if="!isLoading">
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-lg-4 col-6">
            <div class="card mb-4" @click="navigateToItem(product)">
              <img :src="product.itemPhotoURLs[0]" class="card-img-top img-fluid" alt="Product Image" />
              <div class="card-body">
                <h4 class="card-title product-title">{{ product.itemName }}</h4>
                <h5 class="card-subtitle mb-2 text-muted product-price">${{ product.itemPrice }}</h5>
                <h6 class="card-subtitle product-username">{{ product.userName }}</h6>
                <p class="card-text">{{ product.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, onMounted, watch } from 'vue';
  import { db } from '@/lib/firebaseConfig';
  import { collection, getDocs } from 'firebase/firestore';
  import Loading from '@/components/Loading.vue'; // Adjust the path as necessary
  import { useRouter } from 'vue-router'; // Import useRouter from Vue Router

  const router = useRouter(); // Initialize the router

  const props = defineProps<{
    categoryChosen: string;
  }>();
  
  const isLoading = ref(true);
  const products = ref<any[]>([]); // Adjust the type as needed
  
  const fetchProducts = async () => {
    const categorySelected = props.categoryChosen; // Use prop directly
  
    // Check local storage first
    const cachedProducts = localStorage.getItem(categorySelected);
    if (cachedProducts) {
      products.value = JSON.parse(cachedProducts);
      isLoading.value = false;
      return;
    }
  
    if (categorySelected) {
      try {
        const querySnapshot = await getDocs(collection(db, categorySelected));
        const fetchedProducts: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        products.value = fetchedProducts;
  
        // Cache products in local storage
        localStorage.setItem(categorySelected, JSON.stringify(fetchedProducts));
        isLoading.value = false;
        console.log(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        isLoading.value = false; // Stop loading in case of error
      }
    } else {
      isLoading.value = false;
    }
  };

  function navigateToItem(product: any) { 
  router.push({ name: 'item', params: { category: props.categoryChosen, id: product.id } }); 
  }

  // Watch for changes in the selected category and fetch products accordingly
  watch(() => props.categoryChosen, fetchProducts);
  
  // Fetch products when component is mounted
  onMounted(fetchProducts);
  </script>
  
<style scoped>
.container-fluid {
  padding: 20px;
  color: white;
}

/* Responsive font sizes using viewport units */
.category-title {
  font-size: 2.5vw; /* Adjust as needed */
  padding-bottom: 10px;
}

.product-title {
  font-size: 3vw; /* Adjust as needed */
}

.product-price {
  font-size: 2.5vw; /* Adjust as needed */
}

.product-username {
  font-size: 2vw; /* Adjust as needed */
}

.card-text {
  color: black;
  font-size: 1.5vw; /* Adjust as needed */
}

.card {
  /* Other styles for .card */
  transition: transform 0.2s; /* Optional: adds a smooth scaling effect */
}

.card:hover {
  cursor: pointer; /* Changes cursor to a pointer when hovering */
  transform: scale(1.05); /* Optional: scales up slightly on hover */
}
/* Optionally add media queries for specific screen sizes */
@media (max-width: 768px) {
  .category-title {
    font-size: 4vw; /* Increase size for smaller screens */
  }

  .product-title {
    font-size: 5vw;
  }
  .product-price {
    font-size: 4vw;
  }
  .product-username {
    font-size: 3.5vw;
  }
  .card-text {
    font-size: 2vw; /* Adjust for smaller screens */
  }
}
</style>