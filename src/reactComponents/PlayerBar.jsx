import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  togglePlay,
  setProgress,
  setDuration,
  setVolume,
  nextSong,
  prevSong,
  clearSong,
} from "../store/slices/playerSlice";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronUp,
  Repeat,
  Shuffle,
  X,
} from "lucide-react";
import FullPlayer from "./FullPlayer";

const PlayerBar = () => {

  const dispatch = useDispatch();
  const { currentSong, isPlaying, volume, progress, duration } = useSelector(
    (s) => s.player,
  );
  const audioRef = useRef(null);
  const [showFull, setShowFull] = useState(false);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [dragging, setDragging] = useState(false);

  /* ── Sync song source ── */
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = currentSong.file_url;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play().catch(() => {});
  }, [currentSong]);

  /* ── Sync play/pause ── */
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  /* ── Sync volume ── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

   // Preventing the PlayerBar to get render even user is not logged in
  const { user } = useSelector((s) => s.auth);  
  if (!user) return null;                       
  // ----------------------------------------------

  const handleTimeUpdate = () => {
    if (!audioRef.current || dragging) return;
    dispatch(setProgress(audioRef.current.currentTime));
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    dispatch(setDuration(audioRef.current.duration));
  };

  const handleEnded = () => {

    if (repeat && audioRef.current) {
      // Repeat current song
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      // Play next song in queue
      dispatch(nextSong());
    }
  };

  const seek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    const newTime = ratio * duration;
    audioRef.current.currentTime = newTime;
    dispatch(setProgress(newTime));
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;

  // console.log("PlayerBar rendered, currentSong:", currentSong);

  if (!currentSong) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Full Player overlay */}
      {showFull && (
        <FullPlayer onClose={() => setShowFull(false)} audioRef={audioRef} />
      )}

      {/* Player Bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          fontFamily: "'Outfit', sans-serif",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

          @keyframes bar {
            0%, 100% { transform: scaleY(0.35); }
            50% { transform: scaleY(1); }
          }
          .eq-bar span { animation: bar 0.75s ease-in-out infinite; }
          .eq-bar span:nth-child(2) { animation-delay: 0.12s; }
          .eq-bar span:nth-child(3) { animation-delay: 0.24s; }

          .ctrl-btn {
            background: none; border: none; cursor: pointer;
            color: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;
            border-radius: 50%; transition: all 0.2s ease; padding: 6px;
          }
          .ctrl-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
          .ctrl-btn.active { color: #f59e0b; }

          .play-ctrl {
            background: linear-gradient(135deg, #f59e0b, #ec4899);
            border: none; cursor: pointer;
            width: 42px; height: 42px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 4px 16px rgba(245,158,11,0.35);
            flex-shrink: 0;
          }
          .play-ctrl:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(245,158,11,0.5); }
          .play-ctrl:active { transform: scale(0.96); }

          .seek-track {
            position: relative; height: 3px; border-radius: 4px;
            background: rgba(255,255,255,0.1); cursor: pointer; flex: 1;
            transition: height 0.15s ease;
          }
          .seek-track:hover { height: 5px; }
          .seek-fill {
            height: 100%; border-radius: 4px;
            background: linear-gradient(90deg, #f59e0b, #ec4899);
            pointer-events: none;
            position: relative;
          }
          .seek-fill::after {
            content: '';
            position: absolute; right: -4px; top: 50%; transform: translateY(-50%);
            width: 10px; height: 10px; border-radius: 50%;
            background: #fff;
            box-shadow: 0 0 6px rgba(245,158,11,0.6);
            opacity: 0; transition: opacity 0.15s ease;
          }
          .seek-track:hover .seek-fill::after { opacity: 1; }

          .vol-track {
            position: relative; height: 3px; border-radius: 4px;
            background: rgba(255,255,255,0.1); cursor: pointer; width: 80px;
          }
          .vol-track:hover { height: 4px; }

          .song-meta-text {
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }
          @media (max-width: 640px) {
            .bar-right { display: none !important; }
            .bar-center-extra { display: none !important; }
            .vol-section { display: none !important; }
          }
          @media (max-width: 900px) {
            .shuffle-repeat { display: none !important; }
          }

          @media (max-width: 480px) {
  .bar-center-extra { display: none !important; }
  .bar-right { display: none !important; }
  .shuffle-repeat { display: none !important; }
  .pb-song-name { font-size: 12px !important; }
}
@media (max-width: 380px) {
  .play-ctrl { width: 36px !important; height: 36px !important; }
}
        `}</style>

        {/* Top seek bar */}
        <div
          className="seek-track"
          style={{ borderRadius: 0, height: 2, cursor: "pointer", margin: 0 }}
          onClick={seek}
        >
          <div
            className="seek-fill"
            style={{ width: `${progressPct}%`, borderRadius: 0 }}
          />
        </div>

        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "10px 20px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* LEFT — Song info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 0,
              cursor: "pointer",
            }}
            onClick={() => setShowFull(true)}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={currentSong.cover_url}
                alt={currentSong.song_name}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  objectFit: "cover",
                  display: "block",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              />
              {isPlaying && (
                <div
                  className="eq-bar"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.45)",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: 2,
                    padding: "0 0 6px",
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      style={{
                        display: "block",
                        width: 3,
                        height: 12,
                        background: "#f59e0b",
                        borderRadius: 2,
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                className="song-meta-text"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 2,
                }}
              >
                {currentSong.song_name}
              </p>
              <p
                className="song-meta-text"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}
              >
                {currentSong.artist}
              </p>
            </div>

            <div style={{ marginLeft: 4, flexShrink: 0 }}>
              <ChevronUp size={14} color="rgba(255,255,255,0.3)" />
            </div>
          </div>

          {/* CENTER — Controls */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                className={`ctrl-btn shuffle-repeat ${shuffle ? "active" : ""}`}
                onClick={() => setShuffle(!shuffle)}
              >
                <Shuffle size={15} />
              </button>
              <button className="ctrl-btn" onClick={() => dispatch(prevSong())}>
                <SkipBack size={18} fill="currentColor" />
              </button>
              <button
                className="play-ctrl"
                onClick={() => dispatch(togglePlay())}
              >
                {isPlaying ? (
                  <Pause size={18} fill="white" color="white" />
                ) : (
                  <Play
                    size={18}
                    fill="white"
                    color="white"
                    style={{ marginLeft: 2 }}
                  />
                )}
              </button>
              <button className="ctrl-btn" onClick={() => dispatch(nextSong())}>
                <SkipForward size={18} fill="currentColor" />
              </button>
              <button
                className={`ctrl-btn shuffle-repeat ${repeat ? "active" : ""}`}
                onClick={() => setRepeat(!repeat)}
              >
                <Repeat size={15} />
              </button>
            </div>

            {/* Time + seek */}
            <div
              className="bar-center-extra"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: 320,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  width: 34,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {fmt(progress)}
              </span>
              <div className="seek-track" onClick={seek}>
                <div
                  className="seek-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  width: 34,
                  flexShrink: 0,
                }}
              >
                {fmt(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT — Volume */}
          <div
            className="bar-right"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <div
              className="vol-section"
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <button className="ctrl-btn" onClick={() => setMuted(!muted)}>
                {muted || volume === 0 ? (
                  <VolumeX size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>
              <div
                className="vol-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.max(
                    0,
                    Math.min(1, (e.clientX - rect.left) / rect.width),
                  );
                  dispatch(setVolume(ratio));
                  setMuted(false);
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(muted ? 0 : volume) * 100}%`,
                    background: "linear-gradient(90deg, #f59e0b, #ec4899)",
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerBar;
