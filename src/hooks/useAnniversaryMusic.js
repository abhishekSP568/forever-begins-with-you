import { useCallback, useEffect, useRef, useState } from "react";

const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23, 261.63, 329.63, 392, 523.25];

export function useAnniversaryMusic() {
  const contextRef = useRef(null);
  const timerRef = useRef(null);
  const noteRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const playNote = useCallback(() => {
    const context = contextRef.current;
    if (!context || context.state !== "running" || muted) return;

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = melody[noteRef.current % melody.length];
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.025, now + 0.13);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 1.65);
    oscillator.connect(volume);
    volume.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 1.7);
    noteRef.current += 1;
  }, [muted]);

  const start = useCallback(async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Audio is not supported in this browser.");
    if (!contextRef.current) contextRef.current = new AudioContextClass();
    await contextRef.current.resume();
    setPlaying(true);
  }, []);

  const pause = useCallback(async () => {
    window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (contextRef.current?.state === "running") await contextRef.current.suspend();
    setPlaying(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((value) => !value), []);

  useEffect(() => {
    if (playing && !muted) {
      playNote();
      timerRef.current = window.setInterval(playNote, 1300);
    } else {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => window.clearInterval(timerRef.current);
  }, [playing, muted, playNote]);

  useEffect(() => () => {
    window.clearInterval(timerRef.current);
    if (contextRef.current && contextRef.current.state !== "closed") {
      void contextRef.current.close();
    }
  }, []);

  return { playing, muted, start, pause, toggleMute };
}
