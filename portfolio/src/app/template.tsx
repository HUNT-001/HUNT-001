"use client";
import { motion } from "framer-motion";

// Route change: content rises and fades in. Only opacity + transform (GPU-composited);
// the transform is cleared at the end so fixed-position children are never affected.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transitionEnd: { transform: "none" } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
