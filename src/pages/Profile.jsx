import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { supabase } from "../services/supabase";
import {
  ArrowLeft,
  Camera,
  Check,
  X,
  Mail,
  FileText,
  Music2,
  Edit3,
  Loader2,
  Shield,
  LogOut,
} from "lucide-react";
import {
  setProfile,
  updateDisplayName,
  updateAvatarUrl,
  updateUserBio,
} from "../store/slices/profileSlice";
import { createSelector } from "@reduxjs/toolkit";
import { setLikedIds } from "../store/slices/likedSongsSlice";
import { fetchUserLikedSongIds } from "../services/likedSongsService";
import {
  compressAvatarImage,
  deleteOldAvatar,
} from "../services/imageCompressionService";
import { logout } from "../store/slices/authSlice";

// ── Fallback avatar (Unsplash abstract person) ───────────────
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&q=80";

const selectUser = (state) => state.auth.user;
const selectLikedIds = (state) => state.liked.likedIds; // ← Getting liked IDs array
const selectLikedSongsCount = (state) => state.liked.likedIds?.length || 0; // ← Getting count

const Profile = () => {
  // ── Router ────────────────────────────────────────────────
  const navigate = useNavigate();

  // ── Memoized selectors ────────────────────────────────────
  const user = useSelector(selectUser); // ← ADD THIS LINE - YOU'RE MISSING THIS!
  const likedSongsCount = useSelector(selectLikedSongsCount);

  // ── Component state ───────────────────────────────────────
  const [displayName, setDisplayName] = useState(""); // editable name
  const [bio, setBio] = useState(""); // editable bio (max 30 words)
  const [avatarUrl, setAvatarUrl] = useState(""); // resolved avatar URL
  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saveMsg, setSaveMsg] = useState(""); // flash message

  // ── Refs ──────────────────────────────────────────────────
  const fileInputRef = useRef(null); // triggers avatar file picker
  const bioRef = useRef(null); // auto-resize textarea

  // ═════════════════════════════════════════════════════════
  // EFFECT: Fetch profile row from Supabase when user loads
  // ═════════════════════════════════════════════════════════

  const dispatch = useDispatch();

  // Update the fetchProfile useEffect to dispatch to Redux:
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const profileData = {
          displayName:
            data.display_name ||
            user?.user_metadata?.display_name ||
            user?.user_metadata?.full_name ||
            user?.email?.split("@")[0] ||
            "User",
          avatarUrl:
            data.avatar_url ||
            user?.user_metadata?.avatar_url ||
            DEFAULT_AVATAR,
          userBio: data.user_bio || "",
        };

        setDisplayName(profileData.displayName);
        setBio(profileData.userBio);
        setAvatarUrl(profileData.avatarUrl);

        // ← DISPATCH TO REDUX
        dispatch(setProfile(profileData));
      } else {
        const profileData = {
          displayName:
            user?.user_metadata?.display_name ||
            user?.user_metadata?.full_name ||
            user?.email?.split("@")[0] ||
            "User",
          avatarUrl: user?.user_metadata?.avatar_url || DEFAULT_AVATAR,
          userBio: "",
        };

        setDisplayName(profileData.displayName);
        setAvatarUrl(profileData.avatarUrl);

        // ← DISPATCH TO REDUX
        dispatch(setProfile(profileData));

        // Create profile row in database
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            display_name: profileData.displayName,
            avatar_url: profileData.avatarUrl,
            user_bio: "",
          },
          { onConflict: "id" },
        );
      }
    };

    fetchProfile();
  }, [user, dispatch]);

  // useEffect after fetchProfile useEffect 

  useEffect(() => {
    const loadLikedSongs = async () => {
      if (user?.id) {
        const likedIds = await fetchUserLikedSongIds(user.id);
        dispatch(setLikedIds(likedIds));
      }
    };
    loadLikedSongs();
  }, [user?.id, dispatch]);

  // ─────────────────────────────────────────────────────────
  // HELPER: Auto-expand bio textarea height as user types
  // ─────────────────────────────────────────────────────────
  const autoResizeBio = () => {
    if (bioRef.current) {
      bioRef.current.style.height = "auto";
      bioRef.current.style.height = bioRef.current.scrollHeight + "px";
    }
  };

  // ─────────────────────────────────────────────────────────
  // HELPER: Word count for bio (limit = 30 words)
  // ─────────────────────────────────────────────────────────
  const bioWordCount =
    bio.trim() === "" ? 0 : bio.trim().split(/\s+/).filter(Boolean).length;
  const bioTooLong = bioWordCount > 30;

  // ─────────────────────────────────────────────────────────
  // HELPER: Derive initials from display name
  // ─────────────────────────────────────────────────────────
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ─────────────────────────────────────────────────────────
  // HELPER: Format join date
  // ─────────────────────────────────────────────────────────
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  // ═════════════════════════════════════════════════════════
  // ACTION: Save display_name + user_bio to Supabase
  // ═════════════════════════════════════════════════════════

  const handleSave = async () => {
    if (!user?.id || bioTooLong) return;
    setSaving(true);
    setSaveMsg("");

    // 1. Update profiles table
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name: displayName.trim(),
        user_bio: bio.trim(),
        avatar_url: avatarUrl,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      setSaving(false);
      setSaveMsg("error:Failed to save profile.");
      return;
    }

    // 2. Update Supabase Auth user_metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        display_name: displayName.trim(),
        full_name: displayName.trim(),
        avatar_url: avatarUrl,
        user_bio: bio.trim(),
      },
    });

    // 3. UPDATE REDUX
    dispatch(updateDisplayName(displayName.trim()));
    dispatch(updateUserBio(bio.trim()));

    setSaving(false);

    if (authError) {
      setSaveMsg("error:Profile saved in app but auth sync failed.");
    } else {
      setSaveMsg("success:Profile saved successfully!");
      setEditingName(false);
      setEditingBio(false);
      setTimeout(() => setSaveMsg(""), 3500);
    }
  };

  // ═════════════════════════════════════════════════════════
  // ACTION: Upload avatar → Supabase storage → update profile
  // ═════════════════════════════════════════════════════════

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveMsg("error:Please select a valid image file.");
      return;
    }

    // Validate original file size (max 5 MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMsg("error:Image must be under 5 MB.");
      return;
    }

    setUploadingImg(true);
    setSaveMsg("");

    try {
      // 🔥 DELETE OLD AVATAR FIRST (if exists and not default)
      if (
        avatarUrl &&
        avatarUrl !== DEFAULT_AVATAR &&
        !avatarUrl.includes("unsplash.com")
      ) {
        await deleteOldAvatar(user.id, avatarUrl);
      }

      // Compress the image to under 80KB
      const compressedFile = await compressAvatarImage(file, 80);

      console.log(`Original size: ${(file.size / 1024).toFixed(2)} KB`);
      console.log(
        `Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`,
      );

      // Upload compressed file to "avatars" bucket
      const fileExt = compressedFile.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, {
          upsert: true,
          contentType: "image/jpeg",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setSaveMsg("error:Image upload failed.");
        setUploadingImg(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) {
        setSaveMsg("error:Could not retrieve image URL.");
        setUploadingImg(false);
        return;
      }

      // 1. Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, avatar_url: publicUrl }, { onConflict: "id" });

      if (profileError) {
        console.error("Profile update error:", profileError);
        setSaveMsg("error:Failed to update profile.");
        setUploadingImg(false);
        return;
      }

      // 2. Update Supabase Auth user_metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          avatar_url: publicUrl,
          display_name: displayName,
          full_name: displayName,
        },
      });

      // 3. UPDATE REDUX
      dispatch(updateAvatarUrl(publicUrl));
      setAvatarUrl(publicUrl);
      setUploadingImg(false);

      if (authError) {
        setSaveMsg("error:Avatar updated but auth sync failed.");
      } else {
        setSaveMsg(
          `success:Profile picture updated! (${(compressedFile.size / 1024).toFixed(1)} KB)`,
        );
      }
      setTimeout(() => setSaveMsg(""), 3500);
    } catch (error) {
      console.error("Compression error:", error);
      setSaveMsg("error:Failed to process image.");
      setUploadingImg(false);
    }
  };

  // ═════════════════════════════════════════════════════════
  // ACTION: Logout user
  // ═════════════════════════════════════════════════════════
  const handleLogout = async () => {
    setSaveMsg("");

    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Clear Redux auth state
      dispatch(logout());

      // Clear any stored session data
      localStorage.removeItem("supabase.auth.token");

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setSaveMsg("error:Failed to logout. Please try again.");
      setTimeout(() => setSaveMsg(""), 3500);
    }
  };

  // ── Parse saveMsg type/text ───────────────────────────────
  const msgType = saveMsg.startsWith("success:") ? "success" : "error";
  const msgText = saveMsg.replace(/^(success|error):/, "");

  // ═════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════
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
      {/* ══════════════════════════════════════════════════
          GLOBAL CSS — animations, shared classes, responsive
      ══════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400&display=swap');

        /* ── Keyframes ── */
        @keyframes pf-up   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pf-in   { from{opacity:0} to{opacity:1} }
        @keyframes pf-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pf-ring {
          0%,100% { box-shadow: 0 0 0 3px rgba(167,139,250,0.25), 0 16px 50px rgba(0,0,0,0.6); }
          50%     { box-shadow: 0 0 0 6px rgba(167,139,250,0.12), 0 16px 50px rgba(0,0,0,0.6); }
        }

        /* ── Utility animation classes ── */
        .pf-hero { animation: pf-in 0.55s ease forwards; }
        .pf-d1   { animation: pf-up 0.5s ease 0.05s forwards; opacity:0; }
        .pf-d2   { animation: pf-up 0.5s ease 0.12s forwards; opacity:0; }
        .pf-d3   { animation: pf-up 0.5s ease 0.20s forwards; opacity:0; }
        .pf-d4   { animation: pf-up 0.5s ease 0.28s forwards; opacity:0; }
        .pf-spin { animation: pf-spin 1s linear infinite; }

        /* ── Avatar: show camera overlay on hover ── */
        .pf-av-wrap:hover .pf-cam { opacity:1 !important; }

        /* ── Shared input / textarea ── */
        .pf-inp {
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          padding: 11px 14px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s;
          resize: none;
        }
        .pf-inp:focus { border-color: rgba(167,139,250,0.6); }
        .pf-inp::placeholder { color: rgba(255,255,255,0.22); }

        /* ── Buttons ── */
        .pf-btn-save {
          display:inline-flex; align-items:center; gap:7px;
          padding: 10px 22px; border-radius:100px;
          background: linear-gradient(135deg, #a78bfa, #ec4899);
          border:none; color:#fff;
          font-family:'Outfit',sans-serif; font-size:14px; font-weight:600;
          cursor:pointer; transition: transform 0.2s, box-shadow 0.2s;
        }
        .pf-btn-save:hover  { transform:translateY(-2px); box-shadow:0 8px 24px rgba(167,139,250,0.4); }
        .pf-btn-save:active { transform:scale(0.97); }
        .pf-btn-save:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

        .pf-btn-cancel {
          display:inline-flex; align-items:center; gap:7px;
          padding: 10px 22px; border-radius:100px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.55);
          font-family:'Outfit',sans-serif; font-size:14px; font-weight:500;
          cursor:pointer; transition:all 0.2s;
        }
        .pf-btn-cancel:hover { background:rgba(255,255,255,0.12); color:#fff; }

        .pf-edit-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:8px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.38); font-size:12px; font-weight:500;
          cursor:pointer; transition:all 0.2s;
          font-family:'Outfit',sans-serif;
        }
        .pf-edit-pill:hover { background:rgba(167,139,250,0.1); border-color:rgba(167,139,250,0.3); color:#a78bfa; }

        .pf-inline-edit {
          background:none; border:none; cursor:pointer;
          color:rgba(255,255,255,0.3); padding:3px;
          transition:color 0.2s;
        }
        .pf-inline-edit:hover { color:#a78bfa; }

        /* ── Stat card hover ── */
        .pf-stat {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:18px; padding:20px;
          transition:all 0.25s ease; cursor:default;
        }
        .pf-stat:hover {
          background:rgba(167,139,250,0.06);
          border-color:rgba(167,139,250,0.18);
          transform:translateY(-3px);
        }

        /* ── Divider ── */
        .pf-divider {
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);
          margin: 24px 0;
        }

        /* ── Responsive breakpoints ── */
        @media(max-width:600px) {
          .pf-hero-row  { flex-direction:column !important; align-items:center !important; text-align:center !important; }
          .pf-hero-meta { align-items:center !important; }
          .pf-stats     { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:380px) {
          .pf-stats     { grid-template-columns:1fr !important; }
          .pf-hero-pad  { padding:18px 14px 28px !important; }
          .pf-body-pad  { padding:14px 12px !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          HERO SECTION
          Blurred avatar as bg wallpaper + gradient overlay
      ══════════════════════════════════════════════════ */}
      <div
        className="pf-hero"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* ── Blurred avatar wallpaper ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${avatarUrl || DEFAULT_AVATAR})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "blur(48px) saturate(0.5)",
            transform: "scale(1.12)",
            opacity: 0.22,
          }}
        />

        {/* ── Bottom-to-top dark fade ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,7,15,0.35) 0%, rgba(7,7,15,0.85) 55%, #07070f 100%)",
          }}
        />

        {/* ── Ambient top-right glow ── */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -60,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Hero content ── */}
        <div
          className="pf-hero-pad"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "clamp(20px,4vw,48px) clamp(16px,5vw,48px) 44px",
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
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              padding: "8px 16px",
              marginBottom: 40,
              fontFamily: "Outfit,sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.13)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            <ArrowLeft size={15} /> Back
          </button>

          {/* ── Avatar + name/email row ── */}
          <div
            className="pf-hero-row"
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "clamp(20px,3vw,36px)",
            }}
          >
            {/* ── Avatar circle with upload overlay ── */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />

              {/* Avatar */}
              <div
                className="pf-av-wrap"
                onClick={() => !uploadingImg && fileInputRef.current?.click()}
                style={{
                  width: "clamp(88px,15vw,128px)",
                  height: "clamp(88px,15vw,128px)",
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  animation: "pf-ring 3s ease-in-out infinite",
                }}
              >
                {/* Image — falls back to DEFAULT_AVATAR via onError */}
                <img
                  src={avatarUrl || DEFAULT_AVATAR}
                  alt={displayName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />

                {/* Initials shown when no avatar URL yet */}
                {!avatarUrl && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg,#a78bfa,#ec4899)",
                      fontSize: "clamp(22px,4vw,34px)",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {initials}
                  </div>
                )}

                {/* Camera overlay — visible on hover ── */}
                <div
                  className="pf-cam"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.52)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    opacity: 0,
                    transition: "opacity 0.25s",
                  }}
                >
                  {uploadingImg ? (
                    <Loader2 size={24} className="pf-spin" color="white" />
                  ) : (
                    <>
                      <Camera size={22} color="white" />
                      <span
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.9)",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                        }}
                      >
                        CHANGE
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Small "verified" shield badge at bottom-right of avatar ── */}
              <div
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#a78bfa,#7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  border: "2px solid #07070f",
                }}
              >
                <Shield size={11} color="white" />
              </div>
            </div>

            {/* ── Name + email + join date ── */}
            <div
              className="pf-hero-meta"
              style={{
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              {/* Editable display name ── */}
              {editingName ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  <input
                    className="pf-inp"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={40}
                    autoFocus
                    style={{
                      fontSize: "clamp(1.3rem,3.5vw,1.8rem)",
                      fontWeight: 700,
                      maxWidth: 280,
                      padding: "8px 12px",
                    }}
                  />
                  <button
                    className="pf-inline-edit"
                    onClick={() => setEditingName(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h1
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.8rem,5vw,3rem)",
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.08,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {displayName}
                  </h1>
                  <button
                    className="pf-inline-edit"
                    onClick={() => setEditingName(true)}
                    title="Edit name"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>
              )}

              {/* Email (read-only) ── */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "rgba(255,255,255,0.38)",
                  fontSize: 14,
                }}
              >
                <Mail size={13} />
                <span style={{ fontWeight: 400 }}>{user?.email || "—"}</span>
              </div>

              {/* Join date ── */}
              {joinDate && (
                <span
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Member since {joinDate}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── End hero ── */}

      {/* ══════════════════════════════════════════════════
          BODY SECTION — flash msg + stats grid + bio card
      ══════════════════════════════════════════════════ */}
      <div
        className="pf-body-pad"
        style={{
          padding: "clamp(16px,3vw,36px) clamp(14px,5vw,48px)",
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        {/* ── Flash message (success / error) ── */}
        {saveMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 18px",
              borderRadius: 12,
              marginBottom: 22,
              background:
                msgType === "success"
                  ? "rgba(52,211,153,0.1)"
                  : "rgba(239,68,68,0.1)",
              border: `1px solid ${msgType === "success" ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
              fontSize: 13,
              fontWeight: 500,
              color: msgType === "success" ? "#34d399" : "#f87171",
              animation: "pf-up 0.3s ease forwards",
            }}
          >
            {msgType === "success" ? <Check size={14} /> : <X size={14} />}
            {msgText}
          </div>
        )}

        {/* ════════════════════════════════════════════
            STATS GRID — 3 cards: liked / email / active
        ════════════════════════════════════════════ */}
        <div
          className="pf-stats pf-d1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* ── Liked songs count ── */}
          <div className="pf-stat">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(167,139,250,0.12)",
                  border: "1px solid rgba(167,139,250,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Music2 size={16} color="#a78bfa" />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                Liked
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(1.5rem,3vw,2.2rem)",
                fontWeight: 800,
                margin: "0 0 4px",
                color: "#a78bfa",
                lineHeight: 1,
              }}
            >
              {likedSongsCount} {/* {likedSongs.length} */}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.28)",
                margin: 0,
              }}
            >
              songs saved
            </p>
          </div>

          {/* ── Email / account type ── */}
          <div className="pf-stat">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={16} color="#fbbf24" />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                Account
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(0.9rem,2vw,1.1rem)",
                fontWeight: 700,
                margin: "0 0 4px",
                color: "#fff",
                lineHeight: 1.2,
                wordBreak: "break-all",
              }}
            >
              {user?.email?.split("@")[1] || "—"}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.28)",
                margin: 0,
              }}
            >
              email domain
            </p>
          </div>

          {/* ── Account status ── */}
          <div className="pf-stat">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(52,211,153,0.1)",
                  border: "1px solid rgba(52,211,153,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={16} color="#34d399" />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                Status
              </span>
            </div>
            <p
              style={{
                fontSize: "clamp(1rem,2.5vw,1.2rem)",
                fontWeight: 700,
                margin: "0 0 4px",
                color: "#34d399",
                lineHeight: 1,
              }}
            >
              Active
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.28)",
                margin: 0,
              }}
            >
              verified account
            </p>
          </div>
        </div>

        {/* Thin divider */}
        <div className="pf-divider pf-d2" />

        {/* ════════════════════════════════════════════
            BIO CARD — editable, max 30 words
        ════════════════════════════════════════════ */}
        <div
          className="pf-d3"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: "clamp(18px,3vw,28px)",
            marginBottom: 20,
          }}
        >
          {/* ── Card header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={16} color="#a78bfa" />
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                About
              </h2>
            </div>

            {/* Edit button — only when not editing ── */}
            {!editingBio && (
              <button
                className="pf-edit-pill"
                onClick={() => setEditingBio(true)}
              >
                <Edit3 size={12} /> Edit
              </button>
            )}
          </div>

          {/* ── Bio textarea (edit mode) ── */}
          {editingBio ? (
            <>
              <textarea
                ref={bioRef}
                className="pf-inp"
                value={bio}
                placeholder="Tell everyone a little about yourself… (max 30 words)"
                onChange={(e) => {
                  // Allow typing; enforce 30-word cap (allow deletion always)
                  const words = e.target.value
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);
                  if (
                    words.length <= 30 ||
                    e.target.value.length < bio.length
                  ) {
                    setBio(e.target.value);
                    autoResizeBio();
                  }
                }}
                rows={4}
                style={{ minHeight: 100, lineHeight: 1.7 }}
              />
              {/* Word counter ── */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 7,
                  fontSize: 11,
                  color: bioTooLong ? "#f87171" : "rgba(255,255,255,0.22)",
                }}
              >
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: 100,
                    background: bioTooLong
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${bioTooLong ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  {bioWordCount} / 30 words
                </span>
              </div>
            </>
          ) : (
            /* ── Bio read-only display ── */
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.78,
                margin: 0,
                color: bio ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                whiteSpace: "pre-wrap",
                fontStyle: bio ? "normal" : "italic",
              }}
            >
              {bio || "No bio yet — click Edit to introduce yourself."}
            </p>
          )}
        </div>

        {/* ════════════════════════════════════════════
            SAVE / CANCEL — shown only while editing
        ════════════════════════════════════════════ */}
        {(editingName || editingBio) && (
          <div
            className="pf-d4"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              className="pf-btn-save"
              onClick={handleSave}
              disabled={saving || bioTooLong}
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="pf-spin" /> Saving…
                </>
              ) : (
                <>
                  <Check size={15} /> Save Changes
                </>
              )}
            </button>

            <button
              className="pf-btn-cancel"
              onClick={() => {
                setEditingName(false);
                setEditingBio(false);
              }}
            >
              <X size={15} /> Cancel
            </button>
          </div>
        )}

        {/* ── Logout Button ── */}
        <div className="pf-d3" style={{ marginTop: 24 }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              padding: "14px 20px",
              borderRadius: 14,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── End body section ── */}
    </div>
  );
};

export default Profile;
