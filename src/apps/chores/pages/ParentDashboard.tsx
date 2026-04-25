import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKids } from '../../../hooks/useKids';
import { useChores } from '../../../hooks/useChores';
import { useRewards } from '../../../hooks/useRewards';
import { storage } from '../../../store/storage';
import { usePin } from '../../../hooks/usePin';
import type { Kid, Chore, Reward } from '../../../store/storage';
import styles from './ParentDashboard.module.css';

type Tab = 'kids' | 'chores' | 'rewards' | 'settings';

const AVATAR_OPTIONS = ['🦊','🐸','🦋','🐼','🦁','🐯','🐨','🐙','🦄','🐲','🐬','🦅'];
const KID_COLORS = ['#6EE7B7','#93C5FD','#FCA5A5','#FCD34D','#C4B5FD','#F9A8D4','#6EE7B7','#A7F3D0'];
const POINT_OPTIONS = [1,2,5,10,20,50];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function ParentDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('kids');
  const { kids, addKid, updateKid, deleteKid } = useKids();
  const { chores, addChore, updateChore, deleteChore } = useChores();
  const { rewards, addReward, updateReward, deleteReward, approveRedemption, rejectRedemption, getPendingRedemptions } = useRewards();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Parent Dashboard</h1>
        <button className={styles.closeBtn} onClick={() => navigate('/apps/chores')}>✕</button>
      </header>
      <nav className={styles.nav}>
        {(['kids','chores','rewards','settings'] as Tab[]).map((t) => (
          <button key={t} className={`${styles.navBtn} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
            {t === 'kids' ? '👧 Kids' : t === 'chores' ? '✅ Chores' : t === 'rewards' ? '🎁 Rewards' : '⚙️ Settings'}
          </button>
        ))}
      </nav>
      <div className={styles.content}>
        {tab === 'kids' && <KidsTab kids={kids} onAdd={addKid} onUpdate={updateKid} onDelete={deleteKid} />}
        {tab === 'chores' && <ChoresTab kids={kids} chores={chores} onAdd={addChore} onUpdate={updateChore} onDelete={deleteChore} />}
        {tab === 'rewards' && <RewardsTab rewards={rewards} redemptions={getPendingRedemptions()} kids={kids} onAdd={addReward} onUpdate={updateReward} onDelete={deleteReward} onApprove={approveRedemption} onReject={rejectRedemption} />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

// --- Kids Tab ---
function KidsTab({ kids, onAdd, onUpdate, onDelete }: { kids: Kid[]; onAdd: (d: Omit<Kid,'id'|'createdAt'>) => void; onUpdate: (id: string, d: Partial<Kid>) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Kid | null>(null);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className={styles.listHeader}>
        <h2>Kids</h2>
        <button className={styles.addBtn} onClick={() => setAdding(true)}>+ Add Kid</button>
      </div>
      {kids.map((kid) => (
        <div key={kid.id} className={styles.listItem}>
          <span className={styles.itemIcon}>{kid.avatarEmoji}</span>
          <span className={styles.itemTitle}>{kid.name}</span>
          <button className={styles.editBtn} onClick={() => setEditing(kid)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => { if (confirm(`Delete ${kid.name}?`)) onDelete(kid.id); }}>✕</button>
        </div>
      ))}
      {(adding || editing) && (
        <KidForm
          initial={editing ?? undefined}
          onSave={(data) => { editing ? onUpdate(editing.id, data) : onAdd(data); setEditing(null); setAdding(false); }}
          onCancel={() => { setEditing(null); setAdding(false); }}
        />
      )}
    </div>
  );
}

function KidForm({ initial, onSave, onCancel }: { initial?: Kid; onSave: (d: Omit<Kid,'id'|'createdAt'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [avatar, setAvatar] = useState(initial?.avatarEmoji ?? '🦊');
  const [color, setColor] = useState(initial?.color ?? KID_COLORS[0]);

  return (
    <div className={styles.formCard}>
      <h3>{initial ? 'Edit Kid' : 'Add Kid'}</h3>
      <label>Name</label>
      <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Kid's name" />
      <label>Avatar</label>
      <div className={styles.emojiGrid}>
        {AVATAR_OPTIONS.map((e) => (
          <button key={e} className={`${styles.emojiBtn} ${avatar === e ? styles.emojiSelected : ''}`} onClick={() => setAvatar(e)}>{e}</button>
        ))}
      </div>
      <label>Color</label>
      <div className={styles.colorRow}>
        {KID_COLORS.map((c) => (
          <button key={c} className={`${styles.colorBtn} ${color === c ? styles.colorSelected : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
        ))}
      </div>
      <div className={styles.formActions}>
        <button className={styles.saveBtn} onClick={() => name.trim() && onSave({ name: name.trim(), avatarEmoji: avatar, color })}>Save</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// --- Chores Tab ---
function ChoresTab({ kids, chores, onAdd, onUpdate, onDelete }: { kids: Kid[]; chores: Chore[]; onAdd: (d: Omit<Chore,'id'|'createdAt'|'active'>) => void; onUpdate: (id: string, d: Partial<Chore>) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<Chore | null>(null);
  const [adding, setAdding] = useState(false);
  const active = chores.filter((c) => c.active);

  return (
    <div>
      <div className={styles.listHeader}>
        <h2>Chores</h2>
        <button className={styles.addBtn} onClick={() => setAdding(true)}>+ Add Chore</button>
      </div>
      {active.map((chore) => (
        <div key={chore.id} className={styles.listItem}>
          <div className={styles.itemInfo}>
            <span className={styles.itemTitle}>{chore.title}</span>
            <span className={styles.itemSub}>{chore.recurrence} · {chore.points}⭐ · {chore.assignedKidIds.length === 0 ? 'All' : chore.assignedKidIds.map((id) => kids.find((k) => k.id === id)?.name ?? id).join(', ')}</span>
          </div>
          <button className={styles.editBtn} onClick={() => setEditing(chore)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => { if (confirm(`Delete "${chore.title}"?`)) onDelete(chore.id); }}>✕</button>
        </div>
      ))}
      {(adding || editing) && (
        <ChoreForm
          initial={editing ?? undefined}
          kids={kids}
          onSave={(data) => { editing ? onUpdate(editing.id, data) : onAdd(data); setEditing(null); setAdding(false); }}
          onCancel={() => { setEditing(null); setAdding(false); }}
        />
      )}
    </div>
  );
}

function ChoreForm({ initial, kids, onSave, onCancel }: { initial?: Chore; kids: Kid[]; onSave: (d: Omit<Chore,'id'|'createdAt'|'active'>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [desc, setDesc] = useState(initial?.description ?? '');
  const [points, setPoints] = useState(initial?.points ?? 5);
  const [recurrence, setRecurrence] = useState<Chore['recurrence']>(initial?.recurrence ?? 'daily');
  const [weekdays, setWeekdays] = useState<number[]>(initial?.weekdays ?? [1,2,3,4,5]);
  const [monthDay, setMonthDay] = useState(initial?.monthDay ?? 1);
  const [assignedKidIds, setAssignedKidIds] = useState<string[]>(initial?.assignedKidIds ?? []);

  const toggleDay = (d: number) => setWeekdays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  const toggleKid = (id: string) => setAssignedKidIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const save = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: desc.trim() || undefined, points, recurrence, weekdays: recurrence === 'weekly' ? weekdays : undefined, monthDay: recurrence === 'monthly' ? monthDay : undefined, assignedKidIds });
  };

  return (
    <div className={styles.formCard}>
      <h3>{initial ? 'Edit Chore' : 'Add Chore'}</h3>
      <label>Title</label>
      <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Make your bed" />
      <label>Description (optional)</label>
      <input className={styles.input} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Details..." />
      <label>Points</label>
      <div className={styles.pointsRow}>
        {POINT_OPTIONS.map((p) => (
          <button key={p} className={`${styles.pointsBtn} ${points === p ? styles.pointsSelected : ''}`} onClick={() => setPoints(p)}>{p}⭐</button>
        ))}
      </div>
      <label>Recurrence</label>
      <select className={styles.select} value={recurrence} onChange={(e) => setRecurrence(e.target.value as Chore['recurrence'])}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly (specific days)</option>
        <option value="monthly">Monthly (specific day)</option>
        <option value="once">One-time</option>
      </select>
      {recurrence === 'weekly' && (
        <div className={styles.daysRow}>
          {DAYS.map((d, i) => (
            <button key={d} className={`${styles.dayBtn} ${weekdays.includes(i) ? styles.daySelected : ''}`} onClick={() => toggleDay(i)}>{d}</button>
          ))}
        </div>
      )}
      {recurrence === 'monthly' && (
        <input className={styles.input} type="number" min={1} max={31} value={monthDay} onChange={(e) => setMonthDay(Number(e.target.value))} />
      )}
      <label>Assign to</label>
      <div className={styles.kidsRow}>
        <button className={`${styles.kidChip} ${assignedKidIds.length === 0 ? styles.kidSelected : ''}`} onClick={() => setAssignedKidIds([])}>Everyone</button>
        {kids.map((k) => (
          <button key={k.id} className={`${styles.kidChip} ${assignedKidIds.includes(k.id) ? styles.kidSelected : ''}`} onClick={() => { if (assignedKidIds.length === 0) setAssignedKidIds([k.id]); else toggleKid(k.id); }}>
            {k.avatarEmoji} {k.name}
          </button>
        ))}
      </div>
      <div className={styles.formActions}>
        <button className={styles.saveBtn} onClick={save}>Save</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// --- Rewards Tab ---
function RewardsTab({ rewards, redemptions, kids, onAdd, onUpdate, onDelete, onApprove, onReject }: {
  rewards: Reward[]; redemptions: ReturnType<typeof useRewards>['redemptions']; kids: Kid[];
  onAdd: (d: Omit<Reward,'id'|'active'>) => void; onUpdate: (id: string, d: Partial<Reward>) => void;
  onDelete: (id: string) => void; onApprove: (id: string) => void; onReject: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Reward | null>(null);
  const active = rewards.filter((r) => r.active);

  return (
    <div>
      {redemptions.length > 0 && (
        <>
          <div className={styles.listHeader}><h2>Pending Redemptions</h2></div>
          {redemptions.map((r) => {
            const reward = rewards.find((rw) => rw.id === r.rewardId);
            const kid = kids.find((k) => k.id === r.kidId);
            return (
              <div key={r.id} className={styles.redemptionItem}>
                <span>{kid?.avatarEmoji} {kid?.name} wants "{reward?.title}" ({r.pointsSpent}⭐)</span>
                <button className={styles.approveBtn} onClick={() => onApprove(r.id)}>✓ Approve</button>
                <button className={styles.deleteBtn} onClick={() => onReject(r.id)}>✕ Reject</button>
              </div>
            );
          })}
        </>
      )}
      <div className={styles.listHeader}>
        <h2>Rewards</h2>
        <button className={styles.addBtn} onClick={() => setAdding(true)}>+ Add Reward</button>
      </div>
      {active.map((r) => (
        <div key={r.id} className={styles.listItem}>
          <span className={styles.itemIcon}>{r.imageEmoji ?? '🎁'}</span>
          <div className={styles.itemInfo}>
            <span className={styles.itemTitle}>{r.title}</span>
            <span className={styles.itemSub}>{r.pointCost}⭐</span>
          </div>
          <button className={styles.editBtn} onClick={() => setEditing(r)}>Edit</button>
          <button className={styles.deleteBtn} onClick={() => { if (confirm(`Delete "${r.title}"?`)) onDelete(r.id); }}>✕</button>
        </div>
      ))}
      {(adding || editing) && (
        <RewardForm
          initial={editing ?? undefined}
          onSave={(data) => { editing ? onUpdate(editing.id, data) : onAdd(data); setEditing(null); setAdding(false); }}
          onCancel={() => { setEditing(null); setAdding(false); }}
        />
      )}
    </div>
  );
}

function RewardForm({ initial, onSave, onCancel }: { initial?: Reward; onSave: (d: Omit<Reward,'id'|'active'>) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [desc, setDesc] = useState(initial?.description ?? '');
  const [cost, setCost] = useState(initial?.pointCost ?? 20);
  const [emoji, setEmoji] = useState(initial?.imageEmoji ?? '🎁');
  return (
    <div className={styles.formCard}>
      <h3>{initial ? 'Edit Reward' : 'Add Reward'}</h3>
      <label>Title</label>
      <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 30 min screen time" />
      <label>Description (optional)</label>
      <input className={styles.input} value={desc} onChange={(e) => setDesc(e.target.value)} />
      <label>Icon emoji</label>
      <input className={styles.input} value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2} style={{ width: 80, textAlign: 'center', fontSize: 24 }} />
      <label>Point cost</label>
      <input className={styles.input} type="number" min={1} value={cost} onChange={(e) => setCost(Number(e.target.value))} />
      <div className={styles.formActions}>
        <button className={styles.saveBtn} onClick={() => title.trim() && onSave({ title: title.trim(), description: desc.trim() || undefined, pointCost: cost, imageEmoji: emoji })}>Save</button>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// --- Settings Tab ---
function SettingsTab() {
  const [name, setName] = useState(storage.getSettings()?.familyName ?? '');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [msg, setMsg] = useState('');

  const saveName = () => {
    const s = storage.getSettings();
    if (s) { storage.setSettings({ ...s, familyName: name.trim() || s.familyName }); setMsg('Family name saved!'); }
  };

  const savePin = async () => {
    if (newPin.length !== 4) { setMsg('PIN must be 4 digits.'); return; }
    if (newPin !== confirmPin) { setMsg('PINs do not match.'); return; }
    await usePin.setPin(newPin);
    setNewPin(''); setConfirmPin(''); setMsg('PIN updated!');
  };

  return (
    <div>
      <h2>Settings</h2>
      <label className={styles.label}>Family Name</label>
      <div className={styles.row}>
        <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        <button className={styles.saveBtn} onClick={saveName}>Save</button>
      </div>
      <h3>Change PIN</h3>
      <label className={styles.label}>New PIN (4 digits)</label>
      <input className={styles.input} type="password" inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g,'').slice(0,4))} />
      <label className={styles.label}>Confirm New PIN</label>
      <input className={styles.input} type="password" inputMode="numeric" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g,'').slice(0,4))} />
      <button className={styles.saveBtn} style={{ marginTop: 8 }} onClick={savePin}>Update PIN</button>
      {msg && <p className={styles.msg}>{msg}</p>}
    </div>
  );
}
