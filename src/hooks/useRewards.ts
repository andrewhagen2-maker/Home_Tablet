import { useState, useCallback } from 'react';
import { storage, generateId, type Reward, type Redemption } from '../store/storage';

export function useRewards() {
  const [rewards, setRewardsState] = useState<Reward[]>(() => storage.getRewards());
  const [redemptions, setRedemptionsState] = useState<Redemption[]>(() => storage.getRedemptions());

  const refresh = useCallback(() => {
    setRewardsState(storage.getRewards());
    setRedemptionsState(storage.getRedemptions());
  }, []);

  const addReward = useCallback((data: Omit<Reward, 'id' | 'active'>) => {
    const reward: Reward = { ...data, id: generateId(), active: true };
    const updated = [...storage.getRewards(), reward];
    storage.setRewards(updated);
    setRewardsState(updated);
  }, []);

  const updateReward = useCallback((id: string, data: Partial<Reward>) => {
    const updated = storage.getRewards().map((r) => (r.id === id ? { ...r, ...data } : r));
    storage.setRewards(updated);
    setRewardsState(updated);
  }, []);

  const deleteReward = useCallback((id: string) => {
    const updated = storage.getRewards().map((r) => (r.id === id ? { ...r, active: false } : r));
    storage.setRewards(updated);
    setRewardsState(updated);
  }, []);

  const requestRedemption = useCallback((rewardId: string, kidId: string, pointCost: number) => {
    const redemption: Redemption = {
      id: generateId(),
      rewardId,
      kidId,
      redeemedAt: new Date().toISOString(),
      pointsSpent: pointCost,
      markedByParent: false,
    };
    const updated = [...storage.getRedemptions(), redemption];
    storage.setRedemptions(updated);
    setRedemptionsState(updated);
  }, []);

  const approveRedemption = useCallback((id: string) => {
    const updated = storage.getRedemptions().map((r) =>
      r.id === id ? { ...r, markedByParent: true } : r
    );
    storage.setRedemptions(updated);
    setRedemptionsState(updated);
  }, []);

  const rejectRedemption = useCallback((id: string) => {
    const updated = storage.getRedemptions().filter((r) => r.id !== id);
    storage.setRedemptions(updated);
    setRedemptionsState(updated);
  }, []);

  const getPendingRedemptions = useCallback(
    () => redemptions.filter((r) => !r.markedByParent),
    [redemptions]
  );

  return {
    rewards,
    redemptions,
    refresh,
    addReward,
    updateReward,
    deleteReward,
    requestRedemption,
    approveRedemption,
    rejectRedemption,
    getPendingRedemptions,
  };
}
