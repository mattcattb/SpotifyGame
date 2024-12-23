import { useState, useEffect, useCallback } from 'react';

export function useSpotifyPlayer(accessToken) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  console.log(deviceId); // Check if your device ID is listed

  useEffect(() => {
    // Load Spotify Web Playback SDK if not already loaded
    if (!window.Spotify) {
      console.log('Loading Spotify SDK...');
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js'; // Correct URL
      script.async = true; // Ensure script loads asynchronously
      document.body.appendChild(script);
      
      script.onload = () => {
        console.log('Spotify SDK Loaded');
        // Initialize the player once the SDK is loaded
        window.onSpotifyWebPlaybackSDKReady = () => {
          const playerInstance = new window.Spotify.Player({
            name: 'Spotify Game Player',
            getOAuthToken: cb => cb(accessToken),
            volume: 0.5,
          });

          playerInstance.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            setDeviceId(device_id);
            setIsReady(true);
          });

          playerInstance.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
            setIsReady(false);
          });

          playerInstance.connect();
          setPlayer(playerInstance);
        };
      };

      script.onerror = () => {
        console.log('Failed to load Spotify SDK');
      };

      return () => {
        document.body.removeChild(script);
      };
    } else {
      console.log('Spotify SDK already loaded');
      // Initialize the player if the SDK is already loaded
      window.onSpotifyWebPlaybackSDKReady = () => {
        const playerInstance = new window.Spotify.Player({
          name: 'Spotify Game Player',
          getOAuthToken: cb => cb(accessToken),
          volume: 0.5,
        });

        playerInstance.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setDeviceId(device_id);
          setIsReady(true);
        });

        playerInstance.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setIsReady(false);
        });

        playerInstance.connect();
        setPlayer(playerInstance);
      };
    }
  }, [accessToken]);

  const playSongClip = useCallback(async (trackUri, startTime = 0, duration = 5000) => {
    if (!deviceId) {
      console.error('Device ID is not set. Cannot play song.');
      return;
    }

    console.log("Playing song clip!!");

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
