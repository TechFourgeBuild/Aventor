import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlay,
  setProgress,
  setVolume,
  nextSong,
  prevSong,
} from "../store/slices/playerSlice";
import { toggleLike } from "../store/slices/likedSongsSlice";
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  ListMusic,
  Disc3,
} from "lucide-react";

const FullPlayer = ({ onClose, audioRef }) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, progress, duration, queue } =
    useSelector((s) => s.player);
  const { likedIds } = useSelector((s) => s.liked);
  const { user } = useSelector((s) => s.auth);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  // Calculate if current song is liked
  const isLiked = currentSong ? likedIds.includes(currentSong.id) : false;

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;

  const seek = (e) => {
    if (!audioRef?.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    audioRef.current.currentTime = ratio * duration;
    dispatch(setProgress(ratio * duration));
  };

  if (!currentSong) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#080810",
        fontFamily: "'Outfit', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes fp-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes eq-bar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }

        .fp-anim { animation: fp-in 0.45s cubic-bezier(0.22,1,0.36,1) forwards; }
        .fp-d1 { animation-delay: 0.05s; opacity: 0; }
        .fp-d2 { animation-delay: 0.12s; opacity: 0; }
        .fp-d3 { animation-delay: 0.2s; opacity: 0; }

        .vinyl-spin { animation: spin-slow 10s linear infinite; }
        .vinyl-spin.paused { animation-play-state: paused; }

        .fp-ctrl {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.45); border-radius: 50%; padding: 8px;
          transition: all 0.2s ease;
        }
        .fp-ctrl:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .fp-ctrl.active { color: #f59e0b; }

        .fp-play {
          width: 64px; height: 64px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(135deg, #f59e0b, #ec4899);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(245,158,11,0.4);
          transition: all 0.2s ease;
        }
        .fp-play:hover { transform: scale(1.07); box-shadow: 0 12px 40px rgba(245,158,11,0.55); }
        .fp-play:active { transform: scale(0.95); }

        .fp-seek {
          position: relative; height: 4px; border-radius: 8px;
          background: rgba(255,255,255,0.1); cursor: pointer; width: 100%;
          transition: height 0.15s ease;
        }
        .fp-seek:hover { height: 6px; }
        .fp-seek-fill {
          height: 100%; border-radius: 8px;
          background: linear-gradient(90deg, #f59e0b, #ec4899);
          position: relative;
        }
        .fp-seek-fill::after {
          content: ''; position: absolute; right: -6px; top: 50%; transform: translateY(-50%);
          width: 14px; height: 14px; border-radius: 50%; background: #fff;
          box-shadow: 0 0 8px rgba(245,158,11,0.5);
          opacity: 0; transition: opacity 0.15s;
        }
        .fp-seek:hover .fp-seek-fill::after { opacity: 1; }

        .queue-item {
          display: flex; align-items: center; gap: 12; padding: 10px 12px; border-radius: 12px;
          cursor: pointer; transition: background 0.2s ease;
        }
        .queue-item:hover { background: rgba(255,255,255,0.06); }
        .queue-item.active { background: rgba(245,158,11,0.1); }
      `}</style>

      {/* BG blur from cover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: `url(${currentSong.cover_url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(80px) saturate(0.5)",
          transform: "scale(1.2)",
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "rgba(8,8,16,0.82)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Outfit, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.6)")
            }
          >
            <ChevronDown size={20} />
            <span>Collapse</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Now Playing
            </span>
          </div>

          {/* <button
            className={`fp-ctrl ${showQueue ? "active" : ""}`}
            onClick={() => setShowQueue(!showQueue)}
          >
            <ListMusic size={18} />
          </button> */}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Player */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 32px 32px",
              gap: 32,
            }}
          >
            {/* Vinyl */}
            <div className="fp-anim fp-d1" style={{ position: "relative" }}>
              {/* Glow ring */}
              <div
                style={{
                  position: "absolute",
                  inset: -6,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(from 0deg, #f59e0b, #ec4899, #8b5cf6, #06b6d4, #f59e0b)",
                  animation: "spin-slow 5s linear infinite",
                  opacity: isPlaying ? 0.6 : 0,
                  transition: "opacity 0.5s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 10,
                  borderRadius: "50%",
                  boxShadow: isPlaying
                    ? "0 0 80px 20px rgba(245,158,11,0.18)"
                    : "none",
                  transition: "box-shadow 0.5s ease",
                }}
              />
              <div
                className={`vinyl-spin ${!isPlaying ? "paused" : ""}`}
                style={{
                  width: "min(260px, 42vw)",
                  height: "min(260px, 42vw)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow:
                    "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => dispatch(togglePlay())}
              >
                <img
                  src={currentSong.cover_url}
                  alt={currentSong.song_name}
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
                    background: "#080810",
                    border: "2px solid rgba(255,255,255,0.1)",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: isPlaying
                        ? "#f59e0b"
                        : "rgba(255,255,255,0.2)",
                      transition: "background 0.3s",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Song info */}
            <div
              className="fp-anim fp-d2"
              style={{ textAlign: "center", width: "100%", maxWidth: 460 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <h2
                    style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                      fontWeight: 400,
                      color: "#fff",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      marginBottom: 4,
                    }}
                  >
                    {currentSong.song_name}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 400,
                    }}
                  >
                    {currentSong.artist}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (!user?.id || !currentSong) return;
                    const songObject = {
                      id: currentSong.id,
                      song_name: currentSong.song_name,
                      artist: currentSong.artist,
                      album: currentSong.album,
                      duration: currentSong.duration,
                      cover_url: currentSong.cover_url,
                      file_url: currentSong.file_url,
                    };
                    await dispatch(toggleLike(songObject, user.id));
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 8,
                    borderRadius: "50%",
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <Heart
                    size={22}
                    color={isLiked  ? "#f59e0b" : "rgba(255,255,255,0.3)"}
                    fill={isLiked  ? "#f59e0b" : "none"}
                  />
                </button>
              </div>

              {/* Album badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: 24,
                }}
              >
                <Disc3 size={11} color="rgba(255,255,255,0.35)" />
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {currentSong.album || "Single"}
                </span>
              </div>

              {/* Seek bar */}
              <div style={{ marginBottom: 12 }}>
                <div className="fp-seek" onClick={seek}>
                  <div
                    className="fp-seek-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}
                  >
                    {fmt(progress)}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}
                  >
                    {fmt(duration)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <button
                  className={`fp-ctrl ${shuffle ? "active" : ""}`}
                  onClick={() => setShuffle(!shuffle)}
                >
                  <Shuffle size={17} />
                </button>
                <button
                  className="fp-ctrl"
                  style={{ padding: 10 }}
                  onClick={() => dispatch(prevSong())}
                >
                  <SkipBack
                    size={22}
                    fill="currentColor"
                    color="rgba(255,255,255,0.7)"
                  />
                </button>
                <button
                  className="fp-play"
                  onClick={() => dispatch(togglePlay())}
                >
                  {isPlaying ? (
                    <Pause size={24} fill="white" color="white" />
                  ) : (
                    <Play
                      size={24}
                      fill="white"
                      color="white"
                      style={{ marginLeft: 3 }}
                    />
                  )}
                </button>
                <button
                  className="fp-ctrl"
                  style={{ padding: 10 }}
                  onClick={() => dispatch(nextSong())}
                >
                  <SkipForward
                    size={22}
                    fill="currentColor"
                    color="rgba(255,255,255,0.7)"
                  />
                </button>
                <button
                  className={`fp-ctrl ${repeat ? "active" : ""}`}
                  onClick={() => setRepeat(!repeat)}
                >
                  <Repeat size={17} />
                </button>
              </div>

              {/* Volume */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  justifyContent: "center",
                }}
              >
                {/* <button className="fp-ctrl" style={{ padding: 4 }} onClick={() => setMuted(!muted)}>
                  {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button> */}
                {/* // ✅ fix — dispatch to Redux so PlayerBar's audio actually
                responds */}
                <button
                  className="fp-ctrl"
                  style={{ padding: 4 }}
                  onClick={() => {
                    if (volume > 0) {
                      dispatch(setVolume(0)); // actually mutes the audio
                    } else {
                      dispatch(setVolume(0.8)); // restore to 80%
                    }
                  }}
                >
                  {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
                <div
                  style={{
                    position: "relative",
                    height: 3,
                    borderRadius: 4,
                    background: "rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    width: 120,
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = Math.max(
                      0,
                      Math.min(1, (e.clientX - rect.left) / rect.width),
                    );
                    dispatch(setVolume(ratio));
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${volume * 100}%`, // ← add this back
                      background: "linear-gradient(90deg, #f59e0b, #ec4899)",
                      borderRadius: 4,
                      transition: "width 0.2s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Queue panel */}
          {showQueue && (
            <div
              style={{
                width: 300,
                borderLeft: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(20px)",
                display: "flex",
                flexDirection: "column",
                animation: "fp-in 0.3s ease forwards",
              }}
            >
              <div
                style={{
                  padding: "20px 16px 12px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Queue
                </h3>
              </div>
              <div
                style={{ flex: 1, overflowY: "auto", padding: "8px 8px 80px" }}
              >
                {queue.length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.2)",
                      fontSize: 13,
                      marginTop: 40,
                    }}
                  >
                    Queue is empty
                  </p>
                )}
                {queue.map((s, i) => {
                  const isActive = s.id === currentSong.id;
                  return (
                    <div
                      key={s.id}
                      className={`queue-item ${isActive ? "active" : ""}`}
                    >
                      <img
                        src={s.cover_url}
                        alt={s.song_name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: isActive ? "#f59e0b" : "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginBottom: 2,
                          }}
                        >
                          {s.song_name}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.35)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {s.artist}
                        </p>
                      </div>
                      {isActive && isPlaying && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            gap: 2,
                            height: 16,
                            flexShrink: 0,
                          }}
                        >
                          {[1, 2, 3].map((j) => (
                            <span
                              key={j}
                              style={{
                                display: "block",
                                width: 2,
                                height: 12,
                                background: "#f59e0b",
                                borderRadius: 2,
                                transformOrigin: "bottom",
                                animation: `eq-bar 0.7s ease-in-out infinite`,
                                animationDelay: `${j * 0.12}s`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullPlayer;
