import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {Product} from '../types/product.types';
import {theme} from '../theme/tokens';
import {formatCategoryLabel, formatCurrency} from '../utils/formatters';

export const ProductCard = ({
  product,
  onPress,
  onToggleWishlist,
  wishlisted,
  style,
}: {
  product: Product;
  onPress: () => void;
  onToggleWishlist: () => void;
  wishlisted: boolean;
  style?: ViewStyle;
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.card, style]}>
      <View style={styles.imageWrap}>
        <Image source={{uri: product.imageUrl}} style={styles.image} />
        <Pressable onPress={onToggleWishlist} style={styles.wishlistButton}>
          <Text style={styles.wishlistLabel}>{wishlisted ? 'Saved' : 'Wish'}</Text>
        </Pressable>
      </View>
      <View style={styles.copy}>
        <Text style={styles.category}>{formatCategoryLabel(product)}</Text>
        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.brand}>
          {product.brand}
        </Text>
        <Text style={styles.price}>
          {formatCurrency(product.price, product.currency)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow,
  },
  imageWrap: {
    backgroundColor: theme.colors.elevated,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 210,
  },
  wishlistButton: {
    position: 'absolute',
    right: 14,
    top: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  wishlistLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.text,
  },
  copy: {
    padding: theme.spacing.md,
    gap: 4,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 23,
  },
  brand: {
    fontSize: 13,
    color: theme.colors.mutedText,
  },
  price: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
