import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BASE_URL } from './config/config';

const JoinedFestivalContestScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`${BASE_URL}joining_festival_contest.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      const result = await response.json();
      if (result.status) {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWinners = (contestId) => {
    setExpandedId(expandedId === contestId ? null : contestId);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>

      {/* Header */}
      <View style={styles.rowBetween}>
        <Text style={styles.title}>
          (#{item.contest_id}) {item.contest_title}
        </Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'WIN' ? '#4CAF50' : '#F44336' },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Contest Info */}
      <Text style={styles.text}>Ticket Cost: ₹{item.contest_cost}</Text>
      <Text style={styles.text}>My Number: {item.my_number}</Text>

      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text style={styles.dateText}>
          {item.draw_date || 'Date N/A'} {item.draw_time}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Message */}
      <Text
        style={[
          styles.message,
          { color: item.status === 'WIN' ? '#2E7D32' : '#C62828' },
        ]}
      >
        {item.message}
      </Text>

      {item.status === 'WIN' && (
        <Text style={styles.winAmount}>
          Winning Amount: ₹{item.win_amount}
        </Text>
      )}

      {/* View Results Button */}
      <TouchableOpacity
        onPress={() => toggleWinners(item.contest_id)}
        style={styles.viewBtn}
      >
        <Text style={styles.viewBtnText}>
          {expandedId === item.contest_id
            ? 'Hide Results ▲'
            : 'View Results ▼'}
        </Text>
      </TouchableOpacity>

      {/* Winners List */}
      {expandedId === item.contest_id && (
        <View style={styles.winnerBox}>
          <Text style={styles.winnerTitle}>Winning Numbers</Text>

          {item.winners && item.winners.length > 0 ? (
            item.winners.map((win, index) => (
              <View key={index} style={styles.winnerRow}>
                <Text style={styles.winnerNumber}>
                  {win.wining_number}
                </Text>
                <Text style={styles.winnerAmount}>
                  ₹{win.winning_amount}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noWinnerText}>No winners found</Text>
          )}
        </View>
      )}

    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default JoinedFestivalContestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  dateText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#555',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
  winAmount: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  viewBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  viewBtnText: {
    color: '#1E88E5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  winnerBox: {
    marginTop: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  winnerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  winnerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  winnerNumber: {
    fontSize: 14,
    color: '#444',
  },
  winnerAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  noWinnerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
});
