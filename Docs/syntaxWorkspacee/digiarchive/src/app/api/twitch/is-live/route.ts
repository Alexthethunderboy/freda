import { NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const CHANNEL_NAME = process.env.TWITCH_CHANNEL_NAME || 'alexthethunderboy';

async function getTwitchToken() {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) return null;

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  // If we have credentials, try real check
  if (TWITCH_CLIENT_ID && TWITCH_CLIENT_SECRET) {
    try {
      const token = await getTwitchToken();
      if (!token) return NextResponse.json({ isLive: false });

      const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${CHANNEL_NAME}`, {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
      });

      const { data } = await res.json();
      const isLive = data && data.length > 0;

      return NextResponse.json({ 
        isLive,
        streamTitle: isLive ? data[0].title : null,
        viewerCount: isLive ? data[0].viewer_count : 0
      });
    } catch (e) {
      console.error("Twitch API Error:", e);
      return NextResponse.json({ isLive: false });
    }
  }

  // Fallback: No credentials = Not Live
  // (Removed random mock to avoid confusion)
  return NextResponse.json({ 
    isLive: false,
    message: "Twitch credentials missing in .env" 
  });
}
