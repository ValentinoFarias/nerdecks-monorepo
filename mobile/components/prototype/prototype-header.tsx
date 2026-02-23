import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type HeaderAction = {
  label: string;
  onPress: () => void;
};

type PrototypeHeaderProps = {
  primaryAction?: HeaderAction;
  secondaryAction?: HeaderAction;
  onBrandPress: () => void;
};

export function PrototypeHeader({ primaryAction, secondaryAction, onBrandPress }: PrototypeHeaderProps) {
  return (
    <View style={styles.shell}>
      <Pressable onPress={onBrandPress} style={styles.brand}>
        <Image source={require('@/assets/images/newlogonerdecks.png')} style={styles.brandLogo} resizeMode="contain" />
      </Pressable>

      <View style={styles.actions}>
        {primaryAction ? (
          <Pressable onPress={primaryAction.onPress} style={[styles.actionButton, styles.primaryAction]}>
            <Text style={[styles.actionLabel, styles.primaryActionLabel]}>{primaryAction.label}</Text>
          </Pressable>
        ) : null}

        {secondaryAction ? (
          <Pressable onPress={secondaryAction.onPress} style={[styles.actionButton, styles.secondaryAction]}>
            <Text style={[styles.actionLabel, styles.secondaryActionLabel]}>{secondaryAction.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  brand: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  brandLogo: {
    width: 34,
    height: 34,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    borderRadius: 999,
    minHeight: 40,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primaryAction: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderColor: '#111827',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.25,
    textTransform: 'uppercase',
  },
  primaryActionLabel: {
    color: '#FFFFFF',
  },
  secondaryActionLabel: {
    color: '#111827',
  },
});
