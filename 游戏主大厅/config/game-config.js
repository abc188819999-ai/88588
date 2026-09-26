export const GAME_CONFIG = Object.freeze({
  gameId: 'yy9-deep-sea-fishing',
  gameName: '深海捕鱼',
  gameType: 'fishing',
  hallId: 'fishing-hall',
  hallName: '捕鱼厅',
  version: '1.0.0',
  entryUrl: './index.html',
  orientation: 'responsive',
  status: 'ready',
  defaultMode: 'DEMO',
  design: {
    landscape: { width: 1920, height: 1080 },
    portrait: { width: 1080, height: 1920 }
  },
  performance: {
    renderer: 'Canvas2D',
    fpsLock: 0,
    dprCap: 1.75,
    maxDeltaMs: 34,
    maxFish: 72,
    maxBullets: 90,
    maxParticles: 260
  },
  gameplay: {
    fireCooldownMs: 115,
    autoFireCooldownMs: 145,
    bulletSpeed: 980,
    bulletLifeMs: 4300,
    bulletBounces: 2,
    firstBonusDelayMs: 20000,
    bonusIntervalMs: 75000,
    bossDurationMs: 26000,
    rebateRateDemo: 0.005
  }
});

export const CANNON_VALUES = Object.freeze([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]);

export const FISH_SPECIES = Object.freeze([
  { key:'clown', name:'小丑鱼', multiplier:2,  asset:'./assets/fish/01_小丑鱼.webp',       size:58,  speed:[54,88],  weight:24 },
  { key:'butterfly', name:'蝶鱼', multiplier:3, asset:'./assets/fish/02_蝶鱼.webp',       size:64,  speed:[50,82],  weight:20 },
  { key:'tang', name:'蓝唐王鱼', multiplier:5,   asset:'./assets/fish/03_蓝唐王鱼.webp',   size:70,  speed:[48,78],  weight:16 },
  { key:'snapper', name:'红鲷鱼', multiplier:8, asset:'./assets/fish/04_红鲷鱼.webp',     size:76,  speed:[44,72],  weight:13 },
  { key:'angel', name:'金神仙鱼', multiplier:12, asset:'./assets/fish/05_金神仙鱼.webp',  size:84,  speed:[40,68],  weight:9 },
  { key:'lion', name:'狮子鱼', multiplier:20,    asset:'./assets/fish/06_狮子鱼.webp',     size:92,  speed:[38,64],  weight:7 },
  { key:'turtle', name:'海龟', multiplier:30,    asset:'./assets/fish/07_海龟.webp',       size:102, speed:[34,56],  weight:5 },
  { key:'crab', name:'帝王蟹', multiplier:40,    asset:'./assets/fish/08_帝王蟹.webp',     size:102, speed:[32,52],  weight:4 },
  { key:'manta', name:'魔鬼鱼', multiplier:60,   asset:'./assets/fish/09_魔鬼鱼.webp',     size:126, speed:[30,48],  weight:3 },
  { key:'marlin', name:'剑鱼', multiplier:80,    asset:'./assets/fish/10_剑鱼.webp',       size:138, speed:[42,70],  weight:2.4 },
  { key:'octopus', name:'巨型章鱼', multiplier:120, asset:'./assets/fish/11_巨型章鱼.webp', size:148, speed:[26,42], weight:1.7 },
  { key:'boss', name:'黄金鲨王', multiplier:300, asset:'./assets/fish/12_黄金鲨王.webp',   size:255, speed:[28,38],  weight:0, boss:true }
]);

export const AUDIO_ASSETS = Object.freeze({
  bgm:    { src:'./audio/深海背景音乐.wav', loop:true,  volume:0.42 },
  fire:   { src:'./audio/发炮.wav',         loop:false, volume:0.34 },
  hit:    { src:'./audio/命中.wav',         loop:false, volume:0.26 },
  catch:  { src:'./audio/捕获.wav',         loop:false, volume:0.38 },
  tide:   { src:'./audio/鱼潮.wav',         loop:false, volume:0.48 },
  boss:   { src:'./audio/鲨王来袭.wav',     loop:false, volume:0.54 },
  button: { src:'./audio/按钮.wav',         loop:false, volume:0.28 },
  alert:  { src:'./audio/警告.wav',         loop:false, volume:0.35 },
  coin:   { src:'./audio/金币.wav',         loop:false, volume:0.34 }
});
