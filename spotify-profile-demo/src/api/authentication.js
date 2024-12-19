import axios from 'axios';

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const getAccessToken = async (clientId, code) => {
  const verifier = localStorage.getItem('verifier');

  console.log("Getting access token!");

  // Create Base64-encoded Authorization header
  const auth_token = btoa(`${clientId}:${clientSecret}`);

  // Encode body as application/x-www-form-urlencoded
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });

  try {
    // Send POST request to Spotify API
    const response = await axios.post(TOKEN_ENDPOINT, body.toString(), {
      headers: {
        Authorization: `Basic ${auth_token}`, // Base64 encoded client_id:client_secret
        'Content-Type': 'application/x-www-form-urlencoded', // Spotify expects this
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response?.data || error.message);
    throw new Error('Failed to get access token');
  }
};


const generateCodeVerifier = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((x) => possible.charAt(x % possible.length))
    .join('');
};

const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export {
  getAccessToken,
  generateCodeVerifier,
  generateCodeChallenge,
};