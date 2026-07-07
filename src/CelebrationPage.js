import React, { useEffect, useMemo, useState } from "react";
import Confetti from "react-confetti";
import "./CelebrationPage.css";
import musicFile from "./audio.mp3";

// ✏️ Edit this to the real birthday — shown digit-group by digit-group in the reveal.
const BIRTH_DATE = { day: "08", month: "07", year: "2005" };

// Phase order the state machine walks through, top to bottom.
const PHASE = {
  DATE_REVEAL: "dateReveal", // floating glow symbols + birth date
  CAKE_INTRO: "cakeIntro", // cake fades in, fully lit
  GET_READY: "getReady", // "Get Ready..." prompt, lights start to fall
  DARK: "dark", // background goes black, only flames glow
  COUNTDOWN: "countdown", // 3 -> 2 -> 1 glowing text
  BLOWOUT: "blowout", // candles extinguish
  FINAL: "final", // confetti burst + "Happy Birthday!"
};

// How long each auto-advancing phase holds before moving on (ms).
const HOLD = {
  [PHASE.DATE_REVEAL]: 3600,
  [PHASE.CAKE_INTRO]: 2800,
  [PHASE.GET_READY]: 1800,
  [PHASE.DARK]: 900,
  [PHASE.BLOWOUT]: 900,
};

const COUNTDOWN_TICK = 900;
const PARTICLE_COLORS = ["#ffd6e8", "#ff8fc7", "#ffd43b", "#fff6d6", "#ff6bab"];

function useFloatingParticles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 96 + 2, // vw %
        size: Math.random() * 10 + 6, // px
        delay: Math.random() * 4, // s
        duration: Math.random() * 3 + 4, // s
        drift: Math.random() * 60 - 30, // px, horizontal wander
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      })),
    [count]
  );
}

// The layers/candle markup mirrors BirthdayPage's cake but under a cp- namespace
// so its CSS never collides with the carousel page.
function Cake({ blownOut }) {
  return (
    <div className="cp-cake-scene">
      <div className="cp-cake">
        <div className="cp-candles">
          <div className="cp-candle">
            <span className={`cp-flame ${blownOut ? "cp-flame-out" : ""}`}>
              <span className="cp-flame-core" />
            </span>
          </div>
          <div className="cp-candle cp-short">
            <span className={`cp-flame ${blownOut ? "cp-flame-out" : ""}`}>
              <span className="cp-flame-core" />
            </span>
          </div>
          <div className="cp-candle">
            <span className={`cp-flame ${blownOut ? "cp-flame-out" : ""}`}>
              <span className="cp-flame-core" />
            </span>
          </div>
        </div>

        <div className="cp-layer cp-layer-top">
          <span className="cp-drip" />
          <span className="cp-sprinkles" />
        </div>
        <div className="cp-layer cp-layer-middle">
          <span className="cp-drip cp-drip-mid" />
        </div>
        <div className="cp-layer cp-layer-bottom">
          <span className="cp-cherry cp-cherry-1" />
          <span className="cp-cherry cp-cherry-2" />
          <span className="cp-cherry cp-cherry-3" />
        </div>
        <div className="cp-plate" />
        <div className="cp-plate-shadow" />
      </div>
    </div>
  );
}

export default function CelebrationPage() {
  const [phase, setPhase] = useState(PHASE.DATE_REVEAL);
  const [count, setCount] = useState(3);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const particles = useFloatingParticles(16);

  useEffect(() => {
    const onResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 🎵 Play the birthday track for this page, same pattern as BirthdayPage.
  useEffect(() => {
    const audio = new Audio(musicFile);
    audio.play().catch(() => console.log("Autoplay blocked"));

    return () => {
      audio.pause();
    };
  }, []);

  // Auto-advance every phase that isn't the interactive countdown.
  useEffect(() => {
    if (phase === PHASE.DATE_REVEAL) {
      const t = setTimeout(() => setPhase(PHASE.CAKE_INTRO), HOLD[PHASE.DATE_REVEAL]);
      return () => clearTimeout(t);
    }
    if (phase === PHASE.CAKE_INTRO) {
      const t = setTimeout(() => setPhase(PHASE.GET_READY), HOLD[PHASE.CAKE_INTRO]);
      return () => clearTimeout(t);
    }
    if (phase === PHASE.GET_READY) {
      const t = setTimeout(() => setPhase(PHASE.DARK), HOLD[PHASE.GET_READY]);
      return () => clearTimeout(t);
    }
    if (phase === PHASE.DARK) {
      const t = setTimeout(() => {
        setCount(3);
        setPhase(PHASE.COUNTDOWN);
      }, HOLD[PHASE.DARK]);
      return () => clearTimeout(t);
    }
    if (phase === PHASE.BLOWOUT) {
      const t = setTimeout(() => setPhase(PHASE.FINAL), HOLD[PHASE.BLOWOUT]);
      return () => clearTimeout(t);
    }
  }, [phase]);

  // Countdown ticks 3 -> 2 -> 1, then hands off to the blowout phase.
  useEffect(() => {
    if (phase !== PHASE.COUNTDOWN) return;
    const t = setTimeout(() => {
      if (count <= 1) {
        setPhase(PHASE.BLOWOUT);
      } else {
        setCount((c) => c - 1);
      }
    }, COUNTDOWN_TICK);
    return () => clearTimeout(t);
  }, [phase, count]);

  const showCake =
    phase === PHASE.CAKE_INTRO ||
    phase === PHASE.GET_READY ||
    phase === PHASE.DARK ||
    phase === PHASE.COUNTDOWN ||
    phase === PHASE.BLOWOUT;

  const isDim = phase === PHASE.GET_READY || phase === PHASE.DARK || phase === PHASE.COUNTDOWN;
  const isBlownOut = phase === PHASE.BLOWOUT || phase === PHASE.FINAL;
  const showConfetti = phase === PHASE.BLOWOUT || phase === PHASE.FINAL;

  return (
    <div
      className={[
        "cp-page",
        isDim ? "cp-dim" : "",
        phase === PHASE.FINAL ? "cp-final-bg" : "",
      ].join(" ").trim()}
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={phase === PHASE.FINAL ? 260 : 70}
          recycle={phase === PHASE.FINAL}
        />
      )}

      {(phase === PHASE.DATE_REVEAL || phase === PHASE.CAKE_INTRO) && (
        <div className="cp-particles" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="cp-particle"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--drift": `${p.drift}px`,
              }}
            />
          ))}
        </div>
      )}

      {phase === PHASE.DATE_REVEAL && (
        <div className="cp-date-reveal">
          <p className="cp-eyebrow">A date worth celebrating</p>
          <div className="cp-date-digits">
            <span className="cp-digit-group">{BIRTH_DATE.day}</span>
            <span className="cp-dot">.</span>
            <span className="cp-digit-group">{BIRTH_DATE.month}</span>
            <span className="cp-dot">.</span>
            <span className="cp-digit-group">{BIRTH_DATE.year}</span>
          </div>
        </div>
      )}

      {showCake && <Cake blownOut={isBlownOut} />}

      {phase === PHASE.GET_READY && <p className="cp-get-ready">Get Ready...</p>}

      {phase === PHASE.COUNTDOWN && (
        <div className="cp-countdown" key={count}>
          {count}
        </div>
      )}

      {phase === PHASE.FINAL && (
        <div className="cp-final">
          <h1 className="cp-final-title">Happy Birthday!</h1>
          <p className="cp-final-sub">Wishing you a day as wonderful as you are 💕</p>
        </div>
      )}
    </div>
  );
}