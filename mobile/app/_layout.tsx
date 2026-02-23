import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { DecksProvider } from '@/features/decks/decks-context';
import { PageTransitionProvider } from '@/features/transition/page-transition-context';

export default function RootLayout() {
  return (
    <DecksProvider>
      <PageTransitionProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'none',
            contentStyle: { backgroundColor: '#F8F9FA' },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </PageTransitionProvider>
    </DecksProvider>
  );
}
