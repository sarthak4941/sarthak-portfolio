"use client";

import { useState } from "react";
import { skillDoors, SkillDoor } from "@/data/doors";
import { DoorModal } from "@/components/common/DoorModal";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";

export function SkillDoorsWall() {
  const [hoveredDoorId, setHoveredDoorId] = useState<string | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<SkillDoor | null>(null);
  const [openDoorId, setOpenDoorId] = useState<string | null>(null);

  const hoveredDoor = skillDoors.find((d) => d.id === hoveredDoorId) || null;
  const hoveredIndex = hoveredDoor ? skillDoors.indexOf(hoveredDoor) : -1;

  const handleDoorClick = (door: SkillDoor) => {
    sound.playDoorOpen();
    setOpenDoorId(door.id);

    // Realistic door swing animation, then open deep-dive modal
    setTimeout(() => {
      setSelectedDoor(door);
    }, 450);
  };

  const handleCloseModal = () => {
    setSelectedDoor(null);
    setOpenDoorId(null);
  };

  return (
    <>
      <div className="relative w-full py-12 md:py-16 select-none overflow-hidden">
        
        {/* Subtle floor shadow line */}
        <div className="absolute bottom-16 left-0 right-0 h-[1px] bg-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Doors Row Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap lg:flex-nowrap items-end justify-center gap-6 sm:gap-8 lg:gap-10 pb-6">
            {skillDoors.map((door) => {
              const isHovered = hoveredDoorId === door.id;
              const isOtherHovered = hoveredDoorId !== null && !isHovered;
              const isOpen = openDoorId === door.id;

              return (
                <div
                  key={door.id}
                  onMouseEnter={() => {
                    setHoveredDoorId(door.id);
                    sound.playHover();
                  }}
                  onMouseLeave={() => {
                    if (hoveredDoorId === door.id) {
                      setHoveredDoorId(null);
                    }
                  }}
                  onClick={() => handleDoorClick(door)}
                  className={`relative cursor-pointer transition-all duration-500 ease-out flex-shrink-0 ${
                    isHovered
                      ? "z-30 scale-[1.03] -translate-y-2"
                      : isOtherHovered
                      ? "opacity-30 filter brightness-[0.65] blur-[0.4px] scale-[0.97]"
                      : "opacity-100 scale-100"
                  }`}
                  style={{
                    perspective: "1200px",
                  }}
                >
                  {/* Floating "Click to enter" pill indicator on hover (Reference style) */}
                  <div
                    className={`absolute -right-6 top-[58%] z-40 px-3.5 py-1.5 rounded-full bg-white text-black font-onest text-xs font-bold shadow-[0_10px_25px_rgba(0,0,0,0.7)] flex items-center gap-1.5 transition-all duration-300 pointer-events-none ${
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    }`}
                  >
                    <span>Click to enter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>

                  {/* Arched Outer Architrave Frame (Reference Architecture) */}
                  <div
                    className={`relative w-[220px] sm:w-[245px] md:w-[260px] h-[460px] sm:h-[490px] md:h-[510px] rounded-t-full p-3 sm:p-3.5 bg-gradient-to-b from-[#252733] via-[#14151e] to-[#09090e] border transition-all duration-500 ${
                      isHovered
                        ? "border-[#ebd085] shadow-[0_0_35px_rgba(235,208,133,0.45),0_25px_50px_rgba(0,0,0,0.95)]"
                        : "border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
                    }`}
                    style={{
                      borderTopLeftRadius: "135px",
                      borderTopRightRadius: "135px",
                    }}
                  >
                    {/* Inner Door Jamb Recess */}
                    <div
                      className="relative w-full h-full rounded-t-full bg-[#050508] overflow-hidden border border-black/80 shadow-inner flex items-center justify-center"
                      style={{
                        borderTopLeftRadius: "125px",
                        borderTopRightRadius: "125px",
                      }}
                    >
                      {/* Behind the Door: Radiant Light Portal */}
                      <div
                        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${door.glowColor} 0%, rgba(5,5,8,0.95) 75%)`,
                          opacity: isOpen ? 1 : isHovered ? 0.35 : 0.06,
                        }}
                      >
                        <Sparkles
                          className={`w-10 h-10 mb-2 animate-spin-slow text-amber-200 transition-opacity duration-500 ${
                            isOpen || isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        <div
                          className={`font-onest text-xs uppercase text-white font-bold tracking-widest transition-opacity duration-500 ${
                            isOpen ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          ENTERING...
                        </div>
                      </div>

                      {/* 3D Hinged Arched Door Leaf (Swings slightly on hover, fully opens on click) */}
                      <div
                        className="absolute inset-0 z-10 rounded-t-full cursor-pointer transition-transform duration-500 ease-out origin-left flex flex-col justify-between p-5 border border-black/40"
                        style={{
                          borderTopLeftRadius: "125px",
                          borderTopRightRadius: "125px",
                          transformStyle: "preserve-3d",
                          transform: isOpen
                            ? "rotateY(-85deg)"
                            : isHovered
                            ? "rotateY(-18deg) translateZ(14px)"
                            : "rotateY(0deg) translateZ(0px)",
                          backgroundColor: door.doorColor,
                          backgroundImage: `
                            linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%),
                            repeating-linear-gradient(90deg, transparent, transparent 11px, rgba(0,0,0,0.32) 12px, rgba(255,255,255,0.06) 13px)
                          `,
                          boxShadow: isHovered
                            ? "inset 0 0 25px rgba(0,0,0,0.5), 12px 16px 35px rgba(0,0,0,0.7), -1px 0 6px rgba(235,208,133,0.3)"
                            : "inset 0 0 35px rgba(0,0,0,0.8), inset 1px 1px 2px rgba(255,255,255,0.1)",
                        }}
                      >
                        {/* Upper Door Arched Bevel Detail */}
                        <div className="pt-2 flex justify-center">
                          <div
                            className="w-20 h-10 rounded-t-full border-t border-x border-white/10 opacity-40 pointer-events-none"
                            style={{
                              borderTopLeftRadius: "40px",
                              borderTopRightRadius: "40px",
                            }}
                          />
                        </div>

                        {/* Polished Golden Brass Nameplate (Reference: WEB DEVELOPER, etc.) */}
                        <div className="my-auto flex justify-center">
                          <div className="relative px-4 py-2 rounded-[5px] bg-gradient-to-r from-[#d8af47] via-[#fae69e] to-[#c79c36] shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_1px_rgba(0,0,0,0.4)] border border-[#a87f22] flex items-center justify-center min-w-[140px]">
                            {/* Four Corner Mounting Screws */}
                            <span className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-[#523b0d] shadow-inner" />
                            <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-[#523b0d] shadow-inner" />
                            <span className="absolute bottom-1 left-1.5 w-1 h-1 rounded-full bg-[#523b0d] shadow-inner" />
                            <span className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-[#523b0d] shadow-inner" />

                            {/* Etched Brass Title */}
                            <span className="font-onest text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-[#2c1e08] uppercase text-center leading-tight drop-shadow-[0_0.5px_0_rgba(255,255,255,0.6)]">
                              {door.doorSign}
                            </span>
                          </div>
                        </div>

                        {/* Lower Door Hardware: Golden Brass Lever Handle & Keyhole */}
                        <div className="relative flex flex-col items-end pr-2 pb-8">
                          
                          {/* Horizontal Golden Lever Handle */}
                          <div className="relative flex items-center">
                            {/* Vertical Handle Backplate */}
                            <div className="w-[10px] h-[34px] rounded-[3px] bg-gradient-to-b from-[#f5e298] via-[#cca23d] to-[#997320] border border-[#7a5812] shadow-[0_2px_5px_rgba(0,0,0,0.6)] flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#61450a]" />
                            </div>

                            {/* Lever Shank & Horizontal Bar */}
                            <div className="absolute right-1 w-[38px] h-[7px] rounded-r-[3px] bg-gradient-to-r from-[#cca23d] via-[#fae69e] to-[#b3892b] border border-[#7a5812] shadow-[0_4px_8px_rgba(0,0,0,0.6)]" />
                          </div>

                          {/* Matching Golden Keyhole Escutcheon */}
                          <div className="mt-2.5 mr-0.5 w-[8px] h-[12px] rounded-[2px] bg-gradient-to-b from-[#f5e298] to-[#997320] border border-[#7a5812] shadow-sm flex flex-col items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-black" />
                            <span className="w-[1px] h-[3px] bg-black" />
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= HOVER CONTENT PREVIEW PANEL (Reference: media_1793617911515_026ea370.png) ================= */}
          {hoveredDoor && (
            <div
              className={`hidden lg:block absolute top-12 z-30 max-w-md w-full transition-all duration-300 pointer-events-none animate-fadeIn ${
                hoveredIndex <= 1
                  ? "right-8 xl:right-16 text-left"
                  : "left-8 xl:left-16 text-left"
              }`}
            >
              <div className="glass-panel p-8 rounded-3xl border-white/15 bg-black/85 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-5">
                
                {/* Heading & Subtitle */}
                <div>
                  <h3 className="font-onest font-black text-3xl xl:text-4xl text-white tracking-tight">
                    {hoveredDoor.title}
                  </h3>
                  <p className="font-onest text-xs font-semibold uppercase tracking-[0.22em] text-white/50 mt-1">
                    {hoveredDoor.subtitle}
                  </p>
                </div>

                {/* Checklist with circular checkmark badges */}
                <div className="space-y-3 pt-2">
                  {hoveredDoor.checklist.map((item, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-onest text-sm text-slate-200 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer hint */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-onest text-white/60">
                  <span className="font-editorial italic">Click door to open detailed view</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* Behind the Door Project Deep-Dive Modal */}
      <DoorModal door={selectedDoor} onClose={handleCloseModal} />
    </>
  );
}
