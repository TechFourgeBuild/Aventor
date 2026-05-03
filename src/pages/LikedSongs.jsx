import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { toggleLike, setLikedIds } from "../store/slices/likedSongsSlice";
import { fetchUserLikedSongIds } from "../services/likedSongsService";
import { setSong } from "../store/slices/playerSlice";
import { Heart, ArrowLeft, Music2, Play, Pause } from "lucide-react";

// ── Unsplash fallback images (music / abstract vibes) ────────
const UNSPLASH_BG = [
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=60",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=60",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=60",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=60",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=60",
  "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=60",
];

const LikedSongs = () => {
  // ── Hooks ──────────────────────────────────────────────────
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);
  const [likedSongsWithDetails, setLikedSongsWithDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // ── Redux state ────────────────────────────────────────────
  const { likedIds } = useSelector((s) => s.liked);
  const currentSong = useSelector((s) => s.player.currentSong);
  const isPlaying = useSelector((s) => s.player.isPlaying);
  const { user } = useSelector((s) => s.auth);

  // ========= LOADING LIKED SONG IDs FROM DATABASE ON PAGE LOAD =========
  useEffect(() => {
    const loadLikedIds = async () => {
      if (user?.id) {
        setInitialLoading(true);
        const fetchedIds = await fetchUserLikedSongIds(user.id);
        // console.log("Fetched liked IDs from DB:", fetchedIds); // Debug log
        dispatch(setLikedIds(fetchedIds));
        setInitialLoading(false);
      } else {
        setInitialLoading(false);
      }
    };
    loadLikedIds();
  }, [user?.id, dispatch]);

  // ── Fetching full song details from Supabase using liked IDs ──
  useEffect(() => {
    const fetchLikedSongDetails = async () => {
      // If no liked IDs, clear and return
      if (!likedIds || likedIds.length === 0) {
        setLikedSongsWithDetails([]);
        setLoadingDetails(false);
        return;
      }

      setLoadingDetails(true);

      // console.log("Fetching details for liked IDs:", likedIds);

      // Fetch full song details from songs table
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .in("id", likedIds);

      if (!error && data) {
        // Preserving the order based on likedIds
        const orderedSongs = likedIds
          .map((id) => data.find((song) => song.id === id))
          .filter((song) => song); // Remove any undefined
        console.log("Fetched song details:", orderedSongs.length);
        setLikedSongsWithDetails(orderedSongs);
      } else {
        console.error("Error fetching liked song details:", error);
        setLikedSongsWithDetails([]);
      }

      setLoadingDetails(false);
    };

    fetchLikedSongDetails();
  }, [likedIds]); // Re-run when likedIds change

  // ── Build mosaic: first 6 cover_urls, pad with Unsplash ───
  const mosaicImages = [
    ...likedSongsWithDetails.slice(0, 6).map((s) => s.cover_url),
    ...UNSPLASH_BG,
  ].slice(0, 6);

  // ── Helpers ────────────────────────────────────────────────
  const fmt = (sec) => {
    if (!sec) return "0:00";
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
  };

  // Create a queue of all liked songs and play the selected song
  const playSong = (song) => {
    // Create a queue with ALL liked songs
    const queue = likedSongsWithDetails.map((s) => ({
      id: s.id,
      song_name: s.song_name,
      artist: s.artist,
      album: s.album,
      duration: s.duration,
      file_url: s.file_url,
      cover_url: s.cover_url,
    }));

    // Find the index of the selected song
    const currentIndex = queue.findIndex((s) => s.id === song.id);

    // Dispatch to set the song and queue
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
        queueIndex: currentIndex,
      }),
    );
  };

  // Show loading state while fetching
  if (initialLoading || loadingDetails) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#07070f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07070f",
        color: "#fff",
        fontFamily: "'Outfit', sans-serif",
        overflowX: "hidden",
        paddingBottom: 120,
      }}
    >
      {/* ══════════════════════════════════════════════════════
          GLOBAL STYLES + RESPONSIVE CSS
      ══════════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');

        @keyframes ls-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ls-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ls-eq {
          0%,100% { transform: scaleY(0.35); }
          50%     { transform: scaleY(1); }
        }

        .ls-hero { animation: ls-fade-in 0.6s ease forwards; }
        .ls-row  { animation: ls-fade-up 0.4s ease forwards; opacity: 0; }

        .ls-row:hover { background: rgba(255,255,255,0.06) !important; }
        .ls-unlike { transition: transform 0.2s ease; }
        .ls-unlike:hover { transform: scale(1.25); }

        /* hide album below 560px */
        @media (max-width: 560px) { .ls-col-album { display: none !important; } }
        /* hide duration below 400px */
        @media (max-width: 400px) { .ls-col-dur { display: none !important; } }

        /* compact hero on mobile */
        @media (max-width: 480px) {
          .ls-hero-inner {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .ls-mosaic {
            width: clamp(140px, 55vw, 190px) !important;
            height: clamp(140px, 55vw, 190px) !important;
          }
        }
        /* tighten list padding on very small screens */
        @media (max-width: 380px) {
          .ls-list-wrap { padding: 12px 8px !important; }
          .ls-row       { gap: 8px !important; padding: 7px 4px !important; }
          .ls-cover     { width: 36px !important; height: 36px !important; border-radius: 6px !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
          Full-bleed mosaic background + gradient overlay
      ══════════════════════════════════════════════════════ */}
      <div
        className="ls-hero"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* ── Blurred mosaic wallpaper (6 images) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 2,
            opacity: 0.2,
            filter: "blur(2px)",
            transform: "scale(1.06)",
          }}
        >
          {mosaicImages.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ))}
        </div>

        {/* ── Gradient overlays to blend bg into page ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,7,15,0.5) 0%, rgba(7,7,15,0.9) 65%, #07070f 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(7,7,15,0.55) 0%, transparent 25%, transparent 75%, rgba(7,7,15,0.55) 100%)",
          }}
        />

        {/* ── Hero content ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "clamp(20px, 4vw, 44px) clamp(16px, 5vw, 44px) 40px",
          }}
        >
          {/* ── Back button ── */}
          <button
            onClick={() => navigate("/app")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100,
              color: "rgba(255,255,255,0.65)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              padding: "7px 14px",
              marginBottom: 36,
              fontFamily: "Outfit, sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.13)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.65)";
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* ── 2×3 mosaic cover + metadata ── */}
          <div
            className="ls-hero-inner"
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "clamp(16px, 3vw, 30px)",
            }}
          >
            {/* ── 2-row × 3-col mosaic cover ── */}
            <div
              className="ls-mosaic"
              style={{
                width: "clamp(130px, 18vw, 200px)",
                height: "clamp(130px, 18vw, 200px)",
                borderRadius: 16,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 2,
                flexShrink: 0,
                boxShadow:
                  "0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              {mosaicImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ))}
            </div>

            {/* ── Title, count, badge ── */}
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.38)",
                  marginBottom: 10,
                }}
              >
                Playlist
              </p>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 6vw, 4rem)",
                  fontWeight: 900,
                  margin: "0 0 10px",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  background:
                    "linear-gradient(135deg, #fff 35%, rgba(255,255,255,0.5))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Liked Songs
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.38)",
                  marginBottom: 20,
                }}
              >
                {likedSongsWithDetails.length}{" "}
                {likedSongsWithDetails.length === 1 ? "song" : "songs"}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 16px",
                  borderRadius: 100,
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.22)",
                }}
              >
                <Heart size={12} fill="#a78bfa" color="#a78bfa" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#a78bfa",
                    letterSpacing: "0.04em",
                  }}
                >
                  Your Collection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ── End hero section ── */}

      {/* ══════════════════════════════════════════════════════
          SONG LIST SECTION
      ══════════════════════════════════════════════════════ */}
      <div
        className="ls-list-wrap"
        style={{ padding: "clamp(16px, 3vw, 28px) clamp(12px, 4vw, 40px)" }}
      >
        {/* ── Empty state ── */}
        {likedSongsWithDetails.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              animation: "ls-fade-up 0.5s ease forwards",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(167,139,250,0.08)",
                border: "1px solid rgba(167,139,250,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Music2 size={28} color="rgba(167,139,250,0.45)" />
            </div>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "rgba(255,255,255,0.65)",
                marginBottom: 8,
              }}
            >
              No liked songs yet
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.28)" }}>
              Tap the heart on any song to save it here
            </p>
          </div>
        )}

        {/* ── Column header row ── */}
        {likedSongsWithDetails.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 8px 10px",
              gap: 12,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              marginBottom: 6,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
              #
            </span>
            <span style={{ width: 44, flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0 }}>Title</span>
            <span
              className="ls-col-album"
              style={{ width: 130, flexShrink: 0 }}
            >
              Album
            </span>
            <span
              className="ls-col-dur"
              style={{ width: 40, textAlign: "right", flexShrink: 0 }}
            >
              Time
            </span>
            <span style={{ width: 30, flexShrink: 0 }} />
          </div>
        )}

        {/* ── Song rows ── */}
        {likedSongsWithDetails.map((song, i) => {
          const isActive = currentSong?.id === song.id;
          const isHovered = hoveredId === song.id;

          return (
            // ── Individual song row ──
            <div
              key={song.id}
              className="ls-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 8px",
                borderRadius: 12,
                marginBottom: 2,
                cursor: "default",
                background: isActive ? "rgba(167,139,250,0.07)" : "transparent",
                border: isActive
                  ? "1px solid rgba(167,139,250,0.1)"
                  : "1px solid transparent",
                animationDelay: `${i * 0.04}s`,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={() => setHoveredId(song.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* ── Index / play icon swap ── */}
              <div
                style={{
                  width: 28,
                  textAlign: "center",
                  flexShrink: 0,
                  position: "relative",
                  height: 20,
                }}
              >
                {/* Index number */}
                <span
                  style={{
                    fontSize: 13,
                    color: isActive ? "#a78bfa" : "rgba(255,255,255,0.28)",
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isHovered ? 0 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {isActive && isPlaying ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "flex-end",
                        gap: 2,
                        height: 14,
                      }}
                    >
                      {[1, 2, 3].map((j) => (
                        <span
                          key={j}
                          style={{
                            display: "block",
                            width: 2.5,
                            height: j === 2 ? 14 : 9,
                            background: "#a78bfa",
                            borderRadius: 2,
                            animation: "ls-eq 0.7s ease-in-out infinite",
                            animationDelay: `${j * 0.15}s`,
                            transformOrigin: "bottom",
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    i + 1
                  )}
                </span>
                {/* Play button on hover */}
                <button
                  onClick={() => playSong(song)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.15s",
                    color: "#fff",
                    padding: 0,
                  }}
                >
                  {isActive && isPlaying ? (
                    <Pause size={14} fill="white" color="white" />
                  ) : (
                    <Play
                      size={14}
                      fill="white"
                      color="white"
                      style={{ marginLeft: 2 }}
                    />
                  )}
                </button>
              </div>

              {/* ── Album cover ── */}
              <img
                className="ls-cover"
                src={song.cover_url}
                alt={song.song_name}
                onClick={() => playSong(song)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 0 0 2px #a78bfa, 0 4px 14px rgba(167,139,250,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.4)",
                  transition: "box-shadow 0.2s",
                }}
              />

              {/* ── Song name + artist ── */}
              <div
                style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                onClick={() => playSong(song)}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: isActive ? "#a78bfa" : "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: "0 0 3px",
                    transition: "color 0.2s",
                  }}
                >
                  {song.song_name}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.36)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    margin: 0,
                  }}
                >
                  {song.artist}
                </p>
              </div>

              {/* ── Album — hidden below 560px ── */}
              <span
                className="ls-col-album"
                style={{
                  width: 130,
                  flexShrink: 0,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.28)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {song.album || "—"}
              </span>

              {/* ── Duration — hidden below 400px ── */}
              <span
                className="ls-col-dur"
                style={{
                  width: 40,
                  flexShrink: 0,
                  textAlign: "right",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                {fmt(song.duration)}
              </span>

              {/* ── Unlike button ── */}
              <button
                className="ls-unlike"
                // onClick={() => dispatch(toggleLike(song))}
                onClick={async () => {
                  if (!user?.id) return;
                  // Create a simple song object with just the ID for removal
                  const songObject = {
                    id: song.id,
                    song_name: song.song_name,
                    artist: song.artist,
                    album: song.album,
                    duration: song.duration,
                    cover_url: song.cover_url,
                    file_url: song.file_url,
                  };
                  await dispatch(toggleLike(songObject, user.id));
                }}
                title="Remove from Liked Songs"
                style={{
                  width: 30,
                  flexShrink: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  opacity: isHovered || isActive ? 1 : 0.35,
                  transition: "opacity 0.2s",
                }}
              >
                <Heart size={16} fill="#a78bfa" color="#a78bfa" />
              </button>
            </div>
            // ── End song row ──
          );
        })}
      </div>
      {/* ── End song list section ── */}
    </div>
  );
};

export default LikedSongs;
