/* 好截图2 v4.4.5 — page renderers.
All 43 pages from the pages index (module 1818) plus the tab roots,
nine-grid, phone-bar settings and the local stubs for server pages.
Loaded before app.js; window.HJT is only touched inside render calls. */
window.HJT_PAGES = (function () {
'use strict';

function H() { return window.HJT;}
function store() { return H().store;}
function nav() { return H().nav;}
function esc(s) { return H().esc(s);}

/* ---------- images ---------- */
function img(assetName) { return (typeof assetName === 'function'? null: (window.assetName(assetName) || ''));}
function imgFile(file) { return file? ('img/' + file): '';}
function avatarFor(role) {
if (!role) return imgFile('app_images_defaultface.png');
var v = (role.avatar !== undefined && role.avatar !== null) ? role.avatar : role.image;
if (typeof v === 'number') return roleAvatar(v);
if (typeof v === 'string' && v) {
if (v === 'roleface') return imgFile('app_images_face.jpg');
var mapped = img(v);
if (mapped) return mapped;
if (v.indexOf('/') >= 0 || v.indexOf('.') >= 0) return v;
}
return imgFile('app_images_defaultface.png');
}
function roleImageRef(n) {
/* role image_ref 5/6 -> role avatar files app_images_role_10005.jpg... */
return 'img/app_images_role_' + (10000 + n) + '.jpg';
}

/* ---------- local DB (AsyncStorage keys, localStorage-backed) ---------- */
var DB = {
dialogs: function () {
var d = store().getJSON('wechatDialog', null);
if (!d) { d = JSON.parse(JSON.stringify(SEED.dialogs)); store().setJSON('wechatDialog', d);}
return d;
},
saveDialogs: function (d) { store().setJSON('wechatDialog', d);},
dialog: function (id) {
var ds = this.dialogs();
for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(id)) return ds[i];
return null;
},
roles: function () {
var r = store().getJSON('role', null);
if (!r) { r = JSON.parse(JSON.stringify(SEED.roles)); store().setJSON('role', r);}
return r;
},
saveRoles: function (r) { store().setJSON('role', r);},
walletTrans: function () {
var t = store().getJSON('wechatWalletTrans', null);
if (!t) { t = JSON.parse(JSON.stringify(SEED.walletTrans)); store().setJSON('wechatWalletTrans', t);}
return t;
},
saveWalletTrans: function (t) { store().setJSON('wechatWalletTrans', t);},
friendRequests: function () {
var t = store().getJSON('wechatFriendRequests', null);
if (!t) { t = JSON.parse(JSON.stringify(SEED.friendRequests)); store().setJSON('wechatFriendRequests', t);}
return t;
},
saveFriendRequests: function (t) { store().setJSON('wechatFriendRequests', t);},
walletDetail: function () {
var t = store().getJSON('wechatWalletDetail', null);
if (!t) { t = JSON.parse(JSON.stringify(SEED.walletDetail)); store().setJSON('wechatWalletDetail', t);}
return t;
},
saveWalletDetail: function (t) { store().setJSON('wechatWalletDetail', t);},
alipayBill: function () {
var b = store().getJSON('alipayBill', null);
if (!b) { b = JSON.parse(JSON.stringify(SEED.alipayBill)); store().setJSON('alipayBill', b);}
return b;
},
saveAlipayBill: function (b) { store().setJSON('alipayBill', b);},
timeline: function () {
var t = store().getJSON('wechatTimeline', null);
if (!t) { t = JSON.parse(JSON.stringify(SEED.timeline)); store().setJSON('wechatTimeline', t);}
return t;
},
saveTimeline: function (t) { store().setJSON('wechatTimeline', t);},
me: function () {
var m = store().getJSON('wechat', null);
if (!m) { m = JSON.parse(JSON.stringify(SEED.me)); store().setJSON('wechat', m);}
return m;
},
saveMe: function (m) { store().setJSON('wechat', m);},
wallet: function () {
var w = store().getJSON('wechatWallet', null);
if (!w) { w = { balance: '0.00'}; store().setJSON('wechatWallet', w);}
return w;
},
saveWallet: function (w) { store().setJSON('wechatWallet', w);},
alipayBalance: function () {
var b = store().getJSON('alipayBalance', null);
if (!b) { b = { balance: '88.88'}; store().setJSON('alipayBalance', b);}
return b;
},
saveAlipayBalance: function (b) { store().setJSON('alipayBalance', b);},
phoneBar: function () {
var p = store().getJSON('phoneBarConfig', null);
if (!p) { p = JSON.parse(JSON.stringify(PHONE_BAR_DEFAULTS)); p.modelIndex = 0; store().setJSON('phoneBarConfig', p);}
return p;
},
savePhoneBar: function (p) { store().setJSON('phoneBarConfig', p);},
loggedIn: function () { return store().get('userLogin', '0') === '1';},
setLoggedIn: function (v) { store().set('userLogin', v? '1': '0');}
};

/* ---------- small builders ---------- */
function row(label, value, onClick, opts) {
opts = opts || {};
var r = document.createElement('div');
r.className = 'row';
if (opts.icon) { var im = document.createElement('img'); im.className = 'row-icon'; im.src = opts.icon; r.appendChild(im);}
var lab = document.createElement('div');
lab.className = 'row-label';
lab.textContent = label;
r.appendChild(lab);
if (value!== undefined && value!== null && value!== '') {
var v = document.createElement('div');
v.className = 'row-value';
v.textContent = value;
r.appendChild(v);
}
var ar = document.createElement('span');
ar.className = 'row-arrow';
ar.textContent = '›';
r.appendChild(ar);
if (onClick) r.addEventListener('click', onClick);
return r;
}
function gap() { var g = document.createElement('div'); g.className = 'section-gap'; return g;}
function listWrap(children) {
var w = document.createElement('div');
w.className = 'row-list';
children.forEach(function (c) { w.appendChild(c);});
return w;
}
function formRow(label, input) {
var r = document.createElement('div');
r.className = 'form-row';
var lab = document.createElement('div');
lab.className = 'form-label';
lab.textContent = label;
r.appendChild(lab);
r.appendChild(input);
return r;
}
function selectInput(options, value) {
var s = document.createElement('select');
s.className = 'form-input';
options.forEach(function (o) { var op = document.createElement('option'); op.value = o; op.textContent = o; if (o === value) op.selected = true; s.appendChild(op); });
return s;
}
function textInput(value, placeholder, right) {
var inp = document.createElement('input');
inp.className = 'form-input' + (right? ' right': '');
inp.type = 'text';
inp.value = value || '';
if (placeholder) inp.placeholder = placeholder;
return inp;
}
function stubPage(title, text, imgFileName) {
var w = document.createElement('div');
w.innerHTML = '<div class="stub">' +
(imgFileName? '<img src="img/' + imgFileName + '" alt="">': '') +
'<div class="stub-title">' + esc(title) + '</div>' +
'<div class="stub-text">' + text + '</div></div>';
return w.firstElementChild;
}
function saveButton(label, onClick) {
var b = document.createElement('button');
b.type = 'button';
b.className = 'btn-primary';
b.textContent = label;
b.addEventListener('click', onClick);
return b;
}

/* ---------- chat message rendering (module 2257) ---------- */
function renderMessage(msg, dialog, isGroup) {
var wrap = document.createElement('div');
if (msg.type === 'notice') {
var n = document.createElement('div');
n.className = 'chat-notice';
var s = document.createElement('span');
s.textContent = msg.content || '';
n.appendChild(s);
wrap.appendChild(n);
return wrap;
}
var rowEl = document.createElement('div');
rowEl.className = 'msg-row' + (msg.isMe? ' me': '');
var av = document.createElement('img');
av.className = 'msg-avatar';
av.src = msg.isMe ? avatarFor(DB.me()) : (isGroup && msg.senderAvatar != null ? roleAvatar(msg.senderAvatar) : avatarFor(dialog));
rowEl.appendChild(av);
var body = document.createElement('div');
body.className = 'msg-body';
if (isGroup &&!msg.isMe) {
var nm = document.createElement('div');
nm.className = 'msg-name';
nm.textContent = msg.senderName || dialog.name || '';
body.appendChild(nm);
}
var bub = document.createElement('div');
bub.className = 'msg-bubble';
if (msg.type === 'text') {
bub.className = 'msg-bubble msg-bubble-text';
bub.textContent = msg.content || '';
} else if (msg.type === 'image') {
var im = document.createElement('img');
im.className = 'msg-img';
im.src = msg.image || roleAvatar(10);
im.addEventListener('click', function () { H().viewImage(im.src);});
bub.appendChild(im);
} else if (msg.type === 'emoji') {
var em = document.createElement('img');
em.className = 'msg-emoji';
em.src = msg.image || img('Expression_1') || roleAvatar(10);
bub.appendChild(em);
} else if (msg.type === 'voice') {
var vc = document.createElement('div');
vc.className = 'msg-voice';
vc.style.width = (50 + Math.min(msg.second || 3, 60) * 3) + 'px';
vc.innerHTML = (msg.unreadVoice ? '<span style="width:8px;height:8px;border-radius:50%;background:#f00;flex:none"></span>' : '') +
  '<span>🔊</span><span class="voice-sec">' + esc(msg.second || 3) + '&quot;</span>';
bub.appendChild(vc);
if (msg.transText) {
var tr = document.createElement('div');
tr.style.cssText = 'font-size:12px;color:#888;margin-top:4px';
tr.textContent = msg.transText;
bub.appendChild(tr);
}
} else if (msg.type === 'video') {
bub.innerHTML = '<div class="msg-file"><span class="file-ic">▶</span><span>' + esc(msg.second? ('视频 ' + msg.second): '视频') + '</span></div>';
} else if (msg.type === 'link') {
bub.className = 'msg-link';
bub.innerHTML = '<div class="lk-main"><div><div class="lk-title">' + esc(msg.linkTitle || msg.title || '链接') + '</div>' +
'<div class="lk-desc">' + esc(msg.linkDesc || '') + '</div></div>' +
'<img class="lk-thumb" src="' + esc(msg.linkImage || img('icon-wechat') || '') + '"></div>' +
'<div class="lk-sub">' + esc(msg.showApp || '微信') + '</div>';
} else if (msg.type === 'file') {
bub.innerHTML = '<div class="msg-file"><span class="file-ic">📄</span><span>' + esc(msg.fileName || '文件') + ' · ' + esc(msg.fileSize || '') + '</span></div>';
} else if (msg.type === 'namecard') {
bub.innerHTML = '<div class="msg-file"><img class="msg-avatar" src="' + esc(msg.image || roleAvatar(20)) + '"><span>' + esc(msg.title || msg.content || '名片') + '<br><span style="color:#999;font-size:12px">微信号：' + esc(msg.wechat || '') + '</span></span></div>';
} else if (msg.type === 'redpacket') {
bub.className = 'msg-redpacket' + (msg.isGet ? ' received' : '');
bub.innerHTML = '<div class="rp-top"><span class="rp-ic">🧧</span><span class="rp-text">' + esc(msg.redpacketText || '恭喜发财，大吉大利') + '</span></div>' +
'<div class="rp-sub">' + (msg.isGet? '已领取': '微信红包') + '</div>';
} else if (msg.type === 'transfer') {
bub.className = 'msg-transfer' + (msg.isGet ? ' received' : '');
bub.innerHTML = '<div class="tf-top"><span class="tf-ic">¥</span><span><div class="tf-amt">¥' + esc(msg.money || '0.00') + '</div><div style="font-size:12px;color:#faecda">' + esc(msg.transferText || '转账') + '</div></span></div>' +
'<div class="tf-sub">' + (msg.isGet? '已收款': (msg.isBack? '已退还': '微信转账')) + '</div>';
} else if (msg.type === 'moneyout') {
bub.innerHTML = '<div class="msg-file"><span class="file-ic">💰</span><span>' + esc(msg.content || '微信支付收款到账通知') + '</span></div>';
} else if (msg.type === 'groupsend') {
bub.textContent = msg.content || '群发消息';
} else if (msg.type === 'videoChat') {
bub.innerHTML = '<div class="msg-file"><span class="file-ic">📞</span><span>' + esc(msg.content || '语音通话') + ' ' + esc(msg.second? msg.second + '秒': '') + '</span></div>';
} else if (msg.type === 'assistant') {
bub.textContent = msg.content || '';
} else {
bub.textContent = msg.content || msg.text || '';
}
body.appendChild(bub);
if (msg.isError && !msg.hideErrorMsg) {
var err = document.createElement('span');
err.style.cssText = 'color:#f00;font-size:16px;align-self:center';
err.textContent = '⚠';
body.appendChild(err);
}
rowEl.appendChild(body);
wrap.appendChild(rowEl);
return wrap;
}

/* Long-press menu (module 2257 _onDialogPress). */
function messageMenu(msg, dialog, rerender) {
var items = [];
if (msg.isMe) items.push({ label: msg.isError? '取消被删除': '被删除', fn: function () { msg.isError =!msg.isError; msg.hideErrorMsg = false; rerender();}});
if (msg.isMe) items.push({ label: '被拉黑', fn: function () { msg.isError = true; msg.hideErrorMsg = true; rerender();}});
items.push({ label: '编辑', fn: function () { editMessageDialog(msg, rerender);}});
if (['text', 'image', 'video', 'voice'].indexOf(msg.type) >= 0) {
items.push({ label: '撤回', fn: function () {
H().showAlert('提示', '您确认要撤回？');
var ok = H().$('alert-ok');
ok.onclick = function () {
H().$('alert-overlay').hidden = true;
msg.type = 'notice';
msg.content = (msg.isMe? '你撤回了一条消息': (dialog.name || '') + '撤回了一条消息');
rerender();
};
}});
}
if (msg.type === 'transfer' &&!msg.isGet &&!msg.isBack) {
items.push({ label: '收款', fn: function () { msg.isGet = true; rerender(); H().toast('已收款');}});
}
if (msg.type === 'voice') items.push({ label: msg.showTrans? '隐藏转文字': '转文字', fn: function () { msg.showTrans =!msg.showTrans; if (msg.showTrans &&!msg.transText) { H().toast('暂无转文字内容'); msg.showTrans = false; } rerender();}});
if (msg.type === 'text' || msg.type === 'notice') items.push({ label: '复制内容', fn: function () { if (navigator.clipboard) navigator.clipboard.writeText(msg.content || ''); H().toast('复制成功');}});
items.push({ label: '删除', fn: function () {
H().showAlert('提示', '您确认要删除？');
var ok = H().$('alert-ok');
ok.onclick = function () {
H().$('alert-overlay').hidden = true;
var ds = DB.dialogs();
var d = DB.dialog(msg._dialogId);
if (d) { d.messages = d.messages.filter(function (m) { return m!== msg;}); DB.saveDialogs(ds);}
rerender();
};
}});
H().showPicker('消息操作', items.map(function (i) { return i.label;}), -1, function (label, i) { items[i].fn();});
}

function editMessageDialog(msg, rerender) {
var fields = [{ label: '内容', key: 'content', value: msg.content || ''}];
if (msg.type === 'transfer' || msg.type === 'redpacket') fields.push({ label: '金额', key: 'money', value: msg.money || ''});
if (msg.type === 'voice') fields.push({ label: '秒数', key: 'second', value: String(msg.second || 3)});
H().openDialog('编辑', fields, function (vals) {
msg.content = vals.content;
if (vals.money!== undefined) msg.money = vals.money;
if (vals.second!== undefined) msg.second = parseInt(vals.second, 10) || 3;
rerender();
});
}

/* ---------- chat page factory (WechatChatPage / Group / AlipayChat) ---------- */
/* More-panel icons: FontAwesome glyphs from the bundled font (same set the
   tab bar uses); 红包 has no FA equivalent, so it uses the emoji. */
var MORE_ITEMS = [
  { label: '照片', icon: '\uf03e' }, { label: '拍摄', icon: '\uf030' },
  { label: '语音通话', icon: '\uf095' }, { label: '视频通话', icon: '\uf03d' },
  { label: '位置', icon: '\uf041' }, { label: '红包', icon: '🧧', emoji: true },
  { label: '转账', icon: '\uf0d6' }, { label: '语音输入', icon: '\uf130' },
  { label: '收藏', icon: '\uf005' }, { label: '群工具', icon: '\uf0c0' },
  { label: '添加系统消息', icon: '\uf129' }, { label: '添加时间', icon: '\uf017' },
  { label: '切换用户', icon: '\uf0ec' }, { label: '链接', icon: '\uf0c1' },
  { label: '文件', icon: '\uf016' }, { label: '个人名片', icon: '\uf007' },
  { label: '卡券', icon: '\uf145' }
];
/* Alipay more panel (mod 2978): 15 items, in this order */
var MORE_ITEMS_ALIPAY = [
  { label: '照片', icon: '\uf03e' }, { label: '拍摄', icon: '\uf030' },
  { label: '小视频', icon: '\uf03d' }, { label: '转账', icon: '\uf0d6' },
  { label: '红包', icon: '🧧', emoji: true }, { label: '添加时间', icon: '\uf017' },
  { label: '添加系统消息', icon: '\uf129' }, { label: '收款', icon: '\uf029' },
  { label: '位置', icon: '\uf041' }, { label: '个人名片', icon: '\uf007' },
  { label: '收藏', icon: '\uf005' }, { label: '卡券', icon: '\uf145' },
  { label: '流量钱包', icon: '\uf0ac' }, { label: '一字千金', icon: '\uf02d' },
  { label: '悄悄话', icon: '\uf075' }
];
function chatPage(opts) {
/* opts: {title, kind: 'wechat'|'alipay', isGroup, dialogId, autoDialog} */
var ctx = { dialog: null, saveAndRerender: null };
return {
title: opts.title,
navClass: opts.kind === 'wechat' ? 'wx' : (opts.kind === 'alipay' ? 'alipay' : ''),
right: { text: '…', onClick: function () {
  if (!ctx.dialog) return;
  var d = ctx.dialog;
  var items = [];
  (opts.assistantMenu || []).forEach(function (mi) {
    items.push({ title: mi.label, onPress: function () { assistantMenuAction(mi); } });
  });
  items.push({ title: '对话设置', onPress: function () {
    if (opts.kind === 'alipay') {
      /* Alipay 对话设置 (mod 2978) */
      H().openDialog('对话设置', [
        { label: '自动设置标题', key: 'autoTitle', value: d.autoTitle !== false, type: 'switch' },
        { label: '标题', key: 'title', value: d.title || d.name || '' },
        { label: '听筒模式', key: 'earphone', value: !!d.earphone, type: 'switch' },
        { label: '免打扰', key: 'nodisturb', value: !!d.nodisturb, type: 'switch' },
        { label: '使用当前聊天背景', key: 'useBg', value: !!d.useBg, type: 'switch' },
        { label: '当前聊天背景', key: 'bgColor', value: d.bgColor || '' },
        { label: '使用全局聊天背景', key: 'useGlobalBg', value: !!d.useGlobalBg, type: 'switch' },
        { label: '全局聊天背景', key: 'globalBg', value: d.globalBg || '' },
        { label: '显示添加好友', key: 'showAddFriend', value: d.showAddFriend !== false, type: 'switch' }
      ], function (vals) {
        d.autoTitle = !!vals.autoTitle; d.title = vals.title; d.earphone = !!vals.earphone;
        d.nodisturb = !!vals.nodisturb; d.useBg = !!vals.useBg; d.bgColor = vals.bgColor;
        d.useGlobalBg = !!vals.useGlobalBg; d.globalBg = vals.globalBg;
        d.showAddFriend = !!vals.showAddFriend;
        var ds = DB.dialogs();
        for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(d.id)) ds[i] = d;
        DB.saveDialogs(ds);
        if (ctx.saveAndRerender) ctx.saveAndRerender();
      });
      return;
    }
    H().openDialog('对话设置', [
      { label: '字体大小', key: 'fontSize', value: d.fontSize || '标准', type: 'select', options: ['标准', '大'] },
      { label: '免打扰', key: 'nodisturb', value: !!d.nodisturb, type: 'switch' },
      { label: '聊天背景', key: 'bgColor', value: d.bgColor || '', placeholder: '默认' }
    ], function (vals) {
      d.fontSize = vals.fontSize; d.nodisturb = !!vals.nodisturb; d.bgColor = vals.bgColor;
      var ds = DB.dialogs();
      for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(d.id)) ds[i] = d;
      DB.saveDialogs(ds);
      if (ctx.saveAndRerender) ctx.saveAndRerender();
    });
  } });
  items.push({ title: '清空对话内容', onPress: function () {
    H().showAlert('提示', '您确认要清空对话内容？');
    var ok = H().$('alert-ok');
    ok.onclick = function () { H().$('alert-overlay').hidden = true; d.messages = []; if (ctx.saveAndRerender) ctx.saveAndRerender(); };
  } });
  items.push({ title: opts.deleteText || '删除用户', onPress: function () {
    H().showAlert('提示', '您确认要删除该用户？');
    var ok = H().$('alert-ok');
    ok.onclick = function () {
      H().$('alert-overlay').hidden = true;
      var ds = DB.dialogs().filter(function (x) { return String(x.id) !== String(d.id); });
      DB.saveDialogs(ds);
      nav().back();
    };
  } });
  H().showActionSheet(items);
  function assistantMenuAction(mi) {
    if (mi.editMenu) {
      H().openDialog('编辑底部菜单', [
        { label: '菜单1', key: 'm1', value: '转账助手' },
        { label: '菜单2', key: 'm2', value: '查收转账' },
        { label: '菜单3', key: 'm3', value: '帮助' },
        { label: '是否多级菜单', key: 'multi', value: false, type: 'switch' }
      ], function () { H().toast('已保存'); });
      return;
    }
    var fields = (mi.fields || []).map(function (f) {
      return { label: f, key: f, value: mi.defaults && mi.defaults[f] != null ? String(mi.defaults[f]) : '' };
    });
    H().openDialog(mi.label, fields, function (vals) {
      var lines = [mi.label];
      (mi.fields || []).forEach(function (f) { if (vals[f] !== '') lines.push(f + '：' + vals[f]); });
      var ds = DB.dialogs();
      var dd = null;
      for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(d.id)) dd = ds[i];
      if (dd) {
        dd.messages = dd.messages || [];
        dd.messages.push({ isMe: false, type: 'assistant', content: lines.join('\n') });
        dd.preview = lines[0];
        dd.time = H().nowTime();
        DB.saveDialogs(ds);
        if (ctx.saveAndRerender) ctx.saveAndRerender();
      }
    });
  }
} },
render: function (params) {
var dialogId = (params && params.dialogId) || opts.dialogId;
if (opts.assistantName) {
  var ads = DB.dialogs();
  var ad = null;
  for (var ai = 0; ai < ads.length; ai++) if (ads[ai].name === opts.assistantName) ad = ads[ai];
  if (!ad) {
    ad = { id: 'assistant-' + opts.assistantName, name: opts.assistantName, avatar: 2, unread: 0, time: H().nowTime(), preview: opts.assistantSeed || '', messages: opts.assistantSeed ? [{ isMe: false, type: 'assistant', content: opts.assistantSeed }] : [] };
    ads.unshift(ad);
    DB.saveDialogs(ads);
  }
  dialogId = ad.id;
}
var dialog = DB.dialog(dialogId) || { id: dialogId, name: opts.title, messages: []};
dialog.messages = dialog.messages || [];
ctx.dialog = dialog;
var me = DB.me();
var sendingAsMe = true;
var root = document.createElement('div');
root.style.cssText = 'display:flex;flex-direction:column;height:100%';
var list = document.createElement('div');
list.className = 'scroll chat-list chat-bg' + (opts.kind === 'alipay' ? ' chat-bg-alipay' : '');
function rerender() {
list.innerHTML = '';
if (opts.kind === 'alipay' && !dialog.messages.length) {
  var fn = document.createElement('div');
  fn.className = 'chat-notice';
  fn.innerHTML = '<span>加为朋友才能聊天，发送验证加为朋友</span>';
  list.appendChild(fn);
}
dialog.messages.forEach(function (m) {
m._dialogId = dialog.id;
var node = renderMessage(m, dialog,!!opts.isGroup);
node.addEventListener('contextmenu', function (e) { e.preventDefault(); messageMenu(m, dialog, saveAndRerender);});
var timer = null;
node.addEventListener('touchstart', function () { timer = setTimeout(function () { messageMenu(m, dialog, saveAndRerender);}, 600);});
node.addEventListener('touchend', function () { clearTimeout(timer);});
node.addEventListener('click', function () {
if (m.type === 'image' && m.image) H().viewImage(m.image);
});
list.appendChild(node);
});
list.scrollTop = list.scrollHeight;
}
function saveAndRerender() {
var ds = DB.dialogs();
for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(dialog.id)) ds[i] = dialog;
DB.saveDialogs(ds);
rerender();
}
ctx.saveAndRerender = saveAndRerender;
if (dialog.bgColor) list.style.background = dialog.bgColor;
if (dialog.fontSize === '大') list.style.fontSize = '18px';
function addMsg(m) {
m.isMe = sendingAsMe;
dialog.messages.push(m);
dialog.preview = m.content || m.type;
dialog.time = H().nowTime();
saveAndRerender();
}
/* title tap: switch sending user (module 2257 _onTitlePress). */
var navTitle = null;
setTimeout(function () {
var screen = root.closest ? root.closest('.screen') : null;
navTitle = screen && screen.querySelector('.nav-title');
if (navTitle) {
navTitle.textContent = (opts.isGroup ? dialog.name + (dialog.groupCount ? '(' + dialog.groupCount + ')' : '') : dialog.name) || opts.title;
navTitle.style.cursor = 'pointer';
navTitle.addEventListener('click', function () {
if (opts.kind === 'alipay') {
  var users = DB.dialogs().map(function (x) { return x.name; });
  H().showPicker('切换用户', users, -1, function (label) {
    var d2 = DB.dialogs().filter(function (x) { return x.name === label; })[0];
    if (d2) nav().reset('AlipayChatPage', { dialogId: d2.id });
  });
  return;
}
sendingAsMe =!sendingAsMe;
H().toast('切换为发微信');
});
}
}, 0);
/* input bar */
var bar = document.createElement('div');
bar.className = 'chat-inputbar' + (opts.kind === 'alipay' ? ' chat-inputbar-alipay' : '');
var voiceBtn = document.createElement('button');
voiceBtn.type = 'button'; voiceBtn.className = 'chat-tool-btn'; voiceBtn.textContent = '🎙';
var input = document.createElement('input');
input.className = 'chat-input' + (opts.kind === 'alipay' ? ' chat-input-alipay' : '');
input.placeholder = '';
var emojiBtn = document.createElement('button');
emojiBtn.type = 'button'; emojiBtn.className = 'chat-tool-btn'; emojiBtn.textContent = '😊';
var plusBtn = document.createElement('button');
plusBtn.type = 'button'; plusBtn.className = 'chat-tool-btn'; plusBtn.textContent = '+';
var sendBtn = document.createElement('button');
sendBtn.type = 'button'; sendBtn.className = 'chat-send' + (opts.kind === 'alipay' ? ' chat-send-alipay' : ''); sendBtn.textContent = '发送';
sendBtn.addEventListener('click', function () {
var v = input.value.trim();
if (!v) return;
addMsg({ type: 'text', content: v});
input.value = '';
});
input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendBtn.click();});
bar.appendChild(voiceBtn); bar.appendChild(input); bar.appendChild(emojiBtn); bar.appendChild(plusBtn); bar.appendChild(sendBtn);
/* voice mode: hold-to-talk replaces the input (mod 2257 bottomBarVoiceText) */
var voiceMode = false;
var voiceHint = document.createElement('div');
voiceHint.className = 'chat-voice-hint';
voiceHint.textContent = '按住 说话';
voiceHint.style.display = 'none';
voiceHint.addEventListener('click', function () {
  H().openDialog('添加语音', [{ label: '语音时间(最大60秒)', key: 'second', value: '3', numeric: true}], function (vals) {
    var sec = Math.min(parseInt(vals.second, 10) || 3, 60);
    addMsg({ type: 'voice', second: sec });
    voiceMode = false; voiceHint.style.display = 'none'; input.style.display = '';
  });
});
bar.insertBefore(voiceHint, input.nextSibling);
voiceBtn.addEventListener('click', function () {
  voiceMode = !voiceMode;
  input.style.display = voiceMode ? 'none' : '';
  voiceHint.style.display = voiceMode ? '' : 'none';
  voiceBtn.textContent = voiceMode ? '⌨' : '🎙';
});
/* emoji panel */
emojiBtn.addEventListener('click', function () {
var list = emojiList(opts.kind === 'alipay'? 'alipay': 'wechat');
if (!list.length) { H().toast('暂无表情'); return;}
var box = document.createElement('div');
box.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;max-height:220px;overflow-y:auto';
list.slice(0, 60).forEach(function (src) {
var im = document.createElement('img');
im.src = src; im.style.cssText = (opts.kind === 'alipay' ? 'width:30px;height:30px;' : 'width:52px;height:52px;') + 'object-fit:contain';
im.addEventListener('click', function () {
addMsg({ type: 'emoji', image: src});
H().$('dlg-overlay').hidden = true;
});
box.appendChild(im);
});
var card = H().$('dlg-card');
card.innerHTML = '';
var t = document.createElement('div'); t.className = 'dlg-title'; t.textContent = '表情';
card.appendChild(t); card.appendChild(box);
var btns = document.createElement('div'); btns.className = 'dlg-btns';
var c = document.createElement('button'); c.type = 'button'; c.textContent = '取消';
c.addEventListener('click', function () { H().$('dlg-overlay').hidden = true;});
btns.appendChild(c); card.appendChild(btns);
H().$('dlg-overlay').hidden = false;
});
/* more panel */
var more = document.createElement('div');
more.className = 'chat-more-panel' + (opts.kind === 'alipay' ? ' chat-more-panel-alipay' : '');
more.hidden = true;
(opts.kind === 'alipay' ? MORE_ITEMS_ALIPAY : MORE_ITEMS.filter(function (it) { return it.label !== '群工具' || !!opts.isGroup; })).forEach(function (item) {
var cell = document.createElement('div');
cell.className = 'chat-more-cell';
var icHtml = item.emoji ? item.icon : '<span class="fa">' + item.icon + '</span>';
cell.innerHTML = '<div class="mc-ic">' + icHtml + '</div><span>' + esc(item.label) + '</span>';
cell.addEventListener('click', function () { moreAction(item.label);});
more.appendChild(cell);
});
plusBtn.addEventListener('click', function () { more.hidden =!more.hidden;});
function moreAction(label) {
more.hidden = true;
if (label === '照片') {
H().openDialog('添加图片', [{ label: '图片地址（留空使用示例图）', key: 'image', value: ''}], function (vals) {
addMsg({ type: 'image', image: vals.image || roleAvatar(15)});
});
} else if (label === '拍摄') {
H().openDialog('添加视频', [{ label: '视频封面', key: 'image', value: ''}, { label: '视频时间（如 0:09）', key: 'second', value: '0:09'}], function (vals) {
addMsg({ type: 'video', image: vals.image || roleAvatar(16), second: vals.second});
});
} else if (label === '红包') {
H().openDialog('添加红包', [{ label: '红包金额', key: 'money', value: '8.88', numeric: true}, { label: '红包祝福语', key: 'redpacketText', value: '恭喜发财，大吉大利'}], function (vals) {
addMsg({ type: 'redpacket', money: vals.money, redpacketText: vals.redpacketText});
});
} else if (label === '转账') {
H().openDialog('添加转账', [{ label: '转账金额', key: 'money', value: '100.00', numeric: true}, { label: '转账说明', key: 'transferText', value: '转账'}], function (vals) {
addMsg({ type: 'transfer', money: vals.money, transferText: vals.transferText});
});
} else if (label === '添加时间') {
H().openDialog('添加时间', [{ label: '时间', key: 'content', value: '2021-01-28 21:11:58'}], function (vals) {
addMsg({ type: 'notice', content: vals.content, isTime: true});
});
} else if (label === '添加系统消息') {
H().openDialog('添加系统消息', [{ label: '系统消息内容', key: 'content', value: '你已添加了' + dialog.name + '，现在可以开始聊天了。'}], function (vals) {
addMsg({ type: 'notice', content: vals.content});
});
} else if (label === '链接') {
H().openDialog('添加链接', [{ label: '链接地址', key: 'link', value: ''}, { label: '链接标题', key: 'linkTitle', value: ''}, { label: '链接描述', key: 'linkDesc', value: ''}], function (vals) {
addMsg({ type: 'link', linkTitle: vals.linkTitle || '链接', linkDesc: vals.linkDesc || '', link: vals.link});
});
} else if (label === '文件') {
H().openDialog('添加文件', [{ label: '文件名称', key: 'fileName', value: '文件.docx'}, { label: '文件大小', key: 'fileSize', value: '128KB'}], function (vals) {
addMsg({ type: 'file', fileName: vals.fileName, fileSize: vals.fileSize});
});
} else if (label === '个人名片') {
H().openDialog('添加个人名片', [{ label: '昵称', key: 'title', value: dialog.name}, { label: '微信号', key: 'wechat', value: ''}], function (vals) {
addMsg({ type: 'namecard', title: vals.title, wechat: vals.wechat});
});
} else if (label === '切换用户') {
sendingAsMe =!sendingAsMe;
H().toast('切换为发微信');
} else if (label === '小视频') {
H().openDialog('添加小视频', [{ label: '视频封面', key: 'image', value: ''}, { label: '视频时间（如 0:09）', key: 'second', value: '0:09'}], function (vals) {
addMsg({ type: 'video', image: vals.image || roleAvatar(16), second: vals.second});
});
} else if (label === '收款') {
H().openDialog('添加收款', [{ label: '收款金额', key: 'money', value: '100.00', numeric: true}, { label: '收款说明', key: 'transferText', value: '收款'}], function (vals) {
addMsg({ type: 'transfer', money: vals.money, transferText: vals.transferText});
});
} else if (label === '语音通话') {
nav().push('WechatVideoVoicePage', { name: dialog.name, avatar: dialog.avatar});
} else if (label === '视频通话') {
nav().push('WechatVideoVoiceInPage', { name: dialog.name, avatar: dialog.avatar});
} else if (label === '位置') {
addMsg({ type: 'text', content: '[位置]'});
} else if (label === '语音输入') {
H().openDialog('添加语音', [{ label: '语音时间(最大60秒)', key: 'second', value: '3', numeric: true}], function (vals) {
addMsg({ type: 'voice', second: Math.min(parseInt(vals.second, 10) || 3, 60) });
});
 } else if (label === '收藏' || label === '群工具' || label === '卡券' || label === '流量钱包' || label === '一字千金' || label === '悄悄话') {
H().toast(label + '（本地暂未实现）');
}
}
if (opts.kind === 'alipay') {
  var tools = document.createElement('div');
  tools.className = 'chat-toolsbar';
  [['发红包', function () {
    H().openDialog('添加红包', [{ label: '红包金额', key: 'money', value: '8.88', numeric: true}, { label: '红包祝福语', key: 'redpacketText', value: '恭喜发财，大吉大利'}], function (vals) {
      addMsg({ type: 'redpacket', money: vals.money, redpacketText: vals.redpacketText});
    });
  }], ['向TA转账', function () {
    H().openDialog('添加转账', [{ label: '转账金额', key: 'money', value: '100.00', numeric: true}, { label: '转账说明', key: 'transferText', value: '转账'}], function (vals) {
      addMsg({ type: 'transfer', money: vals.money, transferText: vals.transferText});
    });
  }]].forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'chat-toolsbar-btn'; b.textContent = t[0];
    b.addEventListener('click', t[1]);
    tools.appendChild(b);
  });
  root.appendChild(tools);
}
if (opts.kind === 'alipay') {
  var ubar = document.createElement('div');
  ubar.className = 'chat-userbar';
  var uav = document.createElement('img');
  uav.src = avatarFor(dialog);
  uav.style.cssText = 'width:36px;height:36px;border-radius:4px;object-fit:cover';
  var unm = document.createElement('span');
  unm.style.cssText = 'flex:1;font-size:16px;color:#333';
  unm.textContent = dialog.name || '';
  var ubtn = document.createElement('button');
  ubtn.type = 'button'; ubtn.className = 'chat-userbar-btn'; ubtn.textContent = '加为朋友';
  ubtn.addEventListener('click', function () { H().toast('已发送好友验证'); });
  ubar.appendChild(uav); ubar.appendChild(unm); ubar.appendChild(ubtn);
  root.appendChild(ubar);
}
root.appendChild(list);
root.appendChild(bar);
root.appendChild(more);
if (opts.bottomButton) {
  var bb = document.createElement('div');
  bb.style.cssText = 'flex:none;height:44px;background:#fff;display:flex;align-items:center;justify-content:center;border-top:1px solid #eee';
  var bbtn = document.createElement('button');
  bbtn.type = 'button';
  bbtn.style.cssText = 'font-size:16px;color:#22ac30';
  bbtn.textContent = opts.bottomButton.label;
  bbtn.addEventListener('click', opts.bottomButton.onClick);
  bb.appendChild(bbtn);
  root.appendChild(bb);
}
rerender();
return root;
}
};
}

  /* ---------- conversation list factory ---------- */
  function convListPage(opts) {
    /* opts: {title, chatPage, isGroup, addLabel, kind} (mods 2749/2750/3106) */
    return {
      title: opts.title,
      right: { text: opts.addLabel || '添加用户', onClick: function () { addConvUser(opts); } },
      render: function () {
        var wrap = document.createElement('div');
        var list = document.createElement('div');
        function render() {
          list.innerHTML = '';
          /* filter (mod 2749): only non-MP, non-group dialogs, exclude
             wechatTransAssistant; group page (mod 2750): only groups. */
          var rows = DB.dialogs().filter(function (d) {
            if (opts.isGroup) return !!d.isGroup;
            if (d.isMP || d.isGroup) return false;
            return String(d.id) !== 'wechatTransAssistant';
          }).sort(function (a, b) { return String(b.time || '').localeCompare(String(a.time || '')); });
          rows.forEach(function (d) {
            /* row (mod 2270 userItemView): h80, paddingHorizontal 15, bg #fff,
               bottom border #ccc; avatar 50x50 radius 2; name 16 #333;
               right arrow 7x11; name only. */
            var r = document.createElement('div');
            r.style.cssText = 'height:80px;padding:0 15px;background:#fff;border-bottom:1px solid #ccc;display:flex;align-items:center;gap:10px';
            var av = document.createElement('img');
            av.style.cssText = 'width:50px;height:50px;border-radius:2px;object-fit:cover;flex:none';
            av.src = avatarFor(d);
            var nm = document.createElement('div');
            nm.style.cssText = 'flex:1;font-size:16px;color:#333';
            nm.textContent = d.name;
            var ar = document.createElement('span');
            ar.style.cssText = 'color:#c8c8c8;font-size:16px';
            ar.textContent = '›';
            r.appendChild(av); r.appendChild(nm); r.appendChild(ar);
            r.addEventListener('click', function () {
              nav().push(opts.chatPage, { dialogId: d.id });
            });
            r.addEventListener('contextmenu', function (e) {
              e.preventDefault();
              H().showPicker('对话操作', ['删除用户', '清空对话内容'], -1, function (label) {
                if (label === '删除用户') {
                  if (DB.dialogs().length <= 1) { H().toast(opts.kind === 'alipay' ? '别删了！再删就没跟你聊天了！' : '别删了！再删就没人跟你聊天了！'); return; }
                  DB.saveDialogs(DB.dialogs().filter(function (x) { return x.id !== d.id; }));
                  render();
                } else {
                  d.messages = []; DB.saveDialogs(DB.dialogs()); render();
                }
              });
            });
            list.appendChild(r);
          });
          /* add row at the bottom (mod 2270 userAddView): h60, centred, 16 #333 */
          var add = document.createElement('div');
          add.style.cssText = 'height:60px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;color:#333;border-bottom:1px solid #ccc';
          add.textContent = opts.addLabel || '添加用户';
          add.addEventListener('click', function () { addConvUser(opts, render); });
          list.appendChild(add);
        }
        render();
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  /* Add-user form (mods 2749/2750/3106): 对话内容 / 免打扰 / 角标为红点 /
     角标数目(0) / 对话时间(now); random face+nickname+message, dialogCount 0-5. */
  function addConvUser(opts, rerender) {
    H().openDialog(opts.addLabel || '添加用户', [
      { label: '昵称', key: 'name', value: '' },
      { label: '对话内容', key: 'preview', value: '' },
      { label: '免打扰', key: 'nodisturb', value: false, type: 'switch' },
      { label: '角标为红点', key: 'redDot', value: false, type: 'switch' },
      { label: '角标数目', key: 'unread', value: '0' },
      { label: '对话时间', key: 'time', value: H().nowTime() }
    ], function (vals) {
      if (!vals.name) return;
      var ds = DB.dialogs();
      var roles = DB.roles();
      var r = roles[Math.floor(Math.random() * roles.length)] || { image: 4 };
      var d = {
        id: Date.now(), name: vals.name, avatar: r.image, unread: parseInt(vals.unread, 10) || 0,
        time: vals.time, preview: vals.preview || '', nodisturb: !!vals.nodisturb,
        isGroup: !!opts.isGroup, messages: []
      };
      if (vals.preview) d.messages.push({ isMe: false, type: 'text', content: vals.preview });
      ds.unshift(d);
      DB.saveDialogs(ds);
      if (rerender) rerender();
    });
  }

  /* ---------- home (_Index, module 1771) ----------
     Faithful to renderPage: 11 sections in order; the banner carousel and
     the 推广 section render nothing offline (server ads only, as in the
     original); the display-mode toggle is its own Nav.Items row at the top
     of the 微信 section (not a tool entry); the phone item shows the
     current model name; the App图标设置 icon is the current app icon (M). */
  function navCell(it, wide) {
    var cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'nav-item' + (wide ? ' wide' : '');
    var icon = document.createElement('img');
    var iconSrc = '';
    if (it.action === 'appIcon') {
      iconSrc = img(['icon-app-vjietu2', 'icon-app-wechat', 'icon-app-alipay'][H().currentIconIndex()]);
    } else if (it.action === 'toggleViewMode') {
      iconSrc = img(store().get('phoneViewMode', '0') === '1' ? 'icon-sys-view2' : 'icon-sys-view1');
    } else if (it.icon) {
      iconSrc = img(it.icon);
    }
    icon.src = iconSrc || 'img/app_images_defaultface.png';
    cell.appendChild(icon);
    var tx = document.createElement('span');
    tx.className = 'nav-text';
    if (it.action === 'toggleViewMode') {
      tx.textContent = '显示模式 - ' + (store().get('phoneViewMode', '0') === '1' ? '深色模式' : '浅色模式');
    } else if (it.action === 'phonePicker') {
      var cfg = DB.phoneBar();
      var m = PHONE_MODELS[cfg.modelIndex || 0];
      tx.textContent = m.label;
      if ((cfg.modelIndex || 0) === 0 && m.tip) {
        var tip = document.createElement('span');
        tip.style.cssText = 'color:#f00;font-size:12px';
        tip.textContent = ' ' + m.tip;
        tx.appendChild(tip);
      }
    } else {
      tx.textContent = it.text;
    }
    cell.appendChild(tx);
    if (it.badge) {
      var bd = document.createElement('span');
      bd.className = 'nav-badge';
      bd.textContent = it.badge;
      cell.appendChild(bd);
    }
    cell.addEventListener('click', function () { homeNavTap(it); });
    return cell;
  }
  function homePage() {
    return {
      title: '主页',
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.background = '#f8f8f8';
        HOME_NAV.forEach(function (sec) {
          var s = document.createElement('div');
          s.className = 'nav-section';
          var t = document.createElement('div');
          t.className = 'nav-sec-title';
          var bar = document.createElement('span');
          bar.className = 'nav-sec-bar';
          t.appendChild(bar);
          t.appendChild(document.createTextNode(sec.section));
          s.appendChild(t);
          var tools = sec.items;
          if (sec.section === '微信') {
            /* display-mode toggle: its own Nav.Items row, first in the section */
            var modeRow = document.createElement('div');
            modeRow.className = 'nav-items';
            modeRow.appendChild(navCell({ action: 'toggleViewMode' }, true));
            s.appendChild(modeRow);
            tools = sec.items.filter(function (it) { return !it.modeRow; });
          }
          var items = document.createElement('div');
          items.className = 'nav-items';
          tools.forEach(function (it) {
            items.appendChild(navCell(it, !!it.wide));
          });
          s.appendChild(items);
          wrap.appendChild(s);
        });
        return wrap;
      }
    };
  }
  function homeNavTap(it) {
    if (it.page) { nav().push(it.page, it.params || {}); return; }
    if (it.link) { nav().push('helpStub', { title: it.linkTitle || it.text, link: it.link }); return; }
    if (it.action === 'appIcon') { H().openIconPicker(); return; }
    if (it.action === 'toggleViewMode') { H().toggleViewMode(); return; }
    if (it.action === 'phonePicker') {
      var cfg = DB.phoneBar();
      var labels = PHONE_MODELS.map(function (m) { return m.label; });
      H().showPicker('选择手机型号', labels, cfg.modelIndex || 0, function (opt, i) {
        cfg.modelIndex = i;
        DB.savePhoneBar(cfg);
        nav().reset('home');
      });
      return;
    }
    if (it.action === 'tocardSheet') {
      H().showActionSheet([
        { title: '转账成功页面', onPress: function () { nav().push('AlipayTocardPage'); } },
        { title: '转账详情页面', onPress: function () { nav().push('AlipayTocardDetailPage'); } }
      ]);
      return;
    }
  }

  /* ---------- nine-grid home (_newIndex, module 3152) ---------- */
  function newIndexPage() {
    return {
      title: '主页',
      render: function () {
        var wrap = document.createElement('div');
        var secs = [
          { section: '截图工具', items: [
            { text: '微商截图', badge: '微商截图', page: 'WechatChatUsersPage' },
            { text: '网页截图', page: 'WebshotPage' },
            { text: '拼接截图', page: 'StitchPage' }
          ] },
          { section: '九宫格截图', items: NINE_MASKS.map(function (m, i) {
            return { text: m.name, mask: i, page: 'NineGridPage' };
          }) }
        ];
        secs.forEach(function (sec) {
          var s = document.createElement('div');
          s.className = 'nav-section';
          s.innerHTML = '<div class="nav-sec-title">' + esc(sec.section) + '</div>';
          var items = document.createElement('div');
          items.className = 'nav-items';
          sec.items.forEach(function (it) {
            var cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'nav-item';
            var icon = document.createElement('img');
            icon.src = it.mask !== undefined && NINE_MASKS[it.mask].file
              ? imgFile(NINE_MASKS[it.mask].file)
              : (img('icon-wechat') || 'img/app_images_defaultface.png');
            cell.appendChild(icon);
            var tx = document.createElement('span');
            tx.className = 'nav-text';
            tx.textContent = it.text;
            cell.appendChild(tx);
            if (it.badge) {
              var bd = document.createElement('span');
              bd.className = 'nav-badge';
              bd.textContent = 'HOT';
              cell.appendChild(bd);
            }
            cell.addEventListener('click', function () {
              if (it.mask !== undefined) nav().push('NineGridPage', { mask: it.mask });
              else nav().push(it.page);
            });
            items.appendChild(cell);
          });
          s.appendChild(items);
          wrap.appendChild(s);
        });
        return wrap;
      }
    };
  }

  /* ---------- 九宫格页 (module 3153) ---------- */
  function nineGridPage() {
    return {
      title: '九宫格',
      render: function (params) {
        var maskIdx = (params && params.mask !== undefined) ? params.mask : 0;
        var mask = NINE_MASKS[maskIdx] || NINE_MASKS[0];
        var wrap = document.createElement('div');
        var imgUrl = null;
        /* shotView 300x300 (mod 3154 shotView/shotImage/shotMask) */
        var shot = document.createElement('div');
        shot.style.cssText = 'width:300px;height:300px;margin:16px auto 0;background:#f7f7f7;position:relative;overflow:hidden;flex:none';
        var shotImg = document.createElement('img');
        shotImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:none';
        var shotMask = document.createElement('img');
        shotMask.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:1;display:none';
        if (mask.file) shotMask.src = imgFile(mask.file);
        shot.appendChild(shotImg); shot.appendChild(shotMask);
        wrap.appendChild(shot);
        /* squareView 315x315, squareImage 100x100 marginBottom 5 marginRight 5 */
        var grid = document.createElement('div');
        grid.style.cssText = 'width:315px;height:315px;margin:16px auto 0;display:flex;flex-wrap:wrap;flex:none';
        var cells = [];
        for (var i = 0; i < 9; i++) {
          var cell = document.createElement('div');
          cell.style.cssText = 'width:100px;height:100px;margin:0 5px 5px 0;background:#f7f7f7;overflow:hidden;position:relative';
          grid.appendChild(cell);
          cells.push(cell);
        }
        wrap.appendChild(grid);
        /* buttonView: row, paddingVertical 20; 选择图片 + 保存图片 side by side, 20px gap */
        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;flex-direction:row;padding:20px 0;gap:20px;justify-content:center';
        var pickBtn = document.createElement('button');
        pickBtn.type = 'button'; pickBtn.style.cssText = 'margin:0;width:150px;height:46px;background:#fff;border:1px solid #ccc;border-radius:6px;color:#333;font-size:16px';
        pickBtn.textContent = '选择图片';
        var saveBtn = document.createElement('button');
        saveBtn.type = 'button'; saveBtn.className = 'btn-primary'; saveBtn.style.cssText = 'margin:0;width:150px;height:46px';
        saveBtn.textContent = '保存图片';
        btns.appendChild(pickBtn); btns.appendChild(saveBtn);
        wrap.appendChild(btns);
        var tiles = [];
        function cutImage(imgEl) {
          var size = Math.min(imgEl.naturalWidth, imgEl.naturalHeight);
          var sx = (imgEl.naturalWidth - size) / 2, sy = (imgEl.naturalHeight - size) / 2;
          var tile = Math.floor(size / 3);
          tiles = [];
          cells.forEach(function (cell, i) { cell.innerHTML = ''; });
          for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
              var cv = document.createElement('canvas');
              cv.width = tile; cv.height = tile;
              var ctx = cv.getContext('2d');
              ctx.drawImage(imgEl, sx + c * tile, sy + r * tile, tile, tile, 0, 0, tile, tile);
              if (mask.file) {
                var mimg = new Image();
                mimg.src = imgFile(mask.file);
                ctx.drawImage(mimg, 0, 0, tile, tile);
              }
              cv.style.cssText = 'width:100px;height:100px';
              cells[r * 3 + c].appendChild(cv);
              tiles.push(cv);
            }
          }
          shotImg.src = imgEl.src; shotImg.style.display = '';
          if (mask.file) shotMask.style.display = '';
        }
        pickBtn.addEventListener('click', function () {
          var fp = H().$('file-picker');
          fp.onchange = function () {
            var f = fp.files && fp.files[0];
            if (!f) return;
            var url = URL.createObjectURL(f);
            var im = new Image();
            im.onload = function () { H().toast('处理中'); setTimeout(function () { cutImage(im); H().toast('已切成 9 张'); }, 300); };
            im.src = url;
          };
          fp.click();
        });
        saveBtn.addEventListener('click', function () {
          if (!tiles.length) { H().toast('请先选择图片'); return; }
          /* save ONE composited screenshot (viewShot), not 9 files (mod 3153) */
          var size = tiles[0].width;
          var out = document.createElement('canvas');
          out.width = size * 3; out.height = size * 3;
          var octx = out.getContext('2d');
          tiles.forEach(function (cv, i) {
            octx.drawImage(cv, (i % 3) * size, Math.floor(i / 3) * size);
          });
          var a = document.createElement('a');
          a.href = out.toDataURL('image/png');
          a.download = 'ninegrid.png';
          a.click();
          H().showAlert('提示', '成功保存9张图片到相册');
        });
        return wrap;
      }
    };
  }
  function phoneBarPage() {
    return {
      title: '手机型号设置',
      render: function () {
        var cfg = DB.phoneBar();
        /* defaults for the full 23-field form (mod 1826) */
        var defs = { cellular: '中国移动', wifiSignal: 3, signal1: 4, signal2: 4, signal: 4, charging: false, showAlipayIcon: false, showWechatIcon: false, showHuaweiVideo: false, showReader: false, showLock: false, showAlarm: true, showMute: true, showRotate: true, doubleCellular: true, time24: true };
        Object.keys(defs).forEach(function (k) { if (cfg[k] === undefined) cfg[k] = defs[k]; });
        var wrap = document.createElement('div');
        wrap.style.position = 'relative';
        /* live scaled preview: black bg, status bar drawn per model (mod 1829) */
        var prevWrap = document.createElement('div');
        prevWrap.style.cssText = 'background:#000;padding:0 0 8px';
        var prev = document.createElement('div');
        prev.style.cssText = 'position:relative;width:100%;height:44px';
        function renderPreview() {
          var m = PHONE_MODELS[cfg.modelIndex || 0];
          var t = (cfg.time || '2018-10-24 17:38:37').slice(11, 16);
          var isIOS = !m.type || m.type === 'ios';
          var sig = function (n) {
            var bars = '';
            for (var i = 0; i < 4; i++) {
              bars += '<rect x="' + (i * 5) + '" y="' + (12 - i * 3) + '" width="3" height="' + (4 + i * 3) + '" fill="' + (i < n ? '#fff' : 'rgba(255,255,255,.35)') + '"/>';
            }
            return '<svg width="20" height="14" viewBox="0 0 20 14">' + bars + '</svg>';
          };
          var wifi = '<svg width="18" height="14" viewBox="0 0 18 14"><path d="M1 5 Q9 -3 17 5 L15 7 Q9 1 3 7 Z" fill="#fff"/><path d="M4 8 Q9 3 14 8 L12 10 Q9 7 6 10 Z" fill="#fff"/><circle cx="9" cy="12" r="1.6" fill="#fff"/></svg>';
          var batt = '<svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="2" fill="none" stroke="#fff" opacity=".5"/><rect x="2" y="2" width="' + Math.round(18 * (cfg.power || 79) / 100) + '" height="8" rx="1" fill="#fff"/><rect x="22.5" y="3.5" width="2" height="5" rx="1" fill="#fff" opacity=".5"/></svg>';
          var left, right;
          var carrier = cfg.doubleCellular ? (cfg.cellular1 || '') : (cfg.cellular || cfg.cellular1 || '');
          if (isIOS) {
            left = '<span style="font-size:13px">' + esc(t) + '</span>';
            right = '<span style="display:flex;align-items:center;gap:5px">' + sig(cfg.signal || 4) + (cfg.showWifi ? wifi : '') + (cfg.showBluetooth ? '<span style="font-size:12px">ᛒ</span>' : '') + batt + (cfg.showPowerPersent ? '<span style="font-size:12px">' + (cfg.power || 79) + '%</span>' : '') + '</span>';
          } else {
            left = '<span style="display:flex;align-items:center;gap:5px;font-size:12px">' + esc(carrier) + ' ' + sig(cfg.signal1 || 4) + (cfg.doubleCellular ? sig(cfg.signal2 || 4) : '') + (cfg.showWifi ? wifi : '') + '</span>';
            right = '<span style="display:flex;align-items:center;gap:5px"><span style="font-size:13px">' + esc(t) + '</span>' + batt + (cfg.showPowerPersent ? '<span style="font-size:12px">' + (cfg.power || 79) + '%</span>' : '') + '</span>';
          }
          prev.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;height:44px;padding:0 14px;color:#fff">' + left + right + '</div>' +
            (cfg.showMute ? '<span style="position:absolute;top:44px;left:14px;font-size:11px;color:#888">🔕</span>' : '') +
            (cfg.showAlarm ? '<span style="position:absolute;top:44px;right:14px;font-size:11px;color:#888">⏰</span>' : '');
        }
        renderPreview();
        prevWrap.appendChild(prev);
        wrap.appendChild(prevWrap);
        /* floating ActionButton (mod 1826): size 46, buttonColor rgba(231,76,60,1) */
        var fab = document.createElement('button');
        fab.type = 'button';
        fab.style.cssText = 'position:fixed;right:16px;bottom:130px;width:46px;height:46px;border-radius:50%;background:rgba(231,76,60,1);color:#fff;font-size:24px;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,.3)';
        fab.textContent = '+';
        fab.addEventListener('click', function () {
          H().showActionSheet([
            { title: '返回', onPress: function () { nav().pop(); } },
            { title: '自定义上传状态栏', onPress: function () { H().toast('自定义上传状态栏（本地暂未实现）'); } },
            { title: '设置状态栏', onPress: function () { nav().reset('PhoneBarPage'); } },
            { title: '手机型号', onPress: function () {
              H().showPicker('选择手机型号', PHONE_MODELS.map(function (m) { return m.label; }), cfg.modelIndex || 0, function (label, i) {
                cfg.modelIndex = i; DB.savePhoneBar(cfg); renderPreview(); nav().reset('PhoneBarPage');
              });
            } },
            { title: '保存图片', onPress: function () { saveStatusBarImage(); } }
          ]);
        });
        wrap.appendChild(fab);
        function saveStatusBarImage() {
          try {
            var cv = document.createElement('canvas');
            cv.width = 390; cv.height = 44;
            var ctx = cv.getContext('2d');
            ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 390, 44);
            ctx.fillStyle = '#fff'; ctx.font = '13px sans-serif';
            var t = (cfg.time || '2018-10-24 17:38:37').slice(11, 16);
            ctx.fillText(t, 14, 28);
            ctx.fillText('🔋' + (cfg.power || 79) + '%', 300, 28);
            var a = document.createElement('a');
            a.href = cv.toDataURL('image/png');
            a.download = 'statusbar.png';
            a.click();
            H().toast('已保存');
          } catch (e) {
            H().showAlert('提示', '保存失败！您禁用了软件访问相册的权限，所以无法保存图片，请打开软件访问相册的权限后再试');
          }
        }
        /* model picker: 选择手机型号 PullPicker, first row 本机系统状态栏 + red tip */
        var modelBtn = document.createElement('button');
        modelBtn.type = 'button';
        modelBtn.style.cssText = 'display:block;width:calc(100% - 28px);margin:12px auto;height:44px;background:#fff;font-size:15px;color:#333;text-align:left;padding:0 14px';
        var m0 = PHONE_MODELS[cfg.modelIndex || 0];
        modelBtn.innerHTML = '手机型号：' + esc(m0.label) + (m0.tip ? ' <span style="color:#f00;font-size:12px">' + esc(m0.tip) + '</span>' : '');
        modelBtn.addEventListener('click', function () {
          H().showPicker('选择手机型号', PHONE_MODELS.map(function (m) { return m.label; }), cfg.modelIndex || 0, function (label, i) {
            cfg.modelIndex = i; DB.savePhoneBar(cfg); renderPreview(); nav().reset('PhoneBarPage');
          });
        });
        wrap.appendChild(modelBtn);
        /* 23-field settings form (mod 1826) */
        var form = document.createElement('div');
        form.className = 'form';
        var f = {};
        function swRow(label, key) {
          var r = document.createElement('div');
          r.className = 'form-row';
          r.innerHTML = '<span class="form-label" style="flex:1">' + esc(label) + '</span>';
          var cb = document.createElement('input');
          cb.type = 'checkbox'; cb.checked = !!cfg[key];
          cb.addEventListener('change', function () { cfg[key] = cb.checked; DB.savePhoneBar(cfg); renderPreview(); });
          r.appendChild(cb);
          return r;
        }
        f.cellular = formRow('营运商', textInput(cfg.cellular || '中国移动'));
        f.cellular1 = formRow('营运商1', textInput(cfg.cellular1 || '中国移动'));
        f.cellular2 = formRow('营运商2', textInput(cfg.cellular2 || '中国联通'));
        form.appendChild(f.cellular); form.appendChild(f.cellular1); form.appendChild(f.cellular2);
        form.appendChild(swRow('是否双卡双待', 'doubleCellular'));
        f.time = formRow('手机时间', textInput(cfg.time || '2018-10-24 17:38:37'));
        form.appendChild(f.time);
        form.appendChild(swRow('时间24小时制', 'time24'));
        f.power = formRow('电量', (function () {
          var inp = document.createElement('input');
          inp.type = 'range'; inp.min = 0; inp.max = 100; inp.value = cfg.power || 79; inp.style.flex = '1';
          inp.addEventListener('input', function () { cfg.power = parseInt(inp.value, 10); renderPreview(); });
          return inp;
        })());
        form.appendChild(f.power);
        form.appendChild(swRow('是否充电中', 'charging'));
        f.network = formRow('网络', (function () {
          var s = document.createElement('select');
          s.className = 'form-input';
          ['wifi', '4G', '5G'].forEach(function (o, i) { var op = document.createElement('option'); op.value = String(i); op.textContent = o; if ((cfg.network || 0) === i) op.selected = true; s.appendChild(op); });
          return s;
        })());
        form.appendChild(f.network);
        [['wifi信号', 'wifiSignal'], ['信号1强度', 'signal1'], ['信号2强度', 'signal2'], ['信号强度', 'signal']].forEach(function (t) {
          var r = formRow(t[0], (function () {
            var inp = document.createElement('input');
            inp.type = 'range'; inp.min = 0; inp.max = 4; inp.value = cfg[t[1]] || 4; inp.style.flex = '1';
            inp.addEventListener('input', function () { cfg[t[1]] = parseInt(inp.value, 10); renderPreview(); });
            return inp;
          })());
          form.appendChild(r);
        });
        form.appendChild(swRow('显示蓝牙', 'showBluetooth'));
        form.appendChild(swRow('显示电量百分比', 'showPowerPersent'));
        form.appendChild(swRow('显示静音', 'showMute'));
        form.appendChild(swRow('显示wifi', 'showWifi'));
        form.appendChild(swRow('显示支付宝图标', 'showAlipayIcon'));
        form.appendChild(swRow('显示微信图标', 'showWechatIcon'));
        form.appendChild(swRow('显示华为视频图标', 'showHuaweiVideo'));
        form.appendChild(swRow('显示阅读图标', 'showReader'));
        form.appendChild(swRow('显示锁定图标', 'showLock'));
        form.appendChild(swRow('显示闹钟图标', 'showAlarm'));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('保存', function () {
          cfg.cellular = f.cellular.querySelector('input').value;
          cfg.cellular1 = f.cellular1.querySelector('input').value;
          cfg.cellular2 = f.cellular2.querySelector('input').value;
          cfg.time = f.time.querySelector('input').value;
          cfg.network = parseInt(f.network.querySelector('select').value, 10);
          DB.savePhoneBar(cfg);
          renderPreview();
          H().toast('已保存');
        }));
        return wrap;
      }
    };
  }
  /* ---------- server pages as local stubs ---------- */
  function helpStubPage() {
    return {
      title: '说明',
      render: function (params) {
        return stubPage((params && params.title) || '说明',
          '本页内容来自服务端（' + ((params && params.link) || '') + '），当前为离线本地版本，仅展示原始入口文字，无法加载服务端内容。',
          'app_images_defaultface.png');
      }
    };
  }
  function loginPage() {
    return {
      title: '登录',
      render: function () {
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var phone = textInput('', '请输入手机号');
        var pass = document.createElement('input');
        pass.className = 'form-input'; pass.type = 'password'; pass.placeholder = '请输入密码';
        form.appendChild(formRow('手机号', phone));
        form.appendChild(formRow('密码', pass));
        wrap.appendChild(form);
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '本地演示：任意手机号和密码均可登录（服务端登录在离线版中无法连接）。';
        wrap.appendChild(note);
        wrap.appendChild(saveButton('登录', function () {
          if (!phone.value) { H().toast('请输入手机号'); return; }
          DB.setLoggedIn(true);
          H().toast('登录成功');
          nav().goTab('me');
        }));
        return wrap;
      }
    };
  }
  function vipPage() {
    return {
      title: '开通会员',
      render: function () {
        var wrap = document.createElement('div');
        var lv = document.createElement('div');
        lv.className = 'row-list';
        MEMBER_LEVELS.forEach(function (m, i) {
          var r = row(m, i === 0 ? '当前等级' : '');
          r.addEventListener('click', function () {
            if (i === 0) return;
            H().showAlert('提示', '开通' + m + '需要连接服务端，当前为离线本地版本。');
          });
          lv.appendChild(r);
        });
        wrap.appendChild(lv);
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '会员与支付功能来自服务端，本页为本地桩：展示原始会员等级，无法完成购买。';
        wrap.appendChild(note);
        return wrap;
      }
    };
  }
  function watermarkPage() {
    return {
      title: '去水印',
      render: function () {
        var wrap = document.createElement('div');
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '去水印功能需要开通会员（服务端）。';
        wrap.appendChild(note);
        wrap.appendChild(saveButton('开通会员去水印', function () { nav().push('vip'); }));
        return wrap;
      }
    };
  }
  function backupPage() {
    return {
      title: '数据备份与恢复',
      render: function () {
        var wrap = document.createElement('div');
        /* info card (mod 1813): bg #fff radius 10 margin 20 padding 20 */
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;border-radius:10px;margin:20px;padding:20px';
        card.innerHTML = '<div style="font-size:16px;font-weight:600;color:#333">数据备份与恢复</div>' +
          '<div style="font-size:14px;color:#999;line-height:18px;margin-top:10px">备份会导出本机全部数据（对话、角色、账单、余额等）。恢复会覆盖当前数据，请谨慎操作。</div>';
        wrap.appendChild(card);
        var ta = document.createElement('textarea');
        ta.style.cssText = 'display:block;width:calc(100% - 40px);height:150px;margin:0 20px;padding:12px;font-size:12px;font-family:monospace;box-sizing:border-box;border:1px solid #ddd;border-radius:6px;outline:none';
        ta.placeholder = '备份数据（JSON）';
        wrap.appendChild(ta);
        var note = document.createElement('div');
        note.style.cssText = 'margin:20px;padding:20px;background:#fff;border-radius:10px';
        note.innerHTML = '<div style="font-size:14px;color:#999;line-height:18px">提示：原版的数据备份与恢复通过服务端完成；本地版使用本机存储导出/导入 JSON。恢复后请重启应用。</div>';
        wrap.appendChild(note);
        /* buttons: primary h50 radius 5 text 16 / red #f00 variant */
        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:12px;padding:0 20px 20px';
        var exp = document.createElement('button');
        exp.type = 'button';
        exp.style.cssText = 'flex:1;height:50px;border-radius:5px;background:#1ea1f3;color:#fff;font-size:16px';
        exp.textContent = '备份数据';
        exp.addEventListener('click', function () {
          var out = {};
          try {
            Object.keys(window.localStorage).filter(function (k) { return k.indexOf('hjt:') === 0; }).forEach(function (k) { out[k] = window.localStorage.getItem(k); });
          } catch (e) {}
          ta.value = JSON.stringify(out, null, 2);
          H().toast('备份数据已生成');
        });
        var imp = document.createElement('button');
        imp.type = 'button';
        imp.style.cssText = 'flex:1;height:50px;border-radius:5px;background:#f00;color:#fff;font-size:16px';
        imp.textContent = '恢复数据';
        imp.addEventListener('click', function () {
          try {
            var out = JSON.parse(ta.value || '{}');
            Object.keys(out).forEach(function (k) { window.localStorage.setItem(k, out[k]); });
            H().toast('恢复数据成功，请重启应用');
          } catch (e) { H().toast('恢复失败：数据格式不正确'); }
        });
        btns.appendChild(exp); btns.appendChild(imp);
        wrap.appendChild(btns);
        return wrap;
      }
    };
  }
  function feedbackPage() {
    return {
      title: '建议意见',
      render: function () {
        var wrap = document.createElement('div');
        var ta = document.createElement('textarea');
        ta.className = 'form-input';
        ta.style.cssText = 'width:100%;height:160px;padding:10px;font-size:14px;box-sizing:border-box';
        ta.placeholder = '请输入您的建议意见';
        var f = document.createElement('div');
        f.className = 'form';
        f.appendChild(formRow('内容', ta));
        wrap.appendChild(f);
        wrap.appendChild(saveButton('提交', function () {
          if (!ta.value.trim()) { H().toast('请输入内容'); return; }
          H().toast('提交成功');
          nav().pop();
        }));
        return wrap;
      }
    };
  }
  function roleManagePage() {
    return {
      title: '角色管理',
      render: function () {
        var wrap = document.createElement('div');
        var list = document.createElement('div');
        wrap.appendChild(list);
        function render() {
          list.innerHTML = '';
          var roles = DB.roles();
          roles.forEach(function (r, i) {
            var elx = row(r.nickname, r.remark || '', function () {
              H().openDialog('编辑角色', [
                { label: '昵称', key: 'nickname', value: r.nickname },
                { label: '备注', key: 'remark', value: r.remark || '' },
                { label: '微信号', key: 'wechat', value: r.wechat || '' }
              ], function (vals) {
                r.nickname = vals.nickname; r.remark = vals.remark; r.wechat = vals.wechat;
                DB.saveRoles(roles); render();
              });
            });
            var av = document.createElement('img');
            av.className = 'row-icon';
            av.src = avatarFor(r);
            elx.insertBefore(av, elx.firstChild);
            list.appendChild(elx);
          });
        }
        render();
        wrap.appendChild(saveButton('添加角色', function () {
          H().openDialog('添加角色', [
            { label: '昵称', key: 'nickname', value: '' },
            { label: '备注', key: 'remark', value: '' },
            { label: '微信号', key: 'wechat', value: '' }
          ], function (vals) {
            if (!vals.nickname) return;
            var roles = DB.roles();
            roles.push({ id: Date.now(), nickname: vals.nickname, name: vals.nickname, remark: vals.remark, wechat: vals.wechat, avatar: 4 });
            DB.saveRoles(roles); render();
          });
        }));
        return wrap;
      }
    };
  }
  function bankManagePage() {
    return {
      title: '银行卡管理',
      render: function () {
        var wrap = document.createElement('div');
        var list = document.createElement('div');
        list.className = 'row-list';
        BANKS.forEach(function (b) {
          var elx = row(b.name, '');
          var ic = document.createElement('img');
          ic.className = 'row-icon';
          ic.src = img(b.code) || '';
          ic.onerror = function () { this.style.display = 'none'; };
          elx.insertBefore(ic, elx.firstChild);
          list.appendChild(elx);
        });
        wrap.appendChild(list);
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '以上为原始种子银行卡（17 家银行）。';
        wrap.appendChild(note);
        return wrap;
      }
    };
  }
  function webshotPage() {
    return {
      title: '网页截图',
      render: function () {
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var url = textInput('', '输入网址，如 https://www.baidu.com');
        form.appendChild(formRow('网址', url));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('截图', function () {
          if (!url.value) { H().toast('请输入网址'); return; }
          H().showAlert('提示', '网页截图需要加载外部网页，当前为离线本地版本，无法加载。');
        }));
        return wrap;
      }
    };
  }
  function stitchPage() {
    return {
      title: '拼接截图',
      render: function () {
        var wrap = document.createElement('div');
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '选择两张及以上的图片，按顺序拼接成一张长图。';
        wrap.appendChild(note);
        var grid = document.createElement('div');
        grid.style.cssText = 'padding:14px;display:flex;flex-direction:column;gap:6px';
        wrap.appendChild(grid);
        var picked = [];
        wrap.appendChild(saveButton('选择图片', function () {
          var fp = H().$('file-picker');
          fp.multiple = true;
          fp.onchange = function () {
            var files = Array.prototype.slice.call(fp.files || []);
            if (!files.length) return;
            picked = [];
            grid.innerHTML = '';
            files.forEach(function (f) {
              var url = URL.createObjectURL(f);
              var im = new Image();
              im.onload = function () {
                picked.push(im);
                var cell = document.createElement('img');
                cell.src = url;
                cell.style.cssText = 'width:100%;display:block';
                grid.appendChild(cell);
              };
              im.src = url;
            });
          };
          fp.click();
        }));
        wrap.appendChild(saveButton('保存拼接图', function () {
          if (picked.length < 2) { H().toast('请先选择两张以上图片'); return; }
          var w = picked[0].naturalWidth;
          var h = picked.reduce(function (s, im) { return s + im.naturalHeight * (w / im.naturalWidth); }, 0);
          var cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          var ctx = cv.getContext('2d');
          var y = 0;
          picked.forEach(function (im) {
            var hh = im.naturalHeight * (w / im.naturalWidth);
            ctx.drawImage(im, 0, y, w, hh);
            y += hh;
          });
          var a = document.createElement('a');
          a.href = cv.toDataURL('image/png');
          a.download = 'stitch.png';
          a.click();
          H().showAlert('提示', '成功保存1张图片到相册');
        }));
        return wrap;
      }
    };
  }

  /* ---------- 微信首页 (WechatHomePage) ---------- */
  /* Smart dialog time (mod 1821 dialogTime): today HH:mm, 昨天, weekday, date. */
  function dialogTime(t) {
    if (!t) return '';
    var d = new Date(t.replace(/-/g, '/'));
    if (isNaN(d.getTime())) return t.slice(11, 16);
    var now = new Date();
    var day = function (x) { return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); };
    var diff = Math.round((day(now) - day(d)) / 86400000);
    var hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    if (diff === 0) return hh + ':' + mm;
    if (diff === 1) return '昨天';
    if (diff < 7) return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];
    return (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }
  function wechatTabBar(active) {
    var bar = document.createElement('div');
    bar.style.cssText = 'flex:none;height:49px;background:#f8f8f8;border-top:1px solid #ccc;display:flex';
    [['微信', '💬', function () { nav().reset('WechatHomePage'); }],
     ['通讯录', '👥', function () { nav().push('FriendsPage'); }],
     ['发现', '🧭', function () { nav().push('WechatTimelinePage'); }],
     ['我', '👤', function () { nav().push('WechatMeInfoPage'); }]].forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:' + (active === t[0] ? '#57be6a' : '#8f8f8f');
      b.innerHTML = '<span style="font-size:27px;line-height:1">' + t[1] + '</span><span style="font-size:10px">' + t[0] + '</span>';
      b.addEventListener('click', t[2]);
      bar.appendChild(b);
    });
    return bar;
  }

  function wechatHomePage() {
    return {
      title: '微信',
      navClass: 'wx',
      right: { text: '+', onClick: function () {
        function assistantDialog(name) {
          var ds = DB.dialogs();
          var d = ds.filter(function (x) { return x.name === name; })[0];
          if (!d) {
            d = { id: 'assistant-' + name, name: name, avatar: 2, unread: 0, time: H().nowTime(), preview: '', messages: [] };
            ds.unshift(d);
            DB.saveDialogs(ds);
          }
          return d;
        }
        H().showActionSheet([
          { title: '添加单聊或公众号', onPress: function () { nav().push('WechatChatUsersPage'); } },
          { title: '添加群聊', onPress: function () { nav().push('WechatChatGroupUsersPage'); } },
          { title: '添加微信支付', onPress: function () { var d = assistantDialog('微信支付'); nav().push('WechatChatPage', { dialogId: d.id }); } },
          { title: '添加微信收款助手', onPress: function () { var d = assistantDialog('微信收款助手'); nav().push('WechatChatPage', { dialogId: d.id }); } },
          { title: '添加微信转账助手', onPress: function () { var d = assistantDialog('微信转账助手'); nav().push('WechatChatPage', { dialogId: d.id }); } },
          { title: '添加群发助手', onPress: function () { var d = assistantDialog('群发助手'); nav().push('WechatChatPage', { dialogId: d.id }); } },
          { title: '页面设置', onPress: function () {
            H().openDialog('页面设置', [
              { label: '显示未读消息', key: 'showUnread', value: true, type: 'switch' },
              { label: '未读消息数', key: 'unreadCount', value: '0' }
            ], function () { H().toast('已保存'); });
          } },
          { title: '清空对话内容', onPress: function () {
            H().showAlert('提示', '您确认要清空对话内容？');
            var ok = H().$('alert-ok');
            ok.onclick = function () { H().$('alert-overlay').hidden = true; var ds = DB.dialogs(); ds.forEach(function (d) { d.messages = []; d.preview = ''; }); DB.saveDialogs(ds); nav().reset('WechatHomePage'); };
          } },
          { title: '返回软件首页', onPress: function () { nav().goTab('home'); } }
        ]);
      } },
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;height:100%';
        /* nav title with unread total (mod 1819 _renderTitle) */
        setTimeout(function () {
          var screen = wrap.closest ? wrap.closest('.screen') : null;
          var navTitle = screen && screen.querySelector('.nav-title');
          if (navTitle) {
            var unreadTotal = DB.dialogs().reduce(function (n, d) { return n + (d.unread || 0); }, 0);
            navTitle.textContent = unreadTotal > 0 ? '微信(' + unreadTotal + ')' : '微信';
          }
        }, 0);
        /* search bar (mod 2239): h55, paddingHorizontal 8, bg #ededed */
        var search = document.createElement('div');
        search.style.cssText = 'flex:none;height:55px;background:#ededed;padding:0 8px;display:flex;align-items:center';
        search.innerHTML = '<div style="flex:1;height:36px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:8px"><span style="font-size:16px">🔍</span><span style="font-size:16px;color:#8e8e93">搜索</span></div>';
        wrap.appendChild(search);
        /* first-run guide (SGuid, mod 1819) — shown once */
        if (!store().get('wxGuideSeen')) {
          var g = document.createElement('div');
          g.style.cssText = 'flex:none;background:#fff8e6;color:#8c643a;font-size:13px;padding:10px 14px;display:flex;align-items:center;gap:8px';
          g.innerHTML = '<span style="flex:1">点击这里可以添加对话或设置页面；单按进入聊天，长按可以编辑时间等</span><button type="button" style="color:#1ea1f3;font-size:14px">我知道了</button>';
          g.querySelector('button').addEventListener('click', function () { store().set('wxGuideSeen', '1'); g.remove(); });
          wrap.appendChild(g);
        }
        var list = document.createElement('div');
        list.className = 'scroll';
        /* pinned first, then dialogDatetime desc (mod 1821 _dialogSort) */
        var sorted = DB.dialogs().slice().sort(function (a, b) {
          if (!!a.isTop !== !!b.isTop) return a.isTop ? -1 : 1;
          return String(b.time || '').localeCompare(String(a.time || ''));
        });
        sorted.forEach(function (d) {
          var r = document.createElement('div');
          r.className = 'conv-row';
          if (d.isTop) r.style.background = '#f7f7f7';
          var aw = document.createElement('div');
          aw.className = 'conv-avatar-wrap';
          var av = document.createElement('img');
          av.className = 'conv-avatar';
          av.src = avatarFor(d);
          aw.appendChild(av);
          if (d.unread) {
            var b = document.createElement('span');
            b.className = 'conv-badge';
            b.textContent = d.unread > 99 ? '···' : d.unread;
            aw.appendChild(b);
          }
          var main = document.createElement('div');
          main.className = 'conv-main';
          var nm = document.createElement('div');
          nm.className = 'conv-name';
          nm.style.color = d.isMP ? '#576b95' : '';
          nm.textContent = d.name;
          var pv = document.createElement('div');
          pv.className = 'conv-preview';
          pv.textContent = d.preview || '';
          main.appendChild(nm); main.appendChild(pv);
          var tm = document.createElement('div');
          tm.className = 'conv-time';
          tm.textContent = dialogTime(d.time);
          r.appendChild(aw); r.appendChild(main);
          if (d.nodisturb) {
            var bell = document.createElement('span');
            bell.style.cssText = 'font-size:13px;color:#999;flex:none';
            bell.textContent = '🔔';
            r.appendChild(bell);
          }
          r.appendChild(tm);
          r.addEventListener('click', function () {
            d.unread = 0;
            var ds = DB.dialogs();
            for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(d.id)) ds[i] = d;
            DB.saveDialogs(ds);
            nav().push('WechatChatPage', { dialogId: d.id });
          });
          var lt = null;
          r.addEventListener('touchstart', function () {
            lt = setTimeout(function () {
              H().showActionSheet([
                { title: '发对话', onPress: function () { nav().push('WechatChatPage', { dialogId: d.id }); } },
                { title: d.isTop ? '取消置顶' : '置顶', onPress: function () { d.isTop = !d.isTop; var ds = DB.dialogs(); for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(d.id)) ds[i] = d; DB.saveDialogs(ds); nav().reset('WechatHomePage'); } },
                { title: '编辑', onPress: function () {
                  H().openDialog('编辑对话', [
                    { label: '对话内容', key: 'preview', value: d.preview || '' },
                    { label: '免打扰', key: 'nodisturb', value: !!d.nodisturb, type: 'switch' },
                    { label: '角标数目', key: 'unread', value: String(d.unread || 0) },
                    { label: '对话时间', key: 'time', value: d.time || '' }
                  ], function (vals) {
                    d.preview = vals.preview; d.nodisturb = !!vals.nodisturb; d.unread = parseInt(vals.unread, 10) || 0; d.time = vals.time;
                    var ds = DB.dialogs();
                    for (var i = 0; i < ds.length; i++) if (String(ds[i].id) === String(d.id)) ds[i] = d;
                    DB.saveDialogs(ds); nav().reset('WechatHomePage');
                  });
                } },
                { title: '删除', onPress: function () {
                  H().showAlert('提示', '您确认要删除？');
                  var ok = H().$('alert-ok');
                  ok.onclick = function () { H().$('alert-overlay').hidden = true; DB.saveDialogs(DB.dialogs().filter(function (x) { return String(x.id) !== String(d.id); })); nav().reset('WechatHomePage'); };
                } }
              ]);
            }, 600);
          });
          r.addEventListener('touchend', function () { clearTimeout(lt); });
          list.appendChild(r);
        });
        wrap.appendChild(list);
        wrap.appendChild(wechatTabBar('微信'));
        return wrap;
      }
    };
  }

  /* ---------- 朋友圈 (WechatTimelinePage / UserPage) ---------- */
  function timelinePage() {
    return {
      title: '',
      navClass: 'wx',
      right: { text: '📷', onClick: function () { publishMoment(); } },
      render: function (params) {
        var wrap = document.createElement('div');
        var me = DB.me();
        /* cover: user 背景图 (square = screen width), avatar 70x70 radius 5
           overlapping bottom-right, name white 17/600 with shadow (mod 2277) */
        var cover = document.createElement('div');
        var bgSrc = img('timeline-bg') || '';
        cover.style.cssText = 'position:relative;width:100%;aspect-ratio:1;background:#ddd url(' + bgSrc + ') center/cover;flex:none';
        var nm = document.createElement('div');
        nm.style.cssText = 'position:absolute;right:106px;bottom:14px;height:40px;display:flex;align-items:center;color:#fff;font-size:17px;font-weight:600;text-shadow:0 1px 3px #000';
        nm.textContent = me.nickname;
        var av = document.createElement('img');
        av.src = avatarFor(me);
        av.style.cssText = 'position:absolute;right:12px;bottom:-18px;width:70px;height:70px;border-radius:5px;object-fit:cover;border:2px solid #fff';
        cover.appendChild(nm); cover.appendChild(av);
        cover.addEventListener('click', function () { editTimelineUser(); });
        wrap.appendChild(cover);
        /* unread banner: N条新消息 dark pill (mod 2277 messageView) */
        var unread = DB.dialogs().reduce(function (n, d) { return n + (d.unread || 0); }, 0);
        if (unread > 0) {
          var bn = document.createElement('div');
          bn.style.cssText = 'position:absolute;top:90px;left:50%;transform:translateX(-50%);z-index:3;width:180px;height:40px;border-radius:5px;background:#383939;color:#fff;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px';
          bn.innerHTML = '<span>' + unread + '条新消息</span>';
          bn.addEventListener('click', function () { nav().push('WechatHomePage'); });
          wrap.appendChild(bn);
        }
        var list = document.createElement('div');
        list.className = 'scroll';
        list.style.cssText = 'background:#fff;padding-top:24px';
        /* scroll-dependent nav title (mod 2596 _onScroll) */
        setTimeout(function () {
          var screen = wrap.closest ? wrap.closest('.screen') : null;
          var navTitle = screen && screen.querySelector('.nav-title');
          if (!navTitle) return;
          list.addEventListener('scroll', function () {
            navTitle.textContent = list.scrollTop > cover.offsetHeight - 60 ? '朋友圈' : '';
          });
        }, 0);
        function render() {
          list.innerHTML = '';
          DB.timeline().forEach(function (mo) {
            var item = document.createElement('div');
            item.className = 'moment';
            var aim = document.createElement('img');
            aim.className = 'moment-avatar';
            aim.src = avatarFor(mo);
            var body = document.createElement('div');
            body.style.flex = '1';
            body.style.minWidth = '0';
            var nm2 = document.createElement('div');
            nm2.className = 'moment-name';
            nm2.textContent = mo.nickname || mo.user || '';
            body.appendChild(nm2);
            if (mo.content || mo.text) {
              var tx = document.createElement('div');
              tx.className = 'moment-text';
              tx.textContent = mo.content || mo.text;
              body.appendChild(tx);
            }
            if (mo.images && mo.images.length) {
              var pics = document.createElement('div');
              pics.className = 'moment-pics';
              mo.images.forEach(function (src) {
                var im = document.createElement('img');
                im.src = src;
                im.addEventListener('click', function () { H().viewImage(src); });
                pics.appendChild(im);
              });
              body.appendChild(pics);
            }
            if (mo.likes && mo.likes.length) {
              var lk = document.createElement('div');
              lk.className = 'moment-likes';
              lk.innerHTML = '♥ ' + mo.likes.map(function (l) { return esc(l); }).join('，');
              body.appendChild(lk);
            }
            if (mo.comments && mo.comments.length) {
              var cm = document.createElement('div');
              cm.className = 'moment-comments';
              mo.comments.forEach(function (c) {
                var cd = document.createElement('div');
                cd.innerHTML = '<span class="c-name">' + esc(c.user || '') + '</span>：' + esc(c.text || '');
                cm.appendChild(cd);
              });
              body.appendChild(cm);
            }
            var ft = document.createElement('div');
            ft.style.cssText = 'display:flex;align-items:center;margin-top:8px';
            var tm = document.createElement('span');
            tm.className = 'moment-time';
            tm.style.marginTop = '0';
            tm.textContent = mo.time || mo.datetime || '';
            ft.appendChild(tm);
            var more = document.createElement('button');
            more.type = 'button';
            more.style.cssText = 'margin-left:auto;width:32px;height:20px;font-size:16px;color:#576b95';
            more.textContent = '…';
            more.addEventListener('click', function () { momentActions(mo, render); });
            ft.appendChild(more);
            body.appendChild(ft);
            item.appendChild(aim); item.appendChild(body);
            list.appendChild(item);
          });
        }
        render();
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  function publishMoment() {
    var me = DB.me();
    H().showActionSheet([
      { title: '文字', onPress: function () {
        H().openDialog('添加朋友圈', [{ label: '朋友圈内容', key: 'content', value: '' }], function (vals) {
          if (!vals.content) return;
          var tl = DB.timeline();
          tl.unshift({ id: Date.now(), nickname: me.nickname, content: vals.content, time: H().nowTime(), likes: [], comments: [] });
          DB.saveTimeline(tl);
          nav().reset('WechatTimelinePage');
        });
      } },
      { title: '图片', onPress: function () {
        H().openDialog('添加图片朋友圈', [
          { label: '朋友圈内容', key: 'content', value: '' },
          { label: '图片地址', key: 'image', value: '' }
        ], function (vals) {
          var tl = DB.timeline();
          tl.unshift({ id: Date.now(), nickname: me.nickname, content: vals.content, time: H().nowTime(), images: vals.image ? [vals.image] : [], likes: [], comments: [] });
          DB.saveTimeline(tl);
          nav().reset('WechatTimelinePage');
        });
      } },
      { title: '视频', onPress: function () {
        H().openDialog('添加视频朋友圈', [{ label: '朋友圈内容', key: 'content', value: '' }], function (vals) {
          var tl = DB.timeline();
          tl.unshift({ id: Date.now(), nickname: me.nickname, content: vals.content, time: H().nowTime(), likes: [], comments: [] });
          DB.saveTimeline(tl);
          nav().reset('WechatTimelinePage');
        });
      } },
      { title: '链接', onPress: function () {
        H().openDialog('添加链接朋友圈', [
          { label: '朋友圈内容', key: 'content', value: '' },
          { label: '链接标题', key: 'linkTitle', value: '' }
        ], function (vals) {
          var tl = DB.timeline();
          tl.unshift({ id: Date.now(), nickname: me.nickname, content: (vals.content || '') + (vals.linkTitle ? '\n' + vals.linkTitle : ''), time: H().nowTime(), likes: [], comments: [] });
          DB.saveTimeline(tl);
          nav().reset('WechatTimelinePage');
        });
      } }
    ]);
  }
  function momentActions(mo, render) {
    H().showActionSheet([
      { title: '点赞', onPress: function () {
        var users = DB.roles().map(function (r) { return r.nickname; });
        H().showPicker('请选择要点赞的用户', users.concat(['全部点赞']), -1, function (label) {
          mo.likes = mo.likes || [];
          if (label === '全部点赞') {
            users.forEach(function (u) { if (mo.likes.indexOf(u) < 0) mo.likes.push(u); });
          } else if (mo.likes.indexOf(label) < 0) mo.likes.push(label);
          var tl = DB.timeline();
          for (var i = 0; i < tl.length; i++) if (String(tl[i].id) === String(mo.id)) tl[i] = mo;
          DB.saveTimeline(tl);
          render();
        });
      } },
      { title: '评论', onPress: function () {
        H().openDialog('评论', [{ label: '评论内容', key: 'text', value: '' }], function (vals) {
          if (!vals.text) return;
          mo.comments = mo.comments || [];
          mo.comments.push({ user: DB.me().nickname, text: vals.text });
          var tl = DB.timeline();
          for (var i = 0; i < tl.length; i++) if (String(tl[i].id) === String(mo.id)) tl[i] = mo;
          DB.saveTimeline(tl);
          render();
        });
      } },
      { title: '回复', onPress: function () {
        H().openDialog('回复', [{ label: '回复内容', key: 'text', value: '' }], function (vals) {
          if (!vals.text) return;
          mo.comments = mo.comments || [];
          mo.comments.push({ user: DB.me().nickname, text: vals.text });
          var tl = DB.timeline();
          for (var i = 0; i < tl.length; i++) if (String(tl[i].id) === String(mo.id)) tl[i] = mo;
          DB.saveTimeline(tl);
          render();
        });
      } },
      { title: '删除', onPress: function () {
        H().showAlert('提示', '您确认要删除');
        var ok = H().$('alert-ok');
        ok.onclick = function () {
          H().$('alert-overlay').hidden = true;
          DB.saveTimeline(DB.timeline().filter(function (x) { return String(x.id) !== String(mo.id); }));
          render();
        };
      } },
      { title: '清空所有', onPress: function () {
        H().showAlert('提示', '您确认要清空所有记录');
        var ok = H().$('alert-ok');
        ok.onclick = function () { H().$('alert-overlay').hidden = true; DB.saveTimeline([]); render(); };
      } }
    ]);
  }
  function editTimelineUser() {
    var me = DB.me();
    H().openDialog('编辑用户信息', [
      { label: '用户昵称', key: 'nickname', value: me.nickname },
      { label: '用户头像', key: 'avatar', value: String(me.avatar || 0) },
      { label: '背景图', key: 'bg', value: '' },
      { label: '显示未读消息', key: 'showUnread', value: true, type: 'switch' },
      { label: '未读消息头像', key: 'unreadAvatar', value: '' },
      { label: '未读消息数', key: 'unreadCount', value: '0' }
    ], function (vals) {
      me.nickname = vals.nickname;
      DB.saveMe(me);
      nav().reset('WechatTimelinePage');
    });
  }
  function timelineUserPage() {
    return {
      title: '',
      navClass: 'wx',
      render: function (params) {
        var wrap = document.createElement('div');
        var me = DB.me();
        var range = store().get('timelineRange', '全部');
        /* header: 背景图 + avatar + nickname + 个性签名 (mod 2275) */
        var cover = document.createElement('div');
        var bgSrc = img('timeline-bg') || '';
        cover.style.cssText = 'position:relative;width:100%;aspect-ratio:1;background:#ddd url(' + bgSrc + ') center/cover;flex:none';
        var nm = document.createElement('div');
        nm.style.cssText = 'position:absolute;right:106px;bottom:14px;height:40px;display:flex;align-items:center;color:#fff;font-size:17px;font-weight:600;text-shadow:0 1px 3px #000';
        nm.textContent = me.nickname;
        var av = document.createElement('img');
        av.src = avatarFor(me);
        av.style.cssText = 'position:absolute;right:12px;bottom:-18px;width:70px;height:70px;border-radius:5px;object-fit:cover;border:2px solid #fff';
        cover.appendChild(nm); cover.appendChild(av);
        wrap.appendChild(cover);
        var sig = document.createElement('div');
        sig.style.cssText = 'background:#fff;padding:26px 16px 10px;font-size:14px;color:#666';
        sig.textContent = me.signature || '个性签名';
        sig.addEventListener('click', function () { editTimelineUser(); });
        wrap.appendChild(sig);
        /* range control */
        var rg = document.createElement('div');
        rg.style.cssText = 'background:#fff;padding:10px 16px;display:flex;align-items:center;border-top:1px solid #eee';
        rg.innerHTML = '<span style="flex:1;font-size:14px;color:#333">展示范围：' + esc(range) + '</span><span style="font-size:14px;color:#1ea1f3">切换 ›</span>';
        rg.addEventListener('click', function () {
          H().showActionSheet([
            { title: '展示3天朋友圈', onPress: function () { store().set('timelineRange', '3天'); nav().reset('WechatTimelineUserPage'); } },
            { title: '展示1个月朋友圈', onPress: function () { store().set('timelineRange', '1个月'); nav().reset('WechatTimelineUserPage'); } },
            { title: '展示半年朋友圈', onPress: function () { store().set('timelineRange', '半年'); nav().reset('WechatTimelineUserPage'); } },
            { title: '展示全部朋友圈', onPress: function () { store().set('timelineRange', '全部'); nav().reset('WechatTimelineUserPage'); } },
            { title: '清空所有', onPress: function () {
              H().showAlert('提示', '您确认要清空所有记录');
              var ok = H().$('alert-ok');
              ok.onclick = function () { H().$('alert-overlay').hidden = true; DB.saveTimeline([]); nav().reset('WechatTimelineUserPage'); };
            } }
          ]);
        });
        wrap.appendChild(rg);
        if (range !== '全部') {
          var nt = document.createElement('div');
          nt.className = 'form-note';
          nt.textContent = '朋友仅展示最近' + (range === '3天' ? '三天' : range === '1个月' ? '一个月' : '半年') + '的朋友圈';
          wrap.appendChild(nt);
        }
        /* moments grouped by date with year headers (30px, mod 2277) */
        var list = document.createElement('div');
        list.className = 'scroll';
        list.style.cssText = 'background:#fff';
        var byDate = {};
        var order = [];
        DB.timeline().forEach(function (mo) {
          var key = (mo.time || mo.datetime || '').slice(0, 10) || '未知';
          if (!byDate[key]) { byDate[key] = []; order.push(key); }
          byDate[key].push(mo);
        });
        order.forEach(function (key) {
          var y = key.slice(0, 4);
          var h = document.createElement('div');
          h.style.cssText = 'font-size:30px;color:#333;padding:10px 14px 4px';
          h.textContent = y + '年';
          list.appendChild(h);
          byDate[key].forEach(function (mo) {
            var item = document.createElement('div');
            item.className = 'moment';
            var aim = document.createElement('img');
            aim.className = 'moment-avatar';
            aim.src = avatarFor(mo);
            var body = document.createElement('div');
            body.style.flex = '1';
            body.innerHTML = '<div class="moment-name">' + esc(mo.nickname || mo.user || '') + '</div>' +
              '<div class="moment-text">' + esc(mo.content || mo.text || '') + '</div>' +
              '<div class="moment-time">' + esc(mo.time || mo.datetime || '') + '</div>';
            item.appendChild(aim); item.appendChild(body);
            list.appendChild(item);
          });
        });
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  function wechatMeInfoPage() {
    return {
      title: '个人信息',
      render: function () {
        var me = DB.me();
        me.hideWechatDou = !!me.hideWechatDou;
        me.hideMeFapiao = !!me.hideMeFapiao;
        var wrap = document.createElement('div');
        function editForm() {
          H().openDialog('编辑个人信息', [
            { label: '昵称', key: 'nickname', value: me.nickname },
            { label: '头像', key: 'avatar', value: String(me.avatar != null ? me.avatar : 0) },
            { label: '拍一拍', key: 'paiyipai', value: me.paiyipai || '' },
            { label: '微信号', key: 'wechat', value: me.wechat },
            { label: '性别', key: 'gender', value: me.gender || '男', type: 'select', options: ['男', '女'] },
            { label: '地区', key: 'region', value: me.region || '' },
            { label: '二维码图片', key: 'qr', value: '' },
            { label: '隐藏我的发票抬头', key: 'hideMeFapiao', value: me.hideMeFapiao, type: 'switch' },
            { label: '隐藏微信豆', key: 'hideWechatDou', value: me.hideWechatDou, type: 'switch' }
          ], function (vals) {
            me.nickname = vals.nickname; me.wechat = vals.wechat;
            me.paiyipai = vals.paiyipai; me.gender = vals.gender; me.region = vals.region;
            me.hideMeFapiao = !!vals.hideMeFapiao; me.hideWechatDou = !!vals.hideWechatDou;
            DB.saveMe(me);
            nav().reset('WechatMeInfoPage');
          });
        }
        var rows1 = [];
        /* 1 头像 */
        var avRow = document.createElement('div');
        avRow.className = 'row';
        avRow.innerHTML = '<span class="row-label">头像</span>';
        var av = document.createElement('img');
        av.style.cssText = 'width:60px;height:60px;border-radius:6px;object-fit:cover';
        av.src = avatarFor(me);
        avRow.appendChild(av);
        var ar = document.createElement('span');
        ar.className = 'row-arrow'; ar.textContent = '›';
        avRow.appendChild(ar);
        avRow.addEventListener('click', editForm);
        rows1.push(avRow);
        /* 2 名字 (iOS label, mod 2681) */
        rows1.push(row('名字', me.nickname || '', editForm));
        /* 3 拍一拍 */
        rows1.push(row('拍一拍', me.paiyipai || '', editForm));
        /* 4 微信号 */
        rows1.push(row('微信号', me.wechat || '', editForm));
        /* 5 我的二维码 */
        rows1.push(row('我的二维码', '', function () {
          H().showAlert('我的二维码', '微信号：' + (me.wechat || ''));
        }));
        /* 6 更多 */
        rows1.push(row('更多', '', editForm));
        var lw1 = document.createElement('div');
        lw1.className = 'row-list';
        rows1.forEach(function (r) { lw1.appendChild(r); });
        wrap.appendChild(lw1);
        wrap.appendChild(gap());
        var rows2 = [];
        if (!me.hideWechatDou) rows2.push(row('微信豆', '', function () { H().toast('微信豆（本地暂未实现）'); }));
        rows2.push(row('我的地址', '', function () { H().toast('我的地址（本地暂未实现）'); }));
        if (!me.hideMeFapiao) rows2.push(row('我的发票抬头', '', function () { H().toast('我的发票抬头（本地暂未实现）'); }));
        var lw2 = document.createElement('div');
        lw2.className = 'row-list';
        rows2.forEach(function (r) { lw2.appendChild(r); });
        wrap.appendChild(lw2);
        return wrap;
      }
    };
  }
  /* ---------- 我 (MePage, mod 3176/3181) ---------- */
  function meInfo() {
    try { return JSON.parse(store().get('me', '{}') || '{}'); } catch (e) { return {}; }
  }
  function saveMeInfo(v) { store().set('me', JSON.stringify(v)); }
  function cardKeyGate(onOk) {
    if (!DB.loggedIn()) {
      H().showActionSheet([
        { title: '请先登录', onPress: function () { nav().push('login'); } },
        { title: '取消', onPress: function () {} }
      ]);
      return false;
    }
    if (onOk) onOk();
    return true;
  }
  function mePage() {
    return {
      title: '我',
      render: function () {
        var wrap = document.createElement('div');
        var me = meInfo();
        var logged = DB.loggedIn();
        /* header userview (mod 3176): bg #1ea1f3 padding 20, face frame 76x76
           (border 3 rgba(0,0,0,0.1) radius 38), face 70x70 radius 35,
           name white 16 marginLeft 10, arrow white 18 */
        var head = document.createElement('div');
        head.style.cssText = 'background:#1ea1f3;padding:20px;display:flex;align-items:center';
        var frame = document.createElement('div');
        frame.style.cssText = 'width:76px;height:76px;border-radius:38px;border:3px solid rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;flex:none';
        var face = document.createElement('img');
        face.src = me.avatar || imgFile('app_images_defaultface.png');
        face.style.cssText = 'width:70px;height:70px;border-radius:35px;object-fit:cover';
        frame.appendChild(face);
        var nm = document.createElement('div');
        nm.style.cssText = 'color:#fff;font-size:16px;margin-left:10px;flex:1';
        nm.textContent = logged ? (me.nickname || '未设置昵称') : '点击登录';
        var arrow = document.createElement('span');
        arrow.style.cssText = 'color:#fff;font-size:18px';
        arrow.textContent = '›';
        head.appendChild(frame); head.appendChild(nm); head.appendChild(arrow);
        head.addEventListener('click', function () { nav().push(logged ? 'settings' : 'login'); });
        wrap.appendChild(head);
        var rows = document.createElement('div');
        rows.className = 'list';
        function row(label, value, onClick, red) {
          var r = document.createElement('div');
          r.className = 'row';
          r.innerHTML = '<span class="row-label" style="flex:1;' + (red ? 'color:#f00' : '') + '">' + esc(label) + '</span>' +
            (value ? '<span class="row-value">' + esc(value) + '</span>' : '') + '<span class="row-arrow">›</span>';
          if (onClick) r.addEventListener('click', onClick);
          rows.appendChild(r);
        }
        row('状态', logged ? '正常' : '未登录');
        row('会员类型', me.vipType || '非会员');
        row('到期时间', me.vipExpire || '—');
        if (logged && me.mobile) {
          row('登录手机', me.mobile);
          row('修改密码', '', function () { H().toast('修改密码（本地暂未实现）'); });
          row('设置密保', '', function () { H().toast('设置密保（本地暂未实现）'); });
        }
        row('代理商', '', function () { H().toast('代理商（本地暂未实现）'); });
        row('开通会员去水印', '', function () { nav().push('vip'); }, true);
        row('卡密激活', '', function () { cardKeyGate(function () { H().toast('卡密激活（本地暂未实现）'); }); });
        row('卡密查询', '', function () { cardKeyGate(function () { H().toast('卡密查询（本地暂未实现）'); }); });
        row('在线客服', '', function () { nav().push('helpStub'); });
        wrap.appendChild(rows);
        return wrap;
      }
    };
  }

  /* ---------- 账号设置 (SettingsPage, mod 3177/3180) ---------- */
  function settingsPage() {
    var saveFn = null;
    var page = {
      title: '账号设置',
      right: { text: '保存', onClick: function () { if (saveFn) saveFn(); } },
      render: function () {
        var wrap = document.createElement('div');
        var me = meInfo();
        var form = document.createElement('div');
        form.className = 'form';
        var f = {};
        /* avatar row: faceimg 60x60 radius 30 */
        var avRow = document.createElement('div');
        avRow.className = 'form-row';
        avRow.innerHTML = '<span class="form-label">头像</span>';
        var avImg = document.createElement('img');
        avImg.src = me.avatar || imgFile('app_images_defaultface.png');
        avImg.style.cssText = 'width:60px;height:60px;border-radius:30px;object-fit:cover';
        avRow.appendChild(avImg);
        avRow.addEventListener('click', function () {
          var fp = H().$('file-picker');
          fp.onchange = function () {
            var file = fp.files && fp.files[0];
            if (!file) return;
            var rd = new FileReader();
            rd.onload = function () { me.avatar = rd.result; avImg.src = rd.result; };
            rd.readAsDataURL(file);
          };
          fp.click();
        });
        form.appendChild(avRow);
        f.nickname = formRow('昵称', textInput(me.nickname || ''));
        f.gender = formRow('性别', selectInput(['男', '女'], me.gender || '男'));
        f.realName = formRow('真实姓名', textInput(me.realName || ''));
        f.qq = formRow('QQ', textInput(me.qq || ''));
        f.wechat = formRow('微信号', textInput(me.wechat || ''));
        f.alipay = formRow('支付宝账号', textInput(me.alipay || ''));
        f.alipayLevel = formRow('支付宝等级', selectInput(['非会员', '大众会员', '黄金会员', '铂金会员', '钻石会员'], me.alipayLevel || '非会员'));
        f.birthday = formRow('生日', textInput(me.birthday || '', 'YYYY-MM-DD'));
        f.sign = formRow('签名', textInput(me.sign || ''));
        Object.keys(f).forEach(function (k) { form.appendChild(f[k]); });
        wrap.appendChild(form);
        var logout = document.createElement('button');
        logout.type = 'button'; logout.className = 'btn-danger-white'; logout.textContent = '退出登录';
        logout.addEventListener('click', function () {
          H().showActionSheet([
            { title: '您确认要退出登录？', onPress: function () {
              DB.setLoggedIn(false);
              nav().goTab('home');
            } },
            { title: '取消', onPress: function () {} }
          ]);
        });
        wrap.appendChild(logout);
        saveFn = function () {
          me.nickname = f.nickname.querySelector('input').value;
          me.gender = f.gender.querySelector('select').value;
          me.realName = f.realName.querySelector('input').value;
          me.qq = f.qq.querySelector('input').value;
          me.wechat = f.wechat.querySelector('input').value;
          me.alipay = f.alipay.querySelector('input').value;
          me.alipayLevel = f.alipayLevel.querySelector('select').value;
          me.birthday = f.birthday.querySelector('input').value;
          me.sign = f.sign.querySelector('input').value;
          saveMeInfo(me);
          H().toast('已保存');
        };
        return wrap;
      }
    };
    return page;
  }

  /* ---------- 更多 (AccountPage, mod 3185/1813) ---------- */
  function accountPage() {
    return {
      title: '更多',
      render: function () {
        var wrap = document.createElement('div');
        var rows = document.createElement('div');
        rows.className = 'list';
        function row(label, value, onClick) {
          var r = document.createElement('div');
          r.className = 'row';
          r.innerHTML = '<span class="row-label" style="flex:1">' + esc(label) + '</span>' +
            (value ? '<span class="row-value">' + esc(value) + '</span>' : '') + '<span class="row-arrow">›</span>';
          if (onClick) r.addEventListener('click', onClick);
          rows.appendChild(r);
        }
        row('建议意见', '', function () { nav().push('feedback'); });
        row('客服QQ', '1200000000', function () { H().toast('已复制客服QQ'); });
        row('客服微信', 'haojietu2', function () { H().toast('已复制客服微信'); });
        row('客服支付宝', 'haojietu@163.com', function () { H().toast('已复制客服支付宝'); });
        row('角色管理', '', function () { nav().push('roleManage'); });
        row('银行卡管理', '', function () { nav().push('bankManage'); });
        if (DB.loggedIn()) row('数据备份与恢复', '', function () { nav().push('backup'); });
        row('恢复初始设置', '', function () {
          H().showActionSheet([
            { title: '您确认要恢复初始设置？', onPress: function () {
              try {
                Object.keys(window.localStorage).filter(function (k) { return k.indexOf('hjt:') === 0; }).forEach(function (k) { window.localStorage.removeItem(k); });
              } catch (e) {}
              H().toast('已恢复初始设置，请重启应用');
            } },
            { title: '取消', onPress: function () {} }
          ]);
        });
        row('用户协议', '', function () { nav().push('helpStub'); });
        row('检测更新', '', function () { H().showAlert('提示', '您的应用版本已是最新'); });
        row('版权所有', '微截图 - 4.4.5');
        wrap.appendChild(rows);
        var exit = document.createElement('button');
        exit.type = 'button'; exit.className = 'btn-danger-white'; exit.textContent = '退出软件';
        exit.addEventListener('click', function () { H().showAlert('提示', '退出软件（请手动关闭应用）'); });
        wrap.appendChild(exit);
        return wrap;
      }
    };
  }

  function friendsPage() {
    return {
      title: '新的朋友',
      right: { text: '添加朋友', onClick: function () { addFriendMenu(); } },
      render: function () {
        var wrap = document.createElement('div');
        /* search bar: 微信号/手机号 (mod 2578) */
        var search = document.createElement('div');
        search.style.cssText = 'background:#fff;padding:8px 12px';
        search.innerHTML = '<div style="background:#f2f2f2;border-radius:6px;padding:8px;text-align:center;color:#999;font-size:14px">微信号/手机号</div>';
        search.addEventListener('click', function () { addFriendMenu(); });
        wrap.appendChild(search);
        /* 添加手机联系人 row (mod 2579 phoneImage 17x30, phoneText 14 #929292) */
        var addPhone = document.createElement('div');
        addPhone.style.cssText = 'background:#fff;display:flex;align-items:center;gap:10px;padding:10px 14px;border-top:1px solid #eee';
        addPhone.innerHTML = '<span style="font-size:17px">📱</span><span style="font-size:14px;color:#929292">添加手机联系人</span>';
        addPhone.addEventListener('click', function () { H().toast('添加手机联系人（本地暂未实现）'); });
        wrap.appendChild(addPhone);
        var list = document.createElement('div');
        list.className = 'scroll';
        function render() {
          list.innerHTML = '';
          var reqs = DB.friendRequests().slice().sort(function (a, b) { return String(b.time || '').localeCompare(String(a.time || '')); });
          var now = new Date();
          function sectionOf(t) {
            var d = new Date((t || '').replace(/-/g, '/'));
            if (isNaN(d.getTime())) return '三天前';
            var diff = (new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000;
            return diff <= 3 ? '近三天' : '三天前';
          }
          ['近三天', '三天前'].forEach(function (sec) {
            var items = reqs.filter(function (r) { return sectionOf(r.time) === sec; });
            if (!items.length) return;
            var h = document.createElement('div');
            h.style.cssText = 'height:22px;background:#f0f0f6;color:#8e8e93;font-size:12px;display:flex;align-items:center;padding:0 14px';
            h.textContent = sec;
            list.appendChild(h);
            items.forEach(function (r) {
              var elx = document.createElement('div');
              elx.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:' + (r.read ? '#fff' : '#f0f0f0') + ';border-bottom:1px solid #eee';
              var av = document.createElement('img');
              av.style.cssText = 'width:42px;height:42px;border-radius:4px;object-fit:cover;flex:none';
              av.src = avatarFor(r);
              var mid = document.createElement('div');
              mid.style.cssText = 'flex:1;min-width:0';
              mid.innerHTML = '<div style="font-size:16px;color:#000">' + esc(r.nickname) + '</div>' +
                (r.remark ? '<div style="font-size:13px;color:#999;margin-top:2px">' + esc(r.remark) + '</div>' : '');
              elx.appendChild(av); elx.appendChild(mid);
              var right = document.createElement('div');
              right.style.cssText = 'display:flex;align-items:center;gap:8px;flex:none';
              if (r.added) {
                right.innerHTML = '<span style="font-size:14px;color:#999">已添加</span>';
              } else if (r.expired) {
                right.innerHTML = '<span style="font-size:14px;color:#999">已过期</span>';
              } else {
                var view = document.createElement('button');
                view.type = 'button';
                view.style.cssText = 'font-size:14px;color:#333;background:none';
                view.textContent = '查看';
                view.addEventListener('click', function () {
                  r.read = true;
                  DB.saveFriendRequests(DB.friendRequests());
                  H().showAlert(r.nickname, r.remark || '');
                  render();
                });
                var acc = document.createElement('button');
                acc.type = 'button';
                acc.style.cssText = 'width:46px;height:30px;background:#f8f8f8;border:1px solid #dfdfdf;border-radius:4px;font-size:14px;color:#19a554';
                acc.textContent = '接受';
                acc.addEventListener('click', function () {
                  r.added = true; r.read = true;
                  DB.saveFriendRequests(DB.friendRequests());
                  H().toast('已添加 ' + r.nickname);
                  render();
                });
                right.appendChild(view); right.appendChild(acc);
              }
              elx.appendChild(right);
              list.appendChild(elx);
            });
          });
        }
        render();
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  function addFriendMenu() {
    H().showActionSheet([
      { title: '添加自定义朋友', onPress: function () { addFriendForm(); } },
      { title: '随机添加1个朋友', onPress: function () { addRandomFriends(1, false); } },
      { title: '随机添加近三天10个朋友', onPress: function () { addRandomFriends(10, false); } },
      { title: '随机添加三天前10个朋友', onPress: function () { addRandomFriends(10, true); } },
      { title: '清空所有朋友', onPress: function () {
        H().showAlert('提示', '您确认要清空所有朋友');
        var ok = H().$('alert-ok');
        ok.onclick = function () { H().$('alert-overlay').hidden = true; DB.saveFriendRequests([]); nav().reset('FriendsPage'); };
      } }
    ]);
  }
  function addFriendForm() {
    H().openDialog('添加朋友', [
      { label: '昵称', key: 'nickname', value: '' },
      { label: '头像', key: 'avatar', value: '5' },
      { label: '备注信息', key: 'remark', value: '' },
      { label: '是否已读', key: 'read', value: false, type: 'switch' },
      { label: '是否已添加', key: 'added', value: false, type: 'switch' },
      { label: '是否已过期', key: 'expired', value: false, type: 'switch' },
      { label: '时间', key: 'time', value: H().nowTime() }
    ], function (vals) {
      if (!vals.nickname) return;
      var rs = DB.friendRequests();
      rs.unshift({ id: Date.now(), nickname: vals.nickname, avatar: parseInt(vals.avatar, 10) || 5, remark: vals.remark, read: !!vals.read, added: !!vals.added, expired: !!vals.expired, time: vals.time });
      DB.saveFriendRequests(rs);
      nav().reset('FriendsPage');
    });
  }
  function addRandomFriends(n, old) {
    var rs = DB.friendRequests();
    var roles = DB.roles();
    for (var i = 0; i < n; i++) {
      var r = roles[Math.floor(Math.random() * roles.length)];
      var d = new Date();
      if (old) d.setDate(d.getDate() - 4 - Math.floor(Math.random() * 10));
      else d.setDate(d.getDate() - Math.floor(Math.random() * 3));
      var t = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':00';
      rs.unshift({ id: Date.now() + i, nickname: r.nickname, avatar: r.image, remark: '通过群聊添加', read: false, added: false, expired: false, time: t });
    }
    DB.saveFriendRequests(rs);
    H().toast('已添加' + n + '个朋友');
    nav().reset('FriendsPage');
  }

  /* ---------- 微信钱包服务 (WalletPage / WalletNewPage) ---------- */
  /* ---------- 微信钱包服务 (WalletPage / WalletNewPage, modules 2641/2680) ----------
     Service lists + icon indices verbatim from the bundle; icons resolve via
     SConfig.wechatWalletList: imageIndex N -> wallet-icon{N+1} (light) /
     wallet-icon{N+1}-dark (dark mode, indices 0-26). Tapping a service opens
     the local equivalent where one exists, otherwise a stub note (all of
     these are server pages in the original). */
  var WALLET_OLD = [
    { section: '腾讯服务', items: [
      { text: '信用卡还款', icon: 0 }, { text: '微粒贷借钱', icon: 1 },
      { text: '手机充值', icon: 2 }, { text: '理财通', icon: 3 },
      { text: '生活缴费', icon: 4 }, { text: 'Q币充值', icon: 5 },
      { text: '城市服务', icon: 6 }, { text: '腾讯公益', icon: 7 },
      { text: '医疗健康', icon: 29 }, { text: '保险服务', icon: 8 },
      { text: '出行服务', icon: 27 }, { text: '智慧零售', icon: 28 }
    ] },
    { section: '限时推广', items: [
      { text: '防疫健康码', icon: 30 }, { text: '腾讯王卡', icon: 20 },
      { text: '星巴克', icon: 19 }
    ] },
    { section: '第三方服务', items: [
      { text: '火车票机票', icon: 26 }, { text: '滴滴出行', icon: 11 },
      { text: '京东优选', icon: 12 }, { text: '美团外卖', icon: 13 },
      { text: '电影演出赛事', icon: 14 }, { text: '吃喝玩乐', icon: 15 },
      { text: '酒店', icon: 25 }, { text: '拼多多', icon: 24 },
      { text: '摩拜单车', icon: 9 }, { text: '蘑菇街女装', icon: 23 },
      { text: '唯品会特卖', icon: 22 }, { text: '转转二手', icon: 21 },
      { text: '58到家', icon: 18, hide: true }
    ] }
  ];
  var WALLET_NEW = [
    { section: '金融理财', items: [
      { text: '信用卡还款', icon: 0 }, { text: '微粒贷借钱', icon: 1 },
      { text: '理财通', icon: 3 }, { text: '保险服务', icon: 8 }
    ] },
    { section: '生活服务', items: [
      { text: '手机充值', icon: 2 }, { text: '生活缴费', icon: 4 },
      { text: 'Q币充值', icon: 5 }, { text: '城市服务', icon: 6 },
      { text: '腾讯公益', icon: 7 }, { text: '医疗健康', icon: 29 },
      { text: '防疫健康码', icon: 30 }
    ] },
    { section: '交通出行', items: [
      { text: '出行服务', icon: 27 }, { text: '火车票机票', icon: 26 },
      { text: '滴滴出行', icon: 11 }, { text: '酒店', icon: 25 },
      { text: '摩拜单车', icon: 9, hide: true }
    ] },
    { section: '购物消费', items: [
      { text: '智慧零售', icon: 28 }, { text: '京东购物', icon: 12 },
      { text: '美团外卖', icon: 13 }, { text: '电影演出', icon: 14, sub: '赛事' },
      { text: '吃喝玩乐', icon: 15 }, { text: '拼多多', icon: 24 },
      { text: '蘑菇街女装', icon: 23 }, { text: '唯品会特卖', icon: 22 },
      { text: '转转二手', icon: 21 }, { text: '58到家', icon: 18, hide: true }
    ] }
  ];
  function walletIcon(index) {
    var dark = store().get('phoneViewMode', '0') === '1' && index <= 26;
    var name = 'wallet-icon' + (index + 1) + (dark ? '-dark' : '');
    return img(name) || '';
  }
  function walletServiceTap(it) {
    nav().push('helpStub', { title: it.text });
  }
  function walletGridPage(title, isNew) {
    var sections = isNew ? WALLET_NEW : WALLET_OLD;
    return {
      title: title,
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.background = '#f7f7f7';
        /* top: green card (mod 2448, iPhone): #2BAD68, margin 9, radius 8,
           height 145. Two buttons — 收付款 (top1) and 钱包 (top2) + ¥money —
           both push the 钱包 page (mod 2659) via _onMoneyPress. */
        var top = document.createElement('div');
        top.style.cssText = 'background:#2BAD68;margin:9px 9px 0;border-radius:8px;height:145px;display:flex;flex-direction:row';
        [['收付款', 'new-wallet-icon-top1', null], ['钱包', 'new-wallet-icon-top2', '¥' + DB.wallet().balance]].forEach(function (t) {
          var b = document.createElement('button');
          b.type = 'button';
          b.style.cssText = 'flex:1;margin-top:35px;background:none;border:none;padding:0';
          var inner = document.createElement('div');
          inner.style.cssText = 'display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative';
          var ic = img(t[1]);
          inner.innerHTML = (ic ? '<img src="' + ic + '" style="width:35px;height:35px">' : '') +
            '<span style="font-size:17px;font-weight:500;color:#fff;margin-top:14px">' + esc(t[0]) + '</span>' +
            (t[2] ? '<span style="position:absolute;bottom:-21px;color:#9bd1b3;font-size:14px">' + esc(t[2]) + '</span>' : '');
          b.appendChild(inner);
          b.addEventListener('click', function () { nav().push('WechatPoketMoneyPage'); });
          top.appendChild(b);
        });
        wrap.appendChild(top);
        var openMore = !isNew && store().get('walletOpenMore', '0') === '1';
        sections.forEach(function (sec, si) {
          var s = document.createElement('div');
          s.className = 'wallet-section';
          s.innerHTML = '<div class="wallet-sec-title">' + esc(sec.section) + '</div>';
          var grid = document.createElement('div');
          grid.className = 'grid-3 wallet-grid';
          function addCell(it) {
            if (it.hide) return;
            var cell = document.createElement('div');
            cell.className = 'grid-cell';
            var src = walletIcon(it.icon);
            cell.innerHTML = (src ? '<img src="' + src + '">' : '<span style="width:30px;height:30px"></span>') +
              '<span>' + esc(it.text) + '</span>' + (it.sub ? '<span class="sub">' + esc(it.sub) + '</span>' : '');
            cell.addEventListener('click', function () { walletServiceTap(it); });
            grid.appendChild(cell);
          }
          if (!isNew && si === 0 && !openMore) {
            sec.items.slice(0, 9).forEach(addCell);
            var more = document.createElement('div');
            more.className = 'grid-cell';
            more.innerHTML = '<span style="font-size:22px;color:#999">...</span><span>更多服务</span>';
            more.addEventListener('click', function () {
              store().set('walletOpenMore', '1');
              nav().reset('WalletPage');
            });
            grid.appendChild(more);
          } else {
            sec.items.forEach(addCell);
          }
          s.appendChild(grid);
          wrap.appendChild(s);
          if (!isNew && si === 0 && openMore) {
            var less = document.createElement('button');
            less.type = 'button'; less.className = 'btn-primary'; less.textContent = '收起';
            less.addEventListener('click', function () {
              store().set('walletOpenMore', '0');
              nav().reset('WalletPage');
            });
            wrap.appendChild(less);
          }
        });
        return wrap;
      }
    };
  }

  /* ---------- 零钱 (WechatPoketMoneyPage) ---------- */
  function poketMoneyPage() {
    return {
      title: '零钱',
      render: function () {
        var w = DB.wallet();
        var wrap = document.createElement('div');
        wrap.style.background = '#fff';
        /* top icon 65x65, marginTop 50 (mod 2448 detailIcon) */
        var top = document.createElement('div');
        top.style.cssText = 'text-align:center;padding-top:50px';
        var ic = img('icon-wechat-wallet');
        top.innerHTML = (ic ? '<img src="' + ic + '" style="width:65px;height:65px;margin:0 auto">' : '') +
          '<div style="font-size:16px;color:#000;margin-top:34px">我的零钱</div>' +
          '<div id="pocket-balance" style="margin-top:8px;cursor:pointer"><span style="font-size:34px;font-weight:700">¥</span><span style="font-size:48px">' + esc(w.balance) + '</span></div>';
        top.querySelector('#pocket-balance').addEventListener('click', function () { nav().push('WechatMoneyDetailPage'); });
        wrap.appendChild(top);
        /* 充值 / 提现: two green buttons h47 #1aad19 (mod 2448 detailButton) */
        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:16px;padding:24px 16px 0';
        [['充值', function () {
          H().openDialog('充值', [{ label: '充值金额', key: 'amount', value: '100.00', numeric: true }], function (vals) {
            w.balance = (parseFloat(w.balance) + parseFloat(vals.amount || 0)).toFixed(2);
            DB.saveWallet(w); nav().reset('WechatPoketMoneyPage');
          });
        }], ['提现', function () { nav().push('WechatMoneyOutPage'); }]].forEach(function (t) {
          var b = document.createElement('button');
          b.type = 'button';
          b.style.cssText = 'flex:1;height:47px;background:#1aad19;color:#fff;font-size:16px;border-radius:4px';
          b.textContent = t[0];
          b.addEventListener('click', t[1]);
          btns.appendChild(b);
        });
        wrap.appendChild(btns);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('零钱明细', '', function () { nav().push('WechatMoneyDetailPage'); })
        ]));
        var foot = document.createElement('div');
        foot.style.cssText = 'text-align:center;padding:20px 16px 0';
        foot.innerHTML = '<div style="font-size:14px;color:#5b6a92;font-weight:500">常见问题 <span style="color:#868686;font-size:12px">|</span> 账户升级服务</div>' +
          '<div style="font-size:14px;color:#a4a4a2;margin-top:8px">本服务由财付通提供</div>';
        wrap.appendChild(foot);
        return wrap;
      }
    };
  }
  function moneyDetailPage() {
    return {
      title: '零钱明细',
      render: function () {
        var wrap = document.createElement('div');
        var rows = DB.walletDetail();
        if (!rows.length) {
          var e = document.createElement('div');
          e.style.cssText = 'height:100px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#999';
          e.textContent = '暂无记录';
          wrap.appendChild(e);
        }
        var list = document.createElement('div');
        list.className = 'row-list';
        rows.forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;align-items:center;padding:18px 20px 18px 20px;border-bottom:1px solid #e5e5e5;background:#fff';
          var mid = document.createElement('div');
          mid.style.cssText = 'flex:1';
          var t1 = document.createElement('div');
          t1.style.cssText = 'font-size:17px;color:#353535';
          t1.textContent = r.title || '';
          var d1 = document.createElement('div');
          d1.style.cssText = 'font-size:14px;color:#808080;margin-top:4px';
          var t = (r.time1 || r.time || '');
          var dm = t.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})/);
          d1.textContent = dm ? (parseInt(dm[2], 10) + '月' + parseInt(dm[3], 10) + '日 ' + dm[4]) : t;
          if (r.balance != null) {
            var bl = document.createElement('span');
            bl.textContent = '　零钱余额 ¥' + r.balance;
            d1.appendChild(bl);
          }
          mid.appendChild(t1); mid.appendChild(d1);
          var am = document.createElement('div');
          am.style.cssText = 'font-size:18px;color:' + (r.pay_type === 0 ? '#e4aa2c' : '#353535');
          am.textContent = (r.pay_type === 1 ? '−' : '+') + '¥' + (r.money || r.amount || '0.00');
          elx.appendChild(mid); elx.appendChild(am);
          elx.addEventListener('click', function () {
            var fields = [
              ['标题', r.title || ''], ['金额', '¥' + (r.money || r.amount || '')],
              ['时间', r.time1 || r.time || ''], ['交易单号', r.orderNo || ''],
              ['余额', r.balance ? ('¥' + r.balance) : ''], ['转入/转出', r.pay_type === 1 ? '转出' : '转入']
            ];
            var html = fields.map(function (f) {
              return '<div style="display:flex;padding:14px 0;border-bottom:1px solid #eee"><span style="width:80px;font-size:18px;color:#808080">' + esc(f[0]) + '</span><span style="flex:1;font-size:18px;font-weight:500;color:#333">' + esc(f[1]) + '</span></div>';
            }).join('');
            H().showAlert('详情', '');
            H().$('alert-body').innerHTML = html;
          });
          list.appendChild(elx);
        });
        wrap.appendChild(list);
        /* 点击添加零钱明细记录 (mod 2644 detailListItemAdd) */
        var add = document.createElement('div');
        add.style.cssText = 'height:60px;display:flex;align-items:center;justify-content:center;background:#fff;font-size:16px;color:#1ea1f3;border-top:1px solid #e5e5e5';
        add.textContent = '点击添加零钱明细记录';
        add.addEventListener('click', function () {
          H().openDialog('添加零钱明细记录', [
            { label: '标题', key: 'title', value: '微信支付' },
            { label: '金额', key: 'money', value: '100.00', numeric: true },
            { label: '时间', key: 'time1', value: H().nowTime() },
            { label: '交易单号', key: 'orderNo', value: '' },
            { label: '余额', key: 'balance', value: DB.wallet().balance },
            { label: '转入/转出', key: 'dir', value: '转出', type: 'select', options: ['转出', '转入'] }
          ], function (vals) {
            var rs = DB.walletDetail();
            rs.unshift({ title: vals.title, money: vals.money, pay_type: vals.dir === '转出' ? 1 : 0, status: vals.dir === '转出' ? '支付成功' : '已收钱', time1: vals.time1, balance: vals.balance, orderNo: vals.orderNo });
            DB.saveWalletDetail(rs);
            nav().reset('WechatMoneyDetailPage');
          });
        });
        wrap.appendChild(add);
        return wrap;
      }
    };
  }
  function transList(rows, kind) {
    var wrap = document.createElement('div');
    if (!rows.length) {
      var e = document.createElement('div');
      e.className = 'form-note';
      e.textContent = kind === 'alipay' ? '仅展示近1年的记录，更多记录可通过选择时间查找' : '暂无记录';
      wrap.appendChild(e);
      return wrap;
    }
    if (kind === 'alipay') {
      /* Alipay bill list (mod 2842): month headers with 支出/收入 totals,
         rows with 30px avatar, 20px amount (income #55b936), 13px date. */
      var byMonth = {};
      var order = [];
      rows.forEach(function (r) {
        var t = r.time1 || r.time || '';
        var key = t.slice(0, 7) || '未知';
        if (!byMonth[key]) { byMonth[key] = []; order.push(key); }
        byMonth[key].push(r);
      });
      var nowKey = new Date().toISOString().slice(0, 7);
      order.forEach(function (key) {
        var list = byMonth[key];
        var out = 0, inc = 0;
        list.forEach(function (r) {
          var v = parseFloat(r.money != null ? r.money : (r.amount || 0)) || 0;
          if (r.pay_type === 1) out += v; else inc += v;
        });
        var y = key.slice(0, 4), m = parseInt(key.slice(5, 7), 10);
        var head = document.createElement('div');
        head.style.cssText = 'background:#f8f8f8;padding:10px 15px;display:flex;align-items:baseline';
        head.innerHTML = '<span style="flex:1;font-size:14px;color:#333">' + (key === nowKey ? '本月' : y + '年' + m + '月') + '</span>' +
          '<span style="font-size:12px;color:#989898">支出 ￥' + out.toFixed(2) + '　收入 ￥' + inc.toFixed(2) + '</span>';
        wrap.appendChild(head);
        var lw = document.createElement('div');
        lw.className = 'row-list';
        list.forEach(function (r) {
          var amt = (r.money != null && r.money !== '') ? r.money : r.amount;
          var elx = document.createElement('div');
          elx.className = 'bill-row';
          var av = document.createElement('img');
          av.style.cssText = 'width:30px;height:30px;border-radius:15px;margin-right:17px;margin-top:16px;object-fit:cover;flex:none';
          av.src = avatarFor(r) || 'img/app_images_defaultface.png';
          var mid = document.createElement('div');
          mid.style.cssText = 'flex:1;padding:16px 0;border-bottom:1px solid #e5e5e5';
          var t1 = document.createElement('div');
          t1.style.cssText = 'font-size:15px;color:#333';
          t1.textContent = r.title || r.name || '';
          if (r.cat) {
            var tag = document.createElement('span');
            tag.style.cssText = 'color:#ef8935;font-size:12px;margin-left:6px';
            tag.textContent = r.cat;
            t1.appendChild(tag);
          }
          var d1 = document.createElement('div');
          d1.style.cssText = 'font-size:13px;color:#bbbbbb;margin-top:4px';
          d1.textContent = (r.time1 || r.time || '').slice(0, 16);
          mid.appendChild(t1); mid.appendChild(d1);
          var am = document.createElement('div');
          am.style.cssText = 'font-size:20px;color:' + (r.pay_type === 0 ? '#55b936' : '#000') + ';padding:16px 12px 16px 0;border-bottom:1px solid #e5e5e5;white-space:nowrap';
          am.textContent = amt ? ((r.pay_type === 1 ? '-' : '+') + '¥' + amt) : '';
          elx.appendChild(av); elx.appendChild(mid); elx.appendChild(am);
          elx.addEventListener('click', function () {
            var fields = [
              ['标题', r.title || r.name || ''], ['金额', amt ? ('¥' + amt) : ''],
              ['时间', r.time1 || r.time || ''], ['状态', r.status || ''],
              ['对方', r.to_from || ''], ['分类', r.cat || '']
            ];
            var html = fields.map(function (f) {
              return '<div style="display:flex;padding:14px 0;border-bottom:1px solid #eee"><span style="width:70px;font-size:18px;color:#808080">' + esc(f[0]) + '</span><span style="flex:1;font-size:18px;font-weight:500;color:#333">' + esc(f[1]) + '</span></div>';
            }).join('');
            H().showAlert('账单详情', '');
            H().$('alert-body').innerHTML = html;
          });
          lw.appendChild(elx);
        });
        wrap.appendChild(lw);
      });
      return wrap;
    }
    var list = document.createElement('div');
    rows.forEach(function (r) {
      var amt = (r.money != null && r.money !== '') ? r.money : r.amount;
      var elx = row(r.name || r.title || '', (amt != null && amt !== '') ? ('¥' + amt) : '', null);
      var sub = document.createElement('div');
      sub.style.cssText = 'color:#999;font-size:12px;margin-top:2px';
      sub.textContent = (r.time1 || r.time || '') + '  ' + (r.status || r.result || '');
      elx.querySelector('.row-label').appendChild(sub);
      list.appendChild(elx);
    });
    wrap.appendChild(list);
    return wrap;
  }
  function moneyOutPage() {
    return {
      title: '零钱提现',
      render: function () {
        var w = DB.wallet();
        var wrap = document.createElement('div');
        wrap.style.background = '#efeff4';
        /* 到账银行卡 row */
        var bank = document.createElement('div');
        bank.style.cssText = 'background:#fff;margin-top:20px;padding:14px;display:flex;align-items:center;gap:10px';
        bank.innerHTML = '<span style="width:36px;height:36px;border-radius:4px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:18px">🏦</span>' +
          '<span style="flex:1"><span style="display:block;font-size:16px;color:#333">' + esc(w.bank || '交通银行') + '(5627)</span>' +
          '<span style="display:block;font-size:13px;color:#999;margin-top:2px">2小时内到账</span></span><span style="color:#c8c8c8">›</span>';
        bank.addEventListener('click', function () {
          H().openDialog('编辑余额及银行卡', [
            { label: '到账银行卡', key: 'bank', value: w.bank || '交通银行' },
            { label: '银行卡尾号', key: 'tail', value: '5627' },
            { label: '提现到账时间', key: 'arrive', value: '2小时内到账' },
            { label: '零钱余额', key: 'balance', value: w.balance },
            { label: '提现费率(%)', key: 'fee', value: '0.1' }
          ], function (vals) {
            w.bank = vals.bank; w.balance = vals.balance; DB.saveWallet(w);
            nav().reset('WechatMoneyOutPage');
          });
        });
        wrap.appendChild(bank);
        /* amount input (¥ + 48px WeChatNum) */
        var amtWrap = document.createElement('div');
        amtWrap.style.cssText = 'background:#fff;margin-top:12px;padding:20px 16px';
        amtWrap.innerHTML = '<div style="font-size:14px;color:#333">提现金额</div>' +
          '<div style="display:flex;align-items:baseline;margin-top:12px"><span style="font-size:48px;font-family:WeChatNum">¥</span>' +
          '<input id="out-amount" inputmode="decimal" placeholder="0.00" style="flex:1;border:none;outline:none;font-size:48px;font-family:WeChatNum;color:#000;min-width:0"></div>' +
          '<div style="font-size:14px;color:#999;margin-top:12px">当前零钱余额' + esc(w.balance) + '元，<button type="button" id="out-all" style="color:#1ea1f3;font-size:14px">全部提现</button></div>';
        amtWrap.querySelector('#out-all').addEventListener('click', function () {
          amtWrap.querySelector('#out-amount').value = w.balance;
        });
        wrap.appendChild(amtWrap);
        /* fee line */
        var fee = document.createElement('div');
        fee.style.cssText = 'padding:12px 16px;font-size:13px;color:#999';
        fee.textContent = '提现费率 0.1%，最低 0.10 元';
        wrap.appendChild(fee);
        /* submit: green button h45 radius 5 #1aad19 */
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = 'display:block;width:calc(100% - 32px);margin:8px auto;height:45px;border-radius:5px;background:#1aad19;color:#fff;font-size:16px';
        btn.textContent = '提现';
        btn.addEventListener('click', function () {
          var v = parseFloat(amtWrap.querySelector('#out-amount').value);
          if (isNaN(v) || v <= 0) { H().showAlert('提示', '请输入正确的金额'); return; }
          if (v > parseFloat(w.balance)) { H().showAlert('提示', '提现金额不能大于零钱余额，请修改零钱余额'); return; }
          var f = Math.max(v * 0.001, 0.1).toFixed(2);
          H().showAlert('请输入支付密码', '提现 ¥' + v.toFixed(2) + '，手续费 ¥' + f + '（该密码为虚拟密码，不是真正的微信密码，请勿输入您的微信密码，随便输入即可，我们不会记录您的输入内容！）');
          var ok = H().$('alert-ok');
          ok.onclick = function () {
            H().$('alert-overlay').hidden = true;
            w.balance = (parseFloat(w.balance) - v).toFixed(2);
            DB.saveWallet(w);
            H().toast('提现申请已提交');
            nav().reset('WechatPoketMoneyPage');
          };
        });
        wrap.appendChild(btn);
        return wrap;
      }
    };
  }
  function walletLiPage() {
    return {
      title: '微粒贷',
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.background = '#eceded';
        var li = store().getJSON('wechatWalletLi', null) || { limit: '8500', total: '8500', rate: '0.045%', rateOld: '0.05%', notice: '关注微粒贷公众号，立即领取福利！', hideRateOld: false, hideNotice: false };
        /* notice banner (mod 2448 walletLiNotice) */
        if (!li.hideNotice) {
          var nb = document.createElement('div');
          nb.style.cssText = 'margin:26px 16px 0;background:#fff;border-radius:6px;padding:12px 14px;display:flex;align-items:center;gap:8px';
          nb.innerHTML = '<span style="font-size:16px">📢</span><span style="flex:1;font-size:14px;color:#e0bc4c">' + esc(li.notice) + '</span><span style="color:#999">›</span>';
          wrap.appendChild(nb);
        }
        /* 可借额度 (mod 2448 walletLiMoney): label 14 #909090, amount 48 */
        var amt = document.createElement('div');
        amt.style.cssText = 'text-align:center;padding:30px 16px 0';
        amt.innerHTML = '<div style="font-size:14px;color:#909090">可借额度</div>' +
          '<div style="margin-top:8px"><span style="font-size:48px">¥</span><span style="font-size:48px">' + esc(li.limit) + '</span></div>' +
          '<div style="font-size:14px;color:#909090;margin-top:12px">总额度 ¥ ' + esc(li.total) + '，日利率 ' + esc(li.rate) +
          (li.hideRateOld ? '' : '　<del>' + esc(li.rateOld) + '</del>') + '</div>';
        wrap.appendChild(amt);
        /* 借钱 button: 90x90 circle #e8bb2c (mod 2448 walletLiBtn) */
        var bb = document.createElement('button');
        bb.type = 'button';
        bb.style.cssText = 'display:block;width:90px;height:90px;border-radius:90px;background:#e8bb2c;color:#fff;font-size:18px;margin:27px auto 0';
        bb.textContent = '借钱';
        bb.addEventListener('click', function () { H().toast('借钱（本地暂未实现）'); });
        wrap.appendChild(bb);
        /* bottom links */
        var foot = document.createElement('div');
        foot.style.cssText = 'text-align:center;padding:30px 16px';
        foot.innerHTML = '<div style="font-size:14px;color:#566c91">借钱须知 | 常见问题</div>' +
          '<div style="font-size:14px;color:#a4a4a2;margin-top:8px">本服务由微众银行提供</div>';
        wrap.appendChild(foot);
        /* edit */
        var edit = document.createElement('button');
        edit.type = 'button';
        edit.style.cssText = 'display:block;width:calc(100% - 32px);margin:0 auto;height:45px;border-radius:5px;background:#fff;color:#1ea1f3;font-size:15px';
        edit.textContent = '编辑';
        edit.addEventListener('click', function () {
          H().openDialog('编辑微粒贷', [
            { label: '可借额度', key: 'limit', value: li.limit },
            { label: '总额度', key: 'total', value: li.total },
            { label: '通知消息文字', key: 'notice', value: li.notice },
            { label: '日利率', key: 'rate', value: li.rate },
            { label: '划线日利率', key: 'rateOld', value: li.rateOld },
            { label: '隐藏划线日利率', key: 'hideRateOld', value: !!li.hideRateOld, type: 'switch' },
            { label: '隐藏通知消息', key: 'hideNotice', value: !!li.hideNotice, type: 'switch' }
          ], function (vals) {
            Object.assign(li, vals, { hideRateOld: !!vals.hideRateOld, hideNotice: !!vals.hideNotice });
            store().setJSON('wechatWalletLi', li);
            nav().reset('WechatWalletLi');
          });
        });
        wrap.appendChild(edit);
        return wrap;
      }
    };
  }
  function walletTransPage() {
    return {
      title: '账单',
      right: { text: '常见问题', onClick: function () {
        H().showActionSheet([
          { title: '添加转账记录', onPress: function () { addWalletTransRecord('转账'); } },
          { title: '添加红包记录', onPress: function () { addWalletTransRecord('微信红包'); } },
          { title: '添加扫码记录', onPress: function () { addWalletTransRecord('微信支付'); } },
          { title: '添加商户记录', onPress: function () { addWalletTransRecord('商户'); } },
          { title: '添加提现记录', onPress: function () { addWalletTransRecord('提现'); } },
          { title: '添加转账到银行卡记录', onPress: function () { addWalletTransRecord('转账到银行卡'); } },
          { title: '添加赞赏码记录', onPress: function () { addWalletTransRecord('赞赏码'); } },
          { title: '随机添加', onPress: function () {
            var rs = DB.walletTrans();
            rs.unshift({ title: '微信支付', subTitle: '扫二维码付款', money: (Math.random() * 200).toFixed(2), pay_type: Math.random() > 0.5 ? 1 : 0, status: '支付成功', to_from: '随机', time1: H().nowTime() });
            DB.saveWalletTrans(rs);
            H().toast('已添加');
            nav().reset('WechatWalletTransPage');
          } }
        ]);
      } },
      render: function () {
        var rows = DB.walletTrans();
        var wrap = document.createElement('div');
        /* header filter (mod 2446 _renderHeader) */
        var head = document.createElement('div');
        head.style.cssText = 'background:#fff;height:44px;display:flex;align-items:center;padding:0 15px;gap:6px';
        head.innerHTML = '<span style="font-size:15px;color:#333">全部交易类型</span><span style="font-size:10px;color:#999">▼</span>';
        head.addEventListener('click', function () {
          H().showPicker('交易类型', ['全部交易类型', '转账', '红包', '扫码', '商户', '提现', '转账到银行卡', '赞赏码'], 0, function (label) {
            H().toast(label + '（本地暂未实现筛选）');
          });
        });
        wrap.appendChild(head);
        /* group by yyyy年M月 (mod 2446 SectionList) */
        var byMonth = {};
        var order = [];
        rows.forEach(function (r) {
          var t = r.time1 || r.time || '';
          var key = t.slice(0, 7) || '未知';
          if (!byMonth[key]) { byMonth[key] = []; order.push(key); }
          byMonth[key].push(r);
        });
        order.forEach(function (key) {
          var list = byMonth[key];
          var out = 0, inc = 0;
          list.forEach(function (r) {
            var v = parseFloat(r.money != null ? r.money : (r.amount || 0)) || 0;
            if (r.pay_type === 1) out += v; else inc += v;
          });
          var y = key.slice(0, 4), m = parseInt(key.slice(5, 7), 10);
          /* section header (mod 2448 transTopView): h80 bg #f6f6f6, date 16 #353535 */
          var sh = document.createElement('div');
          sh.style.cssText = 'height:80px;background:#f6f6f6;display:flex;align-items:center;padding:0 15px;gap:8px';
          sh.innerHTML = '<span style="flex:1;font-size:16px;color:#353535">' + y + '年' + m + '月</span>' +
            '<span style="font-size:13px;color:#999">支出 ¥' + out.toFixed(2) + '　收入 ¥' + inc.toFixed(2) + '</span>' +
            '<button type="button" style="font-size:14px;color:#1ea1f3">统计</button>';
          sh.querySelector('button').addEventListener('click', function () { nav().push('WechatWalletTransSumPage'); });
          sh.addEventListener('click', function (e) {
            if (e.target.tagName === 'BUTTON') return;
            H().openDialog('选择时间', [{ label: '年月（如 2021-01）', key: 'ym', value: key }], function (vals) {
              var k = vals.ym;
              if (!byMonth[k]) H().showAlert('提示', '你还没添加' + k.slice(0, 4) + '年' + parseInt(k.slice(5, 7), 10) + '月的数据，请点击右上角常见问题添加数据');
            });
          });
          wrap.appendChild(sh);
          var lw = document.createElement('div');
          lw.className = 'row-list';
          list.forEach(function (r) {
            var amt = (r.money != null && r.money !== '') ? r.money : r.amount;
            var elx = document.createElement('div');
            elx.style.cssText = 'display:flex;align-items:center;height:80px;padding-left:18px;background:#fff;border-bottom:1px solid #e5e5e5';
            var av = document.createElement('img');
            av.style.cssText = 'width:42px;height:42px;border-radius:21px;object-fit:cover;flex:none;margin-right:12px';
            av.src = avatarFor(r) || 'img/app_images_defaultface.png';
            var mid = document.createElement('div');
            mid.style.cssText = 'flex:1;min-width:0';
            var t1 = document.createElement('div');
            t1.style.cssText = 'font-size:16px;color:#333';
            t1.textContent = r.title || r.name || '';
            var d1 = document.createElement('div');
            d1.style.cssText = 'font-size:13px;color:#999;margin-top:4px';
            var t = (r.time1 || r.time || '');
            var dm = t.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}:\d{2})/);
            d1.textContent = dm ? (parseInt(dm[2], 10) + '月' + parseInt(dm[3], 10) + '日 ' + dm[4]) : t;
            mid.appendChild(t1); mid.appendChild(d1);
            var am = document.createElement('div');
            am.style.cssText = 'font-size:18px;color:#333;padding-right:16px;white-space:nowrap';
            am.textContent = amt ? ((r.pay_type === 1 ? '−' : '+') + '¥' + amt) : '';
            elx.appendChild(av); elx.appendChild(mid); elx.appendChild(am);
            lw.appendChild(elx);
          });
          wrap.appendChild(lw);
        });
        return wrap;
      }
    };
  }
  function addWalletTransRecord(kind) {
    H().openDialog('添加' + kind + '记录', [
      { label: '标题', key: 'title', value: kind },
      { label: '金额', key: 'money', value: '100.00', numeric: true },
      { label: '时间', key: 'time1', value: H().nowTime() },
      { label: '转入/转出', key: 'dir', value: '转出', type: 'select', options: ['转出', '转入'] },
      { label: '对方', key: 'to_from', value: '' }
    ], function (vals) {
      var rs = DB.walletTrans();
      rs.unshift({ title: vals.title, subTitle: kind, money: vals.money, pay_type: vals.dir === '转出' ? 1 : 0, status: vals.dir === '转出' ? '支付成功' : '已收钱', to_from: vals.to_from, time1: vals.time1 });
      DB.saveWalletTrans(rs);
      H().toast('已添加');
      nav().reset('WechatWalletTransPage');
    });
  }
  function walletTransSumPage() {
    return {
      title: '',
      render: function () {
        var rows = DB.walletTrans();
        var cur = store().get('transSumTab', '月账单');
        var curType = store().get('transSumType', '支出');
        var curDate = store().get('transSumDate', '2021-01');
        var wrap = document.createElement('div');
        /* tabs 月账单 / 年账单 */
        var tabs = document.createElement('div');
        tabs.style.cssText = 'height:44px;background:#fff;display:flex;border-bottom:1px solid #eee';
        ['月账单', '年账单'].forEach(function (t) {
          var tb = document.createElement('button');
          tb.type = 'button';
          tb.style.cssText = 'flex:1;font-size:16px;color:' + (cur === t ? '#1ea1f3' : '#333') + ';border-bottom:2px solid ' + (cur === t ? '#1ea1f3' : 'transparent');
          tb.textContent = t;
          tb.addEventListener('click', function () { store().set('transSumTab', t); nav().reset('WechatWalletTransSumPage'); });
          tabs.appendChild(tb);
        });
        wrap.appendChild(tabs);
        /* date selector */
        var dv = document.createElement('div');
        dv.style.cssText = 'height:50px;background:#fff;display:flex;align-items:center;padding:0 15px;gap:6px';
        var y = curDate.slice(0, 4), m = parseInt(curDate.slice(5, 7), 10);
        dv.innerHTML = '<span style="flex:1;font-size:16px;color:#333">' + (cur === '年账单' ? y + '年' : y + '年' + m + '月') + '</span><span style="font-size:12px;color:#999">▼</span>';
        dv.addEventListener('click', function () {
          H().openDialog('选择时间', [{ label: cur === '年账单' ? '年份（如 2021）' : '年月（如 2021-01）', key: 'd', value: cur === '年账单' ? y : curDate }], function (vals) {
            store().set('transSumDate', cur === '年账单' ? vals.d + '-01' : vals.d);
            nav().reset('WechatWalletTransSumPage');
          });
        });
        wrap.appendChild(dv);
        /* type toggle 支出/收入/其他 */
        var tg = document.createElement('div');
        tg.style.cssText = 'height:44px;background:#fff;display:flex;border-top:1px solid #eee';
        ['支出', '收入', '其他'].forEach(function (t) {
          var tb = document.createElement('button');
          tb.type = 'button';
          tb.style.cssText = 'flex:1;font-size:15px;color:' + (curType === t ? '#1ea1f3' : '#333');
          tb.textContent = t;
          tb.addEventListener('click', function () { store().set('transSumType', t); nav().reset('WechatWalletTransSumPage'); });
          tg.appendChild(tb);
        });
        wrap.appendChild(tg);
        /* filtered rows */
        var list = rows.filter(function (r) {
          var t = (r.time1 || r.time || '');
          if (cur === '月账单' && t.slice(0, 7) !== curDate) return false;
          if (cur === '年账单' && t.slice(0, 4) !== y) return false;
          if (curType === '支出') return r.pay_type === 1;
          if (curType === '收入') return r.pay_type === 0;
          return true;
        });
        var total = list.reduce(function (n, r) { return n + (parseFloat(r.money != null ? r.money : (r.amount || 0)) || 0); }, 0);
        /* summary line (tap -> edit total) */
        var sum = document.createElement('div');
        sum.style.cssText = 'background:#fff;padding:16px;text-align:center;font-size:16px;color:#333;border-top:1px solid #eee';
        sum.textContent = '共' + (curType === '支出' ? '支出' : curType === '收入' ? '收入' : '') + list.length + '笔，合计 ¥' + total.toFixed(2);
        sum.addEventListener('click', function () {
          H().openDialog('编辑合计', [{ label: '合计', key: 'total', value: total.toFixed(2), numeric: true }], function () { H().toast('已保存'); });
        });
        wrap.appendChild(sum);
        /* bar chart 支出/收入对比 (mod 2447 category colours) */
        var cats = [
          { name: '餐饮', color: '#69a2f8', v: 0 }, { name: '交通等', color: '#f5c543', v: 0 },
          { name: '亲属卡交易', color: '#ed7e5f', v: 0 }, { name: '群收款', color: '#f2a964', v: 0 },
          { name: '发红包', color: '#d8b857', v: 0 }, { name: '收红包', color: '#f5c668', v: 0 },
          { name: '收转账', color: '#69a2f8', v: 0 }, { name: '退款', color: '#ed7e5f', v: 0 },
          { name: '其他', color: '#999', v: 0 }
        ];
        function catOf(r) {
          var t = (r.title || '') + (r.subTitle || '');
          if (t.indexOf('红包') >= 0) return r.pay_type === 1 ? '发红包' : '收红包';
          if (t.indexOf('转账') >= 0) return r.pay_type === 1 ? '收转账' : '收转账';
          if (t.indexOf('美团') >= 0 || t.indexOf('大众') >= 0) return '餐饮';
          return '其他';
        }
        list.forEach(function (r) {
          var c = cats.filter(function (x) { return x.name === catOf(r); })[0] || cats[8];
          c.v += parseFloat(r.money != null ? r.money : (r.amount || 0)) || 0;
        });
        var max = Math.max.apply(null, cats.map(function (c) { return c.v; }).concat([1]));
        var chart = document.createElement('div');
        chart.style.cssText = 'background:#fff;margin-top:12px;padding:16px';
        chart.innerHTML = '<div style="font-size:16px;color:#333;margin-bottom:12px">支出/收入对比</div>';
        cats.filter(function (c) { return c.v > 0; }).forEach(function (c) {
          var r2 = document.createElement('div');
          r2.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:8px';
          r2.innerHTML = '<span style="width:70px;font-size:14px;color:#333">' + esc(c.name) + '</span>' +
            '<span style="height:16px;border-radius:2px;background:' + c.color + ';width:' + Math.max(4, Math.round(c.v / max * 200)) + 'px"></span>' +
            '<span style="font-size:14px;color:#666">¥' + c.v.toFixed(2) + '</span>';
          chart.appendChild(r2);
        });
        wrap.appendChild(chart);
        /* 排行榜 */
        var rank = document.createElement('div');
        rank.style.cssText = 'background:#fff;margin-top:12px;padding:14px 16px';
        rank.innerHTML = '<div style="display:flex;align-items:center"><span style="flex:1;font-size:16px;color:#333">排行榜</span><span style="font-size:14px;color:#1ea1f3">添加排行榜</span></div>';
        rank.querySelector('span:last-child').addEventListener('click', function () { H().toast('添加排行榜（本地暂未实现）'); });
        wrap.appendChild(rank);
        /* 记账本 banner */
        if (store().get('hideJizhangben') !== '1') {
          var jb = document.createElement('div');
          jb.style.cssText = 'background:#fff;margin-top:12px;padding:14px 16px;display:flex;align-items:center;gap:10px';
          jb.innerHTML = '<span style="flex:1;font-size:15px;color:#333">使用记账本，查看分类统计(餐饮、交通等）</span><span style="color:#999">›</span>';
          jb.addEventListener('click', function () { H().toast('记账本（本地暂未实现）'); });
          var hide = document.createElement('button');
          hide.type = 'button';
          hide.style.cssText = 'font-size:13px;color:#999;background:none';
          hide.textContent = '隐藏使用记账本';
          hide.addEventListener('click', function (e) { e.stopPropagation(); store().set('hideJizhangben', '1'); nav().reset('WechatWalletTransSumPage'); });
          jb.appendChild(hide);
          wrap.appendChild(jb);
        }
        return wrap;
      }
    };
  }
  /* ---------- 红包 (RedpacketPage) ---------- */
  function redpacketPage() {
    return {
      title: '发红包',
      navClass: 'redpacket',
      render: function (params) {
        var wrap = document.createElement('div');
        wrap.style.background = '#f1f1f1';
        var amt = { v: '' };
        /* big amount display: ¥ 26 + amount 48, #303030 (mod 2384) */
        var big = document.createElement('div');
        big.style.cssText = 'text-align:center;margin-top:30px';
        big.innerHTML = '<span style="font-size:26px;color:#303030">¥</span><span id="rp-big" style="font-size:48px;font-family:WeChatNum;color:#303030">0.00</span>';
        wrap.appendChild(big);
        /* amount row: h44 radius 4 bg #fff marginTop 7 */
        var row1 = document.createElement('div');
        row1.style.cssText = 'background:#fff;border-radius:4px;height:44px;margin:25px 16px 0;display:flex;align-items:center;padding:0 14px;gap:8px';
        row1.innerHTML = '<span style="font-size:16px;color:#333">金额</span>';
        var inp = document.createElement('input');
        inp.inputMode = 'decimal';
        inp.placeholder = '0.00';
        inp.style.cssText = 'flex:1;border:none;outline:none;text-align:right;font-size:16px;color:#000;min-width:0';
        var unit = document.createElement('span');
        unit.style.cssText = 'font-size:16px;color:#333';
        unit.textContent = '元';
        row1.appendChild(inp); row1.appendChild(unit);
        inp.addEventListener('input', function () {
          amt.v = inp.value;
          big.querySelector('#rp-big').textContent = inp.value || '0.00';
        });
        wrap.appendChild(row1);
        /* 留言 row */
        var row2 = document.createElement('div');
        row2.style.cssText = 'background:#fff;border-radius:4px;height:44px;margin:12px 16px 0;display:flex;align-items:center;padding:0 14px';
        var msg = document.createElement('input');
        msg.placeholder = '恭喜发财，大吉大利';
        msg.value = '恭喜发财，大吉大利';
        msg.style.cssText = 'flex:1;border:none;outline:none;font-size:16px;color:#000;min-width:0';
        row2.appendChild(msg);
        wrap.appendChild(row2);
        /* 塞钱进红包: #ea5f39 radius 6 h47 marginHorizontal 45 marginTop 15 */
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = 'display:block;width:calc(100% - 90px);margin:15px auto 0;height:47px;border-radius:6px;background:#ea5f39;color:#fff;font-size:16px';
        btn.textContent = '塞钱进红包';
        btn.addEventListener('click', function () {
          var v = parseFloat(inp.value);
          if (isNaN(v) || v <= 0) { H().showAlert('提示', '请输入正确的金额'); return; }
          /* result states (mod 2382): 待对方领取 / 对方已领取 / 我已领取 */
          H().showActionSheet([
            { title: '待对方领取', onPress: function () { H().toast('红包已发送，待对方领取'); nav().pop(); } },
            { title: '对方已领取', onPress: function () { H().toast('对方已领取红包'); nav().pop(); } },
            { title: '我已领取', onPress: function () { H().toast('你已领取红包'); nav().pop(); } },
            { title: '返回上一页', onPress: function () { nav().pop(); } }
          ]);
        });
        wrap.appendChild(btn);
        var tip = document.createElement('div');
        tip.style.cssText = 'text-align:center;font-size:14px;color:#888888;margin:28px 0';
        tip.textContent = '可直接使用收到的零钱发红包';
        wrap.appendChild(tip);
        return wrap;
      }
    };
  }
  /* ---------- 收付款 / 转账 (WeChat) ---------- */
  function chatPayPage() {
    var r = function (a, b) { return Math.floor(a + Math.random() * (b - a + 1)); };
    return chatPage({
      title: '微信支付', kind: 'wechat', assistantName: '微信支付',
      assistantSeed: '微信支付收款69.00元',
      deleteText: '删除微信支付',
      assistantMenu: [
        { label: '商家付款入账通知', fields: ['金额', '入账账户', '付款商户', '入账详情', '入账时间', '显示入账时间'], defaults: { '金额': r(1, 200) + '.00' } },
        { label: '收款到账通知', fields: ['金额', '收款笔数', '收款总金额', '备注', '付款方备注'], defaults: { '金额': r(1, 200) + '.00', '收款笔数': r(1, 20), '收款总金额': r(100, 1000) + '.00' } },
        { label: '扫码支付', fields: ['金额', '付款方', '备注'], defaults: { '金额': r(1, 200) + '.00' } },
        { label: '商户支付', fields: ['金额', '商户', '备注'], defaults: { '金额': r(1, 200) + '.00' } },
        { label: '微信提现', fields: ['提现金额', '提现银行', '是否已经到账', '提现时间', '预计到账时间', '到账时间'], defaults: { '提现金额': r(200, 9000) + '.00', '提现银行': '交通银行(5627)' } },
        { label: '转账到银行卡', fields: ['转账金额', '收款方', '收款账号', '发起时间', '预计到账时间', '到账时间', '备注', '是否已经到账'], defaults: { '转账金额': r(200, 9000) + '.00' } },
        { label: '编辑底部菜单', editMenu: true }
      ]
    });
  }
  function chatShoukuanPage() {
    var r = function (a, b) { return Math.floor(a + Math.random() * (b - a + 1)); };
    return chatPage({
      title: '微信收款助手', kind: 'wechat', assistantName: '微信收款助手',
      assistantSeed: '微信支付收款69.00元',
      deleteText: '删除微信收款助手',
      assistantMenu: [
        { label: '收款到账通知', fields: ['金额', '收款笔数', '收款总金额', '备注', '付款方备注', '收款时间', '查看经营报表右侧文字', '兑换免费提现额度'], defaults: { '金额': r(1, 200) + '.00', '收款笔数': r(1, 20), '收款总金额': r(100, 1000) + '.00' } },
        { label: '收款日报', fields: ['昨日收款总额', '二维码收款日报'], defaults: { '昨日收款总额': r(100, 1000) + '.00' } },
        { label: '收款周报', fields: ['上周收款总额', '二维码收款周报'], defaults: { '上周收款总额': r(500, 5000) + '.00' } },
        { label: '小成就', fields: ['累计收款'], defaults: { '累计收款': r(1000, 10000) + '.00' } },
        { label: '编辑底部菜单', editMenu: true }
      ]
    });
  }
  function transferPage() {
    var r = function (a, b) { return Math.floor(a + Math.random() * (b - a + 1)); };
    return chatPage({
      title: '微信转账助手', kind: 'wechat', assistantName: '微信转账助手',
      assistantSeed: '转账收款汇总通知',
      deleteText: '删除微信转账助手',
      assistantMenu: [
        { label: '添加转账收款汇总通知', fields: ['今日收款总额', '汇总', '详情'], defaults: { '今日收款总额': r(1000, 10000) + '.00', '汇总': '今日收款' + r(1, 20) + '笔', '详情': '最新一笔由对方转账' + r(1, 200) + '元，点击查看详情' } },
        { label: '编辑底部菜单', editMenu: true }
      ]
    });
  }
  function toTransferPage() {
    return {
      title: '转账',
      render: function (params) {
        var wrap = document.createElement('div');
        wrap.style.background = '#efeff4';
        var rec = { name: (params && params.name) || 'Mars', avatar: (params && params.avatar) || 2, realName: '', note: '转账', limitText: '' };
        /* recipient: avatar 40x40 radius 2, nickname 16 bold (mod 2357) */
        var user = document.createElement('div');
        user.style.cssText = 'display:flex;align-items:center;gap:10px;padding:20px 16px 0';
        var av = document.createElement('img');
        av.style.cssText = 'width:40px;height:40px;border-radius:2px;object-fit:cover';
        av.src = avatarFor(rec);
        var nm = document.createElement('span');
        nm.style.cssText = 'font-size:16px;font-weight:700;color:#000';
        nm.textContent = rec.name;
        user.appendChild(av); user.appendChild(nm);
        user.addEventListener('click', function () {
          H().openDialog('编辑信息', [
            { label: '头像', key: 'avatar', value: String(rec.avatar) },
            { label: '昵称', key: 'name', value: rec.name },
            { label: '真实姓名', key: 'realName', value: rec.realName },
            { label: '转账说明', key: 'note', value: rec.note },
            { label: '转账限额文字', key: 'limitText', value: rec.limitText }
          ], function (vals) {
            rec.name = vals.name; rec.realName = vals.realName; rec.note = vals.note; rec.limitText = vals.limitText;
            rec.avatar = parseInt(vals.avatar, 10) || 2;
            nm.textContent = rec.name;
            av.src = avatarFor(rec);
          });
        });
        wrap.appendChild(user);
        /* 转账金额 label 14 marginTop 30; ¥ + input 48 WeChatNum 700 */
        var amtWrap = document.createElement('div');
        amtWrap.style.cssText = 'padding:30px 16px 0';
        amtWrap.innerHTML = '<div style="font-size:14px;color:#333">转账金额</div>' +
          '<div style="display:flex;align-items:baseline;margin-top:8px"><span style="font-size:48px;font-family:WeChatNum;font-weight:700">¥</span>' +
          '<input id="tt-amount" inputmode="decimal" placeholder="0.00" style="flex:1;border:none;outline:none;background:transparent;font-size:48px;font-family:WeChatNum;font-weight:700;color:#000;min-width:0"></div>' +
          '<div id="tt-unit" style="font-size:14px;color:#999;margin-top:6px"></div>';
        var inp = amtWrap.querySelector('#tt-amount');
        var unitEl = amtWrap.querySelector('#tt-unit');
        /* live Chinese unit (mod 2354 _onChangeText) */
        inp.addEventListener('input', function () {
          var v = parseFloat(inp.value) || 0;
          var u = '';
          if (v >= 100000000) u = '亿';
          else if (v >= 10000000) u = '千万';
          else if (v >= 1000000) u = '百万';
          else if (v >= 100000) u = '十万';
          else if (v >= 10000) u = '万';
          else if (v >= 1000) u = '千';
          unitEl.textContent = u ? ('¥' + v.toFixed(2) + '（' + u + '）') : '';
        });
        wrap.appendChild(amtWrap);
        /* 添加转账说明 */
        var noteRow = document.createElement('div');
        noteRow.style.cssText = 'margin:16px;background:#fff;border-radius:4px;height:44px;display:flex;align-items:center;padding:0 14px';
        noteRow.innerHTML = '<span style="font-size:15px;color:#333">添加转账说明</span><span style="flex:1;text-align:right;font-size:15px;color:#999">' + esc(rec.note) + '</span>';
        noteRow.addEventListener('click', function () {
          H().openDialog('添加转账说明', [{ label: '转账说明', key: 'note', value: rec.note }], function (vals) {
            rec.note = vals.note;
            noteRow.querySelector('span:last-child').textContent = rec.note;
          });
        });
        wrap.appendChild(noteRow);
        /* 转账 button: h47 w184 marginTop 70 bg #1ebf64 text 18 bold (mod 2357) */
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = 'display:block;width:184px;height:47px;margin:70px auto 0;border-radius:4px;background:#1ebf64;color:#fff;font-size:18px;font-weight:700';
        btn.textContent = '转账';
        btn.addEventListener('click', function () {
          var v = parseFloat(inp.value);
          if (isNaN(v) || v <= 0) { H().showAlert('提示', '请输入正确的金额'); return; }
          if (/[敏感违禁]/.test(rec.name)) { H().showAlert('提示', '用户昵称中含敏感词语，请点击头像进去修改昵称'); return; }
          if (v > 200000) {
            H().showAlert('提示', '零钱支付已超过法律规定的每年20万元上限。请换用银行卡支付，零钱资金可提现或明年使用');
            return;
          }
          /* password sheet (mod 2357): 请输入支付密码 + 6 dot boxes + guide */
          H().showAlert('请输入支付密码', '转账 ¥' + v.toFixed(2) + ' 给 ' + rec.name + '。该密码为虚拟密码，不是真正的微信密码，请勿输入您的微信密码，随便输入即可，我们不会记录您的输入内容！');
          var ok = H().$('alert-ok');
          ok.textContent = '关闭';
          ok.onclick = function () {
            H().$('alert-overlay').hidden = true;
            ok.textContent = '确认';
            /* success sheet: 转账成功（更多7个页面） */
            H().showActionSheet([
              { title: '付款成功页面', onPress: function () { H().toast('已转账 ¥' + v.toFixed(2)); nav().pop(); } },
              { title: '待对方确认收款', onPress: function () { H().toast('待对方确认收款'); nav().pop(); } },
              { title: '对方已收款', onPress: function () { H().toast('对方已收款'); nav().pop(); } },
              { title: '对方已退还', onPress: function () { H().toast('对方已退还'); nav().pop(); } },
              { title: '扫码转账成功（个人）', onPress: function () { H().toast('扫码转账成功（个人）'); nav().pop(); } },
              { title: '扫码转账成功（商户）', onPress: function () { H().toast('扫码转账成功（商户）'); nav().pop(); } }
            ]);
          };
        });
        wrap.appendChild(btn);
        return wrap;
      }
    };
  }
  function groupSendPage() {
    return chatPage({
      title: '群发助手', kind: 'wechat', assistantName: '群发助手',
      deleteText: '删除微信群发助手',
      bottomButton: { label: '新建群发', onClick: function () {
        var users = DB.dialogs().filter(function (d) { return !d.isGroup; }).map(function (d) { return d.name; });
        if (!users.length) { H().toast('暂无对话用户'); return; }
        H().showPicker('选择群发用户', users, -1, function (label) {
          H().openDialog('新建群发', [{ label: '群发内容', key: 'content', value: '' }], function (vals) {
            if (!vals.content) return;
            var ds = DB.dialogs();
            var target = null;
            for (var i = 0; i < ds.length; i++) if (ds[i].name === label) target = ds[i];
            if (target) {
              target.messages = target.messages || [];
              target.messages.push({ isMe: true, type: 'text', content: vals.content });
              target.preview = vals.content;
              target.time = H().nowTime();
            }
            var gs = null;
            for (var j = 0; j < ds.length; j++) if (ds[j].name === '群发助手') gs = ds[j];
            if (gs) {
              gs.messages = gs.messages || [];
              gs.messages.push({ isMe: true, type: 'groupsend', content: vals.content });
              gs.preview = vals.content;
              gs.time = H().nowTime();
            }
            DB.saveDialogs(ds);
            H().toast('已群发');
            nav().reset('WechatChatGroupSendPage');
          });
        });
      } }
    });
  }
  function callPage(kind) {
    return {
      title: '',
      noNav: true,
      render: function (params) {
        var name = (params && params.name) || '对方';
        var avSrc = avatarFor(params && params.avatar);
        var call = store().getJSON('wechatCall', null) || { voiceTime: '00:00', voiceTips: '对方正在忙线中', showVoiceTips: false, silence: false, holdOn: false, showStatusBar: true };
        var wrap = document.createElement('div');
        wrap.style.cssText = 'position:relative;height:100%;color:#fff;overflow:hidden;background:#000';
        /* blurred avatar background (mod 2732 mainBg) */
        var bg = document.createElement('div');
        bg.style.cssText = 'position:absolute;inset:0;background-image:url(' + avSrc + ');background-size:cover;background-position:center;filter:blur(24px) brightness(.6);transform:scale(1.15)';
        var ov = document.createElement('div');
        ov.style.cssText = 'position:absolute;inset:0;background:rgba(40,40,40,.8)';
        wrap.appendChild(bg); wrap.appendChild(ov);
        /* close button top-left */
        var close = document.createElement('button');
        close.type = 'button';
        close.style.cssText = 'position:absolute;top:20px;left:16px;z-index:3;color:#fff;font-size:24px;background:none';
        close.textContent = '✕';
        close.addEventListener('click', function () { nav().pop(); });
        wrap.appendChild(close);
        /* centred block: avatar 128 radius 5, name 28 (mod 2731) */
        var mid = document.createElement('div');
        mid.style.cssText = 'position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;padding-top:calc((100vh - 250px)/2 - 100px)';
        var av = document.createElement('img');
        av.src = avSrc;
        av.style.cssText = 'width:128px;height:128px;border-radius:5px;object-fit:cover';
        var nm = document.createElement('div');
        nm.style.cssText = 'font-size:28px;color:#fff;margin-top:25px';
        nm.textContent = name;
        mid.appendChild(av); mid.appendChild(nm);
        if (kind === 'video' && call.showVoiceTips) {
          var tips = document.createElement('div');
          tips.style.cssText = 'font-size:14px;color:#ddd;margin-top:10px';
          tips.textContent = call.voiceTips;
          mid.appendChild(tips);
        }
        if (kind === 'voice') {
          var tm = document.createElement('div');
          tm.style.cssText = 'font-size:16px;color:#fff;height:30px;margin-top:10px';
          tm.textContent = call.voiceTime;
          mid.appendChild(tm);
        }
        wrap.appendChild(mid);
        /* footer buttons (mod 2731 footerImage 73x73 + label 12) */
        var foot = document.createElement('div');
        foot.style.cssText = 'position:absolute;left:0;right:0;bottom:50px;z-index:2;display:flex;justify-content:space-around';
        function fbtn(label, glyph, onPress, red) {
          var b = document.createElement('button');
          b.type = 'button';
          b.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:6px;color:#fff;font-size:12px;background:none';
          b.innerHTML = '<span style="width:73px;height:73px;border-radius:50%;background:' + (red ? '#FA5151' : 'rgba(255,255,255,.18)') + ';display:flex;align-items:center;justify-content:center;font-size:30px">' + glyph + '</span>' + esc(label);
          b.addEventListener('click', onPress);
          return b;
        }
        if (kind === 'voice') {
          foot.appendChild(fbtn(call.silence ? '取消静音' : '静音', '🔇', function () {
            call.silence = !call.silence; store().setJSON('wechatCall', call); nav().reset('WechatVideoVoicePage', params || {});
          }));
          foot.appendChild(fbtn('挂断', '✕', function () { nav().pop(); }, true));
          foot.appendChild(fbtn(call.holdOn ? '取消免提' : '免提', '🔊', function () {
            call.holdOn = !call.holdOn; store().setJSON('wechatCall', call); nav().reset('WechatVideoVoicePage', params || {});
          }));
        } else {
          foot.appendChild(fbtn('拒绝', '✕', function () { nav().pop(); }, true));
          var sp = document.createElement('div');
          sp.style.flex = '1';
          foot.appendChild(sp);
          foot.appendChild(fbtn('接听', '📞', function () { H().toast('已接听'); nav().pop(); }));
        }
        wrap.appendChild(foot);
        /* tap avatar/name -> edit form */
        mid.addEventListener('click', function () {
          var fields = [
            { label: '名字', key: 'name', value: name },
            { label: '头像', key: 'avatar', value: String((params && params.avatar) || 2) }
          ];
          if (kind === 'voice') {
            fields.push({ label: '通话时间(秒为单位)', key: 'voiceTime', value: call.voiceTime });
            fields.push({ label: '静音', key: 'silence', value: !!call.silence, type: 'switch' });
            fields.push({ label: '免提', key: 'holdOn', value: !!call.holdOn, type: 'switch' });
          } else {
            fields.push({ label: '提示文字', key: 'voiceTips', value: call.voiceTips });
            fields.push({ label: '显示提示文字', key: 'showVoiceTips', value: !!call.showVoiceTips, type: 'switch' });
          }
          fields.push({ label: '显示状态栏', key: 'showStatusBar', value: !!call.showStatusBar, type: 'switch' });
          H().openDialog('编辑', fields, function (vals) {
            call.voiceTime = vals.voiceTime || call.voiceTime;
            call.voiceTips = vals.voiceTips || call.voiceTips;
            if (vals.silence !== undefined) call.silence = !!vals.silence;
            if (vals.holdOn !== undefined) call.holdOn = !!vals.holdOn;
            if (vals.showVoiceTips !== undefined) call.showVoiceTips = !!vals.showVoiceTips;
            if (vals.showStatusBar !== undefined) call.showStatusBar = !!vals.showStatusBar;
            store().setJSON('wechatCall', call);
            nav().reset(kind === 'voice' ? 'WechatVideoVoicePage' : 'WechatVideoVoiceInPage', { name: vals.name, avatar: parseInt(vals.avatar, 10) || 2 });
          });
        });
        return wrap;
      }
    };
  }
  function taobaoItemPage() {
    return {
      title: '订单详情',
      render: function () {
        var wrap = document.createElement('div');
        var status = 2; /* 0 买家已付款 / 1 卖家已发货 / 2 交易成功 */
        var statusText = ['买家已付款', '卖家已发货', '交易成功'][status];
        /* status header h100 with bg image, status 18 #fff, sub 12 #fff */
        var head = document.createElement('div');
        head.style.cssText = 'height:100px;background:linear-gradient(135deg,#ff5000,#ff7a45);color:#fff;padding:20px 16px';
        head.innerHTML = '<div style="font-size:18px">' + statusText + '</div>' +
          '<div style="font-size:12px;margin-top:6px;opacity:.9">感谢您的购买，期待再次光临</div>';
        wrap.appendChild(head);
        /* logistics card: bg #fff radius 6 marginHorizontal 10 height 81 */
        var log = document.createElement('div');
        log.style.cssText = 'background:#fff;border-radius:6px;margin:10px;height:81px;display:flex;align-items:center;gap:10px;padding:0 14px';
        log.innerHTML = '<span style="width:36px;height:36px;border-radius:50%;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:18px">🚚</span>' +
          '<span style="flex:1"><span style="display:block;font-size:18px;font-weight:500;color:#333">已签收</span>' +
          '<span style="display:block;font-size:14px;color:#999;margin-top:2px">您的订单已签收</span></span>' +
          '<button type="button" style="width:90px;height:30px;border-radius:15px;border:1px solid #999;font-size:14px;color:#666">查看物流</button>';
        wrap.appendChild(log);
        /* address block h88 */
        var addr = document.createElement('div');
        addr.style.cssText = 'background:#fff;height:88px;display:flex;align-items:center;gap:10px;padding:0 14px;margin:0 10px;border-radius:6px';
        addr.innerHTML = '<span style="font-size:32px">📍</span>' +
          '<span style="flex:1"><span style="display:block;font-size:14px;color:#333">马克_SHI　138****1234</span>' +
          '<span style="display:block;font-size:14px;color:#333;margin-top:2px">广东省东莞市樟木头镇</span>' +
          '<span style="display:block;font-size:12px;color:#999;margin-top:2px">配送时间：工作日</span></span>';
        wrap.appendChild(addr);
        /* shop row */
        var shop = document.createElement('div');
        shop.style.cssText = 'background:#fff;margin:10px 10px 0;padding:12px 14px;display:flex;align-items:center;gap:8px';
        shop.innerHTML = '<span style="font-size:16px">🏬</span><span style="font-size:16px;font-weight:700;color:#333">一家专做饺子的店（樟木头店）</span>';
        wrap.appendChild(shop);
        /* goods: image 90x90 radius 6, title 13 #0a1a27, spec 12 #999,
           七天无理由退换 label, price 14 #3e4244, qty 12 #999 */
        var goods = document.createElement('div');
        goods.style.cssText = 'background:#f7f7f7;margin:0 10px;padding:12px 14px;display:flex;gap:10px';
        goods.innerHTML = '<img src="img/app_images_defaultface.png" style="width:90px;height:90px;border-radius:6px;background:#ccc;object-fit:cover">' +
          '<span style="flex:1"><span style="display:block;font-size:13px;color:#0a1a27">水饺（猪肉白菜）500g</span>' +
          '<span style="display:block;font-size:12px;color:#999;margin-top:4px">规格：500g/袋</span>' +
          '<span style="display:inline-block;background:#fcf1ec;color:#eb602c;font-size:10px;padding:2px 6px;border-radius:2px;margin-top:6px">七天无理由退换</span></span>' +
          '<span style="text-align:right"><span style="display:block;font-size:14px;color:#3e4244">¥13.30</span>' +
          '<span style="display:block;font-size:12px;color:#999;margin-top:4px">×1</span></span>';
        wrap.appendChild(goods);
        /* breakdown rows */
        var br = document.createElement('div');
        br.style.cssText = 'background:#fff;margin:0 10px;padding:8px 14px';
        [['商品总价', '¥13.30'], ['运费', '¥0.00'], ['实付款', '¥13.30']].forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;padding:6px 0';
          elx.innerHTML = '<span style="width:90px;text-align:right;font-size:12px;color:#999">' + esc(r[0]) + '</span>' +
            '<span style="flex:1;text-align:right;font-size:14px;color:' + (r[0] === '实付款' ? '#eb5d2a' : '#3e4245') + '">' + esc(r[1]) + '</span>';
          br.appendChild(elx);
        });
        wrap.appendChild(br);
        /* 订单信息 */
        var info = document.createElement('div');
        info.style.cssText = 'background:#fff;margin:10px;padding:12px 14px';
        info.innerHTML = '<div style="display:flex;align-items:center"><span style="flex:1;font-size:16px;color:#111">订单信息</span><span style="font-size:12px;color:#999">查看更多 ›</span></div>' +
          [['订单编号', '2021111500000001'], ['创建时间', '2021-11-15 15:26:00'], ['付款时间', '2021-11-15 15:26:10']].map(function (r) {
            return '<div style="display:flex;padding:8px 0;border-top:1px solid #f5f5f5"><span style="width:90px;font-size:13px;color:#999">' + esc(r[0]) + '</span><span style="flex:1;font-size:13px;color:#111">' + esc(r[1]) + '</span></div>';
          }).join('');
        wrap.appendChild(info);
        /* 交易快照 / 投诉商家 / 联系卖家 / 拨打电话 */
        var acts = document.createElement('div');
        acts.style.cssText = 'background:#fff;margin:0 10px 10px;padding:4px 14px';
        ['交易快照', '投诉商家', '联系卖家', '拨打电话'].forEach(function (t) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;height:44px;align-items:center;border-bottom:1px solid #f5f5f5';
          elx.innerHTML = '<span style="flex:1;font-size:13px;color:#111">' + esc(t) + '</span><span style="color:#c8c8c8">›</span>';
          elx.addEventListener('click', function () { H().toast(t + '（本地暂未实现）'); });
          acts.appendChild(elx);
        });
        wrap.appendChild(acts);
        /* bottom bar h50: buttons 80x28 radius 14 border #ccc text 12 #666,
           primary #ec612a */
        var bar = document.createElement('div');
        bar.style.cssText = 'flex:none;height:50px;background:#fff;border-top:1px solid #eee;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:0 12px';
        [['加入购物车', false], ['卖了换钱', false], ['申请售后', false], ['确认收货', true], ['追加评论', false], ['申请开票', false]].forEach(function (t) {
          var b = document.createElement('button');
          b.type = 'button';
          b.style.cssText = 'width:80px;height:28px;border-radius:14px;border:1px solid ' + (t[1] ? '#ec612a' : '#ccc') + ';color:' + (t[1] ? '#ec612a' : '#666') + ';font-size:12px;background:#fff';
          b.textContent = t[0];
          b.addEventListener('click', function () { H().toast(t[0] + '（本地暂未实现）'); });
          bar.appendChild(b);
        });
        wrap.appendChild(bar);
        return wrap;
      }
    };
  }

  /* ---------- 支付宝 ---------- */
  function alipayHomePage() {
    return {
      title: '支付宝',
      navClass: 'alipay',
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;height:100%';
        var tab = store().get('alipayHomeTab', '我的');
        var body = document.createElement('div');
        body.className = 'scroll';
        body.style.flex = '1';
        var b = DB.alipayBalance();
        if (tab === '我的') {
          /* 我的 tab (mod 2818): hero amount 32 #fefefe, label 14 #b9d2fb */
          var hero = document.createElement('div');
          hero.style.cssText = 'background:#1678ff;padding:20px 16px';
          hero.innerHTML = '<div style="font-size:14px;color:#b9d2fb">总金额(元)</div>' +
            '<div style="font-size:32px;color:#fefefe;margin-top:4px">' + esc(b.balance) + '</div>' +
            '<div style="font-size:13px;color:#b9d2fb;margin-top:10px">账户安全保障中 · 免费领取万元保障</div>';
          body.appendChild(hero);
          var rows = [
            ['余额', '¥' + b.balance, 'AlipayBalancePage'], ['余额宝', '', 'AlipayBalanceNewPage'],
            ['花呗', '', null], ['余利宝', '', null], ['银行卡', '', 'bankManage'],
            ['蚂蚁财富', '', null], ['芝麻信用', '', null], ['蚂蚁保险', '', null],
            ['相互宝', '', null], ['网商贷', '', null], ['网商银行', '', null]
          ];
          var lw = document.createElement('div');
          lw.className = 'row-list';
          rows.forEach(function (r) {
            lw.appendChild(row(r[0], r[1], function () {
              if (r[2]) nav().push(r[2]);
              else H().toast(r[0] + '（本地暂未实现）');
            }));
          });
          body.appendChild(lw);
          body.appendChild(gap());
          var lw2 = document.createElement('div');
          lw2.className = 'row-list';
          [['我的小程序', null], ['支付宝公益', null], ['娱乐宝', null], ['我的客服', 'helpStub']].forEach(function (r) {
            lw2.appendChild(row(r[0], '', function () {
              if (r[1]) nav().push(r[1], { title: r[0] });
              else H().toast(r[0] + '（本地暂未实现）');
            }));
          });
          body.appendChild(lw2);
        } else if (tab === '首页') {
          var card = document.createElement('div');
          card.style.cssText = 'background:#1678ff;color:#fff;padding:20px 16px';
          card.innerHTML = '<div style="font-size:14px;color:#b9d2fb">总资产（元）</div><div style="font-size:32px;color:#fefefe;margin-top:4px">' + esc(b.balance) + '</div>';
          body.appendChild(card);
          body.appendChild(gap());
          var lw3 = document.createElement('div');
          lw3.className = 'row-list';
          [['扫一扫', null], ['付钱', null], ['收钱', 'AlipaySoundPage'], ['转账', 'AlipayTransferPage'], ['账单', 'AlipayBillPage']].forEach(function (r) {
            lw3.appendChild(row(r[0], '', function () {
              if (r[1]) nav().push(r[1]);
              else H().toast(r[0] + '（本地暂未实现）');
            }));
          });
          body.appendChild(lw3);
        } else {
          var stub = document.createElement('div');
          stub.className = 'form-note';
          stub.textContent = tab + '（本地暂未实现）';
          body.appendChild(stub);
        }
        wrap.appendChild(body);
        /* 5-tab shell (mod 2751 barColor #1678ff; mod 2950: icon 26/27,
           title 10 #666, active #3875f6, badge h16); default 我的 */
        var bar = document.createElement('div');
        bar.style.cssText = 'flex:none;height:54px;background:#fefefe;border-top:1px solid #eee;display:flex';
        [['首页', '🏠'], ['理财', '📈'], ['口碑', '🍜'], ['朋友', '👥'], ['我的', '👤']].forEach(function (t) {
          var b2 = document.createElement('button');
          b2.type = 'button';
          b2.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:' + (tab === t[0] ? '#3875f6' : '#666');
          b2.innerHTML = '<span style="font-size:26px;line-height:1">' + t[1] + '</span><span style="font-size:10px">' + t[0] + '</span>';
          b2.addEventListener('click', function () {
            store().set('alipayHomeTab', t[0]);
            nav().reset('AlipayHomePage');
          });
          bar.appendChild(b2);
        });
        wrap.appendChild(bar);
        return wrap;
      }
    };
  }
  function alipayContactPage() {
    return {
      title: '通讯录',
      navClass: 'alipay',
      right: { text: '+', onClick: function () { alipayContactAddMenu(); } },
      render: function () {
        var me = DB.me();
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;height:100%';
        var main = document.createElement('div');
        main.className = 'scroll';
        main.style.flex = '1';
        /* search bar h44 bg #fff, input bg #f2f2f2, title 搜索 */
        var search = document.createElement('div');
        search.style.cssText = 'height:44px;background:#fff;padding:6px 12px';
        search.innerHTML = '<div style="background:#f2f2f2;border-radius:6px;height:32px;display:flex;align-items:center;justify-content:center;color:#999;font-size:14px">🔍 搜索</div>';
        main.appendChild(search);
        /* blue Me header h83 bg #1678ff, avatar 60x60 radius 3, name 18 #fff, level badge 22x22 */
        var head = document.createElement('div');
        head.style.cssText = 'height:83px;background:#1678ff;display:flex;align-items:center;gap:12px;padding:0 16px';
        head.innerHTML = '<img src="' + avatarFor(me) + '" style="width:60px;height:60px;border-radius:3px;object-fit:cover">' +
          '<span style="flex:1;font-size:18px;color:#fff">' + esc(me.nickname) + '</span>' +
          '<span style="width:22px;height:22px;border-radius:50%;background:#f5c543;color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center">V</span>';
        main.appendChild(head);
        /* pinned rows: 新的朋友 / 群聊 / 生活号 / 生活圈 */
        var pinned = document.createElement('div');
        pinned.className = 'row-list';
        [
          ['新的朋友', 'img/app_images_defaultface.png', true],
          ['群聊', '', false], ['生活号', '', false], ['生活圈', '', false]
        ].forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;align-items:center;gap:10px;height:55px;padding:0 14px;background:#fff;border-bottom:1px solid #eee';
          elx.innerHTML = '<span style="width:46px;height:46px;border-radius:4px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:20px;position:relative">' +
            (r[0] === '新的朋友' ? '👥<span style="position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;background:#f43530;color:#fff;font-size:11px;border-radius:9px;display:flex;align-items:center;justify-content:center">2</span>' : '👥') +
            '</span><span style="font-size:16px;color:#000">' + esc(r[0]) + '</span>';
          pinned.appendChild(elx);
        });
        main.appendChild(pinned);
        /* contacts grouped A-Z, sorted by name */
        var roles = DB.roles().slice().sort(function (a, b) { return String(a.nickname || '').localeCompare(String(b.nickname || '')); });
        var byLetter = {};
        var letters = [];
        roles.forEach(function (r) {
          var ch = (r.nickname || '?').charAt(0).toUpperCase();
          if (!/[A-Z]/.test(ch)) ch = '#';
          if (!byLetter[ch]) { byLetter[ch] = []; letters.push(ch); }
          byLetter[ch].push(r);
        });
        letters.sort();
        letters.forEach(function (L) {
          var h = document.createElement('div');
          h.style.cssText = 'height:24px;background:#f5f5f5;color:#a5a5a5;font-size:15px;display:flex;align-items:center;padding:0 14px';
          h.textContent = L;
          main.appendChild(h);
          byLetter[L].forEach(function (r) {
            /* row h55, avatar 36x36 marginRight 10, name 16 #000, sub #9e9e9e,
               level badge 14x14 at left 27/top 36 */
            var elx = document.createElement('div');
            elx.style.cssText = 'display:flex;align-items:center;height:55px;padding:0 14px;background:#fff;border-bottom:1px solid #eee';
            var avw = document.createElement('div');
            avw.style.cssText = 'position:relative;width:36px;height:36px;margin-right:10px;flex:none';
            var av = document.createElement('img');
            av.style.cssText = 'width:36px;height:36px;border-radius:4px;object-fit:cover';
            av.src = avatarFor(r);
            var badge = document.createElement('span');
            badge.style.cssText = 'position:absolute;left:27px;top:36px;width:14px;height:14px;border-radius:50%;background:#f5c543;color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center';
            badge.textContent = 'V';
            avw.appendChild(av); avw.appendChild(badge);
            var mid = document.createElement('div');
            mid.style.cssText = 'flex:1;min-width:0';
            var rn = (r.hideRealName ? '对方已隐藏真实姓名' : (r.realName ? ('真实姓名：' + r.realName) : r.nickname));
            mid.innerHTML = '<div style="font-size:16px;color:#000">' + esc(r.nickname) + '</div>' +
              (r.remark ? '<div style="font-size:13px;color:#9e9e9e">' + esc(r.remark) + '</div>' : '');
            elx.appendChild(avw); elx.appendChild(mid);
            elx.addEventListener('click', function () {
              H().openDialog('编辑角色', [
                { label: '昵称', key: 'nickname', value: r.nickname },
                { label: '头像', key: 'avatar', value: String(r.image != null ? r.image : 5) },
                { label: '备注', key: 'remark', value: r.remark || '' },
                { label: '真实姓名', key: 'realName', value: r.realName || '' },
                { label: '隐藏真实姓名', key: 'hideRealName', value: !!r.hideRealName, type: 'switch' }
              ], function (vals) {
                r.nickname = vals.nickname; r.remark = vals.remark; r.realName = vals.realName;
                r.hideRealName = !!vals.hideRealName;
                r.image = parseInt(vals.avatar, 10) || 5;
                DB.saveRoles(DB.roles());
                nav().reset('AlipayContactPage');
              });
            });
            main.appendChild(elx);
          });
        });
        var foot = document.createElement('div');
        foot.style.cssText = 'text-align:center;font-size:16px;color:#808080;padding:16px';
        foot.textContent = roles.length + '个朋友';
        main.appendChild(foot);
        wrap.appendChild(main);
        /* A-Z index sidebar width 14, text 11 bold #4d4d4d */
        var idx = document.createElement('div');
        idx.style.cssText = 'flex:none;width:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;background:#fff';
        letters.forEach(function (L) {
          var s = document.createElement('span');
          s.style.cssText = 'font-size:11px;font-weight:700;color:#4d4d4d';
          s.textContent = L;
          idx.appendChild(s);
        });
        wrap.appendChild(idx);
        return wrap;
      }
    };
  }
  function alipayContactAddMenu() {
    H().showActionSheet([
      { title: '添加自定义角色', onPress: function () {
        H().openDialog('添加角色', [
          { label: '昵称', key: 'nickname', value: '' },
          { label: '头像', key: 'avatar', value: '5' },
          { label: '备注', key: 'remark', value: '' },
          { label: '真实姓名', key: 'realName', value: '' },
          { label: '隐藏真实姓名', key: 'hideRealName', value: false, type: 'switch' }
        ], function (vals) {
          if (!vals.nickname) return;
          var rs = DB.roles();
          rs.push({ id: Date.now(), nickname: vals.nickname, image: parseInt(vals.avatar, 10) || 5, remark: vals.remark, realName: vals.realName, hideRealName: !!vals.hideRealName });
          DB.saveRoles(rs);
          nav().reset('AlipayContactPage');
        });
      } },
      { title: '随机添加1个角色', onPress: function () { alipayContactRandom(1); } },
      { title: '随机添加200个角色', onPress: function () { alipayContactRandom(200); } },
      { title: '清空所有角色', onPress: function () {
        H().showAlert('提示', '您确认要清空所有角色？');
        var ok = H().$('alert-ok');
        ok.onclick = function () { H().$('alert-overlay').hidden = true; DB.saveRoles([]); nav().reset('AlipayContactPage'); };
      } }
    ]);
  }
  function alipayContactRandom(n) {
    var rs = DB.roles();
    var names = ['小明', '小红', '阿强', '小丽', '大伟', '小芳', '老陈', '小燕'];
    for (var i = 0; i < n; i++) {
      rs.push({ id: Date.now() + i, nickname: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100), image: 5 + Math.floor(Math.random() * 10), remark: '', realName: '', hideRealName: false });
    }
    DB.saveRoles(rs);
    H().toast('已添加' + n + '个角色');
    nav().reset('AlipayContactPage');
  }
  function alipayAccountPage() {
    return {
      title: '个人信息',
      navClass: 'alipay',
      render: function () {
        var me = DB.me();
        var wrap = document.createElement('div');
        /* list (mod 2795 accountListView): bg #fff, marginTop 20; item h45
           (avatar row 60), title 16 #000, right text 16 #999, right image
           36x36, arrow 8x13. No header; first row 个人主页 with 36x36 image. */
        var list = document.createElement('div');
        list.style.cssText = 'background:#fff;margin-top:20px';
        var rows = [
          { label: '个人主页', value: '', image: true, fn: function () { H().toast('个人主页（本地暂未实现）'); } },
          { label: '头像', value: '', avatar: true, fn: function () { editAlipayAccount(); } },
          { label: '姓名', value: me.nickname || '', fn: editAlipayAccount },
          { label: '性别', value: me.gender || '男', fn: editAlipayAccount },
          { label: '淘宝会员名', value: me.taobaoName || me.nickname || '', fn: editAlipayAccount },
          { label: '账户', value: me.alipay || '', fn: editAlipayAccount },
          { label: '身份认证', value: '已认证', fn: function () { H().toast('身份认证（本地暂未实现）'); } },
          { label: '支付宝账号', value: me.alipay || '', fn: editAlipayAccount },
          { label: '我的二维码', value: '', fn: function () { H().showAlert('我的二维码', '支付宝账号：' + (me.alipay || '')); } },
          { label: '收货地址', value: '', fn: function () { H().toast('收货地址（本地暂未实现）'); } },
          { label: '我的发票抬头', value: '', fn: function () { H().toast('我的发票抬头（本地暂未实现）'); } },
          { label: '我的收藏', value: '', fn: function () { H().toast('我的收藏（本地暂未实现）'); } },
          { label: '我的客服', value: '', fn: function () { nav().push('helpStub', { title: '我的客服' }); } }
        ];
        rows.forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;align-items:center;height:' + (r.avatar ? '60' : '45') + 'px;padding:0 14px;border-bottom:1px solid #eee';
          var lb = document.createElement('span');
          lb.style.cssText = 'flex:1;font-size:16px;color:#000';
          lb.textContent = r.label;
          elx.appendChild(lb);
          if (r.avatar) {
            var av = document.createElement('img');
            av.style.cssText = 'width:36px;height:36px;border-radius:4px;object-fit:cover';
            av.src = avatarFor(me);
            elx.appendChild(av);
          } else if (r.image) {
            var im = document.createElement('img');
            im.style.cssText = 'width:36px;height:36px;border-radius:4px;object-fit:cover';
            im.src = avatarFor(me);
            elx.appendChild(im);
          } else if (r.value) {
            var v = document.createElement('span');
            v.style.cssText = 'font-size:16px;color:#999';
            v.textContent = r.value;
            elx.appendChild(v);
          }
          var ar = document.createElement('span');
          ar.style.cssText = 'color:#c8c8c8;font-size:16px;margin-left:8px';
          ar.textContent = '›';
          elx.appendChild(ar);
          elx.addEventListener('click', r.fn);
          list.appendChild(elx);
        });
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  function editAlipayAccount() {
    var me = DB.me();
    H().openDialog('编辑个人信息', [
      { label: '姓名', key: 'nickname', value: me.nickname },
      { label: '淘宝会员名', key: 'taobaoName', value: me.taobaoName || me.nickname },
      { label: '头像', key: 'avatar', value: String(me.avatar != null ? me.avatar : 0) },
      { label: '账户', key: 'alipay', value: me.alipay },
      { label: '性别', key: 'gender', value: me.gender || '男', type: 'select', options: ['男', '女'] }
    ], function (vals) {
      me.nickname = vals.nickname; me.taobaoName = vals.taobaoName; me.alipay = vals.alipay; me.gender = vals.gender;
      DB.saveMe(me);
      nav().reset('AlipayAccountPage');
    });
  }
  function alipayTransferPage() {
    return {
      title: '转账',
      navClass: 'alipay',
      right: { text: '模板', onClick: function () {
        H().showActionSheet([
          { title: '扫码支付成功（新版）', onPress: function () { alipayTransferResult('扫码支付成功（新版）'); } },
          { title: '扫码支付成功（旧版）', onPress: function () { alipayTransferResult('扫码支付成功（旧版）'); } },
          { title: '转账成功（新版）', onPress: function () { alipayTransferResult('转账成功（新版）'); } },
          { title: '转账成功（旧版）', onPress: function () { alipayTransferResult('转账成功（旧版）'); } },
          { title: '转入详情', onPress: function () { alipayTransferResult('转入详情'); } },
          { title: '转出详情', onPress: function () { alipayTransferResult('转出详情'); } },
          { title: '延迟转账详情', onPress: function () { alipayTransferResult('延迟转账详情'); } },
          { title: '向对方收款详情', onPress: function () { alipayTransferResult('向对方收款详情'); } },
          { title: '向我收款详情', onPress: function () { alipayTransferResult('向我收款详情'); } },
          { title: '限额提醒', onPress: function () {
            H().showAlert('限额提醒', '监管部门规定：支付宝余额支付每年不能超过20万，该额度无法提升，剩余额度可提现、还信用卡或明年使用');
            var ok = H().$('alert-ok');
            ok.textContent = '了解详情';
          } }
        ]);
      } },
      render: function () {
        var wrap = document.createElement('div');
        var rec = store().getJSON('alipayTransfer', null) || { name: '马克_SHI', realName: '', avatar: 5, account: '1100000@qq.com', level: '非会员' };
        /* user row: avatar 36x36 radius 3, name 16 #000, sub 14 #999 marginTop 4 */
        var user = document.createElement('div');
        user.style.cssText = 'background:#fff;padding:16px;display:flex;align-items:center;gap:10px';
        var av = document.createElement('img');
        av.style.cssText = 'width:36px;height:36px;border-radius:3px;object-fit:cover';
        av.src = avatarFor(rec);
        var nm = document.createElement('div');
        nm.style.cssText = 'flex:1';
        nm.innerHTML = '<div style="font-size:16px;color:#000">' + esc(rec.name) + '</div>' +
          '<div style="font-size:14px;color:#999;margin-top:4px">' + esc(rec.account) + '</div>';
        user.appendChild(av); user.appendChild(nm);
        user.addEventListener('click', function () {
          H().openDialog('编辑账户信息', [
            { label: '真实姓名', key: 'realName', value: rec.realName || '' },
            { label: '昵称', key: 'name', value: rec.name },
            { label: '头像', key: 'avatar', value: String(rec.avatar) },
            { label: '账户', key: 'account', value: rec.account },
            { label: '支付宝等级', key: 'level', value: rec.level, type: 'select', options: ['非会员', '大众会员', '黄金会员', '铂金会员', '钻石会员'] }
          ], function (vals) {
            Object.assign(rec, vals, { avatar: parseInt(vals.avatar, 10) || 5 });
            store().setJSON('alipayTransfer', rec);
            nav().reset('AlipayTransferPage');
          });
        });
        wrap.appendChild(user);
        /* amount input (mod 2871 moneyInputView h68): ¥ 30px, input 52px */
        var amtWrap = document.createElement('div');
        amtWrap.style.cssText = 'background:#fff;margin-top:12px;height:68px;display:flex;align-items:center;padding:0 16px;gap:8px';
        amtWrap.innerHTML = '<span style="font-size:30px;color:#000">¥</span>';
        var inp = document.createElement('input');
        inp.inputMode = 'decimal';
        inp.placeholder = '';
        inp.style.cssText = 'flex:1;border:none;outline:none;font-size:52px;color:#000;min-width:0';
        amtWrap.appendChild(inp);
        wrap.appendChild(amtWrap);
        /* confirm button: bg #1676fe, marginHorizontal 15, h47, radius 3, marginTop 30, text 18 #fff */
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = 'display:block;width:calc(100% - 30px);margin:30px auto 0;height:47px;border-radius:3px;background:#1676fe;color:#fff;font-size:18px';
        btn.textContent = '确认转账';
        btn.addEventListener('click', function () {
          var v = parseFloat(inp.value);
          if (isNaN(v) || v <= 0) { H().toast('请输入金额'); return; }
          store().setJSON('alipayTransferAmount', inp.value);
          alipayTransferResult('转账成功（新版）');
        });
        wrap.appendChild(btn);
        return wrap;
      }
    };
  }
  /* Transfer result views (mod 2960 template menu targets). */
  function alipayTransferResult(kind) {
    var amt = store().getJSON('alipayTransferAmount', null) || '100.00';
    var wrap = document.createElement('div');
    wrap.style.background = '#fff';
    var head = document.createElement('div');
    head.style.cssText = 'text-align:center;padding:40px 16px 20px';
    var icon = kind.indexOf('扫码') >= 0 ? '✓' : '✓';
    head.innerHTML = '<div style="width:64px;height:64px;border-radius:50%;background:#07c160;color:#fff;font-size:34px;line-height:64px;margin:0 auto">' + icon + '</div>' +
      '<div style="font-size:20px;color:#000;margin-top:16px">' + esc(kind) + '</div>' +
      '<div style="font-size:32px;color:#000;margin-top:10px">¥' + esc(amt) + '</div>';
    wrap.appendChild(head);
    var done = document.createElement('button');
    done.type = 'button';
    done.style.cssText = 'display:block;width:calc(100% - 30px);margin:20px auto;height:47px;border-radius:3px;background:#1676fe;color:#fff;font-size:18px';
    done.textContent = '完成';
    done.addEventListener('click', function () { nav().pop(); });
    wrap.appendChild(done);
    /* render as a standalone screen via the helpStub-style overlay page */
    var screen = document.createElement('div');
    screen.className = 'screen';
    var nav = document.createElement('div');
    nav.className = 'navbar alipay';
    nav.innerHTML = '<button type="button" class="nav-back" style="color:#fff">‹</button><div class="nav-title" style="color:#fff">' + esc(kind) + '</div><div class="nav-right"></div>';
    nav.querySelector('.nav-back').addEventListener('click', function () { screen.remove(); });
    var sc = document.createElement('div');
    sc.className = 'scroll';
    sc.appendChild(wrap);
    screen.appendChild(nav); screen.appendChild(sc);
    document.querySelector('.stack').appendChild(screen);
  }
  /* 编辑余额 dialog (mods 2819/2902): 总金额 + hide switches. Stored on the
     balance record; the switches hide the matching UI pieces. */
  function editAlipayBalance(b, isNew) {
    var fields = [{ label: '总金额', key: 'balance', value: b.balance, numeric: true }];
    var switches = isNew
      ? ['隐藏银行转账', '隐藏备用余额', '隐藏亲情卡', '隐藏蚂蚁合花', '隐藏底部广告图']
      : ['隐藏转账', '隐藏可升级', '隐藏备用余额', '隐藏蚂蚁合花', '隐藏亲情卡', '隐藏底部广告图'];
    b.hide = b.hide || {};
    switches.forEach(function (s) { fields.push({ label: s, key: s, value: !!b.hide[s], type: 'switch' }); });
    H().openDialog('编辑余额', fields, function (vals) {
      b.balance = vals.balance || b.balance;
      switches.forEach(function (s) { b.hide[s] = !!vals[s]; });
      DB.saveAlipayBalance(b);
      nav().reset(isNew ? 'AlipayBalanceNewPage' : 'AlipayBalancePage');
    });
  }


  /* Add a bill / balance-change record (mod 2904 add form). */
  function addAlipayBillRecord(onDone) {
    H().openDialog('添加数据', [
      { label: '类型', key: 'title', value: '转账' },
      { label: '金额', key: 'money', value: '100.00', numeric: true },
      { label: '转入-转出', key: 'dir', value: '支出', type: 'select', options: ['支出', '收入'] },
      { label: '支付方式', key: 'method', value: '余额', type: 'select', options: ['余额', '余额宝', '在线支付', '交易退款', '收费', '提现'] },
      { label: '时间', key: 'time', value: H().nowTime() },
      { label: '备注', key: 'remark', value: '' }
    ], function (vals) {
      var bills = DB.alipayBill();
      bills.unshift({
        title: vals.title, money: vals.money,
        pay_type: vals.dir === '支出' ? 1 : 0,
        status: vals.dir === '支出' ? '支付成功' : '已收钱',
        time1: vals.time, remark: vals.remark
      });
      DB.saveAlipayBill(bills);
      H().toast('已添加');
      if (onDone) onDone();
    });
  }

  function alipayBalancePage() {
    return {
      title: '余额',
      navClass: 'alipay-balance',
      right: { text: '管理', onClick: function () { editAlipayBalance(DB.alipayBalance(), false); } },
      render: function () {
        var b = DB.alipayBalance();
        b.hide = b.hide || {};
        var wrap = document.createElement('div');
        /* top amount (mod 2821 nbTopMoneyText): #217afa header, no hero card */
        var top = document.createElement('div');
        top.style.cssText = 'background:#217afa;padding:16px';
        var badge = b.hide['隐藏可升级'] ? '' :
          '<span style="display:inline-block;width:65px;height:17px;background:#2d85fe;border-radius:8.5px;color:#c5d9fb;font-size:11px;line-height:17px;text-align:center;margin-left:8px">已升级</span>';
        top.innerHTML = '<div style="font-size:14px;color:#b9d2fb">总金额(元)' + badge + '</div>' +
          '<div style="font-size:32px;color:#fefefe;margin-top:4px">' + esc(b.balance) + '</div>';
        wrap.appendChild(top);
        /* 充值 / 提现 quick row (nbInfoListView h80) */
        var acts = document.createElement('div');
        acts.style.cssText = 'background:#fff;height:80px;display:flex';
        [['充值', '\uf067'], ['提现', '\uf068']].forEach(function (t) {
          var c = document.createElement('button');
          c.type = 'button';
          c.style.cssText = 'flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;justify-content:center';
          c.innerHTML = '<span class="fa" style="font-size:29px;color:#333">' + t[1] + '</span>' +
            '<span style="font-size:14px;color:#333;margin-top:6px">' + t[0] + '</span>';
          c.addEventListener('click', function () { editAlipayBalance(b, false); });
          acts.appendChild(c);
        });
        wrap.appendChild(acts);
        wrap.appendChild(gap());
        /* 余额享权益 box */
        var eq = document.createElement('div');
        eq.style.cssText = 'background:#fff;border-radius:6px;margin:12px 12px 0;padding:14px 16px;display:flex;align-items:center';
        eq.innerHTML = '<span style="flex:1;font-size:18px;font-weight:500;color:#8c643a">余额享权益</span>' +
          '<span style="font-size:14px;color:#744014">去查看 ›</span>';
        eq.addEventListener('click', function () { H().toast('余额享权益（本地暂未实现）'); });
        wrap.appendChild(eq);
        /* 服务推荐 box */
        if (!b.hide['隐藏转账']) {
          var svc = document.createElement('div');
          svc.style.cssText = 'background:#fff;border-radius:6px;margin:12px 12px 0;padding:8px 0';
          var svcTitle = document.createElement('div');
          svcTitle.style.cssText = 'padding:8px 16px;font-size:18px;font-weight:500;color:#8c643a';
          svcTitle.textContent = '服务推荐';
          svc.appendChild(svcTitle);
          [
            ['充享惠', '充值立享折上折'], ['转账', '支持批量转钱'],
            ['红包', '送出暖暖心意'], ['提现免费额度', '做任务提额度']
          ].forEach(function (it) {
            var r = document.createElement('div');
            r.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 16px';
            r.innerHTML = '<span style="width:32px;height:32px;border-radius:6px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:16px;color:#744014">' + esc(it[0].charAt(0)) + '</span>' +
              '<span style="flex:1"><span style="display:block;font-size:14px;color:#744014">' + esc(it[0]) + '</span>' +
              '<span style="display:block;font-size:12px;color:#999;margin-top:2px">' + esc(it[1]) + '</span></span>';
            svc.appendChild(r);
          });
          wrap.appendChild(svc);
        }
        return wrap;
      }
    };
  }
  function alipayBalanceNewPage() {
    return {
      title: '余额',
      navClass: 'alipay-balance',
      right: { text: '管理', onClick: function () { editAlipayBalance(DB.alipayBalance(), true); } },
      render: function () {
        var b = DB.alipayBalance();
        b.hide = b.hide || {};
        var wrap = document.createElement('div');
        wrap.style.background = '#f5f5f5';
        /* white amount card (mod 2903 moneyBoxView) */
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;border-radius:6px;margin:13px;padding:35px 16px 15px';
        card.innerHTML = '<div style="display:flex;align-items:center;gap:6px"><span style="font-size:16px;color:#000">可用余额(元)</span>' +
          '<span style="font-size:16px;color:#999">👁</span></div>' +
          '<div style="font-size:44px;color:#000;margin-top:8px">' + esc(b.balance) + '</div>';
        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:12px;margin-top:90px';
        [['充值'], ['提现']].forEach(function (t) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.style.cssText = 'flex:1;border:1px solid #e5e5e5;border-radius:4px;height:54px;font-size:20px;color:#000;background:#fff';
          btn.textContent = t[0];
          btn.addEventListener('click', function () { editAlipayBalance(b, true); });
          btns.appendChild(btn);
        });
        card.appendChild(btns);
        wrap.appendChild(card);
        /* app grid (mod 2903) */
        if (!b.hide['隐藏银行转账'] || !b.hide['隐藏备用余额']) {
          var grid = document.createElement('div');
          grid.style.cssText = 'background:#fff;margin:12px 13px 0;border-radius:6px;display:flex;flex-wrap:wrap;padding:8px 0';
          ['银行转钱', '备用余额', '情亲卡', '提现免费额度', '蚂蚁合花', '转账', '充享惠'].forEach(function (t) {
            if (t === '银行转钱' && b.hide['隐藏银行转账']) return;
            if (t === '备用余额' && b.hide['隐藏备用余额']) return;
            if (t === '情亲卡' && b.hide['隐藏亲情卡']) return;
            if (t === '蚂蚁合花' && b.hide['隐藏蚂蚁合花']) return;
            var cell = document.createElement('div');
            cell.style.cssText = 'width:25%;display:flex;flex-direction:column;align-items:center;padding:10px 2px;gap:6px';
            cell.innerHTML = '<span style="width:32px;height:32px;border-radius:6px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:15px;color:#1678ff">' + esc(t.charAt(0)) + '</span>' +
              '<span style="font-size:14px;color:#000">' + esc(t) + '</span>';
            grid.appendChild(cell);
          });
          wrap.appendChild(grid);
        }
        /* 余额变动明细 header + rows */
        var det = document.createElement('div');
        det.style.cssText = 'background:#fff;margin:12px 13px 0;border-radius:6px';
        var dh = document.createElement('div');
        dh.style.cssText = 'height:54px;display:flex;align-items:center;padding:0 16px';
        dh.innerHTML = '<span style="flex:1;font-size:18px;font-weight:700;color:#000">余额变动明细</span>' +
          '<span style="font-size:16px;color:#aeaeae">全部 ›</span>';
        dh.addEventListener('click', function () { nav().push('AlipayBalanceDetailPage'); });
        det.appendChild(dh);
        DB.alipayBill().slice(0, 5).forEach(function (r) {
          var amt = (r.money != null ? r.money : r.amount) || '';
          var rowEl = document.createElement('div');
          rowEl.style.cssText = 'display:flex;align-items:center;padding:12px 16px;border-top:1px solid #eee';
          rowEl.innerHTML = '<span style="flex:1"><span style="display:block;font-size:18px;color:#000">' + esc(r.title || r.name || '') + '</span>' +
            '<span style="display:block;font-size:14px;color:#999;margin-top:2px">' + esc(r.time || '') + '</span></span>' +
            '<span style="font-size:18px;color:#000">' + (amt ? ('¥' + amt) : '') + '</span>';
          det.appendChild(rowEl);
        });
        wrap.appendChild(det);
        return wrap;
      }
    };
  }
  function alipayBalanceDetailPage() {
    return {
      title: '余额变动明细',
      right: { text: '+', onClick: function () { addAlipayBillRecord(function () { nav().reset('AlipayBalanceDetailPage'); }); } },
      render: function () {
        var wrap = document.createElement('div');
        var bills = DB.alipayBill();
        /* tabs 全部 / 支出 / 收入 (mod 2821) */
        var tabs = document.createElement('div');
        tabs.style.cssText = 'height:50px;background:#fff;display:flex;border-bottom:1px solid #eee';
        var cur = store().get('balanceDetailTab', '全部');
        ['全部', '支出', '收入'].forEach(function (t) {
          var tb = document.createElement('button');
          tb.type = 'button';
          tb.style.cssText = 'flex:1;background:none;border:none;font-size:18px;color:' + (cur === t ? '#3875f6' : '#333') +
            ';font-weight:' + (cur === t ? '500' : '400') + ';border-bottom:2px solid ' + (cur === t ? '#3875f6' : 'transparent');
          tb.textContent = t;
          tb.addEventListener('click', function () {
            store().set('balanceDetailTab', t);
            nav().reset('AlipayBalanceDetailPage');
          });
          tabs.appendChild(tb);
        });
        wrap.appendChild(tabs);
        /* detail top: balance amount */
        var b = DB.alipayBalance();
        var top = document.createElement('div');
        top.style.cssText = 'background:#fff;padding:16px;text-align:center;border-bottom:1px solid #eee';
        top.innerHTML = '<div style="font-size:22px;color:#000">余额</div><div style="font-size:32px;color:#000;margin-top:4px">¥' + esc(b.balance) + '</div>';
        wrap.appendChild(top);
        var list = bills.filter(function (r) {
          if (cur === '全部') return true;
          if (cur === '支出') return r.pay_type === 1;
          return r.pay_type === 0;
        });
        if (!list.length) {
          var e = document.createElement('div');
          e.className = 'form-note';
          e.textContent = '暂无数据，请点击这里添加数据';
          e.style.cursor = 'pointer';
          e.addEventListener('click', function () { addAlipayBillRecord(function () { nav().reset('AlipayBalanceDetailPage'); }); });
          wrap.appendChild(e);
          return wrap;
        }
        var lw = document.createElement('div');
        lw.className = 'row-list';
        list.forEach(function (r) {
          var amt = (r.money != null ? r.money : r.amount) || '';
          var elx = row(r.title || r.name || '', amt ? ('¥' + amt) : '', function () {
            var fields = [
              ['标题', r.title || r.name || ''], ['金额', amt], ['时间', r.time1 || r.time || ''],
              ['状态', r.status || ''], ['对方', r.to_from || '']
            ];
            var html = fields.map(function (f) {
              return '<div style="display:flex;padding:14px 0;border-bottom:1px solid #eee"><span style="width:70px;font-size:18px;color:#808080">' + esc(f[0]) + '</span><span style="flex:1;font-size:18px;font-weight:500;color:#333">' + esc(f[1]) + '</span></div>';
            }).join('');
            H().showAlert('账单详情', '');
            H().$('alert-body').innerHTML = html;
          });
          elx.querySelector('.row-label').style.fontSize = '18px';
          elx.querySelector('.row-label').style.color = '#000';
          elx.querySelector('.row-value').style.fontSize = '18px';
          elx.querySelector('.row-value').style.color = '#000';
          var sub = document.createElement('div');
          sub.style.cssText = 'color:#999;font-size:14px;margin-top:2px';
          sub.textContent = r.time || '';
          elx.querySelector('.row-label').appendChild(sub);
          lw.appendChild(elx);
        });
        wrap.appendChild(lw);
        return wrap;
      }
    };
  }

  /* Bill page chrome (mod 2841/2844): search/filter bar, bottom 统计 bar,
     nav-right add menu. */
  function billSearchBar() {
    var bar = document.createElement('div');
    bar.style.cssText = 'height:40px;background:#fff;padding:0 15px;display:flex;align-items:center;gap:8px';
    bar.innerHTML = '<span style="font-size:14px;color:#333">筛选</span>' +
      '<span style="font-size:14px;color:#333">分类 ▾</span>' +
      '<span style="flex:1"></span><span style="font-size:14px;color:#888888">搜索</span>';
    bar.addEventListener('click', function () { H().toast('筛选（本地暂未实现）'); });
    return bar;
  }
  function billStatsBar(bills) {
    var bar = document.createElement('div');
    bar.style.cssText = 'height:60px;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;border-top:1px solid #eee;position:sticky;bottom:0';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText = 'background:none;border:none;font-size:16px;color:#1678ff';
    btn.textContent = '统计';
    btn.addEventListener('click', function () {
      var out = 0, inc = 0;
      bills.forEach(function (r) {
        var v = parseFloat(r.money != null ? r.money : (r.amount || 0)) || 0;
        if (r.pay_type === 1) out += v; else inc += v;
      });
      H().showAlert('统计', '支出 ￥' + out.toFixed(2) + '　收入 ￥' + inc.toFixed(2) + '　共 ' + bills.length + ' 笔');
    });
    bar.appendChild(btn);
    return bar;
  }
  function billAddMenu() {
    H().showActionSheet([
      { title: '添加转账记录', onPress: function () { addAlipayBillRecord(function () { nav().reset('AlipayBillPage'); }); } },
      { title: '添加红包记录', onPress: function () { addAlipayBillRecord(function () { nav().reset('AlipayBillPage'); }); } },
      { title: '添加扫码记录', onPress: function () { addAlipayBillRecord(function () { nav().reset('AlipayBillPage'); }); } },
      { title: '添加转账到银行卡记录', onPress: function () { addAlipayBillRecord(function () { nav().reset('AlipayBillPage'); }); } },
      { title: '随机添加记录', onPress: function () {
        var bills = DB.alipayBill();
        bills.unshift({ title: '转账-随机', money: (Math.random() * 500).toFixed(2), pay_type: Math.random() > 0.5 ? 1 : 0, status: '交易成功', time1: H().nowTime() });
        DB.saveAlipayBill(bills);
        H().toast('已添加');
        nav().reset('AlipayBillPage');
      } },
      { title: '清空所有记录', onPress: function () {
        H().showAlert('提示', '您确认要清空所有记录？');
        var ok = H().$('alert-ok');
        ok.onclick = function () { H().$('alert-overlay').hidden = true; DB.saveAlipayBill([]); H().toast('已清空'); nav().reset('AlipayBillPage'); };
      } }
    ]);
  }

  function alipayBillPage() {
    return {
      title: '账单',
      right: { text: '⋮', onClick: function () { billAddMenu(); } },
      render: function () {
        var bills = DB.alipayBill();
        var wrap = document.createElement('div');
        wrap.appendChild(billSearchBar());
        wrap.appendChild(transList(bills, 'alipay'));
        wrap.appendChild(billStatsBar(bills));
        return wrap;
      }
    };
  }
  function alipayNewBillPage() {
    return {
      title: '账单（新版）',
      right: { text: '⋮', onClick: function () { billAddMenu(); } },
      render: function () {
        var bills = DB.alipayBill();
        var wrap = document.createElement('div');
        wrap.appendChild(billSearchBar());
        var tip = document.createElement('div');
        tip.style.cssText = 'background:#fff8e6;color:#8c643a;font-size:12px;padding:8px 15px;line-height:1.5';
        tip.textContent = '年账单活动期间，列表统计暂不可用，"服务中"列表里的账单仅展示近三个月，预计1月6日0:00恢复，敬请谅解。';
        wrap.appendChild(tip);
        wrap.appendChild(transList(bills, 'alipay'));
        wrap.appendChild(billStatsBar(bills));
        return wrap;
      }
    };
  }
  function alipayMoneyoutPage() {
    return {
      title: '账单详情',
      navClass: 'alipay',
      render: function () {
        var wrap = document.createElement('div');
        var rec = { name: '马克_SHI', amount: '100.00', bank: '交通银行', tail: '5627', status: '到账成功', fee: '0.00', time: H().nowTime() };
        /* header: avatar 63x63 radius 3, name 16 #000, sub 14 #999 marginTop 4 */
        var head = document.createElement('div');
        head.style.cssText = 'text-align:center;padding:24px 16px 8px';
        head.innerHTML = '<img src="' + avatarFor(rec) + '" style="width:63px;height:63px;border-radius:3px;object-fit:cover;margin:0 auto">' +
          '<div style="font-size:16px;color:#000;margin-top:4px">' + esc(rec.name) + '</div>' +
          '<div style="font-size:32px;color:#000;margin-top:8px">¥' + esc(rec.amount) + '</div>';
        wrap.appendChild(head);
        /* info card radius 8 marginHorizontal 12 */
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;border-radius:8px;margin:12px;padding:10px 16px 4px';
        var rows = [
          ['提现银行', rec.bank], ['银行卡尾号', rec.tail], ['提现人姓名', rec.name],
          ['提现金额', '¥' + rec.amount], ['状态', rec.status], ['服务费', '¥' + rec.fee],
          ['提现说明', '提现到银行卡'], ['付款成功时间', rec.time], ['银行处理中时间', rec.time],
          ['到账成功时间', rec.time], ['账单分类', '提现'], ['创建时间', rec.time],
          ['订单号', '2021010100000001']
        ];
        rows.forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;height:40px;align-items:center;border-bottom:1px solid #f5f5f5';
          elx.innerHTML = '<span style="width:120px;font-size:15px;color:#888">' + esc(r[0]) + '</span><span style="flex:1;font-size:15px;color:#333;text-align:right">' + esc(r[1]) + '</span>';
          card.appendChild(elx);
        });
        wrap.appendChild(card);
        /* 处理进度 timeline */
        var prog = document.createElement('div');
        prog.style.cssText = 'background:#fff;border-radius:8px;margin:0 12px;padding:14px 16px';
        prog.innerHTML = '<div style="font-size:15px;color:#333;margin-bottom:10px">处理进度</div>' +
          ['付款成功', '银行处理中', '到账成功'].map(function (s) {
            return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="width:18px;height:18px;border-radius:50%;background:#07c160;color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center">✓</span><span style="font-size:14px;color:#333">' + esc(s) + '</span></div>';
          }).join('');
        wrap.appendChild(prog);
        /* 更多 section */
        var more = document.createElement('div');
        more.style.cssText = 'background:#fff;border-radius:8px;margin:12px;padding:4px 16px';
        [['申请电子回单', ''], ['查看往来记录', ''], ['投诉', ''], ['标签和备注', '']].forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;height:53px;align-items:center;border-bottom:1px solid #f5f5f5';
          elx.innerHTML = '<span style="flex:1;font-size:15px;color:#333">' + esc(r[0]) + '</span><span style="font-size:14px;color:#999">›</span>';
          elx.addEventListener('click', function () { H().toast(r[0] + '（本地暂未实现）'); });
          more.appendChild(elx);
        });
        wrap.appendChild(more);
        return wrap;
      }
    };
  }
  function alipayTocardPage() {
    return {
      title: '转到银行卡',
      navClass: 'alipay',
      render: function () {
        var wrap = document.createElement('div');
        var rec = store().getJSON('alipayTocard', null) || { bank: '交通银行', tail: '5627', arrive: '2小时内到账', amount: '100.00', hideReward: false, hideScratch: false, showProgress: true };
        /* success view */
        var head = document.createElement('div');
        head.style.cssText = 'background:#fff;text-align:center;padding:36px 16px 20px';
        var now = new Date();
        var hh = String(now.getHours()).padStart(2, '0'), mm = String(now.getMinutes()).padStart(2, '0');
        head.innerHTML = '<div style="width:64px;height:64px;border-radius:50%;background:#07c160;color:#fff;font-size:34px;line-height:64px;margin:0 auto">✓</div>' +
          '<div style="font-size:20px;color:#000;margin-top:16px">转账申请已提交</div>' +
          '<div style="font-size:14px;color:#999;margin-top:8px">银行处理中</div>' +
          '<div style="font-size:14px;color:#999;margin-top:4px">预计' + hh + ':' + mm + '前到账</div>' +
          '<div style="font-size:13px;color:#999;margin-top:12px">如信息填写有误，资金将原路退回</div>' +
          '<div style="font-size:28px;color:#000;margin-top:16px">¥' + esc(rec.amount) + '</div>';
        wrap.appendChild(head);
        /* 奖励金 / 刮刮卡 cards h108 bg #f9f9f9 radius 2 */
        if (!rec.hideReward) {
          var rw = document.createElement('div');
          rw.style.cssText = 'background:#f9f9f9;border-radius:2px;height:108px;margin:12px;padding:14px;display:flex;flex-direction:column;justify-content:center;gap:6px';
          rw.innerHTML = '<span style="display:inline-block;width:52px;height:22px;background:#e7541e;color:#fff;font-size:12px;line-height:22px;text-align:center;border-radius:2px">奖励金</span>' +
            '<div style="font-size:15px;color:#333">本次支付获得奖励金</div><div style="font-size:13px;color:#999">去查看 ›</div>';
          wrap.appendChild(rw);
        }
        if (!rec.hideScratch) {
          var sc = document.createElement('div');
          sc.style.cssText = 'background:#f9f9f9;border-radius:2px;height:108px;margin:0 12px 12px;padding:14px;display:flex;flex-direction:column;justify-content:center;gap:6px';
          sc.innerHTML = '<span style="display:inline-block;width:52px;height:22px;background:#e7541e;color:#fff;font-size:12px;line-height:22px;text-align:center;border-radius:2px">刮刮卡</span>' +
            '<div style="font-size:15px;color:#333">1次刮奖机会</div><div style="font-size:13px;color:#999">刮奖 · 更多惊喜优惠</div>';
          wrap.appendChild(sc);
        }
        if (rec.showProgress) {
          var pr = document.createElement('div');
          pr.style.cssText = 'background:#fff;margin:0 12px 12px;padding:14px 16px;display:flex;align-items:center';
          pr.innerHTML = '<span style="flex:1;font-size:15px;color:#333">账单进度</span><span style="font-size:14px;color:#1678ff">查看 ›</span>';
          pr.addEventListener('click', function () { nav().push('AlipayTocardDetailPage'); });
          wrap.appendChild(pr);
        }
        var done = document.createElement('button');
        done.type = 'button';
        done.style.cssText = 'display:block;width:calc(100% - 30px);margin:8px auto;height:47px;border-radius:3px;background:#1676fe;color:#fff;font-size:18px';
        done.textContent = '完成';
        done.addEventListener('click', function () { nav().pop(); });
        wrap.appendChild(done);
        var edit = document.createElement('button');
        edit.type = 'button';
        edit.style.cssText = 'display:block;width:calc(100% - 30px);margin:8px auto;height:47px;border-radius:3px;background:#fff;color:#1678ff;font-size:16px;border:1px solid #1678ff';
        edit.textContent = '编辑信息';
        edit.addEventListener('click', function () {
          H().openDialog('编辑信息', [
            { label: '提现银行', key: 'bank', value: rec.bank },
            { label: '银行卡尾号', key: 'tail', value: rec.tail },
            { label: '预计到账时间', key: 'arrive', value: rec.arrive },
            { label: '转账金额', key: 'amount', value: rec.amount },
            { label: '隐藏奖励金', key: 'hideReward', value: !!rec.hideReward, type: 'switch' },
            { label: '隐藏刮刮卡', key: 'hideScratch', value: !!rec.hideScratch, type: 'switch' },
            { label: '显示账单进度', key: 'showProgress', value: !!rec.showProgress, type: 'switch' }
          ], function (vals) {
            Object.assign(rec, vals, { hideReward: !!vals.hideReward, hideScratch: !!vals.hideScratch, showProgress: !!vals.showProgress });
            store().setJSON('alipayTocard', rec);
            nav().reset('AlipayTocardPage');
          });
        });
        wrap.appendChild(edit);
        return wrap;
      }
    };
  }
  function alipayTocardDetailPage() {
    return {
      title: '账单详情',
      navClass: 'alipay',
      render: function (params) {
        var wrap = document.createElement('div');
        var rec = store().getJSON('alipayTocard', null) || { bank: '交通银行', tail: '5627', amount: '100.00' };
        var show = store().getJSON('alipayTocardDetailShow', null) || { tips: true, fee: true, note: true, eReceipt: true, records: true, complaint: true, arriveTime: true, category: true, points: true };
        var head = document.createElement('div');
        head.style.cssText = 'text-align:center;padding:24px 16px 8px';
        head.innerHTML = '<div style="font-size:16px;color:#000">' + esc(rec.bank) + '(' + esc(rec.tail) + ')</div>' +
          '<div style="font-size:32px;color:#000;margin-top:8px">−¥' + esc(rec.amount) + '</div>';
        wrap.appendChild(head);
        /* info card radius 8 marginHorizontal 12 */
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;border-radius:8px;margin:12px;padding:10px 16px 4px';
        var rows = [
          ['转账银行', rec.bank], ['银行卡尾号', rec.tail], ['转账人姓名', '马克_SHI'],
          ['转账金额', '−¥' + rec.amount], ['状态', '到账成功']
        ];
        if (show.fee) rows.push(['服务费', '¥0.00']);
        rows.push(['付款方式', '余额']);
        if (show.note) rows.push(['转账说明', '转账']);
        rows.push(['付款成功时间', H().nowTime()], ['银行处理中时间', H().nowTime()]);
        if (show.arriveTime) rows.push(['到账时间', H().nowTime()]);
        if (show.category) rows.push(['账单分类', '转账到银行卡']);
        rows.push(['创建时间', H().nowTime()], ['订单号', '2021010100000002']);
        rows.forEach(function (r) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;height:40px;align-items:center;border-bottom:1px solid #f5f5f5';
          elx.innerHTML = '<span style="width:120px;font-size:15px;color:#888">' + esc(r[0]) + '</span><span style="flex:1;font-size:15px;color:#333;text-align:right">' + esc(r[1]) + '</span>';
          card.appendChild(elx);
        });
        wrap.appendChild(card);
        if (show.tips) {
          var tip = document.createElement('div');
          tip.style.cssText = 'background:#fff8e6;color:#8c643a;font-size:13px;line-height:1.6;padding:12px 16px;margin:0 12px;border-radius:8px';
          tip.textContent = '本页不作为转账成功凭证，实际以银行入账为准。如最终入账失败，资金原路退回';
          wrap.appendChild(tip);
        }
        /* 处理进度 timeline */
        var prog = document.createElement('div');
        prog.style.cssText = 'background:#fff;border-radius:8px;margin:12px;padding:14px 16px';
        prog.innerHTML = '<div style="font-size:15px;color:#333;margin-bottom:10px">处理进度</div>' +
          ['付款成功', '银行处理中', '到账成功'].map(function (s) {
            return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="width:18px;height:18px;border-radius:50%;background:#07c160;color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center">✓</span><span style="font-size:14px;color:#333">' + esc(s) + '</span></div>';
          }).join('');
        wrap.appendChild(prog);
        if (show.points) {
          var pts = document.createElement('div');
          pts.style.cssText = 'background:#fff;border-radius:8px;margin:0 12px 12px;padding:14px 16px;display:flex;align-items:center';
          pts.innerHTML = '<span style="flex:1;font-size:15px;color:#333">支付宝积分</span><span style="font-size:14px;color:#1678ff">领取 ›</span>';
          wrap.appendChild(pts);
        }
        /* 更多 */
        var more = document.createElement('div');
        more.style.cssText = 'background:#fff;border-radius:8px;margin:0 12px 12px;padding:4px 16px';
        var moreItems = [];
        if (show.eReceipt) moreItems.push('申请电子回单');
        moreItems.push('给收款人发送转账信息');
        if (show.records) moreItems.push('查看往来记录');
        if (show.complaint) moreItems.push('投诉');
        moreItems.push('标签和备注');
        moreItems.forEach(function (t) {
          var elx = document.createElement('div');
          elx.style.cssText = 'display:flex;height:53px;align-items:center;border-bottom:1px solid #f5f5f5';
          elx.innerHTML = '<span style="flex:1;font-size:15px;color:#333">' + esc(t) + '</span><span style="font-size:14px;color:#999">›</span>';
          elx.addEventListener('click', function () { H().toast(t + '（本地暂未实现）'); });
          more.appendChild(elx);
        });
        wrap.appendChild(more);
        var edit = document.createElement('button');
        edit.type = 'button';
        edit.style.cssText = 'display:block;width:calc(100% - 30px);margin:8px auto;height:47px;border-radius:3px;background:#fff;color:#1678ff;font-size:16px;border:1px solid #1678ff';
        edit.textContent = '编辑显示';
        edit.addEventListener('click', function () {
          H().openDialog('编辑显示', [
            { label: '显示温馨提醒', key: 'tips', value: !!show.tips, type: 'switch' },
            { label: '显示服务费', key: 'fee', value: !!show.fee, type: 'switch' },
            { label: '显示转账说明', key: 'note', value: !!show.note, type: 'switch' },
            { label: '显示申请电子回单', key: 'eReceipt', value: !!show.eReceipt, type: 'switch' },
            { label: '显示查看往来账单', key: 'records', value: !!show.records, type: 'switch' },
            { label: '显示投诉', key: 'complaint', value: !!show.complaint, type: 'switch' },
            { label: '隐藏到账时间', key: 'arriveTime', value: !show.arriveTime, type: 'switch' },
            { label: '隐藏账单分类', key: 'category', value: !show.category, type: 'switch' },
            { label: '显示支付宝积分', key: 'points', value: !!show.points, type: 'switch' }
          ], function (vals) {
            var s2 = {
              tips: !!vals.tips, fee: !!vals.fee, note: !!vals.note,
              eReceipt: !!vals.eReceipt, records: !!vals.records, complaint: !!vals.complaint,
              arriveTime: !vals.arriveTime, category: !vals.category, points: !!vals.points
            };
            store().setJSON('alipayTocardDetailShow', s2);
            nav().reset('AlipayTocardDetailPage');
          });
        });
        wrap.appendChild(edit);
        return wrap;
      }
    };
  }
  /* ---------- 支付宝收款到账 (module 3035/3036) ----------
     Single-amount digit-by-digit TTS player. Default money "10090".
     Play sequence: [diaoluo, success] + arabia_To_SimplifiedChinese(int)
     + (decimal: [dot] + each digit) + [yuan]. Amount input is masked for
     non-VIP (isWater): tapping it shows 付费会员才能修改金额. */
  var TTS_CHAR_FILE = {
    '零': 'tts_0', '一': 'tts_1', '二': 'tts_2', '三': 'tts_3', '四': 'tts_4',
    '五': 'tts_5', '六': 'tts_6', '七': 'tts_7', '八': 'tts_8', '九': 'tts_9',
    '十': 'tts_ten', '百': 'tts_hundred', '千': 'tts_thousand',
    '万': 'tts_ten_thousand', '亿': 'tts_ten_million'
  };
  function arabiaToChinese(t) {
    t = String(t).replace(/,/g, '').replace(/ /g, '');
    if (t === '' || isNaN(t)) return '';
    var intPart = t.split('.')[0];
    if (intPart.length > 10) return '';
    var digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var newchar = '';
    for (var i = intPart.length - 1; i >= 0; i--) {
      var perchar = intPart.charAt(i);
      var tmp = digits[parseInt(perchar, 10)] || '';
      var pos = intPart.length - i - 1;
      if (pos === 1 && perchar !== '0') tmp += '十';
      else if (pos === 2 && perchar !== '0') tmp += '百';
      else if (pos === 3 && perchar !== '0') tmp += '千';
      else if (pos === 4) tmp += '万';
      else if (pos === 5 && perchar !== '0') tmp += '十';
      else if (pos === 6 && perchar !== '0') tmp += '百';
      else if (pos === 7 && perchar !== '0') tmp += '千';
      else if (pos === 8) tmp += '亿';
      else if (pos === 9) tmp += '十';
      newchar = tmp + newchar;
    }
    while (newchar.indexOf('零零') !== -1 || newchar.indexOf('零亿') !== -1 ||
           newchar.indexOf('亿万') !== -1 || newchar.indexOf('零万') !== -1) {
      newchar = newchar.replace('零亿', '亿').replace('亿万', '亿')
        .replace('零万', '万').replace('零零', '零');
    }
    if (newchar.indexOf('一十') === 0) newchar = newchar.substr(1);
    if (newchar.lastIndexOf('零') === newchar.length - 1) newchar = newchar.substr(0, newchar.length - 1);
    return newchar;
  }
  function alipaySoundPage() {
    return {
      title: '支付宝收款到账',
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding-top:40px';
        var money = '10090';
        var playing = false;
        var status = document.createElement('div');
        status.className = 'form-note';
        status.textContent = '加载中...';
        wrap.appendChild(status);
        var mv = document.createElement('div');
        mv.style.cssText = 'width:200px;display:flex;align-items:center;position:relative';
        var lab = document.createElement('span');
        lab.style.cssText = 'font-size:16px;color:#333;flex:none';
        lab.textContent = '金额：';
        var inp = document.createElement('input');
        inp.className = 'form-input';
        inp.style.cssText = 'background:#fff;flex:1;height:50px;padding:0 10px;border-radius:5px;font-size:16px';
        inp.inputMode = 'decimal';
        inp.value = money;
        inp.readOnly = true;
        /* VIP gate (isWater): amount is masked; tap shows the paywall alert */
        var mask = document.createElement('div');
        mask.style.cssText = 'position:absolute;left:0;right:0;top:0;bottom:0';
        mask.addEventListener('click', function () {
          H().showAlert('提示', '付费会员才能修改金额');
          var ok = H().$('alert-ok');
          ok.textContent = '去开通';
          ok.onclick = function () { H().$('alert-overlay').hidden = true; nav().push('vip'); };
        });
        mv.appendChild(lab); mv.appendChild(inp); mv.appendChild(mask);
        wrap.appendChild(mv);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.style.cssText = 'width:200px;height:50px;background:#1ea1f3;border-radius:5px;color:#fff;font-size:16px;margin-top:20px';
        btn.textContent = '播放';
        btn.addEventListener('click', function () {
          var c = (inp.value || '').trim();
          if (!c || isNaN(c) || parseFloat(c) < 0) { H().showAlert('提示', '请输入有效的金额'); return; }
          if (playing) return;
          var seq = ['diaoluo_da', 'tts_success'];
          var intPart = c, decPart = '';
          if (c.indexOf('.') !== -1) { intPart = c.substring(0, c.indexOf('.')); decPart = c.substring(c.indexOf('.') + 1); }
          arabiaToChinese(intPart).split('').forEach(function (ch) {
            if (TTS_CHAR_FILE[ch]) seq.push(TTS_CHAR_FILE[ch]);
          });
          if (decPart) {
            seq.push('tts_dot');
            decPart.split('').forEach(function (d) {
              var ch = arabiaToChinese(d);
              if (TTS_CHAR_FILE[ch]) seq.push(TTS_CHAR_FILE[ch]);
            });
          }
          seq.push('tts_yuan');
          playing = true;
          status.textContent = '正在播放...';
          var i = 0;
          (function next() {
            if (i >= seq.length) { playing = false; status.textContent = ''; return; }
            var a = new Audio('audio/' + seq[i] + '.mp3');
            a.onended = function () { i++; next(); };
            a.onerror = function () { playing = false; status.textContent = ''; H().showAlert('提示', '加载音频文件失败'); };
            a.play().catch(function () { playing = false; status.textContent = ''; });
            i++;
          })();
        });
        wrap.appendChild(btn);
        /* preload the 19 sounds; hide the loading note when ready */
        var files = ['diaoluo_da', 'tts_success', 'tts_yuan', 'tts_dot',
          'tts_0', 'tts_1', 'tts_2', 'tts_3', 'tts_4', 'tts_5', 'tts_6', 'tts_7',
          'tts_8', 'tts_9', 'tts_ten', 'tts_hundred', 'tts_thousand',
          'tts_ten_thousand', 'tts_ten_million'];
        var loaded = 0;
        files.forEach(function (f) {
          var a = new Audio('audio/' + f + '.mp3');
          a.preload = 'auto';
          a.oncanplaythrough = a.onerror = function () {
            loaded++;
            if (loaded >= files.length) status.textContent = '';
          };
        });
        return wrap;
      }
    };
  }
  function alipaySumPage(year) {
    var is2019 = String(year) === '2019';
    var bg = img(is2019 ? '2019billbg' : 'bill2020bg') || img(is2019 ? '2019billbg2' : '2020billbg1') || '';
    var cats = [
      { name: '居家生活', color: '#69a2f8', v: 14432 }, { name: '交通出行', color: '#f5c543', v: 3452 },
      { name: '通讯快递', color: '#ed7e5f', v: 4562 }, { name: '穿衣打扮', color: '#f2a964', v: 657 },
      { name: '吃吃喝喝', color: '#d8b857', v: 2534.45 }, { name: '生活缴费', color: '#f5c668', v: 98 },
      { name: '住房物业', color: '#69a2f8', v: 98 }, { name: '休闲娱乐', color: '#f5c543', v: 23 },
      { name: '健康与养生', color: '#ed7e5f', v: 654 }, { name: '学习与健身', color: '#f2a964', v: 0 },
      { name: '转账和红包', color: '#d8b857', v: 0 }, { name: '公益捐赠', color: '#f5c668', v: 0 }
    ];
    return {
      title: is2019 ? '2019年账单' : '2020年账单',
      right: { text: '编辑', onClick: function () {
        if (is2019) {
          H().openDialog('编辑2019年账单', [
            { label: '全年总支出', key: 'total', value: '25980.45' },
            { label: '年度关键词', key: 'keyword', value: '稳稳的幸福' }
          ], function (vals) { H().toast('已保存'); nav().reset('AlipaySum2019'); });
        } else {
          H().openDialog('编辑2020年账单', [
            { label: '显示减少碳排放文字', key: 'showCarbon', value: true, type: 'switch' },
            { label: '减少碳排放数', key: 'carbon', value: '123' },
            { label: '种下树木', key: 'trees', value: '5' },
            { label: '奉献爱心', key: 'love', value: '365' },
            { label: '年度描述文字', key: 'desc', value: '这一年，你过得怎么样？' },
            { label: '支出了', key: 'out', value: '25980.45' },
            { label: '收到了', key: 'inc', value: '31200.00' }
          ], function (vals) { H().toast('已保存'); nav().reset('AlipaySum2020'); });
        }
      } },
      render: function () {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;padding:20px 0;background:#f5f5f5;min-height:100%';
        /* fixed 324x500 card (mod 3056 sumContentView) with the real bg image */
        var card = document.createElement('div');
        card.style.cssText = 'position:relative;width:324px;height:500px;background:#fff url(' + bg + ') center/cover;border-radius:6px;overflow:hidden;flex:none';
        if (is2019) {
          card.innerHTML = '<div style="position:absolute;left:0;right:0;top:60px;text-align:center">' +
            '<div style="font-size:14px;color:#585757">2019年 · 全年总支出</div>' +
            '<div style="font-size:26px;font-weight:700;color:#4497f7;margin-top:6px">¥25980.45</div>' +
            '<div style="font-size:14px;color:#585757;margin-top:6px">年度关键词：稳稳的幸福</div></div>' +
            '<div style="position:absolute;left:20px;right:20px;top:180px">' +
            '<div style="font-size:14px;font-weight:600;color:#000;margin-bottom:8px">我最爱把钱花在</div>' +
            cats.filter(function (c) { return c.v > 0; }).slice(0, 5).map(function (c) {
              return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0">' +
                '<span style="width:14px;height:14px;border-radius:3px;background:' + c.color + '"></span>' +
                '<span style="flex:1;font-size:13px;color:#585757">' + esc(c.name) + '</span>' +
                '<span style="font-size:14px;font-weight:700;color:#000">¥' + c.v.toFixed(2) + '</span></div>';
            }).join('') +
            '<div style="font-size:13px;color:#585757;margin-top:10px">我想给世界表达一点爱</div></div>' +
            '<div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:12px;color:#999">以下仅展示部分支出类别，更多信息请查看"我的-账单"</div>';
        } else {
          card.innerHTML = '<div style="position:absolute;left:0;right:0;top:50px;text-align:center">' +
            '<div style="font-size:46px;font-weight:500;color:#4773ed">2020</div>' +
            '<div style="font-size:14px;color:#585757;margin-top:12px;line-height:1.8">你好，这一年你在支付宝，<br>至少为世界减少 123 碳排放，<br>种下 5 真树，奉献了 365 爱心。</div>' +
            '<div style="font-size:14px;color:#585757;margin-top:16px">支出了 ¥25980.45　收到了 ¥31200.00</div></div>' +
            '<div style="position:absolute;left:0;right:0;bottom:60px;text-align:center"><button type="button" id="sum-analysis" style="background:#4773ed;color:#fff;border-radius:20px;padding:10px 28px;font-size:15px">收支分析</button></div>' +
            '<div style="position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:12px;color:#999">以上数据截止至2020年12月31日</div>';
        }
        wrap.appendChild(card);
        var an = card.querySelector('#sum-analysis');
        if (an) an.addEventListener('click', function () { nav().push('WechatWalletTransSumPage'); });
        /* 一键隐藏 (2019) */
        var hide = document.createElement('button');
        hide.type = 'button';
        hide.style.cssText = 'margin-top:16px;font-size:15px;color:#1678ff;background:none';
        hide.textContent = '一键隐藏';
        hide.addEventListener('click', function () { H().toast('已隐藏年账单'); nav().pop(); });
        wrap.appendChild(hide);
        return wrap;
      }
    };
  }

  /* ==================== REGISTRY (all 43 pages + tab roots) ==================== */
  var PAGES = {
    home: homePage(),
    newIndex: newIndexPage(),
    me: mePage(),
    settings: settingsPage(),
    account: accountPage(),
    PhoneBarPage: phoneBarPage(),
    NineGridPage: nineGridPage(),
    backup: backupPage(),
    watermark: watermarkPage(),
    login: loginPage(),
    vip: vipPage(),
    helpStub: helpStubPage(),
    feedback: feedbackPage(),
    roleManage: roleManagePage(),
    bankManage: bankManagePage(),
    WebshotPage: webshotPage(),
    StitchPage: stitchPage(),
    walletTab: alipayHomePage(),
    /* WeChat */
    WechatHomePage: wechatHomePage(),
    WechatChatUsersPage: convListPage({ title: '选择对话用户', chatPage: 'WechatChatPage', addLabel: '添加用户' }),
    WechatChatGroupUsersPage: convListPage({ title: '选择群聊', chatPage: 'WechatChatGroupPage', isGroup: true, addLabel: '添加群聊' }),
    WechatChatPage: chatPage({ title: '聊天', kind: 'wechat' }),
    WechatChatGroupPage: chatPage({ title: '群聊', kind: 'wechat', isGroup: true }),
    WechatTimelinePage: timelinePage(),
    WechatTimelineUserPage: timelineUserPage(),
    WechatMeInfoPage: wechatMeInfoPage(),
    FriendsPage: friendsPage(),
    WalletPage: walletGridPage('支付', false),
    WalletNewPage: walletGridPage('支付', true),
    WechatPoketMoneyPage: poketMoneyPage(),
    WechatMoneyDetailPage: moneyDetailPage(),
    WechatMoneyOutPage: moneyOutPage(),
    WechatWalletLi: walletLiPage(),
    WechatWalletTransPage: walletTransPage(),
    WechatWalletTransSumPage: walletTransSumPage(),
    RedpacketPage: redpacketPage(),
    WechatChatPayPage: chatPayPage(),
    WechatChatShoukuanPage: chatShoukuanPage(),
    WechatTransferPage: transferPage(),
    WechatToTransferPage: toTransferPage(),
    WechatChatGroupSendPage: groupSendPage(),
    WechatVideoVoicePage: callPage('voice'),
    WechatVideoVoiceInPage: callPage('video'),
    TaobaoItemPage: taobaoItemPage(),
    /* Alipay */
    AlipayHomePage: alipayHomePage(),
    AlipayChatUsersPage: convListPage({ title: '选择对话用户', chatPage: 'AlipayChatPage', addLabel: '添加用户', kind: 'alipay' }),
    AlipayChatPage: chatPage({ title: '聊天', kind: 'alipay' }),
    AlipayContactPage: alipayContactPage(),
    AlipayAccountPage: alipayAccountPage(),
    AlipayTransferPage: alipayTransferPage(),
    AlipayBalancePage: alipayBalancePage(),
    AlipayBalanceNewPage: alipayBalanceNewPage(),
    AlipayBalanceDetailPage: alipayBalanceDetailPage(),
    AlipayBillPage: alipayBillPage(),
    AlipayNewBillPage: alipayNewBillPage(),
    AlipayMoneyoutPage: alipayMoneyoutPage(),
    AlipayTocardPage: alipayTocardPage(),
    AlipayTocardDetailPage: alipayTocardDetailPage(),
    AlipaySoundPage: alipaySoundPage(),
    AlipaySum2019: alipaySumPage('2019'),
    AlipaySum2020: alipaySumPage('2020')
  };
  return PAGES;
})();
