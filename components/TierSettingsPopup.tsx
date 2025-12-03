"use client";

import { useTierStore } from "@/store/useTierStore";
import { RefObject, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

export function TierSettingsPopup({
  popupRef,
  onClose,
  tierId,
  tierColor,
}: {
  popupRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  tierId: string;
  tierColor: string;
}) {
  const updateTierColor = useTierStore.getState().updateTierColor;

  const handleColorChange = (newColor: string) => {
    console.log(newColor);
    updateTierColor(tierId, newColor);
  };

  return (
    <div
      ref={popupRef}
      className="absolute left-4 bottom-1 translate-y-full  text-black p-2 rounded-lg bg-white shadow-lg z-20 w-fit"
    >
      <div className=" flex flex-col gap-2">
        <HexColorPicker color={tierColor} onChange={handleColorChange} />
        <HexColorInput
          className="shadow-md p-0.5 rounded-sm"
          color={tierColor}
          onChange={handleColorChange}
          prefixed
        />
      </div>

      <button
        className="text-xs mt-2 underline cursor-pointer"
        onClick={onClose}
      >
        close
      </button>
    </div>
  );
}
