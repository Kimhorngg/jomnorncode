import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CourseCurriculum({ courseId, lessons = [] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleLessons = showAll ? lessons : lessons.slice(0, 3);

  // Helper to convert numbers to Khmer numerals
  const toKhmerNumber = (num) => {
    const khmerDigits = ["០","១","២","៣","៤","៥","៦","៧","៨","៩"];
    return String(num)
      .split("")
      .map((digit) => khmerDigits[parseInt(digit)])
      .join("");
  };

  return (
    <div className="max-w-[1420px] mx-auto bg-white px-6 sm:px-10 md:px-14 py-8 sm:py-10 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#112d4f] font-bold text-center mb-8 sm:mb-10">
        មេរៀនសម្រាប់សិក្សា
      </h2>

      {visibleLessons.map((lesson, index) => (
        <div
          key={lesson.id}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#fafafa] rounded-xl px-4 py-5 sm:py-6 shadow-sm gap-4 sm:gap-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex text-xl sm:text-2xl items-center justify-center bg-gray-200 text-[#ffa405] font-bold rounded-full">
              {toKhmerNumber(index + 1)}
            </div>
            <span className="text-[#6c7180] text-lg sm:text-xl">{lesson.title}</span>
          </div>

          <Link
            to={`/coursedetail/${courseId}/lesson/${lesson.id}`}
            className="mt-3 sm:mt-0 inline-block bg-[#3f71af] hover:bg-[#112d4f] text-white px-5 py-2.5 rounded-full font-medium shadow-md transition-all duration-200 hover:scale-105"
          >
            ចូលរៀន
          </Link>
        </div>
      ))}

      {lessons.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-white text-[#3f71af] border border-[#3f71af] hover:bg-[#3f71af] hover:text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105"
          >
            {showAll ? "បង្ហាញតិចតួច" : "បង្ហាញច្រើន"}
          </button>
        </div>
      )}
    </div>
  );
}