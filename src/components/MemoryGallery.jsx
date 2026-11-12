import React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ImagePlus, Maximize2, Pause, Play, X } from "lucide-react";

export default function MemoryGallery({ initialPhotos, onStartMusic, onError }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [active, setActive] = useState(0);
  const [slideshow, setSlideshow] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const fileInput = useRef(null);
  const objectUrls = useRef([]);

  useEffect(() => {
    if (!slideshow || photos.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % photos.length), 4300);
    return () => window.clearInterval(timer);
  }, [slideshow, photos.length]);

  useEffect(() => () => objectUrls.current.forEach(URL.revokeObjectURL), []);

  const move = (direction) => setActive((index) => (index + direction + photos.length) % photos.length);

  const toggleSlideshow = async () => {
    if (!slideshow) {
      try {
        await onStartMusic();
        setSlideshow(true);
      } catch (error) {
        onError(`The slideshow is ready, but music could not start: ${error.message}`);
        setSlideshow(true);
      }
    } else {
      setSlideshow(false);
    }
  };

  const addPhotos = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) {
      onError("Choose one or more image files to add to your memory gallery.");
      event.target.value = "";
      return;
    }
    const added = files.map((file, index) => {
      const src = URL.createObjectURL(file);
      objectUrls.current.push(src);
      return { id: `upload-${Date.now()}-${index}`, src, alt: `A personal memory: ${file.name}`, caption: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") || "A memory, just for you" };
    });
    const start = photos.length;
    setPhotos((current) => [...current, ...added]);
    setActive(start);
    event.target.value = "";
  };

  const selected = photos[active];
  const visiblePhotos = Array.from({ length: Math.min(5, photos.length) }, (_, index) => photos[(active + index) % photos.length]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const keydown = (event) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [lightbox, photos.length]);

  return (
    <>
      <div className="gallery-layout">
        <div className="polaroid-grid">
          {visiblePhotos.map((photo, index) => (
            <motion.button
              key={photo.id}
              type="button"
              className={`polaroid polaroid-${index + 1}${index === 0 ? " polaroid-active" : ""}`}
              onClick={() => { setActive((active + index) % photos.length); setLightbox(true); }}
              whileHover={{ scale: 1.045, rotate: 0, zIndex: 5, y: -9 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Open photo: ${photo.caption}`}
            >
              <img src={photo.src} alt={photo.alt} loading={index > 1 ? "lazy" : "eager"} />
              <span className="polaroid-caption script">{photo.caption}</span>
              <span className="polaroid-expand"><Maximize2 size={13} /></span>
            </motion.button>
          ))}
          <motion.button type="button" className="polaroid-add" onClick={() => fileInput.current?.click()} whileHover={{ scale: 1.04 }}>
            <ImagePlus size={25} strokeWidth={1.4} /><span>Add your own</span><small>YOUR MEMORIES BELONG HERE</small>
          </motion.button>
        </div>
        <aside className="gallery-note-card glass-card">
          <span className="hand-drawn-heart">♡</span>
          <p className="eyebrow">THE ALBUM OF ALWAYS</p>
          <h3 className="serif">Life is made of little moments.</h3>
          <p>Here are a few of the beautiful ones. Bring your own favorite snapshots along, too.</p>
          <div className="gallery-control-row">
            <button type="button" className={`button button-quiet${slideshow ? " is-active" : ""}`} onClick={toggleSlideshow}>
              {slideshow ? <Pause size={15} /> : <Play size={15} />}
              {slideshow ? "Pause the story" : "Play the story"}
            </button>
            <span className="memory-count">{String(active + 1).padStart(2, "0")} <i>/</i> {String(photos.length).padStart(2, "0")} moments</span>
          </div>
        </aside>
      </div>
      <input ref={fileInput} className="visually-hidden" type="file" accept="image/*" multiple onChange={addPhotos} aria-label="Upload personal memories" />
      <AnimatePresence>
        {lightbox && selected && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(event) => { if (event.target === event.currentTarget) setLightbox(false); }} role="dialog" aria-modal="true" aria-label="Photo viewer">
            <button type="button" className="icon-button lightbox-close" onClick={() => setLightbox(false)} aria-label="Close photo"><X /></button>
            <button type="button" className="icon-button lightbox-arrow lightbox-prev" onClick={() => move(-1)} aria-label="Previous photo"><ChevronLeft /></button>
            <motion.figure className="lightbox-figure" key={selected.id} initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
              <img src={selected.src} alt={selected.alt} />
              <figcaption className="script">{selected.caption}</figcaption>
            </motion.figure>
            <button type="button" className="icon-button lightbox-arrow lightbox-next" onClick={() => move(1)} aria-label="Next photo"><ChevronRight /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
