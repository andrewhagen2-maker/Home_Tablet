import { useParams, useNavigate } from 'react-router-dom';
import { useKids } from '../../../hooks/useKids';
import { useRewards } from '../../../hooks/useRewards';
import { storage } from '../../../store/storage';
import { RewardCard } from '../components/RewardCard';
import { KidAvatar } from '../components/KidAvatar';
import styles from './RewardsPage.module.css';

export function RewardsPage() {
  const { kidId } = useParams<{ kidId: string }>();
  const navigate = useNavigate();
  const { kids } = useKids();
  const { rewards, redemptions, requestRedemption } = useRewards();

  const kid = kids.find((k) => k.id === kidId);
  if (!kid || !kidId) return <p>Kid not found.</p>;

  const availablePoints = storage.getAvailablePoints(kidId);
  const activeRewards = rewards.filter((r) => r.active);
  const pendingMap = new Map(
    redemptions
      .filter((r) => r.kidId === kidId && !r.markedByParent)
      .map((r) => [r.rewardId, r])
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <KidAvatar emoji={kid.avatarEmoji} name={kid.name} color={kid.color} size="sm" />
        <div className={styles.totalPoints}>
          <span className={styles.pts}>{availablePoints}</span>
          <span className={styles.ptsLabel}>⭐ available points</span>
        </div>
        <button className={styles.backBtn} onClick={() => navigate(`/apps/chores/${kidId}`)}>
          ← Chores
        </button>
      </div>
      <h2 className={styles.sectionTitle}>Rewards</h2>
      {activeRewards.length === 0 ? (
        <p className={styles.empty}>No rewards set up yet. Ask a parent!</p>
      ) : (
        activeRewards.map((r) => (
          <RewardCard
            key={r.id}
            reward={r}
            kidId={kidId}
            availablePoints={availablePoints}
            pendingRedemption={pendingMap.get(r.id)}
            onRedeem={(rewardId, cost) => requestRedemption(rewardId, kidId, cost)}
          />
        ))
      )}
    </div>
  );
}
