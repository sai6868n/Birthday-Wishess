import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PasscodePage.css";
import "./Transition.css";


// 🔐 The passkey is her birth date, DDMMYYYY
const CORRECT_CODE = "08072005";

export default function PasscodePage() {
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState("opening");
  const navigate = useNavigate();

  React.useEffect(() => {
    const t = setTimeout(() => setOverlayPhase("idle"), 900);
    return () => clearTimeout(t);
  }, []);

  const goToBirthdayPage = () => {
    setOverlayPhase("closing");
    setTimeout(() => navigate("/celebration"), 650);
  };

  const handleDigit = (digit) => {
    if (code.length >= CORRECT_CODE.length) return;
    const next = code + digit;
    setCode(next);

    if (next.length === CORRECT_CODE.length) {
      if (next === CORRECT_CODE) {
        setTimeout(goToBirthdayPage, 300);
      } else {
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setCode("");
        }, 500);
      }
    }
  };

  const handleBackspace = () => setCode((c) => c.slice(0, -1));
  const handleClear = () => setCode("");

  return (
    <div className="passcode-page">
      <div className={`shadow-overlay ${overlayPhase}`}></div>

      <div className="passcode-glow" />

      <div className="passcode-photo-frame">
        <div className="mini-cake-scene">
          <div className="mini-candle-row">
            <span className="mini-candle">
              <span className="mini-flame"></span>
            </span>
            <span className="mini-candle">
              <span className="mini-flame"></span>
            </span>
            <span className="mini-candle">
              <span className="mini-flame"></span>
            </span>
          </div>
          <div className="mini-cake"></div>
        </div>
        <p className="photo-caption">Happy Birthday,Nandhini!</p>
      </div>

      

      <p className="passcode-hint">hint: the day you were born (DDMMYYYY)</p>

      <div className={`code-boxes ${shake ? "shake" : ""}`}>
        {Array.from({ length: CORRECT_CODE.length }).map((_, i) => (
          <div key={i} className={`code-box ${code[i] ? "filled" : ""}`}>
            {code[i] || ""}
          </div>
        ))}
      </div>

      <div className="keypad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
          <button key={n} className="key" onClick={() => handleDigit(n)}>
            {n}
          </button>
        ))}
        <button className="key key-action" onClick={handleClear}>
          C
        </button>
        <button className="key" onClick={() => handleDigit("0")}>
          0
        </button>
        <button className="key key-action" onClick={handleBackspace}>
          ⌫
        </button>
      </div>
    </div>
  );
}