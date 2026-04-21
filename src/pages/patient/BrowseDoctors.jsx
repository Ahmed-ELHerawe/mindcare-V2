import { useStore } from '../../store/store';
import { MOCK_USERS } from '../../data/mockData';

export default function BrowseDoctors() {
  const { currentUser } = useStore();
  const doctors = MOCK_USERS.filter(u => u.role === 'doctor');
  const myDoctor = currentUser.doctorId;

  return (
    <div style={{ maxWidth:'700px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'0.4rem' }}>🩺 الأطباء المتاحون</h1>
      <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'2rem', fontSize:'0.9rem' }}>{doctors.length} طبيب وطبيبة في المنصة</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {doctors.map(d => {
          const isMine = d.id === myDoctor;
          return (
            <div key={d.id} style={{ background:'rgba(255,255,255,0.04)', border:`1.5px solid ${isMine ? '#10b981' : 'rgba(255,255,255,0.07)'}`, borderRadius:'16px', padding:'1.5rem', display:'flex', gap:'1.25rem', alignItems:'center' }}>
              <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'rgba(16,185,129,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{d.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' }}>
                  <span style={{ color:'#fff', fontWeight:700, fontSize:'1rem' }}>{d.name}</span>
                  {isMine && <span style={{ padding:'2px 10px', borderRadius:'99px', background:'rgba(16,185,129,0.2)', color:'#10b981', fontSize:'0.72rem', fontWeight:600 }}>طبيبي</span>}
                </div>
                <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', marginBottom:'4px' }}>{d.specialty}</div>
                <div style={{ display:'flex', gap:'12px', fontSize:'0.8rem' }}>
                  <span style={{ color:'#fbbf24' }}>⭐ {d.rating}</span>
                  <span style={{ color:'rgba(255,255,255,0.4)' }}>👥 {d.patients?.length || 0} مريض</span>
                  <span style={{ color:'rgba(255,255,255,0.4)' }}>🕐 {d.experience}</span>
                </div>
              </div>
              <button style={{ padding:'10px 20px', borderRadius:'12px', border:'none', background: isMine ? '#10b981' : '#6366f1', color:'#fff', fontWeight:600, fontSize:'0.85rem', flexShrink:0 }}>
                {isMine ? '✅ طبيبي' : 'طلب جلسة'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
