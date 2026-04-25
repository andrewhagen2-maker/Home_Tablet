import type { Chore } from '../store/storage';

export function isDueOn(chore: Chore, date: Date): boolean {
  const dow = date.getDay();
  if (chore.recurrence === 'daily') return true;
  if (chore.recurrence === 'weekly') return chore.weekdays?.includes(dow) ?? false;
  if (chore.recurrence === 'monthly') return chore.monthDay === date.getDate();
  if (chore.recurrence === 'once') {
    return new Date(chore.createdAt).toDateString() === date.toDateString();
  }
  return false;
}

export function toDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function getWeekDates(): Date[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
