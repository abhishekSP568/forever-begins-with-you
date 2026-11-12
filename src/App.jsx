import React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowUp, AudioLines, Heart, Infinity, Menu, Music2, Pause,
  Play, Quote, Sparkles, Volume2, VolumeX, X,
} from "lucide-react";
import Welcome from "./components/Welcome.jsx";
import SectionHeading from "./components/SectionHeading.jsx";
import StoryTimeline from "./components/StoryTimeline.jsx";
import MemoryGallery from "./components/MemoryGallery.jsx";
import LoveCounter from "./components/LoveCounter.jsx";
import LoveLetter from "./components/LoveLetter.jsx";
import StarryNight from "./components/StarryNight.jsx";
import Celebration from "./components/Celebration.jsx";
import { defaultTimeline, initialMemories } from "./data/memories.js";
import { useAnniversaryMusic } from "./hooks/useAnniversaryMusic.js";

const futureDreams = [
  { icon: "01", title: "More happiness", detail: "The kind that sneaks up in the small, everyday moments." },
  { icon: "02", title: "More adventures", detail: "New places, unhurried mornings, and the same hand to hold." },
  { icon: "03", title: "More laughter", detail: "Private jokes that somehow get funnier every year." },
  { icon: "04", title: "More memories", detail: "So many beautiful tomorrows, waiting to become your favourites." },
  { icon: "05", title: "Forever together", detail: "Through every season, finding home in one another." },
];

const secretNotes = [
  "The best love stories aren't perfect. They're the ones where two people keep choosing each other.",
  "Somewhere between every laugh and every ordinary day, the two of you built something extraordinary.",
  "A lifetime of love is made one small kindness, one shared dream, one held hand at a time.",
  "The world feels softer with the two of you in it. Keep being each other's favourite place.",
];

const initialScript = { title: "Akka & Bava" };

function useStoredValue(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
      console.error(`Unable to read saved ${key} preferences.`, error);
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to save ${key} preferences.`, error);
    }
  }, [key, value]);
  return [value, setValue];
}

function AmbientPetals({ enabled }) {
  const [petals, setPetals] = useState([]);
  const petalId = useRef(0);
  useEffect(() => {
    if (!enabled) return undefined;
    const timer = window.setInterval(() => {
      const id = petalId.current++;
      setPetals((current) => [...current.slice(-11), {
        id,
        left: `${3 + Math.random() * 94}%`,
        size: `${9 + Math.random() * 12}px`,
        duration: `${9 + Math.random() * 7}s`,
        drift: `${(Math.random() - 0.5) * 145}px`,
      }]);
      window.setTimeout(() => setPetals((current) => current.filter((petal) => petal.id !== id)), 17_000);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [enabled]);
  return (
    <div className="petal-layer" aria-hidden="true">
      {petals.map((petal) => <span className="falling-petal" key={petal.id} style={{ left: petal.left, fontSize: petal.size, animationDuration: petal.duration, "--drift": petal.drift }}>✿</span>)}
    </div>
  );
}

function FinalCelebration({ names, onEasterEgg, onFinale }) {
  const [pieces, setPieces] = useState([]);
  const [burst, setBurst] = useState(0);
  const fire = () => {
    const palette = ["#f3d9aa", "#f0a4ad", "#fff4df", "#bd7183", "#e7c58e"];
    setPieces(Array.from({ length: 92 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: `${(index * 47 + index * index * 13) % 100}%`,
      delay: `${(index % 19) * 0.045}s`,
      duration: `${2.8 + (index % 11) * 0.17}s`,
      drift: `${((index * 53) % 230) - 115}px`,
      color: palette[index % palette.length],
    })));
    setBurst((current) => current + 1);
    onFinale?.();
    window.setTimeout(() => setPieces([]), 6200);
  };
  useEffect(() => { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) fire(); }, []);

  return (
    <section className="finale-section" id="finale">
      {pieces.length > 0 && (
        <div className="finale-particles" aria-hidden="true" key={burst}>
          {pieces.map((piece) => <i className="finale-confetti" key={piece.id} style={{ left: piece.left, animationDelay: piece.delay, animationDuration: piece.duration, backgroundColor: piece.color, "--drift": piece.drift }} />)}
          {[18, 38, 63, 84].map((left, index) => <span className="finale-burst" key={left} style={{ left: `${left}%`, top: `${20 + index % 2 * 24}%`, animationDelay: `${index * .2}s` }}>{Array.from({ length: 14 }, (_, i) => <i key={i} style={{ "--angle": `${i * (360 / 14)}deg` }} />)}</span>)}
        </div>
      )}
      <div className="finale-content">
        <Sparkles className="finale-sparkle" size={18} />
        <p className="eyebrow eyebrow-gold">And they lived, loved & laughed</p>
        <h2 className="finale-title serif">Happy Wedding<br /><em>Anniversary!</em></h2>
        <p className="finale-copy">May your love story continue beautifully,<br className="desktop-break" /> today, tomorrow and forever. <Heart className="inline-heart" size={18} fill="currentColor" /></p>
        <p className="script finale-names">{names}</p>
        <button type="button" className="button button-outline-gold" onClick={fire}><Sparkles size={16} /> Celebrate one more time</button>
        <p className="final-signature"><span>Made with endless love by</span><span className="script">Your Brother</span></p>
        <button className="hidden-note-trigger" type="button" onClick={onEasterEgg}>psst... one last little secret</button>
        <a className="button button-outline-gold finale-replay" href="#top"><ArrowUp size={15} /> Begin their story again</a>
      </div>
    </section>
  );
}

function MusicControls({ music, onNotice }) {
  const togglePlay = async () => {
    try {
      if (music.playing) await music.pause();
      else await music.start();
    } catch (error) {
      onNotice(`Music could not start: ${error.message}`);
    }
  };
  return (
    <div className="music-player" aria-label="Anniversary music controls">
      <span className={`music-pulse${music.playing && !music.muted ? " is-playing" : ""}`}><AudioLines size={17} /></span>
      <span className="music-copy"><b>OUR LITTLE SOUNDTRACK</b><small>Original melody · made for you</small></span>
      <button type="button" className="music-control" onClick={togglePlay} aria-label={music.playing ? "Pause anniversary music" : "Play anniversary music"}>{music.playing ? <Pause size={15} /> : <Play size={15} />}</button>
      <button type="button" className="music-control" onClick={music.toggleMute} aria-pressed={music.muted} aria-label={music.muted ? "Unmute anniversary music" : "Mute anniversary music"}>{music.muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
    </div>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const [names, setNames] = useStoredValue("forever-names", initialScript.title);
  const [timeline, setTimeline] = useStoredValue("forever-timeline", defaultTimeline);
  const [weddingDate, setWeddingDate] = useStoredValue("forever-date", "");
  const [toast, setToast] = useState("");
  const [dedicationOpen, setDedicationOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [draftNames, setDraftNames] = useState(names);
  const [logoClicks, setLogoClicks] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [secretMessage, setSecretMessage] = useState("");
  const toastTimer = useRef(null);
  const music = useAnniversaryMusic();

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const showNote = (message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 3900);
  };

  const revealSecret = (message) => {
    setSecretMessage(message || secretNotes[Math.floor(Math.random() * secretNotes.length)]);
    setSecretUnlocked(true);
  };

  const clickLogo = (event) => {
    event.preventDefault();
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next === 5) revealSecret("Five little taps, one big secret: the best brother-in-law in the world made this just for the two of you. ♥");
    else showNote(`${5 - next} more little ${5 - next === 1 ? "tap" : "taps"} on our heart for a secret. ♥`);
  };

  const saveTimeline = (next) => {
    setTimeline(next);
    const wedding = next.find((event) => event.id === "wedding");
    if (wedding?.date) setWeddingDate(wedding.date);
    showNote("A beautiful chapter, saved. ♥");
  };

  const saveNames = (event) => {
    event.preventDefault();
    const clean = draftNames.trim();
    if (!clean) return;
    setNames(clean);
    setDedicationOpen(false);
    showNote("Your dedication is now part of the story. ♥");
  };

  const startMusic = async () => {
    await music.start();
  };

  return (
    <div className="app-shell" id="top">
      <Welcome names={names} open={welcomeOpen} onEnter={() => setWelcomeOpen(false)} />
      <AmbientPetals enabled={!welcomeOpen && !reducedMotion} />
      <div className="site-chrome">
        <header className="topbar">
          <a className="wordmark" href="#top" onClick={clickLogo} aria-label="Tap our heart five times for a secret">
            <span className="wordmark-heart"><Heart size={14} fill="currentColor" /></span>
            <span>forever <i>begins</i> with you</span>
          </a>
          <nav className={`desktop-nav${mobileMenuOpen ? " is-open" : ""}`} id="mobile-nav" aria-label="Main navigation">
            <a href="#story" onClick={() => setMobileMenuOpen(false)}>Our story</a><a href="#memories" onClick={() => setMobileMenuOpen(false)}>Memories</a><a href="#letter" onClick={() => setMobileMenuOpen(false)}>Your letter</a><a href="#forever" onClick={() => setMobileMenuOpen(false)}>Forever</a>
          </nav>
          <div className="topbar-actions">
            <button type="button" className="personalize-button" onClick={() => { setDraftNames(names); setDedicationOpen(true); }}>Make it yours <Sparkles size={13} /></button>
            <button type="button" className={`topbar-music${music.playing ? " is-playing" : ""}`} onClick={async () => { try { music.playing ? await music.pause() : await startMusic(); } catch (error) { showNote(`Music could not start: ${error.message}`); } }} aria-label={music.playing ? "Pause anniversary music" : "Play anniversary music"}>{music.playing ? <Pause size={15} /> : <Music2 size={15} />}</button>
            <button type="button" className="mobile-menu-button" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-nav">{mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}</button>
          </div>
        </header>
      </div>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-photo" />
          <div className="hero-vignette" />
          <div className="hero-frame" />
          <motion.div className="hero-content" initial={{ opacity: 0, y: 25 }} animate={!welcomeOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }} transition={{ duration: 0.9, delay: welcomeOpen ? 0 : 0.2 }}>
            <p className="eyebrow eyebrow-gold"><span /> YOUR LOVE STORY, CELEBRATED</p>
            <h1 className="hero-heading serif" id="hero-title">Forever begins<br /><em>with you.</em></h1>
            <p className="hero-name script">{names}</p>
            <p className="hero-description">A love story that never ends.</p>
            <a className="hero-cta" href="#story">STEP INTO YOUR STORY <ArrowDown size={14} /></a>
          </motion.div>
          <div className="hero-caption"><span>01 — AN EVER-AFTER</span><span>MADE WITH LOVE, JUST FOR YOU</span></div>
          <div className="hero-glint" aria-hidden="true">✦</div>
        </section>

        <section className="preface-section section-pad">
          <div className="preface-mark"><Heart size={19} /></div>
          <p className="eyebrow">Some stories feel like home</p>
          <h2 className="preface-title serif">This is the story of<br /><em>your favourite person.</em></h2>
          <p className="preface-copy">The little glances. The silly jokes. A hand that always finds yours. The kind of love that turns ordinary days into the ones you remember forever.</p>
          <button type="button" className="quote-whisper" onClick={() => revealSecret()}><Quote size={14} /> A little thought, tucked between the pages</button>
        </section>

        <section className="story-section section-pad" id="story">
          <div className="content-width">
            <SectionHeading eyebrow="The chapters that made you" title="The story of" highlight="always" description="From the very first hello to every tomorrow still waiting to happen." />
            <StoryTimeline events={timeline} onSave={saveTimeline} onError={showNote} />
          </div>
        </section>

        <section className="gallery-section section-pad" id="memories">
          <div className="content-width">
            <SectionHeading eyebrow="A little collection of forever" title="Moments that" highlight="stay" description="Twenty-four real memories, handpicked from your beautiful story. Tap a photograph to linger in it awhile." />
            <MemoryGallery initialPhotos={initialMemories} onStartMusic={startMusic} onError={showNote} />
          </div>
        </section>

        <section className="letter-section section-pad" id="letter">
          <div className="letter-content content-width">
            <div className="letter-intro">
              <p className="eyebrow">Something I wanted you to know</p>
              <h2 className="section-title serif">A small letter.<br /><em>A very big love.</em></h2>
              <p className="section-description">Tucked away just for the two of you, from your slightly emotional little brother.</p>
            </div>
            <LoveLetter />
          </div>
        </section>

        <section className="numbers-section section-pad" id="forever">
          <div className="content-width">
            <SectionHeading eyebrow="A lifetime, and then some" title="Love doesn't count the days." highlight="It makes them count." description="One shared date. Every year, every month, every ordinary Tuesday made wonderful." />
            <LoveCounter weddingDate={weddingDate} onDateChange={setWeddingDate} onError={showNote} />
            <div className="count-heart" aria-hidden="true"><Heart size={15} fill="currentColor" /></div>
          </div>
        </section>

        <section className="starlight-section" aria-label="A night sky for two souls">
          <StarryNight names={names} weddingDate={weddingDate} onQuote={() => revealSecret()} />
        </section>

        <section className="dreams-section section-pad">
          <div className="content-width">
            <SectionHeading eyebrow="The pages still to come" title="Here's to everything" highlight="ahead" description="May the very best things in life keep finding their way to you two." />
            <div className="dream-grid">
              {futureDreams.map((dream, index) => (
                <motion.article className="dream-card" key={dream.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} whileHover={{ y: -7 }}>
                  <span className="dream-number">{dream.icon}</span>
                  <h3 className="serif">{dream.title}</h3>
                  <p>{dream.detail}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="ultimate-section section-pad" id="surprise">
          <div className="ultimate-orbit ultimate-orbit-one" /><div className="ultimate-orbit ultimate-orbit-two" />
          <div className="ultimate-content content-width">
            <SectionHeading light eyebrow="One last thing, before you go" title="A little gift for" highlight="your forever" description="It isn't wrapped in paper. It's wrapped in one very big wish." />
            <Celebration names={names} onCelebrate={() => showNote("A little extra magic, because you deserve it. ✨")} />
          </div>
        </section>

        <FinalCelebration names={names} onEasterEgg={() => revealSecret()} />
      </main>

      <footer className="footer">
        <span className="footer-left">A LITTLE LOVE LETTER FROM YOURS</span>
        <a className="footer-brand script" href="#top">forever, always <Heart size={13} fill="currentColor" /></a>
        <span className="footer-right">MADE WITH ALL MY HEART</span>
        <div className="footer-music"><MusicControls music={music} onNotice={showNote} /></div>
        <button type="button" className="unexpected-button" onClick={() => revealSecret("Unexpected, yes. But never a surprise: I'll always be cheering for both of you. All my love. ♥")}>
          <Infinity size={14} /> one unexpected little thing
        </button>
      </footer>

      <AnimatePresence>
        {secretUnlocked && (
          <motion.div className="secret-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSecretUnlocked(false); }} role="dialog" aria-modal="true" aria-label="A little secret">
            <motion.article className="secret-card glass-panel" initial={{ opacity: 0, scale: 0.92, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
              <button type="button" className="icon-button secret-close" onClick={() => setSecretUnlocked(false)} aria-label="Close secret"><X size={17} /></button>
              <Heart className="secret-heart" size={23} fill="currentColor" />
              <p className="eyebrow">A secret, from the heart</p>
              <p className="secret-quote serif">“{secretMessage}”</p>
              <span className="script">always in your corner</span>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dedicationOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setDedicationOpen(false); }}>
            <motion.form className="editor-modal glass-panel dedication-modal" onSubmit={saveNames} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
              <button type="button" className="icon-button modal-close" onClick={() => setDedicationOpen(false)} aria-label="Close personalization"><X size={17} /></button>
              <p className="eyebrow">A little personal touch</p><h3 className="serif">Make it yours</h3>
              <p>How should their names appear in this little love story?</p>
              <label>Their names<input value={draftNames} onChange={(event) => setDraftNames(event.target.value)} maxLength={54} placeholder="Akka & Bava" autoFocus required /></label>
              <div className="modal-actions"><button type="submit" className="button button-dark">Save this dedication</button></div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <motion.div className="toast-message" role="status" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Heart size={14} fill="currentColor" /> {toast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}
