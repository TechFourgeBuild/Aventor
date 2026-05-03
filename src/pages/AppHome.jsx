import Sidebar from "@/reactComponents/Sidebar";
import React, { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import { SmallSidebar } from "@/reactComponents/Sidebar";
import SongCard from "@/reactComponents/SongCard";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../services/supabase";
import { setSongs, setLoading } from "../store/slices/songsSlice";
import {
  fetchUserProfile,
  createDefaultProfile,
} from "../services/profileService";
import { setProfile } from "../store/slices/profileSlice";

const AppHome = () => {
  // ========= Toggle state for full vs compact sidebar =========
  const [toggle, setIsToggle] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebarOpen") === "true";
  });

  // ========= Tracking if viewport is mobile (< 500px) =========
  // On mobile, we never show the full sidebar — always compact
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 686 : false,
  );


  const { user } = useSelector((s) => s.auth);


  // const { currentSong, isPlaying } = useSelector((s) => s.player);
  // const [showAll, setShowAll] = useState(false);

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    // ========= Listen for screen resize to update mobile state =========
    const handleResize = () => setIsMobile(window.innerWidth < 686);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ========= Save sidebar state to localStorage whenever it changes =========
  useEffect(() => {
    localStorage.setItem("sidebarOpen", toggle);
  }, [toggle]);

  // ========= Determine which sidebar to show =========
  // Full sidebar only if toggle is ON and NOT on mobile
  const showFullSidebar = toggle && !isMobile;

  // ========= Track window width properly =========
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const { allSongs, loading } = useSelector((state) => state.songs);

  const filteredSongs = searchQuery.trim()
    ? allSongs.filter(
        (song) =>
          song.song_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allSongs;

  // Fetch songs from Supabase when component mounts
  useEffect(() => {
    const fetchSongs = async () => {
      dispatch(setLoading(true));
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("song_name");

      if (!error && data) {
        dispatch(setSongs(data));
      } else {
        console.error("Error fetching songs:", error);
      }
    };

    if (allSongs.length === 0) {
      fetchSongs();
    }
  }, [dispatch, allSongs.length]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      let profile = await fetchUserProfile(user.id);

      if (!profile) {
        profile = await createDefaultProfile(user.id, user?.user_metadata);
      }

      if (profile) {
        const profileData = {
          displayName:
            profile.display_name ||
            user?.user_metadata?.display_name ||
            user?.user_metadata?.full_name ||
            user?.email?.split("@")[0] ||
            "User",
          avatarUrl:
            profile.avatar_url ||
            user?.user_metadata?.avatar_url ||
            DEFAULT_AVATAR,
          userBio: profile.user_bio || "",
        };
        dispatch(setProfile(profileData));
      }
    };

    loadProfile();
  }, [user?.id, dispatch]);

  const searchBarRef = useRef(null); // for triggering the SearchBar from sidebar to main content
  const focusSearch = () => searchBarRef.current?.focus();

  return (
    <>
      <div className="bg-[#080811] min-h-screen w-full overflow-auto text-white flex">
        {/* ========= Sidebar — swaps between full and compact based on state ========= */}
        {showFullSidebar ? (
          <Sidebar
            toggle={toggle}
            setIsToggle={setIsToggle}
            onSearchClick={focusSearch}
          />
        ) : (
          <SmallSidebar
            showFullSidebar={showFullSidebar}
            toggle={toggle}
            setIsToggle={setIsToggle}
            onSearchClick={focusSearch}
          />
        )}

        {/* ========= Main content area — offset by sidebar width ========= */}
        {/* ml-60 for full sidebar (240px), ml-16 for compact sidebar (64px) */}
        <div
          className={`flex-1 min-w-0 transition-all duration-300 ${
            showFullSidebar ? "ml-60" : "ml-16"
          }`}
        >
          {/* ========= Sticky top navbar with search + avatar ========= */}
          <div className="sticky top-0 z-40 flex justify-between items-center px-4 sm:px-6 py-3 bg-[#080811]/80 backdrop-blur-md border-b border-white/5">
            {/* ========== Rendering User Profile Picture ============ */}
            {/* <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#000000] rounded-full flex-shrink-0 flex justify-center items-center overflow-hidden"> 
            <img
              className="object-cover rounded-full w-full h-full"
              src="./user.png"
              alt="user profile"
            />
          </div> */}
            {/* ============================================= */}
          </div>

          {/* ========= Page content goes here ========= */}
          <div
            style={{ marginLeft: showFullSidebar ? 280 : 80, marginTop: 20 }}
            // style={{  }}
            className={`p-4 sticky top-0 z-30 max-sidebar-hide overflow-y-auto  h-[calc(100vh-73px)] max1500:ml-37.5 ${toggle ? "ml-[280px]" : "ml-[80px]"} sm:p-6`}
          >
            {/* Future page content bg-[#080811] renders here */}
            {/* ============================== hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh ======================== */}
            <div className="sticky top-[-1px] z-30 bg-[#080811] pt-2 pb-4">
              <div
                style={{
                  marginBottom: windowWidth > 1500 ? 40 : 0,
                  position: "sticky",
                  top: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    display: windowWidth < 321 ? "none" : "block",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: "sans-serif",
                    fontWeight: 800,
                    fontSize: 42,
                    color: "#fff",
                    margin: 0,
                    letterSpacing: -0.5,
                    display: windowWidth < 321 ? "none" : "block",
                  }}
                >
                  {greeting},{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg,#a78bfa,#ec4899)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {displayName}
                  </span>{" "}
                  👋
                  <div
                    style={{
                      fontFamily: "system-ui",
                      fontWeight: 600,
                      marginTop: 11,
                    }}
                    className="text-[16px] text-[#808080ab]"
                  >
                    88 songs across 9 moods ready for you
                  </div>
                </h1>
                {/* =============   Rendering Search Bar ============== */}
                {/* ===== SearchBar wrapper — grows to fill all available space ===== */}
                &nbsp; &nbsp; &nbsp;
                <div
                  // style={{ marginLeft: toggle ? 280 : 80}}
                  style={{
                    marginTop: windowWidth < 321 ? "-23px" : 0,
                    position: "sticky",
                    top: 0,
                    marginBottom: windowWidth < 1500 ? 22 : 32,
                    marginBottom: windowWidth < 321 ? 12 : 32,
                  }}
                  className={`flex-1 ${toggle ? "ml-[280px]" : "ml-[80px]"} min-w-0 mr-3`}
                >
                  <SearchBar
                    toggle={showFullSidebar}
                    onSearch={setSearchQuery}
                    inputRef={searchBarRef}
                  />
                </div>
                {/* ======= Capsules Rendering =======  */}
                &nbsp; &nbsp;
                <div
                  className={`flex ${windowWidth < 1500 ? "hidden" : ""} hidden sticky top-[140px]  z-20 mb-6 pb-2 bg-[#080811] justify-center items-center gap-1 overflow-auto`}
                >
                  <div
                    style={{
                      fontFamily: "initial",
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>💔</span> &nbsp; Arijit Singh
                  </div>
                  <div
                    style={{
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontFamily: "initial",
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>✨</span> &nbsp; Arash
                  </div>
                  <div
                    style={{
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontFamily: "initial",
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>😇</span> &nbsp; Guru Randhawa
                  </div>
                  <div
                    style={{
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontFamily: "initial",
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>😎</span> &nbsp; Imran Khan
                  </div>
                  <div
                    style={{
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontFamily: "initial",
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>💖</span> &nbsp; Jubin Nautiyal
                  </div>
                  <div
                    style={{
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontFamily: "initial",
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>🗿</span> &nbsp; Kishore Kumar
                  </div>
                  <div
                    style={{
                      paddingRight: 13,
                      paddingLeft: 13,
                      paddingTop: 5,
                      paddingBottom: 5,
                      fontFamily: "initial",
                    }}
                    className="w-fit h-fit text-nowrap rounded-full cursor-pointer bg-[#7575751a] border border-[#34343485] flex hover:bg-[#a7a6a634] transition-all duration-300 active:border-[0.2px] active:border-[#505050] active:bg-[#a7a6a655] justify-center items-center text-center text-[#858484] "
                  >
                    <span>⚡</span> &nbsp; Yo Yo Honey Singh
                  </div>
                </div>
                {/* ==============  */}
                {/* ==================================================*/}
                {/* ==================================================*/}
              </div>
            </div>

            {/* ======================= dfghjkhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh =====================*/}

            {/* === Rendering the main content which are songs ====  */}
            {/* <div style={{marginTop: windowWidth<686 ? "-43px":""}} className={`${showFullSidebar ? "hidden":"h-8"}`}/> */}
            <div className="min-h-screen flex justify-center items-center flex-wrap gap-4 mt-8 bg-tran rounded-t-xl">
              {/* <SongCard/>
           <SongCard/> */}

              {loading && allSongs.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-10 h-10 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : (
                /* Responsive Grid */
                <div className="flex justify-center items-center flex-wrap gap-4">
                  {filteredSongs.map((song) => (
                    <SongCard
                      windowWidth={windowWidth}
                      key={song.id}
                      song={song}
                    />
                  ))}
                  {filteredSongs.length === 0 && searchQuery && (
                    <div
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: 16,
                        textAlign: "center",
                        marginTop: 60,
                      }}
                    >
                      No songs found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* <div className="min-h-screen flex justify-center items-center flex-wrap gap-4 mt-8 bg-tran rounded-t-xl"> */}

            {/* Loading State */}

            {/* </div> */}
          </div>
        </div>
      </div>

      {/* the modal at the end of the return */}
    </>
  );
};

export default AppHome;
