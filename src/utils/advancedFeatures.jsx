import { useState } from 'react';
import { useStore } from '../../store/store';
import { MOCK_USERS, MOOD_LABELS } from '../../data/mockData';

// ─── PDF Export ──────────────────────────────────────────────────────
export function exportPatientPDF(patient, history, notes) {
  const moodRows = (history || []).slice(0, 20).map(h => {
    const m = MOOD_LABELS[h.mood];
    return `<tr><td>${h.date}</td><td>${m?.emoji} ${m?.label}</td><td>${'⚡'.repeat(h.energy || 1)}</td><td>${h.note || '—'}</td></tr>`;
  }).join('');

  const html = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"/><title>تقرير ${patient.name}</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e;direction:rtl}
    h1{font-size:1.8rem;margin-bottom:4px;color:#1a1a2e}
    .subtitle{color:#666;margin-bottom:30px;font-size:0.9rem}
    .section{margin-bottom:24px}
    .section h2{font-size:1rem;color:#6366f1;margin-bottom:12px;border-bottom:2px solid #6366f1;padding-bottom:6px}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
    .info-item{background:#f8f9ff;border-radius:8px;padding:12px}
    .info-label{font-size:0.75rem;color:#888;margin-bottom:3px}
    .info-value{font-size:1rem;font-weight:600;color:#1a1a2e}
    table{width:100%;border-collapse:collapse;font-size:0.88rem}
    th{background:#6366f1;color:#fff;padding:8px 12px;text-align:right}
    td{padding:8px 12px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even)td{background:#f8f9ff}
    .notes{background:#fff8e7;border:1px solid #fbbf24;border-radius:8px;padding:16px;font-size:0.9rem;line-height:1.8}
    @media print{body{padding:20px}}
  </style></head><body>
  <h1>🧠 تقرير مريض — MindCare</h1>
  <p class="subtitle">تم التصدير: ${new Date().toLocaleDateString('ar-EG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
  <div class="info-grid">
    <div class="info-item"><div class="info-label">اسم المريض</div><div class="info-value">${patient.name}</div></div>
    <div class="info-item"><div class="info-label">العمر</div><div class="info-value">${patient.age} سنة</div></div>
    <div class="info-item"><div class="info-label">إجمالي التسجيلات</div><div class="info-value">${history?.length || 0} لحظة</div></div>
    <div class="info-item"><div class="info-label">البريد الإلكتروني</div><div class="info-value">${patient.email}</div></div>
  </div>
  ${notes ? `<div class="section"><h2>ملاحظات الطبيب</h2><div class="notes">${notes}</div></div>` : ''}
  <div class="section"><h2>سجل المزاج</h2>
    ${history?.length ? `<table><thead><tr><th>التاريخ</th><th>المزاج</th><th>الطاقة</th><th>ملاحظة</th></tr></thead><tbody>${moodRows}</tbody></table>` : '<p style="color:#888">لا توجد بيانات</p>'}
  </div>
  </body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 600);
}

// ─── Video Call (Mock) ────────────────────────────────────────────────
export function VideoCall({ doctorId, onEnd }) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [time, setTime] = useState(0);
  const doctor = MOCK_USERS.find(u => u.id === doctorId);

  useState(() => {
    const t = setInterval(() => setTime(s => s + 1), 1000);
    return () => clearInterval(t);
  });

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: '#0a0f1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Doctor video area */}
      <div style={{ width: '100%', maxWidth: '800px', aspectRatio: '16/9', background: 'linear-gradient(135deg,#1a2035,#0d1428)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{doctor?.avatar}</div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '1.2rem' }}>{doctor?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' }}>{doctor?.specialty}</div>
        </div>
        {/* Timer */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '99px', padding: '4px 12px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
          🔴 {fmt(time)}
        </div>
        {/* Self preview */}
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '120px', aspectRatio: '4/3', background: camOff ? '#1a2035' : 'linear-gradient(135deg,#2a3050,#1a2035)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
          {camOff ? <span style={{ fontSize: '1.5rem' }}>📷</span> : <span style={{ fontSize: '1.5rem' }}>🧑</span>}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {[
          { icon: muted ? '🔇' : '🎤', label: muted ? 'صوت' : 'كتم', action: () => setMuted(!muted), active: muted, color: '#6366f1' },
          { icon: camOff ? '📷' : '📹', label: camOff ? 'تشغيل' : 'إيقاف', action: () => setCamOff(!camOff), active: camOff, color: '#6366f1' },
          { icon: '🔴', label: 'إنهاء', action: onEnd, color: '#ef4444', end: true },
        ].map(btn => (
          <button key={btn.label} onClick={btn.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: btn.end ? '16px 32px' : '14px', borderRadius: '50%', border: 'none', background: btn.end ? '#ef4444' : btn.active ? btn.color : 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', width: btn.end ? 'auto' : '56px', height: btn.end ? 'auto' : '56px', fontSize: btn.end ? '1rem' : '1.3rem', fontWeight: btn.end ? 600 : 400, borderRadius: btn.end ? '99px' : '50%', transition: 'all 0.2s' }}>
            {btn.icon}
            {btn.end && <span style={{ fontSize: '0.9rem' }}>{btn.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Mood Prediction ─────────────────────────────────────────────────
export function MoodPrediction() {
  const { currentUser, moodHistory } = useStore();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = (moodHistory[currentUser?.id] || []).slice(0, 14);

  const predict = async () => {
    setLoading(true);
    const key = localStorage.getItem('mc_apikey');
    if (!key || history.length < 3) {
      setTimeout(() => {
        const moods = history.map(h => h.mood);
        const freq = {};
        moods.forEach(m => freq[m] = (freq[m] || 0) + 1);
        const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm';
        setPrediction({ mood: top, confidence: 72, tip: 'بناءً على باترن مزاجك الأخير، هذا توقع بسيط.' });
        setLoading(false);
      }, 1000);
      return;
    }
    try {
      const histText = history.map(h => `${h.date}: ${MOOD_LABELS[h.mood]?.label}`).join('\n');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 200,
          messages: [{ role: 'user', content: `بناءً على سجل مزاج هذا الشخص:\n${histText}\n\nتوقع مزاجه الأسبوع القادم. رد بـ JSON فقط:\n{"mood":"calm|radiant|melancholy|energetic|anxious|grateful","confidence":75,"tip":"نصيحة قصيرة"}` }],
        }),
      });
      const data = await res.json();
      const json = JSON.parse(data.content?.[0]?.text?.replace(/```json|```/g, '').trim() || '{}');
      setPrediction(json);
    } catch {
      setPrediction({ mood: 'calm', confidence: 60, tip: 'تعذر الحصول على توقع AI.' });
    }
    setLoading(false);
  };

  const predicted = prediction ? MOOD_LABELS[prediction.mood] : null;

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem' }}>
      <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem' }}>🔮 توقع مزاجك الأسبوع القادم</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
        بناءً على آخر {history.length} يوم مسجّل
      </p>

      {!prediction ? (
        <button onClick={predict} disabled={loading || history.length < 3}
          style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: history.length >= 3 ? '#8b5cf6' : 'rgba(255,255,255,0.08)', color: history.length >= 3 ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600, cursor: history.length >= 3 ? 'pointer' : 'not-allowed', fontSize: '0.9rem' }}>
          {loading ? '🔮 جاري التوقع...' : history.length < 3 ? 'سجّل ٣ أيام على الأقل' : '🔮 توقع مزاجي'}
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: predicted?.color + '25', border: `2px solid ${predicted?.color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>{predicted?.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '2px' }}>{predicted?.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '6px' }}>دقة التوقع: {prediction.confidence}٪</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>{prediction.tip}</div>
          </div>
          <button onClick={() => setPrediction(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem' }}>🔄</button>
        </div>
      )}
    </div>
  );
}
