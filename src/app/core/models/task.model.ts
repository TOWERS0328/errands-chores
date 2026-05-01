export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ReminderConfig {
  enabled: boolean;
  time?: string; // Formato ISO
  repeat?: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  snoozeOption?: '5m' | '1h' | 'tomorrow';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // Formato ISO
  tags: Tag[];
  photos?: string[]; // Blobs guardados en base64 o paths locales
  reminder: ReminderConfig;
  createdAt: number; // Timestamp
  completedAt?: number;
}
