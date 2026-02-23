import { Image } from 'expo-image';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useTransitionRouter } from '@/features/transition/use-transition-router';

export default function LandingScreen() {
  const transitionRouter = useTransitionRouter();

  const goHome = async () => {
    await transitionRouter.push('/home');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.main}>
        <Pressable onPress={goHome} style={styles.logoButton}>
          <Image source={require('@/assets/images/newlogonerdecks.png')} style={styles.logo} contentFit="contain" />
        </Pressable>

        <Pressable onPress={goHome}>
          <Text style={styles.title}>NERDECKS</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© NerDecks</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoButton: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 170,
    height: 170,
  },
  title: {
    marginTop: 18,
    color: '#000000',
    fontSize: 44,
    letterSpacing: 1,
    fontWeight: '800',
  },
  footer: {
    paddingBottom: 22,
  },
  footerText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 13,
  },
});
