import React from "react";

export default function FeatureCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
      
      {/* Icon */}
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2f60a9] text-white">
        <Icon className="h-4 w-4 stroke-[2.5]" />
      </div>

      {/* Title */}
      <p className="mt-3 text-s font-semibold text-slate-900">
        {item.title}
      </p>

      {/* Description */}
      <p className="mt-1 text-sm leading-6 text-slate-600">
        {item.desc}
      </p>
    </div>
  );
}