---
name: "鲨鱼任务局"
description: "面向孩子的深海任务板与间隔复习界面"
colors:
  abyss: "#071117"
  hull: "#101d24"
  hull-raised: "#16262e"
  equipment: "#1b3036"
  seam: "#2a3b42"
  foam: "#f5f7f5"
  sonar-muted: "#93a2a8"
  review-muted: "#a9bdc4"
  review-subtle: "#c5d2d6"
  warning-yellow: "#f5d32f"
  warning-yellow-hover: "#d8ba22"
  completion-aqua: "#58d5d0"
  completion-deep: "#12332f"
  mastery-amber: "#f59e0b"
  mastery-wash: "#fef3c7"
  mastery-ink: "#92400e"
typography:
  display:
    fontFamily: "ZCOOL KuaiLe, sans-serif"
    fontSize: "clamp(30px, 8vw, 44px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "Arial, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "24px"
    fontWeight: 900
    lineHeight: 1.333
    letterSpacing: "normal"
  title:
    fontFamily: "Arial, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "18px"
    fontWeight: 900
    lineHeight: 1.556
    letterSpacing: "normal"
  body:
    fontFamily: "Arial, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Arial, Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.333
    letterSpacing: "normal"
rounded:
  square: "0"
  control: "6px"
  panel: "8px"
  media: "12px"
  sheet: "28px"
  pill: "9999px"
spacing:
  hairline: "2px"
  xs: "4px"
  compact: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.warning-yellow}"
    textColor: "{colors.abyss}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "16px"
  button-primary-hover:
    backgroundColor: "{colors.warning-yellow-hover}"
    textColor: "{colors.abyss}"
    rounded: "{rounded.control}"
  button-icon:
    backgroundColor: "{colors.hull}"
    textColor: "{colors.foam}"
    rounded: "{rounded.pill}"
    size: "44px"
  task-card:
    backgroundColor: "{colors.hull}"
    textColor: "{colors.foam}"
    rounded: "{rounded.square}"
    padding: "12px 14px 12px 10px"
    height: "82px"
  review-card:
    backgroundColor: "{colors.hull}"
    textColor: "{colors.foam}"
    rounded: "{rounded.control}"
    padding: "16px"
  input:
    backgroundColor: "{colors.hull-raised}"
    textColor: "{colors.foam}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  calendar-day-selected:
    backgroundColor: "{colors.warning-yellow}"
    textColor: "{colors.abyss}"
    rounded: "{rounded.pill}"
    size: "44px"
  mastery-chip:
    backgroundColor: "{colors.mastery-wash}"
    textColor: "{colors.mastery-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  bottom-sheet:
    backgroundColor: "{colors.equipment}"
    textColor: "{colors.foam}"
    rounded: "{rounded.sheet}"
    padding: "24px 24px 32px"
    width: "min(100%, 720px)"
---

# Design System: 鲨鱼任务局

## Overview

**Creative North Star: "深海任务指挥舱"**

这是一个把放学后的学习流程变成深海任务的儿童操作界面。它用近黑海水、机械舱板和高可见度警戒色建立力量感，游戏风格巨齿鲨插画负责把主题固定在具体世界里；信息仍保持紧凑、直白，让四年级学生能快速判断下一步。

系统有两种相容的材料语气：首页像赛事数据板，边缘硬、分区清晰、状态变化直接；错题与错别字页像随身复习工具，沿用同一色彩与字号，但用小圆角、圆形触控目标和底部面板降低录入负担。装饰服从进度、状态和操作，绝不盖过任务内容。

**Key Characteristics:**

- 深海近黑背景上的分层蓝黑舱板
- 警戒黄表示行动与当前进度，青色或深绿表示完成
- 首页硬边数据板与复习页柔和控件并存
- 静态巨齿鲨插画、清晰线性图标和紧凑数值反馈
- 单列、移动优先、儿童可独立操作的触控密度

## Colors

色彩以低明度蓝黑为连续工作面，以高亮黄建立唯一主行动声部，再用青色、深绿和琥珀区分完成与掌握。

### Primary

- **警戒黄:** 主按钮、进行中任务、选中日期、进度条和关键图标；它让下一步操作无需解释即可被看见。
- **警戒黄悬停:** 仅用于黄色主操作的悬停反馈，保持同一语义而增加按压确认感。

### Secondary

- **完成青:** 首页已完成任务、完成图标和全局键盘焦点环，给出冷静而明确的成功反馈。
- **掌握琥珀:** 复习页的掌握徽章与奖励细节，区别于日常完成状态。

### Tertiary

- **完成深绿:** 复习条目完成后的整块背景，承载持续状态而非瞬时庆祝。
- **掌握浅金 / 掌握棕:** 已掌握内容的浅色胶囊组合，只用于最终掌握记录。

### Neutral

- **深渊黑:** 页面和应用外壳的根背景。
- **船舱板:** 卡片、日历和基础控件的一级表面。
- **升起舱板:** 悬停表面、输入框和次级按钮。
- **设备蓝黑:** 图标底板、底部面板和嵌套内容表面。
- **结构缝线:** 首页硬边面板的细边框与分隔。
- **浪沫白:** 主文本与深色表面上的高对比图标。
- **声呐灰 / 复习灰 / 提示灰:** 分别服务首页元数据、复习页次要文本和更弱的提示层级；不要互换以制造新的灰阶。

### Named Rules

**The Yellow Means Go Rule.** 警戒黄只用于当前进度、选中状态和可执行的主要动作，不把大面积静态表面涂黄。

**The State Changes Material Rule.** 待办保持蓝黑，进行中转为黄边与黄图标，完成转为青色或深绿；状态必须同时改变至少两个可见信号，不能只靠文字。

## Typography

**Display Font:** ZCOOL KuaiLe（无衬线回退）  
**Body Font:** Arial（Microsoft YaHei、PingFang SC 与通用无衬线回退）

**Character:** 展示字带有友好的游戏标题气质，只承担品牌名、任务主标题和复习页一级标题。其余文本采用高字重无衬线体与等宽数字特性，像紧凑的赛事数据读数，保证儿童快速扫读。

### Hierarchy

- **Display**（400，响应式 30–44px，行高 1）：首页任务宣言；移动窄屏固定为 28px。
- **Headline**（900，24px，行高约 1.33）：复习页标题；品牌字标使用展示字体的 25px 变体。
- **Title**（900，18px，行高约 1.56）：任务区标题和关键分组；常规卡片标题使用 15–16px、700–800 字重。
- **Body**（500，16px，行高 1.5）：输入、主按钮和主要说明；紧凑列表正文使用 14–15px。
- **Label**（700，12px，行高约 1.33）：统计、日历说明、进度和次要元数据；最小索引为 10–11px。

### Named Rules

**The One Playful Voice Rule.** 趣味展示字体只出现在一级身份与任务宣言，操作说明、数据和列表内容始终使用清晰无衬线体。

**The Numbers Hold Still Rule.** 进度与统计数字使用等宽数字特性，动态变化时不造成布局跳动。

## Layout

所有主流程都收在居中的单列潜航通道中，最大宽度为 720px；页面背景与外壳连续，不把应用伪装成漂浮卡片。首页桌面内边距约 22–24px，540px 以下收紧到 14–16px；复习页稳定使用 16px 横向边距。主要垂直节奏来自 8px、12px、16px、20px、24px 与 32px，列表内部更密，分组之间更松。

首页任务卡使用固定四列轨道承载序号、图标、可伸缩文案和操作键；窄屏同步缩小轨道、图标和间距，文案列保持 `min-width: 0`。日历始终是七列等分网格，日期触控目标为 44px。底部录入面板与 720px 通道对齐，并从视口底部进入。

**The 720px Dive Lane Rule.** 手机、平板和宽屏都维持一条最多 720px 的主操作通道；响应式变化压缩边距与媒体，不增加并排的第二工作列。

## Elevation & Depth

深度主要来自色调分层和边框，而不是持续悬浮。首页鲨鱼影像使用明确的环境阴影；复习页只在主操作、缩略图与全屏图片等需要强调触达或媒体层级的元素上使用低、中、高三档柔和阴影。遮罩配合 8–12px 背景模糊，把底部面板和图片查看器从工作面中分离。

### Shadow Vocabulary

- **鲨鱼环境层:** `0 14px 32px rgba(0, 0, 0, .28)`，只用于首页鲨鱼插画。
- **操作中层:** `0 4px 6px -1px rgba(0,0,0,.10), 0 2px 4px -2px rgba(0,0,0,.10)`，用于圆形确认键和底部面板动作。
- **主行动层:** `0 10px 15px -3px rgba(0,0,0,.10), 0 4px 6px -4px rgba(0,0,0,.10)`，用于全宽录入按钮。
- **媒体查看层:** `0 25px 50px -12px rgba(0,0,0,.25)`，只用于全屏放大的错题图片。

### Named Rules

**The Tonal-First Rule.** 静止容器默认靠深海表面色和细边界分层；只有动作、主题媒体或模态层获得阴影。

## Shapes

首页保持硬朗的零圆角任务板、方形状态槽和 1px 结构线，品牌标记与黄色斜带用切角和倾斜形成赛事警戒感。复习页使用 6px 卡片与输入圆角、8px 日历面板、12px 媒体圆角和完整圆形的 44px 图标按钮；28px 只属于底部面板的上边缘。

**The Square Mission, Soft Review Rule.** 任务指挥板保持直角，录入与复习工具允许小圆角；不要把首页批量胶囊化，也不要把所有复习容器改成硬边。

## Components

### Buttons

- **Shape:** 主要文字按钮为轻微圆角（6px），首页任务动作槽为方形，导航与单图标动作是 44px 圆形触控目标。
- **Primary:** 警戒黄底、深渊黑字、16px 内边距与 700 字重；用于录入、确认和当前可执行动作。
- **Hover / Focus:** 黄色悬停加深，按下缩放至 95–98%；所有交互通过 3px 完成青焦点环获得键盘可见性。
- **Secondary / Ghost:** 次要按钮使用升起舱板与复习灰文字；日期触发器透明，仅用黄色图标标明入口。

### Chips

- **Style:** 未到期条目使用设备蓝黑胶囊和浪沫白；掌握徽章使用琥珀底白字；最终掌握记录使用浅金底棕字。
- **State:** 胶囊承载离散状态与短内容，不承担页面级导航或主要命令。

### Cards / Containers

- **Corner Style:** 首页任务卡为直角；复习列表卡为 6px，日历和大分组为 8px。
- **Background:** 一级船舱板承载分组，设备蓝黑承载图标与嵌套内容，完成条目改为完成深绿。
- **Shadow Strategy:** 默认无阴影，以色调和细边框分层；参照 Elevation & Depth 的有限例外。
- **Border:** 首页用 1px 结构缝线，当前任务黄边，完成任务青绿边；复习卡主要依靠色面。
- **Internal Padding:** 紧凑条目 8–12px，常规卡片 16px，大型空状态与面板 20–32px。

### Inputs / Fields

- **Style:** 升起舱板背景、6px 圆角、12px × 16px 内边距和透明 2px 边框。
- **Focus:** 聚焦时边框切换为警戒黄；页面级 `focus-visible` 仍保留 3px 完成青外轮廓。
- **Error / Disabled:** 当前实现没有统一错误外观；只读历史任务降低不透明度并移除操作光标。

### Navigation

返回与月份切换使用 44px 圆形图标按钮，默认浪沫白或提示灰，悬停进入更亮的蓝黑表面，按下缩放至 95%。首页日期入口保持无底色，选中日期则用黄色实心圆或方格强调。

### Mission Task

签名任务组件是最小 82px 高的四列数据板。左起依次为两位序号、44px 状态图标、任务名称与状态说明、40px 动作槽；待办、潜航中、完成三个阶段通过边框、底板、图标色和动作符号一起变化。

### Bottom Sheet

录入流程由底部进入的 720px 宽面板承载，背景为设备蓝黑，顶部圆角为 28px，内边距 24px，背后使用半透明黑色与轻度模糊。主次动作并排且等宽。

## Motion

首页鲨鱼插画始终静态展示，避免持续动效分散孩子对任务和进度的注意力。任务状态与进度保留 180–400ms 的快速反馈，用于明确表达开始、完成与展开等操作结果。

**The Static Shark Rule.** 鲨鱼观察窗不使用循环动效；动态反馈只服务明确的操作与状态变化。

## Do's and Don'ts

### Do:

- **Do** 用警戒黄指出唯一主要动作，用完成青或深绿表达完成。
- **Do** 维持 44px 图标触控目标、清晰线性图标和文字标签之间的稳定关系。
- **Do** 让状态同时体现在颜色、图标和文案，确保孩子无需猜测。
- **Do** 在 540px 以下同步压缩边距、图片和任务网格，并保持 720px 单列上限。
- **Do** 尊重系统减少动态效果设置，把动画与过渡缩短为近乎即时。

### Don't:

- **Don't** 把界面改回通用浅色待办列表或用大片浅色背景削弱深海世界。
- **Don't** 把黄色同时用作装饰、信息和多个竞争操作；它的稀缺性提供方向。
- **Don't** 给所有容器增加阴影或大圆角；深度优先来自色调和细边界。
- **Don't** 用趣味展示字体承载长说明、表单值或密集数据。
- **Don't** 在宽屏拆成多列仪表盘；这是连续的单人任务通道。
