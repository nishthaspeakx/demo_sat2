import React from "react";
import { motion } from "framer-motion";

/**
 * MapScreen — the city map. Uses the attached map image as a full-screen
 * background (object-cover). A transparent button sits over the orange "Start"
 * to trigger the transition. Design is left exactly as the image.
 */
export default function MapScreen({ onStart }) {
  return (
    <motion.div
      key="map"
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.12 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      <img
        src="/assets/map.png"
        alt="Visit Taj Mahal map"
        className="h-full w-full object-cover object-top"
        draggable={false}
      />

      {/* clickable "Start" hotspot over the card's orange button */}
      <button
        type="button"
        onClick={onStart}
        aria-label="Start — Visit Taj Mahal"
        className="absolute rounded-full active:scale-95"
        style={{ right: "4%", bottom: "3.5%", width: "34%", height: "6.5%" }}
      />
    </motion.div>
  );
}
