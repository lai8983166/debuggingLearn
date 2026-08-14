/**
 * Lab 26 — 跨浏览器 DevTools 差异
 *
 * 文档型关卡：展示 Chrome / Safari / Firefox 三家 DevTools 的对照表。
 * 反思型验证。
 */

import './Scenario.css';

const COMPARISON: { feature: string; chrome: string; safari: string; firefox: string }[] = [
  { feature: '打开 DevTools', chrome: 'F12 / Cmd+Opt+I', safari: 'Cmd+Opt+I（需先在设置启用开发菜单）', firefox: 'F12 / Cmd+Opt+I' },
  { feature: 'Console', chrome: '✓', safari: '✓', firefox: '✓（支持多行编辑更好用）' },
  { feature: 'Elements / 检查器', chrome: 'Elements', safari: '元素标签', firefox: '检查器' },
  { feature: 'Network', chrome: '✓（最全）', safari: '✓（叫"网络"）', firefox: '✓（支持请求重放）' },
  { feature: 'Sources / 调试器', chrome: 'Sources', safari: '来源代码', firefox: '调试器' },
  { feature: 'Performance', chrome: '✓（火焰图成熟）', safari: '✓（时间线）', firefox: '✓（性能）' },
  { feature: 'Memory / 内存', chrome: '✓（堆快照）', safari: '✓（内存仪表）', firefox: '✓（内存快照）' },
  { feature: 'Application / 存储', chrome: '✓（最全）', safari: '✓（存储标签）', firefox: '✓（存储）' },
  { feature: 'Device Mode 移动模拟', chrome: '✓（最准）', safari: '响应式设计模式', firefox: '✓（响应式设计）' },
  { feature: 'Layers 3D 视图', chrome: '✓', safari: '✓（图形层，更好用）', firefox: '✗' },
  { feature: 'Grid 布局可视化', chrome: '✓', safari: '✗', firefox: '✓（最强大）' },
  { feature: 'Fonts 面板', chrome: '✗', safari: '✗', firefox: '✓（字体调试独有）' },
  { feature: 'CSS Shapes 编辑', chrome: '✗', safari: '✗', firefox: '✓' },
  { feature: '截图整页', chrome: '✓ Cmd+Shift+P 搜 capture', safari: '✓', firefox: '✓' },
];

export function CrossBrowserScenario() {
  return (
    <div className="cb">
      <h3>🌍 三大浏览器 DevTools 对照</h3>
      <p className="cb__lead">
        本关是文档型——三家 DevTools 各有所长。实际工作中你会遇到"Chrome 正常 Safari
        炸"的场景，知道去哪找对应工具是关键技能。
      </p>

      <div className="cb__table-wrap">
        <table className="cb__table">
          <thead>
            <tr>
              <th>功能</th>
              <th>Chrome</th>
              <th>Safari</th>
              <th>Firefox</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.feature}>
                <td className="cb__feature">{row.feature}</td>
                <td>{row.chrome}</td>
                <td>{row.safari}</td>
                <td>{row.firefox}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="cb__hint">
        记住三个独有武器：Safari 的 <strong>图形层</strong>视图、Firefox 的
        <strong> Grid 布局</strong>可视化、Chrome 的 <strong>Recorder + Coverage</strong>。
      </p>
    </div>
  );
}
