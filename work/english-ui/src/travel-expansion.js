import { defineLesson } from './lesson-format.js';

// Travel additions cover disruption, border communication and urgent assistance.
export const expandedTravelChapters = [
  ['T07', '航班取消、延误与改签', 'Flight changes and cancellations', 'Plane', '旅行补充', '查询替代航班 · 确认行李 · 核对安排', 'My flight has been cancelled. What are my options?', '我的航班取消了，我有哪些选择？'],
  ['T08', '入境问答与海关申报', 'Immigration and customs', 'Luggage', '旅行补充', '如实回答 · 说明行程 · 核实申报', 'I am here on holiday for ten days.', '我来度假，停留十天。'],
  ['T09', '紧急求助与报告位置', 'Calling for urgent help', 'LifeBuoy', '旅行补充', '说明情况 · 报告位置 · 听懂指示', 'We need an ambulance at the north entrance of River Park.', '我们需要救护车，位置在 River Park 北入口。'],
];

// Airline terms and border requirements vary; emergency actions come from the dispatcher.
export const expandedTravelLessons = {
  T07: defineLesson('T07', {
    scenario: '去服务台询问取消航班的替代方案，核对新航班、托运行李和书面确认。另一段练习是延误可能影响中转，先报告后续行程；是否提供餐饮或住宿由航空公司按实际条件确认。',
    phrases: ['a cancelled flight 被取消的航班', 'the next available flight 下一班可用航班', 'rebook a flight 改订航班', 'a connecting flight 中转航班', 'checked baggage 托运行李', 'written confirmation 书面确认'],
    core: [
      ['My flight has been cancelled. What are my options?', '我的航班取消了，我有哪些选择？', '旅客', '先询问可用方案，再比较改签或其他处理，不预设航空公司必定提供某一种补偿。'],
      ['Could you put me on the next available flight?', '能帮我安排下一班可用航班吗？', '旅客'],
      ['Is there a flight to the same destination today?', '今天还有去同一目的地的航班吗？', '旅客'],
      ['Would I need to change airports?', '我需要换机场吗？', '旅客'],
      ['What will happen to my checked baggage?', '我的托运行李会怎么处理？', '旅客'],
      ['Do I need to collect it and check it in again?', '我需要取出行李再重新托运吗？', '旅客'],
      ['Could you confirm the new departure time and airport?', '能确认新起飞时间和机场吗？', '旅客'],
      ['Will I still be able to make my connection?', '我还能赶上中转航班吗？', '旅客', 'make my connection 指赶上衔接航班；是否可赶上应请工作人员结合行程核实。'],
      ['Both flights are on the same booking.', '两段航班在同一份预订里。', '旅客'],
      ['Are any meal or hotel arrangements available?', '有可提供的餐饮或住宿安排吗？', '旅客'],
      ['Where should I go to arrange that?', '我应该去哪里办理？', '旅客'],
      ['Please send me written confirmation of the changes.', '请发给我这些变更的书面确认。', '旅客', '确认信息应包含航班、日期和机场；不要只凭口头的 tomorrow 推断具体日期。'],
    ],
    dialogues: [
      ['取消后选择替代航班', '比较时间，问清行李去向', [
        ['旅客', 'My flight has been cancelled. What are my options?', '我的航班取消了，我有哪些选择？'],
        ['工作人员', 'We have seats on a flight tomorrow morning from this airport.', '我们有明早从这个机场出发的航班座位。'],
        ['旅客', 'Is there a flight to the same destination today?', '今天还有去同一目的地的航班吗？'],
        ['工作人员', 'Not with available seats. I can explain the other options before you decide.', '有航班但没有空位，我可以在你决定前说明其他选择。'],
        ['旅客', 'Thank you. What will happen to my checked baggage?', '谢谢，我的托运行李会怎么处理？'],
        ['工作人员', 'Please collect it at baggage reclaim today and check it in again tomorrow.', '请今天到行李领取处取出，明天重新托运。'],
        ['旅客', 'I can take the morning flight. Please send me written confirmation of the changes.', '我可以乘明早那班，请发送变更的书面确认。'],
        ['工作人员', 'I will confirm the flight number, date and departure time in the message.', '我会在消息里确认航班号、日期和起飞时间。'],
      ]],
      ['延误影响中转', '提供完整行程，让服务台核实', [
        ['旅客', 'This delay may affect my connecting flight. Will I still be able to make my connection?', '这次延误可能影响中转，我还能赶上吗？'],
        ['工作人员', 'Are both flights on the same booking?', '两段航班在同一份预订里吗？'],
        ['旅客', 'Yes. Here is the booking reference and the onward flight number.', '是的，这是预订编号和后续航班号。'],
        ['工作人员', 'I will check the arrival estimate and the connection options.', '我会核查预计到达时间和中转方案。'],
        ['旅客', 'If I miss it, where should I go for help?', '如果错过中转，我应该去哪里求助？'],
        ['工作人员', 'Go to our transfer desk after arrival. I will add a note to your booking.', '到达后去我们的中转服务台，我会在预订里加备注。'],
      ]],
    ],
    branches: [
      ['需要过夜', '询问安排及办理地点', [
        ['旅客', 'The new flight is tomorrow. Are any meal or hotel arrangements available?', '新航班是明天，有餐饮或住宿安排吗？'],
        ['工作人员', 'I need to check what applies to this cancellation and your booking.', '我需要查这次取消和你的预订适用什么安排。'],
        ['旅客', 'Thank you. Where should I go to arrange that if it is available?', '谢谢，如果有，我应该去哪里办理？'],
        ['工作人员', 'Please wait at this desk while I check, and I will give you the details in writing.', '请在这里等我核查，我会把详情写给你。'],
      ]],
      ['替代航班在另一机场', '问清地面交通和时间再选择', [
        ['工作人员', 'There is also a flight this evening from West Airport.', 'West Airport 今晚也有一班航班。'],
        ['旅客', 'Would I need to arrange transport myself, and how much time would I have?', '我需要自行安排交通吗，还有多少时间？'],
        ['工作人员', 'Let me confirm the transport arrangements and check-in deadline.', '让我确认交通安排和办理值机的截止时间。'],
        ['旅客', 'Please confirm those details before changing my booking.', '请先确认这些细节，再改我的预订。'],
      ]],
    ],
    practice: {
      substitutions: ['把 tomorrow morning 换成 this evening，比较替代航班。', '把 checked baggage 换成 a checked stroller，核对托运婴儿车。', '把 the same booking 换成 separate bookings，如实说明分开预订。'],
      responses: [['We have a flight tomorrow.', '问今天是否还有空位。', 'Is there a flight to the same destination today with available seats?'], ['Your baggage needs to be collected.', '核对是否要重新托运。', 'Do I need to check it in again for the new flight?'], ['The flight leaves from another airport.', '先核对交通和截止时间。', 'Could you confirm the transport arrangements and check-in deadline before I decide?']],
      task: '报告航班取消或中转风险，比较两个替代方案，问清机场、行李和住宿处理，最后核对书面行程。费用和权益以工作人员核实为准。',
    },
  }),
  T08: defineLesson('T08', {
    scenario: '入境时如实说明十天度假行程、住宿和返程安排；另一段练习是携带包装食品，不确定是否需要申报时向海关询问并展示标签。对话中的行程是虚构示例，实际回答应符合本人证件和事实。',
    phrases: ['the purpose of a visit 访问目的', 'a return flight 返程航班', 'a booking confirmation 预订确认', 'declare an item 申报物品', 'packaged food 包装食品', 'check the label 核对标签'],
    core: [
      ['I am here on holiday for ten days.', '我来度假，停留十天。', '旅客', 'on holiday 常见于英式，美式可说 on vacation；按真实目的回答，不背一套与事实不符的行程。'],
      ['What is the purpose of your visit?', '你此次访问的目的是什么？', '入境工作人员'],
      ['I will be staying at River Hotel.', '我会住在 River Hotel。', '旅客'],
      ['Here is my accommodation booking.', '这是我的住宿预订。', '旅客'],
      ['My return flight is on November fifteenth.', '我的返程航班是十一月十五日。', '旅客'],
      ['Would you like to see the return booking?', '你需要看返程预订吗？', '旅客'],
      ['Could you repeat the question more slowly?', '能把问题慢一点再说一次吗？', '旅客'],
      ['Do you mean the city I am staying in or my home city?', '你指的是我要住的城市，还是我的居住城市？', '旅客'],
      ['I have some packaged food in my bag.', '我的包里有一些包装食品。', '旅客'],
      ['I am not sure whether I need to declare it.', '我不确定是否需要申报。', '旅客', 'declare 是向海关申报；包装完好不代表一定允许带入或无需申报。'],
      ['Could you tell me where to have it checked?', '能告诉我应该去哪里检查吗？', '旅客'],
      ['Here is the label showing the ingredients.', '这是标有配料的标签。', '旅客', '展示标签帮助核查；是否可带入由当地规定和工作人员判断。'],
    ],
    dialogues: [
      ['说明访问和住宿安排', '回答具体问题，提供对应记录', [
        ['入境工作人员', 'What is the purpose of your visit?', '你此次访问的目的是什么？'],
        ['旅客', 'I am here on holiday for ten days.', '我来度假，停留十天。'],
        ['入境工作人员', 'Where will you be staying?', '你会住在哪里？'],
        ['旅客', 'I will be staying at River Hotel. Here is my accommodation booking.', '我会住在 River Hotel，这是住宿预订。'],
        ['入境工作人员', 'When are you planning to leave?', '你计划什么时候离开？'],
        ['旅客', 'My return flight is on November fifteenth. Would you like to see the return booking?', '返程航班是十一月十五日，你需要看返程预订吗？'],
        ['入境工作人员', 'Yes, please. Thank you for having it ready.', '需要，谢谢你提前准备好。'],
        ['旅客', 'Of course. Here it is.', '当然，给你。'],
      ]],
      ['不确定食品是否需要申报', '主动说明物品，请工作人员核查', [
        ['旅客', 'I have some packaged food in my bag. I am not sure whether I need to declare it.', '包里有一些包装食品，我不确定是否需要申报。'],
        ['海关工作人员', 'What kind of food is it?', '是什么食品？'],
        ['旅客', 'Packaged biscuits. Here is the label showing the ingredients.', '包装饼干，这是配料标签。'],
        ['海关工作人员', 'Please bring the package to the inspection desk so we can check it.', '请把包装带到检查台，我们核查一下。'],
        ['旅客', 'Could you tell me where that desk is?', '能告诉我检查台在哪里吗？'],
        ['海关工作人员', 'Just to your right. Keep the package closed until the officer asks you to open it.', '就在右侧，工作人员让你打开之前请保持包装关闭。'],
      ]],
    ],
    branches: [
      ['没听懂问题的指向', '澄清再回答，避免猜测', [
        ['入境工作人员', 'Which city do you live in?', '你住在哪个城市？'],
        ['旅客', 'Do you mean the city I am staying in here or my home city?', '你指这里我要住的城市，还是我的居住城市？'],
        ['入境工作人员', 'Your home city, please.', '请告诉我你的居住城市。'],
        ['旅客', 'I live in Shanghai.', '我住在上海。'],
      ]],
      ['朋友处住宿', '如实说明，出示真实可核实安排', [
        ['入境工作人员', 'Do you have a hotel booking?', '你有酒店预订吗？'],
        ['旅客', 'No. I will be staying with a friend for this visit.', '没有，这次我会住在朋友家。'],
        ['入境工作人员', 'Do you have the address and your friend’s contact details?', '你有地址和朋友的联系方式吗？'],
        ['旅客', 'Yes. I have the details ready to show you.', '有，我准备好了，可以给你看。'],
      ]],
    ],
    practice: {
      substitutions: ['把 ten days 换成 two weeks，按实际行程说明停留时长。', '把 on holiday 换成 for a business meeting，仅在真实目的相符时使用。', '把 packaged biscuits 换成 packaged tea，说明不同物品。'],
      responses: [['Where will you be staying?', '说明酒店并提供预订。', 'I will be staying at River Hotel. Here is my accommodation booking.'], ['What kind of food is it?', '说明食品并提供配料标签。', 'Packaged biscuits. Here is the label showing the ingredients.'], ['Which city do you live in?', '没听懂时先核对问题指向。', 'Do you mean my home city or the city I am staying in here?']],
      task: '根据一份虚构行程练习目的、时长、住宿和返程问答；对不确定的携带物品主动询问申报，不编造访问目的、证件或证明材料。',
    },
  }),
  T09: defineLesson('T09', {
    scenario: '在虚构的 River Park 北入口看见有人倒下，向当地急救接线员说明位置和可观察情况。另一段练习是建筑有烟，从安全地点报告。实际求助使用当地适用的紧急号码，医疗处置听从接线员指示。',
    phrases: ['an ambulance 救护车', 'the north entrance 北入口', 'a nearby landmark 附近地标', 'respond to someone 对人作出反应', 'stay on the line 保持通话', 'a safe location 安全位置'],
    core: [
      ['We need an ambulance at the north entrance of River Park.', '我们需要救护车，位置在 River Park 北入口。', '求助者', '先说需求和准确地点；同名地点较多时补充城市、路口或地标。'],
      ['Someone has collapsed.', '有人倒下了。', '求助者'],
      ['They are not responding when I speak to them.', '我和对方说话时，对方没有反应。', '求助者'],
      ['I am not sure whether they are breathing normally.', '我不确定对方是否正常呼吸。', '求助者', '不确定时直说，不凭猜测判断；按接线员提示观察和报告。'],
      ['The entrance is next to the public library on Oak Street.', '入口在 Oak Street 的公共图书馆旁边。', '求助者'],
      ['I can see smoke coming from the building.', '我能看到建筑里冒出烟。', '求助者'],
      ['I am outside in a safe location.', '我在外面一个安全的位置。', '求助者'],
      ['I do not know whether anyone is still inside.', '我不知道是否还有人在里面。', '求助者'],
      ['Could you explain the next step slowly?', '能慢一点解释下一步吗？', '求助者'],
      ['Let me repeat that to check I understood.', '我复述一下，确认自己听懂了。', '求助者'],
      ['Please stay on the line.', '请保持通话。', '接线员', 'stay on the line 指不要挂断；等待期间继续听接线员指示。'],
      ['I will follow your instructions.', '我会按你的指示做。', '求助者'],
    ],
    dialogues: [
      ['报告有人倒下', '说清位置和实际观察到的情况', [
        ['接线员', 'Emergency services. What is your location?', '紧急服务，请问你的位置？'],
        ['求助者', 'We need an ambulance at the north entrance of River Park.', '我们需要救护车，在 River Park 北入口。'],
        ['接线员', 'What has happened?', '发生了什么？'],
        ['求助者', 'Someone has collapsed. They are not responding when I speak to them.', '有人倒下了，我说话时对方没有反应。'],
        ['接线员', 'Are they breathing normally?', '对方正常呼吸吗？'],
        ['求助者', 'I am not sure. Could you tell me how to check?', '我不确定，能告诉我怎么观察确认吗？'],
        ['接线员', 'Please stay on the line. I will guide you and confirm the location.', '请保持通话，我会引导你并确认位置。'],
        ['求助者', 'The entrance is next to the public library on Oak Street. I will follow your instructions.', '入口在 Oak Street 公共图书馆旁边，我会按你的指示做。'],
      ]],
      ['从安全地点报告烟情', '区分观察与未知情况', [
        ['接线员', 'Tell me your location and what you can see.', '请告诉我位置和看到的情况。'],
        ['求助者', 'I am on Oak Street, opposite the public library. I can see smoke coming from the building beside it.', '我在 Oak Street 图书馆对面，看到它旁边的建筑冒烟。'],
        ['接线员', 'Are you inside that building?', '你在那栋建筑里吗？'],
        ['求助者', 'No. I am outside in a safe location. I do not know whether anyone is still inside.', '没有，我在外面安全的位置，不知道里面是否还有人。'],
        ['接线员', 'Stay outside and away from the building. Please stay on the line.', '留在外面，远离建筑，请保持通话。'],
        ['求助者', 'Let me repeat that to check I understood. Stay outside and away from the building.', '我复述确认一下，留在外面，远离建筑。'],
      ]],
    ],
    branches: [
      ['不知道准确门牌', '提供可识别地标并继续核对', [
        ['接线员', 'Do you know the street number?', '你知道门牌号码吗？'],
        ['求助者', 'No. I am at the north entrance of River Park, beside the public library.', '不知道，我在 River Park 北入口，公共图书馆旁边。'],
        ['接线员', 'Can you see a street sign or another landmark?', '能看到路牌或其他地标吗？'],
        ['求助者', 'The sign says Oak Street. There is a blue bus shelter next to me.', '路牌写着 Oak Street，我旁边有一个蓝色公交候车亭。'],
      ]],
      ['紧张时没听懂指示', '请求逐步解释并复述', [
        ['接线员', 'I will give you the next instruction. Tell me when you are ready.', '我会给你下一步指示，准备好后告诉我。'],
        ['求助者', 'I am ready, but I am nervous. Could you explain the next step slowly?', '准备好了，但我很紧张，能慢一点解释吗？'],
        ['接线员', 'Of course. We will take it one step at a time.', '当然，我们一步一步来。'],
        ['求助者', 'Thank you. I will repeat each step to check I understood.', '谢谢，我会复述每一步，确认听懂。'],
      ]],
    ],
    practice: {
      substitutions: ['把 the north entrance 换成 the main entrance，报告不同入口。', '把 the public library 换成 the train station，说明附近地标。', '把 I can see smoke 换成 I can smell smoke，如实区分看到和闻到。'],
      responses: [['Are they breathing normally?', '不确定时直接说明并请对方引导。', 'I am not sure. Could you tell me how to check?'], ['Do you know the street number?', '不知道门牌，提供地标和路名。', 'No, but I am beside the public library on Oak Street.'], ['Tell me when you are ready.', '说明紧张，请逐步解释。', 'I am ready, but I am nervous. Could you explain the next step slowly?']],
      task: '模拟求助电话：先说地点和事件，再回答观察问题；不知道的内容明确说不知道。练习慢速复述接线员指示，不把语言材料当作急救操作教程。',
    },
  }),
};
