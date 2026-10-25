// CredGeek PWA · Industry-grade gamified, voice-first companion for women.
// Cloudinary media CDN, video/audio TTS streaming, signed direct audio recordings.

const $ = (s) => document.querySelector(s);
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

const UI = {
  en: {
    title: 'CredGeek',
    sub: 'Learn money. Build your own credit. Stay safe.',
    nick: 'Nickname',
    pin: 'PIN (4-6 digits)',
    register: 'Start Journey',
    login: 'I Have an Account',
    coins: 'coins',
    next: 'Recommended Next Step',
    go: 'Start Now',
    lessons: 'Daily Lessons',
    games: 'Games Hub',
    tree: 'Score Tree',
    safety: 'Safety Check-up',
    ladder: 'CredGeek Board',
    night: "Tonight's Reflection",
    skip: 'Skip for now',
    back: 'Back',
    listen: 'Listen',
    speak: 'Speak',
    stop: 'Stop',
    check: 'Check My Answers',
    done: 'Awesome, Continue',
    iDid: 'I Completed This Step',
    openSite: 'Open Official Portal',
    familiar: 'All Familiar',
    unfamiliar: 'Something Unfamiliar',
    settings: 'Settings & Privacy',
    del: 'Delete All My Data',
    delAsk: 'This deletes your account, all progress, and any stored voice files immediately. Continue?',
    ontime: 'Paid on Time',
    missed: 'Missed Payment',
    month: 'Month',
    rings: 'rings',
    paused: 'Paused with care. Your tree is safe. Pay on time next month and it blooms again. No penalty!',
    kirana: 'Kirana Basket',
    trap: 'Spot the Trap',
    story: 'Story Choices',
    trapQ: 'Is this loan or request a trap?',
    yes: 'Trap ⚠️',
    no: 'Safe ✅',
    total: 'Weekly Total',
    cantHear: 'Audio not available. Showing text transcript.',
    heard: 'I heard you say',
    tryAgain: 'Could not understand. Please tap your answer below.',
    logout: 'Log Out',
    lang: 'हिंदी',
    needMore: 'Not ready yet. Keep learning and practicing.',
    offline: 'No internet connection. Please try again.',
    discreet: 'Discreet Mode',
    discreetHint: 'Shopping notes disguise active. Tap header 3 times to unlock.',
    cldActive: 'Cloudinary CDN Active',
    cldInfo: 'Powered by Cloudinary: media optimization (f_auto, q_auto), signed direct audio uploads, and automatic voice deletion.',
    boardTitle: 'Snakes & Ladders Credit Board',
    boardDesc: 'Climb the 6 rungs to your own credit file. Avoid predatory snakes, climb smart ladders!',
    rung2Accent: '⭐ ACCENT RUNG: Your own credit file begins here!',
    treeSim: 'Fast-Forward 6 Months',
    treeSimNote: 'Simulate 6 on-time payment months to watch your tree bloom and unlock Rung 4!',
    emergencyHelp: 'Emergency Protection & Legal Aid',
    womenHelpline: 'Women Helpline 181',
    legalAid: 'NALSA Legal Aid 15100',
    demoFill: 'Fill Demo Account',
    soundOn: 'Sound FX: ON',
    soundOff: 'Sound FX: OFF',
    tour: 'App Tour',
  },
  hi: {
    title: 'क्रेडगीक',
    sub: 'पैसा सीखिए। अपनी क्रेडिट बनाइए। सुरक्षित रहिए।',
    nick: 'उपनाम (Nickname)',
    pin: 'पिन (4-6 अंक)',
    register: 'सफ़र शुरू करें',
    login: 'मेरा खाता है',
    coins: 'सिक्के',
    next: 'आपका अगला कदम',
    go: 'अभी शुरू करें',
    lessons: 'दैनिक पाठ',
    games: 'खेल का मैदान',
    tree: 'स्कोर ट्री',
    safety: 'सुरक्षा जाँच',
    ladder: 'क्रेडगीक सीढ़ी बोर्ड',
    night: 'आज रात का सवाल',
    skip: 'अभी छोड़ें',
    back: 'वापस',
    listen: 'सुनिए',
    speak: 'बोलिए',
    stop: 'रुकिए',
    check: 'जवाब जाँचिए',
    done: 'शानदार, आगे बढ़ें',
    iDid: 'मैंने यह कदम पूरा कर लिया',
    openSite: 'आधिकारिक पोर्टल खोलिए',
    familiar: 'सब जाना-पहचाना है',
    unfamiliar: 'कुछ अनजान दिख रहा है',
    settings: 'सेटिंग व गोपनीयता',
    del: 'मेरा सारा डेटा मिटाइए',
    delAsk: 'इससे आपका खाता, सभी प्रगति और आवाज़ की फ़ाइलें हमेशा के लिए मिट जाएँगी। क्या जारी रखें?',
    ontime: 'समय पर पूरा चुकाया',
    missed: 'इस महीने चूक गया',
    month: 'महीना',
    rings: 'छल्ले',
    paused: 'सुरक्षित रोक। आपका पेड़ सुरक्षित है। अगले महीने समय पर चुकाने से फिर बढ़ेगा। कोई सज़ा नहीं!',
    kirana: 'किराना टोकरी',
    trap: 'जाल पहचानिए',
    story: 'कहानी के चुनाव',
    trapQ: 'क्या यह लोन या संदेश कोई जाल है?',
    yes: 'जाल है ⚠️',
    no: 'सुरक्षित है ✅',
    total: 'हफ़्ते का कुल',
    cantHear: 'आवाज़ उपलब्ध नहीं। लिखा हुआ दिखा रहे हैं।',
    heard: 'मैंने आपकी आवाज़ में सुना',
    tryAgain: 'समझ नहीं आया। कृपया नीचे जवाब का बटन दबाइए।',
    logout: 'लॉग आउट',
    lang: 'English',
    needMore: 'अभी तैयारी पूरी नहीं है। सीखते रहिए।',
    offline: 'इंटरनेट कनेक्शन नहीं है। दोबारा कोशिश करें।',
    discreet: 'गोपनीयता मोड',
    discreetHint: 'खरीदारी सूची का मुखौटा चालू है। वापस जाने के लिए ऊपर 3 बार टैप करें।',
    cldActive: 'क्लाउडिनरी मीडिया सक्रिय',
    cldInfo: 'क्लाउडिनरी द्वारा संचालित: स्वचालित मीडिया अनुकूलन, सुरक्षित आवाज़ अपलोड और तुरंत डेटा विलोपन।',
    boardTitle: 'साँप-सीढ़ी क्रेडिट बोर्ड',
    boardDesc: 'अपनी क्रेडिट फ़ाइल तक पहुँचने के लिए 6 पायदान चढ़िए। कर्ज़ के साँपों से बचिए, ज्ञान की सीढ़ी चढ़िए!',
    rung2Accent: '⭐ ख़ास पायदान: आपकी अपनी क्रेडिट फ़ाइल यहीं से शुरू होती है!',
    treeSim: '6 महीने का सिमुलेटर चलाएँ',
    treeSimNote: '6 महीने समय पर बिल चुकाने का अभ्यास करके देखें कि पेड़ कैसे खिलता है और सीढ़ी 4 खुलती है!',
    emergencyHelp: 'आपातकालीन सहायता और मुफ़्त कानूनी मदद',
    womenHelpline: 'महिला हेल्पलाइन 181',
    legalAid: 'मुफ़्त कानूनी सहायता 15100',
    demoFill: 'डेमो खाता भरें',
    soundOn: 'आवाज़ प्रभाव: चालू',
    soundOff: 'आवाज़ प्रभाव: बंद',
    tour: 'ऐप गाइड',
  },
};

const NIGHT = {
  yes: { en: 'Yes', hi: 'हाँ' },
  no: { en: 'No', hi: 'नहीं' },
  unsure: { en: 'Not sure', hi: 'पता नहीं' },
};

const STATUS = {
  done: { en: 'Completed', hi: 'पूरा हो गया' },
  open: { en: 'Ready to Claim', hi: 'दावा करने को तैयार' },
  preparing: { en: 'In Progress', hi: 'तैयारी जारी' },
  locked: { en: 'Locked', hi: 'बंद' },
};

let lang = store.get('lang') || 'hi';
let token = store.get('token');
let me = null;
let current = null;
let soundEnabled = store.get('sfx') !== 'false';
let discreetActive = false;

const t = (k) => UI[lang]?.[k] ?? UI.en[k] ?? k;

// ---------- Web Audio API Synthesizer (Zero dependencies, offline friendly) ----------
const sfx = {
  ctx: null,
  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  play(type) {
    if (!soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'coin') {
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'fanfare') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const o = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          o.connect(g);
          g.connect(this.ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.16, now + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);
          o.start(now + idx * 0.08);
          o.stop(now + idx * 0.08 + 0.28);
        });
      } else if (type === 'tap') {
        osc.frequency.setValueAtTime(540, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'warn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      }
    } catch { /* audio context failed */ }
  },
};

// ---------- Confetti Particle Engine ----------
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = [];
  const colors = ['#0f766e', '#14b8a6', '#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 65; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 220,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 80,
      vx: (Math.random() - 0.5) * 14,
      vy: -Math.random() * 12 - 4,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    });
  }
  let frame = 0;
  function anim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.alpha -= 0.013;
      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    if (alive && frame++ < 110) requestAnimationFrame(anim);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  anim();
}

// ---------- DOM Builder Helper ----------
function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), (e) => { sfx.play('tap'); v(e); });
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) {
    if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return el;
}

let toastTimer = null;
const toast = (m, type) => {
  const e = $('#toast');
  if (!e) return;

  let kind = type;
  if (!kind) {
    const s = String(m).toLowerCase();
    if (s.includes('incorrect') || s.includes('already in use') || s.includes('error') || s.includes('please enter') || s.includes('offline') || s.includes('failed') || s.includes('गलत') || s.includes('कृपया')) {
      kind = 'error';
    } else if (s.includes('warn') || s.includes('trap') || s.includes('जाल') || s.includes('छोड़ें')) {
      kind = 'warn';
    } else if (s.includes('+') || s.includes('🪙') || s.includes('डेमो') || s.includes('demo') || s.includes('achieved') || s.includes('bloomed') || s.includes('सफल')) {
      kind = 'success';
    } else {
      kind = 'info';
    }
  }

  let icon = '';
  if (kind === 'error') icon = '⚠️ ';
  else if (kind === 'warn') icon = '🔔 ';
  else if (kind === 'success' && !String(m).includes('🪙') && !String(m).includes('✨') && !String(m).includes('✅')) icon = '✅ ';

  e.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-text">${m}</span>`;
  e.className = `show toast-${kind}`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    e.classList.remove('show');
  }, 3200);
};

// ---------- API Layer ----------
const API_BASE = (typeof window !== 'undefined' && (window.__API_BASE__ || localStorage.getItem('credgeek_api_url'))) || '';

async function api(method, path, body) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  }).catch(() => null);

  if (!res) {
    toast(t('offline'));
    throw new Error('offline');
  }
  if (res.status === 401 && token) {
    logout();
    throw new Error('auth');
  }
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const e = new Error(json?.error || res.status);
    e.status = res.status;
    e.body = json;
    throw e;
  }
  return json;
}

function logout() {
  token = null;
  store.del('token');
  me = null;
  showLogin();
}

// ---------- Cloudinary TTS & Audio Player ----------
let player = null;
let currentAudioId = null;

function renderVoiceFloater(text, onStop) {
  const mount = $('#voice-floater-mount');
  mount.replaceChildren(
    h('div', { class: 'voice-companion-pill' },
      h('div', { class: 'soundwave' },
        h('span', { class: 'soundwave-bar' }),
        h('span', { class: 'soundwave-bar' }),
        h('span', { class: 'soundwave-bar' }),
        h('span', { class: 'soundwave-bar' })
      ),
      h('div', { class: 'quiet', style: 'font-size:12px; font-weight:700; flex:1; margin:0 12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;' }, text || 'Playing audio...'),
      h('button', { class: 'top-btn', style: 'min-height:28px; padding:2px 8px;', onclick: () => { player?.pause(); mount.replaceChildren(); onStop?.(); } }, '⏹ ' + t('stop'))
    )
  );
}

function clearVoiceFloater() {
  $('#voice-floater-mount').replaceChildren();
}

async function speak(audioId, fallbackText) {
  try {
    currentAudioId = audioId;
    const { url } = await api('GET', `/audio/${encodeURIComponent(audioId)}?lang=${lang}`);
    player?.pause();
    player = new Audio(url);
    renderVoiceFloater(fallbackText || 'Audio lesson', () => { currentAudioId = null; });
    player.onended = () => { clearVoiceFloater(); currentAudioId = null; };
    await player.play();
  } catch {
    if (fallbackText && 'speechSynthesis' in window) {
      renderVoiceFloater(fallbackText, () => speechSynthesis.cancel());
      const u = new SpeechSynthesisUtterance(fallbackText);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      u.onend = clearVoiceFloater;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } else {
      toast(t('cantHear'));
    }
  }
}

const listenBtn = (audioId, text) =>
  h('button', { class: 'icon voice-listen-btn', 'aria-label': t('listen'), title: t('listen'), onclick: () => speak(audioId, text) }, '🔊');

// ---------- Cloudinary Signed Voice Upload & STT ----------
async function recordAnswer(optionIds, btn) {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    return toast(t('cantHear'));
  }
  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch {
    return toast(t('cantHear'));
  }
  const rec = new MediaRecorder(stream);
  const chunks = [];
  btn.classList.add('live');
  btn.textContent = '⏹';
  toast(lang === 'hi' ? '🎙️ सुन रहे हैं... बोलिए' : '🎙️ Listening... speak now');

  const finished = new Promise((resolve) => {
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = resolve;
  });
  const stop = () => { if (rec.state !== 'inactive') rec.stop(); };
  btn.onclick = stop;
  rec.start();
  setTimeout(stop, 8000);

  await finished;
  stream.getTracks().forEach((x) => x.stop());
  btn.classList.remove('live');
  btn.textContent = '🎤';

  const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
  try {
    toast(lang === 'hi' ? '🔒 क्लाउडिनरी में सुरक्षित अपलोड...' : '🔒 Direct Cloudinary signed upload...');
    const s = await api('POST', '/voice/sign');
    if (s.mock) {
      const mockUrl = s.uploadUrl.startsWith('http') ? s.uploadUrl : `${API_BASE}${s.uploadUrl}`;
      await fetch(`${mockUrl}?public_id=${encodeURIComponent(s.publicId)}`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: blob,
      });
    } else {
      const f = new FormData();
      for (const [k, v] of Object.entries(s.fields)) f.append(k, v);
      f.append('file', blob, 'answer');
      const up = await fetch(s.uploadUrl, { method: 'POST', body: f });
      if (!up.ok) throw new Error('upload');
    }

    toast(lang === 'hi' ? '⚡ समझने का प्रयास...' : '⚡ Matching intent...');
    const r = await api('POST', '/voice/transcribe', { publicId: s.publicId, optionIds });
    if (r.match) {
      sfx.play('coin');
      toast(`${t('heard')}: "${r.transcript}"`);
      return r.match;
    }
    sfx.play('warn');
    toast(t('tryAgain'));
  } catch {
    sfx.play('warn');
    toast(t('tryAgain'));
  }
  return null;
}

function mic(optionIds, onMatch) {
  const b = h('button', { class: 'icon rec', 'aria-label': t('speak'), title: t('speak') }, '🎤');
  const start = async () => {
    b.onclick = null;
    const m = await recordAnswer(optionIds, b);
    b.onclick = start;
    if (m) onMatch(m);
  };
  b.onclick = start;
  return b;
}

// ---------- Responsive Cloudinary Images ----------
const img = (s, cls = 'hero') =>
  h('img', {
    class: cls,
    src: s.src,
    srcset: s.srcset,
    sizes: s.sizes || '100vw',
    alt: s.alt || '',
    loading: 'lazy',
    width: 160,
    height: 160,
  });

// ---------- Top App Bar & Bottom Dock Layout ----------
function renderTopBar(activeNav) {
  const mount = $('#top-bar-mount');
  if (!token || !me) {
    mount.replaceChildren();
    return;
  }

  const avatarInitial = (me.nick || 'P')[0].toUpperCase();
  mount.replaceChildren(
    h('header', { class: 'top-bar' },
      h('div', { class: 'top-bar-left' },
        h('div', { class: 'user-avatar-pill', onclick: showSettings },
          h('span', { class: 'user-avatar-icon' }, avatarInitial),
          h('span', {}, me.nick)
        ),
        h('div', { class: 'coins-badge', id: 'top-coins-badge', title: `${me.coins} ${t('coins')}` },
          h('span', { class: 'coin-icon' }, '🪙'),
          h('span', {}, `${me.coins}`)
        )
      ),
      h('div', { class: 'top-bar-actions' },
        h('button', {
          class: 'top-btn tour-btn',
          id: 'top-tour-btn',
          title: lang === 'hi' ? 'क्रेडसाथी ऐप गाइड शुरू करें' : 'Start CredSaathi App Tour',
          onclick: () => startTutorial(true)
        }, '✨ ' + (lang === 'hi' ? 'गाइड' : 'Tour')),
        h('button', {
          class: 'top-btn cld-pill',
          id: 'top-cld-btn',
          title: t('cldInfo'),
          onclick: () => alert(`${t('cldActive')}\n\n${t('cldInfo')}`)
        }, '⚡ Cloudinary'),
        h('button', {
          class: 'top-btn',
          id: 'top-discreet-btn',
          title: t('discreet'),
          onclick: toggleDiscreet
        }, '👁️'),
        h('button', {
          class: 'top-btn',
          onclick: async () => {
            lang = lang === 'hi' ? 'en' : 'hi';
            store.set('lang', lang);
            if (token) {
              await api('PATCH', '/me', { lang });
              me = await api('GET', '/me');
            }
            document.documentElement.lang = lang;
            current?.();
          }
        }, t('lang')),
        h('button', {
          class: 'top-btn',
          title: soundEnabled ? t('soundOn') : t('soundOff'),
          onclick: () => {
            soundEnabled = !soundEnabled;
            store.set('sfx', soundEnabled);
            toast(soundEnabled ? t('soundOn') : t('soundOff'));
            renderTopBar(activeNav);
          }
        }, soundEnabled ? '🔊' : '🔇')
      )
    )
  );
}

function renderBottomDock(activeNav) {
  const mount = $('#bottom-bar-mount');
  if (!token || !me) {
    mount.replaceChildren();
    return;
  }

  const items = [
    { id: 'home', icon: '🏠', label: lang === 'hi' ? 'होम' : 'Home', action: showHome },
    { id: 'ladder', icon: '🪜', label: lang === 'hi' ? 'सीढ़ी' : 'Ladder', action: showLadderBoard },
    { id: 'lessons', icon: '📘', label: lang === 'hi' ? 'पाठ' : 'Lessons', action: showLessons },
    { id: 'games', icon: '🎲', label: lang === 'hi' ? 'खेल' : 'Games', action: () => showGames() },
    { id: 'tree', icon: '🌳', label: lang === 'hi' ? 'ट्री' : 'Tree', action: showTree },
    { id: 'safety', icon: '🔎', label: lang === 'hi' ? 'सुरक्षा' : 'Safety', action: showSafety },
  ];

  mount.replaceChildren(
    h('nav', { class: 'bottom-dock' },
      items.map((item) =>
        h('button', {
          id: `nav-${item.id}`,
          class: `dock-item ${activeNav === item.id ? 'active' : ''}`,
          onclick: () => item.action(),
        },
          h('span', { class: 'dock-icon' }, item.icon),
          h('span', {}, item.label)
        )
      )
    )
  );
}

// ---------- Discreet Privacy Mode (Domestic protection) ----------
let discreetClickCount = 0;
function toggleDiscreet() {
  discreetActive = !discreetActive;
  if (discreetActive) {
    discreetClickCount = 0;
    render(
      h('div', { class: 'card hero-banner', onclick: () => {
        discreetClickCount++;
        if (discreetClickCount >= 3) {
          discreetActive = false;
          toast('Discreet mode unlocked');
          showHome();
        }
      }},
        h('h1', { text: lang === 'hi' ? '📝 दैनिक घरेलू खरीदारी सूची' : '📝 Daily Household Grocery Notes' }),
        h('p', { class: 'quiet', style: 'color:#cbd5e1;', text: t('discreetHint') })
      ),
      h('div', { class: 'card' },
        h('ul', { style: 'padding-left:20px; line-height:2.2;' },
          h('li', { text: lang === 'hi' ? 'आटा 10 किलो' : 'Atta 10 kg' }),
          h('li', { text: lang === 'hi' ? 'सरसों तेल 1 लीटर' : 'Mustard oil 1 L' }),
          h('li', { text: lang === 'hi' ? 'चना दाल 1 किलो' : 'Chana dal 1 kg' }),
          h('li', { text: lang === 'hi' ? 'बच्चों की स्कूल कॉपी' : 'School notebooks for children' }),
          h('li', { text: lang === 'hi' ? 'चाय पत्ती 250 ग्राम' : 'Tea powder 250g' })
        )
      )
    );
  } else {
    showHome();
  }
}

// Helper to render into #app and update layout mounts
function renderView(activeNav, ...nodes) {
  renderTopBar(activeNav);
  renderBottomDock(activeNav);
  const appEl = $('#app');
  appEl.replaceChildren(...nodes.flat().filter(Boolean));
  window.scrollTo(0, 0);
}
const render = (...nodes) => renderView(null, ...nodes);

// ==========================================================================
// INTERACTIVE ASSISTANT & GUIDED ONBOARDING TOUR (CredSaathi · क्रेडसाथी)
// ==========================================================================
let currentTutorialStep = 0;
let tutorialNarratorActive = true;
let tutorialActive = false;

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    target: null, // Centered modal
    tag: { hi: '✨ AI वित्तीय साथी', en: '✨ Personal Guide' },
    title: { hi: 'नमस्ते! मैं हूँ क्रेडसाथी 🤝', en: 'Namaste! Meet CredSaathi 🤝' },
    desc: {
      hi: 'क्रेडगीक (CredGeek) में आपका स्वागत है! मैं आपका व्यक्तिगत वित्तीय सहायक हूँ। चलिए 1 मिनट में समझते हैं कि यह ऐप आपका क्रेडिट स्कोर सुरक्षित और मजबूत बनाने में कैसे मदद करता है!',
      en: 'Welcome to CredGeek! I am your personal financial guide. Let me show you around in 1 minute so you can discover how to build safe credit, earn rewards, and secure your financial future.'
    },
    voice: {
      hi: 'नमस्ते! मैं क्रेडसाथी हूँ, आपका व्यक्तिगत वित्तीय सहायक। क्रेडगीक में आपका स्वागत है! चलिए ऐप के मुख्य फीचर्स को समझते हैं।',
      en: 'Namaste and welcome to CredGeek! I am CredSaathi, your personal assistant. Let me show you how to navigate your financial journey with ease and confidence.'
    }
  },
  {
    id: 'topbar',
    target: '.top-bar',
    fallbackTarget: '#top-coins-badge',
    tag: { hi: '🪙 गुल्लक और प्राइवेसी', en: '🪙 Gullak & Privacy' },
    title: { hi: 'गुल्लक सिक्के और गोपनीयता शील्ड 👁️', en: 'Gullak Coins & Privacy Mode 👁️' },
    desc: {
      hi: 'ऊपर आपकी गुल्लक है जहाँ सीखकर कमाए सिक्के (🪙) जमा होते हैं। साथ ही 👁️ आँख वाले बटन से आप 1-टैप में स्क्रीन को सादी किराना लिस्ट में बदल सकती हैं ताकि कोई आपका वित्तीय डेटा न झाँके!',
      en: 'At the top is your Gullak tracking your earned reward coins (🪙). Plus, 1-tap Discreet Mode (👁️) disguises your screen as a plain grocery list to protect your financial privacy.'
    },
    voice: {
      hi: 'यहाँ ऊपर आपकी गुल्लक है जहाँ आपके सिक्के जमा होते हैं। और आँख वाले बटन को दबाकर आप अपनी स्क्रीन को तुरंत छुपा सकते हैं।',
      en: 'At the top is your Gullak coin tracker. And with the eye button, you can instantly disguise your screen for complete domestic privacy.'
    }
  },
  {
    id: 'ladder',
    target: '#hub-ladder-card',
    fallbackTarget: '#nav-ladder',
    tag: { hi: '🪜 6-सीढ़ी रोडमैप', en: '🪜 6-Rung Roadmap' },
    title: { hi: 'साँप-सीढ़ी क्रेडिट यात्रा 🪜', en: 'Snakes & Ladders Credit Path 🪜' },
    desc: {
      hi: 'शून्य से 750+ क्रेडिट स्कोर तक की 6 सुरक्षित सीढ़ियाँ। सीढ़ियाँ (जैसे समय पर बिल भरना) आपको ऊपर ले जाती हैं, और खतरनाक फर्जी लोन ऐप के साँपों से बचाती हैं!',
      en: 'A clear 6-rung roadmap from zero to 750+ score. Ladders (like timely bill payments) lift you up, while alerts warn you against high-interest loan app snakes!'
    },
    voice: {
      hi: 'यह आपकी साँप-सीढ़ी क्रेडिट यात्रा है। अच्छी आदतें आपको सीढ़ी चढ़ाएंगी, और खतरनाक लोन ऐप के साँपों से बचाएंगी।',
      en: 'This is your Snakes and Ladders credit roadmap. Good habits act as ladders, and alerts protect you from predatory loan traps.'
    }
  },
  {
    id: 'games',
    target: '#hub-games-card',
    fallbackTarget: '#nav-games',
    tag: { hi: '🎲 किराना और ट्रैप खेल', en: '🎲 Kirana & Trap Games' },
    title: { hi: 'किराना बजट और ट्रैप खेल 🎲', en: 'Kirana Budget & Trap Detection 🎲' },
    desc: {
      hi: 'खेलते-खेलते वित्तीय समझ बढ़ाएं! ₹1,000 के किराना बजट में जरूरी और गैर-जरूरी खर्चों को छाँटना सीखें, और फर्जी 7-दिवसीय लोन SMS के धोखे को पहचानें।',
      en: 'Learn financial wisdom through games! Practice balancing a ₹1,000 grocery budget between needs and wants, and train your eyes to catch predatory loan SMS scams.'
    },
    voice: {
      hi: 'खेल सेक्शन में आप किराना बजट बनाना सीखेंगे और फर्जी लोन ऑफर्स में छुपे जाल को पहचानना सीखेंगे।',
      en: 'In the games section, practice smart grocery budgeting and train yourself to spot deceptive loan scams before they trick you.'
    }
  },
  {
    id: 'tree_safety',
    target: '#hub-tree-card',
    fallbackTarget: '#nav-tree',
    tag: { hi: '🌳 ट्री और सुरक्षा', en: '🌳 Living Tree & Safety' },
    title: { hi: 'सदाबहार स्कोर ट्री और सुरक्षा शील्ड 🛡️', en: 'Living Score Tree & Safety Shield 🛡️' },
    desc: {
      hi: 'आपका क्रेडिट ट्री कभी मरता नहीं है—मुश्किल दिनों में यह शांत सो जाता है। सुरक्षा टैब में आधार/सिम ऑडिट और महिला हेल्पलाइन 181 व कानूनी सहायता 15100 का 1-टैप सपोर्ट है।',
      en: 'Your score tree never dies—during hardships it enters a compassionate pause. In Safety, run Aadhaar SIM audits with 1-tap Women Helpline 181 and NALSA legal aid.'
    },
    voice: {
      hi: 'आपका स्कोर ट्री हमेशा बढ़ता रहेगा और कभी नष्ट नहीं होगा। सुरक्षा सेक्शन में सरकारी हेल्पलाइन और सिम सुरक्षा मौजूद है। आपका दौरा पूरा हुआ!',
      en: 'Your credit tree grows with your habits and never dies. And the safety shield protects your identity. Your tour is complete, let us begin!'
    }
  }
];

let _activeUtterance = null;

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

function stopTutorialNarrator() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      _activeUtterance = null;
    } catch {}
  }
}

function speakTutorialNarrator(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!tutorialNarratorActive || !soundEnabled) return;
  if (!text) return;

  stopTutorialNarrator();

  setTimeout(() => {
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const u = new SpeechSynthesisUtterance(text);
      _activeUtterance = u; // Keep reference to prevent Garbage Collection in Chrome

      u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      u.rate = 0.95;
      u.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices?.() || [];
      if (voices.length > 0) {
        if (lang === 'hi') {
          const hiVoice = voices.find(v => v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('lekha'));
          if (hiVoice) u.voice = hiVoice;
        } else {
          const enVoice = voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india') || v.lang.toLowerCase().startsWith('en'));
          if (enVoice) u.voice = enVoice;
        }
      }

      const updateStatus = (html) => {
        const el = $('#tutorial-voice-status-text');
        if (el) el.innerHTML = html;
      };

      u.onstart = () => {
        updateStatus(`🔊 <em>${lang === 'hi' ? 'क्रेडसाथी समझा रहे हैं...' : 'CredSaathi is speaking...'}</em>`);
      };

      u.onend = () => {
        updateStatus(`✅ ${lang === 'hi' ? 'विवरण पूरा हुआ' : 'Narration complete'}`);
        _activeUtterance = null;
      };

      u.onerror = (e) => {
        console.warn('[CredSaathi TTS event]:', e?.error || e);
        if (e?.error === 'not-allowed') {
          updateStatus(`👆 <em>${lang === 'hi' ? 'सुनने के लिए 🔄 दबाएँ' : 'Tap 🔄 to listen'}</em>`);
        } else {
          updateStatus(`🔈 <em>${lang === 'hi' ? 'ऑडियो तैयार' : 'Audio ready'}</em>`);
        }
        _activeUtterance = null;
      };

      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('Narrator TTS notice:', e);
    }
  }, 90);
}

const svgEl = (tag, attrs = {}) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

function updateTutorialSpotlight(step) {
  const cutout = $('#tutorial-cutout');
  const border = $('#tutorial-cutout-border');
  if (!cutout || !border) return;

  let el = null;
  if (step.target) el = document.querySelector(step.target);
  if (!el && step.fallbackTarget) el = document.querySelector(step.fallbackTarget);

  if (!el) {
    cutout.setAttribute('width', '0');
    cutout.setAttribute('height', '0');
    border.style.display = 'none';
    return;
  }

  try {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {}

  const reposition = () => {
    const rect = el.getBoundingClientRect();
    const pad = 6;
    const x = Math.max(2, rect.left - pad);
    const y = Math.max(2, rect.top - pad);
    const w = rect.width + pad * 2;
    const h = rect.height + pad * 2;

    cutout.setAttribute('x', `${x}`);
    cutout.setAttribute('y', `${y}`);
    cutout.setAttribute('width', `${w}`);
    cutout.setAttribute('height', `${h}`);

    border.setAttribute('x', `${x}`);
    border.setAttribute('y', `${y}`);
    border.setAttribute('width', `${w}`);
    border.setAttribute('height', `${h}`);
    border.style.display = 'block';
  };

  reposition();
  setTimeout(reposition, 120);
  setTimeout(reposition, 300);
}

function renderTutorialStep(idx) {
  tutorialActive = true;
  currentTutorialStep = Math.max(0, Math.min(idx, TUTORIAL_STEPS.length - 1));
  const step = TUTORIAL_STEPS[currentTutorialStep];
  const isFirst = currentTutorialStep === 0;
  const isLast = currentTutorialStep === TUTORIAL_STEPS.length - 1;

  const mount = $('#tutorial-mount');
  if (!mount) return;

  const isCentered = isFirst || !step.target;
  const cardCls = `tutorial-card ${isCentered ? 'modal-center' : 'docked-bottom'}`;
  const isGuest = !token;

  // Build SVG Cutout Mask Overlay
  const overlaySvg = svgEl('svg', {
    id: 'tutorial-overlay-svg',
    class: 'tutorial-overlay-svg'
  });
  overlaySvg.onclick = closeTutorial;

  const defs = svgEl('defs');
  const mask = svgEl('mask', { id: 'tutorial-mask', maskUnits: 'userSpaceOnUse' });
  const maskBg = svgEl('rect', { x: '0', y: '0', width: '100%', height: '100%', fill: 'white' });
  const cutout = svgEl('rect', {
    id: 'tutorial-cutout',
    x: '0',
    y: '0',
    width: '0',
    height: '0',
    rx: '16',
    ry: '16',
    fill: 'black'
  });
  mask.append(maskBg, cutout);
  defs.appendChild(mask);

  const backdrop = svgEl('rect', {
    x: '0',
    y: '0',
    width: '100%',
    height: '100%',
    fill: 'rgba(8, 15, 28, 0.82)',
    mask: 'url(#tutorial-mask)'
  });

  const border = svgEl('rect', {
    id: 'tutorial-cutout-border',
    class: 'cutout-border',
    x: '0',
    y: '0',
    width: '0',
    height: '0',
    rx: '16',
    ry: '16',
    fill: 'none'
  });
  border.style.display = 'none';

  overlaySvg.append(defs, backdrop, border);

  mount.replaceChildren(
    overlaySvg,
    h('div', { class: cardCls, onclick: (e) => e.stopPropagation() },
      // Assistant Badge Header
      h('div', { class: 'assistant-badge' },
        h('div', { class: 'assistant-info' },
          h('div', { class: 'assistant-avatar' }, '🤝'),
          h('div', { class: 'assistant-title' },
            h('span', {}, 'CredSaathi · क्रेडसाथी'),
            h('span', { class: 'assistant-sub' }, lang === 'hi' ? 'आपका व्यक्तिगत वित्तीय गाइड' : 'Your Personal Financial Guide')
          )
        ),
        h('button', {
          class: 'top-btn',
          style: 'padding: 4px 10px; font-size: 11px;',
          title: tutorialNarratorActive ? (lang === 'hi' ? 'आवाज़ बंद करें' : 'Mute Narrator') : (lang === 'hi' ? 'आवाज़ चालू करें' : 'Enable Narrator'),
          onclick: () => {
            tutorialNarratorActive = !tutorialNarratorActive;
            if (!tutorialNarratorActive) {
              stopTutorialNarrator();
              toast(lang === 'hi' ? '🔇 गाइड आवाज़ म्यूट' : '🔇 Narrator muted');
            } else {
              speakTutorialNarrator(step.voice[lang] || step.desc[lang]);
              toast(lang === 'hi' ? '🔊 गाइड आवाज़ चालू' : '🔊 Narrator active');
            }
            renderTutorialStep(currentTutorialStep);
          }
        }, tutorialNarratorActive ? '🔊 ' + (lang === 'hi' ? 'आवाज़' : 'Audio') : '🔇 ' + (lang === 'hi' ? 'म्यूट' : 'Mute'))
      ),

      // Tag pill
      h('div', { class: 'tutorial-tag-pill' }, step.tag[lang] || step.tag.en),

      // Title
      h('h3', { class: 'tutorial-title' }, step.title[lang] || step.title.en),

      // Description
      h('p', { class: 'tutorial-desc' }, step.desc[lang] || step.desc.en),

      // 1-tap demo start on Welcome step if visitor is not logged in yet
      isFirst && isGuest && h('button', {
        class: 'primary block',
        style: 'margin-bottom:14px; font-weight:700; background:linear-gradient(135deg, var(--brand) 0%, #0d9488 100%); font-size:14px; padding:12px;',
        onclick: async () => {
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          const nick = `priya_${randomNum}`;
          const pin = '1234';
          try {
            toast(lang === 'hi' ? '⚡ डेमो खाता तैयार किया जा रहा है...' : '⚡ Setting up demo account...');
            const r = await api('POST', '/auth/register', { nick, pin, lang });
            token = r.token;
            store.set('token', token);
            me = await api('GET', '/me');
            lang = me.lang;
            store.set('lang', lang);
            await showHome();
            renderTutorialStep(1);
          } catch {
            await showHome();
            renderTutorialStep(1);
          }
        }
      }, `⚡ ${lang === 'hi' ? 'प्रिया के रूप में तुरंत डेमो शुरू करें' : 'Try Instant Demo as Priya'}`),

      // Voice narration status indicator
      h('div', { class: 'tutorial-voice-status' },
        h('span', { id: 'tutorial-voice-status-text' },
          tutorialNarratorActive && soundEnabled
            ? `🔊 <em>${lang === 'hi' ? 'क्रेडसाथी समझा रहे हैं...' : 'CredSaathi is speaking...'}</em>`
            : `🔈 <em>${lang === 'hi' ? 'आवाज़ बंद है' : 'Audio muted'}</em>`
        ),
        h('button', {
          class: 'top-btn',
          style: 'padding: 2px 8px; font-size: 11px;',
          title: lang === 'hi' ? 'दोबारा सुनें' : 'Listen again',
          onclick: () => speakTutorialNarrator(step.voice[lang] || step.desc[lang])
        }, '🔄 ' + (lang === 'hi' ? 'दोबारा सुनें' : 'Replay'))
      ),

      // Navigation Footer
      h('div', { class: 'tutorial-nav' },
        // Step dots
        h('div', { class: 'tutorial-dots' },
          ...TUTORIAL_STEPS.map((_, i) =>
            h('div', {
              class: `tutorial-dot ${i === currentTutorialStep ? 'active' : ''}`,
              style: 'cursor: pointer;',
              title: `Step ${i + 1} of ${TUTORIAL_STEPS.length}`,
              onclick: () => renderTutorialStep(i)
            })
          )
        ),
        // Button row
        h('div', { class: 'tutorial-btn-row' },
          !isFirst && h('button', {
            class: 'top-btn',
            onclick: () => renderTutorialStep(currentTutorialStep - 1)
          }, `← ${lang === 'hi' ? 'पिछला' : 'Back'}`),
          h('button', {
            class: 'top-btn',
            onclick: closeTutorial
          }, lang === 'hi' ? 'छोड़ें' : 'Skip'),
          h('button', {
            class: 'primary',
            style: 'padding: 8px 16px; font-size: 13px;',
            onclick: async () => {
              if (isLast) {
                finishTutorial();
              } else {
                if (isFirst && isGuest) {
                  const randomNum = Math.floor(1000 + Math.random() * 9000);
                  const nick = `priya_${randomNum}`;
                  const pin = '1234';
                  try {
                    const r = await api('POST', '/auth/register', { nick, pin, lang });
                    token = r.token;
                    store.set('token', token);
                    me = await api('GET', '/me');
                    lang = me.lang;
                    store.set('lang', lang);
                    await showHome();
                  } catch {
                    await showHome();
                  }
                }
                renderTutorialStep(currentTutorialStep + 1);
              }
            }
          }, isLast
            ? `🚀 ${lang === 'hi' ? 'शुरू करें!' : 'Get Started!'}`
            : `${lang === 'hi' ? 'अगला' : 'Next'} →`
          )
        )
      )
    )
  );

  updateTutorialSpotlight(step);
  speakTutorialNarrator(step.voice[lang] || step.desc[lang]);
}

function closeTutorial() {
  stopTutorialNarrator();
  tutorialActive = false;
  $('#tutorial-mount')?.replaceChildren();
  toast(lang === 'hi' ? 'दौरा बंद किया गया। आप ऊपर ✨ गाइड से कभी भी देख सकते हैं।' : 'Tour dismissed. You can reopen it anytime via ✨ Guide.');
}

function finishTutorial() {
  stopTutorialNarrator();
  tutorialActive = false;
  store.set('credgeek_tutorial_done', 'true');
  $('#tutorial-mount')?.replaceChildren();
  sfx.play('fanfare');
  triggerConfetti();
  toast(lang === 'hi' ? '🌟 दौरा पूरा हुआ! क्रेडसाथी हमेशा सहायता के लिए तैयार है।' : '🌟 Tour complete! CredSaathi is always here to guide you.');
}

async function startTutorial(isManual = false) {
  if (isManual && token && current !== showHome) {
    await showHome();
  }
  renderTutorialStep(0);
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (tutorialActive) {
      const step = TUTORIAL_STEPS[currentTutorialStep];
      if (step) updateTutorialSpotlight(step);
    }
  });
  window.addEventListener('scroll', () => {
    if (tutorialActive) {
      const step = TUTORIAL_STEPS[currentTutorialStep];
      if (step) updateTutorialSpotlight(step);
    }
  }, { passive: true });
}

// ==========================================================================
// SCREEN 1: LOGIN & ONBOARDING
// ==========================================================================
function showLogin() {
  current = showLogin;
  renderTopBar(null);
  renderBottomDock(null);

  const nick = h('input', {
    placeholder: t('nick'),
    autocomplete: 'username',
    autocapitalize: 'none',
    value: '',
  });
  const pin = h('input', {
    placeholder: t('pin'),
    type: 'password',
    inputmode: 'numeric',
    maxlength: 6,
    autocomplete: 'current-password',
    value: '',
  });

  const doAuth = (path) => async () => {
    try {
      const r = await api('POST', `/auth/${path}`, {
        nick: nick.value.trim(),
        pin: pin.value,
        lang,
      });
      token = r.token;
      store.set('token', token);
      me = await api('GET', '/me');
      lang = me.lang;
      store.set('lang', lang);
      sfx.play('fanfare');
      triggerConfetti();
      path === 'register' ? showHook() : showHome();
    } catch (e) {
      sfx.play('warn');
      toast(
        e.body?.error === 'nick_taken'
          ? 'Nickname already in use. Please try another.'
          : e.body?.error === 'bad_login'
          ? 'Incorrect nickname or PIN.'
          : 'Please enter nickname (3-20 letters/numbers) and PIN (4-6 digits).'
      );
    }
  };

  const fillSample = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    nick.value = `priya_${randomNum}`;
    pin.value = '1234';
    toast(lang === 'hi' ? 'डेमो खाता भरा गया!' : 'Demo account filled!');
  };

  renderView(
    null,
    h('div', { class: 'card hero-banner', style: 'text-align:center; padding:32px 20px;' },
      h('div', { style: 'font-size:48px; margin-bottom:8px;' }, '🪜'),
      h('h1', { text: t('title') }),
      h('p', { text: t('sub') })
    ),
    h('div', { class: 'card' },
      h('div', { class: 'row between', style: 'margin-bottom:12px;' },
        h('h3', { text: lang === 'hi' ? 'सुरक्षित प्रवेश' : 'Secure Entry' }),
        h('button', {
          class: 'top-btn',
          onclick: () => {
            lang = lang === 'hi' ? 'en' : 'hi';
            store.set('lang', lang);
            document.documentElement.lang = lang;
            showLogin();
          }
        }, t('lang'))
      ),
      nick,
      pin,
      h('button', { class: 'primary block', onclick: doAuth('register') }, `✨ ${t('register')}`),
      h('button', { class: 'block', onclick: doAuth('login') }, `🔑 ${t('login')}`),
      h('button', { class: 'block', style: 'border-style:dashed;', onclick: fillSample }, `⚡ ${t('demoFill')}`),
      h('button', {
        class: 'top-btn',
        style: 'width:100%; justify-content:center; margin-top:8px;',
        onclick: () => startTutorial(true)
      }, '✨ ' + (lang === 'hi' ? 'क्रेडसाथी असिस्टेंट दौरा देखें' : 'Preview CredSaathi Assistant Tour'))
    ),
    h('p', { class: 'quiet', style: 'text-align:center;' },
      lang === 'hi'
        ? '🔒 हम कभी भी आपका फ़ोन नंबर, आधार, पैन या बैंक विवरण नहीं माँगते।'
        : '🔒 We never ask for your phone number, Aadhaar, PAN or bank credentials.'
    )
  );

  // Auto-launch interactive assistant welcome for first-time visitors
  if (!store.get('credgeek_tutorial_done')) {
    setTimeout(() => {
      if (!tutorialActive && !document.querySelector('.tutorial-card')) {
        startTutorial(false);
      }
    }, 450);
  }
}

// ==========================================================================
// SCREEN 2: VOICE HOOK (Opening onboarding question)
// ==========================================================================
async function showHook() {
  current = showHook;
  const { questions } = await api('GET', `/hook?lang=${lang}`);
  const answers = {};

  const step = (idx) => {
    if (idx >= questions.length) {
      return api('POST', '/me/hook', { answers }).then(() => {
        sfx.play('fanfare');
        triggerConfetti();
        showHome();
      });
    }
    const q = questions[idx];
    const pick = (optId) => {
      sfx.play('tap');
      answers[q.id] = optId;
      step(idx + 1);
    };

    renderView(
      null,
      h('div', { class: 'card hero-banner' },
        h('p', { class: 'quiet', style: 'color:#d1fae5;', text: `Step ${idx + 1} of ${questions.length}` }),
        h('h1', { text: q.text })
      ),
      h('div', { class: 'card' },
        h('p', { class: 'quiet', text: lang === 'hi' ? 'सुनिए या बोलकर जवाब दीजिए:' : 'Listen or speak your answer:' }),
        h('div', { class: 'row', style: 'margin-bottom:16px;' },
          listenBtn(q.audio, q.text),
          mic(q.options.map((o) => o.id), pick)
        ),
        q.options.map((o) =>
          h('button', { class: 'block', onclick: () => pick(o.id) }, o.text)
        )
      )
    );
  };
  step(0);
}

// ==========================================================================
// SCREEN 3: HOME DASHBOARD
// ==========================================================================
async function showHome() {
  current = showHome;
  me = await api('GET', '/me');
  const [j, night] = await Promise.all([
    api('GET', '/journey/next'),
    api('GET', '/night'),
  ]);

  const rungName = (r) => r.title;
  const nextAction = () => {
    sfx.play('tap');
    ({
      lesson: () => showLesson(j.next.id),
      ladder: () => showRung(j.next.rung),
      safety: showSafety,
      game: () => showGames(j.next.id),
    }[j.next.type]());
  };

  const nextLabel = {
    lesson: t('lessons'),
    ladder: t('ladder'),
    safety: t('safety'),
    game: t('games'),
  }[j.next.type];

  // Active current rung
  const currentRung = me.ladder.find((r) => r.status === 'open' || r.status === 'preparing') || me.ladder[0];

  renderView(
    'home',
    // Greeting Hero Card
    h('div', { class: 'card hero-banner' },
      h('div', { class: 'row between' },
        h('h1', { text: `${lang === 'hi' ? 'नमस्ते' : 'Welcome'}, ${me.nick}! 👋` }),
        h('span', { class: 'chip done', style: 'background:#ffffff; color:var(--brand-dark);' }, `Rung ${currentRung.n}`)
      ),
      h('p', { text: j.nudge })
    ),

    // Next Action Card
    h('div', { class: 'card next' },
      h('p', { style: 'font-weight:700; font-size:16px;', text: j.nudge }),
      h('button', { class: 'primary block', style: 'margin-top:10px;', onclick: nextAction },
        `🚀 ${t('go')}: ${nextLabel}`
      )
    ),

    // Night Question Card (Optional daily reflection)
    night.answered === false &&
      h('div', { class: 'card gold-accent', id: 'night-card' },
        h('div', { class: 'row between' },
          h('h3', { text: `🌙 ${t('night')}` }),
          h('span', { class: 'chip open' }, '+5 🪙')
        ),
        h('p', { style: 'font-size:16px; font-weight:600; margin:8px 0;', text: night.text }),
        h('div', { class: 'row', style: 'margin:12px 0;' },
          listenBtn(night.audioId, night.text),
          mic(night.options, (matched) => answerNight(night, matched)),
          ...night.options.map((opt) =>
            h('button', { onclick: () => answerNight(night, opt) }, NIGHT[opt]?.[lang] ?? opt)
          )
        ),
        h('button', {
          class: 'top-btn',
          style: 'width:100%; justify-content:center;',
          onclick: (e) => e.target.closest('#night-card').remove(),
        }, t('skip'))
      ),

    // Fast Hub Grid (Ladder Board, Lessons, Games, Tree, Safety)
    h('h2', { text: lang === 'hi' ? 'आपकी प्रगति' : 'Your Progress Hub' }),
    h('div', { style: 'display:grid; grid-template-columns:1fr 1fr; gap:12px;' },
      h('div', { id: 'hub-ladder-card', class: 'card', style: 'margin:0; cursor:pointer;', onclick: showLadderBoard },
        h('div', { style: 'font-size:28px;' }, '🪜'),
        h('h3', { text: t('ladder') }),
        h('p', { class: 'quiet', text: `${me.ladder.filter((r) => r.status === 'done').length}/6 completed` })
      ),
      h('div', { id: 'hub-tree-card', class: 'card', style: 'margin:0; cursor:pointer;', onclick: showTree },
        h('div', { style: 'font-size:28px;' }, '🌳'),
        h('h3', { text: t('tree') }),
        h('p', { class: 'quiet', text: `${me.tree.rings} ${t('rings')} · ${me.tree.stage}` })
      ),
      h('div', { id: 'hub-lessons-card', class: 'card', style: 'margin:0; cursor:pointer;', onclick: showLessons },
        h('div', { style: 'font-size:28px;' }, '📘'),
        h('h3', { text: t('lessons') }),
        h('p', { class: 'quiet', text: '6 Daily Modules' })
      ),
      h('div', { id: 'hub-games-card', class: 'card', style: 'margin:0; cursor:pointer;', onclick: () => showGames() },
        h('div', { style: 'font-size:28px;' }, '🎲'),
        h('h3', { text: t('games') }),
        h('p', { class: 'quiet', text: 'Kirana · Trap · Story' })
      )
    ),

    // Badges Showcase Shelf
    h('div', { class: 'row between', style: 'margin-top:16px;' },
      h('h2', { text: lang === 'hi' ? 'पुरस्कार व बैज' : 'Trophy Shelf' }),
      h('span', { class: 'quiet', text: `${me.badges.length} Unlocked` })
    ),
    me.badges.length > 0
      ? h('div', { class: 'badges-shelf' },
          me.badges.map((b) =>
            h('div', { class: 'badge-item', title: b.name },
              h('img', { src: b.image.src, srcset: b.image.srcset, sizes: '52px', alt: b.name }),
              h('span', { class: 'badge-name', text: b.name })
            )
          )
        )
      : h('div', { class: 'card', style: 'text-align:center; padding:20px;' },
          h('p', { class: 'quiet', text: lang === 'hi' ? 'पाठ पूरा करने और खेल खेलने पर नए बैज मिलेंगे!' : 'Complete lessons and play games to unlock shiny badges!' })
        )
  );

  // Auto-launch interactive assistant tour on first landing
  if (!store.get('credgeek_tutorial_done')) {
    setTimeout(() => {
      if (!document.querySelector('.tutorial-overlay')) {
        startTutorial(false);
      }
    }, 600);
  }
}

async function answerNight(q, answer) {
  const r = await api('POST', '/night', { questionId: q.id, answer });
  sfx.play('coin');
  if (r.coins) toast(`+${r.coins} 🪙 ${t('coins')}`);
  showHome();
}

// ==========================================================================
// SCREEN 4: SNAKES & LADDERS CREDIT BOARD (Interactive Flow Map Experience)
// ==========================================================================
async function showLadderBoard() {
  current = showLadderBoard;
  me = await api('GET', '/me');

  // Snakes & Ladders connections between rungs
  const connectors = [
    {
      type: 'ladder',
      text: lang === 'hi' ? 'सीढ़ी: अपना खाता + पैन = सुरक्षित पहचान' : 'Ladder: Own Bank Account + PAN = Identity Base',
    },
    {
      type: 'snake',
      text: lang === 'hi' ? 'साँप से बचें: बिना नाम वाले 7-दिन के लोन ऐप' : 'Snake: Avoid 7-Day Unregulated Loan Apps',
    },
    {
      type: 'ladder',
      text: lang === 'hi' ? 'सीढ़ी: ₹2,000 की एफ़डी पर पहला सुरक्षित कार्ड!' : 'Ladder: Small FD backs your 1st Secured Card!',
    },
    {
      type: 'snake',
      text: lang === 'hi' ? 'साँप से बचें: फ़ोन पर किसी को OTP बताना' : 'Snake: Never share OTP with anyone on a call',
    },
    {
      type: 'ladder',
      text: lang === 'hi' ? 'सीढ़ी: हर महीने समय पर 1 छोटा बिल पूरा चुकाना' : 'Ladder: Pay one small utility bill in full on time',
    },
  ];

  renderView(
    'ladder',
    backBtn(showHome),
    h('div', { class: 'card hero-banner' },
      h('h1', { text: `🪜 ${t('boardTitle')}` }),
      h('p', { text: t('boardDesc') })
    ),

    h('div', { class: 'board-container' },
      ...me.ladder.flatMap((r, idx) => {
        const isCurrent = r.status === 'open' || (r.status === 'preparing' && (!me.ladder[idx - 1] || me.ladder[idx - 1].status === 'done'));
        const isAccent = r.n === 2; // Rung 2: Where credit file begins!
        const connector = connectors[idx];
        const rungCard = h('div', {
          class: `board-rung-card ${isCurrent ? 'current-active' : ''} ${isAccent ? 'accent-card' : ''}`,
          onclick: () => showRung(r.n),
        },
          h('span', { class: 'board-tile-num', text: String(r.n) }),
          img(r.image, 'ladder-img'),
          h('div', { style: 'flex:1;' },
            h('h3', { text: r.title, style: 'margin:0;' }),
            isAccent ? h('span', { class: 'rung-accent-callout', text: t('rung2Accent') }) : false,
            h('p', { class: 'quiet', style: 'font-size:12px; margin:4px 0 0;', text: r.help })
          ),
          h('span', { class: `chip ${r.status}`, text: STATUS[r.status]?.[lang] ?? r.status })
        );

        const items = [rungCard];
        if (idx < me.ladder.length - 1 && connector) {
          items.push(
            h('div', { class: 'board-connector' },
              connector.type === 'snake'
                ? h('div', { class: 'board-snake' }, '🐍 ', h('span', {}, connector.text))
                : h('div', { class: 'board-ladder-perk' }, '🪜 ', h('span', {}, connector.text))
            )
          );
        }
        return items;
      })
    )
  );
}

// Rung Detail Modal / Page
async function showRung(n) {
  current = () => showRung(n);
  me = await api('GET', '/me');
  const r = me.ladder[n];

  const doComplete = async () => {
    try {
      const res = await api('POST', `/ladder/${n}/complete`);
      sfx.play('fanfare');
      triggerConfetti();
      toast(`+${res.coins ?? 50} 🪙 ${t('coins')}!`);
      showLadderBoard();
    } catch {
      sfx.play('warn');
      toast(t('needMore'));
    }
  };

  renderView(
    'ladder',
    backBtn(showLadderBoard),
    img(r.image, 'hero'),
    h('div', { class: 'card' },
      h('div', { class: 'row between' },
        h('h1', { text: `Rung ${n}: ${r.title}` }),
        h('span', { class: `chip ${r.status}`, text: STATUS[r.status]?.[lang] ?? r.status })
      ),
      n === 2 && h('div', { class: 'chip open', style: 'margin:8px 0; background:var(--gold-soft); color:var(--gold-dark);' }, t('rung2Accent')),
      h('p', { style: 'font-size:16px; line-height:1.6;', text: r.help }),

      // Missing Prerequisites checklist
      r.status === 'preparing' &&
        h('div', { style: 'background:var(--warn-soft); border:1px solid var(--gold); border-radius:var(--r-md); padding:14px; margin:16px 0;' },
          h('h4', { style: 'color:var(--gold-dark); margin-bottom:8px;', text: lang === 'hi' ? '📌 पूरा करने के लिए आवश्यक कदम:' : '📌 Requirements to unlock:' }),
          h('ul', { style: 'padding-left:20px; line-height:1.8; color:var(--gold-dark); font-weight:600;' },
            r.missing.map((m) =>
              h('li', {},
                m.need === 'lessons'
                  ? `${m.have}/${m.want} ${t('lessons')}`
                  : m.need === 'game'
                  ? `${t('games')}: ${t(m.game)}`
                  : m.need === 'treeMonths'
                  ? `${m.have}/${m.want} ${t('rings')} (${t('tree')})`
                  : t('safety')
              )
            )
          )
        ),

      r.status === 'open' &&
        h('button', { class: 'primary block', style: 'margin-top:16px;', onclick: doComplete },
          `🎉 ${t('iDid')}`
        ),
      r.status === 'done' &&
        h('div', { class: 'chip done', style: 'font-size:14px; padding:6px 14px; margin-top:12px;' }, '✅ ' + (lang === 'hi' ? 'यह पायदान पूरा हो चुका है' : 'Step Successfully Achieved'))
    )
  );
}

// ==========================================================================
// SCREEN 5: DAILY LESSONS
// ==========================================================================
async function showLessons() {
  current = showLessons;
  const ls = await api('GET', '/lessons');

  renderView(
    'lessons',
    backBtn(showHome),
    h('div', { class: 'card hero-banner' },
      h('h1', { text: `📘 ${t('lessons')}` }),
      h('p', { text: lang === 'hi' ? '5 मिनट के आसान पाठ। अपनी गति से सीखिए।' : '5-minute micro-lessons with daily-life stories and quizzes.' })
    ),
    ls.map((l) =>
      h('div', {
        class: `card ${l.done ? '' : 'gold-accent'}`,
        style: 'display:flex; align-items:center; gap:14px; cursor:pointer;',
        onclick: () => showLesson(l.id),
      },
        img(l.image, 'ladder-img'),
        h('div', { style: 'flex:1;' },
          h('h3', { text: `${l.order}. ${l.title}`, style: 'margin:0;' }),
          h('p', { class: 'quiet', style: 'font-size:12px; margin-top:4px;', text: l.done ? '✅ ' + (lang === 'hi' ? 'पूरा हुआ' : 'Completed') : '📖 ' + (lang === 'hi' ? 'शुरू करें' : 'Start Lesson') })
        ),
        h('span', { class: `chip ${l.done ? 'done' : 'open'}` }, l.done ? '100%' : '+20 🪙')
      )
    )
  );
}

async function showLesson(id) {
  current = () => showLesson(id);
  const l = await api('GET', `/lessons/${id}`);
  const userAnswers = l.quiz.map(() => null);

  const quizCards = l.quiz.map((q, qi) => {
    const box = h('div', { class: 'card' },
      h('h3', { text: `Q${qi + 1}: ${q.q}` })
    );
    q.options.forEach((optText, oi) => {
      const b = h('button', {
        class: 'block',
        onclick: () => {
          userAnswers[qi] = oi;
          [...box.querySelectorAll('button')].forEach((btn) => btn.classList.remove('chosen'));
          b.classList.add('chosen');
        },
      }, optText);
      box.append(b);
    });
    return box;
  });

  const resultContainer = h('div');

  const onCheck = async () => {
    if (userAnswers.includes(null)) {
      toast(lang === 'hi' ? 'कृपया सभी सवालों के जवाब चुनिए।' : 'Please answer all quiz questions.');
      return;
    }
    const r = await api('POST', `/lessons/${id}/complete`, { answers: userAnswers });
    if (r.score >= 0.5) {
      sfx.play('fanfare');
      triggerConfetti();
    } else {
      sfx.play('warn');
    }
    resultContainer.replaceChildren(
      h('div', { class: 'card next', style: 'margin-top:16px;' },
        h('h2', { class: r.score >= 0.5 ? 'good' : 'warn', text: `${Math.round(r.score * 100)}% Score ${r.coins ? ` · +${r.coins} 🪙` : ''}` }),
        h('p', { style: 'font-weight:700;', text: `💡 ${r.takeaway}` }),
        h('p', { style: 'color:var(--brand-dark);', text: `👉 ${r.action}` }),
        h('button', { class: 'primary block', style: 'margin-top:12px;', onclick: showLessons }, `🎉 ${t('done')}`)
      )
    );
  };

  renderView(
    'lessons',
    backBtn(showLessons),
    img(l.image, 'hero'),
    h('div', { class: 'card' },
      h('h1', { text: l.title }),
      h('div', { class: 'row', style: 'margin:10px 0;' },
        listenBtn(l.audioId, `${l.title}. ${l.story}. ${l.takeaway}`)
      ),
      h('p', { style: 'font-size:16px; line-height:1.6;', text: l.story }),
      h('div', { style: 'background:var(--brand-soft); border-left:4px solid var(--brand); padding:10px 14px; border-radius:0 8px 8px 0; margin:12px 0;' },
        h('strong', {}, '💡 ' + (lang === 'hi' ? 'सीख: ' : 'Takeaway: ')),
        h('span', {}, l.takeaway)
      )
    ),
    h('h2', { text: lang === 'hi' ? 'प्रश्नोत्तरी (Quiz)' : 'Check Your Understanding' }),
    quizCards,
    h('button', { class: 'primary block', style: 'margin-top:14px;', onclick: onCheck }, `✨ ${t('check')}`),
    resultContainer
  );
}

// ==========================================================================
// SCREEN 6: GAMES HUB (Kirana Basket, Spot the Trap, Story Choices)
// ==========================================================================
function showGames(activeTab = 'kirana') {
  current = () => showGames(activeTab);
  const tabs = [
    ['kirana', t('kirana'), '🛒', kiranaGame],
    ['trap', t('trap'), '🛡️', trapGame],
    ['story', t('story'), '📖', storyGame],
  ];

  const bodyMount = h('div');
  const tabBar = h('div', { class: 'row', style: 'gap:8px; margin:14px 0;' },
    tabs.map(([k, label, icon, fn]) =>
      h('button', {
        class: `top-btn ${activeTab === k ? 'chosen' : ''}`,
        style: 'flex:1; min-height:42px; font-size:13px; font-weight:700;',
        onclick: () => {
          activeTab = k;
          showGames(k);
        },
      }, `${icon} ${label}`)
    )
  );

  renderView(
    'games',
    backBtn(showHome),
    h('div', { class: 'card hero-banner' },
      h('h1', { text: `🎲 ${t('games')}` }),
      h('p', { text: lang === 'hi' ? 'अभ्यास करें, सिक्के जीतें और वित्तीय जाल से बचें।' : 'Play interactive mini-games to build real-world money habits.' })
    ),
    tabBar,
    bodyMount
  );

  const selected = tabs.find(([k]) => k === activeTab);
  if (selected) selected[3](bodyMount);
}

// Game 1: Kirana Basket (Grocery Budgeting & Gullak Pot)
async function kiranaGame(body) {
  const g = await api('GET', '/games/kirana');
  const picked = new Set();
  const resContainer = h('div');

  const budgetDisplay = h('div', { class: 'budget-meter-header' },
    h('span', { class: 'quiet', text: t('total') }),
    h('span', { class: 'amount', text: `₹0 / ₹${g.budget}` })
  );
  const barFill = h('i', { style: 'width:0%;' });
  const barContainer = h('div', { class: 'bar' }, barFill);

  const refreshUI = () => {
    const chosenItems = g.items.filter((i) => picked.has(i.id));
    const sum = chosenItems.reduce((acc, i) => acc + i.price, 0);
    budgetDisplay.querySelector('.amount').textContent = `₹${sum} / ₹${g.budget}`;
    const pct = Math.min(100, (sum / g.budget) * 100);
    barFill.style.width = `${pct}%`;
    barContainer.className = `bar ${sum > g.budget ? 'over' : ''}`;
  };

  const itemCards = g.items.map((item) => {
    const card = h('div', {
      class: `kirana-item-card ${item.saving ? 'saving-item' : ''}`,
      onclick: () => {
        if (picked.has(item.id)) picked.delete(item.id);
        else picked.add(item.id);
        card.classList.toggle('in-basket');
        refreshUI();
      },
    },
      h('div', { class: 'row between' },
        h('span', { class: 'kirana-item-name', text: item.name }),
        h('button', {
          class: 'icon voice-listen-btn',
          style: 'min-width:32px; width:32px; height:32px; min-height:32px; font-size:12px;',
          onclick: (e) => {
            e.stopPropagation();
            speak(`kirana:${item.id}`, `${item.name}: ₹${item.price}`);
          },
        }, '🔊')
      ),
      h('div', { class: 'row between', style: 'margin-top:8px;' },
        h('span', { class: 'kirana-item-price', text: `₹${item.price}` }),
        h('span', {
          class: `kirana-tag ${item.need ? 'need' : item.saving ? 'pot' : 'want'}`,
          text: item.need
            ? (lang === 'hi' ? 'ज़रूरत' : 'Need')
            : item.saving
            ? (lang === 'hi' ? 'गुल्लक' : 'Pot')
            : (lang === 'hi' ? 'चाहत' : 'Want')
        })
      )
    );
    return card;
  });

  const checkBasket = async () => {
    const r = await api('POST', '/games/kirana', { items: [...picked] });
    if (r.score === 1) {
      sfx.play('fanfare');
      triggerConfetti();
    } else {
      sfx.play('warn');
    }
    resContainer.replaceChildren(
      h('div', { class: 'card next', style: 'margin-top:16px;' },
        h('h2', { class: r.score === 1 ? 'good' : 'warn', text: `${Math.round(r.score * 100)}% ${r.coins ? ` · +${r.coins} 🪙` : ''}` }),
        h('p', { style: 'font-weight:700;', text: r.takeaway }),
        h('ul', { style: 'padding-left:20px; line-height:1.8; margin-top:8px;' },
          h('li', { text: r.needsOk ? '✅ ' + (lang === 'hi' ? 'सभी ज़रूरी सामान चुने गए' : 'All essentials covered') : '⚠️ ' + (lang === 'hi' ? 'कुछ बुनियादी ज़रूरतें छूट गईं' : 'Some essentials missing') }),
          h('li', { text: r.within ? '✅ ' + (lang === 'hi' ? 'बजट के अंदर' : 'Within budget') : '⚠️ ' + (lang === 'hi' ? 'बजट से अधिक खर्च' : 'Over budget') }),
          h('li', { text: r.saved ? '✅ ' + (lang === 'hi' ? 'गुल्लक में बचत डाली गई' : 'Saved in gullak pot') : '💡 ' + (lang === 'hi' ? 'गुल्लक के लिए भी कुछ बचाएँ' : 'Remember to set aside savings') })
        )
      )
    );
  };

  body.replaceChildren(
    h('div', { class: 'card' },
      h('h3', { text: g.intro }),
      h('div', { class: 'row', style: 'margin:8px 0;' },
        listenBtn(g.audioId, g.intro)
      )
    ),
    h('div', { class: 'budget-meter-container' },
      budgetDisplay,
      barContainer
    ),
    h('div', { class: 'kirana-grid' }, itemCards),
    h('button', { class: 'primary block', style: 'margin-top:14px;', onclick: checkBasket }, `🧺 ${t('check')}`),
    resContainer
  );
  refreshUI();
}

// Game 2: Spot the Trap (Tinder-style Swipeable Loan Offer Cards)
async function trapGame(body) {
  const g = await api('GET', '/games/trap');
  const userAnswers = {};
  const area = h('div');

  const step = async (idx) => {
    if (idx >= g.offers.length) {
      const r = await api('POST', '/games/trap', { answers: userAnswers });
      if (r.score >= 0.8) {
        sfx.play('fanfare');
        triggerConfetti();
      } else {
        sfx.play('warn');
      }
      return area.replaceChildren(
        h('div', { class: 'card next' },
          h('h2', { class: r.score >= 0.8 ? 'good' : 'warn', text: `${Math.round(r.score * 100)}% Defense Score ${r.coins ? ` · +${r.coins} 🪙` : ''}` }),
          h('p', { style: 'font-weight:700;', text: r.takeaway }),
          h('h4', { style: 'margin-top:12px;', text: lang === 'hi' ? 'समीक्षा व नियम:' : 'Review & Safety Rules:' }),
          ...r.review.map((item) =>
            h('p', { class: item.correct ? 'good' : 'bad', style: 'font-size:14px;' },
              `${item.correct ? '✅' : '❌'} ${item.clue}`
            )
          ),
          h('button', { class: 'primary block', style: 'margin-top:14px;', onclick: () => showGames('trap') }, `🔄 ${lang === 'hi' ? 'दोबारा खेलें' : 'Play Again'}`)
        )
      );
    }

    const offer = g.offers[idx];
    const cardEl = h('div', { class: 'trap-card' },
      h('div', { class: 'row between' },
        h('span', { class: 'chip open', text: `${idx + 1} / ${g.offers.length}` }),
        listenBtn(offer.audioId, offer.text)
      ),
      h('div', { style: 'padding:14px 0;' },
        h('h3', { style: 'font-size:18px; line-height:1.5;', text: offer.text })
      ),
      h('div', { class: 'trap-action-bar' },
        h('button', {
          class: 'trap-btn',
          onclick: () => {
            sfx.play('warn');
            userAnswers[offer.id] = true;
            step(idx + 1);
          },
        }, `⚠️ ${t('yes')}`),
        h('button', {
          class: 'safe-btn',
          onclick: () => {
            sfx.play('coin');
            userAnswers[offer.id] = false;
            step(idx + 1);
          },
        }, `✅ ${t('no')}`)
      )
    );

    area.replaceChildren(
      h('div', { class: 'card', style: 'margin-bottom:12px;' },
        h('h3', { text: t('trapQ') }),
        h('p', { class: 'quiet', text: lang === 'hi' ? 'क्या यह ऑफ़र असली है या ठगी का जाल?' : 'Is this offer genuine or a predatory loan trap?' })
      ),
      cardEl
    );
  };

  body.replaceChildren(area);
  step(0);
}

// Game 3: Story Choices (Real-life dilemmas)
async function storyGame(body) {
  const g = await api('GET', '/games/story');
  const userAnswers = {};
  const area = h('div');

  const step = async (idx) => {
    if (idx >= g.stories.length) {
      const r = await api('POST', '/games/story', { answers: userAnswers });
      if (r.score === 1) {
        sfx.play('fanfare');
        triggerConfetti();
      } else {
        sfx.play('warn');
      }
      return area.replaceChildren(
        h('div', { class: 'card next' },
          h('h2', { class: 'good', text: `${Math.round(r.score * 100)}% Story Master ${r.coins ? ` · +${r.coins} 🪙` : ''}` }),
          ...r.review.map((item) =>
            h('p', { class: item.safe ? 'good' : 'bad', style: 'font-size:15px; margin:8px 0;' },
              `${item.safe ? '✅' : '⚠️'} ${item.result}`
            )
          ),
          h('button', { class: 'primary block', style: 'margin-top:14px;', onclick: () => showGames('story') }, `🔄 ${lang === 'hi' ? 'दोबारा खेलें' : 'Play Again'}`)
        )
      );
    }

    const storyItem = g.stories[idx];
    const pickOption = (choiceId) => {
      userAnswers[storyItem.id] = choiceId;
      step(idx + 1);
    };

    area.replaceChildren(
      h('div', { class: 'card' },
        h('div', { class: 'row between', style: 'margin-bottom:10px;' },
          h('span', { class: 'chip open', text: `Story ${idx + 1} of ${g.stories.length}` }),
          h('div', { class: 'row' },
            listenBtn(storyItem.audioId, storyItem.scene),
            mic(storyItem.choices.map((c) => c.id), (matched) => pickOption(matched))
          )
        ),
        h('h3', { style: 'font-size:17px; line-height:1.5;', text: storyItem.scene }),
        h('div', { style: 'margin-top:16px;' },
          storyItem.choices.map((c) =>
            h('button', { class: 'block', onclick: () => pickOption(c.id) }, c.text)
          )
        )
      )
    );
  };

  body.replaceChildren(area);
  step(0);
}

// ==========================================================================
// SCREEN 7: SCORE TREE (The Living Bonsai of Credit)
// ==========================================================================
async function showTree() {
  current = showTree;
  me = await api('GET', '/me');
  const tr = me.tree;

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const monthInput = h('input', {
    type: 'month',
    value: currentYearMonth,
    'aria-label': t('month'),
  });

  const record = (status) => async () => {
    const res = await api('POST', '/tree', { month: monthInput.value, status });
    if (status === 'on_time') {
      sfx.play('coin');
      triggerConfetti();
    } else {
      sfx.play('warn');
    }
    showTree();
  };

  // Fast forward simulator
  const fastForward6Months = async () => {
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = d.toISOString().slice(0, 7);
      await api('POST', '/tree', { month: mStr, status: 'on_time' });
    }
    sfx.play('fanfare');
    triggerConfetti();
    toast(lang === 'hi' ? '✨ 6 महीने पूरे हुए! ट्री खिल गया!' : '✨ 6 On-time months recorded! Tree bloomed!');
    showTree();
  };

  // Interactive Tree SVG Graphic
  const treeSvg = (stage, rings) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160" width="180" height="144">
      <!-- Ground mound -->
      <ellipse cx="100" cy="140" rx="70" ry="14" fill="#14532d" opacity="0.3"/>
      <!-- Concentric Rings in Trunk -->
      <circle cx="100" cy="115" r="28" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
      <circle cx="100" cy="115" r="22" fill="#92400e" stroke="#fef08a" stroke-width="${Math.min(rings, 3)}"/>
      <circle cx="100" cy="115" r="16" fill="#b45309" stroke="#fed7aa" stroke-width="1.5"/>
      <circle cx="100" cy="115" r="10" fill="#d97706"/>
      <!-- Tree Crown Foliage according to stage -->
      ${stage === 'seed'
        ? `<ellipse cx="100" cy="130" rx="8" ry="12" fill="#78350f"/>
           <circle cx="100" cy="120" r="4" fill="#84cc16"/>`
        : stage === 'sprout'
        ? `<path d="M100 115 C90 95 80 95 82 85 C94 88 98 100 100 115 Z" fill="#22c55e"/>
           <path d="M100 115 C110 95 120 95 118 85 C106 88 102 100 100 115 Z" fill="#4ade80"/>`
        : stage === 'sapling'
        ? `<circle cx="100" cy="65" r="32" fill="#16a34a"/>
           <circle cx="82" cy="72" r="24" fill="#22c55e"/>
           <circle cx="118" cy="72" r="24" fill="#15803d"/>`
        : `<!-- Full blooming tree with flowers -->
           <circle cx="100" cy="55" r="40" fill="#059669"/>
           <circle cx="75" cy="65" r="30" fill="#10b981"/>
           <circle cx="125" cy="65" r="30" fill="#047857"/>
           <circle cx="85" cy="45" r="8" fill="#f43f5e"/>
           <circle cx="115" cy="45" r="8" fill="#fbbf24"/>
           <circle cx="100" cy="30" r="7" fill="#f43f5e"/>
           <circle cx="130" cy="60" r="6" fill="#fbbf24"/>
           <circle cx="70" cy="60" r="6" fill="#f43f5e"/>`
      }
    </svg>`;
  };

  const treeEl = document.createElement('div');
  treeEl.innerHTML = treeSvg(tr.stage, tr.rings);

  renderView(
    'tree',
    backBtn(showHome),
    h('div', { class: 'score-tree-art' },
      treeEl.firstElementChild,
      h('h2', { style: 'margin:8px 0;', text: `🌳 ${t('tree')}: ${tr.rings} ${t('rings')}` }),
      h('span', { class: 'chip open', style: 'text-transform:capitalize;' }, `Stage: ${tr.stage}`),
      tr.paused &&
        h('div', { class: 'tree-paused-banner' },
          '☂️ ',
          h('span', {}, t('paused'))
        )
    ),

    // Rings Visual Display
    h('div', { class: 'card' },
      h('h3', { text: lang === 'hi' ? 'मासिक छल्ले (Rings):' : 'Payment History Rings:' }),
      tr.months.length > 0
        ? h('div', { class: 'rings-grid' },
            tr.months.map((m) =>
              h('div', {
                class: `ring-node ${m.status === 'missed' ? 'missed' : ''}`,
                title: `${m.month}: ${m.status}`,
              }, m.month.slice(5))
            )
          )
        : h('p', { class: 'quiet', text: lang === 'hi' ? 'अभी तक कोई महीना दर्ज नहीं हुआ है।' : 'No months recorded yet.' })
    ),

    // Log Payment Action
    h('div', { class: 'card' },
      h('h3', { text: lang === 'hi' ? 'महीने का रिकॉर्ड जोड़ें:' : 'Log Monthly Bill Payment:' }),
      monthInput,
      h('div', { class: 'row', style: 'margin-top:10px;' },
        h('button', { class: 'primary', style: 'flex:1;', onclick: record('on_time') }, `✅ ${t('ontime')}`),
        h('button', { style: 'flex:1;', onclick: record('missed') }, `⚠️ ${t('missed')}`)
      )
    ),

    // Fast-Forward Simulator (For fast demo & test evaluation)
    h('div', { class: 'card gold-accent' },
      h('h3', { text: `⏩ ${t('treeSim')}` }),
      h('p', { class: 'quiet', text: t('treeSimNote') }),
      h('button', { class: 'gold-btn block', style: 'margin-top:8px;', onclick: fastForward6Months }, `🚀 ${t('treeSim')}`)
    )
  );
}

// ==========================================================================
// SCREEN 8: DOCUMENT DETECTIVE (Quarterly Safety Check-up)
// ==========================================================================
async function showSafety() {
  current = showSafety;
  const s = await api('GET', '/safety');

  const onOutcome = async (stepId, outcome) => {
    const res = await api('POST', `/safety/${stepId}`, { outcome });
    if (res.complete) {
      if (!res.help) {
        sfx.play('fanfare');
        triggerConfetti();
      } else {
        sfx.play('warn');
      }
      toast(`+${res.coins} 🪙`);
    } else {
      sfx.play('tap');
    }
    showSafety();
  };

  renderView(
    'safety',
    backBtn(showHome),
    h('div', { class: 'card hero-banner' },
      h('h1', { text: `🔎 ${t('safety')}` }),
      h('p', { text: lang === 'hi' ? 'हर 3 महीने में आधिकारिक सरकारी पोर्टल पर अपने कागज़ात की सुरक्षा जाँचिए।' : 'Quarterly official check-up on government portals. The app never holds your documents.' })
    ),

    // Steps
    s.steps.map((st, idx) =>
      h('div', { class: 'safety-step-card' },
        h('div', { class: 'row between' },
          h('h3', { text: `${idx + 1}. ${st.title}` }),
          listenBtn(st.audioId, `${st.title}. ${st.how.join(' ')}`)
        ),
        h('ol', { style: 'padding-left:20px; line-height:1.7; margin:8px 0;' },
          st.how.map((pt) => h('li', { text: pt }))
        ),
        h('a', { class: 'btn block', href: st.url, target: '_blank', rel: 'noopener noreferrer' },
          `🌐 ${t('openSite')} ↗`
        ),
        h('div', { class: 'row', style: 'margin-top:10px;' },
          h('button', {
            class: `safe-btn ${st.outcome === 'familiar' ? 'chosen' : ''}`,
            style: 'flex:1;',
            onclick: () => onOutcome(st.id, 'familiar'),
          }, `✅ ${t('familiar')}`),
          h('button', {
            class: `trap-btn ${st.outcome === 'unfamiliar' ? 'chosen' : ''}`,
            style: 'flex:1;',
            onclick: () => onOutcome(st.id, 'unfamiliar'),
          }, `⚠️ ${t('unfamiliar')}`)
        )
      )
    ),

    // Emergency guidance if unfamiliar
    s.help &&
      h('div', { class: 'emergency-alert-box' },
        h('h2', { style: 'color:var(--bad-dark);', text: `🚨 ${t('emergencyHelp')}` }),
        h('div', { class: 'emergency-contacts-row' },
          h('a', { class: 'emergency-btn', href: 'tel:181' }, `📞 ${t('womenHelpline')}`),
          h('a', { class: 'emergency-btn', href: 'tel:15100' }, `⚖️ ${t('legalAid')}`)
        ),
        h('ul', { style: 'padding-left:20px; line-height:1.8; margin-top:12px; font-weight:600;' },
          s.help.map((pt) => h('li', { text: pt }))
        )
      ),

    // All clear celebration
    s.allFamiliar &&
      h('div', { class: 'card next' },
        h('h2', { class: 'good', text: `🛡️ ${s.allFamiliar}` }),
        h('p', { class: 'quiet', text: lang === 'hi' ? 'डिटेक्टिव बैज सुरक्षित रखा गया। अगली जाँच 3 महीने बाद।' : 'Detective badge awarded. Next verification scheduled in 3 months.' })
      )
  );
}

// ==========================================================================
// SCREEN 9: SETTINGS & PRIVACY
// ==========================================================================
function showSettings() {
  current = showSettings;
  renderView(
    null,
    backBtn(showHome),
    h('div', { class: 'card' },
      h('h1', { text: t('settings') }),
      h('p', { class: 'quiet', text: `${lang === 'hi' ? 'उपयोगकर्ता:' : 'Account:'} ${me.nick}` })
    ),
    h('div', { class: 'card' },
      h('h3', { text: lang === 'hi' ? 'भाषा (Language)' : 'Language' }),
      h('button', {
        class: 'primary block',
        onclick: async () => {
          lang = lang === 'hi' ? 'en' : 'hi';
          store.set('lang', lang);
          if (token) {
            await api('PATCH', '/me', { lang });
            me = await api('GET', '/me');
          }
          document.documentElement.lang = lang;
          showSettings();
        },
      }, `🌐 Switch to ${t('lang')}`)
    ),
    h('div', { class: 'card' },
      h('h3', { text: lang === 'hi' ? 'क्लाउडिनरी मीडिया स्थिति' : 'Cloudinary Media Architecture' }),
      h('p', { class: 'quiet', text: t('cldInfo') }),
      h('div', { class: 'chip done', style: 'margin-top:6px;' }, '✓ ' + t('cldActive'))
    ),
    h('div', { class: 'card' },
      h('h3', { text: lang === 'hi' ? 'ऐप गाइड व दौरा' : 'App Guide & Tour' }),
      h('p', { class: 'quiet', text: lang === 'hi' ? 'क्रेडसाथी का परिचय और ऐप के मुख्य फीचर्स का दौरा दोबारा देखें।' : 'Replay CredSaathi intro and interactive tour of all key features.' }),
      h('button', {
        class: 'primary block',
        style: 'background:linear-gradient(135deg, var(--brand) 0%, #0d9488 100%);',
        onclick: () => {
          showHome().then(() => startTutorial(true));
        }
      }, '✨ ' + (lang === 'hi' ? 'क्रेडसाथी दौरा दोबारा शुरू करें' : 'Replay CredSaathi Tour'))
    ),
    h('div', { class: 'card' },
      h('h3', { text: lang === 'hi' ? 'सत्र' : 'Session' }),
      h('button', { class: 'block', onclick: logout }, `🚪 ${t('logout')}`)
    ),
    h('div', { class: 'card', style: 'border-color:var(--bad);' },
      h('h3', { style: 'color:var(--bad-dark);', text: lang === 'hi' ? 'डेटा अधिकार' : 'Right to be Forgotten' }),
      h('p', { class: 'quiet', text: lang === 'hi' ? 'आप कभी भी अपना सारा डेटा मिटा सकती हैं।' : 'You can delete all your progress, recordings and account at any time.' }),
      h('button', {
        class: 'rec block',
        onclick: async () => {
          if (confirm(t('delAsk'))) {
            await api('DELETE', '/me');
            logout();
          }
        },
      }, `🗑️ ${t('del')}`)
    )
  );
}

// ---------- Service Worker & Boot ----------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    reg.update().catch(() => {});
  }).catch(() => {});
}

document.documentElement.lang = lang;

(async () => {
  if (token) {
    try {
      me = await api('GET', '/me');
      lang = me.lang;
      store.set('lang', lang);
      return showHome();
    } catch {
      /* fallback to login */
    }
  }
  showLogin();
})();
