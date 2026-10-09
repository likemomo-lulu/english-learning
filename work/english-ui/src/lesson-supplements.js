// Supplements reserve E onward; A-D remain attached to the original saved sentences.
// Section rows contain stable suffix, title, setting and role/English/Chinese/optional note.
export const lessonSupplements = {
  D01: {
    phrases: ['decaf 低咖啡因咖啡', 'an extra shot 多加一份浓缩', 'tapioca pearls 木薯珍珠', 'less ice 少冰'],
    dialogues: [
      ['E', '咖啡调整咖啡因和浓度', '两杯分别下单：一杯低因，一杯加浓缩', [
        ['顾客', 'Could I get two small lattes to go, please?', '请给我两杯小杯拿铁，带走。'],
        ['店员', 'Sure. Any changes to the standard drinks?', '好的，要调整通常的配方吗？'],
        ['顾客', 'Could you make mine decaf?', '我的那杯能做成低因的吗？', 'decaf 是 decaffeinated 的简称，表示去除大部分咖啡因，不保证完全不含咖啡因。'],
        ['店员', 'Of course. What about the second one?', '当然，第二杯呢？'],
        ['顾客', 'Could you add an extra shot to that one?', '那杯能多加一份浓缩咖啡吗？', 'a shot 在这里是一份 espresso；加浓缩不等于加糖浆。'],
        ['店员', 'Yes. The extra shot costs one dollar. Is that okay?', '可以，加一份浓缩要一美元，可以吗？'],
        ['顾客', 'Yes, thanks. Both with regular milk, please.', '可以，谢谢，两杯都用普通牛奶。'],
        ['店员', 'One decaf latte and one latte with an extra shot. Coming right up.', '一杯低因拿铁，一杯多加一份浓缩，马上做。'],
      ]],
      ['F', '珍珠奶茶调整冰量和加料', '问清珍珠是否已包含，避免重复加料', [
        ['顾客', 'Could I get a medium bubble tea with less ice, please?', '请给我一杯中杯珍珠奶茶，少冰。', 'bubble tea 常指带珍珠或其他配料的茶饮；milk tea 是奶茶，两者范围并不完全相同。'],
        ['店员', 'Sure. Would you like the usual amount of sugar?', '好的，糖量要正常的吗？'],
        ['顾客', 'Half the usual amount, please. Does it come with tapioca pearls?', '请减到正常糖量的一半。它本来就有木薯珍珠吗？'],
        ['店员', 'Yes. Extra pearls are fifty cents.', '有，多加珍珠是五十美分。'],
        ['顾客', 'The usual amount is fine. Could you seal the cup for takeaway?', '正常珍珠量就好。能把杯口封好带走吗？'],
        ['店员', 'Of course. We use a sealing film on top.', '当然，我们会在杯口加封口膜。', 'sealing film 指杯口封口膜；lid 指杯盖，两者不是同一个部件。'],
      ]],
    ],
  },
  D03: {
    phrases: ['loyalty points 会员积分', 'a bag charge 袋子费用', 'an expiry date 到期日期'],
    dialogues: [
      ['E', '结账时问积分和袋子费用', '积分已绑定会员，确认支付方式和额外费用', [
        ['店员', 'Do you have a loyalty card?', '你有会员卡吗？'],
        ['顾客', 'Yes, here it is. Can I use my points towards this purchase?', '有，在这里。我能用积分抵扣这次购物吗？', 'loyalty points 是会员积分；是否可抵扣及抵扣范围要看商店规则。'],
        ['店员', 'You can use two dollars in points on these items.', '这些商品可以抵扣两美元的积分。'],
        ['顾客', 'Thanks. Is there a charge for a bag?', '谢谢，袋子收费吗？'],
        ['店员', 'Yes, ten cents. You can pay the remaining amount by card.', '是的，十美分。剩余金额可以刷卡支付。'],
        ['顾客', 'I will use my own bag, thanks. I would like to pay by card.', '谢谢，我用自己的袋子。我想刷卡支付。'],
      ]],
    ],
    branches: [
      ['F', '包装上的日期看不清', '请店员核对标签，不凭日期独自判断食品状况', [
        ['顾客', 'I cannot read the date on this carton. Could you check it for me?', '我看不清这盒上的日期，能帮我核对吗？'],
        ['店员', 'It says Use by Friday.', '上面写的是周五前食用。'],
        ['顾客', 'Is there one with a later use-by date?', '有标注食用期限更晚一点的吗？', 'use-by 与 best-before 标签含义不同；expiry date 常见于英式表达，expiration date 常见于美式，具体以商品标签为准。'],
        ['店员', 'Let me check the other cartons for you.', '我帮你看看其他盒的标签。'],
      ]],
    ],
  },
  D07: {
    phrases: ['dice the carrots 胡萝卜切丁', 'shred the cabbage 卷心菜切丝', 'blanch the broccoli 西兰花焯水', 'drain in a colander 用漏勺沥水', 'marinate the chicken 腌鸡肉'],
    dialogues: [
      ['E', '为另一顿饭准备食材', '本段另练炒蔬菜配鸡肉的备菜，不改变原番茄炒蛋任务', [
        ['我', 'What should I do with the carrots and mushrooms?', '胡萝卜和蘑菇要怎么处理？'],
        ['朋友', 'Dice the carrots and slice the mushrooms, please.', '请把胡萝卜切丁，蘑菇切片。', 'dice 是切成小块或丁；slice 是切片；shred 常指切或撕成细条。'],
        ['我', 'And the cabbage? Should I shred it?', '卷心菜呢？要切丝吗？'],
        ['朋友', 'Yes. I will blanch the broccoli while you do that.', '对，你做这些的时候，我来给西兰花焯水。', 'blanch 指短时间放入热水或沸水中处理；这里练动作词，不规定所有食材的处理时长。'],
        ['我', 'Should I drain the broccoli in the colander afterwards?', '西兰花焯好后，要放在漏勺里沥水吗？'],
        ['朋友', 'Yes, please. The colander is beside the sink.', '要的，谢谢，漏勺就在水槽旁边。'],
        ['我', 'What about the chicken?', '鸡肉呢？'],
        ['朋友', 'It is marinating in the fridge. We will cook it later.', '正在冰箱里腌着，我们晚点做。', 'marinate 是动词“腌制”；marinade 是名词“腌料”。不要套用一律名词前重音、动词后重音的规则。'],
      ]],
    ],
  },
  D11: {
    phrases: ['a parcel locker 快递柜', 'a pickup code 取件码', 'a collection point 取件点'],
    dialogues: [
      ['E', '请朋友代取快递柜包裹', '把位置和取件步骤说清楚', [
        ['我', 'Could you pick up my parcel on your way home?', '你回家路上能帮我取一下包裹吗？'],
        ['朋友', 'Sure. Is it at the collection point?', '可以，是在取件点吗？'],
        ['我', 'No, it is in the parcel locker beside our building entrance.', '不是，在我们楼门口旁的快递柜里。'],
        ['朋友', 'Do I need a pickup code?', '需要取件码吗？'],
        ['我', 'Yes. I will text you the pickup code. Enter it on the screen.', '需要，我把取件码发给你，在屏幕上输入。', 'pickup code 是这次取件使用的验证码；不要把它与账户登录密码混用。'],
        ['朋友', 'Got it. I will message you once I have collected it.', '明白，取好后我会给你发消息。'],
      ]],
    ],
    branches: [
      ['F', '改到有营业时间的取件点', '核对地点、关门时间和所需凭证', [
        ['顾客', 'The message says my parcel is at your collection point. What time do you close?', '消息说包裹在你们取件点，你们几点关门？'],
        ['工作人员', 'At seven this evening. Please bring the pickup code and photo ID.', '今晚七点，请带取件码和带照片的身份证件。'],
        ['顾客', 'Is that the shop next to the station?', '是车站旁边那家店吗？'],
        ['工作人员', 'Yes. The full address is in your collection message.', '是的，完整地址在你的取件消息里。'],
      ]],
    ],
  },
  D12: {
    phrases: ['a faulty cable 有故障的线', 'at one angle 在某个角度', 'battery saver 省电模式'],
    branches: [
      ['E', '充电线时好时坏', '说出具体表现，借另一根线试一下', [
        ['我', 'My charging cable only works at one angle.', '我的充电线只有在某个角度才管用。', 'at one angle 描述具体故障表现；不需要把所有设备故障都说成 broken。'],
        ['朋友', 'Do you want to try a different cable?', '要不要试试另一根线？'],
        ['我', 'Yes, please. May I borrow your USB-C cable for a minute?', '好，谢谢。我能借你的 USB-C 线用一下吗？'],
        ['朋友', 'Sure. Here you go.', '可以，给你。'],
        ['我', 'It is charging now. I will get this cable checked.', '现在在充电了，我会把这根线拿去检查。'],
      ]],
      ['F', '暂时没有充电器', '先借充电宝，再问省电设置', [
        ['我', 'I forgot my charger. Do you have a power bank I could borrow?', '我忘带充电器了，你有充电宝能借我吗？'],
        ['朋友', 'Yes. You could also turn on battery saver.', '有，你也可以打开省电模式。', 'battery saver / low power mode 是常见叫法，具体菜单名称取决于手机系统。'],
        ['我', 'Thanks. Where can I find that setting?', '谢谢，那个设置在哪里？'],
        ['朋友', 'Try the battery section in Settings. The name may be different on your phone.', '看看设置里的电池选项，你的手机上名称可能不一样。'],
      ]],
    ],
  },
  D13: {
    phrases: ['miss my stop 坐过站', 'the last train 末班车', 'the other side of the platform 站台另一侧'],
    branches: [
      ['E', '坐过了换乘站', '本段设定在 Central 后一站，核对回程方向', [
        ['乘客', 'I missed my stop. I needed to get off at Central.', '我坐过站了，本来应该在 Central 下车。', 'miss my stop 是没在应下车的站下车；与 miss the train 没赶上车不同。'],
        ['工作人员', 'You are one stop past it. Take a train back towards Central.', '你过了一站，坐开往 Central 方向的列车回去。'],
        ['乘客', 'Is that on the other side of this platform?', '是在这个站台的另一侧吗？'],
        ['工作人员', 'Yes. Check that the display says Central before you board.', '是的，上车前确认显示屏写着 Central。'],
        ['乘客', 'Then I change to the blue line for the airport?', '然后换蓝线去机场，对吗？'],
        ['工作人员', 'That is right. Follow the airport signs at Central.', '对，在 Central 跟着机场指示牌走。'],
      ]],
      ['F', '末班车已经开走', '先核对运行情况，再问夜间交通', [
        ['乘客', 'What time is the last train to Central?', '去 Central 的末班车是几点？'],
        ['工作人员', 'It left at eleven thirty. There are no more trains tonight.', '十一点半已经开走了，今晚没有列车了。'],
        ['乘客', 'Is there a night bus I can take instead?', '有夜班公交可以替代吗？'],
        ['工作人员', 'Let us check the night bus route and times on the information screen.', '我们在信息屏上查一下夜班公交的路线和时间。'],
      ]],
    ],
  },
  T01: {
    phrases: ['an aisle seat 过道座位', 'extra legroom 更多腿部空间', 'an additional charge 额外收费'],
    dialogues: [
      ['E', '换选座位并核对额外收费', '已有靠窗座位，这次问更宽敞的过道座位', [
        ['旅客', 'I have a window seat, but I would prefer an aisle seat.', '我现在是靠窗座位，但更想坐过道。'],
        ['地勤', 'Let me see what is available.', '我看看还有哪些座位。'],
        ['旅客', 'Are there any extra-legroom seats available?', '还有腿部空间更大的座位吗？', 'extra-legroom 修饰 seats；这类座位是否收费、是否有使用条件，需要航空公司确认。'],
        ['地勤', 'There is an aisle seat with extra legroom for thirty dollars more.', '有一个腿部空间更大的过道座位，要多付三十美元。'],
        ['旅客', 'Thanks. Could you explain any conditions before I decide?', '谢谢，我决定前能说明一下相关条件吗？'],
        ['地勤', 'Of course. I will check the seat details for your flight.', '当然，我会核对你这趟航班的座位详情。'],
      ]],
    ],
  },
  T02: {
    phrases: ['checked through 直挂目的地', 'collect and recheck 领取后重新交运', 'go through customs 通关'],
    dialogues: [
      ['E', '在中转服务台核实行李', '行李标签到最终目的地，本段行程仍需中途领取再交运', [
        ['旅客', 'Is my bag checked through to my final destination?', '我的行李是直挂最终目的地的吗？'],
        ['地勤', 'Let me check your bag receipt and booking.', '我核对一下你的行李凭条和预订。'],
        ['旅客', 'Here they are. Do I need to collect and recheck my bag during the connection?', '都在这里，中转时我需要领取再重新交运行李吗？', '行李标签写到最终目的地，也可能仍需为通关而中途领取再交运；具体步骤按本次行程核实。'],
        ['地勤', 'For this journey, yes. The tag is for your final destination, but you need to collect it here for customs.', '这段行程需要，标签是最终目的地，但你要在这里先领取行李通关。'],
        ['旅客', 'Where do I take it after customs?', '通关后我应该把它拿到哪里？'],
        ['地勤', 'To the connecting-baggage drop-off. Follow the signs, and keep your bag receipt.', '拿到中转行李交运处，跟着指示牌走，并保留行李凭条。'],
      ]],
    ],
  },
  T03: {
    phrases: ['a twin room 双床房', 'a double room 双人床房', 'a key card 房卡', 'an extra bed 加床', 'a wake-up call 叫醒电话'],
    dialogues: [
      ['E', '两人想要两张独立的床', '说明床型需求，先问差价再确认换房', [
        ['住客', 'Could I have a twin room instead of a double?', '我能把双人床房换成双床房吗？', 'twin room 通常有两张独立的床；double room 通常是一张供两人睡的床，仍需核实酒店的房型。'],
        ['前台', 'Would you like two separate beds?', '你想要两张独立的床，对吗？'],
        ['住客', 'Yes, please. Is there an extra charge?', '是的，请问有差价吗？'],
        ['前台', 'We have a twin room available at the same rate for your stay.', '你入住这段时间有一间双床房，房价相同。'],
        ['住客', 'Great. Please change the booking to that room.', '太好了，请把预订改为那种房间。'],
        ['前台', 'Certainly. Here is your updated confirmation.', '当然，这是更新后的确认单。'],
      ]],
    ],
    branches: [
      ['F', '房卡打不开门', '请前台核实并更新房卡', [
        ['住客', 'My key card is not working. I am in room three twelve.', '我的房卡刷不了，我住 312 房。'],
        ['前台', 'Sorry about that. May I confirm the name on the booking?', '很抱歉，我能确认一下预订姓名吗？'],
        ['住客', 'Alex Chen. Could you check the card for me?', 'Alex Chen，能帮我检查房卡吗？'],
        ['前台', 'Of course. I will verify the booking and update it.', '当然，我会核对预订后更新房卡。'],
      ]],
      ['G', '预约清晨叫醒', '确认具体时间和房间', [
        ['住客', 'Could I arrange a wake-up call for six tomorrow morning?', '能安排明天早上六点打电话叫醒我吗？'],
        ['前台', 'Certainly. Which room are you in?', '当然，你住哪个房间？'],
        ['住客', 'Room three twelve. Six in the morning, please.', '312 房，请在早上六点叫醒我。'],
        ['前台', 'Confirmed: six tomorrow morning for room three twelve.', '确认了，明天早上六点，312 房。'],
      ]],
      ['H', '问房间能否加床', '确认容纳人数和每晚费用', [
        ['住客', 'Could you put an extra bed in our room for one more adult?', '能在我们房间加一张床，再住一位成人吗？'],
        ['前台', 'Let me check the room capacity and availability first.', '我先核对房间可住人数和加床是否可用。'],
        ['住客', 'Thanks. Please let me know the nightly charge before I decide.', '谢谢，决定前请告诉我每晚的费用。'],
        ['前台', 'Of course. I will explain the options once I have checked.', '当然，核对后我会说明有哪些选择。'],
      ]],
    ],
  },
  T04: {
    phrases: ['a vegan option 纯素选择', 'a starter 前菜', 'a main course 主菜', 'a dessert 甜点', 'pay for what we ordered 按各自点的付钱'],
    dialogues: [
      ['E', '纯素点餐和饭后追加甜点', '前半点主菜，后半在用餐结束后追加甜点；坚果过敏及交叉接触对话保留在原小节', [
        ['顾客', 'Is there a vegan option for the main course?', '主菜有纯素选择吗？', 'vegan 通常不吃肉、蛋、奶等动物来源食物；vegetarian 常指不吃肉，但是否吃蛋奶因个人而异，具体需求要说清。'],
        ['服务员', 'There is a vegetable curry. Would you like me to confirm the ingredients with the kitchen?', '有蔬菜咖喱，要我和厨房确认配料吗？'],
        ['顾客', 'Yes, please. Could you check that it has no dairy or eggs?', '需要，谢谢，能确认不含乳制品和蛋吗？'],
        ['服务员', 'The kitchen has confirmed that it has neither. Would you like a starter as well?', '厨房确认都不含，还要前菜吗？'],
        ['顾客', 'Just the curry for now, thanks.', '先只要咖喱，谢谢。'],
        ['服务员', 'How was your meal? Would you like anything else?', '吃得怎么样？还需要什么吗？'],
        ['顾客', 'It was lovely. Could we see the dessert menu?', '很好吃，能给我们看看甜点菜单吗？'],
        ['服务员', 'Of course. I will point out the vegan options too.', '当然，我也会指出纯素选项。'],
      ]],
    ],
    branches: [
      ['F', '各自支付自己点的菜', '明确区别于平分总账单', [
        ['顾客', 'Could we pay separately for what we ordered?', '我们能各自付自己点的菜的钱吗？', 'split the bill 可以指分摊；split it equally 明确是平分，pay separately for what we ordered 明确各付各的。'],
        ['服务员', 'Yes. Which items were yours?', '可以，哪些是你点的？'],
        ['顾客', 'The curry and the still water. My friend had the pasta and the tea.', '咖喱和无气泡水是我的，我朋友点的是意面和茶。'],
        ['服务员', 'Got it. I will check the amounts before you pay.', '明白，我会在你们付款前核对金额。'],
      ]],
    ],
  },
  T05: {
    phrases: ['a metered fare 按表计费', 'a flat fare 固定车费', 'a toll 过路费', 'a waiting charge 等候费'],
    dialogues: [
      ['E', '上车前确认费用范围', '从车站去 River Hotel，核对计费方式、过路费和行李费', [
        ['乘客', 'Is it a metered fare or a flat fare to River Hotel?', '去 River Hotel 是按表计费还是固定车费？', 'metered fare 随计价器变化；flat fare 是约定固定费用，仍要核对覆盖的路线和附加项。'],
        ['司机', 'A flat fare of thirty dollars for that route.', '那条路线固定车费三十美元。'],
        ['乘客', 'Is the toll included?', '包含过路费吗？'],
        ['司机', 'Yes, the toll is included in the thirty dollars.', '包含，三十美元里已经含过路费。'],
        ['乘客', 'I have one suitcase. Is there a luggage charge?', '我有一个行李箱，有行李费吗？'],
        ['司机', 'No luggage charge for that bag.', '那个箱子不收行李费。'],
        ['乘客', 'Thanks. Please take me to the main entrance.', '谢谢，请送我到正门。'],
        ['司机', 'Of course. Please confirm the address before we leave.', '当然，出发前请确认一下地址。'],
      ]],
    ],
    branches: [
      ['F', '想让司机等几分钟', '请求前先问能否等候和费用', [
        ['乘客', 'Could you wait here for about five minutes?', '你能在这里等我大约五分钟吗？'],
        ['司机', 'I can wait in the designated area, but there is a waiting charge.', '我可以在指定区域等，但有等候费。'],
        ['乘客', 'How much would five minutes cost?', '等五分钟要多少钱？'],
        ['司机', 'Two dollars in addition to the agreed fare.', '在约定车费之外再加两美元。'],
        ['乘客', 'That is fine, thanks. Please wait in the designated area.', '可以，谢谢，请在指定区域等。'],
      ]],
    ],
  },
};
