<template>
    <section class="upload-section container-fluid">
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
          <label for="item-photo">Upload Photo:</label><br>
          <input type="file" id="item-photo" @change="handlePhoto" accept="image/*" required />
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
        <button type="submit" class="btn btn-primary">Sell!</button>
      </form>
    </section>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { auth, db, storage } from '../lib/firebaseConfig'; // Adjust as necessary
  import { doc, setDoc, collection } from 'firebase/firestore';
  import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  const categories = ['shoes', 'accessories', 'belt', 't-shirt', 'jeans', 'outerwear'];
  const currentUser = auth.currentUser;
  
  const itemName = ref('');
  const itemDescription = ref('');
  const itemPrice = ref(0);
  const chosenCat = ref('');
  const selectedFile = ref<File | null>(null); // Store the selected file
  
  const handlePhoto = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      selectedFile.value = target.files[0]; // Store the selected file
    }
  };
  
  const handleUpload = async () => {
    if (currentUser && selectedFile.value) {
      const itemDocRef = doc(collection(db, chosenCat.value)); // Create a new document reference
      const sellData = {
        userId: currentUser.uid,
        userName: currentUser.displayName, // Get the user's display name
        itemName: itemName.value,
        description: itemDescription.value,
        itemPrice: itemPrice.value,
        itemPhotoURL: '', // Placeholder for now
      };
  
      await setDoc(itemDocRef, sellData, { merge: true });
      const itemUID = itemDocRef.id; // Get the unique document ID
      
      // Upload the photo
      await handlePhotoUpload(itemUID);
      alert(`Item uploaded successfully! Item UID: ${itemUID}`);
      
    } else {
      alert('User is not logged in or no file selected.');
    }
  };
  
  const handlePhotoUpload = async (itemUID: string) => {
    if (!selectedFile.value) return;
  
    const storagePath = `item_photos/${itemUID}`; // Unique path for each item
    const photoRef = storageRef(storage, storagePath);
  
    // Upload the image to Firebase Storage
    await uploadBytes(photoRef, selectedFile.value);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(photoRef);
    
    // Update the Firestore document with the photo URL
    await updateUpload(itemUID, downloadURL);
  };
  
  const updateUpload = async (itemUID: string, downloadURL: string) => {
  if (currentUser) {
    const itemDocRef = doc(collection(db, chosenCat.value), itemUID); // Reference to the existing document
    const sellData = {
      itemPhotoURL: downloadURL, // Add the photo URL to the document
    };
    
    // Update the document in Firestore
    await setDoc(itemDocRef, sellData, { merge: true });
    alert(`Photo uploaded successfully!`);
    const uploadData = {
        userId: currentUser.uid,
        userName: currentUser.displayName, // Get the user's display name
        itemName: itemName.value,
        description: itemDescription.value,
        itemPrice: itemPrice.value,
        itemPhotoURL: downloadURL, // Placeholder for now
      };
    // Update local storage
    updateLocalStorage({ id: itemUID, ...uploadData });

    // Clear form fields
    itemName.value = '';
    itemDescription.value = '';
    itemPrice.value = 0;
    chosenCat.value = '';
    selectedFile.value = null;
  } else {
    alert('User is not logged in.');
  }
};
  
  // Update local storage with the new listing
  const updateLocalStorage = (newItem: JSON) => {
    const cachedProducts = localStorage.getItem('listing');
    const products = cachedProducts ? JSON.parse(cachedProducts) : [];
    
    products.push(newItem); // Add new item to the existing list
    localStorage.setItem('listing', JSON.stringify(products)); // Update local storage
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

  </style>
  