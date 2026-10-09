# 日常英语 · 场景学习

基于 React、esbuild 和 Capacitor 的英语学习 App，支持网页预览和 Android 安装包。当前包含 37 章文字初稿（日常 23 章、旅行 6 章、职场 8 章），共 444 条核心句、84 段对话、85 个变化分支和 222 个语句速查条目。

学习页支持中文显隐、表达笔记、关键词英美音标、点读、顺序播放和收藏；设置及收藏保存在设备本地，可导入和导出。网页使用浏览器语音合成，Android 使用系统 TTS，断网朗读需要设备已有英语离线语音数据。

文稿已做结构校验和内容自查，尚未经过母语者审校。

## 目录

- `work/english-ui/src/`：页面、样式、课程及原生服务适配。
- `work/english-ui/android/`：Android 工程、图标、启动图和 Gradle Wrapper。
- `work/english-ui/*.mjs`：构建、文稿导出、APK 交付及验证脚本。
- `work/english-ui/tests/fixtures/`：语音插件补丁验证所用的上游原包。
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

当前安卓版本为 0.2.2（versionCode 3），包名 `com.cass.sceneenglish`，最低 Android 7.0（API 24），使用本机 debug 签名。不同机器生成的调试签名可能不同，覆盖安装需使用相同签名；签名文件应单独备份，不进入 GitHub 仓库。

## 验证

在 `work/english-ui/` 下执行：

```bash
npm run build
node check-native.mjs
node check-tts-patch.mjs
```

这些命令校验文稿结构、原生桥接参数及错误传播、语音插件补丁和重复执行的一致性，不等同于真机音频测试。

`check-ui.mjs` 和 `check-android.mjs` 另需 `agent-browser` 及已准备好的浏览器会话或安卓 WebView 调试连接，不能直接视作无需环境配置的测试。当前 0.2.2 已通过构建、包内容和签名校验，本次版本尚未重新做模拟器或真机验证。
