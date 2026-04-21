import { useState } from 'react';
import { useStore } from '../../store/store';

// ─── Medications ────────────────────────────────────────────────────
export function Medications() {
  const { currentUser, medications = [], addMedication, takeMedication } = useStore.getState
    ? (() => {
        const s = useStore();
        return { ...s, medications: s.medications || [], addMedication: s.addMedication || (() => {}), takeMedication: s.takeMedication || (() => {}) };
      })()
    : { currentUser: {}, medications: [] };

  const myMeds = (medications || []).filter(m => m.patientId === currentUser?.id);
  const [form, setForm] = useState({ name: '', dose: '', times: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  const inp = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'Tajawal,sans-serif', direction: 'rtl' };

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>💊 تذكير الأدوية</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>أدويتك ومواعيد جرعاتك</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '9px 18px', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>+ إضافة دواء</button>
      </div>

      {showForm && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>دواء جديد</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div><label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', display: 'block', marginBottom: '5px' }}>اسم الدواء</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="مثال: باراسيتامول" style={inp} /></div>
            <div><label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', display: 'block', marginBottom: '5px' }}>الجرعة</label><input value={form.dose} onChange={e => setForm(f => ({ ...f, dose: e.target.value }))} placeholder="مثال: ٥٠٠ملج" style={inp} /></div>
            <div><label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', display: 'block', marginBottom: '5px' }}>مواعيد الجرعة</label><input value={form.times} onChange={e => setForm(f => ({ ...f, times: e.target.value }))} placeholder="مثال: ٩ص، ٣م، ٩م" style={inp} /></div>
            <div><label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', display: 'block', marginBottom: '5px' }}>ملاحظات</label><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="مع الأكل مثلاً" style={inp} /></div>
          </div>
          <button onClick={() => {
            if (!form.name) return;
            useStore.getState().addMedication?.({ ...form, patientId: currentUser.id, id: Date.now().toString(), taken: {} });
            setForm({ name: '', dose: '', times: '', notes: '' }); setShowForm(false);
          }} style={{ padding: '9px 22px', borderRadius: '10px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>حفظ</button>
        </div>
      )}

      {myMeds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💊</div>
          <p>مفيش أدوية مضافة لسه</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myMeds.map(med => (
            <div key={med.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>💊</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#fff', fontWeight: 600 }}>{med.name} <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: '0.85rem' }}>({med.dose})</span></div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>🕐 {med.times}</div>
                {med.notes && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{med.notes}</div>}
              </div>
              <div style={{ padding: '5px 14px', borderRadius: '99px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>✅ نشط</div>
            </div>
          ))}
        </div>
      )}
      <style>{`input::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}

// ─── Sleep Tracker ───────────────────────────────────────────────────
export function SleepTracker() {
  const { currentUser, sleepLogs = [], addSleepLog } = (() => {
    const s = useStore();
    return { ...s, sleepLogs: s.sleepLogs || [], addSleepLog: s.addSleepLog || (() => {}) };
  })();

  const myLogs = (sleepLogs || []).filter(l => l.userId === currentUser?.id).slice(0, 14);
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState(3);
  const [saved, setSaved] = useState(false);

  const save = () => {
    useStore.getState().addSleepLog?.({ userId: currentUser.id, date: new Date().toISOString().slice(0, 10), hours, quality, id: Date.now().toString() });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const avgHours = myLogs.length ? (myLogs.reduce((s, l) => s + l.hours, 0) / myLogs.length).toFixed(1) : '—';
  const avgQuality = myLogs.length ? (myLogs.reduce((s, l) => s + l.quality, 0) / myLogs.length).toFixed(1) : '—';

  return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>😴 تتبع النوم</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>سجّل نومك يومياً — بيظهر في تقرير طبيبك</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[{ label: 'متوسط ساعات النوم', value: avgHours + 'س', icon: '🕐' }, { label: 'متوسط الجودة', value: avgQuality + '/5', icon: '⭐' }].map(k => (
          <div key={k.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{k.icon}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{k.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '3px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.95rem' }}>تسجيل نوم الليلة</h3>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', display: 'block', marginBottom: '8px' }}>عدد ساعات النوم: <strong style={{ color: '#fff' }}>{hours} ساعة</strong></label>
          <input type="range" min="1" max="12" step="0.5" value={hours} onChange={e => setHours(Number(e.target.value))} style={{ width: '100%', accentColor: '#6366f1' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '4px' }}><span>١ ساعة</span><span>١٢ ساعة</span></div>
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', display: 'block', marginBottom: '8px' }}>جودة النوم</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(q => (
              <button key={q} onClick={() => setQuality(q)} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: `1.5px solid ${quality >= q ? '#6366f1' : 'rgba(255,255,255,0.12)'}`, background: quality >= q ? 'rgba(99,102,241,0.25)' : 'transparent', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>
                {['😫', '😔', '😐', '😊', '😄'][q - 1]}
              </button>
            ))}
          </div>
        </div>
        <button onClick={save} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: 'none', background: saved ? '#10b981' : '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.9rem' }}>
          {saved ? '✅ تم الحفظ!' : 'حفظ تسجيل النوم'}
        </button>
      </div>

      {myLogs.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>آخر الأيام</h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '80px' }}>
            {myLogs.slice(0, 10).reverse().map((l, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', height: `${(l.hours / 12) * 70}px`, background: l.hours >= 7 ? '#10b981' : l.hours >= 5 ? '#f59e0b' : '#ef4444', borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{l.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Therapeutic Journal ─────────────────────────────────────────────
export function TherapeuticJournal() {
  const { currentUser, journalEntries = [], addJournalEntry } = (() => {
    const s = useStore();
    return { ...s, journalEntries: s.journalEntries || [], addJournalEntry: s.addJournalEntry || (() => {}) };
  })();

  const myEntries = (journalEntries || []).filter(e => e.userId === currentUser?.id);
  const [text, setText] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!text.trim()) return;
    useStore.getState().addJournalEntry?.({ userId: currentUser.id, text, isPrivate, date: new Date().toISOString(), id: Date.now().toString() });
    setText(''); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>📓 يوميتي العلاجية</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>مساحتك الخاصة — شارك مع طبيبك أو احتفظ لنفسك</p>

      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="ماذا تشعر اليوم؟ ما الذي يدور في ذهنك؟ لا حكم هنا، فقط اكتب بحرية..." rows={6}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'Tajawal,sans-serif', direction: 'rtl', lineHeight: 1.8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <button onClick={() => setIsPrivate(!isPrivate)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '99px', padding: '6px 14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.82rem' }}>
            {isPrivate ? '🔒 خاص' : '👁️ مشارك مع الطبيب'}
          </button>
          <button onClick={save} disabled={!text.trim()} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: saved ? '#10b981' : text.trim() ? '#6366f1' : 'rgba(255,255,255,0.08)', color: text.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600, cursor: text.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', fontSize: '0.9rem' }}>
            {saved ? '✅ محفوظ!' : 'حفظ ✍️'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {myEntries.slice(0, 10).map(e => (
          <div key={e.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                {new Date(e.date).toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <span style={{ fontSize: '0.72rem', color: e.isPrivate ? 'rgba(255,255,255,0.3)' : '#6366f1' }}>
                {e.isPrivate ? '🔒 خاص' : '👁️ مشارك'}
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7 }}>{e.text}</p>
          </div>
        ))}
      </div>
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.2)}`}</style>
    </div>
  );
}
