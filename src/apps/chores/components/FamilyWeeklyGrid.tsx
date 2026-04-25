import type { Kid, Chore, ChoreCompletion } from '../../../store/storage';
import { isDueOn, getWeekDates, toDateStr } from '../../../utils/choreUtils';
import { ChoreCard } from './ChoreCard';
import styles from './FamilyWeeklyGrid.module.css';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface Props {
  kids: Kid[];
  allChores: Chore[];
  completions: ChoreCompletion[];
  onComplete: (choreId: string, kidId: string, points: number) => void;
  onEditKid: (kid: Kid) => void;
  onSelectKid: (kid: Kid) => void;
}

function getChoresForKid(allChores: Chore[], kidId: string): Chore[] {
  return allChores.filter(
    (c) => c.active && (c.assignedKidIds.length === 0 || c.assignedKidIds.includes(kidId))
  );
}

export function FamilyWeeklyGrid({ kids, allChores, completions, onComplete, onEditKid, onSelectKid }: Props) {
  const week = getWeekDates();
  const todayStr = new Date().toDateString();

  return (
    <div className={styles.grid}>
      {week.map((date, i) => {
        const isToday = date.toDateString() === todayStr;
        const dateStr = toDateStr(date);

        const kidsWithChores = kids.map((kid) => ({
          kid,
          chores: getChoresForKid(allChores, kid.id).filter((c) => isDueOn(c, date)),
        })).filter(({ chores }) => chores.length > 0);

        return (
          <div key={i} className={`${styles.day} ${isToday ? styles.today : ''}`}>
            <div className={styles.dayHeader}>
              <span className={styles.dayName}>{DAY_NAMES[(i + 1) % 7]}</span>
              <span className={styles.dayDate}>{date.getMonth() + 1}/{date.getDate()}</span>
            </div>
            {kidsWithChores.length === 0 ? (
              <p className={styles.freeDay}>🌟 Free day!</p>
            ) : (
              kidsWithChores.map(({ kid, chores }) => {
                const completedIds = new Set(
                  completions
                    .filter((c) => c.kidId === kid.id && c.completedDate === dateStr)
                    .map((c) => c.choreId)
                );
                return (
                  <div key={kid.id} className={styles.kidSection}>
                    <div className={styles.kidHeader} style={{ borderLeftColor: kid.color }}>
                      <button
                        className={styles.kidName}
                        onClick={() => onSelectKid(kid)}
                        title={`View ${kid.name}'s chores`}
                      >
                        <span className={styles.kidEmoji}>{kid.avatarEmoji}</span>
                        <span>{kid.name}</span>
                      </button>
                      <button
                        className={styles.editBtn}
                        onClick={() => onEditKid(kid)}
                        title="Edit profile"
                      >✏️</button>
                    </div>
                    {chores.map((c) => (
                      <ChoreCard
                        key={c.id}
                        chore={c}
                        kidId={kid.id}
                        completed={completedIds.has(c.id)}
                        onComplete={isToday ? (choreId, points) => onComplete(choreId, kid.id, points) : () => {}}
                      />
                    ))}
                  </div>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );
}
