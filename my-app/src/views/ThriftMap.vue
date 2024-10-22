<template>
    <div class="row">
      <div class="col-12 col-lg-9 col-xl-9 col-xxl-9" style="margin-bottom: 20px;">
        <div ref="mapContainer" class="map-container"></div>
      </div>
      <div class="col-12 col-lg-3 col-xl-3 col-xxl-3" v-if="firstClick">
        <InfoCard :placeChosen="placeChosen" />
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import loadGoogleMaps from '@/lib/googleMaps';
  import InfoCard from '@/components/InfoCard.vue'; // Adjust the import path based on your project structure
  
  const placeChosen = ref(''); // This will be passed to InfoCard
  const firstClick = ref(false);
  // Example array of marker locations
  const markerLocations = [
    { lat: 1.2956, lng: 103.8542, title: 'Haji Lane, Singapore' }, // Haji Lane
    { lat: 1.2960, lng: 103.8530, title: 'Nearby Location 1' },
    { lat: 1.2945, lng: 103.8560, title: 'Nearby Location 2' },
  ];
  
  const mapContainer = ref<HTMLElement | null>(null); // Create a ref for the map container
  let currentInfoWindow: google.maps.InfoWindow | null = null; // Track the currently open info window
  
  const initMap = () => {
    if (!mapContainer.value) return; // Ensure the ref is not null
  
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 1.2956, lng: 103.8542 }, // Set the initial center to Haji Lane, Singapore
      zoom: 15, // Zoom level to display all markers well
    };
  
    const map = new google.maps.Map(mapContainer.value, mapOptions); // Use the ref instead of document.getElementById
  
    // Loop through marker locations and place them on the map
    markerLocations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.title,
      });
  
      // Create the info window for this marker
      const infoWindow = new google.maps.InfoWindow({
        content: `<p style='color: black;'>${location.title}</p>`,
      });
  
      marker.addListener('click', () => {
        // Close the previously opened info window
        firstClick.value = true;
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
  
        // Open the new info window and set it as the current one
        infoWindow.open(map, marker);
        currentInfoWindow = infoWindow;
  
        // Set the chosen place
        placeChosen.value = marker.title; // Update placeChosen
      });
    });
  };
  
  onMounted(async () => {
    try {
      await loadGoogleMaps(); // Load Google Maps dynamically
      initMap(); // Initialize the map after Google Maps API is loaded
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  });
  </script>
  
  <style scoped>
  .map-container {
    height: 100%; /* Make the map container fill its parent */
    width: 100%;
    border-radius: 15px;
    border: 1px solid grey; /* Optional: border for visibility */
  }
  
  /* Ensure the parent row has a defined height */
  .row {
    height: 100vh; /* Adjust as needed to fill the viewport */
  }
  </style>  