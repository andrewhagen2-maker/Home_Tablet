import { useState } from 'react';
import { storage } from '../store/storage';
import { usePin } from '../hooks/usePin';
import styles from './SetupWizard.module.css';

interface Props {
  onComplete: () => void;
}

export function SetupWizard({ onComplete }: Props) {
  const [step, setStep] = useState<'name' | 'pin' | 'confirm'>('name');
  const [familyName, setFamilyName] = useState('');
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleNameNext = () => {
    if (!familyName.trim()) { setError('Please enter a family name.'); return; }
    setError('');
    setStep('pin');
  };

  const handlePinNext = () => {
    if (pin.length !== 4) { setError('PIN must be exactly 4 digits.'); return; }
    setError('');
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (confirm !== pin) { setError('PINs do not match. Try again.'); setConfirm(''); return; }
    await usePin.setPin(pin);
    // setPin already wrote pinHash/pinSalt — just add familyName and mark setupComplete
    const s = storage.getSettings()!;
    storage.setSettings({ ...s, familyName: familyName.trim(), setupComplete: true });
    onComplete();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.emoji}>🏠</div>
        {step === 'name' && (
          <>
            <h1>Welcome!</h1>
            <p>Let's set up your family tablet.</p>
            <input
              className={styles.input}
              placeholder="Family name (e.g. The Smiths)"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} onClick={handleNameNext}>Next →</button>
          </>
        )}
        {step === 'pin' && (
          <>
            <h1>Create a Parent PIN</h1>
            <p>This 4-digit PIN protects parent settings.</p>
            <input
              className={styles.input}
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={(e) => e.key === 'Enter' && handlePinNext()}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} onClick={handlePinNext}>Next →</button>
          </>
        )}
        {step === 'confirm' && (
          <>
            <h1>Confirm PIN</h1>
            <p>Enter the PIN again to confirm.</p>
            <input
              className={styles.input}
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Confirm PIN"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              autoFocus
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} onClick={handleConfirm}>Let's Go! 🎉</button>
          </>
        )}
      </div>
    </div>
  );
}
