import React, { useState } from 'react';
import { verifyPassword, setAuthed } from '@/auth/gate';

export default function FamilyLogin({ onAuthed }) {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verifyPassword(pwd)) {
      setAuthed();
      setError('');
      onAuthed?.();
    } else {
      setError('密码不正确');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <form onSubmit={handleSubmit} style={{ background: '#111827', padding: '32px', borderRadius: '12px', width: '320px', boxShadow: '0 10px 40px rgba(0,0,0,0.35)' }}>
        <h2 style={{ color: 'white', marginBottom: '16px', textAlign: 'center' }}>Family Access</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="输入家庭口令"
            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #1f2937', background: '#0b1221', color: 'white' }}
          />
          {error && <div style={{ color: '#f87171', fontSize: '12px' }}>{error}</div>}
          <button
            type="submit"
            style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}
          >
            进入
          </button>
        </div>
      </form>
    </div>
  );
}
