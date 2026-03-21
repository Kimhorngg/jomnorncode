import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const StepCard = ({
  stepNumber,
  title,
  steps,
  bgColor,
  borderColor,
  textColor,
  listColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ITEMS = 3;
  const displayedSteps = isExpanded ? steps : steps.slice(0, INITIAL_ITEMS);
  const hasMoreItems = steps.length > INITIAL_ITEMS;

  return (
    <div className="flex justify-center px-4 py-6 mt-10">
      {/* Smaller card wrapper */}
      <div className="w-full max-w-[1535px]">
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
            {displayedSteps.map((text, index) => (
              <li
                key={index}
                className="text-base md:text-lg font-medium leading-relaxed"
                style={{ color: listColor }}
              >
                <span className="ml-2" style={{ color: textColor }}>
                  {text}
                </span>
              </li>
            ))}
          </ol>

          {/* Expand/Collapse Button */}
          {hasMoreItems && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center gap-2 font-semibold transition-all hover:opacity-70"
              style={{ color: listColor }}
            >
              <span>{isExpanded ? "លាក់ប្រព័ន្ធ" : "បង្ហាញលម្អិត"}</span>
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepCard;
