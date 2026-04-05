import React, {useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CartIcon from '../../App_images/cart.svg';
import FavoriteIcon from '../../App_images/favorite.svg';
import {QuantityControl} from '../components/QuantityControl';
import {useRetailApp} from '../context/AppContext';
import {RootStackParamList} from '../navigation/types';
import {theme} from '../theme/tokens';
import {
  formatCurrency,
  formatReviewCount,
} from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen = ({navigation, route}: Props) => {
  const {
    addProductToCart,
    getProductById,
    isProductWishlisted,
    toggleProductWishlist,
  } = useRetailApp();
  const product = getProductById(route.params.productId);

  const [selectedColor, setSelectedColor] = useState(
    product?.colors[0] ?? 'White',
  );
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] ?? '36');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Product unavailable</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.orderButton}>
            <Text style={styles.orderButtonLabel}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = async () => {
    await addProductToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    });

    Alert.alert('Added to cart', 'The item is ready for checkout.');
  };

  const handleOrderNow = async () => {
    await addProductToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    });

    navigation.navigate('Checkout');
  };

  const isWishlisted = isProductWishlisted(product.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>{'<'}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrap}>
          <Image source={{uri: product.imageUrl}} style={styles.image} />
        </View>

        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text numberOfLines={2} style={styles.title}>
              {product.name}
            </Text>
          </View>
          <Pressable
            onPress={() => toggleProductWishlist(product)}
            style={styles.heartButton}>
            <FavoriteIcon
              height={24}
              opacity={isWishlisted ? 1 : 0.38}
              width={24}
            />
          </Pressable>
        </View>

        <Text style={styles.price}>{formatCurrency(product.price, product.currency)}</Text>
        <Text style={styles.rating}>
          {product.rating.toFixed(1)} {formatReviewCount(product.reviewCount)} Sold
        </Text>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description Product</Text>
          <Text numberOfLines={4} style={styles.description}>
            {product.description}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Variant Color</Text>
          <View style={styles.optionRow}>
            {product.colors.map(color => (
              <Pressable
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.optionChip,
                  selectedColor === color ? styles.optionChipActive : null,
                ]}>
                <Text
                  style={[
                    styles.optionLabel,
                    selectedColor === color ? styles.optionLabelActive : null,
                  ]}>
                  {color}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionRow}>
            {product.sizes.map(size => (
              <Pressable
                key={size}
                onPress={() => setSelectedSize(size)}
                style={[
                  styles.sizeChip,
                  selectedSize === size ? styles.optionChipActive : null,
                ]}>
                <Text
                  style={[
                    styles.optionLabel,
                    selectedSize === size ? styles.optionLabelActive : null,
                  ]}>
                  {size}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.quantityRow}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <QuantityControl
            onDecrease={() => setQuantity(previous => Math.max(1, previous - 1))}
            onIncrease={() => setQuantity(previous => previous + 1)}
            value={quantity}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={handleAddToCart} style={styles.cartButton}>
          <CartIcon height={24} width={24} />
        </Pressable>
        <Pressable onPress={handleOrderNow} style={styles.orderButton}>
          <Text style={styles.orderButtonLabel}>Order Now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backLabel: {
    fontSize: 22,
    color: '#c7c1b9',
  },
  content: {
    paddingBottom: 105,
  },
  imageWrap: {
    height: 322,
    backgroundColor: theme.colors.elevated,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  titleCopy: {
    flex: 1,
    paddingRight: 14,
  },
  title: {
    fontSize: 11,
    lineHeight: 14,
    color: theme.colors.text,
  },
  heartButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    paddingHorizontal: 10,
    marginTop: 4,
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  rating: {
    paddingHorizontal: 10,
    marginTop: 4,
    fontSize: 10,
    color: '#d4b469',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1ede7',
    marginTop: 10,
  },
  section: {
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  description: {
    marginTop: 7,
    fontSize: 10,
    lineHeight: 14,
    color: '#b4aba0',
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  optionChip: {
    minWidth: 36,
    height: 24,
    borderWidth: 1,
    borderColor: '#f0ece4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 9,
    backgroundColor: theme.colors.card,
  },
  sizeChip: {
    width: 28,
    height: 24,
    borderWidth: 1,
    borderColor: '#f0ece4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  optionChipActive: {
    borderColor: '#d8bb7f',
  },
  optionLabel: {
    fontSize: 9,
    color: '#b4aba0',
  },
  optionLabelActive: {
    color: theme.colors.text,
  },
  quantityRow: {
    paddingHorizontal: 10,
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 18,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  cartButton: {
    width: 46,
    height: 40,
    borderWidth: 1,
    borderColor: '#cfb06c',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  orderButton: {
    width: 168,
    height: 40,
    borderRadius: 6,
    backgroundColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonLabel: {
    color: theme.colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  missingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  missingTitle: {
    fontSize: 18,
    color: theme.colors.text,
  },
});
