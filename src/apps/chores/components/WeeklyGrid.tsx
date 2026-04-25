import type { Chore } from '../../../store/storage';
import { ChoreCard } from './ChoreCard';
import styles from './WeeklyGrid.module.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDates(): Date[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isDueOn(chore: Chore, date: Date): boolean {
  const dow = date.getDay();
  if (chore.recurrence === 'daily') return true;
  if (chore.recurrence === 'weekly') return chore.weekdays?.includes(dow) ?? false;
  if (chore.recurrence === 'monthly') return chore.monthDay === date.getDate();
  if (chore.recurrence === 'once') {
    const created = new Date(chore.createdAt).toDateString();
    return created === date.toDateString();
  }
  return false;
}

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
