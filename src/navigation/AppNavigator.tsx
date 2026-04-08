import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CartIcon from '../../App_images/cart.svg';
import FavoriteIcon from '../../App_images/favorite.svg';
import HomeIcon from '../../App_images/home.svg';
import ProfileIcon from '../../App_images/profile.svg';
import {useRetailApp} from '../context/AppContext';
import {CartScreen} from '../screens/CartScreen';
import {CheckoutScreen} from '../screens/CheckoutScreen';
import {EditProfileScreen} from '../screens/EditProfileScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {CustomDrawerContent} from './CustomDrawerContent';
import {LoginScreen} from '../screens/LoginScreen';
import {ProductDetailsScreen} from '../screens/ProductDetailsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {WishlistScreen} from '../screens/WishlistScreen';
import {theme} from '../theme/tokens';
import {MainTabParamList, RootStackParamList} from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Drawer = createDrawerNavigator();

// Main tabs for application
const MainTabs = () => {
  const {cartCount, wishlistItems} = useRetailApp();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabLabel,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarIconStyle: styles.tabIconStyle,
        tabBarBadgeStyle: styles.badge,
      }}>
      <Tab.Screen
        component={HomeScreen}
        name="HomeTab"
        options={{
          title: 'My Order',
          tabBarLabel: 'My Order',
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <HomeIcon height={22} opacity={focused ? 1 : 0.38} width={22} />
          ),
        }}
      />
      <Tab.Screen
        component={WishlistScreen}
        name="WishlistTab"
        options={{
          title: 'Wishlist',
          tabBarLabel: 'Wishlist',
          tabBarBadge: wishlistItems.length || undefined,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <FavoriteIcon
              height={22}
              opacity={focused ? 1 : 0.38}
              width={22}
            />
          ),
        }}
      />
      <Tab.Screen
        component={CartScreen}
        name="CartTab"
        options={{
          title: 'Cart',
          tabBarLabel: 'Cart',
          tabBarBadge: cartCount || undefined,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <CartIcon height={22} opacity={focused ? 1 : 0.38} width={22} />
          ),
        }}
      />
      <Tab.Screen
        component={ProfileScreen}
        name="ProfileTab"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <ProfileIcon
              height={22}
              opacity={focused ? 1 : 0.38}
              width={22}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main drawer for Home Screen
const MainDrawer = () => {
  return (
    <Drawer.Navigator 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="ShopDrawer" component={MainTabs} />
    </Drawer.Navigator>
  );
};

// App navigator for Home Screen
export const AppNavigator = () => {
  const {isAuthenticated, isBootstrapping} = useRetailApp();

  if (isBootstrapping) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
        <Text style={styles.loadingTitle}>Preparing your app</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {!isAuthenticated ? (
          <RootStack.Screen component={LoginScreen} name="Login" />
        ) : (
          <>
            <RootStack.Screen component={MainDrawer} name="MainTabs" />
            <RootStack.Screen
              component={ProductDetailsScreen}
              name="ProductDetails"
            />
            <RootStack.Screen component={CheckoutScreen} name="Checkout" />
            <RootStack.Screen component={EditProfileScreen} name="EditProfile" />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingTitle: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: theme.typography.hero,
    color: theme.colors.text,
    textAlign: 'center',
  },
  tabBar: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 10,
    height: 68,
    paddingTop: 10,
    paddingBottom: 4,
    borderRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: 0,
  },
  tabBarItem: {
    paddingVertical: 0,
  },
  tabIconStyle: {
    marginTop: 6,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    marginBottom: 7,
  },
  badge: {
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.accentSoft,
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.accent,
    top: 2,
  },
});
