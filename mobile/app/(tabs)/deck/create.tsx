import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrototypeHeader } from '@/components/prototype/prototype-header';
import { useDecks } from '@/features/decks/decks-context';
import { useTransitionRouter } from '@/features/transition/use-transition-router';

export default function CreateDeckScreen() {
  const transitionRouter = useTransitionRouter();
  const { createDeck } = useDecks();
  const [title, setTitle] = useState('');

  const titleTrimmed = title.trim();

  const handleCreate = async () => {
    if (!titleTrimmed) {
      return;
    }

    const nextDeck = createDeck(titleTrimmed);
    await transitionRouter.replace({
      pathname: '/deck/[deckId]',
      params: { deckId: nextDeck.id },
    });
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
            label: 'Cancel',
            onPress: () => {
              void transitionRouter.back();
            },
          }}
        />

        <View style={styles.body}>
          <Text style={styles.title}>CREATE A NERDECK</Text>
          <Text style={styles.subtitle}>Local prototype only. No backend call yet.</Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>Deck name</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              placeholder="e.g. Biology - Chapter 1"
              placeholderTextColor="#9CA3AF"
              maxLength={70}
              autoCapitalize="sentences"
            />

            <Pressable
              onPress={handleCreate}
              style={[styles.submitButton, !titleTrimmed ? styles.submitButtonDisabled : null]}
              disabled={!titleTrimmed}>
              <Text style={styles.submitLabel}>Create Deck</Text>
            </Pressable>
          </View>
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
    gap: 20,
  },
  body: {
    gap: 14,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 14,
  },
  formCard: {
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    gap: 12,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#000000',
    borderRadius: 12,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.35,
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
