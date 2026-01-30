
import { EmotionalState, MicroStudy } from './types';

export const EMOTIONS = [
  { state: EmotionalState.OVERWHELMED, emoji: '🌊', color: 'bg-blue-50' },
  { state: EmotionalState.GUILTY, emoji: '😔', color: 'bg-amber-50' },
  { state: EmotionalState.ANXIOUS, emoji: '🦋', color: 'bg-purple-50' },
  { state: EmotionalState.EXHAUSTED, emoji: '☕', color: 'bg-orange-50' },
  { state: EmotionalState.LONELY, emoji: '☁️', color: 'bg-slate-50' },
  { state: EmotionalState.JOYFUL, emoji: '☀️', color: 'bg-yellow-50' },
  { state: EmotionalState.INADEQUATE, emoji: '🌱', color: 'bg-emerald-50' },
];

export const MOCK_STUDIES: MicroStudy[] = [
  {
    id: '1',
    title: 'Grace for the Snappy Morning',
    verse: 'The Lord is compassionate and gracious, slow to anger, abounding in love.',
    reference: 'Psalm 103:8',
    reflection: 'We all have those mornings where patience wears thin before the first cup of coffee is finished. God isn\'t surprised by your frustration. He meets you in the kitchen chaos with a grace that doesn\'t run dry.',
    prayer: 'Father, thank You for Your endless patience with me. Help me extend that same grace to my children today.',
    action: 'When you feel the snap coming, take one deep breath and whisper "Grace."',
    category: 'Patience',
    durationMinutes: 3
  },
  {
    id: '2',
    title: 'Identity Beyond the Laundry Pile',
    verse: 'For we are God’s handiwork, created in Christ Jesus to do good works.',
    reference: 'Ephesians 2:10',
    reflection: 'It’s easy to feel like your name has been replaced by "Mom." But before you were a mother, you were His daughter. Your value isn\'t measured by the cleanliness of your floors, but by the love of your Creator.',
    prayer: 'Lord, remind me today who I am in You. Let my heart rest in my identity as Your beloved child.',
    action: 'Write "Beloved" on a sticky note and put it on your bathroom mirror.',
    category: 'Identity',
    durationMinutes: 5
  }
];
