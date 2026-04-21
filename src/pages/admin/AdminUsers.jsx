import { useState } from 'react';
import { MOCK_USERS } from '../../data/mockData';

export default function AdminUsers() {
  const [filter, setFilter] = useState('all');
  const users = filter === 'all' ? MOCK_USERS : MOCK_USERS.filter(u => u.role === filter);

  const ROLE_STYLE = {
    patient: { color:'#6366f1', bg:'rgba(99,102,241,0.15)', label:'مريض' },
    doctor:  { color:'#10b981', bg:'rgba(16,185,129,0.15)', label:'طبيب' },
    admin:   { color:'#f59e0b', bg:'rgba(245,158,11,0.15)', label:'أدمن' },
  };

  return (
    <div style={{ maxWidth:'800px' }}>
      <h1 style={{ fontSize:'1.8rem', fontWeight:700, color:'#fff', marginBottom:'0.4rem' }}>👥 المستخدمون</h1>
      <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:'1.5rem', fontSize:'0.9rem' }}>{MOCK_USERS.length} مستخدم</p>

      {/* Filter */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem' }}>
        {['all','patient','doctor','admin'].map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{ padding:'6px 16px', borderRadius:'99px', border:`1.5px solid ${filter===r ? '#6366f1' : 'rgba(255,255,255,0.12)'}`, background: filter===r ? 'rgba(99,102,241,0.2)' : 'transparent', color: filter===r ? '#fff' : 'rgba(255,255,255,0.5)', fontSize:'0.85rem', cursor:'pointer', transition:'all 0.15s' }}>
            {r === 'all' ? 'الكل' : ROLE_STYLE[r]?.label + 'ين'}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {users.map(u => {
          const rs = ROLE_STYLE[u.role];
          return (
            <div key={u.id} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'1rem 1.25rem', borderRadius:'14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background: rs?.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{u.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:'#fff', fontWeight:500 }}>{u.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>{u.email}</div>
                {u.specialty && <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem' }}>{u.specialty}</div>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                {u.rating && <span style={{ color:'#fbbf24', fontSize:'0.82rem' }}>⭐ {u.rating}</span>}
                {u.age && <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem' }}>{u.age} سنة</span>}
                <span style={{ padding:'3px 12px', borderRadius:'99px', background: rs?.bg, color: rs?.color, fontSize:'0.75rem', fontWeight:600 }}>{rs?.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
