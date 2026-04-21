import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { MOOD_LABELS, MOCK_USERS } from '../../data/mockData';

const MOODS = Object.entries(MOOD_LABELS).map(([id, d]) => ({ id, ...d }));

export default function PatientHome() {
  const { currentUser, moodHistory, addMoodEntry, appointments } = useStore();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const history = moodHistory[currentUser.id] || [];
  const todayMood = history[0]?.date === new Date().toDateString().slice(0,10) ? history[0] : null;
  const myDoctor = MOCK_USERS.find(u => u.id === currentUser.doctorId);
  const myAppts = appointments.filter(a => a.patientId === currentUser.id && a.status !== 'cancelled');
  const nextAppt = myAppts.sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  const saveMood = () => {
    if (!selectedMood) return;
    addMoodEntry(currentUser.id, { date: new Date().toISOString().slice(0,10), mood: selectedMood, note, energy: 3 });
    setSaved(true);
    setTimeout(() => { setSaved(false); setSelectedMood(null); setNote(''); }, 2000);
  };

  const card = (children, style = {}) => (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem', ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
          أهلاً {currentUser.name.split(' ')[0]} {currentUser.avatar}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('ar-EG', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Mood Logger */}
        {card(
          <div>
            <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>
              {todayMood ? `مزاجك اليوم: ${MOOD_LABELS[todayMood.mood]?.emoji} ${MOOD_LABELS[todayMood.mood]?.label}` : '🧠 كيف مزاجك دلوقتي؟'}
            </h2>
            {saved ? (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#10b981', fontSize: '1.1rem' }}>✅ تم الحفظ!</div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                  {MOODS.map(m => (
                    <button key={m.id} onClick={() => setSelectedMood(m.id)} style={{ padding: '6px 12px', borderRadius: '99px', border: `1.5px solid ${selectedMood === m.id ? m.color : 'rgba(255,255,255,0.15)'}`, background: selectedMood === m.id ? m.color + '30' : 'transparent', color: '#fff', fontSize: '0.85rem', transition: 'all 0.15s' }}>
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="ملاحظة سريعة... (اختياري)" rows={2} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', resize: 'none', outline: 'none', fontFamily: 'Tajawal,sans-serif', direction: 'rtl' }} />
                <button onClick={saveMood} disabled={!selectedMood} style={{ marginTop: '10px', width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: selectedMood ? '#6366f1' : 'rgba(255,255,255,0.08)', color: selectedMood ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600, transition: 'all 0.2s', fontSize: '0.9rem' }}>
                  حفظ المزاج
                </button>
              </>
            )}
          </div>
        )}

        {/* Doctor info */}
        {card(
          <div>
            <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>🩺 طبيبك</h2>
            {myDoctor ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{myDoctor.avatar}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>{myDoctor.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{myDoctor.specialty}</div>
                    <div style={{ color: '#fbbf24', fontSize: '0.8rem' }}>⭐ {myDoctor.rating}</div>
                  </div>
                </div>
                <button onClick={() => navigate('/patient/chat')} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                  💬 ابدأ محادثة
                </button>
              </div>
            ) : (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', fontSize: '0.9rem' }}>ما عندكش طبيب لسه</p>
                <button onClick={() => navigate('/patient/doctors')} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
                  ابحث عن طبيب
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Next appointment */}
        {card(
          <div>
            <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.8rem', fontSize: '0.95rem' }}>📅 الموعد القادم</h2>
            {nextAppt ? (
              <div>
                <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '1.1rem' }}>{nextAppt.date}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>الساعة {nextAppt.time}</div>
                <div style={{ marginTop: '8px', padding: '4px 10px', borderRadius: '99px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '0.75rem', display: 'inline-block' }}>
                  {nextAppt.status === 'confirmed' ? '✅ مؤكد' : '⏳ انتظار'}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '8px' }}>مفيش مواعيد</p>
                <button onClick={() => navigate('/patient/appointments')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '0.8rem' }}>احجز الآن</button>
              </div>
            )}
          </div>
        )}

        {/* Streak */}
        {card(
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{history.length}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>لحظة مسجّلة</div>
          </div>
        )}

        {/* Quick advice */}
        {card(
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🤖</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>نصايح AI</div>
            <button onClick={() => navigate('/patient/advice')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: '#fff', fontSize: '0.8rem' }}>اطلع عليها</button>
          </div>
        )}
      </div>

      {/* Mood history */}
      {card(
        <div>
          <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>📈 آخر الأيام</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {history.slice(0,7).map((h,i) => {
              const m = MOOD_LABELS[h.mood];
              return (
                <div key={i} style={{ textAlign: 'center', padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', minWidth: '60px' }}>
                  <div style={{ fontSize: '1.3rem' }}>{m?.emoji}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{h.date.slice(5)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}
