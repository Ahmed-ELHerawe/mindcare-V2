import { useEffect, useRef } from 'react';
import { useStore } from '../../store/store';

// Keywords that indicate a mental health crisis
const CRISIS_KEYWORDS = [
  'انتحار', 'اقتل نفسي', 'مش عايز أعيش', 'حياتي مش تستاهل',
  'هأذي نفسي', 'مفيش فايدة', 'خلاص تعبت', 'عايز أختفي',
  'suicide', 'kill myself', 'end my life', 'hurt myself',
  'لا أريد العيش', 'أريد أن أموت', 'تعبت من الحياة',
];

export function detectCrisis(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(kw => lower.includes(kw));
}

export function CrisisAlert({ onDismiss, patientName }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#1a0a0a', border: '2px solid #ef4444',
        borderRadius: '20px', padding: '2.5rem', maxWidth: '460px', width: '100%',
        textAlign: 'center', animation: 'pulse 1s ease infinite',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🆘</div>
        <h2 style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.75rem' }}>
          تم اكتشاف أزمة نفسية
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {patientName ? `يبدو أن ${patientName} يمر بأزمة. تم إرسال تنبيه فوري للطبيب.` : 'يبدو أنك تمر بوقت صعب جداً. أنت لست وحدك.'}
        </p>

        {!patientName && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
            <a href="tel:08008880700" style={{ display: 'block', padding: '12px', borderRadius: '12px', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
              📞 اتصل بخط دعم الأزمات: 0800-888-0700
            </a>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              أو تواصل مع طبيبك مباشرة الآن
            </div>
          </div>
        )}

        <button onClick={onDismiss} style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.7)', borderRadius: '10px', padding: '10px 24px',
          cursor: 'pointer', fontSize: '0.9rem',
        }}>
          أنا بخير — إغلاق
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)}50%{box-shadow:0 0 0 12px rgba(239,68,68,0)}}`}</style>
    </div>
  );
}

export function EmergencyButton() {
  const { currentUser } = useStore();

  const trigger = () => {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    alert(`🚨 تم إرسال تنبيه طوارئ!\n\nسيتواصل معك طبيبك خلال دقائق.\nيمكنك الاتصال بـ: 0800-888-0700`);
  };

  return (
    <button onClick={trigger} style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 200,
      width: '56px', height: '56px', borderRadius: '50%',
      background: '#ef4444', border: '3px solid rgba(255,255,255,0.3)',
      color: '#fff', fontSize: '1.4rem', cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(239,68,68,0.5)',
      transition: 'transform 0.15s, box-shadow 0.15s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      title="زر الطوارئ"
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      🆘
    </button>
  );
}
