

function Profile({ profile }) {
  return (
    <div id="profile">
      <h2>Logged in as <span>{profile.display_name}</span></h2>
      {profile.images[0] && (
        <div id="avatar">
          <img src={profile.images[0].url} alt="Profile" width="200" height="200" />
          <p>Profile Image URL: <span>{profile.images[0].url}</span></p>
        </div>
      )}
      <ul>
        <li>User ID: <span>{profile.id}</span></li>
        <li>Email: <span>{profile.email}</span></li>
        <li>Spotify URI: <a href={profile.external_urls.spotify}>{profile.uri}</a></li>
        <li>Link: <a href={profile.href}>{profile.href}</a></li>
      </ul>
    </div>
  );
};

export default Profile;