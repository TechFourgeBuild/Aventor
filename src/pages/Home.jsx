import { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import {
  Music2,
  Play,
  Heart,
  ListMusic,
  Search,
  Zap,
  ChevronRight,
  Shuffle,
  SkipForward,
  SkipBack,
  Radio,
  Headphones,
  Menu,
  X,
} from "lucide-react";

const MOODS = [
  { name: "Happy", count: 14, emoji: "😊", accent: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)" },
  { name: "Sad", count: 7, emoji: "😢", accent: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.2)" },
  { name: "Energetic", count: 11, emoji: "⚡", accent: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.2)" },
  { name: "Chill", count: 10, emoji: "😌", accent: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.2)" },
  { name: "Focus", count: 11, emoji: "🎯", accent: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.2)" },
  { name: "Nostalgic", count: 10, emoji: "💭", accent: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.2)" },
  { name: "Intense", count: 8, emoji: "🔥", accent: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.2)" },
  { name: "Romantic", count: 6, emoji: "💕", accent: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.2)" },
  { name: "Workout", count: 10, emoji: "💪", accent: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.2)" },
];

const FEATURES = [
  { icon: Heart, color: "#f43f5e", bg: "rgba(244,63,94,0.12)", title: "Like What You Love", desc: "Save your favourite tracks instantly. Your liked songs, always one tap away." },
  { icon: ListMusic, color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", title: "Your Playlists", desc: "Craft the perfect playlist for every moment. No limits, no rules." },
  { icon: Search, color: "#06b6d4", bg: "rgba(6,182,212,0.12)", title: "Instant Search", desc: "Find any song, artist or mood in milliseconds. Your music, on demand." },
  { icon: Zap, color: "#f59e0b", bg: "rgba(245,158,11,0.12)", title: "Mood-Based Discovery", desc: "Nine curated moods. 85 handpicked tracks. Match the music to the moment." },
];

const MOCK_SONGS = [
  { name: "Chaiyya Chaiyya", artist: "Sukhwinder Singh", mood: "Energetic", grad: "linear-gradient(135deg,#7c3aed,#ec4899)", active: true },
  { name: "Khairiyat", artist: "Arijit Singh", mood: "Sad", grad: "linear-gradient(135deg,#3b82f6,#6366f1)", active: false },
  { name: "Made In India", artist: "Guru Randhawa", mood: "Happy", grad: "linear-gradient(135deg,#f59e0b,#ef4444)", active: false },
];

const EqBars = () => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
    {[6, 12, 8, 14, 6].map((h, i) => (
      <div
        key={i}
        style={{
          width: 2.5,
          height: h,
          borderRadius: 2,
          background: "linear-gradient(to top,#7c3aed,#ec4899)",
          animation: `barAnim 0.6s ease-in-out infinite`,
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

const Blob = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.12,
      ...style,
    }}
  />
);

const STATS = [
  { v: "87+", l: "Tracks" },
  { v: "9", l: "Moods" },
  { v: "∞", l: "Playlists" },
  { v: "HD", l: "Quality" },
];

export default function Home() {
//   const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const gradText = {
    background: "linear-gradient(135deg,#c4b5fd 0%,#f472b6 45%,#fbbf24 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const btnPrimary = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "clamp(14px, 2vw, 16px) clamp(24px, 4vw, 32px)",
    borderRadius: 14,
    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 20px 60px rgba(124,58,237,0.35)",
    fontFamily: "inherit",
    transition: "all .3s",
  };

  const btnGhost = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "clamp(14px, 2vw, 16px) clamp(22px, 3.5vw, 28px)",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.82)",
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: "-0.01em",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all .3s",
  };

  const sectionBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 16px",
    borderRadius: 50,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 20,
  };

  const shell = {
    minHeight: "100vh",
    background: "#080811",
    color: "#fff",
    fontFamily: "'Inter',system-ui,sans-serif",
    overflowX: "hidden",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  };

  const container = {
    width: "100%",
    maxWidth: 1440,
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "clamp(16px, 4vw, 48px)",
    paddingRight: "clamp(16px, 4vw, 48px)",
  };

  return (
    <div style={shell}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        @keyframes barAnim{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.3)}}
        @keyframes blobA{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.06)}}
        @keyframes blobB{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,20px) scale(1.08)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .8s ease forwards;opacity:0}
        .d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}
        .mc:hover{transform:translateY(-4px)!important;background:rgba(255,255,255,0.07)!important}
        .fi:hover{transform:translateX(4px)!important;background:rgba(255,255,255,0.05)!important;border-color:rgba(255,255,255,.12)!important}
        .btng:hover{background:rgba(255,255,255,.1)!important;color:#fff!important}
        .btnp:hover{transform:translateY(-2px)!important;box-shadow:0 30px 70px rgba(124,58,237,.45)!important}
        .nav-a:hover{color:#fff!important}
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,60px);align-items:center}
        .hero-h1{font-size:clamp(2.25rem,4vw + 1.25rem,4.5rem);line-height:1.02;letter-spacing:-0.035em}
        .section-h2{font-size:clamp(1.75rem,2.5vw + 1rem,3rem);line-height:1.08;letter-spacing:-0.03em}
        .cta-h2{font-size:clamp(2rem,3.5vw + 1rem,3.5rem);letter-spacing:-0.035em}
        .moods-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
        .feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(32px,5vw,60px);align-items:center}
        .player-card{width:min(100%,320px);margin-left:auto;margin-right:auto}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
        .nav-links{display:flex;gap:clamp(16px,3vw,32px);align-items:center}
        .nav-cta{display:flex;gap:10px;align-items:center;flex-shrink:0}
        .brand-block{display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0}
        .tagline{font-size:11px;color:rgba(255,255,255,0.38);margin-left:4px;white-space:nowrap}
        @media(max-width:1024px){
          .moods-grid{grid-template-columns:repeat(3,1fr)}
        }
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr}
          .player-right{order:-1;padding-bottom:8px}
          .feat-grid{grid-template-columns:1fr}
          .feat-mock{max-width:560px;margin-left:auto;margin-right:auto}
          .tagline{display:none}
        }
        @media(max-width:768px){
          .nav-links-desktop{display:none!important}
          .nav-burger{display:flex!important}
          .moods-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(min-width:769px){
          .nav-burger{display:none!important}
          .mobile-drawer{display:none!important}
        }
        @media(max-width:480px){
          .moods-grid{grid-template-columns:1fr}
          .stat-divider{display:none!important}
          .stats-row{gap:20px 24px!important;justify-content:flex-start!important}
          .player-float{display:none!important}
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "14px 0",
          background: scrolled ? "rgba(8,8,17,.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
          transition: "all .4s",
        }}
      >
        <div style={{ ...container }} className="nav-inner">
          <div className="brand-block">
            <div
            className="rounded-3xl"
              style={{
                width: 66,
                height: 66,
                borderRadius: 10,
                // background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            > 
              {/* <Music2 size={18} color="white" /> */}
              <img src="/AventorLogo.png" alt="logo" className="w-[53px] mix-blend-screen  h-[53px]  object-cover "/>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>Aventor</span>
            <span className="tagline">· Your Rhythm. Your Realm.</span>
          </div>

          <div className="nav-links nav-links-desktop" style={{ flex: 1, justifyContent: "center" }}>
            {["Moods", "Features", "About"].map((l) => (
              <NavLink
                key={l}
                to={`#${l.toLowerCase()}`}
                className="nav-a"
                style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color .2s" }}
              >
                {l}
              </NavLink>
            ))}
          </div>

          <div className="nav-cta nav-links-desktop">
            <NavLink to="/login">
            <button
              type="button"
            //   onClick={() => navigate("/login")}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.12)",
                background: "transparent",
                color: "rgba(255,255,255,.78)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Log in
            </button>
            </NavLink>
            <NavLink to="/signup">
            <button
              type="button"
            //   onClick={() => navigate("/signup")}
              style={{
                padding: "9px 20px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Get Started
            </button>
            </NavLink>
          </div>

          <button
            type="button"
            className="nav-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="mobile-drawer"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            paddingTop: 72,
            background: "rgba(6,6,12,0.97)",
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 8,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 32,
          }}
        >
          {["Moods", "Features", "About"].map((l) => (
            <NavLink
              key={l}
              to={`${l.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
                padding: "14px 16px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {l}
            </NavLink>
          ))}
          <NavLink to="/login">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
            //   navigate("/login");
            }}
            style={{
              marginTop: 8,
              padding: "14px 20px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.12)",
              background: "transparent",
              color: "rgba(255,255,255,.85)",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Log in
          </button>
          </NavLink>

          <NavLink to="/signup">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
            //   navigate("/signup");
            }}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              background: "linear-gradient(135deg,#7c3aed,#ec4899)",
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Get Started
          </button>
          </NavLink>
        </div>
      )}

      <section style={{ minHeight: "100vh", paddingTop: "clamp(88px,12vh,120px)", paddingBottom: "clamp(48px,8vh,80px)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <Blob style={{ width: "min(600px,90vw)", height: "min(600px,90vw)", background: "#7c3aed", top: -200, left: "-10%", animation: "blobA 8s ease-in-out infinite" }} />
          <Blob style={{ width: "min(500px,85vw)", height: "min(500px,85vw)", background: "#ec4899", bottom: -200, right: "-10%", animation: "blobB 10s ease-in-out infinite" }} />
          <Blob style={{ width: 300, height: 300, background: "#f59e0b", top: "45%", left: "42%", animation: "blobA 12s ease-in-out infinite reverse" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div style={{ ...container }} className="hero-grid">
          <div>
            <div
              className="fu d1"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 16px",
                borderRadius: 50,
                border: "1px solid rgba(167,139,250,.35)",
                background: "rgba(167,139,250,.1)",
                color: "#c4b5fd",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 28,
              }}
            >
              <span className="mt-4" style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", animation: "pulse 2s infinite" }} />
              87 Tracks · 9 Moods · Stream Free
            </div>
            <h1 className="fu d2 hero-h1" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: 24, textShadow: "0 2px 40px rgba(0,0,0,0.35)" }}>
              Your <span style={gradText}>Rhythm.</span>
              <br />
              Your <span style={gradText}>Realm.</span>
            </h1>
            <p
              className="fu d3"
              style={{
                fontSize: "clamp(15px,1.5vw,17px)",
                lineHeight: 1.75,
                fontWeight: 400,
                color: "rgba(255,255,255,0.68)",
                maxWidth: 520,
                marginBottom: 40,
                letterSpacing: "-0.01em",
              }}
            >
              Aventor is where music meets mood. Stream 87 handpicked tracks across 9 curated moods — built for how you actually feel, not just what&apos;s trending.
            </p>
            <div className="fu d4" style={{ display: "flex", gap: 14, marginBottom: 48, flexWrap: "wrap" }}>
              <NavLink to="/signup">
              <button type="button" className="btnp" /*onClick={() => navigate("/signup")}*/ style={btnPrimary}>
                <Play size={16} fill="white" color="white" />
                Get Started Free
              </button>
              </NavLink>
              <NavLink to="/login">
              <button type="button" className="btng" /*onClick={() => navigate("/login")}*/ style={btnGhost}>
                Log In
              </button>
              </NavLink>
            </div>
            <div className="fu d5 stats-row" style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start" }}>
              {STATS.map((s, i) => (
                <Fragment key={s.l}>
                  {i > 0 && (
                    <div
                      className="stat-divider"
                      style={{ width: 1, background: "rgba(255,255,255,.1)", alignSelf: "stretch", flexShrink: 0 }}
                    />
                  )}
                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(1.35rem,2vw,1.75rem)", ...gradText, lineHeight: 1.1 }}>{s.v}</div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.45)",
                        marginTop: 4,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="player-right" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
              <div style={{ position: "absolute", inset: -30, background: "radial-gradient(ellipse at center,rgba(124,58,237,.28),transparent 70%)", pointerEvents: "none" }} />
              <div
                className="player-float"
                style={{
                  position: "absolute",
                  top: -12,
                  right: "clamp(-20px, -2vw, -30px)",
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "rgba(15,15,30,.96)",
                  border: "1px solid rgba(255,255,255,.1)",
                  backdropFilter: "blur(20px)",
                  animation: "floatY 4s ease-in-out infinite",
                  zIndex: 10,
                  maxWidth: "min(200px, 45vw)",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 4 }}>Now Trending</div>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>Chaiyya Chaiyya</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.48)", marginTop: 2 }}>Energetic · 4 min</div>
              </div>
              <div
                className="player-float"
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: "clamp(-16px, -1vw, -40px)",
                  padding: "10px 14px",
                  borderRadius: 14,
                  background: "rgba(15,15,30,.96)",
                  border: "1px solid rgba(255,255,255,.1)",
                  backdropFilter: "blur(20px)",
                  animation: "floatY 5s ease-in-out infinite reverse",
                  zIndex: 10,
                  maxWidth: "min(180px, 42vw)",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 4 }}>Your Mood</div>
                <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.02em" }}>Chill 😌</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.48)", marginTop: 2 }}>10 tracks ready</div>
              </div>

              <div
                className="player-card"
                style={{
                  borderRadius: 24,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "rgba(255,255,255,.04)",
                  backdropFilter: "blur(40px)",
                  boxShadow: "0 40px 80px rgba(0,0,0,.5),0 0 60px rgba(124,58,237,.15)",
                }}
              >
                <div
                  style={{
                    height: "clamp(160px, 28vw, 200px)",
                    background: "linear-gradient(135deg,#7c3aed 0%,#ec4899 50%,#f59e0b 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "conic-gradient(from 0deg,#1a1a2e,#16213e,#0f3460,#1a1a2e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 40px rgba(0,0,0,.5)",
                      animation: "spin 8s linear infinite",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Music2 size={13} color="rgba(255,255,255,.85)" />
                    </div>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 10px",
                      borderRadius: 20,
                      background: "rgba(0,0,0,.45)",
                      backdropFilter: "blur(10px)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.88)",
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", animation: "pulse 1.5s infinite" }} />
                    Now Playing
                  </div>
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, letterSpacing: "-0.02em" }}>Khairiyat</div>
                      <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.52)", lineHeight: 1.4 }}>Arijit Singh · Chhichhore</div>
                    </div>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "rgba(244,63,94,.15)",
                        border: "1px solid rgba(244,63,94,.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Heart size={14} fill="#f43f5e" color="#f43f5e" />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ height: 3, background: "rgba(255,255,255,.1)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ height: "100%", width: "38%", background: "linear-gradient(90deg,#7c3aed,#ec4899)", borderRadius: 4 }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 500, fontVariantNumeric: "tabular-nums", color: "rgba(255,255,255,0.4)" }}>
                      <span>1:42</span>
                      <span>4:17</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <Shuffle size={16} color="rgba(255,255,255,.35)" style={{ cursor: "pointer" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <SkipBack size={16} color="rgba(255,255,255,.55)" />
                      </div>
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 8px 24px rgba(124,58,237,.4)",
                        }}
                      >
                        <Play size={20} fill="white" color="white" style={{ marginLeft: 2 }} />
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <SkipForward size={16} color="rgba(255,255,255,.55)" />
                      </div>
                    </div>
                    <EqBars />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="moods" style={{ paddingTop: "clamp(64px,10vw,100px)", paddingBottom: "clamp(64px,10vw,100px)" }}>
        <div style={{ ...container, textAlign: "center", marginBottom: 56 }}>
          <div style={{ ...sectionBadge, marginLeft: "auto", marginRight: "auto" }}>
            <Radio size={12} strokeWidth={2.25} />
            Browse by Mood
          </div>
          <h2 className="section-h2" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: 16 }}>
            Music for <span style={gradText}>Every Feeling</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(15px,1.4vw,17px)",
              color: "rgba(255,255,255,0.62)",
              fontWeight: 400,
              lineHeight: 1.75,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
              letterSpacing: "-0.01em",
            }}
          >
            Nine distinct moods. 87 handpicked tracks for every state of mind.
          </p>
        </div>
        <div style={container}>
          <div className="moods-grid" style={{ marginBottom: 40 }}>
            {MOODS.map((m) => (
              <div
                key={m.name}
                className="mc"
                role="button"
                tabIndex={0}
                // onClick={() => navigate("/signup")}
                // onKeyDown={(e) => e.key === "Enter" && navigate("/signup")}
                style={{
                  borderRadius: 18,
                  padding: "20px 18px",
                  border: `1px solid ${m.border}`,
                  background: m.accent,
                  cursor: "pointer",
                  transition: "all .3s",
                  position: "relative",
                  overflow: "hidden",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 28, marginBottom: 12, display: "block", lineHeight: 1 }}>{m.emoji}</span>
                <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.02em", marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.48)" }}>{m.count} tracks</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <NavLink to="/signup">
            <button type="button" 
            // onClick={() => navigate("/signup")}
             className="btng" style={{ ...btnGhost, fontSize: 14, padding: "12px 24px" }}>
              Explore All Moods <ChevronRight size={14} />
            </button>
            </NavLink>
          </div>
        </div>
      </section>

      <section id="features" style={{ paddingTop: "clamp(48px,6vw,60px)", paddingBottom: "clamp(64px,10vw,100px)" }}>
        <div style={container} className="feat-grid">
          <div>
            <div style={sectionBadge}>
              <Zap size={12} strokeWidth={2.25} />
              Features
            </div>
            <h2 className="section-h2" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, marginBottom: 16 }}>
              Everything you need,
              <br />
              <span style={gradText}>nothing you don&apos;t.</span>
            </h2>
            <p
              style={{
                fontSize: "clamp(15px,1.4vw,17px)",
                color: "rgba(255,255,255,0.62)",
                fontWeight: 400,
                lineHeight: 1.75,
                marginBottom: 36,
                letterSpacing: "-0.01em",
              }}
            >
              Powerful features that stay out of your way.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="fi"
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: 20,
                      borderRadius: 16,
                      border: "1px solid rgba(255,255,255,.07)",
                      background: "rgba(255,255,255,.025)",
                      transition: "all .3s",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: f.bg,
                        color: f.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} color={f.color} strokeWidth={2.25} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, letterSpacing: "-0.02em" }}>{f.title}</div>
                      <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="feat-mock" style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 5 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 6,
                  background: "rgba(255,255,255,.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.32)",
                }}
              >
                aventor.music
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(255,255,255,.07)",
                  marginBottom: 14,
                }}
              >
                <Search size={14} color="rgba(255,255,255,.3)" />
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.38)" }}>Search songs, artists, moods...</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                {["All", "Happy", "Chill", "Focus", "Intense"].map((c, i) => (
                  <div
                    key={c}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      background: i === 0 ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "rgba(255,255,255,.04)",
                      border: i === 0 ? "none" : "1px solid rgba(255,255,255,.08)",
                      color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
              {MOCK_SONGS.map((song) => (
                <div
                  key={song.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 4,
                    cursor: "pointer",
                    background: song.active ? "rgba(255,255,255,.06)" : "transparent",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: song.grad,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Music2 size={15} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {song.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.48)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {song.artist}
                    </div>
                  </div>
                  {song.active ? (
                    <EqBars />
                  ) : (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: 20,
                        background: "rgba(255,255,255,.08)",
                        color: "rgba(255,255,255,0.45)",
                        flexShrink: 0,
                      }}
                    >
                      {song.mood}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Music2 size={13} color="white" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: "rgba(255,255,255,0.88)",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Chaiyya Chaiyya
                </div>
                <div style={{ height: 2, borderRadius: 2, background: "rgba(255,255,255,.1)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "35%", background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
                </div>
              </div>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Play size={10} fill="white" color="white" style={{ marginLeft: 1 }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" style={{ paddingTop: "clamp(64px,10vw,100px)", paddingBottom: "clamp(64px,10vw,100px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(600px,90vw)", height: 400, background: "radial-gradient(ellipse,rgba(124,58,237,.15),transparent 70%)", pointerEvents: "none" }} />
        <div style={container}>
          <div style={{ ...sectionBadge, margin: "0 auto 28px" }}>
            <Headphones size={12} strokeWidth={2.25} />
            Start Listening Today
          </div>
          <h2 className="cta-h2" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, lineHeight: 1.08, maxWidth: 640, margin: "0 auto 20px", textShadow: "0 2px 32px rgba(0,0,0,0.25)" }}>
            Ready to find your
            <br />
            <span style={gradText}>perfect rhythm?</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(15px,1.5vw,17px)",
              color: "rgba(255,255,255,0.62)",
              maxWidth: 440,
              margin: "0 auto 40px",
              fontWeight: 400,
              lineHeight: 1.75,
              letterSpacing: "-0.01em",
            }}
          >
            Join Aventor. Free forever. No credit card needed. Just pure music, curated for you.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <NavLink to="/signup">
            <button type="button" className="btnp"
            //  onClick={() => navigate("/signup")} 
             style={btnPrimary}>
              <Play size={16} fill="white" color="white" />
              Create Free Account
            </button>
            </NavLink>
            <NavLink to="/login">
            <button type="button" className="btng"
            //  onClick={() => navigate("/login")} 
             style={btnGhost}>
              Already have an account? Log In
            </button>
            </NavLink>
          </div>
        </div>
      </section>

      <footer style={{ padding: "32px 0", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                width: 53,
                height: 53,
                borderRadius: 8,
                // background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Music2 size={14} color="white" /> */}
               <img src="/AventorLogo.png" alt="logo" className="object-cover "/>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>Aventor</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>· Your Rhythm. Your Realm.</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.38)" }}>© 2026 Aventor. Built with 💖 for music lovers.</div>
        </div>
      </footer>
    </div>
  );
}
