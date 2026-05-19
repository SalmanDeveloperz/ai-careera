import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '/api';

function playClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.setValueAtTime(600, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.2);
  } catch (e) { }
}

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
      o.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + i * 0.1 + 0.2);
    });
  } catch (e) { }
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body { font-family: 'Inter', sans-serif !important; }

  .login-page {
    min-height: 100vh;
    background: #0F172A;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Inter', sans-serif;
  }

  @keyframes fadeInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .login-left {
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    animation: fadeInLeft 0.8s ease forwards;
    position: relative;
    overflow: hidden;
  }

  .login-left::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
    top: -100px;
    left: -100px;
    border-radius: 50%;
  }

  .login-left::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
    bottom: -50px;
    right: -50px;
    border-radius: 50%;
  }

  .logo-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 52px;
    position: relative;
    z-index: 1;
  }

  .logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    animation: float 3s ease-in-out infinite;
    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
  }

  .logo-info { display: flex; flex-direction: column; }

  .logo-name {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .logo-badge {
    font-size: 10px;
    color: #818cf8;
    background: rgba(99,102,241,0.15);
    padding: 2px 8px;
    border-radius: 10px;
    margin-top: 3px;
    width: fit-content;
    animation: pulse 2s ease infinite;
  }

  .hero-text {
    font-size: 38px;
    font-weight: 800;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 18px;
    letter-spacing: -1px;
    position: relative;
    z-index: 1;
  }

  .hero-gradient {
    background: linear-gradient(135deg, #6366f1, #a78bfa, #818cf8);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .hero-sub {
    font-size: 14px;
    color: #64748b;
    line-height: 1.8;
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
    max-width: 360px;
  }

  .stats-row {
    display: flex;
    gap: 32px;
    position: relative;
    z-index: 1;
  }

  .stat-item { text-align: center; }

  .stat-num {
    font-size: 24px;
    font-weight: 800;
    color: #6366f1;
    display: block;
  }

  .stat-lbl {
    font-size: 11px;
    color: #475569;
    margin-top: 2px;
    display: block;
  }

  .features-list {
    margin-bottom: 40px;
    position: relative;
    z-index: 1;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-size: 13px;
    color: #94a3b8;
    animation: slideUp 0.5s ease forwards;
    opacity: 0;
  }

  .feature-item:nth-child(1) { animation-delay: 0.3s; }
  .feature-item:nth-child(2) { animation-delay: 0.5s; }
  .feature-item:nth-child(3) { animation-delay: 0.7s; }

  .feature-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6366f1;
    flex-shrink: 0;
  }

  .login-right {
    background: #1E293B;
    padding: 48px 52px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    animation: fadeInRight 0.8s ease forwards;
    border-left: 1px solid #334155;
  }

  .form-heading {
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 6px;
    letter-spacing: -0.5px;
  }

  .form-subheading {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 32px;
  }

  .error-box {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    color: #fca5a5;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideUp 0.3s ease;
  }

  .field-group { margin-bottom: 20px; }

  .field-lbl {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .field-wrap {
    position: relative;
  }

  .field-ico {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: #475569;
    pointer-events: none;
  }

  .field-input {
    width: 100%;
    padding: 13px 14px 13px 44px;
    background: #0F172A;
    border: 1.5px solid #334155;
    border-radius: 12px;
    color: #fff;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    outline: none;
  }

  .field-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.15);
    background: #0a1020;
  }

  .field-input::placeholder { color: #475569; }

  .eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #475569;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    transition: color 0.2s;
  }

  .eye-btn:hover { color: #94a3b8; }

  .login-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
    position: relative;
    overflow: hidden;
    margin-top: 8px;
  }

  .login-btn::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transition: left 0.4s;
  }

  .login-btn:hover::before { left: 100%; }
  .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(99,102,241,0.5); }
  .login-btn:active { transform: scale(0.98); }
  .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }

  .divider-line { flex: 1; height: 1px; background: #334155; }
  .divider-text { font-size: 12px; color: #475569; }

  .register-link {
    text-align: center;
    font-size: 13px;
    color: #64748b;
  }

  .register-link a {
    color: #818cf8;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
  }

  .register-link a:hover { color: #a78bfa; }

  @media (max-width: 768px) {
    .login-page { grid-template-columns: 1fr; }
    .login-left { display: none; }
    .login-right { padding: 40px 28px; }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      playSuccess();
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || 'Login failed. Check your credentials.';
      setError(`${msg} (${API}/auth/login)`);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="logo-row">
          <div className="logo-icon">🎓</div>
          <div className="logo-info">
            <span className="logo-name">CareerAI</span>
            <span className="logo-badge">✦ AI Powered Career Guidance</span>
          </div>
        </div>

        <h1 className="hero-text">
          Shape Your Future<br />
          Career <span className="hero-gradient">With Intelligence</span>
        </h1>

        <p className="hero-sub">
          Discover your perfect career path using AI-powered skill analysis,
          personalized roadmaps, and real job market insights tailored for you.
        </p>

        <div className="features-list">
          <div className="feature-item">
            <div className="feature-dot"></div>
            AI-powered career recommendations based on your skills
          </div>
          <div className="feature-item">
            <div className="feature-dot"></div>
            Step-by-step learning roadmaps from beginner to expert
          </div>
          <div className="feature-item">
            <div className="feature-dot"></div>
            Real salary data and job market insights for Pakistan
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-num">8+</span>
            <span className="stat-lbl">Career Paths</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">AI</span>
            <span className="stat-lbl">Powered</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">Free</span>
            <span className="stat-lbl">Forever</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <h2 className="form-heading">Welcome Back 👋</h2>
        <p className="form-subheading">Login to continue your professional journey</p>

        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-lbl">Email Address</label>
            <div className="field-wrap">
              <span className="field-ico">✉️</span>
              <input
                className="field-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-lbl">Password</label>
            <div className="field-wrap">
              <span className="field-ico">🔒</span>
              <input
                className="field-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => { playClick(); setShowPass(!showPass); }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <><div className="spinner"></div> Logging in...</>
            ) : (
              <>Login to My Account →</>
            )}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <div className="register-link">
          Don't have an account?{' '}
          <Link to="/register" onClick={playClick}>
            Create one free →
          </Link>
        </div>
      </div>
    </div>
  );
}