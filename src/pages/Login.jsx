import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { OTPScreen } from '../components/shared/TwoFactor';

const DEMO = [
  { label: 'مريض', email: 'ahmed@demo.com', password: '123', color: '#6366f1', icon: '👨' },
  { label: 'طبيبة', email: 'nora@demo.com', password: '123', color: '#10b981', icon: '👩‍⚕️' },
  { label: 'أدمن', email: 'admin@demo.com', password: 'admin123', color: '#f59e0b', icon: '🛡️' },
];

export default function Login() {
  const { login, confirmLogin, pendingUser } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 500));
    const res = login(email, password);
    setLoading(false);
    if (res.ok) setShow2FA(true);
    else setError(res.error);
  };

  const on2FAVerified = () => {
    confirmLogin();
    navigate(`/${pendingUser.role}`);
  };

  const inp = { width:'100%', padding:'12px 16px', borderRadius:'12px', border:'1.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.06)', color:'#fff', fontSize:'1rem', outline:'none', direction:'rtl', fontFamily:'Tajawal,sans-serif' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0a0f1e 0%,#0d1f3c 50%,#0a0f1e 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ position:'fixed', top:'-100px', right:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-100px', left:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:'420px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'3rem', marginBottom:'0.5rem' }}>🧠</div>
          <h1 style={{ fontFamily:'"Playfair Display",serif', fontSize:'2rem', color:'#fff', marginBottom:'0.4rem' }}>MindCare</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>منصة الصحة النفسية</p>
        </div>

        {show2FA ? (
          <div style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', borderRadius:'20px', padding:'2rem', border:'1px solid rgba(255,255,255,0.08)' }}>
            <OTPScreen email={email} onVerified={on2FAVerified} onBack={() => setShow2FA(false)} />
          </div>
        ) : (
          <>
            <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem' }}>
              {DEMO.map(d => (
                <button key={d.label} onClick={() => { setEmail(d.email); setPassword(d.password); }} style={{ flex:1, padding:'10px 6px', borderRadius:'12px', border:`1.5px solid ${d.color}40`, background:`${d.color}15`, color:'#fff', fontSize:'0.8rem', cursor:'pointer', transition:'all 0.2s' }}>
                  <div style={{ fontSize:'1.2rem', marginBottom:'2px' }}>{d.icon}</div>
                  <div style={{ fontSize:'0.75rem', color:d.color, fontWeight:600 }}>{d.label}</div>
                </button>
              ))}
            </div>
            <form onSubmit={submit} style={{ background:'rgba(255,255,255,0.04)', backdropFilter:'blur(20px)', borderRadius:'20px', padding:'2rem', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ marginBottom:'1rem' }}>
                <label style={{ display:'block', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', marginBottom:'6px' }}>البريد الإلكتروني</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@demo.com" style={inp} required />
              </div>
              <div style={{ marginBottom:'1.5rem' }}>
                <label style={{ display:'block', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', marginBottom:'6px' }}>كلمة المرور</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••" style={inp} required />
              </div>
              {error && <p style={{ color:'#fca5a5', fontSize:'0.85rem', marginBottom:'1rem', textAlign:'center' }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:'12px', border:'none', background:loading?'rgba(99,102,241,0.5)':'#6366f1', color:'#fff', fontSize:'1rem', fontWeight:700, cursor:'pointer', transition:'all 0.2s' }}>
                {loading ? '⏳ جاري الدخول...' : 'دخول →'}
              </button>
            </form>
            <p style={{ textAlign:'center', marginTop:'1rem', color:'rgba(255,255,255,0.3)', fontSize:'0.78rem' }}>اضغط على أي زر أعلاه للدخول السريع</p>
          </>
        )}
      </div>
      <style>{`input::placeholder{color:rgba(255,255,255,0.25)} input:focus{border-color:rgba(99,102,241,0.6)!important}`}</style>
    </div>
  );
}
