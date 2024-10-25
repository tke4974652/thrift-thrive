<template>
    <div v-if="isLoading">
        <Loading :isLoading="isLoading" message="Loading item details..." />
    </div>
    <div v-else>
        <div class="item-container">
            <img :src="item.image" alt="Product Image" class="item-image" />
            <h2 class="item-name">{{ item.name }}</h2>
            <h3 class="item-price">${{ item.price }}</h3>
            <p class="item-description">{{ item.description }}</p>
            <p class="item-seller">Sold by: {{ item.seller }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/lib/firebaseConfig'; // Adjust path as necessary
import { doc, getDoc } from 'firebase/firestore';
import Loading from "@/components/Loading.vue"; // Adjust path as necessary

const route = useRoute();
const itemId = route.params.id as string;
const item = ref<any>(null);
const isLoading = ref(true);

const fetchItem = async () => {
    try {
        const docRef = doc(db, 'shoes', itemId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            item.value = { id: docSnap.id, ...docSnap.data() };
        } else {
            console.error("No such item!");
        }
    } catch (error) {
        console.error('Error fetching item:', error);
    } finally {
        isLoading.value = false;
    }
};

// Fetch item on component mount
onMounted(fetchItem);
</script>

<style scoped>
.item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.item-image {
    width: 100%;
    max-width: 400px;
    height: auto;
    object-fit: cover;
}

.item-name {
    font-size: 2rem;
    margin: 10px 0;
}

.item-price {
    font-size: 1.5rem;
    color: #555;
}

.item-description,
.item-seller {
    font-size: 1rem;
    color: #666;
    text-align: center;
    margin: 5px 0;
}
</style>
