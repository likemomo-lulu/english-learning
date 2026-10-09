import { shoppingLessons } from './daily-shopping.js';
import { homeLessons } from './daily-home.js';
import { outingLessons } from './daily-out.js';
import { travelLessons } from './travel.js';
import { workChapters, workplaceLessons } from './workplace.js';
import { serviceChapters, serviceLessons } from './daily-services.js';
import { lessonSupplements } from './lesson-supplements.js';
import { buildQuickReference } from './quick-reference.js';
import { expandedDailyChapters, expandedDailyLessons } from './daily-expansion.js';
import { expandedTravelChapters, expandedTravelLessons } from './travel-expansion.js';
import { expandedWorkChapters, expandedWorkLessons } from './workplace-expansion.js';
import { culturalChapters, culturalLessons } from './cultural-scenes.js';

// All 54 chapters have complete text drafts; audio and native-speaker review are separate stages.
export const chapters = [
  ['D01', '买咖啡和奶茶', 'Ordering a drink', 'Coffee', '购物与饮食', '选择口味 · 调整订单', 'Could you make it a little less sweet?', '能少放一点糖吗？'],
  ['D02', '超市找东西', 'At the supermarket', 'ShoppingBasket', '购物与饮食', '找商品 · 接受替代 · 核对价格', 'Do you happen to know where the oat milk is?', '你知道燕麦奶在哪儿吗？'],
  ['D03', '便利店买东西', 'A quick stop', 'Store', '购物与饮食', '买点吃的 · 请求加热', 'Could you heat this up for me?', '能帮我加热一下吗？'],
  ['D04', '买衣服和试穿', 'Finding the right fit', 'Shirt', '购物与饮食', '试穿 · 换尺码 · 表达犹豫', 'Do you have this in a size up?', '这件有大一码的吗？'],
  ['D05', '结账和退换货', 'Checkout & returns', 'Receipt', '购物与饮食', '核对金额 · 询问退换', "I'd like to exchange this for a different size.", '我想换一个尺码。'],
  ['D06', '聊食物和口味', 'Talking about food', 'Utensils', '购物与饮食', '描述口感 · 委婉表达偏好', "It's a bit too rich for me.", '对我来说有点太厚重了。'],
  ['D07', '厨房备菜', 'Getting things ready', 'CookingPot', '居家与生活', '洗切食材 · 解冻 · 说下一步', 'Could you chop these up while I wash the rice?', '我淘米的时候，你能把这些切好吗？'],
  ['D08', '和朋友一起做饭', 'Cooking together', 'ChefHat', '居家与生活', '分工 · 调火 · 尝味道', 'Could you turn the heat down a little?', '能把火调小一点吗？'],
  ['D09', '洗衣和家务', 'Everyday chores', 'WashingMachine', '居家与生活', '安排分工 · 描述进度', "I'll hang these up to dry.", '我把这些挂起来晾干。'],
  ['D10', '拿、带、递和收起来', 'Bring, take & put away', 'Hand', '居家与生活', '说清动作 · 请求帮助', 'Could you pass me the charger?', '能把充电器递给我吗？'],
  ['D11', '收快递', 'A delivery at the door', 'Package', '居家与生活', '确认包裹 · 说明放置位置', 'Could you leave it by the door?', '能把它放在门边吗？'],
  ['D12', '手机充电和借东西', 'A little help', 'BatteryCharging', '居家与生活', '借充电器 · 说明设备问题', "My phone's about to die.", '我的手机快没电了。'],
  ['D13', '地铁站找路和换乘', 'Getting around', 'TramFront', '出行与社交', '找站台 · 确认方向 · 换乘', 'Is this the right platform for the airport?', '去机场是在这个站台吗？'],
  ['D14', '买票和闸机问题', 'Tickets & gates', 'Ticket', '出行与社交', '询问票种 · 说明刷卡失败', "My card isn't working at the gate.", '我的卡在闸机这里刷不了。'],
  ['D15', '共享单车和短途出行', 'A short ride', 'Bike', '出行与社交', '解锁 · 还车 · 说明故障', "I can't get the bike to unlock.", '这辆车我解锁不了。'],
  ['D16', '逛公园、天气和计划', 'A walk in the park', 'Trees', '出行与社交', '约散步 · 聊天气 · 改计划', "Looks like it's about to rain.", '看样子快要下雨了。'],
  ['D17', '书店找书和推荐', 'Something to read', 'BookOpen', '出行与社交', '找书 · 接受推荐 · 随便看看', "I'm looking for something light to read.", '我想找点轻松的读物。'],
  ['D18', '约朋友和自然接话', 'Making plans', 'MessagesSquare', '出行与社交', '邀约 · 改期 · 礼貌拒绝', 'Could we make it a bit later?', '我们能约晚一点吗？'],
  ...serviceChapters,
  ...expandedDailyChapters,
  ...culturalChapters,
  ['T01', '机场值机和行李', 'At the airport', 'Plane', '旅行补充', '托运 · 确认登机信息', 'Can I take this bag on board?', '这个包可以带上飞机吗？'],
  ['T02', '机上请求和中转', 'On board & in transit', 'Luggage', '旅行补充', '请求用品 · 询问中转', 'Will I have enough time to make my connection?', '我有足够时间赶上转机吗？'],
  ['T03', '酒店入住和房间问题', 'Checking in', 'BedDouble', '旅行补充', '核对预订 · 说明房间问题', "The air conditioning doesn't seem to be working.", '空调好像不工作了。'],
  ['T04', '餐厅预约、点餐和结账', 'Eating out', 'Utensils', '旅行补充', '等位 · 点餐 · 说明过敏', 'Does this contain any nuts? I have a nut allergy.', '这里面有坚果吗？我对坚果过敏。'],
  ['T05', '打车、问路和目的地', 'Finding your way', 'CarFront', '旅行补充', '确认上车点 · 说清下车位置', 'Could you drop me off at the main entrance?', '能让我在正门下车吗？'],
  ['T06', '丢东西和求助', 'When things go wrong', 'LifeBuoy', '旅行补充', '描述物品 · 解释问题 · 求助', 'I think I left my phone in the taxi.', '我想我把手机落在出租车里了。'],
  ...expandedTravelChapters,
  ...workChapters,
  ...expandedWorkChapters,
].map(([id, title, english, icon, group, task, example, translation]) => ({
  id, title, english, icon, group, task, example, translation,
  ready: true, sample: false,
}));

// Each row contains English, Chinese, speaker, tone, and an optional usage note.
const supermarket = [
  ["I'm just picking up a few things.", '我就来买点东西。', '顾客', '日常表达', 'pick up 在这里指购买，而不是捡起来。'],
  ['Do you happen to know where the oat milk is?', '你知道燕麦奶在哪儿吗？', '顾客', '委婉询问', '也可以直接说 Where can I find the oat milk? 两种说法都自然。'],
  ["It's in aisle five, on your left.", '在第五条走道，左手边。', '店员', '指引位置'],
  ['Are you out of the unsweetened one?', '无糖的那款卖完了吗？', '顾客', '确认库存', 'the one 指双方已经明确的那一款商品。'],
  ['Let me check in the back.', '我去后面的库房看一下。', '店员', '日常回应'],
  ['Would this one work for you?', '这款可以吗？', '店员', '提供选项', 'work for you 在这里指某个选项是否合适。'],
  ["That'll do, thanks.", '那款也行，谢谢。', '顾客', '接受替代', "表示够用或接受替代。That works for me. 更明确地表示认可。"],
  ['Could you check the price for me?', '能帮我核对一下价格吗？', '顾客', '礼貌请求'],
  ['It was marked at three ninety-nine.', '标价是 3.99。', '顾客', '说明价格'],
  ['Do you need a bag?', '需要袋子吗？', '店员', '日常询问'],
  ["I'm all set, thanks.", '不用了，谢谢。', '顾客', '礼貌拒绝', '在被问是否还需要东西时使用；不是所有语境都表示拒绝。'],
  ['Could I get a receipt, please?', '能给我一张小票吗？', '顾客', '礼貌请求'],
];
const coffee = [
  ['Could I get an iced latte, please?', '请给我一杯冰拿铁。', '顾客', '礼貌请求'],
  ['What size would you like?', '你想要多大杯的？', '店员', '确认选择'],
  ['A medium, please.', '中杯，谢谢。', '顾客', '日常回应'],
  ['For here or to go?', '在这里喝还是带走？', '店员', '确认选择', 'to go 常用于美式点单场景；英式也常用 takeaway。'],
  ['To go, thanks.', '带走，谢谢。', '顾客', '日常回应'],
  ['Could you make it a little less sweet?', '能少放一点糖吗？', '顾客', '调整口味', '适合本来含糖浆或糖的饮品；原味拿铁若不加糖，不必提出减糖。'],
  ['Could I have it with oat milk?', '能换成燕麦奶吗？', '顾客', '调整订单'],
  ["We're out of oat milk. Would soy milk work?", '燕麦奶没了，豆奶可以吗？', '店员', '提供选项'],
  ['That works for me, thanks.', '可以的，谢谢。', '顾客', '接受选项', 'work 在这里表示选项合适，不是工作。'],
  ["Sorry, I ordered an iced latte, but this one's hot.", '不好意思，我点的是冰拿铁，但这杯是热的。', '顾客', '礼貌纠错'],
  ["I'll remake that for you.", '我给你重新做一杯。', '店员', '日常回应'],
  ["That's everything, thanks.", '就这些，谢谢。', '顾客', '结束点单'],
];

// The prefix identifies the core or conversation section; ownership always uses the parent chapter ID.
const makeLines = (prefix, rows) => rows.map(([en, zh, role, tone, note], i) => ({ id: `${prefix}-S${String(i + 1).padStart(2, '0')}`, chapterId: prefix.split('-')[0], en, zh, role, tone, note }));
const line = (en, zh, role) => [en, zh, role, '日常对话'];

export const lessons = {
  ...shoppingLessons, ...homeLessons, ...outingLessons, ...travelLessons, ...workplaceLessons, ...serviceLessons,
  ...expandedDailyLessons, ...expandedTravelLessons, ...expandedWorkLessons,
  ...culturalLessons,
  D01: {
    scenario: '你想买一杯带走的冰拿铁，换成燕麦奶。店里缺了一种原料，你需要选择替代品。',
    lines: makeLines('D01', coffee),
    phrases: ['an iced latte 冰拿铁', 'to go 带走', 'less sweet 少甜一点', 'with oat milk 换成燕麦奶', 'out of 没有了', 'remake the drink 重新做饮品'],
    dialogues: [
      { title: '点一杯带走的饮品', subtitle: '选择规格，确认口味', lines: makeLines('D01-A', [line('Hi. What can I get for you?', '你好，想喝点什么？', '店员'), coffee[0], coffee[1], coffee[2], coffee[3], coffee[4], coffee[6], line('Of course. Anything else?', '当然。还需要别的吗？', '店员'), coffee[11]]) },
      { title: '奶茶调整甜度', subtitle: '确认口味和价格', lines: makeLines('D01-D', [line('Could I get a medium milk tea, please?', '请给我一杯中杯奶茶。', '顾客'), line('Of course. How sweet would you like it?', '当然，甜度想要多少？', '店员'), coffee[5], line('Sure. Half the usual amount of sugar?', '可以，糖量减到平时的一半吗？', '店员'), line('Yes, please. How much is it?', '是的，谢谢，多少钱？', '顾客'), line('Four dollars. Is that to go?', '四美元，带走吗？', '店员'), coffee[4], line("Great. We'll call your number when it's ready.", '好，做好后会叫你的号码。', '店员')]) },
    ],
    branches: [
      { title: '想要的奶没有了', subtitle: '确认替代选项', lines: makeLines('D01-B', [coffee[6], coffee[7], coffee[8], line('Great. A medium iced latte with soy milk.', '好的，一杯中杯冰拿铁，换豆奶。', '店员')]) },
      { title: '饮品做错了', subtitle: '说清问题，礼貌纠错', lines: makeLines('D01-C', [coffee[9], line('Sorry about that.', '不好意思。', '店员'), coffee[10], line('Thanks for sorting that out.', '谢谢你帮我处理。', '顾客')]) },
    ],
    practice: { substitutions: ['把 iced latte 换成 hot cappuccino，点热卡布奇诺。', '把 medium 换成 small，调整规格。', '点带糖的奶茶时请求少甜；不机械给所有咖啡要求减糖。'], responses: [['For here or to go?', '选择带走。', 'To go, thanks.'], ["We're out of oat milk.", '问是否有豆奶。', 'Do you have soy milk instead?'], ['Anything else?', '自然结束订单。', "That's everything, thanks."]], task: '完成点单、确认规格和带走、提出适用的口味调整；遇到缺货或做错时说明问题。' },
  },
  D02: {
    scenario: '你去超市买无糖燕麦奶，只想买少量东西。问清位置，处理缺货，并在结账时核对价格。',
    lines: makeLines('D02', supermarket),
    phrases: ['pick up a few things 买点东西', 'in aisle five 在第五条走道', 'out of stock 缺货', 'check in the back 查库房', 'the unsweetened one 无糖那款', 'scan at the wrong price 扫出错误价格'],
    dialogues: [
      { title: '找到商品', subtitle: '问位置，确认商品规格', lines: makeLines('D02-A', [line('Hi. Can I help you find anything?', '你好，需要我帮你找什么吗？', '店员'), line('Yes, please. Do you happen to know where the oat milk is?', '好呀，你知道燕麦奶在哪儿吗？', '顾客'), supermarket[2], line('Thanks. Do you have the unsweetened kind?', '谢谢。你们有无糖的吗？', '顾客'), line("We do. It's on the top shelf.", '有的，在最上层。', '店员'), line('Great, thanks for your help.', '好的，谢谢你。', '顾客')]) },
      { title: '结账', subtitle: '回应询问，自然结束', lines: makeLines('D02-B', [line('Hi. Did you find everything you needed?', '你好，你需要的东西都找到了吗？', '收银员'), line("Yes, thanks. I'm just picking up a few things.", '找到了，谢谢。我就来买点东西。', '顾客'), supermarket[9], line("I'm all set, thanks. I've got my own.", '不用了，谢谢。我自己带了。', '顾客'), line('Would you like a receipt?', '需要小票吗？', '收银员'), line('Yes, please.', '要的，谢谢。', '顾客'), line('Here you go. Have a good day.', '给你。祝你今天愉快。', '收银员'), line('Thanks. You too.', '谢谢，你也是。', '顾客')]) },
    ],
    branches: [
      { title: '原来的款式缺货', subtitle: '确认无糖，接受另一个品牌', lines: makeLines('D02-C', [supermarket[3], supermarket[4], line("Sorry, we're out of that brand. Would this one work for you?", '不好意思，那个牌子没货了。这款可以吗？', '店员'), line('Is it unsweetened too?', '这款也是无糖的吗？', '顾客'), line('Yes, it is.', '是的。', '店员'), supermarket[6]]) },
      { title: '结账价格不符', subtitle: '说明标价，请对方核对', lines: makeLines('D02-D', [line('Sorry, I think this scanned at the wrong price.', '不好意思，我觉得这件商品扫出来的价格不对。', '顾客'), line('What was the price on the shelf?', '货架上的标价是多少？', '收银员'), line('It was marked at three ninety-nine. Could you check the price for me?', '标价是 3.99。能帮我核对一下吗？', '顾客'), line('Of course. Let me take a look.', '当然，我看一下。', '收银员'), line("You're right. I'll adjust it.", '确实是的，我来改一下。', '收银员'), line('Thanks for checking.', '谢谢你帮我核对。', '顾客')]) },
    ],
    practice: { substitutions: ['把 oat milk 换成 laundry detergent，询问洗衣液的位置。', '已明确商品是咖啡时，把 unsweetened 换成 decaf，询问无咖啡因款。', '把 three ninety-nine 换成 five forty-nine，说明 5.49 的标价。'], responses: [['Would this one work for you?', '接受替代。', 'Yes, that works for me. Thanks.'], ['Do you need a bag?', '带了自己的袋子。', "No, thanks. I've got my own."], ["We're out of that brand.", '询问另一个品牌的无糖款。', 'Do you have an unsweetened one from another brand?']], task: '问商品位置，确认无糖，接受另一品牌，核对价格并拒绝袋子。' },
  },
};

// Append with explicit section IDs so additional dialogues cannot reuse existing branch IDs.
for (const [chapterId, supplement] of Object.entries(lessonSupplements)) {
  const lesson = lessons[chapterId];
  lesson.phrases.push(...supplement.phrases);
  for (const kind of ['dialogues', 'branches']) {
    for (const [suffix, title, subtitle, rows] of supplement[kind] || []) {
      lesson[kind].push({
        title, subtitle,
        lines: makeLines(`${chapterId}-${suffix}`, rows.map(([role, en, zh, note]) => [en, zh, role, '日常对话', note])),
      });
    }
  }
}

// The old placeholder chapters exposed their example as S01. Keep that text at S01
// so a saved favorite or learned mark cannot silently point to a different sentence.
for (const chapter of chapters.filter(ch => ch.id !== 'D01' && ch.id !== 'D02' && !ch.id.startsWith('W'))) {
  const lesson = lessons[chapter.id];
  const example = lesson.lines.find(sentence => sentence.en === chapter.example);
  if (!example) throw new Error(`Missing original example for ${chapter.id}`);
  lesson.lines = [example, ...lesson.lines.filter(sentence => sentence !== example)].map((sentence, index) => ({
    ...sentence, id: `${chapter.id}-S${String(index + 1).padStart(2, '0')}`,
  }));
}

export function getLesson(chapter) {
  return lessons[chapter.id];
}

// Build after the legacy core ID normalization so example links point to the saved IDs.
for (const chapter of chapters) {
  lessons[chapter.id].quickReference = buildQuickReference(chapter.id, lessons[chapter.id]);
}
