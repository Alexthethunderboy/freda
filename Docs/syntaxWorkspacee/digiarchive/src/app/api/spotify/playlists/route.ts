import { NextResponse } from 'next/server';

export async function GET() {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
  const BASIC = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
  const ME_ENDPOINT = 'https://api.spotify.com/v1/me';
  const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

  if (!SPOTIFY_REFRESH_TOKEN) {
    return NextResponse.json({ playlists: [], message: "No Refresh Token" });
  }

  try {
    const getAccessToken = async () => {
      const resp = await fetch(TOKEN_ENDPOINT, {
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
      return resp.json();
    };

    const tokenData = await getAccessToken();
    if (tokenData.error) {
       console.error('[SPOTIFY] Token Error:', tokenData.error);
       return NextResponse.json({ playlists: [], error: `Token Error: ${tokenData.error}` });
    }
    
    const access_token = tokenData.access_token;
    const headers = { Authorization: `Bearer ${access_token}` };
    
    // 1. Get User Profile
    const meRes = await fetch(ME_ENDPOINT, { headers });
    if (!meRes.ok) {
       const err = await meRes.text();
       console.error('[SPOTIFY] Profile Error:', err);
       return NextResponse.json({ playlists: [], error: "Profile Access Failed" });
    }
    const me = await meRes.json();
    const userId = me.id;
    const profileUrl = me.external_urls.spotify;

    // 2. Fetch ALL Playlists
    let allPlaylists: any[] = [];
    let nextUrl = `${PLAYLISTS_ENDPOINT}?limit=50`;

    while (nextUrl) {
      const res = await fetch(nextUrl, { headers });
      if (!res.ok) {
        console.error('[SPOTIFY] Playlists Pagination Error');
        break;
      }
      const data = await res.json();
      allPlaylists = [...allPlaylists, ...data.items];
      nextUrl = data.next;
    }

    // 3. Filter Logic
    const featuredIds = process.env.SPOTIFY_FEATURED_PLAYLIST_IDS?.split(',').map(id => id.trim()) || [];
    
    let filteredPlaylists = allPlaylists.filter((item: any) => {
      if (!item) return false;
      const isPublic = item.public !== false; 
      const isFeatured = featuredIds.includes(item.id);
      const isOwned = item.owner.id === userId;
      return isPublic && (isOwned || isFeatured || featuredIds.length === 0);
    });

    if (filteredPlaylists.length === 0 && allPlaylists.length > 0) {
      filteredPlaylists = allPlaylists.slice(0, 10); 
    }

    // Sort by tracks (highest first)
    filteredPlaylists.sort((a: any, b: any) => (b.tracks?.total || 0) - (a.tracks?.total || 0));

    const playlists = filteredPlaylists.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.images?.[0]?.url || item.images?.[1]?.url || null,
        url: item.external_urls.spotify,
        tracks: item.tracks.total
    }));

    return NextResponse.json({ playlists, profileUrl });
  } catch (error) {
    console.error('[SPOTIFY] Critical Error:', error);
    return NextResponse.json({ playlists: [], error: "System Signal Lost" });
  }
}
