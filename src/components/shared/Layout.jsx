import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/store';

const PATIENT_LINKS = [
  { to:'/patient',              label:'الرئيسية',      icon:'🏠' },
  { to:'/patient/mood',         label:'سجل المزاج',    icon:'🧠' },
  { to:'/patient/chat',         label:'محادثاتي',      icon:'💬' },
  { to:'/patient/appointments', label:'مواعيدي',       icon:'📅' },
  { to:'/patient/advice',       label:'نصايح AI',      icon:'🤖' },
  { to:'/patient/cbt',          label:'تمارين CBT',    icon:'🧘' },
  { to:'/patient/questionnaire',label:'استبيانات',     icon:'📋' },
  { to:'/patient/medications',  label:'الأدوية',       icon:'💊' },
  { to:'/patient/sleep',        label:'تتبع النوم',    icon:'😴' },
  { to:'/patient/journal',      label:'يوميتي',        icon:'📓' },
  { to:'/patient/achievements', label:'إنجازاتي',      icon:'🏆' },
  { to:'/patient/doctors',      label:'الأطباء',       icon:'🩺' },
  { to:'/patient/waiting',      label:'قائمة انتظار',  icon:'⏳' },
  { to:'/patient/settings',     label:'الإعدادات',     icon:'⚙️' },
];

const DOCTOR_LINKS = [
  { to:'/doctor',              label:'الداشبورد', icon:'📊' },
  { to:'/doctor/patients',     label:'مرضاي',     icon:'👥' },
  { to:'/doctor/chat',         label:'المحادثات', icon:'💬' },
  { to:'/doctor/appointments', label:'المواعيد',  icon:'📅' },
  { to:'/doctor/reports',      label:'التقارير',  icon:'📋' },
  { to:'/doctor/settings',     label:'الإعدادات', icon:'⚙️' },
];

const ADMIN_LINKS = [
  { to:'/admin',           label:'الداشبورد',  icon:'🛡️' },
  { to:'/admin/users',     label:'المستخدمون', icon:'👥' },
  { to:'/admin/analytics', label:'أناليتكس',   icon:'📊' },
  { to:'/admin/audit',     label:'سجل النشاط', icon:'🗂️' },
  { to:'/admin/doctors',   label:'الأطباء',    icon:'🩺' },
];

export default function Layout({ children }) {
  const { currentUser, logout, theme } = useStore();
  const navigate = useNavigate();
  const links = currentUser?.role==='patient' ? PATIENT_LINKS : currentUser?.role==='doctor' ? DOCTOR_LINKS : ADMIN_LINKS;
  const roleColor = { patient:'#6366f1', doctor:'#10b981', admin:'#f59e0b' }[currentUser?.role] || '#6366f1';
  const isDark = theme !== 'light';

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{
        width:'220px', flexShrink:0,
        background: isDark ? '#0d1428' : '#f8f9ff',
        borderLeft:`1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
        display:'flex', flexDirection:'column',
        position:'fixed', top:0, right:0, bottom:0, zIndex:50,
        overflowY:'auto',
      }}>
        <div style={{ padding:'1.25rem 1rem', borderBottom:`1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:roleColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>🧠</div>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.95rem', color: isDark ? '#fff' : '#1a1a2e' }}>MindCare</div>
              <div style={{ fontSize:'0.68rem', color:roleColor }}>{{ patient:'مريض', doctor:'طبيب', admin:'أدمن' }[currentUser?.role]}</div>
            </div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'0.75rem 0.6rem', display:'flex', flexDirection:'column', gap:'1px' }}>
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to.split('/').length===2}
              style={({ isActive }) => ({
                display:'flex', alignItems:'center', gap:'8px',
                padding:'8px 10px', borderRadius:'9px', fontSize:'0.83rem',
                color: isActive ? '#fff' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                background: isActive ? roleColor+'25' : 'transparent',
                borderRight:`2.5px solid ${isActive ? roleColor : 'transparent'}`,
                transition:'all 0.15s', fontWeight: isActive ? 600 : 400,
                textDecoration:'none',
              })}>
              <span style={{ fontSize:'0.9rem' }}>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'0.85rem', borderTop:`1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>{currentUser?.avatar}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:'0.8rem', fontWeight:600, color: isDark ? '#fff' : '#1a1a2e', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentUser?.name}</div>
              <div style={{ fontSize:'0.65rem', color:'rgba(128,128,128,0.8)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentUser?.email}</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ width:'100%', padding:'7px', borderRadius:'8px', background:'rgba(255,100,100,0.12)', border:'1px solid rgba(255,100,100,0.2)', color:'#fca5a5', fontSize:'0.78rem', cursor:'pointer' }}>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main style={{ flex:1, marginRight:'220px', minHeight:'100vh', padding:'2rem' }}>
        {children}
      </main>
    </div>
  );
}
