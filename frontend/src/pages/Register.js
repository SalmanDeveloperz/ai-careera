import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || '/api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || 'Registration failed. Try again.';
      setError(`${msg} (${API}/auth/register)`);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: '#fff', borderRadius: '24px',
        width: '100%', maxWidth: '420px',
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #7F77DD, #5a52b8)',
          padding: '36px 40px 28px', textAlign: 'center'
        }}>
          <div style={{
            width: '70px', height: '70px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '28px'
          }}>🚀</div>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '600', margin: '0 0 6px' }}>Join Career Counselling</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0 }}>Start your personalized career journey</p>
        </div>

        <div style={{ padding: '32px 40px 40px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 4px' }}>Create your account</h2>
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 24px' }}>Free forever. No credit card needed.</p>

          {error && (
            <div style={{
              background: '#fff0f0', border: '1px solid #ffcdd2',
              color: '#c62828', padding: '12px 16px',
              borderRadius: '10px', fontSize: '13px',
              marginBottom: '20px', display: 'flex',
              alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {[
              { label: 'Full Name', type: 'text', val: name, set: setName, ph: 'Your full name' },
              { label: 'Email Address', type: 'email', val: email, set: setEmail, ph: 'your@email.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: 'Min 6 characters' }
            ].map(field => (
              <div key={field.label} style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.ph}
                  value={field.val}
                  onChange={e => field.set(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #e8e8e8',
                    borderRadius: '12px', fontSize: '14px',
                    background: '#fafafa', transition: 'all 0.2s'
                  }}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #7F77DD, #5a52b8)',
                color: '#fff', border: 'none',
                borderRadius: '12px', fontSize: '15px',
                fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(127,119,221,0.4)',
                marginTop: '6px'
              }}
            >
              {loading ? '⏳ Creating account...' : 'Create My Account →'}
            </button>
          </form>

          <div style={{
            textAlign: 'center', marginTop: '24px',
            paddingTop: '24px', borderTop: '1px solid #f0f0f0'
          }}>
            <p style={{ fontSize: '13px', color: '#888' }}>
              Already have an account?{' '}
              <Link to="/" style={{ color: '#7F77DD', fontWeight: '600', textDecoration: 'none' }}>
                Login here →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;