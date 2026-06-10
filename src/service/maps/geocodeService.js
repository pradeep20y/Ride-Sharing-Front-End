
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodeAddress(address) {
  if (!address?.trim()) return null;

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    if (data?.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    // Depending on your app, you might want to throw the error
    // to handle it in the UI (e.g., show an error message toast)
  }
  return null;
}