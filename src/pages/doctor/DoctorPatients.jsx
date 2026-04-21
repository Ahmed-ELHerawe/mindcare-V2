import { useState } from 'react';
import { useStore } from '../../store/store';
import { MOOD_LABELS } from '../../data/mockData';

export default function DoctorPatients() {
  const { currentUser, getPatientsByDoctor, moodHistory, doctorNotes, saveNote } = useStore();
  const patients = getPatientsByDoctor(currentUser.id);
  const [selected, setSelected] = useState(patients[0]?.id || null);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const patient = patients.find(p => p.id === selected);
  const history = moodHistory[selected] || [];
  const savedNote = doctorNotes[selected] || '';

  const handleSaveNote = () => {
    saveNote(selected, note);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'1.5rem', maxWidth:'960px' }}>
      {/* Patient list */}
      <div>
        <h1 style={{ fontSize:'1.4rem', fontWeight:700, color:'#fff', marginBottom:'1.2rem' }}>👥 مرضاي</h1>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {patients.length === 0 ? <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>مفيش مرضى</p> :
            patients.map(p => {
              const lastMood = moodHistory[p.id]?.[0];
              const m = MOOD_LABELS[lastMood?.mood];
              const isActive = selected === p.id;
              return (
                <button key={p.id} onClick={() => { setSelected(p.id); setNote(doctorNotes[p.id] || ''); }} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px', borderRadius:'12px', border:`1.5px solid ${isActive ? '#6366f1' : 'rgba(255,255,255,0.06)'}`, background: isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)', textAlign:'right', cursor:'pointer', transition:'all 0.15s' }}>
                  <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{p.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:'#fff', fontWeight:500, fontSize:'0.85rem' }}>{p.name}</div>
                    {m && <div style={{ fontSize:'0.72rem', color:m.color }}>{m.emoji} {m.label}</div>}
                  </div>
                </button>
              );
            })
          }
        </div>
      </div>

      {/* Patient detail */}
      {patient ? (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'1.5rem' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem' }}>{patient.avatar}</div>
            <div>
              <h2 style={{ color:'#fff', fontWeight:700, fontSize:'1.3rem' }}>{patient.name}</h2>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem' }}>العمر: {patient.age} · {history.length} لحظة مسجّلة</p>
            </div>
          </div>

          {/* Mood history */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'1.25rem', marginBottom:'1.25rem' }}>
            <h3 style={{ color:'#fff', fontWeight:600, marginBottom:'1rem', fontSize:'0.95rem' }}>📈 سجل المزاج</h3>
            {history.length === 0 ? <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>لم يسجّل أي مزاج بعد</p> :
              <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {history.slice(0,7).map((h,i) => {
                  const m = MOOD_LABELS[h.mood];
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px', borderRadius:'10px', background:'rgba(255,255,255,0.03)' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:m?.color+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>{m?.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:500 }}>{m?.label}</div>
                        {h.note && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem' }}>{h.note}</div>}
                      </div>
                      <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem' }}>{h.date}</div>
                      <div style={{ display:'flex', gap:'2px' }}>
                        {Array.from({length:h.energy||1}).map((_,j) => <span key={j} style={{ color:'#f59e0b', fontSize:'0.7rem' }}>⚡</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          </div>

          {/* Doctor notes */}
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'1.25rem' }}>
            <h3 style={{ color:'#fff', fontWeight:600, marginBottom:'1rem', fontSize:'0.95rem' }}>📝 ملاحظاتي على المريض</h3>
            {savedNote && !note && <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'10px', marginBottom:'10px', color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', lineHeight:1.6 }}>{savedNote}</div>}
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="اكتب ملاحظاتك الطبية هنا..." rows={4} style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'0.9rem', resize:'none', outline:'none', fontFamily:'Tajawal,sans-serif', direction:'rtl', lineHeight:1.7 }} />
            <button onClick={handleSaveNote} style={{ marginTop:'10px', padding:'9px 22px', borderRadius:'10px', border:'none', background: noteSaved ? '#10b981' : '#6366f1', color:'#fff', fontWeight:600, fontSize:'0.9rem', transition:'all 0.3s' }}>
              {noteSaved ? '✅ تم الحفظ' : 'حفظ الملاحظات'}
            </button>
          </div>
        </div>
      ) : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.3)' }}>اختار مريض من القائمة</div>}
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}
