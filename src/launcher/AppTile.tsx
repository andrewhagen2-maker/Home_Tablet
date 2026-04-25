import { useNavigate } from 'react-router-dom';
import type { AppMeta } from './apps-registry';
import styles from './AppTile.module.css';

interface Props {
  app: AppMeta;
}

export function AppTile({ app }: Props) {
  const navigate = useNavigate();
  return (
    <button
      className={styles.tile}
      style={{ '--tile-color': app.color } as React.CSSProperties}
      onClick={() => navigate(app.route)}
    >
      <span className={styles.icon}>{app.icon}</span>
      <span className={styles.label}>{app.label}</span>
    </button>
  );
}
