import { Facebook, Send, Github } from "lucide-react";

const IconWrap = ({ children }) => (
  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
    {children}
  </span>
);

export default function SocialRow({ className = "" }) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label="social links"
    >
      {/* Facebook */}
      <a href="#" aria-label="Facebook">
        <IconWrap>
          <Facebook className="h-4 w-4" />
        </IconWrap>
      </a>

      {/* Telegram */}
      <a href="#" aria-label="Telegram">
        <IconWrap>
          <Send className="h-4 w-4" />
        </IconWrap>
      </a>

      {/* Github */}
      <a href="#" aria-label="Github">
        <IconWrap>
          <Github className="h-4 w-4" />
        </IconWrap>
      </a>
    </div>
  );
}