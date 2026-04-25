import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  colors?: string[];
}

export function ConfettiCelebration({ colors = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff6bff'] }: Props) {
  useEffect(() => {
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return null;
}
