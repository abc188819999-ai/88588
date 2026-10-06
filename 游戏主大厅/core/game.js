import { GAME_CONFIG, CANNON_VALUES, FISH_SPECIES } from '../config/game-config.js';

class VisualRng {
  constructor(seed) { this.x = seed >>> 0 || 0x9e3779b9; }
  next() { let x=this.x; x ^= x<<13; x ^= x>>>17; x ^= x<<5; this.x=x>>>0; return this.x/4294967296; }
  range(a,b) { return a + (b-a)*this.next(); }
  int(a,b) { return Math.floor(this.range(a,b+1)); }
  pick(arr) { return arr[Math.min(arr.length-1,Math.floor(this.next()*arr.length))]; }
}

function loadImage(src) {
  return new Promise((resolve,reject)=>{
    const img=new Image(); img.decoding='async'; img.onload=()=>resolve(img); img.onerror=()=>reject(new Error(`图片加载失败: ${src}`)); img.src=src;
  });
}

function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function distance2(ax,ay,bx,by){ const x=ax-bx,y=ay-by; return x*x+y*y; }

export class DeepSeaFishingGame {
  constructor({canvas,bridge,ui,audio,stateMachine,realtime}) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
    this.bridge=bridge; this.ui=ui; this.audio=audio; this.fsm=stateMachine; this.realtime=realtime;
    const seedArray=new Uint32Array(1); crypto.getRandomValues(seedArray); this.rng=new VisualRng(seedArray[0]);
    this.images=new Map(); this.background=null;
    this.width=1; this.height=1; this.dpr=1; this.orientation='landscape';
    this.fish=[]; this.bullets=[]; this.particles=[]; this.texts=[]; this.spawnQueue=[];
    this.fishCounter=0; this.bulletCounter=0; this.serverBalance=0; this.reservedBalance=0; this.rebate=0;
    this.cannonIndex=3; this.autoFire=false; this.lockMode=false; this.lockedFishId=null;
    this.pointer={x:0,y:0,down:false}; this.lastFireAt=0; this.nextRegularSpawnAt=0;
    this.roundId=`round-${Date.now()}-${crypto.randomUUID().slice(0,8)}`;
    this.bonusIndex=0; this.nextBonusAt=Date.now()+GAME_CONFIG.gameplay.firstBonusDelayMs; this.activeBonus=null;
    this.running=false; this.raf=0; this.lastFrame=0; this.fpsAccumulator=0; this.fpsFrames=0; this.lastFpsAt=0;
    this.gridCell=170; this.grid=new Map(); this.saveTimer=0; this.destroyed=false;
    this.settings={bgm:true,sfx:true,bgmVolume:.5,sfxVolume:.7};
  }

  async loadAssets(onProgress=()=>{}) {
    const jobs=[['background','./assets/深海背景.webp'], ...FISH_SPECIES.map(f=>[f.key,f.asset])];
    let done=0;
    await Promise.all(jobs.map(async([key,src])=>{
      const img=await loadImage(src); if(key==='background') this.background=img; else this.images.set(key,img);
      done++; onProgress(done/jobs.length);
    }));
  }

  applyInitialData({profile,balance,state,settings}) {
    this.ui.setPlayer(profile || {});
    this.serverBalance=Number(balance?.balance ?? balance?.amount ?? 0);
    this.rebate=Number(balance?.rebatePending ?? state?.rebatePending ?? 0);
    const saved=settings || {};
    this.settings={...this.settings,...saved};
    const savedCannon=Number(state?.cannonValue ?? saved.cannonValue ?? CANNON_VALUES[this.cannonIndex]);
    const idx=CANNON_VALUES.indexOf(savedCannon); if(idx>=0) this.cannonIndex=idx;
    this.autoFire=!!saved.autoFire; this.lockMode=!!saved.lockMode;
    this.nextBonusAt=Number(state?.nextBonusAt || this.nextBonusAt);
    this.bonusIndex=Number(state?.bonusIndex || 0);
    this.roundId=state?.roundId || this.roundId;
    this.audio.setBgmEnabled(this.settings.bgm !== false);
    this.audio.setSfxEnabled(this.settings.sfx !== false);
    this.audio.setBgmVolume(Number(this.settings.bgmVolume ?? .5));
    this.audio.setSfxVolume(Number(this.settings.sfxVolume ?? .7));
    this.updateHud();
    this.ui.setToggle('btnAuto',this.autoFire);
    this.ui.setToggle('btnLock',this.lockMode);
    this.ui.setToggle('btnBgm',this.settings.bgm !== false,'音乐开','音乐关');
    this.ui.setToggle('btnSfx',this.settings.sfx !== false,'音效开','音效关');
  }

  bind() {
    this.resize=()=>this.handleResize();
    window.addEventListener('resize',this.resize,{passive:true});
    window.addEventListener('orientationchange',this.resize,{passive:true});
    this.handleResize();

    const point=e=>{
      const r=this.canvas.getBoundingClientRect(); this.pointer.x=e.clientX-r.left; this.pointer.y=e.clientY-r.top;
    };
    this.canvas.addEventListener('pointermove',e=>{point(e);},{passive:true});
    this.canvas.addEventListener('pointerdown',e=>{
      e.preventDefault(); point(e); this.pointer.down=true; this.audio.ensureContext().then(()=>this.audio.startBgm()).catch(()=>{});
      if(this.lockMode){ const target=this.findFishAt(this.pointer.x,this.pointer.y); if(target){this.lockedFishId=target.id; this.ui.toast(`锁定 ${target.species.name}`);}}
      this.tryFire(performance.now());
      try{this.canvas.setPointerCapture(e.pointerId);}catch{}
    },{passive:false});
    const up=()=>{this.pointer.down=false;};
    this.canvas.addEventListener('pointerup',up,{passive:true});
    this.canvas.addEventListener('pointercancel',up,{passive:true});

    this.ui.on('btnCannonDown','click',()=>this.changeCannon(-1));
    this.ui.on('btnCannonUp','click',()=>this.changeCannon(1));
    this.ui.on('btnAuto','click',()=>{this.autoFire=!this.autoFire;this.ui.setToggle('btnAuto',this.autoFire);this.persistSettings();this.audio.play('button');});
    this.ui.on('btnLock','click',()=>{this.lockMode=!this.lockMode;if(!this.lockMode)this.lockedFishId=null;this.ui.setToggle('btnLock',this.lockMode);this.persistSettings();this.audio.play('button');});
    this.ui.on('btnBgm','click',()=>{this.settings.bgm=!this.settings.bgm;this.audio.setBgmEnabled(this.settings.bgm);this.ui.setToggle('btnBgm',this.settings.bgm,'音乐开','音乐关');this.persistSettings();});
    this.ui.on('btnSfx','click',()=>{this.settings.sfx=!this.settings.sfx;this.audio.setSfxEnabled(this.settings.sfx);this.ui.setToggle('btnSfx',this.settings.sfx,'音效开','音效关');this.persistSettings();});
    this.ui.on('btnHelp','click',()=>{this.ui.showHelp();this.audio.play('button');});
    this.ui.on('btnHelpClose','click',()=>this.ui.hideHelp());
    this.ui.on('btnSupport','click',async()=>{const r=await this.bridge.openSupport();if(r?.message)this.ui.toast(r.message);});
    this.ui.on('btnBack','click',async()=>{await this.saveState();this.ui.showLobby();});
    this.ui.on('btnRebate','click',()=>this.claimRebate());
    this.ui.on('btnRetry','click',()=>this.recoverConnection());

    this.visibility=()=>{
      if(document.hidden){ this.pointer.down=false; this.saveState(); this.audio.suspendForBackground(); if(this.fsm.can('PAUSED'))this.fsm.transition('PAUSED'); }
      else { this.audio.resumeFromBackground(); this.recoverConnection(true); }
    };
    document.addEventListener('visibilitychange',this.visibility);
    window.addEventListener('online',()=>this.recoverConnection(true));
    this.bridge.addEventListener('disconnected',()=>{if(this.fsm.can('RECONNECTING'))this.fsm.transition('RECONNECTING');this.ui.showError('网络连接中断，资金状态已停止本地推演，请重新连接。');});
    this.bridge.addEventListener('reconnected',()=>this.recoverConnection(true));
    this.realtime?.addEventListener('message',e=>{ if(e.detail?.type==='balance') this.applyServerMoney(e.detail); });
  }

  handleResize() {
    const rect=this.canvas.getBoundingClientRect();
    this.width=Math.max(1,rect.width); this.height=Math.max(1,rect.height); this.orientation=this.width>=this.height?'landscape':'portrait';
    this.dpr=Math.min(window.devicePixelRatio || 1,GAME_CONFIG.performance.dprCap);
    const w=Math.max(1,Math.round(this.width*this.dpr)); const h=Math.max(1,Math.round(this.height*this.dpr));
    if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;}
    this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);
    if(!this.pointer.x){this.pointer.x=this.width*.5;this.pointer.y=this.height*.35;}
  }

  start() {
    if(this.running)return; this.running=true; this.lastFrame=performance.now(); this.lastFpsAt=this.lastFrame;
    if(this.fsm.can('PLAYING'))this.fsm.transition('PLAYING');
    this.nextRegularSpawnAt=this.lastFrame+150;
    this.realtime?.connect();
    this.audio.startBgm().catch(()=>{});
    this.raf=requestAnimationFrame(t=>this.frame(t));
  }

  frame(now) {
    if(!this.running||this.destroyed)return;
    const rawDelta=Math.max(0,now-this.lastFrame); let dt=Math.min(GAME_CONFIG.performance.maxDeltaMs,rawDelta)/1000; this.lastFrame=now;
    if(!document.hidden){this.update(dt,now);this.render(now/1000);}
    this.fpsFrames++; this.fpsAccumulator+=rawDelta/1000;
    if(now-this.lastFpsAt>=500){ const fps=this.fpsAccumulator>0?this.fpsFrames/this.fpsAccumulator:0; this.ui.setFps(fps); this.fpsFrames=0;this.fpsAccumulator=0;this.lastFpsAt=now; }
    this.raf=requestAnimationFrame(t=>this.frame(t));
  }

  update(dt,now) {
    if(now>=this.nextRegularSpawnAt && this.fish.length<GAME_CONFIG.performance.maxFish){this.spawnRegular();this.nextRegularSpawnAt=now+this.rng.range(430,920);}
    this.processSpawnQueue(now);
    this.updateFish(dt,now);
    this.updateBullets(dt,now);
    this.buildGrid(); this.collideBullets();
    this.updateParticles(dt); this.updateTexts(dt);
    this.updateBonus(now);
    const cooldown=this.autoFire?GAME_CONFIG.gameplay.autoFireCooldownMs:GAME_CONFIG.gameplay.fireCooldownMs;
    if((this.autoFire||this.pointer.down)&&now-this.lastFireAt>=cooldown)this.tryFire(now);
    this.saveTimer+=dt; if(this.saveTimer>12){this.saveTimer=0;this.saveState();}
  }

  updateBonus(nowPerf) {
    const now=Date.now();
    if(!this.activeBonus && now>=this.nextBonusAt) this.triggerBonus();
    if(this.activeBonus && now>=this.activeBonus.until){
      this.activeBonus=null; if(this.fsm.state==='BONUS')this.fsm.transition('PLAYING');
    }
    if(this.activeBonus){
      const sec=Math.max(0,Math.ceil((this.activeBonus.until-now)/1000)); this.ui.setEvent(`${this.activeBonus.label} ${sec}秒`,'bonus');
    } else {
      const sec=Math.max(0,Math.ceil((this.nextBonusAt-now)/1000)); this.ui.setEvent(`下一轮鱼潮 ${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`);
    }
  }

  triggerBonus() {
    const kind=this.bonusIndex%3; const now=Date.now();
    this.bonusIndex++; this.nextBonusAt=now+GAME_CONFIG.gameplay.bonusIntervalMs;
    if(this.fsm.can('BONUS'))this.fsm.transition('BONUS');
    if(kind===0){this.activeBonus={type:'sweep',label:'鱼潮来袭·横贯深海',until:now+14000};this.queueSweep();this.audio.play('tide');}
    else if(kind===1){this.activeBonus={type:'spiral',label:'鱼潮来袭·深海回旋',until:now+15000};this.queueSpiral();this.audio.play('tide');}
    else {this.activeBonus={type:'boss',label:'黄金鲨王来袭',until:now+GAME_CONFIG.gameplay.bossDurationMs};this.spawnBoss();this.audio.play('boss');this.bridge.bossEvent({event:'spawn',roundId:this.roundId}).catch(()=>{});}
    this.saveState();
  }

  queueSweep() {
    const start=performance.now()+200; const fromLeft=this.rng.next()>.5;
    for(let i=0;i<38;i++) this.spawnQueue.push({at:start+i*115,fn:()=>{
      const sp=FISH_SPECIES[this.rng.int(0,6)]; const lane=i%7; const y=this.height*(.16+.095*lane)+this.rng.range(-12,12);
      this.spawnFish(sp,{direction:fromLeft?1:-1,y,speed:this.rng.range(70,112),amp:10,formation:true});
    }});
  }

  queueSpiral() {
    const start=performance.now()+200;
    for(let i=0;i<30;i++) this.spawnQueue.push({at:start+i*135,fn:()=>{
      const sp=FISH_SPECIES[this.rng.int(0,7)];
      this.spawnOrbitFish(sp,{angle:(i/30)*Math.PI*2,radius:Math.min(this.width,this.height)*(.28+this.rng.range(-.05,.05)),clockwise:i%2===0});
    }});
  }

  processSpawnQueue(now){
    if(!this.spawnQueue.length)return;
    this.spawnQueue.sort((a,b)=>a.at-b.at);
    while(this.spawnQueue.length&&this.spawnQueue[0].at<=now){const item=this.spawnQueue.shift();if(this.fish.length<GAME_CONFIG.performance.maxFish)item.fn();}
  }

  spawnRegular() {
    const pool=FISH_SPECIES.filter(f=>!f.boss); const total=pool.reduce((s,f)=>s+f.weight,0); let p=this.rng.next()*total; let sp=pool[0];
    for(const f of pool){p-=f.weight;if(p<=0){sp=f;break;}}
    const direction=this.rng.next()>.5?1:-1; this.spawnFish(sp,{direction});
  }

  spawnFish(species,opt={}) {
    const scale=this.visualScale(species.size); const direction=opt.direction || 1; const margin=scale*1.2;
    const y=opt.y ?? this.rng.range(this.height*.16,this.height*(this.orientation==='portrait'?.78:.79));
    const speed=opt.speed ?? this.rng.range(species.speed[0],species.speed[1])*(this.width/1000+.35);
    const fish={
      id:`fish-${++this.fishCounter}-${crypto.randomUUID().slice(0,5)}`, species, x:direction>0?-margin:this.width+margin, y, baseY:y,
      vx:speed*direction, direction, size:scale, amp:opt.amp ?? this.rng.range(9,30), freq:this.rng.range(1.0,2.2), phase:this.rng.range(0,Math.PI*2), age:0,
      alpha:1, flash:0, captured:false, path:'lane', angle:0, formation:!!opt.formation, hitRadius:scale*.36
    };
    this.fish.push(fish); return fish;
  }

  spawnOrbitFish(species,opt={}) {
    const size=this.visualScale(species.size); const cx=this.width*.5,cy=this.height*(this.orientation==='portrait'?.45:.48);
    const fish={id:`fish-${++this.fishCounter}-${crypto.randomUUID().slice(0,5)}`,species,x:cx,y:cy,size,alpha:1,flash:0,captured:false,path:'orbit',age:0,
      orbitAngle:opt.angle||0,orbitRadius:opt.radius||Math.min(this.width,this.height)*.3,orbitSpeed:(opt.clockwise?1:-1)*this.rng.range(.2,.34),direction:1,angle:0,hitRadius:size*.36};
    this.fish.push(fish); return fish;
  }

  spawnBoss() {
    const boss=FISH_SPECIES.find(f=>f.boss); const fish=this.spawnFish(boss,{direction:this.rng.next()>.5?1:-1,y:this.height*(this.orientation==='portrait'?.42:.46),speed:Math.max(34,this.width*.032),amp:48});
    fish.hitRadius=fish.size*.42; fish.isBoss=true; return fish;
  }

  visualScale(base){ const ref=Math.sqrt((this.width*this.height)/(1280*720)); return base*clamp(ref,.72,1.38); }

  updateFish(dt) {
    const cx=this.width*.5,cy=this.height*(this.orientation==='portrait'?.45:.48);
    for(const f of this.fish){
      f.age+=dt; f.flash=Math.max(0,f.flash-dt*4);
      if(f.captured){f.alpha-=dt*2.5;f.size*=1-dt*.75;continue;}
      if(f.path==='orbit'){
        f.orbitAngle+=f.orbitSpeed*dt; f.x=cx+Math.cos(f.orbitAngle)*f.orbitRadius; f.y=cy+Math.sin(f.orbitAngle)*f.orbitRadius*.68;
        f.angle=f.orbitAngle+(f.orbitSpeed>0?Math.PI/2:-Math.PI/2); f.direction=Math.cos(f.angle)>=0?1:-1;
      } else {
        f.x+=f.vx*dt; f.y=f.baseY+Math.sin(f.age*f.freq+f.phase)*f.amp; f.angle=Math.sin(f.age*f.freq+f.phase)*.07;
      }
    }
    this.fish=this.fish.filter(f=>{
      if(f.alpha<=0)return false;
      if(f.path==='orbit')return f.age<16;
      const m=f.size*1.7; return f.x>-m&&f.x<this.width+m;
    });
    if(this.lockedFishId && !this.fish.some(f=>f.id===this.lockedFishId&&!f.captured))this.lockedFishId=null;
  }

  turretOrigin(){ const raw=getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom'); const safe=Number.parseFloat(raw)||0; return {x:this.width*.5,y:this.height-(this.orientation==='portrait'?128:78)-safe}; }

  changeCannon(delta) {
    this.cannonIndex=(this.cannonIndex+delta+CANNON_VALUES.length)%CANNON_VALUES.length; this.updateHud(); this.persistSettings(); this.audio.play('button');
    this.bridge.changeCannon({cannonValue:CANNON_VALUES[this.cannonIndex]}).catch(()=>{});
  }

  aimPoint(){
    if(this.lockMode&&this.lockedFishId){const f=this.fish.find(x=>x.id===this.lockedFishId&&!x.captured);if(f)return{x:f.x,y:f.y};}
    return {x:this.pointer.x||this.width*.5,y:this.pointer.y||this.height*.3};
  }

  tryFire(now) {
    if(!['PLAYING','BONUS'].includes(this.fsm.state))return;
    const cooldown=this.autoFire?GAME_CONFIG.gameplay.autoFireCooldownMs:GAME_CONFIG.gameplay.fireCooldownMs;
    if(now-this.lastFireAt<cooldown)return;
    const cost=CANNON_VALUES[this.cannonIndex]; if(this.serverBalance-this.reservedBalance<cost){this.ui.toast('余额不足');this.audio.play('alert');this.pointer.down=false;this.autoFire=false;this.ui.setToggle('btnAuto',false);return;}
    this.lastFireAt=now; const origin=this.turretOrigin(); const aim=this.aimPoint(); const angle=Math.atan2(aim.y-origin.y,aim.x-origin.x);
    const bullet={id:`local-${++this.bulletCounter}`,serverId:null,x:origin.x,y:origin.y,vx:Math.cos(angle)*GAME_CONFIG.gameplay.bulletSpeed,vy:Math.sin(angle)*GAME_CONFIG.gameplay.bulletSpeed,
      angle,cost,age:0,bounces:GAME_CONFIG.gameplay.bulletBounces,dead:false,pendingFishId:null,hitSent:false,transactionId:null};
    this.bullets.push(bullet); this.reservedBalance+=cost; this.updateHud(); this.audio.play('fire',.96+this.rng.range(0,.08)); this.flashCannon=1;
    const fireMeta=this.bridge.meta({roundId:this.roundId}); bullet.fireMeta=fireMeta;
    this.bridge.fire({...fireMeta,cannonValue:cost,aimX:aim.x/this.width,aimY:aim.y/this.height}).then(r=>this.handleFireAck(bullet,r)).catch(err=>this.handleFireFailure(bullet,err));
  }

  async handleFireFailure(bullet,err) {
    try {
      const recovered=await this.bridge.settle({transactionId:bullet.fireMeta.transactionId});
      if(recovered?.found&&recovered?.response){this.handleFireAck(bullet,recovered.response);return;}
    } catch {}
    this.reservedBalance=Math.max(0,this.reservedBalance-bullet.cost); bullet.dead=true; this.updateHud();
    if(err?.status===402||err?.code==='INSUFFICIENT_BALANCE'){this.ui.toast('余额不足');return;}
    this.ui.showError('发炮请求未确认，未继续本地扣款。重新连接后将以服务端记录恢复。');
  }

  handleFireAck(bullet,r) {
    if(bullet.acked)return; bullet.acked=true; this.reservedBalance=Math.max(0,this.reservedBalance-bullet.cost); bullet.serverId=r.bulletId; bullet.transactionId=r.transactionId;
    this.applyServerMoney(r); if(bullet.pendingFishId){const fish=this.fish.find(f=>f.id===bullet.pendingFishId);if(fish)this.resolveHit(bullet,fish);}
  }

  updateBullets(dt) {
    const r=8;
    for(const b of this.bullets){
      if(b.dead)continue; b.age+=dt; if(b.age*1000>GAME_CONFIG.gameplay.bulletLifeMs){b.dead=true;continue;}
      b.x+=b.vx*dt; b.y+=b.vy*dt;
      if(b.x<r&&b.bounces>0){b.x=r;b.vx=Math.abs(b.vx);b.bounces--;this.spawnSpark(b.x,b.y,'#7feaff',3);}
      else if(b.x>this.width-r&&b.bounces>0){b.x=this.width-r;b.vx=-Math.abs(b.vx);b.bounces--;this.spawnSpark(b.x,b.y,'#7feaff',3);}
      if(b.y<r&&b.bounces>0){b.y=r;b.vy=Math.abs(b.vy);b.bounces--;this.spawnSpark(b.x,b.y,'#7feaff',3);}
      if(b.y>this.height-r){b.dead=true;}
      b.angle=Math.atan2(b.vy,b.vx);
    }
    this.bullets=this.bullets.filter(b=>!b.dead||b.pendingFishId);
  }

  buildGrid() {
    this.grid.clear(); const cs=this.gridCell;
    for(const f of this.fish){if(f.captured)continue;const cx=Math.floor(f.x/cs),cy=Math.floor(f.y/cs),key=`${cx},${cy}`;let arr=this.grid.get(key);if(!arr)this.grid.set(key,arr=[]);arr.push(f);}
  }

  collideBullets() {
    const cs=this.gridCell;
    for(const b of this.bullets){if(b.dead||b.hitSent||b.pendingFishId)continue;const cx=Math.floor(b.x/cs),cy=Math.floor(b.y/cs);let hit=null;
      outer:for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const arr=this.grid.get(`${cx+ox},${cy+oy}`);if(!arr)continue;for(const f of arr){const rr=f.hitRadius+7;if(distance2(b.x,b.y,f.x,f.y)<=rr*rr){hit=f;break outer;}}}
      if(hit){b.dead=true;b.pendingFishId=hit.id;this.spawnNet(hit.x,hit.y,hit.size);this.audio.play('hit',.95+this.rng.range(0,.1));if(b.serverId)this.resolveHit(b,hit);}
    }
  }

  async resolveHit(bullet,fish) {
    if(bullet.hitSent||!bullet.serverId)return; bullet.hitSent=true;
    const meta=this.bridge.meta({roundId:this.roundId}); bullet.hitMeta=meta;
    const payload={...meta,bulletId:bullet.serverId,fishId:fish.id,fishType:fish.species.key,clientHitAt:Date.now()};
    let r;
    try { r=await this.bridge.hitFish(payload); }
    catch(err){
      try { const recovered=await this.bridge.settle({transactionId:meta.transactionId}); if(recovered?.found&&recovered?.response)r=recovered.response; } catch {}
      if(!r){this.ui.showError('命中结算未确认。不会在前端生成返奖，重新连接后以服务端流水恢复。');return;}
    }
    bullet.pendingFishId=null; this.applyServerMoney(r);
    const live=this.fish.find(f=>f.id===fish.id);
    if(r.captured){
      if(live){live.captured=true;live.flash=1;}
      const award=Number(r.award||0);this.spawnReward(fish.x,fish.y,award);this.audio.play('catch');this.audio.play('coin',1.05);
      if(fish.species.boss){this.ui.setEvent(`鲨王捕获 +${this.ui.money(award)}`,'boss');this.bridge.bossEvent({event:'captured',award,roundId:this.roundId}).catch(()=>{});}
    } else if(live){live.flash=1;this.spawnSpark(fish.x,fish.y,'#a7f5ff',7);}
  }

  findFishAt(x,y){let best=null,bd=Infinity;for(const f of this.fish){if(f.captured)continue;const d=distance2(x,y,f.x,f.y);const rr=(f.hitRadius*1.25)**2;if(d<rr&&d<bd){best=f;bd=d;}}return best;}

  applyServerMoney(data={}) {
    if(data.balance!==undefined)this.serverBalance=Number(data.balance);
    if(data.rebatePending!==undefined)this.rebate=Number(data.rebatePending);
    this.updateHud();
  }

  async claimRebate() {
    try {const r=await this.bridge.claimRebate();this.applyServerMoney(r);if(Number(r.claimed)>0){this.ui.toast(`返水到账 +${this.ui.money(r.claimed)}`);this.audio.play('coin');}else this.ui.toast('暂无可领取返水');}
    catch(e){this.ui.toast(e.message||'返水领取失败');}
  }

  persistSettings() {
    const s={...this.settings,cannonValue:CANNON_VALUES[this.cannonIndex],autoFire:this.autoFire,lockMode:this.lockMode}; this.bridge.saveSettings(s);
  }
  async saveState() {
    const state={roundId:this.roundId,cannonValue:CANNON_VALUES[this.cannonIndex],bonusIndex:this.bonusIndex,nextBonusAt:this.nextBonusAt,roomId:'deep-sea-01',orientation:this.orientation};
    try{await this.bridge.saveGameState(state);}catch{}
  }
  async recoverConnection(silent=false) {
    try {
      if(this.fsm.state==='ERROR'&&this.fsm.can('RECONNECTING'))this.fsm.transition('RECONNECTING');
      const [bal,state]=await Promise.all([this.bridge.refreshBalance(),this.bridge.restoreGameState()]);
      this.applyServerMoney(bal); if(state?.state){this.nextBonusAt=Number(state.state.nextBonusAt||this.nextBonusAt);this.bonusIndex=Number(state.state.bonusIndex||this.bonusIndex);this.roundId=state.state.roundId||this.roundId;}
      this.ui.hideError(); if(this.fsm.can('PLAYING'))this.fsm.transition('PLAYING'); if(!silent)this.ui.toast('连接已恢复');
    } catch(e){this.ui.showError(e.message||'连接恢复失败');}
  }
  updateHud(){this.ui.setBalance(Math.max(0,this.serverBalance-this.reservedBalance));this.ui.setRebate(this.rebate);this.ui.setCannon(CANNON_VALUES[this.cannonIndex]);}

  spawnSpark(x,y,color='#82ecff',count=8){for(let i=0;i<count&&this.particles.length<GAME_CONFIG.performance.maxParticles;i++){const a=this.rng.range(0,Math.PI*2),s=this.rng.range(45,180);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:this.rng.range(.22,.55),max:.55,size:this.rng.range(1.5,4),color,kind:'spark'});}}
  spawnNet(x,y,size){this.particles.push({x,y,vx:0,vy:0,life:.24,max:.24,size:size*.75,color:'#9ef3ff',kind:'net'});this.spawnSpark(x,y,'#7de9ff',8);}
  spawnReward(x,y,award){this.texts.push({x,y,text:`+${this.ui.money(award)}`,life:1.2,max:1.2});for(let i=0;i<14&&this.particles.length<GAME_CONFIG.performance.maxParticles;i++){const a=this.rng.range(-Math.PI*.92,-Math.PI*.08),s=this.rng.range(65,210);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-30,life:this.rng.range(.55,1),max:1,size:this.rng.range(3,6),color:'#ffd95a',kind:'coin'});}}
  updateParticles(dt){for(const p of this.particles){p.life-=dt;if(p.kind!=='net'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=45*dt;p.vx*=1-dt*.8;}}this.particles=this.particles.filter(p=>p.life>0);}
  updateTexts(dt){for(const t of this.texts){t.life-=dt;t.y-=32*dt;}this.texts=this.texts.filter(t=>t.life>0);}

  render(time) {
    const c=this.ctx,w=this.width,h=this.height;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
    this.drawBackground(c,w,h,time); this.drawFish(c,time); this.drawBullets(c); this.drawParticles(c); this.drawTexts(c); this.drawCannon(c,time);
  }

  drawBackground(c,w,h,time) {
    if(this.background){
      const ir=this.background.width/this.background.height,cr=w/h;let sx=0,sy=0,sw=this.background.width,sh=this.background.height;
      if(cr>ir){sh=sw/cr;sy=(this.background.height-sh)/2;}else{sw=sh*cr;sx=(this.background.width-sw)/2;}
      c.drawImage(this.background,sx,sy,sw,sh,0,0,w,h);
    } else {c.fillStyle='#032840';c.fillRect(0,0,w,h);}
    const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(50,210,255,.09)');g.addColorStop(.45,'rgba(0,80,120,.03)');g.addColorStop(1,'rgba(0,5,18,.32)');c.fillStyle=g;c.fillRect(0,0,w,h);
    c.globalAlpha=.08;c.strokeStyle='#7fe9ff';c.lineWidth=1;
    const gap=80;for(let i=-2;i<Math.ceil(w/gap)+2;i++){c.beginPath();for(let y=0;y<h;y+=26){const x=i*gap+Math.sin(y*.012+time*1.2+i)*18;c.lineTo(x,y);}c.stroke();}c.globalAlpha=1;
  }

  drawFish(c,time) {
    for(const f of this.fish){const img=this.images.get(f.species.key);if(!img)continue;const ratio=img.width/img.height;const ww=f.size*ratio,hh=f.size;c.save();c.translate(f.x,f.y);c.rotate(f.angle||0);const sway=1+Math.sin(f.age*3+f.phase||0)*.025;c.scale((f.direction||1)*sway,1/sway);c.globalAlpha=f.alpha;if(f.flash>0){c.shadowColor='#dfffff';c.shadowBlur=24*f.flash;}if(f.species.boss){c.shadowColor='#ffd75a';c.shadowBlur=18+10*Math.sin(time*5);}c.drawImage(img,-ww/2,-hh/2,ww,hh);if(this.lockedFishId===f.id&&!f.captured){c.strokeStyle='#ffe46a';c.lineWidth=2;c.setLineDash([6,5]);c.beginPath();c.arc(0,0,f.hitRadius*1.15,0,Math.PI*2);c.stroke();c.setLineDash([]);}c.restore();}
  }
  drawBullets(c){for(const b of this.bullets){if(b.dead)continue;c.save();c.translate(b.x,b.y);c.rotate(b.angle);c.shadowColor='#60e9ff';c.shadowBlur=14;c.fillStyle='#c9faff';c.beginPath();c.ellipse(0,0,9,4,0,0,Math.PI*2);c.fill();c.fillStyle='rgba(80,220,255,.42)';c.fillRect(-26,-2,24,4);c.restore();}}
  drawParticles(c){for(const p of this.particles){const a=clamp(p.life/p.max,0,1);c.save();c.globalAlpha=a;if(p.kind==='net'){c.strokeStyle=p.color;c.lineWidth=2;c.beginPath();const r=p.size*(1-a*.25);c.arc(p.x,p.y,r,0,Math.PI*2);for(let i=0;i<8;i++){const q=i*Math.PI/4;c.moveTo(p.x,p.y);c.lineTo(p.x+Math.cos(q)*r,p.y+Math.sin(q)*r);}c.stroke();}else if(p.kind==='coin'){c.fillStyle=p.color;c.shadowColor='#ffdf65';c.shadowBlur=8;c.beginPath();c.ellipse(p.x,p.y,p.size,p.size*.65,0,0,Math.PI*2);c.fill();}else{c.fillStyle=p.color;c.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);}c.restore();}}
  drawTexts(c){for(const t of this.texts){const a=clamp(t.life/t.max,0,1);c.save();c.globalAlpha=a;c.textAlign='center';c.font='900 24px -apple-system,PingFang SC,sans-serif';c.lineWidth=5;c.strokeStyle='rgba(72,40,0,.7)';c.fillStyle='#ffe56d';c.strokeText(t.text,t.x,t.y);c.fillText(t.text,t.x,t.y);c.restore();}}
  drawCannon(c,time){const o=this.turretOrigin(),aim=this.aimPoint(),ang=Math.atan2(aim.y-o.y,aim.x-o.x);c.save();c.translate(o.x,o.y);c.rotate(ang+Math.PI/2);c.shadowColor='#43e3ff';c.shadowBlur=16;c.fillStyle='#d9b64e';c.strokeStyle='#fff0a1';c.lineWidth=2;c.beginPath();c.roundRect(-11,-54,22,68,8);c.fill();c.stroke();c.fillStyle='#214f72';c.beginPath();c.arc(0,12,31,0,Math.PI*2);c.fill();c.stroke();c.restore();}

  destroy(){this.destroyed=true;this.running=false;cancelAnimationFrame(this.raf);clearTimeout(this.saveTimer);this.realtime?.close();this.audio.destroy();window.removeEventListener('resize',this.resize);window.removeEventListener('orientationchange',this.resize);document.removeEventListener('visibilitychange',this.visibility);}
}
