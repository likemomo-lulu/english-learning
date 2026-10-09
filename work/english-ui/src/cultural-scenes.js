import { defineLesson } from './lesson-format.js';

// Cultural introductions explain familiar practices without treating all families or recipes alike.
export const culturalChapters = [
  ['D33', '介绍中国传统节日', 'Introducing Chinese festivals', 'Sparkles', '出行与社交', '介绍习俗 · 解释节令 · 分享家中传统', 'In my family, we get together for a big meal at Chinese New Year.', '在我家，春节时我们会聚在一起吃一顿大餐。'],
  ['D34', '介绍中国经典小吃与菜肴', 'Introducing Chinese food', 'Utensils', '购物与饮食', '说明做法 · 描述口味 · 核对配料', 'Jianbing is a savory pancake, often sold as a street breakfast.', '煎饼是一种咸味薄饼，常作为街头早餐售卖。'],
];

// Dates follow the relevant traditional calendar; ingredients and customs vary by region and household.
export const culturalLessons = {
  D33: defineLesson('D33', {
    scenario: '朋友对中国节日感兴趣，你用自己家的经历介绍春节和中秋，并回答关于端午、元宵的补充问题。解释团聚、节令食物和活动，不把某一家或某个地区的习惯说成所有人都一样；传统历法中的节日不对应固定公历日期。',
    phrases: ['a family reunion 家庭团聚', 'a lunar calendar 农历中的阴历部分', 'red envelopes 红包', 'the Lantern Festival 元宵节', 'dragon boat races 龙舟比赛', 'the Mid-Autumn Festival 中秋节'],
    core: [
      ['In my family, we get together for a big meal at Chinese New Year.', '在我家，春节时我们会聚在一起吃一顿大餐。', '介绍者', 'In my family 限定为自家习惯；中国各地的节日食物和活动有差异。'],
      ['Chinese New Year is also called the Spring Festival.', '中国新年也叫春节。', '介绍者'],
      ['The date changes each year on the Western calendar.', '它在公历中的日期每年会变。', '介绍者', '中国农历属于阴阳合历，日常英文常称 lunar calendar；不要把春节固定说成一月一日。'],
      ['Many people travel home to spend time with their families.', '很多人会回家和家人相聚。', '介绍者'],
      ['Children often receive red envelopes with money inside.', '孩子们常会收到装着钱的红包。', '介绍者'],
      ['Some families make dumplings, while others have different dishes.', '有些家庭包饺子，另一些家庭会吃不同的菜。', '介绍者'],
      ['The Lantern Festival falls on the fifteenth day of the first lunar month.', '元宵节在农历正月十五。', '介绍者'],
      ['Tangyuan are glutinous rice balls, often with a sweet filling.', '汤圆是糯米制成的圆团，常有甜馅。', '介绍者'],
      ['At the Dragon Boat Festival, people eat zongzi and watch dragon boat races.', '端午节时，人们吃粽子、看龙舟比赛。', '介绍者'],
      ['Zongzi are packets of glutinous rice wrapped in leaves.', '粽子是用叶子包裹的糯米食物。', '介绍者', '常见甜馅和咸馅，也有不同叶材；具体配料要看眼前这只粽子，叶子用来包裹而不作为食用部分。'],
      ['The Mid-Autumn Festival is a time for family reunions and mooncakes.', '中秋节是家人团聚、吃月饼的时节。', '介绍者'],
      ['We often share mooncakes and enjoy looking at the moon.', '我们常一起分享月饼、赏月。', '介绍者'],
    ],
    dialogues: [
      ['从家中的春节习惯说起', '解释时间、团聚和食物差异', [
        ['朋友', 'What do you usually do for Chinese New Year?', '中国新年时你一般做什么？'],
        ['介绍者', 'In my family, we get together for a big meal at Chinese New Year. It is also called the Spring Festival.', '在我家，春节会聚在一起吃大餐，它也叫春节。'],
        ['朋友', 'Is it always on the same date?', '它总是在同一天吗？'],
        ['介绍者', 'It follows the traditional Chinese calendar, so the date changes each year on the Western calendar.', '它按中国传统历法安排，所以在公历中的日期每年会变。'],
        ['朋友', 'What do you eat at the family meal?', '家庭聚餐时你们吃什么？'],
        ['介绍者', 'We have fish and several other dishes. Some families make dumplings, while others have different dishes.', '我们吃鱼和其他几道菜，有些家庭包饺子，另一些会吃不同的菜。'],
        ['朋友', 'And what are the red envelopes for?', '那红包是做什么的？'],
        ['介绍者', 'Children often receive red envelopes with money inside, along with good wishes for the new year.', '孩子们常收到装着钱的红包，也收到对新年的美好祝愿。'],
      ]],
      ['介绍中秋与月饼', '解释节日活动，邀请对方尝试', [
        ['朋友', 'What is the Mid-Autumn Festival about?', '中秋节主要是怎样的节日？'],
        ['介绍者', 'It is a time for family reunions and mooncakes. We often share mooncakes and enjoy looking at the moon.', '它是家人团聚、吃月饼的时节，我们常分享月饼、赏月。'],
        ['朋友', 'When does it take place?', '它是什么时候？'],
        ['介绍者', 'On the fifteenth day of the eighth month in the traditional Chinese calendar.', '在中国传统历法的八月十五。'],
        ['朋友', 'What is inside a mooncake?', '月饼里有什么？'],
        ['介绍者', 'The fillings vary. This one has lotus seed paste, but other kinds may contain nuts or salted egg yolk.', '馅料很多样，这只里是莲蓉，其他种类可能有坚果或咸蛋黄。'],
        ['朋友', 'I would like to try a small piece.', '我想尝一小块。'],
        ['介绍者', 'Of course. Let us check the ingredients first, then cut a piece to share.', '当然，我们先核对配料，再切一块分享。'],
      ]],
    ],
    branches: [
      ['朋友询问端午和粽子', '区分食物、包装与活动', [
        ['朋友', 'Are zongzi eaten at Chinese New Year too?', '粽子也是中国新年吃的吗？'],
        ['介绍者', 'They are especially associated with the Dragon Boat Festival, when people also watch dragon boat races.', '它们特别与端午节相关，那时人们还会看龙舟比赛。'],
        ['朋友', 'What are they made of?', '它们是什么做的？'],
        ['介绍者', 'Zongzi are packets of glutinous rice wrapped in leaves. The fillings can be sweet or savory.', '粽子是叶子包裹的糯米食物，馅可以是甜的或咸的。'],
        ['朋友', 'Do you eat the leaf as well?', '叶子也吃吗？'],
        ['介绍者', 'No, you unwrap it and eat the rice and filling.', '不吃，把叶子剥开，吃里面的米和馅。'],
      ]],
      ['把元宵误认为固定公历日期', '说明历法与自己熟悉的活动', [
        ['朋友', 'So the Lantern Festival is on January fifteenth?', '所以元宵节是一月十五日吗？'],
        ['介绍者', 'It is the fifteenth day of the first lunar month, not necessarily January fifteenth.', '是农历正月十五，不一定是公历一月十五。'],
        ['朋友', 'What do you do for it?', '你们那天做什么？'],
        ['介绍者', 'In my family, we eat tangyuan. They are glutinous rice balls, often with a sweet filling. Some places also have lantern displays.', '我家吃汤圆，是糯米做的圆团，常有甜馅。有些地方还会有灯展。'],
      ]],
    ],
    practice: {
      substitutions: ['把 In my family 换成 In my hometown，介绍自己家乡确实有的习惯。', '把 lotus seed paste 换成 red bean paste，介绍另一种月饼馅。', '把 share mooncakes 换成 make dumplings together，说明共同活动。'],
      responses: [['Is it always on the same date?', '说明公历日期会变化。', 'The date changes each year on the Western calendar.'], ['Do all families eat dumplings?', '说明地区和家庭差异。', 'Some families do, while others have different dishes.'], ['What are zongzi made of?', '解释食材、叶子包装和馅。', 'They are packets of glutinous rice wrapped in leaves, with sweet or savory fillings.']],
      task: '选一个自己熟悉的节日，用四句介绍名称、传统历法中的时间、你家的一个活动和一种食物；邀请朋友提问，解释一个可能的误解，不把自己的习惯概括成所有人的习惯。',
    },
  }),
  D34: defineLesson('D34', {
    scenario: '带朋友尝试煎饼、小笼包和水饺，用做法、外形和口感解释食物，而不只逐字翻译名称。另一段练习是在餐馆介绍麻婆豆腐与火锅；肉类、花生、芝麻、面粉和汤底成分先向店家核实。',
    phrases: ['a savory pancake 咸味薄饼', 'steamed soup dumplings 蒸制的带汤汁小笼包', 'a meat or vegetable filling 肉馅或菜馅', 'a crisp texture 酥脆口感', 'a spicy broth 辣汤底', 'Sichuan peppercorns 花椒'],
    core: [
      ['Jianbing is a savory pancake, often sold as a street breakfast.', '煎饼是一种咸味薄饼，常作为街头早餐售卖。', '介绍者', 'savory 表示咸鲜而非甜味，不等于 spicy 辣；煎饼配料和酱料随店家变化。'],
      ['This one is made with egg, sauce and a crisp cracker inside.', '这一份有鸡蛋、酱料，里面还夹了薄脆。', '介绍者'],
      ['You can ask for it without chili sauce.', '你可以请求不加辣椒酱。', '介绍者'],
      ['Xiaolongbao are steamed dumplings with soup inside.', '小笼包是蒸制的包点，里面有汤汁。', '介绍者', '英文常称 soup dumplings；说明汤在里面，不是把饺子放在汤里，馅料仍要核实。'],
      ['Be careful. The soup inside can be very hot.', '小心，里面的汤汁可能很烫。', '介绍者'],
      ['These dumplings have a pork and cabbage filling.', '这些水饺是猪肉白菜馅。', '介绍者'],
      ['Would you prefer steamed, boiled or pan-fried dumplings?', '你更想吃蒸的、煮的，还是煎的饺子？', '介绍者'],
      ['Mapo tofu is a Sichuan dish with tofu in a spicy sauce.', '麻婆豆腐是一道川菜，豆腐配辣味酱汁。', '介绍者'],
      ['It often contains minced meat, so we should check before ordering a vegetarian version.', '它常含肉末，要点素食版本应先核实。', '介绍者', '菜名含 tofu 不代表一定素食；肉末、调味料和汤底都可能影响饮食要求。'],
      ['Sichuan peppercorns give it a tingling, numbing sensation.', '花椒会带来刺麻的感觉。', '介绍者'],
      ['With hot pot, we cook ingredients in a shared pot of broth.', '吃火锅时，我们把食材放在共享的汤锅里煮。', '介绍者'],
      ['Could you check whether the broth or sauce contains peanuts or sesame?', '能核查汤底或酱料是否含花生或芝麻吗？', '介绍者'],
    ],
    dialogues: [
      ['介绍街头早餐与小笼包', '说清做法、口味和食用时的提醒', [
        ['朋友', 'What is jianbing? I have not tried it before.', '煎饼是什么？我以前没吃过。'],
        ['介绍者', 'Jianbing is a savory pancake, often sold as a street breakfast. This one has egg, sauce and a crisp cracker inside.', '煎饼是咸味薄饼，常是街头早餐。这份有鸡蛋、酱料和夹在里面的薄脆。'],
        ['朋友', 'Is it very spicy?', '它很辣吗？'],
        ['介绍者', 'Not necessarily. You can ask for it without chili sauce, and we can check the other sauce ingredients.', '不一定，可以要求不加辣椒酱，也可以核查其他酱料的配料。'],
        ['朋友', 'And what are those little dumplings in the steamer?', '蒸笼里的那些小包点是什么？'],
        ['介绍者', 'Xiaolongbao. They are steamed dumplings with soup inside.', '是小笼包，它们是里面有汤汁的蒸包点。'],
        ['朋友', 'The soup is inside the dumpling?', '汤在包点里面？'],
        ['介绍者', 'Yes. Be careful, because it can be very hot. Let us ask which fillings are available.', '是的，小心，汤汁可能很烫。我们问问有什么馅。'],
      ]],
      ['介绍麻婆豆腐和火锅', '区分麻辣，先核实素食与配料', [
        ['朋友', 'What would you recommend for dinner?', '晚饭你推荐什么？'],
        ['介绍者', 'Mapo tofu is a Sichuan dish with tofu in a spicy sauce. Sichuan peppercorns give it a tingling, numbing sensation.', '麻婆豆腐是豆腐配辣味酱汁的川菜，花椒带来刺麻感。'],
        ['朋友', 'I do not eat meat. Is it vegetarian?', '我不吃肉，它是素食吗？'],
        ['介绍者', 'It often contains minced meat, so we should check before ordering a vegetarian version.', '它常有肉末，点素食版本之前应先核实。'],
        ['朋友', 'What about hot pot? How does that work?', '火锅呢，它是怎么吃的？'],
        ['介绍者', 'We cook ingredients in a shared pot of broth. We can ask about a mild broth and the vegetables available.', '我们在共享汤锅里煮食材，可以问不辣的汤底和有哪些蔬菜。'],
        ['朋友', 'I also need to avoid sesame.', '我还需要避开芝麻。'],
        ['介绍者', 'Let us tell the staff and check the broth, sauces and preparation before choosing.', '我们告诉店员，先核查汤底、酱料和制作方式，再选择。'],
      ]],
    ],
    branches: [
      ['问饺子馅和做法', '说具体这一份，不默认所有饺子相同', [
        ['朋友', 'What is inside these dumplings?', '这些饺子里面是什么？'],
        ['介绍者', 'These have a pork and cabbage filling. There are other fillings on the menu.', '这些是猪肉白菜馅，菜单还有其他馅。'],
        ['朋友', 'Are they all steamed?', '它们都是蒸的吗？'],
        ['介绍者', 'No. Would you prefer steamed, boiled or pan-fried dumplings? We can ask which options the restaurant offers.', '不是，你想吃蒸的、煮的还是煎的？我们可以问餐厅提供哪些做法。'],
      ]],
      ['无法确认饮食限制', '请店家核实，不用个人猜测保证', [
        ['朋友', 'Do you think this sauce contains peanuts or sesame?', '你觉得这个酱含花生或芝麻吗？'],
        ['介绍者', 'I am not sure. Let us ask the staff to check the ingredients and preparation.', '我不确定，我们请店员核查配料和制作方式。'],
        ['店员', 'I cannot confirm that this sauce is free from those ingredients or cross-contact.', '我不能确认这份酱没有这些配料，也不能排除交叉接触。'],
        ['朋友', 'Then I will not have this sauce. Could we discuss another option that you can check?', '那我不吃这份酱，可以商量一个你们能核实的其他选择吗？'],
      ]],
    ],
    practice: {
      substitutions: ['把 pork and cabbage 换成 mushroom and cabbage，说明另一种馅，但仍核对调味料。', '把 boiled 换成 pan-fried，介绍不同做法。', '把 peanuts or sesame 换成 egg or wheat，向店家核查其他配料。'],
      responses: [['What is jianbing?', '从做法和口味解释。', 'It is a savory pancake, often sold as a street breakfast.'], ['Is mapo tofu vegetarian?', '说明常有肉末，请店家核实。', 'It often contains minced meat, so we should check before ordering a vegetarian version.'], ['Is the soup outside the dumpling?', '说明小笼包汤在里面，提醒烫。', 'No, the soup is inside. Be careful, because it can be very hot.']],
      task: '选三种自己熟悉的小吃或菜，每种说明做法、主要配料和口味；朋友有饮食限制时向店家核查，不根据菜名或自己的记忆保证不含某种成分。',
    },
  }),
};
