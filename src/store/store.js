import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_USERS, MOCK_MESSAGES, MOCK_APPOINTMENTS, MOCK_MOOD_HISTORY } from '../data/mockData';

export const useStore = create(
  persist(
    (set, get) => ({
      // AUTH
      currentUser: null,
      pendingUser: null,
      login: (email, password) => {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (user) { set({ pendingUser: user }); return { ok: true, user }; }
        return { ok: false, error: 'بيانات غلط' };
      },
      confirmLogin: () => { const u = get().pendingUser; if (u) set({ currentUser: u, pendingUser: null }); },
      logout: () => set({ currentUser: null, pendingUser: null }),

      // THEME & LANG
      theme: 'dark', lang: 'ar',
      setTheme: (theme) => set({ theme }),
      setLang: (lang) => set({ lang }),

      // CHAT
      messages: MOCK_MESSAGES,
      sendMessage: (chatKey, text, fromId, type = 'text') => {
        const msg = { id: Date.now().toString(), from: fromId, text, time: new Date().toISOString(), type };
        set(s => ({ messages: { ...s.messages, [chatKey]: [...(s.messages[chatKey] || []), msg] } }));
        // Audit log
        get().addAuditLog?.(fromId, 'إرسال رسالة', `محادثة ${chatKey}`, 'chat');
      },

      // APPOINTMENTS
      appointments: MOCK_APPOINTMENTS,
      addAppointment: (apt) => {
        set(s => ({ appointments: [...s.appointments, { id: Date.now().toString(), status: 'pending', ...apt }] }));
        get().addAuditLog?.(apt.patientId, 'حجز موعد', `مع ${apt.doctorId}`, 'appointment');
      },
      updateAppointment: (id, data) => set(s => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, ...data } : a) })),
      cancelAppointment: (id) => set(s => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a) })),

      // MOOD
      moodHistory: MOCK_MOOD_HISTORY,
      addMoodEntry: (userId, entry) => {
        set(s => ({ moodHistory: { ...s.moodHistory, [userId]: [entry, ...(s.moodHistory[userId] || [])] } }));
        get().addAuditLog?.(userId, 'تسجيل مزاج', entry.mood, 'mood');
      },

      // DOCTOR NOTES
      doctorNotes: {},
      saveNote: (key, note) => set(s => ({ doctorNotes: { ...s.doctorNotes, [key]: note } })),

      // MEDICATIONS
      medications: [],
      addMedication: (med) => set(s => ({ medications: [...s.medications, med] })),
      removeMedication: (id) => set(s => ({ medications: s.medications.filter(m => m.id !== id) })),

      // SLEEP
      sleepLogs: [],
      addSleepLog: (log) => set(s => ({ sleepLogs: [...s.sleepLogs, log] })),

      // JOURNAL
      journalEntries: [],
      addJournalEntry: (entry) => set(s => ({ journalEntries: [entry, ...s.journalEntries] })),

      // WAITING LIST
      waitingList: [],
      joinWaiting: (item) => set(s => ({ waitingList: [...s.waitingList, item] })),
      leaveWaiting: (id) => set(s => ({ waitingList: s.waitingList.filter(w => w.id !== id) })),

      // AUDIT LOG
      auditLog: [],
      addAuditLog: (user, action, detail, type) => {
        const entry = { id: Date.now().toString(), user, action, detail, type, time: new Date().toISOString() };
        set(s => ({ auditLog: [entry, ...s.auditLog].slice(0, 100) }));
      },

      // CBT
      cbtCompleted: 0,
      incrementCbt: () => set(s => ({ cbtCompleted: s.cbtCompleted + 1 })),

      // HELPERS
      getPatientsByDoctor: (doctorId) => {
        const doctor = MOCK_USERS.find(u => u.id === doctorId);
        if (!doctor) return [];
        return MOCK_USERS.filter(u => doctor.patients?.includes(u.id));
      },
      getDoctors: () => MOCK_USERS.filter(u => u.role === 'doctor'),
      getAllPatients: () => MOCK_USERS.filter(u => u.role === 'patient'),
      getAllDoctors: () => MOCK_USERS.filter(u => u.role === 'doctor'),
    }),
    {
      name: 'mindcare-v2-store',
      partialize: (s) => ({
        currentUser: s.currentUser, messages: s.messages, appointments: s.appointments,
        moodHistory: s.moodHistory, doctorNotes: s.doctorNotes, theme: s.theme, lang: s.lang,
        medications: s.medications, sleepLogs: s.sleepLogs, journalEntries: s.journalEntries,
        waitingList: s.waitingList, auditLog: s.auditLog, cbtCompleted: s.cbtCompleted,
      }),
    }
  )
);
