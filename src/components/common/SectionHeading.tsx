interface SectionHeadingProps {
  badge: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-16 md:mb-20 ${isCenter ? "text-center mx-auto" : "text-left"} max-w-3xl`}>
      {/* Editorial Category Pill */}
      <div
        className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border-white/10 mb-4 ${
          isCenter ? "justify-center" : ""
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
        <span className="font-onest text-[11px] uppercase tracking-[0.25em] text-slate-300 font-semibold">
          {badge}
        </span>
      </div>

      {/* Main Title with Onest Typography */}
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase font-onest mb-4 leading-tight">
        {title}
      </h2>

      {/* Subtitle with EB Garamond Editorial Italic */}
      {subtitle && (
        <p className="font-editorial italic text-lg sm:text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}

      {/* Minimal Editorial Accent Line */}
      <div className={`flex items-center gap-2 mt-6 ${isCenter ? "justify-center" : ""}`}>
        <div className="h-[1px] w-12 bg-white/20" />
        <div className="w-1 h-1 rounded-full bg-white/60" />
        <div className="h-[1px] w-12 bg-white/20" />
      </div>
    </div>
  );
}
