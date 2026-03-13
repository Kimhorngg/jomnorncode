import React from 'react';
import { IoBookOutline, IoTimeOutline, IoPeopleOutline } from 'react-icons/io5';

const HeroSection = ({
  title,
  description,
  image,
  onStartLearning,
  onBackToCourses,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-[#81aed1] via-[#3a618c] to-[#112d4f] min-h-[420px] flex items-center overflow-hidden">
      <div className="max-w-[1610px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <div className="flex-1 text-[#0f2b4c] space-y-6 z-10">
            <button
              type="button"
              onClick={onBackToCourses}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <span aria-hidden="true">←</span>
              ត្រឡប់ក្រោយ
            </button>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              {title}
            </h1>
            
            <p className="text-gray-300 text-sm md:text-lg max-w-xl leading-relaxed opacity-90">
              {description}

            </p>

            {/* Icons Row */}
            <div className="flex flex-wrap items-center gap-8 text-sm md:text-base font-medium">
              <div className="flex text-sm lg:text-base text-gray-300 items-center gap-2">
                <IoBookOutline className="text-[#ffa306] text-2xl" />
                <span>១០ មេរៀន</span>
              </div>
              <div className="flex text-sm lg:text-base text-gray-300 items-center gap-2">
                <IoTimeOutline className="text-[#ffa306] text-2xl" />
                <span>១៥ ម៉ោង</span>
              </div>
              <div className="flex text-sm lg:text-base text-gray-300 items-center gap-2">
                <IoPeopleOutline className="text-[#ffa306] text-2xl" />
                <span>៥,០០០ នាក់</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <button
                onClick={onStartLearning}
                className="bg-[#4477ce] cursor-pointer hover:bg-blue-600 text-white px-12 py-3.5 rounded-xl font-bold transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                ចូលរៀន
              </button>
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="flex-1 flex justify-center md:justify-end relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/20 blur-[100px] rounded-full"></div>
            
            <div className="relative w-full max-w-[450px] transform hover:rotate-2 transition-transform duration-500">
              <img 
                src={image || "/default-course-image.jpg"} 
                alt={title}
                className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                onError={(e) => {
                  e.currentTarget.src = "/default-course-image.jpg";
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
