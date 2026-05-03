import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../services/supabase";
import { setSong } from "../store/slices/playerSlice";
import SongCard from "@/reactComponents/SongCard";

const MOODS = [
  { id: "sad", label: "Sad", icon: "🌧️", color: "#818cf8" },
  { id: "happy", label: "Happy", icon: "☀️", color: "#fbbf24" },
  { id: "energetic", label: "Energetic", icon: "⚡", color: "#f87171" },
  { id: "chill", label: "Chill", icon: "🌊", color: "#22d3ee" },
  { id: "focus", label: "Focus", icon: "🎯", color: "#a78bfa" },
  { id: "nostalgic", label: "Nostalgic", icon: "🎞️", color: "#fb7185" },
  { id: "intense", label: "Intense", icon: "🔥", color: "#fb923c" },
  { id: "workout", label: "Workout", icon: "💪", color: "#34d399" },
  { id: "romantic", label: "Romantic", icon: "🌹", color: "#f472b6" },
];

const Moods = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [active, setActive] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

   // ========= Tracking window width properly =========
    const [windowWidth, setWindowWidth] = useState(
      typeof window !== "undefined" ? window.innerWidth : 0,
    );
  
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  // Fetching songs by mood
  useEffect(() => {
    const fetchSongsByMood = async () => {
      if (!active) {
        setSongs([]);
        return;
      }

      setLoading(true);
      const moodLabel = MOODS.find((m) => m.id === active)?.label;

      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .ilike("genre", moodLabel) // Case-insensitive matching
        .order("song_name");

      if (!error && data) {
        setSongs(data);
      } else {
        console.error("Error fetching songs:", error);
        setSongs([]);
      }
      setLoading(false);
    };

    fetchSongsByMood();
  }, [active]);

  // Play a specific song from the mood playlist
  const playSong = (song, index) => {
    // Create queue with all songs from this mood
    const queue = songs.map((s) => ({
      id: s.id,
      song_name: s.song_name,
      artist: s.artist,
      album: s.album,
      duration: s.duration,
      file_url: s.file_url,
      cover_url: s.cover_url,
    }));

    dispatch(
      setSong({
        id: song.id,
        song_name: song.song_name,
        artist: song.artist,
        album: song.album,
        duration: song.duration,
        file_url: song.file_url,
        cover_url: song.cover_url,
        queue: queue,
        queueIndex: index,
      }),
    );
  };

  // Play all songs from current mood (start from first)
  const playAllSongs = () => {
    if (songs.length === 0) return;
    playSong(songs[0], 0);
  };

  const activeMood = MOODS.find((m) => m.id === active);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080811",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          onClick={() => navigate("/app")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.7)",
            padding: "7px 14px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          ← Back
        </button>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              background: "linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 900,
            }}
          >
            Moods
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              marginTop: 2,
            }}
          >
            Pick a vibe, play the soundtrack
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 20px", maxWidth: 900, margin: "0 auto" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: 800,
            margin: "0 0 6px",
            letterSpacing: "-0.03em",
          }}
        >
          How are you{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a855f7, #ec4899, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            feeling?
          </span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            margin: "0 0 28px",
          }}
        >
          Select a mood to explore its playlist.
        </p>

        {/* Mood Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {MOODS.map((m) => {
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActive(isActive ? null : m.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "24px 12px",
                  borderRadius: 14,
                  border: isActive
                    ? `1.5px solid ${m.color}`
                    : "1.5px solid rgba(255,255,255,0.08)",
                  background: isActive
                    ? `${m.color}18`
                    : "rgba(255,255,255,0.03)",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  outline: "none",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
              >
                <span style={{ fontSize: 34 }}>{m.icon}</span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isActive ? m.color : "rgba(255,255,255,0.75)",
                  }}
                >
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected mood section - Playlist with Song Cards */}
        {active && activeMood && (
          <div style={{ marginTop: 40 }}>
            {/* Mood Banner */}
            <div
              style={{
                padding: "18px 20px",
                borderRadius: 12,
                background: `${activeMood.color}12`,
                border: `1px solid ${activeMood.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 26 }}>{activeMood.icon}</span>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: activeMood.color,
                    }}
                  >
                    {activeMood.label} Playlist
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.4)",
                      marginTop: 2,
                    }}
                  >
                    {songs.length} {songs.length === 1 ? "song" : "songs"} found
                  </div>
                </div>
              </div>
              <button
                onClick={playAllSongs}
                disabled={songs.length === 0}
                style={{
                  background: activeMood.color,
                  border: "none",
                  borderRadius: 8,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: 13,
                  padding: "9px 24px",
                  cursor: songs.length === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  opacity: songs.length === 0 ? 0.5 : 1,
                }}
              >
                ▶ Play All
              </button>
            </div>

            {/* Songs Grid - Like AppHome */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px" }}>
                <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
                  Loading songs...
                </p>
              </div>
            ) : songs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                No songs found for this mood yet.
              </div>
            ) : (
              <div className="flex justify-center items-center flex-wrap gap-4">
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    windowWidth={windowWidth}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Moods;
