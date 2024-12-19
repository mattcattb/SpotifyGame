"use client";

import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';

const GamePage = () => {
  const { data: session } = useSession();
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const res = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          // Simplified: Get a random track from the response data
          if (res.data.items.length) {
            const randomTrack = res.data.items[Math.floor(Math.random() * res.data.items.length)];
            setTrack(randomTrack);
          }
        } catch (error) {
          console.error('Error fetching data from Spotify:', error);
        }
      };

      fetchData();
    }
  }, [session]);

  if (!track) return <div>Loading...</div>;

  return (
    <div>
      <h1>Guess the Track</h1>
      <p>Artist: {track.artists[0].name}</p>
      <p>Track: {track.name}</p>
      {/* Further game logic and UI */}
    </div>
  );
};

export default GamePage;