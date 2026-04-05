import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProductCard} from '../components/ProductCard';
import {useRetailApp} from '../context/AppContext';
import {RootStackParamList} from '../navigation/types';
import {theme} from '../theme/tokens';

export const WishlistScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {products, toggleProductWishlist, wishlistItems, isProductWishlisted} =
    useRetailApp();

  const wishlistProducts = wishlistItems
    .map(item => products.find(product => product.id === item.productId))
    .filter(Boolean);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Saved Pieces</Text>
          <Text style={styles.title}>Wishlist</Text>
        </View>

        {wishlistProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nothing saved yet.</Text>
            <Text style={styles.emptyCopy}>
              Tap the Wish action on any item to keep it here.
            </Text>
          </View>
        ) : null}

        {wishlistProducts.map(product =>
          product ? (
            <ProductCard
              key={product.id}
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  productId: product.id,
                })
              }
              onToggleWishlist={() => toggleProductWishlist(product)}
              product={product}
              wishlisted={isProductWishlisted(product.id)}
            />
          ) : null,
        )}

        {wishlistProducts.length > 0 ? (
          <View style={styles.hintButton}>
            <Text style={styles.hintLabel}>Switch to the Cart tab when you are ready.</Text>
          </View>
        ) : null}
      </ScrollView>
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
    color: theme.colors.mutedText,
    lineHeight: 22,
  },
  hintButton: {
    minHeight: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
