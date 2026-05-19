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
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .dash-page { min-height:100vh; background:#0F172A; font-family:'Inter',sans-serif; }

  @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .dash-navbar {
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
    animation:fadeIn 0.5s ease;
  }

  .nav-logo { display:flex; align-items:center; gap:10px; }
  .nav-logo-icon {
    width:38px; height:38px;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:18px;
    animation:float 3s ease-in-out infinite;
    box-shadow:0 4px 16px rgba(99,102,241,0.4);
  }
  .nav-logo-text { font-size:18px; font-weight:800; color:#fff; letter-spacing:-0.5px; }
  .nav-logo-badge { font-size:9px; color:#818cf8; background:rgba(99,102,241,0.15); padding:1px 6px; border-radius:8px; margin-left:6px; animation:pulse 2s infinite; }

  .nav-right { display:flex; align-items:center; gap:16px; }
  .nav-bell {
    width:36px; height:36px; border-radius:10px;
    background:#0F172A; border:1px solid #334155;
    display:flex; align-items:center; justify-content:center;
    font-size:16px; cursor:pointer; transition:all 0.2s;
    position:relative;
  }
  .nav-bell:hover { border-color:#6366f1; background:rgba(99,102,241,0.1); }
  .notif-dot {
    position:absolute; top:6px; right:6px;
    width:8px; height:8px; border-radius:50%;
    background:#ef4444; border:2px solid #1E293B;
  }
  .nav-avatar {
    width:36px; height:36px; border-radius:50%;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:13px; font-weight:700;
    box-shadow:0 0 0 3px rgba(99,102,241,0.3);
    cursor:pointer;
  }
  .nav-name { font-size:13px; color:#94a3b8; font-weight:500; }
  .nav-logout {
    padding:7px 16px;
    background:transparent;
    border:1px solid #334155;
    border-radius:8px;
    color:#94a3b8;
    font-size:12px;
    font-weight:600;
    cursor:pointer;
    font-family:'Inter',sans-serif;
    transition:all 0.2s;
  }
  .nav-logout:hover { border-color:#ef4444; color:#ef4444; background:rgba(239,68,68,0.1); }

  .dash-hero {
    background:linear-gradient(135deg,#1E293B 0%,#0F172A 100%);
    padding:40px 32px 64px;
    border-bottom:1px solid #334155;
    position:relative;
    overflow:hidden;
    animation:fadeIn 0.6s ease;
  }
  .dash-hero::before {
    content:'';
    position:absolute;
    width:500px; height:500px;
    background:radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%);
    top:-200px; right:-100px; border-radius:50%;
  }
  .dash-hero::after {
    content:'';
    position:absolute;
    width:300px; height:300px;
    background:radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%);
    bottom:-100px; left:200px; border-radius:50%;
  }
  .hero-inner { max-width:900px; margin:0 auto; position:relative; z-index:1; }
  .hero-greeting { font-size:13px; color:#6366f1; font-weight:600; margin-bottom:8px; letter-spacing:0.05em; }
  .hero-name { font-size:32px; font-weight:800; color:#fff; letter-spacing:-1px; margin-bottom:6px; }
  .hero-name span {
    background:linear-gradient(135deg,#6366f1,#a78bfa);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmer 3s linear infinite;
  }
  .hero-sub { font-size:14px; color:#64748b; margin-bottom:32px; }

  .stats-strip {
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:16px;
  }
  .stat-box {
    background:rgba(255,255,255,0.03);
    border:1px solid #334155;
    border-radius:14px;
    padding:16px 20px;
    animation:countUp 0.6s ease forwards;
    opacity:0;
    transition:all 0.2s;
    cursor:default;
  }
  .stat-box:hover { border-color:#6366f1; background:rgba(99,102,241,0.05); transform:translateY(-2px); }
  .stat-box:nth-child(1){animation-delay:0.1s}
  .stat-box:nth-child(2){animation-delay:0.2s}
  .stat-box:nth-child(3){animation-delay:0.3s}
  .stat-box:nth-child(4){animation-delay:0.4s}
  .stat-icon { font-size:20px; margin-bottom:8px; }
  .stat-val { font-size:22px; font-weight:800; color:#fff; margin-bottom:2px; }
  .stat-key { font-size:11px; color:#475569; font-weight:500; }

  .dash-body { max-width:900px; margin:-24px auto 0; padding:0 32px 48px; position:relative; z-index:10; }

  .section-title {
    font-size:13px; font-weight:700;
    color:#64748b; text-transform:uppercase;
    letter-spacing:0.08em; margin-bottom:16px;
    display:flex; align-items:center; gap:8px;
  }
  .section-title::after { content:''; flex:1; height:1px; background:#1E293B; }

  .cards-grid {
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:16px;
    margin-bottom:32px;
  }

  .action-card {
    background:#1E293B;
    border:1px solid #334155;
    border-radius:16px;
    padding:24px;
    text-decoration:none;
    display:block;
    transition:all 0.25s;
    animation:fadeIn 0.5s ease forwards;
    opacity:0;
    position:relative;
    overflow:hidden;
  }
  .action-card::before {
    content:'';
    position:absolute;
    top:0; left:0; right:0;
    height:3px;
    border-radius:16px 16px 0 0;
    transition:all 0.3s;
  }
  .action-card:nth-child(1){animation-delay:0.2s} .action-card:nth-child(1)::before{background:linear-gradient(90deg,#6366f1,#8b5cf6)}
  .action-card:nth-child(2){animation-delay:0.3s} .action-card:nth-child(2)::before{background:linear-gradient(90deg,#10b981,#059669)}
  .action-card:nth-child(3){animation-delay:0.4s} .action-card:nth-child(3)::before{background:linear-gradient(90deg,#f59e0b,#d97706)}

  .action-card:hover { transform:translateY(-4px); border-color:#475569; box-shadow:0 12px 40px rgba(0,0,0,0.3); }
  .action-card:active { transform:scale(0.98); }

  .card-icon-box {
    width:48px; height:48px; border-radius:14px;
    display:flex; align-items:center; justify-content:center;
    font-size:22px; margin-bottom:16px;
  }
  .card-ttl { font-size:15px; font-weight:700; color:#fff; margin-bottom:8px; }
  .card-dsc { font-size:12px; color:#64748b; line-height:1.7; margin-bottom:16px; }
  .card-arrow {
    font-size:12px; font-weight:700;
    display:flex; align-items:center; gap:4px;
    transition:gap 0.2s;
  }
  .action-card:hover .card-arrow { gap:8px; }

  .profile-box {
    background:#1E293B;
    border:1px solid #334155;
    border-radius:16px;
    padding:24px;
    animation:fadeIn 0.5s ease 0.5s forwards;
    opacity:0;
  }
  .profile-header { display:flex; align-items:center; gap:14px; margin-bottom:20px; }
  .profile-avatar {
    width:52px; height:52px; border-radius:50%;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:18px; font-weight:800;
    box-shadow:0 0 0 4px rgba(99,102,241,0.2);
  }
  .profile-name { font-size:16px; font-weight:700; color:#fff; margin-bottom:3px; }
  .profile-email { font-size:12px; color:#64748b; }
  .active-badge {
    margin-left:auto;
    font-size:11px; font-weight:600;
    color:#10b981;
    background:rgba(16,185,129,0.1);
    border:1px solid rgba(16,185,129,0.3);
    padding:4px 12px; border-radius:20px;
    animation:pulse 2s infinite;
  }
  .profile-row {
    display:flex; justify-content:space-between; align-items:center;
    padding:12px 0; border-bottom:1px solid #1E293B;
  }
  .profile-row:last-child { border-bottom:none; }
  .profile-lbl { font-size:12px; color:#475569; display:flex; align-items:center; gap:6px; }
  .profile-val { font-size:12px; color:#94a3b8; font-weight:500; }

  .quick-tips {
    background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05));
    border:1px solid rgba(99,102,241,0.2);
    border-radius:16px;
    padding:20px 24px;
    margin-top:16px;
    animation:fadeIn 0.5s ease 0.6s forwards;
    opacity:0;
  }
  .tips-title { font-size:13px; font-weight:700; color:#818cf8; margin-bottom:12px; display:flex; align-items:center; gap:6px; }
  .tip-item { font-size:12px; color:#64748b; padding:4px 0; display:flex; align-items:flex-start; gap:8px; line-height:1.6; }
  .tip-dot { width:5px; height:5px; border-radius:50%; background:#6366f1; flex-shrink:0; margin-top:6px; }
`;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = document.createElement('style');
    el.innerHTML = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/'); return; }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    playClick();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return (
    <div style={{minHeight:'100vh',background:'#0F172A',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px',fontFamily:'Inter,sans-serif'}}>
      <div style={{width:'40px',height:'40px',border:'3px solid #334155',borderTopColor:'#6366f1',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}></div>
      <p style={{color:'#475569',fontSize:'14px'}}>Loading your dashboard...</p>
    </div>
  );

  const cards = [
    {
      icon: '📝', title: 'Skills Assessment',
      desc: 'Answer questions about your skills to get AI-powered career recommendations.',
      link: '/assessment', btn: 'Start Assessment', color: '#6366f1',
      iconBg: 'rgba(99,102,241,0.15)'
    },
    {
      icon: '🎯', title: 'Career Results',
      desc: 'View your top career matches with detailed roadmaps and Pakistan salary data.',
      link: '/results', btn: 'View Results', color: '#10b981',
      iconBg: 'rgba(16,185,129,0.15)'
    },
    {
      icon: '💬', title: 'AI Chatbot',
      desc: 'Chat with our AI career counsellor anytime for personalized guidance.',
      link: '/chatbot', btn: 'Open Chatbot', color: '#f59e0b',
      iconBg: 'rgba(245,158,11,0.15)'
    },
  ];

  const stats = [
    { icon: '🎯', val: '8+', key: 'Career Paths' },
    { icon: '🧠', val: 'AI', key: 'Powered Engine' },
    { icon: '📈', val: '100%', key: 'Personalized' },
    { icon: '🆓', val: 'Free', key: 'Forever' },
  ];

  return (
    <div className="dash-page">
      <nav className="dash-navbar">
        <div className="nav-logo">
          <div className="nav-logo-icon">🎓</div>
          <span className="nav-logo-text">CareerAI</span>
          <span className="nav-logo-badge">✦ AI Powered</span>
        </div>
        <div className="nav-right">
          <div className="nav-bell" onClick={playClick}>
            🔔
            <div className="notif-dot"></div>
          </div>
          <div className="nav-avatar">{getInitials(user.name)}</div>
          <span className="nav-name">{user.name}</span>
          <button className="nav-logout" onClick={handleLogout}>Logout →</button>
        </div>
      </nav>

      <div className="dash-hero">
        <div className="hero-inner">
          <div className="hero-greeting">✦ WELCOME BACK</div>
          <div className="hero-name">Hello, <span>{user.name.split(' ')[0]}!</span> 👋</div>
          <div className="hero-sub">Ready to explore your career opportunities today?</div>
          <div className="stats-strip">
            {stats.map(s => (
              <div className="stat-box" key={s.key}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-key">{s.key}</div>
              </div>
            ))}
          </div>
        </div>
      </div>



      <Link to="/chatbot"></Link>

      

      <div className="dash-body">
        <div className="section-title">Quick Actions</div>
        <div className="cards-grid">
          {cards.map(card => (
            <Link
              key={card.title}
              to={card.link}
              className="action-card"
              onClick={playClick}
            >
              <div className="card-icon-box" style={{background: card.iconBg}}>
                {card.icon}
              </div>
              <div className="card-ttl">{card.title}</div>
              <div className="card-dsc">{card.desc}</div>
              <div className="card-arrow" style={{color: card.color}}>
                {card.btn} →
              </div>
            </Link>
          ))}
        </div>

        <div className="section-title">Your Profile</div>
        <div className="profile-box">
          <div className="profile-header">
            <div className="profile-avatar">{getInitials(user.name)}</div>
            <div>
              <div className="profile-name">{user.name}</div>
              <div className="profile-email">{user.email}</div>
            </div>
            <div className="active-badge">● Active</div>
          </div>
          {[
            { icon: '👤', lbl: 'Full Name', val: user.name },
            { icon: '✉️', lbl: 'Email Address', val: user.email },
            { icon: '🔐', lbl: 'Account Type', val: 'Student' },
            { icon: '📅', lbl: 'Member Since', val: new Date().toLocaleDateString('en-PK', {year:'numeric',month:'long'}) },
          ].map(row => (
            <div className="profile-row" key={row.lbl}>
              <span className="profile-lbl">{row.icon} {row.lbl}</span>
              <span className="profile-val">{row.val}</span>
            </div>
          ))}
        </div>

        <div className="quick-tips">
          <div className="tips-title">💡 Career Tips for You</div>
          <div className="tip-item"><div className="tip-dot"></div>Complete the Skills Assessment to get your personalized career recommendations.</div>
          <div className="tip-item"><div className="tip-dot"></div>Pakistan's tech industry is growing fast — software and data careers pay PKR 80,000–400,000/month.</div>
          <div className="tip-item"><div className="tip-dot"></div>Use the AI Chatbot to ask any career question — available 24/7 for you.</div>
        </div>
      </div>
    </div>
  );
}