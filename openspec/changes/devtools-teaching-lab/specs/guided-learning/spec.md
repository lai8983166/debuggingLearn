## ADDED Requirements

### Requirement: Console 引导通道
每个关卡 SHALL 在学员进入页面时通过 `console.log` 输出至少一条带样式的引导信息，统一前缀为 `[Lab]`。学员点击"下一步提示"按钮时 SHALL 输出下一条引导信息。Console 引导 SHALL 使用 `%c` 样式让引导信息在视觉上与普通日志区分。

#### Scenario: 进入关卡输出首条引导
- **WHEN** 学员进入一个关卡页面
- **THEN** 浏览器 Console SHALL 自动出现一条带颜色样式的 `[Lab]` 开头的引导信息，说明本关训练目标和首步操作

#### Scenario: 主动索取下一步提示
- **WHEN** 学员点击页面上的"下一步提示"按钮
- **THEN** Console SHALL 输出引导序列中的下一条信息；到达最后一条时按钮 SHALL 置灰

### Requirement: 步骤浮窗通道
每个关卡 SHALL 在右下角提供一个步骤浮窗组件，显示当前步骤序号（X/N）、步骤说明文本、上一步/下一步按钮。浮窗 SHALL 可最小化、可关闭后通过按钮重新唤起。

#### Scenario: 浮窗默认展示
- **WHEN** 学员进入关卡
- **THEN** 右下角 SHALL 出现浮窗，自动定位到第 1 步

#### Scenario: 步骤导航
- **WHEN** 学员点击"下一步"
- **THEN** 浮窗 SHALL 切换到下一步骤内容；步骤序号 SHALL 同步更新为 `X+1/N`

#### Scenario: 浮窗可恢复
- **WHEN** 学员关闭浮窗后点击"显示引导"按钮
- **THEN** 浮窗 SHALL 在上次所在步骤重新出现

### Requirement: 页面元素高亮
步骤浮窗的某个步骤 SHALL 支持配置 `highlightSelector`，用于在页面侧用 outline 框高亮指定 DOM 元素，引导学员关注。MUST NOT 尝试高亮 DevTools 面板本身（浏览器限制无法实现）。

#### Scenario: 高亮页面元素
- **WHEN** 当前步骤配置了 `highlightSelector: '.login-card'`
- **THEN** 页面上匹配该选择器的元素 SHALL 出现明显的高亮 outline（如黄色 2px 实线）

#### Scenario: DevTools 操作步骤用截图缩略图替代
- **WHEN** 当前步骤需要学员操作 DevTools 面板本身（如打开 Sources 面板）
- **THEN** 浮窗内容 SHALL 包含该 DevTools 面板的截图缩略图或简明文字说明，不依赖高亮

### Requirement: 答案验证通道
每个关卡 SHALL 提供"检查答案"按钮，触发 `validate()` 返回 `{ passed, feedback }`。验证逻辑 SHALL 至少支持两种类型：（a）主动型——读页面 DOM/computed style/全局状态判断修复是否生效；（b）反思型——弹出单选/多选让学员选出根因。系统 SHALL 允许一关同时使用两种类型。

#### Scenario: 主动型验证
- **WHEN** 学员在 Elements 关卡通过 DevTools 修改了 DOM 后点击"检查答案"
- **THEN** 系统 SHALL 读取当前 DOM/computed style 与期望值比对，返回通过或反馈

#### Scenario: 反思型验证
- **WHEN** 学员在 Sources 关卡点击"检查答案"
- **THEN** 系统 SHALL 弹出单选题，要求学员从选项中选出 bug 的根因；选对则通过，选错则给出反馈

### Requirement: 验证反馈样式
验证通过时 SHALL 同时通过 Console（带庆祝样式）、浮窗（成功徽标）、页面 Toast 三种通道给出反馈。验证未通过时 SHALL 仅在浮窗与 Toast 中显示 feedback 文本，不输出到 Console（避免污染日志）。

#### Scenario: 通过反馈多通道
- **WHEN** `validate()` 返回 `{ passed: true }`
- **THEN** Console SHALL 输出庆祝信息、浮窗 SHALL 显示成功图标、页面 SHALL 弹出"通关"Toast

#### Scenario: 未通过反馈
- **WHEN** `validate()` 返回 `{ passed: false, feedback: "看看第 23 行..." }`
- **THEN** 浮窗与 Toast SHALL 显示 feedback 文本，Console SHALL 不输出该 feedback

### Requirement: 分级提示兜底
每个关卡 SHALL 提供分级文字提示（至少 3 级：模糊 → 具体 → 答案位置），作为前三个通道之外的兜底。学员 MUST 在请求第 N 级提示后才能查看第 N+1 级。

#### Scenario: 渐进提示
- **WHEN** 学员连续点击"提示"按钮
- **THEN** 提示文本 SHALL 按级别递进（如 "看看渲染逻辑" → "检查 `map` 函数" → "第 42 行 key 重复"），且每次只前进一级

### Requirement: 引导通道可独立使用
学员 SHALL 能仅依靠其中任一通道（Console、浮窗、验证反馈、分级提示）完成关卡，不强制必须使用所有通道。

#### Scenario: 仅用 Console 通关
- **WHEN** 学员关闭浮窗、不点击提示按钮，仅跟随 Console 输出操作
- **THEN** 该学员 SHALL 仍能完成所有必要操作并通关

### Requirement: 演示模式
系统 SHALL 支持 URL query param `?presentation=1` 进入演示模式，隐藏步骤浮窗与分级提示按钮，仅保留 Console 引导。用于老师投屏讲解场景。

#### Scenario: 启用演示模式
- **WHEN** 访问 `/labs/console-errors?presentation=1`
- **THEN** 页面 SHALL 不渲染步骤浮窗与"提示"按钮，但 Console 引导 SHALL 仍然输出
