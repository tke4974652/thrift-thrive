import { Loader } from '@googlemaps/js-api-loader';

const loadGoogleMaps = async (): Promise<void> => {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY; // Use import.meta.env instead of process.env

  if (!apiKey) {
    throw new Error('Google Maps API key is missing in .env file');
  }

  const loader = new Loader({
    apiKey: apiKey,
    version: 'weekly', // You can change this to a specific version if needed
    libraries: ['places'], // Add more libraries like 'places', 'geometry', etc.
  });

  try {
    // Load the "maps" library specifically
    await loader.importLibrary('maps');
    console.log('Google Maps API loaded successfully');
  } catch (error) {
    console.error('Error loading Google Maps API', error);
  }
};

export default loadGoogleMaps;
