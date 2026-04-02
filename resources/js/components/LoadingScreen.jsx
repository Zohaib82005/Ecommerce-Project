import React, { useEffect, useRef, useState } from 'react';

const LoadingScreen = ({ isVisible = true, duration = 1000 }) => {
  const [show, setShow] = useState(isVisible);
  const [fade, setFade] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setFade(false);
      const fadeTimer = setTimeout(() => setFade(true), duration - 700);
      const hideTimer = setTimeout(() => setShow(false), duration);
      return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
    }
  }, [isVisible, duration]);

  useEffect(() => {
    if (!show || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      op: Math.random() * 0.5 + 0.1,
      color: ['139,92,246','236,72,153','99,179,237','110,231,183'][Math.floor(Math.random() * 4)]
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.op})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.06 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [show]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.7s ease',
      opacity: fade ? 0 : 1,
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* Nebula blobs */}
      {[
        { style: { width: 400, height: 400, top: -100, left: -100, background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', animationDelay: '0s', '--nd': '14s', opacity: 0.13 } },
        { style: { width: 350, height: 350, bottom: -80, right: -80, background: 'radial-gradient(circle, #ec4899, transparent 70%)', animationDelay: '3s', '--nd': '18s', opacity: 0.10 } },
        { style: { width: 280, height: 280, top: '30%', left: '45%', background: 'radial-gradient(circle, #3b82f6, transparent 70%)', animationDelay: '6s', '--nd': '11s', opacity: 0.09 } },
      ].map((n, i) => (
        <div key={i} style={{ position: 'absolute', borderRadius: '50%', animation: `nebulaFloat ${n.style['--nd']} ease-in-out infinite`, zIndex: 2, ...n.style }} />
      ))}

      {/* Corner brackets */}
      {['tl','tr','bl','br'].map((pos, i) => (
        <div key={pos} style={{
          position: 'absolute', width: 22, height: 22, zIndex: 8,
          ...(pos.includes('t') ? { top: 20 } : { bottom: 20 }),
          ...(pos.includes('l') ? { left: 20 } : { right: 20 }),
          borderTop: pos.includes('t') ? '1.5px solid rgba(139,92,246,0.6)' : 'none',
          borderBottom: pos.includes('b') ? '1.5px solid rgba(139,92,246,0.6)' : 'none',
          borderLeft: pos.includes('l') ? '1.5px solid rgba(139,92,246,0.6)' : 'none',
          borderRight: pos.includes('r') ? '1.5px solid rgba(139,92,246,0.6)' : 'none',
          animation: `cornerPulse 3s ease-in-out ${i * 0.75}s infinite`,
        }} />
      ))}

      {/* Scan line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 1, zIndex: 5,
        background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(236,72,153,0.4), transparent)',
        animation: 'scanMove 3s ease-in-out infinite',
      }} />

      {/* Orbit system + logo */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { inset: 0, top: '#8b5cf6', right: 'rgba(139,92,246,0.3)', dur: '3s', dir: 'normal', dot: { bg: '#8b5cf6', shadow: '139,92,246', pos: 'top' } },
            { inset: 12, bottom: '#ec4899', left: 'rgba(236,72,153,0.2)', dur: '2s', dir: 'reverse', dot: { bg: '#ec4899', shadow: '236,72,153', pos: 'bottom' } },
            { inset: 24, top: '#63b3ed', right: 'rgba(99,179,237,0.15)', dur: '4.5s', dir: 'normal', dot: { bg: '#63b3ed', shadow: '99,179,237', pos: 'top' } },
            { inset: 36, bottom: '#6ee7b7', left: 'rgba(110,231,183,0.1)', dur: '3.5s', dir: 'reverse', dot: { bg: '#6ee7b7', shadow: '110,231,183', pos: 'bottom' } },
          ].map((o, i) => (
            <div key={i} style={{
              position: 'absolute',
              inset: o.inset, borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: o.top || 'transparent',
              borderBottomColor: o.bottom || 'transparent',
              borderRightColor: o.right || 'transparent',
              borderLeftColor: o.left || 'transparent',
              animation: `spin 1s linear infinite`,
              animationDuration: o.dur,
              animationDirection: o.dir,
            }}>
              <div style={{
                position: 'absolute', width: 6, height: 6, borderRadius: '50%',
                background: o.dot.bg,
                boxShadow: `0 0 8px 3px rgba(${o.dot.shadow},0.7)`,
                ...(o.dot.pos === 'top'
                  ? { top: 0, left: '50%', transform: 'translateX(-50%) translateY(-3px)' }
                  : { bottom: 0, left: '50%', transform: 'translateX(-50%) translateY(3px)' }
                ),
              }} />
            </div>
          ))}

          {/* Logo shell */}
          <div style={{
            position: 'absolute', width: 80, height: 80, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(circle at 40% 35%, rgba(139,92,246,0.25), rgba(10,10,26,0.9))',
            border: '1px solid rgba(139,92,246,0.35)',
            animation: 'logoBreathe 3.5s ease-in-out infinite',
          }}>
            <img src="/logo.png" alt="" style={{ width: 144, height: 144, objectFit: 'contain', borderRadius: 8, animation: 'logoFloat 4s ease-in-out infinite' }} />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 32, position: 'relative', width: 120, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#8b5cf6,#ec4899,#63b3ed)', animation: 'progressFill 2.8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', backgroundSize: '60px 100%', animation: 'shimmerSlide 1.4s linear infinite' }} />
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {['#8b5cf6','#ec4899','#63b3ed','#6ee7b7'].map((c, i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: c, animation: `dotAnim 1.8s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes nebulaFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.08); }
          66% { transform: translate(-15px,10px) scale(0.95); }
        }
        @keyframes scanMove { 0%{top:20%;opacity:0} 20%{opacity:1} 80%{opacity:1} 100%{top:80%;opacity:0} }
        @keyframes cornerPulse { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
        @keyframes logoBreathe {
          0%,100% { transform:scale(1); box-shadow:0 0 20px 4px rgba(139,92,246,0.15); }
          50% { transform:scale(1.04); box-shadow:0 0 0 8px rgba(139,92,246,0.08),0 0 40px 10px rgba(139,92,246,0.3); }
        }
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes progressFill { 0%{width:0%;opacity:1} 85%{width:100%;opacity:1} 100%{width:100%;opacity:0} }
        @keyframes shimmerSlide { 0%{background-position:-60px 0} 100%{background-position:180px 0} }
        @keyframes dotAnim { 0%,80%,100%{transform:translateY(0) scale(0.8);opacity:0.4} 40%{transform:translateY(-10px) scale(1);opacity:1} }
      `}</style>
    </div>
  );
};

export default LoadingScreen;