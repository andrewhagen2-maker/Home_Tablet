export interface AppMeta {
  id: string;
  label: string;
  icon: string;
  route: string;
  color: string;
}

export const APPS: AppMeta[] = [
  { id: 'chores', label: 'Chore Chart', icon: '✅', route: '/apps/chores', color: '#6EE7B7' },
];
