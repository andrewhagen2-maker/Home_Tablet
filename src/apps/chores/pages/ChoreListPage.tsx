import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChores } from '../../../hooks/useChores';
import { useKids } from '../../../hooks/useKids';
import { WeeklyGrid } from '../components/WeeklyGrid';
import { MonthlyCalendar } from '../components/MonthlyCalendar';
import { KidAvatar } from '../components/KidAvatar';
import { PointsBadge } from '../components/PointsBadge';
import { today } from '../../../store/storage';
import styles from './ChoreListPage.module.css';

type View = 'week' | 'month';

export function ChoreListPage() {
  const { kidId } = useParams<{ kidId: string }>();
  const navigate = useNavigate();
  const { kids } = useKids();
  const { completions, completeChore, getChoresForKid } = useChores();
  const [view, setView] = useState<View>('week');

  const kid = kids.find((k) => k.id === kidId);
  if (!kid || !kidId) return <p>Kid not found.</p>;

  const myChores = getChoresForKid(kidId);
  const todayCompletedIds = new Set(
    completions
      .filter((c) => c.kidId === kidId && c.completedDate === today())
      .map((c) => c.choreId)
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <KidAvatar emoji={kid.avatarEmoji} name={kid.name} color={kid.color} size="sm" />
        <PointsBadge kidId={kidId} />
        <button className={styles.rewardsBtn} onClick={() => navigate(`/apps/chores/${kidId}/rewards`)}>
          🎁 Rewards
        </button>
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${view === 'week' ? styles.active : ''}`}
          onClick={() => setView('week')}
        >
          This Week
        </button>
        <button
          className={`${styles.tab} ${view === 'month' ? styles.active : ''}`}
          onClick={() => setView('month')}
        >
          This Month
        </button>
      </div>
      <div className={styles.content}>
        {view === 'week' ? (
          <WeeklyGrid
            chores={myChores}
            kidId={kidId}
            completedTodayIds={todayCompletedIds}
            onComplete={(choreId, points) => completeChore(choreId, kidId, points)}
          />
        ) : (
          <MonthlyCalendar
            chores={myChores}
            kidId={kidId}
            completions={completions.filter((c) => c.kidId === kidId)}
            onComplete={(choreId, points) => completeChore(choreId, kidId, points)}
          />
        )}
      </div>
    </div>
  );
}
