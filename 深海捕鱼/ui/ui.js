export class GameUI {
  constructor(species) {
    this.species = species;
    this.nodes = Object.fromEntries([
      'app','lobby','btnEnterFishing','loading','progressBar','progressText','errorOverlay','errorMessage','btnRetry','nickname','avatar','vip','playerId','balance','rebate','cannonValue','cannonValueBottom','fps','eventBanner','btnBack','btnSupport','btnHelp','btnHelpClose','helpModal','fishGuide','btnCannonDown','btnCannonUp','btnLock','btnAuto','btnBgm','btnSfx','btnRebate','toast','modeBadge'
    ].map(id => [id, document.getElementById(id)]));
    this.toastTimer = 0;
    this.buildFishGuide();
  }
  buildFishGuide() {
    this.nodes.fishGuide.replaceChildren(...this.species.map(f => {
      const el=document.createElement('div'); el.className='fish-item';
      const img=document.createElement('img'); img.src=f.asset; img.alt=f.name;
      const strong=document.createElement('strong'); strong.textContent=f.name;
      const span=document.createElement('span'); span.textContent=`×${f.multiplier}`;
      el.append(img,strong,span); return el;
    }));
  }
  on(id,event,fn,opts) { this.nodes[id]?.addEventListener(event,fn,opts); }
  setProgress(value,label='') {
    const pct=Math.max(0,Math.min(100,Math.round(value*100)));
    this.nodes.progressBar.style.width=`${pct}%`;
    this.nodes.progressText.textContent=label || `正在加载 ${pct}%`;
  }
  hideLoading() { this.nodes.loading.classList.add('hidden'); }
  showLobby() {
    this.nodes.app.classList.add('app-lobby-open');
    this.nodes.lobby.classList.remove('hidden');
  }
  hideLobby() {
    this.nodes.app.classList.remove('app-lobby-open');
    this.nodes.lobby.classList.add('hidden');
  }
  setMode(mode) { this.nodes.modeBadge.textContent=mode; }
  setPlayer(profile={}) {
    this.nodes.nickname.textContent=profile.nickname || profile.username || '玩家';
    this.nodes.vip.textContent=`VIP${profile.vipLevel ?? 0}`;
    this.nodes.playerId.textContent=`ID ${profile.playerId || '--'}`;
    if (profile.avatar) {
      this.nodes.avatar.textContent='';
      this.nodes.avatar.style.backgroundImage=`url("${String(profile.avatar).replaceAll('"','%22')}")`;
    }
  }
  money(v) { return Number(v || 0).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2}); }
  setBalance(v) { this.nodes.balance.textContent=this.money(v); }
  setRebate(v) { this.nodes.rebate.textContent=this.money(v); }
  setCannon(v) { this.nodes.cannonValue.textContent=String(v); this.nodes.cannonValueBottom.textContent=String(v); }
  setFps(v) { this.nodes.fps.textContent=Number.isFinite(v) ? String(Math.round(v)) : '--'; }
  setEvent(text,kind='normal') {
    this.nodes.eventBanner.textContent=text;
    this.nodes.eventBanner.dataset.kind=kind;
  }
  setToggle(id,on,labelOn,labelOff) {
    const node=this.nodes[id]; node.setAttribute('aria-pressed',String(!!on));
    if (labelOn) node.textContent=on?labelOn:labelOff;
  }
  showError(message) { this.nodes.errorMessage.textContent=message || '连接异常'; this.nodes.errorOverlay.classList.remove('hidden'); }
  hideError() { this.nodes.errorOverlay.classList.add('hidden'); }
  showHelp() { this.nodes.helpModal.classList.remove('hidden'); }
  hideHelp() { this.nodes.helpModal.classList.add('hidden'); }
  onLobbySelect(handler) {
    this.nodes.btnEnterFishing?.addEventListener('click',()=>handler('fishing'));
    this.nodes.lobby?.addEventListener('click',event=>{
      const button=event.target.closest('[data-game]');
      if(button) handler(button.dataset.game || '');
    });
  }
  toast(message,duration=1800) {
    clearTimeout(this.toastTimer); this.nodes.toast.textContent=message; this.nodes.toast.classList.remove('hidden');
    this.toastTimer=setTimeout(()=>this.nodes.toast.classList.add('hidden'),duration);
  }
}
