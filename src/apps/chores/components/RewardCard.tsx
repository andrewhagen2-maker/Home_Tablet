import type { Reward, Redemption } from '../../../store/storage';
import styles from './RewardCard.module.css';

interface Props {
  reward: Reward;
  kidId: string;
  availablePoints: number;
  pendingRedemption?: Redemption;
  onRedeem: (rewardId: string, cost: number) => void;
}

export function RewardCard({ reward, availablePoints, pendingRedemption, onRedeem }: Props) {
  const canAfford = availablePoints >= reward.pointCost;
  const isPending = !!pendingRedemption;

  return (
    <div className={`${styles.card} ${!canAfford ? styles.dim : ''}`}>
      <span className={styles.emoji}>{reward.imageEmoji ?? '🎁'}</span>
      <div className={styles.info}>
        <span className={styles.title}>{reward.title}</span>
        {reward.description && <span className={styles.desc}>{reward.description}</span>}
        <span className={styles.cost}>⭐ {reward.pointCost} pts</span>
      </div>
      <div className={styles.action}>
        {isPending ? (
          <span className={styles.pending}>⏳ Waiting for parent</span>
        ) : (
          <button
            className={styles.redeemBtn}
            disabled={!canAfford}
            onClick={() => onRedeem(reward.id, reward.pointCost)}
          >
            Redeem
          </button>
        )}
      </div>
    </div>
  );
}
