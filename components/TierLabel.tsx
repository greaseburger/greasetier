"use client";

import { useState, useRef, useEffect } from "react";
import { useTierStore } from "@/store/useTierStore";
import { TierSettingsPopup } from "./TierSettingsPopup";

export function TierLabel({
  id,
  name,
  color,
  className,
}: {
  id: string;
  name: string;
  color: string;
  className: string | undefined;
}) {
  const [settingsActive, setSettingsActive] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const updateTier = useTierStore((state) => state.updateTier);

  const toggleSettings = () => setSettingsActive((prev) => !prev);

  useEffect(() => {
    if (!settingsActive) return;

    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSettingsActive(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [settingsActive]);

  return (
    <div
      className={
        "w-32 relative flex justify-center rounded-tr-none " + className
      }
      style={{ backgroundColor: color }}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => updateTier(id, e.target.value)}
        placeholder="tier name..."
        className="p-1 w-full text-xl text-center focus:outline-none"
      />

      <button
        className="absolute left-0 bottom-0 m-1 cursor-pointer"
        onClick={toggleSettings}
      >
        ⚙️
      </button>

      {settingsActive && (
        <TierSettingsPopup
          popupRef={popupRef}
          onClose={() => setSettingsActive(false)}
          tierId={id}
          tierColor={color}
        />
      )}
    </div>
  );
}
