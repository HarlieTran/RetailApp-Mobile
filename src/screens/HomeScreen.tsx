import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import NotificationIcon from '../../App_images/notification.svg';
import SearchIcon from '../../App_images/search.svg';
import {useRetailApp} from '../context/AppContext';
import {RootStackParamList} from '../navigation/types';
import {theme} from '../theme/tokens';

const menCategoryImage = require('../../App_images/Men.jpg');
const womenCategoryImage = require('../../App_images/Women.jpg');
const quickCategories = ['Clothes', 'Shoes', 'Caps', 'Bags'];

type CategoryCard = 'men' | 'women' | null;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {featuredProducts, products, refreshAppData} = useRetailApp();
  const sliderRef = useRef<FlatList<(typeof products)[number]>>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeCategoryCard, setActiveCategoryCard] =
    useState<CategoryCard>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      return `${product.name} ${product.brand}`
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  }, [products, searchText]);

  const sliderItems =
    featuredProducts.length > 0
      ? featuredProducts.slice(0, 4)
      : filteredProducts.slice(0, 4);
  const sliderData =
    sliderItems.length > 0 ? sliderItems : products.slice(0, 1);

  const handleQuickCategoryPress = (label: string) => {
    setActiveCategoryCard(null);
    setSearchText(label.toLowerCase());
  };

  const handleGenderCardPress = (category: Exclude<CategoryCard, null>) => {
    setActiveCategoryCard(category);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAppData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    setActiveSlide(0);

    if (sliderRef.current && sliderData.length > 0) {
      sliderRef.current.scrollToOffset({animated: false, offset: 0});
    }
  }, [searchText, sliderData.length]);

  useEffect(() => {
    if (sliderData.length <= 1 || sliderWidth === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setActiveSlide(currentSlide => {
        const nextSlide = (currentSlide + 1) % sliderData.length;
        sliderRef.current?.scrollToOffset({
          animated: true,
          offset: nextSlide * sliderWidth,
        });
        return nextSlide;
      });
    }, 3200);

    return () => clearInterval(intervalId);
  }, [sliderData.length, sliderWidth]);

  const handleSliderScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (sliderWidth === 0) {
      return;
    }

    const nextSlide = Math.round(
      event.nativeEvent.contentOffset.x / sliderWidth,
    );

    setActiveSlide(nextSlide);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <SearchIcon height={14} width={14} />
            <TextInput
              onChangeText={setSearchText}
              placeholder="Search"
              placeholderTextColor="#d2cfd7"
              style={styles.searchInput}
              value={searchText}
            />
          </View>
          <View style={styles.notificationWrap}>
            <NotificationIcon height={22} width={22} />
            <View style={styles.notificationDot} />
          </View>
        </View>

        {sliderData.length > 0 ? (
          <View
            onLayout={event => setSliderWidth(event.nativeEvent.layout.width)}
            style={styles.heroCard}>
            <FlatList
              data={sliderData}
              horizontal
              keyExtractor={item => item.id.toString()}
              onMomentumScrollEnd={handleSliderScrollEnd}
              pagingEnabled
              ref={sliderRef}
              renderItem={({item}) => (
                <Pressable
                  onPress={() =>
                    navigation.navigate('ProductDetails', {productId: item.id})
                  }
                  style={[
                    styles.heroSlide,
                    sliderWidth > 0 ? {width: sliderWidth} : null,
                  ]}>
                  <ImageBackground
                    imageStyle={styles.heroImage}
                    source={{uri: item.imageUrl}}
                    style={styles.heroMedia}
                  />
                </Pressable>
              )}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        <View style={styles.pagination}>
          {sliderData.map((_, index) => (
            <View
              key={`slider-dot-${index}`}
              style={[styles.dot, index === activeSlide ? styles.dotActive : null]}
            />
          ))}
        </View>

        <Pressable
          onPress={() => handleGenderCardPress('men')}
          style={[
            styles.categoryCard,
            styles.firstCategoryCard,
            activeCategoryCard === 'men' ? styles.categoryCardActive : null,
          ]}>
          <Image
            resizeMode="cover"
            source={menCategoryImage}
            style={[styles.categoryPhoto, styles.menPhoto]}
          />
          <Text style={styles.categoryLabel}>Men</Text>
        </Pressable>

        <Pressable
          onPress={() => handleGenderCardPress('women')}
          style={[
            styles.categoryCard,
            activeCategoryCard === 'women' ? styles.categoryCardActive : null,
          ]}>
          <Image
            resizeMode="cover"
            source={womenCategoryImage}
            style={[styles.categoryPhoto, styles.womenPhoto]}
          />
          <Text style={styles.categoryLabel}>Woman</Text>
        </Pressable>

        <View style={styles.quickCategoryGrid}>
          {quickCategories.map(label => (
            <Pressable
              key={label}
              onPress={() => handleQuickCategoryPress(label)}
              style={styles.quickCategoryCard}>
              <Text style={styles.quickCategoryLabel}>{label}</Text>
            </Pressable>
          ))}
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
  content: {
    paddingHorizontal: 12,
    paddingBottom: 118,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#f7f6fb',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 10,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  notificationWrap: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#f14d4d',
  },
  heroCard: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  heroSlide: {
    overflow: 'hidden',
  },
  heroMedia: {
    height: 168,
    backgroundColor: theme.colors.elevated,
  },
  heroImage: {
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#ece7de',
  },
  dotActive: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  categoryCard: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.card,
    minHeight: 156,
    justifyContent: 'flex-end',
  },
  firstCategoryCard: {
    marginTop: 18,
  },
  categoryCardActive: {
    borderWidth: 1,
    borderColor: '#efe1c2',
  },
  categoryPhoto: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '120%',
  },
  menPhoto: {
    top: -24,
  },
  womenPhoto: {
    top: -18,
  },
  categoryLabel: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 18,
    color: theme.colors.text,
    fontFamily: theme.typography.hero,
  },
  quickCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    columnGap: 10,
  },
  quickCategoryCard: {
    width: '47.5%',
    minHeight: 82,
    borderRadius: 8,
    backgroundColor: theme.colors.elevated,
    borderWidth: 1,
    borderColor: '#efe7da',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  quickCategoryLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: theme.typography.hero,
  },
});
