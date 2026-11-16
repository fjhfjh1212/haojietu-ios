/* 好截图2 v4.4.5 — iOS web rebuild.
   Core: local store (AsyncStorage keys, localStorage-backed), navigation
   stack (Teaset Navigator equivalent), tab shell, dialogs, toasts, and
   the alternate-app-icon bridge. Fully offline — no network calls. */
(function () {
  'use strict';

  /* ================= store ================= */
  var store = {
    get: function (key, def) {
      try {
        var v = window.localStorage.getItem('hjt:' + key);
        return v === null ? def : v;
      } catch (e) { return def; }
    },
    set: function (key, val) {
      try { window.localStorage.setItem('hjt:' + key, val); } catch (e) {}
    },
    getJSON: function (key, def) {
      var v = this.get(key, null);
      if (v === null) return def;
      try { return JSON.parse(v); } catch (e) { return def; }
    },
    setJSON: function (key, val) {
      this.set(key, JSON.stringify(val));
    }
  };

  /* ================= helpers ================= */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.firstElementChild;
  }
  function money(n) {
    var v = parseFloat(n);
    if (isNaN(v)) return '0.00';
    return v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function nowTime() {
    var d = new Date();
    function p(x) { return (x < 10 ? '0' : '') + x; }
    return p(d.getHours()) + ':' + p(d.getMinutes());
  }

  /* ================= toast / loading ================= */
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1800);
  }
  function showLoading() { $('loading-overlay').hidden = false; }
  function hideLoading() { $('loading-overlay').hidden = true; }

  /* ================= alert ================= */
  function showAlert(title, body, okText) {
    $('alert-title').textContent = title || '提示';
    $('alert-body').textContent = body || '';
    $('alert-ok').textContent = okText || '确认';
    $('alert-overlay').hidden = false;
  }
  $('alert-ok').addEventListener('click', function () { $('alert-overlay').hidden = true; });
  $('alert-overlay').addEventListener('click', function (e) {
    if (e.target === $('alert-overlay')) $('alert-overlay').hidden = true;
  });

  /* ================= picker (PullPicker) ================= */
  function showPicker(title, options, selectedIndex, onPick) {
    $('picker-title').textContent = title;
    var list = $('picker-list');
    list.innerHTML = '';
    options.forEach(function (opt, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt;
      if (i === selectedIndex) b.className = 'sel';
      b.addEventListener('click', function () {
        $('picker-overlay').hidden = true;
        onPick(opt, i);
      });
      list.appendChild(b);
    });
    $('picker-cancel').onclick = function () { $('picker-overlay').hidden = true; };
    $('picker-overlay').hidden = false;
  }
  $('picker-overlay').addEventListener('click', function (e) {
    if (e.target === $('picker-overlay')) $('picker-overlay').hidden = true;
  });

  /* ================= generic edit dialog ================= */
  function openDialog(title, fields, onOk) {
    var card = $('dlg-card');
    card.innerHTML = '';
    var t = document.createElement('div');
    t.className = 'dlg-title';
    t.textContent = title;
    card.appendChild(t);
    var inputs = [];
    fields.forEach(function (f) {
      if (f.label) {
        var lab = document.createElement('div');
        lab.className = 'dlg-label';
        lab.textContent = f.label;
        card.appendChild(lab);
      }
      var inp;
      if (f.type === 'select' && f.options) {
        inp = document.createElement('select');
        inp.className = 'dlg-input';
        f.options.forEach(function (o) {
          var op = document.createElement('option');
          op.value = o; op.textContent = o;
          if (o === f.value) op.selected = true;
          inp.appendChild(op);
        });
      } else {
        inp = document.createElement('input');
        inp.className = 'dlg-input';
        inp.type = f.type || 'text';
        if (f.hint) inp.placeholder = f.hint;
        if (f.max) inp.maxLength = f.max;
        if (f.numeric) inp.inputMode = 'decimal';
        inp.value = f.value !== undefined ? f.value : '';
      }
      card.appendChild(inp);
      inputs.push({ key: f.key, el: inp });
    });
    var btns = document.createElement('div');
    btns.className = 'dlg-btns';
    var cancel = document.createElement('button');
    cancel.type = 'button'; cancel.textContent = '取消';
    cancel.addEventListener('click', function () { $('dlg-overlay').hidden = true; });
    var ok = document.createElement('button');
    ok.type = 'button'; ok.textContent = '确认';
    ok.addEventListener('click', function () {
      var vals = {};
      inputs.forEach(function (it) { vals[it.key] = it.el.value; });
      $('dlg-overlay').hidden = true;
      if (onOk) onOk(vals);
    });
    btns.appendChild(cancel); btns.appendChild(ok);
    card.appendChild(btns);
    $('dlg-overlay').hidden = false;
    var first = card.querySelector('input,select');
    if (first) first.focus();
  }
  $('dlg-overlay').addEventListener('click', function (e) {
    if (e.target === $('dlg-overlay')) $('dlg-overlay').hidden = true;
  });

  /* ================= image viewer ================= */
  function viewImage(src) {
    $('viewer-img').src = src;
    $('viewer-overlay').hidden = false;
  }
  $('viewer-close').addEventListener('click', function () { $('viewer-overlay').hidden = true; });
  $('viewer-overlay').addEventListener('click', function (e) {
    if (e.target === $('viewer-overlay')) $('viewer-overlay').hidden = true;
  });

  /* ================= alternate app icon ================= */
  var AltIcon = null;
  try {
    if (window.Capacitor && window.Capacitor.registerPlugin) {
      AltIcon = window.Capacitor.registerPlugin('AlternateIcon');
    }
  } catch (e) { AltIcon = null; }
  /* Original icon choices: 0 微截图2 (primary), 1 微信, 2 支付宝. */
  var ICON_NAMES = [null, 'wechat', 'alipay'];
  var ICON_LABELS = ['微截图2', '微信', '支付宝'];
  function currentIconIndex() {
    var v = parseInt(store.get('appIconIndex', '0'), 10);
    return isNaN(v) ? 0 : v;
  }
  function setAppIcon(index) {
    store.set('appIconIndex', String(index));
    var name = ICON_NAMES[index];
    if (AltIcon && AltIcon.setAlternateIcon) {
      showLoading();
      var p = AltIcon.setAlternateIcon({ name: name });
      if (p && p.then) {
        p.then(function () { hideLoading(); })
         .catch(function () { hideLoading(); showAlert('提示', '设置出错！'); });
      } else { hideLoading(); }
    } else {
      /* Browser / verification: the native plugin is only present in the
         Capacitor shell. The choice is saved and applied on iOS. */
      toast('已选择“' + ICON_LABELS[index] + '”，在 iPhone 上会切换图标');
    }
  }
  function openIconPicker() {
    showPicker('选择App图标', ICON_LABELS, currentIconIndex(), function (opt, i) {
      if (i !== currentIconIndex()) setAppIcon(i);
    });
  }

  /* ================= router (Teaset Navigator stack) ================= */
  var PAGES = window.HJT_PAGES || {};
  var stack = [];           /* [{id, params, node}] */
  var currentTab = 'home';

  function renderNavbar(page, params) {
    var bar = document.createElement('header');
    bar.className = 'navbar' + (page.navClass ? ' ' + page.navClass : '');
    var back = document.createElement('button');
    back.type = 'button'; back.className = 'nav-back'; back.textContent = '‹';
    back.setAttribute('aria-label', '返回');
    back.addEventListener('click', function () { nav.pop(); });
    var title = document.createElement('span');
    title.className = 'nav-title';
    title.textContent = typeof page.title === 'function' ? page.title(params) : (page.title || '');
    var right = document.createElement('span');
    right.className = 'nav-right';
    if (page.right) {
      right.textContent = page.right.text;
      right.style.cursor = 'pointer';
      right.addEventListener('click', function () { page.right.onClick(params); });
    }
    bar.appendChild(back); bar.appendChild(title); bar.appendChild(right);
    return bar;
  }

  function renderScreen(id, params) {
    var page = PAGES[id];
    if (!page) {
      return el('<div class="screen"><div class="stub"><div class="stub-title">页面不存在</div><div class="stub-text">' + esc(id) + '</div></div></div>');
    }
    var node = document.createElement('div');
    node.className = 'screen';
    node.dataset.page = id;
    if (page.noNav) {
      node.appendChild(page.render(params || {}));
    } else {
      node.appendChild(renderNavbar(page, params || {}));
      var main = document.createElement('main');
      main.className = 'scroll' + (page.scrollClass ? ' ' + page.scrollClass : '');
      main.appendChild(page.render(params || {}));
      node.appendChild(main);
    }
    return node;
  }

  var nav = {
    push: function (id, params) {
      var node = renderScreen(id, params || {});
      $('stack').appendChild(node);
      stack.push({ id: id, params: params || {}, node: node });
      this._syncTabbar();
    },
    pop: function () {
      if (stack.length <= 1) return false;
      var top = stack.pop();
      if (top.node.parentNode) top.node.parentNode.removeChild(top.node);
      this._syncTabbar();
      return true;
    },
    reset: function (id, params) {
      while (stack.length) {
        var t = stack.pop();
        if (t.node.parentNode) t.node.parentNode.removeChild(t.node);
      }
      this.push(id, params || {});
    },
    goTab: function (tab) {
      currentTab = tab;
      document.querySelectorAll('#tabbar .tab').forEach(function (b) {
        b.classList.toggle('active', b.dataset.tab === tab);
      });
      if (tab === 'home') this.reset('home');
      else if (tab === 'me') this.reset('me');
      else if (tab === 'wallet') this.reset('walletTab');
      else if (tab === 'more') this.reset('settings');
    },
    current: function () { return stack[stack.length - 1]; },
    _syncTabbar: function () {
      var show = stack.length <= 1;
      $('tabbar').style.display = show ? '' : 'none';
    }
  };

  document.querySelectorAll('#tabbar .tab').forEach(function (b) {
    b.addEventListener('click', function () { nav.goTab(b.dataset.tab); });
  });

  /* ================= view mode (浅色/深色） ================= */
  function applyViewMode() {
    var dark = store.get('phoneViewMode', '0') === '1';
    document.body.classList.toggle('dark', dark);
  }
  function toggleViewMode() {
    var cur = store.get('phoneViewMode', '0') === '1' ? 0 : 1;
    store.set('phoneViewMode', String(cur));
    applyViewMode();
    toast(cur ? '深色模式' : '浅色模式');
    nav.reset('home');
  }

  /* ================= expose ================= */
  window.HJT = {
    store: store, nav: nav, PAGES: PAGES,
    $: $, esc: esc, el: el, money: money, nowTime: nowTime,
    toast: toast, showLoading: showLoading, hideLoading: hideLoading,
    showAlert: showAlert, showPicker: showPicker, openDialog: openDialog,
    viewImage: viewImage, openIconPicker: openIconPicker,
    currentIconIndex: currentIconIndex, ICON_LABELS: ICON_LABELS,
    applyViewMode: applyViewMode, toggleViewMode: toggleViewMode
  };

  /* ================= boot ================= */
  applyViewMode();
  nav.goTab('home');
  /* Deep-link: #<PageId>, #wx, #alipay, #taobao */
  (function () {
    var hash = (window.location.hash || '').replace(/^#/, '');
    if (!hash) return;
    var target = hash;
    if (target === 'wx') target = 'WechatHomePage';
    else if (target === 'alipay') target = 'AlipayHomePage';
    else if (target === 'taobao') target = 'TaobaoItemPage';
    if (window.HJT_PAGES && window.HJT_PAGES[target] && target !== 'home') {
      setTimeout(function () { window.HJT.nav.push(target); }, 50);
    }
  })();
})();
