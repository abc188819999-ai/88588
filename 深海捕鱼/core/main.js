import { GAME_CONFIG, FISH_SPECIES, AUDIO_ASSETS } from '../config/game-config.js';
import { StateMachine } from './state-machine.js';
import { AudioManager } from './audio-manager.js';
import { PlatformBridge } from '../api/platform-bridge.js';
import { RealtimeClient } from '../realtime/client.js';
import { GameUI } from '../ui/ui.js';
import { DeepSeaFishingGame } from './game.js';

const canvas=document.getElementById('gameCanvas');
const ui=new GameUI(FISH_SPECIES);
const bridge=new PlatformBridge();
const audio=new AudioManager(AUDIO_ASSETS);
const fsm=new StateMachine();
const realtime=new RealtimeClient(bridge);
const game=new DeepSeaFishingGame({canvas,bridge,ui,audio,stateMachine:fsm,realtime});
window.__YY9_DEEP_SEA_GAME__=game;
ui.setMode(bridge.mode);
ui.showLobby();

ui.onLobbySelect(gameKey=>{
  if(gameKey==='fishing'){
    ui.hideLobby();
    ui.toast('已进入深海捕鱼');
    audio.ensureContext().then(()=>audio.startBgm()).catch(()=>{});
    return;
  }
  ui.toast('该入口已布局完成，玩法内容即将接入');
});

async function boot(){
  try{
    fsm.transition('LOADING'); ui.setProgress(.03,'正在加载横屏大厅 3%');
    const init=await bridge.initializeGame();
    ui.setProgress(.12,'正在读取玩家数据 12%');
    const [profile,balance,state,serverConfig]=await Promise.all([bridge.getProfile(),bridge.getBalance(),bridge.restoreGameState(),bridge.getGameConfig()]);
    ui.setProgress(.23,'正在加载海底场景 23%');
    let assetProgress=0;
    const audioLoad = audio.load().catch(err=>console.warn('音频预加载失败，将在首次交互后继续运行',err));
    await game.loadAssets(p=>{assetProgress=p;ui.setProgress(.23+.57*assetProgress);});
    ui.setProgress(.84,'正在恢复游戏状态 84%');
    const settings=bridge.loadSettings();
    game.applyInitialData({profile:profile.profile||profile,balance,state:state.state||state,settings});
    game.bind();
    ui.setProgress(.94,'正在校验资源与接口 94%');
    if(bridge.mode==='PRODUCTION' && !init.productionReady) throw new Error('PRODUCTION接口未返回productionReady，已停止进入真钱流程');
    fsm.transition('READY');
    ui.setProgress(1,'加载完成 100%');
    await new Promise(r=>setTimeout(r,180));
    ui.hideLoading();
    game.start();
  }catch(err){
    console.error(err);
    try{if(fsm.can('ERROR'))fsm.transition('ERROR');}catch{}
    ui.hideLoading(); ui.showError(err?.message||'游戏初始化失败');
  }
}

window.addEventListener('pagehide',()=>game.saveState(),{capture:true});
boot();
