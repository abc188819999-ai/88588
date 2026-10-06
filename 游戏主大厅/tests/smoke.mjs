import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const port=4174;
const child=spawn(process.execPath,['demo-server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',d=>logs+=d);child.stderr.on('data',d=>logs+=d);
const base=`http://127.0.0.1:${port}`;
const sid=`smoke-${randomUUID()}`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function wait(){for(let i=0;i<30;i++){try{const r=await fetch(base+'/api/health');if(r.ok)return;}catch{}await sleep(100);}throw new Error('服务启动失败 '+logs);}
async function j(path,opt={}){const r=await fetch(base+path,opt);const data=await r.json();if(!r.ok||data.ok===false)throw new Error(`${path} ${r.status} ${JSON.stringify(data)}`);return data;}
const post=(path,data)=>j(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
try{
  await wait();
  const page=await fetch(base+'/'); if(!page.ok||(await page.text()).includes('<title>横屏游戏主大厅</title>')===false)throw new Error('首页静态资源失败');
  await post('/api/initialize',{sessionId:sid});
  const b0=await j(`/api/balance?sessionId=${sid}`);if(b0.balance!==100000)throw new Error('初始余额错误');
  const firePayload={sessionId:sid,cannonValue:10,roundId:'r-smoke',transactionId:'tx-fire',requestId:'rq-fire',idempotencyKey:'idem-fire'};
  const f1=await post('/api/fishing/fire',firePayload);const f2=await post('/api/fishing/fire',firePayload);
  if(f1.bulletId!==f2.bulletId||f1.balance!==99990||f2.balance!==99990)throw new Error('发炮幂等失败');
  const hitPayload={sessionId:sid,bulletId:f1.bulletId,fishId:'fish-smoke',fishType:'clown',roundId:'r-smoke',transactionId:'tx-hit',requestId:'rq-hit',idempotencyKey:'idem-hit'};
  const h1=await post('/api/fishing/hit',hitPayload);const h2=await post('/api/fishing/hit',hitPayload);
  if(JSON.stringify(h1)!==JSON.stringify(h2))throw new Error('命中幂等失败');
  const tx=await j(`/api/settlement?sessionId=${sid}&transactionId=tx-hit`);if(!tx.found||tx.response.transactionId!=='tx-hit')throw new Error('结算恢复失败');
  await post('/api/state/save',{sessionId:sid,state:{roundId:'restore-round',cannonValue:20,bonusIndex:2,nextBonusAt:Date.now()+80000,roomId:'deep-sea-01',orientation:'portrait'}});
  const state=await j(`/api/state?sessionId=${sid}`);if(state.state.roundId!=='restore-round'||state.state.cannonValue!==20)throw new Error('状态恢复失败');
  const reb1=await post('/api/rebate/claim',{sessionId:sid,transactionId:'tx-rebate',requestId:'rq-rebate',idempotencyKey:'idem-rebate'});
  const reb2=await post('/api/rebate/claim',{sessionId:sid,transactionId:'tx-rebate',requestId:'rq-rebate',idempotencyKey:'idem-rebate'});
  if(JSON.stringify(reb1)!==JSON.stringify(reb2))throw new Error('返水幂等失败');
  console.log('SMOKE_OK',JSON.stringify({fireBalance:f1.balance,captured:h1.captured,award:h1.award,rebateClaimed:reb1.claimed}));
} finally {
  child.kill('SIGTERM');
  await Promise.race([new Promise(r=>child.once('exit',r)),sleep(1000)]);
}
