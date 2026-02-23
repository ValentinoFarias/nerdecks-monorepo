import { Animated, Easing, StyleSheet, View } from 'react-native';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type PageTransitionContextValue = {
  runWithTransition: (action: () => void | Promise<void>) => Promise<void>;
};

const BLOCK_COUNT = 5;
const STAGGER_MS = 75;
const BLOCK_DURATION_MS = 220;

const PageTransitionContext = createContext<PageTransitionContextValue | undefined>(undefined);

function createValues() {
  return Array.from({ length: BLOCK_COUNT }, () => new Animated.Value(0));
}

function runAnimation(animation: Animated.CompositeAnimation) {
  return new Promise<void>((resolve) => {
    animation.start(() => resolve());
  });
}

function makeStagger(values: Animated.Value[], toValue: number, direction: 'start' | 'end') {
  const ordered = direction === 'end' ? [...values].reverse() : values;

  return Animated.stagger(
    STAGGER_MS,
    ordered.map((value) =>
      Animated.timing(value, {
        toValue,
        duration: BLOCK_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ),
  );
}

export function PageTransitionProvider({ children }: PropsWithChildren) {
  const rowOneValuesRef = useRef(createValues());
  const rowTwoValuesRef = useRef(createValues());
  const runningRef = useRef(false);
  const [visible, setVisible] = useState(false);

  const resetAll = useCallback((nextValue: number) => {
    [...rowOneValuesRef.current, ...rowTwoValuesRef.current].forEach((value) => value.setValue(nextValue));
  }, []);

  const playCover = useCallback(async () => {
    const rowOne = makeStagger(rowOneValuesRef.current, 1, 'end');
    const rowTwo = makeStagger(rowTwoValuesRef.current, 1, 'end');
    await runAnimation(Animated.parallel([rowOne, rowTwo]));
  }, []);

  const playReveal = useCallback(async () => {
    const rowOne = makeStagger(rowOneValuesRef.current, 0, 'start');
    const rowTwo = makeStagger(rowTwoValuesRef.current, 0, 'start');
    await runAnimation(Animated.parallel([rowOne, rowTwo]));
  }, []);

  const runWithTransition = useCallback(
    async (action: () => void | Promise<void>) => {
      if (runningRef.current) {
        await Promise.resolve(action());
        return;
      }

      runningRef.current = true;
      setVisible(true);
      resetAll(0);

      try {
        await playCover();
        await Promise.resolve(action());
        await playReveal();
      } finally {
        setVisible(false);
        runningRef.current = false;
      }
    },
    [playCover, playReveal, resetAll],
  );

  const value = useMemo(
    () => ({
      runWithTransition,
    }),
    [runWithTransition],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      {visible ? (
        <View pointerEvents="none" style={styles.overlay}>
          <View style={styles.row}>
            {rowOneValuesRef.current.map((value, index) => (
              <Animated.View
                key={`top-${index}`}
                style={[
                  styles.block,
                  styles.rowTop,
                  {
                    transform: [{ scaleY: value }],
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.row}>
            {rowTwoValuesRef.current.map((value, index) => (
              <Animated.View
                key={`bottom-${index}`}
                style={[
                  styles.block,
                  styles.rowBottom,
                  {
                    transform: [{ scaleY: value }],
                  },
                ]}
              />
            ))}
          </View>
        </View>
      ) : null}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used inside PageTransitionProvider');
  }

  return context;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  block: {
    flex: 1,
    backgroundColor: '#000000',
  },
  rowTop: {
    transformOrigin: 'top',
  },
  rowBottom: {
    transformOrigin: 'bottom',
  },
});
