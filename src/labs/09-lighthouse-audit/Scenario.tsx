/**
 * Lab 09 — Lighthouse 综合体检
 *
 * Scenario: 一个"产品落地页"，故意埋了多种会被 Lighthouse 扣分的问题：
 *   - 巨大且未优化的 hero 图（无 width/height/loading）→ Performance
 *   - 缺 alt 的 img → Accessibility
 *   - 低对比度的按钮文字 → Accessibility
 *   - 缺 meta description / lang 属性 → SEO + A11y
 *   - 阻塞渲染的大段内联样式 → Performance
 *
 * Lighthouse 由浏览器 DevTools 内置，无法从页面 JS 自动触发或读取结果。
 * 本关使用反思型验证：让学员手动跑 Lighthouse 并报告看到的最低分类别。
 */

import './Scenario.css';

export function LighthouseAuditScenario() {
  return (
    <div className="lhp">
      {/* [TEACHING_BUG] 缺 meta lang / description 是 Lighthouse SEO 扣分项；
          首屏图无 width/height/loading 是 LCP 扣分项 */}
      <section className="lhp__hero">
        {/* [TEACHING_BUG] 外链大图无尺寸、无 lazy、无 alt */}
        <img
          src="https://picsum.photos/2000/1200"
          className="lhp__hero-img"
          // 故意 omit: alt, width, height, loading="lazy"
        />
        <h1 className="lhp__hero-title">革命性的产品</h1>
        {/* [TEACHING_BUG] 黄字白底对比度不足 4.5:1 */}
        <a href="#buy" className="lhp__cta">
          立即购买
        </a>
      </section>

      <section className="lhp__features">
        <article>
          {/* [TEACHING_BUG] 装饰图缺 alt */}
          <img src="https://picsum.photos/120/120" />
          <h3>快</h3>
          <p>毫秒级响应</p>
        </article>
        <article>
          <img src="https://picsum.photos/120/120" />
          <h3>稳</h3>
          <p>99.99% 可用</p>
        </article>
        <article>
          <img src="https://picsum.photos/120/120" />
          <h3>省</h3>
          <p>0 元起</p>
        </article>
      </section>

      <p className="lhp__hint">
        本页面看着"还行"，但 Lighthouse 评分会很难看。打开 Lighthouse 跑一次。
      </p>
    </div>
  );
}
