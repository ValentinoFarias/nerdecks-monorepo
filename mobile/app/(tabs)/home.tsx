import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DeckListItem } from '@/components/prototype/deck-list-item';
import { PrototypeHeader } from '@/components/prototype/prototype-header';
import { useDecks } from '@/features/decks/decks-context';
import { useTransitionRouter } from '@/features/transition/use-transition-router';

export default function HomeScreen() {
  const transitionRouter = useTransitionRouter();
  const { decks } = useDecks();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PrototypeHeader
          onBrandPress={() => {
            void transitionRouter.push('/');
          }}
          primaryAction={{
            label: 'Landing',
            onPress: () => {
              void transitionRouter.push('/');
            },
          }}
          secondaryAction={{
            label: 'Create',
            onPress: () => {
              void transitionRouter.push('/deck/create');
            },
          }}
        />

        <View style={styles.titleWrap}>
          <Text style={styles.title}>YOUR NERDECKS</Text>
          <Text style={styles.subtitle}>Prototype mode with local mock state.</Text>
        </View>

        <View style={styles.listWrap}>
          {decks.map((deck) => (
            <DeckListItem
              key={deck.id}
              deck={deck}
              onPress={() => {
                void transitionRouter.push({
                  pathname: '/deck/[deckId]',
                  params: { deckId: deck.id },
                });
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  titleWrap: {
    marginTop: 20,
    marginBottom: 14,
  },
  title: {
    color: '#111827',
    fontSize: 31,
    lineHeight: 38,
    letterSpacing: 0.6,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 5,
    color: '#6B7280',
    fontSize: 14,
  },
  listWrap: {
    gap: 12,
  },
});
