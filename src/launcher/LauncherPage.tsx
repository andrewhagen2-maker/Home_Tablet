import { useState } from 'react';
import { APPS } from './apps-registry';
import { AppTile } from './AppTile';
import { PinGate } from '../components/PinGate';
import { storage } from '../store/storage';
import styles from './LauncherPage.module.css';

export function LauncherPage() {
  const [showPin, setShowPin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const familyName = storage.getSettings()?.familyName ?? 'Our Family';

  const handleSettingsSuccess = () => {
    setShowPin(false);
    setShowSettings(true);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.title}>🏠 {familyName}</span>
        <button className={styles.gear} onClick={() => setShowPin(true)} aria-label="Parent settings">
          ⚙️
        </button>
      </header>
      <main className={styles.grid}>
        {APPS.map((app) => (
          <AppTile key={app.id} app={app} />
        ))}
      </main>
      {showPin && (
        <PinGate onSuccess={handleSettingsSuccess} onCancel={() => setShowPin(false)} />
      )}
      {showSettings && (
        <LauncherSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

function LauncherSettings({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState(storage.getSettings()?.familyName ?? '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    const s = storage.getSettings();
    if (s) { storage.setSettings({ ...s, familyName: name.trim() || s.familyName }); }
    setSaved(true);
    setTimeout(onClose, 800);
  };

  const factoryReset = () => {
    if (window.confirm('Reset parent settings? Chore data will be kept.')) {
      storage.clearSettings();
      window.location.reload();
    }
  };

  return (
    <div className={styles.settingsOverlay}>
      <div className={styles.settingsCard}>
        <h2>Settings</h2>
        <label className={styles.label}>Family Name</label>
        <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        {saved && <p className={styles.saved}>Saved!</p>}
        <button className={styles.saveBtn} onClick={save}>Save</button>
        <button className={styles.resetBtn} onClick={factoryReset}>Factory Reset</button>
        <button className={styles.closeBtn} onClick={onClose}>✕ Close</button>
      </div>
    </div>
  );
}
