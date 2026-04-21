import { useStore } from '../../store/store';
import { MOCK_USERS } from '../../data/mockData';

export default function AdminDashboard() {
  const { appointments, moodHistory } = useStore();
  const doctors = MOCK_USERS.filter(u => u.role === 'doctor');
  const patients = MOCK_USERS.filter(u => u.role === 'patient');
  const totalMoods = Object.values(moodHistory).reduce((s, arr) => s + arr.length, 0);
  const confirmed = appointments.filter(a => a.status === 'confirmed').length;
  const pending = appointments.filter(a => a.status === 'pending').length;

  const card = (children, style={}) => (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'1.5rem', ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth:'960px' }}>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'4px' }}>🛡️ لوحة الإدارة</h1>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>نظرة كاملة على المنصة</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {[
          { label:'المرضى', value:patients.length, icon:'👥', color:'#6366f1' },
          { label:'الأطباء', value:doctors.length, icon:'🩺', color:'#10b981' },
          { label:'المواعيد', value:appointments.length, icon:'📅', color:'#f59e0b' },
          { label:'تسجيلات المزاج', value:totalMoods, icon:'🧠', color:'#8b5cf6' },
        ].map(k => (
          <div key={k.label} style={{ background:`${k.color}12`, border:`1px solid ${k.color}30`, borderRadius:'14px', padding:'1.25rem', textAlign:'center' }}>
            <div style={{ fontSize:'1.6rem', marginBottom:'4px' }}>{k.icon}</div>
            <div style={{ fontSize:'2rem', fontWeight:700, color:k.color }}>{k.value}</div>
            <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginTop:'2px' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem', marginBottom:'1.25rem' }}>
        {/* Doctors list */}
        {card(
          <div>
            <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1.2rem', fontSize:'1rem' }}>🩺 الأطباء</h2>
            {doctors.map(d => (
              <div key={d.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px', borderRadius:'10px', background:'rgba(255,255,255,0.03)', marginBottom:'8px' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>{d.avatar}</div>
                <div style={{ flex:1 }}>
                  <div style={{ color:'#fff', fontWeight:500, fontSize:'0.9rem' }}>{d.name}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.75rem' }}>{d.specialty} · {d.experience}</div>
                </div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ color:'#fbbf24', fontSize:'0.8rem' }}>⭐ {d.rating}</div>
                  <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.72rem' }}>{d.patients?.length || 0} مريض</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointments status */}
        {card(
          <div>
            <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1.2rem', fontSize:'1rem' }}>📊 حالة المواعيد</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'1.2rem' }}>
              {[
                { label:'مؤكدة', value:confirmed, color:'#10b981', pct: appointments.length ? Math.round(confirmed/appointments.length*100) : 0 },
                { label:'انتظار', value:pending, color:'#f59e0b', pct: appointments.length ? Math.round(pending/appointments.length*100) : 0 },
                { label:'ملغية', value:appointments.filter(a=>a.status==='cancelled').length, color:'#ef4444', pct: appointments.length ? Math.round(appointments.filter(a=>a.status==='cancelled').length/appointments.length*100) : 0 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                    <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>{s.label}</span>
                    <span style={{ color:s.color, fontWeight:600, fontSize:'0.85rem' }}>{s.value} ({s.pct}%)</span>
                  </div>
                  <div style={{ height:'6px', borderRadius:'99px', background:'rgba(255,255,255,0.08)' }}>
                    <div style={{ height:'100%', width:`${s.pct}%`, background:s.color, borderRadius:'99px', transition:'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.9rem', marginBottom:'0.8rem', marginTop:'1.2rem' }}>👥 المرضى</h3>
            {patients.map(p => {
              const doc = MOCK_USERS.find(u => u.id === p.doctorId);
              return (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px', borderRadius:'8px', background:'rgba(255,255,255,0.03)', marginBottom:'6px' }}>
                  <div style={{ fontSize:'1.1rem' }}>{p.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:500 }}>{p.name}</div>
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.72rem' }}>{doc ? `طبيب: ${doc.name}` : 'بدون طبيب'}</div>
                  </div>
                  <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.72rem' }}>{p.age} سنة</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* System stats */}
      {card(
        <div>
          <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1rem', fontSize:'1rem' }}>⚙️ إحصائيات المنصة</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
            {[
              { label:'نسبة تغطية الأطباء', value:`${Math.round((patients.filter(p=>p.doctorId).length/patients.length)*100)}%` },
              { label:'متوسط تقييم الأطباء', value: (doctors.reduce((s,d)=>s+d.rating,0)/doctors.length).toFixed(1) + '⭐' },
              { label:'إجمالي الرسائل', value: '٤+ محادثات' },
            ].map(s => (
              <div key={s.label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'12px', padding:'1rem', textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem', fontWeight:700, color:'#fff', marginBottom:'4px' }}>{s.value}</div>
                <div style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
