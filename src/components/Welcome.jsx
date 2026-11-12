import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, Heart, Sparkles } from "lucide-react";

export default function Welcome({ names, onEnter, open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="welcome-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.035, filter: "blur(10px)" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
        >
          <div className="welcome-orbit welcome-orbit-one" />
          <div className="welcome-orbit welcome-orbit-two" />
          <div className="welcome-film-grain" />
          <motion.div
            className="welcome-card glass-panel"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <Sparkles className="welcome-sparkle" size={17} />
            <p className="eyebrow eyebrow-gold">A love letter, made just for you</p>
            <h1 id="welcome-title" className="welcome-heading serif">
              A Special Celebration
              <span>for Two Beautiful Souls</span>
            </h1>
            <p className="welcome-subtitle">A little story about a love that feels like home.</p>
            <motion.div
              className="welcome-envelope"
              animate={{ y: [0, -7, 0], rotate: [0, -1.5, 1.5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <div className="envelope-paper"><Heart fill="currentColor" size={19} /></div>
              <div className="envelope-flap" />
              <div className="envelope-seal"><Heart fill="currentColor" size={17} /></div>
            </motion.div>
            <p className="welcome-names script">{names}</p>
            <button type="button" className="button button-gold" onClick={onEnter}>
              Enter Your Love Story <ArrowDown size={16} />
            </button>
            <p className="welcome-footnote">BEST EXPERIENCED WITH YOUR HEART OPEN</p>
          </motion.div>
          <span className="welcome-bottom-note">FOREVER BEGINS WITH YOU · EST. WITH LOVE</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
