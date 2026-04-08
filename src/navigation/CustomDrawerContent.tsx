import React from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../theme/tokens';

const fakeLinks = [
  {label: 'Shop', id: 'shop'},
  {label: 'About Us', id: 'about'},
  {label: 'Contact', id: 'contact'},
  {label: 'FAQ', id: 'faq'},
  {label: 'Settings', id: 'settings'},
];

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const handleLinkPress = (id: string) => {
    if (id === 'shop') {
      props.navigation.navigate('MainTabs');
    } else {
      Alert.alert('Future Feature', `This would navigate to ${id}.`);
      props.navigation.closeDrawer();
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>P</Text>
        </View>
        <Text style={styles.brandName}>Platzi</Text>
      </View>

      <View style={styles.linkList}>
        {fakeLinks.map((link) => (
          <Pressable
            key={link.id}
            onPress={() => handleLinkPress(link.id)}
            style={styles.linkItem}
          >
            <Text style={styles.linkLabel}>{link.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerCopy}>RetailApp v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: theme.colors.card,
    fontSize: 14,
    fontWeight: '800',
    fontFamily: theme.typography.hero,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: theme.typography.hero,
    letterSpacing: 1,
  },
  linkList: {
    padding: 12,
    gap: 8,
    flex: 1,
  },
  linkItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerCopy: {
    fontSize: 12,
    color: theme.colors.mutedText,
  },
});
