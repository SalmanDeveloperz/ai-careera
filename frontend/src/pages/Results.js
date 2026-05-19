import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(600, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2);
  } catch (e) { }
}

function playReveal() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [300, 400, 500, 700, 900].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.2);
      o.start(ctx.currentTime + i * 0.06);
      o.stop(ctx.currentTime + i * 0.06 + 0.2);
    });
  } catch (e) { }
}

const rankColors = [
  { border: '#6366f1', bg: 'rgba(99,102,241,0.08)', badge: 'linear-gradient(135deg,#6366f1,#8b5cf6)', glow: 'rgba(99,102,241,0.3)', label: '🥇 Best Match' },
  { border: '#10b981', bg: 'rgba(16,185,129,0.08)', badge: 'linear-gradient(135deg,#10b981,#059669)', glow: 'rgba(16,185,129,0.3)', label: '🥈 Great Match' },
  { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', badge: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: 'rgba(245,158,11,0.3)', label: '🥉 Good Match' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .results-page { min-height:100vh; background:#0F172A; font-family:'Inter',sans-serif; }

  @keyframes fadeIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes confetti {
    0%{transform:translateY(-10px) rotate(0deg);opacity:1}
    100%{transform:translateY(60px) rotate(360deg);opacity:0}
  }
  @keyframes countUp { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(99,102,241,0.3)} 50%{box-shadow:0 0 40px rgba(99,102,241,0.6)} }

  .results-nav {
    background:#1E293B;
    border-bottom:1px solid #334155;
    padding:0 32px;
    height:64px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    position:sticky;
    top:0;
    z-index:100;
    animation:fadeInDown 0.5s ease;
  }
  .results-nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .results-logo-icon {
    width:36px; height:36px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:16px;
    animation:float 3s ease-in-out infinite;
    box-shadow:0 4px 12px rgba(99,102,241,0.4);
  }
  .results-logo-txt { font-size:17px; font-weight:800; color:#fff; }

  .nav-actions { display:flex; align-items:center; gap:10px; }
  .nav-btn-outline {
    display:flex; align-items:center; gap:6px;
    padding:7px 14px;
    background:transparent;
    border:1px solid #334155;
    border-radius:8px;
    color:#94a3b8;
    font-size:12px;
    font-weight:600;
    cursor:pointer;
    text-decoration:none;
    font-family:'Inter',sans-serif;
    transition:all 0.2s;
  }
  .nav-btn-outline:hover { border-color:#6366f1; color:#818cf8; }

  .results-hero {
    background:linear-gradient(135deg,#0f0c29,#302b63,#0F172A);
    padding:48px 32px 80px;
    text-align:center;
    position:relative;
    overflow:hidden;
    animation:fadeIn 0.6s ease;
  }
  .hero-particles {
    position:absolute;
    top:0; left:0; right:0; bottom:0;
    pointer-events:none;
  }
  .particle {
    position:absolute;
    width:4px; height:4px;
    border-radius:50%;
    background:#6366f1;
    animation:confetti 2s ease-in-out infinite;
  }
  .results-trophy {
    font-size:64px;
    display:block;
    margin-bottom:16px;
    animation:float 3s ease-in-out infinite;
    position:relative; z-index:1;
    filter:drop-shadow(0 0 20px rgba(99,102,241,0.5));
  }
  .results-hero-title {
    font-size:32px; font-weight:800; color:#fff;
    letter-spacing:-0.5px; margin-bottom:8px;
    position:relative; z-index:1;
  }
  .results-hero-title span {
    background:linear-gradient(135deg,#818cf8,#a78bfa,#c4b5fd);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmer 3s linear infinite;
  }
  .results-hero-sub {
    font-size:14px; color:#64748b;
    position:relative; z-index:1;
    margin-bottom:28px;
  }

  .skills-used {
    display:flex; flex-wrap:wrap;
    gap:8px; justify-content:center;
    position:relative; z-index:1;
  }
  .skill-used-chip {
    font-size:12px; font-weight:500;
    padding:5px 14px; border-radius:20px;
    background:rgba(99,102,241,0.15);
    color:#818cf8;
    border:1px solid rgba(99,102,241,0.25);
    animation:slideIn 0.4s ease forwards;
    opacity:0;
  }

  .results-body {
    max-width:860px;
    margin:-36px auto 0;
    padding:0 24px 60px;
    position:relative;
    z-index:10;
  }

  .summary-strip {
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:12px;
    margin-bottom:24px;
  }
  .summary-box {
    background:#1E293B;
    border:1px solid #334155;
    border-radius:14px;
    padding:16px;
    text-align:center;
    animation:countUp 0.5s ease forwards;
    opacity:0;
    transition:all 0.2s;
  }
  .summary-box:hover { border-color:#6366f1; transform:translateY(-2px); }
  .summary-box:nth-child(1){animation-delay:0.1s}
  .summary-box:nth-child(2){animation-delay:0.2s}
  .summary-box:nth-child(3){animation-delay:0.3s}
  .summary-icon { font-size:24px; margin-bottom:6px; }
  .summary-val { font-size:22px; font-weight:800; color:#fff; margin-bottom:2px; }
  .summary-lbl { font-size:11px; color:#475569; font-weight:500; }

  .career-card {
    background:#1E293B;
    border-radius:20px;
    padding:28px;
    margin-bottom:20px;
    position:relative;
    overflow:hidden;
    animation:fadeIn 0.6s ease forwards;
    opacity:0;
    transition:all 0.3s;
  }
  .career-card:nth-child(1){animation-delay:0.2s}
  .career-card:nth-child(2){animation-delay:0.35s}
  .career-card:nth-child(3){animation-delay:0.5s}
  .career-card:hover { transform:translateY(-4px); }
  .career-card::before {
    content:'';
    position:absolute;
    top:0; left:0; right:0;
    height:4px;
    border-radius:20px 20px 0 0;
  }
  .career-card-glow {
    position:absolute;
    top:-60px; right:-60px;
    width:160px; height:160px;
    border-radius:50%;
    opacity:0.06;
    pointer-events:none;
  }

  .card-top {
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    margin-bottom:16px;
    gap:12px;
  }
  .card-top-left { display:flex; align-items:flex-start; gap:14px; flex:1; }
  .rank-badge {
    width:44px; height:44px; border-radius:14px;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:16px; font-weight:800;
    flex-shrink:0;
    animation:glow 2s ease-in-out infinite;
  }
  .career-title { font-size:20px; font-weight:800; color:#fff; margin-bottom:4px; letter-spacing:-0.3px; }
  .career-desc { font-size:13px; color:#64748b; line-height:1.6; }
  .match-label {
    font-size:11px; font-weight:700;
    padding:5px 12px; border-radius:10px;
    color:#fff; white-space:nowrap;
    flex-shrink:0;
  }

  .salary-row {
    display:flex; align-items:center; gap:10px;
    margin-bottom:16px;
    padding:12px 16px;
    background:#0F172A;
    border-radius:12px;
    border:1px solid #334155;
  }
  .salary-icon { font-size:18px; }
  .salary-label { font-size:11px; color:#475569; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }
  .salary-value { font-size:14px; font-weight:700; color:#10b981; margin-top:1px; }

  .matched-section { margin-bottom:16px; }
  .matched-title {
    font-size:11px; font-weight:700;
    color:#475569; text-transform:uppercase;
    letter-spacing:0.06em; margin-bottom:8px;
    display:flex; align-items:center; gap:6px;
  }
  .matched-chips { display:flex; flex-wrap:wrap; gap:6px; }
  .matched-chip {
    font-size:11px; font-weight:500;
    padding:4px 10px; border-radius:10px;
    background:rgba(99,102,241,0.1);
    color:#818cf8;
    border:1px solid rgba(99,102,241,0.2);
  }

  .roadmap-section {}
  .roadmap-title {
    font-size:11px; font-weight:700;
    color:#475569; text-transform:uppercase;
    letter-spacing:0.06em; margin-bottom:12px;
    display:flex; align-items:center; gap:6px;
  }
  .roadmap-steps { display:flex; flex-direction:column; gap:8px; }
  .roadmap-step {
    display:flex; align-items:center; gap:12px;
    padding:10px 14px;
    background:#0F172A;
    border-radius:10px;
    border:1px solid #1E293B;
    animation:slideIn 0.4s ease forwards;
    opacity:0;
    transition:all 0.2s;
  }
  .roadmap-step:hover { border-color:#334155; transform:translateX(4px); }
  .step-num {
    width:24px; height:24px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:11px; font-weight:700;
    flex-shrink:0;
  }
  .step-txt { font-size:13px; color:#94a3b8; font-weight:500; }
  .step-arrow { margin-left:auto; font-size:12px; color:#334155; }

  .bottom-actions {
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
    margin-top:8px;
    animation:fadeIn 0.5s ease 0.7s forwards;
    opacity:0;
  }
  .action-btn {
    padding:14px;
    border-radius:12px;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    font-family:'Inter',sans-serif;
    transition:all 0.2s;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    text-decoration:none;
    border:none;
    position:relative;
    overflow:hidden;
  }
  .action-btn::before {
    content:'';
    position:absolute;
    top:0; left:-100%; width:100%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);
    transition:left 0.4s;
  }
  .action-btn:hover::before { left:100%; }
  .action-btn:hover { transform:translateY(-2px); }
  .action-btn:active { transform:scale(0.97); }
  .action-btn-primary {
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    color:#fff;
    box-shadow:0 4px 20px rgba(99,102,241,0.4);
  }
  .action-btn-secondary {
    background:#1E293B;
    color:#94a3b8;
    border:1px solid #334155 !important;
  }
  .action-btn-secondary:hover { border-color:#6366f1 !important; color:#818cf8; }

  .congrats-banner {
    background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05));
    border:1px solid rgba(99,102,241,0.2);
    border-radius:14px;
    padding:18px 22px;
    margin-bottom:20px;
    display:flex;
    align-items:center;
    gap:14px;
    animation:fadeIn 0.5s ease 0.1s forwards;
    opacity:0;
  }
  .congrats-icon { font-size:32px; flex-shrink:0; animation:float 2s ease-in-out infinite; }
  .congrats-title { font-size:14px; font-weight:700; color:#818cf8; margin-bottom:3px; }
  .congrats-sub { font-size:12px; color:#475569; line-height:1.5; }
`;

export default function Results() {
  const [results, setResults] = useState([]);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem('results');
    const userSkills = localStorage.getItem('userSkills');
    if (!data) { navigate('/assessment'); return; }
    setResults(JSON.parse(data));
    setSkills(JSON.parse(userSkills || '[]'));
    setTimeout(() => {
      playReveal();
    }, 400);
  }, [navigate]);

  const getRoadmapDelay = (cardIdx, stepIdx) => ({
    animationDelay: `${0.3 + cardIdx * 0.15 + stepIdx * 0.08}s`
  });

  if (results.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', fontFamily: 'Inter,sans-serif' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #334155', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      <p style={{ color: '#475569', fontSize: '14px' }}>Loading your results...</p>
    </div>
  );

  return (
    <div className="results-page">
      <nav className="results-nav">
        <Link to="/dashboard" className="results-nav-logo" onClick={playClick}>
          <div className="results-logo-icon">🎓</div>
          <span className="results-logo-txt">CareerAI</span>
        </Link>
        <div className="nav-actions">
          <Link to="/assessment" className="nav-btn-outline" onClick={playClick}>
            ← Retake Assessment
          </Link>
          <Link to="/dashboard" className="nav-btn-outline" onClick={playClick}>
            🏠 Dashboard
          </Link>
        </div>
      </nav>

      <div className="results-hero">
        <div className="hero-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${1.5 + i * 0.2}s`,
              background: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'][i % 4]
            }}></div>
          ))}
        </div>
        <span className="results-trophy">🏆</span>
        <h1 className="results-hero-title">
          Your Career <span>Matches Found!</span>
        </h1>
        <p className="results-hero-sub">
          AI analysed your skills and found {results.length} perfect career paths for you
        </p>
        <div className="skills-used">
          {skills.map((s, i) => (
            <span key={s} className="skill-used-chip" style={{ animationDelay: `${i * 0.08}s` }}>
              ✓ {s}
            </span>
          ))}
        </div>
      </div>

      <div className="results-body">

        <div className="summary-strip">
          <div className="summary-box">
            <div className="summary-icon">🎯</div>
            <div className="summary-val">{results.length}</div>
            <div className="summary-lbl">Career Matches</div>
          </div>
          <div className="summary-box">
            <div className="summary-icon">⚡</div>
            <div className="summary-val">{skills.length}</div>
            <div className="summary-lbl">Skills Analysed</div>
          </div>
          <div className="summary-box">
            <div className="summary-icon">🗺️</div>
            <div className="summary-val">{results.reduce((a, r) => a + (r.roadmap?.length || 0), 0)}</div>
            <div className="summary-lbl">Roadmap Steps</div>
          </div>
        </div>

        <div className="congrats-banner">
          <span className="congrats-icon">🎉</span>
          <div>
            <div className="congrats-title">Congratulations! Your results are ready.</div>
            <div className="congrats-sub">
              Review your top career matches below. Each comes with a salary range and a step-by-step learning roadmap tailored for Pakistan's job market.
            </div>
          </div>
        </div>

        {results.map((career, index) => {
          const rank = rankColors[index] || rankColors[2];
          return (
            <div key={career.id || index} className="career-card" style={{ borderLeft: `4px solid ${rank.border}`, background: `linear-gradient(135deg,${rank.bg},#1E293B)` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: rank.badge, borderRadius: '20px 20px 0 0' }}></div>
              <div className="career-card-glow" style={{ background: rank.border }}></div>

              <div className="card-top">
                <div className="card-top-left">
                  <div className="rank-badge" style={{ background: rank.badge, boxShadow: `0 0 20px ${rank.glow}` }}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="career-title">{career.title}</div>
                    <div className="career-desc">{career.description}</div>
                  </div>
                </div>
                <div className="match-label" style={{ background: rank.badge }}>
                  {rank.label}
                </div>
              </div>

              <div className="salary-row">
                <span className="salary-icon">💰</span>
                <div>
                  <div className="salary-label">Monthly Salary Range</div>
                  <div className="salary-value">{career.salary}</div>
                </div>
              </div>

              {career.matchedSkills && career.matchedSkills.length > 0 && (
                <div className="matched-section">
                  <div className="matched-title">✓ Your matching skills</div>
                  <div className="matched-chips">
                    {career.matchedSkills.map(s => (
                      <span key={s} className="matched-chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="roadmap-section">
                <div className="roadmap-title">🗺️ Learning Roadmap</div>
                <div className="roadmap-steps">
                  {career.roadmap && career.roadmap.map((step, i) => (
                    <div
                      key={i}
                      className="roadmap-step"
                      style={getRoadmapDelay(index, i)}
                    >
                      <div className="step-num" style={{ background: rank.badge }}>
                        {i + 1}
                      </div>
                      <span className="step-txt">{step}</span>
                      <span className="step-arrow">→</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        <div className="bottom-actions">
          <Link to="/assessment" className="action-btn action-btn-primary" onClick={playClick}>
            🔄 Retake Assessment
          </Link>
          <Link to="/dashboard" className="action-btn action-btn-secondary" onClick={playClick}>
            🏠 Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}