import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./Transition.css";

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState("opening"); // opening -> idle -> closing
  const navigate = useNavigate();

  useEffect(() => {
    const unlockDate = new Date("2025-07-08T00:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const diff = unlockDate - now;

      if (diff <= 0) {
        setIsUnlocked(true);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    // let the opening iris finish, then park it invisible
    const openTimer = setTimeout(() => setOverlayPhase("idle"), 900);

    return () => {
      clearInterval(timer);
      clearTimeout(openTimer);
    };
  }, []);

  const handleOpen = (e) => {
    // origin the shadow-wipe at the button that was clicked
    const rect = e.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--origin-x",
      `${rect.left + rect.width / 2}px`
    );
    document.documentElement.style.setProperty(
      "--origin-y",
      `${rect.top + rect.height / 2}px`
    );

    setOverlayPhase("closing");
    setTimeout(() => navigate("/birthday"), 650);
  };

  return (
    <div className="birthday-container">
      <div className={`shadow-overlay ${overlayPhase}`}></div>

      <div className="hearts-bg">
        {[...Array(25)].map((_, i) => (
          <span key={i} className="heart"></span>
        ))}
      </div>

      {!isUnlocked ? (
        <div className="locked-section">
          <h1 className="glow-text">Wait madam... 😊💫</h1>
          <p className="subtitle">
            You're not born yet! <br /> The magic begins on{" "}
            <strong>8th July 2025 🎂💖</strong>
          </p>

          <div className="countdown-box">⏳ Countdown to unlock</div>

          <p className="timer">
            Time left:{" "}
            <span className="time-values">
              {`${timeLeft.days ?? "00"}d ${timeLeft.hours ?? "00"}h ${
                timeLeft.minutes ?? "00"
              }m ${timeLeft.seconds ?? "00"}s`}
            </span>
          </p>
        </div>
      ) : (
        <div className="unlocked-section">
          <h1 className="birthday-title glow-text">
            🎉 Happy Birthday!
          </h1>
          <p className="birthday-subtitle">Your magical day has begun! 💕</p>

          <button onClick={handleOpen} className="open-button">
            Open Your Surprise 🎁
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
















