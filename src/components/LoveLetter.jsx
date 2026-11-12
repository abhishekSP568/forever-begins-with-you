import React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MailOpen, Sparkles } from "lucide-react";

const message = "May your love continue to grow stronger with every passing year. Your journey together is an inspiration, and I wish you both endless happiness, laughter, understanding, and beautiful memories. May you stay together forever, holding each other's hands through every moment of life. Happy Wedding Anniversary!";

export default function LoveLetter() {
  const [open, setOpen] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const timer = useRef(null);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const openLetter = () => {
    if (open) return;
    setOpen(true);
    setVisibleChars(0);
    let position = 0;
    timer.current = window.setInterval(() => {
      position = Math.min(position + 5, message.length);
      setVisibleChars(position);
      if (position === message.length) window.clearInterval(timer.current);
    }, 24);
  };

  return (
    <div className={`letter-experience${open ? " letter-is-open" : ""}`}>
      {!open ? (
        <motion.button type="button" className="letter-envelope" onClick={openLetter} whileHover={{ y: -7, scale: 1.025 }} whileTap={{ scale: 0.98 }} aria-label="Open your secret love letter">
          <span className="letter-envelope-back" />
          <span className="letter-envelope-paper"><Heart fill="currentColor" size={23} /></span>
          <span className="letter-envelope-front" />
          <span className="letter-envelope-seal"><Heart fill="currentColor" size={18} /></span>
          <span className="letter-envelope-hint">A LETTER, JUST FOR YOU</span>
        </motion.button>
      ) : (
        <AnimatePresence mode="wait">
          <motion.article className="love-letter-paper" initial={{ opacity: 0, y: 25, rotateX: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <div className="paper-ornament"><Sparkles size={14} /><span>WITH ALL MY HEART</span><Sparkles size={14} /></div>
            <p className="letter-dear script">My dearest Akka &amp; Bava,</p>
            <p className="letter-body serif">{message.slice(0, visibleChars)}{visibleChars < message.length && <span className="type-cursor" aria-hidden="true">|</span>}</p>
            <p className="letter-signoff script">With Love, Your Brother <Heart className="signature-heart" size={16} fill="currentColor" /></p>
            <span className="paper-heart" aria-hidden="true">♥</span>
            <button type="button" className="letter-close" onClick={() => { setOpen(false); window.clearInterval(timer.current); }}><MailOpen size={14} /> Fold the letter</button>
          </motion.article>
        </AnimatePresence>
      )}
    </div>
  );
}
