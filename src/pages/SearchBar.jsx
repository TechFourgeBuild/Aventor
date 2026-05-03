import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
// import Sidebar from "@/reactComponents/Sidebar";
// import { SmallSidebar} from "@/reactComponents/Sidebar";

const SearchBar = ({ toggle, onSearch, inputRef }) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch?.(e.target.value); // calls AppHome's setSearchQuery
  };

  const searchRef = useRef(null);

  // ========= Detect clicks outside the search bar to deactivate focus ring =========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // setIsClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // console.log("inputRef : ", inputRef);
  return (
    // ========= Search bar wrapper — grows to fill available space, max capped =========
    <div
      style={{ paddingLeft: 14, paddingRight: 16 }}
      ref={searchRef}
      // onClick={() => setIsClicked(true)}
      className={`
        flex max1500:w-[800px] max-max1500:w-[800px] ${toggle ? "min-[900px]:max-[1104px]:w-150 min-[792px]:max-[900px]:w-[500px] min-[692px]:max-[792px]:w-[400px] " : "min-[792px]:max-[900px]:w-[700px] min-[588px]:max-[792px]:w-[500px] min-[438px]:max-[588px]:w-[350px] min-[387px]:max-[438px]:w-[300px] min-[340px]:max-[387px]:w-[250px] min-[200px]:max-[340px]:w-[210px]"}  items-center bg-[#1f1f1f] rounded-full
        ${isFocused ? "border-[1.5px] border-[#a78bfa]" : "border border-[#ffffff10]"}
        transition-all duration-200 pl-3
        
      `}
    >
      {/* ========= Search icon ========= */}
      <span className="text-[#bbb9b9] flex-shrink-0">
        <Search size={18} />
      </span>

      {/* ========= Search input — responsive width via parent container ========= */}
      <input
        style={{ paddingLeft: 10, paddingRight: 16 }}
        onChange={handleChange}
        ref={inputRef}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none focus:outline-none focus:ring-0 focus:border-none w-full text-[15px] sm:text-[17px] h-10 sm:h-12 bg-transparent placeholder-gray-400 text-white"
        type="text"
        placeholder="Search songs by name by artist or whatever you want to play"
      />

      {/* <SmallSidebar/>
      <Sidebar/> */}
    </div>
  );
};

export default SearchBar;
