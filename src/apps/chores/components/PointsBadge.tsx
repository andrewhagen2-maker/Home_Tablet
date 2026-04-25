import { storage } from '../../../store/storage';
import styles from './PointsBadge.module.css';

interface Props {
  kidId: string;
}

export function PointsBadge({ kidId }: Props) {
  const points = storage.getAvailablePoints(kidId);
  return (
    <div className={styles.badge}>
      <span className={styles.star}>⭐</span>
      <span className={styles.points}>{points}</span>
      <span className={styles.label}>pts</span>
    </div>
  );
}
