import { Deck } from '@/features/decks/types';

export const MOCK_DECKS: Deck[] = [
  {
    id: 'history-101',
    title: 'History 101',
    dueToday: 2,
    cards: [
      {
        id: 'history-1',
        front: 'Who discovered the forgetting curve?',
        back: 'Hermann Ebbinghaus described the forgetting curve in the 1880s.',
      },
      {
        id: 'history-2',
        front: 'Why does spaced repetition work?',
        back: 'It schedules reviews close to forgetting, which strengthens memory recall.',
      },
      {
        id: 'history-3',
        front: 'What is the goal of a review session?',
        back: 'Reinforce active recall in short, focused cycles.',
      },
    ],
  },
  {
    id: 'spanish-basics',
    title: 'Spanish Basics',
    dueToday: 1,
    cards: [
      {
        id: 'spanish-1',
        front: 'How do you say "hello" in Spanish?',
        back: 'Hola.',
      },
      {
        id: 'spanish-2',
        front: 'How do you say "thank you" in Spanish?',
        back: 'Gracias.',
      },
    ],
  },
  {
    id: 'bio-ch1',
    title: 'Biology - Chapter 1',
    dueToday: 0,
    cards: [
      {
        id: 'bio-1',
        front: 'What is the basic unit of life?',
        back: 'The cell is the basic structural and functional unit of life.',
      },
    ],
  },
];
