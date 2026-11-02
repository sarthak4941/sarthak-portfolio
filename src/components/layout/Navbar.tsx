"use client";

import { useState, useEffect } from "react";
import { sound } from "@/lib/sound";
import { SoundToggle } from "@/components/common/SoundToggle";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Skills", href: "#doors" },
  { name: "Projects", href: "#doors" },
  { name: "Journey", href: "#story" },
  { name: "About", href: "#story" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format: 2:14 pm
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).toLowerCase();

      // Format: 2 November, 2026
      const dateStr = now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLinkClick = (name: string, href: string) => {
    sound.playClick();
    setActiveSection(name);
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full px-4 sm:px-8 md:px-12 pt-5 pb-3 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* ================= LEFT BALANCING SPACER (Desktop) ================= */}
          <div className="hidden md:flex flex-1 items-center justify-start" aria-hidden="true" />

          {/* ================= NAVIGATION LINKS (CENTERED & BALANCED) ================= */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1 sm:gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.name;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.name, link.href);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3.5 py-1.5 rounded-full font-onest text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? "text-white bg-white/15 shadow-sm font-semibold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Mobile spacing placeholder */}
          <div className="md:hidden flex-1" />

          {/* ================= RIGHT CONTROLS: TIME PILL + SOUND + MOBILE MENU ================= */}
          <div className="pointer-events-auto flex md:flex-1 items-center justify-end gap-2 sm:gap-3 mr-12 sm:mr-16">
            
            {/* Live Time Pill (Reference Style) */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-mono text-white/70 shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Local time <strong className="text-white font-medium">{currentTime || "2:14 pm"}</strong> • {currentDate || "2 November, 2026"}
              </span>
            </div>

            <SoundToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-full bg-black/40 border border-white/10 text-white hover:border-white/30 transition-all"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center p-6 space-y-6 md:hidden animate-fadeIn">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center space-y-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.name, link.href);
                }}
                className="font-onest text-2xl font-bold text-white hover:text-slate-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 text-xs font-mono text-white/50 text-center">
            Local time {currentTime || "2:14 pm"} • {currentDate}
          </div>
        </div>
      )}
    </>
  );
}
