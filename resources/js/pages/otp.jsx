import { useState, useEffect, useRef } from "react";

export default function OTPModal() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [seconds, setSeconds] = useState(55);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef([]);

  // countdown timer
  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(55);
    setCanResend(false);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const handleVerify = () => {
    if (otp.join("").length < 4) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setVerified(true);
  };

  const filledCount = otp.filter(Boolean).length;
  const progressPercent = (filledCount / 4) * 100;

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={styles.overlay}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes cartBounce {
          0%,100%{transform:translateY(0) rotate(-2deg)}
          50%{transform:translateY(-10px) rotate(2deg)}
        }
        @keyframes checkPop {
          0%{transform:scale(0);opacity:0}
          60%{transform:scale(1.2)}
          100%{transform:scale(1);opacity:1}
        }
        .otp-input {
          width: 64px; height: 64px;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          font-size: 26px; font-weight: 800;
          text-align: center; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          font-family: 'Nunito', sans-serif;
          color: #1f2937;
          background: #fff;
          caret-color: #6d28d9;
        }
        .otp-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 4px rgba(124,58,237,0.14);
          transform: scale(1.06);
        }
        .otp-input.filled { border-color: #7c3aed; background: #f5f3ff; }
        .verify-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #6d28d9, #7c3aed);
          color: #fff; border: none; border-radius: 14px;
          font-size: 15px; font-weight: 800; letter-spacing: 1.5px;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: 'Nunito', sans-serif;
          box-shadow: 0 6px 20px rgba(109,40,217,0.35);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .verify-btn:hover { opacity:0.92; transform:translateY(-2px); box-shadow:0 10px 28px rgba(109,40,217,0.4); }
        .verify-btn:active { transform:translateY(0); }
        .verify-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .resend-btn {
          background: none; border: none; cursor: pointer;
          font-size: 13px; font-weight: 700; color: #7c3aed;
          font-family: 'Nunito', sans-serif;
          display: flex; align-items: center; gap: 4px;
          transition: opacity 0.2s;
        }
        .resend-btn:disabled { color: #9ca3af; cursor: not-allowed; }
        .resend-btn:not(:disabled):hover { opacity: 0.75; }
      `}</style>

      <div style={styles.modal}>

        {/* ── LEFT PANEL ── */}
        <div style={styles.left}>
          <div style={styles.leftContent}>
            <h2 style={styles.welcome}>Welcome Back!</h2>
            <p style={styles.tagline}>Discover unbeatable deals &amp; offers everyday.</p>
            <div style={{ animation: "cartBounce 2.8s ease-in-out infinite", marginTop: 32, fontSize: 110 }}>
              🛒
            </div>
          </div>
          {/* decorative circles */}
          <div style={{ ...styles.circle, width: 220, height: 220, top: -60, left: -60, opacity: 0.12 }} />
          <div style={{ ...styles.circle, width: 150, height: 150, bottom: -40, right: -40, opacity: 0.1 }} />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ ...styles.right, animation: "fadeIn 0.4s ease forwards" }}>

          {/* Close button */}
          <button style={styles.closeBtn} aria-label="Close">✕</button>

          {verified ? (
            /* ── Success state ── */
            <div style={styles.successWrap}>
              <div style={{ fontSize: 72, animation: "checkPop 0.5s cubic-bezier(.34,1.56,.64,1) forwards" }}>✅</div>
              <h3 style={styles.successTitle}>Verified!</h3>
              <p style={styles.successSub}>Your OTP has been verified successfully.</p>
            </div>
          ) : (
            <>
              <h3 style={styles.heading}>Verify OTP</h3>
              <p style={styles.subtext}>
                Enter the 4-digit code sent to your email / mobile number
              </p>

              {/* OTP inputs */}
              <div
                style={{
                  ...styles.otpRow,
                  animation: shaking ? "shake 0.5s ease" : "none",
                }}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    className={`otp-input${digit ? " filled" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {/* Timer + Resend */}
              <div style={styles.timerRow}>
                <span style={styles.timerText}>
                  Resend in{" "}
                  <strong style={{ color: "#6d28d9" }}>{fmt(seconds)}</strong>
                </span>
                <button
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  <span style={{ fontSize: 14 }}>↻</span> Resend OTP
                </button>
              </div>

              {/* Progress bar */}
              <div style={styles.progressTrack}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${progressPercent}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Verify button */}
              <button
                className="verify-btn"
                style={{ marginTop: 24 }}
                onClick={handleVerify}
                disabled={otp.join("").length < 4}
              >
                VERIFY OTP <span style={{ fontSize: 18 }}>→</span>
              </button>

              {/* Wrong number */}
              <p style={styles.wrongNum}>
                Wrong number?{" "}
                <button
                  style={styles.changeBtn}
                  onClick={() => { setOtp(["","","",""]); setSeconds(55); setCanResend(false); }}
                >
                  Change it
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    minHeight: "100vh",
    background: "#b5b5b5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Nunito', sans-serif",
    padding: 20,
  },
  modal: {
    display: "flex",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
    width: "100%",
    maxWidth: 880,
    minHeight: 420,
    animation: "fadeIn 0.4s ease forwards",
  },
  /* Left */
  left: {
    flex: "0 0 42%",
    background: "linear-gradient(145deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    position: "relative",
    overflow: "hidden",
  },
  leftContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 6,
    position: "relative",
    zIndex: 2,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 900,
    color: "#fff",
    margin: 0,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.82)",
    margin: 0,
    fontWeight: 600,
    lineHeight: 1.5,
  },
  circle: {
    position: "absolute",
    borderRadius: "50%",
    background: "#fff",
  },
  /* Right */
  right: {
    flex: 1,
    background: "#fff",
    padding: "44px 48px",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    background: "none",
    border: "none",
    fontSize: 20,
    color: "#6b7280",
    cursor: "pointer",
    lineHeight: 1,
    padding: "4px 8px",
    borderRadius: 8,
    transition: "background 0.15s, color 0.15s",
  },
  heading: {
    fontSize: 26,
    fontWeight: 900,
    color: "#111827",
    margin: "0 0 10px",
    letterSpacing: -0.4,
  },
  subtext: {
    fontSize: 14,
    color: "#6b7280",
    margin: "0 0 28px",
    lineHeight: 1.55,
    maxWidth: 320,
  },
  otpRow: {
    display: "flex",
    gap: 14,
    marginBottom: 22,
  },
  timerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: 600,
  },
  progressTrack: {
    height: 5,
    background: "#e5e7eb",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #7c3aed, #a855f7)",
    borderRadius: 99,
  },
  wrongNum: {
    textAlign: "center",
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 18,
  },
  changeBtn: {
    background: "none",
    border: "none",
    color: "#7c3aed",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Nunito', sans-serif",
    padding: 0,
  },
  /* Success */
  successWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 12,
    textAlign: "center",
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 900,
    color: "#111827",
    margin: 0,
  },
  successSub: {
    fontSize: 14,
    color: "#6b7280",
    margin: 0,
  },
};