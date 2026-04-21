import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';
import { MOOD_LABELS } from '../../data/mockData';

export default function DoctorDashboard() {
  const { currentUser, getPatientsByDoctor, appointments, moodHistory } = useStore();
  const navigate = useNavigate();
  const patients = getPatientsByDoctor(currentUser.id);
  const myAppts = appointments.filter(a => a.doctorId === currentUser.id);
  const todayAppts = myAppts.filter(a => a.date === new Date().toISOString().slice(0,10) && a.status !== 'cancelled');
  const pending = myAppts.filter(a => a.status === 'pending');

  const card = (children, style={}) => (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'1.5rem', ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth:'960px' }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'4px' }}>أهلاً {currentUser.name} {currentUser.avatar}</h1>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>{currentUser.specialty}</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'مرضاي', value:patients.length, icon:'👥', color:'#6366f1' },
          { label:'مواعيد اليوم', value:todayAppts.length, icon:'📅', color:'#10b981' },
          { label:'طلبات جديدة', value:pending.length, icon:'⏳', color:'#f59e0b' },
          { label:'إجمالي المواعيد', value:myAppts.length, icon:'📊', color:'#8b5cf6' },
        ].map(k => (
          <div key={k.label} style={{ background:`${k.color}12`, border:`1px solid ${k.color}30`, borderRadius:'14px', padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontSize:'1.6rem', marginBottom:'4px' }}>{k.icon}</div>
            <div style={{ fontSize:'1.8rem', fontWeight:700, color:k.color }}>{k.value}</div>
            <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginTop:'2px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        {/* Patients mood status */}
        {card(
          <div>
            <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1.2rem', fontSize:'1rem' }}>👥 حالة مرضاي</h2>
            {patients.length === 0 ? <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.9rem' }}>مفيش مرضى لسه</p> :
              patients.map(p => {
                const history = moodHistory[p.id] || [];
                const lastMood = history[0];
                const m = MOOD_LABELS[lastMood?.mood];
                return (
                  <div key={p.id} onClick={() => navigate(`/doctor/patients`)} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px', borderRadius:'12px', background:'rgba(255,255,255,0.03)', marginBottom:'8px', cursor:'pointer', transition:'background 0.15s' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>{p.avatar}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ color:'#fff', fontWeight:500, fontSize:'0.9rem' }}>{p.name}</div>
                      <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem' }}>آخر تسجيل: {lastMood?.date || 'لم يسجل بعد'}</div>
                    </div>
                    {m && <div style={{ padding:'3px 10px', borderRadius:'99px', background:m.color+'20', color:m.color, fontSize:'0.8rem' }}>{m.emoji} {m.label}</div>}
                  </div>
                );
              })
            }
          </div>
        )}

        {/* Pending requests */}
        {card(
          <div>
            <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1.2rem', fontSize:'1rem' }}>⏳ طلبات تأكيد</h2>
            {pending.length === 0 ? <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.9rem' }}>مفيش طلبات جديدة</p> :
              pending.map(apt => {
                const { updateAppointment } = useStore.getState();
                return (
                  <div key={apt.id} style={{ padding:'12px', borderRadius:'12px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', marginBottom:'8px' }}>
                    <div style={{ color:'#fff', fontWeight:500, fontSize:'0.9rem', marginBottom:'2px' }}>{apt.date} · {apt.time}</div>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', marginBottom:'8px' }}>{apt.notes || 'بدون ملاحظات'}</div>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={() => updateAppointment(apt.id, {status:'confirmed'})} style={{ padding:'5px 12px', borderRadius:'8px', border:'none', background:'#10b981', color:'#fff', fontSize:'0.78rem', fontWeight:600 }}>✅ تأكيد</button>
                      <button onClick={() => updateAppointment(apt.id, {status:'cancelled'})} style={{ padding:'5px 12px', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.3)', background:'transparent', color:'#fca5a5', fontSize:'0.78rem' }}>رفض</button>
                    </div>
                  </div>
                );
              })
            }
          </div>
        )}

        {/* Today's schedule */}
        {card(
          <div>
            <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1.2rem', fontSize:'1rem' }}>📅 جدول اليوم</h2>
            {todayAppts.length === 0 ? <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.9rem' }}>مفيش مواعيد اليوم 🎉</p> :
              todayAppts.map(apt => (
                <div key={apt.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px', borderRadius:'10px', background:'rgba(16,185,129,0.08)', marginBottom:'8px' }}>
                  <div style={{ color:'#10b981', fontWeight:700, fontSize:'1rem' }}>{apt.time}</div>
                  <div style={{ flex:1, color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>{apt.notes || 'جلسة متابعة'}</div>
                </div>
              ))
            }
          </div>
        , { gridColumn:'span 2' })}
      </div>
    </div>
  );
}
