import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Deck } from '@/features/decks/types';

type DeckListItemProps = {
  deck: Deck;
  onPress: () => void;
};

export function DeckListItem({ deck, onPress }: DeckListItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.title}>{deck.title}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Due today</Text>
          <Text style={[styles.badgeValue, deck.dueToday > 0 ? styles.badgeValueAttention : null]}>
            {deck.dueToday}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Total cards</Text>
          <Text style={styles.badgeValue}>{deck.cards.length}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: '#111827',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chevron: {
    color: '#6B7280',
    fontSize: 24,
    lineHeight: 24,
    marginLeft: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
  },
  badgeLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 2,
  },
  badgeValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  badgeValueAttention: {
    color: '#B91C1C',
  },
});
