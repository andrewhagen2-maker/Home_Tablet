import { useState, useEffect } from 'react';
import { usePin } from '../hooks/usePin';
import styles from './PinGate.module.css';

interface Props {
  onSuccess: () => void;
  onCancel?: () => void;
}

type State = 'entering' | 'verifying' | 'locked';

const LOCK_DURATION = 30;

export function PinGate({ onSuccess, onCancel }: Props) {
  const [digits, setDigits] = useState('');
  const [state, setState] = useState<State>('entering');
  const [failCount, setFailCount] = useState(0);
  const [lockSeconds, setLockSeconds] = useState(LOCK_DURATION);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (state !== 'locked') return;
    setLockSeconds(LOCK_DURATION);
    const interval = setInterval(() => {
      setLockSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setState('entering');
          setDigits('');
          setFailCount(0);
          return LOCK_DURATION;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const handleDigit = (d: string) => {
    if (state !== 'entering') return;
    const next = (digits + d).slice(0, 4);
    setDigits(next);
    if (next.length === 4) verify(next);
  };

  const verify = async (pin: string) => {
    setState('verifying');
    const ok = await usePin.verify(pin);
    if (ok) {
      onSuccess();
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      if (newFail >= 3) {
        setState('locked');
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setState('entering'); setDigits(''); }, 600);
      }
    }
  };

  const handleBackspace = () => {
    if (state !== 'entering') return;
    setDigits((d) => d.slice(0, -1));
  };

  const dots = Array.from({ length: 4 }, (_, i) => (
    <div key={i} className={`${styles.dot} ${i < digits.length ? styles.filled : ''}`} />
  ));

  return (
    <div className={styles.overlay}>
      <div className={`${styles.card} ${shake ? styles.shake : ''}`}>
        <h2 className={styles.title}>Parent PIN</h2>
        <div className={styles.dots}>{dots}</div>
        {state === 'locked' && (
          <p className={styles.locked}>Too many attempts. Wait {lockSeconds}s.</p>
        )}
        {state !== 'locked' && failCount > 0 && (
          <p className={styles.error}>Incorrect PIN ({3 - failCount} left)</p>
        )}
        <div className={styles.pad}>
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
            <button
              key={i}
              className={`${styles.key} ${k === '' ? styles.empty : ''}`}
              disabled={state !== 'entering' || k === ''}
              onClick={() => k === '⌫' ? handleBackspace() : k && handleDigit(k)}
            >
              {k}
            </button>
          ))}
        </div>
        {onCancel && (
          <button className={styles.cancel} onClick={onCancel}>Cancel</button>
        )}
      </div>
    </div>
  );
}
