import { useState, useCallback } from 'react';
import { storage, generateId, type Kid } from '../store/storage';

export function useKids() {
  const [kids, setKidsState] = useState<Kid[]>(() => storage.getKids());

  const refresh = useCallback(() => setKidsState(storage.getKids()), []);

  const addKid = useCallback((data: Omit<Kid, 'id' | 'createdAt'>) => {
    const kid: Kid = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    const updated = [...storage.getKids(), kid];
    storage.setKids(updated);
    setKidsState(updated);
  }, []);

  const updateKid = useCallback((id: string, data: Partial<Kid>) => {
    const updated = storage.getKids().map((k) => (k.id === id ? { ...k, ...data } : k));
    storage.setKids(updated);
    setKidsState(updated);
  }, []);

  const deleteKid = useCallback((id: string) => {
    const updated = storage.getKids().filter((k) => k.id !== id);
    storage.setKids(updated);
    setKidsState(updated);
  }, []);

  return { kids, refresh, addKid, updateKid, deleteKid };
}
