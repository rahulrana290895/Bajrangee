import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from './components/CustomHeader';
import { BASE_URL } from './config/config';0

const Tab = createMaterialTopTabNavigator();


const UpcomingScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} />

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            marginTop: 10,
            marginLeft:10,
          },
        tabBarContentContainerStyle: {
          paddingHorizontal: 5,
        },

        tabBarItemStyle: {
          width: 'auto',
          paddingHorizontal: 0,
        },

        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
        }}
      >
        <Tab.Screen
          name="Daily"
          component={UpcomingList}
          initialParams={{ api: 'upcoming_contest.php' }}
          options={{
            tabBarLabel: ({ focused }) => (
              <View
                style={[
                  styles.tabButton,
                  focused && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    focused && styles.tabTextActive,
                  ]}
                >
                  Daily
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Festival"
          component={UpcomingList}
          initialParams={{ api: 'upcoming_festival_contest.php' }}
          options={{
            tabBarLabel: ({ focused }) => (
              <View
                style={[
                  styles.tabButton,
                  focused && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    focused && styles.tabTextActive,
                  ]}
                >
                  Festival
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const UpcomingList = ({ route }) => {
  const { api } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}${api}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.log(`${api} error:`, err);
    } finally {
      setLoading(false);
    }
  };

const formatNumbers = (numbersString) => {
  if (!numbersString) return [];
  const nums = numbersString.split(',');
  const countMap = {};
  nums.forEach(num => {
    countMap[num] = (countMap[num] || 0) + 1;
  });
  return Object.entries(countMap);
};

const renderItem = ({ item }) => {
  const isNight = item.type === 'Night';

  return (
    <View style={[styles.card, isNight && styles.cardNight]}>
      <Text style={[styles.title, isNight && styles.titleNight]}>
        {item.title} {item.type ? ` (${item.type})` : ''}
      </Text>

      <View style={styles.row}>
        <Text style={[styles.label, isNight && styles.textNight]}>
          Ticket No:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {formatNumbers(item.number).map(([num, qty]) => (
            <View key={num} style={styles.numberContainer}>

              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{num}</Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{qty}</Text>
              </View>

            </View>
          ))}
        </View>

      </View>

      <View style={styles.row}>
        <Text style={[styles.label, isNight && styles.textNight]}>
          Entry Amount:
        </Text>
        <Text style={[styles.value, isNight && styles.textNight]}>
          ₹ {item.amount}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, isNight && styles.textNight]}>
          Total Amount:
        </Text>
        <Text style={[styles.value, isNight && styles.textNight]}>
          ₹ {item.amount}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, isNight && styles.textNight]}>
          Prize:
        </Text>
        <Text style={[styles.prize, isNight && styles.prizeNight]}>
          ₹ {item.prize}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.success, isNight && styles.successNight]}>
          Draw on {item.draw_date} at {item.draw_time}
        </Text>
      </View>
    </View>
  );
};



  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#ffa41c"
        style={{ marginTop: 30 }}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.join_id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 15 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No Records Found</Text>
      }
    />
  );
};

export default UpcomingScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  /* TAB BUTTON */
  tabButton: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ffa41c',
    backgroundColor: '#fff',
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: '#ffa41c',
  },
  tabText: {
    color: '#ffa41c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
  },

  /* CARD */
  card: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#664d03',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#000',
    fontSize: 14,
  },
  value: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  success: {
    color: 'brown',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#aaa',
    fontSize: 16,
  },
  cardNight: {
    backgroundColor: '#030147',
    borderWidth: 1,
    borderColor: '#333',
  },

  titleNight: {
    color: '#ffd369',
  },

  textNight: {
    color: '#fff',
  },

  prizeNight: {
    color: '#4caf50',
    fontWeight: 'bold',
  },

  successNight: {
    color: '#ff9800',
  },
  numberContainer: {
    position: 'relative',
    marginRight: 12,
  },

  numberBox: {
    backgroundColor: '#28a745',   // ✅ Green
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:5,
  },

  numberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc3545',   // ✅ Red
    borderRadius: 50,
    minWidth: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});