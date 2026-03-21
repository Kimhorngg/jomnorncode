import React, { useState, useEffect } from "react";
import lisaImage from "../../../assets/Roza.png";
import manethImage from "../../../assets/Maneth.png";
import chovornImage from "../../../assets/Vantha.png";

export default function Carocel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleImageError = (event) => {
    event.currentTarget.src = "/default-course-image.jpg";
  };

  return (
    <section className="py-20  bg-[#fcfcfc] dark:bg-[#091220] transition-colors duration-300">
      {/* Title */}
      <div className="text-center mb-14 ">
        <h1 className="text-3xl md:text-4xl font-bold text-[#112d4f] dark:text-white">
          សិស្សដែលទទួលបានលទ្ធផល<span className="text-[#ffbf48]">ជោគជ័យ</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mt-3">
          អាចឃេីញសមិទ្ធផលសិស្សច្បាស់លាស់
        </p>
      </div>
      {/* Slider */}
      <div className="relative max-w-6xl mx-auto  overflow-hidden light-card-scope">
        <div
          className="flex transition-transform duration-700 ease-in-out "
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Slide 1 */}
          <div className="min-w-full px-6 ">
            <div className="bg-white dark:bg-[#1c293d] border-[#e4e4e4] dark:border-[#314057] border-1  rounded-3xl  px-10 py-12 md:px-16 md:py-14 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-72 h-72 rounded-full p-2 border-2 border-[#ffbf48]">
                  <img
                    src={lisaImage}
                    alt="សារុន លីសា"
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-6 items-start">
                    <div className="w-3 h-26 bg-[#ffbf48] rounded shrink-0" />
                    <p className="text-lg font-bold md:text-xl text-[#112d51] dark:text-white mt-5 leading-relaxed">
                      ខ្ញុំបានរៀន C++ នៅ{" "}
                      <span className="text-[#ffbf48]"> ជំនាន់កូដ</span>{" "}
                      ហើយឈានដល់ការយល់ដឹងល្អពី OOP និងគោលការណ៍មូលដ្ឋាន។
                      ខ្ញុំចូលចិត្តការបង្ហាញសាកល្បងពិតប្រាកដ!
                    </p>
                  </div>
                  <div className="border-b border-[#3F72AF] mt-8 mb-6" />
                  <h2 className="text-2xl font-bold text-[#1e293b] dark:text-white">
                   នី រ៉ូស្សា
                  </h2>
                  <p className="text-gray-500 dark:text-white mt-2">
                    និស្សិតឆ្នាំទី៣
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Slide 2 */}
          <div className="min-w-full px-6">
            <div className="bg-white rounded-3xl dark:bg-[#1c293d]  border-[#e4e4e4] dark:border-[#314057] border-1  px-10 py-12 md:px-16 md:py-14 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-72 h-72 rounded-full p-2 border-2 border-[#ffbf48]">
                  <img
                    src={manethImage}
                    alt="លាង ម៉ាណេត"
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-6 items-start">
                    <div className="w-3 h-24 bg-[#ffbf48] rounded shrink-0" />
                    <p className="text-lg font-bold md:text-xl text-[#112d51] dark:text-white mt-5 leading-relaxed">
                      ខ្ញុំបានរៀន HTML នៅ
                      <span className="text-[#ffbf48]"> ជំនាន់កូដ </span>
                      ហើយឈានដល់ការចេះធ្វេីវេបសាយមួយខ្លួនឯងបានហើយ។
                      ខ្ញុំចូលចិត្តការបង្ហាញសាកល្បងពិតប្រាកដ!
                    </p>
                  </div>
                  <div className="border-b border-blue-400 mt-8 mb-6" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    លាង ម៉ាណេត
                  </h2>
                  <p className="text-gray-500 dark:text-white mt-2">
                    និស្សិតឆ្នាំទី២
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Slide 3 */}
          <div className="min-w-full px-6">
            <div className="bg-white rounded-3xl dark:bg-[#1c293d]  border-[#e4e4e4] dark:border-[#314057] border-1  px-10 py-12 md:px-16 md:py-14 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-72 h-72 rounded-full p-2 border-2 border-[#ffbf48]">
                  <img
                    src={chovornImage}
                    alt="សន ឆវ័ន"
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-6 items-start">
                    <div className="w-3 h-24 bg-[#ffbf48] rounded shrink-0" />
                    <p className="text-lg font-bold md:text-xl text-[#112d51] dark:text-white mt-5 leading-relaxed">
                      ដោយសារតែបានរៀននៅ{" "}
                      <span className="text-[#ffbf48]"> ជំនាន់កូដ</span>{" "}
                      ទេីបធ្វេីឲ្យខ្ញុំដឹងថាការរៀនកូដមិនមែនជារឿងពិបាកទេ។
                      ខ្ញុំបានចាប់ផ្តើមពីសូន្យ
                      ហើយឥឡូវនេះខ្ញុំអាចបង្កើតគេហទំព័រមួយបានហើយ។
                    </p>
                  </div>
                  <div className="border-b border-blue-400 mt-8 mb-6" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    សន ឆវ័ន
                  </h2>
                  <p className="text-gray-500 dark:text-white mt-2">
                    និស្សិតឆ្នាំទី១
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Dots */}
      <div className="flex justify-center gap-4 mt-10">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === i
                ? "bg-[#ffbf48] scale-125"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
