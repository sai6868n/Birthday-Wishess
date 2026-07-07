import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import "./BirthdayPage.css";
import "./Transition.css";
import musicFile from "./audio.mp3";

// 🖼️ Import 5 images for the slides
import img1 from "./slide1.png";
import img2 from "./slide2.png";
import img3 from "./slide3.jpg";
import img4 from "./slide4.jpg";
import img5 from "./slide5.png";

export default function BirthdayPage() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayPhase, setOverlayPhase] = useState("opening");
  const [celebrated, setCelebrated] = useState(false);
  const navigate = useNavigate();

  const slides = [
    { title: "🎉 Happy Birthday! 💖", img: img1, msg: "Be Happy ✨ " },
    { title: "🐾 Many More Happy Returns! 🎂", img: img2, msg: "May your days be filled with laughter 💗" },
    { title: "🌸 You Shine Bright!", img: img3, msg: "Your smile lights up every room ✨" },
    { title: "🌈 Keep Being You!", img: img4, msg: " 🌼" },
    { title: "💫 A Small effort from my side to make your day SPECIAL!", img: img5, msg: "Always stay this wonderful 💕" },
    { title: "🎉 Let's Celebrate! 🎂", type: "cake" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);

    const audio = new Audio(musicFile);
    audio.play().catch(() => console.log("Autoplay blocked"));

    // let the smoke clear, then park the overlay hidden
    const openTimer = setTimeout(() => setOverlayPhase("idle"), 900);

    return () => {
      audio.pause();
      window.removeEventListener("resize", handleResize);
      clearTimeout(openTimer);
    };
  }, []);

  // Swipe effect handler
  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.clientWidth;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(index);
  };

  // 🎂 Happy Birthday button on the cake slide -> smoky reveal -> PasscodePage
  const handleCelebrate = () => {
    setCelebrated(true);

    // let the cake wobble + "Yayy!" play for a moment, then smoke the page away
    setTimeout(() => {
      setOverlayPhase("closing");
      setTimeout(() => navigate("/passcode"), 900);
    }, 1100);
  };

  return (
    <div className="birthday-page">
      {/* 🌫️ Smoky reveal / cover transition */}
      <div className={`shadow-overlay smoke ${overlayPhase}`}>
        <span className="smoke-puff p1"></span>
        <span className="smoke-puff p2"></span>
        <span className="smoke-puff p3"></span>
        <span className="smoke-puff p4"></span>
        <span className="smoke-puff p5"></span>
        <span className="smoke-puff p6"></span>
      </div>

      {/* Confetti 🎊 */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={true}
      />

      {/* Balloons 🎈 */}
      <div className="balloons">
        <div className="balloon red"></div>
        <div className="balloon blue"></div>
        <div className="balloon yellow"></div>
        <div className="balloon green"></div>
      </div>

      {/* Slides Carousel */}
      <div className="carousel" onScroll={handleScroll}>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`card ${i === activeIndex ? "active" : "blurred"} ${
              slide.type === "cake" ? "cake-slide" : ""
            }`}
          >
            {slide.type === "cake" ? (
              <>
                <h1 className="cake-title">Let's Celebrate! 🎉</h1>

                {/* 🎂 Realistic cake */}
                <div className={`cake-scene ${celebrated ? "celebrated" : ""}`}>
                  <div className="cake">
                    <div className="candles">
                      <div className="candle">
                        <div className="flame">
                          <span className="flame-core"></span>
                        </div>
                      </div>
                      <div className="candle short">
                        <div className="flame">
                          <span className="flame-core"></span>
                        </div>
                      </div>
                      <div className="candle">
                        <div className="flame">
                          <span className="flame-core"></span>
                        </div>
                      </div>
                    </div>

                    <div className="layer layer-top">
                      <span className="drip"></span>
                      <span className="sprinkles"></span>
                    </div>
                    <div className="layer layer-middle">
                      <span className="drip drip-mid"></span>
                    </div>
                    <div className="layer layer-bottom">
                      <span className="cherry cherry-1"></span>
                      <span className="cherry cherry-2"></span>
                      <span className="cherry cherry-3"></span>
                    </div>
                    <div className="plate"></div>
                    <div className="plate-shadow"></div>
                  </div>
                </div>

                <button
                  className="celebrate-btn"
                  onClick={handleCelebrate}
                  disabled={celebrated}
                >
                  {celebrated ? "Yayy! 🎊" : "Happy Birthday"}
                </button>
              </>
            ) : (
              <>
                <h1 className="card-title">{slide.title}</h1>
                {slide.img && (
                  <img src={slide.img} alt={`slide-${i}`} className="card-img" />
                )}
                <p className="card-text">{slide.msg}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ➡️ Arrow indicator (visible until last slide) */}
      {activeIndex < slides.length - 1 && (
        <div className="arrow-indicator">
          <span className="arrow">→</span>
        </div>
      )}
    </div>
  );
}