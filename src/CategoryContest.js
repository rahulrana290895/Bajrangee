import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/config';

export default function CategoryContest({ route, navigation }) {
  const { cat_id } = route.params;

  const [userId, setUserId] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
    fetchContests();
  }, []);

  const getUser = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  const fetchContests = async () => {
    try {
      const res = await fetch(`${BASE_URL}/contest.php?cat_id=${cat_id}`);
      const json = await res.json();

      if (json && json.data) {
        setContests(json.data);
      } else {
        setContests([]);
      }
    } catch (err) {
      console.log('API Error:', err);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const renderDailyContest = ({ item }) => (
    <View style={styles.dailyCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.dailyTitle}>{item.title}</Text>
        <Text style={styles.dailyText}>🏆 Prize: ₹{item.prize}</Text>
        <Text style={styles.dailyText}>🎟 Slot: {item.slot}</Text>
        <Text style={styles.dailyText}>
          ⏰ {item.draw_date} {item.draw_time}
        </Text>
      </View>

      <View style={styles.rightBox}>
        <Text style={styles.cost}>₹{item.cost}</Text>

        <TouchableOpacity
          style={styles.dailyJoinBtn}
            onPress={() => {
              if (item.type == 4) {
                navigation.navigate('JoinNightContest', { contest: item });
              } else {
                navigation.navigate('JoinDailyContest', { contest: item });
              }
            }}
        >
          <Text style={styles.dailyJoinText}>JOIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>️Contests</Text>

          {contests.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No contests available
            </Text>
          ) : (
            <FlatList
              data={contests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderDailyContest}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  section: {
    marginTop: 20,
    paddingBottom: 30
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 12,
    color: '#111'
  },

  dailyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    elevation: 2
  },

  dailyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4
  },

  dailyText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2
  },

  rightBox: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  cost: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 6
  },

  dailyJoinBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8
  },

  dailyJoinText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13
  }
});