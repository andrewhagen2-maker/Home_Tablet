import { useState, useCallback } from 'react';
import { storage, generateId, today, type Chore, type ChoreCompletion } from '../store/storage';

export function useChores() {
  const [chores, setChoresState] = useState<Chore[]>(() => storage.getChores());
  const [completions, setCompletionsState] = useState<ChoreCompletion[]>(() =>
    storage.getCompletions()
  );

  const refresh = useCallback(() => {
    setChoresState(storage.getChores());
    setCompletionsState(storage.getCompletions());
  }, []);

  const addChore = useCallback((data: Omit<Chore, 'id' | 'createdAt' | 'active'>) => {
    const chore: Chore = { ...data, id: generateId(), createdAt: new Date().toISOString(), active: true };
    const updated = [...storage.getChores(), chore];
    storage.setChores(updated);
    setChoresState(updated);
  }, []);

  const updateChore = useCallback((id: string, data: Partial<Chore>) => {
    const updated = storage.getChores().map((c) => (c.id === id ? { ...c, ...data } : c));
    storage.setChores(updated);
    setChoresState(updated);
  }, []);

  const deleteChore = useCallback((id: string) => {
    const updated = storage.getChores().map((c) => (c.id === id ? { ...c, active: false } : c));
    storage.setChores(updated);
    setChoresState(updated);
  }, []);

  const completeChore = useCallback((choreId: string, kidId: string, points: number) => {
    const completion: ChoreCompletion = {
      id: generateId(),
      choreId,
      kidId,
      completedDate: today(),
      pointsEarned: points,
    };
    const updated = [...storage.getCompletions(), completion];
    storage.setCompletions(updated);
    setCompletionsState(updated);
  }, []);

  const isCompletedToday = useCallback(
    (choreId: string, kidId: string): boolean => {
      const t = today();
      return completions.some(
        (c) => c.choreId === choreId && c.kidId === kidId && c.completedDate === t
      );
    },
    [completions]
  );

  const getChoresForKid = useCallback(
    (kidId: string): Chore[] => {
      return chores.filter(
        (c) => c.active && (c.assignedKidIds.length === 0 || c.assignedKidIds.includes(kidId))
      );
    },
    [chores]
  );

  return { chores, completions, refresh, addChore, updateChore, deleteChore, completeChore, isCompletedToday, getChoresForKid };
}
