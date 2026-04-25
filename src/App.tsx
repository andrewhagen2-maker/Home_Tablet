import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { SetupWizard } from './pages/SetupWizard';
import { storage } from './store/storage';

export default function App() {
  const [ready, setReady] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    const s = storage.getSettings();
    setNeedsSetup(!s?.setupComplete);
    setReady(true);
  }, []);

  if (!ready) return null;
  if (needsSetup) return <SetupWizard onComplete={() => setNeedsSetup(false)} />;
  return <RouterProvider router={router} />;
}
