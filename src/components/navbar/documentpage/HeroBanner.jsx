import React, { useState } from "react";
import documentHeroImage from "../../../assets/test.png";
import SignUp from "../../../pages/SignUp";
import Login from "../../../pages/LogIn";

const HeroBanner = () => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <section className="w-full bg-[#112d50] min-h-[630px] flex items-center overflow-hidden">
        <div className="w-full max-w-[1700px] mx-auto px-8 sm:px-10 lg:px-16">
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

            <div className="w-full flex justify-center md:justify-end">
              <img
                src={documentHeroImage}
                alt="Student with laptop"
                className="w-full max-w-[520px] h-auto object-contain"
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
