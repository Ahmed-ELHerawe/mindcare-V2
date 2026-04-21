import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/store';
import { MOCK_USERS } from '../../data/mockData';

const AUTO_REPLIES = [
  'أفهم ما تشعر به. هل تريد أن تخبرني أكثر؟',
  'شكراً لمشاركتي هذا. كيف يؤثر هذا على يومك؟',
  'هذا طبيعي جداً. دعنا نتحدث عن كيفية التعامل معه.',
  'أنا هنا أستمع إليك. خذ وقتك.',
  'يبدو أنك تمر بوقت صعب. أنا معك.',
];

export default function PatientChat() {
  const { currentUser, messages, sendMessage } = useStore();
  const doctorId = currentUser.doctorId;
  const chatKey = doctorId ? `${currentUser.id}-${doctorId}` : null;
  const doctor = MOCK_USERS.find(u => u.id === doctorId);
  const chatMessages = chatKey ? (messages[chatKey] || []) : [];

  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const send = () => {
    if (!text.trim() || !chatKey) return;
    sendMessage(chatKey, text.trim(), currentUser.id);
    setText('');
    setIsTyping(true);
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      sendMessage(chatKey, reply, doctorId);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('المتصفح ده مش بيدعم التسجيل الصوتي'); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const r = new SR();
    r.lang = 'ar-EG'; r.interimResults = false;
    r.onresult = (e) => { setText(prev => prev + ' ' + e.results[0][0].transcript); };
    r.onend = () => setIsListening(false);
    r.start(); recognitionRef.current = r; setIsListening(true);
  };

  if (!doctor) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>💬</div>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>مش مرتبط بطبيب لسه. ابحث عن طبيب أول.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', maxWidth: '720px' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{doctor.avatar}</div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600 }}>{doctor.name}</div>
          <div style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> متاح الآن
          </div>
        </div>
        <div style={{ marginRight: 'auto', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{doctor.specialty}</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem', paddingLeft: '4px' }}>
        {chatMessages.map(msg => {
          const isMe = msg.from === currentUser.id;
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-start' : 'flex-end', alignItems: 'flex-end', gap: '8px' }}>
              {!isMe && <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{doctor.avatar}</div>}
              <div style={{ maxWidth: '70%' }}>
                <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#6366f1' : 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '3px', textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(msg.time).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{doctor.avatar}</div>
            <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.08)', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0,1,2].map(i => <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'inline-block', animation: `bounce 1s ease ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <button onClick={startVoice} style={{ width: '44px', height: '44px', borderRadius: '12px', border: `1.5px solid ${isListening ? '#ef4444' : 'rgba(255,255,255,0.15)'}`, background: isListening ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', color: isListening ? '#ef4444' : 'rgba(255,255,255,0.6)', fontSize: '1.1rem', flexShrink: 0, transition: 'all 0.2s' }} title="تسجيل صوتي">
          🎙️
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); }}} placeholder="اكتب رسالتك هنا..." rows={1} style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', resize: 'none', outline: 'none', fontFamily: 'Tajawal,sans-serif', direction: 'rtl', lineHeight: 1.5 }} />
        </div>
        <button onClick={send} disabled={!text.trim()} style={{ width: '44px', height: '44px', borderRadius: '12px', border: 'none', background: text.trim() ? '#6366f1' : 'rgba(255,255,255,0.08)', color: text.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: '1.1rem', flexShrink: 0, transition: 'all 0.2s' }}>→</button>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} textarea::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}
