import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSong, togglePlay } from "../store/slices/playerSlice";
import { toggleLike, setLikedIds } from "../store/slices/likedSongsSlice";
import {
  ArrowLeft,
  Clock,
  Disc3,
  User,
  Tag,
  Play,
  Heart,
  BookmarkPlus,
  Pause,
} from "lucide-react";
import { fetchUserLikedSongIds } from "../services/likedSongsService";

const SongCredential = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { song } = location.state || {};
  // const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(true);

  // Reading play state from Redux instead of local state
  const currentSong = useSelector((s) => s.player.currentSong);
  const isPlaying = useSelector((s) => s.player.isPlaying);
  const progress = useSelector((s) => s.player.progress);
  const duration = useSelector((s) => s.player.duration);
  const { user } = useSelector((s) => s.auth);

  // Getting liked IDs from Redux
  const likedIds = useSelector((s) => s.liked.likedIds);
  const liked = likedIds.includes(song?.id);

  // This song is "playing" if it's the active song in Redux
  const isThisSongActive = currentSong?.id === song?.id;
  const playing = isThisSongActive && isPlaying;

  // ========= LOAD LIKED SONG IDs FROM DATABASE ON PAGE LOAD =========
  useEffect(() => {
    const loadLikedIds = async () => {
      if (user?.id) {
        const fetchedIds = await fetchUserLikedSongIds(user.id);
        // console.log("SongCredential - Fetched liked IDs:", fetchedIds); // Debug log
        dispatch(setLikedIds(fetchedIds));
      }
      setLoadingLiked(false);
    };
    loadLikedIds();
  }, [user?.id, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlayPause = () => {
    console.log("1. handlePlayPause fired");
    // console.log("2. song.fileUrl:", song.fileUrl);
    console.log("3. isThisSongActive:", isThisSongActive);

    if (!song.fileUrl) {
      console.error("❌ fileUrl is empty — check field mapping");
      return;
    }

    if (isThisSongActive) {
      dispatch(togglePlay());
    } else {
      dispatch(
        setSong({
          id: song.id,
          song_name: song.songName,
          artist: song.artistName,
          album: song.album,
          genre: song.genre,
          duration: song.duration,
          file_url: song.fileUrl,
          cover_url: song.coverImage,
        }),
      );
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!song) {
    navigate("/app");
    return null;
  }

  const details = [
    {
      icon: Clock,
      label: "Duration",
      value: formatDuration(song.duration),
      color: "#f59e0b",
    },
    { icon: User, label: "Artist", value: song.artistName, color: "#ec4899" },
    {
      icon: Disc3,
      label: "Album",
      value: song.album || "Single",
      color: "#8b5cf6",
    },
    { icon: Tag, label: "Genre", value: song.genre || "Pop", color: "#06b6d4" },
  ];

  // Show loading while fetching liked status (optional)
  if (loadingLiked) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0f 0%, #0f0a1a 40%, #0a0f1a 100%)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }

        .anim-up { animation: fadeSlideUp 0.6s ease forwards; }
        .anim-left { animation: fadeSlideLeft 0.6s ease forwards; }
        .d1 { animation-delay: 0.05s; opacity: 0; }
        .d2 { animation-delay: 0.15s; opacity: 0; }
        .d3 { animation-delay: 0.25s; opacity: 0; }
        .d4 { animation-delay: 0.35s; opacity: 0; }
        .d5 { animation-delay: 0.45s; opacity: 0; }
        .d6 { animation-delay: 0.55s; opacity: 0; }

        .vinyl { animation: spin-slow 8s linear infinite; }
        .vinyl.paused { animation-play-state: paused; }

        .bar-anim span { animation: bar 0.8s ease-in-out infinite; }
        .bar-anim span:nth-child(2) { animation-delay: 0.15s; }
        .bar-anim span:nth-child(3) { animation-delay: 0.3s; }
        .bar-anim span:nth-child(4) { animation-delay: 0.45s; }

        .card-hover { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .card-hover:hover { transform: translateY(-5px) scale(1.02); }

        .play-btn { transition: all 0.25s ease; }
        .play-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(245,158,11,0.45) !important; }
        .play-btn:active { transform: scale(0.97); }

        .ghost-btn { transition: all 0.25s ease; }
        .ghost-btn:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }

        @media (min-width: 768px) {
          .hero { flex-direction: row !important; align-items: center; }
          .cover-wrap { width: 300px !important; height: 300px !important; min-width: 300px; }
          .song-info { text-align: left !important; }
          .action-row { justify-content: flex-start !important; }
          .progress-row { max-width: 100% !important; }
        }
        @media (min-width: 1024px) {
          .cover-wrap { width: 360px !important; height: 360px !important; min-width: 360px; }
          .details-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .song-title { font-size: 2.2rem !important; }
          .details-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Ambient blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-8%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "-12%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "35%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,15,0.88)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: "0 auto",
            padding: "15px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() => navigate("/app")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.45)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Outfit, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.45)")
            }
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          {playing && (
            <div
              className="bar-anim"
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
                height: 20,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  style={{
                    display: "block",
                    width: 3,
                    height: 16,
                    background: "linear-gradient(to top, #f59e0b, #ec4899)",
                    borderRadius: 2,
                    transformOrigin: "bottom",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <main
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "48px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero */}
        <div
          className="hero"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 48,
            marginBottom: 0,
          }}
        >
          {/* Vinyl Cover */}
          <div
            className={`anim-left d1 ${mounted ? "anim-left" : ""}`}
            style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}
          >
            <div style={{ position: "relative" }}>
              {/* Spinning glow ring */}
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 0deg, #f59e0b, #ec4899, #8b5cf6, #06b6d4, #f59e0b)",
                  animation: "spin-slow 5s linear infinite",
                  opacity: playing ? 0.65 : 0,
                  transition: "opacity 0.6s ease",
                }}
              />
              {/* Blurred shadow ring */}
              <div
                style={{
                  position: "absolute",
                  inset: 8,
                  borderRadius: "50%",
                  background: "transparent",
                  boxShadow: playing
                    ? "0 0 60px 20px rgba(245,158,11,0.2)"
                    : "none",
                  transition: "box-shadow 0.6s ease",
                }}
              />
              <div
                className={`cover-wrap vinyl ${!playing ? "paused" : ""}`}
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow:
                    "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
                  cursor: "pointer",
                }}
                onClick={handlePlayPause}
              >
                <img
                  src={
                    song.coverImage ||
                    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"
                  }
                  alt={song.songName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {/* Center hole */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#0a0a0f",
                    border: "2px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: playing
                        ? "#f59e0b"
                        : "rgba(255,255,255,0.25)",
                      transition: "background 0.3s",
                    }}
                  />
                </div>
                {/* Hover overlay */}
                <div
                  className="cover-overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  {playing ? (
                    <Pause size={38} fill="white" color="white" />
                  ) : (
                    <Play
                      size={38}
                      fill="white"
                      color="white"
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div
            className={`song-info anim-up d2 ${mounted ? "anim-up" : ""}`}
            style={{ flex: 1, textAlign: "center" }}
          >
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 100,
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.22)",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  display: "block",
                  boxShadow: "0 0 6px #f59e0b",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f59e0b",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Song
              </span>
            </div>

            {/* Title */}
            <h1
              className="song-title"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.4rem, 6vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: 10,
                letterSpacing: "-0.02em",
                color: "#fff",
              }}
            >
              {song.songName}
            </h1>

            <p
              style={{
                fontSize: 17,
                color: "rgba(255,255,255,0.6)",
                marginBottom: 5,
                fontWeight: 400,
              }}
            >
              {song.artistName}
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.28)",
                marginBottom: 30,
                letterSpacing: "0.03em",
              }}
            >
              {song.album || "Single"}
            </p>

            {/* Progress bar */}
            <div
              className="progress-row"
              style={{
                marginBottom: 30,
                maxWidth: 460,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <div
                style={{
                  height: 3,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.07)",
                  overflow: "hidden",
                  marginBottom: 8,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width:
                      isThisSongActive && duration
                        ? `${(progress / duration) * 100}%`
                        : "0%",
                    background: "linear-gradient(90deg, #f59e0b, #ec4899)",
                    borderRadius: 4,
                    transition: "width 0.4s linear",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                  {isThisSongActive
                    ? formatDuration(Math.floor(progress))
                    : "0:00"}
                </span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                  {formatDuration(song.duration)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div
              className="action-row"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              <button
                className="play-btn"
                onClick={handlePlayPause}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 30px",
                  borderRadius: 100,
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "Outfit, sans-serif",
                  boxShadow: "0 8px 28px rgba(245,158,11,0.3)",
                }}
              >
                {playing ? (
                  <>
                    <Pause size={17} fill="white" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={17} fill="white" style={{ marginLeft: 2 }} />
                    Play Now
                  </>
                )}
              </button>

              <button
                className="ghost-btn"
                // onClick={() => setLiked(!liked)}
                onClick={async () => {
                  if (!user?.id) return;
                  const fullSongObject = {
                    id: song.id,
                    song_name: song.songName,
                    artist: song.artistName,
                    album: song.album || "Single",
                    duration: song.duration,
                    cover_url: song.coverImage,
                    file_url: song.fileUrl,
                  };
                  await dispatch(toggleLike(fullSongObject, user.id));
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "13px 20px",
                  borderRadius: 100,
                  background: liked
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${liked ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.09)"}`,
                  color: liked ? "#f59e0b" : "rgba(255,255,255,0.65)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                <span>{liked ? "Liked" : "Like"}</span>
              </button>

              {/* <button
                className="ghost-btn"
                onClick={() => setSaved(!saved)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "13px 20px",
                  borderRadius: 100,
                  background: saved
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${saved ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.09)"}`,
                  color: saved ? "#f59e0b" : "rgba(255,255,255,0.65)",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <BookmarkPlus size={16} />
                <span>{saved ? "Saved" : "Save"}</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            margin: "56px 0 40px",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />

        {/* Details grid */}
        <div className={`anim-up d4 ${mounted ? "anim-up" : ""}`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Track Details
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.06)",
              }}
            />
          </div>

          <div
            className="details-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {details.map(({ icon: Icon, label, value, color }, i) => (
              <div
                key={label}
                className={`card-hover anim-up ${mounted ? "anim-up" : ""}`}
                style={{
                  borderRadius: 18,
                  padding: "22px 22px",
                  background: "rgba(255,255,255,0.035)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animationDelay: `${0.5 + i * 0.08}s`,
                  opacity: mounted ? undefined : 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${color}14`,
                      border: `1px solid ${color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} color={color} />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.28)",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: label === "Duration" ? 26 : 16,
                    fontWeight: label === "Duration" ? 700 : 600,
                    color: "#fff",
                    lineHeight: 1.25,
                    letterSpacing: label === "Duration" ? "0.04em" : "-0.01em",
                  }}
                >
                  {value}
                </p>
                <div
                  style={{
                    marginTop: 14,
                    height: 2,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${color}45, transparent)`,
                    width: "55%",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`anim-up d6 ${mounted ? "anim-up" : ""}`}
          style={{ textAlign: "center", marginTop: 64 }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.13)",
              letterSpacing: "0.05em",
            }}
          >
            © 2024 Aventor Music — All rights reserved
          </p>
        </div>
      </main>
    </div>
  );
};

export default SongCredential;
