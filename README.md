# 好截图2 — iOS rebuild (web app + Capacitor)

Faithful iOS rebuild of the Android app **好截图2 v4.4.5**
(package `com.shi.haojietu`, internal name vjietu3, 官网 vjietu.com),
re-implemented as a fully offline static web app wrapped with Capacitor 7
and packaged as an unsigned IPA. The user signs it himself.

Source of truth: `~/workspace/haojietu/apk-extracted-4.4.5/ANALYSIS.md`
(React Native app — all UI/text/navigation/logic lived in
`assets/index.android.bundle`, 5.6 MB Metro JS, 3,197 modules; no XML app
layouts). All screens were re-implemented from that bundle; all images
and fonts are the **original files from the APK**.

## What is built

- **4-tab shell**: 主页 / 我 / 钱包 / 更多 (Teaset-style tab bar, primary #1ea1f3)
- **Home (_Index)**: all 11 sections, 54 entries (incl. banner + display-mode
  toggle). The server-selected alternative nine-grid home (_newIndex) is
  reachable from the home page as "九宫格首页".
- **All 43 pages from the pages index (module 1818)**:
  WeChat home, single + group chat, Moments (+ user page), wallet service
  grids rebuilt verbatim from modules 2641/2680 (old 支付： 腾讯服务 12 +
  限时推广 3 + 第三方服务 12, with the 更多服务/收起 toggle; new 金融理财：
  金融理财 4 + 生活服务 7 + 交通出行 4 + 购物消费 9; icons resolve via
  `SConfig.wechatWalletList`, imageIndex N → `wallet-icon{N+1}`), zero-money,
  wallet detail, money-out, wallet-li, wallet transactions + summary, red
  packet, pay / receive-money codes, transfer, transfer-to-bank, group-send,
  voice + video call pages, Taobao item page; Alipay home, chat users + chat,
  contacts, account, transfer, balance (old + new), balance detail, bill
  (old + new), money-out, transfer-to-card + detail, receipt-voice, 2019 +
  2020 annual summaries; plus Me, Settings, Account, PhoneBar (status-bar
  editor, 18 phone models), NineGrid cutter, Backup, Watermark, Login,
  VIP, Help, Feedback, Role manager, Bank manager, Webshot, Stitch.
- **Chat**: full message types (text / image / emoji / voice / video /
  link / file / namecard / red packet / transfer / money-out / group-send /
  system notice / time), 17-item more panel, long-press message menu
  （编辑 / 撤回 / 收款 / 转文字 / 复制 / 删除 / 切换）, title tap switches
  the sending user, voice/text mode, emoji picker.
- **Sample data identical to the original**: seed dialogs (Mars, 林猪浪),
  roles (马克_SHI / 马克_SHI2), 17 banks, 10 WeChat wallet transactions,
  2 Alipay bills, 1 Moments post, Alipay seed (balance 88.88). Edits are
  persisted in localStorage under the original AsyncStorage keys
  (`wechat`, `wechatDialog`, `wechatTimeline`, `wechatWallet`,
  `wechatWalletTrans`, `alipayBalance`, `alipayBill`, `bank`, `role`,
  `map`, `phoneBarConfig`, `phoneViewMode`, `appIconIndex`).
- **Original assets**: 1,677 images (1,370 PNG + 304 JPG + 3 launcher
  icons), 20 TTF fonts (the APK actually contains 20, not 21 — verified by
  full-tree scan), 42 MP3s (receipt/voice/TTS). All referenced through
  `www/assetmap.js` (1,687/1,707 bundle assets mapped; only the 20 MP3s
  are unmapped because they live in `audio/`).
- **Change-app-icon feature — IMPLEMENTED (iOS alternate icons)**:
  the original's three icon choices （微截图2 / 微信 / 支付宝） are bundled
  as alternate icons and declared in `CFBundleAlternateIcons` in
  `Info.plist`; switching uses `UIApplication.setAlternateIconName`
  through a small native Capacitor plugin
  (`plugins/alternate-icon/`, `AlternateIconPlugin.swift`).
  A build-time patch script (`scripts/patch_alternate_icons.py`, stdlib
  only) adds the icon files, patches `Info.plist` and registers the
  plugin after `cap add ios`. The patch was verified against a real
  Capacitor 7 project (`/tmp/cap-test`): Podfile valid, imagesets
  correct, `CFBundleAlternateIcons = ['alipay','wechat']`, primary icon
  preserved. **iOS platform limits (not missing features):** iOS shows a
  system alert on every icon change, and only pre-bundled icons can be
  used. **Not verifiable without Xcode:** the Swift plugin's compilation
  and runtime registration — the Codemagic build is the check.

## What could not be made identical

- **Server-only pages are local stubs** (same entry screen, same text,
  no backend): Login, VIP/membership + payment, Watermark-removal
  purchase, Wallet WebView tab (shows the Alipay home instead of a remote
  page), 客服QQ/微信/支付宝 rows (show "暂未设置"), 代理商 / 卡密激活 /
  卡密查询 / 在线客服 / 用户协议， 检测更新 (reports "已是最新"),
  网页截图 (cannot load an external page offline), 淘宝商品页 (example
  content only). No network call is made anywhere; no external URL is
  referenced.
- **Ads dropped**: the original's server-driven ads (banner on the home
  page, 4 banners + 3 interstitials + 1 app-open, publisher
  `ca-app-pub-3801042597463582/…`) are not reproduced.
- **Backend never contacted**: `api.vjietu.com` is not called and the
  `appsecret` from `decoded/api_config.json` is **not** copied into the
  app. QQ SDK (App ID 1106779540), Pushy hot-update, MiniApp and the
  error-log uploader are not implemented.
- **Server gating flags** (`showAll`, `show_wallet_proxy`, …) do not exist
  offline — all features are visible by default.
- **Debug test page (3195) and the dummy placeholder DB are ignored.**
- **About page quirk**: the original APK is missing
  `res/layout/activity_about.xml`, so the distributed original would
  crash opening About; the rebuild keeps the About page with the
  original's strings.
- **Nine-grid save**: the original saves the 9 tiles to the photo album
  via CameraRoll; the web build downloads the 9 PNG files (browser
  download) and shows the original success alert text.
- **Stitch / Webshot**: implemented locally (canvas stitch + download);
  Webshot cannot render an external page offline.
- **Fonts**: the bundled WeChatSans fonts draw lowercase Latin as small
  capitals, so the About page uses the system font (same workaround the
  original's missing layout forced).

## Build (Codemagic)

`codemagic.yaml` follows the wallet-sim pattern: Capacitor 7 at build
time, `cap init "好截图2" com.shi.haojietu --web-dir=www`, `cap add ios`,
`@capacitor/assets generate` (icon `#FFFFFF`, splash `#1EA1F3`), then
`scripts/patch_alternate_icons.py`, `pod install`, unsigned `xcodebuild
archive` → `HaoJieTu-unsigned.ipa`. Xcode 16.2, Node 20.19.0, pnpm 9.1.0.

## Verification

Playwright (Chromium, local HTTP server, iPhone 390×844 viewport),
2026-11-17, final run: **61 pages checked — 0 console/page errors,
0 failed requests, 0 external URLs, 0 horizontal overflow, 0 empty
pages.** The 61 cover all 43 pages from the pages index plus the tab
roots (home / me / walletTab / settings) and the stub/helper pages
(backup, watermark, login, vip, helpStub, feedback, roleManage,
bankManage, WebshotPage, StitchPage, newIndex, NineGridPage, PhoneBarPage,
account). 18 screenshots were inspected visually (home, chat, wallet,
Alipay balance, phone-bar, me, timeline, …) — per-page report in
`/tmp/hjt-verify/results.json`.

Issues found and fixed during verification:
- Bank icons: the seed's `bank_1..17` keys resolve through the bundle's
  imagesMap (module 1587) to `BANK_ABC..BANK_CITIC`; the manager page
  now uses that mapping (was `bank_undefined.png`).
- The App图标设置 home item has no icon in the bundle (`icon: M` = the
  current app icon); it now falls back to the original launcher icon
  `img/ic_launcher.png`.
- Added a favicon (the original launcher icon) — the only 404 left was
  the browser's `/favicon.ico` probe.
- Chat nav title now shows the dialog name (was stuck on "聊天"); the
  "me" avatar now resolves `roleface` → the original `face.jpg`.
- Chat more-panel cells now use the bundled FontAwesome glyphs instead
  of a plain "+".
- Wallet pages were rebuilt verbatim from modules 2641/2680 (real
  service lists + `wallet-icon{N+1}` icons) and the missing `.grid-3`
  CSS was added — the grid had rendered as a single column.
