import React, { useState } from "react";
import { Play} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { toggleLike } from "../store/slices/likedSongsSlice";

const SongCard = ({ 
  song = {
    id: "1",
    song_name: "Blinding Lights",
    artist: "The Weeknd", 
    cover_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
    genre: "Pop",
    duration: 200,
    album: "After Hours"
  },windowWidth
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on icons
    if (e.target.closest('.icon-button')) return;
    navigate(`/app/song/${song.id}`, { 
      state: { 
        song: {
          id: song.id,
          songName: song.song_name,
          artistName: song.artist,
          genre: song.genre,
          duration: song.duration,
          album: song.album,
          coverImage: song.cover_url,
          fileUrl: song.file_url
        }
      }
    });
  };

  return (
  
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`w-full ${windowWidth < 360 ? "max-w-[200px]":"max-w-[250px]"} bg-gradient-to-b from-white/5 to-transparent rounded-xl p-3 transition-all duration-300 hover:bg-[#747373b7] cursor-pointer group relative`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 shadow-xl">
        <img 
          src={song.cover_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop"}
          alt={song.song_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Action Icons - Top Right */}
        <div className={`absolute top-2 right-2 flex gap-2 transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          {/* Like Button */}
          {/* <button 
            onClick={handleLike}
            className="icon-button w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all"
          >
            <Heart 
              className={`w-4 h-4 transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} 
            />
          </button> */}
          
          {/* Bookmark Button */}
          {/* <button 
            onClick={handleBookmark}
            className="icon-button w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all"
          >
            <BookmarkPlus 
              className={`w-4 h-4 transition-all ${isBookmarked ? "fill-purple-500 text-purple-500" : "text-white"}`} 
            />
          </button> */}
        </div>

        {/* Play Button Overlay - Bottom Right */}
        <div 
          className={`absolute bottom-2 right-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-xl transform transition-all duration-200 hover:scale-105">
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>

      {/* Song Name */}
      <h3 className="font-semibold text-center text-white text-sm sm:text-base truncate mb-0.5">
        {song.song_name}
      </h3>
      
      {/* Artist Name */}
      <p className="text-xs text-center sm:text-sm text-white/50 truncate">
        {song.artist}
      </p>
    </div>
  );
};

export default SongCard;