'use strict';

// Frases curtas, com pausas naturais. Personalize a voz do personagem aqui.
const PINGO_LINES = {
  welcome: 'Sara? Oi… eu sou o Pingo! Ele me falou de você. Chega mais. Esse cantinho é seu.',
  farewell: 'Sara… minha parte era florescer. Agora é com ele. Tem uma cartinha te esperando. Vai lá. Eu cuido do jardim pra você.',
  water: 'Ah… que delícia! Era um golinho desses que faltava. Obrigado, Sara.',
  sun: 'Hum… agora sim. Um solzinho no rosto. Acho que eu podia ficar aqui o dia inteiro.',
  butterfly: 'Olha quem chegou! Eu trouxe uma amiga. Fiquei com um pouquinho de vergonha de te conhecer sozinho.',
  note: 'Psiu… esse bilhete é pra você. Ele que escreveu, tá? Eu só prometi entregar com carinho.',
  bloom: 'Sara, olha só! Eu floresci! Foi você. Vem ver o que estava guardado aqui.',
  repeats: {
    water: ['Mais água? Você cuida mesmo de mim, hein. Daqui a pouco eu viro um jardim inteiro!', 'Prontinho… agora eu tô bem cuidado. Pode ficar aqui comigo um pouquinho.'],
    sun: ['Você também gosta desse quentinho? Eu acho que o jardim fica mais bonito com você aqui.', 'Acho que achei meu lugar favorito. Bem aqui, nesse solzinho, fazendo companhia pra você.'],
    butterfly: ['Ela voltou! Acho que gostou de você também. Bom gosto ela tem.', 'Vai com calma, borboleta… a Sara acabou de chegar. A gente tem tempo.'],
    note: ['Quer ler de novo? Pode. Tem carinho que dá vontade de guardar mais de uma vez.']
  },
  chat: [
    'Sara… posso te contar uma coisa? Ele ficou todo bobo fazendo esse jardim. Mas faz de conta que não fui eu que contei.',
    'Eu ensaiei um oi bem bonito. Aí você chegou… e eu esqueci tudo. Acontece nas melhores flores.',
    'Pode ficar. Sério. Hoje eu não tenho nada mais importante pra fazer do que te fazer companhia.',
    'Eu sou pequenininho… mas esse carinho aqui? Esse não coube só em mim. Virou um jardim.',
    'Se esse cantinho te arrancou um sorriso… pronto. Meu dia já ficou mais bonito.'
  ]
};

class PingoCharacter {
  constructor() {
    this.current = PINGO_LINES.welcome;
    this.chatIndex = 0;
    this.actionCounts = {};
    this.utterance = null;
    this.audio = null;
    this.queue = [];
    this.busy = false;
    this.animationTimer = null;
    this.watchdog = null;
    this.generation = 0;
    this.synthesis = window.speechSynthesis;
    this.hasSynthesis = Boolean(this.synthesis && window.SpeechSynthesisUtterance);
    this.recordings = window.PINGO_RECORDINGS || {};
    this.supported = this.hasSynthesis || Object.keys(this.recordings).length > 0;
    this.enabled = this.supported;
    this.voices = [];
    this.loadVoices();
    this.synthesis?.addEventListener('voiceschanged', () => this.loadVoices());
    document.getElementById('pingoTouch').addEventListener('click', () => {
      this.say(PINGO_LINES.chat[this.chatIndex++ % PINGO_LINES.chat.length]);
      document.getElementById('sunflower').classList.add('pingo-touched');
      clearTimeout(this.animationTimer);
      this.animationTimer = setTimeout(() => document.getElementById('sunflower').classList.remove('pingo-touched'), 1800);
    });
    for (const id of ['pingoListen', 'farewellListen']) {
      document.getElementById(id).addEventListener('click', () => {
        this.enabled = !this.enabled;
        this.stop();
        this.renderControls();
        if (this.enabled) this.speak();
      });
    }
    for (const id of ['pingoSkip', 'farewellSkip', 'modalSkip']) {
      document.getElementById(id).addEventListener('click', () => this.skip());
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.stop(); });
    window.addEventListener('pagehide', () => this.stop());
    this.renderControls();
  }

  loadVoices() { this.voices = this.synthesis?.getVoices() || []; }

  say(text, auto = true) {
    if (auto && this.busy && this.enabled) {
      // Guarda até quatro próximas falas para evitar uma conversa interminável.
      if (this.queue.length < 4) this.queue.push(text);
      else this.queue[3] = text;
      this.renderControls();
      return;
    }
    this.stop();
    this.current = text;
    document.getElementById('pingoText').textContent = text;
    if (auto && this.enabled) this.speak();
  }

  sayAction(action, bloomed) {
    const count = this.actionCounts[action] || 0;
    this.actionCounts[action] = count + 1;
    const variations = PINGO_LINES.repeats[action];
    this.say(count && variations ? variations[(count - 1) % variations.length] : PINGO_LINES[action]);
    if (bloomed) this.say(PINGO_LINES.bloom);
  }

  speak() {
    if (!this.supported || !this.enabled || document.hidden) return;
    const generation = this.generation;
    this.busy = true;
    this.renderControls();
    // Um prazo de segurança libera a fila se o aparelho não emitir eventos.
    this.watchdog = setTimeout(() => {
      if (generation !== this.generation) return;
      this.skip();
    }, Math.max(18000, this.current.length * 150));
    const recording = Object.values(this.recordings).find(entry => entry.text === this.current && entry.src);
    if (recording && window.Audio) {
      const audio = new window.Audio(recording.src);
      this.audio = audio;
      audio.volume = .85;
      audio.onplaying = () => {
        if (generation === this.generation) document.getElementById('sunflower').classList.add('pingo-speaking');
      };
      audio.onended = () => this.finish(generation);
      const fallback = () => {
        if (generation !== this.generation || this.audio !== audio) return;
        audio.onended = audio.onerror = audio.onplaying = null;
        audio.pause();
        this.audio = null;
        this.speakSynth(generation);
      };
      audio.onerror = fallback;
      try { Promise.resolve(audio.play()).catch(fallback); } catch { fallback(); }
    } else this.speakSynth(generation);
  }

  speakSynth(generation) {
    if (!this.hasSynthesis) { this.finish(generation); return; }
    this.loadVoices();
    try {
      const utterance = new window.SpeechSynthesisUtterance(this.current);
      const brazilian = this.voices.filter(voice => /^pt[-_]BR$/i.test(voice.lang));
      const portuguese = this.voices.filter(voice => /^pt(?:[-_]|$)/i.test(voice.lang));
      const masculine = voice => /\b(antonio|antônio|daniel|duarte|felipe|ricardo|donato)\b/i.test(voice.name || '');
      const natural = voice => /natural|neural|online/i.test(voice.name || '');
      const voice = brazilian.find(voice => masculine(voice) && natural(voice))
        || brazilian.find(masculine) || portuguese.find(masculine) || brazilian[0] || portuguese[0];
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || 'pt-BR';
      utterance.rate = .98;
      utterance.pitch = 1;
      utterance.volume = .85;
      this.utterance = utterance;
      utterance.onstart = () => {
        if (generation === this.generation) document.getElementById('sunflower').classList.add('pingo-speaking');
      };
      utterance.onend = () => this.finish(generation);
      utterance.onerror = event => {
        if (generation !== this.generation) return;
        if (['canceled', 'interrupted'].includes(event.error)) { this.finish(generation); return; }
        this.enabled = false;
        this.stop();
        document.getElementById('pingoVoiceHint').textContent = 'O navegador pausou a voz. Toque em ativar voz para tentar novamente.';
      };
      this.synthesis.speak(utterance);
    } catch { this.enabled = false; this.stop(); }
  }

  finish(generation) {
    if (generation !== this.generation || !this.busy) return;
    clearTimeout(this.watchdog);
    this.utterance = null;
    this.audio = null;
    this.busy = false;
    document.getElementById('sunflower').classList.remove('pingo-speaking');
    const next = this.queue.shift();
    this.renderControls();
    if (next && this.enabled && !document.hidden) {
      const remaining = [...this.queue];
      this.say(next);
      this.queue = remaining;
      this.renderControls();
    }
  }

  skip() {
    const next = this.queue.shift();
    const remaining = [...this.queue];
    this.stop();
    if (next) {
      this.say(next);
      this.queue = remaining;
      this.renderControls();
    }
  }

  renderControls() {
    for (const id of ['pingoListen', 'farewellListen']) {
      const button = document.getElementById(id);
      button.disabled = !this.supported;
      button.textContent = !this.supported ? 'conversa pelos balões ♡' : this.enabled ? 'silenciar o Pingo ♫' : 'ativar voz do Pingo ♫';
      button.setAttribute('aria-pressed', String(this.enabled));
    }
    for (const id of ['pingoSkip', 'farewellSkip', 'modalSkip']) {
      // Permanece no ciclo de foco: seu estado não muda durante a fala.
      document.getElementById(id).setAttribute('aria-label', 'Interromper a fala atual do Pingo');
    }
    document.getElementById('pingoVoiceHint').textContent = !this.supported ? 'Neste navegador, o Pingo conversa por escrito.'
      : !this.enabled ? 'A voz está desligada. Os balões continuam aqui.'
      : this.queue.length ? 'Pingo já vai responder ao próximo carinho. Você pode pular a fala atual.'
      : 'Um carinho de cada vez. Pingo termina de falar antes de responder ao próximo.';
  }

  stop() {
    this.generation++;
    clearTimeout(this.animationTimer);
    clearTimeout(this.watchdog);
    this.queue = [];
    if (this.utterance) this.synthesis.cancel();
    if (this.audio) {
      this.audio.onended = this.audio.onerror = this.audio.onplaying = null;
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = this.utterance = null;
    this.busy = false;
    document.getElementById('sunflower').classList.remove('pingo-speaking', 'pingo-touched');
    this.renderControls();
  }

  reset() {
    this.chatIndex = 0;
    this.actionCounts = {};
    this.say(PINGO_LINES.welcome, false);
  }
}
