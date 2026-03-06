import React from 'react';

const StepCard = ({ stepNumber, title, steps, bgColor, borderColor, textColor, listColor }) => {
  return (
    <div className="flex justify-center px-4 py-6 mt-10">
      {/* Smaller card wrapper */}
      <div className="w-full max-w-[1435px]">
        {/* ចំណងជើងជំហាន */}
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          <span className="text-[#f9a825]">ជំហានទី{stepNumber} ៖ </span>
          <span className="text-[#112d51]">{title}</span>
        </h2>

        {/* ប្រអប់ខ្លឹមសារ */}
        <div 
          className="w-full rounded-md p-6 md:p-8 border-l-4 shadow-sm transition-all"
          style={{ backgroundColor: bgColor, borderLeftColor: borderColor }}
        >
          <ol className="list-decimal list-inside space-y-3">
            {steps.map((text, index) => (
              <li 
                key={index} 
                className="text-base md:text-lg font-medium leading-relaxed"
                style={{ color: listColor }}
              >
                <span className="ml-2" style={{ color: textColor }}>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default StepCard;