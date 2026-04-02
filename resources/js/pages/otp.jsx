import { router, Link ,useForm } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";

export default function OTPModal() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(55);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [windowSize, setWindowSize] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const inputRefs = useRef([]);
  const otpcode = useForm(
    {code: ''}
  );
  // console.log(otp.join(""));
  // router.post("/verify-otp", {
  //   code: otp.join(""),
  // }, {
  //   onSuccess: () => setVerified(true),
  // });



  // countdown timer
  useEffect(() => {
    if (seconds <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  // handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResend = () => {
    if (!canResend) return;
    setSeconds(55);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = () => {
    if (otp.join("").length < 6) {
      setShaking(true);
      
      
      setTimeout(() => setShaking(false), 500);
      return;
    }else{
      router.post("/verify-otp", {
        code: otp.join(""),
      }, {
        
        onSuccess: () => {
          console.log("OTP verified successfully");
          setVerified(true);
        },
        onError: () => {
          console.log("Invalid OTP");
          setShaking(true);
          setTimeout(() => setShaking(false), 500);
        }
      });
      console.log("OTP verified successfully");
    }
    setVerified(true);
  };

  const filledCount = otp.filter(Boolean).length;
  const progressPercent = (filledCount / 6) * 100;

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Dynamic styles based on screen size
  const getStyles = () => ({
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
      flexDirection: windowSize <= 768 ? "column" : "row",
    },
    left: {
      flex: windowSize <= 768 ? "0 0 auto" : "0 0 42%",
      background: "linear-gradient(145deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)",
      display: windowSize <= 768 ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: windowSize <= 768 ? 20 : 40,
      position: "relative",
      overflow: "hidden",
      minHeight: windowSize <= 768 ? 0 : 420,
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
      fontSize: windowSize <= 576 ? 20 : windowSize <= 768 ? 24 : 28,
      fontWeight: 900,
      color: "#fff",
      margin: 0,
      letterSpacing: -0.5,
    },
    tagline: {
      fontSize: windowSize <= 576 ? 12 : 14,
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
    right: {
      flex: 1,
      background: "#fff",
      padding: windowSize <= 576 ? "28px 20px" : windowSize <= 768 ? "36px 28px" : "44px 48px",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minHeight: windowSize <= 768 ? "auto" : 420,
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
      fontSize: windowSize <= 576 ? 18 : windowSize <= 768 ? 22 : 26,
      fontWeight: 900,
      color: "#111827",
      margin: "0 0 10px",
      letterSpacing: -0.4,
    },
    subtext: {
      fontSize: windowSize <= 576 ? 12 : 14,
      color: "#6b7280",
      margin: "0 0 28px",
      lineHeight: 1.55,
      maxWidth: windowSize <= 576 ? "100%" : 320,
    },
    otpRow: {
      display: "flex",
      gap: windowSize <= 576 ? 8 : 14,
      marginBottom: 22,
      justifyContent: "center",
      flexWrap: windowSize <= 576 ? "wrap" : "nowrap",
    },
    timerRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: windowSize <= 576 ? "center" : "space-between",
      marginBottom: 10,
      flexDirection: windowSize <= 576 ? "column" : "row",
      gap: windowSize <= 576 ? 8 : 0,
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
      fontSize: windowSize <= 576 ? 20 : windowSize <= 768 ? 22 : 26,
      fontWeight: 900,
      color: "#111827",
      margin: 0,
    },
    successSub: {
      fontSize: windowSize <= 576 ? 12 : 14,
      color: "#6b7280",
      margin: 0,
    },
  });

  const styles = getStyles();

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

        /* Tablet Screens (768px - 1024px) */
        @media (max-width: 1024px) {
          .otp-input {
            width: 56px; height: 56px;
            font-size: 22px;
            border-radius: 12px;
          }
        }

        /* Mobile Screens (576px - 768px) */
        @media (max-width: 768px) {
          .otp-input {
            width: 48px; height: 48px;
            font-size: 18px;
            border-radius: 10px;
          }
          .verify-btn {
            font-size: 13px;
            padding: 12px;
          }
          .resend-btn {
            font-size: 11px;
          }
        }

        /* Small Phones (up to 576px) */
        @media (max-width: 576px) {
          .otp-input {
            width: 40px; height: 40px;
            font-size: 16px;
            border-radius: 8px;
          }
          .verify-btn {
            font-size: 12px;
            padding: 10px;
            margin-top: 16px !important;
          }
          .resend-btn {
            font-size: 10px;
          }
        }
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
                Enter the 6-digit code sent to your email / mobile number
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
                <Link
                  href="/send-email"
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={!canResend}
                >
                  <span style={{ fontSize: 14 }}>↻</span> Resend OTP
                </Link>
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
                disabled={otp.join("").length < 6}
              >
                VERIFY OTP <span style={{ fontSize: 18 }}>→</span>
              </button>

              {/* Wrong number */}
              <p style={styles.wrongNum}>
                Wrong number?{" "}
                <button
                  style={styles.changeBtn}
                  onClick={() => { setOtp(["","","","","",""]); setSeconds(55); setCanResend(false); }}
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