import React, { useState } from "react";
import heroBg from "../../../assets/hero-section-course.jpg";
import SignUp from "../../../pages/SignUp";
import Login from "../../../pages/LogIn";

const HeroSection = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="relative flex min-h-125 w-full items-center justify-center overflow-hidden bg-[#0a192f] py-20 lg:min-h-150">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            // Replace with your actual image path or URL
            backgroundImage: `url(${heroBg})`,
          }}
        >
          {/* Optional: Dark overlay to ensure text contrast if the image is too bright */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          {/* Title / Headline */}
          <h1 className="flex flex-col gap-2 text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            <span className="text-[#FFA500]">ជំនាញថ្មី</span>
            <span className="text-white">ជាមួយ ការសិក្សាកម្មវិធីនាពេលនេះ</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-gray-200 opacity-90 md:text-lg lg:text-xl">
            វគ្គសិក្សាដែលចាប់ផ្ដើមពីមូលដ្ឋានទៅជំនាញខ្ពស់ សម្រួលសម្រាប់
            អ្នកដែលចាប់ផ្ដើមរៀនថ្មី និងអនុវត្តដោយសមត្ថភាពជាក់ស្ដែង
          </p>

          {/* Call to Action Button */}
          <div className="mt-10">
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="rounded-lg bg-[#FFA500] px-10 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#e8940d] active:scale-95"
            >
              ចាប់ផ្ដើមរៀន
            </button>
          </div>
        </div>
      </section>

      <SignUp
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        openLogin={() => {
          setIsSignUpOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        openSignUp={() => {
          setIsLoginOpen(false);
          setIsSignUpOpen(true);
        }}
      />
    </>
  );
};

export default HeroSection;
