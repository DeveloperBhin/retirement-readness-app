import axios from 'axios';

// Base API URL (adjust if needed)
export const BASE_API = 'https://buku-api.utajiri.tz/api/';



// Get user info from cookies (adjust cookie names to your setup)


export function getInlineLoader() {
  return (
    <div className="Loader"></div>
  )
}




// Main API call function
export async function callApi(endpoint, params = {}) {
  try {

    // Merge user info into params
    const payload = {
      ...params,
      
      language: 'en',
    };

    const response = await axios.post(BASE_API + endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;

  } catch (error) {
    console.error('API call error:', error);
    return {
      status: 0,
      msg: 'Network Connection Error',
    };
  }
}

