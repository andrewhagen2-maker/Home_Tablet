import { storage } from '../store/storage';

async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + pin);
  const buf = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function randomSalt(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export const usePin = {
  hasPin(): boolean {
    const s = storage.getSettings();
    return !!s?.pinHash;
  },

  async setPin(pin: string): Promise<void> {
    const settings = storage.getSettings();
    const salt = randomSalt();
    const hash = await hashPin(pin, salt);
    storage.setSettings({
      familyName: settings?.familyName ?? 'Our Family',
      setupComplete: settings?.setupComplete ?? false,
      pinHash: hash,
      pinSalt: salt,
    });
  },

  async verify(pin: string): Promise<boolean> {
    const settings = storage.getSettings();
    if (!settings?.pinHash || !settings?.pinSalt) return false;
    const hash = await hashPin(pin, settings.pinSalt);
    return hash === settings.pinHash;
  },
};
