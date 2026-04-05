import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {theme} from '../theme/tokens';

export const QuantityControl = ({
  value,
  onDecrease,
  onIncrease,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onDecrease} style={styles.button}>
        <Text style={styles.symbol}>-</Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable onPress={onIncrease} style={styles.button}>
        <Text style={styles.symbol}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.elevated,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  value: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
