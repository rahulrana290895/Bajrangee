import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from './components/CustomHeader';
import { BASE_URL, ASSETS_URL } from './config/config';

export default function HomeScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyContests, setDailyContests] = useState([]);
  const [dailyLoading, setDailyLoading] = useState(true);

  useEffect(() => {
  const getUser = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);
  };

  // Festival Contest
  fetch(`${BASE_URL}festival_contest.php`)
    .then(res => res.json())
    .then(json => {
      if (json.status) {
        setContests(json.data);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));

  // ✅ Daily Contest
  fetch(`${BASE_URL}daily_contest.php`)
    .then(res => res.json())
    .then(json => {
      if (json.status) {
        setDailyContests(json.data);
      }
      setDailyLoading(false);
    })
    .catch(() => setDailyLoading(false));

  getUser();
}, []);

  const renderContest = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>

      <Text style={styles.prize}>🏆 Prize : ₹{item.prize}</Text>
      <Text style={styles.text}>💰 Entry : ₹{item.cost}</Text>
      <Text style={styles.text}>📅 Draw : {item.draw_date} {item.draw_time}</Text>

      <TouchableOpacity
        style={styles.joinBtn}
        onPress={() =>
          navigation.navigate('JoinFestivalContest', { contest: item })
        }
      >
        <Text style={styles.joinText}>JOIN NOW</Text>
      </TouchableOpacity>
    </View>
  );
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
        onPress={() =>
          navigation.navigate('JoinDailyContest', { contest: item })
        }
      >
        <Text style={styles.dailyJoinText}>JOIN</Text>
      </TouchableOpacity>
    </View>
  </View>
);
return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <CustomHeader navigation={navigation} />

      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <Image
          source={{ uri: `${ASSETS_URL}banner.jpg` }}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>
      {/* Contest Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎉 Festival Contests</Text>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={contests}
            horizontal
            keyExtractor={item => item.id}
            renderItem={renderContest}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16 }}
          />
        )}
      </View>

     <View style={styles.section}>
       <Text style={styles.sectionTitle}>🔥 Daily Contests</Text>

       {dailyLoading ? (
         <ActivityIndicator size="large" />
       ) : (
         <FlatList
           data={dailyContests}
           keyExtractor={item => item.id}
           renderItem={renderDailyContest}
           scrollEnabled={false}   // ❌ horizontal / vertical scroll disable
         />
       )}
     </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    margin: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: 180,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginTop: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    marginBottom: 12,
    color: '#111',
  },
  card: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: 'blue',
  },
  prize: {
    fontSize: 14,
    fontWeight: '600',
    color: 'green',
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  joinBtn: {
    marginTop: 12,
    backgroundColor: '#ffa41c',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  dailyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },
  dailyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  dailyText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  rightBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cost: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e65100',
    marginBottom: 6,
  },
  dailyJoinBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  dailyJoinText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
