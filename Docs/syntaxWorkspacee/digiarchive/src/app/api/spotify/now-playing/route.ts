import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const BASIC = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const AUDIO_FEATURES_ENDPOINT = 'https://api.spotify.com/v1/audio-features/';

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASIC}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN!,
    }),
  });

  return response.json();
}

export async function GET() {
  if (!SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ isPlaying: false, message: "No Refresh Token" });
  }

  try {
    const { access_token } = await getAccessToken();
    
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await response.json();

    if (song.item === null) {
      return NextResponse.json({ isPlaying: false });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist: any) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;
    const id = song.item.id;

    // Fetch Audio Features (Energy and Tempo)
    let energy = 0.5;
    let tempo = 120;
    
    try {
      const featuresResponse = await fetch(`${AUDIO_FEATURES_ENDPOINT}${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (featuresResponse.ok) {
        const features = await featuresResponse.json();
        energy = features.energy;
        tempo = features.tempo;
      }
    } catch (e) {
      console.error('Error fetching audio features:', e);
    }

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
      id,
      energy,
      tempo,
    });
  } catch (error) {
    console.error('Error fetching currently playing song:', error);
    return NextResponse.json({ isPlaying: false });
  }
}
