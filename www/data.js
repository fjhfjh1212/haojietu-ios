/* 好截图2 v4.4.5 — data: home navigation, constants, seed data.
   Home nav is extracted verbatim from module 1771 (_Index).
   Seed data mirrors module 1806 (first-launch seed) and the SConfig
   defaults in module 525. All values persist in localStorage under the
   original AsyncStorage keys (see app.js store). */

var HOME_NAV = [
 {
  "section": "新功能",
  "items": [
   {
    "text": "微信自动对话",
    "badge": "新",
    "icon": "icon-wechat",
    "page": "WechatChatUsersPage"
   },
   {
    "text": "自动对话教程",
    "badge": "教程",
    "icon": "icon-wechat",
    "link": "https://www.vjietu.com/help/detail/name/wechat_auto_chat.html?hideUserBar=1",
    "linkTitle": "微信对话生成器自动对话回复教程"
   }
  ]
 },
 {
  "section": "更换App图标",
  "items": [
   {
    "text": "生成微信和支付宝图标",
    "badge": "新",
    "icon": "icon-alipay-wechat",
    "link": "https://www.vjietu.com/help/detail/name/make_icons.html?token={token}&pid={pid}",
    "linkTitle": "生成微信和支付宝图标"
   },
   {
    "text": "App图标设置",
    "badge": "新",
    "action": "appIcon"
   }
  ]
 },
 {
  "section": "微信",
  "items": [
   {
    "text": null,
    "action": "toggleViewMode"
   },
   {
    "text": "微信主页",
    "icon": "icon-wechat-home",
    "page": "WechatHomePage"
   },
   {
    "text": "微信(单聊)",
    "icon": "icon-wechat",
    "page": "WechatChatUsersPage"
   },
   {
    "text": "微信(群聊)",
    "icon": "icon-wechat",
    "page": "WechatChatGroupUsersPage"
   },
   {
    "text": "微信转账",
    "icon": "icon-wechat-c2c",
    "page": "WechatToTransferPage"
   },
   {
    "text": "微信钱包",
    "badge": "旧版",
    "icon": "icon-wechat-wallet",
    "page": "WalletPage"
   },
   {
    "text": "微信钱包",
    "badge": "新版",
    "icon": "icon-wechat-wallet",
    "page": "WalletNewPage"
   },
   {
    "text": "新的朋友",
    "icon": "icon-wechat-fd",
    "page": "FriendsPage"
   },
   {
    "text": "微信红包",
    "icon": "icon-wechat-redpacket",
    "page": "RedpacketPage"
   },
   {
    "text": "零钱",
    "icon": "icon-poket-money",
    "page": "WechatPoketMoneyPage"
   },
   {
    "text": "零钱明细",
    "badge": "旧版",
    "icon": "icon-money-detail",
    "page": "WechatMoneyDetailPage"
   },
   {
    "text": "零钱明细",
    "badge": "新版",
    "icon": "icon-money-detail",
    "page": "WechatWalletTransPage"
   },
   {
    "text": "零钱提现",
    "icon": "icon-wechat-money-out",
    "page": "WechatMoneyOutPage"
   },
   {
    "text": "朋友圈",
    "icon": "icon-wechat-timeline",
    "page": "WechatTimelinePage"
   },
   {
    "text": "账单",
    "icon": "icon-wechat-wallet-trans",
    "page": "WechatWalletTransPage"
   },
   {
    "text": "微信支付",
    "icon": "icon-wechat",
    "page": "WechatChatPayPage"
   },
   {
    "text": "微粒贷",
    "icon": "icon-wechat-wallet-li",
    "page": "WechatWalletLi"
   },
   {
    "text": "收款助手",
    "icon": "icon-wechat-shoukuan",
    "page": "WechatChatShoukuanPage"
   },
   {
    "text": "月统计",
    "icon": "icon-wechat-wallet-trans-sum",
    "page": "WechatWalletTransSumPage"
   },
   {
    "text": "年账单",
    "badge": "火热",
    "icon": "icon-wechat-wallet-trans-sum",
    "page": "WechatWalletTransSumPage"
   },
   {
    "text": "群发助手",
    "icon": "icon-wechat-groupsend",
    "page": "WechatChatGroupSendPage"
   },
   {
    "text": "微信个人信息",
    "icon": "icon-wechat-meinfo",
    "page": "WechatMeInfoPage"
   },
   {
    "text": "转账助手",
    "icon": "icon-wechat-assistant",
    "page": "WechatTransferPage"
   },
   {
    "text": "我的朋友圈",
    "icon": "icon-wechat-timeline",
    "page": "WechatTimelineUserPage"
   }
  ]
 },
 {
  "section": "支付宝",
  "items": [
   {
    "text": "支付宝聊天",
    "icon": "icon-alipay-chat",
    "page": "AlipayChatUsersPage"
   },
   {
    "text": "支付宝我的",
    "badge": "旧版",
    "icon": "icon-alipay-home",
    "page": "AlipayHomePage"
   },
   {
    "text": "支付宝我的",
    "badge": "新版",
    "icon": "icon-alipay-home",
    "page": "AlipayHomePage"
   },
   {
    "text": "支付宝朋友",
    "icon": "icon-alipay-friends",
    "page": "AlipayHomePage"
   },
   {
    "text": "支付宝通讯录",
    "icon": "icon-alipay-contact",
    "page": "AlipayContactPage"
   },
   {
    "text": "支付宝转账",
    "icon": "icon-alipay-new",
    "page": "AlipayTransferPage"
   },
   {
    "text": "支付宝余额",
    "icon": "icon-alipay-balance",
    "page": "AlipayBalancePage"
   },
   {
    "text": "支付宝余额",
    "badge": "新版",
    "icon": "icon-alipay-balance",
    "page": "AlipayBalanceNewPage"
   },
   {
    "text": "支付宝提现",
    "icon": "icon-alipay-moneyout",
    "page": "AlipayMoneyoutPage"
   },
   {
    "text": "个人信息",
    "icon": "icon-alipay-meinfo",
    "page": "AlipayAccountPage"
   },
   {
    "text": "转到银行卡",
    "icon": "icon-alipay-tocard",
    "page": "AlipayTocardPage"
   },
   {
    "text": "支付宝账单",
    "badge": "旧版",
    "icon": "icon-alipay-bill",
    "page": "AlipayBillPage"
   },
   {
    "text": "支付宝账单",
    "badge": "新版",
    "icon": "icon-alipay-bill",
    "page": "AlipayNewBillPage"
   },
   {
    "text": "余额明细",
    "badge": "新版",
    "icon": "icon-alipay-bill",
    "page": "AlipayBalanceDetailPage"
   },
   {
    "text": "支付宝年账单",
    "badge": "2020",
    "icon": "icon-alipay-bill-2019",
    "page": "AlipaySum2020"
   }
  ]
 },
 {
  "section": "淘宝",
  "items": [
   {
    "text": "淘宝订单详情",
    "icon": "icon-alipay-taobao",
    "page": "TaobaoItemPage"
   }
  ]
 },
 {
  "section": "微信通话",
  "items": [
   {
    "text": "语音通话",
    "icon": "icon-wechat-call-in",
    "page": "WechatVideoVoiceInPage"
   },
   {
    "text": "语音通话中",
    "icon": "icon-wechat-calling",
    "page": "WechatVideoVoicePage"
   }
  ]
 },
 {
  "section": "恶搞语音",
  "items": [
   {
    "text": "支付宝收款到账",
    "icon": "icon-alipay-money-sound",
    "page": "AlipaySoundPage"
   }
  ]
 },
 {
  "section": "永久会员特权",
  "items": [
   {
    "text": "数据备份与恢复",
    "badge": "新",
    "icon": "icon-app-backup",
    "page": "BackupPage"
   },
   {
    "text": "使用教程",
    "icon": "icon-tutorial",
    "link": "/help?hideUserBar=1&hideWater=1&token={token}&pid={pid}&v=2",
    "linkTitle": "使用教程"
   },
   {
    "text": "在线客服",
    "icon": "icon-service",
    "link": "/help/service?hideUserBar=1&token={token}&pid={pid}",
    "linkTitle": "在线客服"
   },
   {
    "text": "去水印",
    "icon": "icon-water",
    "page": "WatermarkPage"
   },
   {
    "text": "手机型号设置",
    "icon": "icon-sys-phone",
    "page": "PhoneBarPage"
   },
   {
    "text": "生成微信和支付宝图标",
    "icon": "icon-alipay-wechat",
    "link": "https://www.vjietu.com/help/detail/name/make_icons.html?token={token}&pid={pid}",
    "linkTitle": "生成微信和支付宝图标"
   },
   {
    "text": "App图标设置",
    "action": "appIcon"
   }
  ]
 }
];

/* 18 phone models (SConfig.phoneModels, modules 525/1271/1826).
   Index 0 is the device itself ("system"); the picker shows it with the
   tip "(无需设置状态栏，使用本机系统状态栏)". Default index is 0. */
var PHONE_MODELS = [
  { key: 'system', label: '本机系统状态栏', tip: '(无需设置状态栏，使用本机系统状态栏)' },
  { key: 'android', label: '自定义Android', width: 1080, height: 2340, pr: 3, type: 'android', doubleSIM: true },
  { key: 'mate40', label: '自定义华为Mate40', width: 1080, height: 2376, pr: 3, type: 'android', doubleSIM: true, emui: true },
  { key: 'mate40pro', label: '自定义华为Mate40 Pro/P40 Pro', width: 1200, height: 2640, pr: 3.33, type: 'android', doubleSIM: true, emui: true },
  { key: 'nova8', label: '自定义华为nova 8', width: 1080, height: 2340, pr: 3, type: 'android', doubleSIM: true, emui: true },
  { key: 'mi10', label: '自定义小米10', width: 1080, height: 2340, pr: 3, type: 'android', doubleSIM: true, miui: true },
  { key: 'mi11', label: '自定义小米11', width: 1440, height: 3200, pr: 4, type: 'android', doubleSIM: true, miui: true },
  { key: 'iPhone5', label: '自定义iPhone5/5s/5c/SE', width: 640, height: 1136, pr: 2, type: 'ios' },
  { key: 'iPhone6', label: '自定义iPhone6/7/8', width: 750, height: 1334, pr: 2, type: 'ios' },
  { key: 'iPhone6p', label: '自定义iPhone6p/7p/8p', width: 1242, height: 2208, pr: 3, type: 'ios' },
  { key: 'iPhoneX', label: '自定义iPhoneX/Xs', width: 1125, height: 2436, pr: 3, type: 'ios', isX: true },
  { key: 'iPhoneXR', label: '自定义iPhoneXR', width: 828, height: 1792, pr: 2, type: 'ios', isX: true, doubleSIM: true },
  { key: 'iPhoneXMax', label: '自定义iPhoneXs Max', width: 1242, height: 2688, pr: 3, type: 'ios', isX: true, doubleSIM: true },
  { key: 'iPhone11', label: '自定义iPhone 11', width: 828, height: 1792, pr: 2, type: 'ios', isX: true, doubleSIM: true },
  { key: 'iPhone11Pro', label: '自定义iPhone 11 Pro', width: 1125, height: 2436, pr: 3, type: 'ios', isX: true, doubleSIM: true },
  { key: 'iPhone11ProMax', label: '自定义iPhone 11/12 Pro Max', width: 1242, height: 2688, pr: 3, type: 'ios', isX: true, doubleSIM: true },
  { key: 'iPhone12', label: '自定义iPhone 12/12 Pro', width: 1170, height: 2532, pr: 3, type: 'ios', isX: true, doubleSIM: true },
  { key: 'iPhone12Mini', label: '自定义iPhone 12 Mini', width: 1080, height: 2340, pr: 3, type: 'ios', isX: true }
];

/* Default status-bar config (SConfig.phoneBarConfig, module 525). */
var PHONE_BAR_DEFAULTS = {
  power: 79, cellular1: '中国移动', cellular2: '中国联通',
  doubleCellular: true, time: '2018-10-24 17:38:37', time24: true,
  network: 0, showBluetooth: true, showPowerPersent: true,
  showMute: true, showWifi: true, showRotate: true, showAlarm: true
};

/* 17 banks, exact seed names/images (module 1806 bank table).
   `code` is the resolved imagesMap asset (module 1587: bank_1 -> BANK_ABC
   ... bank_17 -> BANK_CITIC); the original maps 农村信用社 to BANK_YDRCB. */
var BANKS = [
  { name: '中国农业银行', image: 'bank_1', code: 'BANK_ABC' }, { name: '中国银行', image: 'bank_2', code: 'BANK_BOC' },
  { name: '中国建设银行', image: 'bank_3', code: 'BANK_CCB' }, { name: '招商银行', image: 'bank_4', code: 'BANK_CMB' },
  { name: '民生银行', image: 'bank_5', code: 'BANK_CMBC' }, { name: '交通银行', image: 'bank_6', code: 'BANK_COMM' },
  { name: '华夏银行', image: 'bank_7', code: 'BANK_HXBANK' }, { name: '中国工商银行', image: 'bank_8', code: 'BANK_ICBC' },
  { name: '邮政储蓄', image: 'bank_9', code: 'BANK_PSBC' }, { name: '浦发银行', image: 'bank_10', code: 'BANK_SPDB' },
  { name: '农村信用社', image: 'bank_11', code: 'BANK_YDRCB' }, { name: '兴业银行', image: 'bank_12', code: 'BANK_CIB' },
  { name: '光大银行', image: 'bank_13', code: 'BANK_CEB' }, { name: '广发银行', image: 'bank_14', code: 'BANK_GDB' },
  { name: '平安银行', image: 'bank_15', code: 'BANK_SPABANK' }, { name: '深圳农村商业银行', image: 'bank_16', code: 'BANK_SZRCB' },
  { name: '中信银行', image: 'bank_17', code: 'BANK_CITIC' }
];

/* Member levels (Setting page). */
var MEMBER_LEVELS = ['非会员', '大众会员', '黄金会员', '铂金会员', '钻石会员'];

/* WeChat emoji (Expression_1..N) and Alipay emoji, resolved from the
   bundled asset map at runtime. */
function emojiList(kind) {
  /* ASSET_MAP keys are "location/name"; emoji live under
     /assets/app/images/emoji (WeChat) and /assets/app/images/alipay_emoji. */
  var out = [];
  var prefix = kind === 'alipay'
    ? '/assets/app/images/alipay_emoji/'
    : '/assets/app/images/emoji/';
  Object.keys(ASSET_MAP).forEach(function (k) {
    if (k.indexOf(prefix) === 0) out.push(ASSET_MAP[k]);
  });
  out.sort();
  return out;
}
function roleAvatar(index) {
  /* Role avatars: app_images_role_10000.jpg .. 10260.jpg */
  var n = 10000 + (index % 261);
  return 'img/app_images_role_' + n + '.jpg';
}
function defaultAvatar() { return 'img/app_images_defaultface.png'; }

/* First-launch seed (module 1806 INSERTs, verbatim).
   me_info1 = me (马克_SHI). Dialog 1611838095720's row is not in the seed,
   only its 3 content rows — the other party is 林猪浪 (SConfig.wechatDialog
   default, module 1246: title '微截图', users 马克_SHI + 林猪浪). */
var SEED = {
  me: { id: 'me_info1', nickname: '马克_SHI', name: 'Mars', image: 'roleface', wechat: 'qq456', alipay: '1100000@qq.com', alipayLevel: 1, remark: '快加我' },
  roles: [
    { id: 1, nickname: '马克_SHI', name: '微截图', image: 5, wechat: 'qq123', alipay: '100100@qq.com', alipayLevel: 1, remark: '快加我' },
    { id: 2, nickname: '马克_SHI2', name: '张龙', image: 6, wechat: 'qq456', alipay: '1000000@qq.com', alipayLevel: 1, remark: '是我' }
  ],
  dialogs: [
    {
      id: 1611839364825, name: 'Mars', avatar: 2, unread: 5, time: '2021-01-28 21:15:35',
      preview: '点击右下角+按钮，可以发送图片、视频等更多功能',
      messages: [
        { isMe: false, type: 'notice', content: '2021-01-28 21:11:58', isTime: true },
        { isMe: false, type: 'text', content: '你好微截图' },
        { isMe: false, type: 'text', content: '这个怎么用呢？' },
        { isMe: true, type: 'text', content: '你好，点右上角3点那里，可以设置背景图、对话排序等' },
        { isMe: false, type: 'text', content: '怎么切换用户发消息呢' },
        { isMe: true, type: 'text', content: '点击顶部对方名字，或者摇一摇手机，就可以切换用户' },
        { isMe: true, type: 'text', content: '点击右下角+按钮，可以发送图片、视频等更多功能' }
      ]
    },
    {
      id: 1611838095720, name: '林猪浪', avatar: 3, unread: 0, time: '2021-01-28 20:48:21',
      preview: 'kjkl',
      messages: [
        { isMe: true, type: 'notice', content: '2021-01-28 20:48:21', isTime: true },
        { isMe: true, type: 'text', content: 'kk' },
        { isMe: false, type: 'text', content: 'kjkl' }
      ]
    }
  ],
  walletTrans: [
    { title: '微信支付', subTitle: '扫二维码付款-给潘文龙', money: '125', pay_type: 1, status: '支付成功', to_from: '潘文龙', time1: '2021-01-06 23:38:43' },
    { title: '微信支付', subTitle: '二维码收款-来自*爹', money: '66', pay_type: 0, status: '已收钱', to_from: '木村呀咩爹', time1: '2021-01-23 09:43:57' },
    { title: '美团/大众点评', subTitle: '提现-美团/大众点评', money: '40', pay_type: 0, status: '已存入零钱', to_from: '火影土豆', time1: '2021-01-23 21:47:03' },
    { title: '微信红包', subTitle: '微信红包', money: '173', pay_type: 1, status: '支付成功', to_from: '雪初猫猫', time1: '2020-12-31 08:58:08' },
    { title: '微信支付', subTitle: '转账-来自焚尸熊猫', money: '34', pay_type: 0, status: '已存入零钱', to_from: '焚尸熊猫', time1: '2021-01-27 01:45:45' },
    { title: '微信支付', subTitle: '转给王斌-农村信用社(3305)', money: '5935.93', pay_type: 1, status: '到账成功', to_from: '日后再算', time1: '2021-01-14 00:58:30' },
    { title: '美团/大众点评', subTitle: '美团/大众点评', money: '67', pay_type: 1, status: '支付成功', to_from: '就是爱你', time1: '2021-01-17 22:56:32' },
    { title: '微信支付', subTitle: '转给张筱涵-广发银行(7773)', money: '3431.43', pay_type: 1, status: '到账成功', to_from: '转瞬成空', time1: '2021-01-27 22:48:50' },
    { title: '微信支付', subTitle: '转给王锡铭-浦发银行(6254)', money: '5118.11', pay_type: 1, status: '到账成功', to_from: '陈淼', time1: '2021-01-15 10:40:56' },
    { title: '微信红包', subTitle: '微信红包-来自吖106338', money: '146', pay_type: 0, status: '已存入零钱', to_from: '吖106338', time1: '2021-01-08 12:37:54' }
  ],
  alipayBill: [
    { title: '转账-马克_SHI', money: '200', pay_type: 1, cat: '其他', to_from: '马克_SHI', status: '交易成功', time1: '2018-04-18 12:45:19' },
    { title: '收到普通红包', money: '200', pay_type: 0, cat: '人情往来', to_from: '马克_SHI', status: '交易成功', time1: '2018-08-07 16:45:19' }
  ],
  timeline: [
    { user: '马克_SHI', avatar: 0, datetime: '2021-01-28 21:33:10', text: '点右上角相机按钮可以添加朋友圈内容', location: '', likes: [], comments: [] }
  ],
  alipay: { meMoney: '88.88', meMayiScore: '1个积分待领取', friendsLifeWord: '发现美好生活', dialog: { name: '马克_SHI', preview: '你在哪里呀！', time: '2017-12-13 12:10' } },
  wallet: { balance: '0.00', bank: '交通银行' }
};

/* Nine-grid masks (module 3152 _newIndex, exact source labels). */
var NINE_MASKS = [
  { name: '九宫格', file: null },
  { name: '心型九宫格', file: 'app_images_maskheart.png' },
  { name: '圆型九宫格', file: 'app_images_maskyuan.png' },
  { name: '花型九宫格', file: 'app_images_maskfollow.png' },
  { name: '四叶草九宫格', file: 'app_images_maskcao.png' },
  { name: '云朵九宫格', file: 'app_images_maskyun.png' },
  { name: '雪花九宫格', file: 'app_images_maskxuehua.png' },
  { name: '五角星九宫格', file: 'app_images_maskstar.png' }
];

/* Chat message types the original supports (wechat_dialog_content). */
var CHAT_TYPES = ['notice', 'text', 'image', 'emoji', 'link', 'file',
  'namecard', 'group_in', 'groupsend', 'moneyout', 'redpacket',
  'transfer', 'voice', 'video'];
