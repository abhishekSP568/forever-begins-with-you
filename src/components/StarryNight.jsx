import React from "react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function createHeartPoints(count) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count;
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y = 13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle);
    return { left: `${50 + (x / 20) * 31}%`, top: `${46 - (y / 19) * 35}%`, delay: `${(index % 17) * 0.08}s` };
  });
}

export default function StarryNight({ names, weddingDate, onQuote }) {
  const stars = useMemo(() => Array.from({ length: 85 }, (_, index) => ({
    left: `${(index * 47 + index * index * 13) % 100}%`,
    top: `${(index * 67 + index * index * 7) % 100}%`,
    size: `${index % 11 === 0 ? 3 : 1 + (index % 3) * 0.4}px`,
    delay: `${(index % 17) * 0.18}s`,
  })), []);
  const heart = useMemo(() => createHeartPoints(78), []);
  const [shooting, setShooting] = useState(0);

  const dateLabel = weddingDate
    ? new Date(`${weddingDate}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "A date written among the stars";

  return (
    <div className="starfield" onClick={() => { setShooting((value) => value + 1); onQuote(); }}>
      <div className="nebula nebula-one" /><div className="nebula nebula-two" />
      {stars.map((star, index) => <i className={`sky-star${index % 11 === 0 ? " sky-star-large" : ""}`} key={index} style={{ left: star.left, top: star.top, "--star-size": star.size, animationDelay: star.delay }} />)}
      {heart.map((point, index) => <i className="heart-star" key={index} style={{ left: point.left, top: point.top, animationDelay: point.delay }} />)}
      {(shooting % 3 === 1) && <motion.i className="shooting-star" key={shooting} initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], x: 270, y: 180 }} transition={{ duration: 1.4 }} />}
      <motion.div className="sky-message" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
        <Sparkles className="sky-sparkle" size={18} />
        <p className="eyebrow eyebrow-gold">Written in the stars</p>
        <h2 className="sky-title serif">Two Souls,<br /><em>One Universe</em></h2>
        <p className="sky-names script">{names}</p>
        <span className="sky-date">{dateLabel}</span>
        <p className="sky-invitation">Make a wish. The sky is listening.</p>
        <span className="sr-only">Click the night sky to reveal a shooting star and a hidden love note.</span>
      </motion.div>
    </div>
  );
}
