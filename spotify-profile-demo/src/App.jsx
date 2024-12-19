import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { getAccessToken, generateCodeVerifier, generateCodeChallenge } from './api/authentication';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import './style/index.css';

function App() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
  
    if (!code){
      redirectToAuthCodeFlow(clientId);
    } else {
      (async () => {
        const token = await getAccessToken(clientId, code);
        setAccessToken(token);
        localStorage.setItem('accessToken', token); // Save the token
        window.history.replaceState({}, document.title, "/");
      })();
    }
  }, []);

  const redirectToAuthCodeFlow = async (clientId) => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('verifier', verifier);

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('response_type', 'code');
    params.append('redirect_uri', import.meta.env.VITE_SPOTIFY_REDIRECT_URI);
    params.append('scope', 'user-read-private user-read-email user-read-recently-played');
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  if (!accessToken) return <div>Loading...</div>;

  return (
    <>
      <Router>

        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage accessToken={accessToken} />} />
          <Route path="/game" element={<GamePage accessToken={accessToken}/>} />
        </Routes>  
      </Router>
    </>
  );
}

export default App;