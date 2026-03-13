import React from "react";

export default function FeatureCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl dark:bg-[#1c293e] border border-slate-200 bg-white p-5 text-left shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2f60a9] text-white">
        <Icon className="h-5 w-5 stroke-[2.5]" />
      </div>

      {/* Title */}
      <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-[#62748d]">{item.title}</p>

      {/* Description */}
      <p className="mt-2 text-base leading-7 dark:text-[#d1d5dc] text-slate-600">{item.desc}</p>
    </div>
  );
}
