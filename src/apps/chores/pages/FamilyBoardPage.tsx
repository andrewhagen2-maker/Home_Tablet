import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKids } from '../../../hooks/useKids';
import { useChores } from '../../../hooks/useChores';
import { PinGate } from '../../../components/PinGate';
import { KidEditModal } from '../components/KidEditModal';
import { FamilyWeeklyGrid } from '../components/FamilyWeeklyGrid';
import { FamilyMonthlyCalendar } from '../components/FamilyMonthlyCalendar';
import { storage } from '../../../store/storage';
import type { Kid } from '../../../store/storage';
import styles from './FamilyBoardPage.module.css';

type View = 'week' | 'month';

export function FamilyBoardPage() {
  const navigate = useNavigate();
  const { kids, updateKid } = useKids();
  const { chores, completions, completeChore } = useChores();
  const [view, setView] = useState<View>('week');
  const [editingKid, setEditingKid] = useState<Kid | null>(null);
  const [showPin, setShowPin] = useState(false);

  const familyName = storage.getSettings()?.familyName ?? 'Our Family';

  if (kids.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.empty}>
          <p>No kids set up yet.</p>
          <button className={styles.parentBtn} onClick={() => setShowPin(true)}>
            Parent Setup →
          </button>
        </div>
        {showPin && (
          <PinGate
            onSuccess={() => { setShowPin(false); navigate('/apps/chores/parent'); }}
            onCancel={() => setShowPin(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.kidPills}>
            {kids.map((kid) => (
              <button
                key={kid.id}
                className={styles.kidPill}
                style={{ background: kid.color }}
                onClick={() => navigate(`/apps/chores/${kid.id}`)}
                title={kid.name}
              >
                <span className={styles.pillEmoji}>{kid.avatarEmoji}</span>
                <span className={styles.pillName}>{kid.name}</span>
              </button>
            ))}
          </div>
          <h1 className={styles.title}>{familyName} 🏠</h1>
        </div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${view === 'week' ? styles.active : ''}`}
            onClick={() => setView('week')}
          >This Week</button>
          <button
            className={`${styles.tab} ${view === 'month' ? styles.active : ''}`}
            onClick={() => setView('month')}
          >This Month</button>
        </div>
      </div>

      <div className={styles.content}>
        {view === 'week' ? (
          <FamilyWeeklyGrid
            kids={kids}
            allChores={chores}
            completions={completions}
            onComplete={(choreId, kidId, points) => completeChore(choreId, kidId, points)}
            onEditKid={setEditingKid}
            onSelectKid={(kid) => navigate(`/apps/chores/${kid.id}`)}
          />
        ) : (
          <FamilyMonthlyCalendar
            kids={kids}
            allChores={chores}
            completions={completions}
            onComplete={(choreId, kidId, points) => completeChore(choreId, kidId, points)}
            onEditKid={setEditingKid}
            onSelectKid={(kid) => navigate(`/apps/chores/${kid.id}`)}
          />
        )}
      </div>

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
