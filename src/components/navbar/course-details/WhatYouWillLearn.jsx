
import React from 'react';

const WhatYouWillLearn = ({ title, description }) => {
  return (
    <div className="w-full bg-[#fafafa] dark:bg-[#091220] py-16">
      <div className="max-w-[1610px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-[#112d4f] flex items-center gap-2">
            អ្វីដែលអ្នកនឹងបាន<span className="text-[#ffa306]">រៀន</span> 
          </h2>
        </div>

        <div className="max-w-7xl">
          <p className="text-gray-600 dark:text-[#939ca7] text-sm md:text-xl leading-relaxed text-justify md:text-left">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default WhatYouWillLearn;
