"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll reveal: opacity + translate only (composited, no blur), expo-out easing.
export default function Reveal({ children, delay = 0, y = 26 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
