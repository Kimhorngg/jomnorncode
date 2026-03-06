import React from 'react';

const HeroBanner = () => {
  return (
    <section className="relative w-full bg-[#112d50] overflow-hidden min-h-[400px] flex items-center">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Content Column */}
        <div className="w-full md:w-5/12 text-left z-10 lg:pl-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-[#ffa503]">ឯកសារលម្អិត</span> 
            <span className="text-white ml-2">និងការណែនាំទៅកាន់អ្នកប្រើប្រាស់</span>
          </h1>
          
          <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed max-w-md">
            ចូលរួមជាមួយសិស្សជាង ១០០០ នាក់ផ្សេងទៀតក្នុងការកសាងអនាគតបច្ចេកវិទ្យារបស់អ្នក។
          </p>
          
          <button className="bg-white hover:bg-gray-300 text-[#ffa503] font-bold py-2 px-6 rounded-xl transition-colors duration-300 shadow-md text-lg">
            ចុះឈ្មោះឥឡូវនេះ
          </button>
        </div>

        {/* Right Image Column */}
        <div className="w-full md:w-1/2 flex justify-end mt-10 md:mt-0 relative">
          <img 
            src="src/assets/photo 6.png" 
            alt="Student with laptop" 
            className="h-auto max-h-[500px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;