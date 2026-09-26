export class AudioManager {
  constructor(assets) {
    this.assets = assets;
    this.ctx = null;
    this.master = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.buffers = new Map();
    this.bgmSource = null;
    this.bgmEnabled = true;
    this.sfxEnabled = true;
    this.bgmVolume = 0.5;
    this.sfxVolume = 0.7;
    this.loaded = false;
    this.unlocked = false;
  }
  async ensureContext(resume=true) {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      this.ctx = new Ctx({ latencyHint:'interactive' });
      this.master = this.ctx.createGain();
      this.bgmGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.bgmGain.connect(this.master);
      this.sfxGain.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyVolumes();
    }
    if (resume && this.ctx.state === 'suspended') { try { await this.ctx.resume(); } catch {} }
    this.unlocked = this.ctx.state === 'running';
    return this.unlocked;
  }
  async load(onProgress=()=>{}) {
    await this.ensureContext(false);
    if (!this.ctx) return;
    const entries = Object.entries(this.assets);
    let done = 0;
    for (const [id, def] of entries) {
      try {
        const res = await fetch(def.src, { cache:'force-cache' });
        if (!res.ok) throw new Error(`音频加载失败 ${res.status}`);
        const buf = await res.arrayBuffer();
        this.buffers.set(id, await this.ctx.decodeAudioData(buf));
      } finally {
        done += 1;
        onProgress(done / entries.length);
      }
    }
    this.loaded = true;
  }
  applyVolumes() {
    if (!this.bgmGain || !this.sfxGain) return;
    this.bgmGain.gain.value = this.bgmEnabled ? this.bgmVolume : 0;
    this.sfxGain.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
  }
  setBgmEnabled(v) { this.bgmEnabled = !!v; this.applyVolumes(); if (v) this.startBgm(); }
  setSfxEnabled(v) { this.sfxEnabled = !!v; this.applyVolumes(); }
  setBgmVolume(v) { this.bgmVolume = Math.max(0,Math.min(1,v)); this.applyVolumes(); }
  setSfxVolume(v) { this.sfxVolume = Math.max(0,Math.min(1,v)); this.applyVolumes(); }
  async startBgm() {
    if (!this.bgmEnabled || this.bgmSource || !this.buffers.has('bgm')) return;
    await this.ensureContext();
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get('bgm');
    src.loop = true;
    src.connect(this.bgmGain);
    src.start();
    src.onended = () => { if (this.bgmSource === src) this.bgmSource = null; };
    this.bgmSource = src;
  }
  stopBgm() {
    if (!this.bgmSource) return;
    try { this.bgmSource.stop(); } catch {}
    this.bgmSource.disconnect();
    this.bgmSource = null;
  }
  async play(id, rate=1) {
    if (!this.sfxEnabled || !this.buffers.has(id)) return;
    await this.ensureContext();
    const def = this.assets[id] || {};
    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    src.buffer = this.buffers.get(id);
    src.playbackRate.value = Math.max(.6,Math.min(1.6,rate));
    gain.gain.value = def.volume ?? 1;
    src.connect(gain); gain.connect(this.sfxGain);
    src.start();
  }
  async suspendForBackground() {
    if (this.ctx?.state === 'running') await this.ctx.suspend();
  }
  async resumeFromBackground() {
    if (document.visibilityState === 'visible') {
      await this.ensureContext();
      if (this.bgmEnabled) this.startBgm();
    }
  }
  destroy() {
    this.stopBgm();
    if (this.ctx) this.ctx.close().catch(()=>{});
    this.ctx = null;
  }
}
