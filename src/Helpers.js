import axios from 'axios';

// Base API URL (adjust if needed)
export const BASE_API = 'http://localhost:3001/api/';

// Helper to get cookies by name
export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}

// Get user info from cookies (adjust cookie names to your setup)
export async function getLocalUser() {
  return {
    userId: getCookie('kumbuka-userId'),
    userToken: getCookie('kumbuka-userToken'),
    userType: getCookie('kumbuka-userType'),
  };
}

export function getInlineLoader() {
  return (
    <div className="Loader"></div>
  )
}


export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();

  // Get the current domain from window.location.hostname
  let domain = window.location.hostname;

  // Set domainPart only if it's not 'localhost'
  let domainPart = domain !== 'localhost' ? `;domain=${domain}` : '';

  // Add the SameSite attribute to restrict cross-origin access (Strict or Lax as per your needs)
  let sameSite = ";SameSite=Strict";

  // Add the Secure flag for HTTPS connections
  let secureFlag = window.location.protocol === 'https:' ? ";Secure" : '';

  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + domainPart + sameSite + secureFlag;
}


// Main API call function
export async function callApi(endpoint, params = {}) {
  try {
    const user = await getLocalUser();

    const formData = new FormData();

    // Append language (change or remove if not needed)
    formData.append('language', getCookie('language') || 'en');

    // Append params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Append user auth info
    Object.entries(user).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const response = await axios.post(BASE_API + endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
