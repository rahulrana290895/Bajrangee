import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView  } from 'react-native-safe-area-context';

import { BASE_URL } from './config/config';

export default function JoinFestivalContest({ route, navigation }) {
  const { contest } = route.params;

  // 🔹 series: "A,B,C"
  const seriesList = useMemo(
    () => contest.series.split(','),
    [contest.series]
  );

  // 🔹 digit: "100000-999999"
  const [startDigit, endDigit] = useMemo(
    () => contest.digit.split('-').map(Number),
    [contest.digit]
  );

  const [selectedSeries, setSelectedSeries] = useState(seriesList[0]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // 🔥 pagination states
  const PAGE_SIZE = 200;
  const [page, setPage] = useState(0);
  const [numbers, setNumbers] = useState([]);

  const totalAmount = selectedSlots.length * contest.cost;

  // ================= BALANCE =================
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const uid = await AsyncStorage.getItem('userId');
      const res = await fetch(
        `${BASE_URL}get_user_balance.php?user_id=${uid}`
      );
      const json = await res.json();
      setUserBalance(Number(json.balance));
    } catch {
      Alert.alert('Error', 'Wallet balance load nahi ho rahi');
    } finally {
      setLoadingBalance(false);
    }
  };

  // ================= PAGINATION LOGIC =================

useEffect(() => {
  const start = startDigit + page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE - 1, endDigit);

  if (start > endDigit) return;

  const newNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  setNumbers((prev) =>
    page === 0 ? newNumbers : [...prev, ...newNumbers]
  );
}, [page, startDigit, endDigit, selectedSeries]);

  // ================= SLOT SELECT =================
  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  // ================= JOIN =================
  const joinContest = () => {
    if (!selectedSlots.length) {
      Alert.alert('Select Slot', 'Kam se kam ek slot select karo');
      return;
    }

    if (totalAmount > userBalance) {
      Alert.alert(
        'Insufficient Balance',
        `Wallet ₹${userBalance}\nRequired ₹${totalAmount}`
      );
      return;
    }

    Alert.alert(
      'Confirm Join',
      `Slots:\n${selectedSlots.join(', ')}\nTotal ₹${totalAmount}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: submitJoin },
      ]
    );
  };

  const submitJoin = async () => {
    try {
      const uid = await AsyncStorage.getItem('userId');

      const res = await fetch(`${BASE_URL}festival_contest_join.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contest_id: contest.id,
          uid,
          slots: selectedSlots,
          amount: totalAmount,
        }),
      });

      const json = await res.json();

      if (json.success) {
        Alert.alert('Success', 'Festival Contest Joined 🎉', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomeScreen'),
          },
        ]);
      } else {
        Alert.alert('Failed', json.message);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // ================= UI =================
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
    <View style={styles.container}>
      <Text style={styles.title}>{contest.title}</Text>
      <Text style={styles.balance}>
        💼 {loadingBalance ? 'Loading...' : `₹${userBalance}`}
      </Text>
      <Text style={styles.text}>🏆 Prize: ₹{contest.prize}</Text>
      <Text style={styles.text}>💰 Entry Per Slot: ₹{contest.cost}</Text>

      {/* Series */}
      <Text style={styles.sectionTitle}>Select Series</Text>
      <View style={styles.seriesRow}>
        {seriesList.map((s) => (
          <TouchableOpacity
            key={s}
            style={[
              styles.seriesBtn,
              selectedSeries === s && styles.seriesActive,
            ]}
            onPress={() => {
              setSelectedSeries(s);
              setSelectedSlots([]);
              setPage(0);
              setNumbers([]); // 🔥 reset pagination
            }}
          >
            <Text
              style={[
                styles.seriesText,
                selectedSeries === s && { color: '#fff' },
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Slots */}
      <FlatList
        data={numbers}
        numColumns={5}
        keyExtractor={(item) => item.toString()}
        onEndReached={() => {
          const nextStart = startDigit + (page + 1) * PAGE_SIZE;
          if (nextStart <= endDigit) {
            setPage((prev) => prev + 1);
          }
        }}
        onEndReachedThreshold={0.6}
        renderItem={({ item }) => {
          const slot = `${selectedSeries}${item}`;
          const selected = selectedSlots.includes(slot);

          return (
            <TouchableOpacity
              style={[styles.slotBox, selected && styles.slotSelected]}
              onPress={() => toggleSlot(slot)}
            >
              <Text style={[styles.slotText, selected && { color: '#fff' }]}>
                {slot}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.total}>
          Selected {selectedSlots.length} | ₹{totalAmount}
        </Text>
        <TouchableOpacity style={styles.joinBtn} onPress={joinContest}>
          <Text style={styles.joinText}>JOIN</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>

  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  balance: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '700',
  },
  seriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  seriesBtn: {
    borderWidth: 1,
    borderColor: '#ffa41c',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  seriesActive: {
    backgroundColor: '#ffa41c',
  },
  seriesText: {
    fontWeight: '700',
    color: '#ffa41c',
  },
  slotBox: {
    flex: 1,
    margin: 6,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  slotSelected: {
    backgroundColor: '#4CAF50',
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 10,
  },
  total: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  joinBtn: {
    marginTop: 15,
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
