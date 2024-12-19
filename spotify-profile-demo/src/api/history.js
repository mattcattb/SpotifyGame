import axios from 'axios';

const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`;


const fetchAllRecentlyPlayed = async (token) => {
  // get as many recently played tracks as possible from the Spotify API
  console.log("in fetch all recently played.");
  var tracks = [];
  let next_url = `${RECENTLY_PLAYED_ENDPOINT}`;
  try {
    let i = 0;
    while (next_url){
      console.log(`Fetching batch ${i + 1}...`);
      const response = await axios.get(next_url, {
        headers: { Authorization: `Bearer ${token}`, },
      });
      tracks.push(...response.data.items);
      console.log(`Fetched ${response.data.items.length} tracks.`);
      next_url = response.data.next;
      i++;
    }
    return tracks;

  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const fetchProfile = async (token) => {
    const response = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  
  const fetchRecentlyPlayed = async (token, limit = 50) => {
    const response = await axios.get(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { limit },
    });
    console.log(response.data);
    return response.data.items;
  };

export { fetchProfile, fetchRecentlyPlayed, fetchAllRecentlyPlayed };