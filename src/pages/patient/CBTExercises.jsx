import { useState } from 'react';
import { useStore } from '../../store/store';
import { MOOD_LABELS } from '../../data/mockData';

const CBT_EXERCISES = {
  thought_record: {
    title: 'سجل الأفكار',
    icon: '📝',
    desc: 'تحدي الأفكار السلبية التلقائية',
    steps: ['اكتب الموقف اللي حصل', 'إيه الفكرة التلقائية اللي جت في دماغك؟', 'إيه الدليل على صحة الفكرة دي؟', 'إيه الدليل ضدها؟', 'إيه فكرة أكثر توازناً؟'],
  },
  breathing: {
    title: 'تمرين التنفس ٤-٧-٨',
    icon: '🌬️',
    desc: 'يهدئ الجهاز العصبي في دقيقتين',
    steps: ['استنشق ببطء لمدة ٤ ثوانٍ', 'احبس النفس لمدة ٧ ثوانٍ', 'أخرج النفس ببطء لمدة ٨ ثوانٍ', 'كرر ٤ مرات'],
  },
  behavioral_activation: {
    title: 'التنشيط السلوكي',
    icon: '⚡',
    desc: 'كسر دوامة الانسحاب والحزن',
    steps: ['اكتب ٣ نشاطات كنت بتستمتع بيها', 'اختار نشاط واحد بس', 'حدد وقت محدد تعمله النهارده', 'بعد ما تعمله — إيه اللي حسيت بيه؟'],
  },
  grounding: {
    title: 'تمرين التأريض ٥-٤-٣-٢-١',
    icon: '🌱',
    desc: 'يوقف نوبات القلق بسرعة',
    steps: ['٥ حاجات بتشوفها دلوقتي', '٤ حاجات بتحس بيها (ملمس)', '٣ حاجات بتسمعها', '٢ حاجات بتشمها', '١ حاجة بتتذوقها'],
  },
};

export default function CBTExercises() {
  const { currentUser, moodHistory } = useStore();
  const [active, setActive] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const lastMood = moodHistory[currentUser.id]?.[0]?.mood;
  const ex = CBT_EXERCISES[active];

  const startExercise = (key) => {
    setActive(key); setStepIdx(0); setAnswers({}); setDone(false); setAiResponse('');
  };

  const nextStep = (answer) => {
    const newAnswers = { ...answers, [stepIdx]: answer };
    setAnswers(newAnswers);
    if (stepIdx < ex.steps.length - 1) {
      setStepIdx(stepIdx + 1);
    } else {
      setDone(true);
      getAiFeedback(newAnswers);
    }
  };

  const getAiFeedback = async (finalAnswers) => {
    setLoading(true);
    const key = localStorage.getItem('mc_apikey');
    if (!key) { setAiResponse('أضف Anthropic API key لتفعيل التغذية الراجعة من Claude.'); setLoading(false); return; }
    try {
      const answersText = Object.entries(finalAnswers).map(([i, a]) => `${ex.steps[i]}: ${a}`).join('\n');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 300,
          messages: [{ role: 'user', content: `أنا اتعملت تمرين CBT اسمه "${ex.title}". دي إجاباتي:\n${answersText}\n\nديني تغذية راجعة دافئة ومشجعة في ٣ جمل بالعربي.` }],
        }),
      });
      const data = await res.json();
      setAiResponse(data.content?.[0]?.text || '');
    } catch { setAiResponse(''); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>🧘 تمارين CBT</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        علاج معرفي سلوكي — تمارين مثبتة علمياً
        {lastMood && ` · مزاجك: ${MOOD_LABELS[lastMood]?.emoji} ${MOOD_LABELS[lastMood]?.label}`}
      </p>

      {!active ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {Object.entries(CBT_EXERCISES).map(([key, ex]) => (
            <button key={key} onClick={() => startExercise(key)} style={{
              padding: '1.5rem', borderRadius: '16px', border: '1.5px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)', textAlign: 'right', cursor: 'pointer',
              transition: 'all 0.2s', color: '#fff',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{ex.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>{ex.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>{ex.desc}</div>
              <div style={{ marginTop: '0.75rem', color: '#8b5cf6', fontSize: '0.78rem' }}>{ex.steps.length} خطوات ←</div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>{ex.icon} {ex.title}</h2>
            <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
            {ex.steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: '4px', borderRadius: '99px', background: i <= (done ? ex.steps.length : stepIdx) ? '#8b5cf6' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
            ))}
          </div>

          {done ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>أحسنت! أكملت التمرين</h3>
              {loading ? (
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '1rem' }}>
                  Claude بيراجع إجاباتك... ⏳
                </div>
              ) : aiResponse && (
                <div style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '14px', padding: '1.25rem', marginTop: '1.25rem', textAlign: 'right' }}>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7 }}>✨ {aiResponse}</p>
                </div>
              )}
              <button onClick={() => setActive(null)} style={{ marginTop: '1.5rem', padding: '10px 28px', borderRadius: '12px', border: 'none', background: '#8b5cf6', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                تمرين تاني
              </button>
            </div>
          ) : (
            <StepInput
              question={ex.steps[stepIdx]}
              stepNum={stepIdx + 1}
              total={ex.steps.length}
              onNext={nextStep}
            />
          )}
        </div>
      )}
    </div>
  );
}

function StepInput({ question, stepNum, total, onNext }) {
  const [val, setVal] = useState('');
  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        الخطوة {stepNum} من {total}
      </p>
      <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 500, marginBottom: '1.25rem', lineHeight: 1.6 }}>
        {question}
      </p>
      <textarea value={val} onChange={e => setVal(e.target.value)} placeholder="اكتب إجابتك هنا..." rows={3}
        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.95rem', resize: 'none', outline: 'none', fontFamily: 'Tajawal,sans-serif', direction: 'rtl' }}
      />
      <button onClick={() => { if (val.trim()) onNext(val.trim()); }} disabled={!val.trim()}
        style={{ marginTop: '1rem', width: '100%', padding: '11px', borderRadius: '12px', border: 'none', background: val.trim() ? '#8b5cf6' : 'rgba(255,255,255,0.08)', color: val.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600, cursor: val.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
        {stepNum === 4 ? 'إنهاء التمرين ✓' : 'الخطوة التالية →'}
      </button>
      <style>{`textarea::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}
