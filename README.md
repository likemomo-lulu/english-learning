# 日常英语 · 场景学习

基于 React、esbuild 和 Capacitor 的英语学习 App，支持网页预览和 Android 安装包。0.3.0 内置 v0.5 的 54 章文字初稿（日常 34 章、旅行 9 章、职场 11 章），共 648 条核心句、118 段对话、119 个变化分支和 324 个语句速查条目，并支持教材内容更新。

2026-10-10 教材更新：v0.6（内容编号 2026101001）新增 D35「图书馆办卡与借还书」，共 55 章（日常 35、旅行 9、职场 11）、660 条核心句、120 段对话、121 个变化分支和 330 个速查条目。已安装的 0.3.0 可在“我的 -> 教材内容 -> 检查内容更新”下载，无需重新安装 APK。

本次新增电话办事、租房、家中报修、支付问题、外卖、做客、邻里沟通、订阅取消、与新认识的人互相了解、中国传统节日、中国经典小吃与菜肴，以及航班变更、入境申报、紧急求助、客户需求确认、产品演示和面试，共 17 章。

学习页支持中文显隐、表达笔记、关键词英美音标、点读、顺序播放和收藏；设置及收藏保存在设备本地，可导入和导出。网页使用浏览器语音合成，Android 使用系统 TTS，断网朗读需要设备已有英语离线语音数据。

文稿已做结构校验和内容自查，尚未经过母语者审校。

## 目录

- `work/english-ui/src/`：页面、样式、课程及原生服务适配。
- `work/english-ui/android/`：Android 工程、图标、启动图和 Gradle Wrapper。
- `work/english-ui/*.mjs`：构建、文稿导出、APK 交付及验证脚本。
- `work/english-ui/tests/fixtures/`：语音插件补丁验证所用的上游原包。
- `content/`：GitHub 提供给 App 的更新清单和版本化教材 JSON。
- [学习材料规划](outputs/scene-english-learning-plan.md)、[安装说明](outputs/android-install-guide.md)、[界面与验证记录](outputs/english-app-ui/README.md)：维护文档。

请保持上述层级，脚本从 `work/english-ui/` 相对定位仓库根目录的 `outputs/`。依赖、下载的工具、缓存、APK 和自动导出的材料不纳入版本控制。

## 网页构建与预览

需要 Node.js 22 或更高版本和 npm。

```bash
cd work/english-ui
npm ci --registry=https://registry.npmjs.org
npm run build
node preview.mjs
```

预览地址为 http://127.0.0.1:4178/ 。构建生成 `outputs/english-app-ui/index.html` 和供 Capacitor 使用的 `work/english-ui/dist/index.html`；文稿、结构化 JSON 及速查汇总也会输出到 `outputs/`。

`npm ci` 会通过 `postinstall` 执行 `patch-tts.mjs`，修复固定版本 8.0.2 的安卓语音插件取消回调及立即报错处理。升级该插件前需要复核补丁。

## Android 打包

需要 JDK 21、Android SDK Platform 36 和相应 Build Tools。为本机设置 `JAVA_HOME` 与 `ANDROID_HOME`，或者在未跟踪的 `android/local.properties` 中设置 `sdk.dir`。

在 `work/english-ui/` 下执行：

```bash
npm run android:sync
cd android
./gradlew assembleDebug --console=plain
cd ..
node deliver-apk.mjs
```

Windows 使用 `gradlew.bat`。安卓构建产物位于 `android/app/build/outputs/apk/debug/`；交付脚本校验包内页面、章节及速查内容后，将 APK、SHA-256 和构建信息输出到仓库根目录 `outputs/`。

当前安卓版本为 0.3.0（versionCode 4），包名 `com.cass.sceneenglish`，最低 Android 7.0（API 24），使用本机 debug 签名。不同机器生成的调试签名可能不同，覆盖安装需使用相同签名；签名文件应单独备份，不进入 GitHub 仓库。

## 教材内容更新

App 启动时自动检查更新，也可在“我的 -> 教材内容 -> 检查内容更新”手动检查。更新源为本仓库 `main` 分支的 `content/manifest.json`，优先通过 GitHub Raw 的 HTTPS 地址下载；网络或服务错误时自动尝试 jsDelivr 上同一 GitHub 仓库的内容。两个通道执行相同校验，不因教材校验或保存失败而切换。旧版 0.2.2 及更早版本需先覆盖安装一次 0.3.0。

内置教材和下载教材使用同一数据格式。下载前检查版本和阅读器兼容性，下载后校验大小、SHA-256、完整字段以及原有章节与句子编号；全部通过后才一次性保存到本地。断网、下载中断或保存失败时继续使用原内容。收藏和设置独立保存，下载不会覆盖记录。教材仅包含 JSON 数据，不下发 JavaScript 或原生功能。

更新材料时，在 `src/content-format.js` 中增大 `bundledRevision`（单调递增整数），同时调整 `contentVersion`；保持原句编号，不删除已发布章节或句子。执行 `npm run build` 和 `node check-content.mjs` 后，发布新生成的 `content/pack-<revision>.json` 及 `content/manifest.json` 到 GitHub。已发布的编号不可改写；修改内容必须使用新编号。旧内容包应保留。清单每个通道连接超时为 8 秒，整个更新超时为 30 秒，内容包上限 4 MB；超出本地存储容量会提示失败并保留原教材。备用 CDN 缓存刷新可能晚于 GitHub，稍后再检查可获得新的版本。

内容更新可新增或修订教材；新页面交互、原生插件和权限仍需要新版 APK。GitHub 的网络可达性取决于设备网络，不能连接时可重试，离线阅读不受影响。

## 验证

在 `work/english-ui/` 下执行：

```bash
npm run build
node check-native.mjs
node check-tts-patch.mjs
node check-content.mjs
```

这些命令校验文稿结构、原生桥接参数及错误传播、语音插件补丁和重复执行的一致性，不等同于真机音频测试。

`check-content-browser.mjs` 提供独立的本机浏览器更新验证环境（4179 端口），运行后可向终端输入 `current`、`update`、`offline` 或 `tampered` 切换模拟服务；测试内容不会进入 APK 或正式更新源。

`check-ui.mjs` 和 `check-android.mjs` 另需 `agent-browser` 及已准备好的浏览器会话或安卓 WebView 调试连接，不能直接视作无需环境配置的测试。0.3.0 的内容更新已做自动校验与可见浏览器验证；本轮未重新做模拟器或真机验证。
