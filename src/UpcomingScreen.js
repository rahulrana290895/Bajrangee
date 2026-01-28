import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from './components/CustomHeader';
import { BASE_URL } from './config/config';

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

 const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Ticket No:</Text>
        <Text style={styles.value}>{item.number}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Entry Amount:</Text>
        <Text style={styles.value}>₹ {item.amount}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Prize:</Text>
        <Text style={styles.prize}>₹ {item.prize}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.success}>Draw on {item.draw_date} at {item.draw_time}</Text>
      </View>


    </View>
  );


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
});