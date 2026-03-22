import React, { useState } from "react";
import documentHeroImage from "../../../assets/kimhorn.png";
import SignUp from "../../../pages/SignUp";
import Login from "../../../pages/LogIn";

const HeroBanner = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-[#112d50] min-h-[630px] flex items-center overflow-hidden relative">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(255,165,3,.08) 25%, rgba(255,165,3,.08) 26%, transparent 27%, transparent 74%, rgba(255,165,3,.08) 75%, rgba(255,165,3,.08) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,165,3,.08) 25%, rgba(255,165,3,.08) 26%, transparent 27%, transparent 74%, rgba(255,165,3,.08) 75%, rgba(255,165,3,.08) 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="w-full max-w-[1700px] mx-auto px-8 sm:px-10 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.25]">
                <span className="text-[#ffa503]">ឯកសារលម្អិត</span>
                <span className="text-white">
                  {" "}
                  និងការណែនាំទៅកាន់អ្នកប្រើប្រាស់
                </span>
              </h1>

              <p className="mt-6 text-gray-300 text-lg leading-9 max-w-[700px]">
                ចូលរួមជាមួយសិស្សជាង ១០០០
                នាក់ផ្សេងទៀតក្នុងការកសាងអនាគតបច្ចេកវិទ្យារបស់អ្នក។
              </p>

              <button
                type="button"
                onClick={() => setIsSignUpOpen(true)}
                className="mt-8 bg-white hover:bg-gray-200 text-[#ffa503] font-bold py-3 px-8 rounded-2xl transition-colors duration-300 shadow-md text-lg"
              >
                ចុះឈ្មោះឥឡូវនេះ
              </button>
            </div>

            <div className="w-full flex justify-center md:justify-end relative h-[500px] sm:h-[550px] md:h-[600px]">
              {/* Left Badge - Students */}
              <div
                className="absolute left-0 sm:left-2 md:left-4 top-12 sm:top-16 md:top-20 z-20 animate-bounce"
                style={{ animationDelay: "0s" }}
              >
                <div className="bg-[#2a4875] backdrop-blur-sm border border-[#3f72af] rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-8 h-8 bg-[#f49d0d] rounded-full flex items-center justify-center text-white text-base">
                    👥
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-xs">1,247 សិស្ស</div>
                    <div className="text-xs text-gray-300">សកម្ម</div>
                  </div>
                </div>
              </div>

              {/* Right Badge - Rating */}
              <div
                className="absolute right-0 sm:right-2 md:right-4 top-12 sm:top-16 md:top-20 z-20 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="bg-[#2a4875] backdrop-blur-sm border border-[#3f72af] rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white text-base">
                    ⭐
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-xs">4.9 / 5.0</div>
                    <div className="text-xs text-gray-300">ពិន្ទុ</div>
                  </div>
                </div>
              </div>

              {/* Bottom Left Badge - Computer Science */}
              <div
                className="absolute left-0 sm:left-2 md:left-4 bottom-12 sm:bottom-16 md:bottom-20 z-20 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="bg-[#2a4875] backdrop-blur-sm border border-[#3f72af] rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-8 h-8 bg-[#8b6ded] rounded-full flex items-center justify-center text-white text-base">
                    📖
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-xs">Computer Science</div>
                    <div className="text-xs text-gray-300">មេរៀន</div>
                  </div>
                </div>
              </div>

              {/* Bottom Right Badge - Completion */}
              <div
                className="absolute right-0 sm:right-2 md:right-4 bottom-12 sm:bottom-16 md:bottom-20 z-20 animate-bounce"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="bg-[#2a4875] backdrop-blur-sm border border-[#3f72af] rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <div className="w-8 h-8 bg-[#f59e0b] rounded-full flex items-center justify-center text-white text-base">
                    ✓
                  </div>
                  <div className="text-white">
                    <div className="font-bold text-xs">95% ចប់</div>
                    <div className="text-xs text-gray-300">មេរៀន</div>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <img
                src={documentHeroImage}
                alt="Student with laptop"
                className="w-full max-w-[520px] h-auto object-contain relative z-10"
              />
            </div>
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

export default HeroBanner;
