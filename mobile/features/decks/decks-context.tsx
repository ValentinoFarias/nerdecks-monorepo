import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

import { MOCK_DECKS } from '@/features/decks/mock-data';
import { Deck, DeckCard } from '@/features/decks/types';

type DecksContextValue = {
  decks: Deck[];
  createDeck: (title: string) => Deck;
  getDeckById: (deckId: string) => Deck | undefined;
};

const DecksContext = createContext<DecksContextValue | undefined>(undefined);

function makeStarterCard(deckTitle: string): DeckCard {
  const baseId = Date.now().toString();
  return {
    id: `starter-${baseId}`,
    front: `What do you want to remember in ${deckTitle}?`,
    back: 'Add your real cards in the backend integration phase. This is a local prototype card.',
  };
}

export function DecksProvider({ children }: PropsWithChildren) {
  const [decks, setDecks] = useState<Deck[]>(MOCK_DECKS);

  const createDeck = useCallback((title: string) => {
    const trimmedTitle = title.trim();
    const deckId = `deck-${Date.now()}`;

    const nextDeck: Deck = {
      id: deckId,
      title: trimmedTitle,
      dueToday: 1,
      cards: [makeStarterCard(trimmedTitle)],
    };

    setDecks((current) => [nextDeck, ...current]);
    return nextDeck;
  }, []);

  const getDeckById = useCallback(
    (deckId: string) => {
      return decks.find((deck) => deck.id === deckId);
    },
    [decks],
  );

  const value = useMemo(
    () => ({
      decks,
      createDeck,
      getDeckById,
    }),
    [createDeck, decks, getDeckById],
  );

  return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>;
}

export function useDecks() {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error('useDecks must be used inside DecksProvider');
  }

  return context;
}
