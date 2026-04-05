import React from 'react';
import {StyleSheet, View} from 'react-native';
import {theme} from '../theme/tokens';

type IconName = 'home' | 'favorite' | 'cart' | 'profile' | 'notification';

export const AppIcon = ({
  name,
  size = 16,
  active = false,
}: {
  name: IconName;
  size?: number;
  active?: boolean;
}) => {
  const color = active ? theme.colors.accent : '#c2b9a6';

  if (name === 'home') {
    return (
      <View style={[styles.iconBox, {width: size, height: size}]}>
        <View
          style={[
            styles.homeRoof,
            {
              borderLeftWidth: size * 0.34,
              borderRightWidth: size * 0.34,
              borderBottomWidth: size * 0.28,
              borderBottomColor: color,
            },
          ]}
        />
        <View
          style={[
            styles.homeBase,
            {
              width: size * 0.72,
              height: size * 0.45,
              borderColor: color,
            },
          ]}>
          <View
            style={[
              styles.homeDoor,
              {
                width: size * 0.16,
                height: size * 0.22,
                borderColor: color,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  if (name === 'favorite') {
    return (
      <View style={[styles.iconBox, {width: size, height: size}]}>
        <View
          style={[
            styles.starVertical,
            {backgroundColor: color, width: size * 0.12, height: size * 0.8},
          ]}
        />
        <View
          style={[
            styles.starHorizontal,
            {backgroundColor: color, width: size * 0.8, height: size * 0.12},
          ]}
        />
        <View
          style={[
            styles.starDiagonalLeft,
            {backgroundColor: color, width: size * 0.12, height: size * 0.8},
          ]}
        />
        <View
          style={[
            styles.starDiagonalRight,
            {backgroundColor: color, width: size * 0.12, height: size * 0.8},
          ]}
        />
      </View>
    );
  }

  if (name === 'cart') {
    return (
      <View style={[styles.iconBox, {width: size, height: size}]}>
        <View
          style={[
            styles.cartHandle,
            {width: size * 0.3, borderTopColor: color, borderLeftColor: color},
          ]}
        />
        <View
          style={[
            styles.cartBasket,
            {
              width: size * 0.58,
              height: size * 0.34,
              borderColor: color,
            },
          ]}
        />
        <View style={styles.cartWheels}>
          <View
            style={[
              styles.cartWheel,
              {width: size * 0.12, height: size * 0.12, borderColor: color},
            ]}
          />
          <View
            style={[
              styles.cartWheel,
              {width: size * 0.12, height: size * 0.12, borderColor: color},
            ]}
          />
        </View>
      </View>
    );
  }

  if (name === 'profile') {
    return (
      <View style={[styles.iconBox, {width: size, height: size}]}>
        <View
          style={[
            styles.profileHead,
            {
              width: size * 0.32,
              height: size * 0.32,
              borderColor: color,
            },
          ]}
        />
        <View
          style={[
            styles.profileBody,
            {
              width: size * 0.7,
              height: size * 0.36,
              borderColor: color,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.iconBox, {width: size, height: size}]}>
      <View
        style={[
          styles.bellTop,
          {
            width: size * 0.56,
            height: size * 0.46,
            borderColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.bellBottom,
          {
            width: size * 0.68,
            borderTopColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.bellDot,
          {
            width: size * 0.12,
            height: size * 0.12,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoof: {
    position: 'absolute',
    top: 1,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
  homeBase: {
    position: 'absolute',
    bottom: 2,
    borderWidth: 1.3,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 1,
  },
  homeDoor: {
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  starVertical: {
    position: 'absolute',
    borderRadius: 999,
  },
  starHorizontal: {
    position: 'absolute',
    borderRadius: 999,
  },
  starDiagonalLeft: {
    position: 'absolute',
    transform: [{rotate: '55deg'}],
    borderRadius: 999,
  },
  starDiagonalRight: {
    position: 'absolute',
    transform: [{rotate: '-55deg'}],
    borderRadius: 999,
  },
  cartHandle: {
    position: 'absolute',
    top: 2,
    left: 1,
    height: 4,
    borderTopWidth: 1.2,
    borderLeftWidth: 1.2,
    transform: [{skewX: '-20deg'}],
  },
  cartBasket: {
    position: 'absolute',
    top: 5,
    right: 2,
    borderWidth: 1.2,
    borderRadius: 2,
  },
  cartWheels: {
    position: 'absolute',
    bottom: 1,
    flexDirection: 'row',
    gap: 6,
  },
  cartWheel: {
    borderWidth: 1.2,
    borderRadius: 99,
  },
  profileHead: {
    position: 'absolute',
    top: 1,
    borderWidth: 1.2,
    borderRadius: 999,
  },
  profileBody: {
    position: 'absolute',
    bottom: 1,
    borderWidth: 1.2,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  bellTop: {
    position: 'absolute',
    top: 2,
    borderWidth: 1.2,
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  bellBottom: {
    position: 'absolute',
    bottom: 4,
    borderTopWidth: 1.2,
  },
  bellDot: {
    position: 'absolute',
    bottom: 1,
    borderRadius: 99,
  },
});
