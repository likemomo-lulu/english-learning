import { defineLesson } from './lesson-format.js';

// D35 extends the published catalog without reusing a chapter or sentence ID.
export const libraryChapters = [
  ['D35', '图书馆办卡与借还书', 'At the library', 'BookOpen', '生活服务', '办理借书卡 · 确认期限 · 续借与归还', 'How can I get a library card?', '我怎样办理借书卡？'],
];

// Loan periods, fees and eligibility below are fictional examples; ask the actual library.
export const libraryLessons = {
  D35: defineLesson('D35', {
    scenario: '你第一次到社区图书馆，询问借书卡所需材料，借一本小说并确认归还日期。之后想续借、预约已借出的书，或查询逾期费用。对话里的两周期限、费用和办卡材料只属于虚构图书馆，实际规则向工作人员核实。',
    phrases: ['a library card 借书卡', 'borrow a book 借书', 'the due date 应归还日期', 'renew a loan 续借', 'place a hold 预约借阅', 'an overdue fee 逾期费用'],
    core: [
      ['How can I get a library card?', '我怎样办理借书卡？', '读者', 'library card 指图书馆借阅证，不是银行卡；办卡条件、证件和费用依图书馆而定。'],
      ['What documents do I need to bring?', '我需要带哪些材料？', '读者'],
      ['Do I need proof of address?', '我需要住址证明吗？', '读者'],
      ['Is this book available to borrow?', '这本书现在可以借吗？', '读者'],
      ['How long can I keep it?', '我可以借多久？', '读者'],
      ['Could you confirm the due date?', '能确认应归还日期吗？', '读者', 'due date 在借书场景中指最迟归还日期；与实际归还的 return date 区分。'],
      ['Can I renew this loan online?', '我可以在线续借这本书吗？', '读者', 'renew this loan 指延长借阅，不是重新买书；是否能续借要看预约情况和具体规则。'],
      ['Someone else has placed a hold on this book.', '有人已经预约借阅这本书。', '工作人员'],
      ['Could I place a hold and collect it when it is available?', '我能预约，等有书时再来取吗？', '读者', 'place a hold 在图书馆语境中是预约借阅；可借日期通常要等通知，不能把预约当作已有现书。'],
      ['Where should I return the books?', '我应该在哪里还书？', '读者'],
      ['Is there a return box I can use when the library is closed?', '图书馆关门时有可以使用的还书箱吗？', '读者'],
      ['Could you check whether I owe any overdue fees?', '能查一下我是否有逾期费用吗？', '读者'],
    ],
    dialogues: [
      ['第一次办卡和借书', '核对材料、借阅期限和日期', [
        ['读者', 'Hi. How can I get a library card?', '你好，我怎样办理借书卡？'],
        ['工作人员', 'You can apply at this desk. We ask for photo identification and proof of address.', '可以在这个服务台申请，我们需要带照片的身份证明和住址证明。'],
        ['读者', 'I have my ID with me. What can I use as proof of address?', '我带了身份证明，哪些材料可以作住址证明？'],
        ['工作人员', 'A recent utility bill is one option here. We can discuss other documents if you do not have one.', '我们这里可以使用近期公用事业账单。如果你没有，可以再讨论其他材料。'],
        ['读者', 'Thanks. Is this book available to borrow? How long can I keep it?', '谢谢，这本书现在可以借吗？我可以借多久？'],
        ['工作人员', 'Yes. This copy can be borrowed for two weeks.', '可以，这本可以借两周。'],
        ['读者', 'Could you confirm the due date?', '能确认应归还日期吗？'],
        ['工作人员', 'Certainly. It is printed on this receipt and shown in your account.', '当然，日期印在这张借阅凭条上，账户里也有。'],
      ]],
      ['续借被预约的书', '了解限制，预约另一册并等候通知', [
        ['读者', 'Can I renew this loan online?', '我可以在线续借这本书吗？'],
        ['工作人员', 'Let me check. Someone else has placed a hold on this book, so this loan cannot be renewed.', '我查一下，有人已经预约这本书，所以这次借阅不能续期。'],
        ['读者', 'I understand. I will return it by the due date. Is another copy available?', '明白，我会按期归还，有另一册可以借吗？'],
        ['工作人员', 'Our other copy is also on loan at the moment.', '另一册目前也借出去了。'],
        ['读者', 'Could I place a hold and collect it when it is available?', '我能预约，等有书时再来取吗？'],
        ['工作人员', 'Yes. We will notify you when it is ready and tell you how long we can keep it for you.', '可以，有书可取时我们会通知你，并说明能为你保留多久。'],
        ['读者', 'Can I choose to receive the notification by email?', '我可以选择用邮件接收通知吗？'],
        ['工作人员', 'Yes. Please check the notification preferences in your account.', '可以，请在账户里核对通知偏好设置。'],
      ]],
    ],
    branches: [
      ['闭馆时归还', '核对还书箱与入账时间', [
        ['读者', 'Is there a return box I can use when the library is closed?', '图书馆关门时有可以使用的还书箱吗？'],
        ['工作人员', 'Yes, there is one by the main entrance. Please check the sign for items it accepts.', '有，就在正门旁，请看标牌确认它接收哪些借阅物品。'],
        ['读者', 'When will the return appear in my account?', '归还记录什么时候会出现在账户里？'],
        ['工作人员', 'We process the box when we reopen. If your record does not update, contact us so we can check.', '重新开馆后我们会处理还书箱。如果记录没更新，请联系我们核查。'],
      ]],
      ['查询逾期费用', '先核实记录，再了解处理方式', [
        ['读者', 'Could you check whether I owe any overdue fees?', '能查一下我是否有逾期费用吗？'],
        ['工作人员', 'Your account shows a fee for a book that was returned late.', '账户显示有一本逾期归还的书产生了费用。'],
        ['读者', 'Could you show me which book it was and the return date?', '能告诉我是哪个书名，以及记录的归还日期吗？'],
        ['工作人员', 'Of course. Let us review the record first, then I can explain the available payment or review options.', '当然，我们先核对记录，再由我说明可用的支付或复核方式。'],
      ]],
    ],
    practice: {
      substitutions: ['把 a library card 换成 a replacement library card，询问补办借书卡。', '把 this book 换成 this audiobook，询问有声书借阅，并核实适用期限。', '把 by email 换成 by text message，询问通知方式是否可选。'],
      responses: [['How long would you like to borrow it?', '询问图书馆允许的借阅期限。', 'How long can I keep it?'], ['This loan cannot be renewed.', '表示会按期归还，并询问其他册是否可借。', 'I will return it by the due date. Is another copy available?'], ['Your account shows an overdue fee.', '请对方核查书名和归还日期。', 'Could you show me which book it was and the return date?']],
      task: '模拟第一次办卡、借书与续借：询问材料和期限，复述归还日期；续借不成功时约定归还并预约下一册。还书或费用记录不清时先要求核查，不自行假设规则。',
    },
  }),
};
