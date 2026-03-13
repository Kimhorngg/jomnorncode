import React from "react";
import SocialRow from "../layout/SocialRow.jsx";

export default function LeaderCard({ item }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-[#314057] bg-white dark:bg-[#1c293e] p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5 md:flex-row md:items-start md:gap-5 lg:p-6">
      <img
        src={item.img}
        alt={item.name}
        className="h-44 w-full rounded-xl object-cover object-top sm:h-52 md:h-40 md:w-40 md:flex-shrink-0 md:rounded-2xl lg:h-44 lg:w-44"
      />

      <div className="flex flex-1 flex-col justify-between text-center md:min-w-0 md:text-left">
        <div>
          <h3 className="font-[Battambang] text-xl font-bold leading-tight text-[#073170] sm:text-2xl">
            {item.name}
            <span className="text-[#073170] dark:text-[#d1d5dd]">{item.firstName} </span>
            <span className="text-blue-400">{item.highlight} </span>
            <span className="text-blue-400">{item.lastName}</span>
          </h3>
        </div>

        <p className="mt-3 font-[Battambang] text-sm leading-7 text-slate-500 dark:text-white sm:text-base md:leading-8">
          {item.desc}
        </p>

        <SocialRow className="mt-4 justify-center md:justify-start" />
      </div>
    </div>
  );
}
