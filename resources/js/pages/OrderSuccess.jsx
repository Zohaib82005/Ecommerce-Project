import React from "react";
import { Link } from "@inertiajs/react";

const OrderSuccess = () => {
  return (
    <div style={styles.root}>
      <div style={styles.bg} />

      {/* Clouds */}
      <div style={{ ...styles.cloud, ...styles.cloudA }}>
        <div style={{ ...styles.cloudBefore, ...styles.cloudABefore }} />
        <div style={{ ...styles.cloudAfter, ...styles.cloudAAfter }} />
      </div>
      <div style={{ ...styles.cloud, ...styles.cloudB }}>
        <div style={{ ...styles.cloudBefore, ...styles.cloudBBefore }} />
        <div style={{ ...styles.cloudAfter, ...styles.cloudBAfter }} />
      </div>

      {/* Road & Truck */}
      <div style={styles.roadWrap}>
        <div style={styles.groundShadow} />
        <div style={styles.truckScene}>
          <div style={styles.truck3d}>
            <div style={styles.cargoTop} />
            <div style={styles.cargo} />
            <div style={styles.cargoSide} />
            <div style={styles.cabin} />
            <div style={styles.cabinWindow} />
            <div style={styles.cabinWindowSmall} />
            <div style={styles.cabinSide} />
            <div style={styles.grille} />
            <div style={styles.grilleDetail} />
            <div style={styles.underbelly} />
            <div style={{ ...styles.wheel, ...styles.wheelBack }} />
            <div style={{ ...styles.wheel, ...styles.wheelFront }} />
            <span style={{ ...styles.smoke, ...styles.smoke1 }} />
            <span style={{ ...styles.smoke, ...styles.smoke2 }} />
            <span style={{ ...styles.smoke, ...styles.smoke3 }} />
          </div>
        </div>
        <div style={styles.road}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ ...styles.roadLine, ...roadLinePositions[i] }} />
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.checkIcon}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={styles.title}>Order confirmed!</p>
        <p style={styles.subtitle}>
          Your order is on its way — sit tight and we'll get it to your door shortly.
        </p>

        <div style={styles.infoRow}>
          <div style={styles.infoPill}>
            <div style={styles.pillLabel}>Status</div>
            <div style={{ ...styles.pillValue, color: "#16a34a" }}>Processing</div>
          </div>
          <div style={styles.infoPill}>
            <div style={styles.pillLabel}>Delivery</div>
            <div style={styles.pillValue}>2–3 business days</div>
          </div>
        </div>

        <Link href="/products" style={styles.ctaBtn}>
          Continue shopping
        </Link>
      </div>

      <style>{keyframes}</style>
    </div>
  );
};

const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  @keyframes truck-bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-3px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes puff {
    0%   { opacity: 0.8; transform: scale(1) translateX(0) translateY(0); }
    100% { opacity: 0;   transform: scale(2.5) translateX(-20px) translateY(-18px); }
  }
  @keyframes dash {
    0%   { transform: translateY(-50%) translateX(0);    opacity: 1; }
    100% { transform: translateY(-50%) translateX(-200px); opacity: 0; }
  }
  @keyframes cloud-move {
    0%   { transform: translateX(0); }
    100% { transform: translateX(120px); }
  }
  @keyframes shadow-pulse {
    0%, 100% { transform: translateX(-50%) scaleX(1);    opacity: 0.8; }
    50%       { transform: translateX(-50%) scaleX(0.92); opacity: 0.5; }
  }
  @keyframes pop {
    0%   { transform: scale(0); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes btn-hover {
    to { transform: translateY(-2px); }
  }

  .os-truck { animation: truck-bounce 0.45s ease-in-out infinite; }
  .os-wheel { animation: spin 0.5s linear infinite; }
  .os-smoke-1 { animation: puff 1.4s ease-out infinite 0s; }
  .os-smoke-2 { animation: puff 1.4s ease-out infinite 0.4s; }
  .os-smoke-3 { animation: puff 1.4s ease-out infinite 0.8s; }
  .os-road-line-0 { animation: dash 1.2s linear infinite 0s; }
  .os-road-line-1 { animation: dash 1.2s linear infinite -0.4s; }
  .os-road-line-2 { animation: dash 1.2s linear infinite -0.8s; }
  .os-road-line-3 { animation: dash 1.2s linear infinite -1.2s; }
  .os-cloud-a { animation: cloud-move 18s linear infinite; }
  .os-cloud-b { animation: cloud-move 24s linear infinite -6s; }
  .os-shadow  { animation: shadow-pulse 0.45s ease-in-out infinite; }
  .os-check   { animation: pop 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both; }
  .os-cta:hover { transform: translateY(-2px); box-shadow: 0 6px 0 #1e40af, 0 12px 24px rgba(37,99,235,0.32); }
  .os-cta:active { transform: translateY(2px); box-shadow: 0 2px 0 #1e40af; }
`;

const roadLinePositions = [
  { left: "5%", animationDelay: "0s" },
  { left: "28%", animationDelay: "-0.4s" },
  { left: "51%", animationDelay: "-0.8s" },
  { left: "74%", animationDelay: "-1.2s" },
];

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem 2.5rem",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(170deg, #dbeeff 0%, #f0f7ff 45%, #fef9ef 100%)",
    zIndex: 0,
  },

  /* --- Clouds --- */
  cloud: {
    position: "absolute",
    background: "white",
    borderRadius: "50px",
    zIndex: 1,
  },
  cloudA: {
    width: "80px",
    height: "24px",
    top: "32px",
    left: "8%",
    opacity: 0.85,
    // animation applied via className
  },
  cloudB: {
    width: "60px",
    height: "18px",
    top: "20px",
    left: "55%",
    opacity: 0.65,
  },
  cloudBefore: {
    content: "''",
    position: "absolute",
    background: "white",
    borderRadius: "50%",
  },
  cloudAfter: {
    content: "''",
    position: "absolute",
    background: "white",
    borderRadius: "50%",
  },
  cloudABefore: { width: "40px", height: "36px", top: "-18px", left: "12px" },
  cloudAAfter:  { width: "28px", height: "24px", top: "-12px", left: "36px" },
  cloudBBefore: { width: "30px", height: "28px", top: "-14px", left: "8px" },
  cloudBAfter:  { width: "20px", height: "18px", top: "-10px", left: "28px" },

  /* --- Road --- */
  roadWrap: {
    position: "relative",
    width: "100%",
    maxWidth: "680px",
    height: "90px",
    zIndex: 2,
    overflow: "hidden",
  },
  road: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "36px",
    background: "#3d3d3d",
    borderRadius: "3px",
    boxShadow: "0 -4px 0 #545454, 0 4px 12px rgba(0,0,0,0.25)",
  },
  roadLine: {
    position: "absolute",
    top: "50%",
    height: "4px",
    width: "60px",
    background: "#f5c842",
    borderRadius: "2px",
    transform: "translateY(-50%)",
  },
  groundShadow: {
    position: "absolute",
    bottom: "36px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "200px",
    height: "8px",
    background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)",
    zIndex: 1,
  },

  /* --- Truck --- */
  truckScene: {
    position: "absolute",
    bottom: "36px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "220px",
    height: "100px",
  },
  truck3d: {
    position: "relative",
    width: "220px",
    height: "80px",
    // animation applied via className
  },
  cargoTop: {
    position: "absolute",
    left: "-3px",
    top: "-10px",
    width: "146px",
    height: "14px",
    background: "#f06a30",
    borderRadius: "3px 3px 0 0",
    transform: "skewX(-2deg)",
    boxShadow: "3px -2px 0 #d05620, 8px -2px 0 rgba(0,0,0,0.1)",
  },
  cargo: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "140px",
    height: "62px",
    background: "#e85d26",
    borderRadius: "4px 4px 0 0",
    boxShadow:
      "inset -8px 0 0 #c44b1a, inset 0 -6px 0 #bf4818, 4px 4px 0 #b34215, 8px 8px 0 rgba(0,0,0,0.12)",
  },
  cargoSide: {
    position: "absolute",
    left: "140px",
    top: "6px",
    width: "12px",
    height: "56px",
    background: "#b34215",
    borderRadius: "0 2px 2px 0",
    transform: "skewY(-3deg)",
  },
  cabin: {
    position: "absolute",
    left: "145px",
    top: "6px",
    width: "68px",
    height: "56px",
    background: "#2563b0",
    borderRadius: "4px 10px 0 0",
    boxShadow:
      "inset -6px 0 0 #1a4f9e, inset 0 -4px 0 #1a4f9e, 4px 4px 0 #163e7c, 8px 8px 0 rgba(0,0,0,0.1)",
  },
  cabinWindow: {
    position: "absolute",
    top: "12px",
    left: "151px",
    width: "32px",
    height: "24px",
    background: "#a8d4ff",
    borderRadius: "3px 6px 0 0",
    boxShadow: "inset 0 0 0 2px #7ab8f5",
  },
  cabinWindowSmall: {
    position: "absolute",
    top: "12px",
    left: "187px",
    width: "14px",
    height: "14px",
    background: "#a8d4ff",
    borderRadius: "2px 4px 0 0",
    boxShadow: "inset 0 0 0 1px #7ab8f5",
  },
  cabinSide: {
    position: "absolute",
    left: "213px",
    top: "12px",
    width: "10px",
    height: "50px",
    background: "#163e7c",
    borderRadius: "0 6px 0 0",
    transform: "skewY(-4deg)",
  },
  grille: {
    position: "absolute",
    left: "206px",
    top: "32px",
    width: "14px",
    height: "26px",
    background: "#111",
    borderRadius: "2px 3px 3px 2px",
    boxShadow: "inset 2px 0 0 #333",
  },
  grilleDetail: {
    position: "absolute",
    top: "36px",
    left: "208px",
    width: "8px",
    height: "4px",
    background: "#f5a623",
    borderRadius: "1px",
    boxShadow: "0 6px 0 #f5a623",
  },
  underbelly: {
    position: "absolute",
    left: 0,
    top: "62px",
    width: "222px",
    height: "10px",
    background: "#222",
    borderRadius: "0 0 3px 3px",
  },
  wheel: {
    position: "absolute",
    width: "36px",
    height: "36px",
    background: "#1a1a1a",
    borderRadius: "50%",
    border: "4px solid #333",
    top: "56px",
    boxShadow: "3px 3px 0 #111, 0 4px 8px rgba(0,0,0,0.4)",
  },
  wheelBack:  { left: "22px" },
  wheelFront: { left: "162px" },
  smoke: {
    position: "absolute",
    borderRadius: "50%",
    background: "rgba(200,200,200,0.7)",
  },
  smoke1: { width: "14px", height: "14px", left: "-18px", top: "12px" },
  smoke2: { width: "10px", height: "10px", left: "-28px", top: "6px" },
  smoke3: { width: "8px",  height: "8px",  left: "-40px", top: "2px" },

  /* --- Card --- */
  card: {
    position: "relative",
    zIndex: 3,
    marginTop: "1.5rem",
    width: "100%",
    maxWidth: "440px",
    background: "white",
    borderRadius: "20px",
    padding: "2rem 2rem 1.75rem",
    boxShadow:
      "0 2px 0 #e2e8f0, 0 6px 0 #cfd8e8, 0 12px 24px rgba(30,50,100,0.12), 0 2px 4px rgba(30,50,100,0.08)",
    textAlign: "center",
  },
  checkIcon: {
    width: "64px",
    height: "64px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    borderRadius: "50%",
    margin: "0 auto 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 0 #15803d, 0 8px 20px rgba(34,197,94,0.3)",
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: "22px",
    fontWeight: 800,
    color: "#111827",
    margin: "0 0 0.4rem",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 1.5rem",
    lineHeight: 1.5,
  },
  infoRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "1.25rem",
  },
  infoPill: {
    flex: 1,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "0.75rem 0.5rem",
    boxShadow: "0 2px 0 #e2e8f0",
  },
  pillLabel: {
    fontSize: "11px",
    fontWeight: 500,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "2px",
  },
  pillValue: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#111827",
  },
  ctaBtn: {
    display: "inline-block",
    padding: "0.75rem 2rem",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "15px",
    fontWeight: 500,
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    boxShadow: "0 4px 0 #1e40af, 0 8px 20px rgba(37,99,235,0.28)",
    transition: "transform 0.1s, box-shadow 0.1s",
    letterSpacing: "0.1px",
  },
};

export default OrderSuccess;