import React from "react";
import SocialRow from "../layout/SocialRow.jsx";

export default function MemberCard({ item }) {
  const isLogo = item?.isLogo;

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1c293e] text-center shadow-sm hover:shadow-md hover:scale-105 transition-all
      ${isLogo ? "p-10" : "p-6"}`}
    >
      <div
        className={`mx-auto overflow-hidden rounded-full border-4 border-slate-200 dark:border-[#314057] bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center
        ${isLogo ? "h-40 w-40 md:h-44 md:w-44" : "h-32 w-32"}`}
      >
        <img
          src={item.img}
          alt={item.name}
          className={`h-full w-full ${isLogo ? "object-contain p-2" : "object-cover"}`}
        />
      </div>

      {/* ✅ Hide text + socials for logo */}
      {!isLogo && (
        <>
          <p className="mt-4 text-2xl font-[Battambang] font-semibold text-slate-800">
            {item.name}
          </p>

          <p className="text-base font-[Battambang] text-blue-500 font-semibold mt-1">
            {item.role}
          </p>

          {item.quote && (
            <p className="mt-3 text-sm font-[Battambang] dark:text-white text-slate-600 italic px-2">
              " {item.quote} "
            </p>
          )}

          <SocialRow className="mt-4 justify-center" />
        </>
      )}
    </div>
  );
}
