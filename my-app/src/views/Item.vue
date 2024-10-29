<template>
  <div v-if="isLoading" class="loading-container">
    <LoadingOverlay :isLoading="isLoading" message="Loading item details..." />
  </div>

  <div v-else class="container-fluid">
    <!-- Image Carousel Section -->
    <div class="row mb-4">
      <div class="col-12">
        <div id="itemCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div v-for="(image, index) in itemImages" 
                 :key="index" 
                 :class="['carousel-item', index === 0 ? 'active' : '']">
              <img :src="image" class="d-block w-100 carousel-img" :alt="`Product image ${index + 1}`">
            </div>
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#itemCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>

          <button class="carousel-control-next" type="button" data-bs-target="#itemCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="row">
      <!-- Left Column - Item Details -->
      <div class="col-12 col-lg-8 mb-4">
        <h1 class="display-6 text-white mb-3">{{ itemName }}</h1>
        <div class="price-text mb-4" style="color: hsla(160, 100%, 37%, 1)">
          S${{ itemPrice }}
        </div>

        <!-- Product Attributes -->
        <div class="row mb-4">
          <div class="col-6" v-for="(value, key) in attributes" :key="key">
            <div class="detail-box">
              <h3 class="h6 text-white-50">{{ key }}</h3>
              <p class="text-white">{{ value }}</p>
            </div>
          </div>
        </div>

        <!-- Deal Method -->
        <div class="deal-method p-4 mb-4 rounded">
          <h3 class="h5 text-white mb-3">Deal Method</h3>
          <p class="text-white mb-2">{{ dealMethod }}</p>
          <p class="text-white-50 small">{{ location }}</p>
        </div>

        <!-- Add to Cart Button -->
        <button 
          @click="addToCart" 
          class="btn btn-success w-100 mb-4">
          Add to Cart
        </button>

        <!-- Description -->
        <div class="mb-4">
          <h3 class="h5 text-white mb-3">Description</h3>
          <p class="text-white-50">{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const route = useRoute();
const itemId = route.params.id as string;
const category = route.params.category as string;

const cartStore = useCartStore(); // Use the cart store

const itemImages = ref<string[]>([]);
const itemName = ref('');
const itemPrice = ref(0);
const attributes = ref<Record<string, string>>({});
const dealMethod = ref('');
const location = ref('');
const description = ref('');
const isLoading = ref(true);

const fetchItem = async () => {
  try {
    const docRef = doc(db, category, itemId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      itemImages.value = data.itemPhotoURLs || [];
      itemName.value = data.itemName || 'Unnamed Item';
      itemPrice.value = data.itemPrice || 0;
      attributes.value = {
        Condition: data.condition || 'N/A',
        Type: data.type || 'N/A',
        Listed: data.listedDate || 'N/A',
        Category: data.category || 'N/A',
      };
      dealMethod.value = data.dealMethod || 'N/A';
      location.value = data.location || 'N/A';
      description.value = data.description || 'N/A';
    }
  } catch (error) {
    console.error('Error fetching item:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchItem);

const addToCart = () => {
  cartStore.addItemToCart({
    id: itemId,
    name: itemName.value,
    price: itemPrice.value,
    quantity: 1,
    image: itemImages.value[0] || '',
  });
  alert('Item added to cart!');
};
</script>

<style scoped>
.carousel-img {
  height: 500px;
  object-fit: contain;
}
</style>
