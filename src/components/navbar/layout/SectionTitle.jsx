import React from "react";

export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-orange-500">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-2 text-2xl font-[Battambang] text-[#073170] md:text-3xl">
        {title}

      </h2>

      {subtitle ? (
        <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base mt-8">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
