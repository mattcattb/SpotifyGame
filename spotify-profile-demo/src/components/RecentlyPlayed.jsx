import React from 'react';

const RecentlyPlayed = ({ tracks }) => {
  return (
    <div>
      <h2>Recently Played Tracks</h2>
      <ul>
        {tracks.map((item, index) => (
          <li key={index}>
            <p><strong>{item.track.name}</strong> by {item.track.artists.map(artist => artist.name).join(', ')}</p>
            <p>Played at: {new Date(item.played_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyPlayed;