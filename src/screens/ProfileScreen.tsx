import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRetailApp} from '../context/AppContext';
import {theme} from '../theme/tokens';
import {formatAddressPreview} from '../utils/formatters';

export const ProfileScreen = () => {
  const {
    cartCount,
    paymentMethods,
    profileEmail,
    profileName,
    shippingAddresses,
    signOut,
    wishlistItems,
  } = useRetailApp();

  const defaultAddress = shippingAddresses.find(address => address.isDefault === 1);
  const defaultPayment = paymentMethods.find(method => method.isDefault === 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Your Space</Text>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{profileName.slice(0, 1)}</Text>
          </View>
          <Text style={styles.name}>{profileName}</Text>
          <Text style={styles.email}>{profileEmail}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{wishlistItems.length}</Text>
            <Text style={styles.statLabel}>Wishlist</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Default Shipping</Text>
          <Text style={styles.detailCopy}>
            {formatAddressPreview(defaultAddress)}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Preferred Payment</Text>
          <Text style={styles.detailCopy}>
            {defaultPayment?.type ?? 'E-Wallet'} /{' '}
            {defaultPayment?.label ?? 'My Wallet'}
          </Text>
        </View>

        <Pressable onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
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
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accentSoft,
  },
  avatarLabel: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,
  },
  email: {
    fontSize: 14,
    color: theme.colors.mutedText,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.elevated,
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: theme.colors.mutedText,
  },
  detailCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    padding: theme.spacing.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  detailCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.mutedText,
  },
  signOutButton: {
    minHeight: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutLabel: {
    color: theme.colors.card,
    fontSize: 15,
    fontWeight: '700',
  },
});
