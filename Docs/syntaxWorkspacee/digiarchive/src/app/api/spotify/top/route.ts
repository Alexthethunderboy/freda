import { NextResponse } from 'next/server';

const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10';
const TOP_ARTISTS_ENDPOINT = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10';

async function getAccessToken() {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
  const BASIC = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

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
  const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ tracks: [], artists: [], message: "No Refresh Token" });
  }

  try {
    const { access_token } = await getAccessToken();
    const headers = { Authorization: `Bearer ${access_token}` };

    let tracksData = { items: [] };
    let artistsData = { items: [] };
    let errorStatus = null;

    try {
      const tracksRes = await fetch(TOP_TRACKS_ENDPOINT, { headers });
      if (tracksRes.status === 403) errorStatus = 403;
      if (tracksRes.ok) tracksData = await tracksRes.json();
      
      // Fallbacks
      if (!tracksData.items || tracksData.items.length === 0) {
        const fbRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10', { headers });
        if (fbRes.ok) tracksData = await fbRes.json();
        
        if (!tracksData.items || tracksData.items.length === 0) {
          const fbRes2 = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10', { headers });
          if (fbRes2.ok) tracksData = await fbRes2.json();
        }
      }
    } catch (e) { console.error("Tracks fetch error", e); }

    try {
      const artistsRes = await fetch(TOP_ARTISTS_ENDPOINT, { headers });
      if (artistsRes.status === 403) errorStatus = 403;
      if (artistsRes.ok) artistsData = await artistsRes.json();

      // Fallbacks
      if (!artistsData.items || artistsData.items.length === 0) {
        const fbRes = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10', { headers });
        if (fbRes.ok) artistsData = await fbRes.json();

        if (!artistsData.items || artistsData.items.length === 0) {
          const fbRes2 = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10', { headers });
          if (fbRes2.ok) artistsData = await fbRes2.json();
        }
      }
    } catch (e) { console.error("Artists fetch error", e); }

    // If we got a 403, it's likely a missing scope 'user-top-read'
    if (errorStatus === 403) {
      return NextResponse.json({ 
        tracks: [], 
        artists: [], 
        error: "Scope Check required",
        suggestion: "Please ensure your refresh token includes 'user-top-read' scope." 
      });
    }

    const tracks = (tracksData.items || []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a: any) => a.name).join(', '),
      album: track.album.name,
      image: track.album.images[0]?.url,
      url: track.external_urls.spotify,
    }));

    const artists = (artistsData.items || []).map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres.slice(0, 2),
      image: artist.images[0]?.url,
      url: artist.external_urls.spotify,
      popularity: artist.popularity
    }));

    return NextResponse.json({ tracks, artists });
  } catch (error) {
    console.error('Error fetching top tracks/artists:', error);
    return NextResponse.json({ tracks: [], artists: [] });
  }
}
