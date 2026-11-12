import React from "react";
import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, highlight, description, light = false }) {
  return (
    <motion.div
      className={`section-heading-wrap${light ? " section-heading-light" : ""}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7 }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title serif">{title} <em>{highlight}</em></h2>
      {description && <p className="section-description">{description}</p>}
    </motion.div>
  );
}
