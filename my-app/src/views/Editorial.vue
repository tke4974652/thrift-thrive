<template>
    <div class="container-fluid bg-black text-white py-4">
      <div class="row g-4">
        <!-- Blog Post Cards -->
        <div v-for="post in blogPosts" :key="post.id" class="col-12 col-md-6 col-lg-4">
          <div class="blog-card p-3" @click="navigateToPost(post.id)">
            <div class="d-flex align-items-center mb-3">
              <img 
                :src="post.sellerAvatar || '../assets/user.jpeg'" 
                alt="Seller Avatar" 
                class="seller-avatar me-3"
                @click.stop="navigateToProfile(post.sellerId)"
              />
              <div>
                <h6 class="mb-1" style="color: hsla(160, 100%, 37%, 1)">{{ post.sellerName }}</h6>
                <small class="text-muted">{{ formatDate(post.date) }}</small>
              </div>
            </div>
            <img :src="post.image" alt="Blog Post Image" class="blog-image mb-3">
            <h5 class="blog-title text-truncate-2">{{ post.title }}</h5>
            <p class="blog-caption text-truncate-4 text-muted">{{ post.caption }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { collection, getDocs, doc, getDoc, type DocumentData } from 'firebase/firestore';
  import { db } from '@/lib/firebaseConfig';
  
  interface Editorial extends DocumentData {
    id: string;
    sellerId: string;
    sellerName: string;
    sellerAvatar: string | null;
    title: string;
    caption: string;
    image: string;
    date: Date;
  }
  
  interface UserData {
    username?: string;
    photoURL?: string;
  }
  
  const router = useRouter();
  const blogPosts = ref<Editorial[]>([]);
  
  const fetchEditorials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blog_posts'));
      const posts: Editorial[] = [];
      
      for (const document of querySnapshot.docs) {
        const postData = document.data();
        // Fetch seller info for each post
        const sellerRef = doc(db, 'users', postData.sellerId);
        const sellerSnapshot = await getDoc(sellerRef);
        const sellerData = sellerSnapshot.exists() ? sellerSnapshot.data() as UserData : null;
        
        posts.push({
          id: document.id,
          ...postData,
          sellerName: sellerData?.username || 'Anonymous',
          sellerAvatar: sellerData?.photoURL || null
        } as Editorial);
      }
      
      blogPosts.value = posts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };
  
  const navigateToProfile = (sellerId: string) => {
    router.push({
      name: 'profile',
      params: { userId: sellerId }
    });
  };
  
  const navigateToPost = (postId: string) => {
    router.push({
      name: 'blogPost',
      params: { id: postId }
    });
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  onMounted(() => {
    fetchEditorials();
  });
  </script>
  
  <style scoped>
  .blog-card {
    background-color: #111;
    border-radius: 8px;
    transition: transform 0.2s;
    cursor: pointer;
  }
  
  .blog-card:hover {
    transform: translateY(-5px);
  }
  
  .seller-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  
  .seller-avatar:hover {
    opacity: 0.8;
  }
  
  .blog-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 3.6em; /* Approximately 2 lines */
  }
  
  .text-truncate-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 7.2em; /* Approximately 4 lines */
  }
  </style>