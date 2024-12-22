import { useState, useEffect, useCallback } from 'react';

export function useSpotifyPlayer(accessToken) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load Spotify Web Playback SDK if not already loaded
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js'; // Correct URL
      script.async = true; // Ensure script loads asynchronously
      document.body.appendChild(script);
      
      script.onload = () => {
        initializePlayer();
      };

      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializePlayer();
    }

    function initializePlayer() {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: 'Spotify Game Player',
          getOAuthToken: cb => cb(accessToken),
          volume: 0.5,
        });

        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          setIsReady(true);
        });

        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setIsReady(false);
        });

        player.connect();
        setPlayer(player);
      };
    }
  }, [accessToken]);

  const playSongClip = useCallback(async (trackUri, startTime = 0, duration = 5000) => {
    if (!deviceId) {
      console.error('Device ID is not set. Cannot play song.');
      return;
    }

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [trackUri],
          position_ms: startTime,
        }),
      });

      // Stop playback after the specified duration
      setTimeout(async () => {
        await fetch('https://api.spotify.com/v1/me/player/pause', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }, duration);
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }, [deviceId, accessToken]);

  return { player, isReady, playSongClip };
}
