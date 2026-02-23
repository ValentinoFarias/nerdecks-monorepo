export type DeckCard = {
  id: string;
  front: string;
  back: string;
};

export type Deck = {
  id: string;
  title: string;
  dueToday: number;
  cards: DeckCard[];
};
