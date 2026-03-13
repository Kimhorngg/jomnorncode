import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "../../../pages/SignUp";
import Login from "../../../pages/LogIn";

export default function ConfirmCard() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <div className="flex bg-[#fcfcfc]  items-center justify-center min-h-[30vh] dark:bg-[#0b1220] p-10 transition-colors duration-300">
        <div className="bg-[#112d51] dark:bg-[#112d52] rounded-xl shadow-lg p-8 max-w-3xl w-full text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
          <h1 className="text-white text-2xl md:text-3xl font-bold mb-5">
            ត្រៀមខ្លួនរួចរាល់ដើម្បីចាប់ផ្តើមរៀន?
          </h1>

          <p className="text-gray-300 dark:text-gray-400 text-sm md:text-base mb-8">
            ចូលរួមជាមួយសហគមន៍របស់យើង ហើយចាប់ផ្តើមសរសេរកូដរបស់អ្នកនៅថ្ងៃនេះ
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-10">
            <Link
              to="/course"
              className="bg-[#3f72af] text-white px-12 py-4 rounded-lg dark:hover:text-[#112d53] hover:bg-gray-100 hover:text-[#112d52] transition-colors font-medium"
            >
              មេីលវគ្គសិក្សា
            </Link>
            <button
              type="button"
              onClick={() => setIsSignUpOpen(true)}
              className="bg-[#f2f2f2] dark:border-[#6b7181] dark:hover:border-white dark:border-1 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-[#112d52] px-12 py-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              បង្កេីតគណនី
            </button>
          </div>
        </div>
      </div>
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
}
