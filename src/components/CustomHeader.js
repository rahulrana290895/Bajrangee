// src/components/CustomHeader.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';

export default function CustomHeader({ navigation }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      fetch(`${BASE_URL}get_user_balance.php?user_id=${userId}`)
        .then(res => res.json())
        .then(json => {
          if (json.status) {
            setBalance(json.balance);
          }
        })
        .catch(err => console.log(err));
    };

    fetchBalance();
  }, []);

  return (
    <View style={styles.header}>
      {/* Left: Logo + Title */}
      <View style={styles.left}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Bajrangee</Text>
      </View>

      {/* Right: Balance + Settings */}
      <View style={styles.right}>
        <Text style={styles.balance}>₹{balance}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MoreScreen')}>
          <Ionicons name="settings" size={25} color="#ffa41c" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#ffa41c' },
  right: { flexDirection: 'row', alignItems: 'center' },
  balance: { marginRight: 15, fontWeight: 'bold', fontSize: 16 },
});
