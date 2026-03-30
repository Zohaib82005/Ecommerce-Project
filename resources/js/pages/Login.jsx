import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import FlashMessage from '../Components/FlashMessage';

const Auth = () => {
  const [activeTab, setActiveTab]   = useState('login');
  const [showModal, setShowModal]   = useState(true);
  const [isLoading, setIsLoading]   = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const [signupData, setSignupData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    password: '', password_confirmation: '', agree_terms: false,
  });

  const [errors, setErrors] = useState({});

  /* ── handlers (unchanged) ── */
  const handleLoginSubmit = (e) => {
    e.preventDefault(); setIsLoading(true); setErrors({});
    router.post('/submitlog', loginData, {
      onSuccess: () => setShowModal(false),
      onError:   (err) => setErrors(err),
      onFinish:  () => setIsLoading(false),
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault(); setIsLoading(true); setErrors({});
    if (signupData.password !== signupData.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match' });
      setIsLoading(false); return;
    }
    if (!signupData.agree_terms) {
      setErrors({ agree_terms: 'You must agree to the terms and conditions' });
      setIsLoading(false); return;
    }
    router.post('/submitreg', signupData, {
      onSuccess: () => setShowModal(false),
      onError:   (err) => setErrors(err),
      onFinish:  () => setIsLoading(false),
    });
  };

  const handleLoginChange  = (e) => { const { name, value } = e.target; setLoginData(p => ({ ...p, [name]: value })); };
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const closeModal = () => setShowModal(true);
  if (!showModal) return null;

  /* ── tiny helper components ── */
  const ErrMsg = ({ field }) =>
    errors[field] ? <p style={s.errMsg}>{errors[field]}</p> : null;

  const Inp = ({ type = 'text', name, value, onChange, placeholder, err }) => (
    <input
      type={type} name={name} value={value}
      onChange={onChange} placeholder={placeholder}
      style={{ ...s.inp, ...(err ? s.inpErr : {}) }}
      onFocus={e => Object.assign(e.target.style, s.inpFocus)}
      onBlur={e => Object.assign(e.target.style, err ? { ...s.inp, ...s.inpErr } : s.inp)}
    />
  );

  const Spinner = () => <div style={s.spinner} />;

  const SubmitBtn = ({ label }) => (
    <button
      type="submit" disabled={isLoading} style={s.btn}
      onMouseEnter={e => { if (!isLoading) Object.assign(e.target.style, s.btnHover); }}
      onMouseLeave={e => { if (!isLoading) Object.assign(e.target.style, s.btn); }}
      onMouseDown={e => Object.assign(e.target.style, s.btnActive)}
      onMouseUp={e => Object.assign(e.target.style, s.btn)}
    >
      {isLoading ? <Spinner /> : (
        <span style={{ display:'flex', alignItems:'center', gap:8 }}>
          {label}
          <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </span>
      )}
    </button>
  );

  return (
    <>
      <style>{css}</style>
      <FlashMessage errors={errors} />

      {/* overlay */}
      <div style={s.overlay}>
        <div style={s.modal} className="auth-modal">

          {/* close */}
          <Link href="/" onClick={closeModal} style={s.closeBtn} className="auth-close">
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </Link>

          <div className="auth-layout">

            {/* ══════════════════════════════
                LEFT — 3D Purple Panel
            ══════════════════════════════ */}
            <div style={s.left} className="auth-left">
              {/* glows */}
              <div style={{ position:'absolute',top:36,right:36,width:80,height:80,background:'rgba(255,255,255,0.1)',borderRadius:'50%',filter:'blur(22px)',animation:'authPulseGlow 3s ease-in-out infinite' }}/>
              <div style={{ position:'absolute',bottom:72,left:36,width:120,height:120,background:'rgba(167,139,250,0.18)',borderRadius:'50%',filter:'blur(30px)' }}/>
              <div style={{ position:'absolute',top:'50%',right:16,width:60,height:60,background:'rgba(250,204,21,0.18)',borderRadius:'50%',filter:'blur(18px)' }}/>
              {/* top edge */}
              <div style={{ position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)' }}/>
              {/* stars */}
              <div style={{ position:'absolute',top:110,right:52,color:'rgba(196,181,253,0.65)' }}>
                <svg className="star-spin" width={44} height={44} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>
              <div style={{ position:'absolute',bottom:110,left:26,color:'rgba(196,181,253,0.38)' }}>
                <svg className="star-spin-r" width={28} height={28} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                </svg>
              </div>

              <div style={{ position:'relative',zIndex:2 }}>
                <h2 style={{ fontSize:30,fontWeight:900,marginBottom:10,color:'#fff',textShadow:'0 2px 8px rgba(0,0,0,0.3),0 3px 0 rgba(0,0,0,0.12)' }}>
                  Welcome Back
                </h2>
                <p style={{ color:'rgba(237,233,254,0.88)',fontSize:15,marginBottom:28,textShadow:'0 1px 4px rgba(0,0,0,0.18)' }}>
                  Pick up your browsing exactly where you left.
                </p>

                {/* bags scene */}
                <div style={{ position:'relative',perspective:600,perspectiveOrigin:'50% 60%' }}>
                  <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'center',gap:8 }}>

                    {/* purple bag */}
                    <div className="bag1" style={{ position:'relative',flexShrink:0 }}>
                      <div style={{ position:'absolute',top:-22,left:'50%',transform:'translateX(-50%)',width:60,height:28,border:'5px solid #3b1d8a',borderBottom:'none',borderRadius:'28px 28px 0 0',boxShadow:'2px -2px 0 #1e0a5c' }}/>
                      <div style={{ width:90,height:106,borderRadius:10,background:'linear-gradient(145deg,#5b21b6,#3b0fa0)',boxShadow:'6px 6px 0 #1e0a5c,8px 8px 18px rgba(0,0,0,0.4)',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <div style={{ width:60,height:76,borderRadius:6,background:'linear-gradient(145deg,#4c1d95,#2e0d7a)',boxShadow:'inset 2px 2px 6px rgba(0,0,0,0.3)' }}/>
                        <div style={{ position:'absolute',top:8,left:8,width:18,height:46,borderRadius:999,background:'linear-gradient(180deg,rgba(255,255,255,0.28),transparent)' }}/>
                      </div>
                      <div style={{ position:'absolute',top:3,right:0,width:7,height:106,background:'linear-gradient(180deg,#1e0a5c,#0d0430)',transform:'translateX(6px) skewY(-1.5deg)',borderRadius:'0 4px 4px 0',opacity:0.85 }}/>
                      <div style={{ position:'absolute',bottom:0,left:3,right:0,height:7,background:'linear-gradient(90deg,#1e0a5c,#0d0430)',transform:'translateY(5px) skewX(-1.5deg)',borderRadius:'0 0 4px 4px',opacity:0.75 }}/>
                      <div className="disc-tag" style={{ position:'absolute',left:-14,top:26,width:44,height:44,borderRadius:'50%',background:'radial-gradient(circle at 35% 35%,#f87171,#dc2626)',border:'2px solid #fca5a5',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:18,transform:'rotate(-12deg)',boxShadow:'0 4px 0 #991b1b' }}>%</div>
                    </div>

                    {/* yellow bag */}
                    <div className="bag2" style={{ position:'relative',marginBottom:-14,flexShrink:0 }}>
                      <div style={{ position:'absolute',top:-18,left:'50%',transform:'translateX(-50%)',width:48,height:22,border:'5px solid #92400e',borderBottom:'none',borderRadius:'22px 22px 0 0',boxShadow:'2px -2px 0 #78350f' }}/>
                      <div style={{ width:74,height:88,borderRadius:10,background:'linear-gradient(145deg,#fde047,#facc15)',boxShadow:'5px 5px 0 #92400e,7px 7px 14px rgba(0,0,0,0.35)',position:'relative',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <div style={{ width:46,height:60,borderRadius:6,background:'linear-gradient(145deg,#fbbf24,#d97706)',boxShadow:'inset 2px 2px 5px rgba(0,0,0,0.2)' }}/>
                        <div style={{ position:'absolute',top:6,left:6,width:13,height:34,borderRadius:999,background:'linear-gradient(180deg,rgba(255,255,255,0.35),transparent)' }}/>
                      </div>
                      <div style={{ position:'absolute',top:3,right:0,width:6,height:88,background:'linear-gradient(180deg,#92400e,#78350f)',transform:'translateX(5px) skewY(-1.5deg)',borderRadius:'0 4px 4px 0',opacity:0.8 }}/>
                      <div style={{ position:'absolute',bottom:0,left:3,right:0,height:6,background:'linear-gradient(90deg,#92400e,#78350f)',transform:'translateY(4px) skewX(-1.5deg)',borderRadius:'0 0 4px 4px',opacity:0.7 }}/>
                      <div style={{ position:'absolute',bottom:-6,right:-6,fontSize:26,fontWeight:900,color:'#ec4899',textShadow:'2px 2px 0 #be185d' }}>%</div>
                    </div>
                  </div>

                  {/* ground shadow */}
                  <div style={{ width:120,height:12,background:'radial-gradient(ellipse,rgba(0,0,0,0.3) 0%,transparent 70%)',margin:'6px auto 0' }}/>

                  {/* orbs */}
                  <div className="orb1" style={{ position:'absolute',top:0,left:'22%',width:28,height:28,borderRadius:'50%',background:'radial-gradient(circle at 35% 35%,#93c5fd,#2563eb)',boxShadow:'3px 3px 0 #1d4ed8,4px 4px 10px rgba(29,78,216,0.5)' }}/>
                  <div className="orb2" style={{ position:'absolute',top:26,right:'22%',width:20,height:20,borderRadius:'50%',background:'radial-gradient(circle at 35% 35%,#fca5a5,#dc2626)',boxShadow:'2px 2px 0 #991b1b,3px 3px 8px rgba(153,27,27,0.5)' }}/>
                  <div className="orb3" style={{ position:'absolute',bottom:44,left:'30%',width:34,height:34,borderRadius:8,background:'radial-gradient(circle at 35% 35%,#86efac,#16a34a)',boxShadow:'3px 3px 0 #15803d,5px 5px 12px rgba(21,128,61,0.5)',transform:'rotate(12deg)' }}/>
                </div>
              </div>
            </div>{/* /left */}

            {/* ══════════════════════════════
                RIGHT — Form Panel
            ══════════════════════════════ */}
            <div style={s.right} className="auth-right">

              {/* tab bar */}
              <div style={s.tabBar}>
                {['login','signup'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ ...s.tabBtn, ...(activeTab === tab ? s.tabActive : s.tabInactive) }}
                  >
                    {tab === 'login' ? 'LOG IN' : 'SIGN UP'}
                  </button>
                ))}
              </div>

              <h4 style={s.heading}>
                {activeTab === 'login' ? 'Continue Shopping' : 'Create Account'}
              </h4>
              <p style={s.subhead}>
                {activeTab === 'login' ? 'Please enter email or mobile number' : 'Fill in your details to get started'}
              </p>

              {/* ── LOGIN ── */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} style={s.form}>
                  <div>
                    <Inp type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="Enter Mobile Number or Email" err={!!errors.email}/>
                    <ErrMsg field="email"/>
                  </div>
                  <div>
                    <Inp type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Enter Password" err={!!errors.password}/>
                    <ErrMsg field="password"/>
                  </div>
                  <SubmitBtn label="LOGIN"/>
                </form>
              )}

              {/* ── SIGNUP ── */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignupSubmit} style={s.form}>

                  {/* name row */}
                  <div className="form-row">
                    <div>
                      <Inp name="first_name" value={signupData.first_name} onChange={handleSignupChange} placeholder="First Name" err={!!errors.first_name}/>
                      <ErrMsg field="first_name"/>
                    </div>
                    <div>
                      <Inp name="last_name" value={signupData.last_name} onChange={handleSignupChange} placeholder="Last Name" err={!!errors.last_name}/>
                      <ErrMsg field="last_name"/>
                    </div>
                  </div>

                  {/* email */}
                  <div>
                    <Inp type="email" name="email" value={signupData.email} onChange={handleSignupChange} placeholder="Email Address" err={!!errors.email}/>
                    <ErrMsg field="email"/>
                  </div>

                  {/* phone */}
                  <div>
                    <Inp type="tel" name="phone" value={signupData.phone} onChange={handleSignupChange} placeholder="Phone Number" err={!!errors.phone}/>
                    <ErrMsg field="phone"/>
                  </div>

                  {/* password row */}
                  <div className="form-row">
                    <div>
                      <Inp type="password" name="password" value={signupData.password} onChange={handleSignupChange} placeholder="Password" err={!!errors.password}/>
                      <ErrMsg field="password"/>
                    </div>
                    <div>
                      <Inp type="password" name="password_confirmation" value={signupData.password_confirmation} onChange={handleSignupChange} placeholder="Confirm Password" err={!!errors.password_confirmation}/>
                      <ErrMsg field="password_confirmation"/>
                    </div>
                  </div>

                  {/* terms */}
                  <div style={s.checkRow}>
                    <input
                      type="checkbox" name="agree_terms"
                      checked={signupData.agree_terms} onChange={handleSignupChange}
                      style={{ width:15,height:15,marginTop:2,accentColor:'#7c3aed',flexShrink:0 }}
                    />
                    <label style={{ fontSize:12,color:'#4b5563',lineHeight:1.5 }}>
                      I agree to the{' '}
                      <a href="/terms" style={{ color:'#7c3aed' }}>Terms and Conditions</a>
                      {' '}and{' '}
                      <a href="/privacy" style={{ color:'#7c3aed' }}>Privacy Policy</a>
                    </label>
                  </div>
                  <ErrMsg field="agree_terms"/>

                  <SubmitBtn label="CREATE ACCOUNT"/>
                </form>
              )}

              {/* Divider — unchanged placeholder */}
              {/* Social Login — unchanged placeholder */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Style objects ─────────────────────────────────────────── */
const s = {
  overlay: { position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,background:'rgba(0,0,0,0.52)',backdropFilter:'blur(6px)' },
  modal:   { position:'relative',width:'100%',maxWidth:900,background:'#fff',borderRadius:20,overflow:'hidden',boxShadow:'0 32px 80px rgba(0,0,0,0.35)' },
  closeBtn:{ position:'absolute',top:12,right:12,zIndex:20,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',background:'#f3f4f6',border:'none',cursor:'pointer',boxShadow:'0 2px 0 #9ca3af',color:'#4b5563',transition:'background 0.2s' },
  left:    { background:'linear-gradient(145deg,#7c3aed 0%,#6d28d9 45%,#4c1d95 100%)',padding:'44px 32px',color:'#fff',position:'relative',overflow:'hidden',boxShadow:'inset -8px 0 32px rgba(0,0,0,0.18)',flexShrink:0 },
  right:   { flex:1,padding:'36px 36px 32px',background:'#fff',overflowY:'auto',maxHeight:'90vh',boxShadow:'inset 8px 0 32px rgba(109,40,217,0.04)' },
  tabBar:  { display:'flex',background:'#f3f4f6',borderRadius:999,padding:4,marginBottom:20,boxShadow:'inset 0 3px 8px rgba(0,0,0,0.08)' },
  tabBtn:  { flex:1,padding:'9px 16px',borderRadius:999,fontSize:13,fontWeight:700,border:'none',cursor:'pointer',letterSpacing:'0.4px',transition:'all 0.2s' },
  tabActive:  { background:'#fff',color:'#111827',boxShadow:'0 4px 0 #d1d5db,0 6px 16px rgba(0,0,0,0.1)',transform:'translateY(-2px)' },
  tabInactive:{ background:'none',color:'#6b7280' },
  heading: { fontSize:21,fontWeight:800,color:'#111827',marginBottom:6,textShadow:'0 1px 0 rgba(0,0,0,0.05)' },
  subhead: { fontSize:13,color:'#6b7280',marginBottom:18 },
  form:    { display:'flex',flexDirection:'column',gap:10 },
  inp:     { width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #d1d5db',fontSize:13,background:'#fff',boxShadow:'0 3px 0 #d1d5db',outline:'none',color:'#111827',boxSizing:'border-box',transition:'all 0.2s',fontFamily:'inherit' },
  inpErr:  { borderColor:'#ef4444',boxShadow:'0 3px 0 #fca5a5' },
  inpFocus:{ borderColor:'#7c3aed',boxShadow:'0 4px 0 #7c3aed,0 8px 20px rgba(124,58,237,0.15)',transform:'translateY(-1px)' },
  errMsg:  { fontSize:11,color:'#ef4444',marginTop:3,paddingLeft:2 },
  checkRow:{ display:'flex',alignItems:'flex-start',gap:8,padding:'2px 0' },
  btn:     { width:'100%',background:'#1f2937',color:'#fff',border:'none',borderRadius:10,padding:'12px',fontSize:13,fontWeight:700,letterSpacing:'0.5px',cursor:'pointer',boxShadow:'0 6px 0 #111827,0 8px 20px rgba(0,0,0,0.25)',transition:'all 0.15s',display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontFamily:'inherit' },
  btnHover:{ background:'#111827',boxShadow:'0 8px 0 #030712,0 12px 28px rgba(0,0,0,0.3)',transform:'translateY(-2px)' },
  btnActive:{ boxShadow:'0 2px 0 #111827',transform:'translateY(4px)' },
  spinner: { width:18,height:18,border:'3px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'authSpin 0.7s linear infinite' },
};

/* ─── Global CSS (animations + responsive rules) ─────────── */
const css = `
  @keyframes authPulseGlow { 0%,100%{box-shadow:0 0 16px 4px rgba(167,139,250,0.4)} 50%{box-shadow:0 0 32px 10px rgba(167,139,250,0.7)} }
  @keyframes authStarSpin  { from{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.2)} to{transform:rotate(360deg) scale(1)} }
  @keyframes authFloatBag1 { 0%,100%{transform:rotate(-12deg) translateY(0)} 50%{transform:rotate(-12deg) translateY(-8px)} }
  @keyframes authFloatBag2 { 0%,100%{transform:rotate(6deg) translateY(0)} 50%{transform:rotate(6deg) translateY(-10px)} }
  @keyframes authFloatOrb  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes authSpin      { to{transform:rotate(360deg)} }
  @keyframes authFadeIn    { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  .auth-modal { animation: authFadeIn 0.4s cubic-bezier(.22,1,.36,1) both; }

  .star-spin   { display:inline-block; animation: authStarSpin 6s linear infinite; }
  .star-spin-r { display:inline-block; animation: authStarSpin 4s linear infinite reverse; }
  .bag1        { animation: authFloatBag1 3.2s ease-in-out infinite; }
  .bag2        { animation: authFloatBag2 2.8s ease-in-out infinite 0.4s; }
  .disc-tag    { animation: authPulseGlow 2s ease-in-out infinite; }
  .orb1        { animation: authFloatOrb 2.6s ease-in-out infinite; }
  .orb2        { animation: authFloatOrb 3.1s ease-in-out infinite 0.5s; }
  .orb3        { animation: authFloatOrb 3.5s ease-in-out infinite 1s; }

  /* left panel hover tilt */
  .auth-left  { transition: transform 0.4s ease; }
  .auth-left:hover { transform: perspective(900px) rotateY(3deg) rotateX(-2deg); }

  /* right panel hover */
  .auth-right { transition: transform 0.35s ease; }
  .auth-right:hover { transform: perspective(900px) rotateY(-2deg) rotateX(1deg); }

  /* ── Layout ── */
  .auth-layout { display: flex; flex-direction: row; }

  /* ── Responsive two-column form rows ── */
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  /* ── md breakpoint (≤ 767px): stack panels, hide left ── */
  @media (max-width: 767px) {
    .auth-layout  { flex-direction: column; }
    .auth-left    { display: none; }
    .auth-right   { padding: 28px 20px 24px !important; max-height: none !important; }
  }

  /* ── sm breakpoint (≤ 480px): single-column form rows ── */
  @media (max-width: 480px) {
    .form-row { grid-template-columns: 1fr; }
    .auth-right { padding: 24px 16px 20px !important; }
  }

  /* close button hover */
  .auth-close:hover { background: #e5e7eb !important; }
`;

export default Auth;