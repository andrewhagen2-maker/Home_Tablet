import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKids } from '../../../hooks/useKids';
import { KidAvatar } from '../components/KidAvatar';
import { PinGate } from '../../../components/PinGate';
import { KidEditModal } from '../components/KidEditModal';
import type { Kid } from '../../../store/storage';
import styles from './KidSelectPage.module.css';

export function KidSelectPage() {
  const navigate = useNavigate();
  const { kids, updateKid } = useKids();
  const [showPin, setShowPin] = useState(false);
  const [editingKid, setEditingKid] = useState<Kid | null>(null);

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
            <div key={kid.id} className={styles.kidWrapper}>
              <KidAvatar
                emoji={kid.avatarEmoji}
                name={kid.name}
                color={kid.color}
                size="lg"
                onClick={() => navigate(`/apps/chores/${kid.id}`)}
              />
              <button
                className={styles.editBtn}
                onClick={(e) => { e.stopPropagation(); setEditingKid(kid); }}
                title="Edit profile"
              >✏️</button>
            </div>
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
      {editingKid && (
        <KidEditModal
          kid={editingKid}
          onSave={(data) => { updateKid(editingKid.id, data); setEditingKid(null); }}
          onCancel={() => setEditingKid(null)}
        />
      )}
    </div>
  );
}
