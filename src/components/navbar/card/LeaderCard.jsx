import React from "react";
import SocialRow from "../layout/SocialRow.jsx";

export default function LeaderCard({ item }) {
  return (
    <div className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Photo - Small and Square */}
      <img
        src={item.img}
        alt={item.name}
        className="h-32 w-32 flex-shrink-0 rounded-lg object-cover"
      />

      {/* Content */}
      <div className="flex flex-col justify-between flex-1">
        {/* Name & role */}
        <div>
          <h3 className="text-lg font-bold text-[#073170] font-[Battambang]">
            {item.name}
            <span className="text-[#073170]">{item.firstName} </span>
            <span className="text-blue-400">{item.highlight} </span>
            <span className="text-blue-400">{item.lastName}</span>
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm leading-5 text-slate-500 font-[Battambang] mt-3">
          {item.desc}
        </p>

        {/* Social Icons */}
        <SocialRow className="mt-3" />
      </div>
    </div>
  );
}
