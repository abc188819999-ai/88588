import { GAME_CONFIG } from '../config/game-config.js';

const DEMO_ENDPOINTS = {
  initializeGame: ['POST','/api/initialize'],
  getProfile: ['GET','/api/profile'],
  getBalance: ['GET','/api/balance'],
  refreshBalance: ['GET','/api/balance'],
  getGameConfig: ['GET','/api/config'],
  getGameState: ['GET','/api/state'],
  restoreGameState: ['GET','/api/state'],
  saveGameState: ['POST','/api/state/save'],
  placeBet: ['POST','/api/fishing/fire'],
  fire: ['POST','/api/fishing/fire'],
  cancelBet: ['POST','/api/cancel-bet'],
  hitFish: ['POST','/api/fishing/hit'],
  fishResult: ['POST','/api/fishing/hit'],
  getResult: ['POST','/api/fishing/hit'],
  settle: ['GET','/api/settlement'],
  collect: ['POST','/api/collect'],
  getHistory: ['GET','/api/history'],
  getRebate: ['GET','/api/rebate'],
  claimRebate: ['POST','/api/rebate/claim'],
  bossEvent: ['POST','/api/boss-event']
};

export class PlatformBridge extends EventTarget {
  constructor() {
    super();
    const params = new URLSearchParams(location.search);
    const requested = (params.get('mode') || window.YY9_GAME_MODE || GAME_CONFIG.defaultMode).toUpperCase();
    this.mode = requested === 'PRODUCTION' ? 'PRODUCTION' : 'DEMO';
    this.platform = window.YY9_PLATFORM_CONFIG || {};
    this.sessionId = this.platform.sessionId || localStorage.getItem('yy9.deepSea.sessionId') || crypto.randomUUID();
    localStorage.setItem('yy9.deepSea.sessionId', this.sessionId);
    this.authToken = this.platform.authToken || '';
    this.deviceId = this.platform.deviceId || localStorage.getItem('yy9.deviceId') || crypto.randomUUID();
    localStorage.setItem('yy9.deviceId', this.deviceId);
    this.connected = navigator.onLine;
    this.localDemo = false;
    this.demoKey = 'yy9.deepSea.browserDemo.' + this.sessionId;
  }
  demoState() {
    let s;
    try { s = JSON.parse(localStorage.getItem(this.demoKey) || 'null'); } catch {}
    if (!s) s = { balance:100000, rebatePending:0, bullets:{}, transactions:{}, state:{roomId:'deep-sea-01',roundId:`round-${Date.now()}`,cannonValue:10,bonusIndex:0,nextBonusAt:Date.now()+20000,orientation:'responsive'} };
    return s;
  }
  saveDemo(s) { localStorage.setItem(this.demoKey, JSON.stringify(s)); }
  async localDemoCall(name, payload={}) {
    this.localDemo = true;
    const s=this.demoState(), money=v=>Math.round((Number(v)+Number.EPSILON)*100)/100;
    const profile={playerId:`DEMO-${this.sessionId.replace(/-/g,'').slice(0,10).toUpperCase()}`,username:'demo',nickname:'深海试玩玩家',avatar:'',vipLevel:1,currency:'CNY',language:'zh-CN'};
    if(name==='initializeGame') return {ok:true,mode:'DEMO',productionReady:false,sessionId:this.sessionId,playerId:profile.playerId};
    if(name==='getProfile') return {ok:true,profile};
    if(name==='getBalance'||name==='refreshBalance') return {ok:true,balance:money(s.balance),rebatePending:money(s.rebatePending),currency:'CNY'};
    if(name==='getGameConfig') return {ok:true,gameId:GAME_CONFIG.gameId};
    if(name==='getGameState'||name==='restoreGameState') return {ok:true,state:s.state,rebatePending:money(s.rebatePending)};
    if(name==='saveGameState'){ s.state={...s.state,...(payload.state||{})};this.saveDemo(s);return {ok:true,state:s.state}; }
    if(name==='fire'||name==='placeBet'){
      const cost=Number(payload.cannonValue||0); if(s.balance<cost){const e=new Error('余额不足');e.status=402;e.code='INSUFFICIENT_BALANCE';throw e;}
      const bulletId=crypto.randomUUID();s.balance=money(s.balance-cost);s.rebatePending=money(s.rebatePending+cost*.005);s.bullets[bulletId]={cost,used:false};
      const out={ok:true,bulletId,transactionId:payload.transactionId,balance:s.balance,rebatePending:s.rebatePending,deducted:cost};s.transactions[payload.transactionId]=out;this.saveDemo(s);return out;
    }
    if(name==='hitFish'||name==='fishResult'||name==='getResult'){
      const b=s.bullets[payload.bulletId];if(!b||b.used){const e=new Error('炮弹不存在或已经结算');e.status=409;throw e;}b.used=true;
      const mult={clown:2,butterfly:3,tang:5,snapper:8,angel:12,lion:20,turtle:30,crab:40,manta:60,marlin:80,octopus:120,boss:300}[payload.fishType]||2;
      const captured=Math.random()<Math.min(.72,.52/Math.sqrt(mult));const award=captured?money(b.cost*mult):0;if(award)s.balance=money(s.balance+award);
      const out={ok:true,captured,fishType:payload.fishType,multiplier:mult,award,transactionId:payload.transactionId,balance:s.balance,rebatePending:s.rebatePending,settled:true};s.transactions[payload.transactionId]=out;this.saveDemo(s);return out;
    }
    if(name==='settle'){const r=s.transactions[payload.transactionId];return {ok:true,found:!!r,response:r||null};}
    if(name==='claimRebate'){const claimed=money(s.rebatePending);s.rebatePending=0;s.balance=money(s.balance+claimed);this.saveDemo(s);return {ok:true,claimed,balance:s.balance,rebatePending:0};}
    if(name==='getRebate') return {ok:true,rebatePending:money(s.rebatePending),balance:money(s.balance)};
    if(name==='getHistory') return {ok:true,history:[]};
    if(name==='collect'||name==='bossEvent'||name==='cancelBet') return {ok:true,balance:money(s.balance),rebatePending:money(s.rebatePending)};
    return {ok:true};
  }
  meta(extra={}) {
    return {
      requestId: crypto.randomUUID(),
      transactionId: crypto.randomUUID(),
      operationId: crypto.randomUUID(),
      idempotencyKey: crypto.randomUUID(),
      gameId: GAME_CONFIG.gameId,
      sessionId: this.sessionId,
      deviceId: this.deviceId,
      ...extra
    };
  }
  resolveEndpoint(name) {
    if (this.mode === 'DEMO') return DEMO_ENDPOINTS[name];
    const ep = this.platform.endpoints?.[name];
    if (!ep) throw new Error(`PRODUCTION缺少接口映射: ${name}`);
    if (typeof ep === 'string') return ['POST', ep];
    return [String(ep.method || 'POST').toUpperCase(), ep.url];
  }
  async call(name, payload={}, options={}) {
    const [method, path] = this.resolveEndpoint(name);
    if (!path) throw new Error(`接口未配置: ${name}`);
    const base = this.mode === 'DEMO' ? '' : (this.platform.apiBase || '');
    const url = new URL(base + path, location.href);
    const bodyData = { sessionId:this.sessionId, gameId:GAME_CONFIG.gameId, ...payload };
    if (method === 'GET') {
      for (const [k,v] of Object.entries(bodyData)) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), options.timeoutMs || 7000);
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Accept':'application/json',
          ...(method === 'GET' ? {} : {'Content-Type':'application/json'}),
          ...(this.authToken ? {'Authorization':`Bearer ${this.authToken}`} : {}),
          'X-Session-Id': this.sessionId,
          'X-Game-Id': GAME_CONFIG.gameId
        },
        body: method === 'GET' ? undefined : JSON.stringify(bodyData),
        signal: ctrl.signal,
        cache: 'no-store'
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { throw new Error(`接口返回非JSON: ${name}`); }
      if (!res.ok || data.ok === false) {
        const err = new Error(data.message || `接口失败 ${res.status}: ${name}`);
        err.status = res.status; err.code = data.code; err.data = data;
        throw err;
      }
      if (!this.connected) { this.connected = true; this.dispatchEvent(new Event('reconnected')); }
      return data;
    } catch (err) {
      if (this.mode === 'DEMO') {
        // 静态预览（编辑器/Pages/普通静态服务器）没有 Node API 时，自动切换到浏览器内试玩后端。
        return this.localDemoCall(name, payload);
      }
      if (this.connected) { this.connected = false; this.dispatchEvent(new CustomEvent('disconnected',{detail:err})); }
      throw err;
    } finally { clearTimeout(timer); }
  }
  initializeGame() { return this.call('initializeGame', this.meta()); }
  getProfile() { return this.call('getProfile'); }
  getBalance() { return this.call('getBalance'); }
  refreshBalance() { return this.call('refreshBalance'); }
  getGameConfig() { return this.call('getGameConfig'); }
  getGameState() { return this.call('getGameState'); }
  restoreGameState() { return this.call('restoreGameState'); }
  saveGameState(state) { return this.call('saveGameState', { state, ...this.meta() }); }
  placeBet(data) { return this.call('placeBet', { ...this.meta(), ...data }); }
  cancelBet(data) { return this.call('cancelBet', { ...this.meta(), ...data }); }
  getResult(data) { return this.call('getResult', { ...this.meta(), ...data }); }
  settle(data) { return this.call('settle', data); }
  collect(data={}) { return this.call('collect', { ...this.meta(), ...data }); }
  getHistory(limit=50) { return this.call('getHistory', { limit }); }
  enterFishRoom(data={}) { return Promise.resolve({ok:true, roomId:data.roomId || 'deep-sea-01'}); }
  fire(data) { return this.call('fire', { ...this.meta(), ...data }); }
  lockTarget(data) { return Promise.resolve({ok:true, ...data}); }
  changeCannon(data) { return Promise.resolve({ok:true, ...data}); }
  hitFish(data) { return this.call('hitFish', { ...this.meta(), ...data }); }
  fishResult(data) { return this.call('fishResult', { ...this.meta(), ...data }); }
  bossEvent(data) { return this.call('bossEvent', { ...this.meta(), ...data }); }
  getRebate() { return this.call('getRebate'); }
  claimRebate() { return this.call('claimRebate', this.meta()); }
  openSupport() { return this.action('openSupport'); }
  openWallet() { return this.action('openWallet'); }
  openDeposit() { return this.action('openDeposit'); }
  openWithdraw() { return this.action('openWithdraw'); }
  exitGame() { return this.action('exitGame'); }
  returnHall() { return this.action('returnHall'); }
  loadSettings() {
    try { return JSON.parse(localStorage.getItem('yy9.deepSea.settings') || '{}'); } catch { return {}; }
  }
  saveSettings(settings) { localStorage.setItem('yy9.deepSea.settings', JSON.stringify(settings)); return Promise.resolve({ok:true}); }
  action(name) {
    const fn = this.platform.actions?.[name];
    if (typeof fn === 'function') return Promise.resolve(fn({gameId:GAME_CONFIG.gameId,hallId:GAME_CONFIG.hallId}));
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ source:'YY9_GAME', action:name, gameId:GAME_CONFIG.gameId, hallId:GAME_CONFIG.hallId }, '*');
      return Promise.resolve({ok:true,delegated:true});
    }
    if (name === 'returnHall' || name === 'exitGame') {
      const returnUrl = this.platform.returnUrl;
      if (returnUrl) { location.href = returnUrl; return Promise.resolve({ok:true}); }
      if (history.length > 1) { history.back(); return Promise.resolve({ok:true}); }
      return Promise.resolve({ok:false,message:'当前为独立试玩页，未配置捕鱼厅返回地址'});
    }
    if (name === 'openSupport') return Promise.resolve({ok:false,message:'客服地址由平台统一配置'});
    return Promise.resolve({ok:false,message:`${name} 由平台接管`});
  }
}
