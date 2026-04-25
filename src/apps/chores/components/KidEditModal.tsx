import { useState } from 'react';
import type { Kid } from '../../../store/storage';
import styles from './KidEditModal.module.css';

const AVATAR_OPTIONS = ['🦊','🐸','🦋','🐼','🦁','🐯','🐨','🐙','🦄','🐲','🐬','🦅'];
const KID_COLORS = ['#6EE7B7','#93C5FD','#FCA5A5','#FCD34D','#C4B5FD','#F9A8D4','#86EFAC','#A7F3D0'];

interface Props {
  kid: Kid;
  onSave: (data: Partial<Kid>) => void;
  onCancel: () => void;
}

export function KidEditModal({ kid, onSave, onCancel }: Props) {
  const [name, setName] = useState(kid.name);
  const [avatar, setAvatar] = useState(kid.avatarEmoji);
  const [color, setColor] = useState(kid.color);

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Edit Your Profile ✏️</h3>
        <label className={styles.label}>Name</label>
        <input
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
        />
        <label className={styles.label}>Avatar</label>
        <div className={styles.emojiGrid}>
          {AVATAR_OPTIONS.map((e) => (
            <button
              key={e}
              className={`${styles.emojiBtn} ${avatar === e ? styles.emojiSelected : ''}`}
              onClick={() => setAvatar(e)}
            >{e}</button>
          ))}
        </div>
        <label className={styles.label}>Color</label>
        <div className={styles.colorRow}>
          {KID_COLORS.map((c) => (
            <button
              key={c}
              className={`${styles.colorBtn} ${color === c ? styles.colorSelected : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={() => name.trim() && onSave({ name: name.trim(), avatarEmoji: avatar, color })}
          >Save</button>
          <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
