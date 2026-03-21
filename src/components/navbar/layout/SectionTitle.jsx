import React from "react";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  titleClassName = "",
  subtitleClassName = "",
}) {
  return (
    <div >
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-wide text-orange-500">
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={`mt-2 text-2xl font-[Battambang] dark:text-white text-[#073170] md:text-3xl ${titleClassName}`}
      >
        {title}
      </h2>

      {subtitle ? (
        <p
          className={`max-w-2xl  text-md leading-6 dark:text-[#62748c] text-slate-500 md:text-base mt-8 ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
