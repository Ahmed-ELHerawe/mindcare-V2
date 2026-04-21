import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/store';

const AUTO_REPLIES_DOC = [
  'شكراً لمشاركتي هذا. سأضع ذلك في اعتباري.',
  'أفهم ما تمر به. هل تريد أن نتحدث عن هذا في جلستنا القادمة؟',
  'هذا تقدم ممتاز! استمر في هذا الاتجاه.',
  'لاحظت ذلك في سجل مزاجك. كيف تشعر الآن؟',
  'أنا هنا دائماً. لا تتردد في التواصل في أي وقت.',
];

export default function DoctorChat() {
  const { currentUser, getPatientsByDoctor, messages, sendMessage } = useStore();
  const patients = getPatientsByDoctor(currentUser.id);
  const [activePatient, setActivePatient] = useState(patients[0]?.id || null);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const chatKey = activePatient ? `${activePatient}-${currentUser.id}` : null;
  const chatMessages = chatKey ? (messages[chatKey] || []) : [];
  const patient = patients.find(p => p.id === activePatient);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, activePatient]);

  const send = () => {
    if (!text.trim() || !chatKey) return;
    sendMessage(chatKey, text.trim(), currentUser.id);
    setText('');
    setIsTyping(true);
    setTimeout(() => {
      sendMessage(chatKey, AUTO_REPLIES_DOC[Math.floor(Math.random() * AUTO_REPLIES_DOC.length)], activePatient);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div style={{ display:'flex', height:'calc(100vh - 4rem)', gap:'1rem', maxWidth:'960px' }}>
      {/* Patient list */}
      <div style={{ width:'220px', flexShrink:0, display:'flex', flexDirection:'column', gap:'6px' }}>
        <h2 style={{ color:'#fff', fontWeight:600, fontSize:'1rem', marginBottom:'0.8rem' }}>💬 المحادثات</h2>
        {patients.map(p => {
          const pChatKey = `${p.id}-${currentUser.id}`;
          const pMsgs = messages[pChatKey] || [];
          const lastMsg = pMsgs[pMsgs.length-1];
          const isActive = activePatient === p.id;
          return (
            <button key={p.id} onClick={() => setActivePatient(p.id)} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'12px', borderRadius:'12px', border:`1.5px solid ${isActive ? '#6366f1' : 'rgba(255,255,255,0.06)'}`, background: isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)', textAlign:'right', cursor:'pointer', transition:'all 0.15s' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{p.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:'#fff', fontWeight:500, fontSize:'0.82rem' }}>{p.name}</div>
                {lastMsg && <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.7rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lastMsg.text.slice(0,25)}...</div>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
        {patient ? (
          <>
            {/* Header */}
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'1rem 1.25rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>{patient.avatar}</div>
              <div>
                <div style={{ color:'#fff', fontWeight:600 }}>{patient.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>العمر: {patient.age} سنة</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'10px', marginBottom:'1rem' }}>
              {chatMessages.map(msg => {
                const isMe = msg.from === currentUser.id;
                return (
                  <div key={msg.id} style={{ display:'flex', justifyContent: isMe ? 'flex-start' : 'flex-end' }}>
                    <div style={{ maxWidth:'70%', padding:'10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#10b981' : 'rgba(255,255,255,0.08)', color:'#fff', fontSize:'0.9rem', lineHeight:1.6 }}>
                      {msg.text}
                      <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.4)', marginTop:'4px' }}>
                        {new Date(msg.time).toLocaleTimeString('ar-EG', {hour:'2-digit',minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <div style={{ padding:'10px 16px', borderRadius:'16px 16px 16px 4px', background:'rgba(255,255,255,0.08)', display:'flex', gap:'4px', alignItems:'center' }}>
                    {[0,1,2].map(i => <span key={i} style={{ width:'5px',height:'5px',borderRadius:'50%',background:'rgba(255,255,255,0.5)',display:'inline-block',animation:`bounce 1s ease ${i*0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ display:'flex', gap:'8px' }}>
              <textarea value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="اكتب ردك للمريض..." rows={1} style={{ flex:1, padding:'12px 16px', borderRadius:'14px', border:'1.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'0.9rem', resize:'none', outline:'none', fontFamily:'Tajawal,sans-serif', direction:'rtl' }} />
              <button onClick={send} disabled={!text.trim()} style={{ width:'44px', height:'44px', borderRadius:'12px', border:'none', background:text.trim()?'#10b981':'rgba(255,255,255,0.08)', color:text.trim()?'#fff':'rgba(255,255,255,0.3)', fontSize:'1.1rem', transition:'all 0.2s' }}>→</button>
            </div>
          </>
        ) : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'rgba(255,255,255,0.3)' }}>اختار محادثة</div>}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}} textarea::placeholder{color:rgba(255,255,255,0.25)}`}</style>
    </div>
  );
}
