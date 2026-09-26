import http from 'node:http';
import { readFile, writeFile, rename, mkdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID, randomInt } from 'node:crypto';

const ROOT=dirname(fileURLToPath(import.meta.url));
const DATA_DIR=join(ROOT,'.data');
const DB_FILE=join(DATA_DIR,'demo-state.json');
const PORT=Number(process.env.PORT||4173);
const HOST=process.env.HOST||'127.0.0.1';
const GAME_ID='yy9-deep-sea-fishing';
const ECONOMY=JSON.parse(await readFile(join(ROOT,'config','demo-economy.json'),'utf8'));
const CANNON_VALUES=ECONOMY.cannonValues;
const REBATE_RATE=Number(ECONOMY.rebateRate);
const SPECIES=Object.fromEntries(Object.entries(ECONOMY.fish).map(([key,v])=>[key,{name:v.name,multiplier:Number(v.multiplier),chance:Number(v.captureChance)}]));

let db={sessions:{}};
let writeQueue=Promise.resolve();
const sseClients=new Map();

async function loadDb(){
  await mkdir(DATA_DIR,{recursive:true});
  try{db=JSON.parse(await readFile(DB_FILE,'utf8'));if(!db.sessions)db.sessions={};}catch{db={sessions:{}};await persist();}
}
async function persist(){
  const tmp=DB_FILE+'.tmp'; await writeFile(tmp,JSON.stringify(db,null,2)); await rename(tmp,DB_FILE);
}
function mutate(fn){
  const job=writeQueue.then(async()=>{const out=await fn();await persist();return out;});
  writeQueue=job.catch(()=>{}); return job;
}
function session(id){
  if(!id) throw Object.assign(new Error('缺少sessionId'),{status:400,code:'MISSING_SESSION'});
  if(!db.sessions[id]){
    db.sessions[id]={
      profile:{playerId:`DEMO-${id.replace(/-/g,'').slice(0,10).toUpperCase()}`,username:'demo',nickname:'深海试玩玩家',avatar:'',vipLevel:1,currency:'CNY',language:'zh-CN',timezone:'Asia/Phnom_Penh'},
      balance:Number(ECONOMY.startingBalance),rebatePending:0,turnover:0,history:[],bullets:{},transactions:{},idem:{},
      gameState:{roomId:'deep-sea-01',roundId:`round-${Date.now()}`,cannonValue:10,bonusIndex:0,nextBonusAt:Date.now()+20000,orientation:'responsive'}
    };
  }
  prune(db.sessions[id]); return db.sessions[id];
}
function prune(s){
  const now=Date.now(); for(const [id,b] of Object.entries(s.bullets))if(b.expiresAt<now-15000)delete s.bullets[id];
  const hs=s.history||[]; if(hs.length>200)s.history=hs.slice(-200);
  const txKeys=Object.keys(s.transactions||{}); if(txKeys.length>600)for(const k of txKeys.slice(0,txKeys.length-500))delete s.transactions[k];
  const ik=Object.keys(s.idem||{}); if(ik.length>600)for(const k of ik.slice(0,ik.length-500))delete s.idem[k];
}
function money(v){return Math.round((Number(v)+Number.EPSILON)*100)/100;}
function json(res,status,data){const body=JSON.stringify(data);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Content-Length':Buffer.byteLength(body)});res.end(body);}
function getSessionId(req,url,body={}){return body.sessionId||url.searchParams.get('sessionId')||req.headers['x-session-id'];}
async function bodyJson(req){
  let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>65536)throw Object.assign(new Error('请求体过大'),{status:413});}
  if(!raw)return{};try{return JSON.parse(raw);}catch{throw Object.assign(new Error('JSON格式错误'),{status:400});}
}
function idemHit(s,key){return key&&s.idem[key] ? structuredClone(s.idem[key]) : null;}
function storeIdem(s,key,response){if(key)s.idem[key]=structuredClone(response);}
function record(s,entry){s.history.push({at:Date.now(),...entry});}
function txStore(s,txId,type,response){if(txId)s.transactions[txId]={type,at:Date.now(),response:structuredClone(response)};}
function broadcast(sessionId,payload){const set=sseClients.get(sessionId);if(!set)return;const msg=`data: ${JSON.stringify(payload)}\n\n`;for(const res of set){try{res.write(msg);}catch{}}}

async function api(req,res,url){
  const path=url.pathname; const method=req.method||'GET'; const body=method==='GET'?{}:await bodyJson(req); const sid=getSessionId(req,url,body);
  if(path==='/api/health')return json(res,200,{ok:true,gameId:GAME_ID,time:Date.now()});
  if(path==='/api/events'&&method==='GET'){
    const s=session(sid); res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write(`data: ${JSON.stringify({type:'hello',serverTime:Date.now(),balance:s.balance})}\n\n`);
    let set=sseClients.get(sid);if(!set)sseClients.set(sid,set=new Set());set.add(res);const ping=setInterval(()=>{try{res.write(`data: ${JSON.stringify({type:'ping',serverTime:Date.now()})}\n\n`);}catch{}},5000);
    req.on('close',()=>{clearInterval(ping);set.delete(res);if(!set.size)sseClients.delete(sid);});return;
  }
  if(path==='/api/initialize'&&method==='POST')return mutate(async()=>{const s=session(sid);return json(res,200,{ok:true,mode:'DEMO',productionReady:false,sessionId:sid,serverTime:Date.now(),playerId:s.profile.playerId});});
  if(path==='/api/profile'&&method==='GET'){const s=session(sid);return json(res,200,{ok:true,profile:s.profile});}
  if(path==='/api/balance'&&method==='GET'){const s=session(sid);return json(res,200,{ok:true,balance:money(s.balance),rebatePending:money(s.rebatePending),currency:s.profile.currency});}
  if(path==='/api/config'&&method==='GET')return json(res,200,{ok:true,gameId:GAME_ID,cannonValues:CANNON_VALUES,fish:Object.fromEntries(Object.entries(SPECIES).map(([k,v])=>[k,{name:v.name,multiplier:v.multiplier}]))});
  if(path==='/api/state'&&method==='GET'){const s=session(sid);return json(res,200,{ok:true,state:s.gameState,rebatePending:money(s.rebatePending),openBullets:Object.values(s.bullets).filter(b=>!b.used&&b.expiresAt>Date.now()).length});}
  if(path==='/api/state/save'&&method==='POST')return mutate(async()=>{const s=session(sid),incoming=body.state||{};const allow=['roomId','roundId','cannonValue','bonusIndex','nextBonusAt','orientation'];for(const k of allow)if(incoming[k]!==undefined)s.gameState[k]=incoming[k];return json(res,200,{ok:true,state:s.gameState});});
  if(path==='/api/history'&&method==='GET'){const s=session(sid);const limit=Math.max(1,Math.min(100,Number(url.searchParams.get('limit')||50)));return json(res,200,{ok:true,history:s.history.slice(-limit).reverse()});}
  if(path==='/api/rebate'&&method==='GET'){const s=session(sid);return json(res,200,{ok:true,rebatePending:money(s.rebatePending),balance:money(s.balance)});}
  if(path==='/api/fishing/fire'&&method==='POST')return mutate(async()=>{
    const s=session(sid); const cached=idemHit(s,body.idempotencyKey);if(cached)return json(res,200,cached);
    const cannon=Number(body.cannonValue);if(!CANNON_VALUES.includes(cannon))return json(res,400,{ok:false,code:'INVALID_CANNON',message:'无效炮值'});
    if(s.balance<cannon)return json(res,402,{ok:false,code:'INSUFFICIENT_BALANCE',message:'余额不足',balance:money(s.balance)});
    const bulletId=randomUUID();s.balance=money(s.balance-cannon);s.turnover=money(s.turnover+cannon);s.rebatePending=money(s.rebatePending+cannon*REBATE_RATE);
    s.bullets[bulletId]={bulletId,cost:cannon,issuedAt:Date.now(),expiresAt:Date.now()+5200,used:false,roundId:body.roundId,transactionId:body.transactionId};
    const out={ok:true,bulletId,roundId:body.roundId,transactionId:body.transactionId,balance:money(s.balance),rebatePending:money(s.rebatePending),deducted:cannon};
    storeIdem(s,body.idempotencyKey,out);txStore(s,body.transactionId,'fire',out);record(s,{type:'fire',roundId:body.roundId,transactionId:body.transactionId,amount:-cannon,balance:s.balance});broadcast(sid,{type:'balance',balance:s.balance,rebatePending:s.rebatePending});return json(res,200,out);
  });
  if(path==='/api/fishing/hit'&&method==='POST')return mutate(async()=>{
    const s=session(sid);const cached=idemHit(s,body.idempotencyKey);if(cached)return json(res,200,cached);
    const bullet=s.bullets[body.bulletId];if(!bullet)return json(res,409,{ok:false,code:'BULLET_NOT_FOUND',message:'炮弹不存在或已过期'});
    if(bullet.used)return json(res,409,{ok:false,code:'BULLET_USED',message:'该炮弹已经结算'});
    if(bullet.expiresAt<Date.now())return json(res,409,{ok:false,code:'BULLET_EXPIRED',message:'炮弹已过期'});
    const fish=SPECIES[body.fishType];if(!fish)return json(res,400,{ok:false,code:'INVALID_FISH',message:'未知鱼种'});
    bullet.used=true;bullet.fishId=String(body.fishId||'');
    const roll=randomInt(0,1000000)/1000000;const captured=roll<fish.chance;const award=captured?money(bullet.cost*fish.multiplier):0;if(award)s.balance=money(s.balance+award);
    const out={ok:true,captured,fishType:body.fishType,fishName:fish.name,multiplier:fish.multiplier,award,transactionId:body.transactionId,balance:money(s.balance),rebatePending:money(s.rebatePending),settled:true};
    storeIdem(s,body.idempotencyKey,out);txStore(s,body.transactionId,'hit',out);record(s,{type:'hit',roundId:body.roundId,transactionId:body.transactionId,fishType:body.fishType,captured,award,balance:s.balance});broadcast(sid,{type:'balance',balance:s.balance,rebatePending:s.rebatePending});return json(res,200,out);
  });
  if(path==='/api/cancel-bet'&&method==='POST')return mutate(async()=>{
    const s=session(sid),bullet=s.bullets[body.bulletId];if(!bullet||bullet.used)return json(res,409,{ok:false,code:'NOT_CANCELLABLE',message:'该下注不可取消'});if(Date.now()-bullet.issuedAt>220)return json(res,409,{ok:false,code:'CANCEL_WINDOW_CLOSED',message:'取消窗口已关闭'});
    bullet.used=true;bullet.cancelled=true;s.balance=money(s.balance+bullet.cost);s.turnover=money(Math.max(0,s.turnover-bullet.cost));s.rebatePending=money(Math.max(0,s.rebatePending-bullet.cost*REBATE_RATE));const out={ok:true,refunded:bullet.cost,balance:s.balance,rebatePending:s.rebatePending};record(s,{type:'cancel',amount:bullet.cost,balance:s.balance});return json(res,200,out);
  });
  if(path==='/api/settlement'&&method==='GET'){const s=session(sid);const tx=url.searchParams.get('transactionId');const found=tx&&s.transactions[tx];return json(res,200,{ok:true,found:!!found,type:found?.type||null,response:found?.response||null});}
  if(path==='/api/collect'&&method==='POST'){const s=session(sid);return json(res,200,{ok:true,collected:0,balance:money(s.balance),rebatePending:money(s.rebatePending)});}
  if(path==='/api/rebate/claim'&&method==='POST')return mutate(async()=>{
    const s=session(sid);const cached=idemHit(s,body.idempotencyKey);if(cached)return json(res,200,cached);const claimed=money(s.rebatePending);s.rebatePending=0;s.balance=money(s.balance+claimed);const out={ok:true,claimed,balance:s.balance,rebatePending:0,transactionId:body.transactionId};storeIdem(s,body.idempotencyKey,out);txStore(s,body.transactionId,'rebate',out);record(s,{type:'rebate',transactionId:body.transactionId,amount:claimed,balance:s.balance});broadcast(sid,{type:'balance',balance:s.balance,rebatePending:0});return json(res,200,out);
  });
  if(path==='/api/boss-event'&&method==='POST')return mutate(async()=>{const s=session(sid);record(s,{type:'boss-event',event:String(body.event||'unknown'),roundId:body.roundId,award:Number(body.award||0)});return json(res,200,{ok:true});});
  return json(res,404,{ok:false,code:'API_NOT_FOUND',message:'接口不存在'});
}

const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8'};
async function serveStatic(req,res,url){
  let rel=decodeURIComponent(url.pathname);if(rel==='/'||rel==='')rel='/index.html';
  const full=resolve(ROOT,'.'+normalize(rel));if(!full.startsWith(resolve(ROOT)))return json(res,403,{ok:false,message:'禁止访问'});
  try{const st=await stat(full);if(!st.isFile())throw new Error('not-file');res.writeHead(200,{'Content-Type':MIME[extname(full).toLowerCase()]||'application/octet-stream','Cache-Control':extname(full)==='.html'?'no-cache':'public,max-age=3600'});createReadStream(full).pipe(res);}catch{json(res,404,{ok:false,message:'文件不存在'});}
}

await loadDb();
const server=http.createServer(async(req,res)=>{
  try{const url=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);if(url.pathname.startsWith('/api/'))await api(req,res,url);else await serveStatic(req,res,url);}catch(err){console.error(err);json(res,err.status||500,{ok:false,code:err.code||'SERVER_ERROR',message:err.message||'服务器错误'});}
});
server.listen(PORT,HOST,()=>console.log(`深海捕鱼 DEMO 服务已启动: http://${HOST}:${PORT}/`));
