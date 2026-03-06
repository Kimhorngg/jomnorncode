import React from 'react'
import HeroSection from '../components/navbar/course/HeroSection';
import SearchBar from '../components/navbar/course/SearchBar';
import RenderCourse from '../components/navbar/course/RenderCourse';
import{ useState, useEffect } from 'react';
export default function Course() {
  const [courses, setCourses] = useState([]);
  const [finalSearch, setFinalSearch] = useState('');

  return (
    /* Added a wrapper with bg-white and dark:bg-[#0f172a].
       This ensures that if the content is short, the whole page 
       still shows the dark background.
    */
    <div className="min-h-screen  dark:bg-[#0f172a] transition-colors duration-300">
      <HeroSection />
      <SearchBar 
        courses={courses} 
        onTyping={(term) => {setFinalSearch(term)}} 
        onExecuteSearch={(val) => setFinalSearch(val)} 
      />
      <div className="pb-20"> {/* Added padding bottom for better spacing */}
        <RenderCourse searchTerm={finalSearch} />
      </div>
    </div>
  );
}