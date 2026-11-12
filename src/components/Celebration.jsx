import React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Heart, Sparkles } from "lucide-react";

export default function Celebration({ onCelebrate, names }) {
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const timeout = useRef(null);
  const revealTimeout = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(timeout.current);
    window.clearTimeout(revealTimeout.current);
  }, []);

  const openGift = () => {
    if (opened) return;
    setOpened(true);
    setConfetti(Array.from({ length: 90 }, (_, index) => ({
      id: index,
      left: `${(index * 37 + index * index * 19) % 100}%`,
      delay: `${(index % 17) * 0.035}s`,
      duration: `${2.8 + (index % 13) * 0.14}s`,
      drift: `${((index * 41) % 200) - 100}px`,
      color: ["#eac58c", "#e98796", "#fff1d2", "#c06b7d", "#dfb672"][index % 5],
    })));
    onCelebrate();
    revealTimeout.current = window.setTimeout(() => setRevealed(true), 700);
    timeout.current = window.setTimeout(() => setConfetti([]), 6500);
  };

  return (
    <div className="gift-experience">
      <AnimatePresence>
        {confetti.length > 0 && (
          <motion.div className="confetti-layer" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {confetti.map((piece) => <i className="confetti-piece" key={piece.id} style={{ left: piece.left, animationDelay: piece.delay, animationDuration: piece.duration, backgroundColor: piece.color, "--drift": piece.drift }} />)}
            {[16, 36, 61, 82].map((left, index) => <span className="firework-burst" key={left} style={{ left: `${left}%`, top: `${16 + index % 2 * 18}%`, animationDelay: `${index * .18}s` }}>{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--angle": `${i * 30}deg`, animationDelay: `${index * .18}s` }} />)}</span>)}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="gift-stage">
        {!opened ? (
          <motion.button className="gift-box" type="button" onClick={openGift} aria-label="Open the anniversary gift" whileHover={{ y: -8, rotateY: 10, rotateX: -6 }} whileTap={{ scale: 0.94 }}>
            <span className="gift-box-bow"><i /><i /></span>
            <span className="gift-box-lid"><i /><b /></span>
            <span className="gift-box-body"><i /><b /></span>
            <span className="gift-click"><Gift size={16} /> OPEN YOUR GIFT</span>
          </motion.button>
        ) : !revealed ? (
          <div className="gift-opening" aria-label="Opening your anniversary gift">
            <motion.span className="gift-opening-lid" initial={{ y: 0, rotate: 0 }} animate={{ y: -78, x: 25, rotate: 24, opacity: 0.25 }} transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }} />
            <motion.span className="gift-opening-body" initial={{ y: 0 }} animate={{ y: 9, scale: 0.96 }} transition={{ duration: 0.65 }} />
            <motion.span className="gift-opening-heart" initial={{ opacity: 0, y: 26, scale: 0.4 }} animate={{ opacity: [0, 1, 0], y: -45, scale: 1.2 }} transition={{ duration: 0.68, ease: "easeOut" }}><Heart size={30} fill="currentColor" /></motion.span>
          </div>
        ) : (
          <motion.div className="gift-opened" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 160, damping: 17 }}>
            <motion.span className="gift-heart-float" animate={{ y: [0, -22, 0], scale: [1, 1.15, 1] }} transition={{ duration: 2.1, repeat: Infinity }}><Heart size={47} fill="currentColor" /></motion.span>
            <Sparkles className="gift-open-sparkle" size={20} />
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div className="gift-reveal" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.2 }}>
            <p className="eyebrow eyebrow-gold">A little wish, just for you</p>
            <p className="gift-message serif">May you keep finding a thousand reasons to fall in love with each other, in every season of life. Here's to a forever that just keeps getting sweeter.</p>
            <span className="gift-signature script">Happy Anniversary, {names} <Heart size={15} fill="currentColor" /></span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
