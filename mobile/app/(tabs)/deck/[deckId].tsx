import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { PrototypeHeader } from '@/components/prototype/prototype-header';
import { RevealCard } from '@/components/prototype/reveal-card';
import { useDecks } from '@/features/decks/decks-context';
import { useTransitionRouter } from '@/features/transition/use-transition-router';

export default function DeckDetailScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const transitionRouter = useTransitionRouter();
  const { getDeckById } = useDecks();

  const deck = useMemo(() => {
    if (!deckId) {
      return undefined;
    }
    return getDeckById(deckId);
  }, [deckId, getDeckById]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  if (!deck) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <PrototypeHeader
            onBrandPress={() => {
              void transitionRouter.push('/');
            }}
            primaryAction={{
              label: 'Home',
              onPress: () => {
                void transitionRouter.push('/home');
              },
            }}
          />

          <View style={styles.missingWrap}>
            <Text style={styles.missingTitle}>Deck not found</Text>
            <Text style={styles.missingText}>This deck may have been removed from local state.</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const card = deck.cards[currentIndex];
  const hasCards = deck.cards.length > 0;

  const onNextCard = () => {
    if (!hasCards) {
      return;
    }

    setCurrentIndex((index) => {
      const nextIndex = index + 1;
      if (nextIndex >= deck.cards.length) {
        return 0;
      }
      return nextIndex;
    });
    setRevealed(false);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <PrototypeHeader
          onBrandPress={() => {
            void transitionRouter.push('/');
          }}
          primaryAction={{
            label: 'Home',
            onPress: () => {
              void transitionRouter.push('/home');
            },
          }}
          secondaryAction={{
            label: 'New Deck',
            onPress: () => {
              void transitionRouter.push('/deck/create');
            },
          }}
        />

        <View style={styles.headerBlock}>
          <Text style={styles.kicker}>Review Session</Text>
          <Text style={styles.deckTitle}>{deck.title}</Text>
          <Text style={styles.deckMeta}>
            Card {hasCards ? currentIndex + 1 : 0} / {deck.cards.length}
          </Text>
        </View>

        {hasCards ? (
          <RevealCard
            front={card.front}
            back={card.back}
            revealed={revealed}
            onToggleReveal={() => setRevealed((prev) => !prev)}
          />
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No cards in this deck yet.</Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => setRevealed((prev) => !prev)}
            style={[styles.actionButton, styles.secondaryButton]}
            disabled={!hasCards}>
            <Text style={styles.secondaryLabel}>{revealed ? 'Show Front' : 'Show Answer'}</Text>
          </Pressable>

          <Pressable
            onPress={onNextCard}
            style={[styles.actionButton, styles.primaryButton]}
            disabled={!hasCards}>
            <Text style={styles.primaryLabel}>Next Card</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 16,
  },
  headerBlock: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  kicker: {
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  deckTitle: {
    color: '#111827',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  deckMeta: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  emptyCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111827',
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  secondaryLabel: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.25,
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.25,
  },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 8,
  },
  missingTitle: {
    color: '#111827',
    fontSize: 24,
    fontWeight: '800',
  },
  missingText: {
    color: '#6B7280',
    textAlign: 'center',
  },
});
