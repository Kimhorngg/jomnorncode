import React from "react";
import {
  FaFacebookF,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0f2b4c] text-white pt-14 pb-6 px-6 md:px-16 mt-20 ">
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1 */}
        <div>
          <img src="src/assets/logo-square-01.png" alt="ISTAD Logo" className="w-28 mb-4" />
          <p className="text-gray-300 text-sm leading-6">
            Institute of Science and Technology <br />
            Advanced Development
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-bold mb-4">វគ្គសិក្សា</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white cursor-pointer">C++ Programming</li>
            <li className="hover:text-white cursor-pointer">HTML</li>
            <li className="hover:text-white cursor-pointer">CSS</li>
            <li className="hover:text-white cursor-pointer">JavaScript</li>
            <li className="hover:text-white cursor-pointer">
              Python for Beginners
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-4"> ភ្ជាប់ទំនាក់ទំនង</h3>

          {/* Social Icons */}
          <div className="flex space-x-4 mb-4 text-lg">
            <FaFacebookF className="hover:text-blue-400 cursor-pointer" />
            <FaTelegramPlane className="hover:text-blue-300 cursor-pointer" />
            <FaInstagram className="hover:text-pink-400 cursor-pointer" />
            <FaEnvelope className="hover:text-yellow-300 cursor-pointer" />
          </div>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-gray-400 focus:outline-none focus:border-white text-sm"
          />
        </div>

        {/* Column 4 */}
        <div>
          <img
            src="/src/assets/jomnorncode_logo (2).png"
            alt="Technology Logo"
            className="w-28 mb-4"
          />
          <p className="text-gray-300 text-sm leading-6">
            អភិវឌ្ឍជំនាញរបស់អ្នកជាមួយវគ្គសិក្សាជំនាន់កូដ ដើម្បីអនាគតដ៏ភ្លឺស្វាង
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-500 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-4">
        <p>© 2026 Coding Website | All Rights Reserved</p>

        <div className="flex space-x-6">
          <span className="hover:text-white cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-white cursor-pointer">
            Terms of Service
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
