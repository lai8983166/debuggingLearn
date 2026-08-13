import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getLab, getNextLab, getLabIndex, isUnlocked } from '@/labs/registry';
import { useProgressStore } from '@/store/progressStore';
import { LabGuide } from '@/components/LabGuide';
import { toast } from '@/components/Toast';
import './LabPage.css';

export function LabPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const completedSet = useProgressStore((s) => new Set(s.completed));
  const setCurrentLab = useProgressStore((s) => s.setCurrentLab);

  const lab = getLab(slug);
  const unlocked = lab ? isUnlocked(lab.meta.slug, completedSet) : false;
  const nextLab = lab ? getNextLab(lab.meta.slug) : null;

  // Track current lab for resume-on-reload behavior.
  useEffect(() => {
    if (lab) setCurrentLab(lab.meta.slug);
  }, [lab, setCurrentLab]);

  // Redirect locked lab to /labs with a hint about the prerequisite.
  useEffect(() => {
    if (lab && !unlocked) {
      const index = getLabIndex(lab.meta.slug);
      const prevSlug = lab.meta.prerequisite;
      const prev = prevSlug ? getLab(prevSlug) : null;
      const prevTitle = prev?.meta.title ?? (index > 0 ? '前一关' : '');
      toast.info(`请先完成前置关卡：${prevTitle}`);
      navigate('/labs', { replace: true });
    }
  }, [lab, unlocked, navigate]);

  if (!lab) {
    return (
      <div className="lab-page__missing">
        <h2>找不到这个关卡</h2>
        <p>
          <code>{slug}</code> 不是有效关卡。
        </p>
        <Link to="/labs">← 返回关卡列表</Link>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="lab-page__locked">
        <p>需要先完成前置关卡，正在返回列表...</p>
      </div>
    );
  }

  const Scenario = lab.Scenario;

  return (
    <div className="lab-page">
      <div className="lab-page__head">
        <Link to="/labs" className="lab-page__back">
          ← 关卡列表
        </Link>
        <div className="lab-page__meta">
          <span className="lab-page__panel">{lab.meta.panel}</span>
          <span className="lab-page__diff">
            {'★'.repeat(lab.meta.difficulty)}
            {'☆'.repeat(3 - lab.meta.difficulty)}
          </span>
        </div>
      </div>

      <h2 className="lab-page__title">{lab.meta.title}</h2>
      <p className="lab-page__goal">{lab.meta.learningGoal}</p>

      <section className="lab-page__scenario">
        <Scenario />
      </section>

      <LabGuide lab={lab} />

      {nextLab && (
        <p className="lab-page__hint">
          （通关后自动解锁下一关：<strong>{nextLab.meta.title}</strong>）
        </p>
      )}
    </div>
  );
}
