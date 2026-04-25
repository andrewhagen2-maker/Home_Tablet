import { useState } from 'react';
import { ConfettiCelebration } from '../../../components/ConfettiCelebration';
import type { Chore } from '../../../store/storage';
import styles from './ChoreCard.module.css';

interface Props {
  chore: Chore;
  kidId: string;
  completed: boolean;
  onComplete: (choreId: string, points: number) => void;
}

export function ChoreCard({ chore, completed, onComplete }: Props) {
  const [celebrate, setCelebrate] = useState(false);

  const handleCheck = () => {
    if (completed) return;
    setCelebrate(true);
    onComplete(chore.id, chore.points);
    setTimeout(() => setCelebrate(false), 2000);
  };

  return (
    <div className={`${styles.card} ${completed ? styles.done : ''}`}>
      {celebrate && <ConfettiCelebration />}
      <div className={styles.info}>
        <span className={styles.title}>{chore.title}</span>
        {chore.description && <span className={styles.desc}>{chore.description}</span>}
      </div>
      <div className={styles.right}>
        <span className={styles.pts}>+{chore.points}⭐</span>
        <button
          className={`${styles.check} ${completed ? styles.checked : ''}`}
          onClick={handleCheck}
          disabled={completed}
          aria-label={completed ? 'Done' : 'Mark complete'}
        >
          {completed ? '✓' : ''}
        </button>
      </div>
    </div>
  );
}
