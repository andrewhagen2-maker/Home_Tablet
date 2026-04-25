import { useState } from 'react';
import type { Chore, ChoreCompletion } from '../../../store/storage';
import { isDueOn, toDateStr } from '../../../utils/choreUtils';
import { ChoreCard } from './ChoreCard';
import styles from './MonthlyCalendar.module.css';

interface Props {
  chores: Chore[];
  kidId: string;
  completions: ChoreCompletion[];
  onComplete: (choreId: string, points: number) => void;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function MonthlyCalendar({ chores, kidId, completions, onComplete }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate());

  const totalDays = daysInMonth(year, month);
  const startDow = firstDayOfMonth(year, month);
  const todayKey = toDateStr(now);

  const completedDates = new Set(completions.map((c) => c.completedDate));
  const completedOnDate = (dateStr: string) =>
    completions.filter((c) => c.completedDate === dateStr).map((c) => c.choreId);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDay(null); };

  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : null;
  const selectedDateStr = selectedDate ? toDateStr(selectedDate) : '';
  const selectedDueChores = selectedDate ? chores.filter((c) => isDueOn(c, selectedDate)) : [];
  const selectedCompleted = new Set(completedOnDate(selectedDateStr));
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
          const due = chores.filter((c) => isDueOn(c, date));
          const allDone = due.length > 0 && due.every((c) => completedDates.has(dateStr) && completedOnDate(dateStr).includes(c.id));
          const isToday = dateStr === todayKey;
          const isSelected = day === selectedDay;
          return (
            <button
              key={day}
              className={`${styles.cell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
            >
              <span>{day}</span>
              {due.length > 0 && (
                <span className={`${styles.dot} ${allDone ? styles.dotDone : ''}`} />
              )}
            </button>
          );
        })}
      </div>
      {selectedDate && selectedDueChores.length > 0 && (
        <div className={styles.dayDetail}>
          <h3>{selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          {selectedDueChores.map((c) => (
            <ChoreCard
              key={c.id}
              chore={c}
              kidId={kidId}
              completed={selectedCompleted.has(c.id)}
              onComplete={isSelectedToday ? onComplete : () => {}}
            />
          ))}
        </div>
      )}
      {selectedDate && selectedDueChores.length === 0 && (
        <p className={styles.freeDay}>🌟 No chores this day!</p>
      )}
    </div>
  );
}
