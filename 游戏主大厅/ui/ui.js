const scene = (label, text, colors) => ({ label, text, colors });
const gameCard = (key, title, subtitle, badge, online, jackpot, scenes, options = {}) => ({
  key, title, subtitle, badge, online, jackpot, scenes,
  playable: !!options.playable,
  status: options.status || (options.playable ? '可试玩' : '预览中'),
});
const roomCard = (key, title, subtitle, badge, online, jackpot, scenes, games, options = {}) => ({
  key, title, subtitle, badge, online, jackpot, scenes, games,
  status: options.status || '预览中',
});

const LOBBY_GROUPS = [
  {
    key: 'fishing',
    title: '深海捕鱼',
    subtitle: '海底主题、多人竞技、炮台火力与 Boss 追猎',
    badge: 'HOT',
    status: '可试玩',
    sectionColors: ['#145b8f', '#071526'],
    scenes: [
      scene('黄金鲨王', '高爆海沟场', ['#278fd7', '#07203a', 'rgba(255,214,96,.28)']),
      scene('鱼潮模式', '整屏刷鱼 · 连续爆金', ['#18b5f2', '#08243f', 'rgba(91,226,255,.22)']),
      scene('夺宝深海', '炮值切换 · 速刷金币', ['#2b73c9', '#061529', 'rgba(255,246,153,.18)']),
    ],
    rooms: [
      roomCard('fishing-main', '深海捕鱼主厅', '主大厅房间卡片，承接当前试玩入口。', '主厅', 6888, 388888, [
        scene('黄金鲨王', 'Boss 追猎画面', ['#278fd7', '#07203a', 'rgba(255,214,96,.28)']),
        scene('鱼潮扫图', '横贯鱼潮冲分', ['#18b5f2', '#08243f', 'rgba(91,226,255,.22)']),
        scene('炮台连击', '自动火力连续开炮', ['#2b73c9', '#061529', 'rgba(255,246,153,.18)']),
      ], [
        gameCard('fishing', '深海捕鱼试玩', '当前接入的可试玩版本。', '试玩', 6888, 388888, [
          scene('Boss 追猎', '真实可进入试玩', ['#278fd7', '#07203a', 'rgba(255,214,96,.28)']),
          scene('鱼潮扫图', '已接入海底场景', ['#18b5f2', '#08243f', 'rgba(91,226,255,.22)']),
          scene('火力切换', '支持锁定与自动', ['#2b73c9', '#061529', 'rgba(255,246,153,.18)']),
        ], { playable: true }),
        gameCard('fishing-boss', '鲨王追击', '偏 Boss 场的单独游戏卡。', '高爆', 5220, 488888, [
          scene('鲨王模式', '高倍 Boss 场', ['#266db8', '#08192d', 'rgba(255,223,106,.22)']),
          scene('怒海追击', '彩金滚动', ['#179ad8', '#092746', 'rgba(255,255,255,.16)']),
          scene('深海强袭', '演示预览卡', ['#1e5d98', '#06121d', 'rgba(255,240,160,.20)']),
        ]),
        gameCard('fishing-tide', '鱼潮竞速', '偏快节奏刷鱼的独立卡。', '竞速', 4760, 328888, [
          scene('鱼潮冲屏', '高密度刷鱼', ['#1ab4ef', '#08233d', 'rgba(91,226,255,.22)']),
          scene('连炮模式', '节奏更快', ['#2d83d7', '#07192b', 'rgba(255,255,255,.16)']),
          scene('彩金冲高', '数据动态浮动', ['#2397c9', '#081a2b', 'rgba(255,234,135,.18)']),
        ]),
      ], { status: '可试玩' }),
      roomCard('fishing-elite', '猎鲨竞技房', '多人竞技版捕鱼房间卡。', '竞技', 5421, 528888, [
        scene('竞技深渊', '多人抢分 · 高倍鲨王', ['#3272d9', '#091930', 'rgba(123,208,255,.18)']),
        scene('海妖秘境', '旋涡出鱼 · 爆金币', ['#1fb6ff', '#0b2744', 'rgba(255,227,116,.18)']),
        scene('海底夺宝', '彩金波动演示', ['#215aab', '#071421', 'rgba(255,255,255,.18)']),
      ], [
        gameCard('fishing-elite-pro', '猎鲨竞技', '竞技场版本，突出抢分感。', '竞技', 5421, 528888, [
          scene('竞技抢分', '房间内多人竞速', ['#3272d9', '#091930', 'rgba(123,208,255,.18)']),
          scene('高倍鲨王', '追击大鱼特写', ['#1fb6ff', '#0b2744', 'rgba(255,227,116,.18)']),
          scene('彩金抢夺', '奖池缓慢上冲', ['#215aab', '#071421', 'rgba(255,255,255,.18)']),
        ]),
        gameCard('fishing-whirlpool', '旋涡秘境', '环形刷鱼与秘境效果预览。', '秘境', 4310, 366888, [
          scene('旋涡出鱼', '环形刷鱼场', ['#2ebcff', '#092742', 'rgba(255,255,255,.16)']),
          scene('深蓝秘境', '海妖主题', ['#219be6', '#071e34', 'rgba(255,239,131,.18)']),
          scene('连击爆金', '快节奏浮动', ['#1e6bb1', '#07101d', 'rgba(149,226,255,.18)']),
        ]),
        gameCard('fishing-tournament', '夺宝排位', '偏排位赛的游戏卡。', '排位', 3950, 418888, [
          scene('赛季排位', '竞技排位氛围', ['#3175bf', '#081a2f', 'rgba(255,215,103,.18)']),
          scene('海底夺宝', '彩金卡面切换', ['#195ea0', '#071320', 'rgba(255,255,255,.16)']),
          scene('热度上涨', '在线数慢涨慢跌', ['#219fe0', '#08253d', 'rgba(255,239,151,.16)']),
        ]),
      ]),
      roomCard('fishing-arcade', '街机炮王房', '偏街机风格的捕鱼房卡。', '街机', 4730, 268888, [
        scene('炮王机台', '街机炮值跳档', ['#0e8bb9', '#061724', 'rgba(255,203,122,.16)']),
        scene('怒海金潮', '暴击特效切画面', ['#2ebcfd', '#092742', 'rgba(255,255,255,.16)']),
        scene('金炮模式', '彩金快感预览', ['#1b5f9c', '#06131d', 'rgba(255,234,135,.20)']),
      ], [
        gameCard('fishing-arcade-cannon', '街机炮王', '主打炮值切换的游戏卡。', '炮王', 4730, 268888, [
          scene('炮王机台', '街机炮值跳档', ['#0e8bb9', '#061724', 'rgba(255,203,122,.16)']),
          scene('暴击切图', '画面动态切换', ['#2ebcfd', '#092742', 'rgba(255,255,255,.16)']),
          scene('彩金浮动', '快感预览', ['#1b5f9c', '#06131d', 'rgba(255,234,135,.20)']),
        ]),
        gameCard('fishing-arcade-storm', '怒海金潮', '高频刷金节奏卡。', '快节奏', 3902, 295888, [
          scene('怒海模式', '爆金风暴', ['#14a3da', '#071a28', 'rgba(255,224,123,.18)']),
          scene('连击强袭', '多人冲分感', ['#2daee5', '#09213a', 'rgba(255,255,255,.16)']),
          scene('彩金进度', '奖池缓慢滚动', ['#1f6ca9', '#06111a', 'rgba(255,247,179,.16)']),
        ]),
        gameCard('fishing-arcade-gold', '金炮狂欢', '大炮台主题游戏卡。', '彩金', 3588, 318888, [
          scene('金炮模式', '大炮台特写', ['#1f6ca9', '#06111a', 'rgba(255,247,179,.16)']),
          scene('狂欢连爆', '高亮切景', ['#0f8bc6', '#081b2b', 'rgba(255,255,255,.16)']),
          scene('彩金上涨', '随机波动', ['#2ebcff', '#092742', 'rgba(255,233,133,.18)']),
        ]),
      ]),
    ],
  },
  {
    key: 'slots',
    title: '老虎机专区',
    subtitle: '连环夺宝、宝石派对、糖果派对与 BBIN 风格电子馆',
    badge: '电子',
    status: '热门',
    sectionColors: ['#6938c2', '#190b35'],
    scenes: [
      scene('彩金墙', '多列机台手滑切换', ['#7b4dff', '#1a0b34', 'rgba(255,170,110,.20)']),
      scene('宝石机台', '连线爆分 · 彩金滚动', ['#9e4bff', '#261046', 'rgba(93,228,255,.16)']),
      scene('糖果派对', '高亮糖果转轴', ['#ff63c2', '#2c1132', 'rgba(255,255,255,.18)']),
    ],
    rooms: [
      roomCard('slots-treasure', '连环夺宝馆', '主打连环夺宝、探宝转轴与彩金墙。', '爆款', 7320, 968888, [
        scene('宝图模式', '三轴彩金滚动', ['#a24dff', '#1d0f39', 'rgba(255,219,123,.22)']),
        scene('连爆状态', '多连线高亮切屏', ['#7a55ff', '#1a1030', 'rgba(133,226,255,.16)']),
        scene('彩金收集', '奖池滚动持续上冲', ['#ca4dff', '#250f40', 'rgba(255,255,255,.18)']),
      ], [
        gameCard('treasure', '连环夺宝', '经典三轴机台卡。', '爆款', 7320, 968888, [
          scene('宝图模式', '三轴彩金滚动', ['#a24dff', '#1d0f39', 'rgba(255,219,123,.22)']),
          scene('连爆状态', '多连线高亮切屏', ['#7a55ff', '#1a1030', 'rgba(133,226,255,.16)']),
          scene('彩金收集', '奖池滚动持续上冲', ['#ca4dff', '#250f40', 'rgba(255,255,255,.18)']),
        ]),
        gameCard('treasure-deluxe', '神陵夺宝', '探宝题材延展卡。', '探宝', 6150, 888888, [
          scene('神陵入口', '探宝场景切画面', ['#8f48e6', '#200d3e', 'rgba(255,221,124,.18)']),
          scene('古卷彩金', '彩金墙推进', ['#754bff', '#180f2d', 'rgba(255,255,255,.16)']),
          scene('高爆掉落', '在线热度波动', ['#b756ff', '#220e3b', 'rgba(146,227,255,.16)']),
        ]),
        gameCard('treasure-blast', '彩金探险', '偏彩金掉落的游戏卡。', '彩金', 5360, 798888, [
          scene('彩金探险', '彩金值持续上涨', ['#ab56ff', '#1d0f39', 'rgba(255,220,132,.18)']),
          scene('巨奖连线', '转轴高亮切换', ['#6d52ff', '#170e2a', 'rgba(255,255,255,.16)']),
          scene('热点机台', '推荐位动态展示', ['#9747f8', '#190f31', 'rgba(162,232,255,.18)']),
        ]),
      ]),
      roomCard('slots-gems', '宝石糖果馆', '宝石派对与糖果派对组合馆。', '推荐', 6410, 788888, [
        scene('宝石爆亮', '高亮特效轮换', ['#3cb7ff', '#121b38', 'rgba(255,255,255,.18)']),
        scene('彩金雨', '彩金数值动态滚动', ['#6f4cff', '#150e2d', 'rgba(255,217,121,.18)']),
        scene('糖果派对', '甜蜜爆分彩带', ['#ff6cbf', '#31112d', 'rgba(255,249,174,.18)']),
      ], [
        gameCard('gem-party', '宝石派对', '宝石主题电子卡片。', '宝石', 6410, 788888, [
          scene('宝石爆亮', '高亮特效轮换', ['#3cb7ff', '#121b38', 'rgba(255,255,255,.18)']),
          scene('彩金雨', '彩金数值动态滚动', ['#6f4cff', '#150e2d', 'rgba(255,217,121,.18)']),
          scene('钻石转轴', '三段切画面预览', ['#09a4d9', '#071326', 'rgba(174,241,255,.20)']),
        ]),
        gameCard('candy-party', '糖果派对', '糖果弹跳风格电子卡。', '轻快', 5876, 658888, [
          scene('糖果海', '糖果图块轮换', ['#ff6cbf', '#31112d', 'rgba(255,249,174,.18)']),
          scene('甜蜜连线', '爆分状态切换', ['#ff4f96', '#2a0f2a', 'rgba(255,255,255,.16)']),
          scene('派对连爆', '推荐位动态展示', ['#ff8c74', '#37152d', 'rgba(255,222,144,.16)']),
        ]),
        gameCard('sugar-rush', '甜蜜冲刺', '更轻快的电子小游戏卡。', '糖果', 4680, 512888, [
          scene('甜蜜冲刺', '节奏快的转轴切换', ['#ff71ba', '#38142f', 'rgba(255,255,255,.16)']),
          scene('爆糖模式', '高亮糖果铺满', ['#ff9b70', '#32112a', 'rgba(255,232,172,.18)']),
          scene('奖池派发', '数值缓慢浮动', ['#ff5ca8', '#290f29', 'rgba(255,255,255,.14)']),
        ]),
      ]),
      roomCard('slots-bbin', 'BBIN电子馆', '参考电子游戏馆区风格的房间卡。', '馆区', 8220, 1188888, [
        scene('经典馆区', '馆区封面切换', ['#3856ff', '#0d1637', 'rgba(255,240,149,.18)']),
        scene('彩金推荐', '动态推荐电子位', ['#7056ff', '#151338', 'rgba(133,226,255,.18)']),
        scene('高爆预告', '在线人数随机变化', ['#4a6dff', '#11182d', 'rgba(255,255,255,.16)']),
      ], [
        gameCard('bbin-style', 'BBIN电子馆', '参考馆区封面的大卡入口。', '馆区', 8220, 1188888, [
          scene('经典馆区', '馆区封面切换', ['#3856ff', '#0d1637', 'rgba(255,240,149,.18)']),
          scene('彩金推荐', '动态推荐电子位', ['#7056ff', '#151338', 'rgba(133,226,255,.18)']),
          scene('高爆预告', '在线人数随机变化', ['#4a6dff', '#11182d', 'rgba(255,255,255,.16)']),
        ]),
        gameCard('bbin-golden-wheel', '黄金轮盘', '更偏馆区陈列感的电子卡。', '馆藏', 6350, 898888, [
          scene('黄金轮盘', '馆区陈列界面', ['#5162ff', '#111936', 'rgba(255,220,140,.18)']),
          scene('彩金推荐', '奖池滚动', ['#6e59ff', '#141338', 'rgba(255,255,255,.16)']),
          scene('机台切景', '手滑查看卡面', ['#415cff', '#0f1731', 'rgba(156,229,255,.18)']),
        ]),
        gameCard('bbin-fortune-lines', '财富连线', '电子馆内的连线机卡。', '连线', 5640, 768888, [
          scene('财富连线', '多线条切换', ['#3c58f0', '#10152e', 'rgba(255,255,255,.16)']),
          scene('高爆切图', '动态推荐位', ['#615cff', '#121437', 'rgba(255,233,166,.16)']),
          scene('人气机台', '在线热度变化', ['#4766ff', '#12182f', 'rgba(174,241,255,.16)']),
        ]),
      ]),
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
      scene('旗舰厅', '庄闲路纸与桌台展示', ['#1ba28f', '#081d26', 'rgba(255,238,175,.18)']),
      scene('高速桌', '快速下注台面', ['#0dcfb7', '#0a2330', 'rgba(194,255,241,.16)']),
      scene('珠盘路', '动态推荐桌切换', ['#1f8f99', '#07171d', 'rgba(255,255,255,.18)']),
    ],
    rooms: [
      roomCard('baccarat-vip', 'VIP百家乐', '贵宾桌与大路纸推荐位。', '贵宾', 5102, 888888, [
        scene('贵宾桌', '大路纸状态切换', ['#0fb59d', '#082128', 'rgba(255,226,137,.18)']),
        scene('长龙桌', '热门桌数据浮动', ['#17a898', '#081e22', 'rgba(209,255,245,.16)']),
        scene('庄闲局', '推荐桌动态切画面', ['#0f8a73', '#07171d', 'rgba(255,255,255,.18)']),
      ], [
        gameCard('baccarat-vip-main', 'VIP庄闲桌', '贵宾庄闲主游戏卡。', '贵宾', 5102, 888888, [
          scene('贵宾桌', '大路纸状态切换', ['#0fb59d', '#082128', 'rgba(255,226,137,.18)']),
          scene('长龙桌', '热门桌数据浮动', ['#17a898', '#081e22', 'rgba(209,255,245,.16)']),
          scene('庄闲局', '推荐桌动态切画面', ['#0f8a73', '#07171d', 'rgba(255,255,255,.18)']),
        ]),
        gameCard('baccarat-roadmap', '珠盘路桌', '偏路纸展示的子卡。', '路纸', 4420, 688888, [
          scene('珠盘路', '珠盘路切换', ['#12b89e', '#071c22', 'rgba(255,248,173,.18)']),
          scene('走势推荐', '桌台动态位', ['#0d9c8f', '#08171b', 'rgba(255,255,255,.16)']),
          scene('长龙预警', '在线热度变化', ['#17a898', '#081e22', 'rgba(209,255,245,.16)']),
        ]),
        gameCard('baccarat-dragon', '长龙桌', '长龙桌主题游戏卡。', '长龙', 3980, 612888, [
          scene('长龙台面', '桌台切景', ['#0da58d', '#08161a', 'rgba(255,228,142,.18)']),
          scene('热桌浮动', '动态在线数据', ['#11b59d', '#071d23', 'rgba(255,255,255,.16)']),
          scene('推荐桌', '推荐位展示', ['#109683', '#07171a', 'rgba(197,255,244,.18)']),
        ]),
      ]),
      roomCard('baccarat-speed', '极速百家乐', '快速开局版房间卡。', '极速', 4380, 628888, [
        scene('快开桌', '高速下注提示', ['#14c1a4', '#08242b', 'rgba(255,251,179,.18)']),
        scene('抢庄氛围', '彩金与在线滚动', ['#13a598', '#0a1f25', 'rgba(255,255,255,.16)']),
        scene('路纸预览', '画面自动切换', ['#0c8775', '#06171a', 'rgba(190,255,245,.16)']),
      ], [
        gameCard('baccarat-speed-main', '极速庄闲', '偏快节奏开局的游戏卡。', '极速', 4380, 628888, [
          scene('快开桌', '高速下注提示', ['#14c1a4', '#08242b', 'rgba(255,251,179,.18)']),
          scene('抢庄氛围', '彩金与在线滚动', ['#13a598', '#0a1f25', 'rgba(255,255,255,.16)']),
          scene('路纸预览', '画面自动切换', ['#0c8775', '#06171a', 'rgba(190,255,245,.16)']),
        ]),
        gameCard('baccarat-no-commission', '免佣百家乐', '免佣玩法游戏卡。', '免佣', 3890, 588888, [
          scene('免佣台', '下注区简洁切换', ['#16b39b', '#081d22', 'rgba(255,244,188,.18)']),
          scene('热度浮动', '在线人数变化', ['#11a08c', '#071719', 'rgba(255,255,255,.16)']),
          scene('彩金滚动', '奖池缓慢上冲', ['#0d8b78', '#051317', 'rgba(190,255,245,.16)']),
        ]),
        gameCard('baccarat-squeeze', '咪牌百家乐', '更有氛围感的咪牌卡。', '咪牌', 3420, 552888, [
          scene('咪牌台', '桌台特写切换', ['#18c7aa', '#0a242b', 'rgba(255,230,163,.18)']),
          scene('牌局推荐', '动态推荐位', ['#0fa18e', '#07181d', 'rgba(255,255,255,.16)']),
          scene('牌桌热度', '缓慢波动', ['#0b816f', '#051115', 'rgba(205,255,245,.16)']),
        ]),
      ]),
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
      scene('龙虎对决', '红蓝台面快速切场', ['#ff8554', '#2c120d', 'rgba(255,222,128,.18)']),
      scene('决胜一局', '单局快节奏预览', ['#ff5b51', '#36110e', 'rgba(255,255,255,.18)']),
      scene('热台推荐', '热门牌桌动态位', ['#d64f39', '#230d0a', 'rgba(255,240,195,.16)']),
    ],
    rooms: [
      roomCard('dragon-tiger-main', '龙虎斗主桌', '主桌入口，展示大小单双氛围。', '主桌', 3960, 558888, [
        scene('龙虎主桌', '牌面区高亮切换', ['#ff8554', '#2c120d', 'rgba(255,222,128,.18)']),
        scene('押注高峰', '在线人数慢涨慢跌', ['#ff5b51', '#36110e', 'rgba(255,255,255,.18)']),
        scene('决胜推荐', '推荐位轮换展示', ['#d64f39', '#230d0a', 'rgba(255,240,195,.16)']),
      ], [
        gameCard('dragon-tiger-classic', '经典龙虎斗', '标准主桌游戏卡。', '经典', 3960, 558888, [
          scene('龙虎主桌', '牌面区高亮切换', ['#ff8554', '#2c120d', 'rgba(255,222,128,.18)']),
          scene('押注高峰', '在线人数慢涨慢跌', ['#ff5b51', '#36110e', 'rgba(255,255,255,.18)']),
          scene('决胜推荐', '推荐位轮换展示', ['#d64f39', '#230d0a', 'rgba(255,240,195,.16)']),
        ]),
        gameCard('dragon-tiger-flash', '闪电龙虎斗', '偏快节奏的游戏卡。', '闪电', 3520, 488888, [
          scene('闪电台', '台面色块切换', ['#ff7a43', '#2d100b', 'rgba(255,234,165,.18)']),
          scene('热台涨幅', '奖池滚动持续变化', ['#f34f36', '#2b0907', 'rgba(255,255,255,.16)']),
          scene('一击分胜', '切画面预览', ['#d7592d', '#1f0906', 'rgba(255,220,140,.16)']),
        ]),
        gameCard('dragon-tiger-turbo', '竞速龙虎斗', '更紧凑的快速房。', '竞速', 3270, 452888, [
          scene('竞速台', '高频切图', ['#ff6f3d', '#2f0f0b', 'rgba(255,234,165,.18)']),
          scene('热台波动', '热度缓慢变动', ['#ec5139', '#280907', 'rgba(255,255,255,.16)']),
          scene('押注节奏', '强对比视觉', ['#d24a2f', '#1d0805', 'rgba(255,220,140,.16)']),
        ]),
      ]),
      roomCard('dragon-tiger-pro', '龙虎斗竞速台', '更快节奏的二类房卡。', '竞速', 3550, 488888, [
        scene('竞速台', '台面色块切换', ['#fe6f3d', '#2f0f0b', 'rgba(255,234,165,.18)']),
        scene('热台涨幅', '奖池滚动持续变化', ['#f34f36', '#2b0907', 'rgba(255,255,255,.16)']),
        scene('一击分胜', '切画面预览', ['#d7592d', '#1f0906', 'rgba(255,220,140,.16)']),
      ], [
        gameCard('dragon-tiger-pro-main', '极速龙虎斗', '竞速版主游戏卡。', '极速', 3550, 488888, [
          scene('竞速台', '台面色块切换', ['#fe6f3d', '#2f0f0b', 'rgba(255,234,165,.18)']),
          scene('热台涨幅', '奖池滚动持续变化', ['#f34f36', '#2b0907', 'rgba(255,255,255,.16)']),
          scene('一击分胜', '切画面预览', ['#d7592d', '#1f0906', 'rgba(255,220,140,.16)']),
        ]),
        gameCard('dragon-tiger-arena', '龙虎竞技场', '偏竞技场氛围的子卡。', '竞技', 3120, 438888, [
          scene('竞技对局', '红蓝分区突显', ['#fb6a42', '#260b08', 'rgba(255,227,145,.18)']),
          scene('人气台面', '在线值波动', ['#e44b32', '#260807', 'rgba(255,255,255,.16)']),
          scene('彩金热推', '推荐位变化', ['#c7442b', '#1c0705', 'rgba(255,230,158,.16)']),
        ]),
        gameCard('dragon-tiger-royal', '皇家龙虎斗', '更偏豪华风格的卡。', '豪华', 2960, 418888, [
          scene('皇家台', '豪华红金色系', ['#ff8554', '#35110c', 'rgba(255,225,165,.20)']),
          scene('彩金台', '奖池缓慢上冲', ['#f35e39', '#2c0907', 'rgba(255,255,255,.16)']),
          scene('胜负预览', '画面自动切换', ['#cd4e31', '#1c0705', 'rgba(255,238,188,.16)']),
        ]),
      ]),
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
      scene('飞禽走兽', '转盘氛围与押注区预览', ['#d6a83d', '#2f1b05', 'rgba(255,245,188,.18)']),
      scene('鱼虾蟹', '传统盘面与彩金滚动', ['#e6b73c', '#2a1704', 'rgba(255,255,255,.16)']),
      scene('押注热点', '推荐位与人气值浮动', ['#c18a22', '#241305', 'rgba(255,222,143,.16)']),
    ],
    rooms: [
      roomCard('animals-flying', '飞禽走兽', '经典动物转盘类房间卡。', '经典', 6098, 708888, [
        scene('飞禽转盘', '动物图标轮换', ['#d6a83d', '#2f1b05', 'rgba(255,245,188,.18)']),
        scene('押注热点', '彩金与人数动态浮动', ['#c8962e', '#271803', 'rgba(255,255,255,.16)']),
        scene('走势推荐', '推荐位切换预览', ['#b98218', '#1f1203', 'rgba(255,226,156,.18)']),
      ], [
        gameCard('flying-animals', '飞禽走兽', '标准动物转盘游戏卡。', '经典', 6098, 708888, [
          scene('飞禽转盘', '动物图标轮换', ['#d6a83d', '#2f1b05', 'rgba(255,245,188,.18)']),
          scene('押注热点', '彩金与人数动态浮动', ['#c8962e', '#271803', 'rgba(255,255,255,.16)']),
          scene('走势推荐', '推荐位切换预览', ['#b98218', '#1f1203', 'rgba(255,226,156,.18)']),
        ]),
        gameCard('beast-wheel', '猛兽轮盘', '更偏猛兽主题的游戏卡。', '猛兽', 4420, 598888, [
          scene('猛兽轮盘', '猛兽图块切换', ['#d1a135', '#2a1804', 'rgba(255,244,196,.16)']),
          scene('热度浮动', '在线人数变化', ['#b98324', '#201103', 'rgba(255,255,255,.16)']),
          scene('彩金推荐', '奖池滚动', ['#c4922d', '#241405', 'rgba(255,225,156,.18)']),
        ]),
        gameCard('animal-showdown', '百兽争锋', '更竞技感的动物盘卡。', '争锋', 3980, 548888, [
          scene('百兽争锋', '强对比盘面', ['#d8ac3e', '#2f1b05', 'rgba(255,239,182,.18)']),
          scene('彩金上冲', '数值缓慢滚动', ['#c18d20', '#221204', 'rgba(255,255,255,.16)']),
          scene('在线变化', '热度慢涨慢跌', ['#b87f16', '#1e0f03', 'rgba(255,230,160,.16)']),
        ]),
      ]),
      roomCard('animals-seafood', '鱼虾蟹', '传统鱼虾蟹玩法房间卡。', '传统', 4210, 458888, [
        scene('传统盘面', '大小单双样式切换', ['#efbf45', '#2f1a04', 'rgba(255,255,255,.16)']),
        scene('连开状态', '奖池滚动', ['#d7a53a', '#281804', 'rgba(255,233,176,.18)']),
        scene('热区推荐', '人气波动展示', ['#bf8e20', '#241305', 'rgba(255,244,196,.14)']),
      ], [
        gameCard('fish-shrimp-crab', '鱼虾蟹', '传统鱼虾蟹主卡。', '传统', 4210, 458888, [
          scene('传统盘面', '大小单双样式切换', ['#efbf45', '#2f1a04', 'rgba(255,255,255,.16)']),
          scene('连开状态', '奖池滚动', ['#d7a53a', '#281804', 'rgba(255,233,176,.18)']),
          scene('热区推荐', '人气波动展示', ['#bf8e20', '#241305', 'rgba(255,244,196,.14)']),
        ]),
        gameCard('seafood-royal', '皇家鱼虾蟹', '更亮一点的传统盘卡。', '皇家', 3460, 422888, [
          scene('皇家盘面', '亮金配色', ['#efbf45', '#351f04', 'rgba(255,255,255,.16)']),
          scene('奖池上涨', '滚动数值变化', ['#d39c2f', '#2b1703', 'rgba(255,242,190,.18)']),
          scene('热区切景', '推荐位切换', ['#c38f22', '#221204', 'rgba(255,235,170,.16)']),
        ]),
        gameCard('seafood-bonus', '旺财鱼虾蟹', '更偏彩金氛围的游戏卡。', '旺财', 3120, 396888, [
          scene('旺财盘', '彩金热点区', ['#d7a53a', '#281804', 'rgba(255,233,176,.18)']),
          scene('在线波动', '人数慢涨慢跌', ['#b98718', '#211103', 'rgba(255,255,255,.14)']),
          scene('传统预告', '画面慢切换', ['#c8962e', '#241305', 'rgba(255,244,196,.16)']),
        ]),
      ]),
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
      scene('多桌大厅', '牌桌入口一屏滑动查看', ['#3f75a5', '#0a1724', 'rgba(255,231,162,.18)']),
      scene('好友约局', '房间位状态预览', ['#2a6ca0', '#0a1e31', 'rgba(194,231,255,.18)']),
      scene('牌局推荐', '在线人数浮动展示', ['#4a7ba3', '#091321', 'rgba(255,255,255,.16)']),
    ],
    rooms: [
      roomCard('chess-lobby', '棋牌大厅', '主分区卡片，展示多桌与房间状态。', '主分区', 2844, 358888, [
        scene('多桌大厅', '房间封面切换', ['#3f75a5', '#0a1724', 'rgba(255,231,162,.18)']),
        scene('好友约局', '在线人数缓慢变动', ['#2a6ca0', '#0a1e31', 'rgba(194,231,255,.18)']),
        scene('热房推荐', '推荐位动画展示', ['#4a7ba3', '#091321', 'rgba(255,255,255,.16)']),
      ], [
        gameCard('chess-room-main', '热房大厅', '棋牌游戏主大厅卡。', '热房', 2844, 358888, [
          scene('多桌大厅', '房间封面切换', ['#3f75a5', '#0a1724', 'rgba(255,231,162,.18)']),
          scene('好友约局', '在线人数缓慢变动', ['#2a6ca0', '#0a1e31', 'rgba(194,231,255,.18)']),
          scene('热房推荐', '推荐位动画展示', ['#4a7ba3', '#091321', 'rgba(255,255,255,.16)']),
        ]),
        gameCard('chess-match', '对战牌局', '偏多人对战氛围的卡。', '对战', 2488, 318888, [
          scene('对战桌', '桌台状态变化', ['#4f7ea8', '#0a1724', 'rgba(255,230,150,.16)']),
          scene('赛事房', '活动推荐位切换', ['#2f6da5', '#0a182a', 'rgba(203,239,255,.16)']),
          scene('好友桌', '轻量动画预览', ['#456d8f', '#09121b', 'rgba(255,255,255,.14)']),
        ]),
        gameCard('chess-invite', '好友房', '更偏约局入口的卡片。', '好友', 2260, 282888, [
          scene('好友约局', '房间位状态预览', ['#2a6ca0', '#0a1e31', 'rgba(194,231,255,.18)']),
          scene('热房切图', '推荐位缓慢变化', ['#417099', '#091726', 'rgba(255,255,255,.16)']),
          scene('在线浮动', '人气值变化', ['#335b7d', '#08111b', 'rgba(228,241,255,.14)']),
        ]),
      ]),
      roomCard('chess-room', '对战房', '预留棋牌房间入口的二类房卡。', '房间', 2410, 298888, [
        scene('对战房', '桌台状态变化', ['#4f7ea8', '#0a1724', 'rgba(255,230,150,.16)']),
        scene('赛事房', '活动推荐位切换', ['#2f6da5', '#0a182a', 'rgba(203,239,255,.16)']),
        scene('好友桌', '轻量动画预览', ['#456d8f', '#09121b', 'rgba(255,255,255,.14)']),
      ], [
        gameCard('chess-duel', '单挑房', '双人对战氛围卡。', '单挑', 2410, 298888, [
          scene('对战房', '桌台状态变化', ['#4f7ea8', '#0a1724', 'rgba(255,230,150,.16)']),
          scene('赛事房', '活动推荐位切换', ['#2f6da5', '#0a182a', 'rgba(203,239,255,.16)']),
          scene('好友桌', '轻量动画预览', ['#456d8f', '#09121b', 'rgba(255,255,255,.14)']),
        ]),
        gameCard('chess-arena', '赛事房', '偏赛事活动展示的卡。', '赛事', 2180, 276888, [
          scene('赛事房', '活动氛围切换', ['#3b78ad', '#0a182a', 'rgba(203,239,255,.16)']),
          scene('热度变化', '在线数变化', ['#2f6da5', '#09131f', 'rgba(255,255,255,.16)']),
          scene('推荐卡位', '房卡动态效果', ['#456d8f', '#09121b', 'rgba(255,230,150,.14)']),
        ]),
        gameCard('chess-friends', '好友桌', '轻量动画预览卡。', '好友', 2050, 258888, [
          scene('好友桌', '轻量动画预览', ['#456d8f', '#09121b', 'rgba(255,255,255,.14)']),
          scene('约局提示', '温和状态变化', ['#4f7ea8', '#091523', 'rgba(255,230,150,.14)']),
          scene('热房跳转', '推荐位切换', ['#335b7d', '#08111b', 'rgba(228,241,255,.14)']),
        ]),
      ]),
    ],
  },
];

const MARQUEE_MESSAGES = [
  '欢迎进入横屏综合大厅，所有主卡片支持手动左右滑动查看。',
  '大厅在线人数在 2000 ~ 10000 区间内随机缓慢波动，仅用于展示效果。',
  '奖池金额、推荐位、卡片画面都会动态变化，方便先看整体大厅感觉。',
  '当前已接入可试玩深海捕鱼，其余分类先展示完整卡片层级效果。',
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

function id(type, key) {
  return `${type}:${key}`;
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
    ].map(name => [name, document.getElementById(name)]));
    this.toastTimer = 0;
    this.dynamicTimer = 0;
    this.launchHandler = null;
    this.states = new Map();
    this.groupOrder = [];
    this.groupMap = new Map();
    this.roomMap = new Map();
    this.gameMap = new Map();
    this.recommendationIndex = 0;
    this.currentGroupKey = '';
    this.currentRoomKey = '';
    this.currentGameKey = '';
    this.buildFishGuide();
    this.prepareLobbyData();
    this.buildLobby();
    this.buildCatalogPortal();
    this.bindLobbyActions();
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

  prepareLobbyData() {
    for (const group of LOBBY_GROUPS) {
      this.groupOrder.push(group.key);
      this.groupMap.set(group.key, group);
      this.states.set(id('group', group.key), this.createState('group', group));
      for (const room of group.rooms) {
        room.groupKey = group.key;
        this.roomMap.set(room.key, room);
        this.states.set(id('room', room.key), this.createState('room', room));
        for (const game of room.games) {
          game.groupKey = group.key;
          game.roomKey = room.key;
          this.gameMap.set(game.key, game);
          this.states.set(id('game', game.key), this.createState('game', game));
        }
      }
    }
    this.refreshGroupStates();
  }

  createState(kind, item) {
    return {
      kind,
      item,
      key: item.key,
      sceneIndex: 0,
      online: Number(item.online || 0),
      onlineMin: 2000,
      onlineMax: 10000,
      jackpot: Number(item.jackpot || 0),
      jackpotMin: Math.max(188888, Math.round(Number(item.jackpot || 388888) * 0.65)),
      jackpotMax: Math.round(Math.max(Number(item.jackpot || 388888), 388888) * 1.55),
      views: [],
    };
  }

  buildLobby() {
    this.nodes.marqueeTrack.replaceChildren(...[...MARQUEE_MESSAGES, ...MARQUEE_MESSAGES].map(text => {
      const span=document.createElement('span');
      span.textContent=text;
      return span;
    }));

    this.nodes.btnEnterFishing.dataset.action = 'launch-game';
    this.nodes.btnEnterFishing.dataset.game = 'fishing';

    this.nodes.featuredRail.replaceChildren(...this.groupOrder.map(groupKey => {
      const group = this.groupMap.get(groupKey);
      return this.createEntityCard(this.states.get(id('group', groupKey)), {
        className: 'featured-card glass',
        action: 'open-group',
        dataset: { group: group.key },
        actionLabel: '查看房间',
      });
    }));

    this.nodes.lobbySections.replaceChildren(...this.groupOrder.map(groupKey => this.createCategorySection(this.groupMap.get(groupKey))));
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
        <span>游戏房间 ${group.rooms.length} 张</span>
        <span>游戏卡片齐全</span>
        <span>动态状态展示</span>
      </div>
    `;

    const note=document.createElement('div');
    note.className='category-note';
    note.innerHTML = `<strong>${group.title}</strong> 区已补齐大厅卡片 → 游戏房间卡片 → 游戏卡片三级结构，点进房间可继续看完整子卡。`;
    head.append(feature, note);

    const rail=document.createElement('div');
    rail.className='lobby-scroll';
    rail.setAttribute('aria-label', `${group.title} 房间卡滑动区`);
    rail.replaceChildren(...group.rooms.map(room => this.createEntityCard(this.states.get(id('room', room.key)), {
      className: 'subgame-card glass',
      action: 'open-room',
      dataset: { group: group.key, room: room.key },
      actionLabel: '查看游戏',
    })));

    article.append(head, rail);
    return article;
  }

  createEntityCard(state, options) {
    const button=document.createElement('button');
    button.type='button';
    button.className=options.className;
    button.dataset.action=options.action;
    for (const [key, value] of Object.entries(options.dataset || {})) button.dataset[key]=value;

    const sceneWrap=document.createElement('div');
    sceneWrap.className='card-scene';
    const chip=document.createElement('span');
    chip.className='scene-chip';
    const title=document.createElement('div');
    title.className='scene-title';
    title.textContent=state.item.title;
    const caption=document.createElement('div');
    caption.className='scene-caption';
    sceneWrap.append(chip,title,caption);

    const body=document.createElement('div');
    body.className='card-body';
    const topline=document.createElement('div');
    topline.className='card-topline';
    const badge=document.createElement('span');
    badge.className='card-badge';
    badge.textContent=state.item.badge;
    const action=document.createElement('span');
    action.className=`card-action${options.actionLabel === '进入试玩' ? '' : ' pending'}`;
    action.textContent=options.actionLabel;
    topline.append(badge,action);

    const subtitle=document.createElement('p');
    subtitle.className='card-subtitle';
    subtitle.textContent=state.item.subtitle;

    const metrics=document.createElement('div');
    metrics.className='card-metrics';
    const onlineBox=this.metricBox('在线人数');
    const jackpotBox=this.metricBox('奖池滚动');
    metrics.append(onlineBox.box,jackpotBox.box);

    body.append(topline, subtitle, metrics);
    button.append(sceneWrap, body);

    this.registerView(state, {
      element: button,
      render: current => {
        const currentScene = current.item.scenes[current.sceneIndex % current.item.scenes.length];
        chip.textContent = currentScene.label;
        caption.textContent = currentScene.text;
        button.style.setProperty('--scene-a', currentScene.colors[0]);
        button.style.setProperty('--scene-b', currentScene.colors[1]);
        button.style.setProperty('--scene-c', currentScene.colors[2]);
        onlineBox.value.textContent = int(current.online);
        jackpotBox.value.textContent = money(current.jackpot);
      },
    });
    return button;
  }

  metricBox(label) {
    const box=document.createElement('div');
    box.className='metric-box';
    const name=document.createElement('span');
    name.textContent=label;
    const value=document.createElement('strong');
    box.append(name, value);
    return { box, value };
  }

  registerView(state, view) {
    state.views.push(view);
    view.render(state);
  }

  renderState(state) {
    state.views = state.views.filter(view => view.element?.isConnected);
    for (const view of state.views) view.render(state);
  }

  refreshGroupStates() {
    for (const groupKey of this.groupOrder) {
      const group = this.groupMap.get(groupKey);
      const groupState = this.states.get(id('group', groupKey));
      groupState.online = group.rooms.reduce((sum, room) => sum + this.states.get(id('room', room.key)).online, 0);
      groupState.jackpot = group.rooms.reduce((sum, room) => sum + this.states.get(id('room', room.key)).jackpot, 0);
      groupState.jackpotMin = group.rooms.reduce((sum, room) => sum + this.states.get(id('room', room.key)).jackpotMin, 0);
      groupState.jackpotMax = group.rooms.reduce((sum, room) => sum + this.states.get(id('room', room.key)).jackpotMax, 0);
      this.renderState(groupState);
    }
  }

  buildCatalogPortal() {
    const overlay=document.createElement('section');
    overlay.className='catalog-overlay hidden';
    overlay.setAttribute('aria-label', '房间与游戏卡详情');
    overlay.innerHTML = `
      <div class="catalog-shell glass">
        <div class="catalog-toolbar">
          <button class="round-button" type="button" data-action="catalog-back">返回大厅</button>
          <div class="catalog-breadcrumb" id="catalogBreadcrumb"></div>
          <button class="hero-button catalog-launch" id="catalogLaunch" type="button" data-action="launch-selected">查看当前游戏</button>
        </div>
        <div class="catalog-hero">
          <div class="catalog-summary">
            <span id="catalogBadge" class="section-kicker">房间</span>
            <h2 id="catalogTitle">游戏房间</h2>
            <p id="catalogSubtitle">房间介绍</p>
            <div class="catalog-summary-stats">
              <div><span>当前在线</span><strong id="catalogOnline">0</strong></div>
              <div><span>当前奖池</span><strong id="catalogJackpot">¥ 0</strong></div>
              <div><span>当前状态</span><strong id="catalogStatus">预览中</strong></div>
            </div>
          </div>
          <div id="catalogPreview" class="catalog-preview">
            <div class="catalog-preview-scene">
              <span id="catalogSceneChip" class="scene-chip">场景</span>
              <strong id="catalogPreviewTitle">游戏预览</strong>
              <p id="catalogSceneText">场景描述</p>
            </div>
            <div class="catalog-preview-meta">
              <div><span>房间卡</span><strong id="catalogRoomLabel">--</strong></div>
              <div><span>游戏卡</span><strong id="catalogGameLabel">--</strong></div>
            </div>
          </div>
        </div>
        <div class="catalog-block">
          <div class="lobby-section-head">
            <div>
              <span class="section-kicker">游戏房间卡片</span>
              <h2>房间入口</h2>
            </div>
            <p>这一层展示房间卡</p>
          </div>
          <div id="catalogRoomRail" class="lobby-scroll catalog-room-rail"></div>
        </div>
        <div class="catalog-block">
          <div class="lobby-section-head">
            <div>
              <span class="section-kicker">游戏卡片</span>
              <h2>房内游戏</h2>
            </div>
            <p>这一层展示具体游戏卡</p>
          </div>
          <div id="catalogGameGrid" class="catalog-game-grid"></div>
        </div>
      </div>
    `;
    this.nodes.lobby.querySelector('.lobby-shell').append(overlay);
    this.catalog = {
      overlay,
      breadcrumb: overlay.querySelector('#catalogBreadcrumb'),
      title: overlay.querySelector('#catalogTitle'),
      subtitle: overlay.querySelector('#catalogSubtitle'),
      badge: overlay.querySelector('#catalogBadge'),
      online: overlay.querySelector('#catalogOnline'),
      jackpot: overlay.querySelector('#catalogJackpot'),
      status: overlay.querySelector('#catalogStatus'),
      preview: overlay.querySelector('#catalogPreview'),
      sceneChip: overlay.querySelector('#catalogSceneChip'),
      previewTitle: overlay.querySelector('#catalogPreviewTitle'),
      sceneText: overlay.querySelector('#catalogSceneText'),
      roomLabel: overlay.querySelector('#catalogRoomLabel'),
      gameLabel: overlay.querySelector('#catalogGameLabel'),
      roomRail: overlay.querySelector('#catalogRoomRail'),
      gameGrid: overlay.querySelector('#catalogGameGrid'),
      launch: overlay.querySelector('#catalogLaunch'),
    };
    this.enableDragScroll(this.catalog.roomRail);
  }

  bindLobbyActions() {
    this.nodes.lobby.addEventListener('click', event => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const { action } = target.dataset;
      if (action === 'open-group') this.openCatalog(target.dataset.group);
      if (action === 'open-room') this.openCatalog(target.dataset.group, target.dataset.room);
      if (action === 'select-game') this.selectCatalogGame(target.dataset.group, target.dataset.room, target.dataset.game);
      if (action === 'catalog-back') this.closeCatalog();
      if (action === 'launch-selected') this.launchSelectedGame();
      if (action === 'launch-game') this.launchGame(target.dataset.game);
    });
  }

  openCatalog(groupKey, roomKey, gameKey) {
    const group = this.groupMap.get(groupKey);
    if (!group) return;
    const room = group.rooms.find(entry => entry.key === roomKey) || group.rooms[0];
    const game = room.games.find(entry => entry.key === gameKey) || room.games[0];
    this.currentGroupKey = group.key;
    this.currentRoomKey = room.key;
    this.currentGameKey = game.key;

    this.catalog.roomRail.replaceChildren(...group.rooms.map(entry => {
      const state = this.states.get(id('room', entry.key));
      const node = this.createEntityCard(state, {
        className: `subgame-card glass${entry.key === room.key ? ' is-active-card' : ''}`,
        action: 'open-room',
        dataset: { group: group.key, room: entry.key },
        actionLabel: entry.key === room.key ? '当前房间' : '查看游戏',
      });
      return node;
    }));

    this.catalog.gameGrid.replaceChildren(...room.games.map(entry => {
      const state = this.states.get(id('game', entry.key));
      const node = this.createEntityCard(state, {
        className: `subgame-card glass catalog-game-card${entry.key === game.key ? ' is-active-card' : ''}`,
        action: 'select-game',
        dataset: { group: group.key, room: room.key, game: entry.key },
        actionLabel: entry.playable ? '查看并进入' : '查看详情',
      });
      return node;
    }));

    this.catalog.overlay.classList.remove('hidden');
    this.renderCatalogPanel();
  }

  selectCatalogGame(groupKey, roomKey, gameKey) {
    this.openCatalog(groupKey, roomKey, gameKey);
  }

  renderCatalogPanel() {
    if (!this.currentGroupKey || !this.currentRoomKey || !this.currentGameKey) return;
    const group = this.groupMap.get(this.currentGroupKey);
    const roomState = this.states.get(id('room', this.currentRoomKey));
    const gameState = this.states.get(id('game', this.currentGameKey));
    const currentScene = gameState.item.scenes[gameState.sceneIndex % gameState.item.scenes.length];

    this.catalog.breadcrumb.textContent = `${group.title} / ${roomState.item.title} / ${gameState.item.title}`;
    this.catalog.badge.textContent = roomState.item.badge;
    this.catalog.title.textContent = roomState.item.title;
    this.catalog.subtitle.textContent = roomState.item.subtitle;
    this.catalog.online.textContent = int(gameState.online);
    this.catalog.jackpot.textContent = money(gameState.jackpot);
    this.catalog.status.textContent = gameState.item.status;
    this.catalog.sceneChip.textContent = currentScene.label;
    this.catalog.previewTitle.textContent = gameState.item.title;
    this.catalog.sceneText.textContent = `${currentScene.text} · ${gameState.item.subtitle}`;
    this.catalog.roomLabel.textContent = roomState.item.title;
    this.catalog.gameLabel.textContent = gameState.item.title;
    this.catalog.preview.style.setProperty('--scene-a', currentScene.colors[0]);
    this.catalog.preview.style.setProperty('--scene-b', currentScene.colors[1]);
    this.catalog.preview.style.setProperty('--scene-c', currentScene.colors[2]);
    this.catalog.launch.dataset.game = gameState.item.key;
    this.catalog.launch.disabled = !gameState.item.playable;
    this.catalog.launch.textContent = gameState.item.playable ? '进入当前游戏' : '当前为动态预览';
  }

  closeCatalog() {
    this.catalog.overlay.classList.add('hidden');
  }

  launchSelectedGame() {
    if (this.currentGameKey) this.launchGame(this.currentGameKey);
  }

  launchGame(gameKey) {
    if (!gameKey) return;
    if (this.launchHandler) this.launchHandler(gameKey);
  }

  updateRecommendation(step = 1) {
    this.recommendationIndex = (this.recommendationIndex + step + this.groupOrder.length) % this.groupOrder.length;
    const group = this.groupMap.get(this.groupOrder[this.recommendationIndex]);
    const previewRoom = group.rooms[0];
    const roomState = this.states.get(id('room', previewRoom.key));
    const sceneState = roomState.item.scenes[roomState.sceneIndex % roomState.item.scenes.length] || roomState.item.scenes[0];
    this.nodes.lobbyRecommendation.dataset.action = 'open-group';
    this.nodes.lobbyRecommendation.dataset.group = group.key;
    this.nodes.recommendationBadge.textContent = `${group.badge}推荐`;
    this.nodes.recommendationTitle.textContent = previewRoom.title;
    this.nodes.recommendationScene.textContent = `${sceneState.label} · ${sceneState.text}`;
    this.nodes.recommendationOnline.textContent = int(roomState.online);
    this.nodes.recommendationJackpot.textContent = money(roomState.jackpot);
    this.nodes.recommendationStatus.textContent = previewRoom.status;
    this.nodes.lobbyRecommendation.style.setProperty('--recommend-a', sceneState.colors[0]);
    this.nodes.lobbyRecommendation.style.setProperty('--recommend-b', sceneState.colors[1]);
    this.nodes.lobbyRecommendation.style.setProperty('--recommend-c', sceneState.colors[2]);
  }

  refreshLobbyTotals() {
    const totalOnline = this.groupOrder.reduce((sum, key) => sum + this.states.get(id('group', key)).online, 0);
    const totalJackpot = this.groupOrder.reduce((sum, key) => sum + this.states.get(id('group', key)).jackpot, 0);
    this.nodes.lobbyTotalOnline.textContent = int(totalOnline);
    this.nodes.lobbyTotalJackpot.textContent = money(totalJackpot);
  }

  tickState(state) {
    if (state.kind === 'group') {
      state.sceneIndex = (state.sceneIndex + 1) % state.item.scenes.length;
      return;
    }
    const onlineDelta = Math.round((Math.random() - 0.5) * 420);
    const jackpotDelta = Math.round((Math.random() - 0.28) * 12000);
    state.online = clamp(state.online + onlineDelta, state.onlineMin, state.onlineMax);
    state.jackpot = clamp(state.jackpot + jackpotDelta, state.jackpotMin, state.jackpotMax);
    if (Math.random() > 0.46) state.sceneIndex = (state.sceneIndex + 1) % state.item.scenes.length;
  }

  startLobbyDynamics() {
    clearInterval(this.dynamicTimer);
    this.dynamicTimer = setInterval(() => {
      for (const state of this.states.values()) this.tickState(state);
      this.refreshGroupStates();
      for (const state of this.states.values()) if (state.kind !== 'group') this.renderState(state);
      this.updateRecommendation(1);
      this.refreshLobbyTotals();
      if (!this.catalog.overlay.classList.contains('hidden')) this.renderCatalogPanel();
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
    this.closeCatalog();
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
  onLobbySelect(handler) { this.launchHandler = handler; }
  toast(message,duration=1800) {
    clearTimeout(this.toastTimer); this.nodes.toast.textContent=message; this.nodes.toast.classList.remove('hidden');
    this.toastTimer=setTimeout(()=>this.nodes.toast.classList.add('hidden'),duration);
  }
}
