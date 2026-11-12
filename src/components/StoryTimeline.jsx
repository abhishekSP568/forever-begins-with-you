import React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Camera, Heart, Plus, Sparkles, X } from "lucide-react";

const icons = [Sparkles, Heart, Camera, Heart, CalendarDays, Sparkles];

function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1200 / image.width, 1200 / image.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That image could not be opened.")); };
    image.src = url;
  });
}

export default function StoryTimeline({ events, onSave, onError }) {
  const [editing, setEditing] = useState(null);
  const [photo, setPhoto] = useState("");

  const saveEvent = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title")).trim();
    const description = String(form.get("description")).trim();
    const date = String(form.get("date"));
    if (!title || !description) return;
    const next = {
      id: editing.id || crypto.randomUUID(),
      title,
      description,
      date,
      photo,
    };
    onSave(editing.isNew
      ? [...events.filter((item) => item.id !== "forever"), next, events.find((item) => item.id === "forever")].filter(Boolean)
      : events.map((item) => item.id === editing.id ? next : item));
    setEditing(null);
    setPhoto("");
  };

  const openEditor = (item) => {
    setPhoto(item.photo || "");
    setEditing({ ...item });
  };

  const closeEditor = () => {
    setEditing(null);
    setPhoto("");
  };

  const choosePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await resizeImage(file));
    } catch (error) {
      onError(error.message);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <>
      <div className="timeline-track">
        {events.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.button
              key={item.id}
              type="button"
              className={`timeline-card${item.photo ? " timeline-card-photo" : ""}`}
              onClick={() => openEditor(item)}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.075 }}
              whileHover={{ y: -7, rotate: index % 2 ? 0.3 : -0.3 }}
              aria-label={`Edit ${item.title}`}
            >
              {item.photo && <img className="timeline-card-image" src={item.photo} alt="" />}
              <span className="timeline-marker"><Icon size={16} /></span>
              <span className="timeline-card-date">{item.date ? new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "A chapter in your story"}</span>
              <span className="timeline-card-title serif">{item.title}</span>
              <span className="timeline-card-description">{item.description}</span>
              <span className="timeline-edit-hint">CLICK TO PERSONALIZE</span>
            </motion.button>
          );
        })}
        <motion.button className="timeline-add" type="button" onClick={() => openEditor({ isNew: true, title: "", description: "", date: "", photo: "" })} whileHover={{ scale: 1.04 }}>
          <span className="timeline-marker"><Plus size={16} /></span>
          <span className="serif">Add a chapter</span>
        </motion.button>
      </div>
      <p className="timeline-help">Select any chapter to add a date, memory, or photograph.</p>

      <AnimatePresence>
        {editing && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
            <motion.form className="editor-modal glass-panel" onSubmit={saveEvent} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} aria-label="Edit story chapter">
              <button type="button" className="icon-button modal-close" onClick={closeEditor} aria-label="Close editor"><X size={18} /></button>
              <p className="eyebrow">A chapter of your story</p>
              <h3 className="serif">{editing.isNew ? "Write a new chapter" : "Make it your own"}</h3>
              <label>Chapter title<input name="title" defaultValue={editing.title} maxLength={70} required autoFocus /></label>
              <label>Date<input name="date" type="date" defaultValue={editing.date} /></label>
              <label>Your memory<textarea name="description" rows="3" maxLength={220} defaultValue={editing.description} required /></label>
              <label className="upload-field">
                <input type="file" accept="image/*" onChange={choosePhoto} />
                <Camera size={16} /> {photo ? "Choose a different photo" : "Add a photo to this chapter"}
              </label>
              {photo && <img className="editor-preview" src={photo} alt="Preview for the selected chapter photo" />}
              <div className="modal-actions"><button className="button button-dark" type="submit">Save this chapter</button></div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
