import { useState } from 'react';
import { useStore } from '../../store/store';
import { MOOD_LABELS, ADVICE_BY_MOOD } from '../../data/mockData';

const MOODS = Object.entries(MOOD_LABELS).map(([id, d]) => ({ id, ...d }));

export default function AIAdvice() {
  const { currentUser, moodHistory } = useStore();
  const history = moodHistory[currentUser.id] || [];
  const lastMood = history[0]?.mood || null;
  const [activeMood, setActiveMood] = useState(lastMood);
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('mc_apikey') || '');
  const [showKey, setShowKey] = useState(false);

  const advice = ADVICE_BY_MOOD[activeMood] || [];
  const moodData = MOOD_LABELS[activeMood];

  const getAiAdvice = async () => {
    if (!activeMood) return;
    setLoading(true); setAiText('');
    const key = apiKey || localStorage.getItem('mc_apikey');
    if (!key) { setShowKey(true); setLoading(false); return; }
    localStorage.setItem('mc_apikey', key);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 400,
          messages: [{ role: 'user', content: `أنا مريض في منصة صحة نفسية ومزاجي دلوقتي "${moodData?.label}". اديني ٣ نصايح عملية ومخصصة لمزاجي ده. كل نصيحة في سطر منفصل. بالعربي وبشكل دافئ وداعم.` }],
        }),
      });
      const data = await res.json();
      setAiText(data.content?.[0]?.text || 'حصل خطأ، جرب تاني.');
    } catch { setAiText('تأكد من الـ API key وجرب تاني.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>🤖 نصايح AI</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>نصايح مخصصة حسب مزاجك</p>

      {/* Mood selector */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>إيه مزاجك دلوقتي؟</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {MOODS.map(m => (
            <button key={m.id} onClick={() => setActiveMood(m.id)} style={{ padding: '8px 16px', borderRadius: '99px', border: `1.5px solid ${activeMood === m.id ? m.color : 'rgba(255,255,255,0.12)'}`, background: activeMood === m.id ? m.color + '25' : 'transparent', color: '#fff', fontSize: '0.9rem', transition: 'all 0.15s', fontWeight: activeMood === m.id ? 600 : 400 }}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {activeMood && (
        <>
          {/* Static advice */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>
              {moodData?.emoji} نصايح لمزاج "{moodData?.label}"
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {advice.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: moodData?.color + '30', color: moodData?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{i+1}</div>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI advice */}
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>✨ نصايح Claude AI مخصصة</h2>
              <button onClick={() => setShowKey(!showKey)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>⚙️ API Key</button>
            </div>
            {showKey && (
              <div style={{ marginBottom: '1rem' }}>
                <input value={apiKey} onChange={e => setApiKey(e.target.value)} type="password" placeholder="sk-ant-..." style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', direction: 'ltr' }} />
              </div>
            )}
            {aiText ? (
              <div style={{ animation: 'fadeIn 0.4s ease' }}>
                {aiText.split('\n').filter(Boolean).map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', padding: '10px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)' }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700 }}>✦</span>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.6 }}>{line.replace(/^[\d\-\.\*]+\s*/, '')}</p>
                  </div>
                ))}
                <button onClick={getAiAdvice} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '4px' }}>🔄 نصايح جديدة</button>
              </div>
            ) : (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>Claude هيديك نصايح مخصصة جداً ليك حسب مزاجك</p>
                <button onClick={getAiAdvice} disabled={loading} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: loading ? 'rgba(139,92,246,0.3)' : '#8b5cf6', color: '#fff', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>
                  {loading ? '⏳ Claude بيفكر...' : '✨ اطلب نصيحة AI'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} input::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}
