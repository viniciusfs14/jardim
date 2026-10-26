'use strict';

// Personalize as mensagens sem alterar a lógica do jardim.
const MESSAGES = {
  water: { icon: 'droplet', title: 'Um pouquinho de carinho', text: 'Você regou o jardim. E olha... eu tentei fazer algo simples, mas lembrei que era pra você. Aí já viu, né? KKKK' },
  sun: { icon: 'sun', title: 'Deixou tudo mais bonito', text: 'Curiosamente, algumas coisas ficam mais bonitas quando você aparece. Não fui eu que inventei essa regra, viu? ♡' },
  butterfly: { icon: 'butterfly', title: 'Uma descoberta fofinha', text: 'Tem gente que continua tendo o dom de deixar uma conversa mais leve, mesmo depois de tanto tempo. Suspeito que você saiba de quem estou falando...' },
  note: { icon: 'letter', title: 'Bilhetinho secreto', text: 'Relatório oficial: um engenheiro eletricista está sorrindo feito bobo enquanto prepara uma surpresa pra você. Pelo visto, hoje o coração resolveu comandar o projeto. 🌻' }
};

const $ = id => document.getElementById(id);
const actions = Object.keys(MESSAGES);
const completed = new Set();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let currentFocus = null;
let entranceTimer = null;
let letterTimer = null;
let reactionTimer = null;

for (let i = 0; i < 14; i++) {
  const petal = document.createElement('div');
  petal.className = 'petal';
  petal.style.transform = `rotate(${i * 360 / 14}deg)`;
  $('petals').appendChild(petal);
}

function showOnly(id) {
  pingo.stop();
  ['intro', 'garden', 'farewell', 'finale'].forEach(name => {
    $(name).classList.toggle('hidden', name !== id);
  });
  const heading = $(id).querySelector('h1, h2');
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}

function update() {
  const n = completed.size;
  $('count').textContent = `${n} / ${actions.length}`;
  $('fill').style.width = `${n / actions.length * 100}%`;
  $('progress').setAttribute('aria-valuenow', String(n));
  $('progress').setAttribute('aria-valuetext', `${n} de 4 carinhos recebidos`);
  $('scene').style.setProperty('--growth', n / actions.length);
  $('sunflower').classList.toggle('awake', n === actions.length);
  $('sunflower').setAttribute('aria-label', n === 4 ? 'Pingo, um girassol feliz, completamente florido' : `Pingo crescendo: ${n} de 4 carinhos recebidos`);
  $('finalButton').classList.toggle('hidden', n !== actions.length);
  $('hint').textContent = n === actions.length
    ? 'Olha só! Seu girassol floresceu. Tem uma mensagem esperando por você. 🌻'
    : `${n ? 'Já está ficando mais bonito. ' : ''}Escolha ${n ? 'outro carinho' : 'um carinho'} para o seu jardim. 🌱`;
}

function modalOpen(data) {
  $('letterPingo').textContent = PINGO_LINES.note;
  currentFocus = document.activeElement;
  $('modal').querySelector('[role="dialog"]').removeAttribute('aria-describedby');
  const icon = document.createElement('img');
  icon.className = 'illustration';
  icon.src = `assets/icons/${data.icon}.svg`;
  icon.alt = '';
  icon.width = 64;
  icon.height = 64;
  $('modalIcon').replaceChildren(icon);
  $('modalTitle').textContent = data.title;
  $('modalText').textContent = data.text;
  $('openLetter').classList.remove('opening');
  $('openLetter').classList.remove('hidden');
  $('letterContent').classList.add('hidden');
  $('modalIcon').classList.add('hidden');
  $('modal').classList.remove('hidden');
  $('app').inert = true;
  document.body.classList.add('modal-open');
  $('openLetter').focus();
}

function modalClose() {
  clearTimeout(letterTimer);
  $('openLetter').classList.remove('opening');
  $('modal').classList.add('hidden');
  $('app').inert = false;
  document.body.classList.remove('modal-open');
  if (currentFocus?.isConnected) currentFocus.focus({ preventScroll: true });
}

function particles(kind, count) {
  if (reducedMotion.matches) return;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = `particle ${kind}`;
    particle.setAttribute('aria-hidden', 'true');
    particle.style.setProperty('--x', `${20 + Math.random() * 60}%`);
    particle.style.setProperty('--delay', `${Math.random() * 0.6}s`);
    particle.style.setProperty('--turn', `${Math.random() * 300 - 150}deg`);
    particle.textContent = kind === 'rain' ? '' : ['✦', '♡', '✿'][i % 3];
    $('effects').appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
  }
}

function care(button) {
  if (!$('modal').classList.contains('hidden')) return;
  const action = button.dataset.action;
  const firstTime = !completed.has(action);
  completed.add(action);
  button.classList.add('done');
  button.setAttribute('aria-pressed', 'true');
  $('scene').classList.add(`has-${action}`);
  clearTimeout(reactionTimer);
  actions.forEach(name => $('sunflower').classList.remove(`react-${name}`));
  $('sunflower').classList.add(`react-${action}`);
  reactionTimer = setTimeout(() => $('sunflower').classList.remove(`react-${action}`), 2600);
  if (action === 'water') particles('rain', 22);
  if (firstTime && completed.size === actions.length) {
    particles('confetti', 26);
    $('scene').classList.add('flourished');
    sound.chime();
  }
  update();
  pingo.sayAction(action, firstTime && completed.size === actions.length);
  $('careMessage').open = false;
  if (action === 'note') {
    $('careMessage').classList.add('hidden');
    modalOpen(MESSAGES[action]);
  } else {
    $('careTitle').textContent = MESSAGES[action].title;
    $('careText').textContent = MESSAGES[action].text;
    $('careMessage').classList.remove('hidden');
  }
}

$('enter').addEventListener('click', () => {
  if (entranceTimer !== null) return;
  $('intro').classList.add('entering');
  $('enter').disabled = true;
  entranceTimer = setTimeout(() => {
    entranceTimer = null;
    $('enter').disabled = false;
    $('intro').classList.remove('entering');
    showOnly('garden');
    pingo.say(PINGO_LINES.welcome);
  }, reducedMotion.matches ? 0 : 950);
});

document.querySelectorAll('[data-action]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => care(button));
});
$('openLetter').addEventListener('click', () => {
  if ($('openLetter').classList.contains('opening')) return;
  $('openLetter').classList.add('opening');
  letterTimer = setTimeout(() => {
    $('openLetter').classList.add('hidden');
    $('letterContent').classList.remove('hidden');
    $('modalIcon').classList.remove('hidden');
    $('modal').querySelector('[role="dialog"]').setAttribute('aria-describedby', 'modalText');
    $('modalOk').focus();
    sound.chime();
  }, reducedMotion.matches ? 0 : 550);
});
$('hiddenFlower').addEventListener('click', () => {
  const expanded = $('flowerSecret').classList.contains('hidden');
  $('flowerSecret').classList.toggle('hidden', !expanded);
  $('hiddenFlower').setAttribute('aria-expanded', String(expanded));
});
$('modalOk').addEventListener('click', modalClose);
$('closeModal').addEventListener('click', modalClose);
$('modal').addEventListener('click', event => {
  if (event.target === $('modal')) modalClose();
});
document.addEventListener('keydown', event => {
  if ($('modal').classList.contains('hidden')) return;
  if (event.key === 'Escape') modalClose();
  if (event.key === 'Tab') {
    const first = $('closeModal');
    const last = $('letterContent').classList.contains('hidden') ? $('openLetter') : $('modalOk');
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
$('finalButton').addEventListener('click', () => {
  if (completed.size === actions.length) {
    showOnly('farewell');
    pingo.say(PINGO_LINES.farewell);
    sound.chime();
  }
});
$('openFinalLetter').addEventListener('click', () => showOnly('finale'));
$('farewellBack').addEventListener('click', () => showOnly('garden'));
$('extra').addEventListener('click', () => {
  const expanded = $('secret').classList.contains('hidden');
  $('secret').classList.toggle('hidden', !expanded);
  $('extra').setAttribute('aria-expanded', String(expanded));
  $('extra').textContent = expanded ? 'guardar segredinho ♡' : 'psiu... tem um segredinho ↗';
});
$('backGarden').addEventListener('click', () => showOnly('garden'));
$('restart').addEventListener('click', () => {
  pingo.reset();
  clearTimeout(entranceTimer);
  clearTimeout(reactionTimer);
  entranceTimer = null;
  $('enter').disabled = false;
  $('intro').classList.remove('entering');
  $('scene').classList.remove('flourished');
  actions.forEach(action => $('sunflower').classList.remove(`react-${action}`));
  $('careMessage').classList.add('hidden');
  $('careMessage').open = false;
  $('flowerSecret').classList.add('hidden');
  $('hiddenFlower').setAttribute('aria-expanded', 'false');
  modalClose();
  completed.clear();
  document.querySelectorAll('[data-action]').forEach(button => {
    button.classList.remove('done');
    button.setAttribute('aria-pressed', 'false');
  });
  actions.forEach(action => $('scene').classList.remove(`has-${action}`));
  $('effects').replaceChildren();
  $('secret').classList.add('hidden');
  $('extra').setAttribute('aria-expanded', 'false');
  $('extra').textContent = 'psiu... tem um segredinho ↗';
  update();
  showOnly('intro');
});
// Áudio original sintetizado localmente; começa apenas por escolha da visitante.
class GardenSound {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.timer = null;
    this.session = 0;
  }

  async toggle() {
    if (this.enabled) { this.stop(); return; }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { this.unavailable(); return; }
    const session = ++this.session;
    this.enabled = true;
    this.render();
    try {
      const context = new AudioContext();
      this.context = context;
      await context.resume();
      if (session !== this.session) return;
      const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      const breeze = context.createBufferSource();
      breeze.buffer = buffer;
      breeze.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      const volume = context.createGain();
      volume.gain.value = 0.025;
      breeze.connect(filter).connect(volume).connect(context.destination);
      breeze.start();
      this.chirp();
      this.timer = setInterval(() => this.chirp(), 7000);
      if (document.hidden) await context.suspend();
    } catch {
      if (session === this.session) { this.stop(); this.unavailable(); }
    }
  }

  tone(frequency, start, duration, volume, endFrequency = frequency) {
    const context = this.context;
    if (!this.enabled || !context || context.state !== 'running') return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  chirp() {
    if (!this.context || document.hidden) return;
    const now = this.context.currentTime;
    this.tone(1800, now, .16, .018, 2600);
    this.tone(2200, now + .22, .14, .012, 1700);
  }

  chime() {
    if (!this.context) return;
    [523.25, 659.25, 783.99].forEach((frequency, i) => {
      this.tone(frequency, this.context.currentTime + i * .13, .65, .035);
    });
  }

  stop() {
    this.session++;
    this.enabled = false;
    clearInterval(this.timer);
    if (this.context) this.context.close().catch(() => {});
    this.context = null;
    this.render();
  }

  unavailable() {
    $('soundToggle').textContent = '♫ som indisponível';
    $('soundToggle').setAttribute('aria-label', 'Sons indisponíveis neste navegador');
    $('soundToggle').setAttribute('aria-pressed', 'false');
  }

  render() {
    $('soundToggle').textContent = this.enabled ? '♫ som ligado' : '♫ som desligado';
    $('soundToggle').setAttribute('aria-pressed', String(this.enabled));
    $('soundToggle').setAttribute('aria-label', this.enabled ? 'Desativar sons do jardim' : 'Ativar sons do jardim');
  }
}

const pingo = new PingoCharacter();
const sound = new GardenSound();
$('soundToggle').addEventListener('click', () => sound.toggle());
document.addEventListener('visibilitychange', () => {
  if (!sound.enabled || !sound.context) return;
  const operation = document.hidden ? sound.context.suspend() : sound.context.resume();
  operation.catch(() => sound.stop());
});
window.addEventListener('pagehide', () => sound.stop());

// Pequenas flores surgem somente quando os quatro carinhos estão completos.
for (let i = 0; i < 16; i++) {
  const flower = document.createElement('span');
  flower.textContent = '✿';
  flower.style.setProperty('--position', `${4 + i * 6}%`);
  flower.style.setProperty('--bottom', `${(i % 3) * 12}px`);
  flower.style.setProperty('--size', `${14 + (i % 4) * 4}px`);
  flower.style.setProperty('--bloom-delay', `${i * .055}s`);
  $('meadow').appendChild(flower);
}

update();

