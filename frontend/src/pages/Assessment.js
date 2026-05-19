import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '/api';

function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(500, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
  } catch (e) { }
}

function playSelect() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(800, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
  } catch (e) { }
}

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);
      o.start(ctx.currentTime + i * 0.08);
      o.stop(ctx.currentTime + i * 0.08 + 0.2);
    });
  } catch (e) { }
}

const skillCategories = [
  {
    category: '💻 Technology',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.1)',
    skills: ['Programming', 'Math', 'Problem-solving', 'Networking', 'Cybersecurity', 'Cloud Computing']
  },
  {
    category: '🎨 Creative',
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.1)',
    skills: ['Design', 'Creativity', 'Art', 'Video Editing', 'Photography', 'Animation']
  },
  {
    category: '📊 Business',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    skills: ['Marketing', 'Communication', 'Leadership', 'Sales', 'Finance', 'Management']
  },
  {
    category: '🔬 Analytical',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    skills: ['Research', 'Statistics', 'Analysis', 'Writing', 'Critical Thinking', 'Data']
  },
  {
    category: '🤝 Interpersonal',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    skills: ['Teamwork', 'Teaching', 'Counselling', 'Social Media', 'Networking', 'Public Speaking']
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .assess-page { min-height:100vh; background:#0F172A; font-family:'Inter',sans-serif; }

  @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes slideRight { from{width:0} to{width:100%} }

  .assess-nav {
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
  }
  .assess-nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .assess-logo-icon {
    width:36px; height:36px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:16px;
    animation:float 3s ease-in-out infinite;
    box-shadow:0 4px 12px rgba(99,102,241,0.4);
  }
  .assess-logo-txt { font-size:17px; font-weight:800; color:#fff; }
  .assess-back-btn {
    display:flex; align-items:center; gap:6px;
    padding:7px 14px;
    background:#0F172A;
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
  .assess-back-btn:hover { border-color:#6366f1; color:#818cf8; }

  .assess-hero {
    background:linear-gradient(135deg,#312e81 0%,#1e1b4b 50%,#0F172A 100%);
    padding:40px 32px 80px;
    text-align:center;
    position:relative;
    overflow:hidden;
  }
  .assess-hero::before {
    content:'';
    position:absolute;
    width:600px; height:600px;
    background:radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%);
    top:-200px; left:50%; transform:translateX(-50%);
    border-radius:50%;
  }
  .assess-hero-icon {
    font-size:52px;
    display:block;
    margin-bottom:16px;
    animation:float 3s ease-in-out infinite;
    position:relative; z-index:1;
  }
  .assess-hero-title {
    font-size:30px; font-weight:800; color:#fff;
    letter-spacing:-0.5px; margin-bottom:8px;
    position:relative; z-index:1;
  }
  .assess-hero-title span {
    background:linear-gradient(135deg,#818cf8,#a78bfa);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmer 3s linear infinite;
  }
  .assess-hero-sub {
    font-size:14px; color:#6366f1;
    position:relative; z-index:1;
    font-weight:500;
  }

  .assess-body {
    max-width:860px;
    margin:-40px auto 0;
    padding:0 24px 60px;
    position:relative;
    z-index:10;
  }

  .progress-card {
    background:#1E293B;
    border:1px solid #334155;
    border-radius:16px;
    padding:20px 24px;
    margin-bottom:20px;
    animation:fadeIn 0.5s ease;
  }
  .progress-top {
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:12px;
  }
  .progress-label { font-size:13px; font-weight:600; color:#94a3b8; }
  .progress-count {
    font-size:13px; font-weight:700; color:#6366f1;
    background:rgba(99,102,241,0.1);
    padding:3px 10px; border-radius:10px;
  }
  .progress-bar-bg {
    height:6px; background:#0F172A;
    border-radius:6px; overflow:hidden;
  }
  .progress-bar-fill {
    height:100%;
    background:linear-gradient(90deg,#6366f1,#8b5cf6);
    border-radius:6px;
    transition:width 0.4s ease;
    box-shadow:0 0 8px rgba(99,102,241,0.5);
  }

  .step-row {
    display:flex; align-items:center;
    gap:0; margin-bottom:24px;
  }
  .step-dot {
    width:32px; height:32px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; flex-shrink:0;
    transition:all 0.3s;
  }
  .step-dot.done { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; box-shadow:0 0 12px rgba(99,102,241,0.5); }
  .step-dot.active { background:#6366f1; color:#fff; box-shadow:0 0 16px rgba(99,102,241,0.6); animation:pulse 1.5s infinite; }
  .step-dot.idle { background:#1E293B; color:#475569; border:2px solid #334155; }
  .step-line { flex:1; height:2px; transition:background 0.3s; }
  .step-line.done { background:linear-gradient(90deg,#6366f1,#8b5cf6); }
  .step-line.idle { background:#334155; }
  .step-labels { display:flex; justify-content:space-between; margin-top:6px; margin-bottom:20px; }
  .step-lbl { font-size:10px; color:#475569; font-weight:600; text-align:center; width:32px; }
  .step-lbl.active { color:#818cf8; }

  .category-section {
    margin-bottom:20px;
    animation:fadeIn 0.4s ease forwards;
    opacity:0;
  }
  .category-section:nth-child(1){animation-delay:0.1s}
  .category-section:nth-child(2){animation-delay:0.2s}
  .category-section:nth-child(3){animation-delay:0.3s}
  .category-section:nth-child(4){animation-delay:0.4s}
  .category-section:nth-child(5){animation-delay:0.5s}

  .category-header {
    font-size:12px; font-weight:700;
    letter-spacing:0.06em;
    margin-bottom:10px;
    display:flex; align-items:center; gap:8px;
    padding:8px 12px;
    border-radius:8px;
  }
  .category-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }

  .skills-wrap { display:flex; flex-wrap:wrap; gap:8px; }

  .skill-chip {
    padding:8px 16px;
    border-radius:20px;
    border:1.5px solid #334155;
    background:#1E293B;
    color:#64748b;
    font-size:12px;
    font-weight:500;
    cursor:pointer;
    transition:all 0.2s;
    font-family:'Inter',sans-serif;
    position:relative;
    overflow:hidden;
  }
  .skill-chip::before {
    content:'';
    position:absolute;
    top:50%; left:50%;
    width:0; height:0;
    background:rgba(255,255,255,0.1);
    border-radius:50%;
    transform:translate(-50%,-50%);
    transition:width 0.4s, height 0.4s;
  }
  .skill-chip:hover { border-color:#475569; color:#94a3b8; transform:translateY(-1px); }
  .skill-chip:hover::before { width:200px; height:200px; }
  .skill-chip.selected {
    color:#fff;
    border-color:transparent;
    animation:popIn 0.2s ease;
    box-shadow:0 4px 12px rgba(0,0,0,0.3);
  }

  .bottom-bar {
    background:#1E293B;
    border:1px solid #334155;
    border-radius:16px;
    padding:20px 24px;
    margin-top:24px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    animation:fadeIn 0.5s ease 0.6s forwards;
    opacity:0;
    gap:16px;
  }
  .selected-info { display:flex; align-items:center; gap:10px; }
  .selected-count {
    font-size:28px; font-weight:800; color:#6366f1;
    line-height:1;
  }
  .selected-txt { font-size:12px; color:#64748b; font-weight:500; }
  .selected-min { font-size:11px; color:#334155; margin-top:2px; }

  .selected-chips { display:flex; flex-wrap:wrap; gap:6px; flex:1; }
  .sel-chip {
    font-size:11px; padding:3px 10px;
    border-radius:10px;
    background:rgba(99,102,241,0.15);
    color:#818cf8;
    border:1px solid rgba(99,102,241,0.2);
    font-weight:500;
  }

  .submit-btn {
    padding:13px 28px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border:none;
    border-radius:12px;
    color:#fff;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    font-family:'Inter',sans-serif;
    transition:all 0.2s;
    display:flex;
    align-items:center;
    gap:8px;
    white-space:nowrap;
    box-shadow:0 4px 20px rgba(99,102,241,0.4);
    position:relative;
    overflow:hidden;
    flex-shrink:0;
  }
  .submit-btn::before {
    content:'';
    position:absolute;
    top:0; left:-100%; width:100%; height:100%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
    transition:left 0.4s;
  }
  .submit-btn:hover::before { left:100%; }
  .submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(99,102,241,0.5); }
  .submit-btn:active { transform:scale(0.97); }
  .submit-btn:disabled { background:linear-gradient(135deg,#334155,#1E293B); cursor:not-allowed; transform:none; box-shadow:none; }
  .submit-btn:disabled::before { display:none; }

  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; }

  .tip-box {
    background:rgba(99,102,241,0.05);
    border:1px solid rgba(99,102,241,0.15);
    border-radius:12px;
    padding:14px 18px;
    margin-top:16px;
    font-size:12px;
    color:#64748b;
    display:flex;
    align-items:flex-start;
    gap:10px;
    line-height:1.6;
    animation:fadeIn 0.5s ease 0.7s forwards;
    opacity:0;
  }
  .tip-icon { font-size:16px; flex-shrink:0; }
`;

export default function Assessment() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter(s => s !== skill));
      playClick();
    } else {
      setSelected([...selected, skill]);
      playSelect();
    }
  };

  const handleSubmit = async () => {
    if (selected.length < 3) return;
    playSuccess();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/careers/recommend`, { skills: selected });
      localStorage.setItem('results', JSON.stringify(res.data));
      localStorage.setItem('userSkills', JSON.stringify(selected));
      setTimeout(() => navigate('/results'), 500);
    } catch (err) {
      alert('Make sure your backend server is running on port 5000.');
      setLoading(false);
    }
  };

  const totalSkills = skillCategories.reduce((acc, c) => acc + c.skills.length, 0);
  const progress = Math.min((selected.length / 5) * 100, 100);
  const step = selected.length === 0 ? 1 : selected.length < 3 ? 2 : 3;

  const getChipStyle = (skill, catColor) => {
    if (selected.includes(skill)) {
      return {
        background: `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
        borderColor: 'transparent',
        color: '#fff',
        boxShadow: `0 4px 12px ${catColor}40`,
      };
    }
    return {};
  };

  return (
    <div className="assess-page">
      <nav className="assess-nav">
        <Link to="/dashboard" className="assess-nav-logo" onClick={playClick}>
          <div className="assess-logo-icon">🎓</div>
          <span className="assess-logo-txt">CareerAI</span>
        </Link>
        <Link to="/dashboard" className="assess-back-btn" onClick={playClick}>
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="assess-hero">
        <span className="assess-hero-icon">🧠</span>
        <h1 className="assess-hero-title">
          Skills <span>Assessment</span>
        </h1>
        <p className="assess-hero-sub">
          Select your skills — our AI will find your perfect career matches
        </p>
      </div>

      <div className="assess-body">

        <div className="progress-card">
          <div className="progress-top">
            <span className="progress-label">Your Progress</span>
            <span className="progress-count">{selected.length} / {totalSkills} skills selected</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="step-row">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : 'idle'}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className={`step-line ${step > 1 ? 'done' : 'idle'}`}></div>
          <div className={`step-dot ${step >= 2 ? (step > 2 ? 'done' : 'active') : 'idle'}`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <div className={`step-line ${step > 2 ? 'done' : 'idle'}`}></div>
          <div className={`step-dot ${step >= 3 ? 'active' : 'idle'}`}>3</div>
        </div>
        <div className="step-labels">
          <span className={`step-lbl ${step === 1 ? 'active' : ''}`}>Start</span>
          <span className={`step-lbl ${step === 2 ? 'active' : ''}`}>Select</span>
          <span className={`step-lbl ${step === 3 ? 'active' : ''}`}>Done</span>
        </div>

        {skillCategories.map((cat) => (
          <div key={cat.category} className="category-section">
            <div className="category-header" style={{ background: cat.bg }}>
              <div className="category-dot" style={{ background: cat.color }}></div>
              <span style={{ color: cat.color, fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>
                {cat.category}
              </span>
            </div>
            <div className="skills-wrap">
              {cat.skills.map(skill => (
                <button
                  key={skill}
                  className={`skill-chip ${selected.includes(skill) ? 'selected' : ''}`}
                  style={getChipStyle(skill, cat.color)}
                  onClick={() => toggleSkill(skill)}
                >
                  {selected.includes(skill) ? '✓ ' : ''}{skill}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bottom-bar">
          <div className="selected-info">
            <div className="selected-count">{selected.length}</div>
            <div>
              <div className="selected-txt">Skills Selected</div>
              <div className="selected-min">
                {selected.length < 3 ? `Select ${3 - selected.length} more to continue` : '✓ Ready to get results!'}
              </div>
            </div>
          </div>

          <div className="selected-chips">
            {selected.slice(0, 5).map(s => (
              <span key={s} className="sel-chip">{s}</span>
            ))}
            {selected.length > 5 && (
              <span className="sel-chip">+{selected.length - 5} more</span>
            )}
          </div>

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={selected.length < 3 || loading}
          >
            {loading ? (
              <><div className="spinner"></div> Analysing...</>
            ) : (
              <>Get Career Matches →</>
            )}
          </button>
        </div>

        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <span>
            <strong style={{ color: '#818cf8' }}>Tip:</strong> Select skills from multiple categories for more accurate results.
            The more skills you select, the better your career matches will be!
          </span>
        </div>

      </div>
    </div>
  );
}