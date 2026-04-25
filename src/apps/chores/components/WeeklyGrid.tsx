import type { Chore } from '../../../store/storage';
import { isDueOn, getWeekDates } from '../../../utils/choreUtils';
import { ChoreCard } from './ChoreCard';
import styles from './WeeklyGrid.module.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  chores: Chore[];
  kidId: string;
  completedTodayIds: Set<string>;
  onComplete: (choreId: string, points: number) => void;
}

export function WeeklyGrid({ chores, kidId, completedTodayIds, onComplete }: Props) {
  const week = getWeekDates();
  const todayStr = new Date().toDateString();

  return (
    <div className={styles.grid}>
      {week.map((date, i) => {
        const isToday = date.toDateString() === todayStr;
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        const due = chores.filter((c) => isDueOn(c, date));
        return (
          <div key={i} className={`${styles.day} ${isToday ? styles.today : ''}`}>
            <div className={styles.dayHeader}>
              <span className={styles.dayName}>{DAY_NAMES[(i + 1) % 7]}</span>
              <span className={styles.dayDate}>{dateStr}</span>
            </div>
            {due.length === 0 ? (
              <p className={styles.empty}>🌟 Free day!</p>
            ) : (
              due.map((c) => (
                <ChoreCard
                  key={c.id}
                  chore={c}
                  kidId={kidId}
                  completed={isToday && completedTodayIds.has(c.id)}
                  onComplete={isToday ? onComplete : () => {}}
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
