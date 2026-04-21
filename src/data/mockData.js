export const MOCK_USERS = [
  { id: 'p1', role: 'patient', name: 'أحمد محمد', email: 'ahmed@demo.com', password: '123', avatar: '👨', age: 28, doctorId: 'd1' },
  { id: 'p2', role: 'patient', name: 'سارة علي', email: 'sara@demo.com', password: '123', avatar: '👩', age: 32, doctorId: 'd1' },
  { id: 'p3', role: 'patient', name: 'محمود حسن', email: 'mahmoud@demo.com', password: '123', avatar: '🧑', age: 25, doctorId: 'd2' },
  { id: 'd1', role: 'doctor', name: 'د. نورا سامي', email: 'nora@demo.com', password: '123', avatar: '👩‍⚕️', specialty: 'طب نفسي إكلينيكي', rating: 4.9, patients: ['p1','p2'], experience: '١٢ سنة' },
  { id: 'd2', role: 'doctor', name: 'د. كريم طارق', email: 'karim@demo.com', password: '123', avatar: '👨‍⚕️', specialty: 'علاج نفسي سلوكي', rating: 4.7, patients: ['p3'], experience: '٨ سنوات' },
  { id: 'd3', role: 'doctor', name: 'د. منى إبراهيم', email: 'mona@demo.com', password: '123', avatar: '👩‍⚕️', specialty: 'إرشاد نفسي وأسري', rating: 4.8, patients: [], experience: '١٥ سنة' },
  { id: 'a1', role: 'admin', name: 'أدمن المنصة', email: 'admin@demo.com', password: 'admin123', avatar: '🛡️' },
];

export const MOCK_APPOINTMENTS = [
  { id: 'ap1', patientId: 'p1', doctorId: 'd1', date: '2026-04-22', time: '10:00', status: 'confirmed', type: 'online', notes: 'جلسة متابعة أسبوعية' },
  { id: 'ap2', patientId: 'p2', doctorId: 'd1', date: '2026-04-22', time: '11:30', status: 'pending', type: 'online', notes: '' },
  { id: 'ap3', patientId: 'p1', doctorId: 'd1', date: '2026-04-25', time: '14:00', status: 'confirmed', type: 'online', notes: 'جلسة CBT' },
  { id: 'ap4', patientId: 'p3', doctorId: 'd2', date: '2026-04-23', time: '09:00', status: 'confirmed', type: 'online', notes: '' },
];

export const MOCK_MESSAGES = {
  'p1-d1': [
    { id: 'm1', from: 'd1', text: 'أهلاً أحمد، كيف حالك اليوم؟', time: '2026-04-21T09:00:00', type: 'text' },
    { id: 'm2', from: 'p1', text: 'الحمد لله، أحسن من الأسبوع اللي فات', time: '2026-04-21T09:02:00', type: 'text' },
    { id: 'm3', from: 'd1', text: 'ممتاز! هل طبّقت التمرين اللي اتكلمنا عنه؟', time: '2026-04-21T09:03:00', type: 'text' },
    { id: 'm4', from: 'p1', text: 'آه طبّقته ٣ مرات وفرق معايا كتير', time: '2026-04-21T09:05:00', type: 'text' },
  ],
  'p2-d1': [
    { id: 'm5', from: 'd1', text: 'صباح الخير سارة، إيه أخبار هذا الأسبوع؟', time: '2026-04-20T10:00:00', type: 'text' },
    { id: 'm6', from: 'p2', text: 'الأسبوع كان صعب شوية بسبب الشغل', time: '2026-04-20T10:05:00', type: 'text' },
  ],
  'p3-d2': [
    { id: 'm7', from: 'd2', text: 'مرحباً محمود، جاهز لجلستنا؟', time: '2026-04-19T09:00:00', type: 'text' },
  ],
};

export const MOCK_MOOD_HISTORY = {
  p1: [
    { date: '2026-04-21', mood: 'calm', note: 'يوم هادي ومنتج', energy: 4 },
    { date: '2026-04-20', mood: 'anxious', note: 'قلقان من اجتماع الشغل', energy: 2 },
    { date: '2026-04-19', mood: 'radiant', note: 'أخبار ممتازة', energy: 5 },
    { date: '2026-04-18', mood: 'melancholy', note: 'يوم صعب', energy: 2 },
    { date: '2026-04-17', mood: 'calm', note: 'نوم كويس', energy: 3 },
    { date: '2026-04-16', mood: 'grateful', note: 'وقت مع العيلة', energy: 4 },
    { date: '2026-04-15', mood: 'energetic', note: 'جيم ومزاج عالي', energy: 5 },
  ],
  p2: [
    { date: '2026-04-21', mood: 'melancholy', note: 'ضغط كتير', energy: 2 },
    { date: '2026-04-20', mood: 'anxious', note: 'مواعيد كتير', energy: 2 },
    { date: '2026-04-19', mood: 'calm', note: 'يوم عادي', energy: 3 },
  ],
  p3: [
    { date: '2026-04-21', mood: 'energetic', note: 'بدأت رياضة', energy: 5 },
    { date: '2026-04-20', mood: 'grateful', note: 'أصحاب كويسين', energy: 4 },
  ],
};

export const MOOD_LABELS = {
  radiant: { label: 'مشرق', emoji: '☀️', color: '#ff8c00' },
  calm: { label: 'هادئ', emoji: '🌊', color: '#1a8fe3' },
  melancholy: { label: 'حزين', emoji: '🌧️', color: '#9d9dcc' },
  energetic: { label: 'نشيط', emoji: '⚡', color: '#00ff87' },
  anxious: { label: 'قلقان', emoji: '🌀', color: '#ff4e50' },
  grateful: { label: 'ممتنّ', emoji: '🌸', color: '#c67bdb' },
};

export const ADVICE_BY_MOOD = {
  radiant: [
    'استثمر هذه الطاقة الإيجابية في إنجاز مهام مؤجلة',
    'شارك مزاجك الجميل مع من تحبهم',
    'دوّن ما يجعلك سعيداً اليوم للرجوع إليه لاحقاً',
  ],
  calm: [
    'ممارسة التأمل لـ ١٠ دقائق ستعمق هذا الهدوء',
    'هذا وقت مثالي للقراءة أو التعلم',
    'استمتع بلحظة الحاضر بوعي كامل',
  ],
  melancholy: [
    'تذكر أن المشاعر مؤقتة وهذا أيضاً سيمر',
    'تواصل مع صديق أو فرد من العائلة الآن',
    'المشي لـ ٢٠ دقيقة في الهواء الطلق يرفع المزاج فعلاً',
    'اكتب مشاعرك — الكتابة تساعد على التفريغ',
  ],
  energetic: [
    'وجّه طاقتك نحو هدف إبداعي',
    'ممارسة الرياضة ستحقق أقصى استفادة من هذه الطاقة',
    'تجنب قرارات متسرعة — الطاقة العالية تحتاج توجيهاً',
  ],
  anxious: [
    'تمرين التنفس ٤-٧-٨: شهيق ٤ ثوانٍ، حبس ٧، زفير ٨',
    'اكتب ما يقلقك وحدد ما يمكنك التحكم فيه',
    'تجنب الكافيين الآن وشرب ماء دافئ',
    'تحدث مع طبيبك إذا استمر القلق أكثر من يومين',
  ],
  grateful: [
    'اكتب ٣ أشياء تشكر عليها اليوم',
    'أخبر شخصاً تقدره بمعنى وجوده في حياتك',
    'هذا الشعور يبني المرونة النفسية — احتفظ به',
  ],
};
