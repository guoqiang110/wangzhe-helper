# 我做了个世界杯AI投注助手，单文件HTML + GitHub Pages = 手机即开即用 🧵

---

1/ 世界杯来了，身边朋友都在聊竞彩。但大部分人：看不懂赔率、不了解球队、不知道怎么投。

我的想法：做一个手机网页，AI分析比赛+生成竞彩建议。关键是不做App、不注册、不用下载。

结果：https://guoqiang110.github.io/wangzhe-helper/worldcup-betting/

---

2/ 技术方案简单到离谱：
- 单文件 index.html（50KB）
- Tailwind CSS CDN 做样式
- GitHub Pages 托管
- manifest.json + sw.js = PWA，支持添加到手机桌面

没有构建工具、没有后端、没有数据库。一个浏览器一个编辑器就够了。

---

3/ 数据怎么来？48支队、104场比赛，全部硬编码：

```js
const TEAMS = [
  {id:"arg",name:"阿根廷",rank:1,group:"A",pts:1860},
  // ... 48支球队
];
```

赔率根据FIFA排名差自动计算，加上1.08的庄家抽水。让球数也是动态的。

---

4/ 最有意思的是竞彩推荐算法：

根据主胜概率分档推荐：
- ≥35% → 强队胜 + 让球胜 + 防平
- 25-35% → 强队胜 + 双选保底
- <20% → 平局 + 弱旅爆冷选项

不是简单推强队，而是给出组合方案。

---

5/ 踩坑记录：

最大的坑：Google Fonts的@import在国内被墙，导致页面卡住，JS不执行。标签导航死活点不动。

教训：面向中国用户，CDN选型要考虑网络环境。系统字体完全够用，没必要为了一个字体引入外部依赖。

---

6/ 另一个坑：

```js
const RD_LABEL = { 3rd: "季军赛" }; // ❌ 报错！
const RD_LABEL = { "3rd": "季军赛" }; // ✅ 正确
```

对象键名以数字开头必须加引号。写了48支队都没错，结果一个键名折腾半天。Node.js语法检查救了我。

---

7/ PWA部分简单高效：

manifest.json 用内联SVG图标（不用额外图片资源）
sw.js 做Cache First策略，离线也能看数据

安卓Chrome→添加到主屏幕→跟原生App体验一样。iOS Safari→分享→添加到主屏幕。

---

8/ 一些感悟：

单文件HTML被严重低估了。对于功能明确、数据固定的工具类应用，这是最快的交付方式。

AI辅助生成结构化数据（48支队、104场比赛）节省了大量时间。但数据验证和逻辑调整还是需要人工。

GitHub Pages + PWA = 个人工具类产品的最简部署方案。零成本，免运维，还能离线用。

---

工具：https://guoqiang110.github.io/wangzhe-helper/worldcup-betting/
源码：https://github.com/guoqiang110/wangzhe-helper/tree/master/worldcup-betting

#webdev #worldcup #ai #javascript #pwa
