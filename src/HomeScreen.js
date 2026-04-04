import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from './components/CustomHeader';
import { BASE_URL, ASSETS_URL } from './config/config';

export default function HomeScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const flatListRef = useRef();

    useEffect(() => {
        getUser();
        fetchCategories();
    }, []);

    const getUser = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };

    const banners = [
      require('./assets/banner1.jpg'),
      require('./assets/banner2.jpg'),
      require('./assets/banner3.jpg'),
    ];


    useEffect(() => {
      const interval = setInterval(() => {
        let nextIndex = (currentIndex + 1) % banners.length;
        setCurrentIndex(nextIndex);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }, 3000);

      return () => clearInterval(interval);
    }, [currentIndex]);

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/category.php`);
        const json = await res.json();
        setCategories(json);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <CustomHeader navigation={navigation} />

            <View style={{ marginTop: 10 }}>
              <FlatList
                ref={flatListRef}
                data={banners}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Image source={item} style={styles.bannerImage} />
                )}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(
                    e.nativeEvent.contentOffset.x /
                    e.nativeEvent.layoutMeasurement.width
                  );
                  setCurrentIndex(index);
                }}
              />

              {/* Dots Indicator */}
              <View style={styles.dotsContainer}>
                {banners.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>

<View style={{ marginTop: 15, paddingHorizontal: 10 }}>
  <FlatList
    data={categories}
    numColumns={2}
    keyExtractor={(item) => item.id}
    columnWrapperStyle={{ justifyContent: 'space-between' }}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          if (item.id == 1) {
            navigation.navigate('FestivalCategoryContest');
          } else {
            navigation.navigate('CategoryContest', {
              cat_id: item.id,
            });
          }
        }}
      >
        <Image
          source={{ uri: `${item.file}` }}
          style={styles.cardImage}
        />
        <Text style={styles.cardText}>{item.name}</Text>
      </TouchableOpacity>
    )}
  />
</View>

      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
bannerImage: {
  width: 360,
  height: 180,
  borderRadius: 10,
  marginHorizontal: 5,
},

dotsContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 8,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#ccc',
  marginHorizontal: 4,
},

activeDot: {
  backgroundColor: '#000',
},
card: {
  width: '48%',
  backgroundColor: '#fff',
  borderRadius: 10,
  marginBottom: 15,
  elevation: 3,
  alignItems: 'center',
},

cardImage: {
  width: '100%',
  height: 120,
  borderRadius: 10,
},

cardText: {
  marginTop: 8,
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 'bold',
  textAlign: 'center',
},
});