
export interface MicroStudy {
  id: string;
  title: string;
  verse: string;
  reference: string;
  reflection: string;
  prayer: string;
  action: string;
  category: string;
  durationMinutes: number;
}

export interface PrayerRequest {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  prayersCount: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'reflection' | 'prayer' | 'note';
  linkedStudyId?: string;
}

export enum EmotionalState {
  OVERWHELMED = 'Overwhelmed',
  GUILTY = 'Guilty',
  ANXIOUS = 'Anxious',
  EXHAUSTED = 'Exhausted',
  LONELY = 'Lonely',
  JOYFUL = 'Joyful',
  DISTANT = 'Distant from God',
  INADEQUATE = 'Not Enough'
}

export interface UserProfile {
  name: string;
  daysActive: number;
  lastActiveDate: string;
  savedStudies: string[]; // IDs
}
