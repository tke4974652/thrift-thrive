<template>
  <section class="upload-section container-fluid">
    <LoadingOverlay :isLoading="isLoading" message="Uploading your item..." />
    <form @submit.prevent="handleUpload" class="upload-form">
      <h2>Upload Item for Sale</h2>
      <div class="form-group">
        <label for="item-name">Name:</label>
        <input type="text" id="item-name" v-model="itemName" placeholder="Enter item name" required />
      </div>
      <div class="form-group">
        <label for="item-description">Description:</label>
        <textarea id="item-description" v-model="itemDescription" placeholder="Enter item description" required></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Upload Photos (Front, Back, Tag):</label>
        <div class="row mb-3">
          <div class="col-4">
            <label class="custom-file-upload">
              <input 
                type="file" 
                @change="(event) => handleSinglePhoto(event, 'front')" 
                accept="image/*" 
                required 
              />
              Front Photo
            </label>
          </div>
          <div class="col-4">
            <label class="custom-file-upload">
              <input 
                type="file" 
                @change="(event) => handleSinglePhoto(event, 'back')" 
                accept="image/*" 
                required 
              />
              Back Photo
            </label>
          </div>
          <div class="col-4">
            <label class="custom-file-upload">
              <input 
                type="file" 
                @change="(event) => handleSinglePhoto(event, 'tag')" 
                accept="image/*" 
                required 
              />
              Tag Photo
            </label>
          </div>
        </div>
        <small class="form-text text-muted">Please upload photos: front, back, and tag.</small>
      </div>
      <div class="form-group">
        <label for="item-price">Price:</label>
        <input type="number" id="item-price" v-model="itemPrice" placeholder="Enter item price" required />
      </div>
      <div class="form-group">
        <label for="category">Category:</label>
        <select v-model="chosenCat" id="category" required>
          <option disabled value="">Select a category</option>
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
      </div>
      <!-- Additional Fields -->
      <div class="form-group">
        <label for="condition">Condition:</label>
        <input type="text" id="condition" v-model="condition" placeholder="Enter item condition" required />
      </div>
      <div class="form-group">
        <label for="deal-method">Deal Method:</label>
        <input type="text" id="deal-method" v-model="dealMethod" placeholder="Enter deal method" required />
      </div>
      <div class="form-group">
        <label for="location">Location:</label>
        <input type="text" id="location" v-model="location" placeholder="Enter item location" required />
      </div>
      <button type="submit" class="btn btn-primary">Sell!</button>
    </form>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { auth, db, storage } from '../lib/firebaseConfig';
import { doc, setDoc, collection, getDoc, arrayUnion } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import LoadingOverlay from '@/components/LoadingOverlay.vue';

const categories = ['Shoes', 'Accessories', 'Belt', 'T-shirt', 'Jeans', 'Outerwear'];
const isLoading = ref(false);
const itemName = ref('');
const itemDescription = ref('');
const itemPrice = ref(0);
const chosenCat = ref('');
const selectedFiles = ref<File[]>([]);
const userName = ref('');

// Additional Fields
const condition = ref('');
const dealMethod = ref('');
const location = ref('');
const date = new Date()
const listedDate = date.toISOString().split('T')[0];

const handleSinglePhoto = (event: Event, position: string) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length) {
    selectedFiles.value.push({ file: target.files[0], position });
    console.log(selectedFiles.value);
  }
};

const handleUpload = async () => {
  const currentUser = auth.currentUser;
  if (currentUser && selectedFiles.value.length === 3) {
    const userDoc = doc(db, 'users', currentUser.uid);
    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      userName.value = userData.username || '';
    } else {
      alert("Set up your username first!");
      return;
    }
    
    isLoading.value = true; // Start loading overlay
    const itemDocRef = doc(collection(db, chosenCat.value));
    const itemUID = itemDocRef.id;

    const sellData = {
      userId: currentUser.uid,
      userName: userName.value,
      itemName: itemName.value,
      description: itemDescription.value,
      itemPrice: itemPrice.value,
      itemPhotoURLs: [], // Initialize an array for photo URLs
      condition: condition.value,
      dealMethod: dealMethod.value,
      location: location.value,
      listedDate: listedDate,
    };

    await setDoc(itemDocRef, sellData, { merge: true });

    // Upload all selected photos
    await Promise.all([
      handlePhotoUpload(itemUID, selectedFiles.value[0], 'front'),
      handlePhotoUpload(itemUID, selectedFiles.value[1], 'back'),
      handlePhotoUpload(itemUID, selectedFiles.value[2], 'tag'),
    ]);
    
    alert(`Item uploaded successfully! Item UID: ${itemUID}`);
    isLoading.value = false;
  } else {
    alert('User is not logged in or incorrect number of files selected.');
    isLoading.value = false;
  }
};

const handlePhotoUpload = async (itemUID: string, file: File, position: string) => {
  const storagePath = `item_photos/${itemUID}/${position}`; // Naming the files as front.jpg, back.jpg, tag.jpg
  const photoRef = storageRef(storage, storagePath);
  const metadata = {
    contentType: 'image/jpeg', // Set content type to JPEG
  };
  await uploadBytes(photoRef, file, metadata);
  const downloadURL = await getDownloadURL(photoRef);

  // Update Firestore document with the photo URL
  await updateUpload(itemUID, downloadURL);
};

const updateUpload = async (itemUID: string, downloadURL: string) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const itemDocRef = doc(collection(db, chosenCat.value), itemUID);
    
    // Update Firestore document with the new photo URL
    await setDoc(itemDocRef, {
      itemPhotoURLs: arrayUnion(downloadURL), // Append to the array
    }, { merge: true });

    const uploadData = {
      userId: currentUser.uid,
      userName: userName.value,
      itemName: itemName.value,
      description: itemDescription.value,
      itemPrice: itemPrice.value,
    };

    updateLocalStorage({ id: itemUID, ...uploadData });
    isLoading.value = false;

    // Clear form fields
    itemName.value = '';
    itemDescription.value = '';
    itemPrice.value = 0;
    chosenCat.value = '';
    selectedFiles.value = []; // Clear selected files
    condition.value = '';
    dealMethod.value = '';
    location.value = '';
  } else {
    alert('User is not logged in.');
    isLoading.value = false;
  }
};

const updateLocalStorage = (newItem: JSON) => {
  const cachedProducts = localStorage.getItem('listing');
  const products = cachedProducts ? JSON.parse(cachedProducts) : [];
  
  products.push(newItem);
  localStorage.setItem('listing', JSON.stringify(products));
};
</script>

<style scoped>
.upload-form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

input[type="text"],
input[type="file"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

textarea {
  resize: vertical; /* Allow vertical resizing */
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .upload-form {
    padding: 15px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  button {
    padding: 10px; /* Adjust button padding */
  }
}
.custom-file-upload {
  display: inline-block;
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f9fa; /* Light background */
}

.custom-file-upload input {
  display: none; /* Hide the default file input */
}
</style>

  