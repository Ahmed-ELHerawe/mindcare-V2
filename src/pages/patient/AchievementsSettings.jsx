import { useStore } from '../../store/store';

const ACHIEVEMENTS = [
  { id: 'first_mood', icon: '🌱', title: 'أول خطوة', titleEn: 'First Step', desc: 'سجّل أول مزاج', condition: (s) => (s.moodHistory[s.currentUser?.id] || []).length >= 1 },
  { id: 'week_streak', icon: '🔥', title: 'أسبوع كامل', titleEn: 'Full Week', desc: '٧ أيام تسجيل متتالية', condition: (s) => (s.moodHistory[s.currentUser?.id] || []).length >= 7 },
  { id: 'first_chat', icon: '💬', title: 'كسر الحاجز', titleEn: 'Icebreaker', desc: 'أول محادثة مع طبيبك', condition: (s) => Object.values(s.messages || {}).some(msgs => msgs.length > 0) },
  { id: 'first_appt', icon: '📅', title: 'موعدك الأول', titleEn: 'First Appointment', desc: 'احجز أول موعد', condition: (s) => (s.appointments || []).filter(a => a.patientId === s.currentUser?.id).length >= 1 },
  { id: 'all_moods', icon: '🌈', title: 'كل الألوان', titleEn: 'All Colors', desc: 'جرّب كل المزاجات الـ٦', condition: (s) => { const moods = new Set((s.moodHistory[s.currentUser?.id] || []).map(e => e.mood)); return moods.size >= 6; } },
  { id: 'cbt_done', icon: '🧘', title: 'محارب القلق', titleEn: 'Anxiety Fighter', desc: 'أكمل تمرين CBT', condition: (s) => (s.cbtCompleted || 0) >= 1 },
  { id: 'questionnaire', icon: '📋', title: 'واعي بنفسك', titleEn: 'Self-Aware', desc: 'أكمل استبياناً نفسياً', condition: (s) => !!s.doctorNotes?.[`${s.currentUser?.id}_questionnaire`] },
  { id: 'journal', icon: '📓', title: 'يوميجي', titleEn: 'Journaler', desc: 'اكتب ٣ يوميات', condition: (s) => (s.journalEntries || []).filter(e => e.userId === s.currentUser?.id).length >= 3 },
  { id: 'sleep_week', icon: '😴', title: 'نوم صحي', titleEn: 'Healthy Sleep', desc: 'سجّل نومك ٧ أيام', condition: (s) => (s.sleepLogs || []).filter(l => l.userId === s.currentUser?.id).length >= 7 },
  { id: 'veteran', icon: '🏆', title: 'بطل العلاج', titleEn: 'Therapy Champion', desc: '٣٠ يوم تسجيل', condition: (s) => (s.moodHistory[s.currentUser?.id] || []).length >= 30 },
];

export function Achievements() {
  const store = useStore();
  const lang = store.lang || 'ar';

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
        {lang === 'ar' ? '🏆 إنجازاتي' : '🏆 My Achievements'}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        {lang === 'ar' ? `${ACHIEVEMENTS.filter(a => a.condition(store)).length} من ${ACHIEVEMENTS.length} إنجاز` : `${ACHIEVEMENTS.filter(a => a.condition(store)).length} of ${ACHIEVEMENTS.length} unlocked`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {ACHIEVEMENTS.map(a => {
          const unlocked = a.condition(store);
          return (
            <div key={a.id} style={{
              padding: '1.5rem', borderRadius: '16px',
              border: `1.5px solid ${unlocked ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.07)'}`,
              background: unlocked ? 'rgba(251,191,36,0.08)' : 'rgba(255,255,255,0.03)',
              display: 'flex', gap: '14px', alignItems: 'center',
              opacity: unlocked ? 1 : 0.5, transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: '2.2rem', filter: unlocked ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <div>
                <div style={{ color: unlocked ? '#fbbf24' : '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                  {lang === 'ar' ? a.title : a.titleEn}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginTop: '2px' }}>{a.desc}</div>
                {unlocked && <div style={{ color: '#10b981', fontSize: '0.72rem', marginTop: '4px' }}>✅ {lang === 'ar' ? 'تم الإنجاز' : 'Unlocked'}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Theme + Language Settings ───────────────────────────────────────
export function AppSettings() {
  const { theme, setTheme, lang, setLang, currentUser } = useStore();

  const themes = [
    { id: 'dark', label: 'داكن', labelEn: 'Dark', icon: '🌙', colors: ['#0a0f1e', '#1a2035'] },
    { id: 'light', label: 'فاتح', labelEn: 'Light', icon: '☀️', colors: ['#f0f4ff', '#ffffff'] },
    { id: 'contrast', label: 'تباين عالي', labelEn: 'High Contrast', icon: '⬛', colors: ['#000000', '#ffffff'] },
    { id: 'mint', label: 'نعناعي', labelEn: 'Mint', icon: '🌿', colors: ['#0a1f1a', '#0d2b24'] },
    { id: 'rose', label: 'وردي', labelEn: 'Rose', icon: '🌹', colors: ['#1f0a14', '#2b0d1c'] },
  ];

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '2rem' }}>
        {lang === 'ar' ? '⚙️ الإعدادات' : '⚙️ Settings'}
      </h1>

      {/* Language */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>
          {lang === 'ar' ? '🌐 اللغة' : '🌐 Language'}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[{ id: 'ar', label: 'العربية', flag: '🇸🇦' }, { id: 'en', label: 'English', flag: '🇬🇧' }].map(l => (
            <button key={l.id} onClick={() => setLang?.(l.id)} style={{
              flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
              border: `1.5px solid ${lang === l.id ? '#6366f1' : 'rgba(255,255,255,0.12)'}`,
              background: lang === l.id ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: '#fff', fontSize: '0.95rem', fontWeight: lang === l.id ? 600 : 400, transition: 'all 0.15s',
            }}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Themes */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '1rem' }}>
          {lang === 'ar' ? '🎨 الثيم' : '🎨 Theme'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {themes.map(t => (
            <button key={t.id} onClick={() => setTheme?.(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
              borderRadius: '12px', border: `1.5px solid ${theme === t.id ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
              background: theme === t.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
              color: '#fff', cursor: 'pointer', textAlign: 'right', transition: 'all 0.15s', width: '100%',
            }}>
              <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
              <div style={{ flex: 1, fontSize: '0.9rem', fontWeight: theme === t.id ? 600 : 400 }}>
                {lang === 'ar' ? t.label : t.labelEn}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {t.colors.map((c, i) => <div key={i} style={{ width: '16px', height: '16px', borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.2)' }} />)}
              </div>
              {theme === t.id && <span style={{ color: '#6366f1', fontSize: '1rem' }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* API Key */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
        <h2 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>🤖 Anthropic API Key</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '1rem' }}>
          {lang === 'ar' ? 'مطلوب لتفعيل ميزات الذكاء الاصطناعي' : 'Required for AI features'}
        </p>
        <input
          defaultValue={localStorage.getItem('mc_apikey') || ''}
          onChange={e => localStorage.setItem('mc_apikey', e.target.value)}
          type="password" placeholder="sk-ant-api03-..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', direction: 'ltr' }}
        />
      </div>
    </div>
  );
}
