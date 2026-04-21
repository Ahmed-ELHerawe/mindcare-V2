import { useStore } from '../../store/store';
import { MOOD_LABELS, MOCK_USERS } from '../../data/mockData';

// ─── Doctor Reports ───────────────────────────────────────────────
export function DoctorReports() {
  const { currentUser, getPatientsByDoctor, moodHistory } = useStore();
  const patients = getPatientsByDoctor(currentUser.id);

  return (
    <div style={{ maxWidth:'800px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'0.4rem' }}>📋 التقارير</h1>
      <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'2rem', fontSize:'0.9rem' }}>تقرير أسبوعي لكل مريض</p>

      {patients.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>📭</div>
          <p>مفيش مرضى لسه</p>
        </div>
      )}

      {patients.map(p => {
        const history = moodHistory[p.id] || [];
        const moodCount = {};
        history.forEach(h => { moodCount[h.mood] = (moodCount[h.mood] || 0) + 1; });
        const topMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];
        const avgEnergy = history.length
          ? (history.reduce((s, h) => s + (h.energy || 3), 0) / history.length).toFixed(1)
          : '—';

        return (
          <div key={p.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'1.5rem', marginBottom:'1.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.2rem' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>{p.avatar}</div>
              <div>
                <div style={{ color:'#fff', fontWeight:600 }}>{p.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>{history.length} تسجيل · متوسط طاقة {avgEnergy}⚡</div>
              </div>
              {topMood && (
                <div style={{ marginRight:'auto', padding:'4px 14px', borderRadius:'99px', background: MOOD_LABELS[topMood[0]]?.color + '20', color: MOOD_LABELS[topMood[0]]?.color, fontSize:'0.82rem', fontWeight:600 }}>
                  الأكثر: {MOOD_LABELS[topMood[0]]?.emoji} {MOOD_LABELS[topMood[0]]?.label}
                </div>
              )}
            </div>

            {history.length === 0 ? (
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.85rem' }}>لم يسجل أي مزاج بعد</p>
            ) : (
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                {history.slice(0, 14).map((h, i) => {
                  const m = MOOD_LABELS[h.mood];
                  return (
                    <div key={i} title={`${h.date}: ${m?.label}`} style={{ width:'38px', height:'38px', borderRadius:'50%', background: m?.color + '25', border:`1.5px solid ${m?.color}60`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>
                      {m?.emoji}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Patient Mood History ─────────────────────────────────────────
export function PatientMood() {
  const { currentUser, moodHistory } = useStore();
  const history = moodHistory[currentUser.id] || [];

  return (
    <div style={{ maxWidth:'700px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'0.4rem' }}>🧠 سجل مزاجي</h1>
      <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'2rem', fontSize:'0.9rem' }}>{history.length} لحظة مسجّلة</p>

      {history.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🌱</div>
          <p>لم تسجل أي مزاج بعد — ابدأ من الصفحة الرئيسية!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {history.map((h, i) => {
            const m = MOOD_LABELS[h.mood];
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'1rem 1.25rem', borderRadius:'14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'50%', background: m?.color + '20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{m?.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:'#fff', fontWeight:500 }}>{m?.label}</div>
                  {h.note && <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', marginTop:'2px' }}>{h.note}</div>}
                </div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>{h.date}</div>
                  <div style={{ color:'#f59e0b', fontSize:'0.75rem' }}>{'⚡'.repeat(h.energy || 1)}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Doctor Appointments ──────────────────────────────────────────
export function DoctorAppointments() {
  const { currentUser, appointments, updateAppointment } = useStore();
  const myAppts = appointments.filter(a => a.doctorId === currentUser.id);

  const STATUS = {
    confirmed: { label:'مؤكد', color:'#10b981', bg:'rgba(16,185,129,0.15)' },
    pending:   { label:'انتظار', color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
    cancelled: { label:'ملغي', color:'#ef4444', bg:'rgba(239,68,68,0.15)' },
  };

  return (
    <div style={{ maxWidth:'720px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'0.4rem' }}>📅 مواعيدي</h1>
      <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'2rem', fontSize:'0.9rem' }}>{myAppts.length} موعد</p>

      {myAppts.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>📭</div>
          <p>مفيش مواعيد لسه</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {myAppts.map(apt => {
          const patient = MOCK_USERS.find(u => u.id === apt.patientId);
          const st = STATUS[apt.status] || STATUS.pending;
          return (
            <div key={apt.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ fontSize:'1.5rem' }}>{patient?.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:'#fff', fontWeight:500 }}>{patient?.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>{apt.date} · {apt.time}</div>
                {apt.notes && <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem' }}>{apt.notes}</div>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ padding:'4px 12px', borderRadius:'99px', background:st.bg, color:st.color, fontSize:'0.78rem', fontWeight:600 }}>{st.label}</span>
                {apt.status === 'pending' && (
                  <>
                    <button onClick={() => updateAppointment(apt.id, { status:'confirmed' })} style={{ padding:'4px 10px', borderRadius:'8px', border:'none', background:'#10b981', color:'#fff', fontSize:'0.75rem', fontWeight:600, cursor:'pointer' }}>✅ تأكيد</button>
                    <button onClick={() => updateAppointment(apt.id, { status:'cancelled' })} style={{ padding:'4px 10px', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.3)', background:'transparent', color:'#fca5a5', fontSize:'0.75rem', cursor:'pointer' }}>رفض</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
