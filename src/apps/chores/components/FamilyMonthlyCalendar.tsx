import { useState } from 'react';
import type { Kid, Chore, ChoreCompletion } from '../../../store/storage';
import { isDueOn, toDateStr } from '../../../utils/choreUtils';
import { ChoreCard } from './ChoreCard';
import styles from './FamilyMonthlyCalendar.module.css';

interface Props {
  kids: Kid[];
  allChores: Chore[];
  completions: ChoreCompletion[];
  onComplete: (choreId: string, kidId: string, points: number) => void;
  onEditKid: (kid: Kid) => void;
  onSelectKid: (kid: Kid) => void;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getChoresForKid(allChores: Chore[], kidId: string): Chore[] {
  return allChores.filter(
    (c) => c.active && (c.assignedKidIds.length === 0 || c.assignedKidIds.includes(kidId))
  );
}

export function FamilyMonthlyCalendar({ kids, allChores, completions, onComplete, onEditKid, onSelectKid }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  const totalDays = daysInMonth(year, month);
  const startDow = firstDayOfMonth(year, month);
  const todayKey = toDateStr(now);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); };

  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : null;
  const selectedDateStr = selectedDate ? toDateStr(selectedDate) : '';
  const isSelectedToday = selectedDateStr === todayKey;
  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });

  return (
    <div>
      <div className={styles.header}>
        <button className={styles.nav} onClick={prevMonth}>‹</button>
        <span className={styles.monthTitle}>{monthName} {year}</span>
        <button className={styles.nav} onClick={nextMonth}>›</button>
      </div>
      <div className={styles.dayHeaders}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
          <div key={d} className={styles.dayLabel}>{d}</div>
        ))}
      </div>
      <div className={styles.grid}>
        {Array.from({ length: startDow }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const dateStr = toDateStr(date);
          const isToday = dateStr === todayKey;
          const isSelected = day === selectedDay;

          // Collect kids that have chores due this day, with their colors
          const kidsWithChoresThisDay = kids.filter((kid) =>
            getChoresForKid(allChores, kid.id).some((c) => isDueOn(c, date))
          );

          return (
            <button
              key={day}
              className={`${styles.cell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
            >
              <span>{day}</span>
              {kidsWithChoresThisDay.length > 0 && (
                <div className={styles.dots}>
                  {kidsWithChoresThisDay.slice(0, 4).map((kid) => {
                    const kidChores = getChoresForKid(allChores, kid.id).filter((c) => isDueOn(c, date));
                    const allDone = kidChores.every((c) =>
                      completions.some((comp) => comp.kidId === kid.id && comp.choreId === c.id && comp.completedDate === dateStr)
                    );
                    return (
                      <span
                        key={kid.id}
                        className={styles.dot}
                        style={{ background: allDone ? kid.color : `${kid.color}88` }}
                        title={kid.name}
                      />
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className={styles.dayDetail}>
          <h3 className={styles.detailTitle}>
            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          {kids.map((kid) => {
            const kidChores = getChoresForKid(allChores, kid.id).filter((c) => isDueOn(c, selectedDate));
            if (kidChores.length === 0) return null;
            const completedIds = new Set(
              completions
                .filter((c) => c.kidId === kid.id && c.completedDate === selectedDateStr)
                .map((c) => c.choreId)
            );
            return (
              <div key={kid.id} className={styles.kidSection}>
                <div className={styles.kidHeader} style={{ borderLeftColor: kid.color }}>
                  <button className={styles.kidName} onClick={() => onSelectKid(kid)}>
                    <span>{kid.avatarEmoji}</span>
                    <span>{kid.name}</span>
                  </button>
                  <button className={styles.editBtn} onClick={() => onEditKid(kid)}>✏️</button>
                </div>
                {kidChores.map((c) => (
                  <ChoreCard
                    key={c.id}
                    chore={c}
                    kidId={kid.id}
                    completed={completedIds.has(c.id)}
                    onComplete={isSelectedToday ? (choreId, points) => onComplete(choreId, kid.id, points) : () => {}}
                  />
                ))}
              </div>
            );
          })}
          {kids.every((kid) => getChoresForKid(allChores, kid.id).filter((c) => isDueOn(c, selectedDate)).length === 0) && (
            <p className={styles.freeDay}>🌟 No chores this day!</p>
          )}
        </div>
      )}
    </div>
  );
}
