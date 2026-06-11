# 用 AI 做了个世界杯投注助手，48支队104场比赛，手机网页即开即用

世界杯马上来了，身边不少朋友打算买点竞彩图个乐子。但大部分人其实看不懂赔率，也不知道球队到底什么水平。

我想做一个工具：打开手机就能用，AI帮分析比赛，给出投注建议。**不做App、不注册、不下载**，一个网页搞定。

---

## 效果

链接：https://guoqiang110.github.io/wangzhe-helper/worldcup-betting/

打开就是这样的页面：

- 📊 **总览** — 所有小组对阵一目了然
- ⚔️ **赛程** — 完整104场比赛时间线
- 🏃 **球队实力榜** — 48支球队FIFA排名+积分
- 💰 **赔率** — 综合多家机构开盘赔率
- 🤖 **AI助手** — 选比赛→点分析→出报告+竞彩建议
- 📊 **对比** — 任意两支球队直接对比
- 📈 **统计** — 赔率分布+实力差距概览

最关键的是 **中国体育彩票 · 竞彩足球模块**：

1. 胜平负（3列赔率+概率条）
2. 让球胜平负（动态计算让球数）
3. 推荐方案（AI根据概率自动生成2-3注推荐）

---

## 技术实现

### 1. 单文件HTML

整个项目就是一个 `index.html`，50KB。这样做的原因：

- 不需要服务器，GitHub Pages 直接托管
- 手机打开就能用
- 丢到微信里也能直接打开
- Tailwind CSS CDN 做样式，不用构建工具

### 2. 数据

48支球队、104场比赛全部硬编码在JS里：

```javascript
const TEAMS = [
  {id:"arg",name:"阿根廷",rank:1,group:"A",pts:1860},
  // ...48支
];
```

赔率根据FIFA排名差自动计算：

```javascript
function genOdds(r1, r2) {
  let diff = r2 - r1;
  let base = 0.5 + diff * 0.003;
  // 加上庄家抽水(margin 1.08)
  // 返回主胜/平/客胜赔率 + 概率
}
```

让球数也是动态算的，根据排名差给 -1 / -0.5 / 0 / +0.5 / +1。

### 3. 竞彩推荐算法

这个有点意思。根据主胜概率分档：

- **≥35%**：强队胜率高 → 推荐"强队胜" + "让球胜" + "防平双选"
- **25-35%**：有一定优势 → 推荐"强队胜" + "不败双选"
- **20-25%**：接近 → 推荐"不败双选"
- **<20%**：势均力敌 → 推荐"平局+胜" + "弱旅爆冷"

```javascript
if(favor >= 0.35) {
  // 推3注：主胜 + 让球胜 + 双选防平
} else if(favor >= 0.25) {
  // 推2注：主胜 + 双选保底
}
// ...
```

### 4. PWA

加了 `manifest.json` 和 `sw.js`，支持添加到手机桌面：

```html
<link rel="manifest" href="manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
```

安卓手机用 Chrome 打开 → 菜单"添加到主屏幕" → 就像原生App一样。

---

## 踩坑记录

**1. 标签导航点不动**

一开始用事件委托绑定点击，死活点不动。排查了半天发现是Google Fonts的 `@import` 在国内被墙，页面卡住导致JS没执行。

解决方案：移除Google Fonts和Font Awesome CDN，用系统字体。标签切换改为 `<a href="#tab-id">` + CSS `:target`，不依赖JS也能工作。

**2. 对象键名不能数字开头**

```javascript
// ❌ 报错
const RD_LABEL = { 3rd: "季军赛" };
// ✅ 正确
const RD_LABEL = { "3rd": "季军赛" };
```

写了48支队64场比赛都没出错，结果一个键名引号折腾半天。Node.js语法检查帮了大忙。

---

## 经验总结

1. **先做单文件**。功能不复杂的工具类应用，单文件HTML是最快的方式。改了直接上传，用户刷新即用。

2. **CDN选型要考虑到中国网络环境**。Google Fonts、Font Awesome的CDN在国内不稳定。Tailwind的CDN倒是没问题。

3. **PWA不需要很复杂**。manifest.json + sw.js 两个文件就能让网页"变成App"。

4. **AI辅助开发的正确姿势**。这种数据密集型的页面，让AI生成初始数据框架，人工审核修正。48支球队的数据如果手写至少半天，AI几分钟搞定。

---

工具地址：https://guoqiang110.github.io/wangzhe-helper/worldcup-betting/
源码：https://github.com/guoqiang110/wangzhe-helper/tree/master/worldcup-betting

理性投注，快乐看球 ⚽
