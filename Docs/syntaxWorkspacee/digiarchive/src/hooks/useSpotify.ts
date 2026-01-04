'use client';

import { useState, useEffect } from 'react';

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  id?: string;
  energy?: number;
  tempo?: number;
}

interface Playlist {
  id: string;
  name: string;
  image: string | null;
  url: string;
  tracks: number;
}

interface TopTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  url: string;
}

interface TopArtist {
  id: string;
  name: string;
  genres: string[];
  image: string;
  url: string;
  popularity: number;
}

export function useSpotify() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Now Playing
        const nowPlayingRes = await fetch('/api/spotify/now-playing');
        if (nowPlayingRes.ok) {
          const nowPlayingData = await nowPlayingRes.json();
          setData(nowPlayingData);
        } else {
            setData({
                isPlaying: false,
                title: "Silence",
                artist: "Thunderboy",
                album: "",
                albumImageUrl: "",
                songUrl: "",
                id: "",
                energy: 0.5,
                tempo: 120,
            });
        }

        // Fetch Playlists & Top Items
        const [playlistsRes, topRes] = await Promise.all([
          fetch('/api/spotify/playlists'),
          fetch('/api/spotify/top')
        ]);

        if (playlistsRes.ok) {
          const playlistsData = await playlistsRes.json();
          setPlaylists(playlistsData.playlists || []);
          setProfileUrl(playlistsData.profileUrl || null);
        }

        if (topRes.ok) {
          const topData = await topRes.json();
          setTopTracks(topData.tracks || []);
          setTopArtists(topData.artists || []);
          setError(topData.suggestion || null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Spotify data", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s polling to avoid rate limits
    return () => clearInterval(interval);
  }, []);

  return { data, playlists, topTracks, topArtists, profileUrl, loading, error };
}
