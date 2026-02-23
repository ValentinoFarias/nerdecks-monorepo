import { Pressable, StyleSheet, Text, View } from 'react-native';

type RevealCardProps = {
  front: string;
  back: string;
  revealed: boolean;
  onToggleReveal: () => void;
};

export function RevealCard({ front, back, revealed, onToggleReveal }: RevealCardProps) {
  return (
    <Pressable onPress={onToggleReveal} style={styles.card}>
      <Text style={styles.label}>{revealed ? 'Back' : 'Front'}</Text>
      <View style={styles.contentWrap}>
        <Text style={styles.content}>{revealed ? back : front}</Text>
      </View>
      <Text style={styles.hint}>{revealed ? 'Tap card to show front' : 'Tap card to reveal answer'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    minHeight: 230,
    paddingVertical: 18,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
    gap: 14,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.45,
    color: '#6B7280',
    fontWeight: '700',
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    color: '#111827',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
  },
});
