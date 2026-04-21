import { useState } from 'react';

// Simulated OTP — in production use real SMS/email service
export function useTwoFactor() {
  const [otp, setOtp] = useState(null);

  const sendOtp = (email) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(code);
    console.log(`[2FA] OTP for ${email}: ${code}`); // In prod: send via email/SMS
    return code;
  };

  const verifyOtp = (input) => input === otp;

  return { sendOtp, verifyOtp };
}

export function OTPScreen({ email, onVerified, onBack }) {
  const { sendOtp, verifyOtp } = useTwoFactor();
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);

  const handleSend = () => {
    const c = sendOtp(email);
    setGeneratedCode(c);
    setSent(true);
    setError('');
  };

  const handleVerify = () => {
    if (code === generatedCode) {
      onVerified();
    } else {
      setError('كود غلط — جرب تاني');
    }
  };

  const inp = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
    color: '#fff', fontSize: '1.2rem', outline: 'none', textAlign: 'center',
    letterSpacing: '0.3em', fontFamily: 'monospace', direction: 'ltr',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
      <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        التحقق بخطوتين
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        {sent ? `تم إرسال كود التحقق لـ ${email}` : `سنرسل كود التحقق لـ ${email}`}
      </p>

      {!sent ? (
        <button onClick={handleSend} style={{
          width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
          background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        }}>
          إرسال الكود 📨
        </button>
      ) : (
        <div>
          {generatedCode && (
            <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '1rem', color: '#a5b4fc', fontSize: '0.8rem' }}>
              🔑 كود التجربة (Demo فقط): <strong style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>{generatedCode}</strong>
            </div>
          )}
          <input
            value={code} onChange={e => setCode(e.target.value.slice(0, 6))}
            placeholder="000000" style={inp}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
          />
          {error && <p style={{ color: '#fca5a5', fontSize: '0.82rem', marginTop: '8px' }}>{error}</p>}
          <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
            <button onClick={onBack} style={{ flex: 1, padding: '11px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
              رجوع
            </button>
            <button onClick={handleVerify} style={{ flex: 2, padding: '11px', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              تحقق ✓
            </button>
          </div>
          <button onClick={handleSend} style={{ marginTop: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem' }}>
            🔄 إعادة الإرسال
          </button>
        </div>
      )}
    </div>
  );
}
