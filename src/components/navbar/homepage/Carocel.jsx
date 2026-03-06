import React, { useState, useEffect } from "react";
export default function Carocel(){

    const [currentIndex, setCurrentIndex] = useState(0);
      const totalSlides = 3;
    
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 4000);
    
        return () => clearInterval(interval);
      }, []);
      return(
         <>
        <meta charSet="UTF-8" />
        <title>3 Slide Carousel</title>
        <section className="py-20 bg-[#f3f4f6]">
          {/* Title */}
          <div className="text-center mb-14">
            <h1 className="text-3xl md:text-4xl font-bold text-[#112d4f]">
              សិស្សដែលទទួលបានលទ្ធផលជោគជ័យ
            </h1>
            <p className="text-xl text-gray-500 mt-3">
              អាចឃេីញសមិទ្ធផលសិស្សច្បាស់លាស់
            </p>
          </div>
          {/* Slider */}
          <div className="relative max-w-6xl mx-auto overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {/* Slide 1 */}
              <div className="min-w-full px-6">
                <div className="bg-[#ffffff] rounded-3xl shadow-md px-10 py-12 md:px-16 md:py-14">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-72 h-72 rounded-full  p-2">
                      <img
                        src="https://scontent.fpnh10-1.fna.fbcdn.net/v/t39.30808-1/556693291_122095545705056773_3545434496966712_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHUJ0ozGqGH9UvV3qvoPjl8lgjtfTkYnQ2WCO19ORidDW2AhmsRMf8Ydao_-sac3VXc9NqtS9EpGqVjQ4y4dVSK&_nc_ohc=H1y0I9dmrKAQ7kNvwFKp_LJ&_nc_oc=Adk3wdkGw7NnGXT_Jca_2z-G3y8xJu5dtkhahaIT1t6Jr7EH_f2Hvyka2am0UPgfVf0&_nc_zt=24&_nc_ht=scontent.fpnh10-1.fna&_nc_gid=gf49ZK5jgZGBVzVIpyO4PQ&oh=00_AfvIRFONTF-bCx45JMzCnavie_43sxQJTFgncwueB-HCRQ&oe=69A43FB8"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-6 items-start">
                        <div className="w-3 h-26 bg-[#ffbf48] rounded" />
                        <p className="text-lg font-bold md:text-xl​ font-bold text-[#112d51] mt-5 leading-relaxed">
                          ខ្ញុំបានរៀន C++ នៅ <span className="text-[#ffbf48]"> ជំនាន់កូដ</span> ហើយឈានដល់ការយល់ដឹងល្អពី OOP និងគោលការណ៍មូលដ្ឋាន។ ខ្ញុំចូលចិត្តការបង្ហាញសាកល្បងពិតប្រាកដ!
                          
              
                        </p>
                      </div>
                      <div className="border-b border-[#3F72AF] mt-8 mb-6" />
                      <h2 className="text-2xl font-bold text-slate-800">
                       សារុន លីសា
                      </h2>
                      <p className="text-gray-500 mt-2">និស្សិតឆ្នាំទី២</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Slide 2 */}
              <div className="min-w-full px-6">
                <div className="bg-[#f8f9fb] rounded-3xl shadow-md px-10 py-12 md:px-16 md:py-14">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-72 h-72 rounded-fullp-2">
                      <img
                        src="src/assets/Maneth.png"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-6 items-start">
                        <div className="w-3 h-24 bg-[#ffbf48] rounded" />
                        <p className="text-lg font-bold md:text-xl​ font-bold text-[#112d51] mt-5 leading-relaxed">
                          ខ្ញុំបានរៀន HTML នៅ<span className="text-[#ffbf48]"> ជំនាន់កូដ </span>ហើយឈានដល់ការចេះធ្វេីវេបសាយមួយខ្លួនឯងបានហើយ។ ខ្ញុំចូលចិត្តការបង្ហាញសាកល្បងពិតប្រាកដ!
                        </p>
                      </div>
                      <div className="border-b border-blue-400 mt-8 mb-6" />
                      <h2 className="text-2xl font-bold text-slate-800">
                        លាង ម៉ាណេត 
                      </h2>
                      <p className="text-gray-500 mt-2">និស្សិតឆ្នាំទី២</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Slide 3 */}
              <div className="min-w-full px-6">
                <div className="bg-[#f8f9fb] rounded-3xl shadow-md px-10 py-12 md:px-16 md:py-14">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="w-72 h-72 rounded-full p-2">
                      <img
                        src="src/assets/chovorn.jpg"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-6 items-start">
                        <div className="w-3 h-24 bg-[#ffbf48] rounded" />
                        <p className="text-lg font-bold md:text-xl​ font-bold text-[#112d51] mt-5 leading-relaxed">
                          ដោយសារតែបានរៀននៅ <span className="text-[#ffbf48]"> ជំនាន់កូដ</span>   ទេីបធ្វេីឲ្យខ្ញុំដឹងថាការរៀនកូដមិនមែនជារឿងពិបាកទេ។ ខ្ញុំបានចាប់ផ្តើមពីសូន្យ ហើយឥឡូវនេះខ្ញុំអាចបង្កើតគេហទំព័រមួយបានហើយ។ 
                        </p>
                      </div>
                      <div className="border-b border-blue-400 mt-8 mb-6" />
                      <h2 className="text-2xl font-bold text-slate-800">
                       សន ឆវ័ន
                      </h2>
                      <p className="text-gray-500 mt-2">និស្សិតឆ្នាំទី១</p>
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
                className={`w-3 h-3 rounded-full ${
                  currentIndex === i ? "bg-[#ffbf48]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </section>
      </>
      )
   
}