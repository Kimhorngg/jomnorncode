import React from "react";
import HeroSection from "../components/navbar/course/HeroSection";
import SearchBar from "../components/navbar/course/SearchBar";
import RenderCourse from "../components/navbar/course/RenderCourse";
import { useState, useEffect } from "react";
export default function Course() {
  const [courses, setCourses] = useState([]);
  const [finalSearch, setFinalSearch] = useState("");

  return (
    /* Added a wrapper with bg-white and dark:bg-[#0f172a].
       This ensures that if the content is short, the whole page 
       still shows the dark background.
    */
    <div className="min-h-screen  dark:bg-[#0f172a] transition-colors duration-300">
      <div data-aos="fade-up">
        <HeroSection />
      </div>
      <div data-aos="fade-up" data-aos-delay="100">
        <SearchBar
          courses={courses}
          onTyping={(term) => {
            setFinalSearch(term);
          }}
          onExecuteSearch={(val) => setFinalSearch(val)}
        />
      </div>
      <div className="pb-20" data-aos="fade-up" data-aos-delay="200">
        {" "}
        {/* Added padding bottom for better spacing */}
        <RenderCourse searchTerm={finalSearch} />
      </div>
    </div>
  );
}
