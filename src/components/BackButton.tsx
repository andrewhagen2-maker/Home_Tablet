import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css';

export function BackButton() {
  const navigate = useNavigate();
  return (
    <button className={styles.btn} onClick={() => navigate('/')} aria-label="Back to home">
      ←
    </button>
  );
}
