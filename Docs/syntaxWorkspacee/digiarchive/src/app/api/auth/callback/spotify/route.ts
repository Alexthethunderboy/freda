import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/api/auth/callback/spotify';
// In production, this should be an environment variable

const SCOPES = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-read-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-top-read'
].join(' ');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Step 1: Redirect to Spotify Login
  if (!code) {
    if (!SPOTIFY_CLIENT_ID) {
      return NextResponse.json({ error: 'Missing SPOTIFY_CLIENT_ID' }, { status: 500 });
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
    });

    return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
  }

  // Step 2: Exchange Code for Tokens
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error, description: data.error_description }, { status: 400 });
    }

    // Return the tokens so the user can copy them to .env
    return NextResponse.json({
      message: 'Success! Copy these to your .env file',
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 });
  }
}
