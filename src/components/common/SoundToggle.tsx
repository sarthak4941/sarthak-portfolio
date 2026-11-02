"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    sound.enabled = nextState;
    if (nextState) {
      sound.playClick();
    }
  };

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? "Mute interactive audio" : "Enable futuristic sound effects"}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel hover:border-cyan-400/40 text-xs font-mono text-slate-300 transition-all duration-200"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline text-cyan-400">AUDIO ON</span>
          <span className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-full bg-cyan-400 animate-[pulse_0.6s_ease-in-out_infinite]" />
            <span className="w-0.5 h-2 bg-cyan-400 animate-[pulse_0.9s_ease-in-out_infinite]" />
            <span className="w-0.5 h-3 bg-cyan-400 animate-[pulse_0.7s_ease-in-out_infinite]" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline text-slate-500">AUDIO OFF</span>
        </>
      )}
    </button>
  );
}
