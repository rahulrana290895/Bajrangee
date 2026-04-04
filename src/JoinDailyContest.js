import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView  } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config/config';

export default function JoinDailyContest({ route, navigation }) {
  const { contest } = route.params;

  const [selectedSlots, setSelectedSlots] = useState({});
  const [userBalance, setUserBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const slots = Array.from({ length: contest.slot }, (_, i) => i + 1);

  const totalSlots = Object.values(selectedSlots).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalAmount = totalSlots * contest.cost;

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const fetchUserBalance = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(
        `${BASE_URL}get_user_balance.php?user_id=${userId}`
      );
      const result = await response.json();
      setUserBalance(Number(result.balance));
    } catch {
      Alert.alert('Error', 'Unable to fetch wallet balance');
    } finally {
      setLoadingBalance(false);
    }
  };

  const addSlot = (slot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot]: (prev[slot] || 0) + 1,
    }));
  };

  const removeSlot = (slot) => {
    setSelectedSlots((prev) => {
      if (!prev[slot]) return prev;
      const updated = { ...prev };
      if (updated[slot] === 1) delete updated[slot];
      else updated[slot] -= 1;
      return updated;
    });
  };

  const joinContest = () => {
    if (totalSlots === 0) {
      Alert.alert('Select Slot', 'Please choose at least one slot');
      return;
    }

    if (totalAmount > userBalance) {
      Alert.alert(
        'Insufficient Balance',
        `Wallet Balance: ₹${userBalance}\nRequired: ₹${totalAmount}`
      );
      return;
    }

    Alert.alert(
      'Confirm Join',
      `Total Entries: ${totalSlots}\nTotal Amount: ₹${totalAmount}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: submitJoin },
      ]
    );
  };

  const submitJoin = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${BASE_URL}daily_contest_join.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contest_id: contest.id,
          slots: selectedSlots,
          amount: totalAmount,
          uid: userId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUserBalance(result.new_balance);
        setSelectedSlots({});
        Alert.alert('Success', 'Contest Joined', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Failed', result.message);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

    <View style={styles.container}>
      <Text style={styles.title}>{contest.title}</Text>

      <Text style={styles.balanceText}>
        💼 Wallet: {loadingBalance ? '...' : `₹${userBalance}`}
      </Text>
      <Text style={styles.text}>🏆 Prize: ₹{contest.prize}</Text>
      <Text style={styles.text}>💰 Entry Per Slot: ₹{contest.cost}</Text>
      <Text style={styles.text}>⏰ {contest.draw_date} {contest.draw_time}</Text>
      <Text style={styles.slotTitle}>Choose Your Slots</Text>


      <FlatList
        data={slots}
        numColumns={6}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => {
          const qty = selectedSlots[item] || 0;

          return (
            <TouchableOpacity
              style={[styles.slotBox, qty > 0 && styles.selectedSlot]}
              onPress={() => addSlot(item)}
              activeOpacity={0.8}
            >
              {/* LEFT TOP QTY */}
              {qty > 0 && (
                <View style={styles.qtyBadge}>
                  <Text style={styles.badgeText}>{qty}</Text>
                </View>
              )}

              {/* RIGHT TOP MINUS */}
              {qty > 0 && (
                <TouchableOpacity
                  style={styles.minusBadge}
                  onPress={() => removeSlot(item)}
                >
                  <Text style={styles.minusText}>−</Text>
                </TouchableOpacity>
              )}

              <Text
                style={[
                  styles.slotText,
                  qty > 0 && { color: '#fff' },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.totalText}>
        Entries: {totalSlots} | ₹{totalAmount}
      </Text>

      <TouchableOpacity style={styles.joinBtn} onPress={joinContest}>
        <Text style={styles.joinText}>CONFIRM & JOIN</Text>
      </TouchableOpacity>
    </View>
        </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  balanceText: { fontSize: 14, marginBottom: 10 },

  slotBox: {
    flex: 1,
    margin: 6,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    position: 'relative',
  },
  selectedSlot: { backgroundColor: '#4CAF50' },
  slotText: { fontWeight: '700', color: '#333' },

  qtyBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: 'green',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  minusBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  totalText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
  },

  joinBtn: {
    marginTop: 14,
    backgroundColor: '#ff9800',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  text: {    fontSize: 14,
             marginBottom: 4,
             color: '#444',
}
});
