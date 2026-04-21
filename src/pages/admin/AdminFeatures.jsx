import { useState } from 'react';
import { useStore } from '../../store/store';
import { MOCK_USERS, MOOD_LABELS } from '../../data/mockData';

// ─── Admin Analytics ─────────────────────────────────────────────────
export function AdminAnalytics() {
  const { appointments, moodHistory } = useStore();
  const doctors = MOCK_USERS.filter(u => u.role === 'doctor');
  const patients = MOCK_USERS.filter(u => u.role === 'patient');

  const totalMoods = Object.values(moodHistory).flat();
  const moodDist = {};
  totalMoods.forEach(e => { moodDist[e.mood] = (moodDist[e.mood] || 0) + 1; });
  const topMoods = Object.entries(moodDist).sort((a, b) => b[1] - a[1]);

  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const pending = appointments.filter(a => a.status === 'pending').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  const kpis = [
    { label: 'إجمالي المستخدمين', value: MOCK_USERS.length, icon: '👥', color: '#6366f1', change: '+١٢٪' },
    { label: 'تسجيلات المزاج', value: totalMoods.length, icon: '🧠', color: '#8b5cf6', change: '+٢٨٪' },
    { label: 'نسبة تأكيد المواعيد', value: appointments.length ? `${Math.round(confirmed / appointments.length * 100)}٪` : '٠٪', icon: '📅', color: '#10b981', change: '+٥٪' },
    { label: 'متوسط تقييم الأطباء', value: (doctors.reduce((s, d) => s + d.rating, 0) / doctors.length).toFixed(1) + '⭐', icon: '🩺', color: '#f59e0b', change: 'ثابت' },
  ];

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>📊 أناليتكس المنصة</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>نظرة تحليلية شاملة</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background: `${k.color}12`, border: `1px solid ${k.color}30`, borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>{k.icon}</span>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>{k.change}</span>
            </div>
            <div style={{ fontSize: '1.7rem', fontWeight: 700, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Mood distribution */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>🧠 توزيع المزاج عبر المنصة</h2>
          {topMoods.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>لا بيانات</p> :
            topMoods.map(([mood, count]) => {
              const m = MOOD_LABELS[mood];
              const pct = Math.round(count / totalMoods.length * 100);
              return (
                <div key={mood} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{m?.emoji} {m?.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{count} ({pct}٪)</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.08)' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: m?.color || '#6366f1', borderRadius: '99px', transition: 'width 0.8s' }} />
                  </div>
                </div>
              );
            })
          }
        </div>

        {/* Appointments breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>📅 المواعيد</h2>
          {[{ label: 'مؤكدة', value: confirmed, color: '#10b981' }, { label: 'انتظار', value: pending, color: '#f59e0b' }, { label: 'ملغية', value: cancelled, color: '#ef4444' }].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', flex: 1 }}>{s.label}</span>
              <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
          <div style={{ marginTop: '1rem', display: 'flex', height: '12px', borderRadius: '99px', overflow: 'hidden', gap: '2px' }}>
            {[{ v: confirmed, c: '#10b981' }, { v: pending, c: '#f59e0b' }, { v: cancelled, c: '#ef4444' }].map((s, i) => (
              <div key={i} style={{ flex: s.v || 0, background: s.c, minWidth: s.v ? '4px' : 0, transition: 'flex 0.8s' }} />
            ))}
          </div>
        </div>

        {/* Top doctors */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>🏆 أعلى الأطباء تقييماً</h2>
          {[...doctors].sort((a, b) => b.rating - a.rating).map((d, i) => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : '#cd7c54', fontWeight: 700, fontSize: '0.9rem', width: '20px' }}>#{i + 1}</div>
              <div style={{ fontSize: '1.2rem' }}>{d.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 500 }}>{d.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{d.patients?.length || 0} مريض</div>
              </div>
              <div style={{ color: '#fbbf24', fontWeight: 700 }}>⭐ {d.rating}</div>
            </div>
          ))}
        </div>

        {/* Growth chart */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '1.5rem' }}>
          <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '1rem' }}>📈 نمو المنصة (محاكاة)</h2>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100px' }}>
            {[20, 35, 28, 50, 60, 45, 75, 90, 80, 110, 95, 130].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', height: `${(v / 130) * 85}px`, background: i === 11 ? '#6366f1' : 'rgba(99,102,241,0.35)', borderRadius: '3px 3px 0 0', transition: 'height 0.5s' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '6px' }}>
            <span>يناير</span><span>ديسمبر</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Audit Log ───────────────────────────────────────────────────────
export function AuditLog() {
  const { auditLog = [] } = (() => { const s = useStore(); return { ...s, auditLog: s.auditLog || [] }; })();

  const MOCK_LOG = [
    { id: 1, user: 'admin@demo.com', action: 'تسجيل دخول', detail: 'دخول ناجح', time: '2026-04-21T10:00:00', type: 'auth' },
    { id: 2, user: 'nora@demo.com', action: 'تأكيد موعد', detail: 'موعد ap1 تم تأكيده', time: '2026-04-21T09:45:00', type: 'appointment' },
    { id: 3, user: 'ahmed@demo.com', action: 'تسجيل مزاج', detail: 'مزاج: هادئ', time: '2026-04-21T09:30:00', type: 'mood' },
    { id: 4, user: 'sara@demo.com', action: 'إرسال رسالة', detail: 'محادثة مع د.نورا', time: '2026-04-21T09:15:00', type: 'chat' },
    { id: 5, user: 'karim@demo.com', action: 'تسجيل دخول', detail: 'دخول ناجح', time: '2026-04-21T09:00:00', type: 'auth' },
    { id: 6, user: 'ahmed@demo.com', action: 'حجز موعد', detail: 'موعد جديد مع د.نورا', time: '2026-04-20T18:30:00', type: 'appointment' },
    ...auditLog,
  ].sort((a, b) => new Date(b.time) - new Date(a.time));

  const TYPE_STYLE = {
    auth: { color: '#6366f1', bg: 'rgba(99,102,241,0.15)', icon: '🔐' },
    appointment: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '📅' },
    mood: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', icon: '🧠' },
    chat: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '💬' },
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>🗂️ سجل النشاط</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>كل عملية في المنصة مسجّلة</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {MOCK_LOG.map(log => {
          const ts = TYPE_STYLE[log.type] || TYPE_STYLE.auth;
          return (
            <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: ts.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{ts.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ color: '#fff', fontWeight: 500, fontSize: '0.9rem' }}>{log.action}</span>
                  <span style={{ padding: '1px 8px', borderRadius: '99px', background: ts.bg, color: ts.color, fontSize: '0.7rem' }}>{log.type}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{log.user} · {log.detail}</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', flexShrink: 0, textAlign: 'left' }}>
                {new Date(log.time).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Waiting List ────────────────────────────────────────────────────
export function WaitingList() {
  const { currentUser, waitingList = [], joinWaiting, leaveWaiting } = (() => {
    const s = useStore();
    return { ...s, waitingList: s.waitingList || [], joinWaiting: s.joinWaiting || (() => {}), leaveWaiting: s.leaveWaiting || (() => {}) };
  })();

  const doctors = MOCK_USERS.filter(u => u.role === 'doctor');
  const myWaiting = waitingList.filter(w => w.patientId === currentUser?.id);
  const [selected, setSelected] = useState('');

  const join = () => {
    if (!selected) return;
    useStore.getState().joinWaiting?.({ patientId: currentUser.id, doctorId: selected, date: new Date().toISOString(), id: Date.now().toString() });
    setSelected('');
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>⏳ قائمة الانتظار</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>سيُرسل لك إشعار فور توفر موعد</p>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>انضم لقائمة انتظار طبيب</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={selected} onChange={e => setSelected(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'Tajawal,sans-serif', direction: 'rtl' }}>
            <option value="">اختار طبيب...</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
          </select>
          <button onClick={join} disabled={!selected} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: selected ? '#6366f1' : 'rgba(255,255,255,0.08)', color: selected ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600, cursor: selected ? 'pointer' : 'not-allowed', fontSize: '0.9rem' }}>
            انضم
          </button>
        </div>
      </div>

      {myWaiting.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '4px' }}>قوائم انتظارك</h3>
          {myWaiting.map(w => {
            const doc = MOCK_USERS.find(u => u.id === w.doctorId);
            return (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem 1.25rem', borderRadius: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontSize: '1.3rem' }}>{doc?.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 500 }}>{doc?.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>في قائمة الانتظار منذ {new Date(w.date).toLocaleDateString('ar-EG')}</div>
                </div>
                <div style={{ padding: '4px 12px', borderRadius: '99px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600 }}>⏳ انتظار</div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`select option{background:#1a2035}`}</style>
    </div>
  );
}
