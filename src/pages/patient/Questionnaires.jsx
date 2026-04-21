import { useState } from 'react';
import { useStore } from '../../store/store';

const PHQ9 = {
  id: 'phq9', title: 'PHQ-9', subtitle: 'استبيان الاكتئاب', icon: '🌧️',
  intro: 'خلال الأسبوعين الماضيين، كم مرة أزعجتك المشكلات التالية؟',
  questions: [
    'قليل من الاهتمام أو المتعة في القيام بالأشياء',
    'الشعور بالإحباط أو الاكتئاب أو اليأس',
    'صعوبة في النوم أو كثرة النوم',
    'الشعور بالتعب أو قلة الطاقة',
    'ضعف الشهية أو الإفراط في الأكل',
    'الشعور بالإخفاق أو الإحساس بخيبة الأمل لنفسك أو عائلتك',
    'صعوبة التركيز في الأشياء كقراءة الجريدة أو مشاهدة التلفاز',
    'تحركت أو تحدثت ببطء شديد أو العكس',
    'أفكار بأنك أفضل ميتاً أو تؤذي نفسك بطريقة ما',
  ],
  options: ['أبداً', 'عدة أيام', 'أكثر من نصف الأيام', 'تقريباً كل يوم'],
  scoring: (score) => {
    if (score <= 4) return { label: 'طبيعي', color: '#10b981', desc: 'لا توجد علامات اكتئاب' };
    if (score <= 9) return { label: 'اكتئاب خفيف', color: '#f59e0b', desc: 'يُنصح بمتابعة الطبيب' };
    if (score <= 14) return { label: 'اكتئاب متوسط', color: '#f97316', desc: 'يحتاج علاجاً' };
    if (score <= 19) return { label: 'اكتئاب شديد', color: '#ef4444', desc: 'علاج عاجل مطلوب' };
    return { label: 'اكتئاب حاد جداً', color: '#dc2626', desc: 'تدخل فوري مطلوب' };
  },
};

const GAD7 = {
  id: 'gad7', title: 'GAD-7', subtitle: 'استبيان القلق', icon: '🌀',
  intro: 'خلال الأسبوعين الماضيين، كم مرة شعرت بالتالي؟',
  questions: [
    'الشعور بالعصبية أو التوتر أو الحدة الزائدة',
    'عدم القدرة على إيقاف أو التحكم بالقلق',
    'القلق المفرط حول أشياء مختلفة',
    'صعوبة الاسترخاء',
    'الانزعاج الشديد لدرجة صعوبة الجلوس بثبات',
    'سهولة الضيق أو الانفعال',
    'الشعور بالخوف كأن شيئاً سيئاً سيحدث',
  ],
  options: ['أبداً', 'عدة أيام', 'أكثر من نصف الأيام', 'تقريباً كل يوم'],
  scoring: (score) => {
    if (score <= 4) return { label: 'قلق طبيعي', color: '#10b981', desc: 'لا توجد علامات قلق مرضية' };
    if (score <= 9) return { label: 'قلق خفيف', color: '#f59e0b', desc: 'متابعة مستحسنة' };
    if (score <= 14) return { label: 'قلق متوسط', color: '#f97316', desc: 'يحتاج علاجاً' };
    return { label: 'قلق شديد', color: '#ef4444', desc: 'علاج عاجل مطلوب' };
  },
};

export default function Questionnaires() {
  const { currentUser, saveNote } = useStore();
  const [active, setActive] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const q = active === 'phq9' ? PHQ9 : active === 'gad7' ? GAD7 : null;

  const setAnswer = (idx, val) => {
    const newA = [...answers];
    newA[idx] = val;
    setAnswers(newA);
  };

  const submit = () => {
    const score = answers.reduce((s, a) => s + (a || 0), 0);
    const res = { ...q.scoring(score), score, max: q.questions.length * 3 };
    setResult(res);
    // Save to doctor notes
    saveNote(`${currentUser.id}_questionnaire`, `${q.title}: ${res.label} (${score}/${res.max}) — ${new Date().toLocaleDateString('ar-EG')}`);
  };

  const allAnswered = q && answers.length === q.questions.length && answers.every(a => a !== undefined);

  return (
    <div style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>📋 استبيانات نفسية</h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>استبيانات معتمدة طبياً — نتيجتك بتوصل لطبيبك</p>

      {!active ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[PHQ9, GAD7].map(qt => (
            <button key={qt.id} onClick={() => { setActive(qt.id); setAnswers([]); setResult(null); }}
              style={{ padding: '2rem', borderRadius: '18px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', textAlign: 'right', cursor: 'pointer', color: '#fff', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{qt.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{qt.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{qt.subtitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{qt.questions.length} أسئلة</div>
            </button>
          ))}
        </div>
      ) : result ? (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{q.icon}</div>
          <h2 style={{ color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>نتيجة {q.title}</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: result.color, marginBottom: '0.5rem' }}>
            {result.score}/{result.max}
          </div>
          <div style={{ padding: '8px 20px', borderRadius: '99px', background: result.color + '25', color: result.color, fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>
            {result.label}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{result.desc}</p>
          <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '12px', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
            ✅ تم إرسال النتيجة لطبيبك تلقائياً
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => setActive(null)} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>رجوع</button>
            <button onClick={() => { setAnswers([]); setResult(null); }} style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>إعادة الاستبيان</button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h2 style={{ color: '#fff', fontWeight: 700 }}>{q.icon} {q.title} — {q.subtitle}</h2>
            <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{q.intro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {q.questions.map((question, idx) => (
              <div key={idx}>
                <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{idx + 1}. </span>{question}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {q.options.map((opt, val) => (
                    <button key={val} onClick={() => setAnswer(idx, val)}
                      style={{ padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s', border: answers[idx] === val ? '1.5px solid #6366f1' : '1.5px solid rgba(255,255,255,0.12)', background: answers[idx] === val ? 'rgba(99,102,241,0.25)' : 'transparent', color: answers[idx] === val ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={submit} disabled={!allAnswered}
            style={{ marginTop: '2rem', width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: allAnswered ? '#6366f1' : 'rgba(255,255,255,0.08)', color: allAnswered ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 700, cursor: allAnswered ? 'pointer' : 'not-allowed', fontSize: '1rem', transition: 'all 0.2s' }}>
            {allAnswered ? 'احسب النتيجة →' : `أجب على كل الأسئلة (${answers.filter(a => a !== undefined).length}/${q.questions.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
