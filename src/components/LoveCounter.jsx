import React from "react";
import { useEffect, useMemo, useState } from "react";
import { CalendarHeart, Check, PencilLine } from "lucide-react";

function elapsedTime(dateValue, now) {
  const start = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(start.getTime()) || start > now) return null;

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalElapsed = now.getTime() - start.getTime();
  return {
    years,
    months,
    days: Math.floor(totalElapsed / 86_400_000),
    hours: now.getHours(),
    minutes: now.getMinutes(),
  };
}

export default function LoveCounter({ weddingDate, onDateChange, onError }) {
  const [now, setNow] = useState(() => new Date());
  const [draftDate, setDraftDate] = useState(weddingDate);
  const [editing, setEditing] = useState(!weddingDate);
  const breakdown = useMemo(() => weddingDate && elapsedTime(weddingDate, now), [weddingDate, now]);

  useEffect(() => {
    setDraftDate(weddingDate);
    setEditing(!weddingDate);
  }, [weddingDate]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const saveDate = (event) => {
    event.preventDefault();
    if (!draftDate || new Date(`${draftDate}T00:00:00`) > new Date()) {
      onError("Choose a wedding date in the past to start the anniversary counter.");
      return;
    }
    onDateChange(draftDate);
    setEditing(false);
  };

  const values = breakdown
    ? [["years", breakdown.years, "Years"], ["months", breakdown.months, "Months"], ["days", breakdown.days, "Days"], ["hours", breakdown.hours, "Hours"], ["minutes", breakdown.minutes, "Minutes"]]
    : [["years", "—", "Years"], ["months", "—", "Months"], ["days", "—", "Days"], ["hours", "—", "Hours"], ["minutes", "—", "Minutes"]];

  return (
    <div className="counter-shell">
      {weddingDate && !editing ? (
        <div className="counter-date-line">
          <CalendarHeart size={17} />
          <span>Counting the love since {new Date(`${weddingDate}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          <button type="button" className="text-button" onClick={() => { setDraftDate(weddingDate); setEditing(true); }} aria-label="Change the wedding date"><PencilLine size={14} /></button>
        </div>
      ) : (
        <form className="date-form" onSubmit={saveDate}>
          <label htmlFor="wedding-date">Add their wedding date to start the clock</label>
          <div className="date-input-row">
            <input id="wedding-date" type="date" max={new Date().toISOString().slice(0, 10)} value={draftDate} onChange={(event) => setDraftDate(event.target.value)} required />
            <button type="submit" className="button button-dark"><Check size={15} /> Start counting</button>
          </div>
        </form>
      )}
      <div className="counter-grid">
        {values.map(([key, value, label], index) => (
          <div className="counter-unit" key={key}>
            <span className="counter-value" aria-live={index === 0 ? "polite" : undefined}>{value}</span>
            <span className="counter-label">{label} <span>together</span></span>
          </div>
        ))}
      </div>
      {!weddingDate && <p className="counter-hint">The date is yours to add — no guesses, just your real story.</p>}
    </div>
  );
}
