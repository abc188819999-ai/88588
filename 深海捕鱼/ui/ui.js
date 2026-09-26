const LOBBY_GROUPS = [
  {
    key: 'fishing',
    title: '深海捕鱼',
    subtitle: '海底主题、鱼潮、Boss 与火力切换',
    badge: 'HOT',
    status: '可试玩',
    sectionColors: ['#145b8f', '#071526'],
    scenes: [
      { label: '黄金鲨王', text: '高爆海沟场', colors: ['#278fd7', '#07203a', 'rgba(255,214,96,.28)'] },
      { label: '鱼潮模式', text: '整屏刷鱼 · 连续爆金', colors: ['#18b5f2', '#08243f', 'rgba(91,226,255,.22)'] },
      { label: '夺宝深海', text: '炮值切换 · 速刷金币', colors: ['#2b73c9', '#061529', 'rgba(255,246,153,.18)'] },
    ],
    games: [
      { key: 'fishing', title: '深海捕鱼', subtitle: '当前接入可试玩版本，点击直接进入。', badge: '可进入', status: '可试玩', playable: true, jackpot: 388888, online: 6888, scenes: [
        { label: '黄金鲨王', text: 'Boss 追猎画面', colors: ['#278fd7', '#07203a', 'rgba(255,214,96,.28)'] },
        { label: '鱼潮扫图', text: '横贯鱼潮冲分', colors: ['#18b5f2', '#08243f', 'rgba(91,226,255,.22)'] },
        { label: '炮台连击', text: '自动火力连续开炮', colors: ['#2b73c9', '#061529', 'rgba(255,246,153,.18)'] },
      ]},
      { key: 'fishing-elite', title: '猎鲨竞技', subtitle: '多人竞技版捕鱼大厅卡片预览。', badge: '预告', status: '预览中', jackpot: 528888, online: 5421, scenes: [
        { label: '竞技深渊', text: '多人抢分 · 高倍鲨王', colors: ['#3272d9', '#091930', 'rgba(123,208,255,.18)'] },
        { label: '海妖秘境', text: '旋涡出鱼 · 爆金币', colors: ['#1fb6ff', '#0b2744', 'rgba(255,227,116,.18)'] },
        { label: '海底夺宝', text: '彩金波动演示', colors: ['#215aab', '#071421', 'rgba(255,255,255,.18)'] },
      ]},
      { key: 'fishing-arcade', title: '街机炮王', subtitle: '偏街机风格的捕鱼子卡预览。', badge: '新厅', status: '预览中', jackpot: 268888, online: 4730, scenes: [
        { label: '炮王机台', text: '街机炮值跳档', colors: ['#0e8bb9', '#061724', 'rgba(255,203,122,.16)'] },
        { label: '怒海金潮', text: '暴击特效切画面', colors: ['#2ebcfd', '#092742', 'rgba(255,255,255,.16)'] },
        { label: '金炮模式', text: '彩金快感预览', colors: ['#1b5f9c', '#06131d', 'rgba(255,234,135,.20)'] },
      ]},
    ],
  },
  {
    key: 'slots',
    title: '老虎机专区',
    subtitle: '连环夺宝、宝石派对、糖果派对等电子游戏入口',
    badge: '电子',
    status: '热门',
    sectionColors: ['#6938c2', '#190b35'],
    scenes: [
      { label: '彩金墙', text: '多列机台手滑切换', colors: ['#7b4dff', '#1a0b34', 'rgba(255,170,110,.20)'] },
      { label: '宝石机台', text: '连线爆分 · 彩金滚动', colors: ['#9e4bff', '#261046', 'rgba(93,228,255,.16)'] },
      { label: '糖果派对', text: '高亮糖果转轴', colors: ['#ff63c2', '#2c1132', 'rgba(255,255,255,.18)'] },
    ],
    games: [
      { key: 'treasure', title: '连环夺宝', subtitle: '经典多轴电子风格卡片。', badge: '爆款', status: '预览中', jackpot: 968888, online: 7320, scenes: [
        { label: '宝图模式', text: '三轴彩金滚动', colors: ['#a24dff', '#1d0f39', 'rgba(255,219,123,.22)'] },
        { label: '连爆状态', text: '多连线高亮切屏', colors: ['#7a55ff', '#1a1030', 'rgba(133,226,255,.16)'] },
        { label: '彩金收集', text: '奖池滚动持续上冲', colors: ['#ca4dff', '#250f40', 'rgba(255,255,255,.18)'] },
      ]},
      { key: 'gem-party', title: '宝石派对', subtitle: '宝石主题电子卡片，支持画面切换。', badge: '推荐', status: '预览中', jackpot: 788888, online: 6410, scenes: [
        { label: '宝石爆亮', text: '高亮特效轮换', colors: ['#3cb7ff', '#121b38', 'rgba(255,255,255,.18)'] },
        { label: '彩金雨', text: '彩金数值动态滚动', colors: ['#6f4cff', '#150e2d', 'rgba(255,217,121,.18)'] },
        { label: '钻石转轴', text: '三段切画面预览', colors: ['#09a4d9', '#071326', 'rgba(174,241,255,.20)'] },
      ]},
      { key: 'candy-party', title: '糖果派对', subtitle: '糖果弹跳风格的电子次级卡。', badge: '轻快', status: '预览中', jackpot: 658888, online: 5876, scenes: [
        { label: '糖果海', text: '糖果图块轮换', colors: ['#ff6cbf', '#31112d', 'rgba(255,249,174,.18)'] },
        { label: '甜蜜连线', text: '爆分状态切换', colors: ['#ff4f96', '#2a0f2a', 'rgba(255,255,255,.16)'] },
        { label: '派对连爆', text: '推荐位动态展示', colors: ['#ff8c74', '#37152d', 'rgba(255,222,144,.16)'] },
      ]},
      { key: 'bbin-style', title: 'BBIN电子馆', subtitle: '参考电子游戏大厅样式做的预览入口。', badge: '馆区', status: '预览中', jackpot: 1188888, online: 8220, scenes: [
        { label: '经典馆区', text: '馆区封面切换', colors: ['#3856ff', '#0d1637', 'rgba(255,240,149,.18)'] },
        { label: '彩金推荐', text: '动态推荐电子位', colors: ['#7056ff', '#151338', 'rgba(133,226,255,.18)'] },
        { label: '高爆预告', text: '在线人数随机变化', colors: ['#4a6dff', '#11182d', 'rgba(255,255,255,.16)'] },
      ]},
    ],
  },
  {
    key: 'baccarat',
    title: '百家乐专区',
    subtitle: '横屏桌台、路纸状态、推荐桌动态位',
    badge: '牌桌',
    status: '热门',
    sectionColors: ['#0f8a73', '#071d24'],
    scenes: [
      { label: '旗舰厅', text: '庄闲路纸与桌台展示', colors: ['#1ba28f', '#081d26', 'rgba(255,238,175,.18)'] },
      { label: '高速桌', text: '快速下注台面', colors: ['#0dcfb7', '#0a2330', 'rgba(194,255,241,.16)'] },
      { label: '珠盘路', text: '动态推荐桌切换', colors: ['#1f8f99', '#07171d', 'rgba(255,255,255,.18)'] },
    ],
    games: [
      { key: 'baccarat-vip', title: 'VIP百家乐', subtitle: '贵宾桌与大路纸推荐位。', badge: '贵宾', status: '预览中', jackpot: 888888, online: 5102, scenes: [
        { label: '贵宾桌', text: '大路纸状态切换', colors: ['#0fb59d', '#082128', 'rgba(255,226,137,.18)'] },
        { label: '长龙桌', text: '热门桌数据浮动', colors: ['#17a898', '#081e22', 'rgba(209,255,245,.16)'] },
        { label: '庄闲局', text: '推荐桌动态切画面', colors: ['#0f8a73', '#07171d', 'rgba(255,255,255,.18)'] },
      ]},
      { key: 'baccarat-speed', title: '极速百家乐', subtitle: '快速开局版二类卡片。', badge: '极速', status: '预览中', jackpot: 628888, online: 4380, scenes: [
        { label: '快开桌', text: '高速下注提示', colors: ['#14c1a4', '#08242b', 'rgba(255,251,179,.18)'] },
        { label: '抢庄氛围', text: '彩金与在线滚动', colors: ['#13a598', '#0a1f25', 'rgba(255,255,255,.16)'] },
        { label: '路纸预览', text: '画面自动切换', colors: ['#0c8775', '#06171a', 'rgba(190,255,245,.16)'] },
      ]},
    ],
  },
  {
    key: 'dragon-tiger',
    title: '龙虎斗',
    subtitle: '极速下注、单局对决、台面状态切换',
    badge: '速战',
    status: '火热',
    sectionColors: ['#c14631', '#2b0f0a'],
    scenes: [
      { label: '龙虎对决', text: '红蓝台面快速切场', colors: ['#ff8554', '#2c120d', 'rgba(255,222,128,.18)'] },
      { label: '决胜一局', text: '单局快节奏预览', colors: ['#ff5b51', '#36110e', 'rgba(255,255,255,.18)'] },
      { label: '热台推荐', text: '热门牌桌动态位', colors: ['#d64f39', '#230d0a', 'rgba(255,240,195,.16)'] },
    ],
    games: [
      { key: 'dragon-tiger-main', title: '龙虎斗主桌', subtitle: '主桌入口，展示大小单双氛围。', badge: '主桌', status: '预览中', jackpot: 558888, online: 3960, scenes: [
        { label: '龙虎主桌', text: '牌面区高亮切换', colors: ['#ff8554', '#2c120d', 'rgba(255,222,128,.18)'] },
        { label: '押注高峰', text: '在线人数慢涨慢跌', colors: ['#ff5b51', '#36110e', 'rgba(255,255,255,.18)'] },
        { label: '决胜推荐', text: '推荐位轮换展示', colors: ['#d64f39', '#230d0a', 'rgba(255,240,195,.16)'] },
      ]},
      { key: 'dragon-tiger-pro', title: '龙虎斗竞速台', subtitle: '更快节奏的二类卡片。', badge: '竞速', status: '预览中', jackpot: 488888, online: 3550, scenes: [
        { label: '竞速台', text: '台面色块切换', colors: ['#fe6f3d', '#2f0f0b', 'rgba(255,234,165,.18)'] },
        { label: '热台涨幅', text: '奖池滚动持续变化', colors: ['#f34f36', '#2b0907', 'rgba(255,255,255,.16)'] },
        { label: '一击分胜', text: '切画面预览', colors: ['#d7592d', '#1f0906', 'rgba(255,220,140,.16)'] },
      ]},
    ],
  },
  {
    key: 'animals',
    title: '飞禽走兽 / 鱼虾蟹',
    subtitle: '动物类、转盘类、传统玩法集中展示',
    badge: '经典',
    status: '热门',
    sectionColors: ['#b78a20', '#2a1804'],
    scenes: [
      { label: '飞禽走兽', text: '转盘氛围与押注区预览', colors: ['#d6a83d', '#2f1b05', 'rgba(255,245,188,.18)'] },
      { label: '鱼虾蟹', text: '传统盘面与彩金滚动', colors: ['#e6b73c', '#2a1704', 'rgba(255,255,255,.16)'] },
      { label: '押注热点', text: '推荐位与人气值浮动', colors: ['#c18a22', '#241305', 'rgba(255,222,143,.16)'] },
    ],
    games: [
      { key: 'flying-animals', title: '飞禽走兽', subtitle: '经典动物转盘类卡片。', badge: '经典', status: '预览中', jackpot: 708888, online: 6098, scenes: [
        { label: '飞禽转盘', text: '动物图标轮换', colors: ['#d6a83d', '#2f1b05', 'rgba(255,245,188,.18)'] },
        { label: '押注热点', text: '彩金与人数动态浮动', colors: ['#c8962e', '#271803', 'rgba(255,255,255,.16)'] },
        { label: '走势推荐', text: '推荐位切换预览', colors: ['#b98218', '#1f1203', 'rgba(255,226,156,.18)'] },
      ]},
      { key: 'fish-shrimp-crab', title: '鱼虾蟹', subtitle: '传统鱼虾蟹玩法的二类卡。', badge: '传统', status: '预览中', jackpot: 458888, online: 4210, scenes: [
        { label: '传统盘面', text: '大小单双样式切换', colors: ['#efbf45', '#2f1a04', 'rgba(255,255,255,.16)'] },
        { label: '连开状态', text: '奖池滚动', colors: ['#d7a53a', '#281804', 'rgba(255,233,176,.18)'] },
        { label: '热区推荐', text: '人气波动展示', colors: ['#bf8e20', '#241305', 'rgba(255,244,196,.14)'] },
      ]},
    ],
  },
  {
    key: 'chess',
    title: '棋牌游戏',
    subtitle: '多桌展示、牌桌入口、多人房间分区',
    badge: '多桌',
    status: '预览中',
    sectionColors: ['#335b7d', '#0a1624'],
    scenes: [
      { label: '多桌大厅', text: '牌桌入口一屏滑动查看', colors: ['#3f75a5', '#0a1724', 'rgba(255,231,162,.18)'] },
      { label: '好友约局', text: '房间位状态预览', colors: ['#2a6ca0', '#0a1e31', 'rgba(194,231,255,.18)'] },
      { label: '牌局推荐', text: '在线人数浮动展示', colors: ['#4a7ba3', '#091321', 'rgba(255,255,255,.16)'] },
    ],
    games: [
      { key: 'chess-lobby', title: '棋牌大厅', subtitle: '主分区卡片，展示多桌与房间状态。', badge: '主分区', status: '预览中', jackpot: 358888, online: 2844, scenes: [
        { label: '多桌大厅', text: '房间封面切换', colors: ['#3f75a5', '#0a1724', 'rgba(255,231,162,.18)'] },
        { label: '好友约局', text: '在线人数缓慢变动', colors: ['#2a6ca0', '#0a1e31', 'rgba(194,231,255,.18)'] },
        { label: '热房推荐', text: '推荐位动画展示', colors: ['#4a7ba3', '#091321', 'rgba(255,255,255,.16)'] },
      ]},
      { key: 'chess-room', title: '对战房', subtitle: '二类卡片，预留棋牌房间入口。', badge: '房间', status: '预览中', jackpot: 298888, online: 2410, scenes: [
        { label: '对战房', text: '桌台状态变化', colors: ['#4f7ea8', '#0a1724', 'rgba(255,230,150,.16)'] },
        { label: '赛事房', text: '活动推荐位切换', colors: ['#2f6da5', '#0a182a', 'rgba(203,239,255,.16)'] },
        { label: '好友桌', text: '轻量动画预览', colors: ['#456d8f', '#09121b', 'rgba(255,255,255,.14)'] },
      ]},
    ],
  },
];

const MARQUEE_MESSAGES = [
  '欢迎进入横屏综合大厅，所有主卡片支持手动左右滑动查看。',
  '大厅在线人数在 2000 ~ 10000 区间内随机缓慢波动，仅用于展示效果。',
  '奖池金额、推荐位、卡片画面都会动态变化，方便先看整体大厅感觉。',
  '当前已接入可试玩深海捕鱼，其余分类先展示大厅动态与双层卡片效果。',
];

function money(v) {
  return `¥ ${Number(v || 0).toLocaleString('zh-CN')}`;
}

function int(v) {
  return Math.round(Number(v || 0)).toLocaleString('zh-CN');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class GameUI {
  constructor(species) {
    this.species = species;
    this.nodes = Object.fromEntries([
      'app','lobby','btnEnterFishing','marqueeTrack','lobbyTotalOnline','lobbyTotalJackpot','recommendationTitle','recommendationScene',
      'recommendationOnline','recommendationJackpot','recommendationStatus','recommendationBadge','lobbyRecommendation',
      'featuredRail','lobbySections','loading','progressBar','progressText','errorOverlay','errorMessage','btnRetry','nickname',
      'avatar','vip','playerId','balance','rebate','cannonValue','cannonValueBottom','fps','eventBanner','btnBack','btnSupport',
      'btnHelp','btnHelpClose','helpModal','fishGuide','btnCannonDown','btnCannonUp','btnLock','btnAuto','btnBgm','btnSfx',
      'btnRebate','toast','modeBadge'
    ].map(id => [id, document.getElementById(id)]));
    this.toastTimer = 0;
    this.lobbyCards = [];
    this.recommendationIndex = 0;
    this.dynamicTimer = 0;
    this.buildFishGuide();
    this.buildLobby();
    this.startLobbyDynamics();
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

  buildLobby() {
    this.nodes.marqueeTrack.replaceChildren(...[...MARQUEE_MESSAGES, ...MARQUEE_MESSAGES].map(text => {
      const span=document.createElement('span');
      span.textContent=text;
      return span;
    }));

    this.nodes.featuredRail.replaceChildren(...LOBBY_GROUPS.map(group => this.createLobbyCard(group, { featured: true, key: group.key, playable: group.key === 'fishing' })));
    this.nodes.lobbySections.replaceChildren(...LOBBY_GROUPS.map(group => this.createCategorySection(group)));
    this.enableDragScroll(this.nodes.featuredRail);
    for (const rail of this.nodes.lobbySections.querySelectorAll('.lobby-scroll')) this.enableDragScroll(rail);
    this.updateRecommendation(0);
    this.refreshLobbyTotals();
  }

  createCategorySection(group) {
    const article=document.createElement('section');
    article.className='category-section glass';

    const head=document.createElement('div');
    head.className='category-head';

    const feature=document.createElement('div');
    feature.className='category-feature';
    feature.style.setProperty('--section-a', group.sectionColors[0]);
    feature.style.setProperty('--section-b', group.sectionColors[1]);
    feature.innerHTML = `
      <span class="section-kicker">${group.badge}</span>
      <strong>${group.title}</strong>
      <p>${group.subtitle}</p>
      <div class="category-meta">
        <span>二类卡片 ${group.games.length} 张</span>
        <span>动态推荐位</span>
        <span>在线人数浮动</span>
      </div>
    `;

    const note=document.createElement('div');
    note.className='category-note';
    note.innerHTML = `<strong>${group.title}</strong> 区做成一类卡片 + 二类卡片结构，卡片会自动切换展示画面，但大厅本身不自动轮播，只支持手动左右滑动。`;

    head.append(feature, note);

    const rail=document.createElement('div');
    rail.className='lobby-scroll';
    rail.setAttribute('aria-label', `${group.title} 子卡滑动区`);
    rail.replaceChildren(...group.games.map(game => this.createLobbyCard(game, { parent: group.key })));

    article.append(head, rail);
    return article;
  }

  createLobbyCard(item, options={}) {
    const featured=!!options.featured;
    const button=document.createElement('button');
    button.type='button';
    button.className=featured ? 'featured-card glass' : 'subgame-card glass';
    button.dataset.game=options.key || item.key;

    const scene=document.createElement('div');
    scene.className='card-scene';

    const chip=document.createElement('span');
    chip.className='scene-chip';
    const title=document.createElement('div');
    title.className='scene-title';
    title.textContent=item.title;
    const caption=document.createElement('div');
    caption.className='scene-caption';
    scene.append(chip, title, caption);

    const body=document.createElement('div');
    body.className='card-body';

    const topline=document.createElement('div');
    topline.className='card-topline';
    const badge=document.createElement('span');
    badge.className='card-badge';
    badge.textContent=item.badge;
    const action=document.createElement('span');
    action.className=`card-action${item.playable || options.playable ? '' : ' pending'}`;
    action.textContent=item.playable || options.playable ? '立即进入' : '预览入口';
    topline.append(badge, action);

    const subtitle=document.createElement('p');
    subtitle.className='card-subtitle';
    subtitle.textContent=item.subtitle;

    const metrics=document.createElement('div');
    metrics.className='card-metrics';
    const onlineBox=this.metricBox('在线人数', int(item.online));
    const jackpotBox=this.metricBox('奖池滚动', money(item.jackpot));
    metrics.append(onlineBox.box, jackpotBox.box);

    body.append(topline, subtitle, metrics);
    button.append(scene, body);

    const runtime = {
      key: item.key,
      button,
      chip,
      caption,
      onlineNode: onlineBox.value,
      jackpotNode: jackpotBox.value,
      badgeNode: badge,
      statusNode: action,
      title: item.title,
      scenes: item.scenes,
      screenIndex: 0,
      online: item.online,
      onlineMin: 2000,
      onlineMax: 10000,
      jackpot: item.jackpot,
      jackpotMin: Math.max(188888, Math.round(item.jackpot * 0.65)),
      jackpotMax: Math.round(item.jackpot * 1.55),
      status: item.status,
      badge: item.badge,
      playable: !!(item.playable || options.playable),
    };
    this.applyScene(runtime);
    this.lobbyCards.push(runtime);
    return button;
  }

  metricBox(label, value) {
    const box=document.createElement('div');
    box.className='metric-box';
    const title=document.createElement('span');
    title.textContent=label;
    const strong=document.createElement('strong');
    strong.textContent=value;
    box.append(title, strong);
    return { box, value: strong };
  }

  applyScene(card) {
    const scene = card.scenes[card.screenIndex % card.scenes.length];
    card.chip.textContent = scene.label;
    card.caption.textContent = scene.text;
    card.button.style.setProperty('--scene-a', scene.colors[0]);
    card.button.style.setProperty('--scene-b', scene.colors[1]);
    card.button.style.setProperty('--scene-c', scene.colors[2]);
    if (!card.playable) card.statusNode.textContent = '预览入口';
    else card.statusNode.textContent = '立即进入';
  }

  advanceCard(card) {
    card.screenIndex = (card.screenIndex + 1) % card.scenes.length;
    this.applyScene(card);
  }

  updateNumbers(card) {
    const onlineDelta = Math.round((Math.random() - 0.5) * 420);
    const jackpotDelta = Math.round((Math.random() - 0.28) * 12000);
    card.online = clamp(card.online + onlineDelta, card.onlineMin, card.onlineMax);
    card.jackpot = clamp(card.jackpot + jackpotDelta, card.jackpotMin, card.jackpotMax);
    card.onlineNode.textContent = int(card.online);
    card.jackpotNode.textContent = money(card.jackpot);
  }

  updateRecommendation(step = 1) {
    this.recommendationIndex = (this.recommendationIndex + step + LOBBY_GROUPS.length) % LOBBY_GROUPS.length;
    const group = LOBBY_GROUPS[this.recommendationIndex];
    const preview = group.games[0];
    const runtime = this.lobbyCards.find(card => card.key === preview.key);
    const scene = runtime ? runtime.scenes[runtime.screenIndex % runtime.scenes.length] : preview.scenes[this.recommendationIndex % preview.scenes.length];
    this.nodes.lobbyRecommendation.dataset.game = group.key;
    this.nodes.recommendationBadge.textContent = `${group.badge}推荐`;
    this.nodes.recommendationTitle.textContent = preview.title;
    this.nodes.recommendationScene.textContent = `${scene.label} · ${scene.text}`;
    this.nodes.recommendationOnline.textContent = int(runtime ? runtime.online : preview.online);
    this.nodes.recommendationJackpot.textContent = money(runtime ? runtime.jackpot : preview.jackpot);
    this.nodes.recommendationStatus.textContent = preview.playable ? '可试玩' : '动态预览';
    this.nodes.lobbyRecommendation.style.setProperty('--recommend-a', scene.colors[0]);
    this.nodes.lobbyRecommendation.style.setProperty('--recommend-b', scene.colors[1]);
    this.nodes.lobbyRecommendation.style.setProperty('--recommend-c', scene.colors[2]);
  }

  refreshLobbyTotals() {
    const totalOnline = this.lobbyCards.reduce((sum, card) => sum + card.online, 0);
    const totalJackpot = this.lobbyCards.reduce((sum, card) => sum + card.jackpot, 0);
    this.nodes.lobbyTotalOnline.textContent = int(totalOnline);
    this.nodes.lobbyTotalJackpot.textContent = money(totalJackpot);
  }

  startLobbyDynamics() {
    clearInterval(this.dynamicTimer);
    this.dynamicTimer = setInterval(() => {
      this.lobbyCards.forEach((card, index) => {
        this.updateNumbers(card);
        if ((index + this.recommendationIndex) % 2 === 0 || Math.random() > 0.72) this.advanceCard(card);
      });
      this.updateRecommendation(1);
      this.refreshLobbyTotals();
    }, 2600);
  }

  enableDragScroll(node) {
    if (!node) return;
    let active = false;
    let startX = 0;
    let startScroll = 0;
    node.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse') return;
      active = true;
      startX = event.clientX;
      startScroll = node.scrollLeft;
      node.classList.add('dragging');
      node.setPointerCapture(event.pointerId);
    });
    node.addEventListener('pointermove', event => {
      if (!active) return;
      node.scrollLeft = startScroll - (event.clientX - startX);
    });
    const stop = () => {
      active = false;
      node.classList.remove('dragging');
    };
    node.addEventListener('pointerup', stop);
    node.addEventListener('pointercancel', stop);
    node.addEventListener('lostpointercapture', stop);
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
