import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKids } from '../../../hooks/useKids';
import { KidAvatar } from '../components/KidAvatar';
import { PinGate } from '../../../components/PinGate';
import styles from './KidSelectPage.module.css';

export function KidSelectPage() {
  const navigate = useNavigate();
  const { kids } = useKids();
  const [showPin, setShowPin] = useState(false);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Who are you? 👋</h1>
      {kids.length === 0 ? (
        <div className={styles.empty}>
          <p>No kids set up yet.</p>
          <button className={styles.parentBtn} onClick={() => setShowPin(true)}>
            Parent Setup →
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {kids.map((kid) => (
            <KidAvatar
              key={kid.id}
              emoji={kid.avatarEmoji}
              name={kid.name}
              color={kid.color}
              size="lg"
              onClick={() => navigate(`/apps/chores/${kid.id}`)}
            />
          ))}
        </div>
      )}
      <button className={styles.parentBtn} onClick={() => setShowPin(true)}>
        🔒 Parent
      </button>
      {showPin && (
        <PinGate
          onSuccess={() => { setShowPin(false); navigate('/apps/chores/parent'); }}
          onCancel={() => setShowPin(false)}
        />
      )}
    </div>
  );
}
