import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, ASSETS_URL } from './config/config';

export default function JoinDailyContest({ route, navigation }) {
  const { contest } = route.params;

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  const slots = Array.from({ length: contest.slot }, (_, i) => i + 1);
  const totalAmount = selectedSlots.length * contest.cost;

  // ✅ fetch balance on screen load
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
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch wallet balance');
    } finally {
      setLoadingBalance(false);
    }
  };

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const joinContest = () => {
    if (selectedSlots.length === 0) {
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
      `Slots: ${selectedSlots.join(', ')}
Total Amount: ₹${totalAmount}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => submitJoin(),
        },
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

        Alert.alert(
          'Success',
          'Contest Joined Successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedSlots([]);
                navigation.navigate('HomeScreen');
              },
            },
          ]
        );
      }
       else {
        Alert.alert('Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{contest.title}</Text>

      <Text style={styles.balanceText}>
        💼 Wallet Balance:{' '}
        {loadingBalance ? 'Loading...' : `₹${userBalance}`}
      </Text>

      <Text style={styles.text}>🏆 Prize: ₹{contest.prize}</Text>
      <Text style={styles.text}>💰 Entry Per Slot: ₹{contest.cost}</Text>

      <Text style={styles.slotTitle}>Choose Your Slots</Text>

      <FlatList
        data={slots}
        numColumns={6}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => {
          const isSelected = selectedSlots.includes(item);
          return (
            <TouchableOpacity
              style={[styles.slotBox, isSelected && styles.selectedSlot]}
              onPress={() => toggleSlot(item)}
            >
              <Text style={[styles.slotText, isSelected && { color: '#fff' }]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.totalText}>
        Selected: {selectedSlots.length} | Total: ₹{totalAmount}
      </Text>

      <TouchableOpacity style={styles.joinBtn} onPress={joinContest}>
        <Text style={styles.joinText}>CONFIRM & JOIN</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
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
  selectedSlot: {
    backgroundColor: '#4CAF50',
  },
  slotText: {
    fontWeight: '600',
    color: '#333',
  },
  totalText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
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
