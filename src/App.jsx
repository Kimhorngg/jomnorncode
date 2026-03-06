import "./App.css";
import "./index.css";
import { NavLink, Link } from "react-router-dom"; // Add this
// import { Routes, Route } from "react-router-dom";
import "./components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import "font-awesome/css/font-awesome.min.css";
import RenderPopularHomepageCard from "./components/navbar/homepage/RenderPopularHomepageCard";
import RenderCourseForBeginner from "./components/navbar/homepage/RenderCourseForBeginner";
import Carocel from "./components/navbar/homepage/Carocel";
import WhyChooseUs from "./components/navbar/homepage/WhyChooseUs";
import Roadmap from "./components/navbar/homepage/Roadmap";
import StudentFeedback from "./components/navbar/homepage/StudentFeedback";
import ConfirmCard from "./components/navbar/homepage/ConfirmCard";

export default function App() {
  

  // const [courses, setCourses] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch("https://fakestoreapi.com/products")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCourses(data);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) {
  //   return <h1 className="text-center mt-20 mb-20 text-2xl">កំពុងដំណេីរការ...</h1>;
  // }

  return (
    <>
      <div className="min-h-screen bg-[#112d4f] text-white dark:bg-[#0e172b] font-sans">
        <div className="relative py-16 md:py-20 lg:py-28 overflow-hidden">
          {/* Wider container for more edge spacing control */}
          <div className="w-full px-6 md:px-10 lg:px-16 xl:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* LEFT SIDE */}
              <div className="text-center lg:text-left lg:pl-8 xl:pl-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  សិក្សាកូដជាភាសាខ្មែរជាមួយ{" "}
                  <span className="block text-[#f59e0b] mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                    ជំនាន់កូដ
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                  រៀនកម្មវិធី បង្កើតគម្រោង និងសកម្មភាពថ្មីៗ <br />
                  ជាមួយវគ្គសិក្សាកូដដែលពេញនិយម
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-5 mb-12">
                 <Link
  to="/course"
  className="inline-block bg-[#0e468b] hover:bg-[#f2f2f2] hover:text-[#112d50] text-white text-base sm:text-lg font-semibold px-8 py-4 sm:px-10 sm:py-5 rounded-xl transition-all transform hover:scale-105"
>
  មេីលវគ្គសិក្សា &gt;
</Link>

                 <Link
  to="/signup"
  className="inline-block bg-[#f2f2f2] border-2 border-gray-500 hover:border-gray-300 text-[#0e468b] hover:bg-[#0e468b] hover:text-white text-base sm:text-lg font-semibold px-8 py-4 sm:px-10 sm:py-5 rounded-xl transition-all"
>
  ចុះឈ្មោះឥឡូវនេះ
</Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12 text-center lg:text-left">
                  <div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold">
                      3000+
                    </div>
                    <div className="text-gray-400 mt-1">សិស្សចុះឈ្មោះ</div>
                  </div>

                  <div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold">
                      800+
                    </div>
                    <div className="text-gray-400 mt-1">មេរៀន</div>
                  </div>

                  <div>
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold">
                      650+
                    </div>
                    <div className="text-gray-400 mt-1">មេរៀនបញ្ចប់</div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex justify-center lg:justify-end lg:pl-10 xl:pl-20">
                <img
                  src="/src/assets/image.png"
                  alt="Online Course Illustration"
                  className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[600px] drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* rendering the card */}
        <RenderPopularHomepageCard />
      </div>
 <RenderCourseForBeginner />
     <>
    
  
 
  {/* Grid container */}
    
</>
    {/* second section */}
     <WhyChooseUs />
    <Carocel />
    <Roadmap/>
    <StudentFeedback/>
    <ConfirmCard/>


      
    </>
  );
}
