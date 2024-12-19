import { useState, useEffect } from 'react';
import { fetchProfile, fetchRecentlyPlayed, fetchAllRecentlyPlayed } from '../api/history';
import Profile from '../components/Profile';
import RecentlyPlayed from '../components/RecentlyPlayed';

const HomePage = ({ accessToken }) => {
  const [profile, setProfile] = useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchProfile(accessToken);
        setProfile(profileData);
        const tracks = await fetchRecentlyPlayed(accessToken, 50);
        setRecentlyPlayed(tracks);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [accessToken]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <Profile profile={profile} />
      {recentlyPlayed.length > 0 && <RecentlyPlayed tracks={recentlyPlayed} />}
    </div>
  );
};

export default HomePage;