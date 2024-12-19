import { fetchRecentlyPlayed } from "../api/history";

export async function getRandomSongs(accessToken, N) {


  const res = await fetchRecentlyPlayed(accessToken);
  console.log(res);
  const array_songs = res.map((item) => 
  ({
    name:item.track.name, 
    id:item.track.id, 
    popularity:item.track.popularity
  }))

  var choices = [];
  var i = 0;

  //! check if there are enough unique songs for this!

  while (i < N){
    const randomIndex = Math.floor(Math.random() * array_songs.length);
    const random_song = array_songs[randomIndex];

    if (!choices.some(song => song.id === random_song.id)) {
      choices.push(random_song);
      i += 1;
    }
  }

  return choices;
}
