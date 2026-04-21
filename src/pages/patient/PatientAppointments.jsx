import { useState } from 'react';
import { useStore } from '../../store/store';
import { MOCK_USERS } from '../../data/mockData';

export default function PatientAppointments() {
  const { currentUser, appointments, addAppointment, cancelAppointment } = useStore();
  const myAppts = appointments.filter(a => a.patientId === currentUser.id);
  const doctors = MOCK_USERS.filter(u => u.role === 'doctor');
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', notes: '' });
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const STATUS = { confirmed: { label: 'مؤكد', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }, pending: { label: 'انتظار', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' }, cancelled: { label: 'ملغي', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' } };

  const submit = () => {
    if (!form.doctorId || !form.date || !form.time) return;
    addAppointment({ ...form, patientId: currentUser.id, status: 'pending' });
    setSaved(true); setShowForm(false);
    setTimeout(() => setSaved(false), 2500);
    setForm({ doctorId:'', date:'', time:'', notes:'' });
  };

  const inp = { width:'100%', padding:'10px 14px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'0.9rem', outline:'none', fontFamily:'Tajawal,sans-serif', direction:'rtl' };

  return (
    <div style={{ maxWidth: '720px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'4px' }}>📅 مواعيدي</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.9rem' }}>{myAppts.filter(a=>a.status!=='cancelled').length} موعد نشط</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:'10px 20px', borderRadius:'12px', border:'none', background:'#6366f1', color:'#fff', fontWeight:600, fontSize:'0.9rem' }}>
          + حجز موعد جديد
        </button>
      </div>

      {saved && <div style={{ background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'12px', padding:'12px 16px', color:'#10b981', marginBottom:'1rem', fontSize:'0.9rem' }}>✅ تم إرسال طلب الحجز! سيتم تأكيده من الطبيب.</div>}

      {showForm && (
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'16px', padding:'1.5rem', marginBottom:'1.5rem' }}>
          <h2 style={{ color:'#fff', fontWeight:600, marginBottom:'1.2rem', fontSize:'1rem' }}>حجز موعد جديد</h2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            <div>
              <label style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', display:'block', marginBottom:'6px' }}>الطبيب</label>
              <select value={form.doctorId} onChange={e => setForm(f=>({...f,doctorId:e.target.value}))} style={{ ...inp }}>
                <option value="">اختار طبيب</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', display:'block', marginBottom:'6px' }}>التاريخ</label>
              <input type="date" value={form.date} onChange={e => setForm(f=>({...f,date:e.target.value}))} style={inp} />
            </div>
            <div>
              <label style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', display:'block', marginBottom:'6px' }}>الوقت</label>
              <input type="time" value={form.time} onChange={e => setForm(f=>({...f,time:e.target.value}))} style={inp} />
            </div>
            <div>
              <label style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8rem', display:'block', marginBottom:'6px' }}>ملاحظات</label>
              <input value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} placeholder="اختياري" style={inp} />
            </div>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={submit} style={{ padding:'10px 24px', borderRadius:'10px', border:'none', background:'#6366f1', color:'#fff', fontWeight:600, fontSize:'0.9rem' }}>تأكيد الحجز</button>
            <button onClick={() => setShowForm(false)} style={{ padding:'10px 20px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:'rgba(255,255,255,0.6)', fontSize:'0.9rem' }}>إلغاء</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {myAppts.length === 0 ? (
          <div style={{ textAlign:'center', padding:'3rem', color:'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>📭</div>
            <p>مفيش مواعيد لسه</p>
          </div>
        ) : myAppts.map(apt => {
          const doc = MOCK_USERS.find(u => u.id === apt.doctorId);
          const st = STATUS[apt.status] || STATUS.pending;
          return (
            <div key={apt.id} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{doc?.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:'#fff', fontWeight:600, fontSize:'0.95rem' }}>{doc?.name}</div>
                <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem' }}>{apt.date} · {apt.time}</div>
                {apt.notes && <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem', marginTop:'2px' }}>{apt.notes}</div>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <span style={{ padding:'4px 12px', borderRadius:'99px', background:st.bg, color:st.color, fontSize:'0.78rem', fontWeight:600 }}>{st.label}</span>
                {apt.status !== 'cancelled' && (
                  <button onClick={() => cancelAppointment(apt.id)} style={{ padding:'4px 10px', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.1)', color:'#fca5a5', fontSize:'0.75rem', cursor:'pointer' }}>إلغاء</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`input::placeholder{color:rgba(255,255,255,0.25)} select option{background:#1a2035}`}</style>
    </div>
  );
}
