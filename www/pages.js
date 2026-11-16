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
av.src = msg.isMe? avatarFor(DB.me()): avatarFor(dialog);
rowEl.appendChild(av);
var body = document.createElement('div');
body.className = 'msg-body';
if (isGroup &&!msg.isMe) {
var nm = document.createElement('div');
nm.className = 'msg-name';
nm.textContent = dialog.name || '';
body.appendChild(nm);
}
var bub = document.createElement('div');
bub.className = 'msg-bubble';
if (msg.type === 'text') {
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
vc.innerHTML = '<span>🔊</span><span class="voice-sec">' + esc(msg.second || 3) + '&quot;</span>';
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
bub.className = 'msg-redpacket';
bub.innerHTML = '<div class="rp-top"><span class="rp-ic">🧧</span><span class="rp-text">' + esc(msg.redpacketText || '恭喜发财，大吉大利') + '</span></div>' +
'<div class="rp-sub">' + (msg.isGet? '已领取': '微信红包') + '</div>';
} else if (msg.type === 'transfer') {
bub.className = 'msg-transfer';
bub.innerHTML = '<div class="tf-top"><span class="tf-ic">¥</span><span><div class="tf-amt">¥' + esc(msg.money || '0.00') + '</div><div style="font-size:12px;color:#999">' + esc(msg.transferText || '转账') + '</div></span></div>' +
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
if (msg.type === 'voice') items.push({ label: msg.showTrans? '隐藏转文字': '转文字', fn: function () { msg.showTrans =!msg.showTrans; if (msg.showTrans &&!msg.transText) msg.transText = '（语音转文字内容）'; rerender();}});
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
if (msg.type!== 'notice' && msg.type!== 'assistant') items.push({ label: '切换', fn: function () { msg.isMe =!msg.isMe; rerender();}});
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
function chatPage(opts) {
/* opts: {title, kind: 'wechat'|'alipay', isGroup, dialogId, autoDialog} */
return {
title: opts.title,
navClass: opts.kind === 'wechat'? 'wx': '',
render: function (params) {
var dialogId = (params && params.dialogId) || opts.dialogId;
var dialog = DB.dialog(dialogId) || { id: dialogId, name: opts.title, messages: []};
dialog.messages = dialog.messages || [];
var me = DB.me();
var sendingAsMe = true;
var root = document.createElement('div');
root.style.cssText = 'display:flex;flex-direction:column;height:100%';
var list = document.createElement('div');
list.className = 'scroll chat-list chat-bg';
function rerender() {
list.innerHTML = '';
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
sendingAsMe =!sendingAsMe;
H().toast('切换为发微信');
});
}
}, 0);
/* input bar */
var bar = document.createElement('div');
bar.className = 'chat-inputbar';
var voiceBtn = document.createElement('button');
voiceBtn.type = 'button'; voiceBtn.className = 'chat-tool-btn'; voiceBtn.textContent = '🎙';
var input = document.createElement('input');
input.className = 'chat-input';
input.placeholder = '';
var emojiBtn = document.createElement('button');
emojiBtn.type = 'button'; emojiBtn.className = 'chat-tool-btn'; emojiBtn.textContent = '😊';
var plusBtn = document.createElement('button');
plusBtn.type = 'button'; plusBtn.className = 'chat-tool-btn'; plusBtn.textContent = '+';
var sendBtn = document.createElement('button');
sendBtn.type = 'button'; sendBtn.className = 'chat-send'; sendBtn.textContent = '发送';
sendBtn.addEventListener('click', function () {
var v = input.value.trim();
if (!v) return;
addMsg({ type: 'text', content: v});
input.value = '';
});
input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendBtn.click();});
bar.appendChild(voiceBtn); bar.appendChild(input); bar.appendChild(emojiBtn); bar.appendChild(plusBtn); bar.appendChild(sendBtn);
/* voice mode */
var voiceMode = false;
voiceBtn.addEventListener('click', function () {
voiceMode =!voiceMode;
input.style.display = voiceMode? 'none': '';
if (voiceMode) {
H().openDialog('添加语音', [{ label: '语音秒数（以秒为单位）', key: 'second', value: '3', numeric: true}], function (vals) {
addMsg({ type: 'voice', second: parseInt(vals.second, 10) || 3});
voiceMode = false; input.style.display = '';
});
}
});
/* emoji panel */
emojiBtn.addEventListener('click', function () {
var list = emojiList(opts.kind === 'alipay'? 'alipay': 'wechat');
if (!list.length) { H().toast('暂无表情'); return;}
var box = document.createElement('div');
box.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;max-height:220px;overflow-y:auto';
list.slice(0, 60).forEach(function (src) {
var im = document.createElement('img');
im.src = src; im.style.cssText = 'width:52px;height:52px;object-fit:contain';
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
more.className = 'chat-more-panel';
more.hidden = true;
MORE_ITEMS.forEach(function (item) {
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
} else if (label === '语音通话') {
nav().push('WechatVideoVoicePage', { name: dialog.name, avatar: dialog.avatar});
} else if (label === '视频通话') {
nav().push('WechatVideoVoiceInPage', { name: dialog.name, avatar: dialog.avatar});
} else if (label === '位置') {
addMsg({ type: 'text', content: '[位置]'});
} else if (label === '语音输入') {
H().openDialog('添加语音', [{ label: '语音秒数（以秒为单位）', key: 'second', value: '3', numeric: true}], function (vals) {
addMsg({ type: 'voice', second: parseInt(vals.second, 10) || 3});
});
} else if (label === '收藏' || label === '群工具' || label === '卡券') {
H().toast(label + '（本地暂未实现）');
}
}
root.appendChild(list);
root.appendChild(bar);
root.appendChild(more);
rerender();
return root;
}
};
}

  /* ---------- conversation list factory ---------- */
  function convListPage(opts) {
    /* opts: {title, chatPage, isGroup, addLabel} */
    return {
      title: opts.title,
      render: function () {
        var wrap = document.createElement('div');
        var head = document.createElement('div');
        head.className = 'row-list';
        var add = row(opts.addLabel || '添加用户', '', function () {
          H().openDialog(opts.addLabel || '添加用户', [
            { label: '昵称', key: 'name', value: '' },
            { label: '备注', key: 'remark', value: '' }
          ], function (vals) {
            if (!vals.name) return;
            var ds = DB.dialogs();
            ds.unshift({ id: Date.now(), name: vals.name, avatar: 4, unread: 0, time: H().nowTime(), preview: '', messages: [] });
            DB.saveDialogs(ds);
            render();
          });
        });
        head.appendChild(add);
        wrap.appendChild(head);
        var list = document.createElement('div');
        wrap.appendChild(list);
        function render() {
          list.innerHTML = '';
          DB.dialogs().forEach(function (d) {
            var r = document.createElement('div');
            r.className = 'conv-row';
            var aw = document.createElement('div');
            aw.className = 'conv-avatar-wrap';
            var av = document.createElement('img');
            av.className = 'conv-avatar';
            av.src = avatarFor(d);
            aw.appendChild(av);
            if (d.unread) {
              var b = document.createElement('span');
              b.className = 'conv-badge';
              b.textContent = d.unread;
              aw.appendChild(b);
            }
            var main = document.createElement('div');
            main.className = 'conv-main';
            var nm = document.createElement('div');
            nm.className = 'conv-name';
            nm.textContent = opts.isGroup ? (d.name + (d.groupCount ? '(' + d.groupCount + ')' : '')) : d.name;
            var pv = document.createElement('div');
            pv.className = 'conv-preview';
            pv.textContent = d.preview || '';
            main.appendChild(nm); main.appendChild(pv);
            var tm = document.createElement('div');
            tm.className = 'conv-time';
            tm.textContent = (d.time || '').slice(0, 16);
            r.appendChild(aw); r.appendChild(main); r.appendChild(tm);
            r.addEventListener('click', function () {
              nav().push(opts.chatPage, { dialogId: d.id });
            });
            r.addEventListener('contextmenu', function (e) {
              e.preventDefault();
              H().showPicker('对话操作', ['删除用户', '清空对话内容'], -1, function (label) {
                if (label === '删除用户') {
                  if (DB.dialogs().length <= 1) { H().toast('别删了！再删就没人跟你聊天了！'); return; }
                  DB.saveDialogs(DB.dialogs().filter(function (x) { return x.id !== d.id; }));
                  render();
                } else {
                  d.messages = []; DB.saveDialogs(DB.dialogs()); render();
                }
              });
            });
            list.appendChild(r);
          });
        }
        render();
        return wrap;
      }
    };
  }

  /* ---------- home (_Index, module 1771) ---------- */
  function homePage() {
    return {
      title: '主页',
      noNav: true,
      render: function () {
        var wrap = document.createElement('div');
        var banner = document.createElement('div');
        banner.style.cssText = 'height:150px;background:#f1f1f1;display:flex;align-items:center;justify-content:center;gap:10px';
        var bimg = document.createElement('img');
        bimg.src = img('icon-app-vjietu2') || 'img/ic_launcher.png';
        bimg.style.cssText = 'width:64px;height:64px;border-radius:14px';
        var bt = document.createElement('div');
        bt.innerHTML = '<div style="font-size:20px;font-weight:600;color:#333">好截图2</div><div style="font-size:12px;color:#999;margin-top:4px">微信 · 支付宝 · 淘宝截图生成器</div>';
        banner.appendChild(bimg); banner.appendChild(bt);
        wrap.appendChild(banner);
        HOME_NAV.forEach(function (sec) {
          var s = document.createElement('div');
          s.className = 'nav-section';
          var t = document.createElement('div');
          t.className = 'nav-sec-title';
          t.textContent = sec.section;
          s.appendChild(t);
          var items = document.createElement('div');
          items.className = 'nav-items';
          sec.items.forEach(function (it) {
            var cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'nav-item';
            var icon = document.createElement('img');
            var iconSrc = it.icon ? img(it.icon) : '';
            if (!iconSrc && it.action === 'appIcon') iconSrc = 'img/ic_launcher.png';
            icon.src = iconSrc || 'img/app_images_defaultface.png';
            cell.appendChild(icon);
            var tx = document.createElement('span');
            tx.className = 'nav-text';
            if (it.action === 'toggleViewMode') {
              tx.textContent = '显示模式 - ' + (store().get('phoneViewMode', '0') === '1' ? '深色模式' : '浅色模式');
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
            items.appendChild(cell);
          });
          s.appendChild(items);
          wrap.appendChild(s);
        });
        /* 九宫格首页 (the server-selected _newIndex home, module 3152) */
        var extra = document.createElement('div');
        extra.className = 'nav-section';
        extra.innerHTML = '<div class="nav-sec-title">九宫格首页</div>';
        var ei = document.createElement('div');
        ei.className = 'nav-items';
        var eb = document.createElement('button');
        eb.type = 'button'; eb.className = 'nav-item';
        eb.innerHTML = '<img src="' + (img('icon-app-vjietu2') || 'img/ic_launcher.png') + '" style="width:48px;height:48px;border-radius:10px"><span class="nav-text">九宫格首页</span>';
        eb.addEventListener('click', function () { nav().push('newIndex'); });
        ei.appendChild(eb);
        extra.appendChild(ei);
        wrap.appendChild(extra);
        return wrap;
      }
    };
  }
  function homeNavTap(it) {
    if (it.page) { nav().push(it.page); return; }
    if (it.link) { nav().push('helpStub', { title: it.linkTitle || it.text, link: it.link }); return; }
    if (it.action === 'appIcon') { H().openIconPicker(); return; }
    if (it.action === 'toggleViewMode') { H().toggleViewMode(); return; }
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
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '使用本机系统状态栏 / 无需设置状态栏';
        wrap.appendChild(note);
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
        var title = document.createElement('div');
        title.style.cssText = 'padding:14px;text-align:center;font-size:16px;font-weight:500';
        title.textContent = mask.name;
        wrap.appendChild(title);
        var grid = document.createElement('div');
        grid.className = 'nine-preview';
        for (var i = 0; i < 9; i++) {
          var cell = document.createElement('div');
          cell.style.cssText = 'background:#f0f0f0;position:relative;overflow:hidden';
          if (mask.file) {
            var mi = document.createElement('img');
            mi.src = imgFile(mask.file);
            mi.style.cssText = 'width:100%;height:100%;object-fit:cover;opacity:.35';
            cell.appendChild(mi);
          }
          grid.appendChild(cell);
        }
        wrap.appendChild(grid);
        var btns = document.createElement('div');
        btns.style.cssText = 'padding:0 14px;display:flex;flex-direction:column;gap:10px';
        var pickBtn = document.createElement('button');
        pickBtn.type = 'button'; pickBtn.className = 'btn-primary'; pickBtn.style.margin = '8px 0 0';
        pickBtn.textContent = '选择图片';
        var saveBtn = document.createElement('button');
        saveBtn.type = 'button'; saveBtn.className = 'btn-primary green'; saveBtn.style.margin = '0';
        saveBtn.textContent = '保存图片';
        btns.appendChild(pickBtn); btns.appendChild(saveBtn);
        wrap.appendChild(btns);
        var tiles = [];
        function cutImage(imgEl) {
          var size = Math.min(imgEl.naturalWidth, imgEl.naturalHeight);
          var sx = (imgEl.naturalWidth - size) / 2, sy = (imgEl.naturalHeight - size) / 2;
          var tile = Math.floor(size / 3);
          tiles = [];
          grid.innerHTML = '';
          for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {
              var cv = document.createElement('canvas');
              cv.width = tile; cv.height = tile;
              var ctx = cv.getContext('2d');
              ctx.drawImage(imgEl, sx + c * tile, sy + r * tile, tile, tile, 0, 0, tile, tile);
              if (mask.file) {
                var mimg = new Image();
                mimg.src = imgFile(mask.file);
                ctx.globalAlpha = 0.9;
                ctx.drawImage(mimg, 0, 0, tile, tile);
                ctx.globalAlpha = 1;
              }
              var cell = document.createElement('div');
              cell.appendChild(cv);
              grid.appendChild(cell);
              tiles.push(cv);
            }
          }
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
          var saved = 0;
          tiles.slice().reverse().forEach(function (cv) {
            var a = document.createElement('a');
            a.href = cv.toDataURL('image/png');
            a.download = 'ninegrid_' + (saved + 1) + '.png';
            a.click();
            saved++;
          });
          H().showAlert('提示', '成功保存' + saved + '张图片到相册');
        });
        return wrap;
      }
    };
  }

  /* ---------- 我 (_Me, module 3176) ---------- */
  function mePage() {
    return {
      title: '我的',
      render: function () {
        var wrap = document.createElement('div');
        var me = DB.me();
        var head = document.createElement('div');
        head.style.cssText = 'background:#fff;padding:22px 14px;display:flex;gap:12px;align-items:center';
        var av = document.createElement('img');
        av.src = avatarFor(me);
        av.style.cssText = 'width:60px;height:60px;border-radius:8px;object-fit:cover';
        var nm = document.createElement('div');
        nm.innerHTML = '<div style="font-size:17px;font-weight:600">' + esc(DB.loggedIn() ? me.nickname : '请登录') + '</div>' +
          '<div style="font-size:13px;color:#999;margin-top:4px">' + esc(DB.loggedIn() ? ('微信号：' + me.wechat) : '点击登录账号') + '</div>';
        head.appendChild(av); head.appendChild(nm);
        head.addEventListener('click', function () {
          nav().push(DB.loggedIn() ? 'account' : 'login');
        });
        wrap.appendChild(head);
        wrap.appendChild(gap());
        var rows = [
          { label: '状态', value: '正常' },
          { label: '会员类型', value: '非会员' },
          { label: '到期时间', value: '—' }
        ];
        var lw = listWrap(rows.map(function (r) { return row(r.label, r.value); }));
        wrap.appendChild(lw);
        wrap.appendChild(gap());
        var rows2 = [
          { label: '代理商', fn: function () { nav().push('helpStub', { title: '代理商' }); } },
          { label: '卡密激活', fn: function () { nav().push('helpStub', { title: '卡密激活' }); } },
          { label: '卡密查询', fn: function () { nav().push('helpStub', { title: '卡密查询' }); } },
          { label: '开通会员去水印', fn: function () { nav().push('vip'); }, red: true },
          { label: '在线客服', fn: function () { nav().push('helpStub', { title: '在线客服' }); } }
        ];
        var lw2 = listWrap(rows2.map(function (r) {
          var elx = row(r.label, '');
          if (r.red) elx.querySelector('.row-label').style.color = '#f00';
          elx.addEventListener('click', r.fn);
          return elx;
        }));
        wrap.appendChild(lw2);
        return wrap;
      }
    };
  }

  /* ---------- 更多 (_Setting, module 3185) ---------- */
  function settingsPage() {
    return {
      title: '更多',
      render: function () {
        var wrap = document.createElement('div');
        var rows = [
          { label: '建议意见', fn: function () { nav().push('feedback'); } },
          { label: '客服QQ', value: '暂未设置', fn: function () { H().toast('客服QQ暂未设置'); } },
          { label: '客服微信', value: '暂未设置', fn: function () { H().toast('客服微信暂未设置'); } },
          { label: '客服支付宝', value: '暂未设置', fn: function () { H().toast('客服支付宝暂未设置'); } },
          { label: '角色管理', fn: function () { nav().push('roleManage'); } },
          { label: '银行卡管理', fn: function () { nav().push('bankManage'); } },
          { label: '数据备份与恢复', fn: function () { nav().push('backup'); } },
          { label: '恢复初始设置', fn: function () {
            H().showAlert('提示', '恢复初始设置将清除您的所有设置信息，您确认要继续？');
            var ok = H().$('alert-ok');
            ok.onclick = function () {
              H().$('alert-overlay').hidden = true;
              try { Object.keys(window.localStorage).filter(function (k) { return k.indexOf('hjt:') === 0; }).forEach(function (k) { window.localStorage.removeItem(k); }); } catch (e) {}
              H().toast('已恢复初始设置');
              nav().reset('home');
            };
          } },
          { label: '用户协议', fn: function () { nav().push('helpStub', { title: '用户协议' }); } },
          { label: '检测更新', fn: function () { H().showAlert('提示', '您的应用版本已是最新.'); } },
          { label: '版权所有', value: '微截图 - 4.4.5' }
        ];
        wrap.appendChild(listWrap(rows.map(function (r) {
          var elx = row(r.label, r.value || '');
          if (r.fn) elx.addEventListener('click', r.fn);
          return elx;
        })));
        wrap.appendChild(saveButton('退出软件', function () {
          H().showAlert('提示', '您确认要退出软件？');
          var ok = H().$('alert-ok');
          ok.onclick = function () { H().$('alert-overlay').hidden = true; H().toast('已退出（网页版请直接关闭页面）'); };
        }));
        return wrap;
      }
    };
  }

  /* ---------- 账号设置 (_Account, module 3177) ---------- */
  function accountPage() {
    return {
      title: '账号设置',
      right: { text: '保存', onClick: function () { H().toast('已保存'); } },
      render: function () {
        var me = DB.me();
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var fields = {};
        function addRow(label, input) { form.appendChild(formRow(label, input)); return input; }
        var avRow = document.createElement('div');
        avRow.className = 'form-row';
        avRow.innerHTML = '<div class="form-label">头像</div>';
        var avImg = document.createElement('img');
        avImg.src = avatarFor(me);
        avImg.style.cssText = 'width:44px;height:44px;border-radius:6px;object-fit:cover';
        avRow.appendChild(avImg);
        avRow.addEventListener('click', function () {
          H().showPicker('选择头像', ['拍照', '相册'], -1, function (label) {
            var fp = H().$('file-picker');
            fp.onchange = function () {
              var f = fp.files && fp.files[0];
              if (!f) return;
              var rd = new FileReader();
              rd.onload = function () { me.avatarData = rd.result; avImg.src = rd.result; DB.saveMe(me); };
              rd.readAsDataURL(f);
            };
            fp.click();
          });
        });
        form.appendChild(avRow);
        fields.nickname = addRow('昵称', textInput(me.nickname));
        fields.sex = addRow('性别', (function () {
          var s = document.createElement('select');
          s.className = 'form-input';
          ['男', '女'].forEach(function (o) { var op = document.createElement('option'); op.value = o; op.textContent = o; if ((me.sex || '男') === o) op.selected = true; s.appendChild(op); });
          return s;
        })());
        fields.name = addRow('真实姓名', textInput(me.name));
        fields.qq = addRow('QQ', textInput(me.qq || ''));
        fields.wechat = addRow('微信号', textInput(me.wechat));
        fields.alipay = addRow('支付宝账号', textInput(me.alipay));
        fields.alipayLevel = addRow('支付宝等级', (function () {
          var s = document.createElement('select');
          s.className = 'form-input';
          MEMBER_LEVELS.forEach(function (o) { var op = document.createElement('option'); op.value = o; op.textContent = o; if ((me.alipayLevelName || '非会员') === o) op.selected = true; s.appendChild(op); });
          return s;
        })());
        fields.birthday = addRow('生日', (function () {
          var i = document.createElement('input');
          i.className = 'form-input'; i.type = 'date'; i.value = me.birthday || '1990-01-01';
          return i;
        })());
        fields.remark = addRow('签名', textInput(me.remark));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('保存', function () {
          me.nickname = fields.nickname.value;
          me.sex = fields.sex.value;
          me.name = fields.name.value;
          me.qq = fields.qq.value;
          me.wechat = fields.wechat.value;
          me.alipay = fields.alipay.value;
          me.alipayLevelName = fields.alipayLevel.value;
          me.birthday = fields.birthday.value;
          me.remark = fields.remark.value;
          DB.saveMe(me);
          H().toast('已保存');
        }));
        wrap.appendChild(saveButton('退出登录', function () {
          H().showAlert('提示', '您确认要退出登录?');
          var ok = H().$('alert-ok');
          ok.onclick = function () {
            H().$('alert-overlay').hidden = true;
            DB.setLoggedIn(false);
            H().toast('已退出登录');
            nav().goTab('home');
          };
        }));
        var lastBtn = wrap.querySelectorAll('.btn-primary');
        if (lastBtn.length > 1) lastBtn[1].style.background = '#f44';
        return wrap;
      }
    };
  }

  /* ---------- 状态栏机型设置 (module 1826) ---------- */
  function phoneBarPage() {
    return {
      title: '手机型号设置',
      render: function () {
        var cfg = DB.phoneBar();
        var wrap = document.createElement('div');
        /* live preview */
        var prev = document.createElement('div');
        prev.className = 'statusbar-demo';
        function renderPreview() {
          var m = PHONE_MODELS[cfg.modelIndex || 0];
          var t = (cfg.time || '2018-10-24 17:38:37').slice(11, 16);
          prev.innerHTML = '<span>' + esc(t) + '</span><span>' +
            (cfg.showWifi ? '📶 ' : '') + (cfg.showBluetooth ? '🔵 ' : '') +
            '🔋' + (cfg.showPowerPersent ? cfg.power + '%' : '') + '</span>';
        }
        renderPreview();
        wrap.appendChild(prev);
        var modelWrap = document.createElement('div');
        modelWrap.className = 'row-list';
        PHONE_MODELS.forEach(function (m, i) {
          var r = document.createElement('div');
          r.className = 'phone-model-row' + ((cfg.modelIndex || 0) === i ? ' sel' : '');
          r.innerHTML = '<span style="flex:1">' + esc(m.label) + (m.tip ? ' <span style="color:#999;font-size:12px">' + esc(m.tip) + '</span>' : '') + '</span>' +
            (((cfg.modelIndex || 0) === i) ? '<span>✓</span>' : '');
          r.addEventListener('click', function () {
            cfg.modelIndex = i;
            DB.savePhoneBar(cfg);
            renderPreview();
            nav().reset('PhoneBarPage');
          });
          modelWrap.appendChild(r);
        });
        wrap.appendChild(modelWrap);
        wrap.appendChild(gap());
        var form = document.createElement('div');
        form.className = 'form';
        var f = {};
        f.cellular1 = formRow('营运商1', textInput(cfg.cellular1));
        f.cellular2 = formRow('营运商2', textInput(cfg.cellular2));
        f.time = formRow('手机时间', textInput(cfg.time));
        f.power = formRow('电量', (function () {
          var inp = document.createElement('input');
          inp.type = 'range'; inp.min = 0; inp.max = 100; inp.value = cfg.power;
          inp.style.flex = '1';
          return inp;
        })());
        f.network = formRow('网络', (function () {
          var s = document.createElement('select');
          s.className = 'form-input';
          ['wifi', '4G', '5G'].forEach(function (o, i) { var op = document.createElement('option'); op.value = String(i); op.textContent = o; if (cfg.network === i) op.selected = true; s.appendChild(op); });
          return s;
        })());
        Object.keys(f).forEach(function (k) { form.appendChild(f[k]); });
        wrap.appendChild(form);
        wrap.appendChild(saveButton('保存', function () {
          cfg.cellular1 = f.cellular1.querySelector('input').value;
          cfg.cellular2 = f.cellular2.querySelector('input').value;
          cfg.time = f.time.querySelector('input').value;
          cfg.power = parseInt(f.power.querySelector('input').value, 10);
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
        var ta = document.createElement('textarea');
        ta.className = 'form-input';
        ta.style.cssText = 'width:100%;height:180px;padding:10px;font-size:12px;font-family:monospace;box-sizing:border-box';
        ta.placeholder = '备份数据（JSON）';
        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:10px;padding:0 14px';
        var exp = document.createElement('button');
        exp.type = 'button'; exp.className = 'btn-primary'; exp.style.margin = '0'; exp.style.flex = '1';
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
        imp.type = 'button'; imp.className = 'btn-primary green'; imp.style.margin = '0'; imp.style.flex = '1';
        imp.textContent = '恢复数据';
        imp.addEventListener('click', function () {
          try {
            var out = JSON.parse(ta.value || '{}');
            Object.keys(out).forEach(function (k) { window.localStorage.setItem(k, out[k]); });
            H().toast('恢复数据成功，请重启应用');
          } catch (e) { H().toast('恢复失败：数据格式不正确'); }
        });
        btns.appendChild(exp); btns.appendChild(imp);
        wrap.appendChild(ta); wrap.appendChild(btns);
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '原版的数据备份与恢复通过服务端完成；本地版使用本机存储导出/导入 JSON。';
        wrap.appendChild(note);
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
  function wechatHomePage() {
    return {
      title: '微信',
      render: function () {
        var wrap = document.createElement('div');
        var search = document.createElement('div');
        search.style.cssText = 'background:#fff;padding:8px 12px';
        search.innerHTML = '<div style="background:#ededed;border-radius:6px;padding:8px;text-align:center;color:#999;font-size:14px">🔍 搜索</div>';
        wrap.appendChild(search);
        var list = document.createElement('div');
        DB.dialogs().forEach(function (d) {
          var r = document.createElement('div');
          r.className = 'conv-row';
          var aw = document.createElement('div');
          aw.className = 'conv-avatar-wrap';
          var av = document.createElement('img');
          av.className = 'conv-avatar';
          av.src = avatarFor(d);
          aw.appendChild(av);
          if (d.unread) {
            var b = document.createElement('span');
            b.className = 'conv-badge';
            b.textContent = d.unread;
            aw.appendChild(b);
          }
          var main = document.createElement('div');
          main.className = 'conv-main';
          main.innerHTML = '<div class="conv-name">' + esc(d.name) + '</div><div class="conv-preview">' + esc(d.preview || '') + '</div>';
          var tm = document.createElement('div');
          tm.className = 'conv-time';
          tm.textContent = (d.time || '').slice(11, 16);
          r.appendChild(aw); r.appendChild(main); r.appendChild(tm);
          r.addEventListener('click', function () { nav().push('WechatChatPage', { dialogId: d.id }); });
          list.appendChild(r);
        });
        wrap.appendChild(list);
        return wrap;
      }
    };
  }

  /* ---------- 朋友圈 (WechatTimelinePage / UserPage) ---------- */
  function timelinePage() {
    return {
      title: '朋友圈',
      render: function (params) {
        var wrap = document.createElement('div');
        var me = DB.me();
        var cover = document.createElement('div');
        cover.style.cssText = 'position:relative;height:180px;background:#1ea1f3;display:flex;align-items:flex-end;justify-content:flex-end;padding:12px';
        var nick = document.createElement('div');
        nick.style.cssText = 'color:#fff;font-weight:600;margin-right:10px;margin-bottom:22px';
        nick.textContent = me.nickname;
        var av = document.createElement('img');
        av.src = avatarFor(me);
        av.style.cssText = 'width:64px;height:64px;border-radius:8px;border:2px solid #fff;object-fit:cover';
        cover.appendChild(nick); cover.appendChild(av);
        wrap.appendChild(cover);
        var list = document.createElement('div');
        list.style.cssText = 'background:#fff;padding:12px 14px';
        function render() {
          list.innerHTML = '';
          DB.timeline().forEach(function (p) {
            var item = document.createElement('div');
            item.style.cssText = 'display:flex;gap:10px;padding:12px 0;border-bottom:1px solid #f0f0f0';
            var aim = document.createElement('img');
            aim.src = avatarFor(p);
            aim.style.cssText = 'width:40px;height:40px;border-radius:6px;object-fit:cover';
            var body = document.createElement('div');
            body.style.flex = '1';
            body.innerHTML = '<div style="color:#576b95;font-weight:600">' + esc(p.nickname) + '</div>' +
              '<div style="margin:4px 0">' + esc(p.content) + '</div>' +
              '<div style="color:#999;font-size:12px">' + esc(p.time) + '</div>';
            item.appendChild(aim); item.appendChild(body);
            list.appendChild(item);
          });
        }
        render();
        wrap.appendChild(list);
        wrap.appendChild(saveButton('发布朋友圈', function () {
          H().openDialog('添加朋友圈', [{ label: '朋友圈内容', key: 'content', value: '' }], function (vals) {
            if (!vals.content) return;
            var tl = DB.timeline();
            tl.unshift({ id: Date.now(), nickname: me.nickname, content: vals.content, time: H().nowTime() });
            DB.saveTimeline(tl);
            render();
          });
        }));
        return wrap;
      }
    };
  }
  function timelineUserPage() {
    return {
      title: '朋友圈',
      render: function (params) {
        var wrap = document.createElement('div');
        var me = DB.me();
        var head = document.createElement('div');
        head.style.cssText = 'background:#fff;padding:18px;display:flex;gap:12px;align-items:center';
        var av = document.createElement('img');
        av.src = avatarFor(me);
        av.style.cssText = 'width:52px;height:52px;border-radius:8px;object-fit:cover';
        head.appendChild(av);
        var nm = document.createElement('div');
        nm.innerHTML = '<div style="font-weight:600">' + esc(me.nickname) + '</div><div style="color:#999;font-size:13px">微信号：' + esc(me.wechat) + '</div>';
        head.appendChild(nm);
        wrap.appendChild(head);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('朋友圈', '', function () { nav().push('WechatTimelinePage'); }),
          row('设置', '', function () { H().toast('本地暂未实现'); })
        ]));
        return wrap;
      }
    };
  }
  function wechatMeInfoPage() {
    return {
      title: '个人信息',
      render: function () {
        var me = DB.me();
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var fields = {};
        fields.nickname = formRow('昵称', textInput(me.nickname));
        fields.wechat = formRow('微信号', textInput(me.wechat));
        fields.remark = formRow('个性签名', textInput(me.remark));
        Object.keys(fields).forEach(function (k) { form.appendChild(fields[k]); });
        wrap.appendChild(form);
        wrap.appendChild(saveButton('保存', function () {
          me.nickname = fields.nickname.querySelector('input').value;
          me.wechat = fields.wechat.querySelector('input').value;
          me.remark = fields.remark.querySelector('input').value;
          DB.saveMe(me);
          H().toast('已保存');
        }));
        return wrap;
      }
    };
  }
  function friendsPage() {
    return {
      title: '通讯录',
      render: function () {
        var wrap = document.createElement('div');
        var list = document.createElement('div');
        DB.roles().forEach(function (r) {
          var elx = row(r.nickname, r.remark || '', function () {
            nav().push('WechatChatPage', { dialogId: r.id });
          });
          var av = document.createElement('img');
          av.className = 'row-icon';
          av.src = avatarFor(r);
          elx.insertBefore(av, elx.firstChild);
          list.appendChild(elx);
        });
        wrap.appendChild(list);
        return wrap;
      }
    };
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
      { text: '唯品会特卖', icon: 22 }, { text: '转转二手', icon: 21 }
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
      { text: '防疫健康码', icon: 30, sub: '限时推广' }
    ] },
    { section: '交通出行', items: [
      { text: '出行服务', icon: 27 }, { text: '火车票机票', icon: 26 },
      { text: '滴滴出行', icon: 11 }, { text: '酒店', icon: 25 }
    ] },
    { section: '购物消费', items: [
      { text: '智慧零售', icon: 28 }, { text: '京东购物', icon: 12 },
      { text: '美团外卖', icon: 13 }, { text: '电影演出', icon: 14, sub: '赛事' },
      { text: '吃喝玩乐', icon: 15 }, { text: '拼多多', icon: 24 },
      { text: '蘑菇街女装', icon: 23 }, { text: '唯品会特卖', icon: 22 },
      { text: '转转二手', icon: 21 }
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
        /* top: 支付 / 收付款 (new-wallet-icon-top1/top2) */
        var top = document.createElement('div');
        top.style.cssText = 'background:#fff;padding:16px;display:flex;gap:12px';
        [['支付', 'WechatChatPayPage', 'new-wallet-icon-top1'], ['收付款', 'WechatChatShoukuanPage', 'new-wallet-icon-top2']].forEach(function (t) {
          var b = document.createElement('button');
          b.type = 'button';
          b.style.cssText = 'flex:1;background:#f7f7f7;border:1px solid #eee;border-radius:8px;padding:14px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:16px';
          var ic = img(t[2]);
          b.innerHTML = (ic ? '<img src="' + ic + '" style="width:26px;height:26px">' : '') + '<span>' + esc(t[0]) + '</span>';
          b.addEventListener('click', function () { nav().push(t[1]); });
          top.appendChild(b);
        });
        wrap.appendChild(top);
        var openMore = !isNew && store().get('walletOpenMore', '0') === '1';
        sections.forEach(function (sec, si) {
          var s = document.createElement('div');
          s.className = 'nav-section';
          s.innerHTML = '<div class="nav-sec-title">' + esc(sec.section) + '</div>';
          var grid = document.createElement('div');
          grid.className = 'grid-3';
          function addCell(it) {
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
        wrap.appendChild(saveButton('钱包明细', function () { nav().push('WechatWalletTransPage'); }));
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
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:26px 16px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;color:#999">我的零钱</div>' +
          '<div style="font-size:36px;margin-top:8px">¥<span id="pocket-balance">' + esc(w.balance) + '</span></div>';
        wrap.appendChild(card);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('充值', '', function () {
            H().openDialog('充值', [{ label: '充值金额', key: 'amount', value: '100.00', numeric: true }], function (vals) {
              w.balance = (parseFloat(w.balance) + parseFloat(vals.amount || 0)).toFixed(2);
              DB.saveWallet(w);
              var el = document.getElementById('pocket-balance');
              if (el) el.textContent = w.balance;
            });
          }),
          row('提现', '', function () {
            H().openDialog('提现', [{ label: '提现金额', key: 'amount', value: '100.00', numeric: true }], function (vals) {
              w.balance = Math.max(0, parseFloat(w.balance) - parseFloat(vals.amount || 0)).toFixed(2);
              DB.saveWallet(w);
              var el = document.getElementById('pocket-balance');
              if (el) el.textContent = w.balance;
            });
          }),
          row('零钱明细', '', function () { nav().push('WechatWalletTransPage'); }),
          row('设置', '', function () { H().toast('本地暂未实现'); })
        ]));
        return wrap;
      }
    };
  }
  function moneyDetailPage() {
    return {
      title: '零钱明细',
      render: function () {
        return transList(DB.walletTrans(), 'wechat');
      }
    };
  }
  function transList(rows, kind) {
    var wrap = document.createElement('div');
    if (!rows.length) {
      var e = document.createElement('div');
      e.className = 'form-note';
      e.textContent = '暂无记录';
      wrap.appendChild(e);
      return wrap;
    }
    var list = document.createElement('div');
    rows.forEach(function (r) {
      var elx = row(r.name || r.title || '', r.amount ? ('¥' + r.amount) : '', null);
      var sub = document.createElement('div');
      sub.style.cssText = 'color:#999;font-size:12px;margin-top:2px';
      sub.textContent = (r.time || '') + '  ' + (r.status || r.result || '');
      elx.querySelector('.row-label').appendChild(sub);
      list.appendChild(elx);
    });
    wrap.appendChild(list);
    return wrap;
  }
  function moneyOutPage() {
    return {
      title: '微信支付',
      render: function () {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:20px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;color:#999">微信支付收款到账通知</div><div style="font-size:30px;margin-top:10px">¥0.00</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('添加收款记录', function () {
          H().openDialog('添加收款记录', [
            { label: '金额', key: 'amount', value: '100.00', numeric: true },
            { label: '说明', key: 'name', value: '微信支付' }
          ], function (vals) {
            var t = DB.walletTrans();
            t.unshift({ name: vals.name, amount: vals.amount, status: '已存入零钱', time: H().nowTime() });
            DB.saveWalletTrans(t);
            H().toast('已添加');
            nav().reset('WechatMoneyOutPage');
          });
        }));
        return wrap;
      }
    };
  }
  function walletLiPage() {
    return {
      title: '零钱通',
      render: function () {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:20px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;color:#999">零钱通余额</div><div style="font-size:30px;margin-top:10px">¥0.00</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('明细', function () { nav().push('WechatWalletTransPage'); }));
        return wrap;
      }
    };
  }
  function walletTransPage() {
    return {
      title: '钱包明细',
      render: function () {
        return transList(DB.walletTrans(), 'wechat');
      }
    };
  }
  function walletTransSumPage() {
    return {
      title: '钱包收支汇总',
      render: function () {
        var rows = DB.walletTrans();
        var income = 0, outcome = 0;
        rows.forEach(function (r) {
          var a = parseFloat(r.amount || 0);
          if ((r.status || '').indexOf('支付') >= 0 || (r.status || '').indexOf('转给') >= 0) outcome += a;
          else income += a;
        });
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:20px;text-align:center';
        card.innerHTML = '<div>收入 ¥' + income.toFixed(2) + '</div><div style="margin-top:8px">支出 ¥' + outcome.toFixed(2) + '</div>';
        wrap.appendChild(card);
        return wrap;
      }
    };
  }

  /* ---------- 红包 (RedpacketPage) ---------- */
  function redpacketPage() {
    return {
      title: '红包',
      render: function (params) {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fa9d3b;color:#fff;padding:30px 16px;text-align:center';
        card.innerHTML = '<div style="font-size:15px">微信红包</div><div style="font-size:34px;margin-top:12px">¥' + esc((params && params.money) || '8.88') + '</div>' +
          '<div style="margin-top:8px;font-size:13px">恭喜发财，大吉大利</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('开', function () { H().toast('已领取'); nav().pop(); }));
        return wrap;
      }
    };
  }
  /* ---------- 收付款 / 转账 (WeChat) ---------- */
  function chatPayPage() {
    return {
      title: '收付款',
      render: function () {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:26px 16px;text-align:center';
        card.innerHTML = '<img src="img/app_images_defaultface.png" style="width:150px;height:150px;border:1px solid #eee"><div style="margin-top:10px;color:#666">扫一扫向我付款</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('设置金额', function () {
          H().openDialog('设置金额', [{ label: '金额', key: 'amount', value: '100.00', numeric: true }], function (vals) {
            H().toast('已设置金额 ¥' + vals.amount);
          });
        }));
        return wrap;
      }
    };
  }
  function chatShoukuanPage() {
    return {
      title: '收款码',
      render: function () {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:26px 16px;text-align:center';
        card.innerHTML = '<div style="font-size:15px;font-weight:600">我收钱</div><img src="img/app_images_defaultface.png" style="width:150px;height:150px;border:1px solid #eee;margin-top:12px"><div style="margin-top:10px;color:#666">扫一扫向我付钱</div>';
        wrap.appendChild(card);
        return wrap;
      }
    };
  }
  function transferPage() {
    return {
      title: '转账',
      render: function (params) {
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var amt = textInput('100.00', '转账金额');
        var desc = textInput('转账', '转账说明');
        form.appendChild(formRow('转账金额', amt));
        form.appendChild(formRow('转账说明', desc));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('确认转账', function () {
          if (!amt.value) { H().toast('请输入金额'); return; }
          H().showAlert('提示', '已成功转账 ¥' + amt.value);
          var ok = H().$('alert-ok');
          ok.onclick = function () { H().$('alert-overlay').hidden = true; nav().pop(); };
        }));
        return wrap;
      }
    };
  }
  function toTransferPage() {
    return {
      title: '转账到银行卡',
      render: function () {
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var bankSel = document.createElement('select');
        bankSel.className = 'form-input';
        BANKS.forEach(function (b) { var op = document.createElement('option'); op.value = b.name; op.textContent = b.name; bankSel.appendChild(op); });
        var amt = textInput('100.00', '转账金额');
        form.appendChild(formRow('收款银行', bankSel));
        form.appendChild(formRow('转账金额', amt));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('确认转账', function () {
          nav().push('AlipayTocardDetailPage', { bank: bankSel.value, amount: amt.value });
        }));
        return wrap;
      }
    };
  }
  function groupSendPage() {
    return {
      title: '群发助手',
      render: function () {
        var wrap = document.createElement('div');
        var list = document.createElement('div');
        var selected = {};
        DB.dialogs().forEach(function (d) {
          var r = document.createElement('div');
          r.className = 'row';
          var cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.style.marginRight = '8px';
          cb.addEventListener('change', function () { selected[d.id] = cb.checked; });
          var nm = document.createElement('div');
          nm.className = 'row-label';
          nm.textContent = d.name;
          r.appendChild(cb); r.appendChild(nm);
          list.appendChild(r);
        });
        wrap.appendChild(list);
        var form = document.createElement('div');
        form.className = 'form';
        var content = textInput('', '群发内容');
        form.appendChild(formRow('群发内容', content));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('发送', function () {
          var targets = DB.dialogs().filter(function (d) { return selected[d.id]; });
          if (!targets.length) { H().toast('请选择接收人'); return; }
          if (!content.value) { H().toast('请输入群发内容'); return; }
          targets.forEach(function (d) {
            d.messages = d.messages || [];
            d.messages.push({ type: 'groupsend', content: content.value, isMe: true });
            d.preview = content.value;
            d.time = H().nowTime();
          });
          DB.saveDialogs(DB.dialogs());
          H().toast('已群发给 ' + targets.length + ' 人');
          nav().pop();
        }));
        return wrap;
      }
    };
  }
  /* ---------- 语音/视频通话 ---------- */
  function callPage(kind) {
    return {
      title: kind === 'video' ? '视频通话' : '语音通话',
      render: function (params) {
        var name = (params && params.name) || '对方';
        var wrap = document.createElement('div');
        wrap.style.cssText = 'background:#111;color:#fff;height:100%;display:flex;flex-direction:column;align-items:center;padding-top:60px';
        var av = document.createElement('img');
        av.src = avatarFor(params && params.avatar);
        av.style.cssText = 'width:90px;height:90px;border-radius:50%;object-fit:cover';
        var nm = document.createElement('div');
        nm.style.cssText = 'font-size:20px;margin-top:14px';
        nm.textContent = name;
        var tm = document.createElement('div');
        tm.style.cssText = 'color:#aaa;margin-top:6px;font-size:14px';
        tm.textContent = '00:00';
        var secs = 0;
        var timer = setInterval(function () {
          secs++;
          var m = String(Math.floor(secs / 60)).padStart(2, '0');
          var s = String(secs % 60).padStart(2, '0');
          tm.textContent = m + ':' + s;
        }, 1000);
        var hang = document.createElement('button');
        hang.type = 'button';
        hang.style.cssText = 'margin-top:auto;margin-bottom:50px;background:#f44;color:#fff;border:none;border-radius:50%;width:64px;height:64px;font-size:26px';
        hang.textContent = '✕';
        hang.addEventListener('click', function () {
          clearInterval(timer);
          nav().pop();
        });
        wrap.appendChild(av); wrap.appendChild(nm); wrap.appendChild(tm); wrap.appendChild(hang);
        return wrap;
      }
    };
  }
  function taobaoItemPage() {
    return {
      title: '商品详情',
      render: function () {
        var wrap = document.createElement('div');
        var imgEl = document.createElement('img');
        imgEl.src = 'img/app_images_defaultface.png';
        imgEl.style.cssText = 'width:100%;aspect-ratio:1;object-fit:cover;background:#fff';
        wrap.appendChild(imgEl);
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:14px';
        card.innerHTML = '<div style="color:#f00;font-size:22px">¥99.00</div><div style="font-size:15px;margin-top:8px">商品标题（示例）</div><div style="color:#999;font-size:13px;margin-top:6px">淘宝 · 好截图2 示例商品</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('立即购买', function () {
          H().showAlert('提示', '本页为本地示例（原版淘宝订单页内容来自服务端），无法完成购买。');
        }));
        return wrap;
      }
    };
  }

  /* ---------- 支付宝 ---------- */
  function alipayHomePage() {
    return {
      title: '支付宝',
      render: function () {
        var b = DB.alipayBalance();
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#1677ff;color:#fff;padding:20px 16px';
        card.innerHTML = '<div style="font-size:13px;opacity:.85">总资产（元）</div><div style="font-size:34px;margin-top:6px">' + esc(b.balance) + '</div><div style="margin-top:10px;font-size:13px">余额宝 · 花呗 · 借呗</div>';
        wrap.appendChild(card);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('余额', '¥' + b.balance, function () { nav().push('AlipayBalancePage'); }),
          row('账单', '', function () { nav().push('AlipayBillPage'); }),
          row('转账', '', function () { nav().push('AlipayTransferPage'); }),
          row('收款', '', function () { nav().push('AlipaySoundPage'); }),
          row('我的', '', function () { nav().push('AlipayAccountPage'); }),
          row('通讯录', '', function () { nav().push('AlipayContactPage'); })
        ]));
        return wrap;
      }
    };
  }
  function alipayContactPage() {
    return {
      title: '通讯录',
      render: function () {
        var wrap = document.createElement('div');
        var list = document.createElement('div');
        DB.roles().forEach(function (r) {
          var elx = row(r.nickname, r.remark || '', function () {
            nav().push('AlipayChatPage', { dialogId: r.id });
          });
          var av = document.createElement('img');
          av.className = 'row-icon';
          av.src = avatarFor(r);
          elx.insertBefore(av, elx.firstChild);
          list.appendChild(elx);
        });
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  function alipayAccountPage() {
    return {
      title: '我的',
      render: function () {
        var me = DB.me();
        var wrap = document.createElement('div');
        var head = document.createElement('div');
        head.style.cssText = 'background:#fff;padding:22px 14px;display:flex;gap:12px;align-items:center';
        var av = document.createElement('img');
        av.src = avatarFor(me);
        av.style.cssText = 'width:60px;height:60px;border-radius:50%;object-fit:cover';
        var nm = document.createElement('div');
        nm.innerHTML = '<div style="font-size:17px;font-weight:600">' + esc(me.nickname) + '</div>' +
          '<div style="font-size:13px;color:#999;margin-top:4px">支付宝账号：' + esc(me.alipay) + '</div>' +
          '<div style="font-size:13px;color:#999;margin-top:2px">芝麻信用：' + esc(me.alipayLevelName || '非会员') + '</div>';
        head.appendChild(av); head.appendChild(nm);
        wrap.appendChild(head);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('余额', '¥' + DB.alipayBalance().balance, function () { nav().push('AlipayBalancePage'); }),
          row('账单', '', function () { nav().push('AlipayBillPage'); }),
          row('银行卡', '', function () { nav().push('bankManage'); }),
          row('设置', '', function () { nav().push('settings'); })
        ]));
        return wrap;
      }
    };
  }
  function alipayTransferPage() {
    return {
      title: '转账',
      render: function () {
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var to = textInput('', '对方姓名/账号');
        var amt = textInput('200.00', '转账金额');
        form.appendChild(formRow('收款人', to));
        form.appendChild(formRow('转账金额', amt));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('确认转账', function () {
          if (!amt.value) { H().toast('请输入金额'); return; }
          var bills = DB.alipayBill();
          bills.unshift({ title: '转账-' + (to.value || '马克_SHI'), amount: amt.value, status: '交易成功', time: H().nowTime() });
          DB.saveAlipayBill(bills);
          H().showAlert('提示', '已成功转账 ¥' + amt.value);
          var ok = H().$('alert-ok');
          ok.onclick = function () { H().$('alert-overlay').hidden = true; nav().push('AlipayBillPage'); };
        }));
        return wrap;
      }
    };
  }
  function alipayBalancePage() {
    return {
      title: '余额',
      render: function () {
        var b = DB.alipayBalance();
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#3875f6;color:#fff;padding:26px 16px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;opacity:.85">账户余额（元）</div><div style="font-size:36px;margin-top:8px">' + esc(b.balance) + '</div>';
        wrap.appendChild(card);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('充值', '', function () {
            H().openDialog('充值', [{ label: '充值金额', key: 'amount', value: '100.00', numeric: true }], function (vals) {
              b.balance = (parseFloat(b.balance) + parseFloat(vals.amount || 0)).toFixed(2);
              DB.saveAlipayBalance(b);
              nav().reset('AlipayBalancePage');
            });
          }),
          row('提现', '', function () {
            H().openDialog('提现', [{ label: '提现金额', key: 'amount', value: '100.00', numeric: true }], function (vals) {
              b.balance = Math.max(0, parseFloat(b.balance) - parseFloat(vals.amount || 0)).toFixed(2);
              DB.saveAlipayBalance(b);
              nav().reset('AlipayBalancePage');
            });
          }),
          row('余额明细', '', function () { nav().push('AlipayBalanceDetailPage'); }),
          row('账单', '', function () { nav().push('AlipayBillPage'); })
        ]));
        return wrap;
      }
    };
  }
  function alipayBalanceNewPage() {
    return {
      title: '余额（新版）',
      render: function () {
        var b = DB.alipayBalance();
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#1677ff;color:#fff;padding:26px 16px;text-align:center;border-radius:0 0 16px 16px';
        card.innerHTML = '<div style="font-size:13px;opacity:.85">账户余额（元）</div><div style="font-size:36px;margin-top:8px">' + esc(b.balance) + '</div>';
        wrap.appendChild(card);
        wrap.appendChild(gap());
        wrap.appendChild(listWrap([
          row('充值', '', function () { nav().push('AlipayBalancePage'); }),
          row('提现', '', function () { nav().push('AlipayBalancePage'); }),
          row('余额明细', '', function () { nav().push('AlipayBalanceDetailPage'); })
        ]));
        return wrap;
      }
    };
  }
  function alipayBalanceDetailPage() {
    return {
      title: '余额明细',
      render: function () {
        return transList(DB.alipayBill(), 'alipay');
      }
    };
  }
  function alipayBillPage() {
    return {
      title: '账单',
      render: function () {
        return transList(DB.alipayBill(), 'alipay');
      }
    };
  }
  function alipayNewBillPage() {
    return {
      title: '账单（新版）',
      render: function () {
        return transList(DB.alipayBill(), 'alipay');
      }
    };
  }
  function alipayMoneyoutPage() {
    return {
      title: '支付宝到账',
      render: function () {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:20px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;color:#999">支付宝收款到账通知</div><div style="font-size:30px;margin-top:10px">¥0.00</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('添加收款记录', function () {
          H().openDialog('添加收款记录', [
            { label: '金额', key: 'amount', value: '200.00', numeric: true },
            { label: '说明', key: 'title', value: '收到普通红包' }
          ], function (vals) {
            var bills = DB.alipayBill();
            bills.unshift({ title: vals.title, amount: vals.amount, status: '交易成功', time: H().nowTime() });
            DB.saveAlipayBill(bills);
            H().toast('已添加');
            nav().reset('AlipayMoneyoutPage');
          });
        }));
        return wrap;
      }
    };
  }
  function alipayTocardPage() {
    return {
      title: '转到银行卡',
      render: function () {
        var wrap = document.createElement('div');
        var form = document.createElement('div');
        form.className = 'form';
        var bankSel = document.createElement('select');
        bankSel.className = 'form-input';
        BANKS.forEach(function (b) { var op = document.createElement('option'); op.value = b.name; op.textContent = b.name; bankSel.appendChild(op); });
        var amt = textInput('100.00', '转账金额');
        form.appendChild(formRow('收款银行', bankSel));
        form.appendChild(formRow('转账金额', amt));
        wrap.appendChild(form);
        wrap.appendChild(saveButton('下一步', function () {
          nav().push('AlipayTocardDetailPage', { bank: bankSel.value, amount: amt.value });
        }));
        return wrap;
      }
    };
  }
  function alipayTocardDetailPage() {
    return {
      title: '转到银行卡',
      render: function (params) {
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#fff;padding:22px 16px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;color:#999">转到银行卡</div><div style="font-size:30px;margin-top:10px">¥' + esc((params && params.amount) || '100.00') + '</div>' +
          '<div style="margin-top:10px;color:#666">' + esc((params && params.bank) || '中国农业银行') + '</div><div style="color:#999;font-size:13px;margin-top:4px">预计 2 小时内到账</div>';
        wrap.appendChild(card);
        wrap.appendChild(saveButton('确认转账', function () {
          H().showAlert('提示', '已成功转账 ¥' + ((params && params.amount) || '100.00'));
          var ok = H().$('alert-ok');
          ok.onclick = function () { H().$('alert-overlay').hidden = true; nav().pop(); };
        }));
        return wrap;
      }
    };
  }
  function alipaySoundPage() {
    return {
      title: '收款语音',
      render: function () {
        var wrap = document.createElement('div');
        var note = document.createElement('div');
        note.className = 'form-note';
        note.textContent = '原版内置的收款到账语音（来自 APK 原始音频文件）';
        wrap.appendChild(note);
        var list = document.createElement('div');
        list.className = 'row-list';
        var samples = [
          { label: '支付宝到账', file: 'audio/payee_voice_at_shop.mp3' },
          { label: '到账语音 1', file: 'audio/tts_1.mp3' },
          { label: '到账语音 2', file: 'audio/tts_2.mp3' },
          { label: '到账语音 3', file: 'audio/tts_3.mp3' }
        ];
        samples.forEach(function (s) {
          var r = row(s.label, '▶ 播放', function () {
            var a = new Audio(s.file);
            a.play().catch(function () { H().toast('播放失败'); });
          });
          list.appendChild(r);
        });
        wrap.appendChild(list);
        return wrap;
      }
    };
  }
  function alipaySumPage(year) {
    return {
      title: '支付宝年度账单 ' + year,
      render: function () {
        var bills = DB.alipayBill();
        var total = bills.reduce(function (s, b) { return s + parseFloat(b.amount || 0); }, 0);
        var wrap = document.createElement('div');
        var card = document.createElement('div');
        card.style.cssText = 'background:#1677ff;color:#fff;padding:26px 16px;text-align:center';
        card.innerHTML = '<div style="font-size:13px;opacity:.85">' + year + ' 年账单总额</div><div style="font-size:32px;margin-top:8px">¥' + total.toFixed(2) + '</div>';
        wrap.appendChild(card);
        wrap.appendChild(gap());
        wrap.appendChild(transList(bills, 'alipay'));
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
    WalletNewPage: walletGridPage('金融理财', true),
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
    AlipayChatUsersPage: convListPage({ title: '选择支付宝对话用户', chatPage: 'AlipayChatPage', addLabel: '添加用户' }),
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
