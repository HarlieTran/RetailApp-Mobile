import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {QuantityControl} from '../components/QuantityControl';
import {useRetailApp} from '../context/AppContext';
import {RootStackParamList} from '../navigation/types';
import {theme} from '../theme/tokens';
import {formatCurrency} from '../utils/formatters';

export const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {cartItems, subtotal, updateCartQuantity} = useRetailApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* FlatList for cart items */}
      <FlatList
        contentContainerStyle={styles.content}
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your bag is still empty.</Text>
            <Text style={styles.emptyCopy}>
              Explore the collection and add pieces for checkout.
            </Text>
          </View>
        }
        ListFooterComponent={
          cartItems.length > 0 ? (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>
              <Pressable
                onPress={() => navigation.navigate('Checkout')}
                style={styles.checkoutButton}>
                <Text style={styles.checkoutLabel}>Proceed to checkout</Text>
              </Pressable>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Bag Summary</Text>
            <Text style={styles.title}>Cart</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.row}>
            <Image source={{uri: item.imageUrl}} style={styles.image} />
            <View style={styles.copy}>
              <Text numberOfLines={2} style={styles.name}>
                {item.productName}
              </Text>
              <Text style={styles.meta}>
                {item.selectedColor} / {item.selectedSize}
              </Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            </View>
            <QuantityControl
              onDecrease={() =>
                updateCartQuantity(item.id, Math.max(0, item.quantity - 1))
              }
              onIncrease={() => updateCartQuantity(item.id, item.quantity + 1)}
              value={item.quantity}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  eyebrow: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.typography.hero,
    color: theme.colors.text,
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  emptyCopy: {
    maxWidth: 260,
    textAlign: 'center',
    lineHeight: 22,
    color: theme.colors.mutedText,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: 84,
    height: 84,
    borderRadius: 18,
  },
  copy: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    color: theme.colors.text,
  },
  meta: {
    fontSize: 12,
    color: theme.colors.mutedText,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  summaryCard: {
    marginTop: 8,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.elevated,
    borderRadius: 24,
    gap: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: theme.colors.mutedText,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  checkoutButton: {
    width: '82%',
    minHeight: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkoutLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.card,
  },
});
