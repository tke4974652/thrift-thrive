<template>
    <div class="home">
        <section class="content">
            <SuggestionPanel />
        </section>
        <section class="content">
            <DisplayItem />
        </section>
    </div>
</template>

<script lang="ts" setup>
import DisplayItem from '../components/DisplayItem.vue';
import SuggestionPanel from '../components/SuggestionPanel.vue';
import { ref, onMounted } from 'vue';
import { auth, db } from '../lib/firebaseConfig'; // Add storage import
import { doc, getDoc } from 'firebase/firestore';

const userEmail = ref('');
const name = ref('');
const photoURL = ref('');
const loading = ref(true);
const currentUser: User | null = auth.currentUser;

if (currentUser) {
  userEmail.value = currentUser.email || '';
}

const loadFromLocalStorage = () => {
  const cachedData = localStorage.getItem(`user_${currentUser.uid}`);
  if (cachedData) {
    const userData = JSON.parse(cachedData);
    userEmail.value = userData.email;
    name.value = userData.name;
    photoURL.value = userData.photoURL;
  }
};

const fetchUserData = async () => {
  const userDoc = doc(db, 'users', currentUser.uid);
  const userSnapshot = await getDoc(userDoc);
  loading.value = false;

  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    userEmail.value = userData.email || '';
    name.value = userData.username || '';
    photoURL.value = userData.photoURL || '';
    
    localStorage.setItem(`user_${currentUser.uid}`, JSON.stringify({
      email: userEmail.value,
      name: userData.username,
      photoURL: photoURL.value,
    }));
  }
};

onMounted(async () => {
  if (currentUser) {
    loadFromLocalStorage();
    await fetchUserData();
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
.content {
  padding: 20px;
  text-align: center;
  color: white;
}
</style>