import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "./icons.jsx";

/**
 * SuccessCard — green confirmation shown after a correct answer.
 */
export default function SuccessCard({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-3 mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-center shadow-lg"
    >
      <p className="mb-3 text-[16px] font-bold text-emerald-700">{text}</p>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
        className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow"
      >
        <CheckCircle className="h-6 w-6" />
      </motion.span>
    </motion.div>
  );
}
