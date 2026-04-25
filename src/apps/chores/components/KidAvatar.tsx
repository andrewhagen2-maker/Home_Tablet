import styles from './KidAvatar.module.css';

interface Props {
  emoji: string;
  name: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function KidAvatar({ emoji, name, color, size = 'md', onClick }: Props) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={`${styles.avatar} ${styles[size]}`}
      style={{ '--kid-color': color } as React.CSSProperties}
      onClick={onClick}
    >
      <span className={styles.emoji}>{emoji}</span>
      <span className={styles.name}>{name}</span>
    </Tag>
  );
}
