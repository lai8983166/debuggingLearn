/**
 * Lab 12 — Web Vitals（LCP / CLS / INP 三阶段）
 *
 * Scenario: 一个简单产品页，三个独立的 bug 同时拉低 Web Vitals：
 *   - LCP 高：hero 图巨大（外链大图），无 width/height/loading
 *   - CLS 高：图片占位是 0 高度的 div，图加载完撑开会"跳"
 *   - INP 高：按钮 onClick 跑 500ms 同步循环
 *
 * 学员通过三个"应用修复"按钮分别修每一项。validate() 内部维护 phase 状态，
 * 三阶段全过才返回 passed=true。
 *
 * 同时用 WebVitalsMeter 组件显示实时数值，方便学员观察修复效果。
 */

import { useState } from 'react';
import { WebVitalsMeter } from '@/components/WebVitalsMeter';
import './Scenario.css';

export function WebVitalsScenario() {
  // 三阶段修复状态
  const [lcpFixed, setLcpFixed] = useState(false);
  const [clsFixed, setClsFixed] = useState(false);
  const [inpFixed, setInpFixed] = useState(false);
  const [count, setCount] = useState(0);

  // [TEACHING_BUG] INP：onClick 跑 500ms 同步循环堵塞主线程
  const handleClickSlow = () => {
    const start = Date.now();
    while (Date.now() - start < 500) {
      // busy wait
    }
    setCount((c) => c + 1);
  };

  // 修复后的版本：用 setTimeout 让主线程透气
  const handleClickFixed = () => {
    window.setTimeout(() => setCount((c) => c + 1), 0);
  };

  return (
    <div className="wv">
      <WebVitalsMeter />

      <h3>📊 Web Vitals 三连击</h3>
      <p className="wv__lead">
        本页同时埋了 LCP / CLS / INP 三个 bug。看右上角实时数值（红色 = 不合格）。
        点页面下方"应用 X 修复"按钮，观察数值变化。
      </p>

      <section className="wv__section">
        <h4>LCP（最大内容渲染）</h4>
        {lcpFixed ? (
          // 修复版：小图 + lazy + 尺寸
          <img
            src="https://picsum.photos/120/90"
            width={400}
            height={300}
            loading="lazy"
            alt="修复后的 hero"
            className="wv__hero wv__hero--fixed"
          />
        ) : (
          // [TEACHING_BUG] 巨大外链图 + 无尺寸 + 无 lazy
          <img src="https://picsum.photos/2000/1500" alt="" className="wv__hero" />
        )}
        <div>
          <button type="button" className="btn" onClick={() => setLcpFixed(true)}>
            应用 LCP 修复
          </button>
        </div>
      </section>

      <section className="wv__section">
        <h4>CLS（累积布局偏移）</h4>
        <div className="wv__card">
          {!clsFixed && (
            <>
              {/* [TEACHING_BUG] 占位 0 高度，图加载完会撑开 → 触发 layout shift */}
              <div className="wv__placeholder-bad">
                <img src="https://picsum.photos/300/200?random=1" alt="" />
              </div>
              <p>等图片加载完成，下面这条线会"被推下去"——这就是 CLS。</p>
            </>
          )}
          {clsFixed && (
            <div className="wv__placeholder-good" style={{ aspectRatio: '3 / 2' }}>
              <img src="https://picsum.photos/300/200?random=1" alt="" loading="lazy" />
            </div>
          )}
        </div>
        <div>
          <button type="button" className="btn" onClick={() => setClsFixed(true)}>
            应用 CLS 修复
          </button>
        </div>
      </section>

      <section className="wv__section">
        <h4>INP（交互到下一帧）</h4>
        <p>当前计数：{count}</p>
        {/* [TEACHING_BUG] 修复前 onClick 同步堵塞 500ms；修复后切到 setTimeout */}
        <button
          type="button"
          className="btn btn--primary"
          onClick={inpFixed ? handleClickFixed : handleClickSlow}
        >
          {inpFixed ? '快速响应（已修复）' : '点我（响应会卡顿）'}
        </button>
        <div>
          <button type="button" className="btn" onClick={() => setInpFixed(true)}>
            应用 INP 修复
          </button>
        </div>
      </section>

      <p className="wv__hint">
        每应用一项修复，看右上角对应指标的颜色变化。三项全修复后点"检查答案"通关。
      </p>
    </div>
  );
}
