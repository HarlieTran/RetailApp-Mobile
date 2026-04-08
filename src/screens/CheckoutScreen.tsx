import React from 'react';
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
import {QuantityControl} from '../components/QuantityControl';
import {useRetailApp} from '../context/AppContext';
import {RootStackParamList} from '../navigation/types';
import {theme} from '../theme/tokens';
import {formatCurrency} from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const deliveryFee = 15.2;

export const CheckoutScreen = ({navigation}: Props) => {
  const {
    cartItems,
    paymentMethods,
    placeOrder,
    shippingAddresses,
    subtotal,
    updateCartQuantity,
  } = useRetailApp();

  const defaultAddress = shippingAddresses.find(address => address.isDefault === 1);
  const defaultPayment = paymentMethods.find(method => method.isDefault === 1);
  const primaryItem = cartItems[0];
  const total = subtotal + (cartItems.length > 0 ? deliveryFee : 0);

  const handleCheckout = async () => {
    const placed = await placeOrder();

    if (!placed) {
      return;
    }

    Alert.alert('Order confirmed', 'Your order is on its way.');
    navigation.reset({
      index: 0,
      routes: [{name: 'MainTabs'}],
    });
  };

  if (!primaryItem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backLabel}>{'<'}</Text>
          </Pressable>
          <Text style={styles.title}>Checkout</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Your checkout is empty.</Text>
          <Pressable
            onPress={() => navigation.reset({index: 0, routes: [{name: 'MainTabs'}]})}
            style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonLabel}>Back to shop</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backLabel}>{'<'}</Text>
        </Pressable>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.productCard}>
            <View style={styles.productTop}>
              <Image source={{uri: item.imageUrl}} style={styles.productImage} />
              <View style={styles.productCopy}>
                <Text numberOfLines={2} style={styles.productName}>
                {item.productName}
              </Text>
              <Text style={styles.variant}>
                {item.selectedColor} ({item.selectedSize})
              </Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            </View>
          </View>

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity : {item.quantity}</Text>
            <QuantityControl
              onDecrease={() =>
                updateCartQuantity(item.id, Math.max(0, item.quantity - 1))
              }
              onIncrease={() =>
                updateCartQuantity(item.id, item.quantity + 1)
              }
              value={item.quantity}
            />
          </View>
        </View>))}

        <View style={styles.lineItem}>
          <View style={styles.lineHeader}>
            <Text style={styles.lineTitle}>Shipping Address</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          <Text style={styles.lineCopy}>
            {defaultAddress?.fullName ?? 'John Doe'} ({defaultAddress?.postalCode ?? '5555-0015'})
          </Text>
          <Text style={styles.lineSubCopy}>{defaultAddress?.city ?? 'Ontario'}</Text>
        </View>

        <View style={styles.lineItem}>
          <View style={styles.lineHeader}>
            <Text style={styles.lineTitle}>Delivery Service</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          <Text style={styles.lineCopy}>FeedEx Reguler (3-4 days)</Text>
          <Text style={styles.lineSubCopy}>{formatCurrency(deliveryFee)}</Text>
        </View>

        <View style={styles.lineItem}>
          <View style={styles.lineHeader}>
            <Text style={styles.lineTitle}>Payment Methods</Text>
            <Text style={styles.editText}>Edit</Text>
          </View>
          <Text style={styles.lineSubCopy}>{defaultPayment?.type ?? 'E - Wallet'}</Text>
        </View>

        <View style={styles.lineItem}>
          <View style={styles.lineHeader}>
            <Text style={styles.lineTitle}>Add Promo Code</Text>
            <Text style={styles.arrowText}>{'>'}</Text>
          </View>
        </View>

        <View style={styles.summaryBlock}>
          <Text style={styles.totalTitle}>Total Payment</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.subtotalLabel}>Subtotal Price</Text>
            <Text style={styles.subtotalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={handleCheckout} style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonLabel}>Check Out Now</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backLabel: {
    fontSize: 22,
    color: '#c7c1b9',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.hero,
  },
  headerSpacer: {
    width: 16,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 96,
  },
  productCard: {
    borderWidth: 1,
    borderColor: '#f1ede7',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  productTop: {
    flexDirection: 'row',
    gap: 10,
  },
  productImage: {
    width: 55,
    height: 55,
    backgroundColor: theme.colors.elevated,
  },
  productCopy: {
    flex: 1,
    paddingTop: 2,
  },
  productName: {
    fontSize: 10,
    lineHeight: 13,
    color: theme.colors.text,
  },
  variant: {
    marginTop: 3,
    fontSize: 9,
    color: '#c0b7aa',
  },
  price: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 11,
    color: '#a9a092',
  },
  lineItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1ede7',
  },
  lineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.text,
  },
  editText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#335243',
  },
  arrowText: {
    fontSize: 14,
    color: '#c7c1b9',
  },
  lineCopy: {
    marginTop: 7,
    fontSize: 10,
    color: theme.colors.text,
  },
  lineSubCopy: {
    marginTop: 4,
    fontSize: 10,
    color: '#b0a79a',
  },
  summaryBlock: {
    paddingTop: 14,
  },
  totalTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  subtotalLabel: {
    fontSize: 10,
    color: '#b0a79a',
  },
  subtotalValue: {
    fontSize: 10,
    color: '#b0a79a',
  },
  footer: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 18,
    alignItems: 'center',
  },
  checkoutButton: {
    width: 108,
    height: 34,
    borderRadius: 6,
    backgroundColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonLabel: {
    color: theme.colors.card,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.text,
  },
});
