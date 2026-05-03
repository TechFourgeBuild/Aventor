import React, { useState, useEffect } from "react";
import {
  Home,
  Search,
  Heart,
  // ListMusic,
  Flame,
  PanelLeftClose,
  PanelRightClose,
  Users,
  Moon
} from "lucide-react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

// =========================================================
// FULL SIDEBAR — shown on desktop when toggle is ON
// Width: 240px (w-60)
// =========================================================
const Sidebar = ({ setIsToggle,showFullSidebar, onSearchClick }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate()

  const togglingSidebar = () => {
    // Checking if window is defined (for SSR) and get width
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    console.log("windowWidth : ",windowWidth);
    if (windowWidth < 686) {
      // On small screens, don't toggle - just set to false (compact mode)
      setIsToggle(false);
    } else {
      // On larger screens, toggle the state
      setIsToggle((prev) => !prev);
    }
  };

  // Get profile data from Redux instead of just auth
  const { user } = useSelector((s) => s.auth);
  const { displayName, avatarUrl } = useSelector((s) => s.profile);

  const finalDisplayName = displayName || 
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const finalAvatarUrl = avatarUrl ||
    user?.user_metadata?.avatar_url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop";

  return (
    // ========= Sidebar container — fixed, full height, dark bg =========
    <div className="bg-[#12121f]  select-none fixed left-0 cursor-pointer top-0 border-r border-white/5 m-0 p-0 box-border h-screen w-60 flex flex-col  z-50 overflow-hidden">
      {/* ========= Top section: logo + collapse button ========= */}
      <div
        style={{ marginTop: 5 }}
        className="flex items-center justify-between px-4 pt-5 pb-3"
      >
        {/* ========= Rendering Logo ========= */}
        <div className="flex items-center gap-1">
          <img
            className="w-10 cursor-pointer flex-shrink-0"
            src="./AventorLogo.png"
            alt="aventor logo"
          />
          <span
            style={{ fontFamily: "-apple-system", fontWeight: 760 }}
            className="text-xl text-[#e6e2e8] whitespace-nowrap"
          >
            Aventor
          </span>
        </div>
        {/* ==================================== */}

        {/* ========= Collapse sidebar button ========= */}
        <div
          onClick={togglingSidebar}
          style={{ marginRight: 10 }}
          className="w-9 h-9 rounded-full hover:bg-[#ffffff27] active:bg-[#ffffff3a] transition-all flex items-center justify-center cursor-pointer text-[gray] shrink-0"
        >
          <PanelLeftClose size={18} />
        </div>
      </div>

      {/* =========== Rendering pages's Tabs like Home, Search, Liked Songs, Playlist, Profile =========== */}
      <div
        style={{ marginTop: 49 }}
        className="flex-1 flex flex-col gap-1 px-3 mt-12 overflow-y-auto overflow-x-hidden"
      >
        {/* ========= Tab: Home ========= */}
        <div
          onMouseEnter={() => setHoveredTab("home")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("home")}
          onClick={() => { setActiveTab("home"); navigate("/app"); }}
          style={{
            fontFamily: "revert",
            paddingRight: "16px",
            paddingLeft: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "12px",
            cursor: "pointer",
            backgroundColor:
              activeTab === "home"
                ? "#231641"
                : hoveredTab === "home"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
            color:
              activeTab === "home"
                ? "#ffffff"
                : hoveredTab === "home"
                  ? "#ffffff"
                  : "#696969",
          }}
          className="flex bg-[#231641] px-3 py-2 transition-all items-center gap-3"
        >
          <Home width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>Home</span>
        </div>

        {/* ========= Tab: Search ========= */}
        <div
          onMouseEnter={() => setHoveredTab("search")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("search")}
          // onClick={() => { setActiveTab("search"); onSearchClick?.(); }}
          onClick={() => { setActiveTab("search"); onSearchClick?.(); navigate("/app"); }}
          style={{
            fontFamily: "revert",
            paddingRight: "16px",
            paddingLeft: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "12px",
            backgroundColor:
              activeTab === "search"
                ? "#231641"
                : hoveredTab === "search"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
            color:
              activeTab === "search"
                ? "#ffffff"
                : hoveredTab === "search"
                  ? "#ffffff"
                  : "#696969",
          }}
          className="flex items-center gap-3 transition-all"
        >
          <Search width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>Search</span>
        </div>

        {/* ========= Tab: Liked Songs ========= */}
        <div
          onMouseEnter={() => setHoveredTab("heart")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("heart")}
          onClick={() => { setActiveTab("heart"); navigate("/app/liked"); }}
          style={{
            fontFamily: "revert",
            paddingRight: "16px",
            paddingLeft: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "12px",
            backgroundColor:
              activeTab === "heart"
                ? "#231641"
                : hoveredTab === "heart"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
            color:
              activeTab === "heart"
                ? "#ffffff"
                : hoveredTab === "heart"
                  ? "#ffffff"
                  : "#696969",
          }}
          className="flex items-center gap-3 transition-all"
        >
          <Heart width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>Liked Songs</span>
        </div>

        {/* ========= Tab: Playlists ========= */}
        <div
          onMouseEnter={() => setHoveredTab("profile")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("listmusic")}
          onClick={() => { setActiveTab("profile"); navigate("/app/accounts"); }}
          style={{
            fontFamily: "revert",
            paddingRight: "16px",
            paddingLeft: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "12px",
            backgroundColor:
              activeTab === "profile"
                ? "#231641"
                : hoveredTab === "profile"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
            color:
              activeTab === "profile"
                ? "#ffffff"
                : hoveredTab === "profile"
                  ? "#ffffff"
                  : "#696969",
          }}
          className="flex items-center gap-3 transition-all"
        >
          <Users width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>Profile</span>
        </div>

        {/* Here in Trending songs you'll show the most liked songs like from most highest liked songs to least liked songs */}
        <div
          onMouseEnter={() => setHoveredTab("moods")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("flame")}
          onClick={() => { setActiveTab("moods"); navigate("/app/moods"); }}
          style={{
            fontFamily: "revert",
            paddingRight: "16px",
            paddingLeft: "18px",
            paddingTop: "8px",
            paddingBottom: "8px",
            borderRadius: "12px",
            backgroundColor:
              activeTab === "moods"
                ? "#231641"
                : hoveredTab === "moods"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
            color:
              activeTab === "moods"
                ? "#ffffff"
                : hoveredTab === "moods"
                  ? "#ffffff"
                  : "#696969",
          }}
          className="flex items-center gap-3 transition-all"
        >
          <Moon width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>Moods</span>
        </div>

        {/* Here in Trending Genre you'll show the most liked songs's Genre like from most highest liked songs's Genre to least liked songs's Genre , Now you've commetend out , you'll render it on trending song page by mentioning a tab of of Trending Genre*/}
        {/* <div
          style={{ fontFamily: "revert", marginRight: 15 }}
          className="flex justify-center bg-[ items-center gap-3"
        >
          <Music2 width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            Trending Genre
          </span>
        </div> */}
      </div>
      {/* =========== End of nav tabs =========== */}

      {/* <div  className="mb-6"> */}
      {/* ========= Divider line above user profile ========= */}
      <div
        style={{ marginBottom: 17 }}
        className="w-full bg-[#2e2d2d] h-[1px] mx-0"
      />

      {/* Here Render the User's credentials like it's profile picture and if not uploaded pull it from default google , else allow use to put their image for profile picture, along with profile picture render the user's name and email */}
      <div
        style={{ fontFamily: "revert", marginBottom: 13, marginLeft: 12 }}
        className="flex items-center gap-3  px-4 py-4"
      >
        {/* ========= User avatar ========= */}
        <div className="w-9 h-9 bg-[#000000] rounded-full flex-shrink-0 flex justify-center items-center overflow-hidden">
          <img
            className="object-cover rounded-full w-full h-full"
            src={finalAvatarUrl}
            alt="logo"
            onError={(e) => {
        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop";
      }}
          />
        </div>
        {/* ========= User name + email ========= */}
        
        <NavLink to="/app/accounts">
        <div className="flex flex-col min-w-0">
          <span
            style={{ fontWeight: 600 }}
            className="text-[#c1c1c1] truncate text-sm"
          >
            {finalDisplayName}
          </span>
          <div
            style={{ fontWeight: 550, fontSize: "11px" }}
            className="text-[#7d7c7c] truncate"
          >
            {user?.email || "user@example.com"}
          </div>
        </div>
        </NavLink>
        {/* </div> */}
      </div>
    </div>
  );
};

// =========================================================
// COMPACT SIDEBAR — always shown on mobile, shown on desktop
// when toggle is OFF. Width: 64px (w-16)
// =========================================================
export const SmallSidebar = ({ setIsToggle, onSearchClick }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const navigate = useNavigate();

  // ========= Track if viewport is mobile (< 500px) =========
  // Used to hide the expand button on mobile since expanding is disabled
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 500 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { user } = useSelector((s) => s.auth);
  const { avatarUrl } = useSelector((s) => s.profile);

  const finalAvatarUrl = avatarUrl ||
    user?.user_metadata?.avatar_url ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop";

  return (
    // ========= Compact sidebar container — fixed, full height, 64px wide =========
    <div className="bg-[#12121f] select-none fixed left-0 top-0 border-r border-white/5 m-0 p-0 box-border h-screen w-[65px] flex flex-col items-center z-50">
      {/* ========= Rendering Logo ========= */}
      <div
        style={{ marginTop: 10 }}
        className="flex justify-center items-center pt-7 pb-2"
      >
        <img
          className="w-12 cursor-pointer"
          src="./AventorLogo.png"
          alt="aventor logo"
        />
        {/* <span
          style={{ fontFamily: "-apple-system", fontWeight: 760 }}
          className="text-2xl text-[#e6e2e8]"
        >
          Aventor
        </span> */}
      </div>
      {/* ==================================== */}

      {/* =========== Rendering pages's Tabs like Home, Search, Liked Songs, Playlist, Profile =========== */}
      {/* ========= Icon-only nav tabs — centered, no labels ========= */}
      <div
        style={{ marginTop: 29 }}
        className="flex-1 flex flex-col gap-2 items-center mt-10 w-full px-2"
      >
        {/* ========= Tab: Home (icon only) ========= */}
        <div
          onMouseEnter={() => setHoveredTab("home")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("home")}
          onClick={() => { setActiveTab("home"); navigate("/app"); }}
          style={{
            backgroundColor:
              activeTab === "home"
                ? "#231641"
                : hoveredTab === "home"
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
            color:
              activeTab === "home" || hoveredTab === "home"
                ? "#ffffff"
                : "#696969",
          }}
          className="w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer"
        >
          <Home width={18} /> <span className="text-[12px]">Home</span>
        </div>

        {/* ========= Tab: Search (icon only) ========= */}
        <div
          onMouseEnter={() => setHoveredTab("search")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("search")}
          // onClick={() => { setActiveTab("search"); onSearchClick?.(); }}
          onClick={() => { setActiveTab("search"); onSearchClick?.(); navigate("/app"); }}
          style={{
            backgroundColor:
              activeTab === "search"
                ? "#231641"
                : hoveredTab === "search"
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
            color:
              activeTab === "search" || hoveredTab === "search"
                ? "#ffffff"
                : "#696969",
          }}
          className="w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer"
        >
          <Search width={18} /> <span className="text-[12px]">Search</span>
        </div>

        {/* ========= Tab: Liked Songs (icon only) ========= */}
        <div
          onMouseEnter={() => setHoveredTab("heart")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("heart")}
          onClick={() => { setActiveTab("heart"); navigate("/app/liked"); }}
          style={{
            backgroundColor:
              activeTab === "heart"
                ? "#231641"
                : hoveredTab === "heart"
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
            color:
              activeTab === "heart" || hoveredTab === "heart"
                ? "#ffffff"
                : "#696969",
          }}
          className="w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer"
        >
          <Heart width={18} /> <span className="text-[12px]">Liked</span>
        </div>

        {/* ========= Tab: Playlists (icon only) ========= */}
        <div
          onMouseEnter={() => setHoveredTab("profile")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("listmusic")}
          onClick={() => { setActiveTab("profile"); navigate("/app/accounts"); }}
          style={{
            backgroundColor:
              activeTab === "profile"
                ? "#231641"
                : hoveredTab === "profile"
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
            color:
              activeTab === "profile" || hoveredTab === "profile"
                ? "#ffffff"
                : "#696969",
          }}
          className="w-16 h-16 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer"
        >
          <Users width={18} />{" "}
          <span className="text-[12px]">Profile</span>
        </div>

        {/* Here in Trending songs you'll show the most liked songs like from most highest liked songs to least liked songs */}
        <div
          onMouseEnter={() => setHoveredTab("moods")}
          onMouseLeave={() => setHoveredTab(null)}
          // onClick={() => setActiveTab("flame")}
          onClick={() => { setActiveTab("moods"); navigate("/app/moods"); }}
          style={{
            backgroundColor:
              activeTab === "moods"
                ? "#231641"
                : hoveredTab === "moods"
                  ? "rgba(255,255,255,0.08)"
                  : "transparent",
            color:
              activeTab === "moods" || hoveredTab === "moods"
                ? "#ffffff"
                : "#696969",
          }}
          className="w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer"
        >
          <Moon width={18} /> <span className="text-[12px]">Moods</span>
        </div>

        {/* Here in Trending Genre you'll show the most liked songs's Genre like from most highest liked songs's Genre to least liked songs's Genre , Now you've commetend out , you'll render it on trending song page by mentioning a tab of of Trending Genre*/}
        {/* <div
          style={{ fontFamily: "revert", marginRight: 15 }}
          className="flex justify-center bg-[ items-center gap-3"
        >
          <Music2 width={18} />{" "}
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            Trending Genre
          </span>
        </div> */}
      </div>
      {/* =========== End of icon nav tabs =========== */}

      {/* ========= Expand button — hidden on mobile since expanding is disabled there ========= */}
      {!isMobile && (
        <div
          style={{ marginBottom: 10 }}
          onClick={() => setIsToggle((prev) => !prev)}
          className="mb-4 max-[686px]:hidden w-9 h-9 rounded-full hover:bg-[#ffffff27] active:bg-[#ffffff3a] transition-all flex items-center justify-center cursor-pointer text-[gray]"
        >
          <PanelRightClose size={18} />
        </div>
      )}
      {/* <div className="mb-6"> */}
      {/* ========= Divider line above user avatar ========= */}
      <div
        style={{ marginBottom: 15 }}
        className="w-full bg-[#2e2d2d] h-[1px]"
      />

      {/* Here Render the User's credentials like it's profile picture and if not uploaded pull it from default google , else allow use to put their image for profile picture, along with profile picture render the user's name and email */}
      {/* ========= User avatar only (no name/email in compact mode) ========= */}
      <NavLink to="/app/accounts">
      <div
        style={{ marginBottom: 15 }}
        className="py-4 flex  flex-col items-center"
      >
        <div className="w-9 h-9 bg-[#000000] rounded-full flex items-center justify-center overflow-hidden">
          <img
            className="object-cover rounded-full w-full h-full"
            src={finalAvatarUrl}
            alt="user profile"
            onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop";
        }}
          />
        </div>
        {/* <div className="flex justify-center items-center flex-col gap-y-0"> */}
      </div>
      </NavLink>
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
